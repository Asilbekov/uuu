#!/usr/bin/env python3
"""build_comp.py — spec.json + audio timings → a single comp.html (+ assets dir).

Timeline model (seconds, 30 fps downstream):
  block i:  [pad_in 0.9 | narration segments (with 0.18s breaths) | pad_out 0.75]
  The FIRST item cue of a block defaults to pad_in so the visual reveal has
  landed before the voice names it; subsequent cues come from segment starts.

Inputs
  --spec spec.json     : the v2 spec (blocks with narr segments)
  --times times.json   : per-block list of segment durations (s), from TTS pass
  --out dir            : output dir; writes comp.html + copies assets/

The comp template consumes DATA with absolute t0/t1 per block and per-item
cues (local times). We compute those here — the browser never guesses.
"""
import argparse, json, math, os, shutil, re

HERE = os.path.dirname(os.path.abspath(__file__))
PAD_IN = 0.9        # entrance before narration starts
PAD_OUT = 0.75      # exit + breath after narration ends
SEG_BREATH = 0.18   # pause between narration segments inside a block

ACCENTS = {
    'math1': ('#4C5FD5', 'rgba(76,95,213,.14)'),
    'la':    ('#0E7C7B', 'rgba(14,124,123,.14)'),
    'cs':    ('#B45309', 'rgba(180,83,9,.14)'),
    'hist':  ('#A03040', 'rgba(160,48,64,.14)'),
    'ite':   ('#1D6FB8', 'rgba(29,111,184,.14)'),
    'eng':   ('#7C3AED', 'rgba(124,58,237,.14)'),
}

def accent_for(spec_id):
    for k in ('math1','la','cs','hist','ite','eng'):
        if spec_id.startswith(k):
            return ACCENTS[k]
    return ACCENTS['ite']

# ── plot precompute: numpy-expression → sampled polyline (safe namespace) ──
import numpy as _np

