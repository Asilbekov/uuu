/**
 * FULL BACKUP of the 17 tests slated for deletion (non-subject junk +
 * old week-less tests + pure QA copies), then a metadata snapshot of ALL
 * tests. Output: one JSON file in uuu/backup/ that would allow a complete
 * restore (test row, questions incl. translations, attachments, metrics,
 * notes, chat, bookmarks, attempts + answers, saved progress, feed stats).
 *
 * Read-only: makes no changes to the DB.
 */
const fs = require('fs');
const { Client } = require('pg');

const env = fs.readFileSync('/home/z/my-project/uuu/.env', 'utf8');
const m = env.match(/^DATABASE_URL=(.*)$/m);
const url = m[1].trim();

// ── The 11 OFFICIAL subject tests that STAY ──────────────────────────
const KEEP = [
  ['cmusb02jj0001ndt5txamljw7', 'English for Engineering I — Weeks 1-4'],
  ['cmuuzii120001n87uv5i5l5dl', 'History of Uzbekistan — Weeks 1-4'],
  ['cmuz87n5f0001l806h3usdylp', 'Introduction to Engineering — Weeks 1-4'],
  ['cmvux9whr003aq4n1f5d5klp3', 'History of Uzbekistan — Weeks 5-6'],
  ['cmvux9wuh004hq4n1k0ejtqw3', 'Introduction to Engineering — Weeks 5-7'],
  ['cmvux9x5x005yq4n1tnf8iciv', 'English for Engineering I — Weeks 5-7'],
  ['cmvux9xgf008tq4n1c38hfi4g', 'Computer Science (C Programming) — Weeks 4-7'],
  ['cmvv6tsch0001q5j3uaypuuoi', 'Math I: Weeks 1-4'],
  ['cmvv6tsuq004bq5j39vddoooq', 'Linear Algebra I: Weeks 1-4'],
  ['cmvv6tt4b007iq5j3xr7wghq8', 'Math I: Weeks 5-7'],
  ['cmvv6ttep0097q5j3z489lheb', 'Linear Algebra I: Weeks 5-7'],
];

// ── The 17 tests to DELETE ────────────────────────────────────────────
const DELETE = [
  // not our subjects
  ['cmpa6v6qu0028je6hgl2bdsyv', 'Chemistry: Complete Test'],
  ['cmpa6v6y1004nje6h3kl0szpp', 'Physics: Complete Test'],
  ['cmpwhq4wx0001p29fozc6m8v3', 'Physics: Qobketganlar'],
  ['cmq3oq9cd0001ihnme6e4bv31', 'Physics: Final'],
  // our subject but old, no week numbers in title (superseded by LA I W1-4/W5-7)
  ['cmpa6v6fw0001je6hdi0ij65c', 'Linear Algebra (LAG1): Complete Test'],
  // pure QA copies (changedCount=0): of LAG1
  ['cmvfbrbx30005l2082956y3lh', 'Linear Algebra (LAG1): Complete Test — copy'],
  ['cmvg28ykq00rhl0085pqa06r7', 'Linear Algebra (LAG1): Complete Test — copy 2'],
  // pure QA copies of current subject tests / outdated combined Math&LA
  ['cmv1ln47q0001jm06t4fxsg38', 'ITE — Weeks 1-4 · Template (copy)'],
  ['cmv1r7x920009l806reclbve6', 'English — Weeks 1-4 · Template (copy)'],
  ['cmv1rsdgf0007k006p794qfom', 'English — Weeks 1-4 · Template (2) (copy)'],
  ['cmv4t6knb001yjr06mhvauz38', 'History — Weeks 1-4 · Template (copy)'],
  ['cmv4yj5fy000mjo06xrk45b6u', 'Math I & Linear Algebra: Weeks 1-4 · Template (orphaned combined copy)'],
  ['cmv71btju0001jk06synsl4en', 'English — Weeks 1-4 · F (copy)'],
  ['cmvet8v0w0001l907h5dm0t66', 'Math I & Linear Algebra: Weeks 1-4 · Template (copy of copy)'],
  ['cmvk7v7vb0012l007nwl443cj', 'ITE — Weeks 1-4 (copy)'],
  ['cmvv95rab0009l008od93h6yk', 'History — Weeks 1-4 (copy)'],
  ['cmvwlycla000mjm08nb1shh73', 'ITE — Weeks 5-7 (copy)'],
];

