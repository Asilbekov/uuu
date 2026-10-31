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
from patches_la14 import PATCHES_RU

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
    'ie57_en': {'pdf': 'Introduction_to_Engineering_Weeks_5-7_EN.pdf', 'lang': 'en'},
    'ie57_uz': {'pdf': 'Introduction_to_Engineering_Weeks_5-7_UZ.pdf', 'lang': 'uz'},
    'ee57_ru': {'pdf': 'English_for_Engineering_I_Weeks_5-7_RU.pdf', 'lang': 'ru'},
    'ee57_uz': {'pdf': 'English_for_Engineering_I_Weeks_5-7_UZ.pdf', 'lang': 'uz'},
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

PERM_TABLE_EN = r"""\begin{center}\small
\begin{tabular}{@{}l l c l@{}}
\toprule
\textbf{Permutation} & \textbf{Matrix (row-wise)} & $\det P$ & $P^{-1} = P^{T}$ \\
\midrule
$I$ &
$\begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$ & $+1$ & $I$ \\
$P_{21}$ (swap rows 1, 2) &
$\begin{bmatrix} 0 & 1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$ & $-1$ & $P_{21}$ \\
$P_{32}$ (swap rows 2, 3) &
$\begin{bmatrix} 1 & 0 & 0 \\ 0 & 0 & 1 \\ 0 & 1 & 0 \end{bmatrix}$ & $-1$ & $P_{32}$ \\
$P_{31}$ (swap rows 1, 3) &
$\begin{bmatrix} 0 & 0 & 1 \\ 0 & 1 & 0 \\ 1 & 0 & 0 \end{bmatrix}$ & $-1$ & $P_{31}$ \\
$P_{32} P_{21}$ (cyclic) &
$\begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 1 \\ 1 & 0 & 0 \end{bmatrix}$ & $+1$ & $P_{21} P_{32}$ \\
$P_{21} P_{32}$ (cyclic) &
$\begin{bmatrix} 0 & 0 & 1 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{bmatrix}$ & $+1$ & $P_{32} P_{21}$ \\
\bottomrule
\end{tabular}
\end{center}"""

PERM_TABLE_UZ = r"""\begin{center}\small
\begin{tabular}{@{}l l c l@{}}
\toprule
\textbf{Almashtirish} & \textbf{Matritsa (qator boʻyicha)} & $\det P$ & $P^{-1} = P^{T}$ \\
\midrule
$I$ &
$\begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$ & $+1$ & $I$ \\
$P_{21}$ (1, 2-qatorlarni almashtirish) &
$\begin{bmatrix} 0 & 1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$ & $-1$ & $P_{21}$ \\
$P_{32}$ (2, 3-qatorlarni almashtirish) &
$\begin{bmatrix} 1 & 0 & 0 \\ 0 & 0 & 1 \\ 0 & 1 & 0 \end{bmatrix}$ & $-1$ & $P_{32}$ \\
$P_{31}$ (1, 3-qatorlarni almashtirish) &
$\begin{bmatrix} 0 & 0 & 1 \\ 0 & 1 & 0 \\ 1 & 0 & 0 \end{bmatrix}$ & $-1$ & $P_{31}$ \\
$P_{32} P_{21}$ (tsiklik) &
$\begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 1 \\ 1 & 0 & 0 \end{bmatrix}$ & $+1$ & $P_{21} P_{32}$ \\
$P_{21} P_{32}$ (tsiklik) &
$\begin{bmatrix} 0 & 0 & 1 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{bmatrix}$ & $+1$ & $P_{32} P_{21}$ \\
\bottomrule
\end{tabular}
\end{center}"""


UNITS_TABLE_RU = r"""\begin{center}\small
\begin{tabular}{@{}c l l l c@{}}
\toprule
\textbf{№} & \textbf{Величина} & \textbf{Определение} & \textbf{Интерпретация} & \textbf{Ед.\ СИ} \\
\midrule
1 & Скорость (velocity) & $v = dr/dt$ & Скорость изменения положения & м/с \\
2 & Скорость движения (speed) & $v = ds/dt = |dr/dt|$ & Скорость изменения пройденного пути $s$ & м/с \\
3 & Ускорение (acceleration) & $a = dv/dt = d^{2}r/dt^{2}$ & Скорость изменения скорости & м/с$^{2}$ \\
4 & Рывок (jerk) & $j = da/dt$ & Скорость изменения ускорения; важен для вибрации и плавности хода & м/с$^{3}$ \\
\bottomrule
\end{tabular}
\end{center}"""

UNITS_TABLE_EN = r"""\begin{center}\small
\begin{tabular}{@{}c l l l c@{}}
\toprule
\textbf{№} & \textbf{Quantity} & \textbf{Definition} & \textbf{Interpretation} & \textbf{SI Unit} \\
\midrule
1 & Velocity & $v = dr/dt$ & Rate of change of position & m/s \\
2 & Speed & $v = ds/dt = |dr/dt|$ & Rate of change of distance traveled & m/s \\
3 & Acceleration & $a = dv/dt = d^{2}r/dt^{2}$ & Rate of change of velocity & m/s$^{2}$ \\
4 & Jerk & $j = da/dt$ & Rate of change of acceleration; important for vibrations and smooth motion & m/s$^{3}$ \\
\bottomrule
\end{tabular}
\end{center}"""

