#!/usr/bin/env python3
"""
build_timings.py — probe TTS audio durations → timings.json + srt data.
Each segment duration = audio_length + GAP (breathing room between beats).
timings.json: { "SceneName": [d1, d2, ...], ... }
Also writes srt_cues.json: per-scene segment texts + start/end times
(relative to scene start), for subtitle assembly.
"""
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
GAP = 0.35          # silence added after each narration segment
TAIL = 0.8          # must match TAIL_HOLD in video_lib.py


def probe(path):
    r = subprocess.run(
        ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
         "-of", "csv=p=0", path],
        capture_output=True, text=True, check=True)
    return float(r.stdout.strip())


def main():
    narr_files = sorted(f for f in os.listdir(os.path.join(HERE, "narration")) if f.endswith(".json"))
    tts_dir = os.path.join(HERE, "tts")
    timings, cues = {}, {}
    total = 0.0
    missing = []

    for nf in narr_files:
        with open(os.path.join(HERE, "narration", nf)) as f:
            scenes = json.load(f)
        for scene, segs in scenes.items():
            durs, scene_cues = [], []
            t = 0.0
            for i, text in enumerate(segs):
                wav = os.path.join(tts_dir, f"{scene}_{i + 1:02d}.wav")
                if not os.path.exists(wav):
                    missing.append(os.path.basename(wav))
                    continue
                d = probe(wav)
                durs.append(round(d + GAP, 3))
                scene_cues.append({
                    "start": round(t, 3),
                    "end": round(t + d, 3),
                    "text": text,
                })
                t += d + GAP
            timings[scene] = durs
            cues[scene] = scene_cues
            total += sum(durs) + TAIL

    with open(os.path.join(HERE, "timings.json"), "w") as f:
        json.dump(timings, f, indent=1)
    with open(os.path.join(HERE, "srt_cues.json"), "w") as f:
        json.dump(cues, f, indent=1)

    print(f"scenes: {len(timings)}; est. video length: {total / 60:.1f} min")
    if missing:
        print(f"MISSING AUDIO ({len(missing)}):", *missing[:10], file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
