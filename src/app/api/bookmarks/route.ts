import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Personal-library bookmarks.
 *
 * GET            → { ids: string[] } — every test the user bookmarked.
 * POST { testId }    → save a test to the user's library (idempotent).
 * DELETE ?testId=…   → remove the test from the user's library.
 *
 * Bookmarked tests appear in the user's PERSONAL LIBRARY mode (together with
 * their own tests); the creator strip + bookmark button live on the cards in
 * the DISCOVER mode.
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const rows = await db.bookmark.findMany({
      where: { userId },
      select: { testId: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ ids: rows.map(r => r.testId) });
  } catch (error) {
    console.error('Bookmarks GET error:', error);
    return NextResponse.json({ error: 'Failed to load bookmarks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const body = await request.json().catch(() => null);
    const testId = body?.testId;
    if (!testId) return NextResponse.json({ error: 'testId required' }, { status: 400 });

    const test = await db.test.findUnique({ where: { id: testId }, select: { id: true } });
    if (!test) return NextResponse.json({ error: 'Test not found' }, { status: 404 });

    await db.bookmark.upsert({
      where: { userId_testId: { userId, testId } },
      update: {},
      create: { userId, testId },
    });
    return NextResponse.json({ ok: true, bookmarked: true });
  } catch (error) {
    console.error('Bookmarks POST error:', error);
    return NextResponse.json({ error: 'Failed to save bookmark' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const testId = new URL(request.url).searchParams.get('testId');
    if (!testId) return NextResponse.json({ error: 'testId required' }, { status: 400 });
    await db.bookmark.deleteMany({ where: { userId, testId } });
    return NextResponse.json({ ok: true, bookmarked: false });
  } catch (error) {
    console.error('Bookmarks DELETE error:', error);
    return NextResponse.json({ error: 'Failed to remove bookmark' }, { status: 500 });
  }
}
