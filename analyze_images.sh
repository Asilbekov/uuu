#!/bin/bash
DIR="/home/z/my-project/upload/chem2_extracted/chem 2"
OUT="/home/z/my-project/upload/chem2_extracted"

for i in $(seq 1 85); do
  # Find the file with matching number
  FILE=$(ls "$DIR"/photo_${i}_*.jpg 2>/dev/null | head -1)
  if [ -n "$FILE" ]; then
    echo "Processing image $i: $FILE"
    z-ai vision -p "This is a chemistry test question image. Extract the question text and all answer options (A, B, C, D). Identify which answer is correct if marked. Return ONLY valid JSON in this exact format: {\"question\": \"...\", \"options\": {\"A\": \"...\", \"B\": \"...\", \"C\": \"...\", \"D\": \"...\"}, \"correct\": \"A\"}. If you cannot determine the correct answer, set correct to null. Make sure all quotes are double quotes for valid JSON." -i "$FILE" -o "$OUT/result_${i}.json" 2>/dev/null
    echo "Done: $i"
  else
    echo "File not found for image $i"
  fi
done
