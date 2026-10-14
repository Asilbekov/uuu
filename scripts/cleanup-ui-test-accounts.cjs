// One-off DB cleanup: removes UI-smoke leftovers (accounts with *@ui.test
// emails) and all their tests — used when the session cookies are already
// gone (sandbox restarted between calls) so the API cleanup can't run.
// Env: DATABASE_URL (from the shell). Safe: only touches @ui.test accounts.
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const users = await p.user.findMany({
    where: { email: { endsWith: '@ui.test' } },
    select: { id: true, email: true },
  });
  console.log(`found ${users.length} @ui.test account(s)`);
  for (const u of users) {
    const del = await p.test.deleteMany({ where: { creatorId: u.id } });
    console.log(`  ${u.email}: ${del.count} test(s) deleted`);
    await p.user.delete({ where: { id: u.id } });
    console.log(`  ${u.email}: account deleted`);
  }
}

main()
  .catch(e => { console.error(e.message); process.exit(1); })
  .finally(() => p.$disconnect());