UNITS_TABLE_UZ = r"""\begin{center}\small
\begin{tabular}{@{}c l l l c@{}}
\toprule
\textbf{№} & \textbf{Kattalik} & \textbf{Taʼrif} & \textbf{Tushuntirish} & \textbf{SI birligi} \\
\midrule
1 & Tezlik (velocity) & $v = dr/dt$ & Joylashuvning oʻzgarish tezligi & m/s \\
2 & Harakat tezligi (speed) & $v = ds/dt = |dr/dt|$ & Bosib oʻtilgan yoʻlning oʻzgarish tezligi & m/s \\
3 & Tezlanish (acceleration) & $a = dv/dt = d^{2}r/dt^{2}$ & Tezlikning oʻzgarish tezligi & m/s$^{2}$ \\
4 & Zarba (jerk) & $j = da/dt$ & Tezlanishning oʻzgarish tezligi; tebranishlar va silliq harakat uchun muhim & m/s$^{3}$ \\
\bottomrule
\end{tabular}
\end{center}"""

KINK_TABLE_RU = r"""\begin{center}\small
\begin{tabular}{@{}l c c c c l@{}}
\toprule
\textbf{Функция} & \textbf{Наклон слева} & \textbf{Наклон справа} & \textbf{Непрерывна в 0?} & \textbf{Дифференцируема в 0?} & \textbf{Поведение} \\
\midrule
$x^{2}$ & $0$ & $0$ & да & да & горизонтальная касательная \\
$|x|$ & $-1$ & $1$ & да & нет & излом (kink) \\
$|x|^{2/3}$ & $-\infty$ & $+\infty$ & да & нет & острие (cusp) \\
$x^{1/3}$ & $+\infty$ & $+\infty$ & да & нет & вертикальная касательная \\
\bottomrule
\end{tabular}
\end{center}"""

KINK_TABLE_EN = r"""\begin{center}\small
\begin{tabular}{@{}l c c c c l@{}}
\toprule
\textbf{Function} & \textbf{Left slope} & \textbf{Right slope} & \textbf{Continuous at 0?} & \textbf{Differentiable at 0?} & \textbf{Behavior} \\
\midrule
$x^{2}$ & $0$ & $0$ & yes & yes & horizontal tangent \\
$|x|$ & $-1$ & $1$ & yes & no & kink \\
$|x|^{2/3}$ & $-\infty$ & $+\infty$ & yes & no & cusp \\
$x^{1/3}$ & $+\infty$ & $+\infty$ & yes & no & vertical tangent \\
\bottomrule
\end{tabular}
\end{center}"""

KINK_TABLE_UZ = r"""\begin{center}\small
\begin{tabular}{@{}l c c c c l@{}}
\toprule
\textbf{Funksiya} & \textbf{Chap nishablik} & \textbf{Oʻng nishablik} & \textbf{0 da uzluksizmi?} & \textbf{0 da hosilasi bormi?} & \textbf{Xulq-atvori} \\
\midrule
$x^{2}$ & $0$ & $0$ & ha & ha & gorizontal teguvchi \\
$|x|$ & $-1$ & $1$ & ha & yoʻq & burilish (kink) \\
$|x|^{2/3}$ & $-\infty$ & $+\infty$ & ha & yoʻq & uch (cusp) \\
$x^{1/3}$ & $+\infty$ & $+\infty$ & ha & yoʻq & vertikal teguvchi \\
\bottomrule
\end{tabular}
\end{center}"""

# Per-guide content patches: fix original-PDF scrambles.
SI_TABLE_EN = r"""\begin{center}\small
\begin{tabular}{@{}l c c@{}}
\toprule
\textbf{Prefix} & \textbf{Symbol} & \textbf{Power} \\
\midrule
tera & T & $10^{12}$ \\
giga & G & $10^{9}$ \\
mega & M & $10^{6}$ \\
kilo & k & $10^{3}$ \\
milli & m & $10^{-3}$ \\
micro & \textmu & $10^{-6}$ \\
nano & n & $10^{-9}$ \\
pico & p & $10^{-12}$ \\
femto & f & $10^{-15}$ \\
\bottomrule
\end{tabular}
\end{center}"""

SI_TABLE_UZ = r"""\begin{center}\small
\begin{tabular}{@{}l c c@{}}
\toprule
\textbf{Qo'shimcha} & \textbf{Belgi} & \textbf{Daraja} \\
\midrule
tera & T & $10^{12}$ \\
giga & G & $10^{9}$ \\
mega & M & $10^{6}$ \\
kilo & k & $10^{3}$ \\
milli & m & $10^{-3}$ \\
mikro & \textmu & $10^{-6}$ \\
nano & n & $10^{-9}$ \\
piko & p & $10^{-12}$ \\
femto & f & $10^{-15}$ \\
\bottomrule
\end{tabular}
\end{center}"""

SI_TABLE_RU = r"""\begin{center}\small
\begin{tabular}{@{}l c c@{}}
\toprule
\textbf{Приставка} & \textbf{Символ} & \textbf{Степень} \\
\midrule
тера & T & $10^{12}$ \\
гига & G & $10^{9}$ \\
мега & M & $10^{6}$ \\
кило & k & $10^{3}$ \\
милли & m & $10^{-3}$ \\
микро & µ & $10^{-6}$ \\
нано & n & $10^{-9}$ \\
пико & p & $10^{-12}$ \\
фемто & f & $10^{-15}$ \\
\bottomrule
\end{tabular}
\end{center}"""

