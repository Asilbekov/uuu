#!/bin/bash
# ship_from_zips.sh $GH_TOKEN $ZIPDIR — unzip → QA → ship → cleanup
cd /home/z/my-project/uuu
export KAGGLE_API_TOKEN=$(cat /home/z/.kaggle/access_token)
export GH_TOKEN="${1:?pass GH_TOKEN}"
ZIPDIR="${2:-render-zips}"
dispatch_tg() {
  curl -s -X POST -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer $GH_TOKEN" \
    https://api.github.com/repos/Asilbekov/uuu/actions/workflows/telegram-video-upload.yml/dispatches \
    -d '{"ref":"main"}' -w " dispatch:%{http_code}\n"
}
for ZIP in $ZIPDIR/*.zip; do
  K=$(basename "$ZIP" .zip)
  DONE_MARKER="/tmp/shipped_$K"
  [ -f "$DONE_MARKER" ] && continue
  mkdir -p render-out/$K
  unzip -o -q "$ZIP" -d render-out/$K
  for MP4 in render-out/$K/videos/*/*.mp4; do
    SPEC_NAME=$(basename $(dirname "$MP4"))
    SRT="${MP4%.mp4}.srt"
    SPEC="video-pipeline-v2/content/specs-v2/$SPEC_NAME.json"
    [ -f "$SPEC" ] || SPEC=$(ls video-pipeline-v2/content/specs-v2/${SPEC_NAME%_*}_*.json 2>/dev/null | head -1)
    DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$MP4")
    echo "[$(date +%H:%M)] QA $SPEC_NAME (${DUR%.*}s)"
    python3 video-pipeline-v2/tools/qa_frames.py "$MP4" "$SPEC" "$SRT" 2>&1 | tail -3
    python3 video-pipeline-v2/tools/qa_audio.py "$MP4" "${DUR%.*}" 2>&1 | tail -3
    if python3 video-pipeline-v2/tools/qa_frames.py "$MP4" "$SPEC" "$SRT" 2>&1 | grep -q "PASS" && \
       python3 video-pipeline-v2/tools/qa_audio.py "$MP4" "${DUR%.*}" 2>&1 | grep -q "PASS"; then
      echo "[$(date +%H:%M)] SHIP $SPEC_NAME"
      python3 video-pipeline-v2/tools/upload_release_v2.py "$MP4" 2>&1 | tail -1
      bun video-pipeline-v2/tools/update_db_v2.ts "$SPEC_NAME" 2>&1 | tail -1
      dispatch_tg
      touch "$DONE_MARKER"
    else
      echo "[$(date +%H:%M)] QA FAIL $SPEC_NAME — kept"
    fi
  done
  rm -rf render-out/$K
done
echo "SHIP_FROM_ZIPS_DONE $(date +%H:%M)"
