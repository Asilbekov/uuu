#!/usr/bin/env python3
"""Build cs_w47_ru.json and cs_w47_uz.json from the EN spec + translation parts.

Guarantees:
- identical block structure (types, order, count) to EN
- code blocks byte-identical to EN except translated /* comments */
- only human-language fields are overridden
"""
import json, copy, re, sys

BASE = "/home/z/my-project/scripts/video/specs"
EN_PATH = BASE + "/cs_w47_en.json"
PARTS = BASE + "/parts"

TOP = {
    "ru": {
        "course_title": "Информатика — программирование на языке C",
        "test_title": "Недели 4–7 · Полное руководство",
        "subtitle": "Типы данных · Управляющие конструкции · Функции · Указатели · Рекурсия",
        "outro_message": "Вы прошли все недели 4–7 — типы, управление, функции, указатели, строки, рекурсия. Теперь сдавайте тест — вы готовы.",
    },
    "uz": {
        "course_title": "Informatika — C tilida dasturlash",
        "test_title": "4–7-haftalar · Toʻliq qoʻllanma",
        "subtitle": "Maʼlumot turlari · Boshqaruv · Funksiyalar · Koʻrsatkichlar · Rekursiya",
        "outro_message": "4–7-haftalarning hammasini oʻtdingiz — turlar, boshqaruv, funksiyalar, koʻrsatkichlar, satrlar, rekursiya. Endi testni topshiring — siz tayyorsiz.",
    },
}

# code comments to translate: {(chapter, block): [(en_comment, translated), ...]}
COMMENTS = {
    "ru": {
        (0, 6): [
            ("/* any non-zero value is true; 0 is false */", "/* любое не ноль — истина; 0 — ложь */"),
            ("/* x unchanged */", "/* x не изменился */"),
            ("/* no read */", "/* чтения нет */"),
        ],
        (2, 2): [
            ("/* prototype */", "/* прототип */"),
            ("/* call */", "/* вызов */"),
            ("/* definition */", "/* определение */"),
        ],
        (3, 2): [
            ("/* address of n */", "/* адрес n */"),
            ("/* address of pi */", "/* адрес pi */"),
            ("/* pi is now 7.14159 */", "/* теперь pi = 7.14159 */"),
        ],
        (3, 4): [("/* now a = 7, b = 5 */", "/* теперь a = 7, b = 5 */")],
        (4, 3): [
            ("/* base case */", "/* базовый случай */"),
            ("/* smaller problem */", "/* меньшая задача */"),
        ],
        (4, 5): [("/* base case */", "/* базовый случай */")],
        (5, 3): [
            ("/* 1900 stops here! */", "/* 1900 останавливается здесь! */"),
            ("/* unreachable */", "/* недостижимо */"),
            ("/* fix: check % 400, then % 100, then % 4 */", "/* фикс: проверять % 400, затем % 100, затем % 4 */"),
        ],
        (5, 5): [
            ("/* reads past the end! */", "/* читает за концом! */"),
            ("/* fix: make room for the terminator */", "/* фикс: место для терминатора */"),
            ("/* prints hello */", "/* печатает hello */"),
        ],
        (5, 6): [
            ("/* compares addresses */", "/* сравнивает адреса */"),
            ("/* compares contents */", "/* сравнивает содержимое */"),
            ("/* crash: read-only! */", "/* крах: только чтение! */"),
        ],
    },
    "uz": {
        (0, 6): [
            ("/* any non-zero value is true; 0 is false */", "/* nol boʻlmagan — rost; 0 — yolgʻon */"),
            ("/* x unchanged */", "/* x oʻzgarmadi */"),
            ("/* no read */", "/* oʻqish yoʻq */"),
        ],
        (2, 2): [
            ("/* prototype */", "/* prototip */"),
            ("/* call */", "/* chaqiruv */"),
            ("/* definition */", "/* taʼrif */"),
        ],
        (3, 2): [
            ("/* address of n */", "/* n ning manzili */"),
            ("/* address of pi */", "/* pi ning manzili */"),
            ("/* pi is now 7.14159 */", "/* endi pi = 7.14159 */"),
        ],
        (3, 4): [("/* now a = 7, b = 5 */", "/* endi a = 7, b = 5 */")],
        (4, 3): [
            ("/* base case */", "/* baza holati */"),
            ("/* smaller problem */", "/* kichikroq masala */"),
        ],
        (4, 5): [("/* base case */", "/* baza holati */")],
        (5, 3): [
            ("/* 1900 stops here! */", "/* 1900 shu yerda toʻxtaydi! */"),
            ("/* unreachable */", "/* yetib boʻlmaydi */"),
            ("/* fix: check % 400, then % 100, then % 4 */", "/* fix: % 400, keyin % 100, keyin % 4 */"),
        ],
        (5, 5): [
            ("/* reads past the end! */", "/* oxiridan oʻqib ketadi! */"),
            ("/* fix: make room for the terminator */", "/* fix: terminatorga joy oching */"),
            ("/* prints hello */", "/* hello ni chop etadi */"),
        ],
        (5, 6): [
            ("/* compares addresses */", "/* manzillarni solishtiradi */"),
            ("/* compares contents */", "/* mazmunni solishtiradi */"),
            ("/* crash: read-only! */", "/* halokat: faqat oʻqish! */"),
        ],
    },
}

