#!/usr/bin/env python3
"""Assemble a translated study-guide JSON from subagent batch outputs.
Usage: assemble_translations.py <src.json> <batch_dir> <dst.json>
Merges every batch_NNN.json in batch_dir into {locator: translation},
validates each unit (digit/identifier preservation, length ratio),
prints a report and writes the final document JSON."""
import json, os, sys, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from translate_guide import assemble, is_valid_translation, build_units

def main(src_path, batch_dir, dst_path):
    data = json.load(open(src_path))
    units = build_units(data)
    src_map = {loc: t for loc, t in units}
    done = {}
    files = sorted(f for f in os.listdir(batch_dir) if f.startswith('batch_') and f.endswith('.json'))
    for f in files:
        obj = json.load(open(os.path.join(batch_dir, f)))
        for k, v in obj.items():
            if k in src_map:            # ignore stray locators
                done[k] = str(v).strip()
    print(f'merged {len(files)} batch files, {len(done)} translations')
    missing = [loc for loc, _ in units if loc not in done]
    invalid = [(loc, done[loc], src_map[loc]) for loc, _ in units
               if loc in done and not is_valid_translation(done[loc], src_map[loc])]
    print(f'missing: {len(missing)}; structurally invalid: {len(invalid)}')
    for loc in missing[:10]:
        print(f'  MISSING {loc}: {src_map[loc][:60]!r}')
    for loc, tr, src in invalid[:10]:
        print(f'  INVALID {loc}:')
        print(f'    src: {src[:90]!r}')
        print(f'    tr : {tr[:90]!r}')
    if missing:
        print('!! not assembling: missing units')
        sys.exit(1)
    assemble(data, done, dst_path)
    print(f'written: {dst_path} (invalid items were kept as best-effort)')

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], sys.argv[3])
