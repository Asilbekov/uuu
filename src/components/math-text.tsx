'use client';

import React, { useMemo } from 'react';
import katex from 'katex';

/**
 * MathText renders a string that may contain LaTeX math ($...$, $$...$$, \(...\), \[...\]).
 * Plain-text segments get:
 *  - markdown cleanup (### headings, **bold**)
 *  - automatic beautification of unicode super/subscripts (x² -> x<sup>2</sup>)
 *  - plain caret exponents (m/s^2 -> m/s<sup>2</sup>)
 */

const MATH_RE = /(\$\$[\s\S]+?\$\$|\$[^\u0001$\n]+?\$)/g;
const ESC_DOLLAR = '\u0001'; // placeholder for \\$ (literal dollar, e.g. prices)

function protectEscapedDollars(s: string): string {
  return s.replace(/\\\$/g, ESC_DOLLAR);
}

function restoreDollars(s: string): string {
  return s.split(ESC_DOLLAR).join('\\$');
}

const SUP_MAP: Record<string, string> = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5',
  '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁺': '+', '⁻': '-',
  '⁼': '=', 'ⁿ': 'n', 'ⁱ': 'i',
};

const SUB_MAP: Record<string, string> = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
  '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
  '₊': '+', '₋': '-', '₌': '=',
};

function renderStyled(text: string, keyPrefix: string, bold: boolean): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let buf = '';
  const chars = Array.from(text);
  let i = 0;
  const flush = () => {
    if (buf) {
      out.push(bold ? <strong key={`${keyPrefix}-b-${out.length}`}>{buf}</strong> : buf);
      buf = '';
    }
  };
  while (i < chars.length) {
    const ch = chars[i];
    if (ch === '^') {
      // Plain-text caret exponent fallback: x^2, m/s^2, (2,k,3)^T, 10^{-3}
      let j = i + 1;
      let token = '';
      if (chars[j] === '{') {
        j++;
        while (j < chars.length && chars[j] !== '}') {
          token += chars[j];
          j++;
        }
        if (chars[j] === '}') j++;
      } else {
        while (j < chars.length && /[A-Za-z0-9\u2212]/.test(chars[j])) {
          token += chars[j];
          j++;
        }
      }
      if (token) {
        flush();
        out.push(
          <sup key={`${keyPrefix}-caret-${out.length}`} className="text-[0.72em] leading-none">
            {token}
          </sup>
        );
        i = j;
        continue;
      }
    }
    if (SUP_MAP[ch] !== undefined) {
      flush();
      let sup = SUP_MAP[ch];
      i++;
      while (i < chars.length && SUP_MAP[chars[i]] !== undefined) {
        sup += SUP_MAP[chars[i]];
        i++;
      }
      out.push(
        <sup key={`${keyPrefix}-sup-${out.length}`} className="text-[0.72em] leading-none">
          {sup}
        </sup>
      );
      continue;
    }
    if (SUB_MAP[ch] !== undefined) {
      flush();
      let sub = SUB_MAP[ch];
      i++;
      while (i < chars.length && SUB_MAP[chars[i]] !== undefined) {
        sub += SUB_MAP[chars[i]];
        i++;
      }
      out.push(
        <sub key={`${keyPrefix}-sub-${out.length}`} className="text-[0.72em] leading-none">
          {sub}
        </sub>
      );
      continue;
    }
    buf += ch;
    i++;
  }
  flush();
  return out;
}

/**
 * Unicode symbols that KaTeX lacks character metrics for (warnings + missing
 * glyphs in some fonts). Map them to proper LaTeX commands inside math mode.
 */
const UNICODE_MATH_MAP: Array<[RegExp, string]> = [
  [/∆/g, '\\Delta '],
  [/Ω/g, '\\Omega '],
  [/μ|µ/g, '\\mu '],
  [/◦|∘/g, '^\\circ '],
  [/°/g, '^\\circ '],
  [/↔/g, '\\leftrightarrow '],
  [/←/g, '\\leftarrow '],
  [/→/g, '\\to '],
  [/⇄/g, '\\rightleftarrows '],
  [/⇌/g, '\\rightleftharpoons '],
  [/∞/g, '\\infty '],
  [/∂/g, '\\partial '],
  [/∈/g, '\\in '],
  [/∑/g, '\\sum '],
  [/∏/g, '\\prod '],
  [/∫/g, '\\int '],
  [/≈/g, '\\approx '],
  [/∝/g, '\\propto '],
  [/≅|≡/g, '\\equiv '],
  [/α/g, '\\alpha '],
  [/β/g, '\\beta '],
  [/γ/g, '\\gamma '],
  [/δ/g, '\\delta '],
  [/ε|ϵ/g, '\\varepsilon '],
  [/θ/g, '\\theta '],
  [/λ/g, '\\lambda '],
  [/π/g, '\\pi '],
  [/ρ/g, '\\rho '],
  [/σ/g, '\\sigma '],
  [/τ/g, '\\tau '],
  [/φ/g, '\\varphi '],
  [/ω/g, '\\omega '],
];