def _plot_svg(pdata, W=1280, H=560):
    """pdata: functions[{fn, tex, color}], x_range, y_range, point, vline.
    Labels: curve tags stacked top-left INSIDE the plot; axis captions placed
    clear of them (x under the right end, y above the left margin)."""
    xr, yr = pdata['x_range'], pdata['y_range']
    x0, x1 = xr; y0, y1 = yr
    ml, mr, mt, mb = 96, 56, 92, 74
    pw, ph = W-ml-mr, H-mt-mb
    def sx(x): return ml + (x-x0)/(x1-x0)*pw
    def sy(y): return mt + (1-(y-y0)/(y1-y0))*ph
    parts = [f'<svg width="{W}" height="{H}" viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg" style="--p:1">']
    parts.append(f'<rect x="{ml}" y="{mt}" width="{pw}" height="{ph}" fill="none" stroke="#E7E2D6" stroke-width="2" rx="8"/>')
    for gy in range(1,4):
        yy = mt + ph*gy/4
        parts.append(f'<line x1="{ml}" x2="{ml+pw}" y1="{yy:.0f}" y2="{yy:.0f}" stroke="#F0ECE1" stroke-width="1.5"/>')
    # y ticks at top-left margin (stacked, small)
    parts.append(f'<text class="axis-t" x="{ml-12}" y="{mt+16}" text-anchor="end">{_fmt(y1)}</text>')
    parts.append(f'<text class="axis-t" x="{ml-12}" y="{mt+ph}" text-anchor="end">{_fmt(y0)}</text>')
    # curve legend: top-RIGHT, OUTSIDE the plot rectangle, stacked upward
    tag_i = 0
    tags = [f for f in pdata['functions'] if f.get('tex')]
    for ti, f in enumerate(tags):
        ty = mt - 44 + ti*36
        lx = ml + pw - 26 - ti*0  # right-aligned column
        parts.append(f'<circle cx="{lx}" cy="{ty-9}" r="9" fill="{f.get("color","#4C5FD5")}"/>')
        parts.append(f'<text class="curve-t" x="{lx-20}" y="{ty}" text-anchor="end" fill="{f.get("color","#4C5FD5")}">{_xml(f["tex"])}</text>')
        tag_i += 1
    # axis captions bottom-right / left, below plot
    if pdata.get('x_label'):
        parts.append(f'<text class="axis-t" x="{ml+pw}" y="{mt+ph+44}" text-anchor="end">{_xml(pdata["x_label"])}</text>')
    if pdata.get('y_label'):
        parts.append(f'<text class="axis-t" x="{ml}" y="{mt-40}" text-anchor="start">{_xml(pdata["y_label"])}</text>')
    if pdata.get('vline') is not None:
        vx = sx(pdata['vline'])
        parts.append(f'<line x1="{vx:.1f}" x2="{vx:.1f}" y1="{mt}" y2="{mt+ph}" stroke="#B9B4A6" stroke-width="2.5" stroke-dasharray="8 7"/>')
    for f in pdata['functions']:
        xs = _np.linspace(x0, x1, 640)
        try:
            ys = eval(f['fn'], {'np': _np, 'x': xs, 'math': math})
            ys = _np.asarray(ys, dtype=float)
        except Exception as e:
            raise ValueError(f"plot fn eval failed: {f['fn']}: {e}")
        pts = ' '.join(f'{sx(a):.1f},{sy(min(max(b,y0),y1)):.1f}'
                       for a, b in zip(xs, ys) if y0-1e9 <= b <= y1+1e9)
        color = f.get('color', '#4C5FD5')
        parts.append(f'<path class="curve" d="M{pts}" fill="none" stroke="{color}" stroke-width="5" '
                     f'stroke-linecap="round" pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:calc(1 - var(--p,1))"/>')
    if pdata.get('point'):
        px, py = pdata['point']
        parts.append(f'<circle cx="{sx(px):.1f}" cy="{sy(py):.1f}" r="11" fill="{pdata.get("point_color","#B45309")}" '
                     f'stroke="#fff" stroke-width="4"/>')
    parts.append('</svg>')
    return ''.join(parts)

def _fmt(v):
    return f'{v:g}'

def _xml(s):
    return s.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')

# ── timeline assembly ──────────────────────────────────────────────────
def n_items(blk):
    t = blk['type']
    if t in ('concept','recap'): return len(blk.get('data',{}).get('bullets') or blk.get('data',{}).get('items') or [])
    if t == 'formula': return len(blk.get('data',{}).get('parts') or [])
    if t in ('example','matrix'): return len(blk.get('data',{}).get('steps') or []) + (1 if blk.get('data',{}).get('result') else 0)
    if t == 'table': return len(blk.get('data',{}).get('rows') or [])
    if t == 'timeline': return len(blk.get('data',{}).get('events') or [])
    if t == 'code': return 1
    return 0  # title/section/quote/outro: no item cues

