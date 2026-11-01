"""
video_lib.py — shared framework for the Math I Weeks 1-4 course video.

Design system: Classic 3b1b (dark #1C1C1C, blue/green/yellow accents).
Timing model: every NarratedScene is driven by per-segment narration
durations loaded from timings.json (produced by TTS + build_timings.py).
A scene ends EXACTLY at sum(segment_durations) + TAIL_HOLD, which lets the
audio track and subtitle track align perfectly after concatenation.

Conventions for scene authors (WEEKS 2-4 subagents follow the same):
  * subclass NarratedScene, implement build() — NOT construct()
  * one narration segment = one beat() call (or seg() for manual pacing)
  * never use self.clear(); fade out only mobjects you track
  * math in MathTex(r"..."), labels in Text(..., font="DejaVu Sans")
  * color code: given/input BLUE, result GREEN, emphasis YELLOW, error RED
"""
from manim import *
import json
import os

# ── palette (Classic 3b1b) ────────────────────────────────────────────
BG = "#1C1C1C"
PRIMARY = "#58C4DD"    # blue — main objects, inputs
SECONDARY = "#83C167"  # green — results, outputs
ACCENT = "#FFFF00"     # yellow — highlights
WARN = "#FF6666"       # red — errors, excluded, DNE
GOLD = "#FFD700"       # gold — finale emphasis
WEEK_COLORS = ["#58C4DD", "#FF6C6C", "#83C167", "#FFD700"]
WEEK_NAMES = ["Numbers", "Functions", "Limits", "Limits II"]
WEEK_SUBS = [
    "Number systems, notation, complex numbers",
    "Classes, domain, symmetry, composition, inverse",
    "Intuition, one-sided, asymptotes, epsilon-delta",
    "Limit laws, indeterminate forms, squeeze, Landau",
]
FONT = "DejaVu Sans"

_HERE = os.path.dirname(os.path.abspath(__file__))
TIMINGS_PATH = os.path.join(_HERE, "timings.json")
_DEFAULT_SEG = 8.0   # fallback duration when a segment has no audio yet
TAIL_HOLD = 0.8      # extra hold at the very end of each scene


def load_timings():
    if os.path.exists(TIMINGS_PATH):
        with open(TIMINGS_PATH) as f:
            return json.load(f)
    return {}


# ── base scene with narration-synced playback ─────────────────────────
class NarratedScene(Scene):
    """Scene whose duration is exactly sum(segments) + TAIL_HOLD.

    Segments come from timings.json[ClassName] = [d0, d1, ...] (seconds,
    audio length + inter-segment gap). build() consumes them via beat()/seg().
    """

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.camera.background_color = BG
        t = load_timings()
        self._segs = [float(x) for x in t.get(type(self).__name__, [])]
        self._i = 0
        self._total = (sum(self._segs) + TAIL_HOLD) if self._segs else None

    def construct(self):
        self.build()
        if self._total is not None:
            remaining = self._total - self.renderer.time
            if remaining > 1 / 30:
                self.wait(remaining)

    # timing API ───────────────────────────────────────────────────────
    def seg(self):
        """Advance to the next narration segment; return its duration."""
        if self._i < len(self._segs):
            d = self._segs[self._i]
        else:
            d = _DEFAULT_SEG
        self._i += 1
        return d

    def beat(self, *anims, frac=0.72, run_time=None, **kwargs):
        """Play anims inside one narration segment; wait out the rest.
        With no anims: hold the segment (use for pure narration moments)."""
        d = self.seg()
        if not anims:
            self.wait(d)
            return
        rt = run_time if run_time is not None else max(0.4, d * frac)
        rt = min(rt, max(0.3, d - 0.15))
        self.play(*anims, run_time=rt, **kwargs)
        rem = d - rt
        if rem > 0.02:
            self.wait(rem)

    def seg_start(self):
        """Manual pacing: call at the top of a segment; returns (d, t0).
        End the segment with self.hold(t0, d)."""
        d = self.seg()
        return d, self.renderer.time

    def hold(self, t0, d):
        """Wait until the current manually-paced segment is complete."""
        rem = t0 + d - self.renderer.time
        if rem > 0.02:
            self.wait(rem)

    def nsegs(self):
        return len(self._segs)


# ── shared visual components ──────────────────────────────────────────
def footer():
    """Small static corner tag added by NarratedScene-based scenes."""
    t = Text("Math I · Weeks 1–4", font=FONT, font_size=17, color="#7A7A7A")
    t.to_corner(DR, buff=0.22)
    return t


