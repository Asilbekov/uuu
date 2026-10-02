// Dump sample of mathy plain options to design converter
const DB_URL = 'postgresql://neondb_owner:npg_omga5szZAf4l@ep-shiny-paper-aousfq8l-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: DB_URL } } });

function hasLatex(s) {
  if (!s) return false;
  return s.includes('$') || s.includes('\\frac') || s.includes('\\ln') || s.includes('\\log') ||
    s.includes('\\sqrt') || s.includes('\\cdot') || s.includes('\\times') || s.includes('\\int') ||
    /\\[a-zA-Z]+\{/.test(s);
}
function looksMathy(s) {
  if (!s) return false;
  if (/^[0-9\s.,%-]+$/.test(s.trim())) return false;
  if (/[⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉]/.test(s)) return true;
  if (/\^/.test(s)) return true;
  if (/\b(ln|log|sqrt|sin|cos|tan|ctg|arcsin|arccos|arctan)\b/i.test(s)) return true;
  if (/[0-9a-zA-Z)]\s*\/\s*[0-9a-zA-Z(]/.test(s)) return true;
  if (/[0-9a-zA-Z]\s*=\s*[^\s=]/.test(s)) return true;
  if (/[≠≤≥±×·→π∞√]/.test(s)) return true;
  return false;
}

async function main() {
  const questions = await prisma.question.findMany({
    select: { id: true, optionA: true, optionB: true, optionC: true, optionD: true, optionE: true },
  });
  const OPT = ['optionA', 'optionB', 'optionC', 'optionD', 'optionE'];
  const picked = [];
  for (const q of questions) {
    for (const f of OPT) {
      const v = q[f];
      if (v && !hasLatex(v) && looksMathy(v)) picked.push(v);
    }
  }
  console.log(`Total mathy plain options: ${picked.length}`);
  // print a diverse sample
  const step = Math.max(1, Math.floor(picked.length / 45));
  for (let i = 0; i < picked.length && i < 45 * step; i += step) {
    console.log('•', picked[i].replace(/\n/g, ' | ').slice(0, 160));
  }
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
