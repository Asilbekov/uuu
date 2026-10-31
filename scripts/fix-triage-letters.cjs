/**
 * FINAL TRIAGE FIX — 17 manually verified corrections (letters + 1 option restore).
 * Every change backed up. DRY RUN default; --apply writes.
 */
const fs = require('fs');
const { Client } = require('pg');
const env = fs.readFileSync('/home/z/my-project/uuu/.env', 'utf8');
const url = env.match(/^DATABASE_URL=(.*)$/m)[1].trim();
const APPLY = process.argv.includes('--apply');

(async () => {
  const c = new Client({ connectionString: url });
  await c.connect();
  const backup = [];
  const log = [];

  async function fixLetter(title, orderNum, from, to, note) {
    const r = await c.query(
      `SELECT q.id, q."correctAnswer", q."optionA",q."optionB",q."optionC",q."optionD"
         FROM "Question" q JOIN "Test" t ON t.id=q."testId"
        WHERE t.title=$1 AND q."orderNum"=$2`, [title, orderNum]);
    for (const q of r.rows) {
      if (q.correctAnswer !== from) { log.push(`  !! [${title} #${orderNum}] expected ${from}, found ${q.correctAnswer} (skip)`); continue; }
      backup.push({ id: q.id, test: title, orderNum, correctAnswer: q.correctAnswer, note });
      log.push(`  [${title} #${orderNum}] ${from} -> ${to} (${note})`);
      if (APPLY) await c.query(`UPDATE "Question" SET "correctAnswer"=$1 WHERE id=$2`, [to, q.id]);
    }
  }

  // ---------- History (all 3 copies each) ----------
  for (const suffix of ['', ' · Template']) {
    const title = `History of Uzbekistan (Oʻzbekiston tarixi) — Weeks 1-4: Complete Test${suffix}`;
    await fixLetter(title, 11, 'A', 'D', 'Zamonbaba culture = Surxondaryo/Termiz, not Bukhara');
    await fixLetter(title, 27, 'A', 'B', 'Independence Declaration = 31 Aug 1991 (June 1990 = Sovereignty)');
    await fixLetter(title, 29, 'A', 'C', 'Arab invasions began 651 (course Lecture II: Merv captured 651, raids from there)');
  }

  // ---------- Chemistry ----------
  // #47: restore the lost "Osmosis" option (was "Filtration"), correct stays B
  {
    const r = await c.query(
      `SELECT q.id, q."optionB", q."correctAnswer", q.explanation, q.translations
         FROM "Question" q JOIN "Test" t ON t.id=q."testId"
        WHERE t.title='Chemistry: Complete Test' AND q."orderNum"=47`);
    const q = r.rows[0];
    if (q && q.optionB === 'Filtration') {
      backup.push({ id: q.id, test: 'Chemistry', orderNum: 47, optionB: q.optionB, explanation: q.explanation, translations: q.translations });
      log.push('  [Chemistry #47] optionB "Filtration" -> "Osmosis" (restore lost correct option)');
      let tr = q.translations;
      if (tr && typeof tr === 'object') {
        tr = { ...tr };
        for (const lg of ['ru', 'uz']) {
          if (tr[lg] && tr[lg].options) {
            tr[lg] = { ...tr[lg], options: { ...tr[lg].options, B: lg === 'ru' ? 'Осмос' : 'Osmos' } };
          }
        }
      }
      if (APPLY) {
        await c.query(`UPDATE "Question" SET "optionB"=$1, explanation=$2, translations=$3 WHERE id=$4`,
          ['Osmosis', 'Solvent movement through a semi-permeable membrane into the region of higher concentration is osmosis.', tr ? JSON.stringify(tr) : null, q.id]);
      }
    } else if (q) { log.push('  !! [Chemistry #47] optionB is not "Filtration" (skip)'); }
  }
  await fixLetter('Chemistry: Complete Test', 59, 'E', 'A', 'UF6/PuF6 rate ratio = 1.0043, not listed -> None of these');

  // ---------- Physics Qobketganlar ----------
  await fixLetter('Physics: Qobketganlar', 33, 'B', 'D', 'irreversible cycle: dS_gas=0 (state fn); universe>0 not listed');
  await fixLetter('Physics: Qobketganlar', 38, 'B', 'A', 'pendulum loses ~20 s/day (their 2.0 s is an arithmetic slip)');

  // ---------- Physics Final (post-renumber positions) ----------
  await fixLetter('Physics: Final', 2, 'B', 'C', 'a=m1g/(m1+m2+I/R^2)=0.126 m/s^2, alpha=0.64');
  await fixLetter('Physics: Final', 4, 'C', 'D', 'momentum then energy: theta=53.1 deg (cos=0.6)');
  await fixLetter('Physics: Final', 20, 'B', 'A', 'inside homogeneous sphere: G(r)=-GM r/R^3 (their own explanation)');
  await fixLetter('Physics: Final', 29, 'B', 'D', 'cycle: dS_gas=0; irreversible -> universe>0');
  await fixLetter('Physics: Final', 38, 'D', 'C', 'x"=2x, y"=-4y, z"=6z (F=k(2x,-4y,6z), m=2)');
  await fixLetter('Physics: Final', 54, 'A', 'D', 'isochoric heating: dU=Q!=0 (A violates first law)');
  await fixLetter('Physics: Final', 55, 'D', 'C', 'whole path returns to Ta -> dU=0');
  await fixLetter('Physics: Final', 75, 'D', 'C', 'adiabatic compression work = -281 kJ (matches Complete #91)');
  await fixLetter('Physics: Final', 95, 'D', 'B', 'doubled V with strong cooling can lower S -> not determined');
  await fixLetter('Physics: Final', 183, 'C', 'A', 'SHM: x=A cos(wt+phi), w=sqrt(k/m); C has phi outside');

  // ---------- Physics Complete ----------
  await fixLetter('Physics: Complete Test', 90, 'A', 'C', 'both adiabatic laws DO hold (equivalent via pV=nRT)');

  console.log(`\n=== ${APPLY ? 'APPLIED' : 'DRY RUN'} ===`);
  log.forEach((l) => console.log(l));
  console.log(`total letter fixes: ${backup.filter(b => b.correctAnswer).length}, option restores: ${backup.filter(b => !b.correctAnswer).length}`);
  if (backup.length) {
    fs.mkdirSync('/home/z/my-project/uuu/backup', { recursive: true });
    const p = `/home/z/my-project/uuu/backup/triage-fix-${Date.now()}.json`;
    fs.writeFileSync(p, JSON.stringify(backup, null, 1));
    console.log('backup:', p);
  }
  await c.end();
})().catch((e) => { console.error('DB ERROR:', e.message); process.exit(1); });
