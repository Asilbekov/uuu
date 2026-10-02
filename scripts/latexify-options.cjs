#!/usr/bin/env node
/**
 * latexify-options.cjs
 * Converts plain-text math in question texts / options / explanations to proper LaTeX ($...$)
 * using Mistral. Idempotent: fields that already contain LaTeX are skipped.
 * Usage: node scripts/latexify-options.cjs [--test=<testId>] [--limit=N]
 */
const DB_URL = 'postgresql://neondb_owner:npg_omga5szZAf4l@ep-shiny-paper-aousfq8l-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || 'mstrl_naalPY3i3Et7CiwdCYCPFJhONOFzt0qI_13UuG1';
const MISTRAL_URL = 'https://api.mistral.ai/v1/chat/completions';
const MODEL = 'mistral-small-latest';
const BATCH = 6; // questions per request
const DELAY_MS = 1300;
const FS = require('fs');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: DB_URL } } });

const OPT_FIELDS = ['optionA', 'optionB', 'optionC', 'optionD', 'optionE'];

function hasLatex(s) {
  if (!s) return false;
  return s.includes('$') || s.includes('\\frac') || s.includes('\\ln') || s.includes('\\log') ||
    s.includes('\\sqrt') || s.includes('\\cdot') || s.includes('\\times') || s.includes('\\int') ||
    /\\[a-zA-Z]+\{/.test(s);
}

function looksMathy(s) {
  if (!s) return false;
  if (/^[0-9\s.,%-]+$/.test(s.trim())) return false; // pure numbers "1", "5", "15" are fine as-is
  if (/[⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉]/.test(s)) return true;
  if (/\^/.test(s)) return true;
  if (/\b(ln|log|sqrt|sin|cos|tan|ctg|arcsin|arccos|arctan)\b/i.test(s)) return true;
  if (/[0-9a-zA-Z)]\s*\/\s*[0-9a-zA-Z(]/.test(s)) return true;
  if (/[0-9a-zA-Z]\s*=\s*[^\s=]/.test(s)) return true;
  if (/[≠≤≥±×·→π∞√]/.test(s)) return true;
  if (/\\(pi|cdot|times|approx|leq|geq|neq|to|infty|frac)/.test(s)) return true;
  return false;
}

function needsConversion(s) {
  return !!s && !hasLatex(s) && looksMathy(s);
}

const SYS = `You are a data-cleaning assistant. You receive JSON {"items":[...]} where each item has an "id" and some of the fields "text", "options" (object with keys A-E), "explanation". The strings contain math written as PLAIN TEXT.

Your job: rewrite ONLY the mathematical notation as clean LaTeX, leaving everything else EXACTLY the same.

RULES:
1. Wrap every math expression in inline math delimiters $...$.
2. Fractions: x=3/2 -> $x = \\frac{3}{2}$; ln(15)/3 -> $\\frac{\\ln 15}{3}$; -ln(10)/(4ln(3)) -> $-\\frac{\\ln 10}{4\\ln 3}$; 140/3 -> $\\frac{140}{3}$.
3. Functions: ln(x) -> $\\ln x$, log(7.21) -> $\\log 7.21$, sqrt(5) -> $\\sqrt{5}$, e^(3x) -> $e^{3x}$, 5^x -> $5^x$.
4. Multiplication: 2*3 -> $2 \\cdot 3$. Keep units OUTSIDE the math: "h = 37.2 m" -> "$h = 37.2$ m"; "9.8 m/s^2" -> "$9.8$ m/s$^2$".
5. Do NOT translate or reword anything. Keep the original language, words, punctuation, sub-labels (like "a.", "b)", "1)", "-") and their order exactly.
6. Do NOT convert word-slashes like "and/or", "input/output", "his/her".
7. Keep existing LaTeX ($...$) unchanged. If a string has no math, return it unchanged.
8. Never merge or split sub-parts; keep the same semicolon/comma structure.

Respond with STRICT JSON only (no markdown fences): {"items":[{"id":"<same id>","text":"<converted text or same>","options":{"A":"...","B":"..."},"explanation":"<...>"}]}
Include ONLY the fields that were present in the input item. Every input id MUST appear exactly once in the output.`;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function callMistral(payload, retries = 4) {
  const body = JSON.stringify({
    model: MODEL,
    messages: [
      { role: 'system', content: SYS },
      { role: 'user', content: payload },
    ],
    temperature: 0.1,
    max_tokens: 6000,
    response_format: { type: 'json_object' },
  });
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(MISTRAL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${MISTRAL_API_KEY}` },
        body,
      });
      if (response.status === 429) {
        const wait = 3000 + attempt * 4000;
        console.log(`  429 rate limited, waiting ${wait}ms...`);
        await sleep(wait);
        continue;
      }
      if (!response.ok) throw new Error(`Mistral ${response.status}: ${(await response.text()).slice(0, 300)}`);
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      return JSON.parse(content);
    } catch (e) {
      if (attempt === retries) throw e;
      console.log(`  retry ${attempt + 1}: ${e.message.slice(0, 120)}`);
      await sleep(2500 + attempt * 2500);
    }
  }
}

function sane(original, converted) {
  if (typeof converted !== 'string' || converted.trim().length === 0) return false;
  const o = original.trim().length, c = converted.trim().length;
  if (o >= 20 && c < o * 0.5) return false; // drastic shortening = model lost content
  if (c > o * 4 + 200) return false; // drastic growth = hallucination
  return true;
}

async function main() {
  const args = process.argv.slice(2);
  const testFilter = args.find(a => a.startsWith('--test='))?.split('=')[1];
  const limit = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1] || '0', 10);

  // 1. Load questions
  const questions = await prisma.question.findMany({
    ...(testFilter ? { where: { testId: testFilter } } : {}),
    select: { id: true, text: true, optionA: true, optionB: true, optionC: true, optionD: true, optionE: true, explanation: true, testId: true },
    orderBy: [{ testId: 'asc' }, { orderNum: 'asc' }],
  });
  if (limit > 0) questions.length = Math.min(questions.length, limit);

  // 2. Backup
  const backupPath = `/home/z/my-project/backup/questions-backup-${Date.now()}.json`;
  FS.mkdirSync('/home/z/my-project/backup', { recursive: true });
  FS.writeFileSync(backupPath, JSON.stringify(questions, null, 1));
  console.log(`Backup of ${questions.length} questions saved to ${backupPath}`);

  // 3. Build work items (only fields needing conversion)
  const items = [];
  for (const q of questions) {
    const item = { id: q.id };
    let touched = false;
    if (needsConversion(q.text)) { item.text = q.text; item.__convText = true; touched = true; }
    else { item.text = q.text; } // context for the model, not written back
    const opts = {};
    const convOpts = {};
    for (const f of OPT_FIELDS) {
      opts[f.replace('option', '')] = q[f] || '';
      if (needsConversion(q[f])) { convOpts[f.replace('option', '')] = true; touched = true; }
    }
    item.options = opts;
    if (Object.keys(convOpts).length) item.__convOpts = convOpts;
    if (q.explanation) {
      item.explanation = q.explanation;
      if (needsConversion(q.explanation)) { item.__convExpl = true; touched = true; }
    }
    if (touched) items.push(item);
  }

  console.log(`Questions needing conversion: ${items.length} / ${questions.length}`);
  if (items.length === 0) { console.log('Nothing to do.'); return; }

  // 4. Process in batches
  let convertedQ = 0, convertedFields = 0, failed = 0;
  const failures = [];
  for (let i = 0; i < items.length; i += BATCH) {
    const batch = items.slice(i, i + BATCH);
    const wire = batch.map(({ __convText, __convOpts, __convExpl, ...rest }) => rest);
    process.stdout.write(`[${Math.floor(i / BATCH) + 1}/${Math.ceil(items.length / BATCH)}] `);
    try {
      const out = await callMistral(JSON.stringify({ items: wire }));
      const byId = {};
      for (const it of (out.items || [])) byId[it.id] = it;
      for (const src of batch) {
        const res = byId[src.id];
        if (!res) { console.log(`  ! no response for ${src.id}`); failed++; failures.push(src.id); continue; }
        const data = {};
        if (src.__convText && res.text && sane(src.text, res.text) && res.text !== src.text) data.text = res.text;
        if (src.__convOpts && res.options) {
          for (const [L, want] of Object.entries(src.__convOpts)) {
            const orig = src.options[L];
            const conv = res.options[L];
            if (want && typeof conv === 'string' && conv.trim() && sane(orig, conv) && conv !== orig) data[`option${L}`] = conv;
          }
        }
        if (src.__convExpl && res.explanation && sane(src.explanation, res.explanation) && res.explanation !== src.explanation) data.explanation = res.explanation;
        if (Object.keys(data).length) {
          await prisma.question.update({ where: { id: src.id }, data });
          convertedQ++; convertedFields += Object.keys(data).length;
        }
      }
      process.stdout.write(`ok\n`);
    } catch (e) {
      console.log(`FAILED batch: ${e.message.slice(0, 200)}`);
      failed += batch.length;
      failures.push(...batch.map(b => b.id));
    }
    await sleep(DELAY_MS);
  }

  console.log(`\nDone. Questions updated: ${convertedQ}, fields converted: ${convertedFields}, failed: ${failed}`);
  if (failures.length) {
    console.log('Failed ids:', failures.slice(0, 20).join(', '), failures.length > 20 ? '...' : '');
    FS.writeFileSync('/home/z/my-project/backup/latexify-failures.json', JSON.stringify(failures, null, 1));
  }
}

main()
  .catch(e => { console.error('FATAL:', e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