ALLOWED_OVERRIDE = {
    "title": {"narration"},
    "section": {"title", "subtitle", "narration"},
    "concept": {"heading", "bullets", "narration", "formula", "formula_caption"},
    "code": {"heading", "narration", "code"},
    "example": {"heading", "problem", "steps", "result", "narration"},
    "table": {"heading", "columns", "rows", "narration"},
    "recap": {"items", "narration"},
    "outro": {"message", "narration"},
    "formula": {"heading", "tex", "parts", "narration"},
    "plot": {"heading", "functions", "narration"},
    "timeline": {"heading", "events", "narration"},
}

COMMENT_RE = re.compile(r"/\*.*?\*/")


def strip_comments(code):
    return COMMENT_RE.sub("«C»", code)


def load_parts(lang):
    files = {
        "ru": ["cs_w47_ru_c012.json", "cs_w47_ru_c34.json", "cs_w47_ru_c5.json"],
        "uz": ["cs_w47_uz_c012.json", "cs_w47_uz_c34.json", "cs_w47_uz_c5.json"],
    }[lang]
    chapters = []
    for fn in files:
        data = json.load(open(f"{PARTS}/{fn}", encoding="utf-8"))
        chapters.extend(data["chapters"])
    return chapters


def build(lang, en):
    tchapters = load_parts(lang)
    assert len(tchapters) == len(en["chapters"]), f"{lang}: chapter count mismatch"
    out = copy.deepcopy(en)
    out["language"] = lang
    for k, v in TOP[lang].items():
        out[k] = v
    for ci, (ench, tch) in enumerate(zip(en["chapters"], tchapters)):
        ench_blocks = ench["blocks"]
        tblocks = tch["blocks"]
        assert len(tblocks) == len(ench_blocks), f"{lang}: block count mismatch in chapter {ci}"
        out["chapters"][ci]["title"] = tch["title"]
        for bi, (enb, tb) in enumerate(zip(ench_blocks, tblocks)):
            btype = enb["type"]
            for key in tb:
                assert key in ALLOWED_OVERRIDE[btype], f"{lang} ch{ci} b{bi} ({btype}): unexpected override '{key}'"
            # apply overrides
            for key, val in tb.items():
                if key == "code":
                    continue  # handled below via comment translation only
                out["chapters"][ci]["blocks"][bi][key] = val
            # code: keep EN code, translate comments only
            if btype == "code":
                code = enb["code"]
                for old, new in COMMENTS[lang].get((ci, bi), []):
                    assert old in code, f"{lang} ch{ci} b{bi}: comment not found: {old}"
                    code = code.replace(old, new)
                # verify only comments changed
                assert strip_comments(code) == strip_comments(enb["code"]), f"{lang} ch{ci} b{bi}: non-comment code changed"
                for ln in code.split("\n"):
                    assert len(ln) <= 62, f"{lang} ch{ci} b{bi}: line >62ch: {ln!r}"
                out["chapters"][ci]["blocks"][bi]["code"] = code
    return out


def main():
    en = json.load(open(EN_PATH, encoding="utf-8"))
    ok = True
    for lang in ("ru", "uz"):
        out = build(lang, en)
        path = f"{BASE}/cs_w47_{lang}.json"
        with open(path, "w", encoding="utf-8") as f:
            json.dump(out, f, ensure_ascii=False, indent=2)
            f.write("\n")
        # report
        blocks = [b for ch in out["chapters"] for b in ch["blocks"]]
        enblocks = [b for ch in en["chapters"] for b in ch["blocks"]]
        words = sum(len(b.get("narration", "").split()) for b in blocks)
        types_ok = all(a["type"] == b["type"] for a, b in zip(blocks, enblocks))
        print(f"{lang}: {len(blocks)} blocks (EN {len(enblocks)}), types match: {types_ok}, narration words: {words}")
        if not types_ok:
            ok = False
        # per-block word count detail for short blocks
        for i, b in enumerate(blocks):
            w = len(b.get("narration", "").split())
            if w < 25:
                print(f"  WARN block {i} ({b['type']}) short: {w}w")
                ok = False
    print("BUILD", "OK" if ok else "PROBLEMS")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
