#!/usr/bin/env python3
"""texify.py v2 — convert extracted block text to LaTeX.

  1. Matrices/vectors [a b; c d], [x; y], [a b | c] -> bmatrix placeholders.
  2. Token walk; mathy runs -> \\(..\\). Run continues across ',' ';' when the
     next token is mathy, and absorbs tokens while parens stay unbalanced.
  3. Math tokens: latin singles, ALL-CAPS <=4 (AB, LU, PLU), Upper+lower 2-char
     (Ax), FUNCS (det, rank, span...), digits, operators, greek, math unicode,
     markers ^{..} _{..}, matrix placeholders.
  4. Unicode -> LaTeX commands (with trailing space: \\times , \\mathbb{R} ).
  5. √(x) -> \\sqrt{x}; numeric a/b -> \\frac{a}{b}; Cyrillic in display
     formulas -> \\text{..}; text runs: escape specials.
"""
import re

GREEK = {'α':'\\alpha ','β':'\\beta ','γ':'\\gamma ','δ':'\\delta ','ε':'\\varepsilon ','η':'\\eta ',
         'θ':'\\theta ','λ':'\\lambda ','μ':'\\mu ','ν':'\\nu ','π':'\\pi ','ρ':'\\rho ',
         'σ':'\\sigma ','τ':'\\tau ','φ':'\\varphi ','ω':'\\omega ','Σ':'\\Sigma ',
         'Δ':'\\Delta ','Λ':'\\Lambda ','Γ':'\\Gamma ','Ω':'\\Omega ','Π':'\\Pi '}
SYMS = {'−':'-','·':'\\cdot ','×':'\\times ','≤':'\\leq ','≥':'\\geq ','≠':'\\neq ',
        '←':'\\leftarrow ','→':'\\rightarrow ','↔':'\\leftrightarrow ',
        '∑':'\\sum ','∏':'\\prod ','√':'\\sqrt ','∞':'\\infty ','∥':'\\lVert ',
        '⋯':'\\cdots ','…':'\\ldots ','≈':'\\approx ','∈':'\\in ','∉':'\\notin ',
        '∪':'\\cup ','∩':'\\cap ','⊂':'\\subset ','⊆':'\\subseteq ','∅':'\\varnothing ',
        '∀':'\\forall ','∃':'\\exists ','∘':'\\circ ','⊥':'\\perp ','±':'\\pm ',
        '⇒':'\\Rightarrow ','⇐':'\\Leftarrow ','⇔':'\\Leftrightarrow ',
        '⟹':'\\Longrightarrow ','⟸':'\\Longleftarrow ','⟺':'\\iff ',
        '⟶':'\\longrightarrow ','⟵':'\\longleftarrow ',
        'ℝ':'\\mathbb{R} ','ℕ':'\\mathbb{N} ','ℤ':'\\mathbb{Z} ','ℂ':'\\mathbb{C} ',
        '′':"'",'°':'^\\circ '}
FUNCS = {'det','rank','span','null','dim','tr','rref','ref','lu','ldu','sin','cos',
         'tan','exp','ln','log','max','min','sup','inf','ker','im','col','row',
         'proj','dist','norm','diag','trace','adj','codim','card','argmin','argmax',
         'lcm','gcd','gcd','lcm','mod','sgn','vec','id','Id','sqrt','lim','arctan','sec','csc','cot'}

TOKEN = re.compile(
    r'\u27e6M\d+\u27e7'                       # matrix placeholder
    r'|\^\{(?:[^{}]|\{[^{}]*\})+\}|_\{(?:[^{}]|\{[^{}]*\})+\}'  # sup/sub markers (one nesting level)
    r'|\.\.\.'                               # ellipsis (math continuation)
    r'|[0-9]+[A-Za-z]{1,2}\b'                 # 3D, 2D — not math
    r'|[A-Za-z\u00c0-\u017f]+[\u0300-\u036f\u20d0-\u20df\u02bb\u02bc\u2019\']*[\u0300-\u036f\u20d0-\u20df\u02bb\u02bc\u2019\'A-Za-z\u00c0-\u017f]*'  # word (combining marks, UZ oʻ/gʻ, possessives, extended Latin like Sträng)
    r'|[0-9]+(?:[.,][0-9]+)?'
    r'|[\u0370-\u03ff\u2100-\u214f]'
    r'|[=+<>≤≥≠←→↔∑∏√∞∥⋯…≈∈∉∪∩⊂⊆∅∀∃∘⊥±⇒⇐⇔·×−–]'
    r'|[()\[\]{}|,;:.!?/\']'
    r'|\s+'
    r'|.')

