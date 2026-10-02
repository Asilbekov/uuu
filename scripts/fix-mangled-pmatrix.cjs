const { PrismaClient } = require('@prisma/client');
const katex = require('katex');
process.env.DATABASE_URL = 'postgresql://neondb_owner:npg_omga5szZAf4l@ep-shiny-paper-aousfq8l-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const db = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });

const fixed = {
  optionA: '$A^{-1} = \\begin{pmatrix}\\frac{12}{8}&-\\frac{5}{8}&-\\frac{6}{8}\\\\\\frac{8}{8}&-\\frac{3}{8}&-\\frac{2}{8}\\\\-1&1&-\\frac{1}{8}\\end{pmatrix}$',
  optionB: '$A^{-1} = \\begin{pmatrix}\\frac{12}{8}&-\\frac{5}{8}&-\\frac{6}{8}\\\\\\frac{8}{8}&-\\frac{3}{8}&-\\frac{2}{8}\\\\1&-1&\\frac{1}{8}\\end{pmatrix}$',
  optionC: '$A^{-1} = \\begin{pmatrix}\\frac{12}{8}&-\\frac{5}{8}&-\\frac{6}{8}\\\\-\\frac{8}{8}&\\frac{3}{8}&\\frac{2}{8}\\\\-1&1&-\\frac{1}{8}\\end{pmatrix}$',
  optionD: '$A^{-1} = \\begin{pmatrix}\\frac{12}{8}&-\\frac{5}{8}&-\\frac{6}{8}\\\\\\frac{8}{8}&-\\frac{3}{8}&-\\frac{2}{8}\\\\-1&1&\\frac{1}{8}\\end{pmatrix}$',
};

async function main() {
  // Validate with KaTeX first (fail-safe: abort if any is invalid)
  for (const [k, v] of Object.entries(fixed)) {
    const latex = v.slice(1, -1);
    katex.renderToString(latex, { throwOnError: true, strict: false });
    console.log(`${k} OK`);
  }
  // Also verify the colliding record now parses (with rowsep-protection emulation)
  const q2 = await db.question.findUnique({ where: { id: 'cmuq34n8c006cqz2wwz7mnmdg' } });
  const ROWSEP = '\u0002';
  const emul = q2.optionA.replace(/\\\$/g, '\u0001').replace(/\\\\/g, ROWSEP)
    .replace(/\\\(/g, '$').replace(/\\\)/g, '$');
  const m = emul.match(/\$([^\u0001$\n]+?)\$/);
  const latex2 = m[1].split(ROWSEP).join('\\\\');
  katex.renderToString(latex2, { throwOnError: true, strict: false });
  console.log('collision record optionA OK with rowsep fix:', JSON.stringify(latex2.slice(0, 60)) + '...');

  await db.question.update({ where: { id: 'cmuq34nbr0076qz2wornua4w0' }, data: fixed });
  console.log('DB UPDATED: cmuq34nbr0076qz2wornua4w0 options A-D rewritten');
}
main().catch(e => { console.error('FAILED:', e.message); process.exit(1); }).finally(() => db.$disconnect());
