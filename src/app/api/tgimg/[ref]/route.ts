import { NextRequest, NextResponse } from 'next/server';
import { telegramConfigured, telegramFileUrl } from '@/lib/telegram';

export const runtime = 'nodejs';

/**
 * GET /api/tgimg/<file_id> — stream a PHOTO that lives in the owner's Telegram
 * channel (question photos and per-option photos on Question rows).
 *
 * The DB keeps only a lightweight `tg:<file_id>` reference; this route resolves
 * it through Bot API getFile and streams the bytes. Only image/* payloads are
 * served — everything else (documents/audio/video) stays behind the dedicated
 * attachment streaming route.
 *
 * Public like /api/attachments/[id]/file: anyone who can open the test can see
 * its photos; file_ids are unguessable tokens, so this leaks nothing else.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  try {
    const { ref } = await params;
    const fid = decodeURIComponent(ref || '').trim();
    if (!fid || !telegramConfigured()) {
      return new NextResponse('Not found', { status: 404 });
    }

    const url = await telegramFileUrl(fid);
    const upstream = await fetch(url);
    const ct = upstream.headers.get('content-type') || '';
    if (!upstream.ok || !ct.startsWith('image/')) {
      // The reference points at a non-image (or the post is gone) — never serve it
      return new NextResponse('Not found', { status: 404 });
    }

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': ct,
        // file_id → content mapping is stable; cache hard like an immutable asset
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
