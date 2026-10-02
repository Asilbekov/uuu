#!/usr/bin/env node
/**
 * Deterministic plain-text math -> LaTeX converter for question/options/explanations.
 * - No external API. Idempotent (strings with LaTeX are skipped).
 * - Safety: every produced $...$ segment is validated with KaTeX; if it fails to render, the string is left unchanged.
 * Usage:
 *   node scripts/latexify-deterministic.cjs            # dry run: prints samples, writes proposals file, NO db writes
 *   node scripts/latexify-deterministic.cjs --apply    # writes to DB
 *   node scripts/latexify-deterministic.cjs --apply --test=<id> --limit=N
 */
const DB_URL = 'postgresql://neondb_owner:npg_omga5szZAf4l@ep-shiny-paper-aousfq8l-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const FS = require('fs');
const katex = require('katex');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: DB_URL } } });

// ---------- char sets ----------
const SUP_MAP = { '⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁺':'+','⁻':'-','⁼':'=','ⁿ':'n','ⁱ':'i' };
const SUB_MAP = { '₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9','₊':'+','₋':'-','₌':'=' };
const UNITS = new Set(['m','cm','mm','km','dm','nm','um','kg','g','mg','s','ms','h','hr','min','sec','J','kJ','MJ','mJ','K','N','kN','MN','Pa','kPa','MPa','W','kW','MW','V','mV','kV','A','mA','C','mC','mol','mmol','M','L','mL','ml','Hz','kHz','MHz','rad','deg','atm','bar','cal','kcal','eV','keV','MeV','T','mT','F','uF','cd','lm','lx','Bq','Gy','Sv','Ω','ohm']);
// commands KaTeX actually supports
const FUNCS = new Set(['ln','log','exp','sqrt','sin','cos','tan','cot','arcsin','arccos','arctan','lim','max','min','dim','det','mod','gcd']);
const FUNC_SRC = new Set(['ln','log','exp','sqrt','sin','cos','tan','ctg','arcsin','arccos','arctan','lim']);
const STOP1 = new Set([]);
const STOP2 = new Set(['to','of','in','on','at','is','it','as','by','or','an','be','we','if','do','no','so','up','us','my','he','me','ah','ok','vs','eg','ie','am','pm']);
// common english words (checked case-insensitively) that must never be inside a math run
const STOP3 = new Set(['the','this','that','these','those','then','than','when','what','which','with','without','for','and','but','not','are','was','were','been','its','his','her','has','have','had','from','into','onto','only','also','each','some','such','because','since','while','where','whose','given','let','find','solve','compute','determine','consider','suppose','calculate','evaluate','hence','therefore','thus','now','here','there','exist','exists','exist','one','two','both','either','neither','none','will','would','should','could','must','may','can','cannot','equal','equals','value','values','case','cases','statement','statements','following','question','options','answer','answers','correct','incorrect','true','false','system','matrix','matrices','vector','vectors','line','plane','point','points','set','sets','solution','solutions','equation','equations','function','functions','number','numbers','real','integer','integers','sequence','series','polynomial','root','roots','angle','angles','side','sides','triangle','circle','square','limit','limits','derivative','integral','sum','product','difference','between','among','over','under','above','below','after','before','during','through','about','against','another','other','others','same','own','very','just','even','still','yet','already','always','never','often','sometimes','usually','always','infinitely','many','much','more','most','less','least','least','several','few','enough','possible','impossible','unique','parallel','perpendicular','orthogonal','dependent','independent','consistent','inconsistent','homogeneous','nonzero','non-zero','symmetric','invertible','singular','linear','quadratic','exponential','logarithmic','trigonometric']);
const CHEM_RE = /(^|[\s(,;])(?:[A-Z][a-z]?\d*[₀-₉]*){2,}(?![a-z])/;
// extra short words that must never join a math run
for (const w of ['per','via','due','use','get','new','old','end','top','big','low','key','air','gas','oil','ice','sun','dog','cat','car','bus','our','way','min','sec','hr','day','its','his','her','was','has','had','not','but','and','for','are','the']) STOP3.add(w);

const OPS_CHARS = '+-−*/=<>≤≥≠≈±×·÷^~()[]{},|∞√→∈∩∪∈⊥°′:_⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ⁺⁻⁼ⁱ₀₁₂₃₄₅₆₇₈₉₊₋₌';

function hasLatex(s) {
  if (!s) return false;
  return s.includes('$');
}

// words included in math runs but NOT backslash-converted (no KaTeX command exists)
const PLAIN_INCL = new Set(['proj','rank','const','diag','adj','comp','span','sgn','lcm']);

function validAtomWord(w) {
  if (!w) return false;
  if (/^[0-9]+(\.[0-9]+)?$/.test(w)) return true;
  if (/^[a-zA-ZΔ∆π√][₀-₉0-9.]{0,3}'?$/.test(w)) return true;
  if (/^√[0-9a-zA-Z.]+$/.test(w)) return true;
  const bare = w.replace(/^\\/, '');
  if (STOP3.has(bare.toLowerCase())) return false;
  if (FUNCS.has(bare) || FUNC_SRC.has(bare)) return true;
  if (PLAIN_INCL.has(bare)) return true;
  if (UNITS.has(w)) return true;
  if (/^[a-zA-Z]{1,3}$/.test(w)) return true; // juxtaposition vars: dt, mv, dx
  return false;
}

function convAtomText(a) {
  let t = a.trim();
  // unicode sup/sub -> ^{}/_{}
  t = t.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿⁱ⁼]+/g, m => '^{' + Array.from(m).map(c => SUP_MAP[c] ?? c).join('') + '}');
  t = t.replace(/[₀₁₂₃₄₅₆₇₈₉₊₋₌]+/g, m => '_' + Array.from(m).map(c => SUB_MAP[c] ?? c).join(''));
  // strip outer parens if content is a simple juxtaposition
  if (/^\([^()]*\)$/.test(t) && !/[+\-*/=<>≤≥≠≈,]/.test(t.slice(1, -1))) t = t.slice(1, -1);
  t = t.replace(/(?<![a-zA-Z\\])(ln|log|exp|sqrt|sin|cos|tan|ctg|arcsin|arccos|arctan)(?=\s*\()/g, (m) => m === 'ctg' ? '\\cot' : `\\${m}`);
  return t;
}

function matchGroupBack(s, closeIdx) {
  let depth = 0, k = closeIdx;
  while (k >= 0) {
    if (s[k] === ')') depth++;
    if (s[k] === '(') { depth--; if (depth === 0) return k; }
    k--;
  }
  return -1;
}
function matchGroupFwd(s, openIdx) {
  let depth = 0, k = openIdx;
  while (k < s.length) {
    if (s[k] === '(') depth++;
    if (s[k] === ')') { depth--; if (depth === 0) return k; }
    k++;
  }
  return -1;
}

function atomLeft(s, slashIdx) {
  let j = slashIdx - 1;
  while (j >= 0 && s[j] === ' ') j--;
  if (j < 0) return null;
  let start = -1;
  if (s[j] === ')') {
    const open = matchGroupBack(s, j);
    if (open < 0) return null;
    start = open;
    // function / single-letter prefix before group: d(mv), \exp(-kt)
    let e = open - 1;
    while (e >= 0 && /[a-zA-Z\\]/.test(s[e])) e--;
    const word = s.slice(e + 1, open);
    if (word && /^[\\]?[a-zA-Z]{1,7}$/.test(word)) {
      const bare = word.replace(/^\\/, '');
      if (FUNCS.has(bare) || /^[a-zA-Z]{1,2}$/.test(bare) || FUNC_SRC.has(bare)) start = e + 1;
    }
  } else {
    let e = j;
    while (e >= 0 && /[0-9a-zA-ZΔ∆π√⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ⁺⁻₀₁₂₃₄₅₆₇₈₉.]/.test(s[e])) e--;
    const word = s.slice(e + 1, j + 1);
    if (!validAtomWord(word)) {
      // retry: number glued to unit/variable, e.g. "40m/s" -> number stays outside, letter tail is the atom
      const m = word.match(/^([0-9]+(\.[0-9]+)?)([a-zA-Z]{1,2}[₀-₉0-9]{0,2})$/);
      if (!m) return null;
      start = e + 1 + m[1].length;
    } else {
      start = e + 1;
    }
    // preceding exponent: 10^5 / 2
    if (e >= 0 && s[e] === '^' && start === e + 1) {
      let k3 = e - 1;
      while (k3 >= 0 && /[0-9a-zA-Z]/.test(s[k3])) k3--;
      if (k3 === e - 1) return null;
      start = k3 + 1;
    }
  }
  // unary sign
  let k2 = start - 1;
  while (k2 >= 0 && s[k2] === ' ') k2--;
  if (k2 >= 0 && '+-−'.includes(s[k2]) && (k2 === 0 || !/[0-9a-zA-Z.)\]}]/.test(s[k2 - 1]))) {
    start = k2;
  }
  return { start, text: s.slice(start, slashIdx) };
}

