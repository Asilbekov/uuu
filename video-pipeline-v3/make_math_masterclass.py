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
import difflib
import json
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
            clean_narration(block)
            if block.get("type") != "example":
                chapter["blocks"].append(block)
                continue
            data = block.get("data", {})
            problem = data.get("problem", "").strip()
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
                        "problem": problem,
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
                    "problem": problem,
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
