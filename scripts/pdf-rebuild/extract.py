#!/usr/bin/env python3
"""extract.py v2 — structured content extraction from a study-guide PDF.

Architecture (rebuilt after sandbox reset; supersedes the lost v1):
  1. PyMuPDF spans; role classification by (font, size):
       chrome     FreeSerif@any, y<55 or y>780          (running head, page no)
       h1         DejaVuSerif-Bold@>=14                  (section)
       h2         DejaVuSerif-Bold@~12                   (subsection)
       h3         DejaVuSerif-Bold@10.9 starting d.d.d   (detected later)
       math       FreeSerifItalic@11.4                   (display formulas)
       mathidx    FreeSerifItalic@~9.4                   (formula sub/sup)
       source     FreeSerifItalic@9.0                    ([Источник: ...] notes)
       srccode    FreeSerifItalic@~7.2                   (inline code in notes)
       textidx    DejaVu*@<=9.0                          (body sub/sup)
       tabletext  DejaVu*@9.1..9.9                       (table cells)
       text/bold  DejaVu(serif)(-bold)@10.9              (body)
  2. Line assembly in draw order; idx spans attach generously.
  3. Index attachment BY GEOMETRY: base = span whose x1 <= idx.x0+4 and x1
     is maximal (nearest base ending to the left); else nearest overlapping.
     Handles idx spans drawn before/after their base in the content stream.
  4. sup/sub: flags bit 0, else baseline offset.
  5. Orphan all-idx lines attach to the previous line by x (same geometry).
  6. Tables: all-@9.5 lines -> rows, cells by x-gap, consecutive rows -> table.
  7. Paragraphs: gap > 8pt or style/kind change; hyphen join on wrap.
  8. Question heads: bold paragraphs 'Упражнение N. Title...'.

Usage: extract.py <pdf> <out.json>
"""
import fitz, re, json, sys
from collections import Counter

SUP_FLAG = 1

def iter_spans(page):
    out = []
    ph = page.rect.height
    for bno, b in enumerate(page.get_text('dict')['blocks']):
        if b.get('type') != 0:
            continue
        for l in b['lines']:
            for s in l['spans']:
                txt = s['text']
                if not txt.strip():
                    continue
                font, size, fl = s['font'], round(s['size'], 1), s['flags']
                x0, y0, x1, y1 = s['bbox']
                role = 'unknown'
                if font.startswith('FreeSerifItalic'):
                    if size <= 7.6:  role = 'srccode'
                    elif size <= 9.2:  role = 'source'
                    elif size <= 9.9:  role = 'mathidx'
                    else:              role = 'math'
                elif font == 'FreeSerif':
                    role = 'chrome' if (y0 < 55 or y0 > ph - 62) else 'freebody'
                elif font.startswith('Helvetica'):
                    role = 'bullet'
                elif font.startswith('DejaVu'):
                    if size >= 14:    role = 'h1'
                    elif size >= 11.9: role = 'h2'
                    elif size >= 10.2: role = 'textbold' if font.endswith('Bold') else 'text'
                    elif size <= 9.0: role = 'textidx'
                    else:             role = 'tabletext' if not font.endswith('Bold') else 'tabletext'
                out.append({'text': txt, 'font': font, 'size': size, 'flags': fl,
                            'bbox': list(s['bbox']), 'origin': list(s['origin']),
                            'role': role, 'bno': bno})
    return out

def is_idx(s):
    return s['role'] in ('mathidx', 'textidx')

def supsub(idx, base):
    if (idx['flags'] & SUP_FLAG) and not (base['flags'] & SUP_FLAG):
        return 'sup'
    dy = idx['origin'][1] - base['origin'][1]
    if dy < -0.8: return 'sup'
    if dy > 0.5:  return 'sub'
    return 'sub'

def assemble_lines(spans):
    lines, cur, cur_body = [], [], None
    for s in spans:
        if s['role'] == 'chrome':
            continue
        idx_like = is_idx(s)
        if cur:
            ref = cur_body or cur[-1]
            y0a, y1a = ref['bbox'][1], ref['bbox'][3]
            y0b, y1b = s['bbox'][1], s['bbox'][3]
            overlap = min(y1a, y1b) - max(y0a, y0b)
            h = max(y1a - y0a, y1b - y0b, 1.0)
            same = (overlap / h) > 0.22
            if not same and idx_like and abs(y0b - y0a) < 8:
                same = True
            if same and s['bbox'][0] < ref['bbox'][0] - 6 and s['bbox'][1] > ref['bbox'][3] - 2:
                same = False
        else:
            same = False
        if same:
            cur.append(s)
            if not idx_like:
                cur_body = s
        else:
            if cur: lines.append(cur)
            cur = [s]
            cur_body = None if idx_like else s
    if cur: lines.append(cur)
    return lines

