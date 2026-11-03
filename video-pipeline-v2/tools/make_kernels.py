#!/usr/bin/env python3
"""make_kernels.py — сгенерировать N кернел-папок со сбалансированными по
хронометражу списками видео (greedy: самое длинное — в наименее загруженный).

python3 make_kernels.py --specs <dir> --n 5 --prefix v2c --out kaggle/
"""
import argparse, json, os, shutil

WORD_RATES = {'en': 145, 'ru': 125, 'uz': 125}   # слов в минуту озвучки

def est_minutes(spec):
    words = sum(len(s.split()) for ch in spec['chapters'] for b in ch['blocks']
                for s in (b.get('narr') or []))
    return words / WORD_RATES.get(spec['language'], 135) * 1.28   # + паузы/паддинги

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--specs', required=True)
    ap.add_argument('--n', type=int, default=5)
    ap.add_argument('--prefix', default='v2c')
    ap.add_argument('--out', required=True)
    ap.add_argument('--username', default='freedomform')
    a = ap.parse_args()

    vids = []
    for fn in sorted(os.listdir(a.specs)):
        if fn.endswith('.json'):
            spec = json.load(open(os.path.join(a.specs, fn)))
            m = est_minutes(spec)
            vids.append({'id': fn[:-5], 'min': m, 'blocks':
                         sum(len(c['blocks']) for c in spec['chapters'])})
    vids.sort(key=lambda v: -v['min'])
    print(f'{len(vids)} видео, суммарно {sum(v["min"] for v in vids)/60:.1f} ч:')
    for v in vids:
        print(f'  {v["id"]:18} ~{v["min"]:5.0f} мин ({v["blocks"]} блоков)')

    # greedy balance
    buckets = [[] for _ in range(a.n)]
    loads = [0.0]*a.n
    for v in vids:
        i = loads.index(min(loads))
        buckets[i].append(v)
        loads[i] += v['min']

    # write kernel dirs
    base_kernel = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                               '..', 'kaggle', 'render_kernel.py')
    for i, bucket in enumerate(buckets):
        if not bucket: continue
        name = f'{a.prefix}{i+1}'
        kd = os.path.join(a.out, name)
        os.makedirs(kd, exist_ok=True)
        src = open(base_kernel).read()
        src = src.replace('VIDEOS = []',
                          'VIDEOS = ' + json.dumps([v['id'] for v in bucket]))
        open(os.path.join(kd, 'render.py'), 'w').write(src)
        json.dump({
            'id': f'{a.username}/uuu-{name}',
            'title': f'uuu-{name}',
            'code_file': 'render.py',
            'language': 'python',
            'kernel_type': 'script',
            'is_private': True,
            'enable_gpu': False,
            'enable_internet': True,
            'dataset_sources': [f'{a.username}/uuu-video-pipeline'],
            'kernel_sources': [], 'competition_sources': [], 'model_sources': [],
            'kernel_metadata_version': 1,
        }, open(os.path.join(kd, 'kernel-metadata.json'), 'w'), indent=1)
        print(f'  → {name}: {len(bucket)} видео, ~{loads[i]/60:.1f} ч: '
              + ', '.join(v['id'] for v in bucket))

if __name__ == '__main__':
    main()
