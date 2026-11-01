# Math I — Weeks 1-4: Complete Course Review (EN)

## Overview
- **Topic**: Number systems & complex numbers → Functions → Limits → Limits II (limit laws, indeterminate forms, squeeze theorem, Landau symbols)
- **Hook**: "What ARE numbers, really? And how do we tame infinity?" — the 4-week journey from counting numbers to the precise ε-δ language of calculus
- **Target Audience**: First-semester engineering students (Math I); high-school algebra assumed
- **Estimated Length**: ~34 minutes (target: >30 min)
- **Key Insight**: Every extension of the number system (N→Z→Q→R→C) was forced by an equation that had no solution before — and limits complete the picture by making "approaching" precise

## Narrative Arc
We start with a deceptively simple question — what are numbers? — climb the tower of number systems and discover complex numbers hiding a beautiful geometric secret, then meet functions as machines, and finish by learning the precise language (limits) that all of calculus is built on. Pattern: Build Up → Payoff + Two Perspectives (algebraic ↔ geometric) throughout.

---

## Scene 0: Cold Open — "What are numbers, really?"
**Duration**: ~75 seconds
**Purpose**: Hook; create curiosity before any formalism

### Visual Elements
- Dark background, single dot pulsing → "1, 2, 3..." counting animation
- Equations appearing that "break" the current number system: `3 − 5 = ?` (breaks N), `x² = −1` (breaks R)
- Question mark morphing into the 4-week roadmap teaser

### Content
Open on counting. Then show subtraction breaking natural numbers, division breaking integers, x²=2 breaking rationals, x²=−1 breaking reals. Each "break" flashes red; each "repair" reveals a bigger number set. Promise: by the end of week 1 you'll solve x²=−1; by week 4 you'll speak the language of calculus.

### Narration Notes
Tone: curious, slightly dramatic. Pause after each "broken" equation. Fast pace, then slow on the promise.

### Technical Notes
- MathTex equations, Indicate()/Flash on the breaking equation, RED flash
- Text for narration beats; scene timings from timings.json

---

## Scene 1: Title + Course Map
**Duration**: ~60 seconds
**Purpose**: Professional title card; orient the viewer with the 4-week roadmap

### Visual Elements
- Title: "Math I — Weeks 1–4" with subtitle "Number Systems · Functions · Limits"
- 4-node horizontal roadmap (Week 1 → 4), each node colored, revealed with LaggedStart
- Small "Study Guide Companion" tag

### Content
Title card animates in; roadmap builds left to right; each week node labeled with its key formula (ℕ⊆ℤ⊆ℚ⊆ℝ⊆ℂ / f∘g / lim / 0/0).

### Narration Notes
Warm, welcoming. "Here's the journey..." — explain the guide structure (formulas → worked problems).

### Technical Notes
- VGroup roadmap, Underline accent, smooth rate_func

---

## WEEK 1 — Number systems, notation, complex numbers (~7.5 min)

### Scene W1.1: The Number Tower
**Duration**: ~90 seconds | **Purpose**: N⊂Z⊂Q⊂R⊂C nested structure with concrete members

### Visual Elements
- Nested rounded rectangles (Venn-style): N inside Z inside Q inside R inside C
- Example numbers flying to their smallest home: 5, −2, 2/3, √2, π, 1+i
- Decimals classification: terminating / periodic / non-periodic

### Content
Build the tower progressively. Each new set motivated by an equation the previous can't solve. Place example numbers; note 2/3 = 0.666... periodic, √2 = 1.4142... non-periodic proof teaser.

### Narration Notes
"Each floor of this tower was built because mathematics broke..." Slow on the nesting reveal.

### Technical Notes
- RoundedRectangle nesting, TransformFromCopy for numbers flying in, YELLOW highlights

---

### Scene W1.2: The Number Line & Intervals
**Duration**: ~70 seconds | **Purpose**: interval notation, inequalities, distance

### Visual Elements
- NumberLine with shaded interval regions
- [−2, 5) vs (−∞, 4] vs (1, ∞): filled vs hollow dots animated
- Distance formula d(a,b) = |a−b| with a bouncing distance arrow

