// ---------------------------------------------------------------------------
// E2E b3 — VERSION TREE + fork rules (run against a local prod-build server):
//   1. from-scratch test is discoverable, has NO parentId (trunk)
//   2. "Edit" copy = VERSION: parentId/rootId set, joins the family
//   3. saving a copy with < 2 changed questions → 403 VERSION_TOO_SIMILAR
//   4. sharing such a copy by link → 403 VERSION_TOO_SIMILAR
//   5. sharing any version to community → 403 VERSION_NOT_PUBLIC
//   6. after 2+ changed questions: save OK, link share OK
//   7. branch-on-branch: copy of a copy → tree holds 3 generations
//   8. GET /tree returns the whole family with creators (the "apples")
//   9. notes API still works (dormant feature — the tree UI no longer shows notes)
//  10. versions NEVER appear in the discover feed
//  11. changedCount: 0 on a fresh copy, 2 after a 2-question save — it drives
//      the two states of the card's share-link button
// Cleanup: deletes created tests + accounts.
// Usage: BASE=http://localhost:3100 node scripts/e2e-b3-tree.js
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
  const email = `b3-${name}-${STAMP}@e2e.test`;
  const r = await req('POST', '/api/auth/register', { session: s, body: { email, name: `B3 ${name}`, password: 'e2e-pass-123' } });
  if (r.status !== 200 && r.status !== 201) throw new Error(`register ${name} failed: ${r.status} ${JSON.stringify(r.json)}`);
  return s;
}

const QUESTIONS = (tag) => [
  { text: `Q1 ${tag}`, optionA: 'a1', optionB: 'b1', optionC: 'c1', optionD: 'd1', correctAnswer: 'A' },
  { text: `Q2 ${tag}`, optionA: 'a2', optionB: 'b2', optionC: 'c2', optionD: 'd2', correctAnswer: 'C' },
  { text: `Q3 ${tag}`, optionA: 'a3', optionB: 'b3', optionC: 'c3', optionD: 'd3', correctAnswer: 'B' },
];

