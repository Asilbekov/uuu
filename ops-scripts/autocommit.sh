#!/bin/bash
# autocommit.sh — каждые 15 мин: закоммитить и запушить прогресс чанков/спеков.
cd /home/z/my-project/uuu
git config user.email "bot@uuu.local" 2>/dev/null
git config user.name "v2-bot" 2>/dev/null
while true; do
  sleep 900
  git add video-pipeline-v2/content/chunks video-pipeline-v2/content/specs-v2 2>/dev/null
  if ! git diff --cached --quiet 2>/dev/null; then
    git commit -q -m "autocommit: v2 pipeline progress $(date '+%m-%d %H:%M')" || true
    for i in 1 2 3; do
      git push -q origin HEAD 2>>/tmp/autocommit.err && break || sleep 30
    done
    echo "$(date +%T) committed+pushed" >> /tmp/autocommit.log
  fi
done
