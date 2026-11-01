from manim import *

class SmokeLocal(Scene):
    def construct(self):
        t1 = Text("Limits and Continuity · Пределы · Chegaralar", font="DejaVu Sans", font_size=36)
        t2 = Text("oʻzbekcha gʻ oʻ — okina test", font="DejaVu Sans", font_size=36).next_to(t1, DOWN)
        f = MathTex(r"\lim_{x \to a} \frac{f(x)-f(a)}{x-a}").next_to(t2, DOWN)
        box = SurroundingRectangle(f, color=YELLOW)
        self.play(Write(t1), run_time=0.5)
        self.play(FadeIn(t2, shift=UP * 0.3), run_time=0.4)
        self.play(Write(f), run_time=0.5)
        self.play(Create(box), run_time=0.3)
        self.wait(0.3)
