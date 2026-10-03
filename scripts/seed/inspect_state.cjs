/* Inspect current tests / attachments / test-sets in production DB */
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

function getDbUrl() {
  const env = process.env.DATABASE_URL || '';
  if (env.startsWith('postgres')) return env;
  const src = fs.readFileSync(path.join(__dirname, '..', 'final-scan.cjs'), 'utf8');
  const m = src.match(/DATABASE_URL\s*=\s*['"]([^'"]+)['"]/);
  return m ? m[1] : env;
}

const db = new PrismaClient({ datasources: { db: { url: getDbUrl() } } });

(async () => {
  const tests = await db.test.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      id: true, title: true, topic: true, description: true, createdAt: true,
      _count: { select: { questions: true, attachments: true, attempts: true } },
    },
  });
  console.log('=== TESTS ===');
  for (const t of tests) {
    console.log(`${t.id} | ${t.title} | topic=${t.topic} | q=${t._count.questions} att=${t._count.attachments} attempts=${t._count.attempts}`);
  }

  console.log('\n=== ATTACHMENTS (english tests) ===');
  const eng = tests.filter(t => (t.topic || '').toLowerCase().includes('english'));
  for (const t of eng) {
    const atts = await db.attachment.findMany({ where: { testId: t.id }, orderBy: { orderNum: 'asc' } });
    console.log(`\n-- ${t.title} (${t.id})`);
    for (const a of atts) {
      console.log(`   [${a.orderNum}] type=${a.type} | ${a.title} | size=${a.size} | url=${(a.url || '').slice(0, 120)}`);
    }
  }

  console.log('\n=== TEST SETS === (feature removed)');

  console.log('\n=== SAMPLE QUESTION ORDER FIELDS ===');
  const q1 = await db.question.findFirst({ orderBy: { orderNum: 'asc' }, select: { id: true, testId: true, orderNum: true, text: true } });
  console.log(JSON.stringify(q1, null, 2).slice(0, 500));

  await db.$disconnect();
})().catch(e => { console.error(e); process.exit(1); });
