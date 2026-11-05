#!/usr/bin/env python3
"""local_validate.py — воспроизвести build_comp + validate_comp локально (без TTS).
Usage: python3 local_validate.py <spec.json>
Dummy times (3s/segment) — валидация проверяет видимость/KaTeX/raw-latex,
они не зависят от длительностей. Выход 0 = PASS, 1 = FAIL.
"""
import json, os, sys

SPEC = sys.argv[1]
BASE = '/home/z/my-project/uuu/video-pipeline-v2'
sys.path.insert(0, os.path.join(BASE, 'render'))
sys.path.insert(0, os.path.join(BASE, 'engine'))

spec = json.load(open(SPEC))
vid = spec['id'] + '_' + spec['language']
times = {}
n = 0
for ch in spec['chapters']:
    for blk in ch['blocks']:
        times[str(n)] = [3.0] * len(blk.get('narr', ['x']))
        n += 1
print(f'{vid}: {n} blocks, dummy times ready')

import build_comp
comp_dir = f'/tmp/comp_{vid}'
os.system(f'rm -rf {comp_dir}')
build_comp.build(spec, times, comp_dir)
timeline = json.load(open(os.path.join(comp_dir, 'timeline.json')))
print(f'comp built: {len(timeline["blocks"])} blocks, total {timeline["total"]:.0f}s')

import render_video
try:
    render_video.validate_comp(comp_dir, timeline)
    print('VALIDATE: PASS')
    sys.exit(0)
except Exception as e:
    print('VALIDATE: FAIL')
    print(str(e)[:4000])
    sys.exit(1)
