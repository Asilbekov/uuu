/**
 * Groups the four English for Engineering tests into one TestSet and converts
 * the TED talk attachment into an embeddable player. Idempotent — safe to rerun.
 * Run: DATABASE_URL=<neon url> node scripts/seed/create_set.cjs
 */
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

const SET_TITLE = 'English for Engineering I — Weeks 1-4';
const SET_DESCRIPTION = 'All four weekly tests in one set: Present Simple & Getting to Know You, Present Simple vs Continuous & Articles, Quantifiers & Numbers & Digital Life, and Prepositions & "The power of numbers". Full study-guide PDF and all audio/video are attached to each test.';

const TED_PAGE_URL = 'https://www.ted.com/talks/olivia_markaryan_stereotypes_how_do_we_break_the_cycle';
const TED_EMBED_URL = 'https://embed.ted.com/talks/olivia_markaryan_stereotypes_how_do_we_break_the_cycle';

(async () => {
  // 1. Upsert the set
  let set = await db.testSet.findFirst({ where: { title: SET_TITLE } });
  if (!set) {
    set = await db.testSet.create({
      data: { title: SET_TITLE, description: SET_DESCRIPTION, topic: 'English for Engineering' },
    });
    console.log(`created set: ${SET_TITLE}`);
  } else {
    await db.testSet.update({
      where: { id: set.id },
      data: { description: SET_DESCRIPTION, topic: 'English for Engineering' },
    });
    console.log(`set exists: ${SET_TITLE}`);
  }

  // 2. Assign the four English tests (in week order) to the set
  const tests = await db.test.findMany({
    where: { topic: 'English for Engineering' },
    orderBy: { createdAt: 'asc' },
  });
  const byWeek = tests.sort((a, b) => a.title.localeCompare(b.title, 'en', { numeric: true }));
  for (const t of byWeek) {
    await db.test.update({ where: { id: t.id }, data: { setId: set.id } });
    console.log(`in set: ${t.title}`);
  }

  // 3. TED talk link → embed player (renders an inline video via embed.ted.com)
  const ted = await db.attachment.updateMany({
    where: { url: TED_PAGE_URL },
    data: { type: 'embed', url: TED_EMBED_URL, title: 'TED Talk video player: Olivia Markaryan — "Stereotypes: How do we break the cycle?"' },
  });
  console.log(`TED attachments converted to embed: ${ted.count}`);

  const total = await db.attachment.count({ where: { type: 'embed' } });
  console.log(`done — ${byWeek.length} tests in set, ${total} embed attachment(s)`);
  await db.$disconnect();
})().catch(e => { console.error(e); process.exit(1); });
