// Inspect DB: how many questions/options lack LaTeX
const DB_URL = 'postgresql://neondb_owner:npg_omga5szZAf4l@ep-shiny-paper-aousfq8l-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: DB_URL } } });

// Heuristic: does the string already contain LaTeX ($...$, \frac, \ln, ^{, etc.)?
function hasLatex(s) {
  if (!s) return false;
  return s.includes('$') || s.includes('\\frac') || s.includes('\\ln') || s.includes('\\log') ||
         s.includes('\\sqrt') || s.includes('\\cdot') || s.includes('\\times') || s.includes('\\int') ||
         /\\[a-zA-Z]+\{/.test(s);
}

// Does the string look like it contains math that would benefit from LaTeX?
function looksMathy(s) {
  if (!s) return false;
  return /[0-9]\s*[/=^]\s*[0-9a-zA-Z(]/.test(s) || /\b(ln|log|sqrt|sin|cos|tan|pi)\b/i.test(s) ||
         /[⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉]/.test(s) || /\^/.test(s) || /\\|\$/.test(s);
}

async function main() {
  const tests = await prisma.test.findMany({
    select: { id: true, title: true, topic: true, _count: { select: { questions: true } } },
  });
  console.log('=== TESTS ===');
  for (const t of tests) {
    console.log(`${t.id} | ${t.topic.padEnd(12)} | ${String(t._count.questions).padStart(3)} q | ${t.title}`);
  }

  const questions = await prisma.question.findMany({
    select: { id: true, text: true, optionA: true, optionB: true, optionC: true, optionD: true, optionE: true, explanation: true, testId: true },
  });
  console.log(`\nTotal questions: ${questions.length}`);

  const optFields = ['optionA', 'optionB', 'optionC', 'optionD', 'optionE'];
  let plainOptions = 0, totalOptions = 0, plainTextQ = 0, plainExpl = 0, totalExpl = 0;
  const byTest = {};

  for (const q of questions) {
    byTest[q.testId] = byTest[q.testId] || { opts: 0, plain: 0 };
    for (const f of optFields) {
      const v = q[f];
      if (!v) continue;
      totalOptions++;
      byTest[q.testId].opts++;
      if (!hasLatex(v)) {
        plainOptions++;
        byTest[q.testId].plain++;
      }
    }
    if (!hasLatex(q.text) && looksMathy(q.text)) plainTextQ++;
    if (q.explanation) {
      totalExpl++;
      if (!hasLatex(q.explanation) && looksMathy(q.explanation)) plainExpl++;
    }
  }

  console.log(`Options total: ${totalOptions}, without LaTeX: ${plainOptions}`);
  console.log(`Question texts needing math conversion: ${plainTextQ}`);
  console.log(`Explanations total: ${totalExpl}, needing conversion: ${plainExpl}`);
  console.log('\nPer test:');
  for (const [tid, s] of Object.entries(byTest)) {
    console.log(`  ${tid}: ${s.plain}/${s.opts} options plain`);
  }

  // Samples of plain options
  console.log('\n=== SAMPLES (plain options) ===');
  let shown = 0;
  for (const q of questions) {
    const plain = optFields.map(f => q[f]).filter(v => v && !hasLatex(v));
    if (plain.length >= 2 && shown < 6) {
      shown++;
      console.log(`\n[Q ${q.id}]`);
      console.log(`  text: ${q.text.slice(0, 120)}`);
      plain.slice(0, 2).forEach(p => console.log(`  opt: ${p.slice(0, 150)}`));
    }
  }
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
