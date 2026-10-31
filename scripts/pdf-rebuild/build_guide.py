#!/usr/bin/env python3
"""build_guide.py — assemble LaTeX document from extracted JSON and compile.

Reads work/<key>.json (extract.py output), emits work/<key>.tex, compiles with
tectonic. Rebuild of the lost v1 builder with the same fixes:
  - cover page rebuilt (footer collision bug fixed: 'РЕШЕНИЯОКТЯБРЬ' -> '· ОСЕНЬ 2026')
  - auto-numbered \\section/\\subsection (original numbers stripped)
  - h3 kept verbatim (original numbering 2.6.x is intentionally preserved)
  - questions fully bold with proper math inside
  - display formulas: fragments merged, overlong ones split at top-level commas
  - inline runs containing bmatrix split at top-level commas (line breaks)
  - patch table: 3x3 permutations (Strang 2.7) rebuilt by hand
  - source notes: footnotesize italic
"""
import json, re, subprocess, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from texify import texify, texify_formula

WORK = '/home/z/my-project/work'
GUIDES = {
    'la57_ru': {'pdf': 'Linear_Algebra_I_Weeks_5-7_RU.pdf', 'lang': 'ru'},
    'la57_en': {'pdf': 'Linear_Algebra_I_Weeks_5-7_EN.pdf', 'lang': 'en'},
    'la57_uz': {'pdf': 'Linear_Algebra_I_Weeks_5-7_UZ.pdf', 'lang': 'uz'},
    'la14_ru': {'pdf': 'Linear_Algebra_I_Weeks_1-4_RU.pdf', 'lang': 'ru'},
    'la14_en': {'pdf': 'Linear_Algebra_I_Weeks_1-4_EN.pdf', 'lang': 'en'},
    'la14_uz': {'pdf': 'Linear_Algebra_I_Weeks_1-4_UZ.pdf', 'lang': 'uz'},
    'm57_ru':  {'pdf': 'Math_I_Weeks_5-7_RU.pdf', 'lang': 'ru'},
    'm57_en':  {'pdf': 'Math_I_Weeks_5-7_EN.pdf', 'lang': 'en'},
    'm57_uz':  {'pdf': 'Math_I_Weeks_5-7_UZ.pdf', 'lang': 'uz'},
    'm14_ru':  {'pdf': 'Math_I_Weeks_1-4_RU.pdf', 'lang': 'ru'},
    'm14_en':  {'pdf': 'Math_I_Weeks_1-4_EN.pdf', 'lang': 'en'},
    'm14_uz':  {'pdf': 'Math_I_Weeks_1-4_UZ.pdf', 'lang': 'uz'},
}

PERM_TABLE_RU = r"""\begin{center}\small
\begin{tabular}{@{}l l c l@{}}
\toprule
\textbf{Перестановка} & \textbf{Матрица (построчно)} & $\det P$ & $P^{-1} = P^{T}$ \\
\midrule
$I$ &
$\begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$ & $+1$ & $I$ \\
$P_{21}$ (обмен строк 1, 2) &
$\begin{bmatrix} 0 & 1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$ & $-1$ & $P_{21}$ \\
$P_{32}$ (обмен строк 2, 3) &
$\begin{bmatrix} 1 & 0 & 0 \\ 0 & 0 & 1 \\ 0 & 1 & 0 \end{bmatrix}$ & $-1$ & $P_{32}$ \\
$P_{31}$ (обмен строк 1, 3) &
$\begin{bmatrix} 0 & 0 & 1 \\ 0 & 1 & 0 \\ 1 & 0 & 0 \end{bmatrix}$ & $-1$ & $P_{31}$ \\
$P_{32} P_{21}$ (циклическая) &
$\begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 1 \\ 1 & 0 & 0 \end{bmatrix}$ & $+1$ & $P_{21} P_{32}$ \\
$P_{21} P_{32}$ (циклическая) &
$\begin{bmatrix} 0 & 0 & 1 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{bmatrix}$ & $+1$ & $P_{32} P_{21}$ \\
\bottomrule
\end{tabular}
\end{center}"""

