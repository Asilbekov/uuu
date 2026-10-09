import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { telegramConfigured, telegramUpload } from '@/lib/telegram';

export const runtime = 'nodejs';

/**
 * POST /api/me/avatar  (multipart: file=<image>)
 *
 * Stores the profile photo IN THE TELEGRAM CHANNEL like every other file:
 * the bot uploads it as a document and the DB keeps only the lightweight
 * `tg:<file_id>` reference in User.image. The photo is served back by
 * GET /api/users/[id]/avatar which resolves the reference on demand.
 *
 * Fallback: when Telegram misbehaves, images up to 300 KB land inline as a
 * data: URL so the avatar still works (the client normally sends a
 * canvas-resized 256×256 JPEG of a few dozen KB anyway).
 */
const TG_AVATAR_MAX = 8 * 1024 * 1024; // hard cap for the raw request body
const DB_FALLBACK_LIMIT = 300 * 1024;

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const user = await db.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (file.size > TG_AVATAR_MAX) {
      return NextResponse.json({ error: 'FILE_TOO_LARGE', max: TG_AVATAR_MAX }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type || 'image/jpeg';
    const name = `avatar-${userId}.${contentType.includes('png') ? 'png' : 'jpg'}`;

    if (telegramConfigured()) {
      try {
        const up = await telegramUpload({ name, buffer, contentType });
        await db.user.update({ where: { id: userId }, data: { image: `tg:${up.fileId}` } });
        return NextResponse.json({
          ok: true,
          kind: 'telegram',
          avatarUrl: `/api/users/${userId}/avatar`,
        });
      } catch (e) {
        // fall through to the inline fallback for small images
        if (buffer.length > DB_FALLBACK_LIMIT) {
          console.error('Avatar upload to Telegram failed:', e);
          return NextResponse.json(
            { error: 'AVATAR_UPLOAD_FAILED', detail: String((e as any)?.message || e) },
            { status: 502 }
          );
        }
      }
    } else if (buffer.length > DB_FALLBACK_LIMIT) {
      return NextResponse.json({ error: 'FILE_TOO_LARGE', max: DB_FALLBACK_LIMIT }, { status: 413 });
    }

    const dataUrl = `data:${contentType};base64,${buffer.toString('base64')}`;
    await db.user.update({ where: { id: userId }, data: { image: dataUrl } });
    return NextResponse.json({ ok: true, kind: 'data', avatarUrl: `/api/users/${userId}/avatar` });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
