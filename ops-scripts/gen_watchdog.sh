#!/bin/bash
# gen_watchdog.sh — генерация обязана жить: умерла → старт, стоит 30 мин без новых
# чанков → kill+restart. Когда все 5 спеков собраны по idx-покрытию — выход.
cd /home/z/my-project/uuu
SPECS="math1_w14_uz"
LOG=/tmp/gen_watchdog.log
log() { echo "$(date +%T) $*" >> $LOG; }

start_gen() {  # $1 = CONC
  ( LLM_MODEL=glm-4.5-flash CONC=$1 nohup bash -c "for i in 1 2 3 4 5 6 7 8; do for S in $SPECS; do ID=\"\${S%_*}\"; LANG=\"\${S##*_}\"; LLM_MODEL=glm-4.5-flash bun video-pipeline-v2/tools/gen_chunks.ts video-pipeline-v2/content/chunks/\$S.chunks.json \$LANG video-pipeline-v2/content/chunks/\$S \$ID $1; done; done" > /tmp/gen_direct.log 2>&1 & )
}

all_done() {
  python3 - <<'EOF'
import json, os, re, sys
SPECS = "ite_w14_uz ite_w57_uz la_w14_uz la_w57_uz math1_w14_uz".split()
base = 'video-pipeline-v2/content/chunks'
for S in SPECS:
    need = len(json.load(open(f'{base}/{S}.chunks.json'))['chunks'])
    have = set()
    for f in os.listdir(f'{base}/{S}'):
        m = re.match(r'c(\d+)\.json$', f)
        if m: have.add(int(m.group(1)))
    if len([i for i in range(need) if i in have]) < need:
        sys.exit(1)
sys.exit(0)
EOF
}

C_PREV=$(ls video-pipeline-v2/content/chunks/*/c*.json 2>/dev/null | grep -v _p | wc -l)
while true; do
  sleep 600
  if all_done; then log "all 5 specs complete by idx — watchdog exits"; exit 0; fi
  MODE=$(cat /tmp/genmode 2>/dev/null || echo user)
  CONC=$([ "$MODE" = "internal" ] && echo 8 || echo 1)
  N=$(ps aux | grep -c "[g]en_chunks")
  C_NOW=$(ls video-pipeline-v2/content/chunks/*/c*.json 2>/dev/null | grep -v _p | wc -l)
  if [ "$N" -eq 0 ]; then
    start_gen $CONC
    log "gen dead → started CONC=$CONC"
  elif [ "$C_NOW" -eq "$C_PREV" ]; then
    pkill -f gen_chunks; sleep 3
    start_gen $CONC
    log "stall: $C_NOW chunks unchanged 12min → restarted CONC=$CONC"
  else
    log "ok: $C_NOW chunks (+$((C_NOW-C_PREV))) CONC=$CONC"
  fi
  C_PREV=$C_NOW
done
