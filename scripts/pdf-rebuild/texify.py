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
        '∑':'\\sum ','∏':'\\prod ','∫':'\\int ','∮':'\\oint ','√':'\\sqrt ','∞':'\\infty ','∥':'\\lVert ',
        '⋯':'\\cdots ','…':'\\ldots ','≈':'\\approx ','∈':'\\in ','∉':'\\notin ',
        '∪':'\\cup ','∩':'\\cap ','⊂':'\\subset ','⊆':'\\subseteq ','∅':'\\varnothing ',
        '∀':'\\forall ','∃':'\\exists ','∘':'\\circ ','⊥':'\\perp ','±':'\\pm ',
        '⇒':'\\Rightarrow ','⇐':'\\Leftarrow ','⇔':'\\Leftrightarrow ',
        '⟹':'\\Longrightarrow ','⟸':'\\Longleftarrow ','⟺':'\\iff ',
        '⟶':'\\longrightarrow ','⟵':'\\longleftarrow ',
        'ℝ':'\\mathbb{R} ','ℕ':'\\mathbb{N} ','ℤ':'\\mathbb{Z} ','ℂ':'\\mathbb{C} ',
        '′':"'",'°':'^\\circ '}
# Words that look mathy by shape (ALL-CAPS<=4, Upper+lower 2-char) but are
# plain prose/labels in these guides: course labels (ISA, LA, TA, EE, CS),
# capitalized function words (At, In, If, We, So...), file extensions.
NOT_MATH_WORDS = {'ISA','LA','TA','EE','CS','TED','QR','EAP','At','In','On','If','We',
                  'So','No','Do','To','By','Or','An','Is','It','As','Of','Am','Be',
                  'NOT','BE','FEW','ING','Bu','Va','MPa','kPa','ECTS','ASME','IEEE','ASCE','AIAA','ANS','INEN','SI','ASTM','BMES','PFD','CAD','CAM'}

