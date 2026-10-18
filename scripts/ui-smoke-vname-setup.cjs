// UI smoke setup for the VERSION-NAME + card-color rules:
//   alice → public test "XColor" with an EXPLICIT coverColor (#FFAA00)
//           + public test "XClash" (free name)
// Prints JSON on stdout: { stamp, colorTestId, clashId, aCookie }
// Usage: BASE=http://127.0.0.1:3199 node scripts/ui-smoke-vname-setup.cjs
const BASE = process.env.BASE || 'http://127.0.0.1:3199';
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
  const r = await req('POST', '/api/auth/register', { session: s, body: { email, name: 'Alice VN', password: 'ui-pass-123' } });
  if (r.status !== 200 && r.status !== 201) throw new Error(`register ${name}: ${r.status}`);
  return s;
}

const QUESTIONS = (tag) => [
  { text: `Q1 ${tag}`, optionA: 'a1', optionB: 'b1', optionC: 'c1', optionD: 'd1', correctAnswer: 'A' },
  { text: `Q2 ${tag}`, optionA: 'a2', optionB: 'b2', optionC: 'c2', optionD: 'd2', correctAnswer: 'C' },
];

async function main() {
  const A = await register('alice');

  const colorTest = await req('POST', '/api/tests', {
    session: A,
    body: { title: `XColor ${STAMP}`, description: 'has an explicit color', topic: 'Chemistry', isPublic: true, tags: [`vname-${STAMP}`], coverColor: '#FFAA00', questions: QUESTIONS('color') },
  });
  if (colorTest.status !== 201) throw new Error(`colorTest: ${colorTest.status}`);

  const clashTest = await req('POST', '/api/tests', {
    session: A,
    body: { title: `XClash ${STAMP}`, description: 'name-clash source', topic: 'Chemistry', isPublic: true, tags: [`vname-${STAMP}`], coverColor: '#00AAFF', questions: QUESTIONS('clash') },
  });
  if (clashTest.status !== 201) throw new Error(`clashTest: ${clashTest.status}`);

  process.stdout.write(JSON.stringify({
    stamp: STAMP,
    email: `${STAMP}-alice@ui.test`,
    colorTestId: colorTest.json.id,
    clashId: clashTest.json.id,
    aCookie: A.header(),
  }));
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
