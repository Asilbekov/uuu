#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ITE W5-7 test diagrams — part 2: t21..t27 + the four data-problem cards."""
from ite57_diag_style import BASE_CSS, SHELL

K6 = "WEEK 6 · QUANTITATIVE REASONING I"
K7 = "WEEK 7 · QUANTITATIVE REASONING II"


def head(kicker, title, subtitle):
    return (f'<div class="head"><div class="kicker">{kicker}</div>'
            f'<div class="title">{title}</div>'
            f'<div class="subtitle">{subtitle}</div></div>')


def foot(html):
    return f'<div class="foot">{html}</div>'


# ---------------------------------------------------------------- t21 (Q24)
T21 = SHELL.format(css=BASE_CSS, extra="""
.duo { display:grid; grid-template-columns:1fr 44px 1fr; align-items:stretch; }
.big { font-size:30px; font-weight:800; margin:7px 0 2px; }
.x { text-align:center; align-self:center; font-size:26px; font-weight:800; color:#fe5933; }
.formula { background:#2c2c2c; color:#fff; border-radius:14px; padding:12px 16px; text-align:center; margin-top:13px; }
.formula .f { font-size:17px; font-weight:800; letter-spacing:.02em; }
.formula .g { font-size:12px; color:#cfc7bd; margin-top:5px; }
""", body=head(K6, "Power vs energy",
    "kW is how fast — kWh is how much. Multiply power by time to get energy")
    + """
<div class="duo">
  <div class="card" style="text-align:center"><span class="pill bg-orange ac-orange">Power · kW · a rate</span>
    <div class="big ac-orange">60 kW</div>
    <div class="small muted">the charger, delivering<br><b>right now</b> — like a speedometer</div>
  </div>
  <div class="x">×</div>
  <div class="card" style="text-align:center"><span class="pill bg-teal ac-teal">Energy · kWh · a quantity</span>
    <div class="big ac-teal">120 kWh</div>
    <div class="small muted">60 kW × 2 h — the delivery<br><b>after 2 hours</b> — like the fuel in the tank</div>
  </div>
</div>
<div class="formula">
  <div class="f">E [kWh] = P [kW] × t [h] &nbsp;&nbsp;·&nbsp;&nbsp; t [h] = E [kWh] ÷ P [kW]</div>
  <div class="g">one bus: 115 kWh ÷ 60 kW ≈ 1.9 h on the charger</div>
</div>
"""
    + foot("“The bus needs 115” means nothing — every number needs <b>a unit and a time basis</b>: 115 kWh per bus per day."))

# ---------------------------------------------------------------- t22 (Q27)
def _t22_svg(bad=True):
    W = 692
    L, R, T, B = 46, 14, 14, 22
    H = 148
    pw, ph = W - L - R, H - T - B
    def x(h): return L + pw * (h - 22) / 8
    def y(k): return T + ph * (1 - k / 400)
    cap = y(200)
    s = f'<svg width="{W}" height="{H}" style="display:block">'
    s += f'<line x1="{L}" y1="{cap}" x2="{W-R}" y2="{cap}" stroke="#2c2c2c" stroke-width="2" stroke-dasharray="7 4"/>'
    s += f'<text x="{W-R}" y="{cap-5}" font-size="11" font-weight="800" fill="#2c2c2c" text-anchor="end">connection 200 kW</text>'
    if bad:
        bx = (x(22), x(23.9))
        s += f'<rect x="{bx[0]}" y="{y(360)}" width="{bx[1]-bx[0]}" height="{y(0)-y(360)}" fill="#fe5933" rx="4"/>'
        s += f'<text x="{(bx[0]+bx[1])/2}" y="{y(360)-8}" font-size="12" font-weight="800" fill="#fe5933" text-anchor="middle">6 × 60 = 360 kW = 1.8 × connection ✗</text>'
        s += f'<text x="{(bx[0]+bx[1])/2}" y="{y(180)}" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">rejected</text>'
    else:
        for (h0, h1, lab) in ((22, 23.9, "batch 1 · 3 buses"), (24.05, 25.95, "batch 2 · 3 buses")):
            s += f'<rect x="{x(h0)}" y="{y(180)}" width="{x(h1)-x(h0)}" height="{y(0)-y(180)}" fill="#178a7b" rx="4"/>'
            s += f'<text x="{(x(h0)+x(h1))/2}" y="{y(180)-8}" font-size="11.5" font-weight="800" fill="#178a7b" text-anchor="middle">3 × 60 = 180 kW · 0.9</text>'
            s += f'<text x="{(x(h0)+x(h1))/2}" y="{y(90)}" font-size="10.5" font-weight="800" fill="#fff" text-anchor="middle">{lab} ≈ 1.9 h</text>'
    s += f'<line x1="{L}" y1="{y(0)}" x2="{W-R}" y2="{y(0)}" stroke="#cfc7bd" stroke-width="1.5"/>'
    s += f'<line x1="{L}" y1="{y(0)}" x2="{L}" y2="{y(400)}" stroke="#cfc7bd" stroke-width="1.5"/>'
    for h, lab in ((22, "22:00"), (0, "00:00"), (4, "04:00"), (6, "06:00")):
        hh = h if h > 12 else h + 24
        s += f'<line x1="{x(hh)}" y1="{y(0)}" x2="{x(hh)}" y2="{y(0)+4}" stroke="#cfc7bd" stroke-width="1.2"/>'
        s += f'<text x="{x(hh)}" y="{y(0)+16}" font-size="10.5" fill="#8a8178" text-anchor="middle">{lab}</text>'
    s += f'<text x="{L-6}" y="{y(400)+4}" font-size="10.5" fill="#8a8178" text-anchor="end">400</text>'
    s += f'<text x="{L-6}" y="{cap+4}" font-size="10.5" fill="#8a8178" text-anchor="end">200</text>'
    s += f'<text x="{L-6}" y="{y(0)}" font-size="10.5" fill="#8a8178" text-anchor="end">kW</text>'
    s += '</svg>'
    return s


