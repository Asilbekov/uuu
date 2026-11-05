#!/bin/bash
# ship_now.sh — идемпотентная доставка готовых ядер: v7w1 (cs_w47_uz), v7w2 (math1_w14_ru), v5w1 (ite_w14_ru).
# COMPLETE → скачать → QA (frames OCR + audio) → release → DB → TG dispatch → Range206 → rm.
# QA FAIL → re-push (спеки в репо уже исправлены), максимум 4 попытки.
export KAGGLE_API_TOKEN=$(cat /home/z/.kaggle/access_token)
export GH_TOKEN=$(cat /home/z/.gh_token)
cd /home/z/my-project/uuu
LOG=/tmp/ship_now.log
log() { echo "$(date +%T) $*" >> $LOG; }

on_release() {
  curl -s -o /dev/null -w "%{http_code}" -L -r 0-1023 \
    "https://github.com/Asilbekov/uuu/releases/download/course-videos-v2/$1.mp4" | grep -q 206
}

vids_of() {
  python3 - "$1" <<'EOF'
import re, json, sys
t = open(sys.argv[1]).read()
ls = [l for l in t.splitlines() if re.match(r'\s*VIDEOS\s*=', l)]
print(' '.join(json.loads(ls[-1].split('=', 1)[1].strip())))
EOF
}

ship_kernel() {
  local K=$1
  rm -rf render-out/$K; mkdir -p render-out/$K
  local ok=0
  for i in 1 2 3; do
    timeout 7200 kaggle kernels output freedomform/uuu-$K -p render-out/$K >> $LOG 2>&1 && ok=1 && break
    log "$K download retry $i"; sleep 60
  done
  [ $ok -eq 1 ] || { log "$K DOWNLOAD FAIL x3"; return 1; }
  local RC=0
  for MP4 in $(find render-out/$K -name "*.mp4"); do
    local SPEC=$(basename "$MP4" .mp4)
    if on_release "$SPEC"; then log "$SPEC already on release"; continue; fi
    local DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$MP4")
    log "$SPEC dur=${DUR}s"
    python3 /home/z/my-project/scripts/qa_frames_ocr.py "$MP4" 30 > /tmp/qa_$SPEC.txt 2>&1
    local FR=$?
    python3 video-pipeline-v2/tools/qa_audio.py "$MP4" "$DUR" >> /tmp/qa_$SPEC.txt 2>&1
    local AR=$?
    log "$SPEC QA frames=$FR audio=$AR: $(grep VERDICT /tmp/qa_$SPEC.txt | tr '\n' ' ')"
    if [ $FR -ne 0 ] || [ $AR -ne 0 ]; then
      log "$SPEC QA FAIL"
      RC=1
      break
    fi
    python3 video-pipeline-v2/tools/upload_release_v2.py "$MP4" >> $LOG 2>&1 || { log "$SPEC release FAIL"; RC=1; break; }
    log "$SPEC release uploaded"
    bun video-pipeline-v2/tools/update_db_v2.ts "$SPEC" >> $LOG 2>&1 || log "$SPEC db FAIL (continuing)"
    curl -s -X POST -H "Authorization: token $GH_TOKEN" -H "Accept: application/vnd.github+json" \
      "https://api.github.com/repos/Asilbekov/uuu/actions/workflows/telegram-video-upload.yml/dispatches" -d '{"ref":"main"}'
    sleep 20
    if on_release "$SPEC"; then log "$SPEC Range206 SHIPPED"; else log "$SPEC Range206 pending (CDN lag)"; fi
    touch /tmp/shipped_$SPEC
  done
  rm -rf render-out/$K
  log "$K cleaned"
  return $RC
}

while true; do
  ALLDONE=1
  for K in v7w1 v7w2 v5w1; do
    KD=video-pipeline-v2/kaggle/$K
    [ -d "$KD" ] || { log "$K no dir"; continue; }
    VIDS=$(vids_of $KD/render.py 2>/dev/null)
    [ -z "$VIDS" ] && { log "$K cannot read VIDEOS"; ALLDONE=0; sleep 600; continue; }
    NEED=0
    for S in $VIDS; do on_release "$S" || NEED=1; done
    [ $NEED -eq 0 ] && { log "$K all on release"; continue; }
    ALLDONE=0
    ST=$(kaggle kernels status freedomform/uuu-$K 2>&1 | tail -1)
    log "$K status: $ST"
    ERRN=$(ls /tmp/rp_$K.* 2>/dev/null | wc -l)
    if echo "$ST" | grep -qi "COMPLETE"; then
      if ship_kernel $K; then continue; fi
      # QA/ship fail → re-push с исправленными спеками
      if [ $ERRN -lt 4 ]; then
        touch /tmp/rp_$K.$((ERRN+1))
        log "$K re-push attempt $((ERRN+1))"
        (cd $KD && kaggle kernels push -p . >> $LOG 2>&1)
      else
        log "$K re-push limit reached — manual intervention"
        return 0 2>/dev/null || exit 0
      fi
    elif echo "$ST" | grep -qiE "ERROR|CANCEL"; then
      if [ $ERRN -lt 4 ]; then
        touch /tmp/rp_$K.$((ERRN+1))
        log "$K kernel error → re-push attempt $((ERRN+1))"
        (cd $KD && kaggle kernels push -p . >> $LOG 2>&1)
      fi
    else
      log "$K $ST — waiting"
    fi
  done
  [ $ALLDONE -eq 1 ] && { log "=== ALL SHIPPED: v7w1 v7w2 v5w1 ==="; break; }
  sleep 600
done