PATCHES = {
    'm14_ru': [
        {'kind': 'table', 're': r"\['Степень'", 'action': 'replace_latex', 'latex': 'SI_TABLE_RU'},
        # missing-paren radicals and lost radical glyphs on moduli
        {'kind': 'p', 're': '√3 \+ 1 = 2', 'action': 'fix',
         'sub': (r'√3 \+ 1 = 2', r'√(3 + 1) = 2')},
        {'kind': 'p', 're': '√1 \+ 3 = 2', 'action': 'fix',
         'sub': (r'√1 \+ 3 = 2', r'√(1 + 3) = 2')},
        {'kind': 'p', 're': 'модуль 13', 'action': 'fix',
         'sub': (r'\|z\| = 13', r'|z| = √13')},
        {'kind': 'p', 're': 'модуль 13', 'action': 'fix',
         'sub': (r'модуль 13', r'модуль √13')},
        {'kind': 'p', 're': 'модуль 17', 'action': 'fix',
         'sub': (r'модуль 17', r'модуль √17')},
        # targeted in-block repairs (whole-block content patches would lose the
        # surrounding solution text -- see patches_m14.py notes)
        # (85) catalogue: torn lim subscripts + lost p/q fraction
        {'kind': 'p', 're': 'Многочлены/рациональные', 'action': 'fix',
         'sub': (r'(_\{x\} )?lim_\{→a\} p\(x\) = p\(a\), lim q\(a\) \(q\(a\) ̸= 0\)\. \(85\) x→a ',
                 r'lim_{x→a} p(x) = p(a), lim_{x→a} p(x)/q(x) = p(a)/q(a) (q(a) ≠ 0). (85) ')},
        # discriminant block: lost radical on √∆ and torn fraction
        {'kind': 'p', 're': 'Дискриминант', 'action': 'fix',
         'sub': (r'∆= \(−4\)\^\{2\} − 4 · 13 = √ 16 − 52 = −36, ∆= 6i; x = \^\{4±6i\}',
                 r'∆ = (−4)^{2} − 4·13 = 16 − 52 = −36, √∆ = 6i; x = (4 ± 6i)/2')},
        # one-sided limits: superscript drifted after the closing brace
        {'kind': 'p', 're': 'односторонние пределы в стыке|параболическая ветвь', 'action': 'fix',
         'sub': (r'lim_\{x→3\} − f', r'lim_{x→3−} f')},
        {'kind': 'p', 're': 'односторонние пределы в стыке|параболическая ветвь', 'action': 'fix',
         'sub': (r'lim_\{x→3\} \+\(x \+ 4\)', r'lim_{x→3+} (x + 4)')},
        # 0.375: stacked fraction torn apart, denominator drifted to next sentence
        {'kind': 'p', 're': '0\\.375 конечно', 'action': 'fix',
         'sub': (r'0\.375 = \^\{375\} = _\{8\}\^\{3\}\. \(2\) 1000 ',
                 r'0.375 = 375/1000 = 3/8. (2) ')},
        {'kind': 'p', 're': '0\\.27 = 27_\{99\}', 'action': 'fix',
         'sub': (r'0\.27 = 27_\{99\} = 3_\{11\}', r'0.27 = 27/99 = 3/11')},
        # discriminant block: lost radical on √∆ and torn fraction
        {'kind': 'p', 're': 'Дискриминант', 'action': 'fix',
         'sub': (r'∆= \(−4\)\^\{2\} − 4 · 13 = √ 16 − 52 = −36, ∆= 6i; x = \^\{4±6i\}',
                 r'∆ = (−4)^{2} − 4·13 = 16 − 52 = −36, √∆ = 6i; x = (4 ± 6i)/2')},
        # one-sided limits: superscript drifted after the closing brace
        {'kind': 'p', 're': 'параболическая ветвь', 'action': 'fix',
         'sub': (r'lim_\{x→3\} − f', r'lim_{x→3−} f')},
        {'kind': 'p', 're': 'параболическая ветвь', 'action': 'fix',
         'sub': (r'lim_\{x→3\} \+\(x \+ 4\)', r'lim_{x→3+} (x + 4)')},
        # symmetry of r(x) = (x+1)/(x-1): torn stacked fraction
        {'kind': 'p', 're': 'Симметрия: r\\(−x\\)', 'action': 'fix',
         'sub': (r'r\(−x\) = \^\{−\}_\{−\}\^\{x\}_\{x\}\^\{\+1\}_\{−1\} = x_\{x\+1\}\^\{−1\} ̸= ±r\(x\)',
                 r'r(−x) = (−x + 1)/(−x − 1) = (x − 1)/(x + 1) ≠ ±r(x)')},
        # log equations: b-part torn fraction; f-part formula lives in next f-block
        {'kind': 'p', 're': 'b\\. x = 5\\^\\{−2\\}', 'action': 'fix',
         'sub': (r'b\. x = 5\^\{−2\} = _\{25\}\^\{1\}', r'b. x = 5^{−2} = 1/25')},
        {'kind': 'p', 're': 'b\\. x = 5\\^\\{−2\\}', 'action': 'fix',
         'sub': (r'Объединяем: log_\{6\}.*$', r'Объединяем:')},
    ],
    'm14_en': [
        {'kind': 'table', 're': r"\['Power'", 'action': 'replace_latex', 'latex': 'SI_TABLE_EN'},
        # missing-paren radicals: |√3+i| = √(3+1) = 2 (was '√3 + 1 = 2')
        {'kind': 'p', 're': '√3 \+ 1 = 2', 'action': 'fix',
         'sub': (r'√3 \+ 1 = 2', r'√(3 + 1) = 2')},
        {'kind': 'p', 're': '√1 \+ 3 = 2', 'action': 'fix',
         'sub': (r'√1 \+ 3 = 2', r'√(1 + 3) = 2')},
        # moduli that lost the radical glyph: (2,3) -> √13, (-1,4) -> √17
        {'kind': 'p', 're': 'modulus 13', 'action': 'fix',
         'sub': (r'\|z\| = 13', r'|z| = √13')},
        {'kind': 'p', 're': 'modulus 13', 'action': 'fix',
         'sub': (r'modulus 13', r'modulus √13')},
        {'kind': 'p', 're': 'modulus 17', 'action': 'fix',
         'sub': (r'modulus 17', r'modulus √17')},
        # (85) catalogue: the p(x)/q(x) fraction was lost entirely
        {'kind': 'p', 're': 'Polynomials/Rational', 'action': 'fix',
         'sub': (r'lim_\{x→a\} q\(x\) = q\(a\)',
                 r'lim_{x→a} p(x)/q(x) = p(a)/q(a)')},
        # 0.375: stacked fraction torn apart (same as RU)
        {'kind': 'p', 're': '0\\.375 is finite', 'action': 'fix',
         'sub': (r'0\.375 = \^\{375\} = _\{8\}\^\{3\}\. \(2\) 1000 ',
                 r'0.375 = 375/1000 = 3/8. (2) ')},
        {'kind': 'p', 're': '0\\.375 is finite', 'action': 'fix',
         'sub': (r'0\.27 = 27_\{99\} = 3_\{11\}', r'0.27 = 27/99 = 3/11')},
        # odd g(x) = x/(x^2+1): torn stacked fraction
        {'kind': 'p', 're': 'g\(x\) = _\{x2\}', 'action': 'fix',
         'sub': (r'g\(x\) = _\{x2\}\^\{x\}_\{\+1\}: g\(−x\) = _\{x\}\^\{−\}_\{2\+1\}\^\{x\}',
                 r'g(x) = x/(x^{2}+1): g(−x) = −x/(x^{2}+1)')},
        # duplicate 'sin x = x + o(x)' paragraph after the formula line
        {'kind': 'p', 're': r'^sin x = x \+ o\(x\)', 'action': 'skip'},
        # discriminant block: lost radical on √∆ and torn fraction
        {'kind': 'p', 're': 'Discriminant', 'action': 'fix',
         'sub': (r'∆= \(−4\)\^\{2\} − 4 · 13 = √ 16 − 52 = −36, ∆= 6i; x = \^\{4±6i\}',
                 r'∆ = (−4)^{2} − 4·13 = 16 − 52 = −36, √∆ = 6i; x = (4 ± 6i)/2')},
        # one-sided limits: superscript drifted after the closing brace
        {'kind': 'p', 're': 'parabolic branch', 'action': 'fix',
         'sub': (r'lim_\{x→3\} − f', r'lim_{x→3−} f')},
        {'kind': 'p', 're': 'parabolic branch', 'action': 'fix',
         'sub': (r'lim_\{x→3\} \+\(x \+ 4\)', r'lim_{x→3+} (x + 4)')},
        # discriminant block: lost radical on √∆ and torn fraction
        {'kind': 'p', 're': 'Discriminant', 'action': 'fix',
         'sub': (r'∆= \(−4\)\^\{2\} − 4 · 13 = √ 16 − 52 = −36, ∆= 6i; x = \^\{4±6i\}',
                 r'∆ = (−4)^{2} − 4·13 = 16 − 52 = −36, √∆ = 6i; x = (4 ± 6i)/2')},
        # one-sided limits: superscript drifted after the closing brace
        {'kind': 'p', 're': 'one-sided limits at the junction|parabolic branch', 'action': 'fix',
         'sub': (r'lim_\{x→3\} − f', r'lim_{x→3−} f')},
        {'kind': 'p', 're': 'one-sided limits at the junction|parabolic branch', 'action': 'fix',
         'sub': (r'lim_\{x→3\} \+\(x \+ 4\)', r'lim_{x→3+} (x + 4)')},
    ],
    'm14_uz': [
        {'kind': 'table', 're': r"Daraja Qo'", 'action': 'replace_latex', 'latex': 'SI_TABLE_UZ'},
        {'kind': 'p', 're': '√3 \+ 1 = 2', 'action': 'fix',
         'sub': (r'√3 \+ 1 = 2', r'√(3 + 1) = 2')},
        {'kind': 'p', 're': '√1 \+ 3 = 2', 'action': 'fix',
         'sub': (r'√1 \+ 3 = 2', r'√(1 + 3) = 2')},
        {'kind': 'p', 're': 'moduli 13', 'action': 'fix',
         'sub': (r'\|z\| = 13', r'|z| = √13')},
        {'kind': 'p', 're': 'moduli 13', 'action': 'fix',
         'sub': (r'moduli 13', r'moduli √13')},
        {'kind': 'p', 're': 'moduli 17', 'action': 'fix',
         'sub': (r'moduli 17', r'moduli √17')},
        {'kind': 'p', 're': 'modul 13', 'action': 'fix',
         'sub': (r'modul 13', r'modul √13')},
        {'kind': 'p', 're': 'modul 13', 'action': 'fix',
         'sub': (r'modul 17', r'modul √17')},
        # discriminant block: lost radical on √∆ and torn fraction
        {'kind': 'p', 're': 'Diskriminant', 'action': 'fix',
         'sub': (r'∆= \(−4\)\^\{2\} − 4 · 13 = √ 16 − 52 = −36, ∆= 6i; x = \^\{4±6i\}',
                 r'∆ = (−4)^{2} − 4·13 = 16 − 52 = −36, √∆ = 6i; x = (4 ± 6i)/2')},
        # one-sided limits: superscript drifted after the closing brace
        {'kind': 'p', 're': 'parabolik', 'action': 'fix',
         'sub': (r'lim_\{x→3\} − f', r'lim_{x→3−} f')},
        {'kind': 'p', 're': 'parabolik', 'action': 'fix',
         'sub': (r'lim_\{x→3\} \+\(x \+ 4\)', r'lim_{x→3+} (x + 4)')},
        # (85) catalogue: same torn subscripts as RU
        {'kind': 'p', 're': "Ko'phadlar/ratsional", 'action': 'fix',
         'sub': (r'(_\{x\} )?lim_\{→a\} p\(x\) = p\(a\), lim q\(a\) \(q\(a\) ̸= 0\)\. \(85\) x→a ',
                 r'lim_{x→a} p(x) = p(a), lim_{x→a} p(x)/q(x) = p(a)/q(a) (q(a) ≠ 0). (85) ')},
        {'kind': 'p', 're': '0\\.375 chekli', 'action': 'fix',
         'sub': (r'0\.375 = \^\{375\} = _\{8\}\^\{3\}\. \(2\) 1000 ',
                 r'0.375 = 375/1000 = 3/8. (2) ')},
        {'kind': 'p', 're': '0\\.375 chekli', 'action': 'fix',
         'sub': (r'0\.27 = 27_\{99\} = 3_\{11\}', r'0.27 = 27/99 = 3/11')},
        # sin 5x with the 5 glued as an exponent
        {'kind': 'p', 're': 'almashtirish \(x → 0', 'action': 'fix',
         'sub': (r'sin\^\{5\} x/x = 5·sin\^\{5\} x/5x',
                 r'sin 5x/x = 5·sin 5x/(5x)')},
        # log equations: b-part torn fraction; f-tail formula in next f-block
        {'kind': 'p', 're': 'b\. x = 5\^\{−2\}', 'action': 'fix',
         'sub': (r'b\. x = 5\^\{−2\} = _\{25\}\^\{1\}', r'b. x = 5^{−2} = 1/25')},
        {'kind': 'p', 're': 'b\. x = 5\^\{−2\}', 'action': 'fix',
         'sub': (r'Birlashtiramiz: log_\{6\}.*$', r'Birlashtiramiz:')},
    ],
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
    'm57_ru': [
        {'kind': 'table', 're': r"\['№', 'Величина'", 'action': 'replace_latex', 'latex': 'UNITS_TABLE_RU'},
        {'kind': 'table', 're': r"\['ФункцияНаклон", 'action': 'replace_latex', 'latex': 'KINK_TABLE_RU'},
    ],
    'm57_en': [
        {'kind': 'table', 're': r"\['№', 'Quantity'", 'action': 'replace_latex', 'latex': 'UNITS_TABLE_EN'},
        {'kind': 'table', 're': r"\['Function", 'action': 'replace_latex', 'latex': 'KINK_TABLE_EN'},
    ],
    'm57_uz': [
        # original PDF leaked raw LaTeX: the closing brace after x=a is missing
        {'kind': 'p', 're': r'Leybnits notatsiyasi', 'action': 'fix',
         'sub': (r'\|_\{x=a; Leybnits', r'|_{x=a}; Leybnits')},
        # crossed superscript markers in the 2^x derivative chain
        {'kind': 'p', 're': r'2\^\{2\)\}\^\{x\}|e\^\{\(x·ln\}', 'action': 'fix',
         'sub': (r'e\^\{\(x·ln\} \·ln 2 = 2\^\{2\)\}\^\{x\} \·ln 2', r'e^{x·ln 2} ·ln 2 = 2^{x} ·ln 2')},
        {'kind': 'table', 're': r"\['№', 'Kattalik'", 'action': 'replace_latex', 'latex': 'UNITS_TABLE_UZ'},
        {'kind': 'table', 're': r"\['Funksiya", 'action': 'replace_latex', 'latex': 'KINK_TABLE_UZ'},
    ],
    'la57_en': [
        {'kind': 'p', 're': r'^E\^\{-1\}_\{2\}', 'action': 'skip'},
        {'kind': 'f', 're': r'^E_\{k\} ···E_\{2E1A\}', 'action': 'replace',
         'latex': r'\[ E_k \cdots E_2 E_1 A = U \;\rightarrow\; A = E_1^{-1} E_2^{-1} \cdots E_k^{-1} U = LU \]'},
        {'kind': 'table', 're': r"\['Permutation'", 'action': 'replace_latex',
         'latex': 'PERM_TABLE_EN'},
    ],
    'la57_uz': [
        {'kind': 'p', 're': r'^E\^\{-1\}_\{2\}', 'action': 'skip'},
        {'kind': 'f', 're': r'^E_\{k\} ···E_\{2E1A\}', 'action': 'replace',
         'latex': r'\[ E_k \cdots E_2 E_1 A = U \;\rightarrow\; A = E_1^{-1} E_2^{-1} \cdots E_k^{-1} U = LU \]'},
        {'kind': 'table', 're': r"\['Almashtirish'", 'action': 'replace_latex',
         'latex': 'PERM_TABLE_UZ'},
    ],
}

