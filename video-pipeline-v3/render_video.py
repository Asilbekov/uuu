#!/usr/bin/env python3
"""render_video.py — one spec → one finished course video. CPU-only.

Runs identically in the local sandbox and on a Kaggle CPU session:

  python3 render_video.py --spec spec.json --out /out/dir [--workdir /tmp/w]

Stages (all checkpointed under workdir, resumable):
  1. TTS    — edge-tts per narration segment → seg mp3 + durations → times.json
  2. AUDIO  — per-block wavs (pads + segments) → narration.wav (24 kHz mono)
  3. COMP   — build_comp.py → comp.html (+assets, timeline.json)
  4. VALID  — playwright: seek every block mid-time; DOM + KaTeX + reveal checks
              (NO silent fallbacks: any defect aborts the video loudly)
  5. PLAN   — frame plan from the move registry (moving frames + static runs)
  6. SHOOT  — parallel browser workers capture JPEGs (only planned frames)
  7. ENCODE — ffmpeg concat-demuxer → x264 + aac, chapters, faststart
  8. QA     — ffprobe duration/streams + sample stills + blankness check

Spec v2 block shape (what the LLM must produce):
  { "type": "concept", "data": {...}, "narr": ["...", "..."],
    "narr_item": [-1, 0, 0, 1] }     # segment k explains item narr_item[k]
"""
import argparse, asyncio, hashlib, json, math, os, re, shutil, subprocess, sys, time
from concurrent.futures import ProcessPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
ENGINE = os.path.join(HERE, 'engine')

FPS = 30
VOICES = {'en': ['en-US-AndrewMultilingualNeural', 'en-US-GuyNeural'],
          'ru': ['ru-RU-SvetlanaNeural', 'ru-RU-DmitryNeural'],
          'uz': ['uz-UZ-SardorNeural', 'uz-UZ-MadinaNeural']}

def sh(cmd, timeout=7200, check=True, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout, **kw)
    if check and r.returncode != 0:
        raise RuntimeError(f"FAILED ({r.returncode}): {cmd[:4]}\n{(r.stderr or r.stdout)[-1500:]}")
    return r

def log(msg):
    print(f'[{time.time()-T0:7.1f}s] {msg}', flush=True)

T0 = time.time()

# ─────────────────── LaTeX → speakable text (for TTS) ────────────────────
GREEK = {'alpha':'alpha','beta':'beta','gamma':'gamma','delta':'delta','epsilon':'epsilon',
         'zeta':'zeta','eta':'eta','theta':'theta','iota':'iota','kappa':'kappa','lambda':'lambda',
         'mu':'mu','nu':'nu','xi':'xi','rho':'rho','sigma':'sigma','tau':'tau','phi':'phi',
         'chi':'chi','psi':'psi','omega':'omega','Delta':'delta','Sigma':'sigma','Omega':'omega',
         'Phi':'phi','Pi':'pi','Theta':'theta','Lambda':'lambda','Gamma':'gamma'}
SYM = {'cdot':'times','times':'times','pm':'plus or minus','mp':'minus or plus',
       'leq':'less than or equal to','le':'less than or equal to','geq':'greater than or equal to',
       'ge':'greater than or equal to','neq':'not equal to','ne':'not equal to',
       'approx':'approximately','cong':'is congruent to','equiv':'is equivalent to',
       'sim':'is similar to','propto':'is proportional to','infty':'infinity',
       'to':'to','rightarrow':'to','mapsto':'maps to','in':'in','notin':'not in',
       'subset':'is a subset of','subseteq':'is a subset of','cup':'union','cap':'intersection',
       'forall':'for all','exists':'there exists','emptyset':'the empty set',
       'therefore':'therefore','because':'because','ldots':'dot dot dot','dots':'dot dot dot',
       'cdots':'dot dot dot','vdots':'dot dot dot','perp':'perpendicular','parallel':'parallel',
       'angle':'angle','circ':'degrees','degree':'degrees','quad':' ','qquad':' ',
       'left':'','right':'','big':'','Big':'','bigl':'','bigr':'','langle':'angle bracket',
       'rangle':'angle bracket','max':'maximum','min':'minimum','log':'log','ln':'natural log',
       'sin':'sine','cos':'cosine','tan':'tangent','cot':'cotangent','sec':'secant','csc':'cosecant',
       'lim':'limit','sum':'sum','prod':'product','int':'integral','det':'determinant',
       'dim':'dimension','deg':'degree','exp':'e to the power of'}
