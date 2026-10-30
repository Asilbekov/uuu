/**
 * Seed weeks 5-7 tests (all 5 subjects) into the live Neon DB.
 * Idempotent: deletes and recreates tests with the same exact titles.
 * Question format per module: { t, o: [CORRECT FIRST, w1, w2, w3], e,
 *   ru: { t, o: [4 translated], e }, uz: { t, o: [4 translated], e } }
 * (history: base = uz, plus ru + en; english: no options in translations)
 * Attachments: study-guides PDFs served from raw.githubusercontent.com main.
 * Run: node scripts/seed/seed_weeks57.cjs   (reads DATABASE_URL from .env)
 */
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

if (!process.env.DATABASE_URL) {
  const envPath = path.join(__dirname, '..', '..', '.env');
  if (fs.existsSync(envPath)) {
    const m = fs.readFileSync(envPath, 'utf8').match(/^DATABASE_URL=(.*)$/m);
    if (m) process.env.DATABASE_URL = m[1].trim();
  }
}

const db = new PrismaClient();
const CREATOR_ID = 'cmp9z1mqf0000je3dx684zhoq'; // Demo User
const RAW = 'https://raw.githubusercontent.com/Asilbekov/uuu/main/study-guides/';

const MODULES = {
  math: './weeks57_math.cjs',
  history: './weeks57_history.cjs',
  ite: './weeks57_ite.cjs',
  english: './weeks57_english.cjs',
  cs: './weeks57_cs.cjs',
};

function guideSize(file) {
  const p = path.join(__dirname, '..', '..', 'study-guides', file);
  try { return fs.statSync(p).size; } catch { return null; }
}
function attach(file, title) {
  return { title, type: 'pdf', url: RAW + file, size: guideSize(file) };
}

// Deterministic option shuffle: first option is always the correct one in the source data
function shuffleOptionsSeeded(options, seed) {
  const padded = [...options];
  while (padded.length < 4) {
    padded.push(padded.length === 3 ? 'None of the above' : 'All of the above');
  }
  const arr = padded.map((value, i) => ({ value, key: i === 0 ? 'correct' : `w${i}` }));
  let s = seed;
  const rnd = () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const letters = ['A', 'B', 'C', 'D'];
  const correctAnswer = letters[arr.findIndex(x => x.key === 'correct')];
  return { options: arr.map(x => x.value), correctAnswer, order: arr.map(x => x.key) };
}

async function upsertTest(def, seedBase) {
  const existing = await db.test.findFirst({ where: { title: def.title, creatorId: CREATOR_ID } });
  if (existing) {
    await db.test.delete({ where: { id: existing.id } });
    console.log(`deleted existing: ${def.title}`);
  }
  const created = await db.test.create({
    data: {
      title: def.title,
      description: def.description,
      topic: def.topic,
      creatorId: CREATOR_ID,
      isPublic: true,
      randomizeQuestions: true,
      randomizeOptions: true,
      questions: {
        create: def.questions.map((q, i) => {
          const { options, correctAnswer, order } = shuffleOptionsSeeded(q.o, seedBase + i * 7919);
          const letters = ['A', 'B', 'C', 'D'];
          // translations follow the shuffled order: letter X shows the translated
          // variant of the ORIGINAL option that landed on position X.
          const tr = {};
          for (const lang of ['ru', 'uz', 'en']) {
            if (!q[lang]) continue;
            const src = q[lang];
            const hasOpts = Array.isArray(src.o) && src.o.length === q.o.length;
            tr[lang] = {
              text: src.t,
              ...(hasOpts
                ? { options: Object.fromEntries(letters.map((L, li) => {
                    const key = order[li];               // 'correct' | 'w1' | 'w2' | 'w3'
                    const origIdx = key === 'correct' ? 0 : parseInt(key.slice(1), 10);
                    return [L, src.o[origIdx]];
                  })) }
                : {}),
              ...(src.e ? { explanation: src.e } : {}),
            };
          }
          return {
            text: q.t,
            optionA: options[0],
            optionB: options[1],
            optionC: options[2],
            optionD: options[3],
            correctAnswer,
            explanation: q.e,
            orderNum: i,
            ...(Object.keys(tr).length ? { translations: tr } : {}),
          };
        }),
      },
      attachments: {
        create: def.attachments.map((a, i) => ({
          title: a.title, type: a.type, url: a.url, size: a.size ?? null, orderNum: i,
        })),
      },
    },
  });
  console.log(`created: ${def.title} — ${def.questions.length} questions, ${def.attachments.length} attachments (id ${created.id})`);
}

(async () => {
  const seedBases = { math: 501, history: 577, ite: 601, english: 633, cs: 677 };
  for (const [key, mod] of Object.entries(MODULES)) {
    const p = path.join(__dirname, mod);
    if (!fs.existsSync(p)) { console.log(`skip ${key}: ${mod} not found`); continue; }
    const def = require(p);
    await upsertTest(def, seedBases[key]);
  }
  await db.$disconnect();
})().catch(async (e) => { console.error(e); await db.$disconnect(); process.exit(1); });
