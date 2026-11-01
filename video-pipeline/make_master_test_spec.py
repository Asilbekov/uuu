#!/usr/bin/env python3
"""Build a master test spec covering EVERY block type: math (concept+formula+plot+example),
cs (code+table), history (timeline), plus title/section/recap/outro."""
import json

base = json.load(open("/home/z/my-project/scripts/video/specs/math1_w14_en.json"))
cs = json.load(open("/home/z/my-project/scripts/video/specs/cs_w47_en.json"))
hist = json.load(open("/home/z/my-project/scripts/video/specs/hist_w14_en.json"))

def find(spec, t, n=1):
    out = []
    for ch in spec["chapters"]:
        for b in ch["blocks"]:
            if b["type"] == t:
                out.append(b)
                if len(out) >= n:
                    return out
    return out

blocks = []
blocks += find(base, "title")
blocks += find(base, "section", 1)
blocks += find(base, "concept", 2)
blocks += find(base, "formula", 2)
blocks += find(base, "plot", 1)
blocks += find(base, "table", 1)
blocks += find(base, "example", 2)
blocks += find(cs, "code", 2)
blocks += find(cs, "table", 1)
blocks += find(hist, "timeline", 1)
blocks += find(hist, "concept", 1)
blocks += find(base, "recap", 1)
blocks += find(base, "outro")

# shorten narration
for b in blocks:
    n = b.get("narration", "")
    if len(n.split()) > 20:
        b["narration"] = " ".join(n.split()[:20])

out = dict(base)
out["chapters"] = [{"title": "All Types", "blocks": blocks}]
json.dump(out, open("/tmp/test_spec.json", "w"), ensure_ascii=False, indent=1)
print("blocks:", [b["type"] for b in blocks])
