// Re-login smoke accounts and delete them + their tests (server on 3199)
const BASE = 'http://127.0.0.1:3199';
const ACCOUNTS = [
  { email: 'uimvds7613-alice@ui.test', keep: ['cmvds76fm005eoo4uqc0hogxv', 'cmvds770z005joo4u87104wny'] },
  { email: 'gstmvds67zj@ui.test' },
  { email: 'pinstm-a@ui.test' },
];

async function j(method, path, body, cookie) {
  const r = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: r.status, data: await r.json().catch(() => ({})), setCookie: r.headers.getSetCookie ? r.headers.getSetCookie() : [] };
}

(async () => {
  for (const acc of ACCOUNTS) {
    if (!acc.email) continue;
    const login = await j('POST', '/api/auth/login', { email: acc.email, password: 'ui-pass-123' });
    if (login.status !== 200) { console.log(`${acc.email}: login ${login.status}, skip`); continue; }
    const cookie = (login.setCookie.find(c => c.startsWith('uuu_session=')) || '').split(';')[0];
    const mine = await j('GET', '/api/tests?scope=mine&limit=50', null, cookie);
    const list = Array.isArray(mine.data) ? mine.data : (mine.data.tests || []);
    for (const t of list) {
      const d = await j('DELETE', `/api/tests/${t.id}`, null, cookie);
      console.log(`  ${acc.email} test ${t.id}: ${d.status}`);
    }
    const da = await j('DELETE', '/api/me', null, cookie);
    console.log(`${acc.email}: account ${da.status}`);
  }
})().catch(e => { console.error(e); process.exit(1); });
