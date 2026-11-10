#!/usr/bin/env python3
"""Build the Russian Math I masterclass spec from the audited v2 content.

The PDF remains the source of truth. Repeated ISA tasks become short retrieval
checks instead of a second verbatim explanation. Every new problem gets a
question-first beat and a flexible silent work interval; the renderer stretches
only those intervals to reach the pedagogical target duration.
"""
from __future__ import annotations

import argparse
import copy
import cmath
import difflib
import json
import math
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "video-pipeline-v2/content/specs-v2/math1_w14_ru.json"
OUT = ROOT / "video-pipeline-v3/content/math1_w14_ru.json"


def visual_block(kind: str, heading: str, narr: list[str], **data):
    return {
        "type": "visual",
        "data": {"kind": kind, "heading": heading, **data},
        "narr": narr,
        "narr_item": [-1] * len(narr),
    }


MASTER_CLASSES = {
    0: visual_block(
        "complex_roots",
        "Геометрия корней: почему их ровно три",
        [
            "Решение уравнения зет в кубе равно минус восемь удобно увидеть геометрически. Минус восемь лежит на окружности радиуса восемь и имеет аргумент пи. Извлечение кубического корня даёт всем решениям радиус два.",
            "Аргумент делится на три, но к исходному углу можно прибавить два пи и четыре пи. Поэтому получаются три разных направления: пи на три, пи и пять пи на три. Следующее значение повторит первую точку.",
            "Точки образуют правильный треугольник. Это не декоративная картинка, а способ проверки: у всех корней одинаковый модуль, соседние аргументы отличаются на два пи на три, а сумма трёх корней равна нулю.",
        ],
        radius=2,
        angles=[60, 180, 300],
        labels=["1 + √3i", "−2", "1 − √3i"],
    ),
    1: visual_block(
        "function_machine",
        "Композиция — это порядок действий, а не новый значок",
        [
            "Запись f от g от икс читается изнутри наружу. Сначала машина g получает икс и выдаёт промежуточное значение. Затем f принимает именно этот результат. Менять машины местами нельзя: в общем случае получится другая функция.",
            "Например, если g прибавляет единицу, а f возводит в квадрат, то композиция f после g даёт квадрат величины икс плюс один. Обратный порядок сначала возводит икс в квадрат и лишь потом прибавляет единицу.",
            "При вычислении обратной функции мы проходим ту же цепочку в противоположном направлении. Именно поэтому обратная существует только тогда, когда каждый выход можно однозначно связать с одним входом.",
        ],
    ),
    2: visual_block(
        "squeeze",
        "Теорема о двух милиционерах: предел через геометрию",
        [
            "Если функция заключена между двумя другими, а обе границы стремятся к одному числу, средней функции просто некуда деваться. На графике важны не отдельные значения в точке, а поведение всей полосы при приближении к ней.",
            "Для выражения икс квадрат на синус одного на икс колебание синуса ограничено числами минус один и один. После умножения на неотрицательный икс квадрат получаем нижнюю границу минус икс квадрат и верхнюю икс квадрат.",
            "Обе границы стремятся к нулю, значит и исходный предел равен нулю. Таблица значений здесь могла бы обмануть из-за всё более частых колебаний, а неравенство даёт строгое доказательство для всех точек одновременно.",
        ],
    ),
    3: visual_block(
        "landau",
        "Большое O и малое o: два разных вопроса о скорости",
        [
            "Символы Ландау сравнивают не значения функций, а скорость их изменения. Большое O означает, что отношение модулей ограничено некоторой постоянной вблизи рассматриваемой точки. Малое o требует гораздо большего: это отношение должно стремиться к нулю.",
            "Три икс является большим O от икс, потому что отношение равно трём. Но это не малое o: тройка не исчезает. Зато икс квадрат является малым o от икс при стремлении к нулю, поскольку отношение равно икс и исчезает.",
            "Перед подстановкой эквивалентности всегда называйте направление: при икс к нулю или к бесконечности. Одна и та же пара функций может вести себя совершенно по-разному в этих двух режимах.",
        ],
    ),
}


def normalize_problem(text: str) -> str:
    text = re.sub(r"\$[^$]+\$", " math ", text.lower())
    return re.sub(r"[^a-zа-я0-9]+", " ", text).strip()


