import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

/**
 * GET /api/attachments/[id]/file
 * Serves the attachment's file bytes from the same origin so that:
 *  - PDFs can be shown in an <iframe> viewer (raw.githubusercontent.com blocks framing);
 *  - uploaded files (stored as data: URLs) can be played/viewed (data: URLs are blocked
 *    for PDF rendering and top-level navigation by browsers);
 *  - HTTP Range requests work for audio/video seeking.
 * External URLs are proxied from a strict host allowlist only.
 */

const ALLOWED_HOSTS = new Set([
  'raw.githubusercontent.com',
  'github.com',
  'objects.githubusercontent.com',
]);

function guessContentType(attachment: { type: string; url: string }): string {
  const url = attachment.url;
  const lower = url.split('?')[0].toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.mp3') || lower.endsWith('.m4a') || lower.endsWith('.wav') || lower.endsWith('.ogg')) return 'audio/mpeg';
  if (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mov')) return 'video/mp4';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.gif')) return 'image/gif';
  switch (attachment.type) {
    case 'pdf': return 'application/pdf';
    case 'audio': return 'audio/mpeg';
    case 'video': return 'video/mp4';
    case 'image': return 'image/png';
    default: return 'application/octet-stream';
  }
}

function parseDataUrl(dataUrl: string): { contentType: string; buffer: Buffer } | null {
  const match = /^data:([^;,]+)?((?:;[^,]*)*),([\s\S]*)$/.exec(dataUrl);
  if (!match) return null;
  const meta = match[2] || '';
  const payload = match[3];
  const isBase64 = /;base64/i.test(meta) || /;base64$/i.test(match[1] ? '' : meta);
  const contentType = (match[1] || 'application/octet-stream');
  const buffer = isBase64 || /base64/.test(meta)
    ? Buffer.from(payload, 'base64')
    : Buffer.from(decodeURIComponent(payload), 'utf-8');
  return { contentType, buffer };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const attachment = await db.attachment.findUnique({ where: { id } });
    if (!attachment) {
      return new Response('Attachment not found', { status: 404 });
    }

    const rangeHeader = request.headers.get('range');

    // --- data: URL (small uploaded files stored in DB) ---
    if (attachment.url.startsWith('data:')) {
      const parsed = parseDataUrl(attachment.url);
      if (!parsed) return new Response('Invalid attachment data', { status: 500 });
      const contentType = guessContentType(attachment) !== 'application/octet-stream'
        ? guessContentType(attachment)
        : parsed.contentType;
      const total = parsed.buffer.length;

      if (rangeHeader) {
        const m = /bytes=(\d*)-(\d*)/.exec(rangeHeader);
        if (m) {
          const start = m[1] ? parseInt(m[1], 10) : 0;
          const end = m[2] ? Math.min(parseInt(m[2], 10), total - 1) : total - 1;
          if (start <= end) {
            const chunk = parsed.buffer.subarray(start, end + 1);
            return new Response(new Uint8Array(chunk), {
              status: 206,
              headers: {
                'Content-Type': contentType,
                'Content-Length': String(chunk.length),
                'Content-Range': `bytes ${start}-${end}/${total}`,
                'Accept-Ranges': 'bytes',
                'Cache-Control': 'private, max-age=3600',
              },
            });
          }
        }
      }
      return new Response(new Uint8Array(parsed.buffer), {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Length': String(total),
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'private, max-age=3600',
        },
      });
    }

    // --- external URL (proxy with host allowlist) ---
    let target: URL;
    try {
      target = new URL(attachment.url);
    } catch {
      return new Response('Invalid attachment URL', { status: 500 });
    }
    if (!/^https?:$/.test(target.protocol) || !ALLOWED_HOSTS.has(target.hostname)) {
      return new Response('Host not allowed for file proxying', { status: 403 });
    }

    const upstreamHeaders: Record<string, string> = {};
    if (rangeHeader) upstreamHeaders['Range'] = rangeHeader;

    const upstream = await fetch(target.toString(), {
      headers: upstreamHeaders,
      redirect: 'follow',
    });
    if (!upstream.ok && upstream.status !== 206) {
      return new Response(`Upstream fetch failed (${upstream.status})`, { status: 502 });
    }

    const upstreamType = upstream.headers.get('content-type')?.split(';')[0] || '';
    // raw.githubusercontent.com often serves files as application/octet-stream,
    // which browsers refuse to render inline — fall back to the guessed type.
    const contentType =
      upstreamType && !['application/octet-stream', 'text/plain'].includes(upstreamType)
        ? upstreamType
        : guessContentType(attachment);
    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Cache-Control': 'private, max-age=3600',
    };
    const contentRange = upstream.headers.get('content-range');
    if (contentRange) headers['Content-Range'] = contentRange;
    const contentLength = upstream.headers.get('content-length');
    if (contentLength) headers['Content-Length'] = contentLength;
    if (upstream.headers.get('accept-ranges')) headers['Accept-Ranges'] = 'bytes';

    return new Response(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch (error) {
    console.error('Attachment file error:', error);
    return new Response('Failed to serve attachment', { status: 500 });
  }
}
