#!/usr/bin/env python3
"""qa_frames_ocr.py <video.mp4> <N> — visual QA of a rendered v2 video.
Samples N frames uniformly, checks:
  1. no blank frames (near-uniform images)
  2. >60% distinct frames (content variety)
  3. OCR spot-check: NO raw LaTeX on screen (\frac, \sqrt, $...$ with backslash)
Prints PASS/FAIL verdict.
"""
import re, subprocess, sys, os, tempfile
import numpy as np
from PIL import Image

V, N = sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 30
dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                            '-of', 'csv=p=0', V], capture_output=True, text=True).stdout.strip())
print(f'duration: {dur:.0f}s ({dur/60:.0f} min)')

raw_re = re.compile(r'\\(frac|sqrt|sum|int|cdot|times|left|right|begin|end|text|mathbb|alpha|beta|gamma|pi|mu|leq|geq|neq|approx|infty)\b')
dollar_latex_re = re.compile(r'\$[^$]*\\[a-zA-Z]+[^$]*\$')

tmpd = tempfile.mkdtemp(prefix='qafr_')
hashes, blanks, issues = [], 0, []
times = [dur * (i + 0.5) / N for i in range(N)]
for i, t in enumerate(times):
    out = os.path.join(tmpd, f'f{i:02d}.jpg')
    try:
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-ss', f'{t:.1f}', '-i', V,
                        '-frames:v', '1', '-q:v', '3', out], timeout=120, check=True)
    except Exception:
        continue
    im = Image.open(out).convert('L')
    a = np.asarray(im, dtype=np.float32) / 255.0
    # blank check: near-uniform frame
    if a.std() < 0.02:
        blanks += 1
        issues.append(f'blank frame at {t:.0f}s')
        continue
    # distinctness: coarse perceptual hash
    small = np.asarray(im.resize((16, 16)), dtype=np.float32)
    h = (small > small.mean()).tobytes()
    hashes.append(h)
    # OCR raw-LaTeX spot check
    txt = subprocess.run(['tesseract', out, '-', '--psm', '6'],
                         capture_output=True, text=True).stdout
    for line in txt.splitlines():
        if raw_re.search(line) or dollar_latex_re.search(line):
            issues.append(f'raw LaTeX at {t:.0f}s: {line.strip()[:70]}')
            break

distinct = len(set(hashes)) / len(hashes) * 100 if hashes else 0
print(f'frames checked: {len(hashes)+blanks}/{N} | blank: {blanks} | distinct: {distinct:.0f}% | ocr issues: {len([i for i in issues if "raw LaTeX" in i])}')
for e in issues[:8]:
    print('  -', e)
ok = blanks == 0 and distinct > 60 and not any('raw LaTeX' in e for e in issues)
print('VERDICT:', 'PASS ✅' if ok else 'FAIL ❌')
sys.exit(0 if ok else 1)
