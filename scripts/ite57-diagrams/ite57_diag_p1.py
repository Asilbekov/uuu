#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ITE W5-7 test diagrams — part 1: t13..t20 (Week 5 + first Week 6)."""
from ite57_diag_style import BASE_CSS, SHELL

K5 = "WEEK 5 · MODELLING II"
K6 = "WEEK 6 · QUANTITATIVE REASONING I"


def head(kicker, title, subtitle):
    return (f'<div class="head"><div class="kicker">{kicker}</div>'
            f'<div class="title">{title}</div>'
            f'<div class="subtitle">{subtitle}</div></div>')


def foot(html):
    return f'<div class="foot">{html}</div>'


# ---------------------------------------------------------------- t13 (Q4)
T13 = SHELL.format(css=BASE_CSS, extra="""
.grid4 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.ex { font-size:12.5px; line-height:1.5; color:#3d3730; }
.exlabel { font-size:10px; font-weight:800; letter-spacing:.08em; color:#8a8178; text-transform:uppercase; margin-bottom:3px; }
.def { font-size:13.5px; line-height:1.45; font-weight:700; color:#211d1a; }
""", body=head(K5, "Four kinds of models",
    "One campus electrical grid, four ways to model it — each kind answers a different question (Lecture&nbsp;5)")
    + """
<div class="grid4">
  <div class="card"><span class="pill bg-teal ac-teal">Physical</span>
    <div class="def" style="margin-top:8px">A real, simplified copy you can touch</div>
    <hr class="divider">
    <div class="exlabel">Lecture example</div>
    <div class="ex">A wind-turbine blade tested in a wind tunnel</div>
  </div>
  <div class="card"><span class="pill bg-blue ac-blue">Graphical</span>
    <div class="def" style="margin-top:8px">Diagrams and schematics</div>
    <hr class="divider">
    <div class="exlabel">Lecture example</div>
    <div class="ex">The one-line diagram — “which buildings lose power if the library feeder is switched off?”</div>
  </div>
  <div class="card"><span class="pill bg-orange ac-orange">Mathematical</span>
    <div class="def" style="margin-top:8px">Equations between the quantities</div>
    <hr class="divider">
    <div class="exlabel">Lecture example</div>
    <div class="ex">The energy balance: supply&nbsp;=&nbsp;demand&nbsp;+&nbsp;losses</div>
  </div>
  <div class="card"><span class="pill bg-gold ac-gold">Computational</span>
    <div class="def" style="margin-top:8px">Rules run step by step</div>
    <hr class="divider">
    <div class="exlabel">Lecture example</div>
    <div class="ex">The hourly demand table — “in which hour is the peak?”</div>
  </div>
</div>
"""
    + foot("Real projects mix the kinds — <b>diagrams to organise, equations to compute, tables to run the numbers</b>. The geographic map answers locations (cable length, river crossings), not connections."))

