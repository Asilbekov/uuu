#!/usr/bin/env python3
"""Build the FLAT Kaggle dataset staging dir.

The kaggle CLI skips subdirectories by default (--dir-mode skip), which cost
us a broken v3 (specs/ and engine/ silently dropped). This script flattens:

  specs/<name>.json  → spec__<name>.json
  engine/<name>.py   → engine__<name>.py
  build.py           → build.py

The kernel rehydrates the layout (see render_batch_tpl.py setup_pipeline).
"""
import json, os, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "kaggle-ds-flat")

def main():
    if os.path.exists(SRC):
        shutil.rmtree(SRC)
    os.makedirs(SRC)

    # metadata (same dataset id)
    shutil.copy(os.path.join(HERE, "kaggle-ds", "dataset-metadata.json"),
                os.path.join(SRC, "dataset-metadata.json"))

    # engine (3 files, exactly what build.py imports)
    for f in sorted(os.listdir(os.path.join(HERE, "engine"))):
        if f.endswith(".py"):
            shutil.copy(os.path.join(HERE, "engine", f),
                        os.path.join(SRC, "engine__" + f))

    # specs — the 31 production jsons (exclude validators/parts)
    n = 0
    for f in sorted(os.listdir(os.path.join(HERE, "specs"))):
        if f.endswith(".json"):
            shutil.copy(os.path.join(HERE, "specs", f),
                        os.path.join(SRC, "spec__" + f))
            n += 1

    # build engine
    shutil.copy(os.path.join(HERE, "build.py"), os.path.join(SRC, "build.py"))

    # integrity check: rehydratable, no subdirs
    entries = sorted(os.listdir(SRC))
    assert not any(os.path.isdir(os.path.join(SRC, e)) for e in entries), "no subdirs allowed"
    n_spec = sum(1 for e in entries if e.startswith("spec__"))
    n_eng = sum(1 for e in entries if e.startswith("engine__"))
    assert n_spec == 31, f"expected 31 specs, got {n_spec}"
    assert n_eng == 3, f"expected 3 engine files, got {n_eng}"
    assert "build.py" in entries
    total = sum(os.path.getsize(os.path.join(SRC, e)) for e in entries)
    print(f"flat dataset staged at {SRC}: {n_spec} specs, {n_eng} engine, "
          f"build.py, {len(entries)} files, {total/1e6:.2f} MB")

if __name__ == "__main__":
    main()
