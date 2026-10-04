import { db } from '@/lib/db';
import { sanitizeTags, ensureTagsExist } from '@/lib/tags';
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
        attachments: { orderBy: { orderNum: 'asc' } },
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
    const { title, description, topic, isPublic, randomizeQuestions, randomizeOptions, questions, attachments, tags, coverIcon, coverColor } = body;

    // Clean optional cover overrides: empty string clears the stored value
    const cleanIcon = coverIcon !== undefined
      ? (typeof coverIcon === 'string' && [...coverIcon.trim()].length >= 1 && [...coverIcon.trim()].length <= 8 ? coverIcon.trim() : null)
      : undefined;
    const cleanColor = coverColor !== undefined
      ? (typeof coverColor === 'string' && /^#[0-9a-fA-F]{6}$/.test(coverColor) ? coverColor : null)
      : undefined;

    // Replace attachments if provided (full list from the editor)
    if (Array.isArray(attachments)) {
      await db.attachment.deleteMany({ where: { testId: id } });
      if (attachments.length > 0) {
        await db.attachment.createMany({
          data: attachments.map((a: any, index: number) => ({
            testId: id,
            title: a.title || 'Attachment',
            type: a.type || 'link',
            url: a.url,
            size: a.size ?? null,
            orderNum: a.orderNum ?? index,
          })),
        });
      }
    }

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
        ...(Array.isArray(tags) && { tags: sanitizeTags(tags) }),
        ...(cleanIcon !== undefined && { coverIcon: cleanIcon }),
        ...(cleanColor !== undefined && { coverColor: cleanColor }),
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
        attachments: { orderBy: { orderNum: 'asc' } },
        creator: { select: { id: true, name: true } },
      },
    });

    // Store new tags in the global dictionary for future autocomplete suggestions
    if (Array.isArray(tags)) await ensureTagsExist(test.tags);

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
