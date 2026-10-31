#!/usr/bin/env python3
"""Translate a study-guide JSON (extract_text_guide schema) into EN/UZ/RU
via the z-ai chat CLI, with chunking, validation and checkpoint resume.
Usage: translate_guide.py <src.json> <target.json> <en|uz|ru>"""
import json, subprocess, sys, os, re, time
import fcntl

WORK = '/home/z/my-project/work'
RATE_LOCK = '/tmp/zai_rate.lock'


def _pace(min_gap=6.0):
    """Global inter-call pacing shared by all worker processes: no more than
    one z-ai call start per min_gap seconds (the API rate-limits with 429)."""
    while True:
        with open(RATE_LOCK, 'a+') as f:
            fcntl.flock(f, fcntl.LOCK_EX)
            f.seek(0)
            try:
                last = float(f.read() or 0)
            except ValueError:
                last = 0.0
            now = time.time()
            if now - last >= min_gap:
                f.seek(0)
                f.truncate()
                f.write(str(now))
                fcntl.flock(f, fcntl.LOCK_UN)
                return
            wait = min_gap - (now - last)
            fcntl.flock(f, fcntl.LOCK_UN)
        time.sleep(max(wait, 0.3) + 0.05)

PROMPTS = {
 'en': """You are a professional technical translator (Russian -> English) working on a university study guide for the course "Introduction to Engineering", weeks 5-7.
Translate EVERY element of the input JSON array from Russian into natural technical English.
STRICT RULES:
- Keep math notation EXACTLY as-is: x^{2}, a_{ij}, √, ≤, ≥, ·, ×, →, ∼, %, units (kWh, °C).
- Keep file/course identifiers unchanged: Lecture07, Lab05, ew5lec.txt, ISA, CC-INEN010104, ECTS, OpenStax, course file names in [ ] brackets.
- Keep the Uzbek course terms savollar, topshiriqlar, atamalar, Formulalar, Batafsil EXACTLY as written (they are official course terminology used in all language versions).
- '[Источник: X]' becomes '[Source: X]' (translate the label, keep X unchanged).
- Translate EVERY numbered line; keep the |||N||| markers, numbers and order exactly; empty lines stay empty.
- Output the numbered lines only. No commentary.""",
 'uz': """You are a professional technical translator (Russian -> Uzbek, Latin script) working on a university study guide for the course "Introduction to Engineering" (Muhandislikka kirish), weeks 5-7.
Translate EVERY element of the input JSON array from Russian into natural Uzbek (Latin script).
STRICT RULES:
- Keep math notation EXACTLY as-is: x^{2}, a_{ij}, √, ≤, ≥, ·, ×, →, ∼, %, units (kWh, °C).
- Keep file/course identifiers unchanged: Lecture07, Lab05, ew5lec.txt, ISA, CC-INEN010104, ECTS, OpenStax.
- The terms savollar, topshiriqlar, atamalar, Formulalar are already Uzbek — keep them.
- '[Источник: X]' becomes '[Manba: X]' (translate the label, keep X unchanged).
- Use the Uzbek letters oʻ and gʻ (or straight apostrophes o' g') consistently; keep proper nouns as-is.
- Translate EVERY numbered line; keep the |||N||| markers, numbers and order exactly; empty lines stay empty.
- Output the numbered lines only. No commentary.""",
 'ru': """You are a professional technical translator (English -> Russian) working on a university study guide for the course "English for Engineering I", weeks 5-7.
Translate EVERY element of the input JSON array from English into Russian.
STRICT RULES:
- This is an ENGLISH-LANGUAGE-LEARNING guide: all English example sentences, grammar forms (is made, was built, has been done), model answers, quotes and dialogues MUST STAY IN ENGLISH. Translate only the explanatory/instructional text around them (rules, task instructions, descriptions, headings).
- Grammar labels: translate "Passive" as «пассив (Passive)» on first use, then «пассив»; keep tense names with the English original in parentheses on first use.
- Keep math/graph notation as-is: %, →, graphs axes labels.
- Keep file/course identifiers unchanged: ew5lec.txt, ew5gw.txt, English File, TED, BBC.
- '[Source: X]' becomes '[Источник: X]' (translate the label, keep X unchanged).
- Translate EVERY numbered line; keep the |||N||| markers, numbers and order exactly; empty lines stay empty.
- Output the numbered lines only. No commentary.""",
 'uz_en_src': """You are a professional technical translator (English -> Uzbek, Latin script) working on a university study guide for the course "English for Engineering I", weeks 5-7.
Translate EVERY element of the input JSON array from English into Uzbek (Latin script).
STRICT RULES:
- This is an ENGLISH-LANGUAGE-LEARNING guide: all English example sentences, grammar forms (is made, was built), model answers, quotes and dialogues MUST STAY IN ENGLISH. Translate only the explanatory/instructional text around them (rules, task instructions, descriptions, headings).
- Keep tense/grammar names with the English original in parentheses on first use.
- Keep math/graph notation as-is: %, →, graph axes labels.
- Keep file/course identifiers unchanged: ew5lec.txt, ew5gw.txt, English File, TED, BBC.
- '[Source: X]' becomes '[Manba: X]' (translate the label, keep X unchanged).
- Use the Uzbek letters oʻ and gʻ (or straight apostrophes o' g') consistently.
- Translate EVERY numbered line; keep the |||N||| markers, numbers and order exactly; empty lines stay empty.
- Output the numbered lines only. No commentary.""",
}