# ---------------------------------------------------------------- text helpers

def despace(s):
    """'У Ч Е Б Н О Е' -> 'УЧЕБНОЕ' (letterspaced cover lines)."""
    return re.sub(r'(?<=[А-ЯЁA-Z]) (?=[А-ЯЁA-Z0-9])', '', s)

def fix_merged_indices(t):
    """Original PDF renders 'E₂E₁A' with the whole '2E1A' as one sub-span:
    _{2E1A} -> _{2}E_{1}A,  _{2E1} -> _{2}E_{1} (visual reading restored).
    Math W1-4: scattered radical glyphs '√ √ √ 50' -> '√50'."""
    t = re.sub(r'_\{(\d+)E(\d+)([A-Za-z]*)\}', r'_{\1}E_{\2}\3', t)
    t = re.sub(r'\^\{(\d+)([a-zA-Z])\}', r'^{\1}\2', t)
    t = re.sub(r'√(\s*√)+', '√', t)
    t = re.sub(r'√\s*\(', '√(', t)
    # torn limit subscripts: 'lim_{x}_{→a}' -> 'lim_{x→a}'
    t = re.sub(r'(lim_\{[^}]+\})_\{(→[^}]+)\}', r'\1\2', t)
    t = re.sub(r'lim_\{\}_\{', 'lim_{', t)
    t = re.sub(r'lim_\{x\}_\{→([^}]+)\}', r'lim_{x→\1}', t)
    # 'lim_{t→∞}_{A(t)}' -> 'lim_{t→∞} A(t)'
    t = re.sub(r'(lim_\{[^}]+\})_\{([A-Za-z(][^}]*\()', r'\1 \2', t)
    # torn pi fractions: '5_{4}^{π}' -> '5π/4'
    t = re.sub(r'(\d+)_\{(\d+)\}\^\{π\}', r'^{\1π}_{\2}', t)
    # combining diacritics: keep attached to the base letter (z̄); texify
    # renders it as \bar{z} inside math runs. Strip orphans after non-word chars.
    t = re.sub(r'(?<![\w\u0300-\u036f\u20d0-\u20df])[\u0304\u0302\u0307\u0308\u20d7]', '', t)
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
    """\\[ .. \\], split overlong at top-level commas/semicolons (= too) into gather*."""
    if est_width(tex) > 85:
        parts = split_top_commas(tex)
        if len(parts) == 1:
            # '=' chains (long complex-number arithmetic): split at ' = '
            eq_parts = re.split(r'(?<=[})\d]) = (?=[\\(\d])', tex)
            if len(eq_parts) >= 3:
                half = (len(eq_parts) + 1) // 2
                first = ' = '.join(eq_parts[:half])
                second = ' = '.join(eq_parts[half:])
                return ('\\begin{gather*}\n' + first + ' \\\\\n' + second +
                        '\n\\end{gather*}')
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