# ---------------------------------------------------------------- t14 (Q6)
T14 = SHELL.format(css=BASE_CSS, extra="""
.row { display:grid; grid-template-columns:1fr 30px 1.25fr 30px 1fr; gap:0; align-items:stretch; }
.role { font-size:12px; line-height:1.5; color:#3d3730; }
.model { background:#fff; border:2px solid #fe5933; border-radius:16px; padding:14px 12px; text-align:center; }
.formula { font-size:21px; font-weight:800; color:#fe5933; letter-spacing:.02em; }
.mnote { font-size:11.5px; color:#6d6660; line-height:1.45; margin-top:6px; }
.mapstrip { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-top:12px; }
.mapchip { background:#fff; border:1.5px solid #e9e2da; border-radius:10px; padding:8px 10px; text-align:center; font-size:12px; color:#3d3730; }
.arr { text-align:center; color:#fe5933; font-size:20px; font-weight:800; line-height:1; align-self:center; }
""", body=head(K5, "Anatomy of a model",
    "The campus e-bus range model: every number plays one of four roles (Lecture&nbsp;5)")
    + """
<div class="row">
  <div class="card"><span class="pill bg-blue ac-blue">Inputs</span>
    <div class="role" style="margin-top:8px"><b>What the design sets</b><br>route 12 km × 8 laps<br>= 96 km per day<br>speed 20 km/h</div>
  </div>
  <div class="arr">→</div>
  <div class="model"><span class="pill bg-orange ac-orange">Model · the relationship</span>
    <div class="formula" style="margin-top:9px">R = C · u ÷ e</div>
    <div class="mnote">keeps some things, drops some,<br>serves the purpose-question</div>
  </div>
  <div class="arr">→</div>
  <div class="card"><span class="pill bg-teal ac-teal">Outputs</span>
    <div class="role" style="margin-top:8px"><b>What you judge</b><br>range R ≈ 133 km<br>per charge<br><br><b>Is 96 km covered? ✓</b></div>
  </div>
</div>
<div style="text-align:center;color:#fe5933;font-weight:800;font-size:17px;margin:6px 0 2px">↑</div>
<div class="card" style="border-style:dashed"><span class="pill bg-gold ac-gold">Parameters</span>
  <span class="role" style="margin-left:10px"><b>Numbers that describe the system and are held fixed:</b>&nbsp; battery C = 200 kWh · usable fraction u = 0.8 · energy use e = 1.2 kWh/km</span>
</div>
<div class="mapstrip">
  <div class="mapchip"><b class="ac-blue">design</b> (week-4 variable) → inputs</div>
  <div class="mapchip"><b class="ac-gold">context</b> (week-4 variable) → parameters</div>
  <div class="mapchip"><b class="ac-teal">performance</b> (week-4 variable) → outputs</div>
</div>
"""
    + foot("Every model <b>keeps something, drops something and serves a purpose-question</b> — “all models are wrong, but some are useful” (George Box)."))

# ---------------------------------------------------------------- t15 (Q11)
T15 = SHELL.format(css=BASE_CSS, extra="""
.grid3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; }
.quote { font-size:12.5px; line-height:1.55; color:#3d3730; font-style:italic; }
.what { font-size:13px; font-weight:700; line-height:1.4; margin:8px 0 2px; }
.fix { font-size:11.5px; color:#6d6660; line-height:1.45; }
""", body=head(K5, "Three kinds of assumptions",
    "The e-bus model, Lecture 5 — every assumption you write down is one of three kinds")
    + """
<div class="grid3">
  <div class="card"><span class="pill bg-blue ac-blue">Simplifying</span>
    <div class="what">We make the maths easier on purpose</div>
    <div class="quote">“We ignore hills, traffic lights, stops and differences between drivers.”</div>
    <hr class="divider">
    <div class="fix"><b>Effect if wrong:</b> the range estimate drifts — check against a known value</div>
  </div>
  <div class="card"><span class="pill bg-gold ac-gold">Boundary</span>
    <div class="what">We draw the edge of the model</div>
    <div class="quote">“Passengers, the charging station and the electric grid stay outside the model.”</div>
    <hr class="divider">
    <div class="fix"><b>Effect if wrong:</b> the answer is right for the wrong world</div>
  </div>
  <div class="card"><span class="pill bg-teal ac-teal">Data</span>
    <div class="what">We assume a number we could not measure</div>
    <div class="quote">“Summer tests give e = 1.1–1.6 kWh/km; for winter we assume 1.5–2.0 kWh/km.”</div>
    <hr class="divider">
    <div class="fix"><b>Effect if wrong:</b> the winter range verdict changes</div>
  </div>
</div>
"""
    + foot("Write <b>every</b> assumption down — with a reason and the effect on the result if it fails (see the course template)."))

