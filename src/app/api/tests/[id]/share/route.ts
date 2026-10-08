import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/tests/[id]/share  { scope: 'link' | 'community' }
 *
 * scope = 'link'      → nothing to change: any test (even private) already opens
 *                       for whoever has the direct link (/?test=<id>).
 * scope = 'community' → the creator's own private test becomes public, so it
 *                       shows up in the whole community's personalized feed.
 */
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
    const body = await request.json().catch(() => ({ scope: 'link' }));
    const scope = body?.scope === 'community' ? 'community' : 'link';

    const test = await db.test.findUnique({
      where: { id },
      select: { id: true, creatorId: true, isPublic: true },
    });
    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    if (scope === 'community' && test.creatorId === userId && !test.isPublic) {
      await db.test.update({ where: { id }, data: { isPublic: true } });
      return NextResponse.json({ ok: true, isPublic: true });
    }

    return NextResponse.json({ ok: true, isPublic: test.isPublic });
  } catch (error) {
    console.error('Share test error:', error);
    return NextResponse.json({ error: 'Failed to share test' }, { status: 500 });
  }
}
