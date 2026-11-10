#!/usr/bin/env python3
"""Select representative scenes for a fast end-to-end visual review."""
import copy
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
source = json.loads((HERE / "content/math1_w14_ru.json").read_text())
preview = {k: copy.deepcopy(v) for k, v in source.items() if k != "chapters"}
preview.update({
    "id": "math1_w14_v3_preview",
    "test_title": "Math I · v3 · визуальный прогон",
    "target_minutes": 0,
    "chapters": [{"title": "Визуальный прогон", "blocks": []}],
})
blocks = preview["chapters"][0]["blocks"]
blocks.append(copy.deepcopy(source["chapters"][0]["blocks"][1]))  # title
for chapter_index, block_index in [(0, 0), (1, 0), (2, 0), (3, 0)]:
    blocks.append(copy.deepcopy(source["chapters"][chapter_index]["blocks"][block_index]))
# A real question → solution pair, not a mock-up.
for index, block in enumerate(source["chapters"][0]["blocks"]):
    if block["type"] == "example" and block["data"].get("heading") == "Пример 8 — Корни из комплексных чисел":
        if source["chapters"][0]["blocks"][index-1]["type"] == "question":
            blocks.append(copy.deepcopy(source["chapters"][0]["blocks"][index-1]))
        blocks.append(copy.deepcopy(block))
        break
# Existing numeric plots must remain compatible with the v3 visual system.
plot = next(b for b in source["chapters"][2]["blocks"] if b["type"] == "plot")
blocks.append(copy.deepcopy(plot))
(HERE / "content/math1_w14_v3_preview.json").write_text(
    json.dumps(preview, ensure_ascii=False, indent=2) + "\n"
)
print(f"preview blocks: {len(blocks)}")