# ---------------------------------------------------------------- t16 (Q13)
T16 = SHELL.format(css=BASE_CSS, extra="""
.tpl { font-size:19.5px; line-height:1.85; font-weight:700; color:#211d1a; text-align:center; padding:10px 6px 6px; }
.slot { display:inline-block; padding:2px 10px 3px; border-radius:9px; font-size:14.5px; letter-spacing:.04em; vertical-align:1px; }
.exrow { font-size:13.5px; line-height:1.7; color:#3d3730; }
.exlabel { font-size:10px; font-weight:800; letter-spacing:.08em; color:#8a8178; text-transform:uppercase; margin:12px 0 5px; }
""", body=head(K5, "The assumption template",
    "How the course writes an assumption so it can be checked and challenged")
    + """
<div class="card" style="border:2px solid #fe5933">
  <div class="tpl">We assume
    <span class="slot bg-blue ac-blue">[ assumption ]</span> because
    <span class="slot bg-gold ac-gold">[ reason ]</span>.<br>
    If it is wrong,
    <span class="slot bg-teal ac-teal">[ effect on the result ]</span>.
  </div>
</div>
<div class="card" style="margin-top:12px">
  <div class="exlabel">Worked example — winter e-bus (Lecture 5)</div>
  <div class="exrow">We assume <b class="ac-blue">winter energy use e = 1.8 kWh/km</b> because
  <b class="ac-gold">cabin heating raises consumption by about 50%</b>.
  If it is wrong, <b class="ac-teal">the range estimate 89 km — and the “day not covered” verdict — change</b>.</div>
</div>
"""
    + foot("An assumption that cannot be written in this shape is not yet an assumption — it is a guess."))

# ---------------------------------------------------------------- t17 (Q14)
T17 = SHELL.format(css=BASE_CSS, extra="""
.chart { position:relative; margin-top:6px; }
.row { display:grid; grid-template-columns:158px 1fr; gap:10px; align-items:center; margin-bottom:11px; }
.lab { text-align:right; font-size:12.5px; line-height:1.3; color:#3d3730; }
.lab b { display:block; font-size:13px; color:#211d1a; }
.track { position:relative; height:30px; }
.bar { position:absolute; left:0; top:0; height:30px; border-radius:6px; }
.val { position:absolute; top:4px; font-size:12.5px; font-weight:800; color:#fff; }
.need { position:absolute; top:-14px; bottom:-6px; border-left:2.5px dashed #fe5933; }
.needlab { position:absolute; top:-34px; transform:translateX(-50%); font-size:11px; font-weight:800; color:#fe5933; white-space:nowrap; }
.ok { background:#178a7b; } .bad { background:#fe5933; }
.axis { border-top:1.5px solid #cfc7bd; margin-left:168px; position:relative; height:18px; }
.tick { position:absolute; top:3px; font-size:10.5px; color:#8a8178; transform:translateX(-50%); }
""", body=head(K5, "Does the bus cover the day?",
    "Usable battery energy 160 kWh — the range under four scenarios against the 96 km daily need")
    + """
<div class="chart" style="padding-top:38px">
  <div class="need" style="left:calc(168px + (100% - 168px) * 0.686)"><span class="needlab" style="left:-4px">daily need 96 km = 8 laps × 12 km</span></div>
  <div class="row"><div class="lab"><b>Base case</b>e = 1.2 kWh/km</div>
    <div class="track"><div class="bar ok" style="width:95%"></div><div class="val" style="left:calc(95% - 46px)">133 km ✓</div></div></div>
  <div class="row"><div class="lab"><b>Full load</b>heavier bus</div>
    <div class="track"><div class="bar ok" style="width:81.4%"></div><div class="val" style="left:calc(81.4% - 46px)">114 km ✓</div></div></div>
  <div class="row"><div class="lab"><b>Old battery</b>u = 0.64</div>
    <div class="track"><div class="bar ok" style="width:76.4%"></div><div class="val" style="left:calc(76.4% - 46px)">107 km ✓</div></div></div>
  <div class="row"><div class="lab"><b>Winter heating</b>e = 1.8 kWh/km</div>
    <div class="track"><div class="bar bad" style="width:63.6%"></div><div class="val" style="left:calc(63.6% - 45px)">89 km ✗</div></div></div>
  <div class="axis">
    <div class="tick" style="left:0%">0</div><div class="tick" style="left:25%">35</div>
    <div class="tick" style="left:50%">70</div><div class="tick" style="left:75%">105</div>
    <div class="tick" style="left:100%">140 km</div>
  </div>
</div>
"""
    + foot("R = C · u ÷ e — each scenario changes <b>one letter</b>, not the model. Winter is the first case the 96 km day is <b>not</b> covered."))

