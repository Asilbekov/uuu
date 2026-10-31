/** Fix Physics Final #64 missing ru/uz option C + normalize orderNum gaps. */
const fs = require('fs');
const { Client } = require('pg');
const env = fs.readFileSync('/home/z/my-project/uuu/.env', 'utf8');
const url = env.match(/^DATABASE_URL=(.*)$/m)[1].trim();
const APPLY = process.argv.includes('--apply');

(async () => {
  const c = new Client({ connectionString: url });
  await c.connect();

  // 1) Physics Final #64: add ru/uz options.C
  const r = await c.query(
    `SELECT q.id, q.translations FROM "Question" q JOIN "Test" t ON t.id=q."testId"
      WHERE t.title='Physics: Final' AND q."orderNum"=64`);
  const q = r.rows[0];
  if (q && q.translations) {
    const tr = { ...q.translations };
    for (const lg of ['ru', 'uz']) {
      if (tr[lg] && tr[lg].options && !tr[lg].options.C) {
        tr[lg] = { ...tr[lg], options: { ...tr[lg].options, C: '$0.55$ m/s' } };
      }
    }
    console.log('Final #64 translations ru.A..D:', JSON.stringify(tr.ru && tr.ru.options));
    if (APPLY) {
      await c.query(`UPDATE "Question" SET translations=$1 WHERE id=$2`, [JSON.stringify(tr), q.id]);
      console.log('Final #64 translations updated');
    }
  }

  // 2) orderNum normalization (preserve order, 0..N-1)
  for (const title of ['Physics: Final', 'Physics: Qobketganlar']) {
    const t = await c.query(`SELECT id FROM "Test" WHERE title=$1 ORDER BY "createdAt" LIMIT 1`, [title]);
    if (!t.rows[0]) continue;
    const qs = await c.query(`SELECT id, "orderNum" FROM "Question" WHERE "testId"=$1 ORDER BY "orderNum" ASC`, [t.rows[0].id]);
    const ids = qs.rows.map((x) => x.id);
    const needs = qs.rows.some((x, i) => x.orderNum !== i);
    console.log(`${title}: ${ids.length} questions, needs renumber: ${needs}`);
    if (needs && APPLY) {
      // update one by one with a temporary offset first to avoid unique-ish collisions
      // (orderNum is not unique, but keep it clean anyway)
      for (let i = 0; i < ids.length; i++) {
        await c.query(`UPDATE "Question" SET "orderNum"=$1 WHERE id=$2`, [i + 100000, ids[i]]);
      }
      for (let i = 0; i < ids.length; i++) {
        await c.query(`UPDATE "Question" SET "orderNum"=$1 WHERE id=$2`, [i, ids[i]]);
      }
      console.log(`${title}: renumbered 0..${ids.length - 1}`);
    }
  }

  await c.end();
})().catch((e) => { console.error('DB ERROR:', e.message); process.exit(1); });
