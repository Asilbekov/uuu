#!/usr/bin/env python3
"""Validate cs_w47 spec files (en/ru/uz) against SPEC.md contract."""
import json, sys, re
from collections import Counter

KNOWN = {"title","section","concept","formula","example","plot","table","code","timeline","recap","outro"}

def check(path):
    with open(path, encoding="utf-8") as f:
        d = json.load(f)
    blocks = []
    for ch in d["chapters"]:
        for b in ch["blocks"]:
            blocks.append(b)
    errs, warns = [], []
    for i, b in enumerate(blocks):
        if b["type"] not in KNOWN:
            errs.append(f"block {i}: unknown type {b['type']}")
    types = [b["type"] for b in blocks]
    if types.count("title") != 1 or types[0] != "title":
        errs.append("title must be first and unique")
    if types.count("outro") != 1 or types[-1] != "outro":
        errs.append("outro must be last and unique")
    txt = json.dumps(d, ensure_ascii=False)
    for bad in ["TODO", "XXX", "lorem", "..)"]:
        if bad in txt:
            errs.append(f"placeholder found: {bad}")
    words = 0
    for i, b in enumerate(blocks):
        n = b.get("narration", "")
        w = len(n.split())
        words += w
        if n and ("\\frac" in n or "\\lim" in n or "->" in n or "→" in n):
            errs.append(f"block {i}: narration has forbidden symbols")
        t = b["type"]
        if t == "concept":
            bl = b.get("bullets", [])
            if not (2 <= len(bl) <= 4): errs.append(f"concept '{b.get('heading','?')}': {len(bl)} bullets")
            for x in bl:
                if len(x) > 60: errs.append(f"bullet too long ({len(x)}): {x}")
            if not (88 <= w <= 165): warns.append(f"concept '{b.get('heading','?')}': {w} words")
        if t == "table":
            cols, rows = b["columns"], b["rows"]
            if not (2 <= len(cols) <= 4): errs.append(f"table '{b.get('heading','?')}': {len(cols)} cols")
            if len(rows) > 6: errs.append(f"table '{b.get('heading','?')}': {len(rows)} rows")
            for r in rows:
                if len(r) != len(cols): errs.append(f"table '{b.get('heading','?')}': row mismatch")
                for c in r:
                    if len(c) > 40: errs.append(f"cell >40 ({len(c)}): {c}")
            if not (85 <= w <= 160): warns.append(f"table '{b.get('heading','?')}': {w} words")
        if t == "example":
            st = b["steps"]
            if not (3 <= len(st) <= 6): errs.append(f"example '{b.get('heading','?')}': {len(st)} steps")
            if not (100 <= w <= 190): warns.append(f"example '{b.get('heading','?')}': {w} words")
        if t == "code":
            lines = b["code"].split("\n")
            if len(lines) > 12: errs.append(f"code '{b.get('heading','?')}': {len(lines)} lines > 12")
            for ln in lines:
                if len(ln) > 62: errs.append(f"code line >62 ({len(ln)}): {ln}")
            for h in b.get("highlight", []):
                if not (1 <= h <= len(lines)): errs.append(f"code '{b.get('heading','?')}': highlight {h} out of range")
            if not (95 <= w <= 165): warns.append(f"code '{b.get('heading','?')}': {w} words")
        if t == "recap":
            it = b["items"]
            if not (3 <= len(it) <= 6): errs.append(f"recap: {len(it)} items")
            for x in it:
                if len(x) > 55: errs.append(f"recap item too long ({len(x)}): {x}")
            if not (50 <= w <= 115): warns.append(f"recap: {w} words")
        if t == "section":
            if not (30 <= w <= 75): warns.append(f"section {b.get('num')}: {w} words")
        if t == "title":
            if not (55 <= w <= 95): warns.append(f"title: {w} words")
        if t == "outro":
            if not (40 <= w <= 90): warns.append(f"outro: {w} words")
    if not (4800 <= words <= 5400):
        errs.append(f"narration words {words} out of 4800-5400")
    for ci, ch in enumerate(d["chapters"], 1):
        bl = ch["blocks"]
        has_section = any(b["type"] == "section" for b in bl)
        n_concept = sum(1 for b in bl if b["type"] in ("concept", "formula"))
        n_example = sum(1 for b in bl if b["type"] == "example")
        print(f"  ch{ci} '{ch['title'][:45]}': blocks={len(bl)} concepts={n_concept} examples={n_example} section={has_section}")
        if not has_section: errs.append(f"ch{ci}: no section")
        if n_concept < 3: errs.append(f"ch{ci}: <3 concept blocks")
        if n_example < 1: errs.append(f"ch{ci}: <1 example")
    print(f"  block types: {dict(Counter(types))}")
    print(f"  TOTAL blocks: {len(blocks)}")
    print(f"  NARRATION WORDS: {words}  (target 4800-5400)")
    for e in errs: print("ERROR:", e)
    for wn in warns: print("warn:", wn)
    return len(errs) == 0

