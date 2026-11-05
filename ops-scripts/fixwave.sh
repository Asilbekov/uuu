#!/bin/bash
# fixwave.sh — датасет v5 (с исправленными спеками) → ре-пуш v5w1+v7w2 → монитор → скачать → QA → шип.
export KAGGLE_API_TOKEN=$(cat /home/z/.kaggle/access_token)
GH_TOKEN=$(cat /home/z/.gh_token 2>/dev/null)
export GH_TOKEN
cd /home/z/my-project/uuu
LOG=/tmp/fixwave.log
log() { echo "$(date +%T) $*" >> $LOG; }

on_release() {
  curl -s -o /dev/null -w "%{http_code}" -L -r 0-1023 \
    "https://github.com/Asilbekov/uuu/releases/download/course-videos-v2/$1.mp4" | grep -q 206
}

ship_kernel() {  # $1=kernel-name
  local K=$1
  log "----- ship_kernel $K -----"
  rm -rf render-out/$K; mkdir -p render-out/$K
  local ok=0
  for i in 1 2 3; do
    timeout 7200 kaggle kernels output freedomform/uuu-$K -p render-out/$K >> $LOG 2>&1 && ok=1 && break
    log "download retry $i for $K"; sleep 60
  done
  [ $ok -eq 1 ] || { log "$K DOWNLOAD FAIL ×3"; return 1; }
  local REP=$(find render-out/$K -name "render_report.json" | head -1)
  [ -n "$REP" ] && python3 -c "import json;r=json.load(open('$REP'));print(r.get('results'))" >> $LOG 2>&1

  local ANYFAIL=0
  for MP4 in $(find render-out/$K -name "*.mp4"); do
    local SPEC=$(basename "$MP4" .mp4)
    on_release "$SPEC" && { log "$SPEC already on release"; continue; }
    local DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$MP4")
    log "$SPEC: dur=${DUR}s"
    python3 /home/z/my-project/scripts/qa_frames_ocr.py "$MP4" 30 > /tmp/qa_$SPEC.txt 2>&1
    local FR=$?
    python3 video-pipeline-v2/tools/qa_audio.py "$MP4" "$DUR" >> /tmp/qa_$SPEC.txt 2>&1
    local AR=$?
    log "$SPEC QA frames=$FR audio=$AR: $(grep VERDICT /tmp/qa_$SPEC.txt | tr '\n' ' ')"
    if [ $FR -ne 0 ] || [ $AR -ne 0 ]; then log "$SPEC QA FAIL — keep disk"; return 1; fi
    python3 video-pipeline-v2/tools/upload_release_v2.py "$MP4" >> $LOG 2>&1 \
      || { log "$SPEC release upload FAIL"; return 1; }
    log "$SPEC release uploaded"
    bun video-pipeline-v2/tools/update_db_v2.ts "$SPEC" >> $LOG 2>&1 || log "$SPEC db FAIL"
    curl -s -X POST -H "Authorization: token $GH_TOKEN" -H "Accept: application/vnd.github+json" \
      "https://api.github.com/repos/Asilbekov/uuu/actions/workflows/telegram-video-upload.yml/dispatches" \
      -d '{"ref":"main"}'
    sleep 20
    on_release "$SPEC" && log "$SPEC Range206 ✅ SHIPPED" || log "$SPEC Range206 pending"
    touch /tmp/shipped_$SPEC
  done
  rm -rf render-out/$K
  log "$K cleaned"
}

# ── 1. датасет v5 с исправленными спеками ──
if [ ! -f /tmp/fixwave_ds_ready ]; then
  python3 video-pipeline-v2/tools/package_dataset.py >> $LOG 2>&1
  kaggle datasets version -p video-pipeline-v2/kaggle/ds -m "v5: fixed ru specs (narr raw-cmd)" --dir-mode zip >> $LOG 2>&1 \
    || log "ds version WARN"
  for i in $(seq 1 60); do
    ST=$(kaggle datasets status freedomform/uuu-video-pipeline 2>&1)
    echo "$ST" | grep -q ready && break
    echo "$ST" | grep -qi error && { log "dataset ERROR: $ST"; exit 1; }
    sleep 60
  done
  touch /tmp/fixwave_ds_ready
  log "dataset v5 ready"
fi

# ── 2. ре-пуш (если кернел не running) ──
for K in v5w1 v7w2; do
  KD=video-pipeline-v2/kaggle/$K
  ST=$(kaggle kernels status freedomform/uuu-$K 2>&1)
  if echo "$ST" | grep -qi "running"; then
    log "$K still running — skip push"
  else
    kaggle kernels push -p $KD >> $LOG 2>&1 && log "$K re-pushed with fixed spec"
  fi
  sleep 30
done

# ── 3. монитор → шип ──
while true; do
  sleep 600
  DONE_ALL=1
  for K in v5w1 v7w2; do
    case $K in
      v5w1) SPEC=ite_w14_ru;;
      v7w2) SPEC=math1_w14_ru;;
    esac
    on_release "$SPEC" && continue
    DONE_ALL=0
    ST=$(kaggle kernels status freedomform/uuu-$K 2>&1)
    log "$K status: $ST"
    echo "$ST" | grep -qi "complete" && ship_kernel $K
  done
  [ $DONE_ALL -eq 1 ] && { log "=== FIXWAVE COMPLETE ==="; break; }
done