### Content
Show inequality → interval conversion; open/closed endpoints; absolute value as distance: d(3,8)=5 visualized as an arching arrow.

### Narration Notes
Precise, calm. Emphasize filled dot = included, hollow = excluded.

### Technical Notes
- NumberLine, Dot filled/hollow, Brace for distance labeling

---

### Scene W1.3: Scientific & Engineering Notation
**Duration**: ~80 seconds | **Purpose**: powers of ten, SI prefixes, the electron charge

### Visual Elements
- The electron charge e = 0.0000000000000000001602176634 C counting its zeros → morphs to 1.602×10⁻¹⁹ C
- SI prefix ladder: 10¹² tera → 10⁻¹² pico with labels
- Engineering notation vs scientific: exponent multiples of 3

### Content
Count the zeros (visually highlight them), show the compact form, walk the SI prefix table (G, M, k, m, µ, n, p).

### Narration Notes
Amazement at the 19 zeros. "Physicists don't write this — ever."

### Technical Notes
- MathTex morph (TransformMatchingTex), LaggedStart prefix ladder, DecimalNumber

---

### Scene W1.4: Complex Numbers — A New Dimension
**Duration**: ~90 seconds | **Purpose**: the complex plane, z = a+bi, conjugate, modulus

### Visual Elements
- Real axis + imaginary axis building (2D plane)
- Point z = 3+2i plotted with component arrows
- Conjugate 3−2i as mirror reflection across real axis (animation!)
- Modulus |z| = √13 as the radius arrow

### Content
Introduce i = √−1; the plane; plot z; reflect for conjugate; hypotenuse for modulus. Two perspectives: algebraic (a+bi) ↔ geometric (point/vector).

### Narration Notes
"The real line was one-dimensional — we simply added a second axis." Mirror moment for conjugate.

### Technical Notes
- Axes/NumberPlane, always_redraw or animate for reflection, MathTex labels

---

### Scene W1.5: Complex Arithmetic
**Duration**: ~80 seconds | **Purpose**: add, subtract, multiply, divide complex numbers

### Visual Elements
- Vector addition tip-to-tail for z₁+z₂ = 4−2i
- Multiplication as scaling+rotation teaser
- Division: multiply by conjugate trick — (1+i)/(1−i) worked step by step

### Content
z₁=3+2i, z₂=1−4i: sum/difference (vector view), product FOIL, quotient via conjugate with the "1/(1+i) = (1−i)/2" full derivation.

### Narration Notes
Walk the division slowly — "multiply top and bottom by the conjugate" is THE trick.

### Technical Notes
- Arrows tip-to-tail, TransformMatchingTex for algebra steps, color-coded terms

---

### Scene W1.6: Polar Form, De Moivre & Roots of Unity
**Duration**: ~100 seconds | **Purpose**: trig/exponential form; z³ = −8 roots on the circle

### Visual Elements
- z = r(cosθ + i sinθ) = re^{iθ} with the triangle (r, θ) highlighted on the plane
- De Moivre: [r(cosθ+i sinθ)]ⁿ formula card
- z³ = −8: three roots appearing at 120° apart on circle radius 2, rotating into place, connecting as equilateral triangle

### Content
Convert 1+i to polar (r=√2, θ=π/4); compute (1+i)⁶ via De Moivre; solve z³=−8 → z=2cis(π/3+2kπ/3), k=0,1,2 — three points on circle |z|=2 forming a perfect triangle.

### Narration Notes
"The aha: powers are rotations." Build anticipation before roots appear; celebrate the triangle.

### Technical Notes
- ValueTracker θ animation, DashedLine circle, always_redraw rotating point, LaggedStart roots

---

## WEEK 2 — Functions (~7.5 min)

### Scene W2.1: Functions as Machines
**Duration**: ~80 seconds | **Purpose**: definition, domain/range, vertical line test

### Visual Elements
- Machine metaphor: input x → box f(x)=2x²−3x+1 → output (animated flow)
- Domain/range as two shaded regions with arrows mapping
- Vertical line test on a passing circle vs failing sideways parabola

### Content
Define function (each input → exactly one output); f(x)=2x²−3x+1 machine; domain = allowed inputs, range = achieved outputs; vertical line test with both a pass and fail case.

