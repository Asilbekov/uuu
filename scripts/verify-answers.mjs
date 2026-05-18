// Faster verification - one test at a time, smaller batches, shorter timeout
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const MISTRAL_API_KEY = '8kXyiDpFhhbHjgUC2XtmtfURwODaeWMl';
const MISTRAL_BASE_URL = 'https://api.mistral.ai/v1';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const questions = JSON.parse(fs.readFileSync(path.join(__dirname, '../upload/Question.json'), 'utf8'));

const BATCH_SIZE = 5;
const DELAY_MS = 2000;

async function verifyBatch(batch) {
  const questionsText = batch.map((q, i) => {
    const opts = [];
    if (q.optionA) opts.push(`A) ${q.optionA}`);
    if (q.optionB) opts.push(`B) ${q.optionB}`);
    if (q.optionC) opts.push(`C) ${q.optionC}`);
    if (q.optionD) opts.push(`D) ${q.optionD}`);
    if (q.optionE) opts.push(`E) ${q.optionE}`);
    return `Q${i+1} [ANS:${q.correctAnswer}]: ${q.text}\nOpts: ${opts.join(', ')}`;
  }).join('\n\n');

  const response = await fetch(`${MISTRAL_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'mistral-small-latest',
      messages: [
        { role: 'system', content: 'Verify university exam answers. For each: if correct say "Q1: OK", if wrong say "Q1: FIX→X" where X is correct letter.' },
        { role: 'user', content: questionsText },
      ],
      temperature: 0.1,
      max_tokens: 500,
    }),
  });

  if (!response.ok) throw new Error(`API ${response.status}`);
  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

function parseResults(text, batch) {
  const results = [];
  for (const line of text.split('\n')) {
    const m = line.match(/Q(\d+)\s*:\s*(OK|FIX)\s*→?\s*([A-E])?/i);
    if (m) {
      const idx = parseInt(m[1]) - 1;
      if (idx >= 0 && idx < batch.length) {
        const ok = m[2].toUpperCase() === 'OK';
        results.push({
          id: batch[idx].id,
          current: batch[idx].correctAnswer,
          ok,
          fix: ok ? batch[idx].correctAnswer : (m[3] || '?'),
        });
      }
    }
  }
  return results;
}

async function main() {
  const batches = [];
  for (let i = 0; i < questions.length; i += BATCH_SIZE) {
    batches.push(questions.slice(i, i + BATCH_SIZE));
  }
  console.log(`Questions: ${questions.length}, Batches: ${batches.length}\n`);

  const all = [];
  const wrong = [];

  for (let i = 0; i < batches.length; i++) {
    process.stdout.write(`${i+1}/${batches.length} `);
    try {
      const text = await verifyBatch(batches[i]);
      const res = parseResults(text, batches[i]);
      const w = res.filter(r => !r.ok);
      all.push(...res);
      wrong.push(...w);
      if (w.length) process.stdout.write(`❌${w.length} `);
    } catch (e) {
      process.stdout.write(`ERR `);
      await new Promise(r => setTimeout(r, 5000));
    }
    if (i < batches.length - 1) await new Promise(r => setTimeout(r, DELAY_MS));
  }

  console.log(`\n\nParsed: ${all.length}/${questions.length}`);
  console.log(`Correct: ${all.filter(r => r.ok).length}`);
  console.log(`Wrong: ${wrong.length}`);

  if (wrong.length) {
    console.log('\n=== FIXES NEEDED ===');
    for (const w of wrong) {
      console.log(`${w.id}: ${w.current} → ${w.fix}`);
    }
  }

  fs.writeFileSync('/tmp/verify_results.json', JSON.stringify({ all, wrong }, null, 2));
}

main().catch(console.error);
