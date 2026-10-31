/**
 * FULL DB AUDIT — Phase 3: cross-copy comparison + combined-source try.
 * 1) Math&LA W1-4 Templates (259q) vs combined source [math149+la110] and [la110+math149]
 * 2) Groups of copies (History W1-4 x3, ITE W1-4 x3, LAG1 x3, Physics overlap):
 *    same question text across tests => correct option TEXT must agree.
 */
const fs = require('fs');
const { Client } = require('pg');
const env = fs.readFileSync('/home/z/my-project/uuu/.env', 'utf8');
const url = env.match(/^DATABASE_URL=(.*)$/m)[1].trim();
const SRC = '/home/z/my-project/uuu/scripts/seed/';
const norm = (s) => String(s).replace(/\s+/g, ' ').trim();
const LETTERS = ['A', 'B', 'C', 'D', 'E'];

const mathQ = require(SRC + 'weeks14_math_only.cjs').questions;
const laQ = require(SRC + 'weeks14_la_only.cjs').questions;
const COMBINED = {
  'math149+la110': [...mathQ, ...laQ],
  'la110+math149': [...laQ, ...mathQ],
};

(async () => {
  const c = new Client({ connectionString: url });
  await c.connect();
  const tests = await c.query(`SELECT id, title FROM "Test" ORDER BY title`);
  const qs = await c.query(`SELECT "testId","orderNum", text, "optionA","optionB","optionC","optionD","optionE","correctAnswer" FROM "Question" ORDER BY "testId","orderNum"`);
  const byTest = {};
  qs.rows.forEach((q) => { (byTest[q.testId] = byTest[q.testId] || []).push(q); });
  const titleById = {};
  tests.rows.forEach((t) => { titleById[t.id] = t.title; });

  // ---- 1) Math&LA Templates vs combined sources ----
  console.log('=== Math&LA W1-4 Templates vs combined source ===');
  for (const t of tests.rows) {
    if (!t.title.includes('Math I & Linear Algebra: Weeks 1-4')) continue;
    const questions = byTest[t.id] || [];
    for (const [name, arr] of Object.entries(COMBINED)) {
      const match = arr.length === questions.length &&
        questions.every((row) => { const q = arr[row.orderNum]; return q && q.t && norm(q.t) === norm(row.text); });
      if (match) {
        let wrong = 0;
        questions.forEach((row) => {
          const sq = arr[row.orderNum];
          const letter = norm(row.correctAnswer || '').toUpperCase();
          const dbText = row['option' + letter];
          if (!dbText || norm(dbText) !== norm(sq.o[0])) {
            wrong++;
            const at = LETTERS.filter((L) => row['option' + L] && norm(row['option' + L]) === norm(sq.o[0])).join('');
            console.log(`  [${t.title} #${row.orderNum}] WRONG-LETTER ${letter}->${at || '?'} : ${norm(sq.o[0]).slice(0, 60)}`);
          }
        });
        console.log(`  ${t.title} [${t.id}] matches ${name}: ${questions.length}q, wrong=${wrong}`);
      }
    }
  }

  // ---- 2) cross-copy comparison ----
  console.log('\n=== Cross-copy comparison (same question text -> correct TEXT must agree) ===');
  // map: normText -> [{test, orderNum, correctText}]
  const global = new Map();
  for (const t of tests.rows) {
    for (const row of byTest[t.id] || []) {
      const k = norm(row.text);
      if (!k) continue;
      const letter = norm(row.correctAnswer || '').toUpperCase();
      const correctText = row['option' + letter] ? norm(row['option' + letter]) : '(EMPTY)';
      if (!global.has(k)) global.set(k, []);
      global.get(k).push({ test: t.title, orderNum: row.orderNum, correctText });
    }
  }
  let multi = 0, divergent = 0;
  for (const [text, entries] of global) {
    if (entries.length < 2) continue;
    multi++;
    const texts = new Set(entries.map((e) => e.correctText));
    if (texts.size > 1) {
      divergent++;
      console.log(`  DIVERGENT [${text.slice(0, 70)}...]:`);
      entries.forEach((e) => console.log(`    ${e.test} #${e.orderNum} -> "${e.correctText.slice(0, 70)}"`));
    }
  }
  console.log(`shared question texts: ${multi}, divergent correct-answers: ${divergent}`);

  await c.end();
})().catch((e) => { console.error('DB ERROR:', e.message); process.exit(1); });
