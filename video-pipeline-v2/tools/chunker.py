#!/usr/bin/env python3
"""chunker.py — guide text → size-based page chunks (TOC/cover skipped).

Chapter structure is NOT detected here: the LLM emits `section` blocks when
it meets a new major section in its fragment; the assembler renumbers.
Output: <out>.chunks.json = [{idx, pages, text}]
"""
import argparse, json, re

MIN_CH, MAX_CH = 4000, 6000

def is_toc(text):
    return (text.count('. .') + text.count('…')) > 8

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--guide', required=True)
    ap.add_argument('--out', required=True)
    a = ap.parse_args()

    raw = open(a.guide).read()
    parts = re.split(r'=== PAGE (\d+) ===\n', raw)
    pages = []
    for i in range(1, len(parts), 2):
        pages.append((int(parts[i]), parts[i+1]))

    body = []
    for i, (pn, txt) in enumerate(pages):
        if i == 0 and len(txt.strip()) < 600:
            continue                      # cover
        if is_toc(txt) and len(body) < 2:
            continue                      # contents pages
        if re.search(r'TEXTBOOK ·|STUDYGUIDE ·|STUDY GUIDE ·|STUDY COMPANION ·', txt[:400]):
            # header banner page-fragments stay, they carry section titles
            pass
        body.append((pn, txt))

    chunks, cur, cur_len, cur_pages = [], [], 0, []
    for pn, txt in body:
        if cur_len and (cur_len + len(txt) > MAX_CH and cur_len >= MIN_CH):
            chunks.append({'idx': len(chunks), 'pages': cur_pages,
                           'text': '\n'.join(cur)})
            cur, cur_len, cur_pages = [], 0, []
        cur.append(txt); cur_pages.append(pn); cur_len += len(txt)
    if cur:
        if cur_len < 1200 and chunks:   # merge tiny tail into previous
            chunks[-1]['text'] += '\n' + '\n'.join(cur)
            chunks[-1]['pages'] += cur_pages
        else:
            chunks.append({'idx': len(chunks), 'pages': cur_pages,
                           'text': '\n'.join(cur)})

    json.dump({'chunks': chunks}, open(a.out, 'w'), ensure_ascii=False)
    tot = sum(len(c['text']) for c in chunks)
    print(f"{a.guide.split('/')[-1]}: {len(pages)} стр → {len(chunks)} чанков "
          f"({tot} симв, ср {tot//max(1,len(chunks))})")

if __name__ == '__main__':
    main()