function atomRight(s, slashIdx) {
  let j = slashIdx + 1;
  while (j < s.length && s[j] === ' ') j++;
  if (j >= s.length) return null;
  let end = -1;
  if (s[j] === '(') {
    const close = matchGroupFwd(s, j);
    if (close < 0) return null;
    end = close + 1;
  } else {
    let e = j;
    while (e < s.length && /[0-9a-zA-ZΔ∆π√⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ⁺⁻₀₁₂₃₄₅₆₇₈₉.]/.test(s[e])) e++;
    const word = s.slice(j, e);
    if (!validAtomWord(word)) return null;
    end = e;
  }
  // trailing exponent: s^2, 10^{23}
  if (s[end] === '^') {
    if (s[end + 1] === '{') {
      const close = s.indexOf('}', end + 1);
      if (close > 0) end = close + 1;
    } else if (/[0-9a-zA-Z]/.test(s[end + 1] || '')) {
      end += 2;
    }
  }
  return { end, text: s.slice(slashIdx + 1, end) };
}

function convertFractions(s) {
  let out = s, guard = 0;
  while (guard++ < 40) {
    let done = null;
    for (let i = 0; i < out.length; i++) {
      if (out[i] !== '/') continue;
      const L = atomLeft(out, i);
      if (!L) continue;
      const R = atomRight(out, i);
      if (!R) continue;
      let sign = '', ltext = L.text.trim();
      const m = ltext.match(/^([+\-−])\s*(.*)$/);
      if (m) { sign = m[1] === '−' ? '-' : m[1]; ltext = m[2]; }
      if (!ltext) continue;
      done = {
        start: L.start,
        end: R.end,
        replacement: `${sign}\\frac{${convAtomText(ltext)}}{${convAtomText(R.text.trim())}}`,
      };
      break;
    }
    if (!done) break;
    out = out.slice(0, done.start) + done.replacement + out.slice(done.end);
  }
  return out;
}

