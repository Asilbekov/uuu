#!/usr/bin/env python3
"""qa_frames.py <video.mp4> <spec.json> <srt> — визуальный QA:
  1. 30 кадров по длине: не пустые, разнообразные
  2. OCR-спот-чек формульных/example-кадров: на экране НЕ должно быть
     сырого LaTeX (\frac, \sqrt, $...$ с бэкслэшами) — цель KaTeX-фикса
"""
import json, re, subprocess, sys, os, tempfile
import numpy as np
from PIL import Image

V, SPEC_PATH, SRT = sys.argv[1], sys.argv[2], sys.argv[3]
issues = []

dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                            '-of', 'csv=p=0', V], capture_output=True, text=True).stdout.strip())
print(f'duration: {dur:.0f}s ({dur/60:.0f} min)')

# ── 1. кадры ──
N = 30
hashes = []
with tempfile.TemporaryDirectory() as td:
    for i in range(N):
        t = dur * (i + 0.5) / N
        out = os.path.join(td, f'{i}.jpg')
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-ss', str(t), '-i', V,
                        '-frames:v', '1', '-q:v', '4', out], timeout=120)
        im = np.asarray(Image.open(out).convert('L').resize((320, 180)))
        hashes.append(im[::4, ::4].tobytes())
        if i == 0:
            pass
    nw = [float((np.frombuffer(h, np.uint8) < 235).mean()) for h in hashes]
    diffs = [float((np.frombuffer(a, np.uint8) != np.frombuffer(b, np.uint8)).mean())
             for a, b in zip(hashes, hashes[1:])]
uniq = sum(1 for d in diffs if d > 0.01)
blank = sum(1 for x in nw if x < 0.02)
print(f'frames: {N} sampled | distinct {uniq}/{N-1} | blank {blank}')
if blank: issues.append(f'{blank} blank frames')
if uniq < (N - 1) * 0.6: issues.append(f'low variety {uniq}/{N-1}')

# ── 2. OCR-контроль: example/formula/concept/table блоки ──
spec = json.load(open(SPEC_PATH))
blocks = [b for ch in spec['chapters'] for b in ch['blocks']]
cues = re.findall(r'(\d+)\s*\n(\S+) --> (\S+)', open(SRT, encoding='utf-8').read())
def ts(x):
    h, m, rest = x.split(':'); return int(h) * 3600 + int(m) * 60 + float(rest.replace(',', '.'))
targets = [i for i, b in enumerate(blocks)
           if b['type'] in ('formula', 'example', 'table')][:14]
raw_re = re.compile(r'\\(?:frac|sqrt|begin|overline|lim|sum|cdot|times|mathbb|text)\b')
dollar_re = re.compile(r'\$[^$\s][^$]{0,60}\$')
checked = 0
with tempfile.TemporaryDirectory() as td:
    for i in targets:
        if i >= len(cues): continue
        start, end = ts(cues[i][1]), ts(cues[i][2])
        t = start + (end - start) * 0.6
        out = os.path.join(td, 'f.jpg')
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-ss', str(t), '-i', V,
                        '-frames:v', '1', '-q:v', '3', out], timeout=120)
        txt = subprocess.run(['tesseract', out, '-', '--psm', '6'],
                             capture_output=True, text=True).stdout
        checked += 1
        for line in txt.splitlines():
            if raw_re.search(line):
                issues.append(f'block {i} ({blocks[i]["type"]}): raw LaTeX: {line.strip()[:70]}')
                break
            if dollar_re.search(line):
                issues.append(f'block {i} ({blocks[i]["type"]}): raw $...$: {line.strip()[:70]}')
                break
print(f'ocr: {checked} blocks checked (formula/example/table)')
print('VERDICT:', 'PASS ✅' if not issues else 'FAIL ❌: ' + '; '.join(issues[:5]))