# ---------------------------------------------------------------- t18 (Q15)
def _bell():
    import math
    pts = []
    for i in range(0, 27):
        h = 6 + i * 0.5
        kw = 4.3 * math.exp(-((h - 13) ** 2) / (2 * 2.6 ** 2))
        pts.append((h, kw))
    return pts


def _t18_svg():
    W, H = 692, 240
    L, R, T, B = 46, 12, 16, 34
    pw, ph = W - L - R, H - T - B
    def x(h): return L + pw * h / 24
    def y(k): return T + ph * (1 - k / 6)
    pts = _bell()
    path = "M " + " L ".join(f"{x(h):.1f},{y(k):.1f}" for h, k in pts)
    area = path + f" L {x(19):.1f},{y(0):.1f} L {x(6):.1f},{y(0):.1f} Z"
    return f"""<svg width="{W}" height="{H}" style="display:block;margin:0 auto">
      <rect x="{x(0)}" y="{y(5)}" width="{pw}" height="{y(0)-y(5)}" fill="#fdeae4" stroke="#fe5933" stroke-width="1.6" stroke-dasharray="6 4" rx="3"/>
      <path d="{area}" fill="#bfe6de" opacity="0.85"/>
      <path d="{path}" fill="none" stroke="#178a7b" stroke-width="2.6"/>
      <line x1="{L}" y1="{y(0)}" x2="{W-R}" y2="{y(0)}" stroke="#cfc7bd" stroke-width="1.5"/>
      <line x1="{L}" y1="{y(0)}" x2="{L}" y2="{T}" stroke="#cfc7bd" stroke-width="1.5"/>
      {[f'<line x1="{x(h)}" y1="{y(0)}" x2="{x(h)}" y2="{y(0)+4}" stroke="#cfc7bd" stroke-width="1.2"/><text x="{x(h)}" y="{y(0)+16}" font-size="10.5" fill="#8a8178" text-anchor="middle">{h}:00</text>' for h in (0, 6, 12, 18, 24)]}
      {[f'<text x="{L-6}" y="{y(k)+4}" font-size="10.5" fill="#8a8178" text-anchor="end">{k}</text><line x1="{L-2}" y1="{y(k)}" x2="{W-R}" y2="{y(k)}" stroke="#efe9e1" stroke-width="1"/>' for k in (2, 4, 6)]}
      <text x="{x(3)}" y="{y(5)-8}" font-size="12" font-weight="800" fill="#fe5933" text-anchor="middle">naive: 5 kW × 24 h</text>
      <text x="{x(3)}" y="{y(5)+14}" font-size="12" font-weight="800" fill="#fe5933" text-anchor="middle">= 120 kWh/day</text>
      <text x="{x(13)}" y="{y(4.3)-10}" font-size="12" font-weight="800" fill="#178a7b" text-anchor="middle">clear day ≈ 31 kWh/day</text>
      <text x="{L-6}" y="{T+4}" font-size="10.5" fill="#8a8178" text-anchor="end">kW</text>
    </svg>"""