# Per-guide content patches: fix original-PDF scrambles.
PATCHES = {
    'la57_ru': [
        # scrambled LU chain: continuation drawn above the main line
        {'kind': 'p', 're': r'^E\^\{-1\}_\{2\}', 'action': 'skip'},
        {'kind': 'f', 're': r'^E_\{k\} ···E_\{2E1A\}', 'action': 'replace',
         'latex': r'\[ E_k \cdots E_2 E_1 A = U \;\rightarrow\; A = E_1^{-1} E_2^{-1} \cdots E_k^{-1} U = LU \]'},
        # permutation table fragments
        {'kind': 'p', 're': r'^P_\{32\} P_\{21\}$', 'action': 'skip'},
        {'kind': 'p', 're': r'^P_\{21\} P_\{32\}$', 'action': 'skip'},
        {'kind': 'table', 're': r"\['\(циклическая\)'\]", 'action': 'skip'},
        {'kind': 'table', 're': r"\['Перестановка'", 'action': 'replace_latex',
         'latex': 'PERM_TABLE_RU'},
    ],
}

# ---------------------------------------------------------------- text helpers

def despace(s):
    """'У Ч Е Б Н О Е' -> 'УЧЕБНОЕ' (letterspaced cover lines)."""
    return re.sub(r'(?<=[А-ЯЁA-Z]) (?=[А-ЯЁA-Z0-9])', '', s)

def fix_merged_indices(t):
    """Original PDF renders 'E₂E₁A' with the whole '2E1A' as one sub-span:
    _{2E1A} -> _{2}E_{1}A,  _{2E1} -> _{2}E_{1} (visual reading restored)."""
    t = re.sub(r'_\{(\d+)E(\d+)([A-Za-z]*)\}', r'_{\1}E_{\2}\3', t)
    return t

def esc_text(s):
    """Escape plain text (no math expected)."""
    s = s.replace('\\', r'\textbackslash{}')
    for ch, rep in [('%', r'\%'), ('&', r'\&'), ('#', r'\#'), ('$', r'\$'),
                    ('~', r'\textasciitilde{}'), ('{', r'\{'), ('}', r'\}'),
                    ('_', r'\_'), ('^', r'\textasciicircum{}')]:
        s = s.replace(ch, rep)
    return s

def split_top_commas(tex):
    """Split LaTeX at top-level ', ' and '; ' — outside {} and environments."""
    parts, depth, i, last, n = [], 0, 0, 0, len(tex)
    while i < n:
        if tex.startswith(r'\begin{', i):
            j = tex.find('}', i)
            env = tex[tex.find('{', i) + 1:j]
            endmark = r'\end{' + env + '}'
            k = tex.find(endmark, j)
            i = (k + len(endmark)) if k != -1 else n
            continue
        if tex.startswith(r'\text{', i) or tex.startswith(r'\mathrm{', i):
            j = tex.find('}', i)
            i = j + 1 if j != -1 else n
            continue
        c = tex[i]
        if c == '{': depth += 1
        elif c == '}': depth -= 1
        elif depth == 0 and ((c == ',' and tex[i+1:i+2] == ' ') or (c == ';' and tex[i+1:i+2] == ' ')):
            parts.append(tex[last:i+1])
            last = i + 2
            i += 2
            continue
        i += 1
    parts.append(tex[last:])
    return parts

def est_width(tex):
    """Rough width estimate of math latex in 'characters'."""
    n_mats = len(re.findall(r'\\begin\{bmatrix\}', tex))
    t = re.sub(r'\\(?:begin|end)\{[a-z*]+\}', '', tex)
    t = re.sub(r'\\[a-zA-Z]+ ?', 'x', t)
    t = re.sub(r'[&\\]', '', t)
    return len(t) + 25 * n_mats

def split_inline_points(tex):
    """Split inline math at top-level ', ' and ' = ' (line-break points)."""
    parts, depth, i, last, n = [], 0, 0, 0, len(tex)
    while i < n:
        if tex.startswith(r'\begin{', i):
            j = tex.find('}', i)
            env = tex[tex.find('{', i) + 1:j]
            endmark = r'\end{' + env + '}'
            k = tex.find(endmark, j)
            i = (k + len(endmark)) if k != -1 else n
            continue
        if tex.startswith(r'\text{', i):
            j = tex.find('}', i)
            i = j + 1 if j != -1 else n
            continue
        c = tex[i]
        if c == '{': depth += 1
        elif c == '}': depth -= 1
        elif depth == 0:
            if c == ',' and tex[i+1:i+2] == ' ':
                parts.append(tex[last:i+1]); last = i + 2; i += 2; continue
            if c == '=' and tex[i+1:i+2] == ' ' and tex[i-1] == ' ' and i > last:
                parts.append(tex[last:i-1] + ' =')
                last = i + 2; i += 2; continue
        i += 1
    parts.append(tex[last:])
    return parts

