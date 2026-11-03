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
import argparse, asyncio, json, math, os, re, shutil, subprocess, sys, time
from concurrent.futures import ProcessPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
ENGINE = os.path.join(HERE, '..', 'engine')

FPS = 30
VOICES = {'en': 'en-US-AndrewMultilingualNeural',
          'ru': 'ru-RU-DmitryNeural',
          'uz': 'uz-UZ-SardorNeural'}

def sh(cmd, timeout=7200, check=True, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout, **kw)
    if check and r.returncode != 0:
        raise RuntimeError(f"FAILED ({r.returncode}): {cmd[:4]}\n{(r.stderr or r.stdout)[-1500:]}")
    return r

def log(msg):
    print(f'[{time.time()-T0:7.1f}s] {msg}', flush=True)

T0 = time.time()

# ────────────────────────────── 1. TTS ──────────────────────────────────
async def tts_segments(spec, workdir):
    """edge-tts per segment, with WordBoundary capture for word-sync highlights."""
    import edge_tts
    voice = VOICES[spec['language']]
    segs_dir = os.path.join(workdir, 'segs')
    os.makedirs(segs_dir, exist_ok=True)
    times, words = {}, {}
    n_seg = 0
    blocks = [b for ch in spec['chapters'] for b in ch['blocks']]
    TTS_SEM = asyncio.Semaphore(4)   # parallel edge-tts calls
    async def synth_one(bi, si, text, mp3, wpath):
        async with TTS_SEM:
            for attempt in range(5):
                try:
                    comm = edge_tts.Communicate(text, voice, rate='-4%')
                    wbuf = []
                    with open(mp3, 'wb') as f:
                        async for chunk in comm.stream():
                            if chunk['type'] == 'audio':
                                f.write(chunk['data'])
                            elif chunk['type'] == 'WordBoundary':
                                wbuf.append({'w': chunk['text'],
                                             't': chunk['offset']/1e7,
                                             'd': chunk['duration']/1e7})
                    json.dump(wbuf, open(wpath, 'w'))
                    return True
                except Exception:
                    if attempt == 4: raise
                    await asyncio.sleep(2.5 * (attempt+1))
    jobs = []
    for bi, blk in enumerate(blocks):
        for si, text in enumerate(blk.get('narr') or ['']):
            text = (text or '').strip()
            if not text: continue
            mp3 = os.path.join(segs_dir, f'b{bi:04d}_s{si:02d}.mp3')
            wpath = os.path.join(segs_dir, f'b{bi:04d}_s{si:02d}.words.json')
            if not os.path.exists(mp3) or os.path.getsize(mp3) < 400:
                jobs.append(synth_one(bi, si, text, mp3, wpath))
    if jobs:
        await asyncio.gather(*jobs)
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
        pieces.append(sil(PAD_OUT))
    lst = os.path.join(tmp, 'concat.txt')
    with open(lst, 'w') as f:
        for p in pieces:
            if p: f.write(f"file '{p}'\n")
    sh(['ffmpeg','-y','-v','quiet','-f','concat','-safe','0','-i',lst,'-c:a','pcm_s16le',out_wav])
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
            pg.screenshot(path=os.path.join(frames_dir, f'f_{f:06d}.jpg'), type='jpeg', quality=93)
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
    lst = os.path.join(frames_dir, 'list.txt')
    with open(lst, 'w') as f:
        for i, fr in enumerate(plan):
            f.write(f"file 'f_{fr:06d}.jpg'\n")
            nxt = plan[i+1] if i+1 < len(plan) else n_frames
            f.write(f'duration {(nxt-fr)/FPS:.5f}\n')
        f.write(f"file 'f_{plan[-1]:06d}.jpg'\n")
    sh(['ffmpeg','-y','-v','warning','-f','concat','-safe','0','-i',lst,
        '-i',audio_wav,
        '-map','0:v','-map','1:a',
        '-c:v','libx264','-preset','superfast','-tune','animation','-crf','21',
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
    with open(path, 'w') as f:
        for blk in timeline['blocks']:
            label = blk.get('srt') or blk['type']
            f.write(f'{i}\n{ts(blk["t0"])} --> {ts(min(blk["t1"], blk["t0"]+8))}\n{label}\n\n')
            i += 1

# ───────────────────────────── 8. QA ────────────────────────────────────
def qa(out_mp4, timeline, workdir):
    r = sh(['ffprobe','-v','quiet','-print_format','json','-show_format','-show_streams', out_mp4])
    info = json.loads(r.stdout)
    dur = float(info['format']['duration'])
    vt = [s for s in info['streams'] if s['codec_type']=='video']
    at = [s for s in info['streams'] if s['codec_type']=='audio']
    issues = []
    if not vt: issues.append('no video stream')
    if not at: issues.append('no audio stream')
    if vt and vt[0].get('width') != 1920: issues.append('width != 1920')
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
            px = list(im.getdata())
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
    workdir = a.workdir or os.path.join('/tmp', 'uuu_'+vid)
    os.makedirs(workdir, exist_ok=True)
    os.makedirs(a.out, exist_ok=True)
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
