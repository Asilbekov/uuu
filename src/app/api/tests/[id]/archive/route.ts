import { db } from '@/lib/db';
import { telegramFileUrl } from '@/lib/telegram';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

/**
 * GET /api/tests/[id]/archive
 *
 * Streams the test's content archive — the JSON file with the whole test
 * (questions, options, correct answers, explanations, translations, photo
 * references) that is stored IN THE TELEGRAM CHANNEL.
 *
 * This is the "load it back into the site's memory when needed" path:
 *   - the creator can always download their own archive;
 *   - everybody else only when the test is public;
 *   - a test saved before archiving existed has no file yet → 404.
 *
 * Response headers force a download with a readable file name.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = _request.headers.get('x-user-id');
    if (!userId) {
      return new Response('Not authenticated', { status: 401 });
    }

    const { id } = await params;
    const test = await db.test.findUnique({
      where: { id },
      select: {
        title: true,
        isPublic: true,
        creatorId: true,
        archiveId: true,
      },
    });
    if (!test) return new Response('Test not found', { status: 404 });
    if (test.creatorId !== userId && !test.isPublic) {
      return new Response('Not authorized', { status: 403 });
    }
    if (!test.archiveId) {
      return new Response('No archive file for this test yet (save it once to create one)', { status: 404 });
    }

    const direct = await telegramFileUrl(test.archiveId);
    const upstream = await fetch(direct, { redirect: 'follow' });
    if (!upstream.ok || !upstream.body) {
      return new Response('Archive fetch failed', { status: 502 });
    }

    // Readable, header-safe file name: the title with non-word chars collapsed
    const safeTitle = (test.title || 'test').replace(/[^\p{L}\p{N}\-_ ]+/gu, ' ').trim().slice(0, 60) || 'test';
    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(safeTitle)}.json"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (e: any) {
    if (String(e?.message || '').startsWith('TELEGRAM_NOT_CONFIGURED')) {
      return new Response('Telegram storage is not configured', { status: 503 });
    }
    console.error('Archive download error:', e);
    return new Response('Failed to fetch archive', { status: 502 });
  }
}