_SUPERSCRIPT = str.maketrans({
    "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
    "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
    "+": "⁺", "-": "⁻", "n": "ⁿ", "i": "ⁱ",
})


AUDITED_TEXT_REPAIRS = {
    # Function domains and ranges: recover parentheses confirmed by the steps.
    "(5) Физически разумная область: t ≥ 0, то есть [0, ∞).":
        "(5) Физически разумная область для описанного нагрева: 0 ≤ t ≤ 15, то есть [0, 15].",
    "(4) t = 10 мин; (5) [0, ∞)": "(4) t = 10 мин; (5) [0, 15]",
    "d. Нужно (x + 2)/(x - 1) ≥ 0 и x ≠ 1: критические точки -2 и 1; частное неотрицательно на (−∞, −2] ∪ (1, ∞)":
        "d. Знаменатель не равен нулю: x ≠ 1, поэтому область (−∞, 1) ∪ (1, ∞)",
    "d. (−∞, −2] ∪ (1, ∞).": "d. (−∞, 1) ∪ (1, ∞).",
    "h(x) = √x + 3 − 2": "h(x) = √(x + 3) − 2",
    "√x + 3 ≥ 0": "x + 3 ≥ 0",
    "g(x) = √x + 2": "g(x) = √(x + 2)",
    "(f ± g)(x) = x² − 1 ± √x + 2": "(f ± g)(x) = x² − 1 ± (√(x + 2) + 2)",
    "(fg)(x) = (x² − 1)√x + 2": "(fg)(x) = (x² − 1)√(x + 2)",
    "(f/g)(x) = (x² − 1)/√x + 2": "(f/g)(x) = (x² − 1)/√(x + 2)",
    "(f + g)(x) = x² + √x + 1": "(f + g)(x) = x² + √(x + 2) + 1",
    "(f − g)(x) = x² − √x − 3": "(f − g)(x) = x² − √(x + 2) − 3",
    "√x + 2 ≠ 0": "√(x + 2) ≠ 0",
    # Removable sensor singularity and saturating data model.
    "V(T) = 100T/(T−50)": "V(T) = (T²−2500)/(T−50)",
    "R(n) = 100n/(1+20/n)": "R(n) = 100n/(n+20)",
    "100*x/(1+20/x)": "100*x/(x+20)",
    "g(x) = 3/(x + 2) для x ≠ 2": "g(x) = 3/(x − 2) для x ≠ 2",
    # Logarithmic equations and numerically checked approximations.
    "ln(√x) + 3 = 2": "ln(√(x + 3)) = 2",
    "d. x = 3; e. x = -14ln10/2 ≈-29.32":
        "d. x = 3/2; e. x = -14ln10/ln3 ≈-29.34",
    "≈-7.7181": "≈-7.7211",
    "≈0.3536": "≈0.4934",
    "12ln200/ln2 ≈92.1 часов": "12ln200/ln2 ≈91.7 часов",
    "k ≈0.0578 в час, t ≈92.1 часов": "k ≈0.0578 в час, t ≈91.7 часов",
    "≈31.5 месяцев": "≈29.2 месяцев",
    # Numeric-base subscripts and complex-set membership lost in PDF extraction.
    "13 в десятичной системе: 1310": "13 в десятичной системе: 13₁₀",
    "13 в двоичной системе: 11012": "13 в двоичной системе: 1101₂",
    "13 в восьмеричной системе: 158": "13 в восьмеричной системе: 15₈",
    "13 в шестнадцатеричной системе: D16": "13 в шестнадцатеричной системе: D₁₆",
    "1310 = 11012 = 158 = D16": "13₁₀ = 1101₂ = 15₈ = D₁₆",
    "√-9 = -3 ∈ Z": "√(-9) = 3i ∈ C (не вещественно)",
    "√-9 ∈ Z": "√(-9) ∈ C",
    "√-9": "√(-9)",
    "(1) √(1 + i); (2) −1 + i": "(1) 1 + i; (2) −1 + i",
}


