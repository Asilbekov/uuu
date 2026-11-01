#!/usr/bin/env python3
"""Final cross-file validation for SPEC-10 (English for Engineering I, weeks 5-7)."""
import json, sys, re

FILES = {
    "en": "eng_w57_en.json",
    "ru": "eng_w57_ru.json",
    "uz": "eng_w57_uz.json",
}
BASE = "/home/z/my-project/scripts/video/specs/"
KNOWN = {"title","section","concept","formula","example","plot","table","code","timeline","recap","outro"}

def blocks_of(d):
    return [b for ch in d["chapters"] for b in ch["blocks"]]

def skeleton(d):
    out = []
    for ch in d["chapters"]:
        for b in ch["blocks"]:
            t = b["type"]
            if t == "table":
                out.append((t, len(b["columns"]), [len(r) for r in b["rows"]], len(b["rows"])))
            elif t == "example":
                out.append((t, len(b["steps"]), sum(1 for s in b["steps"] if s.get("highlight"))))
            elif t == "concept":
                out.append((t, len(b["bullets"])))
            elif t == "recap":
                out.append((t, len(b["items"])))
            elif t == "section":
                out.append((t, b["num"]))
            else:
                out.append((t,))
    return out

errs = []
data = {}
for lang, fn in FILES.items():
    try:
        with open(BASE+fn, encoding="utf-8") as f:
            d = json.load(f)
    except Exception as e:
        errs.append(f"{lang}: JSON load failed: {e}")
        continue
    data[lang] = d
    bl = blocks_of(d)
    types = [b["type"] for b in bl]
    if any(t not in KNOWN for t in types):
        errs.append(f"{lang}: unknown block type")
    if types[0] != "title" or types.count("title") != 1:
        errs.append(f"{lang}: title must be first & unique")
    if types[-1] != "outro" or types.count("outro") != 1:
        errs.append(f"{lang}: outro must be last & unique")
    if not (55 <= len(bl) <= 75):
        errs.append(f"{lang}: block count {len(bl)} not in 55-75")
    words = sum(len(b.get("narration","").split()) for b in bl)
    if not (4800 <= words <= 5400):
        errs.append(f"{lang}: narration words {words} not in 4800-5400")
    txt = json.dumps(d, ensure_ascii=False)
    if "\\" in txt:
        errs.append(f"{lang}: backslash (LaTeX?) found")
    for bad in ["TODO", "XXX", "Lorem"]:
        if bad in txt:
            errs.append(f"{lang}: placeholder {bad}")
    for b in bl:
        n = b.get("narration","")
        if "->" in n or "\\frac" in n or "→" in n:
            errs.append(f"{lang}: forbidden symbol in narration: {n[:50]}")
        if b["type"] == "table":
            for r in b["rows"]:
                for c in r:
                    if len(c) > 40: errs.append(f"{lang}: cell >40: {c}")
            if len(b["rows"]) > 6 or not (2 <= len(b["columns"]) <= 4):
                errs.append(f"{lang}: table dims wrong: {b['heading']}")
        if b["type"] == "concept":
            for x in b.get("bullets", []):
                if len(x) > 60: errs.append(f"{lang}: bullet >60: {x}")
        if b["type"] == "recap":
            for x in b["items"]:
                if len(x) > 55: errs.append(f"{lang}: recap item >55: {x}")
    print(f"{lang}: blocks={len(bl)} words={words} chapters={len(d['chapters'])} "
          f"examples={types.count('example')} concepts={types.count('concept')} tables={types.count('table')}")

# structure identity
if len(data) == 3:
    s_en, s_ru, s_uz = (skeleton(data[l]) for l in ("en","ru","uz"))
    if not (s_en == s_ru == s_uz):
        errs.append("STRUCTURE MISMATCH across languages")
        for i,(a,b,c) in enumerate(zip(s_en,s_ru,s_uz)):
            if not (a==b==c): errs.append(f"  first diff at block {i}: {a} / {b} / {c}")
    else:
        print(f"structure identical across 3 languages ({len(s_en)} blocks)")

# uz apostrophe check
if "uz" in data:
    t = json.dumps(data["uz"], ensure_ascii=False)
    if "ʻ" not in t:
        errs.append("uz: U+02BB not used")
    bad = re.findall(r"\b[og]'\w", t)
    if bad:
        errs.append(f"uz: straight-apostrophe o'/g' found: {bad[:5]}")

print()
if errs:
    for e in errs: print("ERROR:", e)
    sys.exit(1)
print("ALL CHECKS PASSED")
