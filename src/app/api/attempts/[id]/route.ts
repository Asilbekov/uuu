import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { bumpAffinity } from '@/lib/affinity';

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

      // Recommendation signal: completing a test is the strongest interest
      // indicator. Weighted by HOW LONG the user stayed engaged and HOW HARD
      // the test was (the profile must reflect subjects, difficult tests and
      // time spent — not just raw counts):
      //   base +6, +up to 4 for minutes spent (long engagement = real interest),
      //   +2 when the user struggled (accuracy < 60% on a finished attempt).
      if (attempt.test) {
        const minutes = attempt.startedAt
          ? (Date.now() - new Date(attempt.startedAt).getTime()) / 60000
          : 0;
        const answered = answers ? answers.length : (attempt.totalQuestions || 0);
        const accuracy = answered > 0 ? score / answered : 1;
        const delta = Math.min(12, 6 + Math.min(4, minutes / 3) + (accuracy < 0.6 ? 2 : 0));
        bumpAffinity(
          userId,
          (attempt.test.tags || []).concat(attempt.test.topic ? [attempt.test.topic] : []),
          delta
        ).catch(() => {});
      }
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