### Narration Notes
Playful machine sounds implied by pacing. "One input, one output — that's the contract."

### Technical Notes
- RoundedRectangle machine with gears (Circle+Polygon), Arrow flow, always_redraw vertical line sweeping

---

### Scene W2.2: Natural Domain — Where Machines Jam
**Duration**: ~80 seconds | **Purpose**: finding domains (denominators, square roots)

### Visual Elements
- f(x) = (x−1)/(x²−4): x = ±2 explode points on the number line (RED)
- √(x−3): shaded region x ≥ 3
- Interval notation answers building up

### Content
Two rules: denominator ≠ 0, square root argument ≥ 0. Worked: x²−4=0 → x=±2 excluded → domain (−∞,−2)∪(−2,2)∪(2,∞).

### Narration Notes
"Two ways a machine jams: divide by zero, or square-root a negative."

### Technical Notes
- NumberLine with excluded points marked RED with Flash, MathTex domain union

---

### Scene W2.3: Composition — Chaining Machines
**Duration**: ~70 seconds | **Purpose**: (f∘g)(x), order matters

### Visual Elements
- Two machines in a row: x → g → f → output, with f(x)=2x−3, g(x)=x²+1
- (f∘g)(x) = 2x²−1 vs (g∘f)(x) = 4x²−12x+10, computed side by side
- ≠ symbol pulsing between results

### Content
Feed x=2 through both orders visually, then algebra. Emphasize f∘g ≠ g∘f (order matters!).

### Narration Notes
Clothes metaphor: "socks then shoes ≠ shoes then socks."

### Technical Notes
- Two horizontal machine chains, LaggedStart, color-coded substitution steps

---

### Scene W2.4: Symmetry — Even & Odd Functions
**Duration**: ~70 seconds | **Purpose**: f(−x)=f(x) mirror tests

### Visual Elements
- x² (even): mirror-fold animation across y-axis, both halves match
- x³ (odd): 180° rotation about origin, matches
- |x|+1 and general-form counterexample

### Content
Even: mirror across y-axis. Odd: rotation about origin. Test algebraically with f(−x). Classify |x|+1 (even), x³−x (odd), x²+x (neither).

### Narration Notes
Fold the graph like paper — visual poetry moment.

### Technical Notes
- axes.plot graphs, animate rotate about ORIGIN, dashed mirror line

---

### Scene W2.5: Inverse Functions — Undoing the Machine
**Duration**: ~80 seconds | **Purpose**: f⁻¹, reflection over y=x, verification

### Visual Elements
- f(x) = 4x−7 with its inverse solved on screen: f⁻¹(x) = (x+7)/4
- Graph: f and f⁻¹ as mirror images across dashed y=x line
- f(f⁻¹(x)) = x round-trip arrow animation

### Content
Solve y=4x−7 for x; swap variables; verify f(f⁻¹(x))=x. Geometric: inverse = reflection across y=x. Domain/range swap.

### Narration Notes
"The inverse machine undoes — output goes back in, original input comes out."

### Technical Notes
- axes.plot both lines, DashedLine y=x, CurvedArrow round-trip, TransformMatchingTex

---

### Scene W2.6: Exponentials & Logarithms
**Duration**: ~100 seconds | **Purpose**: eˣ, ln, inverse pair, engineering growth

### Visual Elements
- eˣ curve growing steeply; ln x as its mirror across y=x (same scene machinery as W2.5 — callback!)
- Key cards: aˣ·aʸ=aˣ⁺ʸ, log rules, e ≈ 2.71828
- Engineering example: chamber temperature rising linearly 20°C→90°C; piecewise electricity tariff C(E)

### Content
Exponential families (2ˣ vs eˣ); ln as inverse; log laws table; real example: piecewise cost function C(E)=0.10E vs 20+0.12(E−200) graphed with the breakpoint.

### Narration Notes
Callback to inverses. "Nature compounds continuously — that's e."

### Technical Notes
- axes.plot eˣ/ln, mirrored reflection animation, piecewise plot with elbow highlight

---

## WEEK 3 — Limits (~7.5 min)

### Scene W3.1: The Intuition — Approaching
**Duration**: ~90 seconds | **Purpose**: lim concept via sin(x)/x table + graph

