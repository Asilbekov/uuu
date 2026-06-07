#!/usr/bin/env node
/**
 * Use Mistral AI to determine correct answers for questions
 * where VLM couldn't recognize the answer from photos
 */

const MISTRAL_API_KEY = '8kXyiDpFhhbHjgUC2XtmtfURwODaeWMl';
const MISTRAL_URL = 'https://api.mistral.ai/v1/chat/completions';
const DB_URL = 'postgresql://neondb_owner:npg_omga5szZAf4l@ep-shiny-paper-aousfq8l-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const TEST_ID = 'cmpwhq4wx0001p29fozc6m8v3';

// Questions that had c:null from VLM (saved as 'A' by default)
// We need to verify ALL questions since default 'A' is wrong for null ones
// From the VLM processing, these indices had null correct answers:
const NULL_ANSWER_INDICES = [4, 7, 15, 16, 18, 19, 20, 24, 25, 28, 29, 31, 36, 37];

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
        { role: 'system', content: 'You are a physics expert. For each multiple choice question, determine the correct answer. Output ONLY a JSON array of objects with "idx" (1-based) and "answer" (letter A/B/C/D/E) fields. No other text.' },
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

  const questions = await prisma.question.findMany({
    where: { testId: TEST_ID },
    orderBy: { orderNum: 'asc' }
  });

  console.log(`Total questions: ${questions.length}`);
  console.log(`Questions with potentially wrong default answer: ${NULL_ANSWER_INDICES.length}`);

  // Build prompt for questions that need answer verification
  const questionsToVerify = NULL_ANSWER_INDICES.map(idx => {
    const q = questions[idx - 1];
    if (!q) return null;
    const options = [];
    if (q.optionA) options.push(`A) ${q.optionA}`);
    if (q.optionB) options.push(`B) ${q.optionB}`);
    if (q.optionC) options.push(`C) ${q.optionC}`);
    if (q.optionD) options.push(`D) ${q.optionD}`);
    if (q.optionE) options.push(`E) ${q.optionE}`);
    return `Q${idx}: ${q.text}\nOptions: ${options.join('\n')}`;
  }).filter(Boolean);

  // Send in batches of 5 to avoid token limits
  const BATCH_SIZE = 5;
  const allAnswers = {};

  for (let i = 0; i < questionsToVerify.length; i += BATCH_SIZE) {
    const batch = questionsToVerify.slice(i, i + BATCH_SIZE);
    const batchPrompt = batch.join('\n\n');

    console.log(`\nBatch ${Math.floor(i / BATCH_SIZE) + 1}: Questions ${NULL_ANSWER_INDICES.slice(i, i + BATCH_SIZE).join(', ')}`);

    try {
      const response = await callMistral(batchPrompt);
      console.log('Raw response:', response.slice(0, 300));

      // Parse JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          const answers = JSON.parse(jsonMatch[0]);
          answers.forEach(a => {
            allAnswers[a.idx] = a.answer;
          });
        } catch (e) {
          // Try line-by-line parsing
          const lines = response.split('\n').filter(l => l.trim());
          lines.forEach(line => {
            const match = line.match(/Q?(\d+)[:).]\s*([A-E])/i);
            if (match) {
              allAnswers[parseInt(match[1])] = match[2].toUpperCase();
            }
          });
        }
      }

      // Small delay
      await new Promise(r => setTimeout(r, 1000));
    } catch (error) {
      console.error('Error:', error.message?.slice(0, 200));
    }
  }

  console.log('\n=== Mistral Answers ===');
  console.log(JSON.stringify(allAnswers, null, 2));

  // Update DB
  let updated = 0;
  for (const [idx, answer] of Object.entries(allAnswers)) {
    const q = questions[parseInt(idx) - 1];
    if (q && answer && ['A', 'B', 'C', 'D', 'E'].includes(answer)) {
      await prisma.question.update({
        where: { id: q.id },
        data: { correctAnswer: answer }
      });
      console.log(`Q${idx}: Updated correctAnswer from "${q.correctAnswer}" → "${answer}"`);
      updated++;
    }
  }

  console.log(`\nUpdated ${updated} questions`);

  // Also verify some questions that HAD answers from VLM to make sure they're correct
  // Let's verify ALL questions in one big batch
  console.log('\n=== Verifying ALL questions with Mistral ===');

  const allQuestionsPrompt = questions.map((q, i) => {
    const options = [];
    if (q.optionA) options.push(`A) ${q.optionA}`);
    if (q.optionB) options.push(`B) ${q.optionB}`);
    if (q.optionC) options.push(`C) ${q.optionC}`);
    if (q.optionD) options.push(`D) ${q.optionD}`);
    if (q.optionE) options.push(`E) ${q.optionE}`);
    return `Q${i + 1}: ${q.text}\nOptions: ${options.join('\n')}`;
  });

  // Verify in batches of 10
  for (let i = 0; i < allQuestionsPrompt.length; i += 10) {
    const batch = allQuestionsPrompt.slice(i, i + 10);
    const batchIndices = batch.map((_, j) => i + j + 1);

    console.log(`\nVerifying batch: Q${batchIndices[0]}-Q${batchIndices[batchIndices.length - 1]}`);

    try {
      const response = await callMistral(batch.join('\n\n'));

      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          const answers = JSON.parse(jsonMatch[0]);
          answers.forEach(a => {
            const qIdx = a.idx;
            const correctLetter = a.answer?.toUpperCase();
            const q = questions[qIdx - 1];

            if (q && correctLetter && ['A', 'B', 'C', 'D', 'E'].includes(correctLetter)) {
              if (q.correctAnswer !== correctLetter) {
                console.log(`Q${qIdx}: DB="${q.correctAnswer}" → Mistral="${correctLetter}" - ${q.text.slice(0, 50)}...`);
              }
            }
          });
        } catch (e) {
          console.log('Parse error in verification');
        }
      }

      await new Promise(r => setTimeout(r, 1000));
    } catch (error) {
      console.error('Verification error:', error.message?.slice(0, 150));
    }
  }

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
