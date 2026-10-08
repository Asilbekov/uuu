import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

/**
 * GET /api/attachments/[id]/file
 * Serves the attachment's file bytes from the same origin so that:
 *  - PDFs can be shown in the PDF.js canvas viewer and in <iframe> viewers
 *    (raw.githubusercontent.com blocks framing; data: URLs are blocked for
 *    PDF rendering and top-level navigation by browsers);
 *  - HTTP Range requests work for audio/video seeking.
 *
 * Host policy (fixes the old "Host not allowed for file proxying" error):
 *  - URLs pointing at THIS site's own origin are 307-redirected to the file
 *    directly (no self-proxying) — study-guide PDFs served from /public use this;
 *  - any other PUBLIC http(s) host is proxied (GitHub, Google Drive, Dropbox,
 *    Wikimedia, S3, ... whatever the teacher attaches);
 *  - private / link-local / loopback targets are still refused (SSRF guard).
 */

function isPrivateHost(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/\.$/, '');
  if (h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.local') || h.endsWith('.internal') || h.endsWith('.home.arpa')) return true;
  // IPv4 literal — block loopback / private / link-local / carrier NAT ranges
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(h);
  if (m) {
    const [a, b] = [Number(m[1]), Number(m[2])];
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 169 && b === 254) return true; // link-local (incl. cloud metadata)
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
    return false;
  }
  // IPv6 literal — block loopback, link-local, unique-local
  if (h.includes(':')) {
    const clean = h.replace(/^\[|\]$/g, '');
    if (clean === '::' || clean === '::1') return true;
    if (/^f[cd]/.test(clean)) return true; // fc00::/7 unique-local
    if (/^fe[89ab]/.test(clean)) return true; // fe80::/10 link-local
    return false;
  }
  return false;
}

/** Origin of THIS deployment, derived from the incoming request headers. */
function requestOrigin(request: NextRequest): string {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (!host) return request.nextUrl.origin;
  const proto = request.headers.get('x-forwarded-proto') || (host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https');
  return `${proto}://${host}`;
}

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

    // --- same-origin URL: redirect straight to the file (no self-proxying) ---
    let target: URL;
    try {
      target = new URL(attachment.url);
    } catch {
      return new Response('Invalid attachment URL', { status: 500 });
    }
    const origin = requestOrigin(request);
    if (target.origin === origin) {
      return new Response(null, {
        status: 307,
        headers: { Location: target.toString(), 'Cache-Control': 'private, max-age=300' },
      });
    }

    // --- external URL: proxy any PUBLIC host; refuse private targets (SSRF) ---
    if (!/^https?:$/.test(target.protocol) || isPrivateHost(target.hostname)) {
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
