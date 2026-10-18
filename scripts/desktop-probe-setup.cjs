// Desktop UI probe setup: one account + 8 public tests (variety of titles)
const BASE = process.env.BASE || 'http://127.0.0.1:3100';

async function j(method, path, body, cookie) {
  const r = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await r.text();
  let data; try { data = JSON.parse(text); } catch { data = text; }
  return { status: r.status, data, setCookie: r.headers.getSetCookie ? r.headers.getSetCookie() : [] };
}

(async () => {
  const email = `deskprobe_${Date.now()}@test.local`;
  const name = 'Desktop Probe';
  const reg = await j('POST', '/api/auth/register', { email, password: 'pass1234', name });
  if (reg.status !== 200 && reg.status !== 201) { console.error('register failed', reg.status, reg.data); process.exit(1); }
  const cookie = (reg.setCookie.find(c => c.startsWith('uuu_session=')) || '').split(';')[0];
  console.log('EMAIL=' + email);
  console.log('COOKIE=' + cookie);
  const topics = ['organic', 'inorganic', 'biochem', 'physical', 'analytic'];
  for (let i = 1; i <= 8; i++) {
    const qs = Array.from({ length: 4 }, (_, k) => ({
      text: `Вопрос ${i}.${k + 1}: что из перечисленного верно?`,
      optionA: 'Первый вариант', optionB: 'Второй вариант', optionC: 'Третий вариант', optionD: 'Четвёртый вариант',
      correctAnswer: k % 2 === 0 ? 'B' : 'C',
    }));
    const t = await j('POST', '/api/tests', { title: `Химия тест №${i}`, description: `Пробный тест для десктопа №${i}`, topic: topics[i % topics.length], tags: [`тест${i}`], questions: qs, isPublic: true }, cookie);
    console.log(`test ${i}: ${t.status}`);
  }
})().catch(e => { console.error(e); process.exit(1); });
