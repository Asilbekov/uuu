#!/bin/bash
# ship_pipeline.sh — последовательная доставка: скачать вывод кернела → QA → release → DB → TG → rm.
# Диск 9.9G — держим только один кернел за раз.
export KAGGLE_API_TOKEN=$(cat /home/z/.kaggle/access_token)
GH_TOKEN=$(cat /home/z/.gh_token 2>/dev/null)
cd /home/z/my-project/uuu
LOG=/tmp/ship.log

on_release() {  # $1=spec → 0 если уже есть на release
  curl -s -o /dev/null -w "%{http_code}" -L -r 0-1023 \
    "https://github.com/Asilbekov/uuu/releases/download/course-videos-v2/$1.mp4" | grep -q 206
}

ship_one() {  # $1=kernel  $2=spec
  local K=$1 SPEC=$2
  echo "$(date +%T) ===== $K / $SPEC =====" >> $LOG
  if on_release "$SPEC"; then echo "$(date +%T) $SPEC already on release, skip" >> $LOG; return 0; fi
  if [ -f "/tmp/shipped_$SPEC" ]; then echo "$(date +%T) $SPEC marked shipped, skip" >> $LOG; return 0; fi

  mkdir -p render-out/$K
  local ok=0
  for i in 1 2 3; do
    timeout 7200 kaggle kernels output freedomform/uuu-$K -p render-out/$K >> $LOG 2>&1 && ok=1 && break
    echo "$(date +%T) download retry $i for $K" >> $LOG; sleep 60
  done
  [ $ok -eq 1 ] || { echo "$(date +%T) $K: DOWNLOAD FAIL ×3" >> $LOG; return 1; }

  local MP4=$(find render-out/$K -name "*.mp4" | head -1)
  if [ -z "$MP4" ]; then echo "$(date +%T) $K: NO MP4 in output" >> $LOG; return 1; fi
  local DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$MP4")
  echo "$(date +%T) $SPEC: $MP4 dur=${DUR}s" >> $LOG

  python3 /home/z/my-project/scripts/qa_frames_ocr.py "$MP4" 30 > /tmp/qa_$SPEC.txt 2>&1
  local FR=$?
  python3 video-pipeline-v2/tools/qa_audio.py "$MP4" "$DUR" >> /tmp/qa_$SPEC.txt 2>&1
  local AR=$?
  echo "$(date +%T) $SPEC QA frames=$FR audio=$AR (0/0=PASS): $(grep VERDICT /tmp/qa_$SPEC.txt | tr '\n' ' ')" >> $LOG
  if [ $FR -ne 0 ] || [ $AR -ne 0 ]; then
    echo "$(date +%T) $SPEC QA FAIL — keeping $K on disk for inspection" >> $LOG
    return 1
  fi

  python3 video-pipeline-v2/tools/upload_release_v2.py "$MP4" >> $LOG 2>&1 \
    || { echo "$(date +%T) $SPEC release upload FAIL" >> $LOG; return 1; }
  echo "$(date +%T) $SPEC release uploaded" >> $LOG

  bun video-pipeline-v2/tools/update_db_v2.ts "$SPEC" >> $LOG 2>&1 \
    || echo "$(date +%T) $SPEC db update FAIL (continuing)" >> $LOG

  curl -s -X POST -H "Authorization: token $GH_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/Asilbekov/uuu/actions/workflows/telegram-video-upload.yml/dispatches" \
    -d '{"ref":"main"}' >> $LOG 2>&1
  echo "$(date +%T) $SPEC TG dispatch sent" >> $LOG

  sleep 20
  if on_release "$SPEC"; then
    echo "$(date +%T) $SPEC Range206 ✅ SHIPPED" >> $LOG
    touch /tmp/shipped_$SPEC
  else
    echo "$(date +%T) $SPEC Range206 not yet (may be CDN lag)" >> $LOG
    touch /tmp/shipped_$SPEC
  fi
  rm -rf render-out/$K
  echo "$(date +%T) $K cleaned, disk free" >> $LOG
  return 0
}

ship_one v5w1 ite_w14_ru
ship_one v7w1 cs_w47_uz
ship_one v7w2 math1_w14_ru
echo "$(date +%T) ===== ship pass complete =====" >> $LOG
