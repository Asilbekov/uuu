import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { telegramConfigured, telegramUpload, TG_MAX_UPLOAD_BYTES } from '@/lib/telegram';

export const runtime = 'nodejs';

/**
 * POST /api/attachments/upload  (multipart: file=<file>)
 *
 * Attached files go into the OWNER'S TELEGRAM CHANNEL (TELEGRAM_BOT_TOKEN /
 * TELEGRAM_CHANNEL_ID) — they are not stored anywhere else. The response
 * carries a lightweight `tg:<file_id>` reference that is saved as the
 * attachment url; bytes are streamed back on demand by
 * /api/attachments/[id]/file.
 *
 * Fallback: when Telegram is not configured yet, files up to 3.5 MB are
 * returned as a data: URL (the previous behaviour — stored in the DB) so the
 * editor keeps working before the bot is connected. Bigger files are refused
 * with FILE_STORAGE_UNAVAILABLE in that case.
 */
const DB_FALLBACK_LIMIT = 3.5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    // The user must exist (same guard as the other write endpoints)
    const user = await db.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (file.size > TG_MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: 'FILE_TOO_LARGE', max: TG_MAX_UPLOAD_BYTES }, { status: 413 });
    }

    if (telegramConfigured()) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const up = await telegramUpload({
          name: file.name || 'attachment',
          buffer,
          contentType: file.type || 'application/octet-stream',
        });
        return NextResponse.json({
          ok: true,
          kind: 'telegram',
          url: `tg:${up.fileId}`,
          name: up.name,
          size: up.size,
          // Channel post id — flows back with the save payload so the file can
          // be deleted from the channel when it is removed from the test.
          tgMessageId: up.messageId,
        });
      } catch (e: any) {
        // Telegram hiccup: fall through to the data: fallback when possible,
        // otherwise surface the error so the user can retry.
        if (file.size > DB_FALLBACK_LIMIT) {
          return NextResponse.json(
            { error: 'TELEGRAM_UPLOAD_FAILED', detail: String(e?.message || e) },
            { status: 502 }
          );
        }
      }
    }

    if (file.size > DB_FALLBACK_LIMIT) {
      return NextResponse.json(
        { error: 'FILE_STORAGE_UNAVAILABLE', detail: 'Telegram storage is not configured and the file exceeds the in-DB fallback limit' },
        { status: 503 }
      );
    }

    // Legacy fallback — small files as data: URL inside the DB
    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUrl = `data:${file.type || 'application/octet-stream'};base64,${buffer.toString('base64')}`;
    return NextResponse.json({ ok: true, kind: 'data', url: dataUrl, size: file.size });
  } catch (error) {
    console.error('Attachment upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