def display_formula(tex):
    """\\[ .. \\], split overlong at top-level commas/semicolons into gather*."""
    if est_width(tex) > 85:
        parts = split_top_commas(tex)
        if len(parts) >= 2:
            half = est_width(tex) / 2
            acc, lines, cur = 0, [], ''
            for p in parts:
                w = est_width(p)
                if cur and acc + w > half and len(lines) == 0:
                    lines.append(cur.rstrip())
                    cur, acc = p, w
                else:
                    cur += p
                    acc += w
            if cur.strip():
                lines.append(cur.rstrip())
            if len(lines) >= 2:
                body = ' \\\\\n'.join(l for l in lines if l.strip())
                return '\\begin{gather*}\n' + body + '\n\\end{gather*}'
    return '\\[' + tex + '\\]'

def promote_wide_matrices(par_tex):
    """Inline runs whose single matrix is too wide for the text line are
    promoted to a display line: text \\[matrix\\] text."""
    def repl(m):
        run = m.group(1)
        m2 = re.search(r'\\begin\{bmatrix\}(.+?)\\end\{bmatrix\}', run, re.S)
        if not m2:
            return m.group(0)
        inner = m2.group(1)
        n_rows = inner.count('\\\\') + 1
        max_cols = max(len(re.findall(r'&', r)) for r in inner.split('\\\\')) + 1
        # wide: 4+ rows, or 5+ columns (augmented 3x4)
        if n_rows >= 4 or max_cols >= 5:
            before = run[:m2.start()].rstrip(' =:—–')
            after = run[m2.end():].lstrip(' ,.;')
            mat = '\\[' + m2.group(0) + '\\]'
            return ((('\\(' + before + '\\)') if before else '') + '\\par' + mat + '\\par' +
                    (('\\(' + after + '\\)') if after else ''))
        return m.group(0)
    return re.sub(r'\\\((.*?)\\\)', repl, par_tex, flags=re.S)

def split_inline_runs(par_tex):
    """Allow line breaks inside long \\(..\\) runs: split at , and =."""
    def repl(m):
        run = m.group(1)
        if est_width(run) > 80:
            parts = split_inline_points(run)
            if len(parts) >= 2:
                return ('\\(' + parts[0].rstrip() + '\\)') + ''.join(
                    (' \\(' + p.strip() + '\\)') for p in parts[1:])
        return m.group(0)
    return re.sub(r'\\\((.*?)\\\)', repl, par_tex, flags=re.S)

# ---------------------------------------------------------------- blocks