def kicker(text, color=None):
    """Small top-left section label."""
    t = Text(text, font=FONT, font_size=22, color=color or "#9A9A9A")
    t.to_corner(UL, buff=0.3)
    return t


def roadmap(active=None, small=False):
    """The recurring 4-week roadmap motif.
    active: 0..3 lights that node (yellow glow); None = neutral."""
    labels = ["Numbers", "Functions", "Limits", "Limits II"]
    node_r = 0.11 if small else 0.14
    gap = 1.55 if small else 1.85
    g = VGroup()
    nodes = VGroup()
    for i in range(4):
        c = Circle(radius=node_r, color=WEEK_COLORS[i], stroke_width=3)
        if active == i:
            c.set_fill(WEEK_COLORS[i], opacity=0.9)
        nodes.add(c)
    nodes.arrange(RIGHT, buff=gap)
    arrows = VGroup()
    for i in range(3):
        a = Arrow(
            nodes[i].get_right() + RIGHT * 0.08,
            nodes[i + 1].get_left() - RIGHT * 0.08,
            buff=0.02, stroke_width=2.5, max_tip_length_to_length_ratio=0.18,
            color="#5A5A5A",
        )
        arrows.add(a)
    texts = VGroup()
    for i in range(4):
        t = Text(labels[i], font=FONT, font_size=17 if small else 20,
                 color=WEEK_COLORS[i] if active == i else "#8A8A8A")
        t.next_to(nodes[i], DOWN, buff=0.22)
        texts.add(t)
    g.add(nodes, arrows, texts)
    if active is not None:
        ring = Circle(radius=node_r * 2.1, color=ACCENT, stroke_width=2)
        ring.move_to(nodes[active])
        g.add(ring)
    return g


def week_sting_group(n):
    """Content group for the week title sting: big number + title + roadmap."""
    n = n - 1
    num = Text(f"Week {n + 1}", font=FONT, font_size=64, weight=BOLD,
               color=WEEK_COLORS[n])
    title = Text(WEEK_SUBS[n], font=FONT, font_size=26, color="#DDDDDD")
    title.next_to(num, DOWN, buff=0.3)
    rm = roadmap(active=n, small=True)
    rm.next_to(title, DOWN, buff=0.55)
    return VGroup(num, title, rm).move_to(ORIGIN)


def formula_card(tex, color=None, font_size=40):
    """A framed formula card."""
    f = MathTex(tex, font_size=font_size, color=color or WHITE)
    box = RoundedRectangle(
        corner_radius=0.12, width=f.width + 0.7, height=f.height + 0.45,
        stroke_color=color or PRIMARY, stroke_width=2,
        fill_color="#242424", fill_opacity=0.9,
    )
    f.move_to(box)
    return VGroup(box, f)


def heading(text, color=None):
    return Text(text, font=FONT, font_size=34, weight=BOLD,
                color=color or "#E8E8E8")


def sublabel(text, color="#B8B8B8", font_size=22):
    return Text(text, font=FONT, font_size=font_size, color=color)


def style_axes(**overrides):
    cfg = dict(
        x_range=[-5, 5, 1], y_range=[-3, 3, 1], x_length=9, y_length=5.2,
        axis_config={"stroke_color": "#8A8A8A", "stroke_width": 2,
                     "include_tip": True, "tip_shape": ArrowTriangleFilledTip,
                     "tip_length": 0.18, "tip_width": 0.14,
                     "include_numbers": False},
    )
    cfg.update(overrides)
    return Axes(**cfg)


def axis_labels(axes, xl="x", yl="y"):
    la = axes.get_x_axis_label(MathTex(xl, font_size=32, color="#9A9A9A"))
    lb = axes.get_y_axis_label(MathTex(yl, font_size=32, color="#9A9A9A"))
    return VGroup(la, lb)


def bullet_list(items, font_size=24, buff=0.28, color="#DDDDDD"):
    """Bulleted text block; items may contain '||' to color the part after."""
    g = VGroup()
    for it in items:
        if "||" in it:
            pre, post = it.split("||", 1)
            t = VGroup(
                Text(pre, font=FONT, font_size=font_size, color=color),
                Text(post, font=FONT, font_size=font_size, color=ACCENT),
            ).arrange(RIGHT, buff=0.08)
        else:
            t = Text(it, font=FONT, font_size=font_size, color=color)
        dot = Circle(radius=0.045, color=PRIMARY, fill_opacity=1)
        dot.next_to(t, LEFT, buff=0.22, aligned_edge=UP).shift(DOWN * 0.16)
        g.add(VGroup(dot, t))
    g.arrange(DOWN, buff=buff, aligned_edge=LEFT)
    return g
