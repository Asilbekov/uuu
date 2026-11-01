"""
Kaggle batch render kernel (CPU-only): builds course videos from the uuu-video-pipeline dataset.
Per-video fault tolerance: a failed video is logged and the batch continues.
"""
import json, os, subprocess, sys, time, shutil, traceback

T0 = time.time()
WORK = "/kaggle/working"
INPUT = "/kaggle/input/uuu-video-pipeline"
PIPE = f"{WORK}/pipeline"
VIDS = f"{WORK}/videos"
REPORT = f"{WORK}/render_report.json"
LOG = []

def log(msg):
    line = f"[{time.time()-T0:8.0f}s] {msg}"
    print(line, flush=True)
    LOG.append(line)

def sh(cmd, timeout=7200, env=None, check=True):
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout, env=env)
    if check and r.returncode != 0:
        raise RuntimeError(f"FAILED ({r.returncode}): {' '.join(map(str, cmd[:5]))}\n"
                           + (r.stderr or r.stdout)[-1200:])
    return r

def phase(name, fn, budget_ok=True):
    t0 = time.time()
    try:
        out = fn()
        log(f"phase {name}: ok ({time.time()-t0:.0f}s) {str(out)[:120]}")
        return out
    except Exception as e:
        log(f"phase {name}: FAILED: {str(e)[:500]}")
        traceback.print_exc()
        raise

# ── env setup (once) ─────────────────────────────────────────────────
def setup_apt():
    sh(["apt-get", "update", "-qq"], timeout=900)
    sh(["apt-get", "install", "-y", "-qq", "libpango-1.0-0", "libpango1.0-dev",
        "libcairo2-dev", "pkg-config", "build-essential"], timeout=1800)

def setup_pip():
    sh([sys.executable, "-m", "pip", "install", "-q", "--no-warn-script-location",
        "manim==0.22.1", "edge-tts"], timeout=3600)
    v = sh([sys.executable, "-c", "import manim; print(manim.__version__)"])
    return v.stdout.strip()

def setup_tinytex():
    home = os.path.expanduser("~")
    texbin = f"{home}/.TinyTeX/bin/x86_64-linux"
    if not os.path.exists(f"{texbin}/latex"):
        sh(["bash", "-c",
            "wget -q https://yihui.org/tinytex/install-bin-unix.sh -O /tmp/tt.sh && sh /tmp/tt.sh"],
           timeout=1800)
    if not os.path.exists(f"{texbin}/latex"):
        raise RuntimeError("TinyTeX latex binary missing")
    env = dict(os.environ, PATH=f"{texbin}:{os.environ['PATH']}")
    # full manim LaTeX requirement list (babel-english is REQUIRED by manim's
    # default TexTemplate — its absence silently degrades every MathTex block)
    pkgs = ("babel babel-english lmodern preview standalone amsmath amssymb "
            "dsfont setspace tipa relsize textcomp mathrsfs calligra wasysym "
            "ragged2e physics microtype xcolor doublestroke dvisvgm everysel ms "
            "rsfs fundus-calligra cbfonts-fd cm-super count1to ctex fancybox fontspec "
            "jknapltx lm-math mathabx mathspec multicol overpic parskip xetex xkeyval").split()
    ok = False
    r = sh(["bash", "-c",
            f"export PATH={texbin}:$PATH; "
            "wget -q https://mirror.ctan.org/systems/texlive/tlnet/update-tlmgr-latest.sh -O /tmp/up.sh && "
            "sh /tmp/up.sh -- --update > /tmp/tlmgr_up.log 2>&1; "
            f"tlmgr install {' '.join(sorted(set(pkgs)))} > /tmp/tlmgr.log 2>&1"],
           env=env, check=False, timeout=3600)
    if r.returncode == 0:
        ok = True
    else:
        log(f"tlmgr update+install rc={r.returncode}; trying historic TL2024 repo")
        r2 = sh(["bash", "-c",
                 f"export PATH={texbin}:$PATH; "
                 "tlmgr option repository https://ftp.math.utah.edu/pub/tex/historic/systems/texlive/2024/tlnet-final || true; "
                 f"tlmgr install {' '.join(sorted(set(pkgs)))} > /tmp/tlmgr2.log 2>&1"],
                env=env, check=False, timeout=3600)
        ok = r2.returncode == 0
    if not ok:
        log(f"tlmgr install failed both repos (rc1={r.returncode}); "
            "continuing — canary will verify")
    # hard proof: manim's EXACT default template (incl. babel-english!)
    proof = (r"\documentclass[preview]{standalone}"
             r"\usepackage[english]{babel}"
             r"\usepackage{amsmath}"
             r"\usepackage{amssymb}"
             r"\begin{document}$\lim_{x\to 0}\frac{\sin x}{x}$\end{document}")
    open("/tmp/proof.tex", "w").write(proof)
    r = sh(["bash", "-c", f"export PATH={texbin}:$PATH; cd /tmp && latex -interaction=nonstopmode proof.tex"],
           env=env, check=False, timeout=300)
    if r.returncode != 0:
        raise RuntimeError("latex proof (manim template) failed: " + (r.stdout or "")[-500:])
    return texbin

