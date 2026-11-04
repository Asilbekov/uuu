#!/usr/bin/env python3
"""check_mathsplit.py — replicate the engine's mathSplit + KaTeX on every text
field of every spec; print failing fragments (the same errors render_video
raises as raw_latex_on_screen / KaTeX errors)."""
import json, re, subprocess, sys, tempfile, os, glob

KATEX_JS = '/home/z/my-project/uuu/video-pipeline-v2/engine/assets/katex/katex.min.js'

def mathish(s):
    if not s: return False
    if re.search(r'[\\^_{}]', s): return True
    if re.search(r'[=+<>≤≥≈±×·]', s): return True
    if re.search(r'[A-Za-zÀ-ÿА-Яа-яЁё]{3,}', s.strip()): return False
    return True

def math_split(text):
    out = []
    re2 = re.compile(r'\$([^$]{1,400})\$|(\\begin\{([a-zA-Z*]+)\}[\s\S]{0,600}?\\end\{\3\})')
    last = 0
    for m in re2.finditer(text):
        is_env = m.group(2) is not None
        if not is_env and not mathish(m.group(1)):
            continue
        if m.start() > last:
            out.append(('text', text[last:m.start()]))
        out.append(('math', m.group(2) if is_env else m.group(1)))
        last = m.end()
    if last < len(text):
        out.append(('text', text[last:]))
    return out

TEXT_KEYS = {'heading', 'text', 'problem', 'result', 'note', 'who', 'subtitle',
             'title', 'year', 'label'}

def collect_strings(o, out):
    if isinstance(o, dict):
        for k, v in o.items():
            if k in TEXT_KEYS and isinstance(v, str):
                out.append(v)
            elif k in ('bullets', 'items') and isinstance(v, list):
                out.extend(x for x in v if isinstance(x, str))
            elif isinstance(v, (dict, list)):
                collect_strings(v, out)
    elif isinstance(o, list):
        for x in o:
            collect_strings(x, out)

def main(spec_path):
    d = json.load(open(spec_path))
    strs = []
    collect_strings(d.get('chapters', []), strs)
    frags = []
    for s in strs:
        for kind, seg in math_split(s):
            if kind == 'math':
                frags.append(seg)
            elif '\\' in seg:
                # raw text with latex commands that mathSplit leaves as text — engine check flags some
                frags.append(('RAWTEXT', seg))
    # dedupe
    uniq = sorted(set(frags), key=lambda x: (isinstance(x, tuple), str(x)))
    texs = [f[1] if isinstance(f, tuple) else f for f in uniq if not (isinstance(f, tuple) and f[0] == 'RAWTEXT')]
    raws = [f[1] for f in uniq if isinstance(f, tuple) and f[0] == 'RAWTEXT']
    bad_tex, bad_raw = [], []
    if texs:
        payload = json.dumps(texs)
        script = f'''
const katex = require({json.dumps(KATEX_JS)});
const texs = {payload};
let bad = [];
for (const t of texs) {{
  try {{ katex.renderToString(t, {{throwOnError: true, strict: 'ignore'}}); }}
  catch (e) {{ bad.push(t); }}
}}
console.log(JSON.stringify(bad));
'''
        with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as f:
            f.write(script); p = f.name
        r = subprocess.run(['node', p], capture_output=True, text=True, timeout=180)
        os.unlink(p)
        if r.returncode == 0:
            bad_tex = json.loads(r.stdout or '[]')
    RAW_CMD = re.compile(r'\\(frac|sqrt|sum|int|begin\{[a-z]+\}|end\{[a-z]+\}|cdot|times)')
    bad_raw = [s for s in raws if RAW_CMD.search(s)]
    print(f'{os.path.basename(spec_path)}: frags={len(texs)} katex_bad={len(bad_tex)} rawtext_bad={len(bad_raw)}')
    for t in bad_tex[:6]:
        print('  KATEX:', t[:130])
    for t in bad_raw[:6]:
        print('  RAWTEXT:', t[:130])
    return bad_tex, bad_raw

if __name__ == '__main__':
    for p in (sys.argv[1:] or sorted(glob.glob('/home/z/my-project/uuu/video-pipeline-v2/content/specs-v2/*.json'))):
        main(p)