FUNCS = {'det','rank','span','null','dim','tr','rref','ref','lu','ldu','sin','cos',
         'tan','exp','ln','log','max','min','sup','inf','ker','im',
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
    r'|[=+<>≤≥≠←→↔∑∏√∞∥⋯…≈∈∉∪∩⊂⊆∅∀∃∘⊥±⇒⇐⇔·×−–-]'
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
    if tok in NOT_MATH_WORDS:
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
    if tok in '=+<>≤≥≠←→↔∑∏√∞∥⋯…≈∈∉∪∩⊂⊆∅∀∃∘⊥±⇒⇐⇔·×−–-': return True
    if tok in '()|,/[]':
        if TEXT_BRACKETS and tok in '[]':
            return False
        if TEXT_GUIDE and tok in '/|':
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
    # big-operator limits: \Sigma _{k=1}^{n} / \sum _{i}{j}^{} are limits,
    # not stacked fractions — freeze them before the frac rules
    # big-operator limits: '\Sigma _{k=1}^{n}' -> '\Sigma_{k=1}^{n}' (no
    # space): the frac rules' \w lookbehind then correctly leaves them alone
    tex = re.sub(r'\\(Sigma|sum|prod|int|oint|bigcup|bigcap)\s+(_\{[^}]*\})\s*(\^\{[^}]*\})',
                 r'\\\1\2\3', tex)
    # stacked fractions from the original PDF: baseless ^{A}_{B} / _{B}^{A}
    # (3+ marker interleaves first, then simple pairs)
    tex = repair_interleaved_frac(tex)
    tex = re.sub(r'(?<![\w}\)])\^\{([^}]+)\}\s*_\{([^}]+)\}', r'\\frac{\1}{\2}', tex)
    tex = re.sub(r'(?<![\w}\)])_\{([^}]+)\}\s*\^\{([^}]+)\}', r'\\frac{\2}{\1}', tex)
    tex = repair_interleaved_frac(tex)
    # decimal comma: RU numbers inside math must stay tight (8{,}3143)
    tex = re.sub(r'(\d),(\d)', r'\1{,}\2', tex)
    return tex

# When True (text-oriented guides: Introduction to Engineering / English for
# Engineering), square brackets are plain text: '[h/day]', '[the system]',
# '[Source: X]' must never become math or bmatrix.
TEXT_BRACKETS = False

# Text-subject guides (History / ITE / English / CS): natural language must
# never render in math italic.  When True, an inline run stays math ONLY if
# it carries real math: an operator (= < > + ≤ ≥ ≠ ← → · × ± ⇒ ...), a greek
# letter, a ^{}/_{} marker or a matrix placeholder.  Runs made only of
# words / digits / parens / commas / slashes / dashes — English and Uzbek
# function words (We, If, In, Bu, o'nta...), question labels (S1, T6, P1,
# B1, L5-1), abbreviations (TED, QR, CS50, EAP B1, PF-5775, EJF), option
# letters (a), b)), number+unit pairs (96 km, 18 Vt), hex literals (0x77)
# — stay plain text, exactly like the v1 ReportLab originals.  '/' and '|'
# stop being math tokens in this mode (units 'm/s2', '96 km' are text).
TEXT_GUIDE = False

def run_is_textmath(run_toks):
    """True if the pending run is natural language, not math (TEXT_GUIDE)."""
    joined = ''.join(run_toks)
    # grammar-rule plus/minus with real words ('BE (am/are/is) + -ING') is
    # text: a multi-letter lowercase word (not a FUNC) with no digits/markers
    # wins over a bare + or -
    words = re.findall(r'[a-z]{2,}', joined)
    has_digits_or_marker = bool(re.search(r'\d|[\^_]\{|\u27e6', joined))
    if (words and not has_digits_or_marker
            and not all(w in FUNCS for w in words)):
        return True
    if re.search(r'[=+<>≤≥≠←→↔⟹⟸⟺⟶⟵∑∏√∞∥⋯…≈∈∉∪∩⊂⊆∅∀∃∘⊥±⇒⇐⇔·×\u27e6]', joined):
        return False
    if re.search(r'[\^_]\{', joined):
        return False
    if re.search(r'[\u0370-\u03ff\u2100-\u214f]', joined):
        return False
    return True


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
            # a run with no letters, digits, greek or commands is just
            # punctuation ('(' alone, ')' alone) -- keep it as plain text
            if not re.search(r'[A-Za-z0-9\u0370-\u03ff\u2100-\u214f\\]', run):
                parts.append(lead + run + trail)
                cur_math = []
                return
            if (run and mathworthy(cur_math)
                    and not (TEXT_GUIDE and run_is_textmath(cur_math))):
                parts.append(lead + '\\(' + math_run_to_tex(run) + '\\)' + trail)
            else:
                parts.append(lead + run + trail)
            cur_math = []
    n = len(toks)
    skip_until = -1
    for idx, t in enumerate(toks):
        if idx < skip_until:
            continue
        # file-extension parenthetical '( .doc )' is plain text, never math
        if (t == '(' and idx + 3 < n and toks[idx+1] == '.'
                and re.fullmatch(r'[A-Za-z]{2,4}', toks[idx+2]) and toks[idx+3] == ')'):
            flush_math()
            parts.append(''.join(toks[idx:idx+4]))
            skip_until = idx + 4
            continue
        if t.isspace():
            if cur_math: cur_math.append(t)
            else: parts.append(t)
            continue
        # short lowercase latin continues an open math run — but ONLY real
        # differentials (dx, dy, dt, dV, dm, dT...).  Function words (and, or,
        # is, not; UZ postpositions da/ga/ka/ta) must stay text: math mode
        # eats their spaces and they render glued italic ('O and o' -> 'Oando')
        if (cur_math and not is_math_token(t)
                and re.fullmatch(r'd[A-Za-z]', t)
                and t.lower() not in ('da','di','ga','ka','ta','de','ke','ge','do')):
            j = idx + 1
            while j < n and toks[j].isspace(): j += 1
            if j < n and (is_math_token(toks[j]) or re.fullmatch(r'd[A-Za-z]', toks[j])):
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
                ABSORB_STOP = {'and','or','not','the','for','but','too','are','is','was',
                               'has','had','did','does','all','any','one','two','six','ten',
                               'of','to','at','in','on','doc','pdf','pptx','txt','csv',
                               'da','ga','ka','va'}
                if (opens > closes and not re.search(r'[А-Яа-яЁё]', t)
                        and (re.fullmatch(r'[A-Za-z]', t)
                             or (re.fullmatch(r'd[A-Za-z]', t)
                                 and t not in ('da','di','ga','ka','ta','de','ke','ge','do'))
                             or (not re.search(r'[A-Za-z]', t) and len(t.strip()) <= 2))):
                    # single letters (u, v, x...), d? differentials (dx, dT)
                    # and short punctuation only -- never whole words ('so',
                    # 'as', 'too'...) which would glue to the math run
                    cur_math.append(t)
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

# bare command leaks from damaged source lines: the backslash was lost and
# literal 'frac{q}{...}' / 'sqrt{...}' reached the formula.  In math mode the
# braces vanish -> renders glued ('fracq...').  Re-attach the backslash.
BARE_CMD = re.compile(r'(?<![\\\w])(frac|sqrt|mathrm|mathbb|bar|hat|vec|tilde|dot|text|underbrace)\s*\{')

def texify_formula(s):
    """Whole-line display formula -> LaTeX body for \\[ \\]."""
    s = BARE_CMD.sub(lambda m: '\\' + m.group(1).strip() + '{', s)
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
    # big-operator limits: '\Sigma _{k=1}^{n}' -> '\Sigma_{k=1}^{n}' (no
    # space): the frac rules' \w lookbehind then correctly leaves them alone
    tex = re.sub(r'\\(Sigma|sum|prod|int|oint|bigcup|bigcap)\s+(_\{[^}]*\})\s*(\^\{[^}]*\})',
                 r'\\\1\2\3', tex)
    tex = repair_interleaved_frac(tex)
    tex = re.sub(r'(?<![\w}\)])\^\{([^}]+)\}\s*_\{([^}]+)\}', r'\\frac{\1}{\2}', tex)
    tex = re.sub(r'(?<![\w}\)])_\{([^}]+)\}\s*\^\{([^}]+)\}', r'\\frac{\2}{\1}', tex)
    tex = repair_interleaved_frac(tex)
    tex = re.sub(r'([a-zA-Z])(_\{[^}]*\})\s*/\s*([a-zA-Z])(_\{[^}]*\})', r'\\frac{\1\2}{\3\4}', tex)
    tex = re.sub(r'\u27e6M(\d+)\u27e7', lambda m: mats[int(m.group(1))], tex)
    # ONE \text{...} group per Cyrillic/Uzbek PHRASE, not per word: separate
    # per-word groups lose the inter-word spaces in math mode
    # ('\text{эквивалентность} \text{установлена}' -> 'эквивалентностьустановлена').
    # cmmi10 has no Cyrillic glyphs, so the words must be \text{} at all.
    # UZ alternative: EVERY word of the phrase must carry oʻ/gʻ apostrophes.
    tex = re.sub(
        r'[А-Яа-яЁё]+(?:[\s.,;:«»()—–-]+[А-Яа-яЁё]+)*\s*[.,;:]?'
        r'|[A-Za-z]*[\u02bb\u02bc][A-Za-z\u02bb\u02bc]*(?:[\s.,;:—–-]+[A-Za-z]*[\u02bb\u02bc][A-Za-z\u02bb\u02bc]*)*\s*[.,;:]?'
        r'|[A-Za-z]*[\u02bb\u02bc][A-Za-z\u02bb\u02bc]*'
        r'|[A-Za-z]*[\u00c0-\u017f][A-Za-z\u00c0-\u017f]*',
        lambda m: ' \\text{' + m.group(0).strip() + '} ', tex)
    # lowercase prose words inside display formulas (UZ 'mavjud emas',
    # 'tebranish'...; EN 'odd numbers') render glued italic in math mode --
    # wrap whole word-runs as one \text{} (FUNCS like sin/ln stay math)
    def _prose_words(m):
        ws = m.group(0).strip().split()
        # wrap only runs with at least one >=3-letter word: 'is defined by'
        # yes, 'Ax'/'By' variables stay math
        if not ws or max(len(w) for w in ws) < 3:
            return m.group(0)
        return ' \\text{' + ' '.join(ws) + '} '
    # runs of >=3-letter words, optionally with leading/trailing glue words
    # ('is defined by') -- but 'Ax', 'By' style 2-letter variables stay math
    GLUE = r'(?:is|by|of|to|in|at|on|as|an|or|and|the|when|for|with)'
    tex = re.sub(
        r'(?<![\\\w{])((?:' + GLUE + r'\s+)?[A-Za-z][a-z]{2,}(?:[\s.,;:—–-]+[A-Za-z][a-z]{2,})*(?:\s+' + GLUE + r')?)',
        _prose_words, tex)
    # unit symbols stay upright in display formulas: 400 MPa, 10 ppm
    tex = re.sub(r'(?<![\w{])(MPa|kPa|GPa|kW|MW|kWh|kJ|MJ|GHz|MHz|kHz|mV|kV|mA|ppm|ECTS)\b',
                 r'\\text{\1}', tex)
    tex = tex.replace('%', r'\%').replace('$', r'\$')
    tex = re.sub(r'(\d),(\d)', r'\1{,}\2', tex)
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
    tex = re.sub(r'(?<![\\w{])(MPa|kPa|GPa|kW|MW|kWh|kJ|MJ|GHz|MHz|kHz|mV|kV|mA|mm|cm|km|kg|mg|ppm|ECTS)', r'\\text{\\1}', tex)
