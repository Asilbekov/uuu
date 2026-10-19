// UI smoke setup for the CARD BUTTON LEVEL LADDER (fixed levels in every mode):
//   alice → own public test "XLadderOwn" (no attachments, not bookmarked)
//   bob   → public test "XLadderBob" (foreign to alice), alice BOOKMARKS it
// Personal library then holds one OWN card (Public+Delete, no Unpin) and one
// BOOKMARKED card (Unpin, no Public/Delete) — the exact mix that used to make
// buttons drift between cells before the fixed ladder.
// Prints JSON on stdout: { stamp, email, ownId, bobId, aCookie, bCookie }
// Usage: BASE=http://127.0.0.1:3199 node scripts/ui-smoke-ladder-setup.cjs
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
  const r = await req('POST', '/api/auth/register', { session: s, body: { email, name: `Alice ${name}`, password: 'ui-pass-123' } });
  if (r.status !== 200 && r.status !== 201) throw new Error(`register ${name}: ${r.status}`);
  return s;
}

const QUESTIONS = (tag) => [
  { text: `Q1 ${tag}`, optionA: 'a1', optionB: 'b1', optionC: 'c1', optionD: 'd1', correctAnswer: 'A' },
  { text: `Q2 ${tag}`, optionA: 'a2', optionB: 'b2', optionC: 'c2', optionD: 'd2', correctAnswer: 'C' },
];

async function main() {
  const A = await register('alice');
  const B = await register('bob');

  const own = await req('POST', '/api/tests', {
    session: A,
    body: { title: `XLadderOwn ${STAMP}`, description: 'own card', topic: 'Chemistry', isPublic: true, tags: [`ladder-${STAMP}`], questions: QUESTIONS('own') },
  });
  if (own.status !== 201) throw new Error(`own: ${own.status}`);

  const foreign = await req('POST', '/api/tests', {
    session: B,
    body: { title: `XLadderBob ${STAMP}`, description: 'foreign card', topic: 'Physics', isPublic: true, tags: [`ladder-${STAMP}`], questions: QUESTIONS('bob') },
  });
  if (foreign.status !== 201) throw new Error(`foreign: ${foreign.status}`);

  const bm = await req('POST', '/api/bookmarks', { session: A, body: { testId: foreign.json.id } });
  if (bm.status !== 200 && bm.status !== 201) throw new Error(`bookmark: ${bm.status}`);

  // Third card — own test WITH an attachment (drives the FILES WINDOW check):
  // a tiny text file goes through /api/attachments/upload (telegram or the
  // data: fallback) and rides into the create payload.
  const form = new FormData();
  form.append('file', new Blob([Buffer.from('ladder smoke attachment\n')], { type: 'text/plain' }), 'ladder-notes.txt');
  const up = await fetch(`${BASE}/api/attachments/upload`, {
    method: 'POST',
    headers: { Cookie: A.header() },
    body: form,
    redirect: 'manual',
  });
  const upJson = await up.json();
  if (up.status !== 200 || !upJson?.url) throw new Error(`upload: ${up.status} ${JSON.stringify(upJson).slice(0, 120)}`);

  const filesTest = await req('POST', '/api/tests', {
    session: A,
    body: {
      title: `XLadderFiles ${STAMP}`, description: 'has files', topic: 'Mathematics', isPublic: true, tags: [`ladder-${STAMP}`], questions: QUESTIONS('files'),
      attachments: [{ title: upJson.name || 'ladder-notes.txt', type: 'TXT', url: upJson.url, size: upJson.size ?? null, tgMessageId: upJson.tgMessageId ?? null }],
    },
  });
  if (filesTest.status !== 201) throw new Error(`filesTest: ${filesTest.status}`);

  process.stdout.write(JSON.stringify({
    stamp: STAMP,
    email: `${STAMP}-alice@ui.test`,
    ownId: own.json.id,
    bobId: foreign.json.id,
    filesId: filesTest.json.id,
    fileName: upJson.name || 'ladder-notes.txt',
    aCookie: A.header(),
    bCookie: B.header(),
  }));
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
