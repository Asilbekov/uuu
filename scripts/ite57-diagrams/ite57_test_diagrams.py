#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Render the ITE Weeks 5-7 TEST diagrams (15 topic diagrams + 4 option cards)
into uuu/public/ite-diagrams/ — same style as the Weeks 1-4 set (t1..t12).
Run: python3 ite57_test_diagrams.py
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from ite57_diag_style import render_all
import ite57_diag_p1 as p1
import ite57_diag_p2 as p2

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "public", "ite-diagrams")

JOBS = [
    ("t13_modeltypes.png", p1.T13),
    ("t14_anatomy.png", p1.T14),
    ("t15_assumptions.png", p1.T15),
    ("t16_template.png", p1.T16),
    ("t17_range.png", p1.T17),
    ("t18_solar.png", p1.T18),
    ("t19_utilisation.png", p1.T19),
    ("t20_peak.png", p1.T20),
    ("t21_kwh.png", p2.T21),
    ("t22_charging.png", p2.T22),
    ("t23_line.png", p2.T23),
    ("t24_om.png", p2.T24),
    ("t25_dataproblems.png", p2.T25),
    ("t26_waitdist.png", p2.T26),
    ("t27_report.png", p2.T27),
] + p2.DP_CARDS

if __name__ == "__main__":
    render_all(JOBS, OUT)
    print("done:", len(JOBS), "files ->", OUT)
