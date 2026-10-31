/**
 * DELETE the 17 non-subject / week-less / pure-duplicate tests.
 * Cascades (schema-level): Question, TestAttempt, AttemptAnswer, Bookmark,
 * ChatMessage, Attachment, TestNote, TestMetrics.
 * Manual cleanup (plain string testId, no FK): SavedProgress, FeedEvent.
 * Telegram channel archive posts of deleted tests are left in the channel
 * on purpose — they are the portable backup copies of the content.
 *
 * Default = DRY RUN. Pass --apply to actually delete.
 */
const fs = require('fs');
const { Client } = require('pg');

const env = fs.readFileSync('/home/z/my-project/uuu/.env', 'utf8');
const m = env.match(/^DATABASE_URL=(.*)$/m);
const url = m[1].trim();
const APPLY = process.argv.includes('--apply');

const KEEP_IDS = [
  'cmusb02jj0001ndt5txamljw7', 'cmuuzii120001n87uv5i5l5dl', 'cmuz87n5f0001l806h3usdylp',
  'cmvux9whr003aq4n1f5d5klp3', 'cmvux9wuh004hq4n1k0ejtqw3', 'cmvux9x5x005yq4n1tnf8iciv',
  'cmvux9xgf008tq4n1c38hfi4g', 'cmvv6tsch0001q5j3uaypuuoi', 'cmvv6tsuq004bq5j39vddoooq',
  'cmvv6tt4b007iq5j3xr7wghq8', 'cmvv6ttep0097q5j3z489lheb',
];
const DELETE_IDS = [
  'cmpa6v6qu0028je6hgl2bdsyv', 'cmpa6v6y1004nje6h3kl0szpp', 'cmpwhq4wx0001p29fozc6m8v3',
  'cmq3oq9cd0001ihnme6e4bv31', 'cmpa6v6fw0001je6hdi0ij65c', 'cmvfbrbx30005l2082956y3lh',
  'cmvg28ykq00rhl0085pqa06r7', 'cmv1ln47q0001jm06t4fxsg38', 'cmv1r7x920009l806reclbve6',
  'cmv1rsdgf0007k006p794qfom', 'cmv4t6knb001yjr06mhvauz38', 'cmv4yj5fy000mjo06xrk45b6u',
  'cmv71btju0001jk06synsl4en', 'cmvet8v0w0001l907h5dm0t66', 'cmvk7v7vb0012l007nwl443cj',
  'cmvv95rab0009l008od93h6yk', 'cmvwlycla000mjm08nb1shh73',
];

(async () => {
  const client = new Client({ connectionString: url });
  await client.connect();

  // ── hard sanity gates ──
  const all = await client.query(`SELECT id, title FROM "Test"`);
  if (all.rows.length !== 28) throw new Error(`Expected 28 tests, found ${all.rows.length}`);
  const ids = all.rows.map(r => r.id);
  for (const id of KEEP_IDS) if (!ids.includes(id)) throw new Error(`Keep test missing: ${id}`);
  for (const id of DELETE_IDS) if (!ids.includes(id)) throw new Error(`Delete target missing: ${id}`);
  const overlap = KEEP_IDS.filter(id => DELETE_IDS.includes(id));
  if (overlap.length) throw new Error('Keep/delete overlap: ' + overlap);

  // pre-state counts
  const preRes = await client.query(`
    SELECT
      (SELECT COUNT(*) FROM "Test") AS tests,
      (SELECT COUNT(*) FROM "Question") AS questions,
      (SELECT COUNT(*) FROM "TestAttempt") AS attempts,
      (SELECT COUNT(*) FROM "AttemptAnswer") AS answers,
      (SELECT COUNT(*) FROM "Bookmark") AS bookmarks,
      (SELECT COUNT(*) FROM "Attachment") AS attachments,
      (SELECT COUNT(*) FROM "SavedProgress") AS progress,
      (SELECT COUNT(*) FROM "FeedEvent") AS feed
  `);
  console.log('preRes type:', typeof preRes, Array.isArray(preRes), preRes && Object.keys(preRes).slice(0, 5));
  const pre = preRes.rows[0];
  console.log('PRE :', pre);

  // what will be removed by the deletes (cascade preview)
  const ph = DELETE_IDS.map((_, i) => `$${i + 1}`).join(',');
  const doomed = (await client.query(`
    SELECT
      (SELECT COUNT(*) FROM "Question" WHERE "testId" IN (${ph})) AS questions,
      (SELECT COUNT(*) FROM "TestAttempt" WHERE "testId" IN (${ph})) AS attempts,
      (SELECT COUNT(*) FROM "AttemptAnswer" aa JOIN "TestAttempt" ta ON aa."attemptId"=ta.id WHERE ta."testId" IN (${ph})) AS answers,
      (SELECT COUNT(*) FROM "Bookmark" WHERE "testId" IN (${ph})) AS bookmarks,
      (SELECT COUNT(*) FROM "Attachment" WHERE "testId" IN (${ph})) AS attachments,
      (SELECT COUNT(*) FROM "SavedProgress" WHERE "testId" IN (${ph})) AS progress,
      (SELECT COUNT(*) FROM "FeedEvent" WHERE "testId" IN (${ph})) AS feed
  `, DELETE_IDS)).rows[0];
  console.log('DOOM:', doomed);
  console.log(APPLY ? '\n>>> APPLYING DELETION <<<' : '\n>>> DRY RUN — nothing deleted (pass --apply) <<<');

  if (APPLY) {
    await client.query('BEGIN');
    try {
      const del = await client.query(`DELETE FROM "Test" WHERE id IN (${ph})`, DELETE_IDS);
      console.log(`deleted tests: ${del.rowCount}`);
      const sp = await client.query(`DELETE FROM "SavedProgress" WHERE "testId" IN (${ph})`, DELETE_IDS);
      console.log(`deleted savedProgress: ${sp.rowCount}`);
      const fe = await client.query(`DELETE FROM "FeedEvent" WHERE "testId" IN (${ph})`, DELETE_IDS);
      console.log(`deleted feedEvents: ${fe.rowCount}`);
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    }

    const post = (await client.query(`
      SELECT
        (SELECT COUNT(*) FROM "Test") AS tests,
        (SELECT COUNT(*) FROM "Question") AS questions,
        (SELECT COUNT(*) FROM "TestAttempt") AS attempts,
        (SELECT COUNT(*) FROM "AttemptAnswer") AS answers,
        (SELECT COUNT(*) FROM "Bookmark") AS bookmarks,
        (SELECT COUNT(*) FROM "Attachment") AS attachments,
        (SELECT COUNT(*) FROM "SavedProgress") AS progress,
        (SELECT COUNT(*) FROM "FeedEvent") AS feed
    `)).rows[0];
    console.log('POST:', post);

    const remaining = await client.query(
      `SELECT t.id, t.title, (SELECT COUNT(*) FROM "Question" q WHERE q."testId"=t.id) AS q
       FROM "Test" t JOIN unnest($1::text[]) AS k(kid) ON t.id = k.kid ORDER BY t."createdAt"`, [KEEP_IDS]);
    console.log(`\nREMAINING (${remaining.rows.length}):`);
    for (const r of remaining.rows) console.log(`  ${r.q}\t${r.title}`);
  }
  await client.end();
})().catch(e => { console.error('ERR', e.stack || e.message); process.exit(1); });