def build(spec, times, out_dir, words=None):
    blocks_out = []
    t = 0.0
    words = words or {}
    for ci, ch in enumerate(spec['chapters']):
        for bi, blk in enumerate(ch['blocks']):
            bidx = len(blocks_out)
            segs = times.get(str(bidx)) if times.get(str(bidx)) is not None else None
            if segs is None:
                raise RuntimeError(f"missing times for block #{bidx} ({blk['type']})")
            narr = PAD_IN + sum(segs) + SEG_BREATH*(len(segs)-1) + PAD_OUT
            # cues + word timings: item k reveals just before its first spoken
            # word; blk.words carries every word with (t local, item, w)
            cues = []
            ni = n_items(blk)
            wlist = []
            segw = words.get(str(bidx)) or []
            item_of_seg = blk.get('narr_item', [])
            for si, d in enumerate(segs):
                start_local = PAD_IN + sum(segs[:si]) + SEG_BREATH*si
                it = item_of_seg[si] if si < len(item_of_seg) else None
                sw = segw[si] if si < len(segw) else []
                first_w_t = None
                for w in sw:
                    wt = round(start_local + w['t'], 3)
                    wlist.append({'t': wt, 'd': round(w.get('d', 0.25), 3),
                                  'it': it if it is not None else -1, 'w': w['w']})
                    if first_w_t is None: first_w_t = wt
                if it is not None and it >= 0:
                    if it >= len(cues):
                        cues.append(round(max(0.35, (first_w_t if first_w_t is not None
                                       else start_local) - 0.30), 3))
            data = dict(blk.get('data') or {})
            if blk['type'] == 'plot':
                data['svg'] = _plot_svg(blk['data'])
            label = (data.get('heading') or data.get('title') or blk['type'])
            if blk['type'] == 'section':
                label = (data.get('title') or blk['type'])
            blocks_out.append({
                'type': blk['type'], 't0': round(t, 3),
                't1': round(t + narr, 3), 'dur': round(narr, 3),
                'data': data, 'cues': cues, 'words': wlist,
                'srt': str(label)[:120],
            })
            t += narr
    total = t

    chapters = [c['title'] for c in spec['chapters']]
    data_js = {
        'meta': {
            'course_title': spec['course_title'], 'weeks_label': spec.get('weeks_label',''),
            'test_title': spec.get('test_title',''), 'lang': spec['language'],
            'total': round(total, 3), 'fps': 30,
        },
        'chapters': chapters,
        'blocks': blocks_out,
    }

    tpl = open(os.path.join(HERE, 'comp.template.html'), encoding='utf-8').read()
    accent, accent_soft = accent_for(spec['id'])
    html = (tpl.replace('__LANG__', spec['language'])
               .replace('__TITLE__', _xml(spec.get('test_title') or spec['id']))
               .replace('__ACCENT__', accent)
               .replace('__ACCENT_SOFT__', accent_soft)
               .replace('__DATA__', json.dumps(data_js, ensure_ascii=False)))
    os.makedirs(out_dir, exist_ok=True)
    open(os.path.join(out_dir, 'comp.html'), 'w', encoding='utf-8').write(html)
    # assets
    src_assets = os.path.join(HERE, 'assets')
    dst = os.path.join(out_dir, 'assets')
    if os.path.exists(dst): shutil.rmtree(dst)
    shutil.copytree(src_assets, dst)
    # chapters for ffmpeg metadata
    meta_ff = ";".join(
        f"CHAPTER{i+1}NAME={ti}" for i, ti in enumerate(
            [b['t0'] for b in blocks_out if b['type']=='section'])
    )
    chaps = []
    sec_i = 0
    for b in blocks_out:
        if b['type'] == 'section':
            h = int(b['t0']//3600); m = int(b['t0']%3600//60); s = b['t0']%60
            chaps.append({'title': chapters[sec_i] if sec_i < len(chapters) else f'Chapter {sec_i+1}',
                          'start': f'{h:02d}:{m:02d}:{s:06.3f}'})
            sec_i += 1
    h = int(total//3600); m = int(total%3600//60); s = total%60
    chaps.append({'title': 'END', 'start': f'{h:02d}:{m:02d}:{s:06.3f}'})
    json.dump({'total': total, 'chapters': chaps,
               'blocks': [{'type': b['type'], 't0': b['t0'], 't1': b['t1']} for b in blocks_out]},
              open(os.path.join(out_dir, 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
    return total, len(blocks_out)

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--spec', required=True)
    ap.add_argument('--times', required=True)
    ap.add_argument('--out', required=True)
    a = ap.parse_args()
    spec = json.load(open(a.spec))
    times = json.load(open(a.times))
    words_path = os.path.join(os.path.dirname(a.times), 'words.json')
    words = json.load(open(words_path)) if os.path.exists(words_path) else {}
    total, n = build(spec, times, a.out, words)
    print(f'comp built: {n} blocks, {total/60:.1f} min → {a.out}/comp.html')
