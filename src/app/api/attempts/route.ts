import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const attempts = await db.testAttempt.findMany({
      where: { userId },
      include: {
        test: {
          select: { id: true, title: true, topic: true },
        },
      },
      orderBy: { startedAt: 'desc' },
    });

    return NextResponse.json(attempts);
  } catch (error) {
    console.error('Get attempts error:', error);
    return NextResponse.json({ error: 'Failed to get attempts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { testId, totalQuestions: requestedTotal } = await request.json();
    if (!testId) {
      return NextResponse.json({ error: 'Test ID is required' }, { status: 400 });
    }

    const test = await db.test.findUnique({
      where: { id: testId },
      include: { questions: true },
    });

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    // Use the requested total if provided and valid, otherwise fall back to full test length
    const totalQ = (requestedTotal && requestedTotal > 0 && requestedTotal <= test.questions.length)
      ? requestedTotal
      : test.questions.length;

    const attempt = await db.testAttempt.create({
      data: {
        testId,
        userId,
        totalQuestions: totalQ,
      },
    });

    return NextResponse.json(attempt, { status: 201 });
  } catch (error) {
    console.error('Create attempt error:', error);
    return NextResponse.json({ error: 'Failed to create attempt' }, { status: 500 });
  }
}
