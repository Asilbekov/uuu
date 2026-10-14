// UI smoke cleanup: deletes the 3 tests (owner sessions) and the 3 accounts.
// Usage: BASE=... node scripts/ui-smoke-tree-cleanup.cjs '<setup-json>'
const BASE = process.env.BASE || 'http://127.0.0.1:3100';
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
    ['v1', data.bCookie, data.v1Id],
    ['v2', data.cCookie, data.v2Id],
  ];
  for (const [nm, ck, id] of pairs) {
    if (!ck || !id) continue;
    console.log(`  delete test ${nm} ${id}: ${await req('DELETE', `/api/tests/${id}`, ck)}`);
  }
  for (const [nm, ck] of [['alice', data.aCookie], ['bob', data.bCookie], ['carol', data.cCookie]]) {
    if (!ck) continue;
    console.log(`  delete account ${nm}: ${await req('DELETE', '/api/me', ck)}`);
  }
}

main().catch(e => { console.error('cleanup crashed:', e.message); process.exit(0); });