COMBINE = {'\u0304': '\\bar{', '\u0302': '\\hat{', '\u0307': '\\dot{', '\u0308': '\\ddot{', '\u0303': '\\tilde{', '\u20d7': '\\vec{'}

FUNC_MAP = {'sin':'\\sin ','cos':'\\cos ','tan':'\\tan ','ln':'\\ln ','log':'\\log ',
            'exp':'\\exp ','lim':'\\lim ','max':'\\max ','min':'\\min ',
            'det':'\\det ','rank':'\\mathrm{rank} ','span':'\\mathrm{span} ',
            'dim':'\\dim ','sqrt':'\\sqrt ','inf':'\\inf ','sup':'\\sup '}


def repair_interleaved_frac(tex):
    """Torn stacked fractions: runs of 3+ adjacent markers with no base.
    Parts concatenate: ^{x}_{x}^{+2}_{-1} -> \\frac{x+2}{x-1}."""
    def run_repl(m):
        parts = re.findall(r'([\^_])\{([^}]*)\}', m.group(0))
        if len(parts) < 3:
            return m.group(0)
        sups = ''.join(p[1] for p in parts if p[0] == '^').strip()
        subs = ''.join(p[1] for p in parts if p[0] == '_').strip()
        if not sups or not subs:
            if sups:
                return '^{' + sups + '}'
            return '_{' + subs + '}'
        return '\\frac{' + sups + '}{' + subs + '}'
    return re.sub(r'(?<![\w}\)])(?:[\^_]\{[^}]*\}\s*){2,}', run_repl, tex)

def is_math_token(tok):
    if not tok or tok.isspace():
        return False
    if re.fullmatch(r'\u27e6M\d+\u27e7', tok): return True
    if re.fullmatch(r'[\^_]\{(?:[^{}]|\{[^{}]*\})+\}', tok): return True
    if tok == '...': return True
    if re.fullmatch(r'[A-Za-z]+', tok):
        if len(tok) == 1: return True
        if tok in FUNCS: return True
        if len(tok) <= 4 and tok.isupper(): return True        # AB, LU, PLU, LDLT
        if len(tok) == 2 and tok[0].isupper() and tok[1].islower(): return True  # Ax
        return False
    if re.fullmatch(r'[A-Za-z][\u0300-\u036f\u20d0-\u20df]', tok): return True  # z-with-macron
    if re.fullmatch(r'[0-9]+(?:[.,][0-9]+)?', tok): return True
    if tok in ('−', '–'): return True
    if tok and (0x370 <= ord(tok[0]) <= 0x3ff or 0x2100 <= ord(tok[0]) <= 0x214f): return True
    if tok in '=+<>≤≥≠←→↔∑∏√∞∥⋯…≈∈∉∪∩⊂⊆∅∀∃∘⊥±⇒⇐⇔·×': return True
    if tok in '()|,/[]':
        if TEXT_BRACKETS and tok in '[]':
            return False
        return True
    return False

UNI_MAP = dict(GREEK)
UNI_MAP.update(SYMS)
UNI_MAP.update({'−': '-', '–': '-', 'θ': '\\theta ', 'ε': '\\varepsilon ',
                'φ': '\\varphi ', 'ρ': '\\rho ', 'τ': '\\tau ', 'σ': '\\sigma ',
                'δ': '\\delta ', 'α': '\\alpha ', 'β': '\\beta ', 'γ': '\\gamma ',
                'λ': '\\lambda ', 'μ': '\\mu ', 'ω': '\\omega ', '·': '\\cdot ',
                '×': '\\times ', '∞': '\\infty ', '≤': '\\leq ', '≥': '\\geq ',
                '≠': '\\neq ', '→': '\\rightarrow ', '√': '\\sqrt ',
                '⇒': '\\Rightarrow ', '⇔': '\\Leftrightarrow ', '∈': '\\in ',
                '∪': '\\cup ', '∩': '\\cap ', '∅': '\\varnothing ',
                '∑': '\\sum ', '∥': '\\lVert ', '′': "'",
                '\u2126': '\\Omega ', '\u016a': '\\bar{U}', '\u016b': '\\bar{u}',
                'ä': '\\"a', 'ö': '\\"o', 'ü': '\\"u', 'å': '\\aa ', 'é': "\\'e"})


