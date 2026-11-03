#!/usr/bin/env python3
"""package_dataset.py — собрать flat-датасет для Kaggle (dir-mode там теряет
подкаталоги, поэтому пути кодируем как 'assets__katex__katex.min.js'; кернел
регидратирует заменой '__' → '/').

Выход: video-pipeline-v2/kaggle/ds/ + dataset-metadata.json
"""
import json, os, shutil, sys

BASE = '/home/z/my-project/uuu/video-pipeline-v2'
DS = os.path.join(BASE, 'kaggle', 'ds')

ENGINE_FILES = [
    ('engine/comp.template.html', 'engine__comp.template.html'),
    ('engine/build_comp.py', 'engine__build_comp.py'),
    ('render/render_video.py', 'engine__render_video.py'),
]
ASSET_DIRS = ['engine/assets']

def main():
    if os.path.exists(DS):
        shutil.rmtree(DS)
    os.makedirs(DS)

    # engine files
    for src, dst in ENGINE_FILES:
        shutil.copy(os.path.join(BASE, src), os.path.join(DS, dst))

    # assets tree → flat with __ separators
    for d in ASSET_DIRS:
        root = os.path.join(BASE, d)
        prefix = os.path.basename(os.path.dirname(d)) + '__' + os.path.basename(d)
        for dp, _, fns in os.walk(root):
            for fn in fns:
                rel = os.path.relpath(os.path.join(dp, fn), root)
                flat = prefix + '__' + rel.replace('/', '__')
                shutil.copy(os.path.join(dp, fn), os.path.join(DS, flat))

    # specs (all that exist)
    n_spec = 0
    specs_dir = os.path.join(BASE, 'content', 'specs-v2')
    if os.path.exists(specs_dir):
        for fn in sorted(os.listdir(specs_dir)):
            if fn.endswith('.json'):
                shutil.copy(os.path.join(specs_dir, fn),
                            os.path.join(DS, 'spec__' + fn.replace('.json', '.json')))
                n_spec += 1

    # kernel-side runner + rehydrator
    shutil.copy(os.path.join(BASE, 'kaggle', 'render_kernel.py'),
                os.path.join(DS, 'kernel__render_kernel.py'))

    meta = {'title': 'uuu-video-pipeline',
            'id': 'freedomform/uuu-video-pipeline',
            'licenses': [{'name': 'MIT'}]}
    json.dump(meta, open(os.path.join(DS, 'dataset-metadata.json'), 'w'), indent=1)

    n_files = len(os.listdir(DS))
    size = sum(os.path.getsize(os.path.join(DS, f)) for f in os.listdir(DS))
    print(f'dataset dir: {DS} — {n_files} файлов, {size/1e6:.1f} MB, спеков: {n_spec}')

if __name__ == '__main__':
    main()
