import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/translate
 * Body: { texts: string[], to: 'en' | 'ru' | 'uz' }
 * Returns: { translations: string[] } — same order/length as the input.
 *
 * Free public MT providers, tried in order (no API keys needed):
 *  1. clients5.google.com (Chrome dictionary endpoint) — batched, fast;
 *  2. translate.googleapis.com (gtx) — per-text fallback;
 *  3. api.mymemory.translated.net — per-text last resort.
 * On total failure the ORIGINAL texts are returned so the UI can fall back
 * to the source language instead of breaking.
 */

const LANGS = new Set(['en', 'ru', 'uz']);
const MAX_STRINGS = 500;
const MAX_STRING_CHARS = 6000;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

async function fetchWithTimeout(url: string, ms = 12000): Promise<Response> {
  return fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(ms), cache: 'no-store' });
}

/** Provider 1: batched via repeated q params. */
async function googleClients5(texts: string[], to: string): Promise<string[] | null> {
  try {
    const out: string[] = [];
    // Chunk so the request URL stays well below server limits
    let batch: string[] = [];
    let encoded = 0;
    const flush = async () => {
      if (!batch.length) return;
      const qs = batch.map(q => `q=${encodeURIComponent(q)}`).join('&');
      const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=auto&tl=${to}&${qs}`;
      const res = await fetchWithTimeout(url);
      if (!res.ok) throw new Error(`clients5 ${res.status}`);
      const data = await res.json();
      // Expected: [["перевод","en"], ...] — one entry per q
      if (!Array.isArray(data)) throw new Error('clients5 bad shape');
      for (const item of data) {
        if (Array.isArray(item) && typeof item[0] === 'string') out.push(item[0]);
        else if (typeof item === 'string') out.push(item);
        else out.push('');
      }
      batch = [];
      encoded = 0;
    };
    for (const t of texts) {
      const enc = encodeURIComponent(t).length;
      if (batch.length >= 40 || (batch.length > 0 && encoded + enc > 3600)) await flush();
      batch.push(t);
      encoded += enc;
    }
    await flush();
    return out.length === texts.length ? out : null;
  } catch {
    return null;
  }
}

/** Provider 2: classic gtx endpoint, one request per text. */
async function googleGtx(texts: string[], to: string): Promise<string[] | null> {
  const out: string[] = [];
  try {
    for (const t of texts) {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${to}&dt=t&q=${encodeURIComponent(t)}`;
      const res = await fetchWithTimeout(url);
      if (!res.ok) throw new Error(`gtx ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data) || !Array.isArray(data[0])) throw new Error('gtx bad shape');
      out.push(data[0].map((seg: unknown[]) => (Array.isArray(seg) && typeof seg[0] === 'string' ? seg[0] : '')).join(''));
    }
    return out;
  } catch {
    return null;
  }
}

/** Provider 3: MyMemory (Autodetect source), one request per text. */
async function myMemory(texts: string[], to: string): Promise<string[] | null> {
  const out: string[] = [];
  try {
    for (const t of texts) {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(t.slice(0, 500))}&langpair=Autodetect|${to}`;
      const res = await fetchWithTimeout(url);
      if (!res.ok) throw new Error(`mymemory ${res.status}`);
      const data = await res.json();
      const tr = data?.responseData?.translatedText;
      if (typeof tr !== 'string' || !tr) throw new Error('mymemory empty');
      out.push(tr);
    }
    return out;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const texts: unknown = body?.texts;
    const to: unknown = body?.to;
    if (!Array.isArray(texts) || texts.length === 0 || !LANGS.has(to as string)) {
      return NextResponse.json({ error: 'Invalid request: texts[] and to (en|ru|uz) are required' }, { status: 400 });
    }
    const clean = (texts as unknown[])
      .slice(0, MAX_STRINGS)
      .map(t => (typeof t === 'string' ? t.slice(0, MAX_STRING_CHARS) : ''));
    // Drop empty strings from translation (they translate to noise) but keep order
    const placeholders = new Map<number, string>(); // index -> original ''
    const work: string[] = [];
    clean.forEach((t, i) => {
      if (t.trim()) work.push(t);
      else placeholders.set(i, '');
    });

    let result = await googleClients5(work, to as string);
    if (!result) result = await googleGtx(work, to as string);
    if (!result) result = await myMemory(work, to as string);
    if (!result || result.length !== work.length) {
      // Total failure — give back originals so the UI keeps the source text
      return NextResponse.json({ translations: clean, ok: false });
    }

    const final: string[] = [];
    let w = 0;
    for (let i = 0; i < clean.length; i++) {
      if (placeholders.has(i)) final.push('');
      else final.push(result[w++] ?? clean[i]);
    }
    return NextResponse.json({ translations: final, ok: true });
  } catch (error) {
    console.error('Translate error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