RU_SYM = {'times':'умножить на','plus or minus':'плюс-минус','less than or equal to':'меньше или равно',
          'greater than or equal to':'больше или равно','not equal to':'не равно','approximately':'примерно',
          'infinity':'бесконечность','to':'к','in':'принадлежит','union':'объединение',
          'intersection':'пересечение','for all':'для всех','there exists':'существует',
          'dot dot dot':'и так далее','perpendicular':'перпендикулярно','parallel':'параллельно',
          'angle':'угол','degrees':'градусов','limit':'предел','sum':'сумма','product':'произведение',
          'integral':'интеграл','maximum':'максимум','minimum':'минимум','sine':'синус','cosine':'косинус',
          'tangent':'тангенс','pi':'пи','theta':'тета','lambda':'лямбда','alpha':'альфа','beta':'бета',
          'delta':'дельта','epsilon':'эпсилон','sigma':'сигма','mu':'мю','phi':'фи','omega':'омега',
          'sqrt':'корень из','frac':'дробь','overline':'с чертой','determinant':'определитель',
          'vector':'вектор','matrix':'матрица','over':'делённое на','the square root of':'корень из',
          'to the power of':'в степени','sub':'с индексом','the absolute value of':'модуль',
          'bar':'с чертой','is a subset of':'является подмножеством','not in':'не принадлежит'}
UZ_SYM = {'times':'ko\u2018paytirgan','plus or minus':'plus yoki minus','less than or equal to':'kichik yoki teng',
          'greater than or equal to':'katta yoki teng','not equal to':'teng emas','approximately':'taxminan',
          'infinity':'cheksizlik','to':'ga','in':'tegishli','dot dot dot':'va hokazo','angle':'burchak',
          'degrees':'gradus','limit':'limit','sum':'yig\u2018indi','integral':'integral','pi':'pi',
          'sqrt':'ildiz','frac':'kasr','the square root of':'kvadrat ildiz',
          'to the power of':'darajada','sub':'indeks','the absolute value of':'modul','over':'bo\u2018lingan'}

def _mathish(inner):
    """Same rule as the template: currency/prose dollars stay literal."""
    if re.search(r'[\\^_{}]', inner): return True
    if re.search(r'[=+<>\u2264\u2265\u2248\u00b1\u00d7\u00b7]', inner): return True
    if re.search(r'[A-Za-z\u00c0-\u00ff\u0400-\u04ff]{3,}', inner.strip()): return False
    return True