def _readable_exponent(match: re.Match) -> str:
    body = match.group(1)
    if body and all(ord(char) in _SUPERSCRIPT for char in body):
        return body.translate(_SUPERSCRIPT)
    return "^(" + body + ")"


def repair_screen_text(value, *, key: str = "", complex_ocr: bool = False):
    """Repair PDF/OCR notation without touching intentional KaTeX fields.

    The v2 source mixes KaTeX, Unicode and plain caret notation. Simple
    exponents become typographic superscripts; compound ones become readable
    e^(iπ/3)-style text. A small audited set repairs mathematical OCR losses,
    not merely their appearance.
    """
    if isinstance(value, dict):
        return {k: repair_screen_text(v, key=k, complex_ocr=complex_ocr)
                for k, v in value.items()}
    if isinstance(value, list):
        return [repair_screen_text(v, key=key, complex_ocr=complex_ocr) for v in value]
    if not isinstance(value, str):
        return value
    text = value
    for old, new in AUDITED_TEXT_REPAIRS.items():
        text = text.replace(old, new)
    if key in {"tex", "substr", "fn"}:
        return text
    if complex_ocr:
        text = text.replace("$1 + 3$", "√(1 + 3)")
        text = text.replace("$2$", "√2").replace("$3$", "√3")
        text = text.replace("sqrt[3]{1 + √3i}", "1 + i√3")
        text = text.replace("sqrt[3]{1 - √3i}", "1 - i√3")
        # Keep the clearly printed conditions and repair the PDF's mismatched answers.
        text = text.replace("z = -1 + √3i", "z = -1 + 3i")
        text = text.replace("(3 + i)^4 = -8 + 8√3i", "(3 + i)^4 = 28 + 96i")
        text = text.replace("z^5 = -16 - 16√3i", "z^5 = -316 - 12i")
        text = text.replace(
            "Для z = -1 + 3i: |z| = √(1 + 3) = 2",
            "Для z = -1 + 3i: |z| = √(1 + 9) = √10",
        )
        text = text.replace(
            "Точка находится во втором квадранте, опорный угол равен π/3, поэтому θ = 2π/3",
            "Точка находится во втором квадранте, опорный угол равен arctan(3), поэтому θ = π - arctan(3)",
        )
        text = text.replace("z = 2e^{i2π/3}", "z = √10·e^{i(π-arctan(3))}")
        text = text.replace(
            "Тогда z^5 = 2^5e^{i10π/3} = 32e^{i(10π/3-2π)} = 32e^{i4π/3}",
            "Тогда z^5 = (√10)^5·e^{i5(π-arctan(3))} = 100√10·e^{i5(π-arctan(3))}",
        )
        text = text.replace(
            "Преобразуем в алгебраическую форму: 32(-1/2 - i√3/2) = -16 - 16√3i",
            "Преобразуем в алгебраическую форму: z^5 = -316 - 12i",
        )
        text = text.replace("r = √(3²+1²)=2, квадрант III", "r = √(3²+1²)=√10, квадрант III")
        text = text.replace(
            "θ = π + arctan(1/3): 2(cos(π + arctan(1/3)) + i·sin(π + arctan(1/3))) = 2·e^(i(π + arctan(1/3)))",
            "θ = π + arctan(1/3): √10(cos(π + arctan(1/3)) + i·sin(π + arctan(1/3))) = √10·e^(i(π + arctan(1/3)))",
        )
        text = text.replace(
            "100(cos(4·arctan(1/3)) + i·sin(4·arctan(1/3)))",
            "28 + 96i",
        )
        text = text.replace(
            "100√10(cos(5(π-arctan(3))) + i·sin(5(π-arctan(3))))",
            "-316 - 12i",
        )
        text = text.replace(
            "1 + i√3 = 2 cos(π/3) + i sin(π) = 2e",
            "1 + i√3 = 2(cos(π/3) + i sin(π/3)) = 2e",
        )
    text = text.replace("r^{1/n (", "r^(1/n) (")
    text = re.sub(r"\^\{([^{}]+)\}", _readable_exponent, text)
    text = re.sub(r"\^(-?\d+|[A-Za-z])", _readable_exponent, text)
    text = re.sub(r"^Problem\s+(\d+)", r"Задача \1", text)
    text = re.sub(r"^Example\s+(\d+)", r"Пример \1", text)
    return text


