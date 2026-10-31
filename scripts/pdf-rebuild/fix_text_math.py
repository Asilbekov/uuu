#!/usr/bin/env python3
"""fix_text_math.py — demote natural-language runs from math mode to text.

The 15 text-subject guides (CS/History/ITE/English) were built by the
math-oriented texify: English/Uzbek words (We, If, Bu, o'nta...), question
labels (S1, T6, P1...), abbreviations (TED, QR, CS50, EAP B1, PF-5775),
option letters (a), b)...), number+unit pairs (96 km, 18 Vt), hex literals
(0x77) and torn filename/citation fragments landed in \\(..\\) runs and
render in Computer Modern math italic in the middle of DejaVu Serif text.

The v1 originals of these guides are ReportLab text documents — they had no
math at all.  So the rule is: a \\(..\\) run is kept as math ONLY if it
carries real math: a TeX command (\\cdot, \\leq, \\frac...), an operator
(= < > + and the unicode operator set) or a super/sub marker (^ _).
Everything else — words, labels, numbers, units, parens, commas, slashes,
dashes — is plain text and gets demoted.

TeX specials still needing escape in text mode are escaped on demotion
(~ -> \\textasciitilde{}; % # $ & are impossible without a backslash and
^ _ & { } force the run to stay math).

Usage: fix_text_math.py [--apply] [key ...]
Without --apply: report only. Default keys: the 15 text guides in work/.
"""
import re, sys, os

WORK = '/home/z/my-project/work'
FILES = ['cs47_en','cs47_ru','cs47_uz','ee14_en','ee57_en',
         'hi14_ru','hi14_en','hi14_uz','hi56_ru','hi56_en','hi56_uz',
         'ie14_ru','ie57_ru','ie57_en','ie57_uz']

RUN = re.compile(r'\\\(([^\\\n]{1,160})\\\)')

# a run is REAL math only if it contains one of these
MATHY = re.compile(r'[\\=<>+^_&]')

def demote(inner):
    """Return the text replacement if the run should be plain text, else None."""
    s = inner.strip()
    if not s:
        return None
    if MATHY.search(s):
        # quoted worksheet titles carry '+' but are text: 'C++ BUG HUNT'
        if re.fullmatch(r'[A-Za-z]{1,2}\+\+( [A-Z]{2,8}){1,3}', s):
            return s
        # source-note keys: 'BUG 1 +' (c-bug-hunt worksheet reference)
        if re.fullmatch(r'BUG \d{1,2} \+', s):
            return s
        return None
    return s

def escape_text(s):
    return s.replace('~', r'\textasciitilde{}')

def patch_tex(tex):
    n = [0]
    def repl(m):
        r = demote(m.group(1))
        if r is None:
            return m.group(0)
        n[0] += 1
        lead = ' ' if m.group(1)[:1].isspace() else ''
        trail = ' ' if m.group(1)[-1:].isspace() else ''
        return lead + escape_text(r) + trail
    out = RUN.sub(repl, tex)
    return out, n[0]

def main():
    do_apply = '--apply' in sys.argv
    keys = [a for a in sys.argv[1:] if not a.startswith('--')] or FILES
    total = 0
    for key in keys:
        path = f'{WORK}/{key}.tex'
        if not os.path.exists(path):
            print(f'{key}: MISSING')
            continue
        tex = open(path).read()
        out, n = patch_tex(tex)
        total += n
        if do_apply and n:
            open(path, 'w').write(out)
        print(f'{key}: {"demoted" if do_apply else "would demote"} {n}')
    print(f'TOTAL: {total} runs {"demoted" if do_apply else "to demote"}')

if __name__ == '__main__':
    main()
