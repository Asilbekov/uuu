import fs from 'fs';
import { PrismaClient } from '@prisma/client';
const env = Object.fromEntries(
  fs.readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^"|"$/g, '')])
);
process.env.DATABASE_URL = env.DATABASE_URL;
const db = new PrismaClient();

async function main() {
  const groups = await db.attachment.groupBy({
    by: ['testId'],
    _count: { id: true },
    having: { testId: { _count: { gte: 2 } } },
  });
  for (const g of groups.slice(0, 12)) {
    const test = await db.test.findUnique({
      where: { id: g.testId },
      select: { title: true, isPublic: true, creatorId: true },
    });
    const files = await db.attachment.findMany({
      where: { testId: g.testId },
      orderBy: { orderNum: 'asc' },
      select: { type: true, title: true, orderNum: true, url: true },
    });
    console.log(`\nTEST ${g.testId} «${test?.title}» (${g._count.id} files, isPublic=${test?.isPublic})`);
    for (const f of files) console.log(`  [${f.orderNum}] ${f.type} «${f.title.slice(0, 38)}» :: ${f.url.slice(0, 55)}`);
  }
}
main().finally(() => db.$disconnect());
