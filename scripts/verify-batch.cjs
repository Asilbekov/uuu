// Verify all 303 questions - runs as background process
const fs = require('fs');
const https = require('https');
const questions = JSON.parse(fs.readFileSync('/home/z/my-project/upload/Question.json', 'utf8'));
const BATCH = 5;
const results = [];
const wrong = [];

async function verify(batch) {
  const prompt = batch.map((q, i) => {
    const opts = [];
    if (q.optionA) opts.push('A) ' + q.optionA);
    if (q.optionB) opts.push('B) ' + q.optionB);
    if (q.optionC) opts.push('C) ' + q.optionC);
    if (q.optionD) opts.push('D) ' + q.optionD);
    if (q.optionE) opts.push('E) ' + q.optionE);
    return 'Q' + (i+1) + ' [ANS:' + q.correctAnswer + ']: ' + q.text + '\nOpts: ' + opts.join(', ');
  }).join('\n\n');

  const r = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 8kXyiDpFhhbHjgUC2XtmtfURwODaeWMl',
    },
    body: JSON.stringify({
      model: 'mistral-small-latest',
      messages: [
        { role: 'system', content: 'Verify university exam answers. If the marked answer is correct: Q1:OK. If wrong: Q1:FIX→X (X=correct letter).' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.1,
      max_tokens: 500,
    }),
  });
  const d = await r.json();
  const text = d.choices[0]?.message?.content || '';
  
  for (const line of text.split('\n')) {
    const m = line.match(/Q(\d+)\s*:\s*(OK|FIX)\s*→?\s*([A-E])?/i);
    if (m) {
      const idx = parseInt(m[1]) - 1;
      if (idx >= 0 && idx < batch.length) {
        const ok = m[2].toUpperCase() === 'OK';
        results.push({ id: batch[idx].id, current: batch[idx].correctAnswer, ok, fix: ok ? batch[idx].correctAnswer : (m[3] || '?') });
        if (!ok) wrong.push({ id: batch[idx].id, current: batch[idx].correctAnswer, fix: m[3] || '?' });
      }
    }
  }
}

(async () => {
  const total = Math.ceil(questions.length / BATCH);
  for (let i = 0; i < questions.length; i += BATCH) {
    const b = questions.slice(i, i + BATCH);
    const bn = Math.floor(i / BATCH) + 1;
    try {
      await verify(b);
      process.stdout.write(bn + '/' + total + ' ');
    } catch(e) {
      process.stdout.write('E' + bn + ' ');
      await new Promise(r => setTimeout(r, 5000));
      try { await verify(b); } catch(e2) { process.stdout.write('EE' + bn + ' '); }
    }
    if (i + BATCH < questions.length) await new Promise(r => setTimeout(r, 1500));
  }
  
  console.log('\nParsed: ' + results.length + '/' + questions.length);
  console.log('Correct: ' + results.filter(r => r.ok).length);
  console.log('Wrong: ' + wrong.length);
  if (wrong.length) {
    console.log('\n=== FIXES ===');
    wrong.forEach(w => console.log(w.id + ': ' + w.current + '→' + w.fix));
  }
  fs.writeFileSync('/tmp/verify_results.json', JSON.stringify({ results, wrong }, null, 2));
})().catch(e => console.error(e));
