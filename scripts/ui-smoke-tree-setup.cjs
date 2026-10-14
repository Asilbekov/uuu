// UI smoke setup: builds a 3-generation family for the version-tree window.
//   alice → trunk (from scratch, public)
//   bob   → copies trunk  = v1 (version, changedCount 0)
//   carol → copies v1     = v2 (branch on branch)
// Prints JSON on stdout: { trunkId, v1Id, v2Id, cCookie, names, stamp }
// Usage: BASE=http://127.0.0.1:3100 node scripts/ui-smoke-tree-setup.cjs
const BASE = process.env.BASE || 'http://127.0.0.1:3100';
const STAMP = 'ui' + Date.now().toString(36);

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

async function register(name) {
  const s = jar();
  const email = `${STAMP}-${name}@ui.test`;
  const pretty = { alice: 'Alicia', bob: 'Boris', carol: 'Carina' }[name] || name;
  const r = await req('POST', '/api/auth/register', { session: s, body: { email, name: pretty, password: 'ui-pass-123' } });
  if (r.status !== 200 && r.status !== 201) throw new Error(`register ${name}: ${r.status}`);
  return s;
}

const QUESTIONS = (tag) => [
  { text: `Q1 ${tag}`, optionA: 'a1', optionB: 'b1', optionC: 'c1', optionD: 'd1', correctAnswer: 'A' },
  { text: `Q2 ${tag}`, optionA: 'a2', optionB: 'b2', optionC: 'c2', optionD: 'd2', correctAnswer: 'C' },
  { text: `Q3 ${tag}`, optionA: 'a3', optionB: 'b3', optionC: 'c3', optionD: 'd3', correctAnswer: 'B' },
];

async function main() {
  const A = await register('alice');
  const B = await register('bob');
  const C = await register('carol');

  const trunk = await req('POST', '/api/tests', {
    session: A,
    body: { title: `UI trunk ${STAMP}`, description: 'ui smoke trunk', topic: 'Chemistry', isPublic: true, tags: [STAMP], questions: QUESTIONS('trunk') },
  });
  if (trunk.status !== 201) throw new Error(`trunk create: ${trunk.status}`);

  const v1 = await req('POST', `/api/tests/${trunk.json.id}/copy`, { session: B });
  if (v1.status !== 200) throw new Error(`v1 copy: ${v1.status}`);
  const v2 = await req('POST', `/api/tests/${v1.json.id}/copy`, { session: C });
  if (v2.status !== 200) throw new Error(`v2 copy: ${v2.status}`);

  process.stdout.write(JSON.stringify({
    stamp: STAMP,
    trunkId: trunk.json.id, v1Id: v1.json.id, v2Id: v2.json.id,
    aCookie: A.header(), bCookie: B.header(), cCookie: C.header(),
  }));
}

main().catch(e => { console.error('setup crashed:', e.message); process.exit(2); });