def line_metrics(line):
    sizes = [s['size'] for s in line if not is_idx(s)] or [s['size'] for s in line]
    body_size = max(sizes)
    x0 = min(s['bbox'][0] for s in line)
    x1 = max(s['bbox'][2] for s in line)
    y0 = min(s['bbox'][1] for s in line)
    y1 = max(s['bbox'][3] for s in line)
    return body_size, x0, x1, y0, y1

def plain_text(line):
    """Text ignoring index roles (for kind classification)."""
    return re.sub(r'\s+', ' ', ''.join(s['text'] for s in line)).strip()

def attach_indices(line):
    """Return new span list with idx spans converted to ^{}/_{} markers
    attached by geometry to the correct base span.
    Two-pass: bases first (stream order), then markers grouped per base —
    an idx span may appear in the stream BEFORE its base."""
    bases = [s for s in line if not is_idx(s)]
    if not bases:
        return line
    after = [[] for _ in bases]
    for s in line:
        if not is_idx(s):
            continue
        ix0, ix1 = s['bbox'][0], s['bbox'][2]
        left = [i for i, b in enumerate(bases) if b['bbox'][2] <= ix0 + 4]
        if left:
            bi = max(left, key=lambda i: bases[i]['bbox'][2])
        else:
            ic = (ix0 + ix1) / 2
            bi = min(range(len(bases)), key=lambda i: abs((bases[i]['bbox'][0] + bases[i]['bbox'][2]) / 2 - ic))
        mark = supsub(s, bases[bi])
        marker = dict(s)
        marker['text'] = f'{"^" if mark == "sup" else "_"}{{{s["text"].strip()}}}'
        marker['role'] = 'attached'
        after[bi].append(marker)
    out = []
    for b, marks in zip(bases, after):
        out.append(b)
        out.extend(marks)
    return out

def line_text(line):
    """Final text: spaces by x-gap, index markers already attached."""
    line = attach_indices(line)
    parts = []
    prev = None
    _, _, _, _, _, = line_metrics(line)
    body_size, *_ = line_metrics(line)
    for s in line:
        if prev is not None and s['role'] != 'attached':
            gap = s['bbox'][0] - prev['bbox'][2]
            need_space = gap > 1.0
            if prev['role'] == 'attached' and s['text'][:1] not in ',.;:!?)]»':
                need_space = True   # word after an index marker
            if need_space and parts and not parts[-1].endswith(' '):
                parts.append(' ')
        parts.append(s['text'])
        prev = s
    t = ''.join(parts)
    return re.sub(r'[ \t]+', ' ', t).strip()

def classify_line(line):
    chars = sum(len(s['text']) for s in line)
    if chars == 0: return 'body'
    math_chars = sum(len(s['text']) for s in line if s['role'] in ('math', 'mathidx'))
    src_chars = sum(len(s['text']) for s in line if s['role'] in ('source', 'srccode'))
    table_chars = sum(len(s['text']) for s in line if s['role'] == 'tabletext')
    roles = [s['role'] for s in line]
    txt = plain_text(line)
    if all(is_idx(s) for s in line) and len(txt) <= 30:
        return 'orphan'
    if 'h1' in roles and chars < 160: return 'h1'
    if 'h2' in roles and chars < 160: return 'h2'
    if table_chars > chars * 0.7: return 'tablerow'
    if src_chars > chars * 0.7: return 'source'
    if math_chars > chars * 0.55: return 'formula'
    if line[0]['role'] == 'bullet' or txt.lstrip().startswith('•'): return 'bullet'
    return 'body'

def table_cells(line):
    """Split a table row line into cells by x-gaps (index markers kept)."""
    spans = attach_indices(line)
    cells, cur = [], []
    prev = None
    body_size, *_ = line_metrics(line)
    for s in spans:
        if prev is not None:
            gap = s['bbox'][0] - prev['bbox'][2]
            if gap > 12:
                cells.append(''.join(x['text'] for x in cur).strip())
                cur = []
        cur.append(s)
        prev = s
    if cur:
        cells.append(''.join(x['text'] for x in cur).strip())
    return [re.sub(r'\s+', ' ', c) for c in cells if c]

