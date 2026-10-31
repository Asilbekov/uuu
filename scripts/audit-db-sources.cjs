/**
 * FULL DB AUDIT — Phase 2: source-based verification, ORDER-INDEPENDENT.
 * Invariant: the option TEXT at the DB correctAnswer letter must equal the
 * source-correct option text (source convention: o[0] = correct).
 * Covers: Math/LA x4, CS, English W5-7, History W5-6, ITE W5-7,
 * English W1-4 merged (built from week1..week4 files).
 */
const fs = require('fs');
const { Client } = require('pg');
const env = fs.readFileSync('/home/z/my-project/uuu/.env', 'utf8');
const url = env.match(/^DATABASE_URL=(.*)$/m)[1].trim();
const SRC = '/home/z/my-project/uuu/scripts/seed/';
const norm = (s) => String(s).replace(/\s+/g, ' ').trim();
const LETTERS = ['A', 'B', 'C', 'D', 'E'];

// build sources
const week1 = require(SRC + 'week1.cjs');
const week2a = require(SRC + 'week2a.cjs');
const week2b = require(SRC + 'week2b.cjs');
const week3a = require(SRC + 'week3a.cjs');
const week3b = require(SRC + 'week3b.cjs');
const week4 = require(SRC + 'week4.cjs');
const englishMerged = [...week1.questions, ...week2a, ...week2b, ...week3a, ...week3b, ...week4.questions];

const SOURCES = [
  ['weeks14_la_only.cjs', require(SRC + 'weeks14_la_only.cjs').questions],
  ['weeks14_math_only.cjs', require(SRC + 'weeks14_math_only.cjs').questions],
  ['weeks57_la_only.cjs', require(SRC + 'weeks57_la_only.cjs').questions],
  ['weeks57_math_only.cjs', require(SRC + 'weeks57_math_only.cjs').questions],
  ['weeks57_cs.cjs', require(SRC + 'weeks57_cs.cjs').questions],
  ['weeks57_english.cjs', require(SRC + 'weeks57_english.cjs').questions],
  ['weeks57_history.cjs', require(SRC + 'weeks57_history.cjs').questions],
  ['weeks57_ite.cjs', require(SRC + 'weeks57_ite.cjs').questions],
  ['english_w14_merged (week1+2a+2b+3a+3b+4)', englishMerged],
];

(async () => {
  const c = new Client({ connectionString: url });
  await c.connect();
  const tests = await c.query(`SELECT id, title FROM "Test" ORDER BY title`);
  const qs = await c.query(`SELECT "testId","orderNum", text, "optionA","optionB","optionC","optionD","optionE","correctAnswer" FROM "Question" ORDER BY "testId","orderNum"`);
  const byTest = {};
  qs.rows.forEach((q) => { (byTest[q.testId] = byTest[q.testId] || []).push(q); });

  let matched = 0, checked = 0, broken = 0, noSource = [];
  const issues = [];

  for (const t of tests.rows) {
    const questions = byTest[t.id] || [];
    if (!questions.length) continue;
    const src = SOURCES.find(([f, arr]) =>
      Array.isArray(arr) && arr.length === questions.length &&
      questions.every((row) => {
        const q = arr[row.orderNum];
        return q && q.t && norm(q.t) === norm(row.text);
      })
    );
    if (!src) { noSource.push(`${t.title} (${questions.length}q, ${t.id})`); continue; }
    matched++;
    questions.forEach((row) => {
      const sq = src[1][row.orderNum];
      if (!Array.isArray(sq.o) || !sq.o[0]) { issues.push(`[${t.title} #${row.orderNum}] NO-SRC-OPTIONS`); return; }
      checked++;
      const letter = norm(row.correctAnswer || '').toUpperCase();
      const dbText = row['option' + letter];
      const wantText = norm(sq.o[0]);
      if (!dbText || norm(dbText) !== wantText) {
        broken++;
        const actual = LETTERS.filter((L) => row['option' + L] && norm(row['option' + L]) === wantText).join('');
        issues.push(`[${t.title} #${row.orderNum}] WRONG-LETTER: correctAnswer=${letter} but source-correct text sits at ${actual || 'NOWHERE'}`);
      }
    });
  }

  console.log(`source-matched tests: ${matched}/28`);
  console.log(`questions checked: ${checked}, WRONG-LETTER: ${broken}`);
  issues.forEach((i) => console.log('  ' + i));
  console.log(`\nNO SOURCE (${noSource.length}):`);
  noSource.forEach((n) => console.log('  ' + n));
  await c.end();
})().catch((e) => { console.error('DB ERROR:', e.message); process.exit(1); });
