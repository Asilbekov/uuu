/**
 * Idempotently attach the English Weeks 1-4 study guide PDF to every
 * 'English for Engineering' test in the live DB — WITHOUT deleting or
 * recreating tests (user attempts and manually added attachments survive).
 * The guide is inserted first (orderNum 0); existing attachments shift +1.
 * Run: node scripts/seed/add_eee_guide.cjs   (reads DATABASE_URL from .env)
 */
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Load DATABASE_URL from .env if not already set
if (!process.env.DATABASE_URL) {
  const envPath = path.join(__dirname, '..', '..', '.env');
  if (fs.existsSync(envPath)) {
    const m = fs.readFileSync(envPath, 'utf8').match(/^DATABASE_URL=(.*)$/m);
    if (m) process.env.DATABASE_URL = m[1].trim();
  }
}

const GUIDE = {
  title: 'Full Study Guide PDF: English for Engineering I, Weeks 1-4 — Rules, Questions & Answers',
  type: 'pdf',
  url: 'https://raw.githubusercontent.com/Asilbekov/uuu/main/study-guides/English_for_Engineering_I_Weeks_1-4_Rules_Questions_Answers.pdf',
  size: 456982,
};

const db = new PrismaClient();

(async () => {
  const tests = await db.test.findMany({
    where: { topic: 'English for Engineering' },
    include: { attachments: true },
  });
  if (tests.length === 0) {
    console.error('No English for Engineering tests found');
    process.exit(1);
  }

  for (const test of tests) {
    const exists = test.attachments.some(a => a.url === GUIDE.url);
    if (exists) {
      console.log(`skip (already attached): ${test.title}`);
      continue;
    }
    // Shift existing attachments down so the guide appears first
    await db.attachment.updateMany({
      where: { testId: test.id },
      data: { orderNum: { increment: 1 } },
    });
    await db.attachment.create({
      data: { ...GUIDE, testId: test.id, orderNum: 0 },
    });
    console.log(`attached: ${test.title} (now ${test.attachments.length + 1} files)`);
  }

  const total = await db.attachment.count({ where: { url: GUIDE.url } });
  console.log(`done — guide attached to ${total} test(s)`);
  await db.$disconnect();
})().catch(e => { console.error(e); process.exit(1); });
