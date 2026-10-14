// UI smoke setup for the tree/files RECOMMENDATION FEED (one tree card per
// test + flattened files flow):
//   alice → trunk (public, gets a version from bob), plain (public),
//           filesTest (public, 2 data-URL attachments)
//   bob   → copies trunk = v1 (version, ancestor level for the trunk tree)
// Prints JSON on stdout: { stamp, trunkId, v1Id, plainId, filesId, aCookie, bCookie }
// Usage: BASE=http://127.0.0.1:3199 node scripts/ui-smoke-feed-setup.cjs
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
  const pretty = { alice: 'Alicia', bob: 'Boris' }[name] || name;
  const r = await req('POST', '/api/auth/register', { session: s, body: { email, name: pretty, password: 'ui-pass-123' } });
  if (r.status !== 200 && r.status !== 201) throw new Error(`register ${name}: ${r.status}`);
  return s;
}

const QUESTIONS = (tag) => [
  { text: `Q1 ${tag}`, optionA: 'a1', optionB: 'b1', optionC: 'c1', optionD: 'd1', correctAnswer: 'A' },
  { text: `Q2 ${tag}`, optionA: 'a2', optionB: 'b2', optionC: 'c2', optionD: 'd2', correctAnswer: 'C' },
  { text: `Q3 ${tag}`, optionA: 'a3', optionB: 'b3', optionC: 'c3', optionD: 'd3', correctAnswer: 'B' },
];

const dataUrl = (text) => `data:text/plain;base64,${Buffer.from(text).toString('base64')}`;

async function main() {
  const A = await register('alice');
  const B = await register('bob');

  const trunk = await req('POST', '/api/tests', {
    session: A,
    body: { title: `UI trunk ${STAMP}`, description: 'ui smoke trunk', topic: 'Chemistry', isPublic: true, tags: [STAMP], questions: QUESTIONS('trunk') },
  });
  if (trunk.status !== 201) throw new Error(`trunk create: ${trunk.status}`);

  const plain = await req('POST', '/api/tests', {
    session: A,
    body: { title: `UI plain ${STAMP}`, description: 'ui smoke plain', topic: 'History', isPublic: true, tags: [STAMP], questions: QUESTIONS('plain') },
  });
  if (plain.status !== 201) throw new Error(`plain create: ${plain.status}`);

  const filesTest = await req('POST', '/api/tests', {
    session: A,
    body: { title: `UI files ${STAMP}`, description: 'ui smoke files', topic: 'Biology', isPublic: true, tags: [STAMP], questions: QUESTIONS('files') },
  });
  if (filesTest.status !== 201) throw new Error(`files create: ${filesTest.status}`);

  const a1 = await req('POST', `/api/tests/${filesTest.json.id}/attachments`, {
    session: A,
    body: { title: 'smoke-notes.txt', type: 'text', url: dataUrl('smoke attachment one'), size: 22 },
  });
  if (a1.status !== 201) throw new Error(`attachment 1: ${a1.status}`);
  const a2 = await req('POST', `/api/tests/${filesTest.json.id}/attachments`, {
    session: A,
    body: { title: 'smoke-sheet.txt', type: 'text', url: dataUrl('smoke attachment two'), size: 22 },
  });
  if (a2.status !== 201) throw new Error(`attachment 2: ${a2.status}`);

  const v1 = await req('POST', `/api/tests/${trunk.json.id}/copy`, { session: B });
  if (v1.status !== 200) throw new Error(`v1 copy: ${v1.status}`);

  process.stdout.write(JSON.stringify({
    stamp: STAMP,
    trunkId: trunk.json.id, v1Id: v1.json.id, plainId: plain.json.id, filesId: filesTest.json.id,
    aCookie: A.header(), bCookie: B.header(),
  }));
}

main().catch(e => { console.error('setup crashed:', e.message); process.exit(2); });
