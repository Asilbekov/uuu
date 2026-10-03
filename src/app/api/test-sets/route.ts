import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/test-sets — named groups of tests (e.g. "English for Engineering I —
 * Weeks 1-4"). Only sets containing at least one public test are returned;
 * member tests follow the same visibility rule as GET /api/tests
 * (isPublic OR created by the requesting user).
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    const sets = await db.testSet.findMany({
      where: { tests: { some: { isPublic: true } } },
      include: {
        tests: {
          where: userId
            ? { OR: [{ isPublic: true }, { creatorId: userId }] }
            : { isPublic: true },
          select: {
            id: true,
            title: true,
            description: true,
            topic: true,
            creatorId: true,
            setId: true,
            isPublic: true,
            randomizeQuestions: true,
            randomizeOptions: true,
            createdAt: true,
            _count: { select: { questions: true, attempts: true, attachments: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(sets);
  } catch (error) {
    console.error('Get test sets error:', error);
    return NextResponse.json({ error: 'Failed to get test sets' }, { status: 500 });
  }
}
