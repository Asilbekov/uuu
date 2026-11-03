"""Upload the big course videos (> 50 MB Bot API upload limit) into the
Telegram channel via MTProto (2 GB limit for bots on the MTProto layer),
then rewrite the Attachment rows to `tg:<bot_api_file_id>` with fallbackUrl
pointing at the GitHub backup host.

Why the forward trick: the Bot API file_id of a file can only be minted by
the Bot API itself. We forward the freshly uploaded channel post back into
the same channel (one API call), read the file_id from the result and delete
the forward immediately — the original post stays.

Resumable: rows whose url no longer matches the source patterns (already
migrated to tg:) are skipped automatically.
"""
import asyncio
import json
import os
import subprocess
import sys
import urllib.request

import psycopg2
from telethon import TelegramClient
from telethon.sessions import StringSession
from telethon.tl.types import DocumentAttributeVideo
from telethon.errors import FloodWaitError

TOKEN = os.environ['TELEGRAM_BOT_TOKEN']
API_ID = int(os.environ['TELEGRAM_API_ID'])
API_HASH = os.environ['TELEGRAM_API_HASH']
CHANNEL = -1004360223044
DB_URL = os.environ['DATABASE_URL']
WORKDIR = '/tmp/videos'

SOURCE_SQL = """
    SELECT url, id, title, size FROM "Attachment"
    WHERE url LIKE 'https://github.com/Asilbekov/uuu/releases/download/%'
       OR (url LIKE 'https://raw.githubusercontent.com/Asilbekov/uuu%' AND type = 'video')
    ORDER BY url
"""


def bot_api(method, data):
    req = urllib.request.Request(
        f'https://api.telegram.org/bot{TOKEN}/{method}',
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
    )
    with urllib.request.urlopen(req, timeout=180) as r:
        body = json.load(r)
    if not body.get('ok'):
        raise RuntimeError(f'{method}: {body.get("description")}')
    return body['result']


def probe(path):
    """duration/w/h via ffprobe (present on ubuntu runners)."""
    try:
        out = subprocess.check_output([
            'ffprobe', '-v', 'error', '-show_entries',
            'format=duration:stream=width,height,codec_type',
            '-of', 'json', path,
        ])
        d = json.loads(out)
        duration = float(d.get('format', {}).get('duration', 0))
        w = h = 0
        for s in d.get('streams', []):
            if s.get('codec_type') == 'video':
                w, h = s.get('width', 0), s.get('height', 0)
                break
        return int(duration), w, h
    except Exception:
        return 0, 0, 0


def download(url, dest):
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return
    print(f'  downloading {url.rsplit("/", 1)[-1]} …', flush=True)
    req = urllib.request.Request(url, headers={'User-Agent': 'uuu-uploader'})
    with urllib.request.urlopen(req, timeout=600) as r, open(dest + '.part', 'wb') as f:
        while True:
            chunk = r.read(1 << 20)
            if not chunk:
                break
            f.write(chunk)
    os.rename(dest + '.part', dest)


def db_cursor():
    """Fresh connection per use: Neon drops idle SSL during long uploads."""
    conn = psycopg2.connect(DB_URL, connect_timeout=30)
    conn.autocommit = True
    return conn, conn.cursor()


async def main():
    os.makedirs(WORKDIR, exist_ok=True)
    conn, cur = db_cursor()
    cur.execute(SOURCE_SQL)
    rows = cur.fetchall()
    conn.close()

    groups = {}  # url -> {title}
    for url, _id, title, size in rows:
        groups.setdefault(url, {'title': title or url.rsplit('/', 1)[-1]})
    print(f'{len(groups)} unique files to upload ({len(rows)} attachment rows)', flush=True)
    if not groups:
        print('nothing to do')
        return

    client = TelegramClient(StringSession(), API_ID, API_HASH)
    await client.start(bot_token=TOKEN)
    print('MTProto connected as', (await client.get_me()).username, flush=True)

    done, failed = 0, 0
    for url, meta in groups.items():
        name = url.rsplit('/', 1)[-1]
        dest = os.path.join(WORKDIR, name)
        try:
            download(url, dest)
            size = os.path.getsize(dest)
            duration, w, h = probe(dest)
            caption = meta['title'][:900]

            # --- MTProto upload (bypasses the 50 MB Bot API limit) ---
            msg = None
            for attempt in range(1, 6):
                try:
                    msg = await client.send_file(
                        CHANNEL, dest, caption=caption,
                        attributes=[DocumentAttributeVideo(
                            duration=duration, w=w, h=h, supports_streaming=True)],
                        supports_streaming=True,
                    )
                    break
                except FloodWaitError as e:
                    print(f'  FloodWait {e.seconds}s — sleeping', flush=True)
                    if attempt == 5:
                        raise
                    await asyncio.sleep(e.seconds + 2)
            print(f'  uploaded as msg {msg.id} ({size} bytes)', flush=True)

            # --- mint the Bot API file_id via the forward trick ---
            fwd = bot_api('forwardMessage', {
                'chat_id': CHANNEL, 'from_chat_id': CHANNEL, 'message_id': msg.id,
            })
            media = fwd.get('video') or fwd.get('document') or fwd.get('audio') or {}
            file_id = media.get('file_id')
            bot_api('deleteMessage', {'chat_id': CHANNEL, 'message_id': fwd['message_id']})
            if not file_id:
                raise RuntimeError('no file_id in forward result')
            print(f'  bot file_id: {file_id[:28]}…', flush=True)

            # --- rewrite the DB rows (fresh connection: the old one may have
            #     been dropped by Neon while the upload was running) ---
            conn, cur = db_cursor()
            cur.execute(
                '''UPDATE "Attachment"
                   SET url = %s, "tgMessageId" = %s, size = %s,
                       "fallbackUrl" = %s, "updatedAt" = now()
                   WHERE url = %s RETURNING id''',
                (f'tg:{file_id}', msg.id, size, url, url),
            )
            updated = cur.rowcount
            conn.close()
            print(f'OK {name}: msg={msg.id} rows={updated}', flush=True)
            done += 1
            os.remove(dest)
            await asyncio.sleep(3)
        except Exception as e:
            failed += 1
            print(f'FAIL {name}: {type(e).__name__} {e}', flush=True)

    print(f'\n=== uploaded ok={done} failed={failed} ===', flush=True)
    await client.disconnect()
    conn.close()
    sys.exit(1 if failed else 0)


asyncio.run(main())
