#!/usr/bin/env python3
"""Extended validation for math1_w57 specs: LaTeX sanity, substr matching, fn tokens,
cross-language structural identity, and TTS-safe narration."""
import json, sys, re

KNOWN_FN_TOKENS = {"x", "np.sin", "np.cos", "np.tan", "np.exp", "np.log", "np.sqrt",
                   "np.pi", "np.abs", "np.e"}

def tex_sanity(tex, where, errs):
    if "$" in tex:
        errs.append(f"{where}: $ delimiter in tex")
    if tex.count("{") != tex.count("}"):
        errs.append(f"{where}: unbalanced braces in tex: {tex[:60]}")
    m = re.findall(r"\\text\{([^}]*)\}", tex)
    for t in m:
        if any(ord(c) > 127 for c in t):
            errs.append(f"{where}: non-ASCII in \\text: {t}")
    for bad in ["\\begin{equation}", "\\boxed", "\\usepackage", "$$"]:
        if bad in tex:
            errs.append(f"{where}: forbidden {bad}")

def fn_check(fn, where, errs):
    import ast
    t = fn.replace(" ", "")
    tokens = re.findall(r"[A-Za-z_.]+", t)
    for tok in tokens:
        if tok not in KNOWN_FN_TOKENS:
            errs.append(f"{where}: suspicious fn token '{tok}' in {fn}")
    try:
        tree = ast.parse(fn, mode="eval")
        for node in ast.walk(tree):
            if isinstance(node, ast.Name):
                root = node.id.split(".")[0]
                if root not in ("x", "np"):
                    errs.append(f"{where}: name {node.id} in fn {fn}")
    except SyntaxError as e:
        errs.append(f"{where}: fn syntax error {fn}: {e}")

def check(path):
    import ast
    with open(path, encoding="utf-8") as f:
        d = json.load(f)
    errs = []
    blocks = []
    for ch in d["chapters"]:
        for b in ch["blocks"]:
            blocks.append(b)
    for i, b in enumerate(blocks):
        t = b["type"]
        w = b.get("where", f"block {i}")
        n = b.get("narration", "")
        for sym in ["->", "→", "\\frac", "\\lim", "\\sin", "\\ln", "\\pi", "\\approx", "\\cdot", "\\to "]:
            if sym in n:
                errs.append(f"block {i} ({t}): forbidden symbol '{sym}' in narration: ...{n[:70]}")
        for bad in ["TODO", "XXX", "lorem", "..)"]:
            if bad in n:
                errs.append(f"block {i}: placeholder {bad}")
        if t == "formula":
            tex = b["tex"]
            tex_sanity(tex, f"block {i} formula", errs)
            for p in b.get("parts", []):
                if p["substr"] not in tex:
                    errs.append(f"block {i} formula '{b.get('heading')}': substr not in tex: {p['substr'][:40]}")
                if p.get("color") not in ("yellow", "blue", "green", "red", "teal"):
                    errs.append(f"block {i}: bad color {p.get('color')}")
                tex_sanity(p["substr"], f"block {i} substr", errs)
        if t == "concept":
            if "formula" in b:
                tex_sanity(b["formula"], f"block {i} concept formula", errs)
            if "plot" in b:
                tex_sanity(b["plot"].get("tex", ""), f"block {i} plot tex", errs)
                fn_check(b["plot"]["fn"], f"block {i}", errs)
        if t == "plot":
            for f_ in b["functions"]:
                tex_sanity(f_["tex"], f"block {i} plot fn tex", errs)
                fn_check(f_["fn"], f"block {i}", errs)
                if f_.get("color") not in ("yellow", "blue", "green", "red", "teal"):
                    errs.append(f"block {i}: bad plot color {f_.get('color')}")
        if t == "example":
            tex_sanity(b.get("problem", ""), f"block {i} problem", errs)
            for s in b.get("steps", []):
                if "tex" in s:
                    tex_sanity(s["tex"], f"block {i} step", errs)
    return d, blocks, errs

def skeleton(d):
    """Structural fingerprint: block types + math data (language independent)."""
    sk = []
    for ch in d["chapters"]:
        sk.append(("chapter", ch["title"]))
        for b in ch["blocks"]:
            entry = [b["type"]]
            for k in ("formula", "tex", "problem"):
                if k in b:
                    entry.append(b[k])
            if b["type"] == "formula":
                entry.append(tuple(p["substr"] for p in b["parts"]))
            if b["type"] == "plot":
                entry.append(tuple((f["fn"], f["tex"]) for f in b["functions"]))
                entry.append((tuple(b["x_range"]), tuple(b["y_range"]), b.get("point")))
            if b["type"] == "concept" and "plot" in b:
                entry.append((b["plot"]["fn"], b["plot"].get("tex")))
            if b["type"] == "table":
                entry.append((tuple(b["columns"]), tuple(tuple(r) for r in b["rows"]))) if False else None
                # columns/rows are translated -> exclude
            if b["type"] == "example":
                entry.append(tuple(s.get("tex", "") for s in b["steps"]))
            sk.append(tuple(entry))
    return sk

if __name__ == "__main__":
    all_ok = True
    data = {}
    for p in sys.argv[1:]:
        print("==", p)
        d, blocks, errs = check(p)
        data[p] = d
        words = sum(len(b.get("narration", "").split()) for b in blocks)
        print(f"  blocks={len(blocks)} words={words}")
        for e in errs:
            print("  ERROR:", e)
            all_ok = False
    # cross-language identity
    if len(data) == 3:
        paths = list(data.keys())
        sk = {p: skeleton(data[p]) for p in paths}
        ref = paths[0]
        for p in paths[1:]:
            if sk[p] != sk[ref]:
                all_ok = False
                print(f"STRUCTURE MISMATCH between {ref} and {p}:")
                for a, b in zip(sk[ref], sk[p]):
                    if a != b:
                        print("   ref:", a)
                        print("   cmp:", b)
                if len(sk[ref]) != len(sk[p]):
                    print(f"   length {len(sk[ref])} vs {len(sk[p])}")
            else:
                print(f"structure identical: {ref} == {p}")
    sys.exit(0 if all_ok else 1)
