#!/usr/bin/env python3
"""sanity_katex.py — локальный тест фиксированного движка на реальном спеке:
строит comp с фейковыми таймингами, прогоняет validate_comp и проверяет
что $...$-математика реально рендерится в .katex (а не сырым текстом)."""
import json, os, subprocess, sys, tempfile

ROOT = '/home/z/my-project/uuu/video-pipeline-v2'
sys.path.insert(0, ROOT + '/engine')
sys.path.insert(0, ROOT + '/render')

SPEC = sys.argv[1] if len(sys.argv) > 1 else 'math1_w14_en'
spec = json.load(open(f'{ROOT}/content/specs-v2/{SPEC}.json'))

# фейковые тайминги: один сегмент на блок, длительность по числу слов
import re
blocks = [b for ch in spec['chapters'] for b in ch['blocks']]
times = {}
for i, b in enumerate(blocks):
    narr = b.get('narr') or []
    text = ' '.join(narr) if isinstance(narr, list) else str(narr or '')
    words = max(1, len(text.split()))
    times[str(i)] = [max(5.0, 0.42 * words)]

td = tempfile.mkdtemp(prefix='sanity_')
json.dump(times, open(os.path.join(td, 'times.json'), 'w'))

import build_comp
total, nblocks = build_comp.build(spec, times, td, {})
print(f'comp built: {nblocks} blocks, {total:.0f}s → {td}/comp.html')

# ── validate_comp: KaTeX-ошибки + сырой LaTeX на экране ──
timeline = json.load(open(os.path.join(td, 'timeline.json')))
from render_video import validate_comp
try:
    validate_comp(td, timeline)
    errs = []
    print('validate: comp validation ok (0 errors)')
except RuntimeError as e:
    errs = [l.strip() for l in str(e).split('\n')[1:]]
    print('validate errors:', len(errs))
    for e in errs[:10]:
        print('  !', e[:160])

# ── позитивная проверка: .katex реально появляется в problem/steps/result ──
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(args=['--no-sandbox'])
    pg = b.new_page(viewport={'width': 1920, 'height': 1080})
    pg.goto('file://' + os.path.join(td, 'comp.html'))
    pg.wait_for_function('() => !!(window.__ready && window.__seek)', timeout=30000)
    counts = []
    for blk in timeline['blocks']:
        if blk['type'] not in ('example', 'concept', 'table'):
            continue
        mid = (blk['t0'] + blk['t1']) / 2
        pg.evaluate(f'window.__seek({mid})')
        r = pg.evaluate('''(()=>{ const nd=document.querySelector('.block.on');
            return nd ? {katex: nd.querySelectorAll('.katex').length,
                         err: nd.querySelectorAll('.tex-err').length,
                         dollar: (nd.textContent.match(/\\$/g)||[]).length} : null })()''')
        if r and r['katex'] > 0:
            counts.append((blk['type'], r))
    b.close()
ok = sum(1 for t, r in counts if r['katex'] > 0 and r['err'] == 0 and r['dollar'] == 0)
print(f'blocks with rendered inline math: {ok}/{len(counts)} (katex>0, err=0, $=0)')
for t, r in counts[:6]:
    print(' ', t, r)
print('\nVERDICT:', 'PASS ✅' if not errs and ok >= min(6, len(counts)) else 'FAIL ❌')
