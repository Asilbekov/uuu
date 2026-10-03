/**
 * Seed English for Engineering tests (Weeks 1-4) + attach study guides to the math test.
 * Run: DATABASE_URL=<neon url> bun scripts/seed/seed_all.cjs
 * Idempotent: deletes and recreates tests with the same exact titles.
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
  // 4 English tests
  await upsertTest(week1, 11);
  await upsertTest({
    title: 'English for Engineering I — Week 2: Present Simple vs Continuous; Articles',
    description: 'All Week 2 tasks: opinion and generalizing boxes, reading "Generalize, but don\'t stereotype!", articles in quotes and dialogues, Business Grammar & Practice (5 exercises) and the Present Simple & adverbs worksheet.',
    topic: 'English for Engineering',
    attachments: [
      { title: 'Full Study Guide PDF: English for Engineering I, Weeks 1-4 — Rules, Questions & Answers', type: 'pdf', url: 'https://raw.githubusercontent.com/Asilbekov/uuu/main/study-guides/English_for_Engineering_I_Weeks_1-4_Rules_Questions_Answers.pdf', size: 456982 },
      { title: 'Week 2 Video: Stephen Fry — "What Makes Us Human" (BBC Radio 2)', type: 'video', url: 'https://raw.githubusercontent.com/Asilbekov/uuu/main/course-files/english-for-engineering/Stephen_Fry_-_What_Makes_Us_Human__BBC_Radio_2___1_.mp4', size: 32625433 },
      { title: 'Extra listening: BBC Learning English — 6 Minute English', type: 'link', url: 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english' },
    ],
    questions: [...week2a, ...week2b],
  }, 23);
  await upsertTest({
    title: 'English for Engineering I — Week 3: Quantifiers, Numbers & Digital Life',
    description: 'All Week 3 tasks: quantifiers lead-in and activities, reading "8 ways to tidy up your digital life", Numbers practice (Sections B & C) and the Quantifiers worksheet (exercises 1-7). The Week 3 forum audio is attached.',
    topic: 'English for Engineering',
    attachments: [
      { title: 'Full Study Guide PDF: English for Engineering I, Weeks 1-4 — Rules, Questions & Answers', type: 'pdf', url: 'https://raw.githubusercontent.com/Asilbekov/uuu/main/study-guides/English_for_Engineering_I_Weeks_1-4_Rules_Questions_Answers.pdf', size: 456982 },
      { title: 'Week 3 Audio: 60-second forum extract on exchange & development (audio player)', type: 'audio', url: 'https://raw.githubusercontent.com/Asilbekov/uuu/main/course-files/english-for-engineering/Forum60sec__Exchange_leaders_of_deve.mp3', size: 2474785 },
      { title: 'Extra listening: BBC Learning English — 6 Minute English', type: 'link', url: 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english' },
    ],
    questions: [...week3a, ...week3b],
  }, 37);
  await upsertTest(week4, 51);

  // Group the four English tests into one named set (dashboard "Test Sets" block)
  const SET_TITLE = 'English for Engineering I — Weeks 1-4';
  let engSet = await db.testSet.findFirst({ where: { title: SET_TITLE } });
  if (!engSet) {
    engSet = await db.testSet.create({
      data: {
        title: SET_TITLE,
        description: 'All four weekly tests in one set: Present Simple & Getting to Know You, Present Simple vs Continuous & Articles, Quantifiers & Numbers & Digital Life, and Prepositions & "The power of numbers". Full study-guide PDF and all audio/video are attached to each test.',
        topic: 'English for Engineering',
      },
    });
    console.log(`created set: ${SET_TITLE}`);
  }
  const engTests = await db.test.findMany({
    where: { topic: 'English for Engineering' },
    orderBy: { createdAt: 'asc' },
  });
  for (const t of engTests.sort((a, b) => a.title.localeCompare(b.title, 'en', { numeric: true }))) {
    await db.test.update({ where: { id: t.id }, data: { setId: engSet.id } });
  }
  console.log(`${engTests.length} English tests assigned to the set`);

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
