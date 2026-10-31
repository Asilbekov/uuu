#!/usr/bin/env python3
"""Split a study-guide source JSON into per-batch unit files for
subagent translation: work/units_<key>/batch_NNN.json, each a JSON object
{locator: text} covering ~3000 characters in document order."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from translate_guide import build_units

def main(src_path, key):
    data = json.load(open(src_path))
    units = build_units(data)
    outdir = f'/home/z/my-project/work/units_{key}'
    os.makedirs(outdir, exist_ok=True)
    for f in os.listdir(outdir):
        os.remove(os.path.join(outdir, f))
    batches, cur, cur_len = [], [], 0
    for loc, t in units:
        if cur and cur_len + len(t) > 3000:
            batches.append(cur); cur, cur_len = [], 0
        cur.append((loc, t)); cur_len += len(t)
    if cur:
        batches.append(cur)
    n = 0
    for b in batches:
        n += 1
        obj = {loc: t for loc, t in b}
        with open(f'{outdir}/batch_{n:03d}.json', 'w') as f:
            json.dump(obj, f, ensure_ascii=False, indent=1)
    print(f'{key}: {len(units)} units -> {n} batches in {outdir}')
    print(f'  batch sizes: min={min(len(b) for b in batches)} max={max(len(b) for b in batches)} units')

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
