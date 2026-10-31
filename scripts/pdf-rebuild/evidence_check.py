#!/usr/bin/env python3
"""Evidence check: does the CURRENT repo PDF still contain broken math?
Markers of the original complaint:
  - tofu squares U+25A1 / U+FFFD (missing bracket glyphs)
  - text vectors [2; 2; 6; 3]
  - text sqrt 'sqrt('
  - flattened powers a2+b2 (no superscript)
  - raw LaTeX leaks: \frac, \begin{bmatrix}
"""
import fitz, re, glob

MARKERS = {
    'tofu □': lambda t: t.count('□') + t.count('\ufffd'),
    'vec [a; b]': lambda t: len(re.findall(r'\[[-−0-9.]+;\s*[-−0-9.]+', t)),
    'sqrt(...)_text': lambda t: len(re.findall(r'sqrt\s*\(', t)),
    'raw \\frac': lambda t: t.count('\\frac'),
    'raw bmatrix': lambda t: t.count('bmatrix'),
    'slash-fracs a/b': lambda t: len(re.findall(r'(?<![\w.])\d+/\d+(?![\w.])', t)),
}

for pdf in sorted(glob.glob('/home/z/my-project/uuu/study-guides/Math_I_Weeks*_RU.pdf') +
                  glob.glob('/home/z/my-project/uuu/study-guides/Linear_Algebra_I_Weeks*_RU.pdf')):
    d = fitz.open(pdf)
    counts = {k: 0 for k in MARKERS}
    examples = {}
    for pno, pg in enumerate(d):
        t = pg.get_text()
        for k, fn in MARKERS.items():
            n = fn(t)
            if n:
                counts[k] += n
                if k not in examples:
                    # find a concrete line
                    for line in t.splitlines():
                        if fn(line):
                            examples[k] = f"p{pno+1}: {line.strip()[:90]}"
                            break
    name = pdf.split('/')[-1]
    print(f"\n=== {name} ({len(d)} стр.) ===")
    for k, v in counts.items():
        print(f"   {k:16} : {v}   {examples.get(k, '')[:100]}")
    d.close()
