#!/usr/bin/env node
/**
 * Use Mistral AI to find correct answers for 12 Physics Final questions
 * that didn't have answers in the PDF
 */

const MISTRAL_API_KEY = '8kXyiDpFhhbHjgUC2XtmtfURwODaeWMl';
const MISTRAL_URL = 'https://api.mistral.ai/v1/chat/completions';
const DB_URL = 'postgresql://neondb_owner:npg_omga5szZAf4l@ep-shiny-paper-aousfq8l-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

async function callMistral(prompt) {
  const response = await fetch(MISTRAL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'mistral-small-latest',
      messages: [
        { role: 'system', content: 'You are a university physics professor. For each multiple choice question, determine the correct answer with brief reasoning. Output ONLY a JSON array: [{"idx": N, "answer": "A/B/C/D", "reason": "brief"}]. No other text.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Mistral error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

async function main() {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient({ datasources: { db: { url: DB_URL } } });

  // Get the Physics Final test
  const test = await prisma.test.findFirst({ where: { title: 'Physics: Final' } });
  if (!test) { console.log('Test not found'); return; }

  // Questions without proper answers (correctAnswer = 'A' but should be verified)
  // From the PDF extraction, these question numbers had null correct answers:
  const missingAnswerNums = [3, 5, 8, 14, 25, 31, 48, 119, 151, 172, 192, 193];

  const questions = await prisma.question.findMany({
    where: { testId: test.id },
    orderBy: { orderNum: 'asc' }
  });

  console.log(`Total questions in test: ${questions.length}`);

  // Build prompts for questions with missing answers
  const questionMap = {};
  questions.forEach(q => { questionMap[q.orderNum] = q; });

  const toVerify = missingAnswerNums.filter(n => questionMap[n]);
  console.log(`Questions to verify: ${toVerify.join(', ')}`);

  // Build prompt batches
  const batchSize = 4;
  const allAnswers = {};

  for (let i = 0; i < toVerify.length; i += batchSize) {
    const batch = toVerify.slice(i, i + batchSize);
    const prompt = batch.map(num => {
      const q = questionMap[num];
      const options = [];
      if (q.optionA) options.push(`A) ${q.optionA}`);
      if (q.optionB) options.push(`B) ${q.optionB}`);
      if (q.optionC) options.push(`C) ${q.optionC}`);
      if (q.optionD) options.push(`D) ${q.optionD}`);
      if (q.optionE) options.push(`E) ${q.optionE}`);
      return `Q${num}: ${q.text}\nOptions:\n${options.join('\n')}`;
    }).join('\n\n');

    console.log(`\nBatch: Q${batch.join(', Q')}`);

    try {
      const response = await callMistral(prompt);
      console.log('Response:', response.slice(0, 400));

      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          const answers = JSON.parse(jsonMatch[0]);
          answers.forEach(a => {
            if (a.idx && a.answer) {
              allAnswers[a.idx] = { answer: a.answer.toUpperCase(), reason: a.reason || '' };
            }
          });
        } catch (e) {
          // Try line-by-line
          const lines = response.split('\n');
          lines.forEach(line => {
            const match = line.match(/Q?(\d+)[:).]\s*([A-E])/i);
            if (match) {
              allAnswers[parseInt(match[1])] = { answer: match[2].toUpperCase(), reason: '' };
            }
          });
        }
      }

      await new Promise(r => setTimeout(r, 1500));
    } catch (error) {
      console.error('Error:', error.message?.slice(0, 200));
    }
  }

  console.log('\n=== UPDATING ANSWERS ===');
  let updated = 0;

  for (const [idx, data] of Object.entries(allAnswers)) {
    const num = parseInt(idx);
    const q = questionMap[num];
    if (q && data.answer && ['A', 'B', 'C', 'D', 'E'].includes(data.answer)) {
      const oldAnswer = q.correctAnswer;
      await prisma.question.update({
        where: { id: q.id },
        data: { correctAnswer: data.answer }
      });
      console.log(`Q${num}: "${oldAnswer}" → "${data.answer}" | ${data.reason}`);
      updated++;
    }
  }

  console.log(`\nUpdated ${updated} questions`);

  // Also clean up suspiciously long options (solution fragments)
  console.log('\n=== CLEANING LONG OPTIONS ===');
  let cleaned = 0;

  for (const q of questions) {
    let changed = false;
    const updates = {};

    for (const opt of ['optionA', 'optionB', 'optionC', 'optionD', 'optionE']) {
      const val = q[opt];
      if (!val || val === '') continue;

      // Find where solution text starts
      const stopPatterns = [
        /Use (conservation|the angular|torque|angular impulse)/i,
        /Apply conservation/i,
        /From the conservation/i,
        /Formula for/i,
        /Key points:/i,
        /Concept —/i,
        /Correct interpretation:/i,
        /Isothermal process:/i,
        /By definition, a con/i,
        /The second law of thermodyn/i,
        /While floating,/i,
        /Only the mass/i,
        /As the temperature drops/i,
        /\(cid:/i,
        /deals with the relationship/i,
        /In a thermodynamic cycle/i,
        /Angular velocity ω/i,
        /The mass and radius/i,
        /It depends,/i,
        /the efficiency of a Carnot/i,
        /the vector angular momentum/i,
      ];

      let cutAt = val.length;
      for (const pattern of stopPatterns) {
        const match = val.match(pattern);
        if (match && match.index > 5 && match.index < cutAt) {
          cutAt = match.index;
        }
      }

      if (cutAt < val.length) {
        const cleanedText = val.slice(0, cutAt).trim().replace(/\s+$/, '');
        if (cleanedText.length > 0 && cleanedText !== val) {
          updates[opt] = cleanedText;
          changed = true;
        }
      }

      // Also remove (cid:XX) artifacts
      if (val.includes('(cid:')) {
        updates[opt] = (updates[opt] || val).replace(/\(cid:\d+\)/g, '').trim();
        changed = true;
      }
    }

    if (changed) {
      await prisma.question.update({ where: { id: q.id }, data: updates });
      cleaned++;
    }
  }

  console.log(`Cleaned ${cleaned} questions`);

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