def render_blocks(blocks, lang, guide_key):
    patches = PATCHES.get(guide_key, [])
    out = []
    prev_kind = None
    for b in blocks:
        k = b['k']
        # --- patch pass
        skip = False
        for p in patches:
            if p['kind'] != k:
                continue
            if k == 'table':
                target = str(b.get('rows', ''))
            else:
                target = b.get('t', '')
            if re.search(p['re'], target):
                if p['action'] == 'skip':
                    skip = True
                elif p['action'] == 'replace':
                    out.append(p['latex'])
                    skip = True
                elif p['action'] == 'replace_latex':
                    out.append(PERM_TABLE_RU if p['latex'] == 'PERM_TABLE_RU' else p['latex'])
                    skip = True
                break
        if skip:
            continue
        if k in ('p', 'f', 'q', 'h3'):
            b = dict(b)
            b['t'] = fix_merged_indices(b.get('t', ''))
            if 'title' in b:
                b['title'] = fix_merged_indices(b['title'])
        if k == 'h1':
            t = re.sub(r'^\d+\s+', '', b['t'])
            out.append('\\section{' + esc_text(despace(t)) + '}')
        elif k == 'h2':
            t = re.sub(r'^\d+\.\d+\s+', '', b['t'])
            out.append('\\subsection{' + esc_text(t) + '}')
        elif k == 'h3':
            out.append('\\medskip\\noindent{\\textbf{' + texify(b['t']) + '}}\\par\\smallskip')
        elif k == 'q':
            label = b.get('label', '')
            title = b.get('title', '')
            body = b.get('t', '')
            head = ' '.join(x for x in (label, title) if x)
            body_tex = promote_wide_matrices(texify(body))
            if '\\[' in body_tex:
                # promoted display: bold only the text segments, display outside
                segs = re.split(r'(\\\[.*?\\\])', body_tex, flags=re.S)
                rendered = ''.join(
                    ('\\textbf{' + s + '}' if s.strip() else s) if not s.startswith('\\[')
                    else s.replace('\\par', '') for s in segs)
                out.append('\\medskip\\noindent\\textbf{' + texify(head) + '} ' +
                           rendered.replace('\\par', ' ') + '\\par')
            else:
                out.append('\\medskip\\noindent\\textbf{' + texify(head) + '} ' +
                           ('\\textbf{' + body_tex + '}\\par' if body_tex.strip() else ''))
        elif k == 'p':
            t = texify(b['t'])
            t = split_inline_runs(t)
            if b.get('bold'):
                t = '\\textbf{' + t + '}'
            out.append(t + '\\par')
        elif k == 'f':
            t = b['t']
            cyr = len(re.findall(r'[А-Яа-яЁё]', t))
            lat = len(re.findall(r'[A-Za-z]', t))
            if cyr + lat > 0 and cyr / (cyr + lat) > 0.38 and '\u27e6' not in t and '[' not in t:
                # prose-heavy "formula": really a text paragraph with inline math
                out.append(texify(t) + '\\par')
                prev_kind = 'p'
                continue
            # merge bare-word fragments into the previous formula
            if (out and prev_kind == 'f' and
                    not re.search(r'[=+−·×≤≥≠^_\[\]\\∑√λ]', t) and len(t) <= 30):
                # rewrite last display to include the fragment
                if out[-1].startswith('\\[') and out[-1].endswith('\\]'):
                    inner = out[-1][2:-2].rstrip()
                    out[-1] = display_formula(inner + ' ' + t)
                elif '\\end{gather*}' in out[-1]:
                    idx = out[-1].rfind('\\end{gather*}')
                    out[-1] = out[-1][:idx].rstrip() + ' ' + t + '\n\\end{gather*}'
            else:
                out.append(display_formula(texify_formula(t)))
        elif k == 'src':
            out.append('{\\footnotesize\\itshape ' + texify(b['t']) + '\\par}')
        elif k == 'li':
            out.append('\\begin{itemize}\\setlength{\\itemsep}{1pt}\\item ' +
                       texify(b['t']) + '\\end{itemize}')
        elif k == 'table':
            out.append(render_table(b['rows']))
        prev_kind = k
    return '\n\n'.join(out)

def render_table(rows):
    if not rows:
        return ''
    ncols = max(len(r) for r in rows)
    # all columns share the line width
    w = 0.95 / ncols
    spec = ' '.join([f'p{{{w:.2f}\\linewidth}}'] * ncols)
    lines = ['\\begin{center}\\small', '\\begin{tabular}{@{}' + spec + '@{}}', '\\toprule']
    for i, r in enumerate(rows):
        cells = list(r) + [''] * (ncols - len(r))
        cells = [texify(c).replace('\n', ' ') or ' ' for c in cells]
        lines.append(' & '.join(cells) + ' \\\\')
        if i == 0:
            lines.append('\\midrule')
    lines += ['\\bottomrule', '\\end{tabular}', '\\end{center}']
    return '\n'.join(lines)

# ---------------------------------------------------------------- document

