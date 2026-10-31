/**
 * FULL DB AUDIT — Phase 1: dump every test/question, run structural checks.
 * Prints ONLY problems (compact). Full dump -> backup/db-dump-<ts>.json
 */
const fs = require('fs');
const { Client } = require('pg');
const env = fs.readFileSync('/home/z/my-project/uuu/.env', 'utf8');
const url = env.match(/^DATABASE_URL=(.*)$/m)[1].trim();
const norm = (s) => String(s).replace(/\s+/g, ' ').trim();
const LETTERS = ['A', 'B', 'C', 'D', 'E'];

(async () => {
  const c = new Client({ connectionString: url });
  await c.connect();

  const tests = await c.query(`SELECT id, title, topic, "creatorId", "isPublic", "randomizeQuestions", "randomizeOptions" FROM "Test" ORDER BY title`);
  const qs = await c.query(`SELECT id, "testId", "orderNum", text, "optionA","optionB","optionC","optionD","optionE","correctAnswer", explanation, translations, "imageUrl", "optionImages" FROM "Question" ORDER BY "testId", "orderNum"`);

  const byTest = {};
  qs.rows.forEach((q) => { (byTest[q.testId] = byTest[q.testId] || []).push(q); });

  const dump = { generatedAt: new Date().toISOString(), tests: [] };
  const problems = [];
  let totalQ = 0, totalTests = 0;

  for (const t of tests.rows) {
    totalTests++;
    const questions = byTest[t.id] || [];
    totalQ += questions.length;
    const tEntry = { ...t, questions: [] };
    const pCount = { q: 0 };

    const addP = (orderNum, kind, detail) => { problems.push(`[${t.title} #${orderNum}] ${kind}: ${detail}`); pCount.q++; };

    // orderNum continuity
    const nums = questions.map((q) => q.orderNum);
    const expected = nums.length ? Array.from({ length: nums.length }, (_, i) => i) : [];
    if (JSON.stringify(nums) !== JSON.stringify(expected)) {
      problems.push(`[${t.title}] ORDERNUM: not contiguous 0..N-1 (${questions.length} q, min=${Math.min(...nums, 0)}, max=${Math.max(...nums, 0)})`);
      pCount.q++;
    }

    questions.forEach((q) => {
      // dump entry (compact)
      tEntry.questions.push({ orderNum: q.orderNum, id: q.id, text: q.text, A: q.optionA, B: q.optionB, C: q.optionC, D: q.optionD, E: q.optionE, correct: q.correctAnswer, expl: q.explanation, tr: q.translations });

      // 1. empty text
      if (!norm(q.text)) addP(q.orderNum, 'EMPTY-TEXT', 'question text is empty');

      // 2. invalid correctAnswer letter
      const letter = norm(q.correctAnswer || '').toUpperCase();
      if (!LETTERS.includes(letter)) { addP(q.orderNum, 'BAD-LETTER', `correctAnswer=${JSON.stringify(q.correctAnswer)}`); return; }

      // 3. options present + empty check (A-D required, E optional)
      const opts = {};
      LETTERS.forEach((L) => { opts[L] = q['option' + L]; });
      const usedLetters = LETTERS.filter((L) => opts[L] && norm(opts[L]));
      if (usedLetters.length < 2) { addP(q.orderNum, 'TOO-FEW-OPTIONS', `only ${usedLetters.length} non-empty options`); return; }
      ['A', 'B', 'C', 'D'].forEach((L) => {
        const idx = usedLetters.indexOf(L);
        // required letters: A..D only if they come before the last used letter (e.g. 4 options => A-D all required)
        if (idx >= 0 && L !== 'E' && !opts[L]) return;
      });
      // gap check: e.g. A,B,D non-empty but C empty
      const maxUsed = usedLetters[usedLetters.length - 1];
      LETTERS.slice(0, LETTERS.indexOf(maxUsed) + 1).forEach((L) => {
        if (!opts[L] || !norm(opts[L])) addP(q.orderNum, 'OPTION-GAP', `option${L} empty but option${maxUsed} used`);
      });

      // 4. correctAnswer -> empty option
      if (!opts[letter] || !norm(opts[letter])) addP(q.orderNum, 'CORRECT-EMPTY', `correctAnswer=${letter} but option${letter} is empty`);

      // 5. duplicate options
      const seen = new Map();
      usedLetters.forEach((L) => {
        const k = norm(opts[L]);
        if (seen.has(k)) addP(q.orderNum, 'DUPLICATE-OPTION', `option${L} == option${seen.get(k)} ("${k.slice(0, 50)}")`);
        else seen.set(k, L);
      });

      // 6. translations structure
      const tr = q.translations;
      if (tr && typeof tr === 'object') {
        for (const lg of Object.keys(tr)) {
          const tro = tr[lg] && tr[lg].options;
          if (!tro) continue;
          const trLetters = Object.keys(tro).map((x) => x.toUpperCase());
          usedLetters.forEach((L) => {
            if (!trLetters.includes(L)) addP(q.orderNum, 'TR-MISSING', `${lg}.options.${L} missing (option ${L} exists in EN)`);
          });
          // translated option at the correct letter must be non-empty
          if (trLetters.includes(letter) && !norm(tro[letter] || '')) addP(q.orderNum, 'TR-CORRECT-EMPTY', `${lg}.options.${letter} empty`);
        }
      }
    });

    dump.tests.push(tEntry);
  }

  // save dump
  const dumpPath = `/home/z/my-project/uuu/backup/db-dump-audit.json`;
  fs.writeFileSync(dumpPath, JSON.stringify(dump));
  console.log(`tests=${totalTests} questions=${totalQ}`);
  console.log(`structural problems: ${problems.length}`);
  problems.forEach((p) => console.log('  ' + p));
  if (!problems.length) console.log('ALL CLEAN');

  await c.end();
})().catch((e) => { console.error('DB ERROR:', e.message); process.exit(1); });