def repair_bmatrix(raw):
    """Repair a raw leaked bmatrix: restore backslashes and row separators.
    'begin{bmatrix} 3 & 12 -10 & -14 end{bmatrix}' ->
    '\\begin{bmatrix} 3 & 12 \\\\ -10 & -14 \\end{bmatrix}' (number-after-number = new row)."""
    m = re.match(r'^(\\)?begin\{bmatrix\}(.*?)(\\)?end\{bmatrix\}$', raw.strip(), re.S)
    if not m:
        return raw
    body = m.group(2).strip()
    toks = body.replace('\\', ' \\ ').split()
    rows, cur = [], []
    prev_num = False
    for tk in toks:
        if tk == '\\':
            rows.append(' '.join(cur)); cur = []; prev_num = False; continue
        is_num = bool(re.fullmatch(r'[-+]?[0-9.]+', tk))
        if is_num and prev_num and cur:
            rows.append(' '.join(cur)); cur = []
        cur.append(tk)
        prev_num = is_num
    if cur:
        rows.append(' '.join(cur))
    rows = [r.replace(' & ', ' & ') for r in rows if r.strip()]
    return '\\begin{bmatrix} ' + ' \\\\ '.join(rows) + ' \\end{bmatrix}'

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
        if est_width(run) > 45:
            parts = split_inline_points(run)
            if len(parts) >= 2:
                return ('\\(' + parts[0].rstrip() + '\\)') + ''.join(
                    (' \\(' + p.strip() + '\\)') for p in parts[1:])
        return m.group(0)
    return re.sub(r'\\\((.*?)\\\)', repl, par_tex, flags=re.S)

