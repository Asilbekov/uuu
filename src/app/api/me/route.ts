import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { telegramDeleteFile } from '@/lib/telegram';

export const runtime = 'nodejs';

/**
 * GET /api/me — the signed-in user's own profile (x-user-id auth).
 * Returns the fields the profile page needs: name, email and the
 * test-taking background preset key.
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, bgStyle: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 });
  }
}

/**
 * PUT /api/me — update the profile. Accepts the name (trimmed, non-empty)
 * and/or the test-taking background preset key (empty string resets it to
 * the standard background). Only the provided fields are changed.
 */
export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const body = await request.json().catch(() => ({}));
    const data: { name?: string; bgStyle?: string } = {};

    if (typeof body.name === 'string') {
      const name = body.name.trim();
      if (!name) {
        return NextResponse.json({ error: 'Name cannot be empty' }, { status: 400 });
      }
      if (name.length > 60) {
        return NextResponse.json({ error: 'Name is too long' }, { status: 400 });
      }
      data.name = name;
    }
    if (typeof body.bgStyle === 'string') {
      // Store the preset key only — the concrete CSS lives on the client,
      // so future presets keep working for everyone.
      data.bgStyle = body.bgStyle.slice(0, 40);
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const user = await db.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, name: true, bgStyle: true },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

/**
 * DELETE /api/me — permanently deletes the account. The DB cascade removes
 * every test, question, attachment, attempt, bookmark, chat message and tag
 * affinity owned by the user in one go. Files that live in the Telegram
 * channel (attachments, question/option photos, the avatar) are purged from
 * the channel best-effort AFTER the row is gone.
 */
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Collect every Telegram-hosted file BEFORE the cascade wipes the rows.
    const channelFiles: { fileId: string; msgId: number | null }[] = [];

    const attachments = await db.attachment.findMany({
      where: { test: { creatorId: userId }, url: { startsWith: 'tg:' } },
      select: { url: true, tgMessageId: true },
    });
    for (const a of attachments) channelFiles.push({ fileId: a.url.slice(3), msgId: a.tgMessageId });

    const questions = await db.question.findMany({
      where: { test: { creatorId: userId } },
      select: { imageUrl: true, imageMsgId: true, optionImages: true },
    });
    for (const q of questions) {
      if (q.imageUrl?.startsWith('tg:')) {
        channelFiles.push({ fileId: q.imageUrl.slice(3), msgId: q.imageMsgId });
      }
      const oi = q.optionImages as Record<string, any> | null;
      if (oi && typeof oi === 'object') {
        for (const v of Object.values(oi)) {
          const u = typeof v === 'string' ? v : v?.u;
          if (typeof u === 'string' && u.startsWith('tg:')) {
            channelFiles.push({ fileId: u.slice(3), msgId: typeof v === 'object' ? (v?.m ?? null) : null });
          }
        }
      }
    }

    const profile = await db.user.findUnique({
      where: { id: userId },
      select: { image: true },
    });
    if (profile?.image?.startsWith('tg:')) {
      channelFiles.push({ fileId: profile.image.slice(3), msgId: null });
    }

    // Content archive files (one JSON per test) live in the channel too
    const archives = await db.test.findMany({
      where: { creatorId: userId, archiveId: { not: null } },
      select: { archiveId: true, archiveMsgId: true },
    });
    for (const a of archives) {
      channelFiles.push({ fileId: a.archiveId as string, msgId: a.archiveMsgId ?? null });
    }

    // The Test→User relation is Restrict (no cascade), so the user's own
    // tests must go first — the Test-side cascades wipe their questions,
    // attachments, attempts, bookmarks and chats in the same round.
    await db.test.deleteMany({ where: { creatorId: userId } });
    await db.user.delete({ where: { id: userId } });

    // Best-effort channel cleanup — the account is already gone at this point.
    await Promise.allSettled(channelFiles.map(f => telegramDeleteFile(f.fileId, f.msgId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
