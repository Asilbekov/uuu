// gen_chunks.ts — LLM-генерация блоков для чанков гайда: с авторемонтом JSON
// и ретраями с обратной связью (LLM чинит свою ошибку по описанию).
// usage: bun gen_chunks.ts <chunks.json> <lang> <outDir> <specId> [concurrency]
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const [chunksPath, lang, outDir, specId, concArg] = process.argv.slice(2);
const CONC = parseInt(concArg || '4', 10);
const LANG_NAME: Record<string, string> = { en: 'English', ru: 'Russian', uz: 'Uzbek' };

const { chunks } = JSON.parse(fs.readFileSync(chunksPath, 'utf8'));
fs.mkdirSync(outDir, { recursive: true });

const MODEL = process.env.LLM_MODEL || undefined;   // e.g. 'glm-4.5-flash'
const zai = await ZAI.create();
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const SYSTEM = `Ты — сценарист образовательных видео в стиле 3Blue1Brown: разговорно, точно, интонация "сначала вопрос — потом ответ".
На вход — фрагмент учебного PDF-гайда (текст извлечён из PDF, математика искажена — восстанови её в корректный KaTeX).
Преврати ВЕСЬ фрагмент БЕЗ ПОТЕРЬ в JSON-массив блоков для видео.

ТИПЫ БЛОКОВ:
{"type":"section","data":{"num":N,"title":"...","subtitle":"..."},"narr":["..."],"narr_item":[-1]}
{"type":"concept","data":{"heading":"...","bullets":["..."]},"narr":["..."],"narr_item":[-1,0,1]}
{"type":"formula","data":{"heading":"...","tex":"LaTeX","parts":[{"substr":"кусок","color":"#4C5FD5|#B45309|#0E7C7B|#A03040","note":"..."}]},"narr":[...],"narr_item":[...]}
{"type":"example","data":{"heading":"Problem N — ...","problem":"условие","steps":[{"text":"шаг"}],"result":"ответ"},"narr":[...],"narr_item":[...]}
{"type":"table","data":{"heading":"...","columns":[...],"rows":[[...]]},"narr":[...],"narr_item":[...]}
{"type":"plot","data":{"heading":"...","functions":[{"fn":"numpy expr от x","tex":"label","color":"#4C5FD5"}],"x_range":[0,1],"y_range":[0,1],"point":[x,y],"vline":x,"x_label":"","y_label":""},"narr":[...],"narr_item":[...]}
{"type":"timeline","data":{"heading":"...","events":[{"year":"...","text":"..."}]},"narr":[...],"narr_item":[...]}
{"type":"code","data":{"heading":"...","code":"...","highlight":[1]},"narr":[...],"narr_item":[...]}
{"type":"matrix","data":{"heading":"...","tex":"\\\\begin{pmatrix}...\\\\end{pmatrix}","steps":[{"text":"..."}]},"narr":[...],"narr_item":[...]}
{"type":"quote","data":{"text":"...","who":"..."},"narr":[...],"narr_item":[-1]}
{"type":"recap","data":{"heading":"...","items":["..."]},"narr":[...],"narr_item":[...]}

ЖЁСТКИЕ ПРАВИЛА:
1. НИЧЕГО не пропускать: каждая задача/вопрос → example со ВСЕМИ шагами решения; каждая формула → formula; таблица → table; хронология → timeline; матричные преобразования → matrix; код → code. Серия однотипных задач — КАЖДАЯ отдельный example-блок.
2. section-блок эмити на том месте последовательности, где начинается новый крупный раздел (Week N / Chapter / нумерованный раздел).
3. narr: массив реплик диктора, ЯЗЫК = ${LANG_NAME[lang]}. narr_item[k] = индекс элемента (bullet/step/part/row/event), к которому относится реплика k; -1 = интро/связка. ПРАВИЛО: len(narr_item) РАВЕН len(narr), каждый элемент упомянут ≥1 репликой. КРИТИЧНО: narr — это ТОЛЬКО разговорные фразы для озвучки: НИКАКОГО LaTeX, $-знаков и \\-команд — математику пиши словами («the square root of x», «x to the power of n», «a over b»). А вот в data-полях LaTeX приветствуется: problem/steps/result/bullets/parts.note могут использовать $...$ для формул, ячейки таблиц — {tex:"..."} или $...$.
4. tex: строгий KaTeX: "x2"→"x^2", "a11"→"a_{11}", суммы/дроби/корни через \\\\frac \\\\sum \\\\sqrt, матрицы \\\\begin{pmatrix}.
   ВАЖНО про JSON: обратный слэш в JSON-строке пишется как \\\\\\\\ — то есть LaTeX \\\\frac в файле выглядит как "\\\\\\\\frac".
5. Цвета parts: #4C5FD5 индиго / #B45309 янтарь / #0E7C7B бирюза / #A03040 красный.
6. Максимум 6 bullets/steps на блок; длинные списки дели на несколько блоков.
7. Заголовки/тексты — на языке ${LANG_NAME[lang]}.
8. ТОЛЬКО чистый JSON-массив []. Без markdown-заборов, без пояcнений.`;