# ---------------------------------------------------------------- blocks

CONTENT_PATCHES = []

def merge_raw_fragments(blocks):
    """Merge f-blocks whose leaked bmatrix is split across blocks."""
    out = []
    for b in blocks:
        if (out and b.get('k') == 'f' and out[-1].get('k') == 'f'
                and out[-1].get('t', '').count('begin{bmatrix}') != out[-1].get('t', '').count('end{bmatrix}')):
            out[-1] = dict(out[-1])
            out[-1]['t'] = out[-1]['t'] + ' ' + b['t']
        else:
            out.append(b)
    return out

def render_blocks(blocks, lang, guide_key):
    blocks = merge_raw_fragments(blocks)
    patches = PATCHES.get(guide_key, [])
    out = []
    prev_kind = None
    for b in blocks:
        k = b['k']
        # --- patch pass
        skip = False
        raw_t = b.get('t', '') or ''
        if chr(0) in raw_t:
            cleaned = raw_t.replace(chr(0), '').strip()
            if len(cleaned) <= 22:
                skip = True   # orphan stacked-vector fragment
                continue
        for frag_kind, frag, new_text in CONTENT_PATCHES:
            if frag_kind == 'drop' and k in ('p', 'f', 'q') and frag in b.get('t', ''):
                skip = True
                break
            if frag_kind == 'has' and k in ('p', 'f', 'q') and frag in b.get('t', ''):
                b = dict(b)
                b['t'] = new_text
                # bold only reconstructed question heads ("N. ..."), not solutions/fragments
                if k == 'p' and re.match(r'^\d+[.\)]\s', new_text):
                    b['bold'] = 1
                break
        for p in patches:
            if p['kind'] != k:
                continue
            if k == 'table':
                target = str(b.get('rows', ''))
            else:
                target = b.get('t', '')
            if re.search(p['re'], target):
                if p['action'] == 'fix':
                    b = dict(b)
                    b['t'] = re.sub(p['sub'][0], p['sub'][1], b['t'])
                elif p['action'] == 'skip':
                    skip = True
                elif p['action'] == 'replace':
                    out.append(p['latex'])
                    skip = True
                elif p['action'] == 'replace_latex':
                    registry = {k: v for k, v in globals().items() if k.endswith('_TABLE_RU') or k.endswith('_TABLE_EN') or k.endswith('_TABLE_UZ')}
                    table = registry.get(p['latex'], p['latex'])
                    out.append(table)
                    skip = True
                break
        if skip:
            continue
        if k in ('p', 'f', 'q', 'h3'):
            b = dict(b)
            b['t'] = fix_merged_indices(b.get('t', '').replace(chr(0), ''))
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
            t = texify(break_long_tokens_raw(b['t']))
            t = split_inline_runs(t)
            t = apply_allowbreaks(t)
            if b.get('bold'):
                t = '\\textbf{' + t + '}'
            out.append(t + '\\par')
        elif k == 'f':
            t = b['t']
            if 'begin{bmatrix}' in t and not re.search(r'[А-Яа-яЁё]', t):
                # raw leaked line (one or several bmatrix blocks + operators)
                repaired = re.sub(r'(\\)?begin\{bmatrix\}(.*?)(\\)?end\{bmatrix\}',
                                  lambda m: repair_bmatrix(m.group(0)), t, flags=re.S)
                out.append('\\[' + repaired.strip() + '\\]')
                prev_kind = 'f'
                continue
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
            out.append('{\\footnotesize\\itshape ' + apply_allowbreaks(texify(break_long_tokens_raw(b['t']))) + '\\par}')
        elif k == 'li':
            out.append('\\begin{itemize}\\setlength{\\itemsep}{1pt}\\item ' +
                       apply_allowbreaks(texify(break_long_tokens_raw(b['t']))) + '\\end{itemize}')
        elif k == 'table':
            out.append(render_table(b['rows']))
        prev_kind = k
    return '\n\n'.join(out)

