/**
 * Users overview + copy-diff info: are the private copies pure copies
 * (changedCount=0, no notes/chat/attachments) or edited versions?
 */
const fs = require('fs');
const { Client } = require('pg');

const env = fs.readFileSync('/home/z/my-project/uuu/.env', 'utf8');
const m = env.match(/^DATABASE_URL=(.*)$/m);
const url = m[1].trim();

(async () => {
  const client = new Client({ connectionString: url });
  await client.connect();

  const users = await client.query(`
    SELECT u.id, u.email, u.name, u."createdAt",
           (SELECT COUNT(*) FROM "Test" t WHERE t."creatorId" = u.id) AS tests,
           (SELECT COUNT(*) FROM "TestAttempt" a WHERE a."userId" = u.id) AS attempts,
           (SELECT COUNT(*) FROM "Bookmark" b WHERE b."userId" = u.id) AS bookmarks
    FROM "User" u ORDER BY u."createdAt" ASC
  `);
  console.log('════ USERS ════');
  for (const u of users.rows) {
    console.log(`${u.email} | ${u.name} | created ${u.createdAt.toISOString().slice(0,10)} | tests:${u.tests} attempts:${u.attempts} bookmarks:${u.bookmarks}`);
  }

  const copies = await client.query(`
    SELECT t.id, t.title, t."changedCount", t."versionName",
           (SELECT COUNT(*) FROM "TestNote" n WHERE n."testId" = t.id) AS notes,
           (SELECT COUNT(*) FROM "ChatMessage" c WHERE c."testId" = t.id) AS chat,
           (SELECT COUNT(*) FROM "Attachment" a WHERE a."testId" = t.id) AS attach
    FROM "Test" t WHERE t."parentId" IS NOT NULL ORDER BY t."createdAt"
  `);
  console.log('\n════ COPIES (versions) ════');
  for (const c of copies.rows) {
    console.log(`${c.id} | changed:${c.changedCount} | vName:${JSON.stringify(c.versionName)} | notes:${c.notes} chat:${c.chat} attach:${c.attach} | ${c.title.slice(0,60)}`);
  }

  await client.end();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
