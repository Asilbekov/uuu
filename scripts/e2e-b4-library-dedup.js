// ---------------------------------------------------------------------------
// E2E b4 — PERSONAL-LIBRARY NAME RULE (run against a local prod-build server):
//   1. the modified test (POST /tests/[id]/copy) keeps the SOURCE's exact
//      title — no " · username" suffix, no " (2)" disambiguation
//   2. the copy is AUTO-BOOKMARKED for the editor («закреплено» marker
//      without any user action)
//   3. the personal library (feed scope=mine) shows AT MOST ONE test per
//      name: the modified copy takes the pinned original's spot
//   4. a second copy of the same source displaces the first (newest own wins)
//   5. deleting a copy resurfaces the previous winner; deleting the last copy
//      resurfaces the bookmarked original — the library heals itself
// Cleanup: deletes created tests + accounts.
// Usage: BASE=http://localhost:3100 node scripts/e2e-b4-library-dedup.js
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
  const email = `b4-${name}-${STAMP}@e2e.test`;
  const r = await req('POST', '/api/auth/register', { session: s, body: { email, name: `B4 ${name}`, password: 'e2e-pass-123' } });
  if (r.status !== 200 && r.status !== 201) throw new Error(`register ${name} failed: ${r.status} ${JSON.stringify(r.json)}`);
  return s;
}

const QUESTIONS = (tag) => [
  { text: `Q1 ${tag}`, optionA: 'a1', optionB: 'b1', optionC: 'c1', optionD: 'd1', correctAnswer: 'A' },
  { text: `Q2 ${tag}`, optionA: 'a2', optionB: 'b2', optionC: 'c2', optionD: 'd2', correctAnswer: 'C' },
  { text: `Q3 ${tag}`, optionA: 'a3', optionB: 'b3', optionC: 'c3', optionD: 'd3', correctAnswer: 'B' },
];

async function main() {
  console.log(`\n=== E2E b4 — personal-library name rule ===\nBASE=${BASE}\n`);

  // 0. app is up
  const home = await fetch(BASE);
  ok(home.status === 200, 'GET / → 200');

  const A = await register('alice');
  const B = await register('bob');
  ok(true, 'registered 2 users (alice/bob)');

  // 1. alice creates a from-scratch PUBLIC test
  const title = `B4 dedup ${STAMP}`;
  const created = await req('POST', '/api/tests', {
    session: A,
    body: { title, description: 'trunk', topic: 'Chemistry', isPublic: true, tags: [`b4-${STAMP}`], questions: QUESTIONS('trunk') },
  });
  ok(created.status === 201 && created.json?.id, 'alice creates a from-scratch public test');
  const trunkId = created.json.id;

  // 2. bob bookmarks it — the pinned original sits in his library
  const bm = await req('POST', '/api/bookmarks', { session: B, body: { testId: trunkId } });
  ok(bm.status === 200 && bm.json?.bookmarked === true, 'bob bookmarks the original');
  const bmList = await req('GET', '/api/bookmarks', { session: B });
  ok((bmList.json?.ids || []).includes(trunkId), 'bookmark list contains the original');
  const mine0 = await req('GET', '/api/feed?scope=mine&limit=50', { session: B });
  ok((mine0.json?.items || []).some(t => t.id === trunkId), 'pinned original visible in the personal library');

  // 3. bob edits the original → copy keeps the EXACT source name + auto-pin
  const copy1 = await req('POST', `/api/tests/${trunkId}/copy`, { session: B });
  ok(copy1.status === 200 && copy1.json?.id, 'bob "Edit" → copy created');
  const v1 = copy1.json.id;
  ok(copy1.json.title === title, `copy keeps the source's exact name ("${copy1.json.title}")`, `got "${copy1.json.title}"`);
  ok(copy1.json.parentId === trunkId, 'copy is a version of the source');
  const bmList1 = await req('GET', '/api/bookmarks', { session: B });
  ok((bmList1.json?.ids || []).includes(v1), 'copy is AUTO-BOOKMARKED (закреплено without user action)');

  // 4. the library shows ONE card per name — the modified copy, not the pair
  const mine1 = await req('GET', '/api/feed?scope=mine&limit=50', { session: B });
  const sameName1 = (mine1.json?.items || []).filter(t => t.title === title);
  ok(sameName1.length === 1, 'library holds exactly ONE test with that name', `got ${sameName1.length}`);
  ok(sameName1[0]?.id === v1, 'the surviving card is the MODIFIED copy');
  ok(!(mine1.json?.items || []).some(t => t.id === trunkId), 'the pinned original is gone from the library');

  // 5. a second copy of the same source displaces the first (newest own wins)
  const copy2 = await req('POST', `/api/tests/${trunkId}/copy`, { session: B });
  ok(copy2.status === 200 && copy2.json?.id && copy2.json.title === title, 'second copy keeps the same exact name');
  const v2 = copy2.json.id;
  const mine2 = await req('GET', '/api/feed?scope=mine&limit=50', { session: B });
  const sameName2 = (mine2.json?.items || []).filter(t => t.title === title);
  ok(sameName2.length === 1 && sameName2[0]?.id === v2, 'library still holds ONE card — the newest copy');
  ok(!(mine2.json?.items || []).some(t => t.id === v1), 'the older copy dropped out of the library');

  // 6. deleting the newest copy resurfaces the previous one (self-healing)
  const del2 = await req('DELETE', `/api/tests/${v2}`, { session: B });
  ok(del2.status === 200, 'bob deletes the newest copy');
  const mine3 = await req('GET', '/api/feed?scope=mine&limit=50', { session: B });
  const sameName3 = (mine3.json?.items || []).filter(t => t.title === title);
  ok(sameName3.length === 1 && sameName3[0]?.id === v1, 'previous copy resurfaces after the delete');

  // 7. deleting the last copy resurfaces the pinned original
  const del1 = await req('DELETE', `/api/tests/${v1}`, { session: B });
  ok(del1.status === 200, 'bob deletes the last copy');
  const mine4 = await req('GET', '/api/feed?scope=mine&limit=50', { session: B });
  const sameName4 = (mine4.json?.items || []).filter(t => t.title === title);
  ok(sameName4.length === 1 && sameName4[0]?.id === trunkId, 'the pinned original resurfaces (bookmark healed)');

  // ---- cleanup ----
  console.log('\ncleanup:');
  const d = await req('DELETE', `/api/tests/${trunkId}`, { session: A });
  console.log(`  delete test ${trunkId}: ${d.status}`);
  for (const [nm, sess] of [['alice', A], ['bob', B]]) {
    const r = await req('DELETE', '/api/me', { session: sess });
    console.log(`  delete account ${nm}: ${r.status}`);
  }

  console.log(`\n=== RESULT: ${passed} passed, ${failed} failed ===`);
  if (failed) { console.log('FAILED:', fails.join(' | ')); process.exit(1); }
}

main().catch(e => { console.error('E2E crashed:', e); process.exit(2); });