T22 = SHELL.format(css=BASE_CSS, extra="""
.plan { display:grid; grid-template-columns:34px 1fr; gap:8px; align-items:center; margin-bottom:4px; }
.verdict { text-align:center; font-size:19px; font-weight:800; }
.energy { background:#faf0d8; border:1.5px solid #ecd9a8; border-radius:12px; padding:10px 14px; font-size:13px; line-height:1.55; color:#3d3730; text-align:center; margin-top:12px; }
""", body=head(K6, "Energy was never the problem — power was",
    "Six buses × 115 kWh by 06:00 against a 200 kW depot connection (window 22:00–06:00 = 8 h)")
    + f"""
<div class="plan"><div class="verdict ac-orange">✗</div>{_t22_svg(bad=True)}</div>
<div class="plan"><div class="verdict ac-teal">✓</div>{_t22_svg(bad=False)}</div>
<div class="energy"><b>Energy check:</b> 6 × 115 = 690 kWh ÷ 8 h ≈ <b>86 kW average</b> — the connection has plenty of energy.<br>
Only <b>simultaneous power</b> breaks the limit → charge in <b>two batches of three</b> (180 kW, utilisation 0.9).</div>
"""
    + foot("Average power 86 kW ≪ 200 kW — but the breaker only sees the <b>peak</b>. Stagger the charging, keep it under 1.0."))

# ---------------------------------------------------------------- t23 (Q31)
T23 = SHELL.format(css=BASE_CSS, extra="""
.line { display:grid; grid-template-columns:1fr 22px 1fr 22px 1.12fr 22px 1fr 22px 1fr; gap:0; align-items:stretch; }
.stage { text-align:center; padding:12px 6px; }
.rate { font-size:21px; font-weight:800; margin-top:6px; }
.unit { font-size:10.5px; color:#8a8178; }
.arr { text-align:center; color:#fe5933; font-size:16px; font-weight:800; align-self:center; }
.bn { border:2px solid #fe5933; background:#fdeae4; }
.thr { background:#2c2c2c; color:#fff; border-radius:12px; text-align:center; padding:10px 14px; font-size:13.5px; margin-top:13px; }
""", body=head(K6, "Where is the bottleneck?",
    "Lab 6 — semiconductor wafer packaging line, 12 h/day: five stages, five rates")
    + """
<div class="line">
  <div class="card stage"><div style="font-size:11.5px;font-weight:700;line-height:1.25">Die<br>Sort</div><div class="rate ac-blue">680</div><div class="unit">units/h</div></div>
  <div class="arr">→</div>
  <div class="card stage"><div style="font-size:11.5px;font-weight:700;line-height:1.25">Die<br>Attach</div><div class="rate ac-blue">620</div><div class="unit">units/h</div></div>
  <div class="arr">→</div>
  <div class="card stage bn"><span class="pill bg-orange ac-orange">Bottleneck</span><div style="font-size:11.5px;font-weight:700;line-height:1.25;margin-top:5px">Wire<br>Bonding</div><div class="rate ac-orange">580</div><div class="unit">units/h — the smallest</div></div>
  <div class="arr">→</div>
  <div class="card stage"><div style="font-size:11.5px;font-weight:700;line-height:1.25">Electrical<br>Test</div><div class="rate ac-blue">600</div><div class="unit">units/h</div></div>
  <div class="arr">→</div>
  <div class="card stage"><div style="font-size:11.5px;font-weight:700;line-height:1.25">Final<br>Packaging</div><div class="rate ac-blue">640</div><div class="unit">units/h</div></div>
</div>
<div class="thr">The line runs at the speed of its slowest stage: &nbsp;<b>580 units/h × 12 h = 6,960 units/day</b></div>
"""
    + foot("Upstream faster than the bottleneck → <b>buffers fill</b> (queues grow); slower → the line starves. Improve Wire Bonding, or the rest just waits."))

