#!/usr/bin/env python3
"""Structural extractor v2 for the text-oriented study guides
(Introduction to Engineering / English for Engineering, weeks 5-7).

Differences from v1 (which emitted one block per PDF line):
  - running heads / footers / page numbers excluded by geometry
  - lines are grouped into PARAGRAPHS using the line-leading gap:
    within-paragraph step == the document's mode leading, paragraph
    breaks are >= leading + 1.5pt (verified on both originals:
    ie57 14.5 vs >=16.5, ee57 13.6 vs >=15.6)
  - bold question paragraphs (S… / Task …, FreeSerifBold) keep a
    'bold' flag so the builder renders them bold; bold wrap
    continuations merge into the same unit
  - wrapped headings (bold continuation at paragraph leading) merge
    into their heading
  - tables are interleaved at their vertical position (reading order)
  - mid-sentence paragraphs split by a page break are re-joined
Output schema matches extract.py.
"""
import fitz, json, re, sys
from collections import Counter

BODY_TOP = 65.0     # running-head zone above this (y0)
BODY_BOTTOM = 790.0 # footer zone below this
BULLETS = ('•', '–', '— ')


def line_text(spans):
    return ''.join(s['text'] for s in spans).strip()


def collect(pdf_path):
    d = fitz.open(pdf_path)
    toc = d.get_toc()
    toc_by_page = {}
    for lvl, title, pno in toc:
        toc_by_page.setdefault(pno, []).append((lvl, re.sub(r'\s+', ' ', title).strip()))

    printed_toc_pages = set()
    for pno in range(len(d)):
        if re.sub(r'\s+', ' ', d[pno].get_text()).count('. .') > 8:
            printed_toc_pages.add(pno + 1)

    body_start = 1
    for pno in range(len(d)):
        if (pno + 1) not in printed_toc_pages and pno > 0:
            body_start = pno
            break

    # cover = page 1 only
    cover_lines = []
    for b in d[0].get_text('dict')['blocks']:
        for l in b.get('lines', []):
            t = line_text(l['spans'])
            if t:
                cover_lines.append(t)

    # running head sample from a body page
    header = {}
    if len(d) > 6:
        cand = []
        for b in d[6].get_text('dict')['blocks']:
            for l in b.get('lines', []):
                for s in l['spans']:
                    if s['size'] < 9.2 and s['origin'][1] < 62 and s['text'].strip():
                        cand.append(s)
        if cand:
            lefts = [s for s in cand if s['origin'][0] < 300]
            rights = [s for s in cand if s['origin'][0] >= 300]
            header = {'left': (lefts[0]['text'].strip() if lefts else cand[0]['text'].strip()),
                      'right': (rights[-1]['text'].strip() if rights else '')}

    # ---- per-page line records (body zone, outside tables), reading order
    pages = []   # list of dict(page, records=[...], tables=[(y0, rows)])
    for pno in range(body_start, len(d)):
        page = pno + 1
        if page in printed_toc_pages:
            continue
        tabs = d[pno].find_tables()
        table_rects, tables = [], []
        for tb in tabs.tables:
            rows = [[re.sub(r'\s+', ' ', (c or '')).strip() for c in r] for r in tb.extract()]
            if rows and any(any(c for c in r) for r in rows):
                tables.append((fitz.Rect(tb.bbox).y0, rows))
                table_rects.append(fitz.Rect(tb.bbox))
        records = []
        for b in d[pno].get_text('dict')['blocks']:
            for l in b.get('lines', []):
                r = fitz.Rect(l['bbox'])
                if any(tr.intersects(r) for tr in table_rects):
                    continue
                spans = [s for s in l['spans'] if s['text'].strip()]
                if not spans:
                    continue
                t = line_text(l['spans'])
                if not t or re.fullmatch(r'\d{1,3}', t):
                    continue
                if l['bbox'][1] < BODY_TOP or l['bbox'][1] > BODY_BOTTOM:
                    continue
                sz = max(s['size'] for s in spans)
                bold = all((s['flags'] & 16) or 'Bold' in s['font'] for s in spans)
                ital = all(('Italic' in s['font']) or (s['flags'] & 2) for s in spans)
                records.append({'t': t, 'y0': round(l['bbox'][1], 1), 'x0': round(l['bbox'][0], 1),
                                'sz': round(sz, 1), 'bold': bold, 'ital': ital})
        records.sort(key=lambda r: (r['y0'], r['x0']))
        tables.sort(key=lambda tb: tb[0])
        pages.append({'page': page, 'records': records, 'tables': tables})

    # ---- leading calibration: mode of within-page consecutive steps
    steps = []
    for pg in pages:
        rs = pg['records']
        for i in range(1, len(rs)):
            s = round(rs[i]['y0'] - rs[i-1]['y0'], 1)
            if 8.0 <= s <= 26.0:
                steps.append(s)
    leading = Counter(steps).most_common(1)[0][0] if steps else 14.5
    thr = round(leading + 1.5, 1)
    return d, cover_lines, header, pages, toc_by_page, leading, thr


