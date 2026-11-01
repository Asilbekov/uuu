#!/usr/bin/env python3
"""
build.py — assemble one full course video from a spec JSON.

Pipeline:
  1. TTS narration per block (edge-tts, 4 concurrent, retries; silence fallback)
  2. manifest.json with exact per-block target runtimes (audio + padding)
  3. generated scene file (one manim Scene class per block)
  4. parallel chunk rendering (N manim processes, resumable)
  5. audio padded to each chunk's real frame-quantized duration (zero drift)
  6. concat video + audio, mux with SRT subtitles + FFMETADATA chapters

Usage:
  python3 build.py specs/math1_w14_en.json --work /tmp/build --quality qm \
      [--workers 4] [--no-tts] [--force] [--subtitle-only]
"""
import argparse, asyncio, json, math, os, re, shutil, subprocess, sys, time
import xml.etree.ElementTree as ET

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

WPM = 150.0          # narration pace used for silence fallback estimation
LANG_META = {
    "en": {"voice": "en-US-AndrewMultilingualNeural", "iso": "eng"},
    "ru": {"voice": "ru-RU-DmitryNeural", "iso": "rus"},
    "uz": {"voice": "uz-UZ-SardorNeural", "iso": "uzb"},
}

def sh(cmd, timeout=7200, env=None, cwd=None, check=True, capture=True):
    r = subprocess.run(cmd, capture_output=capture, text=True, timeout=timeout,
                       env=env, cwd=cwd)
    if check and r.returncode != 0:
        err = (r.stderr or r.stdout or "")[-1500:]
        raise RuntimeError(f"cmd failed ({r.returncode}): {' '.join(map(str, cmd[:6]))}…\n{err}")
    return r

