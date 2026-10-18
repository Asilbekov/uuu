// UI smoke setup — INSTANT PIN (the user's exact repro).
// Creates an AUTHOR account with one PUBLIC test «Pin smoke <stamp>»
// (unique tag pinsmoke<stamp>) and a VIEWER account that will log in via UI,
// pin the test in Discover and check it appears in the personal library
// without a reload. Prints JSON:
// { stamp, authorEmail, viewerEmail, password, testId, title, tag, viewerCookie, authorCookie }
// Usage: BASE=http://127.0.0.1:3199 node scripts/ui-smoke-instant-pin-setup.cjs
const BASE = process.env.BASE || 'http://127.0.0.1:3199';
const STAMP = 'pin' + Date.now().toString(36);

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
  // 1) Author + public test (another author's test — that is what Discover shows)
  const a = jar();
  const authorEmail = `a.${STAMP}@ui.test`;
  const ra = await req('POST', '/api/auth/register', { session: a, body: { email: authorEmail, name: 'Pin Author', password: 'ui-pass-123' } });
  if (ra.status !== 200 && ra.status !== 201) throw new Error(`author register: ${ra.status}`);
  const title = `Pin smoke ${STAMP}`;
  const t = await req('POST', '/api/tests', { session: a, body: {
    title,
    description: 'ui smoke instant pin',
    topic: 'Chemistry',
    isPublic: true,
    tags: [`pinsmoke${STAMP}`],
    questions: [
      { text: `Q1 ${STAMP}`, optionA: 'a1', optionB: 'b1', optionC: 'c1', optionD: 'd1', correctAnswer: 'A' },
    ],
  } });
  if (t.status !== 201) throw new Error(`test create: ${t.status} ${JSON.stringify(t.json)}`);

  // 2) Viewer (fresh — personal library starts empty)
  const v = jar();
  const viewerEmail = `v.${STAMP}@ui.test`;
  const rv = await req('POST', '/api/auth/register', { session: v, body: { email: viewerEmail, name: 'Pin Viewer', password: 'ui-pass-123' } });
  if (rv.status !== 200 && rv.status !== 201) throw new Error(`viewer register: ${rv.status}`);

  // 3) Sanity: the viewer's bookmarks list is empty
  const bm = await req('GET', '/api/bookmarks', { session: v });
  if (bm.status !== 200 || (bm.json.ids || []).length !== 0) throw new Error(`bookmarks sanity: ${bm.status}`);

  process.stdout.write(JSON.stringify({
    stamp: STAMP, authorEmail, viewerEmail, password: 'ui-pass-123',
    testId: t.json.id, title, tag: `pinsmoke${STAMP}`,
    viewerCookie: v.header(), authorCookie: a.header(),
  }));
}

main().catch(e => { console.error('setup crashed:', e.message); process.exit(2); });
