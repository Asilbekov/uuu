// Debug tokenizer behavior on specific strings
const path = require('path');
// extract functions from the main script by requiring it? It's a script, so copy needed parts via eval-free approach:
// simpler: read the file, extract functions via regex... simplest: just re-require katex and paste minimal harness
const FS = require('fs');
const src = FS.readFileSync('/home/z/my-project/repo-uuu/scripts/latexify-deterministic.cjs', 'utf8');
const code = src
  .replace(/const \{ PrismaClient \} = require\('@prisma\/client'\);[\s\S]*?const prisma = new PrismaClient\(\{ datasources: \{ db: \{ url: DB_URL \} \} \}\);/, 'const prisma = null;')
  .replace(/\nmain\(\)[\s\S]*$/, '\nmodule.exports = { latexifyString, tokenize, wrapRuns, convertFractions };');
FS.writeFileSync('/home/z/my-project/repo-uuu/scripts/.latexify-lib.cjs', code);
const lib = require('/home/z/my-project/repo-uuu/scripts/.latexify-lib.cjs');

const tests = [
  'det(A) = (-1)² * det(U) = 1 * 6 = 6.',
  'Let A be a real 6 × 6 non-null symmetric matrix with zero trace and determinant. Find the right statement.',
  'dim(Ker f) = 1',
  'dim(Ker(f)) = 2',
  'h = 37.2 m',
  'v = 40m/s',
  'F = d(mv)/dt',
  'x=5; x=ln(15)/3; x=-ln(10)/(4ln(3))',
  'a. x=5; b. x=ln(15)/3; c. x=-ln(10)/(4ln(3)); d. x=3/2; e. x=140/3; f. x=log(7.21)',
  'z1 + z2 = 4 − 2i, z1 − z2 = 2 + 6i, z1 z2 = 11 − 10i, z1/z2 = −5/17 + 14/17 i',
  'Q = 1.02·105J; ∆S = 95.1J/K',
  'V = 3.0·10⁻³m³; T = 300K; W = −254J',
  'Ix=20 kg m²; Iy=48 kg m²; Iz=68 kg m²',
  'x(t)=-exp(-kt)/k-t; v(t)=exp(-kt)-1',
  'lim_{x→3^-} f(x) = 7, lim_{x→3^+} f(x) = 9',
  'There exists a unique plane containing r and orthogonal to vector v=(1,−1,1)',
  '2v1 + v2 = (-2, 7), -v1 + 3v2 = (11, 13), 4v1 - 2v2 = (-12, -18), 0v1 + 5v2 = (0, 0)',
  'proj_v u = (22/5, -11/5), u − proj is not orthogonal to v',
  '-u + 3v = (5, -5, 1); cu + dv = (c - 2d, 2c + d, -c); no, because c ≠ 1',
  'Q₁/T₁ + Q₂/T₂ + Q₃/T₃ > 0',
  'dim(U ∩ V) ≥ 2',
  'R₂ < R₁',
  'W = 0.26J',
  'T_F = 390.66 K',
  '(d) the maximum height reached by the object is maximum for an initial angle equal to π/4',
  '4^3 = 81',
  '+∞',
  'u · v = -2, angle is obtuse',
  'x = t(1,-2), columns are dependent because there exists a nontrivial combination that gives zero',
  '2/3',
  'ΔS_U = 19.7 J/K',
  '20.2 kJ/s',
  '9.8 m/s^2',
  'If xy≠0, then f(x,y)>0',
  'If k ≠ 2 the system admits only one solution.',
  '(a) If k = 2 the system admits ∞² solutions.',
];

for (const t of tests) {
  const out = lib.latexifyString(t);
  console.log('IN :', t);
  console.log('OUT:', out === null ? '(unchanged)' : out);
  console.log('---');
}
