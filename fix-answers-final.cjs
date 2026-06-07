#!/usr/bin/env node
/**
 * Fix remaining answer discrepancies found during verification
 * Uses Mistral AI with more detailed reasoning
 */

const MISTRAL_API_KEY = '8kXyiDpFhhbHjgUC2XtmtfURwODaeWMl';
const MISTRAL_URL = 'https://api.mistral.ai/v1/chat/completions';
const DB_URL = 'postgresql://neondb_owner:npg_omga5szZAf4l@ep-shiny-paper-aousfq8l-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const TEST_ID = 'cmpwhq4wx0001p29fozc6m8v3';

// Questions where verification found discrepancies (DB answer != Mistral answer)
const DISCREPANT_INDICES = [7, 10, 13, 15, 16, 19, 24, 25, 27, 28, 29, 31, 34, 36, 37, 39];

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
        { role: 'system', content: 'You are a university-level physics professor. For each multiple choice physics question, determine the CORRECT answer through careful analysis. Show your reasoning briefly, then give the answer letter. Output a JSON array: [{"idx": 1, "answer": "A", "reason": "brief explanation"}]. Be very careful with calculations.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 3000,
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

  const questions = await prisma.question.findMany({
    where: { testId: TEST_ID },
    orderBy: { orderNum: 'asc' }
  });

  // Build prompt for discrepant questions
  const questionTexts = DISCREPANT_INDICES.map(idx => {
    const q = questions[idx - 1];
    if (!q) return null;
    const options = [];
    if (q.optionA) options.push(`A) ${q.optionA}`);
    if (q.optionB) options.push(`B) ${q.optionB}`);
    if (q.optionC) options.push(`C) ${q.optionC}`);
    if (q.optionD) options.push(`D) ${q.optionD}`);
    if (q.optionE) options.push(`E) ${q.optionE}`);
    return `Q${idx}: ${q.text}\nOptions:\n${options.join('\n')}`;
  }).filter(Boolean);

  // Process in batches of 4 for detailed reasoning
  const BATCH_SIZE = 4;
  const allAnswers = {};

  for (let i = 0; i < questionTexts.length; i += BATCH_SIZE) {
    const batch = questionTexts.slice(i, i + BATCH_SIZE);
    const batchIndices = DISCREPANT_INDICES.slice(i, i + BATCH_SIZE);

    console.log(`\nBatch: Q${batchIndices.join(', Q')}`);
    console.log('---');

    try {
      const response = await callMistral(batch.join('\n\n'));
      console.log(response.slice(0, 500));

      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          const answers = JSON.parse(jsonMatch[0]);
          answers.forEach(a => {
            allAnswers[a.idx] = { answer: a.answer, reason: a.reason };
          });
        } catch (e) {
          console.log('JSON parse error, trying line-by-line...');
        }
      }

      await new Promise(r => setTimeout(r, 1500));
    } catch (error) {
      console.error('Error:', error.message?.slice(0, 200));
    }
  }

  console.log('\n\n=== FINAL ANSWERS ===');
  let updated = 0;

  for (const [idx, data] of Object.entries(allAnswers)) {
    const q = questions[parseInt(idx) - 1];
    const answer = data.answer?.toUpperCase();
    if (q && answer && ['A', 'B', 'C', 'D', 'E'].includes(answer)) {
      const oldAnswer = q.correctAnswer;
      await prisma.question.update({
        where: { id: q.id },
        data: { correctAnswer: answer }
      });
      console.log(`Q${idx}: "${oldAnswer}" → "${answer}" | ${data.reason || ''}`);
      updated++;
    }
  }

  console.log(`\nUpdated ${updated} questions`);

  // Final verification - show all answers
  console.log('\n=== ALL ANSWERS SUMMARY ===');
  const finalQuestions = await prisma.question.findMany({
    where: { testId: TEST_ID },
    orderBy: { orderNum: 'asc' }
  });

  finalQuestions.forEach((q, i) => {
    console.log(`Q${i + 1}: ${q.correctAnswer} | ${q.text.slice(0, 60)}...`);
  });

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
