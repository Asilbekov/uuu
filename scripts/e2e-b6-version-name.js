// ---------------------------------------------------------------------------
// E2E b6 — VERSION NAME + community-name rule + card-color data:
//   1. GET / → 200 (app up)
//   2. alice creates a from-scratch test → ok (name is free)
//   3. bob creates a test with the SAME name (case differs) → 409 PUBLISH_NAME_TAKEN
//   4. ...even as a PRIVATE (isPublic: false) test → still 409
//   5. alice creates a second test with a UNIQUE name → 201
//   6. the naming endpoint: PUT-free POST /version-name sets the name
//   7. GET /tests/[id] returns versionName
//   8. GET /tree returns versionName on the node
//   9. feed (mine scope) cards carry versionName
//  10. PUT /tests/[id] with { versionName } (the editor-save path) persists it
//  11. renaming own private test to a community-clashing name → 409
//  12. non-creator cannot name → 403; empty name → 400
//  13. a private test with a free name stays creatable (rule targets CLASHES only)
// Cleanup: deletes created tests + accounts.
// Usage: BASE=http://localhost:3100 node scripts/e2e-b6-version-name.js
// ---------------------------------------------------------------------------
const BASE = process.env.BASE || 'http://localhost:3100';
const STAMP = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

let passed = 0, failed = 0;
const fails = [];
function ok(cond, name, extra = '') {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; fails.push(name); console.log(`  ❌ ${name} ${extra}`); }
}

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
    headers: {
      'Content-Type': 'application/json',
      ...(session ? { Cookie: session.header() } : {}),
    },
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
  const email = `b6-${name}-${STAMP}@e2e.test`;
  const r = await req('POST', '/api/auth/register', { session: s, body: { email, name: `B6 ${name}`, password: 'e2e-pass-123' } });
  if (r.status !== 200 && r.status !== 201) throw new Error(`register ${name} failed: ${r.status} ${JSON.stringify(r.json)}`);
  return s;
}

const QUESTIONS = (tag) => [
  { text: `Q1 ${tag}`, optionA: 'a1', optionB: 'b1', optionC: 'c1', optionD: 'd1', correctAnswer: 'A' },
  { text: `Q2 ${tag}`, optionA: 'a2', optionB: 'b2', optionC: 'c2', optionD: 'd2', correctAnswer: 'C' },
];

