// UI smoke setup: the personal-library NAME RULE.
//   alice → trunk "UI pin <stamp>" (from scratch, public)
//   bob   → bookmarks the trunk, then copies it (the copy is auto-pinned)
// Bob's library must show exactly ONE card with that title, carrying the
// pin marker. Prints JSON: { stamp, trunkId, copyId, bEmail, aCookie, bCookie }
// Usage: BASE=http://127.0.0.1:3100 node scripts/ui-smoke-pin-setup.cjs
const BASE = process.env.BASE || 'http://127.0.0.1:3100';
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

async function register(name, pretty) {
  const s = jar();
  const email = `${STAMP}-${name}@ui.test`;
  const r = await req('POST', '/api/auth/register', { session: s, body: { email, name: pretty, password: 'ui-pass-123' } });
  if (r.status !== 200 && r.status !== 201) throw new Error(`register ${name}: ${r.status}`);
  return { session: s, email };
}

const QUESTIONS = (tag) => [
  { text: `Q1 ${tag}`, optionA: 'a1', optionB: 'b1', optionC: 'c1', optionD: 'd1', correctAnswer: 'A' },
  { text: `Q2 ${tag}`, optionA: 'a2', optionB: 'b2', optionC: 'c2', optionD: 'd2', correctAnswer: 'C' },
  { text: `Q3 ${tag}`, optionA: 'a3', optionB: 'b3', optionC: 'c3', optionD: 'd3', correctAnswer: 'B' },
];

async function main() {
  const A = await register('alice', 'Alicia Pin');
  const B = await register('bob', 'Boris Pin');

  const trunk = await req('POST', '/api/tests', {
    session: A.session,
    body: { title: `UI pin ${STAMP}`, description: 'ui smoke pin rule', topic: 'Chemistry', isPublic: true, tags: [STAMP], questions: QUESTIONS('trunk') },
  });
  if (trunk.status !== 201) throw new Error(`trunk create: ${trunk.status}`);

  const bm = await req('POST', '/api/bookmarks', { session: B.session, body: { testId: trunk.json.id } });
  if (bm.status !== 200) throw new Error(`bookmark: ${bm.status}`);

  const copy = await req('POST', `/api/tests/${trunk.json.id}/copy`, { session: B.session });
  if (copy.status !== 200) throw new Error(`copy: ${copy.status}`);

  process.stdout.write(JSON.stringify({
    stamp: STAMP,
    trunkId: trunk.json.id,
    copyId: copy.json.id,
    bEmail: B.email,
    aCookie: A.session.header(),
    bCookie: B.session.header(),
  }));
}

main().catch(e => { console.error('setup crashed:', e.message); process.exit(2); });
