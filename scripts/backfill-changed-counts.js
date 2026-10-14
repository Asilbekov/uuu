// ---------------------------------------------------------------------------
// Backfill Test.changedCount for versions created BEFORE the field existed.
// For every test with parentId != null: diff its questions against the direct
// parent's questions (the same fingerprint rule the server uses on save) and
// store the change count. Idempotent — safe to re-run.
// Usage: node scripts/backfill-changed-counts.js   (reads .env DATABASE_URL)
// ---------------------------------------------------------------------------
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

const norm = (v) => String(v ?? '').replace(/\s+/g, ' ').trim();
const fingerprint = (q) =>
  [q.text, q.optionA, q.optionB, q.optionC, q.optionD, q.optionE, q.correctAnswer]
    .map(norm).join('\u0000');

function countChanged(a, b) {
  const multiset = (arr) => {
    const m = new Map();
    for (const q of arr) {
      const f = fingerprint(q);
      m.set(f, (m.get(f) || 0) + 1);
    }
    return m;
  };
  const ma = multiset(a), mb = multiset(b);
  let common = 0;
  for (const [f, ca] of ma) common += Math.min(ca, mb.get(f) || 0);
  return Math.max(a.length, b.length) - common;
}

const QSEL = { text: true, optionA: true, optionB: true, optionC: true, optionD: true, optionE: true, correctAnswer: true };

async function main() {
  const versions = await db.test.findMany({
    where: { parentId: { not: null } },
    select: { id: true, parentId: true },
  });
  console.log(`versions found: ${versions.length}`);
  let updated = 0, orphaned = 0;
  for (const v of versions) {
    const parent = v.parentId
      ? await db.test.findUnique({ where: { id: v.parentId }, select: { questions: { select: QSEL } } })
      : null;
    if (!parent) { orphaned++; continue; } // deleted ancestor → the copy became its own trunk (gate ignores it)
    const mine = await db.question.findMany({ where: { testId: v.id }, select: QSEL });
    const changed = countChanged(mine, parent.questions);
    await db.test.update({ where: { id: v.id }, data: { changedCount: changed } });
    updated++;
    console.log(`  ${v.id}: changed=${changed}`);
  }
  console.log(`updated: ${updated}, orphaned (skipped): ${orphaned}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
