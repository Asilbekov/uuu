#!/bin/bash
# ship_pipeline.sh $GH_TOKEN [kernels...] — download → QA → ship → free disk
# GH_TOKEN passed as arg (NEVER committed). Defaults to wave-3 kernels.
cd /home/z/my-project/uuu
export KAGGLE_API_TOKEN=$(cat /home/z/.kaggle/access_token)
export GH_TOKEN="${1:?usage: ship_pipeline.sh GH_TOKEN [kernels...]}"
shift
KERNELS="${@:-v2w2 v2w3 v2w4 v2w5 v2w6 v2w7}"
dispatch_tg() {
  curl -s -X POST -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer $GH_TOKEN" \
    https://api.github.com/repos/Asilbekov/uuu/actions/workflows/telegram-video-upload.yml/dispatches \
    -d '{"ref":"main"}' -w " dispatch:%{http_code}\n"
}
for K in $KERNELS; do
  if ! ls render-out/$K/videos/*/*.mp4 >/dev/null 2>&1; then
    for i in 1 2 3 4 5 6 7 8; do
      mkdir -p render-out/$K
      echo "[$(date +%H:%M)] $K download attempt $i"
      timeout 10800 kaggle kernels output "freedomform/uuu-$K" -p "render-out/$K" > "/tmp/fetch_$K.log" 2>&1
      ls render-out/$K/videos/*/*.mp4 >/dev/null 2>&1 && break
      echo "[$(date +%H:%M)] $K download failed"
      rm -rf render-out/$K
      sleep 120
    done
  fi
  ls render-out/$K/videos/*/*.mp4 >/dev/null 2>&1 || { echo "[$(date +%H:%M)] $K DOWNLOAD GAVE UP"; continue; }
  rm -rf render-out/$K/pipeline render-out/$K/work
  for MP4 in render-out/$K/videos/*/*.mp4; do
    SPEC_NAME=$(basename $(dirname "$MP4"))
    SPEC="video-pipeline-v2/content/specs-v2/$SPEC_NAME.json"
    SRT="${MP4%.mp4}.srt"
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
      rm -rf "render-out/$K"
    else
      echo "[$(date +%H:%M)] QA FAIL $SPEC_NAME — kept for inspection"
    fi
  done
done
echo "SHIP_PIPELINE_DONE $(date +%H:%M)"
