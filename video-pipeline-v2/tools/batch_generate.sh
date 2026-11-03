#!/bin/bash
# batch_generate.sh — LLM-генерация всех чанков всех спеков (идемпотентно, чекпоинты по файлам)
cd /home/z/my-project/uuu
CONC=${CONC:-6}
SPECS="math1_w57_en
la_w14_en la_w57_en cs_w47_en hist_w14_en hist_w56_en ite_w14_en ite_w57_en
eng_w57_en eng_w14qa_en
math1_w14_ru math1_w57_ru la_w14_ru la_w57_ru cs_w47_ru hist_w14_ru hist_w56_ru
ite_w14_ru ite_w57_ru eng_w57_ru
math1_w14_uz math1_w57_uz la_w14_uz la_w57_uz cs_w47_uz hist_w14_uz hist_w56_uz
ite_w14_uz ite_w57_uz eng_w57_uz"

for S in $SPECS; do
  ID="${S%_*}"; LANG="${S##*_}"
  CDIR="video-pipeline-v2/content/chunks/$S"
  TOTAL=$(python3 -c "import json; print(len(json.load(open('video-pipeline-v2/content/chunks/$S.chunks.json'))['chunks']))")
  HAVE=$(ls $CDIR/c*.json 2>/dev/null | grep -v "_p" | wc -l)
  if [ "$HAVE" -ge "$TOTAL" ]; then
    echo "=== $S: уже готово ($HAVE/$TOTAL) ==="
    continue
  fi
  echo "=== $S: $HAVE/$TOTAL чанков, генерирую... ==="
  LLM_MODEL=glm-4.5-flash timeout 470 bun video-pipeline-v2/tools/gen_chunks.ts \
    video-pipeline-v2/content/chunks/$S.chunks.json $LANG $CDIR $ID $CONC 2>&1 | grep -E "FAILED|DONE|split" | tail -6
done
echo "=== BATCH PASS COMPLETE ==="
