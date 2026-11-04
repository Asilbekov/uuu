#!/usr/bin/env python3
"""fix_rawtex.py — make raw LaTeX in TEXT fields engine-safe.

Engine renders text fields (bullets, steps, problem, ...) via mathSplit():
only $...$ and \\begin{env}...\\end{env} fragments are TeXified; bare
\\frac{..}{..} or \\cdot would show as raw source and fail the render-time
raw_latex_on_screen check. This pass:
  1. replaces symbol commands with Unicode in text fields (\\cdot → ·, ...)
  2. wraps structural commands (\\frac, \\sqrt, \\sum, \\int) in $...$
Fields that are rendered directly as TeX (formula/matrix 'tex', table cell
tex dicts) are left untouched.
"""
import json, re, sys

SYM = {'\\cdot': '·', '\\times': '×', '\\pm': '±', '\\leq': '≤', '\\le': '≤',
       '\\geq': '≥', '\\ge': '≥', '\\approx': '≈', '\\neq': '≠', '\\ne': '≠',
       '\\to': '→', '\\rightarrow': '→', '\\leftarrow': '←', '\\degree': '°',
       '\\cdot ': '· '}

STRUCT = re.compile(r'\\(frac|sqrt|sum|int|prod)\b')

def already_math(s: str) -> bool:
    # rough: does this string live inside $..$ or \begin{env}..\end{env}?
    return False

def fix_text(s: str) -> str:
    if not isinstance(s, str) or '\\' not in s:
        return s
    # protect existing $...$ spans
    parts = re.split(r'(\$[^$]*\$)', s)
    out = []
    for p in parts:
        if p.startswith('$') and p.endswith('$') and len(p) > 1:
            out.append(p)
            continue
        # wrap \begin{env}...\end{env} blocks in $...$ if bare
        p = re.sub(r'(?<!\$)(\\begin\{(bmatrix|pmatrix|vmatrix|matrix|cases|array)\}.*?\\end\{\2\})(?!\$)',
                   lambda m: m.group(1) if '$' in m.group(1) else '$' + m.group(1) + '$',
                   p, flags=re.S)
        # symbol commands → Unicode
        for k in sorted(SYM, key=len, reverse=True):
            p = p.replace(k, SYM[k])
        # structural commands → wrap in $...$
        if STRUCT.search(p):
            def wrap(m):
                return '$' + m.group(0) + '$'
            p = re.sub(r'\\frac\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}',
                       lambda m: '$' + m.group(0) + '$', p)
            p = re.sub(r'\\sqrt\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}',
                       lambda m: '$' + m.group(0) + '$', p)
        out.append(p)
    res = ''.join(out)
    # collapse accidental doubles
    res = res.replace('$$', '').replace('$ $', ' ')
    return res

TEXT_KEYS = {'heading', 'text', 'problem', 'result', 'note', 'who', 'subtitle',
             'title', 'year', 'label'}

def walk(o):
    if isinstance(o, dict):
        for k, v in list(o.items()):
            if k in TEXT_KEYS and isinstance(v, str):
                o[k] = fix_text(v)
            elif k == 'bullets' and isinstance(v, list):
                o[k] = [fix_text(x) if isinstance(x, str) else (walk(x) if isinstance(x, (dict, list)) else x) for x in v]
            elif k == 'items' and isinstance(v, list):
                o[k] = [fix_text(x) if isinstance(x, str) else (walk(x) if isinstance(x, (dict, list)) else x) for x in v]
            elif k in ('steps', 'events', 'parts', 'functions') and isinstance(v, list):
                o[k] = [walk(x) if isinstance(x, (dict, list)) else x for x in v]
            elif isinstance(v, (dict, list)):
                walk(v)
        return o
    elif isinstance(o, list):
        for x in o:
            walk(x)
        return o
    return o

def main(spec_path):
    d = json.load(open(spec_path))
    before = json.dumps(d, ensure_ascii=False)
    # skip title/outro synthetic blocks? they're text too — walk everything
    walk(d.get('chapters', []))
    after = json.dumps(d, ensure_ascii=False)
    if before != after:
        json.dump(d, open(spec_path, 'w'), ensure_ascii=False, indent=1)
        print(f'{spec_path}: FIXED')
    else:
        print(f'{spec_path}: clean')

if __name__ == '__main__':
    for p in sys.argv[1:]:
        main(p)