def call_zai(system, user, tries=4, backoff=(3, 9, 27, 60)):
    # a UNIQUE response file per call: a failed invocation must never be able
    # to return a previous call's stale content as if it were the answer
    resp_file = f'/tmp/tr_resp_{os.getpid()}_{time.time_ns()}.json'
    for attempt in range(tries):
        _pace()
        r = subprocess.run(['z-ai', 'chat', '-p', user, '-s', system,
                            '-o', resp_file],
                           capture_output=True, text=True, timeout=600)
        try:
            if not os.path.exists(resp_file):
                raise FileNotFoundError(resp_file)
            data = json.load(open(resp_file))
            content = data['choices'][0]['message']['content'].strip()
            # strip possible markdown fences
            content = re.sub(r'^```(?:json)?\s*', '', content)
            content = re.sub(r'\s*```$', '', content)
            return content
        except Exception as e:
            wait = backoff[min(attempt, len(backoff)-1)]
            detail = ''
            if r.returncode != 0 or (r.stdout and 'File saved' not in r.stdout):
                detail = f' rc={r.returncode} out={r.stdout[-160:]!r} err={r.stderr[-160:]!r}'
            print(f'    attempt {attempt+1} failed: {e}{detail}; retry in {wait}s...')
            time.sleep(wait)
    try:
        os.remove(resp_file)
    except OSError:
        pass
    return None

def parse_array(content):
    # find the JSON array
    m = re.search(r'\[.*\]', content, re.S)
    if not m:
        return None
    return json.loads(m.group(0))

def parse_numbered(content):
    """Split a |||N||| ... response into {N: text}.
    Robust to all layout variants the model produces:
    marker+text on one line / marker alone then text on the next line /
    empty items (next marker immediately follows). Each item's text runs
    from just after its marker to the start of the NEXT marker — the next
    marker is never swallowed as content."""
    marks = [(m.start(), m.end(), int(m.group(1)))
             for m in re.finditer(r'\|\|\|(\d+)\|\|\|', content)]
    out = {}
    for j, (s, e, n) in enumerate(marks):
        nxt = marks[j+1][0] if j+1 < len(marks) else len(content)
        out[n] = content[e:nxt].strip()
    return out