def map_math_token(tok):
    # sup/sub marker: convert unicode greek/operators inside the braces
    # (a literal π inside ^{...} lands in cmmi8 which has no such glyph)
    m = re.fullmatch(r'([\^_])\{(.*)\}', tok, re.S)
    if m:
        inner = ''.join(UNI_MAP.get(c, c) for c in m.group(2))
        return m.group(1) + '{' + inner + '}'
    # letter + combining mark: z\u0304 -> \bar{z}
    m = re.fullmatch(r'([A-Za-z])([\u0300-\u036f\u20d0-\u20df])', tok)
    if m and m.group(2) in COMBINE:
        return COMBINE[m.group(2)] + m.group(1) + '}'
    if tok in FUNC_MAP: return FUNC_MAP[tok]
    if tok in GREEK: return GREEK[tok]
    if tok in SYMS: return SYMS[tok]
    if tok in UNI_MAP: return UNI_MAP[tok]
    if tok == '−': return '-'
    return tok

CELL_TOKEN = re.compile(r'[-+]?[0-9]+(?:[.,][0-9]+)?|[A-Za-z]+|[\u0370-\u03ff\u2100-\u214f=+·×−–≤≥≠←→±√∞⋯…]')
def math_cell(c):
    """Convert one matrix cell to LaTeX."""
    c = c.replace('−', '-').replace('–', '-')
    out = []
    for t in CELL_TOKEN.findall(c):
        out.append(map_math_token(t))
    joined = ' '.join(x for x in out if x).strip()
    joined = re.sub(r'-\s+(\d)', r'-\1', joined)   # attach stray signs: - 2 -> -2
    return joined

def protect_matrices(s):
    """Replace matrix/vector/augmented patterns with placeholders."""
    mats = []
    pat = re.compile(r'\[([^\[\]{}]*)\]')
    keeps = []
    for m in pat.finditer(s):
        inner = m.group(1)
        # skip anything containing Cyrillic (citations, notes) unless augmented
        has_cyr = bool(re.search(r'[А-Яа-яЁё]', inner))
        rows_raw = [r.strip() for r in inner.split(';')]
        def cell_ok(c):
            return re.fullmatch(r'[−\-+]?[0-9A-Za-z.\u0370-\u03ff\u2100-\u214f ]*(?:\^|\_)?\{?[0-9A-Za-z., −\-+·×]*\}?', c) is not None and c != ''
        if len(rows_raw) > 1:
            keep = all(re.fullmatch(r'[−\-+]?[\w.]+(?: [\w.−+-]+)*', r) or '|' in r for r in rows_raw if r) and not has_cyr
        else:
            flat = inner.split()
            keep = (len(flat) >= 2 and not has_cyr and
                    all(re.fullmatch(r'[−\-+]?[\w.]+', f) for f in flat))
        if '|' in inner and re.search(r'[0-9−]', inner) and len(rows_raw) >= 2:
            keep = True
        if keep:
            keeps.append((m.start(), m.end(), inner))
    res = s
    for st, en, inner in reversed(keeps):
        texrows = []
        for r in [r.strip() for r in inner.split(';')]:
            if '|' in r:
                lft, rgt = r.split('|', 1)
                texrows.append(' & '.join([math_cell(c) for c in lft.split()] + ['\\vert'] + [math_cell(c) for c in rgt.split()]))
            else:
                texrows.append(' & '.join(math_cell(c) for c in r.split()))
        tex = r'\begin{bmatrix} ' + r' \\ '.join(texrows) + r' \end{bmatrix}'
        res = res[:st] + f'\u27e6M{len(mats)}\u27e7' + res[en:]
        mats.append(tex)
    return res, mats

