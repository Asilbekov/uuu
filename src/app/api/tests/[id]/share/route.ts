import { db } from '@/lib/db';
import { findPublicTitleClash } from '@/lib/publish';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/tests/[id]/share  { scope: 'link' | 'community' }
 *
 * For the creator's OWN test both scopes PERSIST the publication variant
 * (the share buttons on the cards act as a mode switch):
 *   scope = 'link'      → the test becomes link-only (isPublic = false):
 *                         hidden from the community feed, but anyone who has
 *                         the direct link (/?test=<id>) can still open it.
 *   scope = 'community' → the test becomes public (isPublic = true): it shows
 *                         up in the whole community's personalized feed.
 * For somebody else's test nothing is changed — it's a plain share.
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

    if (test.creatorId === userId) {
      if (scope === 'community' && !test.isPublic) {
        // Publishing rule: a test can go PUBLIC only under a title that no
        // other public test in the community library uses.
        const full = await db.test.findUnique({ where: { id }, select: { title: true } });
        const clash = await findPublicTitleClash(full?.title || '', id);
        if (clash) {
          return NextResponse.json({ error: 'PUBLISH_NAME_TAKEN' }, { status: 409 });
        }
        await db.test.update({ where: { id }, data: { isPublic: true } });
        return NextResponse.json({ ok: true, isPublic: true });
      }
      if (scope === 'link' && test.isPublic) {
        await db.test.update({ where: { id }, data: { isPublic: false } });
        return NextResponse.json({ ok: true, isPublic: false });
      }
    }

    return NextResponse.json({ ok: true, isPublic: test.isPublic });
  } catch (error) {
    console.error('Share test error:', error);
    return NextResponse.json({ error: 'Failed to share test' }, { status: 500 });
  }
}
