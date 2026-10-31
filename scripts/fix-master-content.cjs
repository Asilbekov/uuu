/**
 * MASTER FIX — all manually confirmed corrections. DRY RUN default.
 * node fix_master.cjs          -> dry run (print plan)
 * node fix_master.cjs --apply  -> write to DB + update seed source files
 * Every change backed up to backup/master-fix-<ts>.json
 */
const fs = require('fs');
const { Client } = require('pg');
const env = fs.readFileSync('/home/z/my-project/uuu/.env', 'utf8');
const url = env.match(/^DATABASE_URL=(.*)$/m)[1].trim();
const APPLY = process.argv.includes('--apply');

// ---------- new option values ----------
const PM = (a, b) => `$\\begin{pmatrix}${a}\\\\${b}\\end{pmatrix}$`;

const FIXES = {
  'Physics: Final': {
    'cmq3oq9cd0001ihnme6e4bv31': {
      1: { correct: 'C', options: {
        B: '$v = 10^{2}$ m/s', C: '$v = 10^{3}$ m/s', D: '$v = 10^{4}$ m/s',
      }, trSame: true },
      27: { options: {
        A: '$\\Delta S = 2.5 \\cdot 8.31 \\cdot \\ln 2\\ \\frac{J}{K}$',
        B: '$\\Delta S = 8.31 \\cdot \\ln 2\\ \\frac{J}{K}$',
      }, trSame: true },
      32: { options: {
        C: '$\\Delta U = \\frac{3}{2} R \\Delta T$',
        D: '$\\Delta U = \\frac{C}{n} \\Delta T$',
      }, trSame: true },
      33: { options: { B: '$T = 0.26s$; $d = 0.03m$' }, trSame: true },
      34: { options: {
        A: 'T = $2π√(I / Mgd)$', B: 'T = $2π√(Mgd / I)$',
        C: 'T = $2π√(Id / Mg)$', D: 'T = $2π√(d / g)$',
      }, trSame: true },
      51: { options: {
        A: 'd²x(t)/dt² $+\\frac{9η}{2r^{2}} \\frac{dx(t)}{dt} = -(1-ρ_{0}/ρ)g$',
      }, trSame: true },
      52: { options: { A: 'I = $1\\over 3$ mL² + $2\\over 5$ MR² + ML²' }, trSame: true },
      64: { options: { B: '$15$ m/s', C: '$0.55$ m/s', D: '$27.5$ m/s' }, trSame: true },
      105: { options: { D: 'q = − $16\\eta L$' }, trSame: true },
      135: { options: { B: '$V(r) = -\\gamma/r^{2}$', C: '$V(r) = -\\gamma/r$' }, trSame: true },
      158: { options: { D: '$Q_{1} = Q_{2} + Q_{3}$' }, trSame: true },
      181: { correct: 'C' },
      186: { options: {
        B: 'The variation it undergoes during a transformation from state A to state B depends on the particular path followed',
        C: 'The variation it undergoes during a transformation from state A to state B depends only on the initial state A',
        D: 'The variation it undergoes during a transformation from state A to state B is always zero',
      } },
    },
  },
  'Physics: Complete Test': {
    'cmpa6v6y1004nje6h3kl0szpp': {
      30: { options: { B: 'Ice is melted in water in an insulated container, the net entropy decreases' } },
      38: { options: { D: 'both do not depend on the temperature, their variations are always smaller than zero' } },
      66: { options: { C: '$x(t) = \\frac{\\ln(v_0kt + 1)}{k}$, $v(t) = \\frac{v_0}{v_0kt - 1}$' }, trSame: true },
      70: { options: {
        A: 'x(t)=\\frac{\\ln(v_0kt - 1)}{k}, v(t)=\\frac{v_{0}}{(v_0kt + 1)}$',
        B: 'x(t)=\\frac{\\ln(v_0kt + 1)}{k}, v(t)=\\frac{v_{0}}{(v_0kt + 1)}$',
        C: 'x(t)=\\frac{\\ln(v_0kt + 1)}{k}, v(t)=\\frac{v_{0}}{(1 - v_0kt)}$',
      }, trSame: true },
      115: { options: { D: '$T = 2\\pi\\sqrt{\\frac{r^{3}}{\\gamma (M + m)}}$' }, trSame: true },
      116: { options: { C: 'x(t)=ln($v_{0}kt + 1$)/k, v(t) = $v_{0}/(v_{0}kt - 1)$' }, trSame: true },
      139: { options: { B: '$T = 0.26 s$; $d = 0.03 m$' }, trSame: true },
      140: { options: { C: 'x(t)=ln($v_{0}kt + 1$)/k, v(t) = $v_{0}/(v_{0}kt - 1)$' }, trSame: true },
    },
  },
  'Math I: Weeks 1-4 Complete Test': {
    'cmvv6tsch0001q5j3uaypuuoi': {
      59: { options: { B: '2, 2, 2, 1, 2' }, trSame: true },
    },
  },
  'Linear Algebra I: Weeks 1-4 Complete Test': {
    'cmvv6tsuq004bq5j39vddoooq': {
      99: {
        options: {
          B: `c = 6; for c ≠ 6, x = ${PM('(c+2)/(c-6)', '2/(c-6)')}`,
          D: `c = 3; for c ≠ 3, x = ${PM('(4c-20)/(c-3)', '(-2)/(c-3)')}`,
        },
        tr: {
          ru: {
            B: `c = 6; для c ≠ 6, x = ${PM('(c+2)/(c-6)', '2/(c-6)')}`,
            D: `c = 3; для c ≠ 3, x = ${PM('(4c-20)/(c-3)', '(-2)/(c-3)')}`,
          },
          uz: {
            B: `c = 6; c ≠ 6 uchun x = ${PM('(c+2)/(c-6)', '2/(c-6)')}`,
            D: `c = 3; c ≠ 3 uchun x = ${PM('(4c-20)/(c-3)', '(-2)/(c-3)')}`,
          },
        },
      },
    },
  },
};

