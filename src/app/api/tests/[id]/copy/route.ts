import { db } from '@/lib/db';
import { uploadTestArchive } from '@/lib/test-archive';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * POST /api/tests/[id]/copy
 *
 * "Edit" on a test that belongs to somebody else never edits the original:
 * this endpoint makes a COPY in the requester's own library and returns it.
 * Rules:
 *  - the copy is PRIVATE (isPublic = false) — publishing it is a separate,
 *    explicit step with a uniqueness check on the title;
 *  - the copy gets a UNIQUE name: "<original> · <user name>", extended with
 *    " (2)", " (3)", … until no test with that exact name exists;
 *  - questions (texts, options, correct answers, explanations, stored
 *    translations) and attachments (incl. Telegram `tg:` references, which
 *    keep pointing at the same channel files) are cloned 1:1.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true },
    });
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { id } = await params;
    const source = await db.test.findUnique({
      where: { id },
      include: {
        questions: { orderBy: { orderNum: 'asc' } },
        attachments: { orderBy: { orderNum: 'asc' } },
      },
    });
    if (!source) return NextResponse.json({ error: 'Test not found' }, { status: 404 });

    // --- unique name: "<title> · <user name>" (+ " (2)", " (3)", …) ---
    const base = `${source.title} · ${user.name || 'copy'}`.trim().slice(0, 180);
    let title = base;
    for (let n = 2; ; n++) {
      const exists = await db.test.findFirst({ where: { title }, select: { id: true } });
      if (!exists) break;
      title = `${base} (${n})`;
    }

    const copy = await db.test.create({
      data: {
        title,
        description: source.description,
        topic: source.topic,
        tags: source.tags,
        coverIcon: source.coverIcon,
        coverColor: source.coverColor,
        creatorId: userId,
        isPublic: false, // private until the owner publishes it under its unique name
        randomizeQuestions: source.randomizeQuestions,
        randomizeOptions: source.randomizeOptions,
        questions: {
          create: source.questions.map((q, index) => ({
            text: q.text,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            optionE: q.optionE,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            translations: q.translations ?? undefined,
            imageNumber: q.imageNumber,
            // Photos: same tg: references as attachments — the copy shares the
            // channel posts with the original (bytes live once in the channel)
            imageUrl: q.imageUrl,
            imageMsgId: q.imageMsgId,
            optionImages: q.optionImages ?? undefined,
            orderNum: index,
          })),
        },
        attachments: source.attachments.length
          ? {
              create: source.attachments.map((a, index) => ({
                title: a.title,
                type: a.type,
                url: a.url, // tg: references / data: URLs / external links — all reusable
                size: a.size,
                tgMessageId: a.tgMessageId, // keeps the channel post traceable in the copy
                orderNum: a.orderNum ?? index,
              })),
            }
          : undefined,
      },
      include: {
        questions: { orderBy: { orderNum: 'asc' } },
        attachments: { orderBy: { orderNum: 'asc' } },
        creator: { select: { id: true, name: true } },
        _count: { select: { attempts: true } },
      },
    });

    // The copy gets its OWN content archive in the Telegram channel (the
    // original's archive keeps describing the original). Best-effort.
    let finalCopy = copy;
    try {
      const archive = await uploadTestArchive(copy);
      finalCopy = await db.test.update({
        where: { id: copy.id },
        data: { archiveId: archive.archiveId, archiveMsgId: archive.archiveMsgId },
        include: {
          questions: { orderBy: { orderNum: 'asc' } },
          attachments: { orderBy: { orderNum: 'asc' } },
          creator: { select: { id: true, name: true } },
          _count: { select: { attempts: true } },
        },
      });
    } catch (e) {
      console.error('Test archive upload failed (copy):', e);
    }

    return NextResponse.json(finalCopy);
  } catch (error) {
    console.error('Test copy error:', error);
    return NextResponse.json({ error: 'Failed to copy test' }, { status: 500 });
  }
}