async function main() {
  console.log(`\n=== E2E b6 — version name + community-name rule ===\nBASE=${BASE}\n`);

  const home = await fetch(BASE);
  ok(home.status === 200, 'GET / → 200');

  const A = await register('alice');
  const B = await register('bob');
  ok(true, 'registered 2 users (alice/bob)');

  const pubTitle = `B6 public ${STAMP}`;
  const created = await req('POST', '/api/tests', {
    session: A,
    body: { title: pubTitle, description: 'public trunk', topic: 'Chemistry', isPublic: true, tags: [`b6-${STAMP}`], questions: QUESTIONS('pub') },
  });
  ok(created.status === 201 && created.json?.id, 'alice creates a public test (free name)');
  const pubId = created.json.id;

  // 3. same name, different case → rejected even for a regular create
  const clash1 = await req('POST', '/api/tests', {
    session: B,
    body: { title: pubTitle.toLowerCase(), description: '', topic: 'Chemistry', isPublic: true, tags: [], questions: QUESTIONS('c1') },
  });
  ok(clash1.status === 409 && clash1.json?.error === 'PUBLISH_NAME_TAKEN', 'same name as a community test → 409 PUBLISH_NAME_TAKEN', JSON.stringify(clash1.json));

  // 4. ...and the rule does NOT depend on the new test's visibility
  const clash2 = await req('POST', '/api/tests', {
    session: B,
    body: { title: pubTitle, description: '', topic: 'Chemistry', isPublic: false, tags: [], questions: QUESTIONS('c2') },
  });
  ok(clash2.status === 409, 'same name stays blocked for a PRIVATE (link-only) test too', `status=${clash2.status}`);

  // 13. a free name stays creatable in any variant
  const freePriv = `B6 privfree ${STAMP}`;
  const freeCreate = await req('POST', '/api/tests', {
    session: B,
    body: { title: freePriv, description: '', topic: 'Chemistry', isPublic: false, tags: [], questions: QUESTIONS('c3') },
  });
  ok(freeCreate.status === 201, 'a unique private name creates fine (rule targets clashes only)');
  const privId = freeCreate.json.id;

  // 10. the editor-save path: PUT carries versionName → persisted
  const putNamed = await req('PUT', `/api/tests/${privId}`, {
    session: B,
    body: {
      title: freePriv, description: '', topic: 'Chemistry', isPublic: false,
      randomizeQuestions: false, randomizeOptions: false,
      tags: [], coverIcon: null, coverColor: null,
      versionName: 'Версия из редактора',
      questions: QUESTIONS('c3'),
    },
  });
  ok(putNamed.status === 200 && putNamed.json?.versionName === 'Версия из редактора', 'PUT with versionName (editor-save path) persists the name', JSON.stringify(putNamed.json?.versionName));

  // 6. the naming dialog endpoint
  const named = await req('POST', `/api/tests/${privId}/version-name`, { session: B, body: { versionName: 'Моя редакция 1' } });
  ok(named.status === 200 && named.json?.versionName === 'Моя редакция 1', 'POST /version-name sets the version name');

  // 7. GET returns it
  const full = await req('GET', `/api/tests/${privId}`, { session: B });
  ok(full.status === 200 && full.json?.versionName === 'Моя редакция 1', 'GET /tests/[id] carries versionName');

  // 8. tree payload carries it
  const tree = await req('GET', `/api/tests/${privId}/tree`);
  const node = (tree.json?.nodes || []).find(n => n.id === privId);
  ok(tree.status === 200 && node?.versionName === 'Моя редакция 1', 'GET /tree node carries versionName');

  // 9. feed (mine) card carries it
  const feed = await req('GET', '/api/feed?scope=mine&limit=20', { session: B });
  const card = (feed.json?.items || []).find(x => x.id === privId);
  ok(!!card && card.versionName === 'Моя редакция 1', 'feed (mine) card carries versionName');

  // 12. guards: non-creator 403, empty name 400
  const foreign = await req('POST', `/api/tests/${privId}/version-name`, { session: A, body: { versionName: 'hijack' } });
  ok(foreign.status === 403, 'non-creator cannot name the version → 403');
  const empty = await req('POST', `/api/tests/${privId}/version-name`, { session: B, body: { versionName: '   ' } });
  ok(empty.status === 400 || empty.status === 422, 'empty version name → 400/422 (rejected)');

  // 11. renaming own private test to a community-clashing name → 409
  const rename = await req('PUT', `/api/tests/${privId}`, {
    session: B,
    body: {
      title: pubTitle.toUpperCase(), description: '', topic: 'Chemistry', isPublic: false,
      randomizeQuestions: false, randomizeOptions: false,
      tags: [], questions: QUESTIONS('c3'),
    },
  });
  ok(rename.status === 409, 'renaming a private test to a community name → 409', `status=${rename.status}`);

  // cleanup
  console.log('\ncleanup:');
  for (const [s, id] of [[A, pubId], [B, privId]]) {
    const del = await req('DELETE', `/api/tests/${id}`, { session: s });
    console.log(`  delete test ${id}: ${del.status}`);
  }
  for (const s of [A, B]) {
    const del = await req('DELETE', '/api/me', { session: s });
    console.log(`  delete account: ${del.status}`);
  }

  console.log(`\n=== RESULT: ${passed} passed, ${failed} failed ===`);
  if (failed) { console.log('FAILED:', fails.join(' | ')); process.exit(1); }
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
