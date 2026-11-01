#!/usr/bin/env python3
"""Validator for ITE video spec files (SPEC.md contract)."""
import json, sys, re

KNOWN = {"title", "section", "concept", "formula", "example", "plot", "table", "code", "timeline", "recap", "outro"}
RANGES = {  # (min, max) narration words
    "title": (60, 90), "section": (40, 70), "concept": (90, 160),
    "formula": (100, 170), "example": (110, 180), "plot": (90, 150),
    "table": (90, 150), "code": (100, 160), "timeline": (100, 160),
    "recap": (60, 110), "outro": (50, 80),
}

def tex_ok(tex):
    try:
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
        fig = plt.figure()
        fig.text(0.5, 0.5, "$" + tex + "$")
        import io
        buf = io.BytesIO()
        fig.savefig(buf, format="png", dpi=30)
        plt.close(fig)
        return True, None
    except ImportError:
        # fallback: allowed-commands whitelist check
        bad = re.findall(r"\\[a-zA-Z]+", tex)
        allowed = {"\\frac", "\\lim", "\\sin", "\\cos", "\\tan", "\\to", "\\infty", "\\cdot",
                   "\\int", "\\sum", "\\begin", "\\end", "\\det", "\\lambda", "\\vec",
                   "\\Rightarrow", "\\approx", "\\leq", "\\geq", "\\neq", "\\mathrm",
                   "\\left", "\\right", "\\dot", "\\times", "\\pmatrix"}
        for b in bad:
            if b not in allowed:
                return False, "unknown command " + b
        return None, "matplotlib not available (whitelist only)"
    except Exception as e:
        return False, str(e)[:120]