def question_problem(data: dict) -> str:
    """Keep a question self-contained without leaking its worked answers."""
    problem = data.get("problem", "").strip()
    if not problem.endswith(":"):
        return problem
    heading = data.get("heading", "")
    prompts = []
    for step in data.get("steps", []):
        text = step.get("text", "").strip()
        if not text:
            continue
        if heading == "Задача 9" and text.startswith("Компания"):
            continue  # covered by its own worked example immediately below
        if "Определение рациональности" in heading:
            # These source steps contain "expression = answer — reason";
            # retain only the expression for the learner's question card.
            text = re.split(r"\s+=\s+|\s+—\s+", text, maxsplit=1)[0]
        prompts.append(text)
    return problem + (" " + "; ".join(prompts) if prompts else "")


def clean_narration(block: dict) -> None:
    seen = set()
    result, mapping = [], []
    old_mapping = block.get("narr_item", [])
    screen_items = block.get("data", {}).get("bullets", []) + [
        step.get("text", "") for step in block.get("data", {}).get("steps", [])
    ]
    screen_keys = {item.casefold() for item in screen_items}
    for index, segment in enumerate(block.get("narr", [])):
        text = re.sub(r"\s+", " ", segment).strip()
        text = text.replace("Давайте рассмотрим конкретный пример. ", "")
        text = re.sub(r"^Важно помнить, что\s+", "", text)
        if text.startswith("Это позволяет легко преобразовывать"):
            continue
        key = text.casefold()
        if len(key) > 65 and key in screen_keys:
            continue
        if not text or key in seen:
            continue
        seen.add(key)
        result.append(text)
        mapping.append(old_mapping[index] if index < len(old_mapping) else -1)
    block["narr"] = result
    block["narr_item"] = mapping


