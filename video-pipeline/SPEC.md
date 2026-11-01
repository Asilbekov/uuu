# Video Spec Schema v1.2 (contract between PDF extraction and the Manim engine)

Each guide × language = ONE JSON file: `specs/<guide_id>_<lang>.json` where lang ∈ {en, ru, uz}.
The 3 language files of one guide MUST have IDENTICAL block structure (same blocks in the same
order, same LaTeX formulas, same plot/code/table data) — only the human-language strings differ
(heading / bullets / narration / table text cells are translated, NOT the math).

## Target: total narration 4,800–5,400 words per language (≈ 31–35 minutes of speech at 150 wpm).
Count your words! If you are below 4,800, add more examples or more detailed narration.

## Top level
```json
{
  "id": "math1_w14",
  "language": "en",
  "course_title": "Math I — Mathematical Analysis",
  "test_title": "Weeks 1–4 · Complete Guide",
  "subtitle": "Limits · Continuity · Derivatives",
  "chapters": [
    { "title": "Limits and Their Meaning", "blocks": [ ... ] }
  ],
  "outro_message": "Good luck on the test — you are ready.",
  "narration_style": "conversational, clear, 3Blue1Brown-like: questions first, then answers"
}
```

## Block types (use ALL that fit your subject; ~55–75 blocks total per video)

### 1. title (FIRST block, exactly one)
```json
{ "type": "title", "narration": "Welcome to the complete video guide to Math I, weeks one to four. ..." }
```
narration ~60–90 words: hook the viewer, promise what they will understand by the end.

### 2. section (chapter card; one per chapter, 4–8 chapters)
```json
{ "type": "section", "num": 1, "title": "Limits and Their Meaning", "subtitle": "What does approaching really mean?",
  "narration": "Chapter one. Everything in calculus rests on one idea..." }
```
narration ~40–70 words: why this chapter matters, what question it answers.

### 3. concept (the workhorse; ~60% of blocks)
```json
{
  "type": "concept",
  "heading": "The Limit of a Function",
  "bullets": ["x approaches a — but never reaches it", "f(x) gets arbitrarily close to L", "L is the limit"],
  "formula": "\\lim_{x \\to a} f(x) = L",
  "formula_caption": "read: the limit of f of x, as x approaches a, equals L",
  "plot": { "fn": "x**2/4", "tex": "f(x)=\\frac{x^2}{4}", "x_range": [-4, 4], "y_range": [0, 5],
            "point": [2, 1], "point_label": "(2, 1)" },
  "narration": "..."
}
```
- bullets: 2–4 short lines (≤ 60 chars each after render) — the visual skeleton
- formula: OPTIONAL, LaTeX for MathTex. MUST compile as plain math-mode LaTeX. No \text{} with
  non-ASCII. Escape backslashes in JSON.
- plot: OPTIONAL. fn is a Python lambda body using x (numpy available as np). Keep it SIMPLE
  and SMOOTH (polynomials, sin, cos, exp, 1/x with x_range avoiding 0, etc.).
- narration 90–160 words: explain the bullets in order, then read the formula caption, describe
  what the plot shows. MUST cover every bullet.

### 4. formula (deep dive into ONE formula — use for the most important ones)
```json
{
  "type": "formula",
  "heading": "Formal Definition of the Derivative",
  "tex": "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
  "parts": [
    { "substr": "f'(x)", "color": "yellow", "note": "the derivative — a new function" },
    { "substr": "h \\to 0", "color": "blue", "note": "the step shrinks to nothing" },
    { "substr": "f(x+h) - f(x)", "color": "green", "note": "rise: how much f changed" }
  ],
  "narration": "..."
}
```
- substr MUST appear verbatim inside tex (the engine colors and highlights it)
- colors: yellow | blue | green | red | teal
- narration 100–170 words: walk through each part in order, then the whole formula.

### 5. example (worked problem — at least 8–12 per video!)
```json
{
  "type": "example",
  "heading": "Example: Limit of sin(x)/x",
  "problem": "\\lim_{x \\to 0} \\frac{\\sin x}{x}",
  "steps": [
    { "tex": "\\frac{\\sin x}{x}" },
    { "text": "squeeze between cos(x) and 1" },
    { "tex": "\\lim_{x \\to 0}\\cos x = 1" },
    { "tex": "\\therefore \\lim_{x \\to 0} \\frac{\\sin x}{x} = 1", "highlight": true }
  ],
  "result": "1",
  "narration": "..."
}
```
- problem: LaTeX (math) or plain text — the statement shown in a box
- steps: 3–6 lines, each either {"tex": "..."} or {"text": "..."}; optional "highlight": true
  marks the final line with a golden box
