#!/usr/bin/env python3
"""Kaggle CPU entry point for the complete Russian Math I masterclass."""
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time

START = time.time()
WORK = Path("/kaggle/working")
PIPE = WORK / "pipeline"
OUT = WORK / "output"


def log(message):
    print(f"[{(time.time()-START)/60:6.1f} min] {message}", flush=True)


def run(command, timeout=1800):
    log("run: " + " ".join(map(str, command[:4])))
    subprocess.run(list(map(str, command)), check=True, timeout=timeout)


def rehydrate():
    candidates = [
        Path("/kaggle/input/uuu-video-pipeline-v3"),
        Path("/kaggle/input/datasets/freedomform/uuu-video-pipeline-v3"),
    ]
    source = next((p for p in candidates if p.exists()), None)
    if source is None:
        matches = list(Path("/kaggle/input").glob("**/uuu-video-pipeline-v3"))
        source = next((p for p in matches if p.is_dir()), None)
    if source is None:
        raise RuntimeError("Dataset uuu-video-pipeline-v3 is not mounted")
    count = 0
    for item in source.iterdir():
        if not item.is_file():
            continue
        relative = item.name.replace("__", "/")
        target = PIPE / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(item, target)
        count += 1
    log(f"rehydrated {count} files")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    run([sys.executable, "-m", "pip", "install", "-q", "playwright", "edge-tts", "pillow", "numpy"])
    run([sys.executable, "-m", "playwright", "install", "chromium", "--with-deps"])
    rehydrate()
    spec = PIPE / "content/math1_w14_ru.json"
    render = PIPE / "render_video.py"
    run([
        sys.executable, render,
        "--spec", spec,
        "--out", OUT,
        "--workdir", WORK / "work/math1_w14_ru",
        "--workers", "3",
    ], timeout=10 * 3600)
    reports = list(OUT.glob("*.report.json"))
    if not reports:
        raise RuntimeError("render finished without a QA report")
    report = json.loads(reports[0].read_text())
    log(f"COMPLETE: {report}")


if __name__ == "__main__":
    main()