def math_run_to_tex(run):
    """Convert a mathy token run to LaTeX body (inside \\( \\))."""
    toks = [t for t in TOKEN.findall(run)]
    out = []
    i = 0
    while i < len(toks):
        t = toks[i]
        if t == '√':
            j = i + 1
            while j < len(toks) and toks[j].isspace(): j += 1
            if j < len(toks) and toks[j] == '(':
                depth = 0; k = j
                while k < len(toks):
                    if toks[k] == '(': depth += 1
                    elif toks[k] == ')':
                        depth -= 1
                        if depth == 0: break
                    k += 1
                inner = math_run_to_tex(''.join(toks[j+1:k]))
                out.append(f'\\sqrt{{{inner}}}')
                i = k + 1
                continue
            else:
                base = ''
                if j < len(toks):
                    base = map_math_token(toks[j])
                    if j + 1 < len(toks) and re.fullmatch(r'[\^_]\{[^}]*\}', toks[j+1]):
                        base += toks[j+1]; j += 1
                out.append(f'\\sqrt{{{base}}}')
                i = j + 1
                continue
        if t == '∥':
            out.append('\\lVert ')
            i += 1
            continue
        out.append(map_math_token(t) if not t.isspace() else ' ')
        i += 1
    tex = ''.join(out)
    tex = tex.replace('%', r'\%')
    tex = tex.replace('$', r'\$')   # literal dollar inside math runs
    tex = re.sub(r'\\sqrt\s*\(([^()]*)\)', r'\\sqrt{\1}', tex)
    tex = re.sub(r'(?<![\\\w{}])(\d+)\s*/\s*(\d+)(?![\w}])', r'\\frac{\1}{\2}', tex)
    # stacked fractions from the original PDF: baseless ^{A}_{B} / _{B}^{A}
    # (3+ marker interleaves first, then simple pairs)
    tex = repair_interleaved_frac(tex)
    tex = re.sub(r'(?<![\w}\)])\^\{([^}]+)\}\s*_\{([^}]+)\}', r'\\frac{\1}{\2}', tex)
    tex = re.sub(r'(?<![\w}\)])_\{([^}]+)\}\s*\^\{([^}]+)\}', r'\\frac{\2}{\1}', tex)
    tex = repair_interleaved_frac(tex)
    return tex

# When True (text-oriented guides: Introduction to Engineering / English for
# Engineering), square brackets are plain text: '[h/day]', '[the system]',
# '[Source: X]' must never become math or bmatrix.
TEXT_BRACKETS = False


