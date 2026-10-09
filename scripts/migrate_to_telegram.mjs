/**
 * One-shot migration: move every course file from "our storage"
 * (raw.githubusercontent.com/Asilbekov/uuu/... + uuu-sage-five.vercel.app/*.pdf)
 * INTO the owner's Telegram channel via the Bot API, exactly like fresh
 * uploads do. Attachment.url is rewritten to the lightweight `tg:<file_id>`
 * reference; the DB keeps no bytes. Pure external links (ted.com, bbc.co.uk)
 * are left untouched — they were never stored by us.
 *
 * Usage:  node scripts/migrate_to_telegram.mjs [--verify-only]
 * Env:    reads .env from the repo root (DATABASE_URL, TELEGRAM_BOT_TOKEN,
 *         TELEGRAM_CHANNEL_ID).
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// --- tiny .env parser ---
const envText = readFileSync(path.join(ROOT, '.env'), 'utf8');
const env = Object.fromEntries(
  envText.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(l => {
    const i = l.indexOf('=');
    return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')];
  })
);
const { DATABASE_URL, TELEGRAM_BOT_TOKEN: TOKEN, TELEGRAM_CHANNEL_ID: CHAT } = env;
if (!DATABASE_URL || !TOKEN || !CHAT) {
  console.error('Missing DATABASE_URL / TELEGRAM_BOT_TOKEN / TELEGRAM_CHANNEL_ID in .env');
  process.exit(1);
}

const { Client } = (await import(path.join(ROOT, 'node_modules/pg/lib/index.js'))).default ?? {};
const VERIFY_ONLY = process.argv.includes('--verify-only');

const MIME = { pdf: 'application/pdf', mp4: 'video/mp4', mp3: 'audio/mpeg', m4a: 'audio/mp4', png: 'image/png', jpg: 'image/jpeg' };

// Only OUR hosts count as "our storage" — everything else is an external
// link that was never stored by us and must stay a link.
const OWN_HOST_RE = /(raw\.githubusercontent\.com\/Asilbekov\/uuu\/|uuu-sage-five\.vercel\.app\/)/;
const TG_MAX = 50 * 1024 * 1024;

async function tgApi(method, body) {
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, { method: 'POST', body });
  const json = await res.json().catch(() => null);
  if (!json?.ok) throw new Error(`${method} failed: ${json?.description || res.status}`);
  return json.result;
}

async function main() {
  const db = new Client({ connectionString: DATABASE_URL });
  await db.connect();

  const rows = (await db.query(
    `SELECT id, title, type, url, size FROM "Attachment" ORDER BY "createdAt"`
  )).rows;

  const own = rows.filter(r => /^https?:\/\//.test(r.url) && OWN_HOST_RE.test(r.url));
  const external = rows.filter(r => /^https?:\/\//.test(r.url) && !OWN_HOST_RE.test(r.url));
  const tgRefs = rows.filter(r => r.url.startsWith('tg:'));

  console.log(`Attachments total=${rows.length} | own-storage=${own.length} | external-links=${external.length} | already-tg=${tgRefs.length}`);
  for (const r of external) console.log(`  [link-kept] ${r.id.slice(-6)} ${r.title.slice(0, 40)} → ${r.url.slice(0, 60)}`);

  // ---------------- verification-only mode ----------------
  if (VERIFY_ONLY) {
    let ok = 0, bad = 0;
    for (const r of tgRefs) {
      try {
        const form = new FormData();
        form.append('file_id', r.url.slice(3));
        await tgApi('getFile', form);
        ok++;
      } catch (e) { bad++; console.log(`  [BROKEN] ${r.id.slice(-6)} ${r.title}: ${e.message}`); }
    }
    console.log(`VERIFY: tg-refs ok=${ok} broken=${bad}`);
    await db.end();
    return;
  }

  // ---------------- migration ----------------
  const report = [];
  for (const r of own) {
    const label = `${r.id.slice(-6)} "${(r.title || '').slice(0, 38)}"`;
    try {
      console.log(`↓ ${label} ← ${r.url.slice(0, 80)}`);
      const up = await fetch(r.url, { redirect: 'follow' });
      if (!up.ok) throw new Error(`download HTTP ${up.status}`);
      const buf = Buffer.from(await up.arrayBuffer());

      if (buf.length > TG_MAX) {
        console.log(`  ⚠ SKIP (>${Math.round(TG_MAX / 1048576)}MB, ${Math.round(buf.length / 1048576)}MB) — stays on its current host`);
        report.push({ id: r.id, title: r.title, status: 'TOO_BIG', size: buf.length });
        continue;
      }

      const name = decodeURIComponent(new URL(r.url).pathname.split('/').pop() || 'file');
      const ext = (name.split('.').pop() || '').toLowerCase();
      const form = new FormData();
      form.append('chat_id', CHAT);
      form.append('document', new Blob([new Uint8Array(buf)], { type: MIME[ext] || 'application/octet-stream' }), name);
      const doc = await tgApi('sendDocument', form);

      // Telegram auto-detects MIME: mp3 → result.audio, mp4 → result.video
      const sent = doc.document || doc.audio || doc.video || doc.voice;
      const fileId = sent?.file_id;
      if (!fileId) throw new Error('no file_id in response');
      await db.query(`UPDATE "Attachment" SET url = $1, size = $2, "updatedAt" = now() WHERE id = $3`,
        [`tg:${fileId}`, buf.length, r.id]);
      console.log(`  ✓ migrated (${Math.round(buf.length / 1024)}KB) → tg:${fileId.slice(0, 24)}…`);
      report.push({ id: r.id, title: r.title, status: 'MIGRATED', size: buf.length });
      await new Promise(s => setTimeout(s, 350)); // be gentle with the API
    } catch (e) {
      console.log(`  ✗ FAILED: ${e.message}`);
      report.push({ id: r.id, title: r.title, status: 'FAILED', error: e.message });
    }
  }

  // ---------------- final verification ----------------
  const after = (await db.query(`SELECT id, title, url, size FROM "Attachment" ORDER BY "createdAt"`)).rows;
  const nowTg = after.filter(r => r.url.startsWith('tg:'));
  const stillHttp = after.filter(r => /^https?:\/\//.test(r.url) && OWN_HOST_RE.test(r.url));
  const dataRows = after.filter(r => r.url.startsWith('data:'));
  console.log('\n================ MIGRATION REPORT ================');
  console.log(`migrated to Telegram : ${nowTg.length}`);
  console.log(`still on our hosts   : ${stillHttp.length} ${stillHttp.map(r => r.title.slice(0, 25)).join(' | ')}`);
  console.log(`data: in DB          : ${dataRows.length}`);
  const ext = after.filter(r => /^https?:\/\//.test(r.url) && !OWN_HOST_RE.test(r.url));
  console.log(`external links (kept): ${ext.length}`);
  const fails = report.filter(x => x.status === 'FAILED');
  if (fails.length) { console.log('FAILED items:'); for (const f of fails) console.log('  -', f.title, f.error); }

  // verify every tg ref resolves
  let ok = 0, bad = 0;
  for (const r of nowTg) {
    try {
      const form = new FormData();
      form.append('file_id', r.url.slice(3));
      await tgApi('getFile', form);
      ok++;
    } catch { bad++; console.log(`  [BROKEN after migrate] ${r.title}`); }
  }
  console.log(`VERIFY tg-refs: ok=${ok} broken=${bad}`);
  await db.end();
}

main().catch(e => { console.error(e); process.exit(1); });
