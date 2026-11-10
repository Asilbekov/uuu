#!/bin/bash
# restore.sh — ONE-COMMAND sandbox recovery. Secrets injected via env at runtime.
# Usage: GH_TOKEN=... KGAT=... ZAI_KEY=... bash restore.sh
set -u
REPO=/home/z/my-project/uuu
GH_TOKEN="${GH_TOKEN:?pass GH_TOKEN}"
KGAT="${KGAT:?pass KGAT}"
ZAI_KEY="${ZAI_KEY:?pass ZAI_KEY}"

mkdir -p /home/z/.kaggle /home/z/my-project /tmp
echo "$KGAT" > /home/z/.kaggle/access_token
echo "{\"apiKey\": \"$ZAI_KEY\", \"baseUrl\": \"https://api.z.ai/api/paas/v4\"}" > /home/z/.z-ai-config

[ -d "$REPO/.git" ] || git clone --depth 5 "https://$GH_TOKEN@github.com/Asilbekov/uuu.git" "$REPO"
cd "$REPO"
git fetch --depth 5 origin 2>/dev/null; git reset --hard origin/main 2>/dev/null
bun add z-ai-web-dev-sdk >/dev/null 2>&1
pip install kaggle --quiet 2>&1 | tail -1

cat > llm_probe.ts << 'PEOF'
import ZAI from 'z-ai-web-dev-sdk';
async function main() {
  const zai = await (ZAI as any).create();
  const r = await zai.chat.completions.create({
    model: 'glm-4.5-flash',
    messages: [{ role: 'user', content: 'say ok' }],
    max_tokens: 10,
  });
  console.log('INTERNAL_OK:', r.choices[0]?.message?.content);
}
main().catch(e => { console.error('INTERNAL_FAIL:', e.message); process.exit(1); });
PEOF

# 1. gen loop (user key CONC=1; switcher bumps to 8 when internal alive)
pgrep -f "gen_chunks.ts" > /dev/null || { nohup bash gen_loop.sh 1 > /tmp/gen_active.log 2>&1 & echo "gen loop started"; }

# 2. autocommit (15 min)
pgrep -f "git add video-pipeline-v2/content/chunks" > /dev/null || { nohup bash -c 'while true; do sleep 900; cd /home/z/my-project/uuu; git add video-pipeline-v2/content/chunks video-pipeline-v2/content/specs-v2 2>/dev/null; git commit -m "gen checkpoints auto" 2>/dev/null; git push origin HEAD 2>/dev/null; done' > /tmp/autocommit.log 2>&1 & echo "autocommit started"; }

# 3. assemble watcher
pgrep -f "assemble_watcher.sh" > /dev/null || { nohup bash assemble_watcher.sh > /tmp/assemble_watcher.log 2>&1 & echo "watcher started"; }

# 4. switcher
pgrep -f "gen_switch.sh" > /dev/null || { nohup bash gen_switch.sh > /tmp/gen_switch.log 2>&1 & echo "switcher started"; }

# 5. ship pipeline (wave-3 leftovers; skips kernels whose mp4 already landed)
pgrep -f "ship_pipeline.sh" > /dev/null || { nohup bash ship_pipeline.sh "$GH_TOKEN" > /tmp/ship_pipeline.log 2>&1 & echo "ship pipeline started"; }

echo "=== restore complete: $(date) ==="