async function main() {
  console.log(`\n=== E2E b3 — version tree ===\nBASE=${BASE}\n`);

  // 0. app is up
  const home = await fetch(BASE);
  ok(home.status === 200, 'GET / → 200');

  // users
  const A = await register('alice');
  const B = await register('bob');
  const C = await register('carol');
  ok(true, 'registered 3 users (alice/bob/carol)');

  // 1. trunk: alice creates a from-scratch PUBLIC test
  const title = `B3 trunk ${STAMP}`;
  const created = await req('POST', '/api/tests', {
    session: A,
    body: { title, description: 'trunk', topic: 'Chemistry', isPublic: true, tags: [`b3-${STAMP}`], questions: QUESTIONS('trunk') },
  });
  ok(created.status === 201 && created.json?.id, 'alice creates a from-scratch public test');
  const rootId = created.json.id;
  ok(!created.json.parentId, 'trunk has no parentId');

  // 2. bob edits alice's test → copy = VERSION
  const copy1 = await req('POST', `/api/tests/${rootId}/copy`, { session: B });
  ok(copy1.status === 200 && copy1.json?.id, 'bob "Edit" → private copy created');
  const v1 = copy1.json.id;
  ok(copy1.json.parentId === rootId, 'copy.parentId → the source test');
  ok(copy1.json.rootId === rootId, 'copy.rootId → the family trunk');
  ok(copy1.json.changedCount === 0, 'fresh copy carries changedCount=0 (share button passive)');

  // 3. saving the copy with 1 changed question → blocked
  const oneChange = {
    title: copy1.json.title, description: copy1.json.description, tags: copy1.json.tags,
    isPublic: false, randomizeQuestions: false, randomizeOptions: false,
    questions: [
      { text: `Q1 EDITED once ${STAMP}`, optionA: 'a1', optionB: 'b1', optionC: 'c1', optionD: 'd1', correctAnswer: 'A' },
      { text: `Q2 ${'trunk'}`, optionA: 'a2', optionB: 'b2', optionC: 'c2', optionD: 'd2', correctAnswer: 'C' },
      { text: `Q3 trunk`, optionA: 'a3', optionB: 'b3', optionC: 'c3', optionD: 'd3', correctAnswer: 'B' },
    ],
  };
  const blockedSave = await req('PUT', `/api/tests/${v1}`, { session: B, body: oneChange });
  ok(blockedSave.status === 403 && blockedSave.json?.error === 'VERSION_TOO_SIMILAR',
     'save with 1 changed question → 403 VERSION_TOO_SIMILAR', JSON.stringify(blockedSave.json));

  // 4/5. sharing the unchanged copy: link blocked, community blocked
  const shareLink = await req('POST', `/api/tests/${v1}/share`, { session: B, body: { scope: 'link' } });
  ok(shareLink.status === 403 && shareLink.json?.error === 'VERSION_TOO_SIMILAR',
     'link share with <2 changes → 403 VERSION_TOO_SIMILAR');
  const shareComm = await req('POST', `/api/tests/${v1}/share`, { session: B, body: { scope: 'community' } });
  ok(shareComm.status === 403 && shareComm.json?.error === 'VERSION_NOT_PUBLIC',
     'community share of a version → 403 VERSION_NOT_PUBLIC');

  // 6. bob changes 2 questions → save OK, link share OK, community still blocked
  const twoChanges = {
    ...oneChange,
    questions: [
      { text: `Q1 EDITED once ${STAMP}`, optionA: 'a1', optionB: 'b1', optionC: 'c1', optionD: 'd1', correctAnswer: 'A' },
      { text: `Q2 EDITED twice ${STAMP}`, optionA: 'a2x', optionB: 'b2', optionC: 'c2', optionD: 'd2', correctAnswer: 'D' },
      { text: `Q3 trunk`, optionA: 'a3', optionB: 'b3', optionC: 'c3', optionD: 'd3', correctAnswer: 'B' },
    ],
  };
  const saved = await req('PUT', `/api/tests/${v1}`, { session: B, body: twoChanges });
  ok(saved.status === 200, 'save with 2 changed questions → 200');
  ok(saved.json?.changedCount === 2, 'save persists changedCount=2 (share button turns active)');
  const savedIsPublic = saved.json?.isPublic;
  ok(savedIsPublic === false, 'version save coerces isPublic=false (even if a toggle said true)');
  const linkOk = await req('POST', `/api/tests/${v1}/share`, { session: B, body: { scope: 'link' } });
  ok(linkOk.status === 200, 'link share with 2+ changes → 200');
  const commStill = await req('POST', `/api/tests/${v1}/share`, { session: B, body: { scope: 'community' } });
  ok(commStill.status === 403 && commStill.json?.error === 'VERSION_NOT_PUBLIC',
     'community share STILL blocked after 2+ changes → 403 VERSION_NOT_PUBLIC');

  // 7. branch-on-branch: carol forks bob's version
  const copy2 = await req('POST', `/api/tests/${v1}/copy`, { session: C });
  ok(copy2.status === 200 && copy2.json?.id, 'carol forks bob\'s version');
  const v2 = copy2.json.id;
  ok(copy2.json.parentId === v1, 'sub-copy.parentId → bob\'s version (branch on branch)');
  ok(copy2.json.rootId === rootId, 'sub-copy.rootId → the SAME family trunk');

  // 8. the tree: whole family with creators (the "apples")
  const tree = await req('GET', `/api/tests/${rootId}/tree`);
  ok(tree.status === 200 && Array.isArray(tree.json?.nodes), 'GET /tree → 200 with nodes');
  const ids = (tree.json?.nodes || []).map(n => n.id);
  ok(ids.includes(rootId) && ids.includes(v1) && ids.includes(v2), 'tree holds all 3 generations');
  ok(tree.json?.rootId === rootId, 'tree.rootId = the trunk');
  const v1node = (tree.json?.nodes || []).find(n => n.id === v1);
  ok(v1node?.creator?.id && v1node.creator.name === 'B3 bob', 'bob\'s version node carries bob (the apple photo)');
  ok(v1node?.changedCount === 2, 'tree node carries changedCount (card button state without re-diff)');
  const reRoot = await req('GET', `/api/tests/${v1}/tree`);
  ok(reRoot.status === 200 && (reRoot.json?.nodes || []).some(n => n.id === v2),
     're-rooted tree (bob\'s version) still shows its own apples');

  // 9. notes
  const note = await req('POST', `/api/tests/${rootId}/notes`, { session: C, body: { text: `Small contribution note ${STAMP}` } });
  ok(note.status === 201 && note.json?.id, 'carol creates a note about the trunk');
  const notes = await req('GET', `/api/tests/${rootId}/notes`);
  ok(notes.status === 200 && (notes.json?.notes || []).some(n => n.text.includes(STAMP)), 'notes list shows the note');

  // 10. versions NEVER in the discover feed (alice sees bob's public? no —
  // versions are private; assert the trunk IS there and copies are NOT)
  const disc = await req('GET', '/api/feed?scope=discover&limit=50', { session: B });
  const discIds = JSON.stringify(disc.json);
  ok(disc.status === 200, 'discover feed loads');
  ok(!discIds.includes(`"${v1}"`) && !discIds.includes(`"${v2}"`), 'versions absent from discover feed');
  ok(discIds.includes(`"${rootId}"`), 'trunk present in discover feed');

  // ---- cleanup ----
  console.log('\ncleanup:');
  for (const [sess, id] of [[A, rootId], [B, v1], [C, v2]]) {
    const d = await req('DELETE', `/api/tests/${id}`, { session: sess });
    console.log(`  delete test ${id}: ${d.status}`);
  }
  for (const [nm, sess] of [['alice', A], ['bob', B], ['carol', C]]) {
    const d = await req('DELETE', '/api/me', { session: sess });
    console.log(`  delete account ${nm}: ${d.status}`);
  }

  console.log(`\n=== RESULT: ${passed} passed, ${failed} failed ===`);
  if (failed) { console.log('FAILED:', fails.join(' | ')); process.exit(1); }
}

main().catch(e => { console.error('E2E crashed:', e); process.exit(2); });
