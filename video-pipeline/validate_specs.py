#!/usr/bin/env python3
"""Validate video spec JSONs: structure, types, word counts, LaTeX sanity, sizes."""
import json, sys, os, re

SPEC_DIR = "/home/z/my-project/scripts/video/specs"
KNOWN = {"title", "section", "concept", "formula", "example", "plot", "table", "code", "timeline", "recap", "outro"}
TEXFIELDS = ("formula", "tex", "problem", "problem_tex")

def words(s):
    return len(str(s).split())

def check_file(path):
    errs, warns = [], []
    name = os.path.basename(path)
    try:
        with open(path) as f:
            data = json.load(f)
    except Exception as e:
        return name, [f"JSON LOAD FAIL: {e}"], []
    if data.get("language") not in ("en", "ru", "uz"):
        errs.append(f"bad language {data.get('language')}")
    blocks = []
    for ch in data.get("chapters", []):
        for b in ch.get("blocks", []):
            b["_chapter"] = ch.get("title", "?")
            blocks.append(b)
    if not blocks:
        return name, ["no blocks"], []
    if blocks[0]["type"] != "title":
        errs.append("first block not title")
    if blocks[-1]["type"] != "outro":
        errs.append("last block not outro")
    total_words = 0
    for i, b in enumerate(blocks):
        t = b.get("type")
        if t not in KNOWN:
            errs.append(f"block {i}: unknown type {t}")
            continue
        n = b.get("narration", "")
        total_words += words(n)
        if t in ("concept", "formula", "example", "plot", "table", "code", "timeline", "recap", "section") and words(n) < 25:
            warns.append(f"block {i} ({t}): short narration ({words(n)}w)")
        if t == "concept":
            if not b.get("heading"): errs.append(f"block {i} concept: no heading")
            if not b.get("bullets"): warns.append(f"block {i} concept: no bullets")
        if t == "formula":
            if not b.get("tex"): errs.append(f"block {i} formula: no tex")
            for p in b.get("parts", []):
                if "substr" not in p or p["substr"] not in b.get("tex", ""):
                    errs.append(f"block {i} formula: part substr not in tex: {p.get('substr','?')[:30]}")
        if t == "example":
            if not b.get("steps"): errs.append(f"block {i} example: no steps")
        if t == "code":
            code = b.get("code", "")
            lines = code.split("\n")
            if len(lines) > 12: errs.append(f"block {i} code: {len(lines)} lines (>12)")
            for ln in lines:
                if len(ln) > 62: warns.append(f"block {i} code line >62ch")
        if t == "plot":
            for fn_spec in ([b.get("plot")] if b.get("plot") else []) + b.get("functions", []):
                if not fn_spec.get("fn"): errs.append(f"block {i} plot: fn missing")
        # LaTeX sanity: no forbidden \text{...} with non-ascii, no $ delimiters
        for f_ in TEXFIELDS:
            v = b.get(f_)
            if v and "$" in v:
                errs.append(f"block {i}: $ delimiter in {f_}")
        for s in b.get("steps", []) if isinstance(b.get("steps"), list) else []:
            if isinstance(s, dict) and s.get("tex") and "$" in s["tex"]:
                errs.append(f"block {i}: $ in step tex")
        if re.search(r"TODO|XXX|待补充|【|\.\.\.\s*\"|\.\.\.$", json.dumps(b, ensure_ascii=False)[:3000]):
            warns.append(f"block {i} ({t}): possible placeholder")
    lo, hi = (4800, 5400)
    if not (lo <= total_words <= hi):
        warns.append(f"narration words {total_words} outside {lo}-{hi}")
    return name, errs, warns, total_words, len(blocks)

def main():
    files = sorted(f for f in os.listdir(SPEC_DIR) if f.endswith(".json") and not f.startswith("final"))
    print(f"{'file':28s} {'blocks':>6s} {'words':>6s}  status")
    bad = 0
    for fn in files:
        path = os.path.join(SPEC_DIR, fn)
        size = os.path.getsize(path)
        r = check_file(path)
        if len(r) == 2:
            name, errs = r
            print(f"{name:28s} {'-':>6s} {'-':>6s}  ✗ {errs[0]}")
            bad += 1
            continue
        name, errs, warns, w, nb = r
        if errs:
            bad += 1
            print(f"{name:28s} {nb:6d} {w:6d}  ✗ " + "; ".join(errs[:4]))
        else:
            tag = "✓" if not warns else "⚠"
            print(f"{name:28s} {nb:6d} {w:6d}  {tag}" + (f" ({warns[0]})" if warns else ""))
    print(f"\n{len(files)} files, {bad} with hard errors")

if __name__ == "__main__":
    main()
