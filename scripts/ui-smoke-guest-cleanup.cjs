// UI smoke cleanup — GUEST SHARE LINK flow.
// Deletes the account (cascades its tests). Input: setup JSON on stdin.
const BASE = process.env.BASE || 'http://127.0.0.1:3199';

async function main() {
  const raw = await new Promise(res => { let d = ''; process.stdin.on('data', c => (d += c)); process.stdin.on('end', () => res(d)); });
  const fx = JSON.parse(raw);
  const email = fx.email;
  // Login fresh (the setup cookie may be stale after restarts)
  const lr = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: fx.password }),
  });
  const sc = lr.headers.getSetCookie ? lr.headers.getSetCookie() : [lr.headers.get('set-cookie')].filter(Boolean);
  const pair = (sc.find(c => c.startsWith('uuu_session=')) || '').split(';')[0];
  if (!pair) { console.log('cleanup: no session, account may not exist'); return; }
  const dr = await fetch(`${BASE}/api/me`, { method: 'DELETE', headers: { Cookie: pair } });
  console.log(`cleanup: account ${email} -> ${dr.status}`);
}

main().catch(e => { console.error('cleanup crashed:', e.message); process.exit(2); });