### Visual Elements
- Graph y = sin(x)/x with hole at x=0 (open circle)
- Table filling: x = 0.5, 0.1, 0.01, 0.001 → values → 1 (both sides!)
- Dot sliding along the curve toward the hole from both sides

### Content
"Whatsin(x)/x AT zero? Undefined. But NEAR zero?" Table from both sides converges to 1. The limit exists even where the function doesn't.

### Narration Notes
Whisper-slow on the table converging. "The hole doesn't matter — the approach does."

### Technical Notes
- axes.plot with excluded point (white Dot), DecimalNumber table via ValueTracker, moving Dot with always_redraw

---

### Scene W3.2: One-Sided Limits
**Duration**: ~80 seconds | **Purpose**: left/right limits, piecewise jump

### Visual Elements
- f(x) = |x|/x: two branches (y=−1 left, y=+1 right), open circles at both at x=0
- Two arrows approaching 0 from each side, stopping at different heights
- lim≠lim → limit DNE stamp animation

### Content
Compute both one-sided limits (−1 and +1); since they differ, the two-sided limit does not exist. Notation lim x→0⁻ vs x→0⁺.

### Narration Notes
"Two travelers meet a cliff from opposite sides — they see different heights."

### Technical Notes
- Two horizontal branch plots, Arrow animations, MathTex one-sided notation with superscripts

---

### Scene W3.3: Infinity & Asymptotes
**Duration**: ~80 seconds | **Purpose**: infinite limits, vertical/horizontal asymptotes

### Visual Elements
- y = 1/x² hugging the y-axis (vertical asymptote x=0, line glows)
- Same curve flattening toward y=0 as x→∞ (horizontal asymptote)
- lim notation cards: x→0⁺ f→+∞; x→∞ f→0

### Content
Vertical asymptote: function explodes near a point. Horizontal: function settles at a value at infinity. Both as limit statements.

### Narration Notes
"Asymptote = a line the curve wants to touch but never does."

### Technical Notes
- axes.plot, DashedLine asymptotes with Indicate glow, always_redraw climbing dot

---

### Scene W3.4: The ε–δ Definition — Making It Precise
**Duration**: ~110 seconds | **Purpose**: the formal definition, visualized as a game

### Visual Elements
- Graph with point (a, L); horizontal band L±ε (BLUE band), vertical band a±δ (YELLOW band)
- ε shrinks → δ must shrink: ValueTracker animation showing bands tightening together
- The formal statement card: ∀ε>0 ∃δ>0: 0<|x−a|<δ ⇒ |f(x)−L|<ε

### Content
Frame as a challenge-response game: skeptic picks ε (any band around L), mathematician responds with δ so the curve stays inside. Animate with shrinking ε.

### Narration Notes
"The skeptic's job: make ε tiny. The mathematician always answers." Build tension → satisfaction.

### Technical Notes
- always_redraw bands (Rectangle/plot clipping), ValueTracker ε, MathTex quantifier statement, MovingCameraScene zoom

---

### Scene W3.5: Engineering Limits
**Duration**: ~80 seconds | **Purpose**: limits in engineering practice (tolerance/resistor)

### Visual Elements
- Circuit sketch: resistor with label; I = V/R as R→0 or R→∞
- Tolerance band: target value with ±ε manufacturing band (real-world ε-δ!)
- Quality-control dots falling within band

### Content
Engineering = approximate by design: "close enough" IS a limit statement. Manufacturing tolerances are ε; process control provides δ.

### Narration Notes
"Real engineers live inside ε-bands every day."

### Technical Notes
- Simple circuit mobjects (Line/Rectangle/Circle), Brace tolerance band, LaggedStart dots

---

## WEEK 4 — Limits II (~7.5 min)

### Scene W4.1: The Limit Laws
**Duration**: ~80 seconds | **Purpose**: algebra rules for limits

### Visual Elements
- Law cards appearing in grid: Sum, Product, Quotient, Constant multiple, Power
- Worked example: lim(x²+3x−1) as x→2 using laws step by step (3+6−1 = 8... compute: 4+6−1=9)
- Direct substitution highlighted as the consequence (when continuous)

