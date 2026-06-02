#!/usr/bin/env node
/**
 * Process remaining physics photos (set2: _13-11-38 + missing _13-12-08 photos)
 */

import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const PHOTOS_DIR = '/home/z/my-project/upload/physics_extracted/physics qobketganlari';
const PROGRESS_FILE = '/home/z/my-project/upload/physics_progress2.json';

const VLM_PROMPT = `Read this physics test image. Extract ALL questions as JSON array:
[{"n":1,"q":"question text","A":"option","B":"option","C":"option","D":"option","E":"option or omit","c":"A/B/C/D/E or null"}]
Preserve math notation. If 4 options, omit E. If correct answer not visible, c=null. Output ONLY JSON.`;

// Get remaining _13-12-08 files (5-9 that were missed) + all _13-11-38 files
const allFiles = fs.readdirSync(PHOTOS_DIR).filter(f => f.endsWith('.jpg'));

// Missing from first run: _13-12-08 photos 5-9
const missing1208 = allFiles.filter(f => 
  f.includes('_13-12-08') && 
  [5,6,7,8,9].some(n => f.includes(`photo_${n}_`))
).sort();

// All _13-11-38 files (different/smaller set)
const set1138 = allFiles.filter(f => f.includes('_13-11-38')).sort((a, b) => {
  const numA = parseInt(a.match(/photo_(\d+)_/)?.[1] || '0');
  const numB = parseInt(b.match(/photo_(\d+)_/)?.[1] || '0');
  return numA - numB;
});

const filesToProcess = [...missing1208, ...set1138];
console.log(`Missing _13-12-08 files: ${missing1208.length}`);
console.log(`_13-11-38 files: ${set1138.length}`);
console.log(`Total to process: ${filesToProcess.length}\n`);

// Load existing progress
let progress = { processedFiles: [], allQuestions: [] };
if (fs.existsSync(PROGRESS_FILE)) {
  try {
    progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    console.log(`Resuming: ${progress.allQuestions.length} questions from ${progress.processedFiles.length} files`);
  } catch (e) {}
}

// Load questions from first run
const firstRun = JSON.parse(fs.readFileSync('/home/z/my-project/upload/physics_progress.json', 'utf8'));
const existingQuestionTexts = new Set(
  firstRun.allQuestions.map(q => (q.q || '').toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 80))
);

async function main() {
  const zai = await ZAI.create();
  console.log('Z-AI SDK initialized\n');

  for (let i = 0; i < filesToProcess.length; i++) {
    const fileName = filesToProcess[i];
    if (progress.processedFiles.includes(fileName)) {
      console.log(`[${i + 1}] SKIP: ${fileName}`);
      continue;
    }

    const filePath = path.join(PHOTOS_DIR, fileName);
    console.log(`[${i + 1}/${filesToProcess.length}] ${fileName}`);

    try {
      const imageBuffer = fs.readFileSync(filePath);
      const base64Image = imageBuffer.toString('base64');

      const response = await zai.chat.completions.createVision({
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: VLM_PROMPT },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
          ]
        }],
        thinking: { type: 'disabled' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        console.log('  → Empty response');
        progress.processedFiles.push(fileName);
        saveProgress();
        continue;
      }

      let questions = null;
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try { questions = JSON.parse(jsonMatch[0]); } 
        catch (e) {
          try { questions = JSON.parse(jsonMatch[0].replace(/,\s*]/g, ']').replace(/'/g, '"')); } 
          catch (e2) { console.log('  → JSON parse failed'); }
        }
      }

      if (questions && Array.isArray(questions) && questions.length > 0) {
        // Only add questions not already in first run
        const newQuestions = questions.filter(q => {
          const norm = (q.q || '').toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 80);
          return !existingQuestionTexts.has(norm);
        });
        
        newQuestions.forEach(q => { q.sourceFile = fileName; });
        progress.allQuestions.push(...newQuestions);
        console.log(`  → ${questions.length} extracted, ${newQuestions.length} new (total new: ${progress.allQuestions.length})`);
        
        // Also add to existing texts to prevent duplicates within this run
        newQuestions.forEach(q => {
          existingQuestionTexts.add((q.q || '').toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 80));
        });
      } else {
        console.log(`  → No questions. Raw: ${content.slice(0, 80)}...`);
      }

      progress.processedFiles.push(fileName);
      saveProgress();

    } catch (error) {
      console.error(`  ✗ Error: ${error.message?.slice(0, 120)}`);
      if (error.message?.includes('429') || error.message?.includes('rate')) {
        console.log('  → Rate limited, waiting 15s...');
        await sleep(15000);
        continue;
      }
      progress.processedFiles.push(fileName);
      saveProgress();
    }

    await sleep(3000);
  }

  console.log(`\n=== SET 2 COMPLETE ===`);
  console.log(`New questions from this run: ${progress.allQuestions.length}`);

  // Combine with first run
  const firstRunQuestions = firstRun.allQuestions;
  const allCombined = [...firstRunQuestions, ...progress.allQuestions];

  // Final dedup
  const uniqueQuestions = [];
  const seen = new Set();
  for (const q of allCombined) {
    const norm = (q.q || '').toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 80);
    if (norm && !seen.has(norm)) {
      seen.add(norm);
      uniqueQuestions.push(q);
    }
  }

  console.log(`Combined total: ${allCombined.length}, unique: ${uniqueQuestions.length}`);

  fs.writeFileSync(
    '/home/z/my-project/upload/physics_questions_final.json',
    JSON.stringify({ totalUnique: uniqueQuestions.length, questions: uniqueQuestions }, null, 2)
  );

  // Generate DB insert script
  generateInsertScript(uniqueQuestions);
}

function generateInsertScript(questions) {
  const script = `const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: { db: { url: 'postgresql://neondb_owner:npg_omga5szZAf4l@ep-shiny-paper-aousfq8l-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require' } }
});

async function main() {
  const questions = ${JSON.stringify(questions)};

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

  fs.writeFileSync('/home/z/my-project/insert-physics-questions.cjs', script);
  console.log('\nInsert script saved. Run: node /home/z/my-project/insert-physics-questions.cjs');
}

function saveProgress() {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main().catch(e => { console.error(e); process.exit(1); });
