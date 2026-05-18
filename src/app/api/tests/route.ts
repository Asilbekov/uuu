import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creatorId');

    let where: any = {};
    if (creatorId) {
      where.creatorId = creatorId;
    } else if (userId) {
      where = {
        OR: [
          { creatorId: userId },
          { isPublic: true },
        ],
      };
    } else {
      where.isPublic = true;
    }

    // Get tests - we'll strip coverImage from response to keep it small
    const testsRaw = await db.test.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        topic: true,
        creatorId: true,
        isPublic: true,
        randomizeQuestions: true,
        randomizeOptions: true,
        coverImage: true,
        createdAt: true,
        updatedAt: true,
        creator: { select: { id: true, name: true, email: true } },
        _count: { select: { questions: true, attempts: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform: replace coverImage data with hasCoverImage boolean to keep response small
    const tests = testsRaw.map(({ coverImage, ...rest }) => ({
      ...rest,
      hasCoverImage: !!coverImage,
    }));

    return NextResponse.json(tests);
  } catch (error) {
    console.error('Get tests error:', error);
    return NextResponse.json({ error: 'Failed to get tests' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, topic, isPublic, randomizeQuestions, randomizeOptions, questions } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const test = await db.test.create({
      data: {
        title,
        description: description || '',
        topic: topic || 'Chemistry',
        creatorId: userId,
        isPublic: isPublic !== false,
        randomizeQuestions: randomizeQuestions || false,
        randomizeOptions: randomizeOptions || false,
        questions: {
          create: (questions || []).map((q: any, index: number) => ({
            text: q.text,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            optionE: q.optionE || null,
            correctAnswer: q.correctAnswer || 'A',
            imageNumber: q.imageNumber || null,
            orderNum: index,
          })),
        },
      },
      include: {
        questions: true,
        creator: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(test, { status: 201 });
  } catch (error) {
    console.error('Create test error:', error);
    return NextResponse.json({ error: 'Failed to create test' }, { status: 500 });
  }
}