def texify(s):
    """Body text with inline math -> LaTeX string."""
    if TEXT_BRACKETS:
        mats = []
    else:
        s, mats = protect_matrices(s)
    toks = TOKEN.findall(s)
    parts = []
    cur_math = []
    def mathworthy(run_toks):
        """A run with no letters/greek/placeholders/markers and no real
        operators is just a number or a range — keep it as plain text."""
        joined = ''.join(run_toks)
        if re.search(r'[A-Za-z\u0370-\u03ff\u2100-\u214f\u27e6]', joined):
            return True
        if re.search(r'[=+<>≤≥≠←→↔∑∏√∞∥⋯…≈∈∉∪∩⊂⊆∅⊥±⇒⇐⇔·×\\]', joined):
            return True
        if re.search(r'[\^_]\{', joined):
            return True
        return False
    def flush_math():
        nonlocal cur_math
        if cur_math:
            lead = ' ' if cur_math[0].isspace() else ''
            trail = ' ' if cur_math[-1].isspace() else ''
            run = ''.join(cur_math).strip()
            if run and mathworthy(cur_math):
                parts.append(lead + '\\(' + math_run_to_tex(run) + '\\)' + trail)
            else:
                parts.append(lead + run + trail)
            cur_math = []
    n = len(toks)
    for idx, t in enumerate(toks):
        if t.isspace():
            if cur_math: cur_math.append(t)
            else: parts.append(t)
            continue
        # short lowercase latin (dx, dy, dt) continues an open math run
        if (cur_math and not is_math_token(t) and re.fullmatch(r'[a-z]{1,3}', t)):
            j = idx + 1
            while j < n and toks[j].isspace(): j += 1
            if j < n and (is_math_token(toks[j]) or re.fullmatch(r'[a-z]{1,3}', toks[j])):
                cur_math.append(t)
                continue
        if is_math_token(t):
            if t in '.,;:!?':
                # keep , ; inside an EXISTING math run if next token is mathy
                if t in ',;' and cur_math:
                    j = idx + 1
                    while j < n and toks[j].isspace(): j += 1
                    if j < n and is_math_token(toks[j]):
                        cur_math.append(t); continue
                flush_math()
                parts.append(t)
                continue
            cur_math.append(t)
        else:
            if cur_math:
                opens = sum(1 for u in cur_math if u == '(')
                closes = sum(1 for u in cur_math if u == ')')
                if opens > closes and not re.search(r'[А-Яа-яЁё]', t) and len(t.strip()) <= 3:
                    cur_math.append(t)   # absorb short latin/punct while parens open
                    continue
                if opens > closes and (re.search(r'[А-Яа-яЁё]', t) or len(t.strip()) > 3):
                    # Cyrillic word, or any word longer than the short-punct
                    # absorber: the '(' really belongs to the text.
                    if cur_math and cur_math[0] == '(' and \
                            not any(re.fullmatch(r'[=+<>≤≥≠←→↔∑∏√∞∥⋯…≈∈∉∪∩⊂⊆∅⊥±⇒⇐⇔·×−–\^_]', u) for u in cur_math):
                        # prose parenthetical: '(' + absorbed words is not math
                        # at all — emit the whole pending run as plain text
                        parts.append(''.join(cur_math))
                        cur_math = []
                        parts.append(t)
                        continue
                    # else: real math before the '(' — move the trailing
                    # unclosed '(' out of the math run into the text
                    # (it was silently dropped before), flush, continue.
                    run = list(cur_math)
                    dropped = 0
                    while run and opens > closes:
                        if run[-1] == '(':
                            run.pop(); opens -= 1; dropped += 1
                        elif run[-1].isspace() and len(run) >= 2 and run[-2] == '(':
                            run.pop()
                        else:
                            break
                    cur_math = run
                    flush_math()
                    if dropped:
                        parts.append('(' * dropped)
                    parts.append(t)
                    continue
            flush_math()
            parts.append(t)
    flush_math()
    out = ''.join(parts)
    def restore(m):
        return mats[int(m.group(1))]
    out = re.sub(r'\u27e6M(\d+)\u27e7', restore, out)
    # escape text segments (outside \(..\))
    segs = re.split(r'(\\\(.*?\\\))', out, flags=re.S)
    esc = []
    for seg in segs:
        if seg.startswith('\\(') and seg.endswith('\\)'):
            esc.append(seg)
        else:
            seg = re.sub(r'(?<!\\)%', r'\\%', seg)
            seg = re.sub(r'(?<!\\)&', r'\\&', seg)
            seg = re.sub(r'(?<!\\)#', r'\\#', seg)
            seg = re.sub(r'(?<!\\)\$', r'\\$', seg)
            seg = re.sub(r'(?<!\\)~', r'\\textasciitilde{}', seg)
            seg = re.sub(r'(?<![\\^_])\^', r'\\textasciicircum{}', seg)
            seg = re.sub(r'(?<![\\^_])\{', r'\\{', seg)
            seg = re.sub(r'(?<!\\)\}', r'\\}', seg)
            seg = re.sub(r'(?<!\\)_', r'\\_', seg)
            esc.append(seg)
    return ''.join(esc)

def sqrt_paren_to_brace(tex):
    """'\\sqrt (a+(b))' -> '\\sqrt{a+(b)}' with balanced parens."""
    out = []
    i = 0
    while i < len(tex):
        m = re.compile(r'\\sqrt\s*\(').match(tex, i)
        if m:
            depth = 0
            j = m.end() - 1
            k = j
            while k < len(tex):
                if tex[k] == '(': depth += 1
                elif tex[k] == ')':
                    depth -= 1
                    if depth == 0: break
                k += 1
            if k < len(tex):
                out.append('\\sqrt{' + tex[j+1:k] + '}')
                i = k + 1
                continue
        out.append(tex[i])
        i += 1
    return ''.join(out)

