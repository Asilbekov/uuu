import { db } from '@/lib/db';
import { NextRequest } from 'next/server';
import { telegramFileUrl } from '@/lib/telegram';

export const runtime = 'nodejs';

/**
 * GET /api/users/[id]/avatar
 *
 * Serves the user's profile photo from the same origin:
 *  - `tg:<file_id>` → Bot API getFile → the bytes are streamed through here
 *    (the bot token never reaches the client);
 *  - `data:...`     → decoded inline;
 *  - http(s)        → 302 redirect.
 * A missing photo is a plain 404 so the client falls back to the initials.
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await db.user.findUnique({ where: { id }, select: { image: true } });
    if (!user?.image) return new Response('No avatar', { status: 404 });
    const ref = user.image;

    if (ref.startsWith('tg:')) {
      const fileId = ref.slice(3);
      if (!fileId) return new Response('Invalid avatar reference', { status: 500 });
      try {
        const direct = await telegramFileUrl(fileId);
        const upstream = await fetch(direct, { redirect: 'follow' });
        if (!upstream.ok) return new Response('Avatar fetch failed', { status: 502 });
        return new Response(upstream.body, {
          status: 200,
          headers: {
            // Telegram document downloads arrive as octet-stream — the avatar
            // uploader only ever sends images, so pick the concrete type.
            'Content-Type': upstream.headers.get('content-type')?.includes('image')
              ? (upstream.headers.get('content-type') as string)
              : 'image/jpeg',
            // Perf: browser 5 min + Vercel edge CDN 24 h + SWR a week — avatars
            // change rarely; the client cache-busts with ?t= after an upload.
            'Cache-Control': 'public, max-age=300, s-maxage=86400, stale-while-revalidate=604800',
          },
        });
      } catch (e: any) {
        if (String(e?.message || '').startsWith('TELEGRAM_NOT_CONFIGURED')) {
          return new Response('Telegram storage is not configured', { status: 503 });
        }
        console.error('Avatar tg fetch error:', e);
        return new Response('Failed to fetch avatar', { status: 502 });
      }
    }

    if (ref.startsWith('data:')) {
      const m = /^data:([^;,]+)?((?:;[^,]*)*),([\s\S]*)$/.exec(ref);
      if (!m) return new Response('Invalid avatar data', { status: 500 });
      const contentType = m[1] || 'image/jpeg';
      const buffer = /base64/i.test(m[2] || '')
        ? Buffer.from(m[3], 'base64')
        : Buffer.from(decodeURIComponent(m[3]), 'utf-8');
      return new Response(new Uint8Array(buffer), {
        status: 200,
        headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=300, s-maxage=86400, stale-while-revalidate=604800' },
      });
    }

    if (/^https?:\/\//.test(ref)) {
      return new Response(null, { status: 302, headers: { Location: ref, 'Cache-Control': 'public, max-age=300, s-maxage=86400, stale-while-revalidate=604800' } });
    }

    return new Response('Unsupported avatar reference', { status: 500 });
  } catch (error) {
    console.error('Avatar route error:', error);
    return new Response('Failed to serve avatar', { status: 500 });
  }
}
