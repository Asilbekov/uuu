// UI smoke setup — GUEST SHARE LINK flow.
// Creates a user + one public test «UI guest <stamp>» (2 questions).
// Prints JSON: { stamp, email, password, testId, cookie }.
// Usage: BASE=http://127.0.0.1:3199 node scripts/ui-smoke-guest-setup.cjs
const BASE = process.env.BASE || 'http://127.0.0.1:3199';
const STAMP = 'gst' + Date.now().toString(36);

function jar() {
  let cookie = '';
  return {
    capture(res) {
      const sc = res.headers.getSetCookie ? res.headers.getSetCookie() : [res.headers.get('set-cookie')].filter(Boolean);
      for (const c of sc) {
        const [pair] = c.split(';');
        if (pair.startsWith('uuu_session=')) cookie = pair;
      }
    },
    header() { return cookie; },
  };
}

async function req(method, path, { session, body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(session ? { Cookie: session.header() } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    redirect: 'manual',
  });
  session && session.capture(res);
  let json = null;
  try { json = await res.json(); } catch {}
  return { status: res.status, json };
}

async function main() {
  const s = jar();
  const email = `${STAMP}@ui.test`;
  const r = await req('POST', '/api/auth/register', { session: s, body: { email, name: 'Guest Smoke', password: 'ui-pass-123' } });
  if (r.status !== 200 && r.status !== 201) throw new Error(`register: ${r.status}`);

  const t = await req('POST', '/api/tests', { session: s, body: {
    title: `UI guest ${STAMP}`,
    description: 'ui smoke guest share link',
    topic: 'Chemistry',
    isPublic: true,
    tags: [STAMP],
    questions: [
      { text: `GQ1 ${STAMP}`, optionA: 'ga1', optionB: 'gb1', optionC: 'gc1', optionD: 'gd1', correctAnswer: 'A' },
      { text: `GQ2 ${STAMP}`, optionA: 'ga2', optionB: 'gb2', optionC: 'gc2', optionD: 'gd2', correctAnswer: 'C' },
    ],
  } });
  if (t.status !== 201) throw new Error(`test create: ${t.status} ${JSON.stringify(t.json)}`);

  process.stdout.write(JSON.stringify({ stamp: STAMP, email, password: 'ui-pass-123', testId: t.json.id, cookie: s.header() }));
}

main().catch(e => { console.error('setup crashed:', e.message); process.exit(2); });