function repairJsonString(s: string): string {
  // fix invalid JSON escapes: lone \ before char not in "\/bfnrtu
  let out = '';
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '\\') {
      const nxt = s[i + 1];
      if (nxt === undefined) { out += '\\\\'; continue; }
      if ('"\\/bfnrtu'.includes(nxt)) { out += s[i] + s[i + 1]; i++; continue; }
      out += '\\\\' ;  // escape the backslash itself
      continue;
    }
    out += s[i];
  }
  return out;
}

function extractJson(out: string): any {
  let s = out.trim();
  const m = s.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (m) s = m[1].trim();
  const start = s.indexOf('[');
  const end = s.lastIndexOf(']');
  if (start >= 0 && end > start) s = s.slice(start, end + 1);
  try {
    return JSON.parse(s);
  } catch {
    // repair: re-escape lone backslashes inside string literals
    const fixed = s.replace(/"(?:[^"\\]|\\.)*"/g, (str) => {
      // unescape what's valid, then re-escape correctly
      try { const v = JSON.parse(str); return JSON.stringify(v); }
      catch { return '"' + repairJsonString(str.slice(1, -1)) + '"'; }
    });
    return JSON.parse(fixed);
  }
}

function countItems(b: any): number {
  const d = b?.data || {};
  switch (b?.type) {
    case 'concept': return (d.bullets || []).length;
    case 'recap': return (d.items || []).length;
    case 'formula': return (d.parts || []).length;
    case 'example': case 'matrix': return (d.steps || []).length;
    case 'table': return (d.rows || []).length;
    case 'timeline': return (d.events || []).length;
    case 'code': return 1;
    default: return 0;
  }
}

function autoSplit(arr: any[]): any[] {
  const out: any[] = [];
  for (const b of arr) {
    if ((b?.type === 'example' || b?.type === 'matrix') && (b.data?.steps?.length || 0) > 7) {
      const steps = b.data.steps;
      const part1 = steps.slice(0, 6);
      const part2 = steps.slice(6);
      const hasResult = !!b.data.result;
      const narr1: string[] = [], ni1: number[] = [];
      const narr2: string[] = [], ni2: number[] = [];
      (b.narr || []).forEach((s: string, k: number) => {
        const it = b.narr_item?.[k] ?? -1;
        if (it === -1 && narr1.length === 0) { narr1.push(s); ni1.push(-1); }
        else if (it >= 0 && it < 6) { narr1.push(s); ni1.push(it); }
        else { narr2.push(s); ni2.push(it >= 6 ? it - 6 : -1); }
      });
      out.push({ ...b, data: { ...b.data, steps: part1, result: undefined },
                 narr: narr1.length ? narr1 : [''], narr_item: ni1.length ? ni1 : [-1] });
      out.push({ ...b, data: { ...b.data, heading: (b.data.heading || '') + ' (cont.)',
                 problem: '', steps: part2, result: hasResult ? b.data.result : undefined },
                 narr: narr2.length ? narr2 : [''], narr_item: ni2.length ? ni2 : [-1] });
    } else {
      out.push(b);
    }
  }
  return out;
}

function autoRepair(arr: any[]): void {
  for (const b of arr) {
    if (!b?.narr || !Array.isArray(b.narr)) continue;
    const n = b.narr.length;
    if (!Array.isArray(b.narr_item)) b.narr_item = b.narr.map(() => -1);
    // length match
    while (b.narr_item.length < n) b.narr_item.push(b.narr_item[b.narr_item.length - 1] ?? -1);
    if (b.narr_item.length > n) b.narr_item = b.narr_item.slice(0, n);
    // bounds
    const items = countItems(b);
    b.narr_item = b.narr_item.map((v: number) =>
      (typeof v === 'number' && v >= 0 && v < items) ? v : (typeof v === 'number' && v >= items ? items - 1 : -1));
    // narr entries must be strings
    b.narr = b.narr.map((x: any) => typeof x === 'string' ? x : String(x ?? ''));
  }
}