def validate(path):
    errs, warns = [], []
    d = json.load(open(path, encoding="utf-8"))
    lang = d.get("language")
    for key in ("id", "language", "course_title", "test_title", "subtitle", "chapters", "outro_message", "narration_style"):
        if key not in d:
            errs.append(f"missing top-level key: {key}")
    blocks = []
    for ci, ch in enumerate(d["chapters"], 1):
        cb = ch.get("blocks", [])
        if not cb:
            errs.append(f"ch{ci}: no blocks")
        types = [b.get("type") for b in cb]
        # chapter 1 may open with the global title block; every chapter must contain its section first otherwise
        first_non_title = types[0] if types and types[0] != "title" else (types[1] if len(types) > 1 else None)
        if ci > 1 and types and types[0] == "title":
            errs.append(f"ch{ci}: title block outside chapter 1")
        if first_non_title != "section":
            errs.append(f"ch{ci}: first non-title block is not section")
        if not types or types[-1] not in ("recap", "outro"):
            errs.append(f"ch{ci}: last block is not recap/outro")
        n_concept = sum(1 for t in types if t in ("concept", "formula"))
        n_example = sum(1 for t in types if t == "example")
        if n_concept < 3:
            errs.append(f"ch{ci}: only {n_concept} concept/formula blocks (need >=3)")
        if n_example < 1:
            errs.append(f"ch{ci}: no example block")
        for bi, b in enumerate(cb, 1):
            b["_loc"] = f"ch{ci}.b{bi}"
            blocks.append(b)
    # global structure
    if not blocks or blocks[0]["type"] != "title":
        errs.append("first block is not title")
    if not blocks or blocks[-1]["type"] != "outro":
        errs.append("last block is not outro")
    n_title = sum(1 for b in blocks if b["type"] == "title")
    n_outro = sum(1 for b in blocks if b["type"] == "outro")
    if n_title != 1: errs.append(f"{n_title} title blocks (need 1)")
    if n_outro != 1: errs.append(f"{n_outro} outro blocks (need 1)")
    # per-block checks
    total_words = 0
    counts = {}
    for b in blocks:
        t = b["type"]
        counts[t] = counts.get(t, 0) + 1
        if t not in KNOWN:
            errs.append(f"{b['_loc']}: unknown type {t}")
            continue
        narr = b.get("narration", "")
        wc = len(narr.split())
        total_words += wc
        lo, hi = RANGES[t]
        if wc < lo or wc > hi:
            errs.append(f"{b['_loc']} ({t}): {wc} words (range {lo}-{hi})")
        # narration hygiene
        if "\\frac" in narr or "\\dot" in narr or "$" in narr or "->" in narr or "`" in narr or "**" in narr:
            errs.append(f"{b['_loc']}: narration contains LaTeX/markdown/arrow")
        if re.search(r"\bTODO\b|\bXXX\b|\.\.\.", narr):
            errs.append(f"{b['_loc']}: placeholder in narration")
        if t == "concept":
            bl = b.get("bullets", [])
            if not (2 <= len(bl) <= 4):
                errs.append(f"{b['_loc']}: {len(bl)} bullets (need 2-4)")
            for x in bl:
                if len(x) > 60:
                    errs.append(f"{b['_loc']}: bullet too long ({len(x)}): {x[:50]}")
            if "formula" in b:
                ok, msg = tex_ok(b["formula"])
                if ok is False: errs.append(f"{b['_loc']}: formula fails: {msg} -> {b['formula']}")
        if t == "formula":
            tex = b.get("tex", "")
            ok, msg = tex_ok(tex)
            if ok is False: errs.append(f"{b['_loc']}: tex fails: {msg}")
            for p in b.get("parts", []):
                if p["substr"] not in tex:
                    errs.append(f"{b['_loc']}: substr not in tex: {p['substr']}")
                if p["color"] not in ("yellow", "blue", "green", "red", "teal"):
                    errs.append(f"{b['_loc']}: bad color {p['color']}")
        if t == "example":
            steps = b.get("steps", [])
            if not (3 <= len(steps) <= 6):
                errs.append(f"{b['_loc']}: {len(steps)} steps (need 3-6)")
            for s in steps:
                if "tex" in s:
                    ok, msg = tex_ok(s["tex"])
                    if ok is False: errs.append(f"{b['_loc']}: step tex fails: {msg}")
        if t == "table":
            cols = b.get("columns", [])
            rows = b.get("rows", [])
            if not (2 <= len(cols) <= 4): errs.append(f"{b['_loc']}: {len(cols)} columns")
            if len(rows) > 6: errs.append(f"{b['_loc']}: {len(rows)} rows (max 6)")
            for r in rows:
                for c in r:
                    if len(c) > 40:
                        errs.append(f"{b['_loc']}: cell too long ({len(c)}): {c}")
        if t == "recap":
            items = b.get("items", [])
            if not (3 <= len(items) <= 6):
                errs.append(f"{b['_loc']}: {len(items)} recap items (need 3-6)")
            for x in items:
                if len(x) > 55:
                    errs.append(f"{b['_loc']}: recap item too long ({len(x)}): {x}")
        if t == "section":
            for k in ("num", "title", "subtitle"):
                if k not in b: errs.append(f"{b['_loc']}: section missing {k}")
        if t == "outro":
            if "message" not in b: errs.append(f"{b['_loc']}: outro missing message")
    if not (4800 <= total_words <= 5400):
        errs.append(f"TOTAL WORDS {total_words} outside 4800-5400")
    nblocks = len(blocks)
    if not (50 <= nblocks <= 78):
        warns.append(f"block count {nblocks} (target ~55-75)")
    return d, blocks, total_words, counts, errs, warns

if __name__ == "__main__":
    for path in sys.argv[1:]:
        print("=" * 70)
        print(path)
        try:
            d, blocks, total, counts, errs, warns = validate(path)
        except json.JSONDecodeError as e:
            print("  INVALID JSON:", e)
            continue
        print(f"  language={d['language']}  chapters={len(d['chapters'])}  blocks={len(blocks)}  words={total}")
        print("  block counts:", ", ".join(f"{k}={v}" for k, v in sorted(counts.items())))
        for w in warns: print("  WARN:", w)
        if errs:
            print(f"  {len(errs)} ERROR(S):")
            for e in errs: print("   -", e)
        else:
            print("  ALL CHECKS PASSED")
