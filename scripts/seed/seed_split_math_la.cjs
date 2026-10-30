/**
 * Split the combined Math&LA tests into per-subject tests:
 * - deletes "Math I & Linear Algebra: Weeks 1-4 Complete Test" (259 Q)
 * - deletes "Math I & Linear Algebra: Weeks 5-7 Complete Test" (111 Q)
 * - creates Math I W1-4 (149 Q), Linear Algebra I W1-4 (110 Q),
 *           Math I W5-7 (55 Q), Linear Algebra I W5-7 (56 Q)
 * Idempotent: re-running deletes and recreates the same titles.
 * Run: node scripts/seed/seed_split_math_la.cjs
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
const CREATOR_ID = 'cmp9z1mqf0000je3dx684zhoq';

const TO_DELETE = [
  'Math I & Linear Algebra: Weeks 1-4 Complete Test',
  'Math I & Linear Algebra: Weeks 5-7 Complete Test',
];

const MODULES = [
  ['./weeks14_math_only.cjs', 733],
  ['./weeks14_la_only.cjs',   757],
  ['./weeks57_math_only.cjs', 787],
  ['./weeks57_la_only.cjs',   809],
];

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
  const correctAnswer = letters[arr.findIndex((x) => x.key === 'correct')];
  return { options: arr.map((x) => x.value), correctAnswer, order: arr.map((x) => x.key) };
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
          const tr = {};
          for (const lang of ['ru', 'uz', 'en']) {
            if (!q[lang]) continue;
            const src = q[lang];
            const hasOpts = Array.isArray(src.o) && src.o.length === q.o.length;
            tr[lang] = {
              text: src.t,
              ...(hasOpts
                ? { options: Object.fromEntries(letters.map((L, li) => {
                    const key = order[li];
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
  for (const title of TO_DELETE) {
    const t = await db.test.findFirst({ where: { title, creatorId: CREATOR_ID } });
    if (t) {
      await db.test.delete({ where: { id: t.id } });
      console.log(`deleted combined test: ${title} (id ${t.id})`);
    } else {
      console.log(`already absent: ${title}`);
    }
  }
  for (const [mod, seed] of MODULES) {
    const p = path.join(__dirname, mod);
    if (!fs.existsSync(p)) { console.log(`skip: ${mod} not found`); continue; }
    const def = require(p);
    await upsertTest(def, seed);
  }
  await db.$disconnect();
})().catch(async (e) => { console.error(e); await db.$disconnect(); process.exit(1); });