### Content
Present the laws as a "toolkit"; use them to compute lim(x→2)(x²+3x−1) = 4+6−1 = 9; note continuity makes it plug-and-play.

### Narration Notes
"Five tools, one goal: break big limits into small ones."

### Technical Notes
- VGrid of RoundedRectangle formula cards, LaggedStartMap, TransformMatchingTex worked example

---

### Scene W4.2: Indeterminate Forms — The 0/0 Battle
**Duration**: ~100 seconds | **Purpose**: 0/0 forms; factoring & conjugate techniques

### Visual Elements
- lim(x→2)(x²−4)/(x−3x+2): numerator→0, denominator→0 stamped "0/0 INDETERMINATE" (RED)
- Factor animation: (x−2)(x+2)/((x−1)(x−2)) → cancel (x−2) with strike-through → 4/1... compute: (2+2)/(2−1) = 4
- Second example with conjugate technique: lim(√(x+1)−1)/x = 1/2

### Content
Why 0/0 is "indeterminate" (competing vanishings); technique 1: factor & cancel; technique 2: multiply by conjugate. Both shown step by step.

### Narration Notes
"Both numerator and denominator race to zero — who wins? The limit tells."

### Technical Notes
- TransformMatchingTex with strikethrough Line on cancelled terms, RED/GREEN stamps, two-column layout

---

### Scene W4.3: The Squeeze Theorem
**Duration**: ~90 seconds | **Purpose**: bounding a wild function between two tame ones

### Visual Elements
- Graphs: −x² (lower, blue dashed), x² (upper, blue dashed), x²·sin(1/x) (yellow, oscillating wildly near 0)
- Both bounds pinching to 0 at origin; sandwich animation (two planes pressing together)
- Squeeze statement card

### Content
When f is hard but sandwiched between g and h with equal limits, f inherits that limit. Classic: x²sin(1/x) → 0 as x→0. Graph oscillation tamed by the parabola envelope.

### Narration Notes
"Oscillating chaos — trapped between two pieces of bread that both go to zero."

### Technical Notes
- axes.plot x²sin(1/x) (needs domain care near 0), DashedLine envelopes, Flatten/pinch animation

---

### Scene W4.4: Asymptotics & Landau Symbols
**Duration**: ~90 seconds | **Purpose**: big-O and little-o, asymptotic equivalence

### Visual Elements
- f ~ g as x→a definition card; example sin(x) ~ x as x→0 with both graphs overlapping near 0 (zoom!)
- O (big-O) as "bounded by C·g" — bounding belt visual; o as "vanishingly small ratio"
- Cheat sheet: 1−cos(x) ~ x²/2, ln(1+x) ~ x, eˣ−1 ~ x

### Content
Asymptotic equivalence = same limit of ratio 1. Big-O/little-o hierarchy for comparing growth. Engineering shortcut table for replacing complicated functions with simple ones NEAR a point.

### Narration Notes
"Near zero, sin(x) IS x — engineers replace constantly."

### Technical Notes
- MovingCameraScene zoom into origin region, overlapping curves with opacity, formula table VGroup

---

### Scene W4.5: The Big Picture — Limits to Derivatives
**Duration**: ~60 seconds | **Purpose**: week 4 closer; connect to what's next

### Visual Elements
- The roadmap from Scene 1 returning (callback), weeks 1–4 lighting up green
- Slope-of-secant animation: (f(a+h)−f(a))/h as h→0 — secant line rotating into the tangent
- Teaser card: "Weeks 5–7: The Derivative"

### Content
All four weeks recap in 15 seconds; then the payoff: the limit you just mastered is EXACTLY the definition of the derivative. Secant → tangent as h→0.

### Narration Notes
"Everything was building to this moment." Dramatic reveal.

### Technical Notes
- Secant line with always_redraw as ValueTracker h shrinks, callback roadmap VGroup

---

## Scene OUT: Recap & Farewell
**Duration**: ~90 seconds
**Purpose**: consolidate; leave the viewer confident

### Visual Elements
- Four week-summary cards stacking: key formulas from each week
- Final formula cascade (one from each week highlighted GOLD)
- Closing card: "Math I — Weeks 1–4 · Study Guide Companion" + guide reference