def is_valid_translation(tr, src):
    """Structural validation of one translated unit against its source:
    every digit run and every file identifier of the source must survive
    (numbers are never translated), and the length ratio must be sane.
    Ordinal numbers (16th -> XVI век) are exempt: they are legitimately
    re-expressed as Roman numerals or words in translation."""
    if not tr or not tr.strip():
        return False
    tr = str(tr)
    src = str(src)
    r = len(tr) / max(len(src), 1)
    if r < 0.3 or r > 3.5:
        return False
    ordinals = set(re.findall(r'\d+(?=(?:th|st|nd|rd)\b)', src))
    for num in re.findall(r'\d+', src):
        if num in ordinals:
            continue
        if num not in tr:
            return False
    for fid in re.findall(r'[A-Za-z][A-Za-z0-9]*\.(?:txt|pdf|docx|mp4)', src):
        if fid not in tr:
            return False
    if '|||' in tr:
        return False
    return True


def translate_units(units, lang_prompt, on_item=None):
    """units: list of strings -> translated list.
    Chunked ask for speed, then structural validation: if the model dropped
    the first line of a chunk (merging it into the previous translation) the
    whole response is shifted by one; the shift is detected by scoring the
    +/-1 rotations on digit/identifier preservation. Anything still invalid
    is re-translated one line at a time (no numbering to go wrong).
    on_item(i, translation) is called for every item as soon as it has a
    value, so partial progress survives a chunk failure."""
    def ask(lines_text, tries=3):
        for attempt in range(tries):
            content = call_zai(lang_prompt,
                'Translate each numbered line below. Reply in EXACTLY the same format as the input: '
                'one line per item, starting with |||N|||, then one space, then the translation of that item '
                '(same numbers, same order). Never put a marker on a line by itself, never merge two items '
                'into one line, never leave a marker without its translation. The first marker is |||0|||. '
                'Every input line MUST produce exactly one output line.\n\n' + lines_text)
            if content is None:
                continue
            got = parse_numbered(content)
            if got:
                return got
        return {}

    def align_score(got, s):
        # hypothesis: got[k] is the translation of units[k+s]; count how many
        # items validate structurally under it
        n = 0
        for i in range(len(units)):
            v = got.get(i - s)
            if v is not None and is_valid_translation(v, units[i]):
                n += 1
        return n

    lines = '\n'.join(f'|||{i}||| {t}' for i, t in enumerate(units))
    got = ask(lines)
    if got:
        # pick the best index alignment (0 = as-numbered, +1 = model dropped
        # the first line and shifted, -1 = model renumbered from 1)
        cands = {0: got}
        best_s, best_n = 0, align_score(got, 0)
        for s in (1, -1):
            n = align_score(got, s)
            if n > best_n:
                best_s, best_n = s, n
        if best_s:
            print(f'    index shift {best_s:+d} detected (valid items {best_n}/{len(units)}); realigning')
            got = {i: got[i - best_s] for i in range(len(units)) if got.get(i - best_s) is not None}
    missing = [i for i in range(len(units)) if not is_valid_translation(got.get(i), units[i])]
    # every invalid item is re-translated on its own: a single line carries no
    # numbering, so nothing can shift or merge. After two attempts the best
    # response is accepted — validation drives retries, it never loses a chunk.
    if len(missing) > 5:
        print(f'    backfilling {len(missing)} items one-by-one')
    for i in missing:
        unit = units[i]
        best = None
        for attempt in range(2):
            content = call_zai(lang_prompt,
                'Translate the single line below into the target language. '
                'Keep every number, unit and file name exactly as written; ordinal numbers may be '
                're-expressed as Roman numerals or words. '
                'Return ONLY the translation itself, no numbering, no commentary.\n\n' + unit)
            if content and '|||' not in content:
                best = content.strip()
                if is_valid_translation(best, unit):
                    break
        if best:
            got[i] = best
    still_missing = [i for i in range(len(units)) if not (got.get(i) and str(got[i]).strip())]
    # persist every confirmed item before deciding the chunk's fate
    if on_item:
        for i in range(len(units)):
            v = got.get(i)
            if v and str(v).strip():
                on_item(i, str(v).strip())
    if still_missing:
        print(f'    still missing after retries: {still_missing[:8]}')
        return None
    return [str(got[i]).strip() for i in range(len(units))]

