#!/usr/bin/env python3
"""
make_batches.py — generate production batch kernel dirs (CPU-only, no GPU quota).

Each batch dir gets:
  kernel-metadata.json  (unique slug, dataset source = uuu-video-pipeline)
  render.py             (render engine + per-video fault tolerance + its BATCH list)

Usage: python3 make_batches.py
"""
import json, os, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
SRC_KERNEL = os.path.join(HERE, "kaggle-render")

# 31 videos: pilot rebuild (math1_w14_en lost embedded subs in the pilot run)
# + 30 remaining. Mixed languages per batch so issues surface everywhere early.
# GPU enabled (2× T4): manim chunks encode via NVENC with libx264 fallback.
BATCHES = {
    "uuu-render-b1": [
        ("math1_w14_en.json", "Math_I_Weeks_1-4_EN"),
        ("math1_w14_ru.json", "Math_I_Weeks_1-4_RU"),
        ("math1_w14_uz.json", "Math_I_Weeks_1-4_UZ"),
        ("math1_w57_en.json", "Math_I_Weeks_5-7_EN"),
        ("math1_w57_ru.json", "Math_I_Weeks_5-7_RU"),
        ("math1_w57_uz.json", "Math_I_Weeks_5-7_UZ"),
        ("la_w14_en.json", "Linear_Algebra_I_Weeks_1-4_EN"),
        ("la_w14_ru.json", "Linear_Algebra_I_Weeks_1-4_RU"),
        ("la_w14_uz.json", "Linear_Algebra_I_Weeks_1-4_UZ"),
    ],
    "uuu-render-b2": [
        ("la_w57_en.json", "Linear_Algebra_I_Weeks_5-7_EN"),
        ("la_w57_ru.json", "Linear_Algebra_I_Weeks_5-7_RU"),
        ("la_w57_uz.json", "Linear_Algebra_I_Weeks_5-7_UZ"),
        ("hist_w14_en.json", "History_of_Uzbekistan_Weeks_1-4_EN"),
        ("hist_w14_ru.json", "History_of_Uzbekistan_Weeks_1-4_RU"),
        ("hist_w14_uz.json", "History_of_Uzbekistan_Weeks_1-4_UZ"),
        ("hist_w56_en.json", "History_of_Uzbekistan_Weeks_5-6_EN"),
    ],
    "uuu-render-b3": [
        ("hist_w56_ru.json", "History_of_Uzbekistan_Weeks_5-6_RU"),
        ("hist_w56_uz.json", "History_of_Uzbekistan_Weeks_5-6_UZ"),
        ("ite_w14_en.json", "ITE_Weeks_1-4_EN"),
        ("ite_w14_ru.json", "ITE_Weeks_1-4_RU"),
        ("ite_w14_uz.json", "ITE_Weeks_1-4_UZ"),
        ("ite_w57_en.json", "ITE_Weeks_5-7_EN"),
        ("ite_w57_ru.json", "ITE_Weeks_5-7_RU"),
    ],
    "uuu-render-b4": [
        ("ite_w57_uz.json", "ITE_Weeks_5-7_UZ"),
        ("eng_w57_en.json", "English_W5-7_Guide_EN"),
        ("eng_w57_ru.json", "English_W5-7_Guide_RU"),
        ("eng_w57_uz.json", "English_W5-7_Guide_UZ"),
        ("cs_w47_en.json", "Computer_Science_Weeks_4-7_EN"),
        ("cs_w47_ru.json", "Computer_Science_Weeks_4-7_RU"),
        ("cs_w47_uz.json", "Computer_Science_Weeks_4-7_UZ"),
        ("eng_w14qa_en.json", "English_W1-4_QA_EN"),
    ],
}

RENDER_TPL = os.path.join(HERE, "render_batch_tpl.py")

def main():
    # validate batch coverage against specs dir
    specs = {f for f in os.listdir(os.path.join(HERE, "specs")) if f.endswith(".json")
             and not f.startswith(("validate", "final_check"))}
    listed = {sf for b in BATCHES.values() for sf, _ in b}
    missing = specs - listed
    extra = listed - specs
    assert not missing, f"specs not covered: {missing}"
    assert not extra, f"unknown specs listed: {extra}"
    print(f"coverage ok: {len(listed)}/{len(specs)} videos assigned")

    tpl = open(RENDER_TPL).read()
    for slug, batch in BATCHES.items():
        d = os.path.join(HERE, "kaggle-b" + slug[-1] + "-kernel")
        # dirs: kaggle-b1-kernel ...
        if os.path.exists(d):
            shutil.rmtree(d)
        os.makedirs(d)
        meta = {
            "id": f"freedomform/{slug}",
            "title": slug,
            "code_file": "render.py",
            "language": "python",
            "kernel_type": "script",
            "is_private": True,
            "enable_gpu": True,
            "enable_internet": True,
            "dataset_sources": ["freedomform/uuu-video-pipeline"],
            "kernel_sources": [],
            "competition_sources": [],
            "model_sources": [],
            "kernel_metadata_version": 1,
        }
        with open(os.path.join(d, "kernel-metadata.json"), "w") as f:
            json.dump(meta, f, indent=1)
        batch_lines = ",\n".join(
            f"    ({json.dumps(sf)}, {json.dumps(name)})" for sf, name in batch)
        code = tpl.replace("##BATCH##", batch_lines)
        with open(os.path.join(d, "render.py"), "w") as f:
            f.write(code)
        print(f"{slug}: {len(batch)} videos → {d}")

if __name__ == "__main__":
    main()
