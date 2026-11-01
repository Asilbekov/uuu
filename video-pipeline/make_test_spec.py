#!/usr/bin/env python3
"""Make a small test spec: first N blocks covering every block type."""
import json, sys

src = json.load(open(sys.argv[1]))
out_path = sys.argv[2]
keep_types = set()
blocks_kept = []
LIMIT = int(sys.argv[3]) if len(sys.argv) > 3 else 14

for ch in src["chapters"]:
    for b in ch["blocks"]:
        t = b["type"]
        need = (t not in keep_types) or (t in ("concept", "example") and list(keep_types).count(t) < 2)
        if need and len(blocks_kept) < LIMIT:
            keep_types.add(t)
            blocks_kept.append((ch["title"], b))

# group back into pseudo-chapters
chapters = []
for ctitle, b in blocks_kept:
    if not chapters or chapters[-1]["title"] != ctitle:
        chapters.append({"title": ctitle, "blocks": []})
    chapters[-1]["blocks"].append(b)

out = dict(src)
out["chapters"] = chapters
# trim narrations to keep TTS/silence short
for ch in out["chapters"]:
    for b in ch["blocks"]:
        n = b.get("narration", "")
        if len(n.split()) > 25:
            b["narration"] = " ".join(n.split()[:25])
json.dump(out, open(out_path, "w"), ensure_ascii=False, indent=1)
types = [b["type"] for _, b in blocks_kept]
print(f"test spec: {len(blocks_kept)} blocks, types: {types}")
