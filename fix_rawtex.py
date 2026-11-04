#!/usr/bin/env python3
"""fix_rawtex.py — make raw LaTeX in TEXT fields engine-safe (v3, env-aware).

Engine renders text fields via mathSplit(): $...$ and \\begin{env}...\\end{env}
fragments are TeXified; bare \\frac/\\cdot in text would show raw and fail the
render-time raw_latex_on_screen check.

v3 rules:
  1. \\begin{env}...\\end{env} fragments are PROTECTED verbatim (\\frac inside
     an env is valid LaTeX — mathSplit ships the whole env to KaTeX).
  2. outside envs: symbol commands → Unicode (\\cdot → ·, ...); structural
     commands (\\frac, \\sqrt) wrapped in $...$.
  3. inside envs: strip stray $-pairs around \\frac/\\sqrt (repairs the v2
     bug that broke envs by injecting $).
"""
import json, re, sys

SYM = {'\\cdot': '·', '\\times': '×', '\\pm': '±', '\\leq': '≤', '\\le': '≤',
       '\\geq': '≥', '\\ge': '≥', '\\approx': '≈', '\\neq': '≠', '\\ne': '≠',
       '\\to': '→', '\\rightarrow': '→', '\\leftarrow': '←', '\\degree': '°'}

ENV_RE = re.compile(r'\\begin\{([a-zA-Z*]+)\}[\s\S]{0,900}?\\end\{\1\}')

def fix_outside(s: str) -> str:
    s = s.replace(chr(0xFFFD), '≈')
    for k in sorted(SYM, key=len, reverse=True):
        s = s.replace(k, SYM[k])
    s = re.sub(r'(?<!\$)\\frac((?:\{(?:[^{}]|\{[^{}]*\})*\})+)(?!\$)',
               lambda m: '$\\frac' + m.group(1) + '$', s)
    s = re.sub(r'(?<!\$)\\sqrt\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}(?!\$)',
               lambda m: '$\\sqrt{' + m.group(1) + '}$', s)
    return s

def fix_inside_env(s: str) -> str:
    # repair v2 damage: $...$ pairs injected around \frac/\sqrt inside envs
    s = re.sub(r'\$(\\(?:frac|sqrt)(?:\{[^{}]*\})+)\$', r'\1', s)
    # stray $ right after \begin{env} or right before \end{env}
    s = re.sub(r'(\\begin\{[a-zA-Z*]+\})\s*\$', r'\1', s)
    s = re.sub(r'\$\s*(\\end\{[a-zA-Z]*\})', r'\1', s)
    s = re.sub(r'(?:\\\\|\$)?\s*\\(\\)\s*(\\end\{[a-zA-Z]*\})', r'\2', s)
    s = re.sub(r'\\\\\s*(\\end\{[a-zA-Z]*\})', r'\1', s)
    return s

def fix_text(s: str) -> str:
    if not isinstance(s, str):
        return s
    if chr(0xFFFD) in s:
        s = s.replace(chr(0xFFFD), '≈')
    if '\\' not in s:
        return s
    parts = []
    last = 0
    for m in ENV_RE.finditer(s):
        if m.start() > last:
            parts.append(fix_outside(s[last:m.start()]))
        parts.append(fix_inside_env(m.group(0)))
        last = m.end()
    if last < len(s):
        parts.append(fix_outside(s[last:]))
    return ''.join(parts)

TEXT_KEYS = {'heading', 'text', 'problem', 'result', 'note', 'who', 'subtitle',
             'title', 'year', 'label'}

def walk(o):
    if isinstance(o, dict):
        for k, v in list(o.items()):
            if k in TEXT_KEYS and isinstance(v, str):
                o[k] = fix_text(v)
            elif k in ('bullets', 'items') and isinstance(v, list):
                o[k] = [fix_text(x) if isinstance(x, str) else x for x in v]
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