// ---------- tokenizer + run wrapping ----------
const WORD_START = /[a-zA-Zα-ωΑ-Ω∆Δ∞π√]/;
const WORD_CONT = /[a-zA-Z0-9α-ωΑ-Ω∆Δ∞π√⁰¹²³⁴⁵⁶⁷⁸⁹ⁿⁱ⁺⁻₀₁₂₃₄₅₆₇₈₉_'’]/;
const NUM_RE = /^[0-9]+(\.[0-9]+)?/;
function tokenize(s) {
  const toks = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === ' ' || c === '\t' || c === '\n') { toks.push({ t: 'sp', v: c, i }); i++; continue; }
    if (c === '\\') {
      let j = i + 1;
      while (j < s.length && /[a-zA-Z]/.test(s[j])) j++;
      toks.push({ t: 'cmd', v: s.slice(i, j), i });
      i = j; continue;
    }
    if (WORD_START.test(c)) {
      let j = i + 1;
      while (j < s.length && WORD_CONT.test(s[j])) j++;
      toks.push({ t: 'word', v: s.slice(i, j), i });
      i = j; continue;
    }
    if (/[0-9]/.test(c)) {
      const m = s.slice(i).match(NUM_RE);
      toks.push({ t: 'num', v: m[0], i });
      i += m[0].length; continue;
    }
    if (OPS_CHARS.includes(c)) { toks.push({ t: 'op', v: c, i }); i++; continue; }
    toks.push({ t: 'other', v: c, i }); i++;
  }
  return toks;
}

