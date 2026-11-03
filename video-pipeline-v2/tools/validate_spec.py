#!/usr/bin/env python3
"""validate_spec.py — KaTeX compile + plot eval + language sanity for a v2 spec."""
import argparse, json, os, re, subprocess, sys, tempfile

KATEX_JS = '/home/z/my-project/uuu/video-pipeline-v2/engine/assets/katex/katex.min.js'

def katex_check(texs):
    """node + katex.renderToString on every tex; returns list of failures."""
    payload = json.dumps(texs)
    script = f'''
const katex = require({json.dumps(KATEX_JS)});
const texs = {payload};
let bad = [];
for (const [i, t] of texs.entries()) {{
  try {{ katex.renderToString(t, {{throwOnError: true, strict: 'ignore'}}); }}
  catch (e) {{ bad.push(i + ': ' + String(e.message).slice(0, 110) + ' << ' + t.slice(0, 60)); }}
}}
console.log(JSON.stringify(bad));
'''
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as f:
        f.write(script); p = f.name
    r = subprocess.run(['node', p], capture_output=True, text=True, timeout=120)
    os.unlink(p)
    if r.returncode != 0:
        return [f'node/katex failed: {r.stderr[:200]}']
    return json.loads(r.stdout or '[]')

def plot_check(fns):
    import numpy as np
    bad = []
    for f in fns:
        try:
            x = np.linspace(0, 1, 5)
            v = eval(f, {'np': np, 'x': x, 'math': __import__('math')})
            float(np.asarray(v).ravel()[0])
        except Exception as e:
            bad.append(f'{f[:60]}: {str(e)[:80]}')
    return bad

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--spec', required=True)
    a = ap.parse_args()
    spec = json.load(open(a.spec))
    lang = spec['language']

    texs, plots = [], []
    n_blocks = 0
    for ch in spec['chapters']:
        for b in ch['blocks']:
            n_blocks += 1
            d = b.get('data', {})
            if b['type'] in ('formula', 'matrix') and d.get('tex'):
                texs.append(d['tex'])
            if b['type'] == 'table':
                for row in d.get('rows', []):
                    for c in row:
                        if isinstance(c, dict) and c.get('tex'):
                            texs.append(c['tex'])
            if b['type'] == 'plot':
                for f in d.get('functions', []):
                    if f.get('fn'): plots.append(f['fn'])
    kbad = katex_check(texs) if texs else []
    pbad = plot_check(plots) if plots else []

    # language sanity: cyrillic ratio for ru; latin+uz-chars for uz
    text = ' '.join(s for ch in spec['chapters'] for b in ch['blocks'] for s in b.get('narr', []))
    cyr = len(re.findall(r'[а-яА-ЯёЁ]', text))
    lat = len(re.findall(r'[a-zA-Z]', text))
    lang_ratio = cyr / max(1, cyr + lat)
    lang_ok = (lang == 'ru' and lang_ratio > 0.5) or (lang != 'ru' and lang_ratio < 0.5)

    print(f"{spec['id']}_{lang}: {n_blocks} блоков | tex: {len(texs)} (fail {len(kbad)}) | "
          f"plots: {len(plots)} (fail {len(pbad)}) | язык: {'ok' if lang_ok else f'ПОХОЖЕ НЕ {lang}'} "
          f"(cyr {lang_ratio:.2f})")
    for e in kbad[:8]: print('  KaTeX:', e)
    for e in pbad[:8]: print('  plot:', e)
    sys.exit(1 if (kbad or pbad or not lang_ok) else 0)

if __name__ == '__main__':
    main()
