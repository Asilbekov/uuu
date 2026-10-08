'use client';

import { Lang } from '@/lib/i18n';

/**
 * On-the-fly question translation.
 *
 * Tests whose questions have no stored translation for the selected interface
 * language (e.g. a test created by a user, or an old "Continue test" snapshot
 * saved before translations existed) are translated here via /api/translate,
 * cached in localStorage and merged into the React state by the caller.
 *
 * Markdown images ![alt](src) and inline $...$ math are protected with
 * placeholders so the translator can't mangle them; if a placeholder is lost
 * in translation the protected fragment is appended after the text instead
 * (MathText renders images fine anywhere in the string).
 */

export interface QTranslationsV {
  text?: string;
  options?: Record<string, string>;
  explanation?: string;
}

export interface TranslatableQuestion {
  id?: string;
  text: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  optionE?: string | null;
  explanation?: string | null;
  translations?: Record<string, QTranslationsV> | null;
}

const CACHE_KEY = 'chemtest-qtrans-v1';
const CACHE_LIMIT = 3000; // max cached strings

// ---------- localStorage cache (per source-string hash + target lang) ----------

function fnv1a(str: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36) + '_' + str.length.toString(36);
}

type CacheMap = Record<string, string>;

function readCache(): CacheMap {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}') as CacheMap;
  } catch {
    return {};
  }
}

function writeCache(cache: CacheMap) {
  try {
    const keys = Object.keys(cache);
    if (keys.length > CACHE_LIMIT) {
      // Drop the oldest half (keys have no timestamps — dropping insertion-order head is fine)
      for (const k of keys.slice(0, keys.length - CACHE_LIMIT / 2)) delete cache[k];
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // quota / private mode — cache simply won't persist
  }
}

const cacheKey = (to: Lang, source: string) => `${to}|${fnv1a(source)}`;

// ---------- placeholder protection ----------

const IMG_RE = /!\[[^\]]*\]\([^)\s]+\)/g;
const MATH_RE = /\$[^$\n]+\$/g;

/** Replace protected fragments with tokens the MT engine keeps intact. */
function protect(text: string): { safe: string; frags: string[] } {
  const frags: string[] = [];
  const safe = text.replace(IMG_RE, m => {
    const i = frags.push(m) - 1;
    return ` IMG${i}TOKEN `;
  }).replace(MATH_RE, m => {
    const i = frags.push(m) - 1;
    return ` MATH${i}TOKEN `;
  });
  return { safe, frags };
}

/** Restore tokens; append any fragment the translator lost to the end. */
function restore(text: string, frags: string[]): string {
  let out = text.replace(/ ?(IMG|MATH)(\d+)TOKEN ?/g, (_m, _k, n) => ` ${frags[Number(n)] ?? ''} `);
  const missing = frags.filter((f, i) => !out.includes(f));
  if (missing.length) {
    out = `${out}\n\n${missing.join('\n\n')}`;
  }
  return out.replace(/ {2,}/g, ' ').trim();
}

// ---------- translation ----------

/** Translate a list of strings, consulting the localStorage cache first. */
export async function translateStrings(texts: string[], to: Lang): Promise<(string | null)[]> {
  const cache = readCache();
  const result: (string | null)[] = new Array(texts.length).fill(null);
  const missingIdx: number[] = [];
  const missing: string[] = [];

  texts.forEach((t, i) => {
    if (!t || !t.trim()) { result[i] = ''; return; }
    const hit = cache[cacheKey(to, t)];
    if (typeof hit === 'string' && hit) result[i] = hit;
    else { missingIdx.push(i); missing.push(t); }
  });

  if (missing.length) {
    // Cap the batch — oversized sets simply stay untranslated this round
    const capped = missing.slice(0, 400);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: capped, to }),
      });
      if (res.ok) {
        const data = await res.json();
        const trs: string[] = Array.isArray(data?.translations) ? data.translations : [];
        capped.forEach((src, j) => {
          const tr = typeof trs[j] === 'string' && trs[j].trim() ? trs[j].trim() : null;
          result[missingIdx[j]] = tr;
          if (tr) {
            cache[cacheKey(to, src)] = tr;
          }
        });
        writeCache(cache);
      }
    } catch {
      // network failure — keep nulls (caller falls back to the source text)
    }
  }

  return result;
}

/** Build the translated {text, options, explanation} for ONE question. */
export async function translateQuestion(q: TranslatableQuestion, to: Lang): Promise<QTranslationsV | null> {
  const letters = ['A', 'B', 'C', 'D', 'E'] as const;
  const optionTexts = letters.map(L => (q as Record<string, unknown>)[`option${L}`]).map(v => (typeof v === 'string' ? v : ''));

  const protectedText = protect(q.text);
  const protectedOpts = optionTexts.map(t => (t ? protect(t) : null));
  const protectedExpl = q.explanation ? protect(q.explanation) : null;

  const strings = [
    protectedText.safe,
    ...protectedOpts.map(p => (p ? p.safe : '')),
    protectedExpl ? protectedExpl.safe : '',
  ].map(s => s.trim());

  const translated = await translateStrings(strings, to);

  const text = translated[0] ? restore(translated[0], protectedText.frags) : undefined;
  const options: Record<string, string> = {};
  protectedOpts.forEach((p, i) => {
    const tr = translated[i + 1];
    const original = optionTexts[i];
    if (!original) return;
    const restored = tr ? restore(tr, p!.frags) : null;
    if (restored) options[letters[i]] = restored;
  });
  const explanation = translated[6] && protectedExpl ? restore(translated[6], protectedExpl.frags) : undefined;

  if (!text && !Object.keys(options).length && !explanation) return null;
  return { ...(text ? { text } : {}), ...(Object.keys(options).length ? { options } : {}), ...(explanation ? { explanation } : {}) };
}

/**
 * Translate every question that lacks a stored translation for `to`.
 * Runs with a small concurrency window; returns a map keyed by question id.
 */
export async function autoTranslateQuestions(
  questions: TranslatableQuestion[],
  to: Lang,
  onOne?: (id: string, tr: QTranslationsV) => void,
): Promise<Map<string, QTranslationsV>> {
  const out = new Map<string, QTranslationsV>();
  const queue = questions.filter(q => q.text && q.id && !q.translations?.[to]);
  const CONCURRENCY = 4;
  let cursor = 0;

  const worker = async () => {
    while (cursor < queue.length) {
      const q = queue[cursor++];
      try {
        const tr = await translateQuestion(q, to);
        if (tr && q.id) {
          out.set(q.id, tr);
          onOne?.(q.id, tr);
        }
      } catch {
        // single-question failure is non-fatal
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length) }, worker));
  return out;
}
