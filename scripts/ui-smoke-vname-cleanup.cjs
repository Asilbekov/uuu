// UI smoke cleanup for the VERSION-NAME rules (consumes setup JSON on argv).
// Usage: node scripts/ui-smoke-vname-cleanup.cjs '{"stamp":...,"colorTestId":...,"clashId":...,"aCookie":...}'
const BASE = process.env.BASE || 'http://127.0.0.1:3199';
const input = process.argv[2];
if (!input) { console.error('usage: node ui-smoke-vname-cleanup.cjs <setup-json>'); process.exit(1); }
const d = JSON.parse(input);

function jar(cookie) {
  return { header: () => cookie };
}

async function req(method, path, session) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(session ? { Cookie: session.header() } : {}) },
    redirect: 'manual',
  });
  let json = null;
  try { json = await res.json(); } catch {}
  return { status: res.status, json };
}

async function main() {
  console.log('delete colorTest:', (await req('DELETE', `/api/tests/${d.colorTestId}`, jar(d.aCookie))).status);
  console.log('delete clashTest:', (await req('DELETE', `/api/tests/${d.clashId}`, jar(d.aCookie))).status);
  console.log('delete account:', (await req('DELETE', '/api/me', jar(d.aCookie))).status);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
