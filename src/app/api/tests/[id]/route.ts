import { db } from '@/lib/db';
import { sanitizeTags, ensureTagsExist } from '@/lib/tags';
import { findPublicTitleClash } from '@/lib/publish';
import { telegramDeleteFile } from '@/lib/telegram';
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
    // Editing is CREATOR-ONLY: a test that belongs to somebody else can never
    // be changed in place — the client copies it into the requester's own
    // library first (POST /api/tests/[id]/copy) and edits that copy.
    if (existing.creatorId !== userId) {
      return NextResponse.json({ error: 'Not allowed: this test belongs to another author — edit your copy of it' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, topic, isPublic, randomizeQuestions, randomizeOptions, questions, attachments, tags, coverIcon, coverColor } = body;

    // Publishing rule: a test can go PUBLIC only under a title that no other
    // public test in the community library currently uses.
    const effectivePublic = isPublic !== undefined ? isPublic === true : existing.isPublic;
    if (effectivePublic && title) {
      const clash = await findPublicTitleClash(title, id);
      if (clash) {
        return NextResponse.json({ error: 'PUBLISH_NAME_TAKEN' }, { status: 409 });
      }
    }

    // Clean optional cover overrides: empty string clears the stored value
    const cleanIcon = coverIcon !== undefined
      ? (typeof coverIcon === 'string' && [...coverIcon.trim()].length >= 1 && [...coverIcon.trim()].length <= 8 ? coverIcon.trim() : null)
      : undefined;
    const cleanColor = coverColor !== undefined
      ? (typeof coverColor === 'string' && /^#[0-9a-fA-F]{6}$/.test(coverColor) ? coverColor : null)
      : undefined;

    // Replace attachments if provided (full list from the editor)
    if (Array.isArray(attachments)) {
      // Diff BEFORE the wipe: attachments the user removed in the editor must
      // ALSO disappear from the Telegram channel, not just from the DB.
      const existing = await db.attachment.findMany({
        where: { testId: id },
        select: { url: true, tgMessageId: true },
      });
      const keptUrls = new Set<string>(attachments.map((a: any) => String(a.url || '')));
      const removedTg = existing.filter(a => a.url.startsWith('tg:') && !keptUrls.has(a.url));

      await db.attachment.deleteMany({ where: { testId: id } });
      if (attachments.length > 0) {
        await db.attachment.createMany({
          data: attachments.map((a: any, index: number) => ({
            testId: id,
            title: a.title || 'Attachment',
            type: a.type || 'link',
            url: a.url,
            size: a.size ?? null,
            tgMessageId: typeof a.tgMessageId === 'number' ? a.tgMessageId : null,
            orderNum: a.orderNum ?? index,
          })),
        });
      }

      // Best-effort channel cleanup (rows saved before tgMessageId bookkeeping
      // cannot be removed — the Bot API cannot look up a message by file_id).
      await Promise.allSettled(
        removedTg.map(a => telegramDeleteFile(a.url.slice(3), a.tgMessageId))
      );
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
              explanation: q.explanation ?? null,
              translations: q.translations ?? undefined,
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

    // Bookkeeping BEFORE the row disappears: every attachment stored in the
    // Telegram channel must be removed from the channel too (best-effort —
    // the same cleanup the editor does for removed attachments). DB rows,
    // bookmarks, chat messages and attempts all go away with the cascading
    // delete, so the test also leaves every community library at once.
    const channelFiles = await db.attachment.findMany({
      where: { testId: id, url: { startsWith: 'tg:' } },
      select: { url: true, tgMessageId: true },
    });

    await db.test.delete({ where: { id } });

    await Promise.allSettled(
      channelFiles.map(a => telegramDeleteFile(a.url.slice(3), a.tgMessageId))
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete test error:', error);
    return NextResponse.json({ error: 'Failed to delete test' }, { status: 500 });
  }
}
