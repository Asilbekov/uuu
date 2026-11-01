"""intro.py — ColdOpen, TitleMap and the four WeekSting transition scenes."""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from manim import *
from video_lib import (
    NarratedScene, footer, kicker, roadmap, week_sting_group, heading,
    sublabel, PRIMARY, SECONDARY, ACCENT, WARN, GOLD, WEEK_COLORS, FONT,
)


class ColdOpen(NarratedScene):
    def build(self):
        self.add(footer())

        # ── seg 1: counting dots ─────────────────────────────────────
        d, t0 = self.seg_start()
        dots = VGroup(*[Dot(radius=0.14, color=SECONDARY) for _ in range(3)])
        dots.arrange(RIGHT, buff=1.0).move_to(UP * 1.4)
        nums = VGroup(*[
            Text(str(i + 1), font=FONT, font_size=40, color="#DDDDDD")
            .next_to(dot, UP, buff=0.25)
            for i, dot in enumerate(dots)
        ])
        q = Text("What are numbers, really?", font=FONT, font_size=40,
                 weight=BOLD, color=ACCENT).move_to(DOWN * 1.6)
        self.play(LaggedStart(*[GrowFromCenter(dt) for dt in dots],
                              lag_ratio=0.35), run_time=min(2.0, d * 0.45))
        self.play(LaggedStart(*[FadeIn(nt, shift=UP * 0.2) for nt in nums],
                              lag_ratio=0.25), run_time=1.0)
        self.play(Write(q), run_time=1.4)
        self.hold(t0, d)

        # ── seg 2: subtraction breaks N ──────────────────────────────
        d, t0 = self.seg_start()
        eq = MathTex(r"3 - 5 = \ ?", font_size=56, color=WHITE).move_to(UP * 0.9)
        stamp = Text("illegal in  ℕ", font=FONT, font_size=26, color=WARN)
        stamp.next_to(eq, DOWN, buff=0.4)
        zcard = MathTex(r"\mathbb{Z}", font_size=64, color=PRIMARY).move_to(DOWN * 1.5)
        fix = Text("negatives are born → integers", font=FONT, font_size=24,
                   color="#B8B8B8").next_to(zcard, DOWN, buff=0.3)
        self.play(FadeOut(dots, nums, q), run_time=0.5)
        self.play(Write(eq), run_time=0.9)
        self.play(Write(stamp), Flash(eq, color=WARN, flash_radius=1.4),
                  run_time=0.8)
        self.play(FadeIn(zcard, scale=0.6), Write(fix), run_time=1.0)
        self.hold(t0, d)

        # ── seg 3: division, sqrt break Q ────────────────────────────
        d, t0 = self.seg_start()
        eqs = VGroup(
            MathTex(r"\tfrac{1}{2} \notin \mathbb{Z}", font_size=44),
            MathTex(r"\sqrt{2} \notin \mathbb{Q}", font_size=44),
        ).arrange(DOWN, buff=0.5).move_to(UP * 0.9)
        qcard = VGroup(
            MathTex(r"\mathbb{Q}", font_size=64, color=SECONDARY),
            Text("fractions: rationals", font=FONT, font_size=24, color="#B8B8B8"),
        ).arrange(DOWN, buff=0.25).move_to(DOWN * 0.4)
        rcard = VGroup(
            MathTex(r"\mathbb{R}", font_size=64, color=ACCENT),
            Text("the line is filled: reals", font=FONT, font_size=24, color="#B8B8B8"),
        ).arrange(DOWN, buff=0.25).move_to(DOWN * 2.0)
        self.play(FadeOut(eq, stamp, zcard, fix), run_time=0.5)
        self.play(Write(eqs[0]), run_time=0.8)
        self.play(FadeIn(qcard, shift=UP * 0.3), run_time=0.8)
        self.play(Write(eqs[1]), run_time=0.8)
        self.play(FadeIn(rcard, shift=UP * 0.3), run_time=0.8)
        self.hold(t0, d)

        # ── seg 4: x²+1=0 → complex, new dimension ───────────────────
        d, t0 = self.seg_start()
        eqz = MathTex(r"x^2 + 1 = 0", font_size=60, color=WHITE).move_to(UP * 1.3)
        no = Text("no real solution", font=FONT, font_size=26, color=WARN)
        no.next_to(eqz, DOWN, buff=0.35)
        i_def = MathTex(r"i^2 = -1", font_size=54, color=PRIMARY).move_to(DOWN * 0.4)
        plane = NumberPlane(
            x_range=[-2, 2, 1], y_range=[-2, 2, 1], x_length=3.2, y_length=3.2,
            background_line_style={"stroke_color": "#2E4A5A", "stroke_width": 1.2,
                                   "stroke_opacity": 0.7},
            axis_config={"stroke_color": "#7A9AB0", "stroke_width": 2},
        ).move_to(DOWN * 0.5).shift(RIGHT * 3.2)
        zpt = Dot(plane.c2p(1.2, 1.0), radius=0.09, color=ACCENT)
        zlbl = MathTex(r"1+i", font_size=34, color=ACCENT)
        zlbl.next_to(zpt, UR, buff=0.12)
        ccard = MathTex(r"\mathbb{C}", font_size=64, color=GOLD).shift(LEFT * 3.2 + DOWN * 0.5)
        self.play(FadeOut(eqs, qcard, rcard), run_time=0.5)
        self.play(Write(eqz), run_time=0.9)
        self.play(Write(no), Circumscribe(eqz, color=WARN), run_time=0.9)
        self.play(Write(i_def), run_time=0.9)
        self.play(Create(plane), run_time=1.1)
        self.play(GrowFromCenter(zpt), FadeIn(zlbl),
                  FadeIn(ccard, scale=0.7), run_time=0.9)
        self.hold(t0, d)

        # ── seg 5: the promise ───────────────────────────────────────
        d, t0 = self.seg_start()
        promise = VGroup(
            MathTex(r"\lim_{x \to a} f(x) = L", font_size=52, color=SECONDARY),
            Text("the language of calculus — week 4", font=FONT, font_size=24,
                 color="#B8B8B8"),
        ).arrange(DOWN, buff=0.4).move_to(ORIGIN)
        self.play(FadeOut(VGroup(eqz, no, i_def, plane, zpt, zlbl, ccard)),
                  run_time=0.6)
        self.play(FadeIn(promise, shift=UP * 0.3), run_time=1.0)
        self.play(Circumscribe(promise[0], color=ACCENT), run_time=1.2)
        self.hold(t0, d)