(async () => {
  const client = new Client({ connectionString: url });
  await client.connect();

  // sanity: both lists must match the DB exactly
  const all = await client.query(`SELECT id, title FROM "Test"`);
  const byId = Object.fromEntries(all.rows.map(r => [r.id, r.title]));
  const keepIds = KEEP.map(x => x[0]);
  const delIds = DELETE.map(x => x[0]);
  const missing = [...keepIds, ...delIds].filter(id => !byId[id]);
  if (missing.length) throw new Error('IDs not in DB: ' + missing.join(','));
  if (keepIds.length + delIds.length !== all.rows.length)
    throw new Error(`Covered ${keepIds.length + delIds.length} of ${all.rows.length} tests — list incomplete!`);
  for (const [id, label] of [...KEEP, ...DELETE]) {
    if (!byId[id].toLowerCase().includes(label.split(' — ')[0].split(':')[0].toLowerCase().slice(0, 12)))
      console.log(`  note: title mismatch? ${id}: "${byId[id]}" vs "${label}"`);
  }
  console.log(`Sanity OK: ${all.rows.length} tests = ${keepIds.length} keep + ${delIds.length} delete`);

  const backup = {
    meta: {
      purpose: 'Backup before deleting non-subject / non-week-numbered / duplicate-copy tests',
      date: new Date().toISOString(),
      rule: 'KEEP = official subject tests with week ranges in title (Weeks 1-4 / 5-6 / 5-7 / 4-7). DELETE = Chemistry, Physics x3, old LA (LAG1, no weeks), and 12 pure QA copies (changedCount=0).',
      restoreHint: 'Re-insert Test rows, then Questions (testId), then Attachments/Metrics/Notes/Chat/Bookmarks/Attempts/AttemptAnswers/SavedProgress per test. IDs are preserved.',
    },
    keptTests: KEEP.map(([id, label]) => ({ id, title: byId[id] })),
    deletedTests: [],
  };

  for (const [id, label] of DELETE) {
    const t = (await client.query(`SELECT * FROM "Test" WHERE id=$1`, [id])).rows[0];
    const questions = (await client.query(`SELECT * FROM "Question" WHERE "testId"=$1 ORDER BY "orderNum"`, [id])).rows;
    const attachments = (await client.query(`SELECT * FROM "Attachment" WHERE "testId"=$1 ORDER BY "orderNum"`, [id])).rows;
    const metrics = (await client.query(`SELECT * FROM "TestMetrics" WHERE "testId"=$1`, [id])).rows;
    const notes = (await client.query(`SELECT * FROM "TestNote" WHERE "testId"=$1`, [id])).rows;
    const chat = (await client.query(`SELECT * FROM "ChatMessage" WHERE "testId"=$1 ORDER BY "createdAt"`, [id])).rows;
    const bookmarks = (await client.query(`SELECT * FROM "Bookmark" WHERE "testId"=$1`, [id])).rows;
    const attempts = (await client.query(`SELECT * FROM "TestAttempt" WHERE "testId"=$1 ORDER BY "startedAt"`, [id])).rows;
    const answers = attempts.length
      ? (await client.query(
          `SELECT aa.* FROM "AttemptAnswer" aa JOIN "TestAttempt" ta ON aa."attemptId"=ta.id WHERE ta."testId"=$1`, [id])).rows
      : [];
    const progress = (await client.query(`SELECT * FROM "SavedProgress" WHERE "testId"=$1`, [id])).rows;
    const feed = (await client.query(
      `SELECT kind, COUNT(*)::int AS n FROM "FeedEvent" WHERE "testId"=$1 GROUP BY kind`, [id])).rows;

    backup.deletedTests.push({
      why: label, test: t, questions, attachments, metrics, notes, chat,
      bookmarks, attempts, attemptAnswers: answers, savedProgress: progress,
      feedEventStats: feed,
    });
    console.log(`backed up: ${t.title.slice(0, 58).padEnd(58)} q:${String(questions.length).padStart(3)} att:${String(attempts.length).padStart(3)} ans:${String(answers.length).padStart(4)}`);
  }

  const out = `/home/z/my-project/uuu/backup/deleted-tests-backup-${Date.now()}.json`;
  fs.writeFileSync(out, JSON.stringify(backup, null, 1));
  const kb = Math.round(fs.statSync(out).size / 1024);
  console.log(`\nWROTE ${out} (${kb} KB)`);
  await client.end();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
