#!/usr/bin/env python3
"""upload_release_v2.py — залить готовые mp4 в GitHub release course-videos-v2"""
import json, os, sys, urllib.request, glob

GH_TOKEN = os.environ['GH_TOKEN']
REPO = 'Asilbekov/uuu'
RELEASE_TAG = 'course-videos-v2'
FILES = sys.argv[1:] or sorted(glob.glob('/home/z/my-project/render-out/uuu-v2en*/videos/*/*.mp4'))

def gh_api(path, data=None, method=None, binary=None, timeout=1800):
    url = f'https://api.github.com{path}' if path.startswith('/') else path
    req = urllib.request.Request(url, method=method or ('POST' if data is not None else 'GET'))
    req.add_header('Authorization', f'token {GH_TOKEN}')
    req.add_header('Accept', 'application/vnd.github+json')
    body = binary if binary is not None else (json.dumps(data).encode() if data else None)
    if body:
        req.add_header('Content-Type', 'application/octet-stream' if binary else 'application/json')
        req.data = body
    with urllib.request.urlopen(req, timeout=timeout) as r:
        raw = r.read()
        return json.loads(raw) if raw and not binary else {}

try:
    rel = gh_api(f'/repos/{REPO}/releases/tags/{RELEASE_TAG}')
except urllib.error.HTTPError as e:
    assert e.code == 404, e
    rel = gh_api(f'/repos/{REPO}/releases', {
        'tag_name': RELEASE_TAG,
        'name': 'Course videos v2 (onetake-engine, full guide coverage)',
        'body': 'Regenerated course videos: HTML/KaTeX engine, word-synced narration, full study-guide coverage.',
        'draft': False, 'prerelease': False,
    })
    print('release created:', rel['id'])

for f in FILES:
    name = os.path.basename(f)
    for a in rel.get('assets', []):
        if a['name'] == name:
            gh_api(f"/repos/{REPO}/releases/assets/{a['id']}", method='DELETE')
            print(f'  deleted old asset {name}')
    up = rel['upload_url'].replace('{?name,label}', f'?name={name}')
    with open(f, 'rb') as fh:
        gh_api(up, binary=fh.read())
    print(f'uploaded {name} ({os.path.getsize(f)/1e6:.0f} MB)')
print('DONE')
