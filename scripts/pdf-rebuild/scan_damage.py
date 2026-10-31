#!/usr/bin/env python3
"""Scan extracted JSON for scrambled/damaged formula blocks (LA/Math guides)."""
import json, re, sys

path = sys.argv[1] if len(sys.argv) > 1 else '/home/z/my-project/work/la57_ru.json'
d = json.load(open(path))
blocks = d['blocks']

print('=== A. Blocks starting with an index marker (orphan at start) ===')
for i, b in enumerate(blocks):
    t = b.get('t', '')
    if re.match(r'^[\^_]\{', t):
        print(f'{i:4} {b["k"]:3} {t[:100]}')

print('\n=== B. Double markers (sup after sup / sub after sub) ===')
for i, b in enumerate(blocks):
    t = b.get('t', '')
    if re.search(r'\^\{[^}]*\}\s*[\^_]\{|_\{[^}]*\}\s*_\{', t):
        print(f'{i:4} {b["k"]:3} {t[:100]}')

print('\n=== C. Ellipsis near E (LU chains) ===')
for i, b in enumerate(blocks):
    t = b.get('t', '')
    if '\u00b7\u00b7\u00b7' in t and 'E' in t:
        print(f'{i:4} {b["k"]:3} {t[:110]}')

print('\n=== D. Formula blocks that are bare index lines (digits only) ===')
for i, b in enumerate(blocks):
    t = b.get('t', '')
    if b['k'] == 'f' and re.fullmatch(r'[\s0-9,.\-−^_{}]+', t) and len(t) < 40:
        print(f'{i:4} {b["k"]:3} {t[:80]}')

print('\n=== E. Short weird paragraphs (<25 chars, not headings) ===')
for i, b in enumerate(blocks):
    t = b.get('t', '')
    if b['k'] == 'p' and 0 < len(t) < 25 and not re.search(r'[а-яА-Яa-zA-Z]{4}', t):
        print(f'{i:4} {b["k"]:3} {t[:60]!r}')

print('\n=== F. Markers adjacent without base (}{ patterns) ===')
for i, b in enumerate(blocks):
    t = b.get('t', '')
    if re.search(r'\}\s*[\^_]\{[^}]*\}\s*[\^_]\{', t):
        print(f'{i:4} {b["k"]:3} {t[:110]}')