def ffprobe_dur(path):
    r = sh(["ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "csv=p=0", path])
    return float(r.stdout.strip())

# ---------------------------------------------------------------- blocks
def tex_bins():
    """All candidate TinyTeX bin dirs (sandbox + Kaggle + explicit override)."""
    cands = [os.environ.get("UUU_TEXBIN"),
             os.path.expanduser("~/.TinyTeX/bin/x86_64-linux"),
             "/home/z/my-project/.TinyTeX/bin/x86_64-linux",
             "/root/.TinyTeX/bin/x86_64-linux",
             "/kaggle/.TinyTeX/bin/x86_64-linux"]
    return [c for c in cands if c and os.path.exists(os.path.join(c, "latex"))]
def spec_blocks(spec):
    """Flatten spec into ordered blocks with chapter numbers."""
    out = []
    ch = 0
    for chapter in spec.get("chapters", []):
        ch += 1
        for b in chapter.get("blocks", []):
            out.append((ch, b))
    return out

# ---------------------------------------------------------------- TTS
async def tts_one(voice, text, out_mp3, sem):
    import edge_tts
    async with sem:
        for attempt in range(4):
            try:
                await edge_tts.Communicate(text, voice).save(out_mp3)
                if os.path.getsize(out_mp3) > 1000:
                    return True
            except Exception as e:
                await asyncio.sleep(1.5 * (attempt + 1))
        return False

def gen_tts(work, spec, blocks, force=False):
    audir = os.path.join(work, "audio"); os.makedirs(audir, exist_ok=True)
    lang = spec.get("language", "en")
    voice = LANG_META[lang]["voice"]
    sem = asyncio.Semaphore(4)
    jobs = []
    for i, (ch, b) in enumerate(blocks):
        mp3 = os.path.join(audir, f"{i:04d}.mp3")
        if (not force) and os.path.exists(mp3) and os.path.getsize(mp3) > 1000:
            continue
        text = str(b.get("narration", "")).strip()
        if not text:
            continue
        jobs.append(tts_one(voice, text, mp3, sem))
    if not jobs:
        return
    print(f"[tts] {len(jobs)} blocks to synthesize (voice {voice})", flush=True)
    t0 = time.time()
    async def _run():
        return await asyncio.gather(*jobs)
    results = asyncio.run(_run())
    ok = sum(1 for r in results if r)
    print(f"[tts] {ok}/{len(jobs)} ok in {time.time()-t0:.0f}s", flush=True)

def silence(path, seconds):
    sh(["ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
        "-t", f"{seconds:.3f}", "-c:a", "libmp3lame", "-q:a", "5", path])

# ---------------------------------------------------------------- manifest
def build_manifest(work, spec_path, spec, blocks, no_tts=False):
    mpath = os.path.join(work, "manifest.json")
    entries = []
    for i, (ch, b) in enumerate(blocks):
        mp3 = os.path.join(work, "audio", f"{i:04d}.mp3")
        text = str(b.get("narration", "")).strip()
        if os.path.exists(mp3) and os.path.getsize(mp3) > 1000:
            dur = ffprobe_dur(mp3)
        elif no_tts or not text:
            dur = 0.0
            if text:
                dur = 60.0 * len(text.split()) / WPM
                mp3 = None
        else:
            dur = 60.0 * len(text.split()) / WPM
            mp3 = None
        t = b.get("type")
        lead = 0.35
        tail = 0.75
        if t == "title":
            lead, tail = 0.5, 1.6
        elif t == "section":
            lead, tail = 0.45, 1.2
        elif t == "outro":
            lead, tail = 0.45, 2.0
        target = lead + dur + tail
        entries.append({
            "idx": i, "chapter": ch, "b": b, "audio": mp3,
            "audio_dur": round(dur, 3), "target": round(max(target, 3.5), 3),
        })
    man = {
        "spec_path": os.path.abspath(spec_path),
        "spec_id": spec.get("id"), "language": spec.get("language", "en"),
        "n_chapters": len(spec.get("chapters", [])),
        "blocks": entries,
        "titles": [c.get("title", "") for c in spec.get("chapters", [])],
    }
    with open(mpath, "w") as f:
        json.dump(man, f, ensure_ascii=False)
    total = sum(e["target"] for e in entries)
    print(f"[manifest] {len(entries)} blocks, target total {total/60:.1f} min", flush=True)
    return man

# ---------------------------------------------------------------- scene file
def write_scene_file(work, n_blocks):
    lines = ["import os, sys",
             "sys.path.insert(0, %r)" % HERE,
             "from engine.scenes import CourseScene", ""]
    for i in range(n_blocks):
        lines.append(f"class B{i:04d}(CourseScene):")
        lines.append(f"    idx = {i}")
        lines.append("")
    path = os.path.join(work, "scenes_gen.py")
    with open(path, "w") as f:
        f.write("\n".join(lines))
    return path

# ---------------------------------------------------------------- render
def render_chunks(work, scene_file, man, quality, workers, force=False):
    chunks = os.path.join(work, "chunks"); os.makedirs(chunks, exist_ok=True)
    media = os.path.join(work, "media")
    env = dict(os.environ)
    env["UUU_BUILD_DIR"] = work
    for tb in tex_bins():
        env["PATH"] = tb + ":" + env.get("PATH", "")
    py = sys.executable

    todo = []
    for e in man["blocks"]:
        out = os.path.join(chunks, f"{e['idx']:04d}.mp4")
        if force or not os.path.exists(out) or os.path.getsize(out) < 2000:
            todo.append((e["idx"], out))
    print(f"[render] {len(todo)} chunks to render (quality {quality}, {workers} workers)", flush=True)

    from concurrent.futures import ThreadPoolExecutor
    import glob as _glob
    t0 = time.time()
    done_ct = 0
    def render_one(item):
        nonlocal done_ct
        idx, out = item
        cls = f"B{idx:04d}"
        try:
            sh([py, "-m", "manim", quality, "--disable_caching",
                "--media_dir", media, scene_file, cls, "-o", f"chunk_{cls}",
                "--format", "mp4"], env=env, timeout=3000)
            stem = os.path.splitext(os.path.basename(scene_file))[0]
            cands = [
                os.path.join(media, "videos", stem, quality_map(quality), f"chunk_{cls}.mp4"),
                os.path.join(media, "videos", os.path.basename(scene_file), quality_map(quality), f"chunk_{cls}.mp4"),
            ] + _glob.glob(os.path.join(media, "videos", "**", f"chunk_{cls}.mp4"), recursive=True)
            produced = next((c for c in cands if os.path.exists(c) and os.path.getsize(c) > 2000), None)
            if produced:
                if os.path.exists(out):
                    os.remove(out)
                shutil.move(produced, out)
            else:
                raise RuntimeError("manim produced no output file")
        except Exception as e:
            print(f"[render] chunk {idx} FAILED: {str(e)[:300]}", flush=True)
        if not os.path.exists(out) or os.path.getsize(out) < 2000:
            if os.path.exists(out):
                os.remove(out)
            make_gap(out, man["blocks"][idx]["target"], quality)
            print(f"[render] chunk {idx}: used silent gap fallback", flush=True)
        done_ct += 1
        if done_ct % 10 == 0:
            el = time.time() - t0
            print(f"[render] {done_ct}/{len(todo)} chunks, {el:.0f}s elapsed, "
                  f"~{el/done_ct*(len(todo)-done_ct):.0f}s left", flush=True)

    with ThreadPoolExecutor(max_workers=workers) as ex:
        list(ex.map(render_one, todo))
    if todo:
        print(f"[render] all done in {(time.time()-t0)/60:.1f} min", flush=True)

def quality_map(q):
    return {"-ql": "480p15", "-qm": "720p30", "-qh": "1080p60"}.get(q, q.lstrip("-"))

def make_gap(out, seconds, quality):
    """Black-grey fallback chunk when manim itself failed — keeps sync."""
    w, h, fps = {"-ql": (854, 480, 15), "-qm": (1280, 720, 30), "-qh": (1920, 1080, 60)}.get(
        quality, (1280, 720, 30))
    sh(["ffmpeg", "-y", "-f", "lavfi",
        "-i", f"color=c=0x1C1C1C:s={w}x{h}:r={fps}:d={max(seconds,0.5):.3f}",
        "-c:v", "libx264", "-preset", "veryfast", "-pix_fmt", "yuv420p", out])

# ---------------------------------------------------------------- assembly
def pad_audio(work, man, quality):
    adir = os.path.join(work, "apad"); os.makedirs(adir, exist_ok=True)
    for e in man["blocks"]:
        out = os.path.join(adir, f"{e['idx']:04d}.m4a")
        if os.path.exists(out) and os.path.getsize(out) > 500:
            continue
        chunk = os.path.join(work, "chunks", f"{e['idx']:04d}.mp4")
        vdur = ffprobe_dur(chunk)
        src = e.get("audio")
        if src and os.path.exists(src):
            sh(["ffmpeg", "-y", "-i", src, "-af", "apad", "-t", f"{vdur:.3f}",
                "-ar", "44100", "-ac", "2", "-c:a", "aac", "-b:a", "160k", out])
        else:
            sh(["ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
                "-t", f"{vdur:.3f}", "-c:a", "aac", "-b:a", "160k", out])
        e["chunk_dur"] = round(vdur, 3)

def concat_all(work, man, spec, out_mp4):
    vlist = os.path.join(work, "vlist.txt")
    alist = os.path.join(work, "alist.txt")
    with open(vlist, "w") as fv, open(alist, "w") as fa:
        for e in man["blocks"]:
            fv.write(f"file '{os.path.join(work, 'chunks', f'{e['idx']:04d}.mp4')}'\n")
            fa.write(f"file '{os.path.join(work, 'apad', f'{e['idx']:04d}.m4a')}'\n")

    srt = write_srt(work, man)
    ffmeta = write_chapters(work, man)

    tmp = os.path.join(work, "assembled_nochap.mp4")
    iso = LANG_META[spec.get("language", "en")]["iso"]
    cmd = ["ffmpeg", "-y",
           "-f", "concat", "-safe", "0", "-i", vlist,
           "-f", "concat", "-safe", "0", "-i", alist]
    if srt:
        cmd += ["-i", srt]
    cmd += ["-map", "0:v", "-map", "1:a"]
    if srt:
        cmd += ["-map", "2:s"]
    cmd += ["-c:v", "copy", "-c:a", "copy"]
    if srt:
        cmd += ["-c:s", "mov_text", "-metadata:s:s:0", f"language={iso}"]
    cmd += ["-movflags", "+faststart", tmp]
    sh(cmd)

    sh(["ffmpeg", "-y", "-i", tmp, "-i", ffmeta,
        "-map_metadata", "1", "-map_chapters", "1", "-c", "copy", out_mp4])
    os.remove(tmp)

    dur = ffprobe_dur(out_mp4)
    size = os.path.getsize(out_mp4) / 1e6
    print(f"[final] {out_mp4}: {dur/60:.1f} min, {size:.1f} MB", flush=True)
    return dur

# ---------------------------------------------------------------- subtitles
def split_sentences(text):
    text = re.sub(r"\s+", " ", text).strip()
    parts = re.split(r"(?<=[.!?;:])\s+", text)
    return [p.strip() for p in parts if p.strip()]

def split_long(s, limit=88):
    if len(s) <= limit:
        return [s]
    words = s.split()
    lines, cur = [], ""
    for w in words:
        if len(cur) + len(w) + 1 > limit and cur:
            lines.append(cur); cur = w
        else:
            cur = f"{cur} {w}".strip()
    if cur:
        lines.append(cur)
    # merge tiny tails
    if len(lines) > 1 and len(lines[-1]) < 18:
        tail = lines.pop()
        lines[-1] += " " + tail
    return lines

def fmt_ts(t):
    ms = int(round(t * 1000))
    h, rem = divmod(ms, 3600000)
    m, rem = divmod(rem, 60000)
    s, ms = divmod(rem, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

def write_srt(work, man):
    cues = []
    t = 0.0
    for e in man["blocks"]:
        dur = e.get("chunk_dur") or e["target"]
        text = str(e["b"].get("narration", "")).strip()
        if text:
            sents = []
            for s in split_sentences(text):
                sents.extend(split_long(s))
            if not sents:
                sents = [text[:80]]
            total_chars = sum(len(s) for s in sents)
            ct = t + 0.35  # lead-in
            for s in sents:
                frac = len(s) / total_chars
                sdur = max(1.2, (dur - 1.1) * frac)
                cues.append((ct, ct + min(sdur, 7.0), s))
                ct += sdur
        t += dur
    if not cues:
        return None
    path = os.path.join(work, "subs.srt")
    with open(path, "w") as f:
        for i, (a, b_, s) in enumerate(cues, 1):
            f.write(f"{i}\n{fmt_ts(a)} --> {fmt_ts(b_)}\n{s}\n\n")
    return path

def write_chapters(work, man):
    """Chapters at each section block + intro."""
    marks = []
    t = 0.0
    for e in man["blocks"]:
        if e["b"].get("type") == "title":
            marks.append((0.0, "Intro"))
        elif e["b"].get("type") == "section":
            title = e["b"].get("title", "")
            marks.append((t, f"{e['b'].get('num', '')}. {title}" if e['b'].get('num') else title))
        elif e["b"].get("type") == "outro":
            marks.append((t, "Outro"))
        t += e.get("chunk_dur") or e["target"]
    path = os.path.join(work, "chapters.txt")
    with open(path, "w") as f:
        f.write(";FFMETADATA1\n")
        for i, (ts, title) in enumerate(marks):
            end = marks[i + 1][0] if i + 1 < len(marks) else t
            f.write("[CHAPTER]\nTIMEBASE=1/1000\n")
            f.write(f"START={int(ts*1000)}\nEND={int(end*1000)}\ntitle={title}\n")
    return path

# ---------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("spec")
    ap.add_argument("--work", required=True)
    ap.add_argument("--quality", default="qm", type=lambda s: s.lstrip("-"),
                    choices=["ql", "qm", "qh"])
    ap.add_argument("--workers", type=int, default=max(1, (os.cpu_count() or 2) - 0))
    ap.add_argument("--no-tts", action="store_true", help="skip TTS (silence, est. durations)")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--out", default=None)
    args = ap.parse_args()

    spec = json.load(open(args.spec))
    os.makedirs(args.work, exist_ok=True)
    blocks = spec_blocks(spec)
    quality = "-" + args.quality

    if not args.no_tts:
        gen_tts(args.work, spec, blocks, force=args.force)
    man = build_manifest(args.work, args.spec, spec, blocks, no_tts=args.no_tts)
    scene_file = write_scene_file(args.work, len(blocks))
    render_chunks(args.work, scene_file, man, quality, args.workers, force=args.force)
    pad_audio(args.work, man, quality)
    # refresh chunk durations into manifest (needed for srt + chapters)
    for e in man["blocks"]:
        e["chunk_dur"] = ffprobe_dur(os.path.join(args.work, "chunks", f"{e['idx']:04d}.mp4"))
    out = args.out or os.path.join(args.work, "final.mp4")
    dur = concat_all(args.work, man, spec, out)
    ok = dur >= 30 * 60
    print(f"[build] {'OK ≥30min' if ok else 'UNDER 30 MIN!'} — {spec.get('id')} ({spec.get('language')})")

if __name__ == "__main__":
    main()
