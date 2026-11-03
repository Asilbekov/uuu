#!/usr/bin/env python3
"""ship_videos.py — выкачать отрендеренные видео из Kaggle-кернелов,
залить в GitHub release course-videos-v2, обновить строки Attachment в БД
(url → v2-release), после чего существующий Telegram-workflow подхватит их
и перезальёт в канал с fallbackUrl.

Этапы:
  1. kaggle kernels output → /home/z/my-project/videos-v2/<vid>/<vid>.mp4
  2. GitHub release upload (assets до 2 ГБ, файлы ~100-250 МБ)
  3. UPDATE "Attachment" SET url=<v2>, "fallbackUrl"=NULL, size=<new>
     WHERE id IN (маппинг video id → attachment id)
"""
import argparse, json, os, subprocess, sys, time, urllib.request

GH_TOKEN = os.environ['GH_TOKEN']
REPO = 'Asilbekov/uuu'
RELEASE_TAG = 'course-videos-v2'
KAGGLE_TOKEN = os.environ['KAGGLE_API_TOKEN']
OUT_DIR = '/home/z/my-project/videos-v2'

def sh(cmd, timeout=3600, env=None):
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout, env=env)
    if r.returncode != 0:
        raise RuntimeError(f"FAILED: {cmd[:4]}\n{(r.stderr or r.stdout)[-800:]}")
    return r

def gh_api(path, data=None, method=None, binary=None):
    url = f'https://api.github.com{path}' if path.startswith('/') else path
    req = urllib.request.Request(url, method=method or ('POST' if data is not None else 'GET'))
    req.add_header('Authorization', f'token {GH_TOKEN}')
    req.add_header('Accept', 'application/vnd.github+json')
    body = binary if binary is not None else (json.dumps(data).encode() if data else None)
    if body: req.add_header('Content-Type', 'application/octet-stream' if binary else 'application/json')
    with urllib.request.urlopen(req, timeout=600) as r:
        raw = r.read()
        return json.loads(raw) if raw and not binary else {}

def get_release():
    try:
        return gh_api(f'/repos/{REPO}/releases/tags/{RELEASE_TAG}')
    except urllib.error.HTTPError as e:
        if e.code == 404: return None
        raise

def create_release():
    return gh_api(f'/repos/{REPO}/releases', {
        'tag_name': RELEASE_TAG,
        'name': 'Course videos v2 (onetake-engine, full guide coverage)',
        'body': 'Regenerated course videos: HTML/KaTeX engine, word-synced narration, full study-guide coverage.',
        'draft': False, 'prerelease': False,
    })

def upload_asset(rel, path, name):
    # existing asset with same name → delete first (idempotent re-uploads)
    for a in rel.get('assets', []):
        if a['name'] == name:
            gh_api(f"/repos/{REPO}/releases/assets/{a['id']}", method='DELETE')
    up = rel.get('upload_url').replace('{?name,label}', f'?name={name}')
    with open(path, 'rb') as f:
        gh_api(up, binary=f.read())
    print(f'  uploaded {name} ({os.path.getsize(path)/1e6:.0f} MB)')

def pull_kernel(kernel, dest):
    os.makedirs(dest, exist_ok=True)
    env = dict(os.environ, KAGGLE_API_TOKEN=KAGGLE_TOKEN)
    sh(['kaggle', 'kernels', 'output', f'freedomform/{kernel}', '-p', dest], env=env)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--kernels', nargs='+', required=True,
                    help='kaggle kernel slugs, e.g. uuu-v2en1 uuu-v2en3')
    ap.add_argument('--upload', action='store_true', help='upload to GitHub release')
    ap.add_argument('--db-update', action='store_true', help='update Attachment rows')
    a = ap.parse_args()

    videos = []
    for k in a.kernels:
        d = os.path.join(OUT_DIR, k)
        print(f'pulling {k}…')
        pull_kernel(k, d)
        for root, _, fns in os.walk(d):
            for fn in fns:
                if fn.endswith('.mp4'):
                    vid = fn[:-4]
                    videos.append((vid, os.path.join(root, fn)))
    print(f'\nвидео получено: {len(videos)}')
    for vid, p in sorted(videos):
        print(f'  {vid}: {os.path.getsize(p)/1e6:.0f} MB')

    json.dump({vid: p for vid, p in videos}, open(os.path.join(OUT_DIR, 'manifest.json'), 'w'),
              indent=1)

    if a.upload and videos:
        rel = get_release() or create_release()
        for vid, p in sorted(videos):
            upload_asset(rel, p, vid + '.mp4')
        print('release v2 обновлён')

    if a.db_update and videos:
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        from db_map import ATTACHMENT_BY_VIDEO
        import psycopg2  # replaced by bun later if missing
        raise SystemExit('db update is done by tools/update_db_v2.ts (bun) — use that')

if __name__ == '__main__':
    main()