class TitleMap(NarratedScene):
    def build(self):
        self.add(footer())

        # ── seg 1: title card ────────────────────────────────────────
        d, t0 = self.seg_start()
        title = VGroup(
            Text("Math I", font=FONT, font_size=72, weight=BOLD, color=PRIMARY),
            Text("Weeks 1–4 · Complete Review", font=FONT, font_size=34,
                 color="#E8E8E8"),
            Text("Number Systems  ·  Functions  ·  Limits", font=FONT,
                 font_size=22, color="#9A9A9A"),
        ).arrange(DOWN, buff=0.32).move_to(UP * 1.1)
        tag = Text("Study Guide Companion", font=FONT, font_size=19,
                   color="#7A7A7A").to_edge(DOWN, buff=0.5)
        ul = Underline(title[0], color=ACCENT, buff=0.12)
        self.play(FadeIn(title[0], scale=0.85), run_time=0.9)
        self.play(Create(ul), FadeIn(title[1]), run_time=0.8)
        self.play(FadeIn(title[2], shift=UP * 0.15), FadeIn(tag), run_time=0.8)
        self.hold(t0, d)

        # ── seg 2: roadmap build ─────────────────────────────────────
        d, t0 = self.seg_start()
        rm = roadmap(active=None).scale(0.9).move_to(DOWN * 1.1)
        formulas = VGroup(
            MathTex(r"\mathbb{N}\subset\mathbb{Z}\subset\mathbb{Q}\subset\mathbb{R}\subset\mathbb{C}",
                    font_size=24),
            MathTex(r"f \circ g", font_size=26),
            MathTex(r"\varepsilon\text{-}\delta", font_size=26),
            MathTex(r"\tfrac{0}{0}", font_size=28),
        )
        for i, f in enumerate(formulas):
            f.next_to(rm[0][i], UP, buff=0.35)
        self.play(LaggedStart(*[GrowFromCenter(n) for n in rm[0]],
                              lag_ratio=0.28), run_time=1.6)
        self.play(Create(rm[1]), run_time=0.9)
        self.play(LaggedStart(*[FadeIn(t) for t in rm[2]], lag_ratio=0.2),
                  run_time=1.0)
        self.play(LaggedStart(*[FadeIn(f, shift=DOWN * 0.15) for f in formulas],
                              lag_ratio=0.25), run_time=1.4)
        self.hold(t0, d)

        # ── seg 3: standalone note ───────────────────────────────────
        d, t0 = self.seg_start()
        note = sublabel("each week stands alone — jump to what you're revising",
                        color="#B8B8B8", font_size=23)
        note.to_edge(DOWN, buff=0.55)
        self.play(FadeIn(note, shift=UP * 0.2), run_time=0.7)
        self.play(Circumscribe(note, color="#666666"), run_time=1.1)
        self.hold(t0, d)

        # ── seg 4: handoff to week 1 ─────────────────────────────────
        d, t0 = self.seg_start()
        go = Text("Week one begins now.", font=FONT, font_size=28,
                  color=WEEK_COLORS[0]).move_to(ORIGIN)
        self.play(FadeOut(title, ul, note, rm, formulas, tag), run_time=0.6)
        self.play(FadeIn(go, scale=0.8), run_time=0.8)
        self.hold(t0, d)


class _StingBase(NarratedScene):
    WEEK = 1

    def build(self):
        self.add(footer())
        g = week_sting_group(self.WEEK)
        d, t0 = self.seg_start()
        self.play(FadeIn(g[0], scale=0.7), run_time=min(1.2, d * 0.3))
        self.play(FadeIn(g[1], shift=UP * 0.15), run_time=0.7)
        self.play(LaggedStart(*[FadeIn(m, shift=UP * 0.1) for m in g[2]],
                              lag_ratio=0.25), run_time=1.0)
        self.play(Circumscribe(g[0], color=WEEK_COLORS[self.WEEK - 1]),
                  run_time=1.0)
        self.hold(t0, d)


class WeekSting1(_StingBase):
    WEEK = 1


class WeekSting2(_StingBase):
    WEEK = 2


class WeekSting3(_StingBase):
    WEEK = 3


class WeekSting4(_StingBase):
    WEEK = 4
