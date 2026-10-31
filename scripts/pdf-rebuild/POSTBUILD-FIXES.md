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
