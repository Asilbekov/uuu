"""
Kaggle render kernel: builds full course videos from the uuu-video-pipeline dataset.
Batch list lives in BATCH below — each kernel run processes its queue with a time budget.
"""
import json, os, subprocess, sys, time, shutil, traceback

T0 = time.time()
WORK = "/kaggle/working"
INPUT = "/kaggle/input/uuu-video-pipeline"
PIPE = f"{WORK}/pipeline"
VIDS = f"{WORK}/videos"
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
    # tlmgr in TinyTeX is too old for the TL2025 repo → run the official updater first
    pkgs = ("standalone preview amsmath amssymb doublestroke dvisvgm everysel ms setspace rsfs "
            "fundus-calligra cbfonts-fd cm-super count1to ctex fancybox fontspec jknapltx lm-math "
            "mathabx mathspec microtype multicol overpic parskip physics ranglpaper relsize "
            "tipa wasymath xcolor xetex xkeyval").split()
    r = sh(["bash", "-c",
            f"export PATH={texbin}:$PATH; "
            "wget -q https://mirror.ctan.org/systems/texlive/tlnet/update-tlmgr-latest.sh -O /tmp/up.sh && "
            "sh /tmp/up.sh -- --update > /tmp/tlmgr_up.log 2>&1; "
            f"tlmgr install {' '.join(sorted(set(pkgs)))} > /tmp/tlmgr.log 2>&1"],
           env=env, check=False, timeout=3600)
    if r.returncode != 0:
        log(f"tlmgr update+install rc={r.returncode}; trying historic TL2024 repo")
        sh(["bash", "-c",
            f"export PATH={texbin}:$PATH; "
            "tlmgr option repository https://ftp.math.utah.edu/pub/tex/historic/systems/texlive/2024/tlnet-final || true; "
            f"tlmgr install {' '.join(sorted(set(pkgs)))}"],
           env=env, check=False, timeout=3600)
    # hard proof: latex a minimal manim-style doc
    proof = r"\documentclass{standalone}\usepackage{amsmath,amssymb}\begin{document}$\lim_{x\to 0}\frac{\sin x}{x}$\end{document}"
    open("/tmp/proof.tex", "w").write(proof)
    r = sh(["bash", "-c", f"export PATH={texbin}:$PATH; cd /tmp && latex -interaction=nonstopmode proof.tex"],
           env=env, check=False, timeout=300)
    if r.returncode != 0:
        raise RuntimeError("latex proof failed: " + (r.stdout or "")[-500:])
    return texbin

def setup_pipeline():
    if os.path.exists(PIPE):
        shutil.rmtree(PIPE)
    shutil.copytree(INPUT, PIPE)
    # .py needs +x? no. ensure importable
    os.makedirs(VIDS, exist_ok=True)
    return len(os.listdir(f"{PIPE}/specs"))

# ── video build ──────────────────────────────────────────────────────
def build_video(spec_file, out_name, texbin, quality="qm", workers=4, budget_hours=11.0):
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
    # free space: drop work dir (chunks/media) but keep final
    shutil.rmtree(work, ignore_errors=True)
    return {"name": out_name, "dur_min": round(float(dur) / 60, 1), "mb": round(mb), "build_min": round((time.time() - t0) / 60)}

# ── main ─────────────────────────────────────────────────────────────
BUDGET_H = 11.5   # stop starting new videos after this

# PILOT BATCH: one video to validate the whole chain + measure timing
BATCH = [
    ("math1_w14_en.json", "Math_I_Weeks_1-4_EN"),
]

def main():
    report = {"videos": [], "log": LOG}
    texbin = None
    try:
        phase("apt", setup_apt)
        ver = phase("pip", setup_pip)
        texbin = phase("tinytex", setup_tinytex)
        n = phase("pipeline", setup_pipeline)
        log(f"pipeline ready: {n} specs")
        for spec_file, out_name in BATCH:
            elapsed_h = (time.time() - T0) / 3600
            if elapsed_h > BUDGET_H:
                log(f"budget reached ({elapsed_h:.1f}h) — deferring {out_name}")
                break
            info = build_video(spec_file, out_name, texbin)
            report["videos"].append(info)
    except Exception as e:
        report["fatal"] = str(e)[:800]
        log(f"FATAL: {e}")
    report["total_h"] = round((time.time() - T0) / 3600, 2)
    report["log"] = LOG
    with open(f"{WORK}/render_report.json", "w") as f:
        json.dump(report, f, indent=1)
    print("RENDER_KERNEL_DONE", flush=True)

main()
