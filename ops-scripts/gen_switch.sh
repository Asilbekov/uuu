#!/bin/bash
# gen_switch.sh — каждые 15 мин: проба internal /etc/.z-ai-config (тяжёлая, max_tokens 200).
# user-mode + internal жив → переключить gen на internal CONC=8.
# internal-mode + internal умер → вернуть user key CONC=1.
cd /home/z/my-project/uuu

restart_gen() {
  C=$1
  pkill -f gen_chunks 2>/dev/null; sleep 3
  nohup bash -c "for i in 1 2 3 4 5 6 7 8; do for S in ite_w14_uz ite_w57_uz la_w14_uz la_w57_uz math1_w14_uz; do ID=\"\${S%_*}\"; LANG=\"\${S##*_}\"; LLM_MODEL=glm-4.5-flash bun video-pipeline-v2/tools/gen_chunks.ts video-pipeline-v2/content/chunks/\$S.chunks.json \$LANG video-pipeline-v2/content/chunks/\$S \$ID $C; done; done" > /tmp/gen_direct.log 2>&1 &
  echo "$(date +%T) gen restarted CONC=$C mode=$(cat /tmp/genmode)" >> /tmp/gen_switch.log
}

if [ ! -f /tmp/llm_probe200.ts ]; then
cat > /tmp/llm_probe200.ts <<'EOF'
import ZAI from 'z-ai-web-dev-sdk';
const zai = await ZAI.create();
const r = await zai.chat.completions.create({ messages: [{ role: 'user', content: 'Write a 40-word paragraph about mathematics.' }], max_tokens: 200 });
console.log('PROBE_OK', (r.choices[0]?.message?.content || '').length);
EOF
fi

while true; do
  sleep 900
  MODE=$(cat /tmp/genmode 2>/dev/null || echo user)
  if [ "$MODE" = "user" ]; then
    mv /home/z/.z-ai-config /home/z/.z-ai-config.userkey 2>/dev/null
    if timeout 120 bun /tmp/llm_probe200.ts >/tmp/probe.out 2>&1; then
      echo internal > /tmp/genmode
      restart_gen 8
      echo "$(date +%T) === internal ALIVE → internal CONC=8 ===" >> /tmp/gen_switch.log
    else
      mv /home/z/.z-ai-config.userkey /home/z/.z-ai-config 2>/dev/null
      echo "$(date +%T) internal still dead (user mode kept)" >> /tmp/gen_switch.log
    fi
  else
    if timeout 120 bun /tmp/llm_probe200.ts >/tmp/probe.out 2>&1; then
      echo "$(date +%T) internal ok (kept CONC=8)" >> /tmp/gen_switch.log
    else
      mv /home/z/.z-ai-config.userkey /home/z/.z-ai-config 2>/dev/null
      echo user > /tmp/genmode
      restart_gen 1
      echo "$(date +%T) === internal DIED → user CONC=1 ===" >> /tmp/gen_switch.log
    fi
  fi
done