function validate(arr: any): string | null {
  if (!Array.isArray(arr) || !arr.length) return 'not an array / empty';
  const types = new Set(['section','concept','formula','example','table','plot','timeline','code','matrix','quote','recap']);
  for (let i = 0; i < arr.length; i++) {
    const b = arr[i];
    if (!types.has(b?.type)) return `block ${i}: bad type ${b?.type}`;
    if (!b?.data) return `block ${i} (${b.type}): no data`;
    if (!Array.isArray(b.narr) || !b.narr.length) return `block ${i} (${b.type}): bad narr`;
    if (!Array.isArray(b.narr_item) || b.narr_item.length !== b.narr.length)
      return `block ${i} (${b.type}): narr_item ${b.narr_item?.length} != narr ${b.narr.length}`;
    const d = b.data;
    const needs: Record<string, string[]> = {
      section: ['title'], concept: ['heading','bullets'], formula: ['heading','tex'],
      example: ['heading','steps'], table: ['heading','columns','rows'],
      plot: ['heading','functions'], timeline: ['heading','events'], code: ['heading','code'],
      matrix: ['heading','tex'], quote: ['text'], recap: ['heading','items'],
    };
    for (const k of needs[b.type] || []) {
      const v = d[k];
      if (v === undefined || v === null) return `block ${i} (${b.type}): missing ${k}`;
      if (Array.isArray(v) && !v.length) return `block ${i} (${b.type}): empty ${k}`;
      if (typeof v === 'string' && !v.trim()) return `block ${i} (${b.type}): empty ${k}`;
    }
    if (['bullets','steps','items'].includes('' ) ) {} // no-op
    const cap = (v: any[] | undefined, m: number, name: string) => {
      if (v && v.length > m) return `block ${i} (${b.type}): ${name} ${v.length} > ${m}`;
      return null;
    };
    const e = cap(d.bullets, 7, 'bullets') || cap(d.steps, 7, 'steps') || cap(d.items, 7, 'items')
           || cap(d.rows, 9, 'rows') || cap(d.events, 9, 'events') || cap(d.parts, 6, 'parts');
    if (e) return e;
  }
  return null;
}

let done = 0, failed = 0;
const queue = chunks.slice();
const errReplay = new Map<number, string>();   // chunk → last error for feedback

async function callLLM(chunkText: string, feedback?: string): Promise<any[]> {
  const user = feedback
    ? `Предыдущая попытка имела ошибку: «${feedback}». Исправь и верни ВЕСЬ исправленный JSON-массив целиком.\n\nФРАГМЕНТ ГАЙДА (${specId}, ${LANG_NAME[lang]}):\n\n${chunkText}`
    : `ФРАГМЕНТ ГАЙДА (${specId}, ${LANG_NAME[lang]}, страницы ${''}):\n\n${chunkText}`;
  const r = await zai.chat.completions.create({
    messages: [
      { role: 'assistant', content: SYSTEM },
      { role: 'user', content: user },
    ],
    ...(MODEL ? { model: MODEL } : {}),
    thinking: { type: 'disabled' },
    max_tokens: 8192,
  } as any);
  return extractJson(r.choices[0]?.message?.content || '');
}

async function worker(id: number) {
  while (queue.length) {
    const c = queue.shift()!;
    const suffix = (c as any)._part ? `_p${(c as any)._part}` : '';
    const outFile = path.join(outDir, `c${String(c.idx).padStart(3, '0')}${suffix}.json`);
    if (fs.existsSync(outFile)) { done++; continue; }
    let ok = false, lastErr = '';
    for (let att = 0; att < 4 && !ok; att++) {
      try {
        let arr = await callLLM(c.text, att > 0 ? lastErr : undefined);
        arr = autoSplit(arr);
        autoRepair(arr);
        const err = validate(arr);
        if (err) throw new Error(err);
        fs.writeFileSync(outFile, JSON.stringify(arr, null, 1));
        ok = true; done++;
        console.log(`[w${id}] chunk ${c.idx}: ${arr.length} блоков ok (${done}/${chunks.length})`);
      } catch (e: any) {
        lastErr = String(e?.message || e).slice(0, 220);
        if (lastErr.includes('429')) { await sleep(60000 + Math.random()*20000); att--; continue; }
        if (att === 1 && c.text.length > 2500 && lastErr.includes('JSON')) {
          const mid = Math.floor(c.text.length / 2);
          const cut = c.text.indexOf('\n', mid) + 1;
          queue.unshift({ ...c, text: c.text.slice(0, cut), _part: 1 },
                        { ...c, text: c.text.slice(cut), _part: 2 });
          console.log(`[w${id}] chunk ${c.idx}: split → 2 parts`);
          ok = true; break;
        }
        if (att === 3) { failed++; console.log(`[w${id}] chunk ${c.idx}: FAILED — ${lastErr}`); }
        else await sleep(2500);
      }
    }
  }
}

await Promise.all(Array.from({ length: CONC }, (_, i) => worker(i)));
console.log(`DONE ${specId}: ${done} ok, ${failed} failed`);
if (failed) process.exit(1);
