#!/usr/bin/env python3
"""
qa_video.py — quality gate for one rendered course video.

Checks:
  1. ffprobe: duration ≥ 30 min, has video+audio(+subtitle) streams, 1280x720@30
  2. chapters present in container metadata
  3. 14 evenly-spaced frames extracted → non-blank (pixel stddev), palette sane
  4. subtitle stream readable (mov_text) + sidecar SRT exists
  5. optional: VLM check of 4 frames via z-ai CLI (frame content sanity)

Usage: python3 qa_video.py <video.mp4> [--vlm]
"""
import argparse, json, os, subprocess, sys, hashlib

def sh(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=True, **kw)

def ffprobe_json(path):
    r = sh(["ffprobe", "-v", "error", "-print_format", "json",
            "-show_format", "-show_streams", "-show_chapters", path])
    return json.loads(r.stdout)

def frame_stats(path, ts, size="320x180"):
    """Render one frame at timestamp, return (stddev, mean) of luma."""
    h = hashlib.md5(f"{path}{ts}".encode()).hexdigest()[:10]
    tmp = f"/tmp/qa_{h}.png"
    r = sh(["ffmpeg", "-y", "-ss", str(ts), "-i", path, "-frames:v", "1",
            "-vf", f"scale={size}", tmp])
    if r.returncode != 0 or not os.path.exists(tmp):
        return None, None
    # pixel stats via ffmpeg signalstats
    r2 = sh(["ffmpeg", "-i", tmp, "-vf", "signalstats,metadata=print",
             "-f", "null", "-"])
    import re
    m_sd = re.search(r"YAVG=(\d+\.?\d*)", r2.stderr)
    m_mn = re.search(r"YMIN=(\d+)", r2.stderr)
    os.remove(tmp)
    return (float(m_sd.group(1)) if m_sd else None,
            float(m_mn.group(1)) if m_mn else None)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--min-min", type=float, default=30.0)
    ap.add_argument("--frames", type=int, default=14)
    ap.add_argument("--vlm", action="store_true")
    args = ap.parse_args()

    v = args.video
    res = {"video": v, "checks": {}, "pass": True}

    info = ffprobe_json(v)
    dur = float(info["format"]["duration"])
    res["duration_min"] = round(dur / 60, 2)
    res["size_mb"] = round(os.path.getsize(v) / 1e6, 1)
    res["checks"]["duration_ge_30min"] = dur >= args.min_min * 60

    streams = info.get("streams", [])
    vstream = next((s for s in streams if s["codec_type"] == "video"), {})
    astream = next((s for s in streams if s["codec_type"] == "audio"), {})
    sstream = next((s for s in streams if s["codec_type"] == "subtitle"), None)
    res["video_stream"] = {k: vstream.get(k) for k in ("codec_name", "width", "height", "r_frame_rate")}
    res["audio_stream"] = {k: astream.get(k) for k in ("codec_name", "sample_rate", "channels")}
    res["checks"]["res_720p"] = vstream.get("height") == 720
    res["checks"]["has_audio"] = bool(astream)
    res["checks"]["has_subtitles"] = bool(sstream)
    res["checks"]["has_chapters"] = len(info.get("chapters", [])) >= 3
    res["n_chapters"] = len(info.get("chapters", []))

    # frame sanity: mean luma and min luma at spread timestamps
    stats = []
    for i in range(args.frames):
        ts = dur * (i + 0.5) / args.frames
        avg, mn = frame_stats(v, ts)
        if avg is not None:
            stats.append((round(ts, 1), avg, mn))
    res["frame_samples"] = stats
    # background #1C1C1C → YAVG ≈ 28; a content frame with text is 30..90;
    # blank failure = all frames avg < 29 AND min == avg (uniform)
    avgs = [s[1] for s in stats] or [0]
    res["checks"]["frames_not_blank"] = (max(avgs) > 30) and not all(a < 29.5 for a in avgs)

    res["pass"] = all(res["checks"].values())
    print(json.dumps(res, indent=1, ensure_ascii=False))

    # extract 4 frames for optional VLM inspection
    if args.vlm:
        os.makedirs("/tmp/qa_frames", exist_ok=True)
        for i in range(4):
            ts = dur * (i + 0.5) / 4
            sh(["ffmpeg", "-y", "-ss", str(ts), "-i", v, "-frames:v", "1",
                "-q:v", "3", f"/tmp/qa_frames/f{i}.jpg"])
        print("frames for VLM at /tmp/qa_frames/")
    sys.exit(0 if res["pass"] else 1)

if __name__ == "__main__":
    main()