def build_units(data):
    """Flat unit list (locator, text) in document order — shared by the
    z-ai pipeline, the unit dumper and the assembler."""
    units = []
    def add(loc, t):
        if t is None or not str(t).strip():
            return
        units.append((loc, t))
    cover = data.get('cover', [])
    for i, t in enumerate(cover):
        add(f'cover:{i}', t)
    hdr = data.get('header', {})
    for k in ('left', 'right'):
        if hdr.get(k):
            add(f'header:{k}', hdr[k])
    for bi, b in enumerate(data['blocks']):
        if b['k'] == 'table':
            for ri, row in enumerate(b['rows']):
                for ci, cell in enumerate(row):
                    if cell is not None:
                        add(f'b{bi}:r{ri}c{ci}', cell)
        else:
            if 't' in b:
                add(f'b{bi}', b['t'])
    return units


def assemble(data, done, dst_path):
    """Write the translated document JSON: same schema as the source, every
    translated locator substituted, untranslated units fall back to source."""
    cover = data.get('cover', [])
    new = {'cover': [], 'header': {}, 'blocks': json.loads(json.dumps(data['blocks']))}
    for i in range(len(cover)):
        new['cover'].append(done.get(f'cover:{i}', cover[i]))
    hdr = data.get('header', {})
    for k in ('left', 'right'):
        if hdr.get(k):
            new['header'][k] = done.get(f'header:{k}', hdr[k])
    for bi, b in enumerate(new['blocks']):
        if b['k'] == 'table':
            for ri, row in enumerate(b['rows']):
                for ci in range(len(row)):
                    loc = f'b{bi}:r{ri}c{ci}'
                    if loc in done:
                        row[ci] = done[loc]
        else:
            loc = f'b{bi}'
            if loc in done:
                b['t'] = done[loc]
    json.dump(new, open(dst_path, 'w'), ensure_ascii=False, indent=1)
    return new


def main(src_path, dst_path, target):
    data = json.load(open(src_path))
    if target == 'uz2':
        prompt = PROMPTS['uz_en_src']
    else:
        prompt = PROMPTS[target]
    ckpt_path = dst_path + '.ckpt'

    # flat unit list in document order
    units = build_units(data)

    # load checkpoint
    done = {}
    if os.path.exists(ckpt_path):
        done = json.load(open(ckpt_path))
        print(f'resumed: {len(done)}/{len(units)} units done')

    # chunk the remaining units (~3000 chars: smaller batches keep the model's
    # line-by-line discipline and limit the blast radius of a bad response)
    chunks, cur, cur_len = [], [], 0
    for loc, t in units:
        if loc in done:
            continue
        if cur and cur_len + len(t) > 3000:
            chunks.append(cur); cur, cur_len = [], 0
        cur.append((loc, t)); cur_len += len(t)
    if cur:
        chunks.append(cur)

    print(f'{len(units)} units, {len(chunks)} chunks to translate')
    for ci, chunk in enumerate(chunks):
        texts = [t for _, t in chunk]
        print(f'  chunk {ci+1}/{len(chunks)} ({len(texts)} units, {sum(len(t) for t in texts)} chars)')

        def persist(i, v, _chunk=chunk):
            if _chunk[i][0] not in done:
                done[_chunk[i][0]] = v
                json.dump(done, open(ckpt_path, 'w'), ensure_ascii=False)

        out = translate_units(texts, prompt, on_item=persist)
        if out is None:
            print('  !! chunk FAILED after retries — partial progress saved, aborting')
            json.dump(done, open(ckpt_path, 'w'), ensure_ascii=False)
            sys.exit(1)
        for (loc, _), translated in zip(chunk, out):
            if loc not in done:
                done[loc] = translated
        json.dump(done, open(ckpt_path, 'w'), ensure_ascii=False)

    assemble(data, done, dst_path)
    print(f'written: {dst_path}')

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], sys.argv[3])
