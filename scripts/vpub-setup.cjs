// Фикстуры для пробы «в редакторе версии нет селектора публикации».
// alice создаёт публичный ствол; bob делает копию → ВЕРСИЯ (parentId);
// bob создаёт и свой обычный тест (контроль). Вывод — JSON в stdout.
// Usage: BASE=http://127.0.0.1:3199 node scripts/vpub-setup.cjs > /tmp/vpub-setup.json
const BASE = process.env.BASE || 'http://127.0.0.1:3199';
const STAMP = 'vp' + Date.now().toString(36);

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
  const email = `vpub-${name}-${STAMP}@e2e.test`;
  const r = await req('POST', '/api/auth/register', { session: s, body: { email, name: `VP ${name}`, password: 'vpub-pass-123' } });
  if (r.status !== 200 && r.status !== 201) throw new Error(`register ${name}: ${r.status}`);
  return s;
}

const QUESTIONS = (tag) => [
  { text: `Q1 ${tag}`, optionA: 'a1', optionB: 'b1', optionC: 'c1', optionD: 'd1', correctAnswer: 'A' },
  { text: `Q2 ${tag}`, optionA: 'a2', optionB: 'b2', optionC: 'c2', optionD: 'd2', correctAnswer: 'C' },
  { text: `Q3 ${tag}`, optionA: 'a3', optionB: 'b3', optionC: 'c3', optionD: 'd3', correctAnswer: 'B' },
];

async function main() {
  const alice = await register('alice');
  const bob = await register('bob');

  const trunk = await req('POST', '/api/tests', {
    session: alice,
    body: { title: `VP trunk ${STAMP}`, description: 'trunk', topic: 'Chemistry', isPublic: true, tags: [`vp-${STAMP}`], questions: QUESTIONS('trunk') },
  });
  if (trunk.status !== 201 || !trunk.json?.id) throw new Error(`trunk create: ${trunk.status}`);

  const version = await req('POST', `/api/tests/${trunk.json.id}/copy`, { session: bob });
  if (version.status !== 200 || !version.json?.id) throw new Error(`copy: ${version.status}`);
  if (!version.json.parentId) throw new Error('copy has no parentId — not a version');

  const own = await req('POST', '/api/tests', {
    session: bob,
    body: { title: `VP own ${STAMP}`, description: 'own', topic: 'Chemistry', isPublic: true, tags: [`vp-${STAMP}`], questions: QUESTIONS('own') },
  });
  if (own.status !== 201 || !own.json?.id) throw new Error(`own create: ${own.status}`);

  console.log(JSON.stringify({
    stamp: STAMP,
    bobEmail: `vpub-bob-${STAMP}@e2e.test`,
    bobCookie: bob.header(),
    aliceCookie: alice.header(),
    trunkId: trunk.json.id,
    trunkTitle: `VP trunk ${STAMP}`,
    versionId: version.json.id,
    versionTitle: version.json.title,
    ownId: own.json.id,
    ownTitle: `VP own ${STAMP}`,
  }));
}

main().catch(e => { console.error(String(e)); process.exit(1); });
