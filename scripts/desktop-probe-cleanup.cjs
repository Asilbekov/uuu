// Cleanup the desktop probe account (deletes all its tests first, then the account)
const BASE = process.env.BASE || 'http://127.0.0.1:3100';
const EMAIL_PREFIX = 'deskprobe_';

(async () => {
  // find the account via admin-less approach: we stored nothing — list recent users is not public.
  // Instead: the probe script prints EMAIL+COOKIE; accept them via env.
  const cookie = process.env.PROBE_COOKIE;
  if (!cookie) { console.log('PROBE_COOKIE not set — nothing to do'); return; }
  const h = { Cookie: cookie, 'Content-Type': 'application/json' };
  // list my tests (public+private scope)
  const r = await fetch(BASE + '/api/tests?scope=mine&limit=50', { headers: h });
  const data = await r.json().catch(() => ({}));
  const tests = (data.tests || data.items || data) as any[];
  let n = 0;
  if (Array.isArray(tests)) {
    for (const t of tests) {
      const dr = await fetch(BASE + `/api/tests/${t.id}`, { method: 'DELETE', headers: h });
      if (dr.status === 200) n++;
    }
  }
  console.log(`deleted ${n} tests`);
  const da = await fetch(BASE + '/api/me', { method: 'DELETE', headers: h });
  console.log('delete account:', da.status);
})().catch(e => { console.error(e); process.exit(1); });
