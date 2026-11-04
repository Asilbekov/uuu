#!/bin/bash
# gen_loop.sh $CONC — RU/UZ chunk generation loop (skips existing chunks)
cd /home/z/my-project/uuu
CONC="${1:-1}"
SPECS="cs_w47_ru la_w57_ru eng_w57_ru ite_w14_ru ite_w57_ru hist_w14_uz hist_w56_uz la_w57_uz cs_w47_uz eng_w57_uz ite_w14_uz ite_w57_uz la_w14_ru la_w14_uz math1_w14_ru math1_w14_uz"
for i in 1 2 3 4 5 6 7 8 9 10; do
  for S in $SPECS; do
    LANG2="${S##*_}"; ID="${S%_*}"
    CONC=$CONC LLM_MODEL=glm-4.5-flash bun video-pipeline-v2/tools/gen_chunks.ts \
      "video-pipeline-v2/content/chunks/$S.chunks.json" "$LANG2" \
      "video-pipeline-v2/content/chunks/$S" "$ID" "$CONC"
  done
done
