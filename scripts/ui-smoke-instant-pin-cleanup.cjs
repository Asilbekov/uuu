// UI smoke cleanup — INSTANT PIN. Consumes the setup JSON via argv/stdin.
// Unbookmarks (paranoia), deletes the smoke test + both accounts.
const BASE = process.env.BASE || 'http://127.0.0.1:3199';

async function main() {
  const raw = process.argv[2] || await new Promise(res => {
    let d = ''; process.stdin.on('data', c => (d += c)); process.stdin.on('end', () => res(d));
  });
  const { testId, viewerCookie, authorCookie } = JSON.parse(raw);
  const H = { 'Content-Type': 'application/json', Cookie: viewerCookie };
  const AH = { 'Content-Type': 'application/json', Cookie: authorCookie };
  const t = await fetch(`${BASE}/api/tests/${testId}`, { method: 'DELETE', headers: AH });
  console.log('delete test:', t.status);
  const v = await fetch(`${BASE}/api/me`, { method: 'DELETE', headers: H });
  console.log('delete viewer:', v.status);
  const a = await fetch(`${BASE}/api/me`, { method: 'DELETE', headers: AH });
  console.log('delete author:', a.status);
}

main().catch(e => { console.error('cleanup crashed:', e.message); process.exit(2); });
