// Minimal repro: create → copy → save with 1 changed question
const BASE = process.env.BASE || 'http://localhost:3100';
const STAMP = 'probe' + Date.now().toString(36);

function jar() { let c = ''; return { capture(r) { const sc = r.headers.getSetCookie ? r.headers.getSetCookie() : [r.headers.get('set-cookie')].filter(Boolean); for (const x of sc) { const p = x.split(';')[0]; if (p.startsWith('uuu_session=')) c = p; } }, header() { return c; } }; }
async function req(m, p, { session, body } = {}) {
  const r = await fetch(BASE + p, { method: m, headers: { 'Content-Type': 'application/json', ...(session ? { Cookie: session.header() } : {}) }, body: body ? JSON.stringify(body) : undefined });
  session && session.capture(r);
  let j = null; try { j = await r.json(); } catch {}
  return { status: r.status, json: j };
}
(async () => {
  const s = jar();
  await req('POST', '/api/auth/register', { session: s, body: { email: `${STAMP}@t.test`, name: 'P', password: 'e2e-pass-123' } });
  const t = await req('POST', '/api/tests', { session: s, body: { title: `probe ${STAMP}`, isPublic: false, tags: [], questions: [
    { text: 'Q1 trunk', optionA: 'a1', optionB: 'b1', optionC: 'c1', optionD: 'd1', correctAnswer: 'A' },
    { text: 'Q2 trunk', optionA: 'a2', optionB: 'b2', optionC: 'c2', optionD: 'd2', correctAnswer: 'C' },
    { text: 'Q3 trunk', optionA: 'a3', optionB: 'b3', optionC: 'c3', optionD: 'd3', correctAnswer: 'B' },
  ] } });
  console.log('create:', t.status);
  const copy = await req('POST', `/api/tests/${t.json.id}/copy`, { session: s });
  console.log('copy:', copy.status, 'parentId=', copy.json?.parentId);
  const save1 = await req('PUT', `/api/tests/${copy.json.id}`, { session: s, body: {
    title: copy.json.title, isPublic: false, randomizeQuestions: false, randomizeOptions: false,
    questions: [
      { text: 'Q1 EDITED', optionA: 'a1', optionB: 'b1', optionC: 'c1', optionD: 'd1', correctAnswer: 'A' },
      { text: 'Q2 trunk', optionA: 'a2', optionB: 'b2', optionC: 'c2', optionD: 'd2', correctAnswer: 'C' },
      { text: 'Q3 trunk', optionA: 'a3', optionB: 'b3', optionC: 'c3', optionD: 'd3', correctAnswer: 'B' },
    ],
  } });
  console.log('save-1-change:', save1.status, JSON.stringify(save1.json?.error || 'OK'));
  // cleanup
  await req('DELETE', `/api/tests/${t.json.id}`, { session: s });
  await req('DELETE', `/api/tests/${copy.json.id}`, { session: s });
  await req('DELETE', '/api/me', { session: s });
})();
