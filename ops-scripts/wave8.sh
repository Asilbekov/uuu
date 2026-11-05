#!/bin/bash
# wave8.sh — ждём 31 спецификацию → датасет v5 → 5 кернелов v8w → монитор → скачать → QA → шип.
# Идемпотентно: после рестарта песочницы не пере-пушит running/complete кернелы.
export KAGGLE_API_TOKEN=$(cat /home/z/.kaggle/access_token)
GH_TOKEN=$(cat /home/z/.gh_token 2>/dev/null)
cd /home/z/my-project/uuu
LOG=/tmp/wave8.log
SPECS_W8="ite_w14_uz ite_w57_uz la_w14_uz la_w57_uz math1_w14_uz"

log() { echo "$(date +%T) $*" >> $LOG; }

on_release() {
  curl -s -o /dev/null -w "%{http_code}" -L -r 0-1023 \
    "https://github.com/Asilbekov/uuu/releases/download/course-videos-v2/$1.mp4" | grep -q 206
}

vids_of() {  # $1=kernel-dir/render.py → список VIDEOS
  python3 - "$1" <<'EOF'
import re, json, sys
t = open(sys.argv[1]).read()
ls = [l for l in t.splitlines() if re.match(r'\s*VIDEOS\s*=', l)]
print(' '.join(json.loads(ls[-1].split('=', 1)[1].strip())))
EOF
}

ship_kernel() {  # $1=kernel-name (v8w1...)
  local K=$1
  log "----- processing $K -----"
  mkdir -p render-out/$K
  local ok=0
  for i in 1 2 3; do
    timeout 7200 kaggle kernels output freedomform/uuu-$K -p render-out/$K >> $LOG 2>&1 && ok=1 && break
    log "download retry $i for $K"; sleep 60
  done
  [ $ok -eq 1 ] || { log "$K DOWNLOAD FAIL ×3"; return 1; }

  for MP4 in $(find render-out/$K -name "*.mp4"); do
    local SPEC=$(basename "$MP4" .mp4)
    on_release "$SPEC" && { log "$SPEC already on release"; continue; }
    local DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$MP4")
    log "$SPEC: $MP4 dur=${DUR}s"
    python3 /home/z/my-project/scripts/qa_frames_ocr.py "$MP4" 30 > /tmp/qa_$SPEC.txt 2>&1
    local FR=$?
    python3 video-pipeline-v2/tools/qa_audio.py "$MP4" "$DUR" >> /tmp/qa_$SPEC.txt 2>&1
    local AR=$?
    log "$SPEC QA frames=$FR audio=$AR: $(grep VERDICT /tmp/qa_$SPEC.txt | tr '\n' ' ')"
    if [ $FR -ne 0 ] || [ $AR -ne 0 ]; then log "$SPEC QA FAIL — keeping disk"; return 1; fi
    python3 video-pipeline-v2/tools/upload_release_v2.py "$MP4" >> $LOG 2>&1 \
      || { log "$SPEC release upload FAIL"; return 1; }
    log "$SPEC release uploaded"
    bun video-pipeline-v2/tools/update_db_v2.ts "$SPEC" >> $LOG 2>&1 || log "$SPEC db FAIL (continuing)"
    curl -s -X POST -H "Authorization: token $GH_TOKEN" -H "Accept: application/vnd.github+json" \
      "https://api.github.com/repos/Asilbekov/uuu/actions/workflows/telegram-video-upload.yml/dispatches" \
      -d '{"ref":"main"}'
    sleep 20
    if on_release "$SPEC"; then log "$SPEC Range206 ✅ SHIPPED"; else log "$SPEC Range206 pending (CDN lag)"; fi
    touch /tmp/shipped_$SPEC
  done
  rm -rf render-out/$K
  log "$K cleaned"
  return 0
}

# ── 1. ждём 31 спек ──
while [ "$(ls video-pipeline-v2/content/specs-v2/*.json 2>/dev/null | wc -l)" -lt 31 ]; do sleep 300; done
log "=== 31 specs ready ==="

# ── 2. датасет v5 ──
python3 video-pipeline-v2/tools/package_dataset.py >> $LOG 2>&1
kaggle datasets version -p video-pipeline-v2/kaggle/ds -m "v5: 31 specs" --dir-mode zip >> $LOG 2>&1 \
  || log "dataset version WARN (may already be processing)"
for i in $(seq 1 60); do
  ST=$(kaggle datasets status freedomform/uuu-video-pipeline 2>&1)
  echo "$ST" | grep -q ready && break
  echo "$ST" | grep -qi error && { log "dataset ERROR: $ST"; exit 1; }
  sleep 60
done
log "dataset ready"

# ── 3. кернелы v8w (только 5 новых спеков) ──
mkdir -p /tmp/specs-w8 && rm -f /tmp/specs-w8/*.json
for S in $SPECS_W8; do cp "video-pipeline-v2/content/specs-v2/$S.json" /tmp/specs-w8/; done
rm -rf video-pipeline-v2/kaggle/v8w*
python3 video-pipeline-v2/tools/make_kernels.py --specs /tmp/specs-w8 --n 5 --prefix v8w --out video-pipeline-v2/kaggle/ >> $LOG 2>&1
log "make_kernels done: $(ls -d video-pipeline-v2/kaggle/v8w* 2>/dev/null | wc -l) kernels"

for KD in video-pipeline-v2/kaggle/v8w*; do
  K=$(basename $KD)
  ST=$(kaggle kernels status freedomform/uuu-$K 2>&1)
  if echo "$ST" | grep -qiE "complete|running"; then
    log "$K already $ST — skip push"
  else
    for i in 1 2 3; do
      kaggle kernels push -p $KD >> $LOG 2>&1 && { log "$K pushed (try $i)"; break; } || sleep 30
    done
  fi
  sleep 30
done

# ── 4. монитор → шип ──
RETRY=0
while true; do
  sleep 600
  ALL=1
  for KD in video-pipeline-v2/kaggle/v8w*; do
    K=$(basename $KD)
    VIDS=$(vids_of $KD/render.py)
    NEED=0
    for S in $VIDS; do on_release "$S" || NEED=1; done
    [ $NEED -eq 0 ] && continue
    ST=$(kaggle kernels status freedomform/uuu-$K 2>&1)
    log "$K status: $ST"
    if echo "$ST" | grep -qi "complete"; then
      ship_kernel $K
    elif echo "$ST" | grep -qiE "error|cancel" ; then
      RETRY=$((RETRY+1))
      if [ $RETRY -le 4 ]; then
        log "$K error → re-push (attempt $RETRY)"
        kaggle kernels push -p $KD >> $LOG 2>&1
      fi
    fi
    NEED=0
    for S in $VIDS; do on_release "$S" || NEED=1; done
    [ $NEED -eq 1 ] && ALL=0
  done
  [ $ALL -eq 1 ] && { log "=== WAVE8 COMPLETE — all specs shipped ==="; break; }
done
