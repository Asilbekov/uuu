# Post-build fixes — text-subject guides (Oct 31, 2026)

The 17 text-subject guides (CS 4-7, English 1-4 & 5-7, History 1-4 & 5-6,
ITE 1-4 & 5-7 — all languages) were rebuilt in the approved Math/LA v1 style
(DejaVu Serif 10.9pt, LaTeX/Tectonic). Three defects were found in the
built .tex and fixed:

1. **Natural language trapped in math mode** (~13,400 inline runs). The
   math-oriented texify pulled English/Uzbek words (We, If, In, Bu, o'nta),
   question labels (S1, T6, P1, B1, L5-1), abbreviations (TED, QR, CS50,
   EAP B1, PF-5775, EJF), option letters (a), b)), number+unit pairs
   (96 km, 18 Vt) and hex literals (0x77) into \(..\), rendering them in
   Computer Modern math italic in the middle of DejaVu text. The v1
   originals are ReportLab TEXT documents — no math at all. Fix:
   `fix_text_math.py` demotes every \(..\)-run that carries no real math
   (no TeX command, no operator = < > + <= >= != -> ..., no ^{}/_{} marker):
   it stays plain text. Plus a second pass for word runs whose only command
   is a separator \cdot ("CC-INEN010104 · 4 ECTS") -> text with ·.

2. **Torn table headers in the W5-7 translation builds** (ie57_en/uz):
   "Cost [million UZS/year]" and "Hours [h/day]" had lost the "[m"/"[h"
   fragments ("Cost illion UZS/year]", "Hours /day]"); restored from the
   verified RU source table. Same class: the merged token "Framingand".

3. **Too-wide tables in the 11:06 translation builds** (ie57_en/uz):
   render_table summed p-widths to 0.93\linewidth but ignored the inner
   \tabcolsep gaps (2 x 5.4pt per gap at \small) — 5- and 7-column tables
   overflowed the right margin by up to 39pt. Fix: `fix_table_widths.py`
   rescales the p-widths to \linewidth minus the gaps. Also added
   \tolerance=1400 (DejaVu Serif has little interword stretch — without it
   the line breaker prefers overfull lines).

The equivalent fixes are PORTED into the pipeline source so future rebuilds
are correct from the start:
- texify.py: TEXT_GUIDE mode (build_guide sets it for every key except
  m14/m57/la14/la57) — word-only runs never become math; '/' and '|'
  stop being math tokens (units are text).
- build_guide.py: \tolerance=1400 in the preamble; render_table p-widths
  account for \tabcolsep.

NOTE: the builder extensions for the 13 non-translation guides (CS/History/
ITE-W14/EE codeblock env, longtable, size-aware cover parsing, extractor
code-block detection) were lost in a sandbox reset AFTER the verified .tex
outputs were produced. All 17 PDFs here were therefore rebuilt from the
surviving .tex outputs (work/*.tex in the build workspace) with the
post-build patches above applied directly to them. The four
pipeline-rebuildable translation guides (ie57_en/uz, ee57_ru/uz) can also
be regenerated with `python3 build_guide.py <key>` — that result differs
cosmetically (table column distribution) but carries the same fixes.

Verification (scripts/verify_final.py + geometric scan): 17/17 guides —
0 tofu, 0 margin overflow, 0 blank pages, uniform 10.9pt top size
(7-9 font sizes vs 11-16 in the 2fa7cf7 originals), CM math share
0.4-3.7% (only real formulas), S/T question-label counts exactly
preserved (96/49/53/42 per guide), content length ratio 0.99-1.01.

## Figures for ITE Weeks 5-7 (Oct 31, later)

The three `Introduction_to_Engineering_Weeks_5-7_{RU,EN,UZ}.pdf` guides got the
same treatment as the approved Weeks 1-4 volume (commit 87d7bab): six topic
diagrams per language, one pair per week, designed in HTML/CSS in the W1-4
palette (paper #F7F5F0 cards, gold #DFC290 / sienna #BF7F3F / steel #325675
accents, FreeSerif), rendered via Playwright at 2x (1860/1460px wide), and
embedded with centered gray captions exactly like the W1-4 figures:

  - Рис. 1/Fig. 1/1-rasm — anatomy of a model (inputs·parameters →
    relationships → outputs, week-4 variables in model roles), week 5
  - Рис. 2 — the electric-bus model: 160 kWh / 133 km / 96 km, the three
    kinds of assumptions + the writing template, week 5
  - Рис. 3 — demand ÷ capacity = utilisation, the four lecture systems on a
    0–2.0 threshold scale; size for the peak, not the average, week 6
  - Рис. 4 — six buses vs one 200 kW connection: power timeline, all-at-once
    1.8 overload vs two batches of three at 0.9, week 6
  - Рис. 5 — ranges: summer 100–145 km vs winter 80–107 km against the 96 km
    need, plus the RESULT/RANGE/TOP ASSUMPTION/WOULD CHANGE IT report, week 7
  - Рис. 6 — the waiting-time distribution: three readings, four metrics,
    the decision chooses the metric, week 7

Placement follows the W1-4 rule "caption under the figure in the
corresponding week section": each block is inserted after the matching
source-note paragraph ([Источник/Source/Manba: Lecture0N …]) via
`figures_ie57.py patch`, compiled with `figures_ie57.py build`
(tectonic), checked with `figures_ie57.py verify`. Landscape figures are
\linewidth wide (465pt), portrait ones 0.78\linewidth (363pt) — the same
geometry as the W1-4 set (466pt / 354–373pt). Captions: \small, #838079
(figcap), centered — the W1-4 caption spec (9.5pt on 10.5pt body).

Verification: per guide 6/6 images present, 6/6 captions, 0 tofu, no
mid-body whitespace gaps, page count 59/56/59 (was 55/52/54); overfull
warnings unchanged from the pre-figure builds (3–14 unique lines, all in
old content, max 7.4pt — none inside the figure blocks). Diagram QA:
DOM overflow audit + DOM text-overlap audit (pairwise bbox) + VLM review —
all 18 renders clean.
