#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Six diagrams for the ITE Weeks 5-7 study guides (RU/EN/UZ), in the style of
the approved Weeks 1-4 diagrams (commit 87d7bab): HTML/CSS palette-matched to
the guide, rendered via Playwright at 2x, embedded with centered gray captions
«Рис. N.» / «Fig. N.» / «N-rasm.» in the corresponding week sections.

Usage:
  python3 figures_ie57.py render   # -> work/fig_ie57/fig{1..6}_{ru|en|uz}.png
  python3 figures_ie57.py patch     # insert figure blocks into work/ie57_*.tex
  python3 figures_ie57.py build     # tectonic x3 + copy to study-guides/
  python3 figures_ie57.py verify    # images, gaps, tofu, captions
  python3 figures_ie57.py all
"""
import os, re, sys, glob, shutil, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import fig_ie57_text as FT

WORK = '/home/z/my-project/work'
REPO = '/home/z/my-project/uuu'
OUTDIR = os.path.join(WORK, 'fig_ie57')

# fig -> (css width px, LaTeX width spec)
GEOM = {'f1': (930, r'\linewidth'), 'f2': (730, r'0.78\linewidth'),
        'f3': (930, r'\linewidth'), 'f4': (930, r'\linewidth'),
        'f5': (730, r'0.78\linewidth'), 'f6': (930, r'\linewidth')}
ORDER = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6']
LANGS = ['ru', 'en', 'uz']
PDFNAME = {'ru': 'Introduction_to_Engineering_Weeks_5-7_RU.pdf',
           'en': 'Introduction_to_Engineering_Weeks_5-7_EN.pdf',
           'uz': 'Introduction_to_Engineering_Weeks_5-7_UZ.pdf'}
CAPWORD = {'ru': 'Рис.', 'en': 'Fig.', 'uz': 'rasm'}
CAPRX = {'ru': r'Рис\. \d', 'en': r'Fig\. \d', 'uz': r'\d-rasm\.'}
# unique source-note anchors, one per figure, per language (en-dash U+2013!)
ANCHOR = {
 'f1': {'ru': 'слайды 13–14; Lab5',   'en': 'slides 13–14; Lab5',   'uz': '13–14-slaydlar; Lab5'},
 'f2': {'ru': 'слайды 19, 23; Lab5',  'en': 'slides 19, 23; Lab5',  'uz': '19, 23-slaydlar; Lab5'},
 'f3': {'ru': 'слайд 9; Lab6',        'en': 'slide 9; Lab6',        'uz': '9-slayd; Lab6'},
 'f4': {'ru': 'слайды 4, 16–17',      'en': 'slides 4, 16–17',      'uz': '4, 16–17-slaydlar'},
 'f5': {'ru': 'слайды 21–26; Lab7',   'en': 'slides 21–26; Lab7',   'uz': '21–26-slaydlar; Lab7'},
 'f6': {'ru': 'слайд 15; Lab7',       'en': 'slide 15; Lab7',       'uz': '15-slayd; Lab7'},
}

CSS = """
*{box-sizing:border-box;margin:0;padding:0}
body{background:#fff;font-family:'FreeSerif','DejaVu Serif',serif;color:#3F3A2E;
     -webkit-font-smoothing:antialiased}