PREAMBLE_RU = r"""\documentclass[11pt]{article}
\usepackage[a4paper, margin=2.3cm, headheight=16pt]{geometry}
\usepackage{amsmath, amssymb, booktabs}
\usepackage{fontspec}
\usepackage{polyglossia}
\setmainlanguage{russian}
\setotherlanguage{english}
\setmainfont{DejaVu Serif}
\setsansfont{DejaVu Sans}
\newfontfamily\cyrillicfont{DejaVu Serif}
\newfontfamily\cyrillicfontsf{DejaVu Sans}
\usepackage{fancyhdr}
\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\small\itshape <<HL>>}
\fancyhead[R]{\small\itshape <<HR>>}
\fancyfoot[C]{\small\thepage}
\renewcommand{\headrulewidth}{0.3pt}
\setlength{\parindent}{0pt}
\setlength{\parskip}{4pt plus 1pt}
\emergencystretch=1.8em
\renewcommand{\arraystretch}{1.25}
\begin{document}
"""

def build(key):
    cfg = GUIDES[key]
    with open(f'{WORK}/{key}.json') as f:
        data = json.load(f)
    cover = data['cover']
    blocks = data['blocks']

    # --- cover parsing
    eyebrow = despace(cover[0])
    title = cover[1]
    subtitle = cover[2]
    body = cover[3:]
    uni_idx = next((i for i, t in enumerate(body) if 'университет' in t.lower() or 'university' in t.lower()), None)
    desc = ' '.join(body[:uni_idx]) if uni_idx else ' '.join(body)
    uni = body[uni_idx] if uni_idx is not None else ''
    src_start = next((i for i, t in enumerate(body) if t.startswith(('Источники', 'Sources', 'Manba'))), None)
    sources = ' '.join(body[src_start:-1]) if src_start is not None and src_start < len(body) - 1 else ''
    footer = despace(cover[-1])
    # fix the original footer collision: 'РЕШЕНИЯОКТЯБРЬ2026' -> '... · ОСЕНЬ 2026'
    footer = re.sub(r'(РЕШЕНИЯ)\s*О\s*К\s*Т\s*Я\s*Б\s*Р\s*Ь\s*2\s*0\s*2\s*6', r'\1 · ОСЕНЬ 2026', footer)

    hl = title + (' — ' + subtitle.lower() if subtitle else '')
    preamble = PREAMBLE_RU.replace('<<HL>>', esc_text(hl)).replace('<<HR>>', esc_text('Вопросы · Формулы · Решения'))

    titlepage = r"""\begin{titlepage}
\centering
\vspace*{1.2cm}
{\small\scshape\addfontfeature{LetterSpace=12.0}""" + esc_text(eyebrow) + r"""\par}
\vspace{1.6cm}
{\huge\bfseries """ + esc_text(title) + r"""\par}
\vspace{0.5cm}
{\LARGE\bfseries """ + esc_text(subtitle) + r"""\par}
\vspace{1.4cm}
{\large """ + texify(desc) + r"""\par}
\vfill
{\normalsize\itshape """ + esc_text(uni) + r"""\par}
\vspace{0.4cm}
{\footnotesize """ + texify(sources) + r"""\par}
\vspace{0.8cm}
{\footnotesize\scshape\addfontfeature{LetterSpace=8.0}""" + esc_text(footer) + r"""\par}
\end{titlepage}
\tableofcontents
\newpage
"""
    content = render_blocks(blocks, cfg['lang'], key)
    tex = preamble + titlepage + content + '\n\\end{document}\n'
    path = f'{WORK}/{key}.tex'
    with open(path, 'w') as f:
        f.write(tex)
    print(f'{key}: {len(tex)} chars tex -> {path}')
    return path

def compile_tex(path):
    r = subprocess.run(['tectonic', '-X', 'compile', path],
                       capture_output=True, text=True, cwd=WORK, timeout=600)
    log = r.stdout + r.stderr
    pdf = path.replace('.tex', '.pdf')
    ok = os.path.exists(pdf)
    print(('OK  ' if ok else 'FAIL') + f' {os.path.basename(pdf)}')
    errs = [l for l in log.splitlines() if 'error' in l.lower() and 'warning' not in l.lower()]
    over = [l for l in log.splitlines() if 'Overfull' in l]
    for e in errs[:10]: print('  ERR:', l0 := e[:160])
    print(f'  overfull: {len(over)}')
    for o in over[:12]: print('   ', o.strip()[:150])
    return ok, log

if __name__ == '__main__':
    keys = sys.argv[1:] or ['la57_ru']
    for k in keys:
        path = build(k)
        compile_tex(path)
