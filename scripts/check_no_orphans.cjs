/**
 * Post-deletion integrity check: no orphan rows anywhere.
 */
const fs = require('fs');
const { Client } = require('pg');

const env = fs.readFileSync('/home/z/my-project/uuu/.env', 'utf8');
const m = env.match(/^DATABASE_URL=(.*)$/m);
const url = m[1].trim();

(async () => {
  const client = new Client({ connectionString: url });
  await client.connect();

  const checks = [
    ['questions → test', `SELECT COUNT(*)::int AS n FROM "Question" q LEFT JOIN "Test" t ON q."testId"=t.id WHERE t.id IS NULL`],
    ['attempts → test', `SELECT COUNT(*)::int AS n FROM "TestAttempt" a LEFT JOIN "Test" t ON a."testId"=t.id WHERE t.id IS NULL`],
    ['answers → attempt', `SELECT COUNT(*)::int AS n FROM "AttemptAnswer" aa LEFT JOIN "TestAttempt" a ON aa."attemptId"=a.id WHERE a.id IS NULL`],
    ['answers → question', `SELECT COUNT(*)::int AS n FROM "AttemptAnswer" aa LEFT JOIN "Question" q ON aa."questionId"=q.id WHERE q.id IS NULL`],
    ['bookmarks → test', `SELECT COUNT(*)::int AS n FROM "Bookmark" b LEFT JOIN "Test" t ON b."testId"=t.id WHERE t.id IS NULL`],
    ['attachments → test', `SELECT COUNT(*)::int AS n FROM "Attachment" at LEFT JOIN "Test" t ON at."testId"=t.id WHERE t.id IS NULL`],
    ['metrics → test', `SELECT COUNT(*)::int AS n FROM "TestMetrics" m LEFT JOIN "Test" t ON m."testId"=t.id WHERE t.id IS NULL`],
    ['notes → test', `SELECT COUNT(*)::int AS n FROM "TestNote" n LEFT JOIN "Test" t ON n."testId"=t.id WHERE t.id IS NULL`],
    ['chat → test', `SELECT COUNT(*)::int AS n FROM "ChatMessage" c LEFT JOIN "Test" t ON c."testId"=t.id WHERE t.id IS NULL`],
    ['progress → test', `SELECT COUNT(*)::int AS n FROM "SavedProgress" sp LEFT JOIN "Test" t ON sp."testId"=t.id WHERE t.id IS NULL`],
    ['feed → test', `SELECT COUNT(*)::int AS n FROM "FeedEvent" fe LEFT JOIN "Test" t ON fe."testId"=t.id WHERE t.id IS NULL`],
    ['tests → creator', `SELECT COUNT(*)::int AS n FROM "Test" t LEFT JOIN "User" u ON t."creatorId"=u.id WHERE u.id IS NULL`],
    ['tests → parent (null ok)', `SELECT COUNT(*)::int AS n FROM "Test" t LEFT JOIN "Test" p ON t."parentId"=p.id WHERE t."parentId" IS NOT NULL AND p.id IS NULL`],
  ];

  let bad = 0;
  for (const [label, sql] of checks) {
    const r = (await client.query(sql)).rows[0].n;
    const flag = r === 0 ? 'OK ' : 'BAD';
    if (r !== 0) bad++;
    console.log(`${flag} ${label}: ${r}`);
  }
  console.log(bad === 0 ? '\nALL CLEAN — no orphans' : `\n${bad} ORPHAN PROBLEMS`);
  await client.end();
})().catch(e => { console.error('ERR', e.stack || e.message); process.exit(1); });