# ---------------------------------------------------------------- t24 (Q33)
T24 = SHELL.format(css=BASE_CSS, extra="""
.steps { display:grid; grid-template-columns:1fr 20px 1fr 20px 1fr 20px 1fr; align-items:stretch; }
.num { width:26px; height:26px; border-radius:999px; background:#fe5933; color:#fff; font-weight:800; font-size:14px; text-align:center; line-height:26px; margin-bottom:8px; }
.st { font-size:12.5px; line-height:1.45; color:#3d3730; }
.st b { display:block; font-size:13.5px; color:#211d1a; margin-bottom:2px; }
.arr { text-align:center; color:#fe5933; font-size:15px; font-weight:800; align-self:center; }
.worked { background:#faf0d8; border:1.5px solid #ecd9a8; border-radius:12px; padding:10px 14px; font-size:13px; line-height:1.6; color:#3d3730; text-align:center; margin-top:13px; }
""", body=head(K6, "Order-of-magnitude estimation",
    "Lecture 6 — a deliberately rough estimate that is honest about its bounds: four steps")
    + """
<div class="steps">
  <div class="card"><div class="num">1</div><div class="st"><b>Define</b>the quantity <b>and its units</b> — “how many kW of solar panels does the bus need?”</div></div>
  <div class="arr">→</div>
  <div class="card"><div class="num">2</div><div class="st"><b>Factor</b>it into estimable parts — daily energy ÷ yield per kW per day</div></div>
  <div class="arr">→</div>
  <div class="card"><div class="num">3</div><div class="st"><b>Round</b>each factor to one digit and multiply — 115 → 100 · 4 → 4 → 100 ÷ 4 = 25</div></div>
  <div class="arr">→</div>
  <div class="card"><div class="num">4</div><div class="st"><b>Check</b>the units and compare with a known value — kW ✓ · “a roof, not a field”</div></div>
</div>
<div class="worked"><b>Worked example — solar sizing:</b> 115 [kWh/day] ÷ 4 [kWh/kW·day] ≈ 29 → <b>“about 30 kW”</b> on ≈ 150 m² — honest bounds <b>23–38 kW</b></div>
"""
    + foot("A rough estimate with stated bounds beats a precise number with false confidence."))

