// UI smoke cleanup for the feed smoke: deletes the 4 tests (owner sessions)
// and the 2 accounts.
// Usage: BASE=... node scripts/ui-smoke-feed-cleanup.cjs '<setup-json>'
const BASE = process.env.BASE || 'http://127.0.0.1:3199';
const data = JSON.parse(process.argv[2] || '{}');

async function req(method, path, cookie) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) },
    redirect: 'manual',
  });
  return res.status;
}

async function main() {
  const pairs = [
    ['trunk', data.aCookie, data.trunkId],
    ['plain', data.aCookie, data.plainId],
    ['files', data.aCookie, data.filesId],
    ['v1', data.bCookie, data.v1Id],
  ];
  for (const [nm, ck, id] of pairs) {
    if (!ck || !id) continue;
    console.log(`  delete test ${nm} ${id}: ${await req('DELETE', `/api/tests/${id}`, ck)}`);
  }
  for (const [nm, ck] of [['alice', data.aCookie], ['bob', data.bCookie]]) {
    if (!ck) continue;
    console.log(`  delete account ${nm}: ${await req('DELETE', '/api/me', ck)}`);
  }
}

main().catch(e => { console.error('cleanup crashed:', e.message); process.exit(0); });
