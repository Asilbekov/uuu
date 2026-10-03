/**
 * Seed English for Engineering as ONE merged test (Weeks 1-4, all questions)
 * + attach study guides to the math test.
 * Run: DATABASE_URL=<neon url> node scripts/seed/seed_all.cjs
 * Idempotent: deletes and recreates the test with the same exact title.
 */
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

const week1 = require('./week1.cjs');
const week2a = require('./week2a.cjs');
const week2b = require('./week2b.cjs');
const week3a = require('./week3a.cjs');
const week3b = require('./week3b.cjs');
const week4 = require('./week4.cjs');

const CREATOR_ID = 'cmp9z1mqf0000je3dx684zhoq'; // Demo User — creator of the math test
const MATH_TEST_ID = 'cmuq34mpp0001qz2w4uaiye6l'; // "Math I & Linear Algebra: Weeks 1-4 Complete Test"

const STUDY_GUIDES = [
  { title: 'Study Guide (EN) — Linear Algebra Math I, Weeks 1-4', type: 'pdf', url: 'https://raw.githubusercontent.com/Asilbekov/uuu/main/study-guides/Study_Guide_Weeks_1-4_EN.pdf', size: 500393 },
  { title: 'Study Guide (RU) — Линейная алгебра и математика I, недели 1-4', type: 'pdf', url: 'https://raw.githubusercontent.com/Asilbekov/uuu/main/study-guides/Study_Guide_Weeks_1-4_RU.pdf', size: 518478 },
  { title: 'Study Guide (UZ) — Chiziqli algebra, 1-4 haftalar', type: 'pdf', url: 'https://raw.githubusercontent.com/Asilbekov/uuu/main/study-guides/Study_Guide_Weeks_1-4_UZ.pdf', size: 479869 },
];

// One single English test: all weeks merged (per user request — no per-week tests, no test sets)
const ENGLISH_MERGED = {
  title: 'English for Engineering I — Weeks 1-4: Complete Test',
  description:
    'All four weeks in one test: Week 1 Present Simple & "Getting to know you" + TED "Stereotypes"; ' +
    'Week 2 Present Simple vs Continuous, Articles & Business Grammar; Week 3 Quantifiers, Numbers & Digital Life; ' +
    'Week 4 Prepositions of movement, "The power of numbers" & Test 1 prep. ' +
    'The full study-guide PDF and all course audio/video players are attached to the test.',
  topic: 'English for Engineering',
  attachments: dedupeByUrl([
    ...week1.attachments,
    ...week2a.attachments || [],
    ...week2b.attachments || [],
    ...week3a.attachments || [],
    ...week3b.attachments || [],
    ...week4.attachments,
  ]),
  questions: [...week1.questions, ...week2a, ...week2b, ...week3a, ...week3b, ...week4.questions],
};

// week2/week3 data modules export plain question arrays; attachment arrays live on
// the wrapper objects used previously. Guard against undefined entries above and
// filter math/linear-algebra guides here — they belong to the math test only.
function dedupeByUrl(list) {
  const MATH_GUIDE_MARKERS = ['Study_Guide_Weeks_1-4_EN.pdf', 'Study_Guide_Weeks_1-4_RU.pdf', 'Study_Guide_Weeks_1-4_UZ.pdf'];
  const seen = new Set();
  const out = [];
  for (const a of list) {
    if (!a || MATH_GUIDE_MARKERS.some(mk => (a.url || '').includes(mk))) continue;
    if (seen.has(a.url)) continue;
    seen.add(a.url);
    out.push(a);
  }
  return out;
}

// Deterministic option shuffle: first option is always the correct one in the source data
function shuffleOptionsSeeded(options, seed) {
  // pad to 4 options with meaningful fallback distractors
  const padded = [...options];
  while (padded.length < 4) {
    padded.push(padded.length === 3 ? 'Neither is possible' : 'Both are possible');
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
  return { options: arr.map(x => x.value), correctAnswer };
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
          const { options, correctAnswer } = shuffleOptionsSeeded(q.o, seedBase + i * 7919);
          return {
            text: q.t,
            optionA: options[0],
            optionB: options[1],
            optionC: options[2],
            optionD: options[3],
            correctAnswer,
            explanation: q.e,
            orderNum: i,
          };
        }),
      },
      attachments: {
        create: def.attachments.map((a, i) => ({
          title: a.title,
          type: a.type,
          url: a.url,
          size: a.size ?? null,
          orderNum: i,
        })),
      },
    },
  });
  console.log(`created: ${def.title} — ${def.questions.length} questions, ${def.attachments.length} attachments (id ${created.id})`);
}

(async () => {
  // ONE merged English test (Weeks 1-4)
  await upsertTest(ENGLISH_MERGED, 11);

  // Attach the 3 study guides (EN/RU/UZ) to the existing math test
  const math = await db.test.findUnique({
    where: { id: MATH_TEST_ID },
    include: { attachments: true },
  });
  if (!math) {
    console.error('Math test not found:', MATH_TEST_ID);
    process.exit(1);
  }
  await db.attachment.deleteMany({ where: { testId: MATH_TEST_ID } });
  await db.attachment.createMany({
    data: STUDY_GUIDES.map((g, i) => ({ ...g, testId: MATH_TEST_ID, orderNum: i })),
  });
  console.log(`math test "${math.title}": 3 study guides attached`);

  const counts = await Promise.all([
    db.question.count({ where: { test: { topic: 'English for Engineering' } } }),
    db.attachment.count(),
  ]);
  console.log(`total English questions: ${counts[0]}, total attachments: ${counts[1]}`);
  await db.$disconnect();
})().catch(e => { console.error(e); process.exit(1); });
