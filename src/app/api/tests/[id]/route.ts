import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const test = await db.test.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        questions: { orderBy: { orderNum: 'asc' } },
        _count: { select: { attempts: true } },
      },
    });

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    return NextResponse.json(test);
  } catch (error) {
    console.error('Get test error:', error);
    return NextResponse.json({ error: 'Failed to get test' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await db.test.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }
    if (existing.creatorId !== userId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, topic, isPublic, randomizeQuestions, randomizeOptions, questions } = body;

    // Delete existing questions and recreate
    if (questions) {
      await db.question.deleteMany({ where: { testId: id } });
    }

    const test = await db.test.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(topic && { topic }),
        ...(isPublic !== undefined && { isPublic }),
        ...(randomizeQuestions !== undefined && { randomizeQuestions }),
        ...(randomizeOptions !== undefined && { randomizeOptions }),
        ...(questions && {
          questions: {
            create: questions.map((q: any, index: number) => ({
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
        }),
      },
      include: {
        questions: { orderBy: { orderNum: 'asc' } },
        creator: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(test);
  } catch (error) {
    console.error('Update test error:', error);
    return NextResponse.json({ error: 'Failed to update test' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await db.test.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }
    if (existing.creatorId !== userId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    await db.test.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete test error:', error);
    return NextResponse.json({ error: 'Failed to delete test' }, { status: 500 });
  }
}
