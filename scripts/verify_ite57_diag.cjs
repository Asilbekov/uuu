const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const m = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8').match(/^DATABASE_URL=(.*)$/m);
if (m) process.env.DATABASE_URL = m[1].trim();
const db = new PrismaClient();
const seed = require('./seed/weeks57_ite.cjs');

async function main() {
  const tests = await db.test.findMany({ where: { title: seed.title } });
  let fail = 0;
  for (const t of tests) {
    console.log(`\n=== ${t.id} (${t.isPublic ? 'public' : 'private'}) ===`);
    const qs = await db.question.findMany({ where: { testId: t.id }, orderBy: { orderNum: 'asc' } });
    // continuity
    for (let i = 0; i < qs.length; i++) {
      if (qs[i].orderNum !== i) { console.log(`  FAIL orderNum gap at ${i}: ${qs[i].orderNum}`); fail++; }
    }
    console.log(`  questions: ${qs.length}`);
    // 15 embedded
    const embeds = [4, 6, 11, 13, 14, 15, 20, 22, 24, 27, 31, 33, 35, 44, 48]; // post-overlay 1-based positions (base Q42/Q46 shift +2)
    for (const n of embeds) {
      const q = qs[n - 1];
      const seedQ = seed.questions[n - 1];
      const okText = q.text === seedQ.t;
      const okRu = q.translations && q.translations.ru && q.translations.ru.text === seedQ.ru.t;
      const okUz = q.translations && q.translations.uz && q.translations.uz.text === seedQ.uz.t;
      if (!okText || !okRu || !okUz) { console.log(`  FAIL Q${n} embed mismatch (t:${okText} ru:${okRu} uz:${okUz})`); fail++; }
    }
    console.log(`  15 embedded questions match seed (text+ru+uz): ${embeds.every((n) => qs[n-1].text === seed.questions[n-1].t) ? 'OK' : 'NO'}`);
    // 2 card questions
    for (const pos of [38, 39]) {
      const q = qs[pos - 1];
      const seedQ = seed.questions[pos - 1];
      const letters = ['A', 'B', 'C', 'D'];
      const corrIdx = letters.indexOf(q.correctAnswer);
      const correctOpt = q['option' + q.correctAnswer];
      const seedCorrect = seedQ.o[0];
      if (correctOpt !== seedCorrect) { console.log(`  FAIL Q${pos} correct option is not the seed-correct card: ${correctOpt} vs ${seedCorrect}`); fail++; }
      const allImg = letters.every((L) => (q['option' + L] || '').startsWith('![](/ite-diagrams/dp_'));
      if (!allImg) { console.log(`  FAIL Q${pos} some option is not a card image`); fail++; }
      // translations: options letter-mapped
      const trOk = ['ru', 'uz'].every((lang) => {
        const tr = q.translations && q.translations[lang];
        return tr && tr.text === seedQ[lang].t && letters.every((L) => tr.options[L] === q['option' + L]);
      });
      if (!trOk) { console.log(`  FAIL Q${pos} translations mismatch`); fail++; }
      console.log(`  Q${pos}: card question OK (correct=${q.correctAnswer} -> ${correctOpt})`);
    }
    // no accidental image on other questions
    const extra = qs.filter((q, i) => !embeds.includes(i + 1) && ![38, 39].includes(i + 1) && (q.text || '').includes('ite-diagrams'));
    if (extra.length) { console.log(`  FAIL ${extra.length} unexpected image questions`); fail++; }
    // every referenced png exists in public/
    const files = new Set(fs.readdirSync(path.join(__dirname, '..', 'public', 'ite-diagrams')));
    let missing = 0;
    for (const q of qs) {
      for (const s of [q.text, q.optionA, q.optionB, q.optionC, q.optionD, ...(q.translations ? [q.translations.ru?.text || '', q.translations.uz?.text || ''] : [])]) {
        for (const mm of (s || '').matchAll(/\((\/ite-diagrams\/[^)]+)\)/g)) {
          const f = mm[1].replace('/ite-diagrams/', '');
          if (!files.has(f)) { console.log(`  FAIL missing file ${f}`); missing++; fail++; }
        }
      }
    }
    if (!missing) console.log('  all referenced PNGs exist in public/ite-diagrams');
  }
  console.log(fail ? `\n${fail} FAILURES` : '\nALL CHECKS PASSED');
  process.exitCode = fail ? 1 : 0;
}
main().finally(() => db.$disconnect());
