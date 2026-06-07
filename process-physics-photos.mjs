#!/usr/bin/env node
/**
 * Process physics test photos using VLM (z-ai vision CLI)
 * Extract questions, options, and correct answers from images
 * Then insert them into the Neon PostgreSQL database
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const PHOTOS_DIR = '/home/z/my-project/upload/physics_extracted/physics qobketganlari';
const RESULTS_FILE = '/home/z/my-project/upload/physics_questions_raw.json';
const DB_URL = 'postgresql://neondb_owner:npg_omga5szZAf4l@ep-shiny-paper-aousfq8l-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

// Get all image files sorted
const allFiles = fs.readdirSync(PHOTOS_DIR)
  .filter(f => f.endsWith('.jpg'))
  .sort();

// Separate by timestamp - the larger/better quality photos are _13-12-08
const set1 = allFiles.filter(f => f.includes('_13-11-38')); // smaller/earlier photos
const set2 = allFiles.filter(f => f.includes('_13-12-08')); // larger/better quality

console.log(`Found ${set1.length} photos in set 1 (13-11-38) and ${set2.length} photos in set 2 (13-12-08)`);
console.log('Using set 2 (higher quality) as primary source...\n');

// Load existing results if any (for resuming)
let allQuestions = [];
let processedFiles = new Set();

if (fs.existsSync(RESULTS_FILE)) {
  try {
    const existing = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));
    allQuestions = existing.questions || [];
    processedFiles = new Set(existing.processedFiles || []);
    console.log(`Resuming: ${allQuestions.length} questions already extracted from ${processedFiles.size} files`);
  } catch (e) {
    console.log('Could not parse existing results, starting fresh');
  }
}

const PROMPT = `You are an expert physics test OCR system. Read this physics test image and extract ALL questions visible.

For EACH question, extract:
- The question number and full question text (including any formulas, values, units)
- All answer options (A, B, C, D, and E if present)
- The correct answer letter if it's indicated on the image

Output ONLY a JSON array with this exact format:
[{"number": 1, "question": "full question text", "A": "option A text", "B": "option B text", "C": "option C text", "D": "option D text", "E": "option E text or omit", "correct": "A/B/C/D/E or null"}]

IMPORTANT RULES:
- Extract EVERY question visible on the page, even partially visible ones
- Preserve mathematical notation as text (e.g., "x²" as "x^2", "ΔS" as "ΔS", Greek letters as names)
- If a question has only 4 options, omit the "E" field
- If the correct answer is NOT visible/indicated on the image, set "correct" to null
- Be very careful with formulas and numerical values - precision matters!
- Output ONLY the JSON array, no other text`;

// Process images using z-ai vision CLI
async function processImage(filePath) {
  const fileName = path.basename(filePath);
  
  if (processedFiles.has(fileName)) {
    console.log(`  Skipping already processed: ${fileName}`);
    return null;
  }
  
  console.log(`  Processing: ${fileName}`);
  
  try {
    const result = execSync(
      `z-ai vision -p "${PROMPT.replace(/"/g, '\\"')}" -i "${filePath}" 2>/dev/null`,
      { encoding: 'utf8', timeout: 120000, maxBuffer: 10 * 1024 * 1024 }
    );
    
    // Parse the CLI output - it wraps the API response
    const match = result.match(/\[\{.*\}\]/s);
    if (match) {
      const questions = JSON.parse(match[0]);
      console.log(`    → Extracted ${questions.length} questions`);
      return questions;
    } else {
      console.log(`    → No JSON array found in response`);
      // Try to find partial JSON
      const partialMatch = result.match(/\[[\s\S]*\]/);
      if (partialMatch) {
        try {
          const questions = JSON.parse(partialMatch[0]);
          console.log(`    → Extracted ${questions.length} questions (partial match)`);
          return questions;
        } catch (e) {
          console.log(`    → Failed to parse partial JSON`);
        }
      }
      return null;
    }
  } catch (error) {
    console.error(`    ✗ Error processing ${fileName}: ${error.message?.slice(0, 100)}`);
    return null;
  }
}

// Main processing loop
async function main() {
  // Process set 2 first (higher quality), then set 1
  const filesToProcess = [...set2, ...set1];
  
  console.log(`\nProcessing ${filesToProcess.length - processedFiles.size} remaining images...\n`);
  
  for (let i = 0; i < filesToProcess.length; i++) {
    const fileName = filesToProcess[i];
    const filePath = path.join(PHOTOS_DIR, fileName);
    
    if (processedFiles.has(fileName)) continue;
    
    console.log(`[${i + 1}/${filesToProcess.length}] ${fileName}`);
    
    const questions = await processImage(filePath);
    
    if (questions && questions.length > 0) {
      // Add source info to each question
      questions.forEach(q => {
        q.sourceFile = fileName;
      });
      allQuestions.push(...questions);
    }
    
    processedFiles.add(fileName);
    
    // Save intermediate results after each image
    fs.writeFileSync(RESULTS_FILE, JSON.stringify({
      questions: allQuestions,
      processedFiles: [...processedFiles],
    }, null, 2));
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log(`\n=== EXTRACTION COMPLETE ===`);
  console.log(`Total questions extracted: ${allQuestions.length}`);
  console.log(`Files processed: ${processedFiles.size}`);
  
  // Now deduplicate - same question number from different photos of the same page
  // Group by question text similarity
  const uniqueQuestions = [];
  const seenTexts = new Set();
  
  for (const q of allQuestions) {
    // Normalize question text for comparison
    const normalized = q.question.toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 80);
    if (!seenTexts.has(normalized)) {
      seenTexts.add(normalized);
      uniqueQuestions.push(q);
    }
  }
  
  console.log(`Unique questions after dedup: ${uniqueQuestions.length}`);
  
  // Save final results
  const finalResults = {
    totalRaw: allQuestions.length,
    totalUnique: uniqueQuestions.length,
    questions: uniqueQuestions,
  };
  
  fs.writeFileSync(
    '/home/z/my-project/upload/physics_questions_final.json',
    JSON.stringify(finalResults, null, 2)
  );
  
  console.log(`\nFinal results saved to: /home/z/my-project/upload/physics_questions_final.json`);
  
  // Now insert into database
  console.log(`\n=== INSERTING INTO DATABASE ===`);
  
  // Create a temporary script that uses Prisma to insert
  const insertScript = `
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: { db: { url: '${DB_URL}' } }
});

async function main() {
  const questions = ${JSON.stringify(uniqueQuestions)};
  
  // Create the test first
  const test = await prisma.test.create({
    data: {
      title: 'Physics: Qobketganlar',
      topic: 'Physics',
      description: 'Physics test collection from uploaded photos',
      timeLimit: 120,
    }
  });
  
  console.log('Created test:', test.id, test.title);
  
  // Insert questions
  let inserted = 0;
  for (const q of questions) {
    try {
      await prisma.question.create({
        data: {
          testId: test.id,
          text: q.question,
          optionA: q.A || '',
          optionB: q.B || '',
          optionC: q.C || '',
          optionD: q.D || '',
          optionE: q.E || null,
          correctAnswer: q.correct || 'A',
          orderNum: q.number || inserted,
        }
      });
      inserted++;
    } catch (e) {
      console.error('Error inserting Q' + q.number + ':', e.message?.slice(0, 80));
    }
  }
  
  console.log('Inserted ' + inserted + ' questions out of ' + questions.length);
  
  // Verify
  const count = await prisma.question.count({ where: { testId: test.id } });
  console.log('Total questions in test:', count);
  
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
`;
  
  fs.writeFileSync('/home/z/my-project/insert-physics-questions.cjs', insertScript);
  console.log('Insert script created at: /home/z/my-project/insert-physics-questions.cjs');
  console.log('Run it with: node /home/z/my-project/insert-physics-questions.cjs');
}

main().catch(e => { console.error(e); process.exit(1); });