SENT = '\u0001'


def break_long_tokens_raw(text, minlen=14):
    """Mark natural break points inside unbreakable long runs (camelCase file
    names like Lecture05ProblemFramingandModellingII.txt, file:///...%20 URLs)
    with a sentinel character. The sentinel is later replaced by \allowbreak{};
    when no break happens the rendered text is identical to the original."""
    out = []
    for tok in re.split(r'(\s+)', text):
        if len(tok) >= minlen:
            t = re.sub(r'(?<=[a-z0-9])(?=[A-Z])', SENT, tok)      # camelCase
            t = re.sub(r'(?<=/)', SENT, t)                        # path separators
            t = re.sub(r'(?<=%20)', SENT, t)                      # URL-encoded spaces
            tok = t
        out.append(tok)
    return ''.join(out)


def apply_allowbreaks(tex):
    return tex.replace(SENT, '\\allowbreak{}')


def render_table(rows):
    if not rows:
        return ''
    ncols = max(len(r) for r in rows)
    # content-proportional column widths (clamped), total 0.93\linewidth;
    # cells are ragged-right so justification can never overfull a column
    raw = []
    for ci in range(ncols):
        m = 5
        for r in rows:
            if ci < len(r) and r[ci]:
                m = max(m, len(r[ci]))
        raw.append(m)
    tot = sum(raw)
    w = [min(0.42, max(0.08, 0.93 * L / tot)) for L in raw]
    # a column must at least fit its longest unbreakable token (~5.5pt/char at \small)
    for ci in range(ncols):
        longest_tok = 5
        for r in rows:
            if ci < len(r) and r[ci]:
                for tok in r[ci].split():
                    longest_tok = max(longest_tok, len(tok))
        min_w = min(0.30, (longest_tok * 5.5 + 10) / 465.0)
        w[ci] = max(w[ci], min_w)
    s = sum(w)
    w = [x * 0.93 / s for x in w]
    spec = ' '.join(f'>{{\\raggedright\\arraybackslash}}p{{{x:.2f}\\linewidth}}' for x in w)
    lines = ['\\begin{center}\\small', '\\begin{tabular}{@{}' + spec + '@{}}', '\\toprule']
    for i, r in enumerate(rows):
        cells = list(r) + [''] * (ncols - len(r))
        cells = [apply_allowbreaks(texify(break_long_tokens_raw(c, minlen=18)).replace('\n', ' ')) or ' ' for c in cells]
        lines.append(' & '.join(cells) + ' \\\\')
        if i == 0:
            lines.append('\\midrule')
    lines += ['\\bottomrule', '\\end{tabular}', '\\end{center}']
    return '\n'.join(lines)

