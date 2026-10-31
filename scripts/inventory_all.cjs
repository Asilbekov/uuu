/**
 * Full inventory of ALL tests in the live DB:
 * id, title, topic, creator, visibility, version-tree info,
 * question count, attempt count, bookmark count, dates.
 */
const fs = require('fs');
const { Client } = require('pg');

const env = fs.readFileSync('/home/z/my-project/uuu/.env', 'utf8');
const m = env.match(/^DATABASE_URL=(.*)$/m);
const url = m[1].trim();

(async () => {
  const client = new Client({ connectionString: url });
  await client.connect();

  const tests = await client.query(`
    SELECT t.id, t.title, t.topic, t."creatorId", t."isPublic", t."parentId", t."rootId",
           t."randomizeQuestions", t."randomizeOptions", t."createdAt",
           (SELECT COUNT(*) FROM "Question" q WHERE q."testId" = t.id) AS qcount,
           (SELECT COUNT(*) FROM "TestAttempt" a WHERE a."testId" = t.id) AS acount,
           (SELECT COUNT(*) FROM "Bookmark" b WHERE b."testId" = t.id) AS bcount
    FROM "Test" t
    ORDER BY t."createdAt" ASC
  `);

  const users = await client.query(`SELECT id, email, name FROM "User"`);
  const umap = Object.fromEntries(users.rows.map(u => [u.id, `${u.email} (${u.name || ''})`]));

  console.log(`TOTAL TESTS: ${tests.rows.length}\n`);
  for (const t of tests.rows) {
    console.log('─'.repeat(100));
    console.log(`ID: ${t.id}`);
    console.log(`TITLE: ${t.title}`);
    console.log(`TOPIC: ${t.topic} | creator: ${umap[t.creatorId] || t.creatorId}`);
    console.log(`public: ${t.isPublic} | parent: ${t.parentId || '—'} | root: ${t.rootId || '—'} | randQ: ${t.randomizeQuestions} randO: ${t.randomizeOptions}`);
    console.log(`questions: ${t.qcount} | attempts: ${t.acount} | bookmarks: ${t.bcount} | created: ${t.createdAt.toISOString().slice(0, 10)}`);
  }
  await client.end();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