def walk(pages, toc_by_page, thr):
    """Emit units per page: paragraphs / headings / li / src / tables in order."""
    all_units = []
    used_toc = set()
    for pg in pages:
        cur = None
        prev = None
        ti = 0
        units = []

        def flush():
            nonlocal cur
            if cur:
                units.append(cur)
                cur = None

        for rec in pg['records']:
            # tables positioned above this line come first (reading order)
            while ti < len(pg['tables']) and pg['tables'][ti][0] < rec['y0'] - 1.0:
                flush()
                units.append({'k': 'table', 'rows': pg['tables'][ti][1]})
                ti += 1
                prev = None   # a table interrupts the flow
            step = (rec['y0'] - prev['y0']) if prev else 999.0
            prev = rec
            t = rec['t']
            # --- TOC heading?
            hit = None
            for lvl, title in toc_by_page.get(pg['page'], []):
                if title in used_toc:
                    continue
                if t.startswith(title[:40]) or title.startswith(t[:40]):
                    hit = (lvl, title)
                    break
            cand_kind, cand_t = None, t
            if hit:
                used_toc.add(hit[1])
                cand_kind = 'h1' if hit[0] == 1 else 'h2'
            elif t.startswith(BULLETS):
                cand_kind, cand_t = 'li', t.lstrip('•–— ').strip()
            elif rec['ital'] and rec['sz'] <= 9.2:
                cand_kind = 'src'
            elif rec['bold'] and rec['sz'] >= 11.2:
                cand_kind = 'h3'
            else:
                cand_kind = 'p'
            # --- try to merge into the current unit
            if cur is not None and step <= thr:
                same_p = (cur['k'] in ('p', 'li') and cand_kind == 'p'
                          and cur.get('bold', False) == rec['bold']
                          and abs(cur['_sz'] - rec['sz']) <= 0.6)
                head_wrap = (cur['k'] in ('h1', 'h2', 'h3')
                             and rec['bold'] and cand_kind in ('p', 'h3'))
                if same_p or head_wrap:
                    cur['t'] = (cur['t'] + ' ' + cand_t).strip()
                    cur['_sz'] = rec['sz']
                    continue
            flush()
            cur = {'k': cand_kind, 't': cand_t, '_sz': rec['sz']}
            if cand_kind == 'p' and rec['bold']:
                cur['bold'] = True
        flush()
        while ti < len(pg['tables']):
            units.append({'k': 'table', 'rows': pg['tables'][ti][1]})
            ti += 1
        for u in units:
            u['page'] = pg['page']
        all_units.extend(units)
    return all_units


def cross_page_join(units):
    """Re-join paragraphs that the original layout split across a page break:
    previous unit ends mid-sentence (lowercase letter / digit / comma) and the
    next page starts with a same-style paragraph continuation. Also re-joins a
    wrapped heading whose continuation landed alone at the top of the next page
    (e.g. h1 '1. Karта …' + fragment 'пособием')."""
    out = []
    for u in units:
        if out:
            a, b = out[-1], u
            if (a['k'] in ('p', 'li') and b['k'] in ('p', 'li')
                    and a.get('bold', False) == b.get('bold', False)
                    and a.get('page') != b.get('page')
                    and re.search(r'[a-zа-яё0-9,]$', a['t'])
                    and not re.match(r'^[A-ZА-ЯЁ«"(\d]$', b['t'][:1] or '')):
                a['t'] = (a['t'] + ' ' + b['t']).strip()
                a['page'] = b.get('page')
                continue
            if (a['k'] in ('h1', 'h2', 'h3') and b['k'] == 'h3'
                    and len(b.get('t', '')) <= 30):
                a['t'] = (a['t'] + ' ' + b['t']).strip()
                a['page'] = b.get('page')
                continue
        out.append(u)
    return out


