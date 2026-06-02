#!/usr/bin/env node
/**
 * Process physics test photos using z-ai-web-dev-sdk VLM directly
 * Extract questions from images and insert into Neon DB
 */

import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const PHOTOS_DIR = '/home/z/my-project/upload/physics_extracted/physics qobketganlari';
const PROGRESS_FILE = '/home/z/my-project/upload/physics_progress.json';

// Get all image files - use only the higher quality _13-12-08 set
const allFiles = fs.readdirSync(PHOTOS_DIR)
  .filter(f => f.endsWith('.jpg') && f.includes('_13-12-08'))
  .sort((a, b) => {
    const numA = parseInt(a.match(/photo_(\d+)_/)?.[1] || '0');
    const numB = parseInt(b.match(/photo_(\d+)_/)?.[1] || '0');
    return numA - numB;
  });

console.log(`Found ${allFiles.length} high-quality photos to process`);

// Load progress
let progress = { processedFiles: [], allQuestions: [] };
if (fs.existsSync(PROGRESS_FILE)) {
  try {
    progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    console.log(`Resuming: ${progress.allQuestions.length} questions from ${progress.processedFiles.length} files`);
  } catch (e) {}
}

const VLM_PROMPT = `You are an expert physics test OCR system. Read this physics test image and extract ALL questions visible on the page.

For EACH question, extract the question number, full question text, and all answer options.

Output ONLY a valid JSON array with this exact format:
[{"n":1,"q":"full question text","A":"option A","B":"option B","C":"option C","D":"option D","E":"option E or omit","c":"A or null"}]

Rules:
- Extract EVERY question visible
- Preserve math notation (x² → x^2, subscripts as text)
- If only 4 options, omit E
- If correct answer is not visible, set c to null
- Output ONLY the JSON array, nothing else`;

async function main() {
  const zai = await ZAI.create();
  console.log('Z-AI SDK initialized\n');

  for (let i = 0; i < allFiles.length; i++) {
    const fileName = allFiles[i];
    if (progress.processedFiles.includes(fileName)) {
      console.log(`[${i + 1}/${allFiles.length}] SKIP (already done): ${fileName}`);
      continue;
    }

    const filePath = path.join(PHOTOS_DIR, fileName);
    console.log(`[${i + 1}/${allFiles.length}] Processing: ${fileName}`);

    try {
      // Read image and convert to base64
      const imageBuffer = fs.readFileSync(filePath);
      const base64Image = imageBuffer.toString('base64');
      const mimeType = 'image/jpeg';

      const response = await zai.chat.completions.createVision({
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: VLM_PROMPT },
              { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Image}` } }
            ]
          }
        ],
        thinking: { type: 'disabled' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        console.log('  → Empty response');
        progress.processedFiles.push(fileName);
        saveProgress();
        continue;
      }

      // Try to parse JSON from response
      let questions = null;
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          questions = JSON.parse(jsonMatch[0]);
        } catch (e) {
          // Try fixing common JSON issues
          try {
            const fixed = jsonMatch[0].replace(/,\s*]/g, ']').replace(/'/g, '"');
            questions = JSON.parse(fixed);
          } catch (e2) {
            console.log('  → Could not parse JSON');
          }
        }
      }

      if (questions && Array.isArray(questions) && questions.length > 0) {
        questions.forEach(q => { q.sourceFile = fileName; });
        progress.allQuestions.push(...questions);
        console.log(`  → Extracted ${questions.length} questions (total: ${progress.allQuestions.length})`);
      } else {
        console.log(`  → No questions extracted. Raw: ${content.slice(0, 100)}...`);
      }

      progress.processedFiles.push(fileName);
      saveProgress();

    } catch (error) {
      console.error(`  ✗ Error: ${error.message?.slice(0, 150)}`);
      // Still mark as processed to avoid getting stuck
      if (error.message?.includes('429') || error.message?.includes('rate')) {
        console.log('  → Rate limited, waiting 10s...');
        await sleep(10000);
        // Don't mark as processed, retry next time
        continue;
      }
      progress.processedFiles.push(fileName);
      saveProgress();
    }

    // Delay between requests
    await sleep(3000);
  }

  console.log(`\n=== EXTRACTION COMPLETE ===`);
  console.log(`Total raw questions: ${progress.allQuestions.length}`);

  // Deduplicate by question text
  const uniqueQuestions = [];
  const seenTexts = new Set();
  for (const q of progress.allQuestions) {
    const normalized = (q.q || '').toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 80);
    if (normalized && !seenTexts.has(normalized)) {
      seenTexts.add(normalized);
      uniqueQuestions.push(q);
    }
  }

  console.log(`Unique questions after dedup: ${uniqueQuestions.length}`);

  // Save final
  fs.writeFileSync(
    '/home/z/my-project/upload/physics_questions_final.json',
    JSON.stringify({ totalRaw: progress.allQuestions.length, totalUnique: uniqueQuestions.length, questions: uniqueQuestions }, null, 2)
  );

  // Generate DB insert script
  const insertScript = `const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: { db: { url: 'postgresql://neondb_owner:npg_omga5szZAf4l@ep-shiny-paper-aousfq8l-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require' } }
});

async function main() {
  const questions = ${JSON.stringify(uniqueQuestions)};

  const test = await prisma.test.create({
    data: {
      title: 'Physics: Qobketganlar',
      topic: 'Physics',
      description: 'Physics test collection from uploaded photos',
      timeLimit: 120,
    }
  });

  console.log('Created test:', test.id, test.title);

  let inserted = 0;
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    try {
      await prisma.question.create({
        data: {
          testId: test.id,
          text: q.q || '',
          optionA: q.A || '',
          optionB: q.B || '',
          optionC: q.C || '',
          optionD: q.D || '',
          optionE: q.E || null,
          correctAnswer: q.c || 'A',
          orderNum: i + 1,
        }
      });
      inserted++;
      if (inserted % 10 === 0) console.log('Inserted ' + inserted + '...');
    } catch (e) {
      console.error('Error Q' + (i+1) + ':', e.message?.slice(0, 80));
    }
  }

  console.log('Done! Inserted ' + inserted + '/' + questions.length);

  const count = await prisma.question.count({ where: { testId: test.id } });
  console.log('Total questions in test:', count);

  await prisma.\\$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });`;

  fs.writeFileSync('/home/z/my-project/insert-physics-questions.cjs', insertScript);
  console.log('\nInsert script saved. Run: node /home/z/my-project/insert-physics-questions.cjs');
}

function saveProgress() {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main().catch(e => { console.error(e); process.exit(1); });
