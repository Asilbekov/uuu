#!/usr/bin/env python3
"""qa_audio.py <video> <duration> — декод аудио (с kill зависшего на выходе ffmpeg) + RMS"""
import subprocess, sys, os, signal
import numpy as np

V, DUR = sys.argv[1], float(sys.argv[2])
OUT = '/tmp/qa_audio.pcm'
if os.path.exists(OUT): os.remove(OUT)
p = subprocess.Popen(['ffmpeg', '-v', 'error', '-vn', '-t', str(DUR), '-i', V,
                      '-ac', '1', '-ar', '8000', '-f', 's16le', OUT],
                     stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
import time
t0 = time.time()
while time.time() - t0 < min(DUR / 100 + 60, 280):
    if p.poll() is not None: break
    if os.path.exists(OUT) and os.path.getsize(OUT) >= DUR * 16000 - 16000:
        break
    time.sleep(1)
if p.poll() is None:
    p.kill(); p.wait()
size = os.path.getsize(OUT)
dec = size / 16000
print(f'decoded {dec:.0f}s of {DUR:.0f}s')
assert dec >= DUR - 5, 'INCOMPLETE DECODE'
x = np.fromfile(OUT, np.int16).astype(np.float32) / 32768
win = 8000 * 60
rms = [float(np.sqrt((x[i:i+win]**2).mean())) for i in range(0, len(x) - win + 1, win)]
med = float(np.median(rms))
dead = sum(1 for r in rms if r < 0.003)
clip = sum(1 for r in rms if r > 0.5)
print(f'audio: {len(rms)} min | median RMS {med:.3f} | dead {dead} | clipped {clip}')
print('VERDICT:', 'PASS ✅' if dead <= 3 and med >= 0.01 else 'ISSUES ❌')
os.remove(OUT)
