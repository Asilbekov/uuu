#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Shared style + renderer for the ITE Weeks 5-7 TEST diagrams.
Visual language: exact match of public/ite-diagrams/t1..t12 (commit 5935d5e) —
warm off-white canvas, orange kicker, charcoal title, white cards with thin
warm borders, colored pill headers, orange arrows, centered grey footer.
Rendered with Playwright (Chromium) at deviceScaleFactor=2 -> 1520px wide PNGs.
"""

BASE_CSS = """
* { margin:0; padding:0; box-sizing:border-box; }
body {
  font-family:'Liberation Sans','Helvetica Neue',Arial,sans-serif;
  background:#faf7f5; color:#211d1a;
  width:760px; padding:32px 34px 24px;
  -webkit-font-smoothing:antialiased;
}
.kicker {
  text-align:center; color:#fe5933; font-weight:800; font-size:12.5px;
  letter-spacing:.22em; text-transform:uppercase; margin-bottom:10px;
}
.title { text-align:center; font-weight:800; font-size:29px; line-height:1.14; letter-spacing:-.01em; }
.subtitle { text-align:center; color:#6d6660; font-size:14px; line-height:1.45; margin:9px auto 0; max-width:640px; }
.head { margin-bottom:20px; }
.body { margin-top:2px; }
.card {
  background:#fff; border:1.5px solid #e9e2da; border-radius:14px;
  padding:14px 16px;
}
.pill {
  display:inline-block; font-size:10.5px; font-weight:800; letter-spacing:.09em;
  text-transform:uppercase; padding:3px 10px 3.5px; border-radius:999px;
}
.divider { border:none; border-top:1px solid #eee7df; margin:10px 0; }
.muted { color:#6d6660; }
.small { font-size:12.5px; line-height:1.5; }
.foot {
  border-top:1px solid #e9e2da; margin-top:18px; padding-top:11px;
  text-align:center; color:#8a8178; font-size:12.5px; line-height:1.5;
}
.foot b { color:#5d564e; }
.arrow-r { display:flex; align-items:center; justify-content:center; color:#fe5933; }
.tag { font-size:10px; font-weight:800; letter-spacing:.08em; text-transform:uppercase; }

/* palette accents */
.ac-orange  { color:#fe5933; }
.ac-teal    { color:#178a7b; }
.ac-blue    { color:#2f6fdb; }
.ac-gold    { color:#b97d10; }
.ac-charcoal{ color:#2c2c2c; }
.bg-orange  { background:#fdeae4; }
.bg-teal    { background:#e2f3ef; }
.bg-blue    { background:#e7effc; }
.bg-gold    { background:#faf0d8; }
.bg-blush   { background:#fdebe3; }
"""

SHELL = """<!DOCTYPE html><html><head><meta charset="utf-8">
<style>{css}{extra}</style></head><body>{body}</body></html>"""


def render_all(jobs, outdir):
    """jobs: list of (filename, html). Screenshot each body at 2x."""
    from playwright.sync_api import sync_playwright
    import os
    os.makedirs(outdir, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 760, "height": 600},
                                device_scale_factor=2)
        for fname, html in jobs:
            import tempfile
            with tempfile.NamedTemporaryFile("w", suffix=".html",
                                             delete=False, dir="/tmp") as f:
                f.write(html)
                path = "file://" + f.name
            page.goto(path)
            page.wait_for_timeout(120)
            el = page.query_selector("body")
            out = os.path.join(outdir, fname)
            el.screenshot(path=out)
            print("rendered", out)
        browser.close()
