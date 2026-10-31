#!/usr/bin/env python3
"""verify_final.py — full verification of the 15 rebuilt text-subject guides.

Checks per guide (vs the repo originals in uuu/study-guides/):
  - pages, tofu (U+FFFD), blank pages
  - top font size + share (uniformity) and #sizes
  - CM-math font share (natural-language text wrongly in math italic)
  - S/T question-label counts preserved from the original
  - content length ratio (chars)
"""
import fitz, re, collections, os

WORK = '/home/z/my-project/work'
ORIG = '/home/z/my-project/uuu/study-guides'

KEYS = ['cs47_en','cs47_ru','cs47_uz','ee14_en','ee57_en',
        'hi14_ru','hi14_en','hi14_uz','hi56_ru','hi56_en','hi56_uz',
        'ie14_ru','ie57_ru','ie57_en','ie57_uz']

NAMES = {
    'cs47_en':'Computer_Science_C_Programming_Weeks_4-7_EN.pdf',
    'cs47_ru':'Computer_Science_C_Programming_Weeks_4-7_RU.pdf',
    'cs47_uz':'Computer_Science_C_Programming_Weeks_4-7_UZ.pdf',
    'ee14_en':'English_for_Engineering_I_Weeks_1-4_Rules_Questions_Answers.pdf',
    'ee57_en':'English_for_Engineering_I_Weeks_5-7.pdf',
    'hi14_ru':'History_of_Uzbekistan_Weeks_1-4_RU.pdf',
    'hi14_en':'History_of_Uzbekistan_Weeks_1-4_EN.pdf',
    'hi14_uz':'History_of_Uzbekistan_Weeks_1-4_UZ.pdf',
    'hi56_ru':'History_of_Uzbekistan_Weeks_5-6_RU.pdf',
    'hi56_en':'History_of_Uzbekistan_Weeks_5-6_EN.pdf',
    'hi56_uz':'History_of_Uzbekistan_Weeks_5-6_UZ.pdf',
    'ie14_ru':'Introduction_to_Engineering_Weeks_1-4_RU.pdf',
    'ie57_ru':'Introduction_to_Engineering_Weeks_5-7_RU.pdf',
    'ie57_en':'Introduction_to_Engineering_Weeks_5-7_EN.pdf',
    'ie57_uz':'Introduction_to_Engineering_Weeks_5-7_UZ.pdf',
}

def full_text(path):
    d = fitz.open(path)
    t = ' '.join(d[p].get_text() for p in range(len(d)))
    return re.sub(r'\s+', ' ', t)

def metrics(path, max_pages=None):
    doc = fitz.open(path)
    sizes = collections.Counter(); fonts = collections.Counter()
    tofu = 0; blank = []
    for pno in range(len(doc)):
        t = doc[pno].get_text()
        tofu += t.count('\ufffd')
        if len(t.strip()) < 20 and pno > 1:
            blank.append(pno + 1)
        if max_pages and pno >= max_pages:
            continue
        for block in doc[pno].get_text('dict')['blocks']:
            if block.get('type') != 0: continue
            for line in block['lines']:
                for span in line['spans']:
                    txt = span['text'].strip()
                    if txt:
                        sizes[round(span['size'],1)] += len(txt)
                        base = span['font'].split('+')[-1]
                        fam = 'CM' if base.startswith(('CM','cm')) else base
                        fonts[fam] += len(txt)
    total = sum(sizes.values()) or 1
    top = sizes.most_common(1)[0]
    cm = fonts.get('CM', 0)
    return (len(doc), tofu, blank, top[0], round(100*top[1]/total, 1),
            len(sizes), round(100*cm/total, 1))

def qcount(text):
    return len(re.findall(r'\b[ST]\d{1,2}[.)]', text))

print(f"{'key':10s} {'pgs':>4s} {'tofu':>4s} {'top':>5s} {'share':>6s} {'sz#':>3s} {'CM%':>5s} {'S/T orig':>8s} {'S/T new':>7s} {'len ratio':>9s}")
for k in KEYS:
    new = f'{WORK}/{k}.pdf'
    orig = f'{ORIG}/{NAMES[k]}'
    p, tofu, blank, top, share, nsz, cm = metrics(new)
    so, sn = qcount(full_text(orig)), qcount(full_text(new))
    lo, ln = len(full_text(orig)), len(full_text(new))
    ratio = round(ln / lo, 3) if lo else 0
    flags = ''
    if tofu: flags += ' TOFU!'
    if blank: flags += f' BLANK{blank}'
    if sn < so * 0.9: flags += ' Q-LOSS!'
    if not (0.95 <= ratio <= 1.05): flags += ' LEN!'
    print(f'{k:10s} {p:4d} {tofu:4d} {top:5.1f} {share:5.1f}% {nsz:3d} {cm:4.1f}% {so:8d} {sn:7d} {ratio:9.3f}{flags}')
