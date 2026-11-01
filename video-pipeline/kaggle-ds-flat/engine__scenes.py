"""
CourseScene: one Manim scene per spec block.

Timing contract: each scene targets an exact runtime (audio duration + padding)
computed by build.py. Content animations are built with nominal run_times,
then scaled to fit the budget; leftover time becomes a static hold.
Every block type renders inside try/except with a graceful fallback card,
so one broken block can never kill a 30-minute video.
"""
import os, json, math
import numpy as np
from manim import *

from .palette import (BG_COLOR, PRIMARY, SECONDARY, ACCENT, WARN, TEAL, ORANGE,
                      PURPLE, GREY_SOFT, FONT, COLOR_MAP, bg)

MIN_RUN = 0.25


class CourseScene(Scene):
    """Base: subclass sets `idx` (block index). Reads manifest+spec from env vars."""
    idx = 0

    # ---- infrastructure -------------------------------------------------
    def setup(self):
        bg(self)
        base = os.environ["UUU_BUILD_DIR"]
        self.manifest = json.load(open(os.path.join(base, "manifest.json")))
        self.block = self.manifest["blocks"][self.idx]
        self.spec = json.load(open(self.manifest["spec_path"]))
        self.lang = self.spec.get("language", "en")
        self.target = float(self.block["target"])
        self.lead = 0.35
        self.tail = 0.65
        self.spent = 0.0
        self.plan = []          # list of callables(fn) -> total nominal time

    def play_t(self, *anims, rt=1.0, **kw):
        rt = max(rt, MIN_RUN)
        self.play(*anims, run_time=rt, **kw)
        self.spent += rt

    def wait_t(self, t):
        if t > 0.01:
            self.wait(t)
            self.spent += t

    def fit_and_hold(self):
        """Absorb remaining target time as a static hold."""
        rest = self.target - self.spent
        if rest > 0.05:
            self.wait(rest)
            self.spent += rest
        # if we overshot, nothing to do (manim already rendered longer chunk)

    # ---- entry ----------------------------------------------------------
    def construct(self):
        try:
            self.build()
        except Exception as e:
            import traceback
            tb = traceback.format_exc()[-600:]
            print(f"[block {self.idx}] FALLBACK: {e}\n{tb}", flush=True)
            try:   # durable marker so build.py can count degraded blocks
                base = os.environ.get("UUU_BUILD_DIR", "/tmp")
                with open(os.path.join(base, "scene_fallbacks.txt"), "a") as f:
                    f.write(f"{self.idx}\t{type(e).__name__}: {str(e)[:180]}\n")
            except Exception:
                pass
            self.clear()
            self.fallback_card(str(e))
        self.fit_and_hold()

    def fallback_card(self, err):
        head = (self.block.get("b", {}).get("heading")
                or self.block.get("b", {}).get("title")
                or self.spec.get("course_title", "—"))
        t = Text(str(head)[:70], font=FONT, font_size=40, color=WHITE)
        t.move_to(UP * 0.8)
        line = Line(LEFT * 4, RIGHT * 4, color=PRIMARY).next_to(t, DOWN, buff=0.5)
        msg = Text("· · ·", font=FONT, font_size=54, color=GREY_SOFT).next_to(line, DOWN, buff=0.8)
        self.add(t, line, msg)
        self.wait_t(2.0)

    # ---- block dispatch ---------------------------------------------------
    def build(self):
        b = self.block.get("b", {})
        t = b.get("type")
        if t == "title":      self.scene_title(b)
        elif t == "section":  self.scene_section(b)
        elif t == "concept":  self.scene_concept(b)
        elif t == "formula":  self.scene_formula(b)
        elif t == "example":  self.scene_example(b)
        elif t == "plot":     self.scene_plot(b)
        elif t == "table":    self.scene_table(b)
        elif t == "code":     self.scene_code(b)
        elif t == "timeline": self.scene_timeline(b)
        elif t == "recap":    self.scene_recap(b)
        elif t == "outro":    self.scene_outro(b)
        else: raise ValueError(f"unknown block type {t}")

    # ---- shared widgets ----------------------------------------------------
    def fit(self, m, max_w):
        """Shrink a mobject so it never exceeds max_w."""
        if m.width > max_w:
            m.scale_to_fit_width(max_w)
        return m

    def heading_bar(self, text, color=PRIMARY, font_size=44):
        h = Text(str(text), font=FONT, font_size=font_size, weight=BOLD, color=WHITE)
        self.fit(h, config.frame_width - 0.9)
        h.to_edge(UP, buff=0.45)
        bar = Line(ORIGIN, RIGHT * (h.width + 0.4), color=color, stroke_width=5)
        bar.next_to(h, DOWN, buff=0.14).align_to(h, LEFT).shift(LEFT * 0.2)
        self.play_t(Write(h), rt=1.0)
        self.play_t(Create(bar), rt=0.5)
        return VGroup(h, bar)

    def chapter_tag(self):
        """Small 'Ch k/N' tag in the top-right corner — quiet professionalism."""
        ch = self.block.get("chapter", 0)
        nch = self.manifest.get("n_chapters", 0)
        if not ch or not nch or ch > nch:
            return None
        tag = Text(f"Ch {ch}/{nch}", font=FONT, font_size=22, color=GREY_SOFT)
        tag.to_corner(UR, buff=0.3)
        self.add(tag)
        return tag

    def safe_fn(self, expr):
        """Compile a whitelisted numpy expression for plotting."""
        allowed = {
            "np": np, "sin": np.sin, "cos": np.cos, "tan": np.tan, "exp": np.exp,
            "log": np.log, "sqrt": np.sqrt, "pi": np.pi, "e": math.e,
            "abs": abs, "Abs": np.abs,
        }
        return eval(f"lambda x: {expr}", {"__builtins__": {}}, allowed)

    def make_axes(self, x_range, y_range, x_length=9.5, y_length=5.2):
        ax = Axes(
            x_range=x_range, y_range=y_range, x_length=x_length, y_length=y_length,
            axis_config={"color": GREY_SOFT, "stroke_width": 2.5,
                         "include_ticks": True, "tip_width": 0.14, "tip_height": 0.14},
        )
        return ax

    # ---- scene: title --------------------------------------------------------
    def scene_title(self, b):
        spec = self.spec
        # soft geometric motif behind the title (3b1b vibe)
        circ = Circle(radius=2.9, color=PRIMARY, stroke_width=2).shift(UP * 0.25)
        sq = Square(side_length=3.6, color=TEAL, stroke_width=2).shift(UP * 0.25).rotate(45 * DEGREES)
        self.play_t(Create(circ), rt=1.6)
        self.play_t(DrawBorderThenFill(sq.set_fill(opacity=0.0)), rt=1.2)

        course = Text(str(spec.get("course_title", "")), font=FONT, font_size=46,
                      weight=BOLD, color=WHITE, line_spacing=0.9)
        self.fit(course, 10.8)
        course.move_to(UP * 1.05)
        self.play_t(Write(course), rt=2.0)

        test = Text(str(spec.get("test_title", "")), font=FONT, font_size=34, color=ACCENT)
        self.fit(test, 10.8)
        test.next_to(course, DOWN, buff=0.5)
        self.play_t(FadeIn(test, shift=UP * 0.3), rt=1.0)

        sub = str(spec.get("subtitle", ""))
        if sub:
            s = Text(sub, font=FONT, font_size=26, color=GREY_SOFT)
            self.fit(s, 11.2)
            s.next_to(test, DOWN, buff=0.45)
            self.play_t(FadeIn(s), rt=0.9)
        self.wait_t(0.6)

    # ---- scene: section --------------------------------------------------------
    def scene_section(self, b):
        num = b.get("num", 1)
        n = str(num).zfill(2)
        big = Text(n, font=FONT, font_size=150, weight=BOLD, color=PRIMARY)
        big.move_to(UP * 0.75 + LEFT * 3.4)
        ttl = Text(str(b.get("title", "")), font=FONT, font_size=52, weight=BOLD, color=WHITE)
        avail_w = config.frame_width / 2 - (big.get_right()[0] + 0.8) - 0.35
        if ttl.width > avail_w:
            ttl.scale_to_fit_width(avail_w)
        ttl.next_to(big, RIGHT, buff=0.8).align_to(big, UP).shift(DOWN * 0.35)
        sub_txt = str(b.get("subtitle", "")).strip()
        if sub_txt:
            sub = Text(sub_txt, font=FONT, font_size=28, color=ACCENT, line_spacing=0.8)
            self.fit(sub, config.frame_width - 1.2)
            sub.next_to(ttl, DOWN, buff=0.55).align_to(ttl, LEFT)
            rule = Line(ORIGIN, RIGHT * max(4.0, ttl.width + 0.6), color=TEAL, stroke_width=4)
            rule.next_to(sub, DOWN, buff=0.7).align_to(ttl, LEFT)
        else:
            rule = Line(ORIGIN, RIGHT * max(4.0, ttl.width + 0.6), color=TEAL, stroke_width=4)
            rule.next_to(ttl, DOWN, buff=1.0).align_to(ttl, LEFT)

        self.play_t(FadeIn(big, scale=0.6), rt=0.9)
        self.play_t(Write(ttl), rt=1.3)
        if sub_txt:
            self.play_t(FadeIn(sub, shift=UP * 0.25), rt=0.8)
        self.play_t(Create(rule), rt=0.7)
        self.wait_t(0.7)

    # ---- scene: concept --------------------------------------------------------
    def scene_concept(self, b):
        self.chapter_tag()
        hb = self.heading_bar(b.get("heading", ""))
        content_top = hb.get_bottom()[1] - 0.25

        bullets = [str(x) for x in (b.get("bullets") or [])][:5]
        bgroup = VGroup()
        for i, txt in enumerate(bullets):
            dot = Circle(radius=0.065, color=TEAL, fill_opacity=1.0).set_fill(TEAL, 1)
            line = Text(txt, font=FONT, font_size=30, color=WHITE, line_spacing=0.8)
            self.fit(line, config.frame_width - 1.6)
            row = VGroup(dot, line).arrange(RIGHT, buff=0.28)
            bgroup.add(row)
        bgroup.arrange(DOWN, aligned_edge=LEFT, buff=0.34)
        formula = b.get("formula")
        plot = b.get("plot")

        if formula and plot:
            bgroup.next_to(ORIGIN, UP, buff=2.0).to_edge(LEFT, buff=0.6)
        elif formula:
            bgroup.move_to(UP * 0.7).to_edge(LEFT, buff=0.7)
        else:
            bgroup.move_to(UP * 0.4)

        self.play_t(LaggedStart(*[FadeIn(r, shift=RIGHT * 0.4) for r in bgroup],
                                lag_ratio=0.35), rt=max(1.2, 0.45 * len(bgroup)))

        if formula:
            cap = b.get("formula_caption")
            f = MathTex(str(formula), font_size=56)
            self.fit(f, 10.6)
            fbox = SurroundingRectangle(f, color=SECONDARY, corner_radius=0.12, buff=0.28)
            fgrp = VGroup(f, fbox)
            if plot:
                fgrp.move_to(DOWN * 1.55)
            else:
                fgrp.next_to(bgroup, DOWN, buff=0.75)
            self.play_t(Write(f), rt=1.6)
            self.play_t(Create(fbox), rt=0.8)
            if cap:
                c = Text(str(cap), font=FONT, font_size=24, color=GREY_SOFT)
                self.fit(c, 11.5)
                c.next_to(fgrp, DOWN, buff=0.3)
                self.play_t(FadeIn(c), rt=0.7)
            self.wait_t(0.4)

        if plot:
            self.draw_plot(plot, heading=b.get("heading", ""), compact=True)

        self.wait_t(0.3)

    # ---- scene: formula deep-dive ------------------------------------------------
    def scene_formula(self, b):
        self.chapter_tag()
        self.heading_bar(b.get("heading", ""))
        tex = MathTex(str(b.get("tex", "")), font_size=64)
        self.fit(tex, 10.8)
        box = SurroundingRectangle(tex, color=PRIMARY, corner_radius=0.14, buff=0.35)
        tex.move_to(UP * 0.8)
        box.move_to(tex)
        self.play_t(Write(tex), rt=2.0)
        self.play_t(Create(box), rt=0.8)
        self.wait_t(0.5)

        parts = b.get("parts", [])[:5]
        notes = VGroup()
        for i, p in enumerate(parts):
            col = COLOR_MAP.get(p.get("color", "yellow"), ACCENT)
            tex.set_color_by_tex(str(p.get("substr", "")), col)
            note = Text(f"“{p.get('substr', '')}” — {p.get('note', '')}"[:80],
                        font=FONT, font_size=26, color=col, line_spacing=0.75)
            self.fit(note, config.frame_width - 1.4)
            notes.add(note)
        notes.arrange(DOWN, aligned_edge=LEFT, buff=0.3).to_edge(DOWN, buff=0.5).to_edge(LEFT, buff=0.6)
        if notes.height > 3.2:
            notes.scale_to_fit_height(3.2)
        for note in notes:
            self.play_t(FadeIn(note, shift=RIGHT * 0.35), rt=0.8)
        if parts:
            self.play_t(Circumscribe(tex, color=ACCENT, buff=0.18), rt=1.1)
        self.wait_t(0.4)

    # ---- scene: example ------------------------------------------------------------
    def scene_example(self, b):
        self.chapter_tag()
        self.heading_bar(b.get("heading", ""), color=SECONDARY)
        prob = b.get("problem")
        rows = VGroup()
        if prob:
            is_tex = any(c in str(prob) for c in "\\^{}") and "$" not in str(prob)
            if is_tex:
                pm = MathTex(str(prob), font_size=44)
                self.fit(pm, 11.0)
            else:
                pm = Text(str(prob), font=FONT, font_size=30, line_spacing=0.8)
                self.fit(pm, 11.6)
            pbox = SurroundingRectangle(pm, color=PRIMARY, corner_radius=0.1, buff=0.25)
            pgrp = VGroup(pm, pbox).to_edge(UP, buff=1.35)
            rows.add(pgrp)

        steps = b.get("steps", [])[:7]
        step_mobs = VGroup()
        for s in steps:
            if s.get("tex"):
                m = MathTex(str(s["tex"]), font_size=40)
                self.fit(m, config.frame_width - 1.8)
            else:
                m = Text(str(s.get("text", "")), font=FONT, font_size=28, line_spacing=0.75)
                self.fit(m, config.frame_width - 1.8)
            step_mobs.add(m)
        avail = (config.frame_height - 1.55) - (rows.height + 0.5 if rows else 0) - 0.4
        if step_mobs.height > avail:
            step_mobs.scale_to_fit_height(avail)
        stack = VGroup(*step_mobs).arrange(DOWN, aligned_edge=LEFT, buff=0.28)
        stack.to_edge(LEFT, buff=0.7)
        if rows:
            stack.next_to(rows, DOWN, buff=0.45).to_edge(LEFT, buff=0.7)

        if prob:
            self.play_t(FadeIn(rows, shift=DOWN * 0.2), rt=0.9)
        for i, m in enumerate(step_mobs):
            hl = steps[i].get("highlight")
            self.play_t(Write(m), rt=max(0.8, min(1.8, 0.12 * len(str(m))) ))
            if hl:
                bx = SurroundingRectangle(m, color=ACCENT, corner_radius=0.1, buff=0.14)
                self.play_t(Create(bx), rt=0.6)
        res = b.get("result")
        if res:
            r = Text(f"→ {res}", font=FONT, font_size=34, weight=BOLD, color=SECONDARY)
            self.fit(r, 6.0)
            r.to_corner(DR, buff=0.55)
            self.play_t(FadeIn(r, scale=0.7), rt=0.8)
            self.play_t(Circumscribe(r, color=SECONDARY), rt=0.9)
        self.wait_t(0.35)

    # ---- scene: plot ---------------------------------------------------------------
    def draw_plot(self, plot, heading="", compact=False):
        fn = plot.get("fn")
        if not fn:
            return
        x_range = plot.get("x_range", [-5, 5])
        y_range = plot.get("y_range", [-3, 3])
        ax = self.make_axes(x_range, y_range,
                            x_length=8.6 if compact else 10.5,
                            y_length=3.6 if compact else 5.6)
        if compact:
            ax.to_edge(DOWN, buff=0.25)
        else:
            ax.move_to(DOWN * 0.45)
        f = self.safe_fn(fn)
        graph = ax.plot(f, x_range=x_range, color=COLOR_MAP.get(plot.get("color", "yellow"), ACCENT),
                        stroke_width=5)
        self.play_t(Create(ax), rt=1.1)
        lbl = plot.get("tex")
        if lbl:
            lm = MathTex(str(lbl), font_size=32)
            lm.next_to(ax, UP, buff=0.18).to_edge(RIGHT, buff=0.4)
            self.play_t(Write(lm), rt=0.8)
        self.play_t(Create(graph), rt=2.0)
        vline = plot.get("vline")
        if vline is not None:
            vl = DashedLine(ax.c2p(vline, y_range[0]), ax.c2p(vline, y_range[1]),
                            color=WARN, stroke_width=3)
            self.play_t(Create(vl), rt=0.8)
        pt = plot.get("point")
        if pt:
            d = Dot(ax.c2p(pt[0], pt[1]), color=SECONDARY, radius=0.11)
            plabel = Text(str(plot.get("point_label", "")), font=FONT, font_size=26, color=SECONDARY)
            plabel.next_to(d, UR, buff=0.15)
            self.play_t(FadeIn(d, scale=2.0), rt=0.6)
            self.play_t(Write(plabel), rt=0.6)
        self.wait_t(0.35)

    def scene_plot(self, b):
        self.chapter_tag()
        self.heading_bar(b.get("heading", ""))
        fns = b.get("functions", [])[:3]
        x_range = b.get("x_range", [-5, 5])
        y_range = b.get("y_range", [-3, 3])
        ax = self.make_axes(x_range, y_range)
        ax.move_to(DOWN * 0.35)
        self.play_t(Create(ax), rt=1.2)
        for i, fs in enumerate(fns):
            f = self.safe_fn(fs["fn"])
            col = COLOR_MAP.get(fs.get("color", "yellow"), ACCENT)
            g = ax.plot(f, x_range=x_range, color=col, stroke_width=5)
            lbl = MathTex(str(fs.get("tex", "")), font_size=30)
            lbl.next_to(ax, UP, buff=0.2).shift(RIGHT * (2.6 - i * 2.2))
            self.play_t(Create(g), rt=1.8)
            self.play_t(Write(lbl), rt=0.7)
        vline = b.get("vline")
        if vline is not None:
            vl = DashedLine(ax.c2p(vline, y_range[0]), ax.c2p(vline, y_range[1]),
                            color=WARN, stroke_width=3)
            self.play_t(Create(vl), rt=0.9)
        self.wait_t(0.4)

    # ---- scene: table -----------------------------------------------------------------
    def scene_table(self, b):
        self.chapter_tag()
        self.heading_bar(b.get("heading", ""))
        cols = [str(c) for c in b.get("columns", [])][:4]
        rows = [[str(c) for c in r] for r in b.get("rows", [])][:6]
        if not cols or not rows:
            raise ValueError("empty table")
        ncol = len(cols)
        rows_fixed = [(r + [""] * ncol)[:ncol] for r in rows]
        try:
            tbl = Table(
                [cols] + rows_fixed,
                include_outer_lines=True,
                element_to_align=ORIGIN,
                top_left_entry=Text("", font=FONT, font_size=1),
                arrange_in_grid_kwargs={"cell_alignment": LEFT},
            )
        except TypeError:
            tbl = Table([cols] + rows_fixed, include_outer_lines=True)
        tbl.scale_to_fit_width(min(11.5, config.frame_width - 1.0))
        if tbl.height > 5.4:
            tbl.scale_to_fit_height(5.4)
        tbl.move_to(DOWN * 0.35)
        for j in range(ncol):
            try:
                tbl.get_entries((0, j + 1)).set_color(BLACK).set_fill(
                    COLOR_MAP.get("blue", PRIMARY), 0.9).set_background_stroke(width=0)
            except Exception:
                pass
        try:
            header = VGroup(*[tbl.get_entries((0, j + 1)) for j in range(ncol)])
            header_text = VGroup(*[Text(c, font=FONT, font_size=30, weight=BOLD, color=WHITE)
                                   for c in cols])
            for j, ht in enumerate(header_text):
                ht.move_to(header[j])
            body = VGroup(*[tbl.get_entries((i + 1, j + 1)) for i in range(len(rows_fixed))
                            for j in range(ncol)])
        except Exception:
            body = tbl
        self.play_t(DrawBorderThenFill(tbl), rt=1.4)
        self.play_t(LaggedStart(*[Indicate(VGroup(tbl.get_entries((i + 1, j + 1))),
                                           color=ACCENT, scale_factor=1.03)
                                  for i in range(len(rows_fixed)) for j in range(ncol)],
                                lag_ratio=0.18), rt=2.2)
        self.wait_t(0.4)

    def mono_font(self):
        """First available monospace font (DejaVu Sans Mono on Debian/Ubuntu)."""
        import subprocess as _sp
        try:
            r = _sp.run(["fc-list", ":mono", "family"], capture_output=True, text=True, timeout=10)
            fams = {l.split(",")[0].strip() for l in r.stdout.splitlines() if l.strip()}
            for cand in ("DejaVu Sans Mono", "Liberation Mono", "FreeMono"):
                if cand in fams:
                    return cand
        except Exception:
            pass
        return FONT

    # ---- scene: code -------------------------------------------------------------------
    def scene_code(self, b):
        self.chapter_tag()
        self.heading_bar(b.get("heading", ""), color=ORANGE)
        code = str(b.get("code", ""))
        lines = code.split("\n")[:12]
        hl = set(b.get("highlight", []) or [])
        panel = RoundedRectangle(corner_radius=0.22, width=min(12.2, config.frame_width - 0.8),
                                 height=min(6.6, 0.62 * len(lines) + 0.8),
                                 stroke_color="#3C3F41", fill_color="#252526", fill_opacity=1.0,
                                 stroke_width=2)
        panel.move_to(DOWN * 0.3)
        win = VGroup(*[Circle(radius=0.07, fill_opacity=1, stroke_width=0)
                       .set_fill(c, 1) for c in ["#FF5F56", "#FFBD2E", "#27C93F"]])
        win.arrange(RIGHT, buff=0.12).move_to(panel.get_corner(UL) + DR * 0.28)
        self.play_t(DrawBorderThenFill(panel), rt=0.9)
        self.play_t(FadeIn(win), rt=0.4)

        txts_data = []  # (orig_line_no, Text) — empty lines become gaps, not mobjects
        mono = self.mono_font()
        for i, ln in enumerate(lines):
            if not ln.strip():
                txts_data.append((i + 1, None))
                continue
            col = ACCENT if (i + 1) in hl else "#E8E8E8"
            t = Text(ln, font=mono, font_size=26, color=col)
            self.fit(t, panel.width - 1.1)
            txts_data.append((i + 1, t))
        vis = [t for _, t in txts_data if t is not None]
        total_h = sum(t.height for t in vis) + 0.16 * (len(vis) - 1) + 0.30 * (
            sum(1 for _, t in txts_data if t is None))
        if total_h > panel.height - 0.7:
            k = (panel.height - 0.7) / total_h
            for t in vis:
                t.scale(k)
            total_h = sum(t.height for t in vis) + 0.16 * (len(vis) - 1) + 0.30 * (
                sum(1 for _, t in txts_data if t is None))
        left_x = panel.get_left()[0] + 0.55
        cur_y = panel.get_top()[1] - 0.4
        for _, t in txts_data:
            if t is None:
                cur_y -= 0.30
                continue
            t.move_to(np.array([left_x + t.width / 2, cur_y - t.height / 2, 0]))
            cur_y -= t.height + 0.16
        for i, t in txts_data:
            if t is None:
                continue
            self.play_t(FadeIn(t, shift=RIGHT * 0.15), rt=0.42)
            if i in hl:
                self.play_t(Indicate(t, color=ACCENT), rt=0.45)
        self.wait_t(0.4)

    # ---- scene: timeline ------------------------------------------------------------------
    def scene_timeline(self, b):
        self.chapter_tag()
        self.heading_bar(b.get("heading", ""), color=PURPLE)
        events = b.get("events", [])[:7]
        if not events:
            raise ValueError("no events")
        line = Line(LEFT * 5.8, RIGHT * 5.8, color=GREY_SOFT, stroke_width=4)
        line.move_to(DOWN * 0.1)
        self.play_t(Create(line), rt=1.2)
        n = len(events)
        xs = np.linspace(-5.2, 5.2, n)
        for i, ev in enumerate(events):
            d = Dot(line.point_from_proportion((xs[i] + 5.8) / 11.6), radius=0.09, color=ACCENT)
            year = Text(str(ev.get("year", "")), font=FONT, font_size=26, weight=BOLD, color=PRIMARY)
            text = Text(str(ev.get("text", ""))[:44], font=FONT, font_size=22, color=WHITE,
                        line_spacing=0.7)
            self.fit(text, 2.75)
            grp = VGroup(year, text).arrange(DOWN, buff=0.12)
            side = UP if i % 2 == 0 else DOWN
            grp.next_to(d, side, buff=0.22)
            self.play_t(FadeIn(d, scale=1.8), Write(year), rt=0.7)
            self.play_t(FadeIn(text, shift=side * 0.15), rt=0.6)
        self.wait_t(0.4)

    # ---- scene: recap -------------------------------------------------------------------------
    def scene_recap(self, b):
        self.chapter_tag()
        self.heading_bar(b.get("heading", self.labels().get("recap", "Recap")), color=SECONDARY)
        items = [str(x) for x in (b.get("items") or [])][:6]
        grp = VGroup()
        for it in items:
            check = Text("✓", font=FONT, font_size=30, color=SECONDARY, weight=BOLD)
            line = Text(it, font=FONT, font_size=30, color=WHITE, line_spacing=0.8)
            self.fit(line, config.frame_width - 2.0)
            grp.add(VGroup(check, line).arrange(RIGHT, buff=0.3))
        grp.arrange(DOWN, aligned_edge=LEFT, buff=0.42).move_to(UP * 0.35)
        if grp.height > 5.2:
            grp.scale_to_fit_height(5.2)
        self.play_t(LaggedStart(*[FadeIn(r, shift=RIGHT * 0.4) for r in grp], lag_ratio=0.4),
                    rt=max(1.6, 0.55 * len(grp)))
        box = SurroundingRectangle(grp, color=SECONDARY, corner_radius=0.15, buff=0.4)
        self.play_t(Create(box), rt=0.9)
        self.wait_t(0.4)

    # ---- scene: outro ----------------------------------------------------------------------------
    def scene_outro(self, b):
        msg = str(b.get("message", self.spec.get("outro_message", "")))
        ring = Circle(radius=2.2, color=SECONDARY, stroke_width=3)
        inner = Circle(radius=2.05, color=TEAL, stroke_width=2)
        m = Text(msg, font=FONT, font_size=34, weight=BOLD, color=WHITE, line_spacing=0.9)
        self.fit(m, 10.5)
        m.move_to(ORIGIN)
        thanks = Text(self.labels().get("thanks", "Thanks for watching"),
                      font=FONT, font_size=26, color=GREY_SOFT)
        thanks.next_to(ring, DOWN, buff=0.6)
        self.play_t(Create(ring), Create(inner), rt=1.4)
        self.play_t(Write(m), rt=2.0)
        if m.width > ring.width * 1.7:
            m.scale_to_fit_width(ring.width * 1.7)
        self.play_t(FadeIn(thanks), rt=0.9)
        self.wait_t(0.5)

    # ---- tiny i18n labels ---------------------------------------------------------------------------
    def labels(self):
        if self.lang == "ru":
            return {"recap": "Итоги", "thanks": "Спасибо за просмотр"}
        if self.lang == "uz":
            return {"recap": "Xulosa", "thanks": "Kuzatganingiz uchun rahmat"}
        return {"recap": "Recap", "thanks": "Thanks for watching"}
