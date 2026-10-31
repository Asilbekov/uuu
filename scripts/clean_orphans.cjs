/**
 * Inspect + clean orphan SavedProgress / FeedEvent rows (tests deleted earlier).
 */
const fs = require('fs');
const { Client } = require('pg');

const env = fs.readFileSync('/home/z/my-project/uuu/.env', 'utf8');
const m = env.match(/^DATABASE_URL=(.*)$/m);
const url = m[1].trim();
const APPLY = process.argv.includes('--apply');

(async () => {
  const client = new Client({ connectionString: url });
  await client.connect();

  const p = (await client.query(
    `SELECT sp."testId", COUNT(*)::int AS n, MAX(sp."savedAt") AS last
     FROM "SavedProgress" sp LEFT JOIN "Test" t ON sp."testId"=t.id
     WHERE t.id IS NULL GROUP BY sp."testId" ORDER BY n DESC`)).rows;
  console.log('orphan progress by testId:');
  p.forEach(r => console.log(' ', r.testId, 'rows:' + r.n, 'last:' + r.last.toISOString().slice(0, 10)));

  const f = (await client.query(
    `SELECT fe."testId", COUNT(*)::int AS n, MAX(fe."createdAt") AS last
     FROM "FeedEvent" fe LEFT JOIN "Test" t ON fe."testId"=t.id
     WHERE t.id IS NULL GROUP BY fe."testId" ORDER BY n DESC`)).rows;
  console.log('orphan feed by testId:');
  f.forEach(r => console.log(' ', r.testId, 'rows:' + r.n, 'last:' + r.last.toISOString().slice(0, 10)));

  if (APPLY) {
    const dp = await client.query(
      `DELETE FROM "SavedProgress" sp WHERE NOT EXISTS (SELECT 1 FROM "Test" t WHERE t.id = sp."testId")`);
    const df = await client.query(
      `DELETE FROM "FeedEvent" fe WHERE NOT EXISTS (SELECT 1 FROM "Test" t WHERE t.id = fe."testId")`);
    console.log(`\nDELETED orphan progress: ${dp.rowCount}, orphan feed: ${df.rowCount}`);
  } else {
    console.log('\nDRY RUN — pass --apply to delete them');
  }
  await client.end();
})().catch(e => { console.error('ERR', e.stack || e.message); process.exit(1); });