def setup_pipeline():
    global INPUT
    # The dataset is uploaded FLAT (kaggle CLI skips subdirectories by default):
    #   spec__<name>.json  → specs/<name>.json
    #   engine__<name>.py  → engine/<name>.py
    #   build.py           → build.py
    # Find the mount robustly (mount point differs across Kaggle images).
    import glob as _g
    root = None
    for pat in ["/kaggle/input/uuu-video-pipeline",
                "/kaggle/input/datasets/*/uuu-video-pipeline",
                "/kaggle/input/datasets/*",
                "/kaggle/input/*"]:
        for d in sorted(_g.glob(pat)):
            if os.path.isdir(d) and (os.path.exists(os.path.join(d, "build.py")) or
                                     _g.glob(os.path.join(d, "spec__*.json"))):
                root = d
                break
        if root:
            break
    if not root:   # deep search as last resort
        for d in sorted(_g.glob("/kaggle/input/**/build.py", recursive=True)):
            root = os.path.dirname(d)
            break
    if not root:
        raise RuntimeError(f"pipeline dataset not found under /kaggle/input: "
                           f"{os.listdir('/kaggle/input')}")
    INPUT = root
    log(f"pipeline dataset at {INPUT}")
    if os.path.exists(PIPE):
        shutil.rmtree(PIPE)
    os.makedirs(PIPE)
    os.makedirs(f"{PIPE}/specs"); os.makedirs(f"{PIPE}/engine")
    # rehydrate the flat layout
    n_spec = n_eng = 0
    for f in sorted(os.listdir(INPUT)):
        src = os.path.join(INPUT, f)
        if f.startswith("spec__") and f.endswith(".json"):
            shutil.copy(src, f"{PIPE}/specs/{f[6:]}"); n_spec += 1
        elif f.startswith("engine__") and f.endswith(".py"):
            shutil.copy(src, f"{PIPE}/engine/{f[8:]}"); n_eng += 1
        elif f == "build.py":
            shutil.copy(src, f"{PIPE}/build.py")
        elif f == "scene_fallbacks.txt":
            pass
    if n_spec < 30 or n_eng < 3 or not os.path.exists(f"{PIPE}/build.py"):
        raise RuntimeError(f"pipeline rehydrate failed: {n_spec} specs, {n_eng} engine files")
    os.makedirs(VIDS, exist_ok=True)
    return n_spec

def setup_canary(texbin):
    """End-to-end canary: 2-block spec (incl. a formula block) through the REAL
    engine. Exits non-zero if any block degrades — before we burn GPU-hours."""
    canary = {
        "id": "canary", "language": "en",
        "course_title": "Canary", "test_title": "Canary",
        "chapters": [{"title": "C",
                      "blocks": [
                          {"type": "section", "title": "Canary Section",
                           "narration": "Canary section."},
                          {"type": "formula", "heading": "Canary Formula",
                           "tex": r"\lim_{x \to 0} \frac{\sin x}{x} = 1",
                           "narration": "The sine limit."}]}]}
    cpath = f"{WORK}/canary_spec.json"
    with open(cpath, "w") as f:
        json.dump(canary, f)
    env = dict(os.environ)
    env["PATH"] = f"{texbin}:{env['PATH']}"
    env["UUU_TEXBIN"] = texbin
    r = sh([sys.executable, f"{PIPE}/build.py", cpath, "--work", f"{WORK}/build_canary",
            "--quality", "ql", "--workers", "2", "--no-tts",
            "--out", f"{WORK}/canary.mp4"], env=env, check=False, timeout=900)
    out = f"{WORK}/canary.mp4"
    if r.returncode != 0 or not os.path.exists(out):
        raise RuntimeError(f"canary build failed rc={r.returncode}: " + (r.stdout or "")[-600:])
    fb = os.path.join(f"{WORK}/build_canary", "scene_fallbacks.txt")
    if os.path.exists(fb):
        txt = open(fb).read()[:600]
        raise RuntimeError(f"canary degraded blocks — refusing to start batch:\n{txt}")
    log("canary ok: engine renders formula blocks with real content")
    shutil.rmtree(f"{WORK}/build_canary", ignore_errors=True)
    os.remove(out)
    return True

