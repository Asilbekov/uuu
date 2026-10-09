/**
 * Telegram attachment storage.
 *
 * Attached files are uploaded INTO the owner's Telegram channel via the Bot
 * API (sendDocument) and are NEVER stored anywhere else: the DB keeps only a
 * lightweight reference `tg:<file_id>` in Attachment.url. Downloads are served
 * by /api/attachments/[id]/file, which resolves the file_id through getFile
 * and streams the bytes to the client (Range requests included).
 *
 * Configuration (in .env / Vercel env):
 *   TELEGRAM_BOT_TOKEN  — bot token from @BotFather; the bot must be an ADMIN
 *                         of the target channel (it needs "Post messages").
 *   TELEGRAM_CHANNEL_ID — @publicname or -100... numeric id of the channel.
 *                         (An invite link like https://t.me/+... is NOT an id.)
 *
 * When the variables are not set the helpers below report "not configured"
 * and callers transparently fall back to the previous storage (data: URL in
 * the DB for small files) — nothing breaks, files just stay where they were.
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '';

export const TG_API = 'https://api.telegram.org';
// Bot API accepts documents up to 50 MB via sendDocument (multipart upload).
export const TG_MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

export function telegramConfigured(): boolean {
  return !!(BOT_TOKEN && CHANNEL_ID);
}

export type TgUploadResult = { fileId: string; name: string; size: number };

/** Upload one file into the configured channel as a document (no compression). */
export async function telegramUpload(opts: {
  name: string;
  buffer: Buffer;
  contentType?: string;
}): Promise<TgUploadResult> {
  if (!telegramConfigured()) throw new Error('TELEGRAM_NOT_CONFIGURED');
  if (opts.buffer.length > TG_MAX_UPLOAD_BYTES) throw new Error('TELEGRAM_TOO_LARGE');

  const form = new FormData();
  form.append('chat_id', CHANNEL_ID);
  const bytes = new Uint8Array(opts.buffer);
  form.append(
    'document',
    new Blob([bytes], { type: opts.contentType || 'application/octet-stream' }),
    opts.name
  );

  const res = await fetch(`${BOT_API_BASE()}/sendDocument`, { method: 'POST', body: form });
  const body: any = await res.json().catch(() => null);
  if (!res.ok || !body?.ok || !body?.result?.document?.file_id) {
    const desc = body?.description || `HTTP ${res.status}`;
    throw new Error(`TELEGRAM_UPLOAD_FAILED: ${desc}`);
  }
  const doc = body.result.document;
  return {
    fileId: doc.file_id as string,
    name: (doc.file_name as string) || opts.name,
    size: Number(doc.file_size) || opts.buffer.length,
  };
}

function BOT_API_BASE() {
  return `${TG_API}/bot${BOT_TOKEN}`;
}

/** Resolve a file_id to a short-lived direct download URL (Bot API getFile). */
export async function telegramFileUrl(fileId: string): Promise<string> {
  if (!telegramConfigured()) throw new Error('TELEGRAM_NOT_CONFIGURED');
  const res = await fetch(`${BOT_API_BASE()}/getFile?file_id=${encodeURIComponent(fileId)}`);
  const body: any = await res.json().catch(() => null);
  if (!res.ok || !body?.ok || !body?.result?.file_path) {
    const desc = body?.description || `HTTP ${res.status}`;
    throw new Error(`TELEGRAM_GETFILE_FAILED: ${desc}`);
  }
  return `${BOT_API_BASE()}/file/${body.result.file_path}`;
}
