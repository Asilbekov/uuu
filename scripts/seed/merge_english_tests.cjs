/**
 * Merge the four "English for Engineering I — Week N" tests into ONE test.
 * - Copies all questions (in week order) verbatim (options are already shuffled in DB).
 * - Merges attachments (dedupe by URL) and REMOVES the math/linear-algebra study
 *   guides (Study_Guide_Weeks_1-4_EN/RU/UZ.pdf) that were wrongly attached to Week 4.
 * - Re-points attempts (with per-question answer mapping) and chat messages.
 * - Deletes the 4 source tests and all TestSet rows.
 * Idempotent: if the merged test already exists it is deleted and rebuilt from
 * the source tests; source tests are only deleted after a successful build.
 *
 * Run: node scripts/seed/merge_english_tests.cjs
 */
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

function getDbUrl() {
  const env = process.env.DATABASE_URL || '';
  if (env.startsWith('postgres')) return env;
  const src = fs.readFileSync(path.join(__dirname, '..', 'final-scan.cjs'), 'utf8');
  const m = src.match(/DATABASE_URL\s*=\s*['"]([^'"]+)['"]/);
  return m ? m[1] : env;
}
const db = new PrismaClient({ datasources: { db: { url: getDbUrl() } } });

const MERGED_TITLE = 'English for Engineering I — Weeks 1-4: Complete Test';
const MERGED_DESCRIPTION =
  'All four weeks in one test: Week 1 Present Simple & "Getting to know you" + TED "Stereotypes"; ' +
  'Week 2 Present Simple vs Continuous, Articles & Business Grammar; Week 3 Quantifiers, Numbers & Digital Life; ' +
  'Week 4 Prepositions of movement, "The power of numbers" & Test 1 prep. ' +
  'The full study-guide PDF and all course audio/video players are attached to the test.';

// Math / linear-algebra study guides that must NOT be attached to English tests
const MATH_GUIDE_MARKERS = ['Study_Guide_Weeks_1-4_EN.pdf', 'Study_Guide_Weeks_1-4_RU.pdf', 'Study_Guide_Weeks_1-4_UZ.pdf'];

function weekNumber(title) {
  const m = title.match(/Week\s*(\d+)/i);
  return m ? parseInt(m[1], 10) : 99;
}

