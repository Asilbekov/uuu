#!/bin/bash
# assemble_watcher.sh — каждые 5 мин: спек с полным набором чанков → assemble + validate + spec.
cd /home/z/my-project/uuu
SPECS="ite_w14_uz ite_w57_uz la_w14_uz la_w57_uz math1_w14_uz"
while true; do
  for S in $SPECS; do
    ID="${S%_*}"; LANG="${S##*_}"
    CDIR="video-pipeline-v2/content/chunks/$S"
    OUT="video-pipeline-v2/content/specs-v2/$S.json"
    [ -f "$OUT" ] && continue
    TOTAL=$(python3 -c "import json;print(len(json.load(open('video-pipeline-v2/content/chunks/$S.chunks.json'))['chunks']))" 2>/dev/null)
    [ -z "$TOTAL" ] && continue
    HAVE=$(ls $CDIR/c*.json 2>/dev/null | grep -v "_p" | wc -l)
    if [ "$HAVE" -ge "$TOTAL" ]; then
      echo "$(date +%T) assembling $S ($HAVE/$TOTAL)" >> /tmp/assemble.log
      if python3 video-pipeline-v2/tools/assemble.py --id "$ID" --lang "$LANG" --chunks "$CDIR" --out "$OUT" >> /tmp/assemble.log 2>&1; then
        if python3 video-pipeline-v2/tools/validate_spec.py "$OUT" >> /tmp/assemble.log 2>&1; then
          echo "$(date +%T) $S assembled+validated ✅" >> /tmp/assemble.log
        else
          echo "$(date +%T) $S VALIDATE FAIL — spec kept, check log" >> /tmp/assemble.log
        fi
      else
        rm -f "$OUT"
        echo "$(date +%T) $S ASSEMBLE FAIL" >> /tmp/assemble.log
      fi
    fi
  done
  sleep 300
done