T18 = SHELL.format(css=BASE_CSS, extra="""
.ratio { display:flex; justify-content:center; margin-top:10px; }
.chip { background:#fdeae4; color:#fe5933; font-weight:800; font-size:13px; padding:5px 14px; border-radius:999px; }
""", body=head(K5, "The sun does not shine at 5 kW all day",
    "A 5 kW array: the naive rectangle assumes full power around the clock — the clear-day profile is a bell")
    + _t18_svg()
    + '<div class="ratio"><span class="chip">the naive estimate is ≈ 4× too high</span></div>'
    + foot("The hidden assumption: <b>full power, all 24 hours</b>. Replace it with a clear-day profile → about <b>31 kWh/day</b>, not 120."))

# ---------------------------------------------------------------- t19 (Q20)
def _t19():
    # piecewise scale: 0..1.0 -> 46..506 px; 1.0..1.8 -> 506..660
    def u(v):
        return 46 + (v / 1.0) * 460 if v <= 1.0 else 506 + (v - 1.0) / 0.8 * 154
    marks = [
        (0.59, "charger 88 ÷ 150", "Lab 5"),
        (0.72, "faculty 180 ÷ 250", "peak hour"),
        (0.90, "depot plan 180 ÷ 200", "two batches"),
        (1.80, "all six at once 360 ÷ 200", "rejected"),
    ]
    mk = ""
    for i, (v, lab, sub) in enumerate(marks):
        x = u(v)
        col = "#fe5933" if v > 1 else "#2c2c2c"
        mk += (f'<div style="position:absolute;left:{x}px;top:0;bottom:26px;border-left:2px solid {col};"></div>'
               f'<div style="position:absolute;left:{x}px;top:{-2 - 0}px;transform:translateX(-50%);">'
               f'<div style="font-size:11.5px;font-weight:800;color:{col};white-space:nowrap;">{v:.2f}</div>'
               f'<div style="font-size:10px;color:#6d6660;white-space:nowrap;">{lab}</div>'
               f'<div style="font-size:10px;color:#8a8178;white-space:nowrap;">{sub}</div></div>')
    return f"""
<div style="position:relative;height:190px;margin-top:64px">
  <div style="position:absolute;left:0;right:0;top:58px;height:26px;border-radius:8px;overflow:hidden;display:flex">
    <div style="width:{u(0.6)}px;background:#e7effc"></div>
    <div style="width:{u(0.9)-u(0.6)}px;background:#e2f3ef"></div>
    <div style="width:{u(1.0)-u(0.9)}px;background:#faf0d8"></div>
    <div style="flex:1;background:#fdeae4"></div>
  </div>
  <div style="position:absolute;left:0;right:0;top:92px">
    <div style="position:absolute;left:46px;width:{u(0.6)-46}px;text-align:center;font-size:11px;font-weight:800;color:#2f6fdb">IDLE</div>
    <div style="position:absolute;left:{u(0.6)}px;width:{u(0.9)-u(0.6)}px;text-align:center;font-size:11px;font-weight:800;color:#178a7b">COMFORTABLE</div>
    <div style="position:absolute;left:{u(0.9)}px;width:{u(1.0)-u(0.9)}px;text-align:center;font-size:10px;font-weight:800;color:#b97d10">STRETCHED</div>
    <div style="position:absolute;left:{u(1.0)}px;right:0;text-align:center;font-size:11px;font-weight:800;color:#fe5933">OVERLOAD&nbsp;·&nbsp;&gt;1.0</div>
  </div>
  <div style="position:absolute;left:0;right:0;top:58px;height:26px;border-left:2px solid #2c2c2c;box-sizing:border-box"></div>
  {mk}
  <div style="position:absolute;left:46px;top:130px;font-size:10.5px;color:#8a8178">0</div>
  <div style="position:absolute;left:{u(1.0)}px;top:130px;transform:translateX(-50%);font-size:10.5px;color:#8a8178">1.0</div>
  <div style="position:absolute;left:{u(1.8)}px;top:130px;transform:translateX(-50%);font-size:10.5px;color:#8a8178">1.8</div>
</div>
<div style="text-align:center;margin-top:2px"><span class="pill" style="background:#2c2c2c;color:#fff">utilisation&nbsp;= demand ÷ capacity</span>
<span style="font-size:12px;color:#6d6660">&nbsp;same units, same time basis</span></div>"""


