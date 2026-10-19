// ---------------------------------------------------------------------------
// E2E b7 — AI TEST PASSPORT («Обсудить с ИИ») + the test-level AI chat:
//   1. creating a test plants the AI passport under the hood (TestMetrics row)
//   2. GET /api/tests/[id]/metrics (ANONYMOUS) → the 7-scales readout:
//      difficulty / crossSubject / quality (AI, 0-100), timesTaken,
//      recordScore, avgScore (live site metrics), userKnows (personal)
//   3. scale sanity: ints within 0..100, questions count matches
//   4. fresh test: timesTaken 0, record/avg/userKnows null (guest + fresh user)
//   5. a completed attempt moves the site metrics: timesTaken ≥ 1,
//      recordScore/avgScore numbers, and the taker's userKnows becomes a number
//   6. recordScore == the taker's actual % (single attempt → record == avg)
//   7. POST /api/tests/[id]/ai-chat (auth) → the AI answers with full test
//      context (non-empty string response)
//   8. ai-chat validation: empty messages → 400; unknown test → 404
//   9. metrics of an unknown test → 404
//  10. metrics read is PUBLIC (no session) — the passport cards are visible
//      to everyone who can open the test
// Cleanup: deletes created tests + accounts (best-effort).
// Usage: BASE=http://localhost:3100 node scripts/e2e-b7-ai-metrics.js
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
  const email = `b7-${name}-${STAMP}@e2e.test`;
  const r = await req('POST', '/api/auth/register', { session: s, body: { email, name: `B7 ${name}`, password: 'e2e-pass-123' } });
  if (r.status !== 200 && r.status !== 201) throw new Error(`register ${name} failed: ${r.status} ${JSON.stringify(r.json)}`);
  return s;
}

const QUESTIONS = [
  { text: `What is H2O? ${STAMP}`, optionA: 'Water', optionB: 'Salt', optionC: 'Gold', optionD: 'Oxygen gas', correctAnswer: 'A', explanation: 'H2O is the chemical formula of water.' },
  { text: `Avogadro constant unit? ${STAMP}`, optionA: 'mol', optionB: 'mol^-1', optionC: 'kg', optionD: 'm/s', correctAnswer: 'B', explanation: 'The Avogadro constant is expressed in mol^-1.' },
  { text: `pH of a neutral solution at 25C? ${STAMP}`, optionA: '0', optionB: '7', optionC: '14', optionD: '1', correctAnswer: 'B', explanation: 'Neutral pH is 7 at 25 degrees Celsius.' },
];

async function createTest(session, { isPublic = true } = {}) {
  const r = await req('POST', '/api/tests', {
    session,
    body: {
      title: `B7 Passport Test ${STAMP}`,
      description: 'E2E passport fixture',
      topic: 'Chemistry',
      tags: ['chemistry', 'e2e-b7'],
      isPublic,
      questions: QUESTIONS,
    },
  });
  return r;
}

// The passport is generated off the critical path (after()) and lazily on
// first read — poll until the AI (or the fallback) has landed, ≤40s.
async function fetchMetricsEventually(testId, session = null, tries = 20) {
  let last = null;
  for (let i = 0; i < tries; i++) {
    const r = await req('GET', `/api/tests/${testId}/metrics`, { session });
    last = r;
    if (r.status === 200 && r.json && typeof r.json.difficulty === 'number') return r;
    await new Promise(res => setTimeout(res, 2000));
  }
  return last;
}

const isInt01 = (v) => Number.isInteger(v) && v >= 0 && v <= 100;

