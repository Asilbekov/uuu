#!/usr/bin/env python3
"""render_kernel.py — Kaggle CPU kernel: rehydrate the pipeline from the flat
dataset, then render this kernel's assigned videos with per-video fault
tolerance and incremental checkpoints to /kaggle/working/videos.

The video list is appended at the bottom by tools/make_kernels.py as:
    VIDEOS = ['math1_w14_en', ...]
"""
import json, os, subprocess, sys, time, traceback

T0 = time.time()
WORK = '/kaggle/working'
INPUT_CANDIDATES = [
    '/kaggle/input/uuu-video-pipeline',
    '/kaggle/input/datasets/freedomform/uuu-video-pipeline',
]
PIPE = f'{WORK}/pipeline'
VIDS = f'{WORK}/videos'
REPORT = f'{WORK}/render_report.json'
LOG = []

def log(msg):
    line = f'[{time.time()-T0:8.0f}s] {msg}'
    print(line, flush=True)
    LOG.append(line)

def sh(cmd, timeout=7200, check=True):
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
    if check and r.returncode != 0:
        raise RuntimeError(f"FAILED ({r.returncode}): {' '.join(map(str, cmd[:5]))}\n"
                           + (r.stderr or r.stdout)[-1500:])
    return r

def phase(name, fn):
    t0 = time.time()
    try:
        out = fn()
        log(f'phase {name}: ok ({time.time()-t0:.0f}s)')
        return out
    except Exception as e:
        log(f'phase {name}: FAILED: {str(e)[:400]}')
        traceback.print_exc()
        raise

# ── setup ───────────────────────────────────────────────────────────────
def setup_pip():
    sh([sys.executable, '-m', 'pip', 'install', '-q', '--no-warn-script-location',
        'playwright', 'edge-tts', 'pillow'], timeout=1800)

def setup_browser():
    # Kaggle runs as root: --with-deps apt-gets the chromium libs
    sh([sys.executable, '-m', 'playwright', 'install', 'chromium', '--with-deps'],
       timeout=1800)

def find_input():
    import glob
    for pat in INPUT_CANDIDATES + ['/kaggle/input/datasets/*/uuu-video-pipeline']:
        for p in glob.glob(pat):
            if os.path.isdir(p) and os.listdir(p):
                return p
    raise RuntimeError('dataset not mounted: ' + repr(
        {d: os.listdir(f'/kaggle/input/{d}') for d in os.listdir('/kaggle/input')}))

def rehydrate():
    """flat 'a__b__c' files → pipeline/a/b/c"""
    global INPUT
    INPUT = find_input()
    os.makedirs(PIPE, exist_ok=True)
    for fn in os.listdir(INPUT):
        if fn.startswith('spec__'):
            rel = 'specs/' + fn[len('spec__'):]
        elif '__' in fn:
            rel = fn.replace('__', '/')
        else:
            continue
        dst = os.path.join(PIPE, rel)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        with open(os.path.join(INPUT, fn), 'rb') as fsrc, open(dst, 'wb') as fdst:
            fdst.write(fsrc.read())
    n = sum(len(fs) for _, _, fs in os.walk(PIPE))
    log(f'rehydrated {n} files into {PIPE}')
    return n

# ── main ────────────────────────────────────────────────────────────────
def render_one(vid):
    spec = os.path.join(PIPE, 'specs', vid + '.json')
    if not os.path.exists(spec):
        raise RuntimeError('spec missing: ' + vid)
    out_dir = os.path.join(VIDS, vid)
    os.makedirs(out_dir, exist_ok=True)
    workdir = f'{WORK}/work/{vid}'
    r = subprocess.run([sys.executable, os.path.join(PIPE, 'engine', 'render_video.py'),
                        '--spec', spec, '--out', out_dir, '--workdir', workdir,
                        '--workers', '3'], capture_output=True, text=True, timeout=5*3600)
    tail = (r.stdout or '').strip().split('\n')[-4:]
    if r.returncode != 0:
        raise RuntimeError(f'render exit {r.returncode}: ' + (r.stderr or '')[-800:]
                           + ' | ' + ' / '.join(tail))
    return ' | '.join(tail)

def main():
    os.makedirs(VIDS, exist_ok=True)
    phase('pip', setup_pip)
    phase('browser', setup_browser)
    phase('rehydrate', rehydrate)

    results = {}
    for vid in VIDEOS:
        if os.path.exists(os.path.join(VIDS, vid, vid + '.mp4')):
            log(f'{vid}: already rendered, skip')
            results[vid] = 'cached'
            continue
        t0 = time.time()
        try:
            info = render_one(vid)
            results[vid] = f'ok ({(time.time()-t0)/60:.0f} min): {info[:150]}'
            log(f'{vid}: DONE ({(time.time()-t0)/60:.0f} min)')
        except Exception as e:
            results[vid] = f'FAILED: {str(e)[:300]}'
            log(f'{vid}: FAILED — {str(e)[:300]}')
        json.dump({'log': LOG, 'results': results, 't': time.time()-T0},
                  open(REPORT, 'w'), indent=1)
    log('=== kernel complete ===')
    json.dump({'log': LOG, 'results': results, 't': time.time()-T0},
              open(REPORT, 'w'), indent=1)

# assigned videos (patched per-kernel by make_kernels.py; balance by est. minutes)
VIDEOS = ["math1_w57_en"]

if __name__ == '__main__':
    main()