def cross(paths):
    """Structure must be identical across languages."""
    sigs = []
    for p in paths:
        with open(p, encoding="utf-8") as f:
            d = json.load(f)
        sig = []
        for ch in d["chapters"]:
            for b in ch["blocks"]:
                item = {"type": b["type"]}
                if b["type"] == "code":
                    item["code"] = b["code"]; item["hl"] = b.get("highlight")
                if b["type"] == "table":
                    item["cols"] = len(b["columns"]); item["rows"] = len(b["rows"])
                    # code-ish cells must be identical
                    item["cells"] = [[c for c in r] for r in b["rows"]]
                if b["type"] == "example":
                    item["steps"] = len(b["steps"]); item["result"] = b.get("result")
                if b["type"] == "section":
                    item["num"] = b.get("num")
                if b["type"] in ("concept","formula"):
                    item["bullets"] = len(b.get("bullets", []))
                if b["type"] == "recap":
                    item["items"] = len(b["items"])
                sig.append(item)
        sigs.append((p, sig))
    base_p, base = sigs[0]
    ok = True
    for p, sig in sigs[1:]:
        if len(sig) != len(base):
            print(f"CROSS: {p}: block count {len(sig)} != {len(base)}"); ok = False; continue
        for i, (a, b2) in enumerate(zip(base, sig)):
            if a["type"] != b2["type"]:
                print(f"CROSS: {p} block {i}: type {b2['type']} != {a['type']}"); ok = False
            if a["type"] == "code" and (a["code"] != b2["code"] or a["hl"] != b2["hl"]):
                print(f"CROSS: {p} block {i}: code mismatch"); ok = False
            if a["type"] == "table" and (a["cols"] != b2["cols"] or a["rows"] != b2["rows"]):
                print(f"CROSS: {p} block {i}: table shape mismatch"); ok = False
            if a["type"] == "table":
                for ra, rb in zip(a["cells"], b2["cells"]):
                    for ca, cb in zip(ra, rb):
                        # code-like cells (identifiers, specifiers) must stay identical
                        if re.match(r'^[%\w\s\*\(\)\[\],\.\'"\\/=<>+-]+$', ca) and any(ch.isdigit() or ch in '%*=' for ch in ca):
                            if ca != cb:
                                print(f"CROSS: {p} block {i}: code cell changed: {ca!r} -> {cb!r}")
            if a["type"] == "example" and (a["steps"] != b2["steps"] or a["result"] != b2["result"]):
                print(f"CROSS: {p} block {i}: example shape mismatch"); ok = False
            if a.get("num") != b2.get("num") and a["type"] == "section":
                print(f"CROSS: {p} block {i}: section num mismatch"); ok = False
    print("CROSS-CHECK:", "IDENTICAL STRUCTURE" if ok else "DIFFERENCES FOUND")
    return ok

if __name__ == "__main__":
    ok = True
    for p in sys.argv[1:]:
        print("==", p)
        ok = check(p) and ok
    if len(sys.argv) > 1:
        cross(sys.argv[1:])
    sys.exit(0 if ok else 1)