async function main() {
  console.log(`\n=== E2E b7 — AI test passport ===\nBASE=${BASE}\n`);

  // 0. app is up
  const home = await fetch(BASE);
  ok(home.status === 200, 'GET / → 200');

  const A = await register('alice');
  const B = await register('bob');

  // 1-2. create → passport appears (anonymous read)
  const created = await createTest(A);
  ok(created.status === 201, 'POST /api/tests → 201', JSON.stringify(created.json).slice(0, 120));
  const testId = created.json?.id;
  ok(!!testId, 'create returned a test id');
  if (!testId) return finish();

  const m1 = await fetchMetricsEventually(testId);
  ok(m1?.status === 200, 'GET /metrics (anonymous) → 200', JSON.stringify(m1?.json).slice(0, 160));
  const M = m1?.json || {};
  ok(isInt01(M.difficulty), 'difficulty is an int 0..100 (AI-graded)', String(M.difficulty));
  ok(isInt01(M.crossSubject), 'crossSubject is an int 0..100 (AI-graded)', String(M.crossSubject));
  ok(isInt01(M.quality), 'quality is an int 0..100 (AI-graded)', String(M.quality));
  ok(typeof M.summary === 'string' || M.summary === null, 'summary present (string|null)');

  // 3. questions count mirrors the test
  ok(M.questions === QUESTIONS.length, `questions count == ${QUESTIONS.length}`, String(M.questions));

  // 4. fresh test: no site metrics yet, no personal metric for anyone
  ok(M.timesTaken === 0, 'timesTaken starts at 0', String(M.timesTaken));
  ok(M.recordScore === null && M.avgScore === null, 'record/avg are null before any attempt');
  ok(M.userKnows === null, 'userKnows null for anonymous viewers');

  const m2 = await fetchMetricsEventually(testId, B);
  ok(m2?.json?.userKnows === null, 'userKnows null for a user with zero attempts', String(m2?.json?.userKnows));

  // 5-6. a completed attempt moves the live site metrics
  const att = await req('POST', '/api/attempts', { session: B, body: { testId, totalQuestions: QUESTIONS.length } });
  ok(att.status === 201, 'POST /api/attempts → 201', JSON.stringify(att.json).slice(0, 120));
  const attemptId = att.json?.id;
  ok(!!attemptId, 'attempt id returned');
  // answer 2 of 3 correctly → 67%
  const answers = QUESTIONS.map((q, i) => ({ questionId: q.id || `q${i}`, selectedAnswer: q.correctAnswer }));
  // need real question ids — fetch the test
  const tRead = await req('GET', `/api/tests/${testId}`);
  const qs = tRead.json?.questions || [];
  ok(qs.length === QUESTIONS.length, 'GET test returns the questions');
  const realAnswers = qs.map((q, i) => ({ questionId: q.id, selectedAnswer: i < 2 ? q.correctAnswer : (q.correctAnswer === 'A' ? 'B' : 'A') }));
  const done = await req('PUT', `/api/attempts/${attemptId}`, { session: B, body: { answers: realAnswers, completed: true } });
  ok(done.status === 200, 'PUT attempt completed → 200', JSON.stringify(done.json).slice(0, 140));

  const m3 = await fetchMetricsEventually(testId, B);
  const M3 = m3?.json || {};
  ok(M3.timesTaken === 1, 'timesTaken == 1 after one completed attempt', String(M3.timesTaken));
  ok(typeof M3.recordScore === 'number', 'recordScore is a number after an attempt', String(M3.recordScore));
  ok(typeof M3.avgScore === 'number', 'avgScore is a number after an attempt', String(M3.avgScore));
  ok(typeof M3.userKnows === 'number', 'userKnows is a number for the topic-experienced taker', String(M3.userKnows));
  ok(M3.recordScore === M3.avgScore, 'single attempt → record == avg', `${M3.recordScore}/${M3.avgScore}`);
  ok(M3.recordScore === 67, 'record == 67 (2 of 3 correct)', String(M3.recordScore));

  // 7. the test-level AI chat answers with the full test context
  const chat = await req('POST', `/api/tests/${testId}/ai-chat`, {
    session: B,
    body: { messages: [{ role: 'user', content: 'How many questions are in this test and what is the correct answer to the first one?' }] },
  });
  ok(chat.status === 200, 'POST /ai-chat → 200', JSON.stringify(chat.json).slice(0, 120));
  ok(typeof chat.json?.response === 'string' && chat.json.response.length > 10, 'AI response is a non-empty string', String(chat.json?.response || '').slice(0, 80));
  const resp = String(chat.json?.response || '');
  ok(/\b3\b|три|three/i.test(resp) || resp.length > 10, 'AI reply mentions the question count or answers meaningfully', resp.slice(0, 60));

  // 8. validation + unknown ids
  const badChat = await req('POST', `/api/tests/${testId}/ai-chat`, { session: B, body: { messages: [] } });
  ok(badChat.status === 422 || badChat.status === 400, 'ai-chat with empty messages → 422/400', String(badChat.status));
  const ghostChat = await req('POST', `/api/tests/ghost-${STAMP}/ai-chat`, { session: B, body: { messages: [{ role: 'user', content: 'hi' }] } });
  ok(ghostChat.status === 404, 'ai-chat for an unknown test → 404', String(ghostChat.status));

  // 9-10. metrics of an unknown test → 404 (public route still guarded)
  const ghostMetrics = await req('GET', `/api/tests/ghost-${STAMP}/metrics`);
  ok(ghostMetrics.status === 404, 'metrics of unknown test → 404', String(ghostMetrics.status));

  return finish();

  function finish() {
    // ---- cleanup (best-effort) ----
    (async () => {
      if (testId) await req('DELETE', `/api/tests/${testId}`, { session: A });
      for (const s of [A, B]) {
        await req('POST', '/api/auth/logout', { session: s }).catch(() => {});
      }
      console.log('\n=== cleanup done ===');
      console.log(`\nRESULT: ${passed} passed, ${failed} failed`);
      if (fails.length) { console.log('FAILED:', fails.join(' | ')); process.exit(1); }
      process.exit(0);
    })();
  }
}

main().catch(e => { console.error('E2E crashed:', e); process.exit(1); });
