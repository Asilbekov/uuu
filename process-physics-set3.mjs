#!/usr/bin/env node
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const PHOTOS_DIR = '/home/z/my-project/upload/physics_extracted/physics qobketganlari';
const PROGRESS_FILE = '/home/z/my-project/upload/physics_progress3.json';

const VLM_PROMPT = `Read this physics test image. Extract ALL questions as JSON array:
[{"n":1,"q":"question text","A":"option","B":"option","C":"option","D":"option","E":"option or omit","c":"A/B/C/D/E or null"}]
Preserve math notation. If 4 options, omit E. If correct answer not visible, c=null. Output ONLY JSON.`;

// Process photos 5-9 from both sets
const targetFiles = [];
for (let n = 5; n <= 9; n++) {
  targetFiles.push(`photo_${n}_2026-06-01_13-12-08.jpg`);
  targetFiles.push(`photo_${n}_2026-06-01_13-11-38.jpg`);
}

const existing = targetFiles.filter(f => fs.existsSync(path.join(PHOTOS_DIR, f)));
console.log(`Processing ${existing.length} additional photos (5-9)`);

// Load all existing questions
const firstRun = JSON.parse(fs.readFileSync('/home/z/my-project/upload/physics_progress.json', 'utf8'));
const secondRun = JSON.parse(fs.readFileSync('/home/z/my-project/upload/physics_progress2.json', 'utf8'));
const allExisting = [...firstRun.allQuestions, ...secondRun.allQuestions];
const existingTexts = new Set(allExisting.map(q => (q.q || '').toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 80)));

let progress = { processedFiles: [], allQuestions: [] };
if (fs.existsSync(PROGRESS_FILE)) {
  try { progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8')); } catch (e) {}
}

async function main() {
  const zai = await ZAI.create();

  for (let i = 0; i < existing.length; i++) {
    const fileName = existing[i];
    if (progress.processedFiles.includes(fileName)) continue;

    const filePath = path.join(PHOTOS_DIR, fileName);
    console.log(`[${i + 1}/${existing.length}] ${fileName}`);

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
      if (!content) { console.log('  → Empty'); progress.processedFiles.push(fileName); saveProgress(); continue; }

      let questions = null;
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try { questions = JSON.parse(jsonMatch[0]); }
        catch (e) { try { questions = JSON.parse(jsonMatch[0].replace(/,\s*]/g, ']').replace(/'/g, '"')); } catch (e2) {} }
      }

      if (questions?.length > 0) {
        const newQs = questions.filter(q => {
          const norm = (q.q || '').toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 80);
          return !existingTexts.has(norm);
        });
        newQs.forEach(q => { q.sourceFile = fileName; existingTexts.add((q.q || '').toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 80)); });
        progress.allQuestions.push(...newQs);
        console.log(`  → ${questions.length} extracted, ${newQs.length} new`);
      }

      progress.processedFiles.push(fileName);
      saveProgress();
    } catch (error) {
      console.error(`  ✗ ${error.message?.slice(0, 100)}`);
      if (error.message?.includes('429') || error.message?.includes('rate')) {
        await sleep(15000); continue;
      }
      progress.processedFiles.push(fileName); saveProgress();
    }
    await sleep(3000);
  }

  // Combine ALL questions
  const combined = [...allExisting, ...progress.allQuestions];
  const unique = [];
  const seen = new Set();
  for (const q of combined) {
    const norm = (q.q || '').toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 80);
    if (norm && !seen.has(norm)) { seen.add(norm); unique.push(q); }
  }

  console.log(`\nTotal unique questions: ${unique.length}`);
  
  fs.writeFileSync('/home/z/my-project/upload/physics_questions_final.json', JSON.stringify({ totalUnique: unique.length, questions: unique }, null, 2));
  
  // Generate insert script
  const script = `const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: 'postgresql://neondb_owner:npg_omga5szZAf4l@ep-shiny-paper-aousfq8l-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require' } } });

async function main() {
  const questions = ${JSON.stringify(unique)};
  const test = await prisma.test.create({ data: { title: 'Physics: Qobketganlar', topic: 'Physics', description: 'Physics test collection from uploaded photos', timeLimit: 120 } });
  console.log('Created test:', test.id);
  let inserted = 0;
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    try {
      await prisma.question.create({ data: { testId: test.id, text: q.q || '', optionA: q.A || '', optionB: q.B || '', optionC: q.C || '', optionD: q.D || '', optionE: q.E || null, correctAnswer: q.c || 'A', orderNum: i + 1 } });
      inserted++;
    } catch (e) { console.error('Error Q' + (i+1) + ':', e.message?.slice(0, 80)); }
  }
  console.log('Done! Inserted ' + inserted + '/' + questions.length);
  const count = await prisma.question.count({ where: { testId: test.id } });
  console.log('Total questions in test:', count);
  await prisma.\\$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });`;

  fs.writeFileSync('/home/z/my-project/insert-physics-questions.cjs', script);
  console.log('Insert script ready!');
}

function saveProgress() { fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2)); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
main().catch(e => { console.error(e); process.exit(1); });