.fig{background:#fff;border:1.5px solid #D8D2C4;border-radius:14px;padding:26px 28px 20px}
.kick{font-size:12.5px;letter-spacing:2.4px;text-transform:uppercase;color:#BF7F3F;
      margin-bottom:9px;font-weight:700}
h1{font-size:30px;line-height:1.14;color:#1D1C1A;margin-bottom:7px;font-weight:700}
.sub{font-size:15.5px;color:#6B6553;line-height:1.34;margin-bottom:18px}
.card{background:#F7F5F0;border:1.5px solid #DCD6C8;border-radius:11px;padding:15px 17px}
.ch{font-size:13.5px;font-weight:700;letter-spacing:0.7px;color:#4E452B;margin-bottom:7px}
.cd{font-size:13.5px;color:#6B6553;line-height:1.32;margin-bottom:11px}
.role{display:inline-block;font-size:12.5px;color:#64748B;border:1px solid #C7CCD6;
      border-radius:999px;padding:2.5px 11px;background:#fff;margin-bottom:11px}
.chip{display:inline-block;font-size:14px;background:#fff;border:1px solid #C9BFA9;
      border-radius:8px;padding:5px 12px;margin:0 7px 7px 0;color:#3F3A2E;white-space:nowrap}
.frm{display:block;font-size:15.5px;background:#fff;border:1.2px solid #B99A6B;
     border-radius:8px;padding:8px 13px;margin:0 0 9px 0;color:#4E452B;text-align:center;
     white-space:nowrap;font-weight:700}
.arrow{font-size:34px;color:#BF7F3F;line-height:1}
.bottom{margin-top:18px;background:#F7F5F0;border:1.5px solid #DCD6C8;border-radius:11px;
        padding:13px 20px;font-size:15px;font-style:italic;color:#4E452B;text-align:center;
        line-height:1.42}
.tag{display:inline-block;font-size:12.5px;font-weight:700;letter-spacing:1.2px;
     text-transform:uppercase;padding:3px 12px;border-radius:999px;color:#fff}
"""


def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def head(t, sub=True):
    h = f'<div class="kick">{esc(t["kicker"])}</div><h1>{esc(t["title"])}</h1>'
    if sub and t.get('subtitle'):
        h += f'<div class="sub">{esc(t["subtitle"])}</div>'
    return h


def bottom(t):
    return f'<div class="bottom">{esc(t["bottom"])}</div>'


# ------------------------------------------------------------------ fig 1
def html_f1(t):
    def col(h, d, role, chips):
        c = ''.join(f'<span class="chip">{esc(x)}</span>' for x in chips)
        return (f'<div class="card"><div class="ch">{esc(h)}</div>'
                f'<div class="cd">{esc(d)}</div><div class="role">{esc(role)}</div>{c}</div>')
    machine = ('<div class="card" style="background:#F0E4CB;border-color:#B99A6B">'
               f'<div class="ch" style="color:#8A6D3B">{esc(t["re_h"])}</div>'
               f'<div class="cd" style="margin-bottom:10px">{esc(t["re_d"])}</div>'
               + ''.join(f'<span class="frm">{esc(f)}</span>' for f in t['re_formulas'])
               + '</div>')
    out_card = ('<div class="card" style="background:#DCE6EE;border-color:#9FB4C8">'
                f'<div class="ch" style="color:#325675">{esc(t["ou_h"])}</div>'
                f'<div class="cd" style="margin-bottom:10px">{esc(t["ou_d"])}</div>'
                f'<div class="role" style="color:#325675;border-color:#B9C7D6">{esc(t["ou_role"])}</div>'
                + ''.join(f'<span class="chip">{esc(x)}</span>' for x in t['ou_chips']) + '</div>')
    left = (col(t['in_h'], t['in_d'], t['in_role'], t['in_chips']) +
            col(t['pa_h'], t['pa_d'], t['pa_role'], t['pa_chips']))
    return f'''<div class="fig" style="width:930px">{head(t)}
<div style="display:flex;align-items:stretch">
  <div style="width:272px;display:flex;flex-direction:column;gap:14px">{left}</div>
  <div style="width:46px;display:flex;align-items:center;justify-content:center">
    <div class="arrow">→</div></div>
  <div style="width:242px">{machine}</div>
  <div style="width:46px;display:flex;align-items:center;justify-content:center">
    <div class="arrow">→</div></div>
  <div style="width:240px">{out_card}</div>
</div>{bottom(t)}</div>'''


# ------------------------------------------------------------------ fig 2
def html_f2(t):
    steps = []
    for i, (v, d) in enumerate(t['chain']):
        steps.append(f'''<div style="text-align:center">
  <div style="display:inline-block;background:#fff;border:1.3px solid #B99A6B;border-radius:9px;
       padding:7px 16px;font-size:16px;font-weight:700;color:#4E452B">{esc(v)}
    <span style="font-weight:400;font-size:12.5px;color:#838079"> · {esc(d)}</span></div></div>''')
        if i < len(t['chain']) - 1:
            steps.append('<div style="text-align:center;color:#BF7F3F;font-size:22px;line-height:1">↓</div>')
    cards = []
    bmap = {'blue': ('#DCE6EE', '#325675'), 'gold': ('#F0E4CB', '#8A6D3B'), 'sienna': ('#F0DCBE', '#BF7F3F')}
    for (h, d, c) in t['cards']:
        bg, fg = bmap[c]
        cards.append(f'''<div style="background:{bg};border-left:5px solid {fg};border-radius:9px;
      padding:10px 14px;margin-bottom:10px">
  <div style="font-size:14px;font-weight:700;color:{fg};margin-bottom:3px">{esc(h)}</div>
  <div style="font-size:13.5px;color:#3F3A2E;line-height:1.32">{esc(d)}</div></div>''')
    return f'''<div class="fig" style="width:730px">{head(t, sub=False)}
<div style="display:flex;gap:14px;align-items:stretch">
  <div style="width:336px;display:flex;flex-direction:column;justify-content:center">
    {''.join(steps)}
  </div>
  <div style="width:336px">{''.join(cards)}</div>
</div>
<div style="background:#fff;border:1.3px solid #325675;border-radius:10px;padding:10px 15px;
     margin:12px 0 0;text-align:center">
  <div style="font-size:12.5px;font-weight:700;letter-spacing:1.1px;text-transform:uppercase;
       color:#325675;margin-bottom:5px">{esc(t['day'])} — {esc(t['q'])}</div>
</div>
<div style="background:#F0E4CB;border:1.3px solid #B99A6B;border-radius:10px;padding:13px 17px;margin-top:14px">
  <div style="font-size:14.5px;font-weight:700;color:#8A6D3B;margin-bottom:5px">{esc(t['tpl_h'])}</div>
  <div style="font-size:15px;color:#4E452B;font-style:italic;margin-bottom:7px">{esc(t['tpl'])}</div>
  <div style="font-size:13.5px;color:#3F3A2E;line-height:1.38">{esc(t['tpl_ex'])}</div>
</div>{bottom(t)}</div>'''


# ------------------------------------------------------------------ fig 3
def html_f3(t):
    zonemap = {'ok': ('#DCE6EE', '#325675'), 'tight': ('#F0E4CB', '#8A6D3B'),
               'over': ('#F0DCBE', '#BF7F3F')}
    rows = []
    for (name, dem, cap, u, word, zone) in t['rows']:
        bg, fg = zonemap[zone]
        rows.append(f'''<div class="card" style="padding:12px 15px">
  <div style="font-size:15px;font-weight:700;color:#1D1C1A;margin-bottom:8px">{esc(name)}</div>
  <div><span class="chip">{esc(dem)}</span><span class="chip">{esc(cap)}</span>
    <span class="chip" style="background:{bg};border-color:{fg};color:{fg};font-weight:700">
      {esc(u)} · {esc(word)}</span></div></div>''')
    # utilisation scale: 0..2.0 -> 100..0%, segments 0-0.8 (40%), .8-1 (10%), 1-2 (50%)
    dots = ''
    for (lab, v) in t['scale_marks']:
        x = v / 2.0 * 100
        dots += (f'<div style="position:absolute;left:{x:.2f}%;top:-7px;width:15px;height:15px;'
                 f'border-radius:50%;background:#fff;border:2.5px solid #4E452B;transform:translateX(-50%)"></div>'
                 f'<div style="position:absolute;left:{x:.2f}%;top:-32px;transform:translateX(-50%);'
                 f'font-size:13px;font-weight:700;color:#4E452B">{esc(lab)}</div>')
    # three legend cards (threshold zones)
    zcards = ''
    for i, (txt, z) in enumerate(t['zones']):
        bg, fg = zonemap[z]
        mr = 'margin-right:11px;' if i < len(t['zones']) - 1 else ''
        zcards += (f'<div style="flex:1;{mr}background:{bg};border:1.3px solid {fg};'
                   f'border-radius:9px;padding:10px 13px">'
                   f'<div style="display:inline-block;width:13px;height:13px;border-radius:3px;'
                   f'background:{fg};margin-right:7px;vertical-align:-2px"></div>'
                   f'<span style="font-size:13px;color:#3F3A2E;line-height:1.32">{esc(txt)}</span></div>')
    return f'''<div class="fig" style="width:930px">{head(t)}
<div style="text-align:center;background:#fff;border:1.3px solid #B99A6B;border-radius:10px;
     padding:9px 14px;margin-bottom:16px;font-size:16.5px;font-weight:700;color:#4E452B">
  {esc(t['formula'])}</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:13px;margin-bottom:26px">
  {''.join(rows)}</div>
<div style="position:relative;height:64px;margin:0 6px 12px">
  <div style="position:absolute;left:0;right:0;top:14px;height:22px;border-radius:6px;overflow:hidden;
       display:flex">
    <div style="width:40%;background:#DCE6EE"></div>
    <div style="width:10%;background:#F0E4CB"></div>
    <div style="width:50%;background:#F0DCBE"></div>
  </div>
  <div style="position:absolute;left:0;top:40px;font-size:12.5px;color:#838079">0</div>
  <div style="position:absolute;left:40%;top:40px;transform:translateX(-50%);font-size:12.5px;color:#838079">0,8</div>
  <div style="position:absolute;left:50%;top:40px;transform:translateX(-50%);font-size:12.5px;color:#838079">1,0</div>
  <div style="position:absolute;right:0;top:40px;font-size:12.5px;color:#838079">2,0</div>
  {dots}</div>
<div style="display:flex;margin-bottom:16px">{zcards}</div>
{bottom(t)}</div>'''


# ------------------------------------------------------------------ fig 4
def html_f4(t):
    def panel(header, stat, note, bg, fg, bars, bar_labels):
        # chart 330x150; y 0..400 kW -> 150px; x 8h -> 330px
        grid = ''
        for kw in (100, 200, 300, 400):
            y = 150 - kw / 400 * 150
            dash = ('border-top:2px dashed #BF7F3F;z-index:3' if kw == 200
                    else 'border-top:1px solid #E5E1D8')
            grid += f'<div style="position:absolute;left:34px;right:0;top:{y:.0f}px;{dash}"></div>'
            grid += (f'<div style="position:absolute;left:0;top:{y - 7:.0f}px;width:30px;'
                     f'font-size:11.5px;color:#838079;text-align:right">{kw}</div>')
        bar_html = ''
        for (start_h, dur_h, kwv, color, over) in bars:
            x = 34 + start_h / 8 * (330 - 34)
            w = dur_h / 8 * (330 - 34)
            h = kwv / 400 * 150
            style = (f'position:absolute;left:{x:.0f}px;top:{150 - h:.0f}px;width:{w:.0f}px;'
                     f'height:{h:.0f}px;background:{color};border-radius:4px 4px 0 0;z-index:2')
            if over:  # hatch the part above the 200 kW line
                style += (f';background:repeating-linear-gradient(45deg,'
                          f'{color} 0 7px, #A6632E 7px 9px)')
            bar_html += f'<div style="{style}"></div>'
        labels = ''
        for (txt, x, top) in bar_labels:
            labels += (f'<div style="position:absolute;left:{x:.0f}px;top:{top:.0f}px;'
                       f'font-size:12.5px;font-weight:700;color:#4E452B;'
                       f'white-space:nowrap">{esc(txt)}</div>')
        return f'''<div style="width:425px;background:#F7F5F0;border:1.5px solid #DCD6C8;border-radius:11px;
     padding:14px 16px">
  <div style="background:{bg};color:#fff;border-radius:8px;padding:6px 13px;font-size:15px;
       font-weight:700;margin-bottom:9px">{esc(header)}</div>
  <div style="font-size:14px;color:#3F3A2E;margin-bottom:6px;font-weight:700">{esc(stat)}</div>
  <div style="position:relative;width:364px;height:196px;margin:14px 0 24px 0">
    <div style="position:absolute;left:34px;top:0;bottom:32px;width:330px">
      <div style="position:relative;width:330px;height:150px">{grid}{bar_html}{labels}</div>
    </div>
    <div style="position:absolute;left:34px;top:150px;width:330px;border-top:1.5px solid #C9BFA9"></div>
    {''.join(f'<div style="position:absolute;left:{34 + i * 74:.0f}px;top:158px;'
             f'font-size:11.5px;color:#838079;transform:translateX(-50%)">{esc(tk)}</div>'
             for i, tk in enumerate(t['tl']))}
    <div style="position:absolute;left:0;top:76px;font-size:11.5px;color:#838079;
         writing-mode:vertical-rl;transform:rotate(180deg)">{esc(t['kw'])}</div>
    <div style="position:absolute;left:198px;top:48px;font-size:12px;color:#BF7F3F;
         font-weight:700;z-index:4">{esc(t['cap'])}</div>
    <div style="position:absolute;left:0;top:196px"></div>
  </div>
  <div style="font-size:13.5px;color:#6B6553;line-height:1.35">{esc(note)}</div>
</div>'''
    # value tags above the bars
    pa = panel(t['pa_h'], t['pa_stat'], t['pa_note'], '#BF7F3F', '#BF7F3F',
               [(0, 1.9, 360, '#BF7F3F', True)],
               [('360', 116, 2)])
    pb = panel(t['pb_h'], t['pb_stat'], t['pb_note'], '#325675', '#325675',
               [(0, 1.9, 180, '#325675', False), (1.9, 1.9, 180, '#325675', False)],
               [('180', 116, 96), ('180', 188, 96)])
    return f'''<div class="fig" style="width:930px">{head(t, sub=False)}
<div class="card" style="margin-bottom:16px;text-align:center;font-size:15px;
     color:#3F3A2E;line-height:1.4;padding:13px 18px">{esc(t['setup'])}</div>
<div style="display:flex;gap:16px">
  {pa}
  {pb}
</div>
<div style="margin-top:16px;background:#F0E4CB;border:1.3px solid #B99A6B;border-radius:11px;
     padding:13px 20px;text-align:center;font-size:15px;font-style:italic;color:#4E452B;
     line-height:1.45">{esc(t['quote'])}</div>
</div>'''


# ------------------------------------------------------------------ fig 5
def html_f5(t):
    # axis 60..150 km over 470px; label col 106 + track 470 = 576
    def px(v):
        return (v - 60) / 90 * 470

    def bar_row(top, label, sub, lo, hi, ticks, color, txtcol):
        seg_l, seg_w = px(lo), px(hi) - px(lo)
        tk = ''.join(
            f'<div style="position:absolute;left:{px(v) - .5:.0f}px;top:4px;bottom:4px;'
            f'width:1.5px;background:#fff;opacity:.85;z-index:2"></div>'
            f'<div style="position:absolute;left:{px(v):.0f}px;top:50%;transform:translate(-50%,-50%);'
            f'font-size:13px;font-weight:700;color:{txtcol};background:#ffffff;'
            f'border:1px solid #c9bfa9;border-radius:4px;padding:0 5px;margin-top:-17px">{esc(str(v))}</div>'
            for v in ticks)
        row = (f'<div style="position:absolute;left:0;top:{top}px;display:flex;align-items:center">'
               f'<div style="width:106px;text-align:right;padding-right:9px;font-size:12.5px;'
               f'color:#3F3A2E;line-height:1.26">{esc(label)}</div>'
               f'<div style="position:relative;width:470px;height:40px">'
               f'<div style="position:absolute;left:{seg_l:.0f}px;width:{seg_w:.0f}px;top:2px;'
               f'bottom:2px;background:{color};border-radius:6px;opacity:.92"></div>{tk}</div></div>')
        sub_d = (f'<div style="position:absolute;left:106px;top:{top + 46}px;width:470px;'
                 f'font-size:13px;color:#6B6553;line-height:1.32">{esc(sub)}</div>')
        return row + sub_d

    H = 214
    grid_layer = '<div style="position:absolute;left:106px;top:0;bottom:26px;width:470px">' + ''.join(
        f'<div style="position:absolute;left:{px(v):.0f}px;top:0;bottom:0;'
        f'border-left:1px solid #E5E1D8"></div>' for v in (80, 100, 120, 140)) + '</div>'
    axis_nums = ''.join(
        f'<div style="position:absolute;left:{106 + px(v):.0f}px;bottom:0;transform:translateX(-50%);'
        f'font-size:12px;color:#838079">{v}</div>' for v in (60, 80, 100, 120, 140))
    mk_x = 106 + px(96)
    marker = (f'<div style="position:absolute;left:{mk_x - 1:.0f}px;top:-2px;bottom:26px;'
              f'border-left:2px dashed #BF7F3F"></div>'
              f'<div style="position:absolute;left:{mk_x + 8:.0f}px;top:-14px;font-size:12.5px;'
              f'font-weight:700;color:#BF7F3F">{esc(t["marker"])}</div>')
    sb = bar_row(10, t['sum_bar'][0], t['sum_bar'][1], 100, 145, (145, 123, 100),
                 '#7FBF8F', '#2F6B49')
    wb = bar_row(108, t['win_bar'][0], t['win_bar'][1], 80, 107, (107, 89, 80),
                 '#BF7F7F', '#8F4A4A')
    chips = ''.join(f'<div style="background:#fff;border:1.2px solid #C9BFA9;border-radius:9px;'
                    f'padding:8px 13px;margin-bottom:10px;font-size:13.5px;color:#3F3A2E;'
                    f'line-height:1.35">{esc(c)}</div>' for c in t['chips'])
    cmap = {'sienna': '#BF7F3F', 'blue': '#325675', 'gold': '#8A6D3B', 'green': '#2F6B49'}
    rep = ''.join(
        f'<div style="background:#F7F5F0;border:1.3px solid #DCD6C8;border-left:5px solid {cmap[c]};'
        f'border-radius:9px;padding:10px 14px">'
        f'<div style="font-size:12.5px;font-weight:700;letter-spacing:1px;color:{cmap[c]};'
        f'margin-bottom:4px">{esc(h)}</div>'
        f'<div style="font-size:13.5px;color:#3F3A2E;line-height:1.32">{esc(d)}</div></div>'
        for (h, d, c) in t['report'])
    return f'''<div class="fig" style="width:730px">{head(t, sub=False)}
{chips}
<div style="background:#fff;border:1.4px solid #B99A6B;border-radius:11px;padding:20px 14px 14px;
     margin-bottom:16px">
  <div style="position:relative;width:576px;height:{H}px">{grid_layer}{marker}{sb}{wb}{axis_nums}</div>
  <div style="margin-left:106px;width:470px;text-align:center;font-size:12px;
       color:#838079;margin-top:4px">{esc(t['axis'])}</div>
</div>
<div style="font-size:15px;font-weight:700;color:#1D1C1A;margin-bottom:10px">{esc(t['report_h'])}</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-bottom:6px">{rep}</div>
{bottom(t)}</div>'''

# ------------------------------------------------------------------ fig 6
def html_f6(t):
    # plot 800x240 (190 bar zone + 44 bottom + labels); y 0..30%
    plot_w, zone_h, base = 800, 190, 44
    bars = ''
    for i, (lab, v) in enumerate(t['bars']):
        x = i * (plot_w / 8) + 16
        w = plot_w / 8 - 32
        cx = x + w / 2
        h = v / 30 * zone_h
        col = '#BF7F3F' if i >= 6 else '#325675'
        bars += (f'<div style="position:absolute;left:{x:.0f}px;bottom:{base}px;width:{w:.0f}px;'
                 f'height:{h:.0f}px;background:{col};border-radius:5px 5px 0 0"></div>'
                 f'<div style="position:absolute;left:{cx:.0f}px;bottom:{base + h + 6:.0f}px;'
                 f'transform:translateX(-50%);font-size:13.5px;font-weight:700;'
                 f'color:#4E452B;white-space:nowrap">{v}%</div>'
                 f'<div style="position:absolute;left:{cx:.0f}px;bottom:12px;'
                 f'transform:translateX(-50%);font-size:12.5px;color:#838079;'
                 f'white-space:nowrap">{esc(lab)}</div>')
    grid = ''.join(
        f'<div style="position:absolute;left:0;right:0;bottom:{base + v / 30 * zone_h:.0f}px;'
        f'border-top:1px solid #E5E1D8"></div>'
        f'<div style="position:absolute;left:-48px;bottom:{base + v / 30 * zone_h - 7:.0f}px;'
        f'width:40px;font-size:11.5px;color:#838079;text-align:right">{v}</div>'
        for v in (10, 20, 30))
    cmap = {'blue': '#325675', 'sienna': '#BF7F3F', 'gold': '#8A6D3B'}
    reads = ''.join(
        f'<div style="flex:1;margin-right:12px;background:#F7F5F0;border:1.4px solid #DCD6C8;'
        f'border-top:4px solid {cmap[c]};border-radius:10px;padding:11px 14px">'
        f'<div style="font-size:13.5px;font-weight:700;color:{cmap[c]};margin-bottom:4px">{esc(nm)}</div>'
        f'<div style="font-size:13.5px;font-style:italic;color:#3F3A2E;line-height:1.33">{esc(q)}</div></div>'
        for (nm, q, c) in t['readings'])
    mets = ''.join(
        f'<div style="flex:1;margin-right:11px;background:#fff;border:1.3px solid #C9BFA9;'
        f'border-radius:9px;padding:9px 12px;text-align:center">'
        f'<div style="font-size:14px;font-weight:700;color:#325675;margin-bottom:3px">{esc(v)}</div>'
        f'<div style="font-size:12.5px;color:#838079;line-height:1.28">{esc(d)}</div></div>'
        for (v, d) in t['metrics'])
    return f'''<div class="fig" style="width:930px">{head(t)}
<div style="position:relative;background:#fff;border:1.4px solid #B99A6B;border-radius:11px;
     padding:20px 12px 12px;margin-bottom:16px">
  <div style="position:absolute;left:12px;top:5px;font-size:12px;color:#838079">{esc(t['axisy'])}</div>
  <div style="position:relative;margin-left:60px;width:{plot_w}px;height:244px">
    <div style="position:absolute;left:0;right:0;bottom:{base}px;border-top:1.5px solid #C9BFA9"></div>
    {grid}{bars}</div>
  <div style="margin-left:60px;width:{plot_w}px;text-align:center;font-size:12.5px;
       color:#838079;margin-top:2px">{esc(t['axisx'])}</div>
  <div style="margin-left:60px;width:{plot_w}px;text-align:center;font-size:13.5px;
       font-weight:700;color:#BF7F3F;margin-top:8px">{esc(t['ann'])}</div>
</div>
<div style="display:flex;margin-bottom:16px">{reads}</div>
<div style="display:flex;margin-bottom:4px">{mets}</div>
{bottom(t)}</div>'''

BUILDERS = {'f1': html_f1, 'f2': html_f2, 'f3': html_f3, 'f4': html_f4,
            'f5': html_f5, 'f6': html_f6}


# ---------------------------------------------------------------- render
def render():
    from playwright.sync_api import sync_playwright
    os.makedirs(OUTDIR, exist_ok=True)
    made = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        for fg in ORDER:
            w = GEOM[fg][0]
            pg = b.new_page(viewport={'width': w + 40, 'height': 1400}, device_scale_factor=2)
            for lang in LANGS:
                t = FT.T[fg][lang]
                html = f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>' \
                       + BUILDERS[fg](t) + '</body></html>'
                pg.set_content(html)
                pg.wait_for_timeout(60)
                # overflow audit
                bad = pg.evaluate('''() => {
                  const out = [];
                  document.querySelectorAll('*').forEach(e => {
                    if (e.tagName==='HTML'||e.tagName==='BODY') return;
                    if (e.scrollWidth > e.clientWidth + 3 || e.scrollHeight > e.clientHeight + 3)
                      out.push(e.tagName + '.' + e.className + ' :: ' +
                               (e.textContent||'').trim().slice(0, 50));
                  }); return out; }''')
                path = os.path.join(OUTDIR, f'{fg}_{lang}.png')
                pg.locator('.fig').screenshot(path=path)
                made.append((fg, lang, path, bad))
            pg.close()
        b.close()
    ok = True
    for fg, lang, path, bad in made:
        sz = os.path.getsize(path)
        from PIL import Image
        iw, ih = Image.open(path).size
        flag = 'OK '
        if bad or sz < 20000 or iw < GEOM[fg][0] * 1.9:
            ok = False
            flag = 'BAD'
        print(f'{flag} {fg}_{lang}: {iw}x{ih}px {sz//1024}KB'
              + (f'  overflow={bad}' if bad else ''))
    print('render:', 'all good' if ok else 'PROBLEMS FOUND')
    return ok


# ---------------------------------------------------------------- patch
PREAMBLE = ('\\usepackage{graphicx}\n\\usepackage{xcolor}\n'
            '\\definecolor{figcap}{rgb}{0.514,0.502,0.475}\n')


def tex_block(fig, lang):
    n = ORDER.index(fig) + 1
    cap = FT.CAPTIONS[lang][n - 1]
    w = GEOM[fig][1]
    return (f'\n\\vspace{{12pt}}\n\\begin{{center}}\n'
            f'\\includegraphics[width={w}]{{fig_ie57/{fig}_{lang}.png}}\n'
            f'\\vspace{{4pt}}\n\n{{\\small\\color{{figcap}}{cap}\\par}}\n'
            f'\\end{{center}}\n\\vspace{{8pt}}\n')


def patch():
    n_ins = 0
    for lang in LANGS:
        src = os.path.join(WORK, f'ie57_{lang}.tex')
        txt = open(src, encoding='utf-8').read()
        lines = txt.split('\n')
        if 'fig_ie57 patch v1' not in txt:
            i = lines.index('\\begin{document}')
            lines[i:i] = ['% fig_ie57 patch v1', PREAMBLE.rstrip('\n')]
        out, done = [], {}
        for ln in lines:
            out.append(ln)
            for fg in ORDER:
                if fg in done:
                    continue
                a = ANCHOR[fg][lang]
                if a in ln and 'footnotesize' in ln:
                    hits = sum(1 for l in lines if a in l and 'footnotesize' in l)
                    assert hits == 1, f'{fg}/{lang}: anchor not unique ({hits}): {a}'
                    out.append(tex_block(fg, lang))
                    done[fg] = True
        missing = [fg for fg in ORDER if fg not in done]
        assert not missing, f'{lang}: anchors not found: {missing}'
        open(src, 'w', encoding='utf-8').write('\n'.join(out))
        n_ins += len(done)
        print(f'ie57_{lang}.tex: inserted {len(done)} figures')
    print(f'patch: {n_ins} figure blocks total (18 expected)')
    return n_ins == 18


# ---------------------------------------------------------------- build
def build():
    env = dict(os.environ)
    ok = True
    for lang in LANGS:
        r = subprocess.run(['tectonic', f'ie57_{lang}.tex'], cwd=WORK,
                           capture_output=True, text=True, env=env)
        pdf = os.path.join(WORK, f'ie57_{lang}.pdf')
        over = [l for l in (r.stdout + r.stderr).splitlines() if 'Overfull' in l]
        dst = os.path.join(REPO, 'study-guides', PDFNAME[lang])
        if os.path.exists(pdf):
            shutil.copy2(pdf, dst)
        sz = os.path.getsize(dst) if os.path.exists(dst) else 0
        print(f'ie57_{lang}: tectonic rc={r.returncode} pdf={sz//1024}KB '
              f'overfull={len(over)}')
        for l in over[:6]:
            print('   ', l.strip()[:120])
        ok = ok and r.returncode == 0 and sz > 100000
    return ok


# ---------------------------------------------------------------- verify
def verify():
    import pdfplumber
    ok = True
    for lang in LANGS:
        pdf = os.path.join(REPO, 'study-guides', PDFNAME[lang])
        r = subprocess.run(['pdfimages', '-list', pdf], capture_output=True, text=True)
        n_img = max(0, len([l for l in r.stdout.splitlines()[2:] if l.strip()]) - 0) \
            if False else len([l for l in r.stdout.splitlines()[2:] if l.strip()])
        pl = pdfplumber.open(pdf)
        n_pg = len(pl.pages)
        text = ''.join((p.extract_text() or '') for p in pl.pages)
        tofu = text.count('\ufffd')
        n_cap = len(re.findall(CAPRX[lang], text))
        # gap scan: largest vertical whitespace inside page bodies (y 60..780)
        gaps = []
        for p in pl.pages:
            if p.page_number <= 2:   # cover / TOC: sparse by design
                continue
            objs = [(w['top'], w['bottom']) for w in p.extract_words()]
            objs += [(im['top'], im['bottom']) for im in p.images]
            objs.sort()
            if not objs:
                continue
            cur = objs[0][1]
            for a, b2 in objs[1:]:
                if a - cur > 170 and a < 780:
                    gaps.append((p.page_number, round(a - cur)))
                cur = max(cur, b2)
        pl.close()
        flag = 'OK '
        if n_img != 6 or tofu or n_cap < 6 or gaps:
            ok = False
            flag = 'BAD'
        print(f'{flag} {PDFNAME[lang]}: pages={n_pg} images={n_img} captions={n_cap} '
              f'tofu={tofu} gaps={gaps[:4]}')
    print('verify:', 'all good' if ok else 'PROBLEMS')
    return ok


if __name__ == '__main__':
    what = sys.argv[1] if len(sys.argv) > 1 else 'all'
    if what in ('render', 'all'):
        assert render(), 'render failed'
    if what in ('patch', 'all'):
        assert patch(), 'patch failed'
    if what in ('build', 'all'):
        assert build(), 'build failed'
    if what in ('verify', 'all'):
        assert verify(), 'verify failed'
    print('done:', what)
