/**
 * tts_generate.mjs — batch-generate narration audio for all scenes.
 * Reads narration/*.json  →  tts/{Scene}_{i}.wav  (voice: jam, 24000 Hz)
 * Resumable: skips files that already exist and are non-trivial in size.
 * Usage: node tts_generate.mjs [--force]
 */
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const NARR_DIR = path.join(HERE, 'narration');
const TTS_DIR = path.join(HERE, 'tts');
const FORCE = process.argv.includes('--force');
const VOICE = 'jam';
const SPEED = 1.0;
const THROTTLE_MS = 4000;   // pause between API calls to avoid 429
const MAX_RETRY = 5;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

fs.mkdirSync(TTS_DIR, { recursive: true });

async function generateOne(zai, text, outPath) {
  const response = await zai.audio.tts.create({
    input: text,
    voice: VOICE,
    speed: SPEED,
    response_format: 'wav',
    stream: false,
  });
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(new Uint8Array(arrayBuffer));
  if (buffer.length < 1000) throw new Error('suspiciously small audio');
  fs.writeFileSync(outPath, buffer);
}

(async () => {
  const zai = await ZAI.create();
  const files = fs.readdirSync(NARR_DIR).filter(f => f.endsWith('.json')).sort();
  let done = 0, skipped = 0, failed = 0;

  for (const f of files) {
    const scenes = JSON.parse(fs.readFileSync(path.join(NARR_DIR, f), 'utf8'));
    for (const [scene, segs] of Object.entries(scenes)) {
      for (let i = 0; i < segs.length; i++) {
        const text = String(segs[i]).trim();
        const out = path.join(TTS_DIR, `${scene}_${String(i + 1).padStart(2, '0')}.wav`);
        if (!FORCE && fs.existsSync(out) && fs.statSync(out).size > 20000) {
          skipped++;
          continue;
        }
        let ok = false;
        for (let attempt = 1; attempt <= MAX_RETRY && !ok; attempt++) {
          try {
            await generateOne(zai, text, out);
            done++; ok = true;
          } catch (e) {
            const is429 = /429|Too many/i.test(e.message);
            if (attempt === MAX_RETRY) {
              failed++;
              console.error(`FAIL ${scene}_${i + 1} (attempt ${attempt}): ${e.message.slice(0, 120)}`);
            } else {
              await sleep(is429 ? THROTTLE_MS * attempt : 2500);
            }
          }
        }
        await sleep(THROTTLE_MS);
      }
    }
  }
  console.log(`\nTTS done: generated=${done} skipped=${skipped} failed=${failed}`);
  if (failed > 0) process.exit(1);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
