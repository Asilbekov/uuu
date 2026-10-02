const { PrismaClient } = require('@prisma/client');
const katex = require('katex');
process.env.DATABASE_URL = 'postgresql://neondb_owner:npg_omga5szZAf4l@ep-shiny-paper-aousfq8l-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const db = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });

// Mirror the UPDATED client-side MathText normalization (rowsep protection)
function normalize(text) {
  let t = text.replace(/\\\$/g, '\u0001');
  const ROWSEP = '\u0002';
  t = t.replace(/\\\\/g, ROWSEP);
  t = t.replace(/\\\(/g, '$').replace(/\\\)/g, '$')
       .replace(/\\\[([\s\S]*?)\\\]/g, (m, i) => `$$${i}$$`);
  t = t.split(ROWSEP).join('\\\\');
  return t;
}

async function main() {
  const questions = await db.question.findMany({});
  let mathSegments = 0, failedSegments = 0;
  const failSamples = [];
  const fields = ['text', 'optionA', 'optionB', 'optionC', 'optionD', 'optionE', 'explanation'];
  for (const q of questions) {
    for (const f of fields) {
      const v = q[f];
      if (!v || !v.includes('$')) continue;
      const norm = normalize(v);
      const parts = norm.split(/(\$\$[\s\S]+?\$\$|\$[^\u0001$\n]+?\$)/g);
      parts.forEach((p, i) => {
        if (i % 2 !== 1 || p === '') return;
        mathSegments++;
        let latex = p.startsWith('$$') ? p.slice(2, -2) : p.slice(1, -1);
        try {
          katex.renderToString(latex.trim(), { throwOnError: true, strict: false });
        } catch (e) {
          failedSegments++;
          if (failSamples.length < 10) failSamples.push({ id: q.id, field: f, latex: latex.slice(0, 80), err: String(e.message).slice(0, 100) });
        }
      });
    }
  }
  console.log('Total math segments:', mathSegments);
  console.log('KaTeX FAILURES     :', failedSegments);
  failSamples.forEach(s => console.log(`• ${s.id} [${s.field}] ${JSON.stringify(s.latex)} -> ${s.err}`));
}
main().catch(console.error).finally(() => db.$disconnect());
