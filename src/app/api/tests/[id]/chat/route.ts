import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Per-test group chat (user ↔ user).
 * GET  /api/tests/[id]/chat?after=<ISO> — poll messages (public, read-only)
 * POST /api/tests/[id]/chat             — send a message (any signed-in user)
 * The client polls GET every few seconds; serverless-friendly (no WebSockets).
 */

const MAX_TEXT = 2000;
const HISTORY_LIMIT = 200;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const test = await db.test.findUnique({ where: { id }, select: { id: true } });
    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const after = searchParams.get('after');

    if (after) {
      const afterDate = new Date(after);
      if (!isNaN(afterDate.getTime())) {
        const messages = await db.chatMessage.findMany({
          where: { testId: id, createdAt: { gt: afterDate } },
          orderBy: { createdAt: 'asc' },
          take: HISTORY_LIMIT,
        });
        return NextResponse.json(messages);
      }
    }

    const messages = await db.chatMessage.findMany({
      where: { testId: id },
      orderBy: { createdAt: 'desc' },
      take: HISTORY_LIMIT,
    });
    // Return oldest → newest for direct rendering
    return NextResponse.json(messages.reverse());
  } catch (error) {
    console.error('Get chat messages error:', error);
    return NextResponse.json({ error: 'Failed to get chat messages' }, { status: 500 });
  }
}

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
    const test = await db.test.findUnique({ where: { id }, select: { id: true } });
    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const text = typeof body?.text === 'string' ? body.text.trim().slice(0, MAX_TEXT) : '';
    if (!text) {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
    }

    const message = await db.chatMessage.create({
      data: {
        testId: id,
        userId: user.id,
        userName: user.name,
        text,
      },
    });
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Create chat message error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