def latex_to_speech(text, lang='en'):
    t = str(text)
    # $...$ math fragments FIRST (skip literal/currency leftovers);
    # pairs must be tested before single-$ currency amounts eat a "$8.24 …"
    def dollar_pair(m):
        inner = m.group(1)
        return ' ' + inner + ' ' if _mathish(inner) else m.group(0)
    t = re.sub(r'\$([^$]{1,400})\$', dollar_pair, t)
    # currency amounts: $1,990,000 / $5 → spoken amount (lookahead ^_{ = math)
    t = re.sub(r'\$([\d,]+(?:\.\d+)?)(?![\d,\^_])(\s*(?:million|thousand|billion|dollars)\b)?',
               lambda m: ' ' + m.group(1) + (' ' + (m.group(2) or '').strip() if m.group(2) else ' dollars') + ' ', t)
    # \begin{env}...\end{env} → components
    def env_repl(m):
        inner = m.group(3).replace('\\\\', ' , ').replace('&', ' , ')
        return ' ' + inner + ' '
    t = re.sub(r'(\\begin\{(bmatrix|pmatrix|matrix|vmatrix|cases|array|aligned)\})([\s\S]{0,600}?)(\\end\{\2\})', env_repl, t)
    # structured commands
    t = re.sub(r'\\sqrt\s*\{([^{}]*)\}', r' the square root of \1 ', t)
    t = re.sub(r'\\frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}', r' \1 over \2 ', t)
    t = re.sub(r'\\overline\s*\{([^{}]*)\}', r' \1 bar ', t)
    t = re.sub(r'\\(?:mathbb|mathrm|mathbf|mathit|operatorname|text)\s*\{([^{}]*)\}', r' \1 ', t)
    # \lim_{x \to a} → "the limit as x goes to a" (before subscript passes
    # break the command name); generic \cmd_ protection for log/sin/max…
    def lim_repl(m):
        var = m.group(1).replace('\\to', ' goes to ').replace('\\rightarrow', ' goes to ')
        return f' the limit as {var} '
    t = re.sub(r'\\lim\s*_\s*\{([^{}]*)\}', lim_repl, t)
    def cmd_sub_repl(m):
        name = GREEK.get(m.group(1)) or SYM.get(m.group(1)) or m.group(1)
        return f' {name} sub '
    t = re.sub(r'\\([A-Za-z]+)\s*_\s*(?=[{A-Za-z0-9])', cmd_sub_repl, t)
    # powers / subscripts
    t = re.sub(r'([A-Za-z0-9)])\^\{([^{}]*)\}', r' \1 to the power of \2 ', t)
    t = re.sub(r'([A-Za-z0-9)])\^([A-Za-z0-9])', r' \1 to the power of \2 ', t)
    t = re.sub(r'([A-Za-z0-9)])_\{([^{}]*)\}', r' \1 sub \2 ', t)
    t = re.sub(r'([A-Za-z0-9)])_([A-Za-z0-9])', r' \1 sub \2 ', t)
    # greek + symbols
    def cmd_repl(m):
        name = m.group(1)
        if name in GREEK: return ' ' + GREEK[name] + ' '
        if name in SYM: return ' ' + SYM[name] + ' '
        return ' ' + name + ' '
    t = re.sub(r'\\([A-Za-z]+)', cmd_repl, t)
    t = t.replace('\\\\', ' and ').replace('\\', ' ')
    t = re.sub(r'\{([^{}]*)\}', r'\1', t)
    t = t.replace('}', ' ').replace('{', ' ')
    t = re.sub(r'\|([^|]{1,40})\|', r' the absolute value of \1 ', t)
    # language polish
    if lang != 'en':
        table = RU_SYM if lang == 'ru' else UZ_SYM
        for k, v in table.items():
            t = re.sub(r'(?<![\u0400-\u04ffA-Za-z])' + re.escape(k) + r'(?![\u0400-\u04ffA-Za-z])', v, t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

# ────────────────────────────── 1. TTS ──────────────────────────────────
async def tts_segments(spec, workdir):
    """edge-tts per segment, with WordBoundary capture for word-sync highlights."""
    import edge_tts
    voices = VOICES[spec['language']]
    segs_dir = os.path.join(workdir, 'segs')
    os.makedirs(segs_dir, exist_ok=True)
    times, words = {}, {}
    n_seg = 0
    blocks = [b for ch in spec['chapters'] for b in ch['blocks']]
    TTS_SEM = asyncio.Semaphore(3)   # gentle on the MS endpoint from datacenter IPs
    async def synth_one(bi, si, text, mp3, wpath):
        async with TTS_SEM:
            delays = [2, 5, 10, 20, 40, 60, 60, 90]
            for attempt in range(8):
                try:
                    voice = voices[min(attempt // 3, len(voices)-1)]
                    comm = edge_tts.Communicate(text, voice, rate='-2%', volume='+0%')
                    wbuf = []
                    n_audio = 0
                    async def collect():
                        nonlocal n_audio
                        with open(mp3 + '.part', 'wb') as f:
                            async for chunk in comm.stream():
                                if chunk['type'] == 'audio':
                                    f.write(chunk['data']); n_audio += len(chunk['data'])
                                elif chunk['type'] == 'WordBoundary':
                                    wbuf.append({'w': chunk['text'],
                                                 't': chunk['offset']/1e7,
                                                 'd': chunk['duration']/1e7})
                    # edge-tts occasionally opens a socket and never finishes.
                    # A hard deadline is essential for unattended Kaggle runs.
                    await asyncio.wait_for(collect(), timeout=75)
                    if n_audio < 200:
                        raise RuntimeError(f'no audio ({n_audio}B)')
                    os.replace(mp3 + '.part', mp3)
                    json.dump(wbuf, open(wpath, 'w'))
                    return True
                except Exception as exc:
                    print(f'  [tts] b{bi} s{si} attempt {attempt+1}: {type(exc).__name__}', flush=True)
                    if attempt == 7: raise
                    await asyncio.sleep(delays[attempt] + (bi % 5))
    job_params = []   # (bi, si, text, mp3, wpath)
    for bi, blk in enumerate(blocks):
        for si, text in enumerate(blk.get('narr') or ['']):
            text = latex_to_speech((text or '').strip(), spec['language'])
            if not text: continue
            mp3 = os.path.join(segs_dir, f'b{bi:04d}_s{si:02d}.mp3')
            wpath = os.path.join(segs_dir, f'b{bi:04d}_s{si:02d}.words.json')
            if not os.path.exists(mp3) or os.path.getsize(mp3) < 400:
                job_params.append((bi, si, text, mp3, wpath))
    if job_params:
        results = await asyncio.gather(
            *[synth_one(*p) for p in job_params], return_exceptions=True)
        retry_params = [p for p, r in zip(job_params, results) if isinstance(r, Exception)]
        if retry_params:
            print(f'  [tts] {len(retry_params)} segments → serial retry', flush=True)
            await asyncio.sleep(90)
            for bi, si, text, mp3, wpath in retry_params:
                for attempt in range(3):
                    try:
                        await synth_one(bi, si, text, mp3, wpath)
                        break
                    except Exception as e:
                        print(f'  [tts] serial b{bi} s{si}: {str(e)[:80]}', flush=True)
                        if attempt == 2: raise
                        await asyncio.sleep(120)
    for bi, blk in enumerate(blocks):
        texts = blk.get('narr') or ['']
        durs, bw = [], []
        for si, text in enumerate(texts):
            text = (text or '').strip()
            if not text:
                durs.append(0.0); bw.append([]); continue
            mp3 = os.path.join(segs_dir, f'b{bi:04d}_s{si:02d}.mp3')
            wpath = os.path.join(segs_dir, f'b{bi:04d}_s{si:02d}.words.json')
            wbuf = json.load(open(wpath)) if os.path.exists(wpath) else []
            bw.append(wbuf)
            d = float(sh(['ffprobe','-v','quiet','-show_entries','format=duration',
                          '-of','csv=p=0', mp3]).stdout.strip())
            durs.append(round(d, 3)); n_seg += 1
        times[str(bi)] = durs
        words[str(bi)] = bw
    json.dump(times, open(os.path.join(workdir, 'times.json'), 'w'))
    json.dump(words, open(os.path.join(workdir, 'words.json'), 'w'))
    log(f'TTS ok: {n_seg} segments (word boundaries captured)')
    return times

# ───────────────────────────── 2. AUDIO ─────────────────────────────────
def build_audio(spec, times, workdir, out_wav):
    PAD_IN, PAD_OUT, BREATH = 0.9, 0.75, 0.18
    sys.path.insert(0, ENGINE)
    from build_comp import resolve_holds
    holds = resolve_holds(spec, times)
    SR = 24000
    tmp = os.path.join(workdir, 'aud'); os.makedirs(tmp, exist_ok=True)
    blocks = [b for ch in spec['chapters'] for b in ch['blocks']]
    pieces = []
    sil_cache = {}
    def sil(dur):
        key = round(dur, 3)
        if key not in sil_cache:
            f = os.path.join(tmp, f'sil_{int(key*1000):06d}.wav')
            sh(['ffmpeg','-y','-v','quiet','-f','lavfi','-i',
                f'anullsrc=r={SR}:cl=mono','-t',f'{key:.3f}','-c:a','pcm_s16le',f])
            sil_cache[key] = f
        return sil_cache[key]
    def wav_of(bi, si):
        mp3 = os.path.join(workdir, 'segs', f'b{bi:04d}_s{si:02d}.mp3')
        if not os.path.exists(mp3):
            return None
        w = os.path.join(tmp, f'w_b{bi:04d}_s{si:02d}.wav')
        if not os.path.exists(w):
            sh(['ffmpeg','-y','-v','quiet','-i',mp3,'-ar',str(SR),'-ac','1','-c:a','pcm_s16le',w])
        return w
    for bi, blk in enumerate(blocks):
        durs = times[str(bi)]
        pieces.append(sil(PAD_IN))
        for si, d in enumerate(durs):
            if d <= 0: continue
            pieces.append(wav_of(bi, si))
            if si < len(durs)-1:
                pieces.append(sil(BREATH))
        if holds[str(bi)] > 0:
            pieces.append(sil(holds[str(bi)]))
        pieces.append(sil(PAD_OUT))
    lst = os.path.join(tmp, 'concat.txt')
    with open(lst, 'w') as f:
        for p in pieces:
            if p: f.write(f"file '{p}'\n")
    sh(['ffmpeg','-y','-v','quiet','-f','concat','-safe','0','-i',lst,
        '-af','loudnorm=I=-16:TP=-1.5:LRA=11','-c:a','pcm_s16le',out_wav])
    dur = float(sh(['ffprobe','-v','quiet','-show_entries','format=duration','-of','csv=p=0',out_wav]).stdout.strip())
    log(f'audio ok: {dur/60:.2f} min')
    return dur

# ───────────────────────────── 4. VALID ─────────────────────────────────
def validate_comp(comp_dir, timeline):
    from playwright.sync_api import sync_playwright
    errors = []
    with sync_playwright() as p:
        b = p.chromium.launch(args=['--no-sandbox','--force-device-scale-factor=1','--font-render-hinting=none'])
        pg = b.new_page(viewport={'width':1920,'height':1080})
        pg.goto('file://'+os.path.join(comp_dir,'comp.html'))
        pg.wait_for_function('() => !!(window.__ready && window.__seek)', timeout=30000)
        pg.wait_for_timeout(300)
        kerr = pg.evaluate('window.__katexError ? window.__katexError.length : 0')
        if kerr:
            sample = pg.evaluate('window.__katexError.slice(0,3)')
            errors.append(f'KaTeX errors: {kerr} e.g. {sample}')
        for i, blk in enumerate(timeline['blocks']):
            mid = (blk['t0'] + blk['t1'])/2
            pg.evaluate(f'window.__seek({mid})')
            vis = pg.evaluate('''(()=>{
                const nd = document.querySelectorAll('.block.on');
                if (nd.length !== 1) return 'visible_blocks='+nd.length;
                const r = nd[0].getBoundingClientRect();
                if (r.width < 100 || r.height < 100) return 'tiny_root';
                const has = nd[0].textContent.trim().length;
                if (has < 4) return 'empty_text';
                // raw LaTeX leaked to screen (unrendered math);
                // .katex-mathml = KaTeX's hidden annotation with the source — ignore it;
                // check per TEXT NODE (richText makes one node per segment, so $..$
                // pairs never span fields); currency "$5 and $10" is fine (mathish)
                const clone = nd[0].cloneNode(true);
                clone.querySelectorAll('.katex-mathml').forEach(n=>n.remove());
                const mathish = s => {
                    if(!s) return false;
                    if(/[\\\\^_{}]/.test(s)) return true;
                    if(/[=+<>\\u2264\\u2265\\u2248\\u00b1\\u00d7\\u00b7]/.test(s)) return true;
                    if(/[A-Za-z\\u00c0-\\u00ff\\u0400-\\u04ff]{3,}/.test(s.trim())) return false;
                    return true;
                };
                let raw = null;
                clone.querySelectorAll('*').forEach(n=>{
                    if(raw) return;
                    [...n.childNodes].forEach(c=>{
                        if(c.nodeType!==3) return;
                        const s = c.textContent;
                        if(/\\\\(?:frac|sqrt|begin|overline|lim|sum|cdot|times|pi|theta|alpha|beta|mathbb)\\b/.test(s)){
                            raw = 'raw_cmd:'+s.slice(0,50); return;
                        }
                        const dre = /\\$([^$]{1,400})\\$/g; let dm;
                        while((dm = dre.exec(s))){ if(mathish(dm[1])){ raw = 'raw_math:$'+dm[1].slice(0,40); break; } }
                    });
                });
                if(raw) return 'raw_latex_on_screen:'+raw;
                return 'ok';
            })()''')
            if vis != 'ok':
                errors.append(f'block {i} ({blk["type"]}) @ {mid:.1f}s: {vis}')
        for i, blk in enumerate(timeline['blocks']):
            if blk['type'] in ('formula','matrix'):
                mid = (blk['t0']+blk['t1'])/2
                pg.evaluate(f'window.__seek({mid})')
                n = pg.evaluate('''(()=>{ const nd=document.querySelector('.block.on');
                    return nd ? nd.querySelectorAll('.katex').length : 0 })()''')
                if n < 1:
                    errors.append(f'block {i} formula @ {mid:.1f}s: no katex rendered')
        os.makedirs(os.path.join(comp_dir, 'stills'), exist_ok=True)
        picks = [b for b in timeline['blocks'] if b['type'] != 'section']
        step = max(1, len(picks)//10)
        for j, blk in enumerate(picks[::step][:10]):
            mid = (blk['t0']+blk['t1'])/2
            pg.evaluate(f'window.__seek({mid})')
            pg.wait_for_timeout(30)
            pg.screenshot(path=os.path.join(comp_dir,'stills', f'v{j:02d}_{blk["type"]}.jpg'),
                          type='jpeg', quality=90)
        b.close()
    if errors:
        raise RuntimeError('COMP VALIDATION FAILED:\n  ' + '\n  '.join(errors[:20]))
    log('comp validation ok')

# ───────────────────────────── 5. PLAN ──────────────────────────────────
def frame_plan(comp_dir, total):
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch(args=['--no-sandbox'])
        pg = b.new_page(viewport={'width':1920,'height':1080})
        pg.goto('file://'+os.path.join(comp_dir,'comp.html'))
        pg.wait_for_function('() => !!window.__movesList', timeout=30000)
        moves = pg.evaluate('window.__movesList()')
        b.close()
    n_frames = int(round(total*FPS))
    is_moving = [False]*n_frames
    for m in moves:
        if m.get('px', 0) < 0.5: continue
        f0 = max(0, int(math.floor((m['t0']-0.5/FPS)*FPS)))
        f1 = min(n_frames-1, int(math.ceil((m['t1']+0.5/FPS)*FPS)))
        for f in range(f0, f1+1): is_moving[f] = True
    plan = []
    prev_moving = True
    for f in range(n_frames):
        if is_moving[f]: plan.append(f)
        elif prev_moving or f == 0: plan.append(f)
        prev_moving = is_moving[f]
    return plan, n_frames, len(moves)

# ───────────────────────────── 6. SHOOT ─────────────────────────────────
def _shoot_worker(args):
    comp_dir, frames_dir, plan, wid, nproc = args
    from playwright.sync_api import sync_playwright
    my = [f for i, f in enumerate(plan) if i % nproc == wid]
    with sync_playwright() as p:
        b = p.chromium.launch(args=['--no-sandbox','--force-device-scale-factor=1',
                                    '--font-render-hinting=none'])
        pg = b.new_page(viewport={'width':1920,'height':1080})
        pg.goto('file://'+os.path.join(comp_dir,'comp.html'))
        pg.wait_for_function('() => !!(window.__ready && window.__seek)', timeout=30000)
        pg.wait_for_timeout(250)
        for f in my:
            pg.evaluate(f'window.__seek({f/FPS!r})')
            target = os.path.join(frames_dir, f'f_{f:06d}.jpg')
            for attempt in range(3):
                try:
                    pg.screenshot(path=target, type='jpeg', quality=92, timeout=60000)
                    break
                except Exception:
                    if attempt == 2: raise
                    # Recover a wedged compositor without losing checkpoints.
                    pg.reload(wait_until='load')
                    pg.wait_for_function('() => !!(window.__ready && window.__seek)')
                    pg.evaluate(f'window.__seek({f/FPS!r})')
        b.close()
    return len(my)

def shoot(comp_dir, frames_dir, plan, nproc):
    os.makedirs(frames_dir, exist_ok=True)
    have = {f for f in os.listdir(frames_dir)}
    todo = [f for f in plan if f'f_{f:06d}.jpg' not in have]
    if not todo:
        log('shoot: all frames already captured'); return
    t0 = time.time()
    args = [(comp_dir, frames_dir, todo, w, nproc) for w in range(nproc)]
    with ProcessPoolExecutor(max_workers=nproc) as ex:
        list(ex.map(_shoot_worker, args))
    rate = len(todo)/max(1, time.time()-t0)
    log(f'shoot: {len(todo)} frames @ {rate:.1f} fps capture')

# ───────────────────────────── 7. ENCODE ────────────────────────────────
def encode(frames_dir, plan, n_frames, audio_wav, out_mp4, timeline, srt_path, title):
    metadata = os.path.join(frames_dir, 'chapters.ffmeta')
    with open(metadata, 'w', encoding='utf-8') as mf:
        mf.write(';FFMETADATA1\ntitle=' + title.replace('=', '\\=') + '\n')
        chapters = timeline.get('chapters', [])
        for idx, chapter in enumerate(chapters[:-1]):
            start = sum(int(float(v)*f) for v, f in zip(chapter['start'].split(':'), [3600000,60000,1000]))
            if idx+1 < len(chapters):
                nxt = chapters[idx+1]['start']
                end = sum(int(float(v)*f) for v, f in zip(nxt.split(':'), [3600000,60000,1000]))-1
            else: end = int(timeline['total']*1000)
            mf.write(f'\n[CHAPTER]\nTIMEBASE=1/1000\nSTART={start}\nEND={end}\ntitle={chapter["title"]}\n')
    lst = os.path.join(frames_dir, 'list.txt')
    with open(lst, 'w') as f:
        for i, fr in enumerate(plan):
            f.write(f"file 'f_{fr:06d}.jpg'\n")
            nxt = plan[i+1] if i+1 < len(plan) else n_frames
            f.write(f'duration {(nxt-fr)/FPS:.5f}\n')
        f.write(f"file 'f_{plan[-1]:06d}.jpg'\n")
    sh(['ffmpeg','-y','-v','warning','-f','concat','-safe','0','-i',lst,
        '-i',audio_wav,'-i',metadata,
        '-map','0:v','-map','1:a','-map_metadata','2','-map_chapters','2',
        '-c:v','libx264','-preset','veryfast','-tune','animation','-crf','20',
        '-pix_fmt','yuv420p','-r',str(FPS),'-vsync','cfr',
        '-c:a','aac','-b:a','96k','-ar','48000',
        '-metadata', f'title={title}',
        '-movflags','+faststart','-shortest', out_mp4])
    build_srt(timeline, srt_path)

def build_srt(timeline, path):
    def ts(t):
        h = int(t//3600); m = int(t%3600//60); s = t%60
        return f'{h:02d}:{m:02d}:{int(s):02d},{int((s%1)*1000):03d}'
    i = 1
    with open(path, 'w', encoding='utf-8') as f:
        for blk in timeline['blocks']:
            for cap in blk.get('captions', []):
                text = re.sub(r'\$([^$]+)\$', r'\1', cap['text'])
                # Keep subtitles readable: at most two lines, split near a word.
                if len(text) > 92:
                    cut = text.rfind(' ', 0, 88)
                    text = text[:cut] + '\n' + text[cut+1:]
                f.write(f'{i}\n{ts(cap["t0"])} --> {ts(cap["t1"])}\n{text}\n\n')
                i += 1

# ───────────────────────────── 8. QA ────────────────────────────────────
def qa(out_mp4, timeline, workdir):
    r = sh(['ffprobe','-v','quiet','-print_format','json','-show_format','-show_streams','-show_chapters', out_mp4])
    info = json.loads(r.stdout)
    dur = float(info['format']['duration'])
    vt = [s for s in info['streams'] if s['codec_type']=='video']
    at = [s for s in info['streams'] if s['codec_type']=='audio']
    issues = []
    if not vt: issues.append('no video stream')
    if not at: issues.append('no audio stream')
    if vt and vt[0].get('width') != 1920: issues.append('width != 1920')
    expected_chapters = len(timeline.get('chapters', [])) - 1
    if len(info.get('chapters', [])) != expected_chapters:
        issues.append(f'chapters {len(info.get("chapters", []))} vs expected {expected_chapters}')
    exp = timeline['total']
    if abs(dur-exp) > 3.0: issues.append(f'duration {dur:.1f}s vs expected {exp:.1f}s')
    os.makedirs(os.path.join(workdir,'qa'), exist_ok=True)
    blank = 0
    from PIL import Image
    import statistics
    for k in range(8):
        t = max(1.0, exp*(k+0.5)/8)
        fr = os.path.join(workdir,'qa',f'q{k}.jpg')
        sh(['ffmpeg','-y','-v','quiet','-ss',f'{t:.2f}','-i',out_mp4,'-frames:v','1','-q:v','4',fr])
        if os.path.exists(fr):
            im = Image.open(fr).convert('L').resize((192,108))
            px = im.tobytes()
            if statistics.pstdev(px) < 4.0: blank += 1
    if blank: issues.append(f'{blank}/8 sampled frames look blank')
    return {'duration': dur, 'expected': exp, 'issues': issues,
            'video': vt[0]['codec_name'] if vt else None,
            'audio': at[0]['codec_name'] if at else None}

# ───────────────────────────── main ─────────────────────────────────────
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--spec', required=True)
    ap.add_argument('--out', required=True, help='output dir for mp4/srt/report')
    ap.add_argument('--workdir', default=None)
    ap.add_argument('--workers', type=int, default=max(1, (os.cpu_count() or 4)-1))
    ap.add_argument('--skip-tts', action='store_true')
    ap.add_argument('--tts-only', action='store_true')
    ap.add_argument('--plan-only', action='store_true')
    a = ap.parse_args()

    spec = json.load(open(a.spec))
    vid = spec['id'] + '_' + spec['language']
    workdir = os.path.abspath(a.workdir or os.path.join('/tmp', 'uuu_'+vid))
    a.out = os.path.abspath(a.out)
    os.makedirs(workdir, exist_ok=True)
    os.makedirs(a.out, exist_ok=True)
    # Invalidate stale checkpoints when narration or scene content changes.
    spec_hash = hashlib.sha256(json.dumps(spec, ensure_ascii=False, sort_keys=True).encode()).hexdigest()
    manifest_path = os.path.join(workdir, 'spec.sha256')
    previous_hash = open(manifest_path).read().strip() if os.path.exists(manifest_path) else ''
    if previous_hash != spec_hash:
        for name in ('segs','aud','comp','frames','times.json','words.json','narration.wav','plan.json'):
            path = os.path.join(workdir, name)
            shutil.rmtree(path, ignore_errors=True) if os.path.isdir(path) else (os.unlink(path) if os.path.exists(path) else None)
        open(manifest_path, 'w').write(spec_hash)
    log(f'=== {vid} (workers={a.workers}) ===')

    times_path = os.path.join(workdir, 'times.json')
    if os.path.exists(times_path) and a.skip_tts:
        times = json.load(open(times_path))
    else:
        times = asyncio.run(tts_segments(spec, workdir))
    if a.tts_only: return

    audio_wav = os.path.join(workdir, 'narration.wav')
    if not os.path.exists(audio_wav):
        build_audio(spec, times, workdir, audio_wav)

    comp_dir = os.path.join(workdir, 'comp')
    if not os.path.exists(os.path.join(comp_dir, 'comp.html')):
        sys.path.insert(0, ENGINE)
        import build_comp
        build_comp.build(spec, times, comp_dir)
    timeline = json.load(open(os.path.join(comp_dir, 'timeline.json')))

    if not os.path.exists(os.path.join(comp_dir, '.validated')):
        validate_comp(comp_dir, timeline)
        open(os.path.join(comp_dir, '.validated'), 'w').write('ok')

    plan_path = os.path.join(workdir, 'plan.json')
    if os.path.exists(plan_path):
        pl = json.load(open(plan_path))
        plan, n_frames = pl['plan'], pl['n_frames']
    else:
        plan, n_frames, n_moves = frame_plan(comp_dir, timeline['total'])
        json.dump({'plan': plan, 'n_frames': n_frames}, open(plan_path, 'w'))
        log(f'plan: {n_frames} frames, {len(plan)} to capture ({n_frames-len(plan)} static reused), moves={n_moves}')

    frames_dir = os.path.join(workdir, 'frames')
    shoot(comp_dir, frames_dir, plan, a.workers)

    out_mp4 = os.path.join(a.out, f'{vid}.mp4')
    encode(frames_dir, plan, n_frames, audio_wav, out_mp4, timeline,
           os.path.join(a.out, f'{vid}.srt'), spec.get('test_title', vid))

    rep = qa(out_mp4, timeline, workdir)
    rep['id'] = vid
    rep['blocks'] = len(timeline['blocks'])
    json.dump(rep, open(os.path.join(a.out, f'{vid}.report.json'), 'w'), indent=1)
    size = os.path.getsize(out_mp4)/1e6
    log(f'DONE {vid}: {rep["duration"]/60:.1f} min, {size:.1f} MB, issues={rep["issues"] or "none"}')
    if rep['issues']:
        sys.exit(2)

if __name__ == '__main__':
    main()
