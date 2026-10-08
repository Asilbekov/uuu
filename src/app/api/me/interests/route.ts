import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { seedInterests } from '@/lib/affinity';
import { popularTags } from '@/lib/popular';

// ---------------------------------------------------------------------------
// GET  /api/me/interests — the user's picked interests + popular tag suggestions
// PUT  /api/me/interests — save interests (onboarding / settings)
// ---------------------------------------------------------------------------

export const dynamic = 'force-dynamic';

const MAX_INTERESTS = 12;

function sanitizeInterests(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const r of raw) {
    if (typeof r !== 'string' && typeof r !== 'number') continue;
    const t = String(r).trim().replace(/\s+/g, ' ').slice(0, 30);
    if (!t) continue;
    const k = t.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(t);
    if (out.length >= MAX_INTERESTS) break;
  }
  return out;
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const [user, suggestions] = await Promise.all([
      db.user.findUnique({ where: { id: userId }, select: { interests: true } }),
      popularTags().catch(() => []),
    ]);
    return NextResponse.json({
      interests: user?.interests || [],
      suggestions: suggestions.map(s => s.tag),
    });
  } catch (error) {
    console.error('Get interests error:', error);
    return NextResponse.json({ interests: [], suggestions: [] });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const { interests } = await request.json();
    const clean = sanitizeInterests(interests);
    await db.user.update({ where: { id: userId }, data: { interests: clean } });
    // Seed the affinity profile so the For You feed reacts immediately
    await seedInterests(userId, clean).catch(() => {});
    return NextResponse.json({ interests: clean, ok: true });
  } catch (error) {
    console.error('Save interests error:', error);
    return NextResponse.json({ error: 'Failed to save interests' }, { status: 500 });
  }
}