// text-match fixes applied to every copy (Templates) — exact EN option old -> new
const TEXT_SWEEPS = [
  { matchTextIncludes: 'piecewise function with $y = x + 1$ up to (1, 2)',
    oldOption: '2, 2, 2, 1, 1', newOption: '2, 2, 2, 1, 2', letters: ['B'], trSame: true },
];

// Generic de-duplication for the singular-matrix question: layouts differ per
// copy (main test: A==B correct + C==D wrong, correct=A; Templates: A==C
// correct + B==D wrong, correct=C). Rule: keep the CORRECT text on the
// question's own correctAnswer letter, differentiate its twin; keep the first
// wrong twin, differentiate the second.
const CORRECT_TEXT = `c = 6; for c ≠ 6, x = ${PM('(c-2)/(c-6)', '(-2)/(c-6)')}`;
const VARIANT_X = `c = 6; for c ≠ 6, x = ${PM('(c+2)/(c-6)', '2/(c-6)')}`;
const WRONG_TEXT = `c = 3; for c ≠ 3, x = ${PM('(4c-20)/(c-6)', '(-2)/(c-6)')}`;
const VARIANT_Y = `c = 3; for c ≠ 3, x = ${PM('(4c-20)/(c-3)', '(-2)/(c-3)')}`;
const TR_PREFIX = { ru: { 'c = 6; for c ≠ 6': 'c = 6; для c ≠ 6', 'c = 3; for c ≠ 3': 'c = 3; для c ≠ 3' },
                    uz: { 'c = 6; for c ≠ 6': 'c = 6; c ≠ 6 uchun', 'c = 3; for c ≠ 3': 'c = 3; c ≠ 3 uchun' } };
function trVariant(lang, v) {
  for (const [en, tr] of Object.entries(TR_PREFIX[lang])) {
    if (v.startsWith(en.split(';')[0])) return v.replace(en, tr);
  }
  return v;
}

