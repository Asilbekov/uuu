#!/bin/bash
cd /home/z/my-project
export DATABASE_URL='postgresql://neondb_owner:npg_omga5szZAf4l@ep-shiny-paper-aousfq8l-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
while true; do
  echo "Starting server at $(date)" >> /tmp/next-keep-alive.log
  node node_modules/.bin/next dev --port 3000 -H 0.0.0.0 >> /tmp/next-keep-alive.log 2>&1
  EXIT_CODE=$?
  echo "Server exited with code $EXIT_CODE at $(date)" >> /tmp/next-keep-alive.log
  sleep 2
done
