#!/bin/bash
# assemble_watcher.sh — assembles+validates RU/UZ specs when all chunks present
cd /home/z/my-project/uuu
while true; do
  for S in cs_w47_ru la_w57_ru eng_w57_ru ite_w14_ru ite_w57_ru hist_w14_uz hist_w56_uz la_w57_uz cs_w47_uz eng_w57_uz ite_w14_uz ite_w57_uz la_w14_ru la_w14_uz math1_w14_ru math1_w14_uz; do
    LANG2="${S##*_}"; ID="${S%_*}"
    PLAN="video-pipeline-v2/content/chunks/$S.chunks.json"
    DIR="video-pipeline-v2/content/chunks/$S"
    OUT="video-pipeline-v2/content/specs-v2/$S.json"
    [ -f "$OUT" ] && continue
    [ -f "$PLAN" ] || continue
    [ -d "$DIR" ] || continue
    DONE=$(python3 - "$PLAN" "$DIR" << 'PYEOF'
import json, os, re, sys
d = json.load(open(sys.argv[1]))
chs = d if isinstance(d, list) else d.get('chunks', d.get('blocks', []))
files = os.listdir(sys.argv[2])
fulls = {f for f in files if re.fullmatch(r'c\d+\.json', f)}
have = set(fulls)
for f in files:
    m = re.fullmatch(r'c(\d+)_p\d+\.json', f)
    if m and f'c{m.group(1)}.json' not in fulls:
        have.add(f'c{m.group(1)}')
print('OK' if len(have) >= len(chs) else 'NO')
PYEOF
)
    if [ "$DONE" = "OK" ]; then
      python3 video-pipeline-v2/tools/assemble.py --id "$ID" --lang "$LANG2" --chunks "$DIR" --out "$OUT" 2>&1 | tail -1
      python3 video-pipeline-v2/tools/validate_spec.py --spec "$OUT" 2>&1 | tail -1
    fi
  done
  sleep 300
done
