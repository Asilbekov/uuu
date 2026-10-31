/** Post-fix verification: the matrix question + full rescan + attempts. */
const fs = require('fs');
const { Client } = require('pg');
const env = fs.readFileSync('/home/z/my-project/uuu/.env', 'utf8');
const url = env.match(/^DATABASE_URL=(.*)$/m)[1].trim();

const SRC = '/home/z/my-project/uuu/scripts/seed/';
const SOURCES = {
  'cmvv6ttep0097q5j3z489lheb': 'weeks57_la_only.cjs',
  'cmvv6tt4b007iq5j3xr7wghq8': 'weeks57_math_only.cjs',
  'cmvv6tsuq004bq5j39vddoooq': 'weeks14_la_only.cjs',
  'cmvv6tsch0001q5j3uaypuuoi': 'weeks14_math_only.cjs',
};
const norm = (s) => String(s).replace(/\s+/g, ' ').trim();

(async () => {
  const c = new Client({ connectionString: url });
  await c.connect();

  // 1) the matrix question
  const mq = await c.query(
    `SELECT "correctAnswer","optionA","optionB","optionC","optionD" FROM "Question"
      WHERE id='cmvv6tteq00a0q5j3dgbytone'`);
  const m = mq.rows[0];
  console.log('=== MATRIX QUESTION AFTER FIX ===');
  console.log('correctAnswer:', m.correctAnswer);
  console.log('optionA:', m.optionA);
  console.log('optionA is the true inverse [[3,-2,1],[-2,2,-1],[1,-1,1]]:',
    m.optionA.includes('3 & -2 & 1') && m.optionA.includes('-2 & 2 & -1') && m.optionA.includes('1 & -1 & 1'));

  // 2) full rescan of the 4 math/LA tests
  console.log('\n=== FULL RESCAN ===');
  for (const [testId, file] of Object.entries(SOURCES)) {
    const def = require(SRC + file);
    const qs = await c.query(
      `SELECT "orderNum","correctAnswer","optionA","optionB","optionC","optionD","optionE"
         FROM "Question" WHERE "testId"=$1 ORDER BY "orderNum"`, [testId]);
    const t = await c.query(`SELECT title FROM "Test" WHERE id=$1`, [testId]);
    let ok = 0, bad = 0, noSrc = 0;
    qs.rows.forEach((row) => {
      const srcQ = def.questions[row.orderNum];
      if (!srcQ || !Array.isArray(srcQ.o) || !srcQ.o[0]) { noSrc++; return; }
      const letters = ['A', 'B', 'C', 'D', 'E'];
      const at = letters.find((L) => row['option' + L] && norm(row['option' + L]) === norm(srcQ.o[0]));
      if (at === norm(row.correctAnswer || '').toUpperCase()) ok++; else { bad++; console.log('  STILL BROKEN orderNum', row.orderNum); }
    });
    console.log(`${t.rows[0].title}: ${ok} OK, ${bad} broken, ${noSrc} no-source`);
  }

  // 3) attempts on LA W5-7
  const att = await c.query(
    `SELECT a.id, a.score, a."totalQuestions", a.completed, a."startedAt", u.name
       FROM "TestAttempt" a JOIN "User" u ON u.id=a."userId"
      WHERE a."testId"='cmvv6ttep0097q5j3z489lheb' ORDER BY a."startedAt" DESC LIMIT 12`);
  console.log('\n=== RECENT ATTEMPTS on LA W5-7 ===');
  att.rows.forEach((a) => console.log(' ', a.startedAt.toISOString().slice(0, 16), '|', a.name, '|', a.score, '/', a.totalQuestions, '| completed:', a.completed));

  await c.end();
})().catch((e) => { console.error('DB ERROR:', e.message); process.exit(1); });
