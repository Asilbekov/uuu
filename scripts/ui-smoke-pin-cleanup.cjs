// UI smoke cleanup for the pin-rule setup: deletes the copy (bob), the trunk
// (alice) and both accounts. MUST receive the JSON printed by
// ui-smoke-pin-setup.cjs as argv[2].
// Usage: node scripts/ui-smoke-pin-cleanup.cjs '{"stamp":"…","trunkId":"…","copyId":"…","aCookie":"…","bCookie":"…"}'
const BASE = process.env.BASE || 'http://127.0.0.1:3100';

async function req(method, path, cookie) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) },
    redirect: 'manual',
  });
  let json = null;
  try { json = await res.json(); } catch {}
  return { status: res.status, json };
}

async function main() {
  const arg = process.argv[2];
  if (!arg) { console.error('cleanup: no setup JSON passed — NOTHING deleted'); process.exit(1); }
  const s = JSON.parse(arg);

  if (s.copyId) console.log(`delete copy ${s.copyId}:`, (await req('DELETE', `/api/tests/${s.copyId}`, s.bCookie)).status);
  if (s.trunkId) console.log(`delete trunk ${s.trunkId}:`, (await req('DELETE', `/api/tests/${s.trunkId}`, s.aCookie)).status);
  if (s.aCookie) console.log('delete account alice:', (await req('DELETE', '/api/me', s.aCookie)).status);
  if (s.bCookie) console.log('delete account bob:', (await req('DELETE', '/api/me', s.bCookie)).status);
}

main().catch(e => { console.error('cleanup crashed:', e.message); process.exit(2); });
