#!/bin/bash
# gen_switch.sh — internal (fast, CONC=8) ↔ user key (CONC=1) supervisor
cd /home/z/my-project/uuu
while true; do
  sleep 900
  [ -f /home/z/.z-ai-config ] && mv /home/z/.z-ai-config /home/z/.z-ai-config.uk
  P=$(timeout 30 bun llm_probe.ts 2>&1 | tail -1)
  RUN=$(pgrep -fc "gen_chunks.ts" 2>/dev/null || echo 0)
  CONC_NOW=$(ps aux | grep -v grep | grep "gen_chunks.ts" | grep -oE "CONC=[0-9]+" | head -1)
  if echo "$P" | grep -q "INTERNAL_OK"; then
    if [ "$RUN" = "0" ]; then
      nohup bash gen_loop.sh 8 > /tmp/gen_active.log 2>&1 &
      echo "[$(date +%H:%M)] internal alive → started CONC=8"
    elif [ "$CONC_NOW" != "CONC=8" ]; then
      pkill -f gen_chunks.ts; sleep 2
      nohup bash gen_loop.sh 8 > /tmp/gen_active.log 2>&1 &
      echo "[$(date +%H:%M)] internal alive → switched CONC=8"
    fi
  else
    [ -f /home/z/.z-ai-config.uk ] && mv /home/z/.z-ai-config.uk /home/z/.z-ai-config
    if [ "$RUN" = "0" ]; then
      nohup bash gen_loop.sh 1 > /tmp/gen_active.log 2>&1 &
      echo "[$(date +%H:%M)] internal dead → started CONC=1"
    elif [ "$CONC_NOW" = "CONC=8" ]; then
      pkill -f gen_chunks.ts; sleep 2
      nohup bash gen_loop.sh 1 > /tmp/gen_active.log 2>&1 &
      echo "[$(date +%H:%M)] internal dead → switched CONC=1"
    fi
  fi
  echo "[$(date +%H:%M)] probe: $(echo "$P" | cut -c1-45)"
done