(async () => {
  const c = new Client({ connectionString: url });
  await c.connect();
  const backup = [];
  const log = [];

  // ---------- per-test fixes ----------
  for (const [title, tests] of Object.entries(FIXES)) {
    for (const [testId, questions] of Object.entries(tests)) {
      for (const [orderNum, fix] of Object.entries(questions)) {
        const r = await c.query(
          `SELECT id, text, "optionA","optionB","optionC","optionD","optionE","correctAnswer", translations
             FROM "Question" WHERE "testId"=$1 AND "orderNum"=$2`, [testId, Number(orderNum)]);
        const q = r.rows[0];
        if (!q) { log.push(`!! NOT FOUND [${title} #${orderNum}]`); continue; }
        const updates = {};
        const before = { id: q.id, test: title, orderNum: Number(orderNum), options: {}, correct: q.correctAnswer, translations: q.translations };
        ['A','B','C','D','E'].forEach((L) => before.options[L] = q['option' + L]);

        if (fix.correct && fix.correct !== q.correctAnswer) updates.correctAnswer = fix.correct;
        if (fix.options) {
          for (const [L, v] of Object.entries(fix.options)) {
            if (q['option' + L] !== v) updates['option' + L] = v;
          }
        }
        // translations
        const tr = q.translations && typeof q.translations === 'object' ? { ...q.translations } : null;
        let trChanged = false;
        if (tr) {
          for (const lg of ['ru', 'uz']) {
            if (!tr[lg] || !tr[lg].options) continue;
            const trOpts = { ...tr[lg].options };
            if (fix.trSame && fix.options) {
              for (const [L] of Object.entries(fix.options)) {
                if (trOpts[L] !== undefined && trOpts[L] !== fix.options[L]) { trOpts[L] = fix.options[L]; trChanged = true; }
              }
            }
            if (fix.tr && fix.tr[lg]) {
              for (const [L, v] of Object.entries(fix.tr[lg])) {
                if (trOpts[L] !== v) { trOpts[L] = v; trChanged = true; }
              }
            }
            tr[lg] = { ...tr[lg], options: trOpts };
          }
          if (trChanged) updates.translations = JSON.stringify(tr);
        }
        if (Object.keys(updates).length) {
          backup.push(before);
          log.push(`[${title} #${orderNum}] ${Object.keys(updates).join(', ')}`);
          if (APPLY) {
            const sets = Object.keys(updates).map((k, i) => `"${k === 'translations' ? 'translations' : k}"=$${i + 1}`).join(', ');
            await c.query(`UPDATE "Question" SET ${sets} WHERE id=$${Object.keys(updates).length + 1}`, [...Object.values(updates), q.id]);
          }
        } else {
          log.push(`[${title} #${orderNum}] already consistent (skip)`);
        }
      }
    }
  }

  // ---------- mirror Final #91 from Complete #15 ----------
  {
    const src = await c.query(
      `SELECT q."optionA","optionB","optionC","optionD", q."correctAnswer", q.explanation, q.translations
         FROM "Question" q JOIN "Test" t ON t.id=q."testId"
        WHERE t.title='Physics: Complete Test' AND q."orderNum"=15`);
    const dst = await c.query(
      `SELECT q.id, q."optionA","optionB","optionC","optionD", q."correctAnswer", q.explanation, q.translations
         FROM "Question" q JOIN "Test" t ON t.id=q."testId"
        WHERE t.title='Physics: Final' AND q."orderNum"=91`);
    if (src.rows[0] && dst.rows[0]) {
      const s = src.rows[0], d = dst.rows[0];
      backup.push({ id: d.id, test: 'Physics: Final', orderNum: 91, options: { A: d.optionA, B: d.optionB, C: d.optionC, D: d.optionD }, correct: d.correctAnswer, explanation: d.explanation, translations: d.translations });
      log.push('[Physics: Final #91] mirror options/explanation/translations from Complete #15 (correct stays ' + s.correctAnswer + ')');
      if (APPLY) {
        await c.query(
          `UPDATE "Question" SET "optionA"=$1,"optionB"=$2,"optionC"=$3,"optionD"=$4,"correctAnswer"=$5,explanation=$6,translations=$7 WHERE id=$8`,
          [s.optionA, s.optionB, s.optionC, s.optionD, s.correctAnswer, s.explanation, JSON.stringify(s.translations), d.id]);
      }
    }
  }
  // ---------- mirror Final #145 from Complete #42 ----------
  {
    const src = await c.query(
      `SELECT q."optionA","optionB","optionC","optionD", q.translations
         FROM "Question" q JOIN "Test" t ON t.id=q."testId"
        WHERE t.title='Physics: Complete Test' AND q."orderNum"=42`);
    const dst = await c.query(
      `SELECT q.id, q."optionA","optionB","optionC","optionD", q.translations
         FROM "Question" q JOIN "Test" t ON t.id=q."testId"
        WHERE t.title='Physics: Final' AND q."orderNum"=145`);
    if (src.rows[0] && dst.rows[0]) {
      const s = src.rows[0], d = dst.rows[0];
      backup.push({ id: d.id, test: 'Physics: Final', orderNum: 145, options: { A: d.optionA, B: d.optionB, C: d.optionC, D: d.optionD }, translations: d.translations });
      log.push('[Physics: Final #145] mirror LaTeX options from Complete #42');
      if (APPLY) {
        await c.query(`UPDATE "Question" SET "optionA"=$1,"optionB"=$2,"optionC"=$3,"optionD"=$4,translations=$5 WHERE id=$6`,
          [s.optionA, s.optionB, s.optionC, s.optionD, JSON.stringify(s.translations), d.id]);
      }
    }
  }

  // ---------- text sweeps (Templates etc.) ----------
  for (const sweep of TEXT_SWEEPS) {
    const r = await c.query(
      `SELECT q.id, t.title, q."orderNum", q."optionA","optionB","optionC","optionD", q.translations
         FROM "Question" q JOIN "Test" t ON t.id=q."testId"
        WHERE q.text LIKE $1`, ['%' + sweep.matchTextIncludes + '%']);
    for (const q of r.rows) {
      const updates = {};
      const before = { id: q.id, test: q.title, orderNum: q.orderNum, options: {}, translations: q.translations };
      ['A','B','C','D'].forEach((L) => before.options[L] = q['option' + L]);
      for (const L of sweep.letters) {
        const newVal = sweep.newByLetter ? sweep.newByLetter[L] : sweep.newOption;
        if (q['option' + L] && q['option' + L] !== newVal) updates['option' + L] = newVal;
      }
      const tr = q.translations && typeof q.translations === 'object' ? { ...q.translations } : null;
      let trChanged = false;
      if (tr) {
        for (const lg of ['ru', 'uz']) {
          if (!tr[lg] || !tr[lg].options) continue;
          const trOpts = { ...tr[lg].options };
          for (const L of sweep.letters) {
            const newVal = sweep.trByLetter ? sweep.trByLetter[lg][L] : sweep.newOption;
            if (trOpts[L] !== undefined && trOpts[L] !== newVal) { trOpts[L] = newVal; trChanged = true; }
          }
          tr[lg] = { ...tr[lg], options: trOpts };
        }
        if (trChanged) updates.translations = JSON.stringify(tr);
      }
      if (Object.keys(updates).length) {
        backup.push(before);
        log.push(`[sweep ${q.title} #${q.orderNum}] ${Object.keys(updates).join(', ')}`);
        if (APPLY) {
          const sets = Object.keys(updates).map((k, i) => `"${k}"=$${i + 1}`).join(', ');
          await c.query(`UPDATE "Question" SET ${sets} WHERE id=$${Object.keys(updates).length + 1}`, [...Object.values(updates), q.id]);
        }
      }
    }
  }

  // ---------- generic de-duplication: singular-matrix question ----------
  {
    const r = await c.query(
      `SELECT q.id, t.title, q."orderNum", q."optionA","optionB","optionC","optionD", q."correctAnswer", q.translations
         FROM "Question" q JOIN "Test" t ON t.id=q."testId"
        WHERE q.text LIKE '%For which value(s) of c is A%'`);
    for (const q of r.rows) {
      const letters = ['A', 'B', 'C', 'D'];
      const opts = {}; letters.forEach((L) => { opts[L] = q['option' + L]; });
      const ctLetters = letters.filter((L) => opts[L] === CORRECT_TEXT);
      const wtLetters = letters.filter((L) => opts[L] === WRONG_TEXT);
      if (ctLetters.length < 2 && wtLetters.length < 2) { log.push(`[dedup ${q.title} #${q.orderNum}] no duplicates (skip)`); continue; }
      const correctLetter = (q.correctAnswer || '').toUpperCase();
      const updates = {};
      const before = { id: q.id, test: q.title, orderNum: q.orderNum, options: { ...opts }, correct: q.correctAnswer, translations: q.translations };
      if (ctLetters.length >= 2) {
        const keep = ctLetters.includes(correctLetter) ? correctLetter : ctLetters[0];
        for (const L of ctLetters) if (L !== keep) updates['option' + L] = VARIANT_X;
      }
      if (wtLetters.length >= 2) {
        for (let i = 1; i < wtLetters.length; i++) updates['option' + wtLetters[i]] = VARIANT_Y;
      }
      // translations follow the same letters
      const tr = q.translations && typeof q.translations === 'object' ? { ...q.translations } : null;
      let trChanged = false;
      if (tr) {
        for (const lg of ['ru', 'uz']) {
          if (!tr[lg] || !tr[lg].options) continue;
          const trOpts = { ...tr[lg].options };
          for (const [L, v] of Object.entries(updates)) {
            const key = L.replace('option', '');
            if (trOpts[key] !== undefined) { trOpts[key] = trVariant(lg, v); trChanged = true; }
          }
          tr[lg] = { ...tr[lg], options: trOpts };
        }
        if (trChanged) updates.translations = JSON.stringify(tr);
      }
      if (Object.keys(updates).length) {
        backup.push(before);
        log.push(`[dedup ${q.title} #${q.orderNum}] ${Object.keys(updates).join(', ')} (correct=${correctLetter} kept on its text)`);
        if (APPLY) {
          const sets = Object.keys(updates).map((k, i) => `"${k}"=$${i + 1}`).join(', ');
          await c.query(`UPDATE "Question" SET ${sets} WHERE id=$${Object.keys(updates).length + 1}`, [...Object.values(updates), q.id]);
        }
      }
    }
  }

  console.log(`\n=== ${APPLY ? 'APPLIED' : 'DRY RUN'}: ${backup.length} questions to change ===`);
  log.forEach((l) => console.log('  ' + l));
  if (backup.length) {
    fs.mkdirSync('/home/z/my-project/uuu/backup', { recursive: true });
    const p = `/home/z/my-project/uuu/backup/master-fix-${Date.now()}.json`;
    fs.writeFileSync(p, JSON.stringify(backup, null, 1));
    console.log('backup:', p);
  }
  await c.end();
})().catch((e) => { console.error('DB ERROR:', e.message); process.exit(1); });