function wordAllowed(w) {
  const bare = w.replace(/[’']$/, '');
  if (/^[0-9]/.test(bare)) return true;
  if (bare.length === 1) return true;
  if (bare.length === 2) return !(STOP2.has(bare) || STOP2.has(bare.toLowerCase()));
  const low = bare.toLowerCase();
  if (STOP3.has(low)) return false;
  const clean = bare.replace(/[_^].*$/, '').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ⁺⁻₀₁₂₃₄₅₆₇₈₉]/g, '');
  if (UNITS.has(bare) || UNITS.has(clean)) return true;
  const b1 = bare.replace(/^\\/, '');
  if (FUNCS.has(b1) || FUNC_SRC.has(b1) || FUNCS.has(clean) || FUNC_SRC.has(clean)) return true;
  if (PLAIN_INCL.has(b1) || PLAIN_INCL.has(clean)) return true;
  if (/^[A-Z][A-Z0-9]{0,3}$/.test(bare)) return true;
  if (/^[A-Z][a-z]{0,2}[₀-₉0-9]*$/.test(bare) && /[0-9₀-₉]/.test(bare)) return true;
  if (/^[A-Z][a-z]{1,2}$/.test(bare)) return true; // Ix, Iy, Iz, Ker, Im style
  if (/^[∆ΔΑ-Ωα-ω][A-Za-z₀-₉0-9_]{0,5}$/.test(bare)) return true; // ΔS_U, α1
  if (/[_^]/.test(bare) && /^[A-Za-z0-9_^{}\\]+$/.test(bare)) return true; // latex-ish ids: Q_1, x^2
  return false;
}

