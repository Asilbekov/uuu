from manim import *

class SmokeTest(Scene):
    def construct(self):
        # Test 1: plain Text
        t = Text("Math I — Weeks 1-4", font_size=48, color=BLUE)
        # Test 2: MathTex (requires LaTeX + dvisvgm)
        eq = MathTex(r"\lim_{x \to 0} \frac{\sin x}{x} = 1", font_size=60)
        eq2 = MathTex(r"\mathbb{N} \subseteq \mathbb{Z} \subseteq \mathbb{Q} \subseteq \mathbb{R} \subseteq \mathbb{C}", font_size=36)
        eq3 = MathTex(r"z = r(\cos\theta + i\sin\theta) = re^{i\theta}", font_size=44)
        VGroup(t, eq, eq2, eq3).arrange(DOWN, buff=0.7)
        self.play(Write(t), run_time=1)
        self.play(Write(eq), run_time=1.5)
        self.play(Write(eq2), run_time=1.5)
        self.play(Write(eq3), run_time=1.5)
        self.wait(0.5)
        # Test 3: shapes + axes
        c = Circle(color=YELLOW).scale(0.3).next_to(VGroup(t, eq, eq2, eq3), RIGHT, buff=1)
        axes = Axes(x_range=[-3, 3], y_range=[-2, 2], x_length=3, y_length=2).next_to(VGroup(t, eq, eq2, eq3), LEFT, buff=1)
        graph = axes.plot(lambda x: np.sin(x), color=GREEN)
        self.play(Create(c), Create(axes), Create(graph), run_time=2)
        self.wait(1)
