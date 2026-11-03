#!/usr/bin/env python3
"""assemble.py — chunk blocks → complete v2 spec, validated.

- renumbers section blocks sequentially, groups blocks into chapters
- title/outro blocks synthesized from the OLD spec metadata (already localized)
- hard validation: schema, narr_item bounds, item caps, tex non-empty
  (KaTeX compile + plot eval are separate: validate_spec.py)
"""
import argparse, json, os, re, sys

OLD = '/home/z/my-project/uuu/video-pipeline/kaggle-ds-flat'

def load_old(spec_id, lang):
    p = os.path.join(OLD, f'spec__{spec_id}_{lang}.json')
    return json.load(open(p)) if os.path.exists(p) else None

LANG_LABEL = {'en': 'Weeks', 'ru': 'Недели', 'uz': 'Haftalar'}

def build(spec_id, lang, chunks_dir, out_path):
    old = load_old(spec_id, lang)
    if old is None:
        raise RuntimeError(f'old spec not found for {spec_id}_{lang}')

    blocks = []
    all_files = sorted(f for f in os.listdir(chunks_dir) if f.endswith('.json'))
    # dedupe: when a full chunk cNNN.json exists, its split parts cNNN_pK.json
    # are redundant (same source text) — drop the parts to avoid double content
    fulls = {f for f in all_files if re.fullmatch(r'c\d+\.json', f)}
    files = [f for f in all_files
             if not (m := re.fullmatch(r'c(\d+)_p\d+\.json', f)) or f'c{m.group(1)}.json' not in fulls]
    for f in files:
        blocks.extend(json.load(open(os.path.join(chunks_dir, f))))

    # hard cleanup: drop unknown types / empty blocks
    VALID = {'section','concept','formula','example','table','plot','timeline','code','matrix','quote','recap'}
    blocks = [b for b in blocks if b.get('type') in VALID and isinstance(b.get('data'), dict)]

    # currency guard: 'tex' fields must be real LaTeX; text that is merely money
    # ($5.5 billion) breaks KaTeX — demote such cells to plain strings
    # (string cells render through currency-safe richText)
    def _tex_ok(v):
        s = str(v)
        if re.search(r'\$\s*\d', s): return False                  # currency: $5.5 billion
        if s.lstrip().startswith('$'): return False                # $false$, $code$ markers
        if '\\n' in s or '\\t' in s or '\n' in s or '\r' in s: return False  # escaped/real code newlines
        if ';' in s or '"' in s:                                   # code punctuation
            noesc = s.replace('\\n', ' ').replace('\\t', ' ')
            if not re.search(r'\\[a-zA-Z]{2,}', noesc): return False  # no real LaTeX commands
        return True
    def _clean_tex(s):
        s = str(s).replace('\\n', ' ').replace('\\t', ' ').replace('$', ' ')
        return re.sub(r'\s{2,}', ' ', s).strip()
    for b in blocks:
        d = b.get('data') or {}
        for rows in (d.get('rows') if isinstance(d.get('rows'), list) else []):
            for row in rows:
                for ci_, c in enumerate(row):
                    if isinstance(c, dict) and 'tex' in c and not _tex_ok(c['tex']):
                        row[ci_] = _clean_tex(c['tex'])

    # chapters: split on MAJOR section blocks only (Week/Chapter/Module-level);
    # minor headings (Course Map, Formula Catalog...) stay inside the chapter
    import re as _re
    SECTION_KEEP_RE = _re.compile(
        r'(week|недел|hafta|chapter|глава|bobİ?im|bo\'lim|module|модул|раздел|part \d|часть|section \d)',
        _re.I)
    DROP_SECTION_RE = _re.compile(r'(course map|formula catalog|how to use|contents|intro)', _re.I)
    chapters = []
    cur_title = {'en': 'How to use this guide', 'ru': 'Как пользоваться гайдом',
                 'uz': 'Qo\'llanma bilan tanishuv'}.get(lang, 'Guide')
    cur = []
    sec_no = 0
    def week_nums(t):
        # explicit RANGE "weeks 1-4" → running header, not a chapter: []
        if _re.search(r'(?:week|недел|hafta)[^0-9]{0,6}\d+\s*[–—-]\s*\d+', t, _re.I):
            return []
        m = _re.findall(r'(?:week|недел|hafta)[^0-9]{0,6}(\d+)', t, _re.I)
        if not m:
            m = _re.findall(r'(\d+)[- ](?:hafta|week)', t, _re.I)
        return sorted({int(x) for x in m})

    SUBPART_RE = _re.compile(
        r'(practical|workshop|homework|isa |session|catalog|example|exercise|assignment|'
        r'практ|семинар|домашн|каталог|упражн|задан|пример|maslahat|amaliy|uyga|katalog)', _re.I)
    cur_week = None
    for b in blocks:
        if b['type'] == 'section':
            t = str(b['data'].get('title') or '')
            wn = week_nums(t)
            if len(wn) == 1 and not SUBPART_RE.search(t):
                if wn[0] != cur_week:
                    if cur: chapters.append({'title': cur_title, 'blocks': cur}); cur = []
                    sec_no += 1
                    b['data']['num'] = sec_no
                    cur_title = t
                    cur_week = wn[0]
                    cur.append(b)
                    continue
                continue
            continue
        cur.append(b)
    if cur: chapters.append({'title': cur_title, 'blocks': cur})

    # title block (first chapter, first position)
    title_narr = ''
    for ch in old.get('chapters', []):
        for b in ch.get('blocks', []):
            if b.get('type') == 'title':
                title_narr = b.get('narration') or ''
                break
        if title_narr: break
    if not title_narr:
        title_narr = f"Welcome to the complete guide: {old.get('course_title','')}, {old.get('test_title','')}."

    # chips: chapter titles (shortened)
    chips = []
    for ch in chapters:
        t = ch['title']
        chips.append(t if len(t) <= 42 else t[:40].rstrip() + '…')
    title_block = {
        'type': 'title',
        'data': {
            'kicker': old.get('test_title', 'Complete guide'),
            'title': old.get('course_title', spec_id),
            'subtitle': old.get('subtitle', ''),
            'chips': chips[:6],
        },
        'narr': [title_narr],
        'narr_item': [-1],
    }
    chapters[0]['blocks'].insert(0, title_block)

    # outro block
    outro_msg = old.get('outro_message') or 'You are ready. Good luck!'
    outro = {
        'type': 'outro',
        'data': {'kicker': {'ru': 'Курс пройден', 'uz': 'Kurs yakunlandi'}.get(lang, 'Guide complete'),
                 'message': outro_msg,
                 'chip': {'ru': 'Удачи на тесте!', 'uz': 'Testda omad!'.replace('!','!')}.get(lang, 'Good luck on the test!')},
        'narr': [outro_msg],
        'narr_item': [-1],
    }
    chapters[-1]['blocks'].append(outro)

    spec = {
        'id': spec_id,
        'language': lang,
        'course_title': old.get('course_title', spec_id),
        'weeks_label': old.get('test_title', ''),
        'test_title': old.get('test_title', spec_id),
        'chapters': chapters,
    }

    # ── auto-repair pass (same rules as generator) ──
    def count_items(b):
        d = b.get('data', {})
        t = b['type']
        if t == 'concept': return len(d.get('bullets') or [])
        if t == 'recap': return len(d.get('items') or [])
        if t == 'formula': return len(d.get('parts') or [])
        if t in ('example', 'matrix'): return len(d.get('steps') or [])
        if t == 'table': return len(d.get('rows') or [])
        if t == 'timeline': return len(d.get('events') or [])
        if t == 'code': return 1
        return 0
    # shape normalization: steps/parts/events/rows → canonical dicts
    for ch in spec['chapters']:
        for b in ch['blocks']:
            d = b.get('data', {})
            if isinstance(d.get('steps'), list):
                d['steps'] = [{'text': (s['text'] if isinstance(s, dict) and isinstance(s.get('text'), str)
                                        else (s if isinstance(s, str) else str(s)))}
                              for s in d['steps']]
            if isinstance(d.get('events'), list):
                d['events'] = [{'year': (e.get('year') if isinstance(e, dict) else str(e)),
                                'text': (e.get('text') if isinstance(e, dict) else '')}
                               for e in d['events']]
            if isinstance(d.get('rows'), list):
                d['rows'] = [r for r in d['rows'] if isinstance(r, list)]
            if b['type'] == 'plot' and isinstance(d.get('functions'), list):
                d['functions'] = [f if isinstance(f, dict) else {'fn': str(f)} for f in d['functions']]

    for ch in spec['chapters']:
        keep = []
        for b in ch['blocks']:
            has_narr = (isinstance(b.get('narr'), list) and b['narr']
                        and any(isinstance(s, str) and s.strip() for s in b['narr']))
            if has_narr or b['type'] in ('title', 'outro'):
                keep.append(b)
        ch['blocks'] = keep
        for b in ch['blocks']:
            if not isinstance(b.get('narr'), list): continue
            keep = []
            for k, s in enumerate(b['narr']):
                if isinstance(s, str) and s.strip():
                    keep.append((s, (b.get('narr_item') or [None]*len(b['narr']))[k]))
            b['narr'] = [s for s, _ in keep]
            b['narr_item'] = [it for _, it in keep]
            ni = b.get('narr_item') or []
            items = count_items(b)
            b['narr_item'] = [it if (isinstance(it, int) and 0 <= it < items) else -1 for it in ni]

    # ── validation ──
    errors = []
    n_blocks = n_narr = 0
    caps = {'bullets': 9, 'steps': 7, 'parts': 6, 'items': 9, 'rows': 18, 'events': 14}
    for ci, ch in enumerate(spec['chapters']):
        for bi, b in enumerate(ch['blocks']):
            n_blocks += 1
            tag = f'ch{ci} b{bi} ({b["type"]})'
            d = b.get('data', {})
            narr = b.get('narr') or []
            ni = b.get('narr_item') or []
            if not narr: errors.append(f'{tag}: no narr'); continue
            if len(narr) != len(ni):
                errors.append(f'{tag}: narr {len(narr)} vs narr_item {len(ni)}')
            n_narr += len(narr)
            items = 0
            if b['type'] in ('concept',):
                items = len(d.get('bullets') or [])
            elif b['type'] == 'recap': items = len(d.get('items') or [])
            elif b['type'] == 'formula':
                items = len(d.get('parts') or [])
                if not (d.get('tex') or '').strip(): errors.append(f'{tag}: empty tex')
            elif b['type'] in ('example','matrix'):
                items = len(d.get('steps') or [])
            elif b['type'] == 'table': items = len(d.get('rows') or [])
            elif b['type'] == 'timeline': items = len(d.get('events') or [])
            elif b['type'] == 'code': items = 1   # engine: single code item
            elif b['type'] == 'plot':
                if not (d.get('functions') or []): errors.append(f'{tag}: no functions')
            for arr_key, cap in caps.items():
                v = d.get(arr_key)
                if isinstance(v, list) and len(v) > cap:
                    errors.append(f'{tag}: {arr_key} {len(v)} > {cap}')
            for k, it in enumerate(ni):
                if it >= items and it != -1:
                    errors.append(f'{tag}: narr_item[{k}]={it} >= items {items}')
            for s in narr:
                if not isinstance(s, str) or not s.strip():
                    errors.append(f'{tag}: empty narr segment')
    if not spec['chapters']: errors.append('no chapters')

    json.dump(spec, open(out_path, 'w'), ensure_ascii=False, indent=1)
    words = sum(len(s.split()) for ch in spec['chapters'] for b in ch['blocks'] for s in (b.get('narr') or []))
    est_min = words / (150 if lang=='en' else 130)
    print(f'{spec_id}_{lang}: {n_blocks} блоков, {len(spec["chapters"])} глав, '
          f'{words} слов озвучки ≈ {est_min:.0f} мин')
    if errors:
        print(f'  ⚠️ {len(errors)} ошибок:')
        for e in errors[:12]: print('   -', e)
        return 1
    return 0

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--id', required=True)
    ap.add_argument('--lang', required=True)
    ap.add_argument('--chunks', required=True)
    ap.add_argument('--out', required=True)
    a = ap.parse_args()
    sys.exit(build(a.id, a.lang, a.chunks, a.out))