function convRunInner(run) {
  let t = run;
  t = t.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿⁱ⁼]+/g, m => '^{' + Array.from(m).map(c => SUP_MAP[c] ?? c).join('') + '}');
  t = t.replace(/[₀₁₂₃₄₅₆₇₈₉₊₋₌]+/g, m => '_{' + Array.from(m).map(c => SUB_MAP[c] ?? c).join('') + '}');
  t = t.replace(/−/g, '-').replace(/’/g, '');
  t = t.replace(/≤/g, '\\le ').replace(/≥/g, '\\ge ').replace(/≠/g, '\\ne ').replace(/≈/g, '\\approx ');
  t = t.replace(/±/g, '\\pm ').replace(/×/g, '\\times ').replace(/·/g, '\\cdot ').replace(/÷/g, '\\div ');
  t = t.replace(/∞/g, '\\infty ').replace(/π/g, '\\pi ').replace(/∆/g, '\\Delta ').replace(/Δ/g, '\\Delta ');
  t = t.replace(/→/g, '\\to ').replace(/∩/g, '\\cap ').replace(/∪/g, '\\cup ').replace(/∈/g, '\\in ');
  t = t.replace(/⊥/g, '\\perp ').replace(/°/g, '^{\\circ}');
  t = t.replace(/√\s*\(?([0-9a-zA-Z.]+)\)?/g, (_m, x) => `\\sqrt{${x}}`);
  // backslash real functions when followed by '('
  t = t.replace(/(?<![a-zA-Z\\])(dim|det|gcd|ln|log|exp|sqrt|sin|cos|tan|cot|arcsin|arccos|arctan)\s*\(/g, (_m, f) => `\\${f}(`);
  // word_digit -> subscript (z1 -> z_{1}); unit bases m2/cm2 -> power
  t = t.replace(/(?<![a-zA-Z])([a-zA-Z])_?([0-9])(?![0-9a-zA-Z])/g, (mm, L, D) => {
    if (/^(m|cm|mm|km|dm)$/.test(L) && (D === '2' || D === '3')) return `${L}^{${D}}`;
    return `${L}_{${D}}`;
  });
  t = t.replace(/_([a-zA-Z])(?![a-zA-Z0-9{])/g, (_m, L) => `_{${L}}`);
  t = t.replace(/\^([a-zA-Z0-9])(?![0-9a-zA-Z{}])/g, (_m, X) => `^{${X}}`);
  t = t.replace(/\*/g, ' \\cdot ');
  return t.replace(/\s+/g, ' ').trim();
}

function wrapRuns(s) {
  const toks = tokenize(s);
  const out = [];
  let run = []; // tokens of current run
  let depth = 0;

  const flush = () => {
    if (!run.length) return;
    let lead = '', trail = '';
    while (run.length && run[0].t === 'sp') lead += run.shift().v;
    while (run.length && run[run.length - 1].t === 'sp') trail += run.pop().v;
    if (!run.length) { out.push(lead + trail); return; }
    const raw = run.map(x => x.v).join('');
    const hasTrigger = /\\[a-zA-Z]+|\^|_|[=<>≤≥≠≈±×·÷√π∆Δ∞→∈∩∪⊥]/.test(raw);
    const hasMathContent = /[0-9₀-₉⁰¹²³⁴⁵⁶⁷⁸⁹]|\\[a-zA-Z]+|=/.test(raw);
    if (hasTrigger && hasMathContent && raw.trim().length >= 2) {
      const conv = convRunInner(raw);
      const candidates = [conv, conv.replace(/^[([{]+/, '').replace(/[)\]}]+$/, '')];
      let emitted = null;
      for (const cand of candidates) {
        try { katex.renderToString(cand, { throwOnError: true, strict: false, displayMode: false }); emitted = cand; break; } catch { }
      }
      if (emitted) out.push(`${lead}$${emitted}$${trail}`);
      else out.push(lead + raw + trail);
    } else {
      out.push(lead + raw + trail);
    }
    run = []; depth = 0;
  };

  const nextMeaningful = (idx) => {
    for (let k = idx + 1; k < toks.length; k++) {
      if (toks[k].t === 'sp') continue;
      return toks[k];
    }
    return null;
  };
  const prevIncluded = () => run.length && run[run.length - 1].t !== 'sp';

  for (let idx = 0; idx < toks.length; idx++) {
    const tk = toks[idx];
    if (tk.t === 'other') { flush(); out.push(tk.v); continue; }
    if (tk.t === 'sp') {
      if (run.length) {
        const nx = nextMeaningful(idx);
        if (nx && (nx.t === 'num' || nx.t === 'word' || nx.t === 'cmd' || (nx.t === 'op' && nx.v !== ';' && nx.v !== ','))) run.push(tk);
        else flush();
      } else {
        out.push(tk.v); // preserve spaces between flushed runs / plain text
      }
      continue;
    }
    if (tk.t === 'op') {
      if (tk.v === ';' || tk.v === ':') { flush(); out.push(tk.v); continue; }
      if (tk.v === '.') {
        const nx = nextMeaningful(idx);
        const pv = run.length ? run[run.length - 1] : null;
        if (run.length && pv && pv.t === 'num' && nx && nx.t === 'num') { run.push(tk); continue; }
        flush(); out.push(tk.v); continue;
      }
      if (tk.v === ',') {
        if (run.length && depth > 0) { run.push(tk); continue; }
        flush(); out.push(tk.v); continue;
      }
      if (tk.v === '(' || tk.v === '[') {
        const nx = nextMeaningful(idx);
        const nxOk = nx && (nx.t === 'num' || nx.t === 'word' || nx.t === 'cmd' || (nx.t === 'op' && '+-−'.includes(nx.v)));
        if (run.length || nxOk) { if (!run.length && nxOk) { /* run starts at paren */ } run.push(tk); depth++; continue; }
        out.push(tk.v); continue;
      }
      if (tk.v === ')' || tk.v === ']') {
        if (run.length) { run.push(tk); depth = Math.max(0, depth - 1); continue; }
        out.push(tk.v); continue;
      }
      if (tk.v === '{' || tk.v === '}') { if (run.length) { run.push(tk); continue; } out.push(tk.v); continue; }
      // math operators = < > + - * / ^ ~ | and symbols
      if (!run.length) {
        // run may start with unary -, +, ~ or a symbol
        const nx = nextMeaningful(idx);
        const unaryOk = '+-−~'.includes(tk.v) && nx && (nx.t === 'num' || nx.t === 'word' || nx.t === 'cmd');
        const symOk = '∞π√∈∩∪'.includes(tk.v);
        if (!unaryOk && !symOk) { out.push(tk.v); continue; }
      }
      run.push(tk); continue;
    }
    if (tk.t === 'cmd') { run.push(tk); continue; }
    if (tk.t === 'num') { run.push(tk); continue; }
    if (tk.t === 'word') {
      // imaginary unit i after a number: 2i, 6i
      if (tk.v === 'i' && run.length) {
        const pr = run[run.length - 1];
        const prevTok = pr.t === 'sp' ? run[run.length - 2] : pr;
        if (prevTok && prevTok.t === 'num') { run.push(tk); continue; }
      }
      if (wordAllowed(tk.v)) { run.push(tk); continue; }
      flush(); out.push(tk.v); continue;
    }
  }
  flush();
  return out.join('');
}

// ---------- per-string pipeline ----------
function latexifyString(original) {
  if (!original || !original.trim()) return null;
  if (hasLatex(original)) return null;
  if (CHEM_RE.test(original)) return null;
  let s = original;
  // scientific notation lost superscripts: 1.02·105 -> 1.02·10^5
  s = s.replace(/(\d)\s*·\s*10(\d{1,2})(?![0-9])/g, (_m, a, b) => `${a} \\cdot 10^{${b}}`);
  // functions: prepend backslash to the NAME only (paren that follows stays as-is)
  s = s.replace(/(?<!\\)\b(ln|log|exp|sqrt|sin|cos|tan|ctg|arcsin|arccos|arctan)\b(?=\s*\()/g, (m) => m === 'ctg' ? '\\cot' : `\\${m}`);
  s = s.replace(/(?<!\\)\b(ln|log|exp|sqrt)\b(?=\s+[0-9])/g, (m) => `\\${m} `);
  s = s.replace(/(?<!\\)\b(lim|max|min)(?=\s*[_^(])/g, (m) => `\\${m}`);
  s = s.replace(/(?<!\\)\b(ln|log)(?=[0-9])/g, (m) => `\\${m} `);
  // fractions
  s = convertFractions(s);
  // wrap math runs
  const wrapped = wrapRuns(s);
  if (wrapped === original) return null;
  if (!wrapped.includes('$')) return null; // nothing got wrapped -> not worth writing
  // final safety: render every math segment; abort on any error
  const segs = wrapped.split(/\$\$|\$/);
  for (let i = 1; i < segs.length; i += 2) {
    try { katex.renderToString(segs[i], { throwOnError: true, strict: false }); }
    catch { return null; }
  }
  return wrapped;
}

// ---------- main ----------
async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const testFilter = args.find(a => a.startsWith('--test='))?.split('=')[1];
  const limit = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1] || '0', 10);

  const questions = await prisma.question.findMany({
    ...(testFilter ? { where: { testId: testFilter } } : {}),
    select: { id: true, text: true, optionA: true, optionB: true, optionC: true, optionD: true, optionE: true, explanation: true },
    orderBy: [{ testId: 'asc' }, { orderNum: 'asc' }],
  });
  if (limit > 0) questions.length = Math.min(questions.length, limit);

  const backupPath = `/home/z/my-project/backup/questions-backup-det-${Date.now()}.json`;
  FS.mkdirSync('/home/z/my-project/backup', { recursive: true });
  FS.writeFileSync(backupPath, JSON.stringify(questions, null, 1));
  console.log(`Backup: ${backupPath} (${questions.length} questions)`);

  const proposals = [];
  const OPTS = ['optionA', 'optionB', 'optionC', 'optionD', 'optionE'];
  let changed = 0;
  for (const q of questions) {
    const upd = {};
    const convText = latexifyString(q.text);
    if (convText) upd.text = convText;
    for (const f of OPTS) {
      const c = latexifyString(q[f]);
      if (c) upd[f] = c;
    }
    const cE = latexifyString(q.explanation);
    if (cE) upd.explanation = cE;
    if (Object.keys(upd).length) {
      changed++;
      proposals.push({ id: q.id, upd });
    }
  }
  console.log(`Strings to update: ${changed} questions affected`);

  if (!apply) {
    FS.writeFileSync('/home/z/my-project/backup/latexify-proposals.json', JSON.stringify(proposals, null, 1));
    // build original map for display
    const origById = {};
    for (const q of questions) origById[q.id] = q;
    console.log('\n=== SAMPLES (OLD -> NEW) ===');
    for (const p of proposals.slice(0, 40)) {
      for (const [f, v] of Object.entries(p.upd)) {
        const oldV = f === 'text' ? origById[p.id].text : f === 'explanation' ? origById[p.id].explanation : origById[p.id][f];
        console.log(`[${p.id.slice(-6)}] ${f}:`);
        console.log(`   OLD: ${String(oldV).slice(0, 150)}`);
        console.log(`   NEW: ${String(v).slice(0, 150)}`);
      }
    }
    console.log('\nProposals saved to /home/z/my-project/backup/latexify-proposals.json');
    console.log('Run with --apply to write to DB.');
    return;
  }

  let done = 0;
  for (const p of proposals) {
    await prisma.question.update({ where: { id: p.id }, data: p.upd });
    done++;
    if (done % 100 === 0) console.log(`updated ${done}/${proposals.length}`);
  }
  console.log(`DONE. Updated ${done} questions.`);
}

main()
  .catch(e => { console.error('FATAL:', e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
