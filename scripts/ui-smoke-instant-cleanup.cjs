// UI smoke cleanup — INSTANT BUTTONS. Consumes the setup JSON via argv/stdin.
// Deletes the smoke test + the account.
const BASE = process.env.BASE || 'http://127.0.0.1:3199';

async function main() {
  const raw = process.argv[2] || await new Promise(res => {
    let d = ''; process.stdin.on('data', c => (d += c)); process.stdin.on('end', () => res(d));
  });
  const { testId, cookie } = JSON.parse(raw);
  const H = { 'Content-Type': 'application/json', Cookie: cookie };
  const t = await fetch(`${BASE}/api/tests/${testId}`, { method: 'DELETE', headers: H });
  console.log('delete test:', t.status);
  const a = await fetch(`${BASE}/api/me`, { method: 'DELETE', headers: H });
  console.log('delete account:', a.status);
}

main().catch(e => { console.error('cleanup crashed:', e.message); process.exit(2); });
