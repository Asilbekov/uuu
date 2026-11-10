#!/usr/bin/env python3
"""Package a flat Kaggle dataset and optionally publish dataset + kernel.

Usage:
  KAGGLE_API_TOKEN=... python3 package_kaggle.py --push
The token is read by Kaggle CLI from the environment and is never written.
"""
import argparse
import json
from pathlib import Path
import shutil
import subprocess
import time

HERE = Path(__file__).resolve().parent
DS = HERE / "kaggle/ds"


def run(*args):
    subprocess.run(args, cwd=HERE, check=True)


def package():
    if DS.exists():
        shutil.rmtree(DS)
    DS.mkdir(parents=True)
    files = [HERE / "render_video.py", HERE / "content/math1_w14_ru.json"]
    files += [p for p in (HERE / "engine").rglob("*") if p.is_file() and "__pycache__" not in str(p)]
    for source in files:
        relative = source.relative_to(HERE)
        target = DS / str(relative).replace("/", "__")
        shutil.copyfile(source, target)
    metadata = {
        "title": "uuu Video Pipeline v3",
        "id": "freedomform/uuu-video-pipeline-v3",
        "licenses": [{"name": "other"}],
    }
    (DS / "dataset-metadata.json").write_text(json.dumps(metadata, indent=2))
    print(f"Packaged {len(files)} files, {sum(p.stat().st_size for p in DS.iterdir())/1e6:.1f} MB")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--push", action="store_true")
    args = parser.parse_args()
    package()
    if args.push:
        # Never attach a kernel while a new dataset version is still processing.
        exists = subprocess.run(
            ["kaggle", "datasets", "status", "freedomform/uuu-video-pipeline-v3"],
            cwd=HERE, capture_output=True,
        ).returncode == 0
        if exists:
            run("kaggle", "datasets", "version", "-p", str(DS), "-m", "Studio v3 masterclass update")
        else:
            run("kaggle", "datasets", "create", "-p", str(DS))
        for _ in range(60):
            status = subprocess.run(
                ["kaggle", "datasets", "status", "freedomform/uuu-video-pipeline-v3"],
                cwd=HERE, capture_output=True, text=True, check=True,
            ).stdout.strip().lower()
            if status == "ready":
                break
            time.sleep(2)
        else:
            raise RuntimeError("Dataset did not become ready within 120 seconds")
        run("kaggle", "kernels", "push", "-p", str(HERE / "kaggle"))


if __name__ == "__main__":
    main()