# ---------------------------------------------------------------- document

PREAMBLE_RU = r"""\documentclass[11pt]{article}
\usepackage[a4paper, margin=2.3cm, headheight=16pt]{geometry}
\usepackage{amsmath, amssymb, booktabs, array}
\usepackage{fontspec}
\usepackage{polyglossia}
\setmainlanguage{<<LANG>>}
\setotherlanguage{english}
\setmainfont{DejaVu Serif}
\setsansfont{DejaVu Sans}
<<CYRFONTS>>
\usepackage{fancyhdr}
\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\small\itshape <<HL>>}
\fancyhead[R]{\small\itshape <<HR>>}
\fancyfoot[C]{\small\thepage}
\renewcommand{\headrulewidth}{0.3pt}
\setlength{\parindent}{0pt}
\setlength{\parskip}{4pt plus 1pt}
\emergencystretch=<<STRETCH>>em
\renewcommand{\arraystretch}{1.25}
\begin{document}
"""

def build(key):
    global CONTENT_PATCHES
    from patches_la14 import PATCHES_EN, PATCHES_UZ
    from patches_m14 import PATCHES_M14_RU
    from patches_m14_extra import (PATCHES_M14_RU_EXTRA, PATCHES_M14_EN,
                                    PATCHES_M14_UZ)
    CONTENT_PATCHES = {'la14_ru': PATCHES_RU, 'la14_en': PATCHES_EN,
                       'la14_uz': PATCHES_UZ,
                       'm14_ru': PATCHES_M14_RU + PATCHES_M14_RU_EXTRA,
                       'm14_en': PATCHES_M14_EN,
                       'm14_uz': PATCHES_M14_UZ}.get(key, [])
    cfg = GUIDES[key]
    import texify as _texify_mod
    # text-oriented guides: square brackets stay plain text (units '[h/day]',
    # templates '[the system]', '[Source: X]'), never bmatrix/math
    _texify_mod.TEXT_BRACKETS = key.startswith(('ie57', 'ee57'))
    with open(f'{WORK}/{key}.json') as f:
        data = json.load(f)
    cover = data['cover']
    blocks = data['blocks']

    # --- cover parsing
    eyebrow = despace(cover[0])
    title = cover[1]
    subtitle = cover[2]
    body = cover[3:]
    uni_idx = next((i for i, t in enumerate(body) if any(w in t.lower() for w in ('университет', 'university', 'universitet'))), None)
    desc = ' '.join(body[:uni_idx]) if uni_idx else ' '.join(body)
    uni = body[uni_idx] if uni_idx is not None else ''
    src_start = next((i for i, t in enumerate(body) if t.startswith(('Источники', 'Sources', 'Manba'))), None)
    sources = ' '.join(body[src_start:-1]) if src_start is not None and src_start < len(body) - 1 else ''
    footer = despace(cover[-1])
    # fix the original footer collision: 'РЕШЕНИЯОКТЯБРЬ2026' -> '... · ОСЕНЬ 2026'
    footer = re.sub(r'(РЕШЕНИЯ)\s*О\s*К\s*Т\s*Я\s*Б\s*Р\s*Ь\s*2\s*0\s*2\s*6', r'\1 · ОСЕНЬ 2026', footer)

    hl = title + (' — ' + subtitle.lower() if subtitle else '')
    lang = cfg['lang']
    lang_cmd = {'ru': 'russian', 'en': 'english', 'uz': 'english'}[lang]
    cyr = ('\\newfontfamily\\cyrillicfont{DejaVu Serif}\n'
           '\\newfontfamily\\cyrillicfontsf{DejaVu Sans}') if lang == 'ru' else '% no cyrillic fonts needed'
    hr = data.get('header', {}).get('right') or '·'
    hl_head = data.get('header', {}).get('left') or hl
    preamble = (PREAMBLE_RU.replace('<<LANG>>', lang_cmd)
                .replace('<<STRETCH>>', '4.0' if lang == 'uz' else '2.5')
                .replace('<<CYRFONTS>>', cyr)
                .replace('<<HL>>', esc_text(hl_head)).replace('<<HR>>', esc_text(hr)))

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