# ---------------------------------------------------------------- t25 (Q35)
T25 = SHELL.format(css=BASE_CSS, extra="""
.grid4 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.what { font-size:13px; font-weight:700; line-height:1.35; margin:8px 0 4px; }
.ex { font-size:12.5px; line-height:1.5; color:#3d3730; }
.aid { font-size:11.5px; line-height:1.5; color:#6d6660; }
.aid b { color:#3d3730; }
""", body=head(K7, "Four data problems, four first aids",
    "Lecture 7 — name the problem before choosing the fix")
    + """
<div class="grid4">
  <div class="card"><span class="pill bg-orange ac-orange">Missing</span>
    <div class="what">No data for the case you care about</div>
    <div class="ex">Summer tests 1.1–1.6 kWh/km — <b>no winter test at all</b>, and cabin heating raises the use by an unknown amount</div>
    <hr class="divider">
    <div class="aid"><b>First aid:</b> fill the gap with a range (1.5–2.0 kWh/km) — and say so</div>
  </div>
  <div class="card"><span class="pill bg-blue ac-blue">Noisy</span>
    <div class="what">Readings scatter around the true value</div>
    <div class="ex">Five readings of one charger: <b>58 · 61 · 54 · 63 · 60 kW</b></div>
    <hr class="divider">
    <div class="aid"><b>First aid:</b> report the mean and the range — about 59 kW (54–63)</div>
  </div>
  <div class="card"><span class="pill bg-gold ac-gold">Wrong definition / unit</span>
    <div class="what">The number is there but means nothing yet</div>
    <div class="ex">A datasheet states <b>«200»</b> with no unit — kWh of energy or kW of power?</div>
    <hr class="divider">
    <div class="aid"><b>First aid:</b> fix the definition and the unit before using the number</div>
  </div>
  <div class="card"><span class="pill bg-teal ac-teal">Too little</span>
    <div class="what">Too few points to claim precision</div>
    <div class="ex">Three summer trips: <b>n = 3</b> — not enough to pin the energy use down</div>
    <hr class="divider">
    <div class="aid"><b>First aid:</b> give the range and n — don't claim more than the data supports</div>
  </div>
</div>
"""
    + foot("Name the problem, apply the first aid, <b>report what you did</b> — the reader can then judge the number."))

# ---------------------------------------------------------------- t26 (Q42)
def _t26_svg():
    W, H = 692, 252
    L, R, T, B = 46, 14, 18, 30
    pw, ph = W - L - R, H - T - B
    bins = [14, 26, 24, 13, 5, 3, 7, 8]  # %, 2-min bins 0..16
    ymax = 30.0
    def x(m): return L + pw * m / 16
    def y(p): return T + ph * (1 - p / ymax)
    s = f'<svg width="{W}" height="{H}" style="display:block;margin:0 auto">'
    for i, p in enumerate(bins):
        m0, m1 = i * 2, i * 2 + 2
        tail = m0 >= 12
        fill = "#fe5933" if tail else "#2f6fdb"
        op = "1" if tail else "0.82"
        s += f'<rect x="{x(m0)+2:.1f}" y="{y(p):.1f}" width="{x(m1)-x(m0)-4:.1f}" height="{y(0)-y(p):.1f}" fill="{fill}" opacity="{op}" rx="3"/>'
    # mean line at 5.92, p90 at 13.4
    s += f'<line x1="{x(5.92)}" y1="{y(26)-14}" x2="{x(5.92)}" y2="{y(0)}" stroke="#2c2c2c" stroke-width="1.8" stroke-dasharray="6 4"/>'
    s += f'<text x="{x(5.92)+5}" y="{y(26)-16}" font-size="11.5" font-weight="800" fill="#2c2c2c">mean 6 min</text>'
    s += f'<line x1="{x(13.4)}" y1="{y(14)-14}" x2="{x(13.4)}" y2="{y(0)}" stroke="#b97d10" stroke-width="1.8" stroke-dasharray="2 3"/>'
    s += f'<text x="{x(13.4)-5}" y="{y(14)-16}" font-size="11.5" font-weight="800" fill="#b97d10" text-anchor="end">p90 ≈ 13 min</text>'
    s += f'<text x="{x(14)}" y="{y(8)-12}" font-size="12" font-weight="800" fill="#fe5933" text-anchor="end">15% &gt; 12 min — one in seven</text>'
    s += f'<line x1="{L}" y1="{y(0)}" x2="{W-R}" y2="{y(0)}" stroke="#cfc7bd" stroke-width="1.5"/>'
    s += f'<line x1="{L}" y1="{y(0)}" x2="{L}" y2="{T}" stroke="#cfc7bd" stroke-width="1.5"/>'
    for m in range(0, 17, 2):
        s += f'<line x1="{x(m)}" y1="{y(0)}" x2="{x(m)}" y2="{y(0)+4}" stroke="#cfc7bd" stroke-width="1.2"/>'
        s += f'<text x="{x(m)}" y="{y(0)+16}" font-size="10.5" fill="#8a8178" text-anchor="middle">{m}</text>'
    for p in (10, 20, 30):
        s += f'<text x="{L-6}" y="{y(p)+4}" font-size="10.5" fill="#8a8178" text-anchor="end">{p}%</text>'
    s += f'<text x="{L-6}" y="{T+4}" font-size="10.5" fill="#8a8178" text-anchor="end">%</text>'
    s += f'<text x="{W-R}" y="{y(0)+30}" font-size="11" fill="#8a8178" text-anchor="end">waiting time, minutes</text>'
    s += '</svg>'
    return s


