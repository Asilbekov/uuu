import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const attempt = await db.testAttempt.findUnique({
      where: { id },
      include: {
        test: {
          include: { questions: { orderBy: { orderNum: 'asc' } } },
        },
        answers: { include: { question: true } },
      },
    });

    if (!attempt) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    }

    return NextResponse.json(attempt);
  } catch (error) {
    console.error('Get attempt error:', error);
    return NextResponse.json({ error: 'Failed to get attempt' }, { status: 500 });
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
    const body = await request.json();
    const { answers, completed } = body;

    const attempt = await db.testAttempt.findUnique({
      where: { id },
      include: { test: { include: { questions: true } } },
    });

    if (!attempt) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    }
    if (attempt.userId !== userId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Save answers
    if (answers && answers.length > 0) {
      // Delete existing answers for this attempt
      await db.attemptAnswer.deleteMany({ where: { attemptId: id } });

      // Create new answers
      await db.attemptAnswer.createMany({
        data: answers.map((a: any) => ({
          attemptId: id,
          questionId: a.questionId,
          selectedAnswer: a.selectedAnswer,
          isCorrect: a.isCorrect,
        })),
      });
    }

    // Complete the attempt
    if (completed) {
      let score = 0;
      if (answers) {
        score = answers.filter((a: any) => a.isCorrect).length;
      }

      // Use the number of answers as totalQuestions (may be less than full test if user selected fewer)
      const totalQ = answers ? answers.length : attempt.totalQuestions;

      await db.testAttempt.update({
        where: { id },
        data: {
          completed: true,
          score,
          totalQuestions: totalQ,
          completedAt: new Date(),
        },
      });
    }

    const updated = await db.testAttempt.findUnique({
      where: { id },
      include: { test: true, answers: { include: { question: true } } },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update attempt error:', error);
    return NextResponse.json({ error: 'Failed to update attempt' }, { status: 500 });
  }
}