T19 = SHELL.format(css=BASE_CSS, extra="", body=head(K6, "Demand ÷ capacity = utilisation",
    "One number places every system of the week on one scale — what lives above 1.0?")
    + _t19()
    + foot("Above <b>1.0</b>: overload — demand is rejected or a queue grows. Size for the <b>peak</b>, not for the average."))

# ---------------------------------------------------------------- t20 (Q22)
def _t20_svg():
    W, H = 692, 250
    L, R, T, B = 46, 14, 18, 34
    pw, ph = W - L - R, H - T - B
    def x(h): return L + pw * h / 24
    def y(k): return T + ph * (1 - k / 260)
    curve = [(0, 48), (3, 45), (6, 52), (8, 78), (10, 110), (12, 158), (13, 180),
             (14, 170), (16, 138), (18, 100), (20, 78), (22, 58), (24, 50)]
    path = "M " + " L ".join(f"{x(h):.1f},{y(k):.1f}" for h, k in curve)
    area = path + f" L {x(24):.1f},{y(0):.1f} L {x(0):.1f},{y(0):.1f} Z"
    return f"""<svg width="{W}" height="{H}" style="display:block;margin:0 auto">
      <rect x="{L}" y="{T}" width="{pw}" height="{ph}" fill="#fdfcfb"/>
      <path d="{area}" fill="#eef2f7"/>
      <path d="{path}" fill="none" stroke="#2f6fdb" stroke-width="2.6"/>
      <line x1="{L}" y1="{y(250)}" x2="{W-R}" y2="{y(250)}" stroke="#2c2c2c" stroke-width="2.2"/>
      <text x="{W-R-4}" y="{y(250)-7}" font-size="11.5" font-weight="800" fill="#2c2c2c" text-anchor="end">transformer 250 kW</text>
      <line x1="{L}" y1="{y(94)}" x2="{W-R}" y2="{y(94)}" stroke="#8a8178" stroke-width="1.8" stroke-dasharray="7 5"/>
      <text x="{L+6}" y="{y(94)-7}" font-size="11.5" font-weight="800" fill="#6d6660">24-h average 94 kW</text>
      <circle cx="{x(13)}" cy="{y(180)}" r="5.5" fill="#fe5933"/>
      <text x="{x(13)}" y="{y(180)-14}" font-size="12.5" font-weight="800" fill="#fe5933" text-anchor="middle">peak 13:00 → 180 kW</text>
      <line x1="{L}" y1="{y(0)}" x2="{W-R}" y2="{y(0)}" stroke="#cfc7bd" stroke-width="1.5"/>
      <line x1="{L}" y1="{y(0)}" x2="{L}" y2="{T}" stroke="#cfc7bd" stroke-width="1.5"/>
      {[f'<line x1="{x(h)}" y1="{y(0)}" x2="{x(h)}" y2="{y(0)+4}" stroke="#cfc7bd" stroke-width="1.2"/><text x="{x(h)}" y="{y(0)+16}" font-size="10.5" fill="#8a8178" text-anchor="middle">{h}:00</text>' for h in (0, 6, 12, 18, 24)]}
      {[f'<text x="{L-6}" y="{y(k)+4}" font-size="10.5" fill="#8a8178" text-anchor="end">{k}</text>' for k in (50, 100, 150, 200, 250)]}
      <text x="{L-6}" y="{T+4}" font-size="10.5" fill="#8a8178" text-anchor="end">kW</text>
    </svg>"""


T20 = SHELL.format(css=BASE_CSS, extra="", body=head(K6, "The average hides the peak",
    "Faculty building electricity over the day — the 13:00 peak is what the transformer must carry")
    + _t20_svg()
    + foot("Size for the <b>peak</b>, not for the average — utilisation at the peak: 180 ÷ 250 = <b>0.72, comfortable</b>."))