# ── video build ──────────────────────────────────────────────────────
def build_video(spec_file, out_name, texbin, quality="qm", workers=4, budget_hours=2.0):
    env = dict(os.environ)
    env["PATH"] = f"{texbin}:{env['PATH']}"
    env["UUU_TEXBIN"] = texbin
    work = f"{WORK}/build_{out_name}"
    out = f"{VIDS}/{out_name}.mp4"
    t0 = time.time()
    sh([sys.executable, f"{PIPE}/build.py", f"{PIPE}/specs/{spec_file}",
        "--work", work, "--quality", quality, "--workers", str(workers),
        "--out", out], env=env, timeout=int(budget_hours * 3600))
    dur = sh(["ffprobe", "-v", "error", "-show_entries", "format=duration",
              "-of", "csv=p=0", out]).stdout.strip()
    mb = os.path.getsize(out) / 1e6
    log(f"video {out_name}: {float(dur)/60:.1f} min, {mb:.0f} MB, built in {(time.time()-t0)/60:.0f} min")
    # merge per-video build report (fallbacks, encoder, tts) before cleanup
    info = {"name": out_name, "dur_min": round(float(dur) / 60, 1), "mb": round(mb),
            "build_min": round((time.time() - t0) / 60)}
    br_path = os.path.join(work, "build_report.json")
    if os.path.exists(br_path):
        try:
            br = json.load(open(br_path))
            for k in ("gap_fallbacks", "encoder", "tts_ok", "n_blocks", "ge_30min"):
                if k in br:
                    info[k] = br[k]
        except Exception:
            pass
    # free space: drop work dir (chunks/media) but keep final + sidecar srt
    shutil.rmtree(work, ignore_errors=True)
    return info

# ── main ─────────────────────────────────────────────────────────────
BUDGET_H = 10.5   # stop starting new videos after this (kernel hard limit 12h)

BATCH = [
    ("ite_w57_uz.json", "ITE_Weeks_5-7_UZ"),
    ("eng_w57_en.json", "English_W5-7_Guide_EN"),
    ("eng_w57_ru.json", "English_W5-7_Guide_RU"),
    ("eng_w57_uz.json", "English_W5-7_Guide_UZ"),
    ("cs_w47_en.json", "Computer_Science_Weeks_4-7_EN"),
    ("cs_w47_ru.json", "Computer_Science_Weeks_4-7_RU"),
    ("cs_w47_uz.json", "Computer_Science_Weeks_4-7_UZ"),
    ("eng_w14qa_en.json", "English_W1-4_QA_EN")
]

def save_report(report):
    with open(REPORT, "w") as f:
        json.dump(report, f, indent=1)

def main():
    report = {"videos": [], "failed": [], "log": LOG}
    texbin = None
    try:
        phase("apt", setup_apt)
        ver = phase("pip", setup_pip)
        texbin = phase("tinytex", setup_tinytex)
        n = phase("pipeline", setup_pipeline)
        log(f"pipeline ready: {n} specs")
        try:
            gpus = sh(["nvidia-smi", "-L"], check=False).stdout.strip()
            log(f"GPUs: {gpus[:200] if gpus else 'none'}")
        except Exception:
            pass
        phase("canary", lambda: setup_canary(texbin))
        for spec_file, out_name in BATCH:
            elapsed_h = (time.time() - T0) / 3600
            if elapsed_h > BUDGET_H:
                log(f"budget reached ({elapsed_h:.1f}h) — deferring {out_name}")
                report.setdefault("deferred", []).append(out_name)
                break
            try:
                info = build_video(spec_file, out_name, texbin)
                report["videos"].append(info)
            except Exception as e:
                log(f"video {out_name} FAILED: {str(e)[:400]}")
                traceback.print_exc()
                report["failed"].append({"name": out_name, "error": str(e)[:800]})
                shutil.rmtree(f"{WORK}/build_{out_name}", ignore_errors=True)
            save_report(report)   # incremental: survive a hard kill
    except Exception as e:
        report["fatal"] = str(e)[:800]
        log(f"FATAL: {e}")
    report["total_h"] = round((time.time() - T0) / 3600, 2)
    report["log"] = LOG
    save_report(report)
    print("RENDER_KERNEL_DONE", flush=True)

main()