T26 = SHELL.format(css=BASE_CSS, extra="""
.reads { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-top:4px; }
.read { background:#fff; border:1.5px solid #e9e2da; border-radius:11px; padding:9px 11px; font-size:11.5px; line-height:1.5; color:#3d3730; }
.read b { display:block; font-size:11px; letter-spacing:.05em; text-transform:uppercase; }
""", body=head(K7, "One histogram, three readings",
    "Bus waiting times — the same data answers different questions for different people")
    + _t26_svg()
    + """
<div class="reads">
  <div class="read"><b class="ac-blue">The manager reads the mean</b>“The average wait is 6 minutes — fine.”</div>
  <div class="read"><b class="ac-orange">The passenger reads the tail</b>“One in seven of us (≈15%) waits more than 12 minutes.”</div>
  <div class="read"><b class="ac-teal">The planner reads the cost</b>“Cutting long waits needs more buses — what does it cost?”</div>
</div>
"""
    + foot("Different decisions need different metrics: the mean answers “typical?”, <b>p90 answers “how bad for the unlucky?”</b>, the tail answers “how many?”."))

# ---------------------------------------------------------------- t27 (Q46)
T27 = SHELL.format(css=BASE_CSS, extra="""
.rows { display:grid; grid-template-columns:170px 1fr; gap:0 12px; }
.rcell { display:flex; align-items:center; }
.rline { font-size:13.5px; line-height:1.5; color:#3d3730; padding:11px 0 11px 14px; border-left:2.5px solid; }
.rline b { color:#211d1a; }
""", body=head(K7, "An honest report in four lines",
    "Lecture 7 — every reported number carries its own health warning (Lab 7 LED case)")
    + """
<div class="rows">
  <div class="rcell"><span class="pill bg-orange ac-orange" style="font-size:12px;padding:6px 14px">Result</span></div>
  <div class="rline" style="border-color:#fe5933"><b>≈ 167 MWh/year saved</b> — the number, with its unit and its time basis</div>
  <div class="rcell"><span class="pill bg-blue ac-blue" style="font-size:12px;padding:6px 14px">Range</span></div>
  <div class="rline" style="border-color:#2f6fdb"><b>124–216 MWh/year</b> — the honest interval behind the single number</div>
  <div class="rcell"><span class="pill bg-gold ac-gold" style="font-size:11.5px;padding:6px 12px">Top assumption</span></div>
  <div class="rline" style="border-color:#e0a92e"><b>New lamps ≈ 12 W</b> — measured on five lamps (n = 5) from one batch</div>
  <div class="rcell"><span class="pill bg-teal ac-teal" style="font-size:11px;padding:6px 11px">Would change it</span></div>
  <div class="rline" style="border-color:#178a7b"><b>A wider lamp sample</b> and the real 10–14 h/day operating time</div>
</div>
"""
    + foot("<b>RESULT · RANGE · TOP ASSUMPTION · WHAT WOULD CHANGE IT</b> — four lines, every time; the number is only one of them."))


# ------------------------------------------------- data-problem option cards
CARD_CSS = """
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Liberation Sans','Helvetica Neue',Arial,sans-serif; background:#fff; color:#211d1a;
       width:560px; padding:18px 20px 16px; -webkit-font-smoothing:antialiased; }
.wrap { border:2.5px solid #fe5933; border-radius:18px; padding:14px 16px 13px; text-align:center; }
.pill { display:inline-block; font-size:12px; font-weight:800; letter-spacing:.12em; text-transform:uppercase;
        padding:4px 14px 5px; border-radius:999px; background:#fdeae4; color:#fe5933; }
.desc { font-size:13.5px; line-height:1.45; color:#3d3730; margin-top:9px; font-weight:700; }
"""