- narration 110–180 words: read the problem, then walk through every step slowly.

### 6. plot (dedicated graph scene — for behavior/geometry)
```json
{
  "type": "plot",
  "heading": "Why 1/x Blows Up at Zero",
  "functions": [
    { "fn": "1/x", "tex": "y=\\frac{1}{x}", "color": "yellow" },
    { "fn": "-1/x", "tex": "y=-\\frac{1}{x}", "color": "blue" }
  ],
  "x_range": [-5, 5], "y_range": [-5, 5],
  "point": null, "vline": 0,
  "narration": "..."
}
```
- 1–3 functions; vline: optional x position of a dashed vertical line (asymptote)
- narration 90–150 words describing the shape, behavior, asymptotes.

### 7. table (comparison / vocabulary / dates)
```json
{
  "type": "table",
  "heading": "Continuous vs Discontinuous",
  "columns": ["Continuous", "Discontinuous"],
  "rows": [
    ["limit exists", "limit fails"],
    ["no jumps", "jump or hole"],
    ["can draw without lifting pen", "must lift the pen"]
  ],
  "narration": "..."
}
```
Keep cells ≤ 40 chars. 2–4 columns, ≤ 6 rows. narration 90–150 words.

### 8. code (C programming ONLY — Computer Science guide)
```json
{
  "type": "code",
  "heading": "Pointers: Declaration and Dereference",
  "code": "int x = 42;\nint *p = &x;\nprintf(\"%d\\n\", *p);  // 42",
  "highlight": [2],
  "narration": "..."
}
```
- ≤ 12 lines, ≤ 62 chars per line; highlight: line numbers (1-based) to reveal with color
- narration 100–160 words: explain line by line.

### 9. timeline (History ONLY)
```json
{
  "type": "timeline",
  "heading": "The Road to Independence",
  "events": [
    { "year": "1991-08-31", "text": "Independence declared" },
    { "year": "1992-12-08", "text": "Constitution adopted" }
  ],
  "narration": "..."
}
```
4–7 events, text ≤ 45 chars. narration 100–160 words telling the story chronologically.

### 10. recap (end of each chapter + one big before outro)
```json
{ "type": "recap", "items": ["Limit = value approached, not reached", "sin(x)/x → 1"], "narration": "..." }
```
3–6 items ≤ 55 chars. narration 60–110 words.

### 11. outro (LAST block, exactly one)
```json
{ "type": "outro", "message": "You covered all of weeks 1–4. Now take the test — you are ready.", "narration": "..." }
```
narration ~50–80 words.

## LaTeX rules (CRITICAL — the engine will smoke-test every formula)
- Math-mode only: `\\lim`, `\\frac{a}{b}`, `x^{2}`, `\\sin`, `\\cos`, `\\to`, `\\infty`, `\\cdot`, `\\int_a^b`, `\\sum_{i=1}^{n}`, matrices: `\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}`, `\\det(A)`, `\\lambda`, `\\vec{v}`, `\\Rightarrow`, `\\approx`, `\\leq`, `\\geq`, `\\neq`
- In JSON strings a single TeX backslash is written as `\\` (e.g. `\\frac` in the JSON file = `\frac` in TeX)
- A TeX newline `\\` is written as `\\\\` in JSON
- NO \text{...} with non-ASCII characters; NO packages; NO $...$ delimiters inside formula fields
- fn plot expressions: only x, numbers, + - * / ** ( ), np.sin, np.cos, np.tan, np.exp, np.log, np.sqrt, np.pi, np.abs, np.e

## Language rules
- ru: heading/bullets/narration in natural Russian; keep established math terms; formulas stay LaTeX
- uz: natural Uzbek (Latin script). Use ʻ (U+02BB) for oʻ/gʻ apostrophes
- en: clear American English
- narration = SPOKEN text (TTS reads it aloud): no markdown, no symbols like "->" (say "tends to"),
  no LaTeX in narration (say "f of x"), numbers as words when short. Write numbers/formulas the
  way a good lecturer would SAY them.

## Quality bar (what a reviewer checks)
1. Word count 4,800–5,400 per language ✓
2. Every chapter has: section → ≥3 concept/formula blocks → ≥1 example → recap ✓
3. Structure identical across the 3 languages (same block count/types/order, same LaTeX) ✓
4. Narration covers every visible element (bullets, steps, table cells) ✓
5. LaTeX in every `tex`/`formula`/`problem`/`steps[].tex`/`plot` .fn/.tex compiles ✓
