"""3b1b-style palette and shared visual constants."""
from manim import *

# Classic 3Blue1Brown palette (per manim_skill visual-techniques.md)
BG_COLOR = "#1C1C1C"
PRIMARY = "#58C4DD"      # blue  — inputs, givens
SECONDARY = "#83C167"    # green — results, answers
ACCENT = "#FFFF00"       # yellow — highlights, key terms
WARN = "#FF6666"         # red — errors, negatives
TEAL = "#5CD0B3"
ORANGE = "#FFA500"
PURPLE = "#9A72AC"
GREY_SOFT = "#B0B0B0"

FONT = "DejaVu Sans"     # has Cyrillic + U+02BB okina on both sandbox and Kaggle

COLOR_MAP = {
    "yellow": ACCENT, "blue": PRIMARY, "green": SECONDARY,
    "red": WARN, "teal": TEAL, "orange": ORANGE, "purple": PURPLE,
}

# Language metadata: TTS voice, ISO code for subtitle track
LANG_META = {
    "en": {"voice": "en-US-AndrewMultilingualNeural", "iso": "eng", "label": "English"},
    "ru": {"voice": "ru-RU-DmitryNeural", "iso": "rus", "label": "Русский"},
    "uz": {"voice": "uz-UZ-SardorNeural", "iso": "uzb", "label": "Oʻzbekcha"},
}

def bg(scene):
    scene.camera.background_color = BG_COLOR
