// update_db_v2.ts — направить строки Attachment на видео v2 (GitHub release v2).
// После этого существующий Telegram-workflow подхватит их (SOURCE_SQL матчит
// releases/download/%) и перезальёт в канал, проставив свежий fallbackUrl.
import { SQL } from 'bun';

const DB = 'postgresql://neondb_owner:npg_omga5szZAf4l@ep-shiny-paper-aousfq8l-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const RELEASE = 'https://github.com/Asilbekov/uuu/releases/download/course-videos-v2/';

// video-id → (test-признак в title, язык)
const MAP: Record<string, [string, string]> = {
  math1_w14_en: ['Math I, Weeks 1-4', 'en'],
  math1_w14_ru: ['Math I, недели 1–4', 'ru'],
  math1_w14_uz: ['Math I, 1–4 haftalar', 'uz'],
  math1_w57_en: ['Math I, Weeks 5-7', 'en'],
  math1_w57_ru: ['Math I, недели 5–7', 'ru'],
  math1_w57_uz: ['Math I, 5–7 haftalar', 'uz'],
  la_w14_en: ['Linear Algebra I, Weeks 1-4', 'en'],
  la_w14_ru: ['Линейная алгебра I, недели 1–4', 'ru'],
  la_w14_uz: ['Chiziqli algebra I, 1–4 haftalar', 'uz'],
  la_w57_en: ['Linear Algebra I, Weeks 5-7', 'en'],
  la_w57_ru: ['Линейная алгебра I, недели 5–7', 'ru'],
  la_w57_uz: ['Chiziqli algebra I, 5–7 haftalar', 'uz'],
  cs_w47_en: ['Computer Science', 'en'],
  cs_w47_ru: ['Информатика', 'ru'],
  cs_w47_uz: ['Informatika', 'uz'],
  hist_w14_en: ['History of Uzbekistan, Weeks 1-4', 'en'],
  hist_w14_ru: ['История Узбекистана, недели 1–4', 'ru'],
  hist_w14_uz: ['Oʻzbekiston tarixi, 1–4 haftalar', 'uz'],
  hist_w56_en: ['History of Uzbekistan, Weeks 5-6', 'en'],
  hist_w56_ru: ['История Узбекистана, недели 5–6', 'ru'],
  hist_w56_uz: ['Oʻzbekiston tarixi, 5–6 haftalar', 'uz'],
  ite_w14_en: ['Introduction to Engineering, Weeks 1-4', 'en'],
  ite_w14_ru: ['Введение в инженерное дело, недели 1–4', 'ru'],
  ite_w14_uz: ['Muhandislikka kirish, 1–4 haftalar', 'uz'],
  ite_w57_en: ['Introduction to Engineering, Weeks 5-7', 'en'],
  ite_w57_ru: ['Введение в инженерное дело, недели 5–7', 'ru'],
  ite_w57_uz: ['Muhandislikka kirish, 5–7 haftalar', 'uz'],
  eng_w57_en: ['English for Engineering I, Weeks 5-7', 'en'],
  eng_w57_ru: ['English for Engineering I, недели 5–', 'ru'],
  eng_w57_uz: ['English for Engineering I, 5–7 haftalar', 'uz'],
  eng_w14qa_en: ['English for Engineering I, Weeks 1-4 (Q&A)', 'en'],
};

const only = process.argv.slice(2);   // можно передать подмножество video-id
const sql = new SQL(DB);

let ok = 0, missing = 0;
for (const [vid, [needle, lang]] of Object.entries(MAP)) {
  if (only.length && !only.includes(vid)) continue;
  const rows = await sql`SELECT id, title, url, size FROM "Attachment"
    WHERE type = 'video' AND title LIKE ${'%' + needle + '%'}`;
  let row = rows[0];
  // язык: EN-строки содержат "(EN)" и т.п.; Q&A — отдельная
  if (rows.length > 1) {
    row = rows.find(r => {
      const t = r.title.toLowerCase();
      const isQnA = t.includes('(q&a)');
      const wantQnA = vid.includes('qa');
      if (isQnA !== wantQnA) return false;
      const langMark = { en: '(en)', ru: '(ru)', uz: '(uz)' }[lang as 'en'|'ru'|'uz'];
      return t.includes(langMark);
    }) || rows[0];
  }
  if (!row) { console.log(`⚠️ ${vid}: строка не найдена (needle: ${needle})`); missing++; continue; }
  await sql`UPDATE "Attachment"
    SET url = ${RELEASE + vid + '.mp4'}, "fallbackUrl" = NULL, "updatedAt" = now()
    WHERE id = ${row.id}`;
  console.log(`✓ ${vid} → attachment ${row.id} (${String(row.title).slice(0, 50)})`);
  ok++;
}
console.log(`\nобновлено: ${ok}, не найдено: ${missing}`);
