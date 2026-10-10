import { db } from '@/lib/db';
import { uploadTestArchive } from '@/lib/test-archive';
import { sanitizeTags, ensureTagsExist } from '@/lib/tags';
import { findPublicTitleClash } from '@/lib/publish';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creatorId');

    let where: any = {};
    if (creatorId) {
      // Another user's library: only their PUBLIC tests are visible to the
      // requester (their private ones stay private). The creator themself
      // still sees everything they own.
      if (creatorId === userId) {
        where.creatorId = creatorId;
      } else {
        where = { creatorId, isPublic: true };
      }
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

    const testsRaw = await db.test.findMany({
      where,
      include: {
        creator: { select: { id: true, name: true, image: true } },
        _count: { select: { questions: true, attempts: true, attachments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Strip coverImage from response to keep it small, add hasCoverImage flag
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
    const { title, description, topic, isPublic, randomizeQuestions, randomizeOptions, questions, attachments, tags, coverIcon, coverColor } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const cleanTags = sanitizeTags(tags);
    const cleanIcon = typeof coverIcon === 'string' && [...coverIcon.trim()].length >= 1 && [...coverIcon.trim()].length <= 8 ? coverIcon.trim() : null;
    const cleanColor = typeof coverColor === 'string' && /^#[0-9a-fA-F]{6}$/.test(coverColor) ? coverColor : null;

    // Publishing rule: a NEW test can be created as public only under a title
    // that no other public test in the community library uses.
    if (isPublic !== false && title) {
      const clash = await findPublicTitleClash(title);
      if (clash) {
        return NextResponse.json({ error: 'PUBLISH_NAME_TAKEN' }, { status: 409 });
      }
    }

    const test = await db.test.create({
      data: {
        title,
        description: description || '',
        topic: topic || 'Chemistry',
        tags: cleanTags,
        coverIcon: cleanIcon,
        coverColor: cleanColor,
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
            explanation: q.explanation ?? null,
            translations: q.translations ?? undefined,
            imageNumber: q.imageNumber || null,
            imageUrl: typeof q.imageUrl === 'string' && q.imageUrl ? q.imageUrl : null,
            imageMsgId: typeof q.imageMsgId === 'number' ? q.imageMsgId : null,
            optionImages: q.optionImages && typeof q.optionImages === 'object' ? q.optionImages : undefined,
            orderNum: index,
          })),
        },
        ...(Array.isArray(attachments) && attachments.length > 0 && {
          attachments: {
            create: attachments.map((a: any, index: number) => ({
              title: a.title || 'Attachment',
              type: a.type || 'link',
              url: a.url,
              size: a.size ?? null,
              tgMessageId: typeof a.tgMessageId === 'number' ? a.tgMessageId : null,
              orderNum: a.orderNum ?? index,
            })),
          },
        }),
      },
      include: {
        questions: true,
        attachments: { orderBy: { orderNum: 'asc' } },
        creator: { select: { id: true, name: true } },
      },
    });

    // Store new tags in the global dictionary for future autocomplete suggestions
    await ensureTagsExist(cleanTags);

    // Content archive: the whole test (questions + answers) as a JSON file in
    // the Telegram channel. Best-effort — a Telegram hiccup must never fail
    // the creation; the archive will be (re)written by the next edit.
    try {
      const archive = await uploadTestArchive(test);
      const archived = await db.test.update({
        where: { id: test.id },
        data: { archiveId: archive.archiveId, archiveMsgId: archive.archiveMsgId },
      });
      return NextResponse.json(archived, { status: 201 });
    } catch (e) {
      console.error('Test archive upload failed (create):', e);
      return NextResponse.json(test, { status: 201 });
    }

  } catch (error) {
    console.error('Create test error:', error);
    return NextResponse.json({ error: 'Failed to create test' }, { status: 500 });
  }
}
