#!/usr/bin/env python3
"""fix_table_widths.py — rescale too-wide table column specs in .tex files.

The 11:06 translation builds (ie57_en, ie57_uz) predate the tabcolsep fix:
their p{W\linewidth} column widths sum to ~0.93-0.95 but the inner
\tabcolsep gaps (2 x 5.4pt per gap at \small) push the table past the right
margin. Scale every column of an over-wide tabular by
f = (\linewidth - 2*tabcolsep*(ncols-1)) / (sum_of_widths * \linewidth).
"""
import re, sys

TABSEP_SMALL = 5.4   # \tabcolsep at \small (6pt * 0.9)
LINEWIDTH = 465.0    # A4 595.28 - 2 * 65.2pt margins

SPEC = re.compile(
    r'\\begin\{(?:tabular|longtable)\}\{(@\{\}.*?)((?:>\{\\raggedright\\arraybackslash\}p\{([0-9.]+)\\linewidth\})+)(@\{\})?\}'
)

def fix_file(path):
    tex = open(path).read()
    out = []
    pos = 0
    nfix = 0
    for m in SPEC.finditer(tex):
        raw = re.findall(r'p\{([0-9.]+)\\linewidth\}', m.group(0))
        widths = [float(w) for w in raw]
        ncols = len(widths)
        if not ncols:
            continue
        total_pt = sum(widths) * LINEWIDTH
        sep_pt = 2 * TABSEP_SMALL * (ncols - 1)
        avail = LINEWIDTH - sep_pt
        if total_pt <= avail + 0.5:
            continue
        f = avail / total_pt
        new_block = m.group(0)
        for r in raw:
            dec = max(3, len(r.split('.')[1]) if '.' in r else 1)
            new_w = f'{float(r) * f:.{dec}f}'.rstrip('0').rstrip('.') or '0'
            if new_w == r:
                new_w = f'{float(r) * f:.{dec + 1}f}'
            new_block = new_block.replace(f'p{{{r}\\linewidth}}', f'p{{{new_w}\\linewidth}}', 1)
        out.append(tex[pos:m.start()])
        out.append(new_block)
        pos = m.end()
        nfix += 1
    out.append(tex[pos:])
    open(path, 'w').write(''.join(out))
    return nfix

if __name__ == '__main__':
    for p in sys.argv[1:]:
        print(p, 'tables fixed:', fix_file(p))
