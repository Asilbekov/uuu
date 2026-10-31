/**
 * FIX STALE correctAnswer LETTERS in the live Neon DB.
 *
 * Root cause: an in-place option rewrite (latexify pass) stored options in
 * SOURCE order (correct-first -> landed on letter A) but left the
 * seed-time shuffled correctAnswer letters (B/C/D) untouched. The letter
 * then points at a WRONG option -> correct answers graded wrong.
 *
 * Rule: for every DB test whose questions EXACTLY match a source seed file
 * (correct-first convention), set correctAnswer to the letter that actually
 * holds the source-correct option text. No other field is touched.
 *
 * Safety: skips questions with duplicate option texts or where the
 * source-correct text is absent; full backup of every change is written.
 *
 * Usage: node fix_letters.cjs            (dry run)
 *        node fix_letters.cjs --apply    (write to DB)
 */
const fs = require('fs');
const { Client } = require('pg');

const env = fs.readFileSync('/home/z/my-project/uuu/.env', 'utf8');
const url = env.match(/^DATABASE_URL=(.*)$/m)[1].trim();
const SRC = '/home/z/my-project/uuu/scripts/seed/';

const APPLY = process.argv.includes('--apply');
const norm = (s) => String(s).replace(/\s+/g, ' ').trim();

// ---- load all candidate source files (correct-first convention) ----
const sourceFiles = fs.readdirSync(SRC).filter((f) => f.endsWith('.cjs') && !f.startsWith('seed_') && !f.startsWith('patch_') && !f.startsWith('merge_') && !f.startsWith('add_') && !f.startsWith('inspect_'));
const sources = sourceFiles.map((f) => {
  const def = require(SRC + f);
  return { file: f, title: def.title, questions: def.questions };
});
console.log('source files loaded:', sources.map((s) => s.file).join(', '));

(async () => {
  const client = new Client({ connectionString: url });
  await client.connect();

  const tests = await client.query(`SELECT id, title, "creatorId" FROM "Test" ORDER BY title`);
  console.log(`tests in DB: ${tests.rows.length}\n`);

  const backup = [];
  const report = [];
  let totalFixed = 0, totalSkipped = 0;

  for (const t of tests.rows) {
    try {
    const qs = await client.query(
      `SELECT id, "orderNum", "correctAnswer", text, "optionA","optionB","optionC","optionD","optionE"
         FROM "Question" WHERE "testId"=$1 ORDER BY "orderNum"`, [t.id]);
    if (!qs.rows.length) continue;

    // find a source whose questions match this test EXACTLY (count + every text, keyed by orderNum)
    const src = sources.find((s) =>
      Array.isArray(s.questions) &&
      s.questions.length === qs.rows.length &&
      qs.rows.every((row) => {
        const q = s.questions[row.orderNum];
        return q && q.t && norm(q.t) === norm(row.text);
      })
    );
    if (!src) { report.push({ test: t.title, id: t.id, status: 'NO SOURCE MATCH (skipped)' }); continue; }

    const letters = ['A', 'B', 'C', 'D', 'E'];
    const fixes = [], skips = [];
    qs.rows.forEach((row) => {
      const srcQ = src.questions[row.orderNum];
      if (!Array.isArray(srcQ.o) || !srcQ.o.length || !srcQ.o[0]) { skips.push({ orderNum: row.orderNum, why: 'source question has no options' }); return; }
      const srcCorrect = norm(srcQ.o[0]);
      // count occurrences of the correct text among DB options
      const positions = letters.filter((L) => row['option' + L] && norm(row['option' + L]) === srcCorrect);
      if (positions.length === 0) { skips.push({ orderNum: row.orderNum, why: 'correct text not found' }); return; }
      if (positions.length > 1) { skips.push({ orderNum: row.orderNum, why: 'duplicate option texts' }); return; }
      const should = positions[0];
      const current = norm(row.correctAnswer || '').toUpperCase();
      if (should === current) return; // already consistent
      fixes.push({ id: row.id, orderNum: row.orderNum, from: current, to: should });
    });

    if (fixes.length) {
      report.push({ test: t.title, id: t.id, source: src.file, questions: qs.rows.length, broken: fixes.length, skipped: skips.length });
      for (const f of fixes) {
        backup.push({ questionId: f.id, testId: t.id, testTitle: t.title, orderNum: f.orderNum, oldLetter: f.from, newLetter: f.to, at: new Date().toISOString() });
      }
      if (APPLY) {
        for (const f of fixes) {
          await client.query(`UPDATE "Question" SET "correctAnswer"=$1 WHERE "id"=$2`, [f.to, f.id]);
        }
        totalFixed += fixes.length;
      } else {
        console.log(`[dry-run] would fix ${fixes.length} in "${t.title}": e.g. orderNum ${fixes.slice(0, 3).map((f) => `${f.orderNum}:${f.from}->${f.to}`).join(', ')}${fixes.length > 3 ? ', ...' : ''}`);
      }
    } else {
      report.push({ test: t.title, id: t.id, source: src.file, questions: qs.rows.length, broken: 0, skipped: skips.length, status: 'already consistent' });
    }
    totalSkipped += skips.length;
    } catch (err) {
      report.push({ test: t.title, id: t.id, status: 'ERROR: ' + err.message });
    }
  }

  console.log('\n=== REPORT ===');
  report.forEach((r) => console.log(JSON.stringify(r)));
  console.log(`\n${APPLY ? 'FIXED' : 'WOULD FIX'}: ${APPLY ? totalFixed : backup.length} questions; skipped-safety: ${totalSkipped}`);

  const backupPath = `/home/z/my-project/uuu/backup/fix-correct-answer-letters-${Date.now()}.json`;
  if (backup.length) {
    fs.mkdirSync('/home/z/my-project/uuu/backup', { recursive: true });
    fs.writeFileSync(backupPath, JSON.stringify({ applied: APPLY, changes: backup }, null, 1));
    console.log('backup written:', backupPath);
  }

  await client.end();
})().catch((e) => { console.error('DB ERROR:', e.message); process.exit(1); });
