/**
 * Add the Weeks 5-7 diagrams to the live "Introduction to Engineering —
 * Weeks 5-7: Complete Test" tests (in place, keeping ids/attempts stable):
 *   1. embed ![Diagram: ...](/ite-diagrams/t13..t27.png) into 15 questions
 *      (text + ru/uz translations), matching the Weeks 1-4 test treatment;
 *   2. insert 2 image-option questions (four data-problem cards) at
 *      positions 38-39, renumbering the rest;
 * Source of truth: scripts/seed/weeks57_ite.cjs (built by build_ite_test.py
 * + ite57_diag_embed.py). Idempotent: skips tests already carrying diagrams.
 * Run: node scripts/seed/patch_ite57_diagrams.cjs
 */
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const envPath = path.join(__dirname, '..', '..', '.env');
if (fs.existsSync(envPath)) {
  const m = fs.readFileSync(envPath, 'utf8').match(/^DATABASE_URL=(.*)$/m);
  if (m) process.env.DATABASE_URL = m[1].trim();
}
const db = new PrismaClient();

const data = require('./weeks57_ite.cjs');
const TITLE = data.title;

// ---- deterministic shuffle (copied verbatim from seed_weeks57.cjs) ----
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

// base (pre-overlay) 1-based indices that gained a diagram
const EMBED_BASE_INDICES = [4, 6, 11, 13, 14, 15, 20, 22, 24, 27, 31, 33, 35, 42, 46];
// post-overlay 0-based positions of the two new card questions
const NEW_Q_POSITIONS = [37, 38];
const SEED_BASE = 601; // ite seed base in seed_weeks57.cjs

function seedTextOf(q) {
  // strip the image markdown the overlay prepends
  return { en: q.t.replace(/^\n\n!\[[^\]]*\]\([^)]*\)/, ''),
           ru: (q.ru && q.ru.t || '').replace(/^\n\n!\[[^\]]*\]\([^)]*\)/, ''),
           uz: (q.uz && q.uz.t || '').replace(/^\n\n!\[[^\]]*\]\([^)]*\)/, '') };
}

async function patchTest(test) {
  let qs = await db.question.findMany({
    where: { testId: test.id },
    orderBy: { orderNum: 'asc' },
  });
  if (qs.length === 52 && qs.filter((q) => (q.text || '').includes('ite-diagrams')).length >= 15) {
    console.log(`  [skip] ${test.id} already fully patched`);
    return;
  }
  if (qs.length !== 50) {
    console.log(`  [skip] ${test.id} has ${qs.length} questions (expected 50)`);
    return;
  }
  if (!qs[0].text.startsWith('In Lecture 5, a model is defined as:')) {
    console.log(`  [skip] ${test.id} Q1 does not match the seed order`);
    return;
  }

  // 1) embed diagrams into the 15 questions — resumable: a question that
  //    already carries its diagram is verified and left alone
  let embedded = 0;
  for (const n of EMBED_BASE_INDICES) {
    // base order == DB order for all 50; in the overlaid seed the two card
    // questions are inserted after base position 37, so base Q>=38 shifts +2
    const seedQ = data.questions[n - 1 + (n >= 38 ? 2 : 0)];
    const dbQ = qs[n - 1];
    if (!seedQ.t.includes('ite-diagrams')) throw new Error(`seed Q${n} lacks diagram`);
    if ((dbQ.text || '').includes('ite-diagrams')) {
      if (dbQ.text === seedQ.t) continue; // already embedded (earlier partial run)
      throw new Error(`Q${n} carries a different diagram — manual review needed`);
    }
    const tr = dbQ.translations || {};
    const newTr = { ...tr };
    for (const lang of ['ru', 'uz']) {
      if (tr[lang]) newTr[lang] = { ...tr[lang], text: seedQ[lang].t };
    }
    await db.question.update({
      where: { id: dbQ.id },
      data: { text: seedQ.t, translations: newTr },
    });
    embedded++;
  }
  console.log(`  embedded diagrams into ${embedded} questions`);

  // 2) shift orderNum of everything at/after position 37 (0-based)
  await db.question.updateMany({
    where: { testId: test.id, orderNum: { gte: 37 } },
    data: { orderNum: { increment: 2 } },
  });

  // 3) create the two card questions
  for (let k = 0; k < NEW_Q_POSITIONS.length; k++) {
    const pos = NEW_Q_POSITIONS[k];
    const q = data.questions[pos];
    const { options, correctAnswer, order } = shuffleOptionsSeeded(q.o, SEED_BASE + pos * 7919);
    const letters = ['A', 'B', 'C', 'D'];
    const tr = {};
    for (const lang of ['ru', 'uz']) {
      const src = q[lang];
      tr[lang] = {
        text: src.t,
        options: Object.fromEntries(
          letters.map((L, li) => {
            const key = order[li];
            const origIdx = key === 'correct' ? 0 : parseInt(key.slice(1), 10);
            return [L, src.o[origIdx]];
          })
        ),
        explanation: src.e,
      };
    }
    await db.question.create({
      data: {
        testId: test.id,
        text: q.t,
        optionA: options[0],
        optionB: options[1],
        optionC: options[2],
        optionD: options[3],
        correctAnswer,
        explanation: q.e,
        translations: tr,
        orderNum: pos,
      },
    });
  }
  console.log(`  inserted 2 card questions at positions 38-39`);
}

async function main() {
  const tests = await db.test.findMany({ where: { title: TITLE } });
  console.log(`found ${tests.length} test(s) titled: ${TITLE}`);
  for (const t of tests) {
    console.log(`- ${t.id} (creator ${t.creatorId}, public=${t.isPublic})`);
    await patchTest(t);
  }
  // summary
  for (const t of tests) {
    const qs = await db.question.findMany({
      where: { testId: t.id },
      orderBy: { orderNum: 'asc' },
      select: { orderNum: true, text: true, translations: true },
    });
    const img = qs.filter((q) => (q.text || '').includes('ite-diagrams')).length;
    const ruImg = qs.filter((q) => q.translations && q.translations.ru && (q.translations.ru.text || '').includes('ite-diagrams')).length;
    const uzImg = qs.filter((q) => q.translations && q.translations.uz && (q.translations.uz.text || '').includes('ite-diagrams')).length;
    console.log(`  ${t.id}: ${qs.length} questions, ${img} with diagram text (ru ${ruImg}, uz ${uzImg})`);
  }
}
main().finally(() => db.$disconnect());