def texify_formula(s):
    """Whole-line display formula -> LaTeX body for \\[ \\]."""
    s, mats = protect_matrices(s)
    toks = TOKEN.findall(s)
    out = []
    for t in toks:
        if t.isspace():
            out.append(' ')
        else:
            out.append(map_math_token(t))
    tex = ''.join(out)
    tex = re.sub(r'(?<![\\\w{}])(\d+)\s*/\s*(\d+)(?![\w}])', r'\\frac{\1}{\2}', tex)
    tex = re.sub(r'(?<![\\\w{}])([a-zA-Z])\s*/\s*([a-zA-Z])(?![\w}])', r'\\frac{\1}{\2}', tex)
    tex = repair_interleaved_frac(tex)
    tex = re.sub(r'(?<![\w}\)])\^\{([^}]+)\}\s*_\{([^}]+)\}', r'\\frac{\1}{\2}', tex)
    tex = re.sub(r'(?<![\w}\)])_\{([^}]+)\}\s*\^\{([^}]+)\}', r'\\frac{\2}{\1}', tex)
    tex = repair_interleaved_frac(tex)
    tex = re.sub(r'([a-zA-Z])(_\{[^}]*\})\s*/\s*([a-zA-Z])(_\{[^}]*\})', r'\\frac{\1\2}{\3\4}', tex)
    tex = re.sub(r'\u27e6M(\d+)\u27e7', lambda m: mats[int(m.group(1))], tex)
    # every Cyrillic word (incl. single letters like 'и' and abbreviations
    # like 'т.е.') inside a display formula must be \text{...}: cmmi10 has
    # no Cyrillic glyphs and renders them as blanks. Uzbek oʻ/gʻ words too
    # (U+02BB has no glyph in cmmi10).
    tex = re.sub(r'[А-Яа-яЁё]+(?:[.,;]+[А-Яа-яЁё]+)*[.,;]?|[A-Za-z]*[\u02bb\u02bc][A-Za-z\u02bb\u02bc]*|[A-Za-z]*[\u00c0-\u017f][A-Za-z\u00c0-\u017f]*',
                 lambda m: ' \\text{' + m.group(0) + '} ', tex)
    tex = tex.replace('%', r'\%').replace('$', r'\$')
    tex = sqrt_paren_to_brace(tex)
    return re.sub(r'\s+', ' ', tex).strip()

if __name__ == '__main__':
    tests = [
        'Повторение: A = [1 2; 2 4] имеет ранг 1 и не имеет обратной; Ax = [3; 6] — бесконечно много решений.',
        'Опорный элемент: λ_{ij} = a_{ij}/a_{jj}, операция R_{i} ← R_{i} − λ_{ij}·R_{j}',
        'Матрица исключения E_{21} = [1 0 0; −2 1 0; 0 0 1], тогда E_{21}·A = U и A^{-1} существует.',
        'Три плоскости: [2 1 1; 4 −6 0; −2 7 2]·[u; v; w] = [5; −2; 9] — решение x = [1; 1; 2].',
        'Для A (m×n) и B (n×p): (AB)_{ij} = ∑_{k} a_{ik}·b_{kj}, вообще AB ≠ BA.',
        'R_{2} ← R_{2} − 2R_{1}, R_{3} ← R_{3} + R_{1}: [2 1 1 | 5; 0 −8 −2 | −12; 0 8 3 | 14]',
        'Решите систему [1 1 0 | 3; 2 3 1 | 9; 1 0 1 | 4] методом Гаусса. Ответ: x = [1; 2; 3].',
        '√(b^{2} − 4ac) — дискриминант; z = (−b ± √D)/(2a)',
        'Векторные пространства: C(A) ⊂ ℝ^{m}, N(A) ⊂ ℝ^{n}, dim C(A) = rank A.',
        'Стрэнг, Introduction to Linear Algebra (4-е изд.), §§2.1–2.3; лекция идёт 80 минут.',
        'Прямые пересекаются в (x, y) = (2, 3); три плоскости в 3D.',
    ]
    for t in tests:
        print('IN :', t)
        print('OUT:', texify(t))
        print()
