import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/tests/[id]/translations
 * Persists machine translations produced on the client so they are stored in
 * Question.translations and load instantly for everyone afterwards.
 *
 * Body: { lang: 'en'|'ru'|'uz', items: [{ id: questionId, text?, options?, explanation? }] }
 * Merges into the existing translations JSON per question (never overwrites
 * other languages). Authenticated users only (same rule as editing tests).
 */

const LANGS = new Set(['en', 'ru', 'uz']);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => null);
    const lang: unknown = body?.lang;
    const items: unknown = body?.items;
    if (!LANGS.has(lang as string) || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid request: lang and items[] are required' }, { status: 400 });
    }
    const langKey = lang as string;

    const questions = await db.question.findMany({
      where: { testId: id, id: { in: (items as { id?: string }[]).map(it => String(it?.id || '')).filter(Boolean) } },
      select: { id: true, translations: true },
    });
    const existing = new Map(questions.map(q => [q.id, (q.translations && typeof q === 'object' ? q.translations : {}) as Record<string, unknown>]));

    let saved = 0;
    const CHUNK = 8;
    const list = items as { id?: string; text?: string; options?: Record<string, string>; explanation?: string }[];
    for (let i = 0; i < list.length; i += CHUNK) {
      const chunk = list.slice(i, i + CHUNK).filter(it => it && typeof it.id === 'string' && existing.has(it.id));
      await Promise.all(chunk.map(async it => {
        const base = { ...(existing.get(it.id!) || {}) } as Record<string, unknown>;
        const entry: Record<string, unknown> = { ...(base[langKey] as Record<string, unknown> | undefined) };
        if (typeof it.text === 'string' && it.text.trim()) entry.text = it.text;
        if (it.options && typeof it.options === 'object') {
          const opts: Record<string, string> = {};
          for (const L of ['A', 'B', 'C', 'D', 'E']) {
            const v = it.options[L];
            if (typeof v === 'string' && v.trim()) opts[L] = v;
          }
          if (Object.keys(opts).length) entry.options = opts;
        }
        if (typeof it.explanation === 'string' && it.explanation.trim()) entry.explanation = it.explanation;
        if (!Object.keys(entry).length) return;
        base[langKey] = entry;
        await db.question.update({ where: { id: it.id! }, data: { translations: base } });
        existing.set(it.id!, base);
        saved++;
      }));
    }

    return NextResponse.json({ ok: true, saved });
  } catch (error) {
    console.error('Save translations error:', error);
    return NextResponse.json({ error: 'Failed to save translations' }, { status: 500 });
  }
}