def _dp_missing():
    return """<svg width="330" height="128" style="margin:8px auto 0;display:block">
      <line x1="20" y1="104" x2="310" y2="104" stroke="#cfc7bd" stroke-width="1.5"/>
      <text x="105" y="122" font-size="11.5" fill="#8a8178" text-anchor="middle">summer tests ✓</text>
      <text x="255" y="122" font-size="11.5" fill="#8a8178" text-anchor="middle">winter — none</text>
      <circle cx="55" cy="62" r="6" fill="#178a7b"/><circle cx="100" cy="48" r="6" fill="#178a7b"/><circle cx="150" cy="34" r="6" fill="#178a7b"/>
      <text x="55" y="86" font-size="10.5" fill="#178a7b" text-anchor="middle">1.1</text>
      <text x="100" y="86" font-size="10.5" fill="#178a7b" text-anchor="middle">1.3</text>
      <text x="150" y="86" font-size="10.5" fill="#178a7b" text-anchor="middle">1.6</text>
      <circle cx="255" cy="48" r="15" fill="none" stroke="#fe5933" stroke-width="2" stroke-dasharray="4 3"/>
      <text x="255" y="53" font-size="15" font-weight="800" fill="#fe5933" text-anchor="middle">?</text>
      <text x="255" y="86" font-size="10.5" fill="#fe5933" text-anchor="middle">kWh/km</text>
    </svg>"""

def _dp_noisy():
    vals = [(58, 40), (61, 130), (54, 75), (63, 185), (60, 225)]
    dots = "".join(
        f'<circle cx="{x}" cy="{92 - (v - 50) * 6}" r="6" fill="#2f6fdb"/>'
        f'<text x="{x}" y="{112 - (v - 50) * 6}" font-size="10.5" fill="#2f6fdb" text-anchor="middle">{v}</text>'
        for v, x in vals)
    return f"""<svg width="330" height="128" style="margin:8px auto 0;display:block">
      <line x1="20" y1="104" x2="310" y2="104" stroke="#cfc7bd" stroke-width="1.5"/>
      <line x1="20" y1="{92 - 9 * 6}" x2="310" y2="{92 - 9 * 6}" stroke="#8a8178" stroke-width="1.6" stroke-dasharray="6 4"/>
      <text x="308" y="{92 - 9 * 6 - 6}" font-size="10.5" fill="#6d6660" text-anchor="end">mean ≈ 59 kW</text>
      {dots}
      <text x="165" y="124" font-size="11.5" fill="#8a8178" text-anchor="middle">five readings of one charger, kW</text>
    </svg>"""

def _dp_unit():
    return """<svg width="330" height="128" style="margin:8px auto 0;display:block">
      <text x="150" y="78" font-size="46" font-weight="800" fill="#211d1a" text-anchor="middle">200</text>
      <rect x="196" y="52" width="86" height="32" rx="8" fill="none" stroke="#fe5933" stroke-width="2" stroke-dasharray="5 3"/>
      <text x="239" y="74" font-size="17" font-weight="800" fill="#fe5933" text-anchor="middle">kW ?</text>
      <text x="239" y="102" font-size="15" font-weight="800" fill="#fe5933" text-anchor="middle">kWh ?</text>
      <text x="165" y="122" font-size="11.5" fill="#8a8178" text-anchor="middle">a datasheet number with no unit</text>
    </svg>"""

def _dp_few():
    return """<svg width="330" height="128" style="margin:8px auto 0;display:block">
      <line x1="20" y1="104" x2="310" y2="104" stroke="#cfc7bd" stroke-width="1.5"/>
      <circle cx="90" cy="60" r="6" fill="#178a7b"/>
      <text x="90" y="86" font-size="11" fill="#178a7b" text-anchor="middle">1 trip</text>
      <text x="230" y="66" font-size="21" font-weight="800" fill="#8a8178" text-anchor="middle">n = 1</text>
      <text x="165" y="122" font-size="11.5" fill="#8a8178" text-anchor="middle">one measurement — nothing to compare it with</text>
    </svg>"""

def dp_card(name, pill, svg, desc):
    html = SHELL.format(css=CARD_CSS, extra="", body=f"""
<div class="wrap"><span class="pill">{pill}</span>{svg}<div class="desc">{desc}</div></div>""")
    return name, html


DP_CARDS = [
    dp_card("dp_missing.png", "Missing", _dp_missing(),
            "No data for the case you care about"),
    dp_card("dp_noisy.png", "Noisy", _dp_noisy(),
            "Readings scatter around the true value"),
    dp_card("dp_unit.png", "No unit", _dp_unit(),
            "The number is there — its meaning is not"),
    dp_card("dp_few.png", "Too little", _dp_few(),
            "Too few points to claim precision"),
]
