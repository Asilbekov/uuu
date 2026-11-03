#!/usr/bin/env python3
"""qa_video.py — программный QA отрендеренного видео (без VLM):
  1. Кадры: не пустые, разнообразие (нет зависшего кадра-заглушки)
  2. Аудио: RMS по окнам — нет длинных мёртвых зон, речь присутствует
  3. Субтитры: покрытие длительности
Usage: qa_video.py <video.mp4> [srt]
"""
import subprocess, sys, os, tempfile
from PIL import Image
import numpy as np

V = sys.argv[1]
SRT = sys.argv[2] if len(sys.argv) > 2 else None

def probe(args):
    r = subprocess.run(args, capture_output=True, text=True, timeout=600)
    return r.stdout

dur = float(probe(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                   '-of', 'csv=p=0', V]).strip())
print(f'duration: {dur:.0f}s ({dur/60:.1f} min)')

issues = []
N = 30
hashes, contents = [], []
with tempfile.TemporaryDirectory() as td:
    times = [dur * (i + 0.5) / N for i in range(N)]
    for i, t in enumerate(times):
        out = os.path.join(td, f'{i}.jpg')
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-ss', str(t), '-i', V,
                        '-frames:v', '1', '-q:v', '4', out], timeout=120)
        im = np.asarray(Image.open(out).convert('L').resize((320, 180)))
        nonwhite = float((im < 235).mean())
        ink = float((im < 128).mean())
        contents.append((nonwhite, ink))
        hashes.append(im[::4, ::4].tobytes())
    diffs = [float((np.frombuffer(a, np.uint8) != np.frombuffer(b, np.uint8)).mean())
             for a, b in zip(hashes, hashes[1:])]
    uniq = sum(1 for d in diffs if d > 0.01)
    blank = sum(1 for nw, _ in contents if nw < 0.02)
    pale = sum(1 for _, ik in contents if ik < 0.005)
print(f'frames: {N} sampled | distinct transitions {uniq}/{N-1} | blank {blank} | no-ink {pale}')
if blank: issues.append(f'{blank} blank frames')
if uniq < (N - 1) * 0.6: issues.append(f'low frame variety ({uniq}/{N-1}) — possible frozen screen')

raw = subprocess.run(['ffmpeg', '-v', 'error', '-vn', '-i', V, '-ac', '1', '-ar', '8000',
                      '-f', 's16le', '-'], capture_output=True, timeout=3600).stdout
x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
win = 8000 * 60
rms = [float(np.sqrt((x[i:i+win]**2).mean())) for i in range(0, len(x) - win + 1, win)]
dead = sum(1 for r in rms if r < 0.003)
loud = [r for r in rms if r > 0.5]
print(f'audio: {len(rms)} min-windows | median RMS {np.median(rms):.3f} | dead(<0.003) {dead} | clipped(>0.5) {len(loud)}')
if dead > 3: issues.append(f'{dead} minutes of near-silence')
if np.median(rms) < 0.01: issues.append('audio too quiet overall')

if SRT and os.path.exists(SRT):
    txt = open(SRT, encoding='utf-8').read().splitlines()
    cues = [l for l in txt if '-->' in l]
    def ts(s):
        h, m, rest = s.split(':')
        return int(h)*3600 + int(m)*60 + float(rest.replace(',', '.'))
    if cues:
        last_end = max(ts(c.split('-->')[1].strip()) for c in cues)
        cover = last_end / dur * 100
        words = sum(len(l.split()) for l in txt if l and not l.isdigit() and '-->' not in l)
        print(f'srt: {len(cues)} cues | ends {last_end:.0f}s ({cover:.0f}% of video) | {words} words')
        if cover < 90: issues.append(f'subtitles cover only {cover:.0f}%')

print('\nVERDICT:', 'PASS ✅' if not issues else 'ISSUES: ' + '; '.join(issues))
