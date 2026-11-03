// VLM-проверка стоп-кадров рендера (glm-4.6v)
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const files = process.argv.slice(2);
if (!files.length) { console.error('usage: bun check_stills.ts <jpg...>'); process.exit(1); }
const zai = await ZAI.create();
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

for (const f of files) {
  const b64 = fs.readFileSync(f).toString('base64');
  let done = false;
  for (let att = 0; att < 4 && !done; att++) {
    try {
      const r = await zai.chat.completions.createVision({
        model: 'glm-4.6v',
        messages: [
          { role: 'assistant', content: [{ type: 'text', text: 'Отвечай только текстом, без markdown.' }] },
          {
            role: 'user', content: [
              { type: 'text', text: 'Кадр из обучающего видео 1920x1080. Кратко по-русски в одну строку: тип слайда | проблемы (обрезан/налезает текст, пустые заглушки, «···», красные ошибки формул) | оценка вёрстки 1-10.' },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${b64}` } },
            ],
          },
        ],
        thinking: { type: 'disabled' },
      });
      console.log(f.split('/').pop(), '→', (r.choices?.[0]?.message?.content || '').trim().replace(/\n+/g, ' '));
      done = true;
    } catch (e: any) {
      const s = String(e?.message || e);
      if (s.includes('429')) { await sleep(20000); }
      else { console.log(f.split('/').pop(), '→ ERR', s.slice(0, 100)); done = true; }
    }
  }
  await sleep(4000);
}
