#!/usr/bin/env python3
import json, sys, re

KNOWN = {"title","section","concept","formula","example","plot","table","code","timeline","recap","outro"}

def check(path):
    with open(path, encoding="utf-8") as f:
        d = json.load(f)
    blocks = []
    for ch in d["chapters"]:
        for b in ch["blocks"]:
            blocks.append(b)
    errs, warns = [], []
    # block types
    for i, b in enumerate(blocks):
        if b["type"] not in KNOWN:
            errs.append(f"block {i}: unknown type {b['type']}")
    # title first, outro last, exactly one each
    types = [b["type"] for b in blocks]
    if types.count("title") != 1 or types[0] != "title":
        errs.append("title must be first and unique")
    if types.count("outro") != 1 or types[-1] != "outro":
        errs.append("outro must be last and unique")
    # no placeholders
    txt = json.dumps(d, ensure_ascii=False)
    for bad in ["TODO", "XXX", "..)", "lorem"]:
        if bad in txt:
            errs.append(f"placeholder found: {bad}")
    if re.search(r'\.\.\.(?!\.)', txt.replace("...", "…")):
        pass
    # narration word count
    words = 0
    for b in blocks:
        n = b.get("narration", "")
        w = len(n.split())
        words += w
        if n and ("\\frac" in n or "\\lim" in n or "->" in n or "→" in n):
            errs.append(f"narration contains forbidden symbols near: {n[:60]}")
        t = b["type"]
        if t == "concept":
            bl = b.get("bullets", [])
            if not (2 <= len(bl) <= 4): errs.append(f"concept '{b.get('heading','?')}': bullets {len(bl)}")
            for x in bl:
                if len(x) > 60: errs.append(f"bullet too long ({len(x)}): {x}")
            if not (90 <= w <= 175): warns.append(f"concept '{b.get('heading','?')}': {w} words")
        if t == "table":
            cols = b["columns"]; rows = b["rows"]
            if not (2 <= len(cols) <= 4): errs.append(f"table '{b.get('heading','?')}': {len(cols)} cols")
            if len(rows) > 6: errs.append(f"table '{b.get('heading','?')}': {len(rows)} rows")
            for r in rows:
                if len(r) != len(cols): errs.append(f"table '{b.get('heading','?')}': row len mismatch")
                for c in r:
                    if len(c) > 40: errs.append(f"cell >40 ({len(c)}): {c}")
            if not (90 <= w <= 160): warns.append(f"table '{b.get('heading','?')}': {w} words")
        if t == "example":
            st = b["steps"]
            if not (3 <= len(st) <= 6): errs.append(f"example '{b.get('heading','?')}': {len(st)} steps")
            if not (105 <= w <= 190): warns.append(f"example '{b.get('heading','?')}': {w} words")
        if t == "recap":
            it = b["items"]
            if not (3 <= len(it) <= 6): errs.append(f"recap: {len(it)} items")
            for x in it:
                if len(x) > 55: errs.append(f"recap item too long ({len(x)}): {x}")
            if not (55 <= w <= 115): warns.append(f"recap: {w} words")
        if t == "section":
            if not (40 <= w <= 75): warns.append(f"section {b.get('num')}: {w} words")
        if t == "title":
            if not (55 <= w <= 95): warns.append(f"title: {w} words")
        if t == "outro":
            if not (45 <= w <= 90): warns.append(f"outro: {w} words")
    if not (4800 <= words <= 5400):
        errs.append(f"narration words {words} out of 4800-5400")
    # chapter structure
    for ci, ch in enumerate(d["chapters"], 1):
        bl = ch["blocks"]
        has_section = any(b["type"] == "section" for b in bl)
        n_concept = sum(1 for b in bl if b["type"] in ("concept", "formula"))
        n_example = sum(1 for b in bl if b["type"] == "example")
        ends_recap = bl[-1]["type"] == "recap" if bl else False
        print(f"  ch{ci} '{ch['title'][:45]}': blocks={len(bl)} concepts={n_concept} examples={n_example} section={has_section} ends_recap={ends_recap}")
        if not has_section: errs.append(f"ch{ci}: no section")
        if n_concept < 3: errs.append(f"ch{ci}: <3 concept blocks")
        if n_example < 1: errs.append(f"ch{ci}: <1 example")
    from collections import Counter
    print(f"  block types: {dict(Counter(types))}")
    print(f"  TOTAL blocks: {len(blocks)}")
    print(f"  NARRATION WORDS: {words}  (target 4800-5400)")
    for e in errs: print("ERROR:", e)
    for wn in warns: print("warn:", wn)
    return len(errs) == 0

if __name__ == "__main__":
    ok = True
    for p in sys.argv[1:]:
        print("==", p)
        ok = check(p) and ok
    sys.exit(0 if ok else 1)
