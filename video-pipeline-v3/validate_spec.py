#!/usr/bin/env python3
"""Structural, mathematical and editorial QA for uuu Studio v3 specs."""
from __future__ import annotations

import argparse
import collections
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
KATEX = HERE / "engine/assets/katex/katex.min.js"
VISUALS = {"complex_roots", "function_machine", "squeeze", "landau"}
FILLER = (
    "как мы уже говорили", "давайте рассмотрим конкретный пример",
    "это позволяет легко", "важно помнить, что", "в современном мире",
)


def norm(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip().casefold()


def screen_notation_errors(value, path="data", key="") -> list[str]:
    """Reject raw PDF/LaTeX notation in fields rendered as plain text."""
    if isinstance(value, dict):
        return [issue for k, v in value.items()
                for issue in screen_notation_errors(v, f"{path}.{k}", k)]
    if isinstance(value, list):
        return [issue for i, v in enumerate(value)
                for issue in screen_notation_errors(v, f"{path}[{i}]", key)]
    if not isinstance(value, str) or key in {"tex", "substr", "fn"}:
        return []
    plain = re.sub(r"\$[^$]*\$", "", value)
    issues = []
    if re.search(r"\^\{|sqrt\[", plain):
        issues.append(f"{path}: raw PDF exponent/root notation: {value[:100]}")
    return issues


def katex_errors(expressions: list[str]) -> list[str]:
    if not expressions:
        return []
    script = """
const katex=require(process.argv[2]); const items=JSON.parse(process.argv[3]);
const bad=[]; for(const [i,tex] of items.entries()) { try {
 katex.renderToString(tex,{throwOnError:true,strict:'ignore'});
} catch(e) { bad.push(`${i}: ${e.message}`); } }
console.log(JSON.stringify(bad));
"""
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as handle:
        handle.write(script)
        name = handle.name
    try:
        result = subprocess.run(
            ["node", name, str(KATEX), json.dumps(expressions)],
            capture_output=True, text=True, timeout=120,
        )
        if result.returncode:
            return [result.stderr[-500:]]
        return json.loads(result.stdout)
    finally:
        Path(name).unlink(missing_ok=True)


def validate(path: Path) -> dict:
    spec = json.loads(path.read_text())
    errors: list[str] = []
    warnings: list[str] = []
    if spec.get("schema_version") != 3:
        errors.append("schema_version must be 3")
    if not 180 <= spec.get("target_minutes", 0) <= 240 and "masterclass" in spec.get("id", ""):
        errors.append("masterclass target must be between 3 and 4 hours")
    if spec.get("language") != "ru":
        errors.append("the reference masterclass must be Russian")

    blocks = [b for chapter in spec.get("chapters", []) for b in chapter.get("blocks", [])]
    expressions: list[str] = []
    narration_seen: dict[str, int] = {}
    types = collections.Counter()
    flex_count = 0
    complex_blocks = {id(b) for b in spec.get("chapters", [{}])[0].get("blocks", [])}
    for index, block in enumerate(blocks):
        kind = block.get("type")
        types[kind] += 1
        data = block.get("data", {})
        narration = block.get("narr", [])
        errors.extend(f"block {index}: {issue}" for issue in screen_notation_errors(data))
        heading = data.get("heading", "")
        if re.match(r"^(?:Problem|Example|Exercise)\b", heading, re.IGNORECASE):
            errors.append(f"block {index}: untranslated heading: {heading}")
        if id(block) in complex_blocks:
            complex_text = json.dumps(data, ensure_ascii=False)
            for marker in (
                "$2$", "$3$", "sqrt[3]", "(√3 + i)^4", "(√3+i)^4",
                "−1+√3i", "-1 + √3i", "-8 + 8√3i", "-16 - 16√3i", "√-9 ∈ Z",
            ):
                if marker in complex_text:
                    errors.append(f"block {index}: suspect complex-number OCR: {marker}")
        if not isinstance(narration, list):
            errors.append(f"block {index}: narr must be a list")
            continue
        if len(block.get("narr_item", [])) != len(narration):
            errors.append(f"block {index}: narr_item length != narr length")
        for segment in narration:
            key = norm(segment)
            if len(key) > 55:
                if key in narration_seen:
                    errors.append(f"blocks {narration_seen[key]} and {index}: duplicate narration")
                narration_seen[key] = index
            if any(phrase in key for phrase in FILLER):
                warnings.append(f"block {index}: editorial filler: {segment[:90]}")
        if kind in ("formula", "matrix") and data.get("tex"):
            expressions.append(data["tex"])
        if kind == "table":
            expressions.extend(cell["tex"] for row in data.get("rows", []) for cell in row
                               if isinstance(cell, dict) and cell.get("tex"))
        if kind == "visual" and data.get("kind") not in VISUALS:
            errors.append(f"block {index}: unknown visual {data.get('kind')}")
        if kind == "question":
            if not data.get("problem"):
                errors.append(f"block {index}: question without a problem")
            elif data["problem"].strip().endswith(":"):
                errors.append(f"block {index}: question prompt has no actual items")
            flex_count += bool(data.get("flex"))
        # A sentence may explain screen content, but a long verbatim copy of a
        # bullet is almost always the old 'read the slide aloud' anti-pattern.
        screen_texts = data.get("bullets", []) + [s.get("text", "") for s in data.get("steps", [])]
        screen_norms = {norm(s) for s in screen_texts if len(norm(s)) > 65}
        for segment in narration:
            if norm(segment) in screen_norms:
                warnings.append(f"block {index}: narration exactly mirrors a screen item")
    all_screen = json.dumps([b.get("data", {}) for b in blocks], ensure_ascii=False)
    for marker in (
        "V(T) = 100T/(T−50)", "R(n) = 100n/(1+20/n)", "100*x/(1+20/x)",
        "ln(√x) + 3 = 2", "≈31.5 месяцев", "t ≈92.1 часов",
        "d. x = 3; e. x = -14", "g(x) = 3/(x + 2) для x ≠ 2",
    ):
        if marker in all_screen:
            errors.append(f"known mathematical regression in source text: {marker}")
    for expression in katex_errors(expressions):
        errors.append("KaTeX: " + expression)
    if spec.get("target_minutes") and not flex_count:
        errors.append("target duration requires flexible active-learning questions")
    return {
        "id": spec.get("id"), "blocks": len(blocks), "types": dict(types),
        "narration_characters": sum(len(s) for b in blocks for s in b.get("narr", [])),
        "flexible_questions": flex_count, "katex_expressions": len(expressions),
        "errors": errors, "warnings": warnings,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("spec", type=Path)
    args = parser.parse_args()
    report = validate(args.spec)
    print(json.dumps(report, ensure_ascii=False, indent=2))
    sys.exit(1 if report["errors"] else 0)


if __name__ == "__main__":
    main()