# Exact-match repairs for table cells damaged by find_tables' column slicing
# (fragments reordered inside filename cells; hard-wrapped words carried a
# space at the wrap point). Verified against the PDF text layer + the
# course-files listing + the guide's own prose naming style (no underscores).
REPAIR_CELLS = {
    'Неде ля': 'Неделя',
    'Нед .': 'Нед.',
    'Lecture05 ProblemFramingan .txt (33 dModellingII слайда)':
        'Lecture05ProblemFramingandModellingII.txt (33 слайда)',
    'Lab5 .txt ProblemFramingII (16 страниц)':
        'Lab5ProblemFramingII.txt (16 страниц)',
    'Engineering ProblemF . ramingBlanketTemplate txt; Lab5 ModelWorksh .txt eetTemplate':
        'EngineeringProblemFramingBlanketTemplate.txt; Lab5ModelWorksheetTemplate.txt',
    'Lecture06 QuantitativeReaso .txt (32 слайда) ningI':
        'Lecture06QuantitativeReasoningI.txt (32 слайда)',
    'Lab6 .t QuantitativeReasoningI xt (17 страниц)':
        'Lab6QuantitativeReasoningI.txt (17 страниц)',
    'Lab6 WorksheetTemplat .txt e':
        'Lab6WorksheetTemplate.txt',
    'Lecture07 QuantitativeReaso .txt (32 слайда) ningII':
        'Lecture07QuantitativeReasoningII.txt (32 слайда)',
    'Lab7 . QuantitativeReasoningII txt (21 страница)':
        'Lab7QuantitativeReasoningII.txt (21 страница)',
    'Lab7 EngineeringDecisi onsIncompleteDataTemp .txt late':
        'Lab7EngineeringDecisionsIncompleteDataTemplate.txt',
    'упрощаю щее': 'упрощающее',
    'too little; нерепр езентативно': 'too little; нерепрезентативно',
    'средне-ни зкое': 'средне-низкое',
    'низко-сре днее': 'низко-среднее',
    'Типичны й': 'Типичный',
    'Lab5 .txt ProblemFramingII':
        'Lab5ProblemFramingII.txt',
    'Lab5 .t ModelWorksheetTemplate xt':
        'Lab5ModelWorksheetTemplate.txt',
    'Engineering ProblemFramingBla .txt nketTemplate':
        'EngineeringProblemFramingBlanketTemplate.txt',
    'Lab6 .txt QuantitativeReasoningI':
        'Lab6QuantitativeReasoningI.txt',
    'Lab6 .txt WorksheetTemplate':
        'Lab6WorksheetTemplate.txt',
    'Lab7 .txt QuantitativeReasoningII':
        'Lab7QuantitativeReasoningII.txt',
    'Lab7 EngineeringDecisionsIncom .txt pleteDataTemplate':
        'Lab7EngineeringDecisionsIncompleteDataTemplate.txt',
}


def main(pdf_path, out_path):
    d, cover_lines, header, pages, toc_by_page, leading, thr = collect(pdf_path)
    units = walk(pages, toc_by_page, thr)
    units = cross_page_join(units)
    for u in units:
        u.pop('_sz', None)
        u.pop('page', None)
        u['t'] = re.sub(r'\s+', ' ', u.get('t', '')).strip()
        if u['k'] == 'table':
            u['rows'] = [[(REPAIR_CELLS.get(c, c) if c else c) for c in row]
                         for row in u.get('rows', [])]
    # drop degenerate fragments
    units = [u for u in units if u['k'] == 'table' or u.get('t')]
    data = {'cover': cover_lines, 'header': header, 'blocks': units}
    with open(out_path, 'w') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print(f'{pdf_path.split("/")[-1]}: {len(units)} blocks {dict(Counter(u["k"] for u in units))}')
    print(f'  leading={leading} thr={thr}; cover lines: {len(cover_lines)}; header: {header}')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
