// Тест LLM: какой модели доступны + качество JSON-генерации блоков на реальном чанке
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const zai = await ZAI.create();

// 1) список моделей (если доступен)
try {
  const models = await (zai as any).models?.list?.() ?? null;
  if (models) console.log('MODELS:', JSON.stringify(models).slice(0, 500));
} catch (e) { console.log('(models.list недоступен)'); }

// 2) реальный чанк гайда math1_w14_en (страница 5-6 — задачи практикума с решениями)
const guide = fs.readFileSync('/home/z/my-project/content/guides/math1_w14_en.txt', 'utf8');
const m = guide.match(/=== PAGE 6 ===\n([\s\S]*?)=== PAGE 8 ===/);
const chunk = m ? m[1] : guide.slice(4000, 9000);
console.log('chunk length:', chunk.length);

const system = `Ты — сценарист образовательных видео в стиле 3Blue1Brown: разговорно, точно, с интонацией "сначала вопрос — потом ответ".
Ты получаешь фрагмент учебного PDF-гайда (текст извлечён из PDF, математическая нотация искажена — восстанавливай её в корректный LaTeX).
Твоя задача — превратить ВЕСЬ фрагмент без потерь в JSON-блоки для рендера видео.

СХЕМА БЛОКОВ (json array):
{"type":"section","data":{"num":N,"title":"...","subtitle":"..."},"narr":["..."],"narr_item":[-1]}
{"type":"concept","data":{"heading":"...","bullets":["...","..."]},"narr":["интро","про пункт 1","про пункт 2"],"narr_item":[-1,0,1]}
{"type":"formula","data":{"heading":"...","tex":"LaTeX","parts":[{"substr":"кусок tex","color":"#4C5FD5|#B45309|#0E7C7B|#A03040","note":"пояснение"}]},"narr":[...],"narr_item":[...]}
{"type":"example","data":{"heading":"...","problem":"условие своими словами","steps":[{"text":"шаг"}...],"result":"ответ"},"narr":[...],"narr_item":[...]}
{"type":"table","data":{"heading":"...","columns":[...],"rows":[[...],...]},"narr":[...],"narr_item":[...]}
{"type":"plot","data":{"heading":"...","functions":[{"fn":"numpy-выражение от x","tex":"метка","color":"#4C5FD5"}],"x_range":[a,b],"y_range":[a,b],"point":[x,y],"vline":x,"x_label":"","y_label":""},"narr":[...],"narr_item":[...]}
{"type":"timeline","data":{"heading":"...","events":[{"year":"...","text":"..."}]},"narr":[...],"narr_item":[...]}
{"type":"code","data":{"heading":"...","code":"...","highlight":[1]},"narr":[...],"narr_item":[...]}
{"type":"matrix","data":{"heading":"...","tex":"\\begin{pmatrix}...\\end{pmatrix}","steps":[{"text":"..."}]},"narr":[...],"narr_item":[...]}
{"type":"quote","data":{"text":"...","who":"..."},"narr":[...],"narr_item":[-1]}
{"type":"recap","data":{"heading":"...","items":["..."]},"narr":[...],"narr_item":[...]}
{"type":"outro","data":{"kicker":"...","message":"...","chip":"..."},"narr":[...],"narr_item":[-1]}

ЖЁСТКИЕ ПРАВИЛА:
1. НИЧЕГО не пропускать: каждая задача из фрагмента → example-блок со ВСЕМИ шагами решения; каждая формула → formula-блок; каждая таблица → table; каждый список дат/событий → timeline.
2. narr: массив реплик диктора. narr_item[k] = индекс элемента (bullet/step/part/row/event), к которому относится реплика k; -1 = общая интро/связка. Реплик ≥ чем элементов. Язык реплик = язык фрагмента (сейчас английский). Реплики разговорные, полные, БЕЗ сокращения шагов — диктор проговаривает каждый шаг.
3. tex: строгий KaTeX. Восстанавливай дроби \\frac, суммы \\sum, индексы, степени. Из "x2" → "x^2", из "a11" → "a_{11}", "n X k=0 akbk" → "\\sum_{k=0}^{n} a_k b^k".
4. Цвета parts: "#4C5FD5" индиго, "#B45309" янтарь, "#0E7C7B" бирюза, "#A03040" красный.
5. Блоки не длиннее 6 bullets/steps — дели длинные списки на несколько блоков.
6. Никакого markdown, только чистый JSON array. Никаких пояснений вокруг.
7. Проблемы нумеруй в heading: "Problem 12 — ..."`

const r = await zai.chat.completions.create({
  messages: [
    { role: 'assistant', content: system },
    { role: 'user', content: 'ФРАГМЕНТ ГАЙДА (Math I, Weeks 1-4, EN):\n\n' + chunk },
  ],
  thinking: { type: 'disabled' },
  max_tokens: 8192,
} as any);
const out = r.choices[0]?.message?.content || '';
console.log('model used, output length:', out.length);
fs.writeFileSync('/tmp/llm_test_out.json', out);
try {
  const arr = JSON.parse(out);
  console.log('VALID JSON, blocks:', arr.length, '| types:', arr.map(b=>b.type).join(','));
  console.log('narr_item samples:', JSON.stringify(arr.map(b=>b.narr_item)));
} catch (e) {
  console.log('JSON parse failed:', String(e).slice(0, 150));
  console.log('head:', out.slice(0, 300));
}
