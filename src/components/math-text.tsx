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

function renderPlain(text: string, keyPrefix: string): React.ReactNode[] {
  // Strip markdown headings at line starts
  const cleaned = text.replace(/^[ \t]*#{1,6}[ \t]+/gm, '');
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
    const protectedText0 = protectEscapedDollars(text);
    // Tolerate an unclosed $$ block (e.g. truncated AI answer): close it so the
    // completed parts still render instead of showing raw $$ markers.
    const displayCount = (protectedText0.match(/\$\$/g) || []).length;
    const protectedText = displayCount % 2 === 1 ? protectedText0 + '$$' : protectedText0;
    const parts = protectedText.split(MATH_RE).filter((p) => p !== '' && p !== undefined);
    return parts.map((part, i) => {
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
                ? 'block my-2 overflow-x-auto text-center'
                : 'inline-block align-middle'
            }
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        return <span key={`m${i}`}>{part}</span>;
      }
    });
  }, [text]);

  return <span className={`whitespace-pre-wrap ${className || ''}`}>{nodes}</span>;
}

export default MathText;