function unicodeToLatex(latex: string): string {
  let out = latex;
  for (const [re, cmd] of UNICODE_MATH_MAP) out = out.replace(re, cmd);
  return out;
}

function renderPlain(text: string, keyPrefix: string): React.ReactNode[] {
  // Strip markdown headings at line starts + convert markdown bullets to •
  const cleaned = text
    .replace(/^[ \t]*#{1,6}[ \t]+/gm, '')
    .replace(/^[ \t]*[-*][ \t]+/gm, '• ');
  const out: React.ReactNode[] = [];
  const boldParts = cleaned.split('**');
  boldParts.forEach((part, bi) => {
    if (part === '') return;
    const bold = bi % 2 === 1;
    out.push(...renderStyled(part, `${keyPrefix}-${bi}`, bold));
  });
  return out;
}

export function MathText({ text, className }: { text: string; className?: string }) {
  const nodes = useMemo(() => {
    if (!text) return null;
    let protectedText0 = protectEscapedDollars(text);
    // Protect LaTeX row separators "\\" (e.g. pmatrix rows) BEFORE converting
    // alternate delimiters, otherwise "\\(" (rowsep + open paren) is wrongly
    // treated as a "\( " math delimiter and corrupts the formula.
    const ROWSEP = '\u0002';
    protectedText0 = protectedText0.replace(/\\\\/g, ROWSEP);
    // Normalize alternate LaTeX delimiters some models emit:
    // \(...\) -> $...$  and  \[...\] -> $$...$$
    protectedText0 = protectedText0
      .replace(/\\\(/g, '$')
      .replace(/\\\)/g, '$')
      .replace(/\\\[([\s\S]*?)\\\]/g, (_m, inner: string) => `$$${inner}$$`);
    protectedText0 = protectedText0.split(ROWSEP).join('\\\\');
    // Tolerate an unclosed $$ block (e.g. truncated AI answer): close it so the
    // completed parts still render instead of showing raw $$ markers.
    const displayCount = (protectedText0.match(/\$\$/g) || []).length;
    const protectedText = displayCount % 2 === 1 ? protectedText0 + '$$' : protectedText0;
    // IMPORTANT: split() with a capturing group guarantees math segments land at
    // ODD indexes — even when some parts are empty strings (e.g. text that
    // STARTS with a formula yields a leading ''). Do NOT filter() before the
    // map: removing empties shifts indexes and breaks math/plain parity, which
    // made options like "$T = 2$ sec" render as raw LaTeX with dollar signs.
    const parts = protectedText.split(MATH_RE);
    return parts
      .map((part, i) => {
        if (part === '' || part === undefined) return null;
        const isMath = i % 2 === 1;
        if (!isMath) {
          return <React.Fragment key={`t${i}`}>{renderPlain(restoreDollars(part).replace(/\\\$/g, '$'), `${i}`)}</React.Fragment>;
        }
        let latex = part;
        let displayMode = false;
        if (part.startsWith('$$')) {
          latex = part.slice(2, -2);
          displayMode = true;
        } else {
          latex = part.slice(1, -1);
        }
        latex = restoreDollars(latex);
        latex = unicodeToLatex(latex);
        try {
          const html = katex.renderToString(latex.trim(), {
            throwOnError: false,
            strict: false,
            displayMode,
            output: 'html',
          });
          return (
            <span
              key={`m${i}`}
              className={
                displayMode
                  ? 'block my-1.5 overflow-x-auto text-center'
                  : 'inline-block'
              }
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <span key={`m${i}`}>{part}</span>;
        }
      })
      .filter(Boolean);
  }, [text]);

  return <span className={`whitespace-pre-wrap ${className || ''}`}>{nodes}</span>;
}

export default MathText;