def extract(pdf_path):
    doc = fitz.open(pdf_path)
    raw = []          # (pno, line)
    cover = []
    header = {'left': '', 'right': ''}
    for pno, page in enumerate(doc):
        spans = iter_spans(page)
        if pno == 1:
            # capture the running head before skipping the TOC page
            hd = [s for s in spans if s['role'] == 'chrome' and s['bbox'][1] < 55]
            hd.sort(key=lambda s: s['bbox'][0])
            if len(hd) >= 2:
                header = {'left': hd[0]['text'].strip(), 'right': hd[-1]['text'].strip()}
            elif hd:
                header = {'left': hd[0]['text'].strip(), 'right': ''}
        if pno == 0:
            cover = assemble_lines(spans)
            continue
        if pno == 1:
            continue
        for ln in assemble_lines(spans):
            raw.append([pno, ln])

    # --- orphan attachment ---
    merged = []
    pending = []
    def flush_orphans(target_entry):
        if not pending or target_entry is None:
            return
        line = target_entry[1]
        bases = [s for s in line if not is_idx(s)]
        if not bases:
            return
        after = [[] for _ in bases]
        for oline in pending:
            for os_ in oline:
                ix0, ix1 = os_['bbox'][0], os_['bbox'][2]
                left = [i for i, b in enumerate(bases) if b['bbox'][2] <= ix0 + 5]
                if left:
                    bi = max(left, key=lambda i: bases[i]['bbox'][2])
                else:
                    ic = (ix0 + ix1) / 2
                    bi = min(range(len(bases)), key=lambda i: abs((bases[i]['bbox'][0] + bases[i]['bbox'][2]) / 2 - ic))
                mark = supsub(os_, bases[bi])
                marker = dict(os_)
                marker['text'] = f'{"^" if mark == "sup" else "_"}{{{os_["text"].strip()}}}'
                marker['role'] = 'attached'
                after[bi].append(marker)
        new_line = []
        for b, marks in zip(bases, after):
            new_line.append(b)
            new_line.extend(marks)
        target_entry[1] = new_line

    for entry in raw:
        kind = classify_line(entry[1])
        if kind == 'orphan':
            pending.append(entry[1])
            continue
        merged.append(entry)
        if pending:
            flush_orphans(merged[-2] if len(merged) >= 2 else merged[-1])
            pending = []
    if pending and merged:
        flush_orphans(merged[-1])

    # --- heading wrap merge ---
    hd = []
    for entry in merged:
        pno, line = entry
        kind = classify_line(line)
        if hd and kind in ('h1', 'h2') and classify_line(hd[-1][1]) == kind:
            _, _, _, py0, py1 = line_metrics(hd[-1][1])
            _, _, _, y0, y1 = line_metrics(line)
            if 0 <= y0 - py1 < 12:
                sp = line[0]
                gap = dict(sp)
                gap['text'] = ' '
                gap['role'] = 'text'
                gap['bbox'] = [sp['bbox'][0] - 1, sp['bbox'][1], sp['bbox'][0], sp['bbox'][3]]
                hd[-1][1] = hd[-1][1] + [gap] + line
                continue
        if hd and classify_line(hd[-1][1]) in ('h1', 'h2') and kind in ('h1', 'h2'):
            # consecutive headings of different level: keep separate
            pass
        hd.append(entry)
    merged = hd

    def line_bold(line):
        """Share of bold chars among body-text spans of the line."""
        bold = sum(len(s['text']) for s in line if s['role'] == 'textbold')
        tot = sum(len(s['text']) for s in line if s['role'] in ('text', 'textbold'))
        return tot > 0 and bold / tot > 0.6

    # --- emit blocks ---
    blocks = []
    buf = []
    buf_kind = 'body'
    TERM = ('.', ':', ';', '!', '?', '»', ')')

    def flush():
        nonlocal buf, buf_kind
        if not buf:
            return
        # hyphen join across wrapped lines
        texts = []
        for i, (pno, line) in enumerate(buf):
            t = line_text(line)
            if not t:
                continue
            if texts and texts[-1].endswith('-') and (t[:1].islower() or t[:1].isdigit()):
                texts[-1] = texts[-1][:-1] + t
            elif texts:
                texts[-1] += ' ' + t
            else:
                texts.append(t)
        full = texts[0] if texts else ''
        for extra in texts[1:]:
            pass  # already joined
        if buf_kind == 'tablerow':
            rows = []
            for pno, line in buf:
                cells = table_cells(line)
                _, lx0, _, _, _ = line_metrics(line)
                if rows and len(cells) == 1 and lx0 > 100:
                    # wrapped continuation of the last cell (starts past col 1)
                    rows[-1][-1] += ' ' + cells[0]
                else:
                    rows.append(cells)
            blocks.append({'k': 'table', 'rows': rows})
        elif buf_kind == 'bullet':
            blocks.append({'k': 'li', 't': full})
        else:
            is_bold = line_bold(buf[0][1])
            blocks.append({'k': 'p', 'bold': 1 if is_bold else 0, 't': full})
        buf = []

    prev_kind, prev_y1 = None, None
    for entry in merged:
        pno, line = entry
        kind = classify_line(line)
        _, x0, x1, y0, y1 = line_metrics(line)
        if kind in ('h1', 'h2'):
            flush()
            blocks.append({'k': kind, 't': line_text(line)})
            prev_kind, prev_y1 = kind, y1
            continue
        if kind == 'source':
            flush()
            blocks.append({'k': 'src', 't': line_text(line)})
            prev_kind, prev_y1 = kind, y1
            continue
        if kind == 'formula':
            flush()
            blocks.append({'k': 'f', 't': line_text(line)})
            prev_kind, prev_y1 = kind, y1
            continue
        # body / bullet / tablerow
        new_para = False
        if buf:
            gap = y0 - prev_y1
            prev_pno, prev_line = buf[-1]
            prev_bold = line_bold(prev_line)
            cur_bold = line_bold(line)
            if kind != buf_kind:
                new_para = True
            elif buf_kind == 'tablerow':
                new_para = False          # tables never split on gaps
            elif prev_pno != pno:
                # page boundary: continue only mid-sentence with same style
                pt = line_text(prev_line).rstrip()
                if pt.endswith(TERM) or prev_bold != cur_bold:
                    new_para = True
            elif gap > 8:
                new_para = True
            elif prev_bold != cur_bold:
                new_para = True           # bold head ends, regular text begins
        else:
            buf_kind = kind
        if new_para:
            flush()
            buf_kind = kind
        buf.append(entry)
        prev_kind, prev_y1 = kind, y1
    flush()

    # --- h3 & question detection ---
    out = []
    h3_pat = re.compile(r'^\d+\.\d+\.\d+\s+\S')
    q_pat = re.compile(r'^(Упражнение|Практика|Вопрос|Задача|Пример|Савол|Тапшырма|Контрольная|Контрольный вопрос|Exercise|Practice|Problem|Question|Example|Mashq|Topshiriq|Misol|Masala|Amaliyot)\s+(\d+(?:\.\d+)?)?\s*[(.]')
    for b in blocks:
        if b['k'] == 'p':
            t = b['t']
            if h3_pat.match(t) and b.get('bold'):
                b2 = dict(b); b2['k'] = 'h3'
                out.append(b2)
                continue
            m = q_pat.match(t)
            if m and b.get('bold'):
                label = m.group(0).strip().rstrip('(').strip()
                rest = t[m.end():].lstrip()
                # split title (first sentence) from the body
                tm = re.match(r'^([^.?!\s][^.?!]{2,90}[.?!])\s+(.*)$', rest, re.S)
                if tm:
                    out.append({'k': 'q', 'label': label, 'title': tm.group(1), 't': tm.group(2)})
                else:
                    out.append({'k': 'q', 'label': label, 'title': '', 't': rest})
                continue
        out.append(b)
    return cover, out, header

def main():
    pdf_path, out_path = sys.argv[1], sys.argv[2]
    cover, blocks, header = extract(pdf_path)
    data = {'cover': [line_text(l) for l in cover], 'header': header, 'blocks': blocks}
    with open(out_path, 'w') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    kinds = Counter(b['k'] for b in blocks)
    print(f"{pdf_path.split('/')[-1]}: {len(blocks)} blocks {dict(kinds)}")
    print(f"  questions: {sum(1 for b in blocks if b['k']=='q')}, formulas: {kinds.get('f',0)}, tables: {kinds.get('table',0)}")
    print(f"  cover: {[c[:40] for c in data['cover'][:4]]}")

if __name__ == '__main__':
    main()
