#!/usr/bin/env python3
"""Self-validation for video spec files (SPEC.md contract)."""
import json
import re
import sys

KNOWN_TYPES = {"title", "section", "concept", "formula", "example", "plot", "table", "code", "timeline", "recap", "outro"}
COLORS = {"yellow", "blue", "green", "red", "teal"}
FN_TOKENS = re.compile(r"^[x0-9n\s\.\+\-\*/\(\),]+$")
FN_FUNCS = sorted({"np.sin", "np.cos", "np.tan", "np.exp", "np.log", "np.sqrt", "np.pi", "np.abs", "np.e"}, key=len, reverse=True)


def words(s):
    return len(re.findall(r"[\w\u00C0-\u024F\u0400-\u04FF\u02BB'’-]+", s))


def check_fn(fn):
    """Validate plot fn expression tokens."""
    expr = fn
    for f in FN_FUNCS:
        expr = expr.replace(f, "")
    leftover = re.sub(r"[xX0-9\s\.\+\-\*/\(\),]", "", expr)
    return leftover == ""


def validate(path):
    errors, warns = [], []
    with open(path) as fh:
        spec = json.load(fh)

    blocks = []
    for ci, ch in enumerate(spec["chapters"]):
        for bi, b in enumerate(ch["blocks"]):
            blocks.append((ci, bi, b))

    # ---- block types known
    for ci, bi, b in blocks:
        if b["type"] not in KNOWN_TYPES:
            errors.append(f"unknown block type {b['type']!r} at ch{ci} block{bi}")

    # ---- exactly one title (first) and one outro (last)
    types = [b["type"] for _, _, b in blocks]
    if types[0] != "title":
        errors.append("first block is not title")
    if types[-1] != "outro":
        errors.append("last block is not outro")
    if types.count("title") != 1:
        errors.append(f"title count = {types.count('title')}")
    if types.count("outro") != 1:
        errors.append(f"outro count = {types.count('outro')}")

    # ---- per chapter: section first (title may precede in ch0), >=3 concept/formula, >=1 example
    for ci, ch in enumerate(spec["chapters"]):
        cblocks = ch["blocks"]
        start = 0
        if cblocks and cblocks[0]["type"] == "title" and ci == 0:
            start = 1
        if cblocks[start]["type"] != "section":
            errors.append(f"ch{ci}: first block not section")
        teaching = [b for b in cblocks if b["type"] in ("concept", "formula", "plot")]
        if len(teaching) < 3:
            errors.append(f"ch{ci}: only {len(teaching)} concept/formula/plot blocks")
        n_ex = sum(1 for b in cblocks if b["type"] == "example")
        if n_ex < 1:
            errors.append(f"ch{ci}: no example block")
        recaps = [i for i, b in enumerate(cblocks) if b["type"] == "recap"]
        if not recaps:
            errors.append(f"ch{ci}: no recap")

    # ---- word counts
    total = 0
    per_type = {}
    for ci, bi, b in blocks:
        n = words(b.get("narration", ""))
        total += n
        per_type[b["type"]] = per_type.get(b["type"], 0) + n
    if not (4800 <= total <= 5400):
        errors.append(f"narration word count {total} outside 4800-5400")

    # ---- formula substrings
    for ci, bi, b in blocks:
        if b["type"] == "formula":
            for p in b.get("parts", []):
                if p["substr"] not in b["tex"]:
                    errors.append(f"ch{ci} b{bi} formula: substr {p['substr']!r} not in tex")
                if p.get("color") not in COLORS:
                    errors.append(f"ch{ci} b{bi} formula: bad color {p.get('color')!r}")
        if b["type"] == "concept" and "formula" in b:
            if not b["formula"].strip():
                errors.append(f"ch{ci} b{bi} concept: empty formula")

    # ---- LaTeX rough sanity: no $, no \text with non-ascii, balanced braces
    texfields = []
    for ci, bi, b in blocks:
        if b["type"] == "formula":
            texfields.append((ci, bi, b["tex"]))
        if b["type"] == "concept" and "formula" in b:
            texfields.append((ci, bi, b["formula"]))
        if b["type"] == "example":
            if "problem" in b and b["problem"].startswith("\\"):
                texfields.append((ci, bi, b["problem"]))
            for si, s in enumerate(b.get("steps", [])):
                if "tex" in s:
                    texfields.append((ci, bi, s["tex"]))
        if b["type"] == "plot":
            for f in b.get("functions", []):
                texfields.append((ci, bi, f["tex"]))
                if not check_fn(f["fn"]):
                    errors.append(f"ch{ci} b{bi} plot fn bad chars: {f['fn']!r}")
    for ci, bi, t in texfields:
        if "$" in t:
            errors.append(f"ch{ci} b{bi}: $ in tex")
        if t.count("{") != t.count("}"):
            errors.append(f"ch{ci} b{bi}: unbalanced braces in {t!r}")
        for m in re.finditer(r"\\text\{([^}]*)\}", t):
            if not m.group(1).isascii():
                errors.append(f"ch{ci} b{bi}: \\text with non-ascii")

    # ---- narration TTS sanity: no ->, no latex leftovers
    for ci, bi, b in blocks:
        nar = b.get("narration", "")
        if "->" in nar or "\\frac" in nar or "$" in nar:
            errors.append(f"ch{ci} b{bi}: narration contains symbols")

    # ---- no placeholders
    def walk(o):
        if isinstance(o, str):
            if "TODO" in o or "XXX" in o or "..." in o:
                return o
        elif isinstance(o, list):
            for v in o:
                r = walk(v)
                if r:
                    return r
        elif isinstance(o, dict):
            for v in o.values():
                r = walk(v)
                if r:
                    return r
        return None
    ph = walk(spec)
    if ph:
        errors.append(f"placeholder-like text: {ph[:60]!r}")

    # ---- bullets length, table cells, recap items
    for ci, bi, b in blocks:
        if b["type"] == "concept":
            for bl in b.get("bullets", []):
                if len(bl) > 62:
                    warns.append(f"ch{ci} b{bi} long bullet ({len(bl)}): {bl[:40]}")
        if b["type"] == "table":
            if not (2 <= len(b["columns"]) <= 4):
                errors.append(f"ch{ci} b{bi}: table columns {len(b['columns'])}")
            if len(b["rows"]) > 6:
                errors.append(f"ch{ci} b{bi}: table rows {len(b['rows'])}")
            for r in b["rows"]:
                for c in r:
                    if len(c) > 42:
                        warns.append(f"ch{ci} b{bi} long cell ({len(c)}): {c[:40]}")
        if b["type"] == "recap":
            for it in b.get("items", []):
                if len(it) > 57:
                    warns.append(f"ch{ci} b{bi} long recap item ({len(it)}): {it[:40]}")
        if b["type"] == "example":
            if not (3 <= len(b.get("steps", [])) <= 6):
                errors.append(f"ch{ci} b{bi}: example steps count {len(b.get('steps', []))}")

    print(f"== {path}")
    print(f"   blocks={len(blocks)}  chapters={len(spec['chapters'])}  words={total}")
    print(f"   types: " + ", ".join(f"{t}:{types.count(t)}" for t in sorted(set(types))))
    print(f"   examples={types.count('example')}  formulas={types.count('formula')}  tables={types.count('table')}  plots={types.count('plot')}")
    for e in errors:
        print("   ERROR:", e)
    for w in warns:
        print("   warn:", w)
    if not errors:
        print("   ALL CHECKS PASSED" + (" (with warnings)" if warns else ""))
    return len(errors)


if __name__ == "__main__":
    total_err = 0
    for p in sys.argv[1:]:
        total_err += validate(p)
    sys.exit(1 if total_err else 0)