### Content
Rapid recap of the tower, machines, ε-δ, squeeze. Encourage rewatching per-week sections; point to the study guide PDF and practice problems.

### Narration Notes
Warm, confident, slower pace. "You now speak the language of calculus."

### Technical Notes
- VGroup card stack with LaggedStart, GOLD highlights, fade-to-title ending

---

## Transitions & Flow
- **Recurring motif**: the 4-node roadmap (Scene 1) reappears at each week boundary, lighting the current node — spatial continuity through the whole video
- Scene → Scene: consistent 0.4s cross-fade handled by scene boundaries (each scene fades its content out)
- Week boundaries: dedicated 4-second "Week N" title sting (number morphs in, roadmap node lights up)
- Algebra ↔ geometry "two perspectives" pattern recurs (complex numbers, functions, limits)

## Color Palette (Classic 3b1b)
| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Background | Dark grey | #1C1C1C | all scenes |
| Primary | Blue | #58C4DD | main objects, curves, key terms |
| Secondary | Green | #83C167 | results, outputs, "correct" |
| Accent | Yellow | #FFFF00 | highlights, emphasis, active week node |
| Warning | Red | #FF6666 | broken equations, excluded points, DNE |
| Week colors | W1 #58C4DD / W2 #FF6C6C / W3 #83C167 / W4 #FFD700? | — | roadmap + week stings |

## Mathematical Content
### Equations to Render (key)
1. `N ⊆ Z ⊆ Q ⊆ R ⊆ C` (S0, W1.1, OUT)
2. `x² + 1 = 0` (S0, W1.4)
3. `z = a + bi = r(cos θ + i sin θ) = re^{iθ}` (W1.4, W1.6)
4. `z̄z = |z|²`, `|z| = √(a²+b²)` (W1.4, W1.5)
5. `(f∘g)(x) = f(g(x))` (W2.3)
6. `f⁻¹(f(x)) = x` (W2.5)
7. `aˣ·aʸ = aˣ⁺ʸ`, `log_a(xy) = log_a x + log_a y` (W2.6)
8. `lim_{x→0} sin(x)/x = 1` (W3.1)
9. `∀ε>0 ∃δ>0: 0<|x−a|<δ ⇒ |f(x)−L|<ε` (W3.4)
10. `lim (f±g) = lim f ± lim g` etc. (W4.1)
11. `lim_{x→2} (x²−4)/(x²−3x+2) = 4` (W4.2)
12. `−x² ≤ x² sin(1/x) ≤ x²` (W4.3)
13. `sin x ~ x, 1−cos x ~ x²/2, ln(1+x) ~ x` (W4.4)
14. `f'(a) = lim_{h→0} (f(a+h)−f(a))/h` (W4.5)

### Graphs/Plots
1. sin(x)/x with hole (W3.1)
2. |x|/x branches (W3.2)
3. 1/x² with asymptotes (W3.3)
4. generic ε-δ curve (W3.4)
5. x², x³ symmetry folds (W2.4)
6. 4x−7 & inverse & y=x mirror (W2.5)
7. eˣ & ln x mirrors (W2.6)
8. x²sin(1/x) squeeze (W4.3)
9. sin x vs x near 0 (W4.4)
10. secant→tangent (W4.5)

## Implementation Order
1. **Framework first**: video_lib.py (palette, timing loader, sync helper, roadmap motif, week sting) — everything depends on it
2. **Golden pattern**: S0 + S1 (intro scenes) — establishes all conventions
3. **W1 scenes** (reference implementation of content scenes)
4. **W2, W3, W4 in parallel** (three independent scene files, same conventions)
5. **OUT scene** (depends on roadmap motif + formula list)
6. **Audio**: narration JSON → TTS → timings.json → audio assembly
7. **Assembly**: parallel chunk render → concat → mux audio → soft subtitles (mov_text) + .srt sidecar
8. **QA**: duration >30 min, VLM frame spot-checks, A/V sync spot-check, then deliver + commit

### Shared Components (video_lib.py)
- `PALETTE`, `WEEK_COLORS`, `load_timings()`, `NarratedScene` base (segment-synced playback), `roadmap(active_week)`, `week_sting(n, title, formula)`, `title_card()`, `formula_card(tex)`, `section_footer()`
