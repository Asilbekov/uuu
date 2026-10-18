// UI smoke setup — INSTANT BUTTONS (save-edit mirror).
// Creates a user + one public test «UI instant <stamp>» (2 questions, 1 link
// attachment). Prints JSON: { stamp, email, password, testId, cookie }.
// Usage: BASE=http://127.0.0.1:3199 node scripts/ui-smoke-instant-setup.cjs
const BASE = process.env.BASE || 'http://127.0.0.1:3199';
const STAMP = 'ist' + Date.now().toString(36);

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
  const r = await req('POST', '/api/auth/register', { session: s, body: { email, name: 'Instant Smoke', password: 'ui-pass-123' } });
  if (r.status !== 200 && r.status !== 201) throw new Error(`register: ${r.status}`);

  const t = await req('POST', '/api/tests', { session: s, body: {
    title: `UI instant ${STAMP}`,
    description: 'ui smoke instant buttons',
    topic: 'Chemistry',
    isPublic: true,
    tags: [STAMP],
    questions: [
      { text: `Q1 ${STAMP}`, optionA: 'a1', optionB: 'b1', optionC: 'c1', optionD: 'd1', correctAnswer: 'A' },
      { text: `Q2 ${STAMP}`, optionA: 'a2', optionB: 'b2', optionC: 'c2', optionD: 'd2', correctAnswer: 'C' },
    ],
    attachments: [{ title: 'smoke link', type: 'link', url: 'https://example.com/smoke.pdf', orderNum: 0 }],
  } });
  if (t.status !== 201) throw new Error(`test create: ${t.status} ${JSON.stringify(t.json)}`);

  process.stdout.write(JSON.stringify({ stamp: STAMP, email, password: 'ui-pass-123', testId: t.json.id, cookie: s.header() }));
}

main().catch(e => { console.error('setup crashed:', e.message); process.exit(2); });