(async () => {
  const sources = (await db.test.findMany({
    where: { topic: 'English for Engineering' },
    include: { questions: { orderBy: { orderNum: 'asc' } }, attachments: { orderBy: { orderNum: 'asc' } }, _count: { select: { attempts: true } } },
  })).sort((a, b) => weekNumber(a.title) - weekNumber(b.title));

  if (sources.length === 0) {
    console.log('No source English tests found. Nothing to do (already merged?).');
    await db.$disconnect();
    return;
  }
  if (sources.length === 1 && sources[0].title === MERGED_TITLE) {
    console.log('Single merged English test already exists. Nothing to do.');
    await db.$disconnect();
    return;
  }

  const oldIds = sources.filter(t => t.title !== MERGED_TITLE).map(t => t.id);
  const weekTests = sources.filter(t => t.title !== MERGED_TITLE)
    .sort((a, b) => weekNumber(a.title) - weekNumber(b.title));
  const first = weekTests[0];

  console.log(`Source tests (${weekTests.length}):`);
  for (const t of weekTests) console.log(`  - ${t.title} | q=${t.questions.length} att=${t.attachments.length} attempts=${t._count.attempts}`);

  // 0. Drop a previous merged test if re-running (keep its chat by moving it back;
  //    its attempt copies are dropped — the originals still live on the source tests)
  const prevMerged = sources.find(t => t.title === MERGED_TITLE);
  if (prevMerged) {
    await db.chatMessage.updateMany({ where: { testId: prevMerged.id }, data: { testId: first.id } });
    await db.testAttempt.deleteMany({ where: { testId: prevMerged.id } });
    await db.test.delete({ where: { id: prevMerged.id } });
    console.log(`Deleted previous merged test ${prevMerged.id} (rebuild)`);
  }

  // 1. Create the merged test
  const merged = await db.test.create({
    data: {
      title: MERGED_TITLE,
      description: MERGED_DESCRIPTION,
      topic: first.topic,
      creatorId: first.creatorId,
      isPublic: first.isPublic,
      randomizeQuestions: first.randomizeQuestions,
      randomizeOptions: first.randomizeOptions,
    },
  });
  console.log(`Created merged test ${merged.id}`);

  // 2. Copy questions verbatim in week order, keep old->new id map for attempts
  const qIdMap = new Map();
  let order = 0;
  for (const t of weekTests) {
    for (const q of t.questions) {
      const created = await db.question.create({
        data: {
          testId: merged.id,
          text: q.text,
          optionA: q.optionA, optionB: q.optionB, optionC: q.optionC, optionD: q.optionD,
          optionE: q.optionE || null,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || null,
          imageNumber: q.imageNumber ?? null,
          orderNum: order++,
        },
      });
      qIdMap.set(q.id, created.id);
    }
  }
  console.log(`Copied ${order} questions`);

  // 3. Merge attachments: dedupe by URL, skip math guides
  const seenUrls = new Set();
  const atts = [];
  for (const t of weekTests) {
    for (const a of t.attachments) {
      if (MATH_GUIDE_MARKERS.some(mk => (a.url || '').includes(mk))) {
        console.log(`  SKIP math guide: ${a.title}`);
        continue;
      }
      if (seenUrls.has(a.url)) { console.log(`  SKIP duplicate: ${a.title}`); continue; }
      seenUrls.add(a.url);
      atts.push({ title: a.title, type: a.type, url: a.url, size: a.size ?? null });
    }
  }
  await db.attachment.createMany({
    data: atts.map((a, i) => ({ ...a, testId: merged.id, orderNum: i })),
  });
  console.log(`Attached ${atts.length} files:`);
  for (const a of atts) console.log(`  [${atts.indexOf(a)}] ${a.type} | ${a.title}`);

  // 4. Re-point chat messages
  const chatMoved = await db.chatMessage.updateMany({ where: { testId: { in: oldIds } }, data: { testId: merged.id } });
  console.log(`Chat messages moved: ${chatMoved.count}`);

  // 5. Migrate attempts (score/total preserved; answers re-pointed via qIdMap)
  let attemptsMoved = 0, answersMoved = 0, attemptsDropped = 0;
  for (const oldId of oldIds) {
    const atts2 = await db.testAttempt.findMany({ where: { testId: oldId }, include: { answers: true } });
    for (const at of atts2) {
      const newAttempt = await db.testAttempt.create({
        data: {
          testId: merged.id,
          userId: at.userId,
          score: at.score,
          totalQuestions: at.totalQuestions,
          completed: at.completed,
          startedAt: at.startedAt,
          completedAt: at.completedAt,
        },
      });
      attemptsMoved++;
      for (const ans of at.answers) {
        const newQid = qIdMap.get(ans.questionId);
        if (!newQid) continue;
        await db.attemptAnswer.create({
          data: { attemptId: newAttempt.id, questionId: newQid, selectedAnswer: ans.selectedAnswer, isCorrect: ans.isCorrect },
        });
        answersMoved++;
      }
    }
  }
  console.log(`Attempts migrated: ${attemptsMoved} (answers: ${answersMoved}, dropped attempts: ${attemptsDropped})`);

  // 6. Delete source tests (cascade: questions, attachments, old attempt rows)
  // TestAttempt has no onDelete: Cascade in the schema — delete migrated rows explicitly.
  const delAttempts = await db.testAttempt.deleteMany({ where: { testId: { in: oldIds } } });
  console.log(`Deleted old attempt rows: ${delAttempts.count}`);
  for (const id of oldIds) await db.test.delete({ where: { id } });
  console.log(`Deleted ${oldIds.length} source tests`);

  // 7. Delete all TestSets (feature removed per user request)
  const setCount = await db.testSet.count();
  await db.testSet.deleteMany({});
  console.log(`TestSets deleted: ${setCount}`);

  // Final check
  const final = await db.test.findFirst({ where: { topic: 'English for Engineering' }, include: { _count: { select: { questions: true, attachments: true, attempts: true } } } });
  console.log(`\nFINAL: ${final.title} | q=${final._count.questions} att=${final._count.attachments} attempts=${final._count.attempts}`);
  await db.$disconnect();
})().catch(e => { console.error(e); process.exit(1); });