def build(target_minutes: int = 195) -> tuple[dict, dict]:
    source = json.loads(SOURCE.read_text())
    spec = {
        "schema_version": 3,
        "id": "math1_w14_masterclass",
        "language": "ru",
        "course_title": "Math I · Мастер-класс",
        "weeks_label": "Недели 1–4 · русский",
        "test_title": "Math I — недели 1–4",
        "source_pdf": "study-guides/Math_I_Weeks_1-4_RU.pdf",
        "target_minutes": target_minutes,
        "chapters": [],
    }
    coverage = {
        "source_pdf": spec["source_pdf"],
        "unique_worked_examples": 0,
        "retrieval_checks": 0,
        "duplicates_compressed": [],
        "masterclasses": [],
        "target_minutes": target_minutes,
    }
    seen: list[tuple[str, str]] = []
    for chapter_index, original_chapter in enumerate(source["chapters"]):
        chapter = {"title": original_chapter["title"], "blocks": []}
        # The first v2 chapter contains week 1; later chapters are weeks 2–4.
        chapter["blocks"].append(copy.deepcopy(MASTER_CLASSES[chapter_index]))
        coverage["masterclasses"].append(MASTER_CLASSES[chapter_index]["data"]["kind"])
        for original in original_chapter["blocks"]:
            block = copy.deepcopy(original)
            block["data"] = repair_screen_text(
                block.get("data", {}), complex_ocr=chapter_index == 0,
            )
            clean_narration(block)
            if block.get("type") != "example":
                chapter["blocks"].append(block)
                continue
            data = block.get("data", {})
            problem = data.get("problem", "").strip()
            standalone_problem = question_problem(data)
            normalized = normalize_problem(problem)
            duplicate_of = None
            if len(normalized) > 45:
                for previous, heading in seen:
                    if difflib.SequenceMatcher(None, normalized, previous).ratio() > 0.90:
                        duplicate_of = heading
                        break
            if duplicate_of:
                chapter["blocks"].append({
                    "type": "question",
                    "data": {
                        "heading": "Проверка без повторного разбора",
                        "problem": standalone_problem,
                        "answer": data.get("result", "Сверьте решение с пособием"),
                        "hold": 10,
                        "flex": False,
                        "mode": "quick",
                    },
                    "narr": [],
                    "narr_item": [],
                })
                coverage["duplicates_compressed"].append({
                    "task": data.get("heading"), "same_as": duplicate_of,
                })
                coverage["retrieval_checks"] += 1
                continue
            seen.append((normalized, data.get("heading", "")))
            if not problem:
                # A continuation belongs to the preceding worked example; a
                # standalone question here would lose the original context.
                chapter["blocks"].append(block)
                coverage["unique_worked_examples"] += 1
                continue
            chapter["blocks"].append({
                "type": "question",
                "data": {
                    "heading": "Сначала — самостоятельно",
                    "problem": standalone_problem,
                    "hold": 12,
                    "flex": True,
                    "mode": "solve",
                },
                "narr": [],
                "narr_item": [],
            })
            chapter["blocks"].append(block)
            coverage["unique_worked_examples"] += 1
        spec["chapters"].append(chapter)
    # Editorial gate: a stock sentence may occur only once in the whole film.
    # Drop later copies together with their item mapping; worked steps remain.
    used_narration = set()
    for chapter in spec["chapters"]:
        for block in chapter["blocks"]:
            kept, mapping = [], []
            for segment, item in zip(block.get("narr", []), block.get("narr_item", [])):
                key = norm = re.sub(r"\s+", " ", segment).strip().casefold()
                if len(norm) > 55 and norm in used_narration:
                    continue
                used_narration.add(norm)
                kept.append(segment)
                mapping.append(item)
            block["narr"], block["narr_item"] = kept, mapping

    # Regression checks for the audited OCR repairs above.
    z = -1 + 3j
    w = 3 + 1j
    assert w**4 == 28 + 96j
    assert z**5 == -316 - 12j
    assert int("1101", 2) == int("15", 8) == int("D", 16) == 13
    assert abs((1 + 1j)**6 - (-8j)) < 1e-9
    assert 4**(3/2 + 1) == 32
    assert round(math.log(200) / (math.log(2)/12), 1) == 91.7
    assert round(math.log(3500/120) / math.log(2**(1/6)), 1) == 29.2
    assert round(math.log(211)/math.log(.5), 4) == -7.7211
    assert round(math.log(.452)/math.log(.2), 4) == .4934
    assert math.isclose(math.log(math.sqrt(math.exp(4))), 2)
    assert round(100*1000/(1000 + 20), 1) == 98.0
    assert math.isclose((51**2 - 2500)/(51 - 50), 51 + 50)
    assert math.isclose(3/(0 - 2), -3/2) and math.isclose(3/(-4 - 2), -1/2)
    complex_screen = json.dumps(
        [b.get("data", {}) for b in spec["chapters"][0]["blocks"]],
        ensure_ascii=False,
    )
    for bad in (
        "(√3 + i)^4", "(√3+i)^4", "−1+√3i", "-1 + √3i",
        "-8 + 8√3i", "-16 - 16√3i", "$2$", "$3$", "sqrt[3]",
        "i sin(π) = 2e", "√-9 ∈ Z", "r = √(3²+1²)=2",
    ):
        assert bad not in complex_screen, f"unrepaired complex OCR: {bad}"
    all_screen = json.dumps(
        [b.get("data", {}) for c in spec["chapters"] for b in c["blocks"]],
        ensure_ascii=False,
    )
    for bad in (
        "V(T) = 100T/(T−50)", "R(n) = 100n/(1+20/n)",
        "ln(√x) + 3 = 2", "≈31.5 месяцев", "t ≈92.1 часов",
        "d. x = 3; e. x = -14", "g(x) = 3/(x + 2) для x ≠ 2",
    ):
        assert bad not in all_screen, f"unrepaired mathematical source text: {bad}"
    return spec, coverage


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--target-minutes", type=int, default=195)
    parser.add_argument("--out", type=Path, default=OUT)
    args = parser.parse_args()
    spec, coverage = build(args.target_minutes)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(spec, ensure_ascii=False, indent=2) + "\n")
    coverage_path = args.out.with_suffix(".coverage.json")
    coverage_path.write_text(json.dumps(coverage, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({
        "spec": str(args.out),
        "chapters": len(spec["chapters"]),
        "blocks": sum(len(c["blocks"]) for c in spec["chapters"]),
        **coverage,
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
