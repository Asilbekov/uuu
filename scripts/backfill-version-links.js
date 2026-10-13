// ---------------------------------------------------------------------------
// One-time backfill: link EXISTING copies into their version trees.
//
// Before the version-tree feature, copyTest created copies WITHOUT
// parentId/rootId. Their titles follow the deterministic pattern
//   "<source title> · <user name>" (optionally + " (2)", " (3)", …)
// so the family links can be reconstructed conservatively:
//   * strip the trailing " (n)"
//   * split at the LAST " · " → source title | forker name
//   * require EXACTLY ONE existing test with that title, older than the copy,
//     created by a DIFFERENT user
//   * then parentId = source.id, rootId = source.rootId || source.id
// Oldest-first processing keeps multi-generation chains correct.
// Usage: node scripts/backfill-version-links.js [--dry]
// ---------------------------------------------------------------------------
const path = require('path');
const fs = require('fs');

// Read DATABASE_URL straight from .env — the sandbox shell exports a foreign one
const envText = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
const m = envText.match(/^DATABASE_URL="?([^"\n]+)"?/m);
if (!m) { console.error('No DATABASE_URL in .env'); process.exit(1); }
process.env.DATABASE_URL = m[1];

const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

const DRY = process.argv.includes('--dry');

(async () => {
  const orphans = await db.test.findMany({
    where: { parentId: null, title: { contains: ' · ' } },
    select: { id: true, title: true, creatorId: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });
  console.log(`candidates: ${orphans.length}`);

  let linked = 0, skipped = 0, ambiguous = 0;
  const linkedIds = new Set();

  for (const t of orphans) {
    let base = t.title.replace(/\s*\(\d+\)\s*$/, '').trim();
    const idx = base.lastIndexOf(' · ');
    if (idx <= 0) { skipped++; continue; }
    const sourceTitle = base.slice(0, idx).trim();
    const forker = base.slice(idx + 3).trim();
    if (!sourceTitle || !forker) { skipped++; continue; }

    // the source must be an OLDER test under exactly that title, by another author
    const sources = await db.test.findMany({
      where: {
        title: { equals: sourceTitle, mode: 'insensitive' },
        id: { not: t.id },
        creatorId: { not: t.creatorId },
        createdAt: { lt: t.createdAt },
      },
      select: { id: true, rootId: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    if (sources.length === 0) { skipped++; continue; }
    if (sources.length > 1) { ambiguous++; continue; }

    const src = sources[0];
    console.log(`link: "${t.title.slice(0, 60)}" → parent ${src.id} (${forker})`);
    linkedIds.add(t.id);
    linked++;
    if (!DRY) {
      await db.test.update({
        where: { id: t.id },
        data: { parentId: src.id, rootId: src.rootId || src.id },
      });
    }
  }

  console.log(`\nlinked=${linked} skipped=${skipped} ambiguous=${ambiguous}${DRY ? ' (DRY RUN — nothing written)' : ''}`);
  await db.$disconnect();
})().catch(e => { console.error(e); process.exit(1); });
