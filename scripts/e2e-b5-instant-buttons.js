// E2E b5 — "instant buttons" API foundation:
// the PUT /api/tests/[id] and POST /api/tests payloads MUST be FULL tests
// (questions + attachments + creator) — handleSaveTest mirrors them straight
// into the client caches without a second GET (the instant-save fix).
// Also verifies shareTest flip + bookmark add/remove round-trips.
const BASE = process.env.BASE || 'http://127.0.0.1:3100';
const stamp = 'b5' + Math.random().toString(36).slice(2, 9);
let pass = 0, fail = 0;
const ok = (cond, name) => { if (cond) { pass++; console.log('  ✅ ' + name); } else { fail++; console.log('  ❌ ' + name); } };
const j = (r) => r.json();

async function main() {
  const email = `${stamp}@uuu-b5.kz`;
  const reg = await fetch(`${BASE}/api/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, name: 'B5 ' + stamp, password: 'b5-password-123' }) });
  const cookie = (reg.headers.get('set-cookie') || '').split(';')[0];
  const H = { 'Content-Type': 'application/json', Cookie: cookie };

  // --- POST /api/tests returns a FULL test ---------------------------------
  const created = await j(await fetch(`${BASE}/api/tests`, { method: 'POST', headers: H, body: JSON.stringify({
    title: 'B5 instant ' + stamp, description: 'd', tags: ['b5'], isPublic: true,
    questions: [{ text: 'Q1', optionA: 'a', optionB: 'b', optionC: 'c', optionD: 'd', correctAnswer: 'A' }],
    attachments: [{ title: 'f1', type: 'link', url: 'https://example.com/x.pdf', orderNum: 0 }],
  }) }));
  ok(created?.id, 'POST /tests returns id');
  ok(Array.isArray(created?.questions) && created.questions.length === 1, 'POST payload carries questions');
  ok(Array.isArray(created?.attachments) && created.attachments.length === 1, 'POST payload carries attachments');
  ok(!!created?.creator?.id, 'POST payload carries creator');

  // --- PUT /api/tests/[id] returns a FULL test ------------------------------
  const updated = await j(await fetch(`${BASE}/api/tests/${created.id}`, { method: 'PUT', headers: H, body: JSON.stringify({
    title: 'B5 instant v2 ' + stamp, description: 'd2', tags: ['b5'], isPublic: true,
    questions: [{ text: 'Q1 edited', optionA: 'a', optionB: 'b', optionC: 'c', optionD: 'd', correctAnswer: 'B' }],
    attachments: [{ title: 'f1', type: 'link', url: 'https://example.com/x.pdf', orderNum: 0 }, { title: 'f2', type: 'link', url: 'https://example.com/y.mp3', orderNum: 1 }],
  }) }));
  ok(updated?.id === created.id, 'PUT /tests returns id');
  ok(updated?.title === 'B5 instant v2 ' + stamp, 'PUT payload has the NEW title (no reload needed)');
  ok(Array.isArray(updated?.questions) && updated.questions[0]?.text === 'Q1 edited', 'PUT payload carries fresh questions');
  ok(Array.isArray(updated?.attachments) && updated.attachments.length === 2, 'PUT payload carries fresh attachments');
  ok(!!updated?.creator?.id, 'PUT payload carries creator');

  // --- shareTest flip round-trip --------------------------------------------
  const flipped = await j(await fetch(`${BASE}/api/tests/${created.id}/share`, { method: 'POST', headers: H, body: JSON.stringify({ scope: 'community' }) }));
  ok(typeof flipped?.isPublic === 'boolean', 'shareTest returns isPublic boolean (patchable)');
  const flippedBack = await j(await fetch(`${BASE}/api/tests/${created.id}/share`, { method: 'POST', headers: H, body: JSON.stringify({ scope: 'link' }) }));
  ok(flippedBack?.isPublic === false, 'shareTest flips back (link-only)');

  // --- bookmark round-trip (optimistic-toggle backend) ----------------------
  await fetch(`${BASE}/api/bookmarks`, { method: 'POST', headers: H, body: JSON.stringify({ testId: created.id }) });
  const bm1 = (await j(await fetch(`${BASE}/api/bookmarks`, { headers: H }))).ids;
  ok(bm1.includes(created.id), 'bookmark add lands');
  await fetch(`${BASE}/api/bookmarks?testId=${created.id}`, { method: 'DELETE', headers: H });
  const bm2 = (await j(await fetch(`${BASE}/api/bookmarks`, { headers: H }))).ids;
  ok(!bm2.includes(created.id), 'bookmark remove lands');

  // cleanup
  await fetch(`${BASE}/api/tests/${created.id}`, { method: 'DELETE', headers: H });
  const del = await fetch(`${BASE}/api/me`, { method: 'DELETE', headers: H });
  ok(del.status === 200 || del.status === 204, 'cleanup: account deleted');

  console.log(`\n=== RESULT: ${pass} passed, ${fail} failed ===`);
  process.exit(fail ? 1 : 0);
}
main().catch(e => { console.error('FATAL', e); process.exit(1); });
