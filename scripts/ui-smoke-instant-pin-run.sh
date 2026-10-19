#!/bin/bash
# UI smoke — INSTANT PIN (the user's exact repro):
#   pin a test in Discover → return to My Library → the card is THERE (no reload).
# Server + all agent-browser steps run in ONE bash call (background processes
# are recycled between calls). Setup fixtures must already exist (see
# ui-smoke-instant-pin-setup.cjs output /tmp/pin-setup.json).
cd /home/z/my-project/repo-uuu
BASE=http://127.0.0.1:3199

echo "== 0) fresh fixtures + clear browser cookies =="
(PORT=3199 STANDALONE=1 node .next/standalone/server.js > /tmp/srv-pin4.log 2>&1 &)
code=000
for i in $(seq 1 25); do
  code=$(curl -s -o /dev/null -w "%{http_code}" $BASE/api/me --max-time 2 2>/dev/null)
  [ "$code" = "401" ] && break
  sleep 1
done
echo "server: $code"
BASE=$BASE node scripts/ui-smoke-instant-pin-setup.cjs > /tmp/pin-setup.json && echo "fixtures: ok"
agent-browser cookies clear > /dev/null && echo "cookies: cleared"
STAMP=$(python3 -c "import json;print(json.load(open('/tmp/pin-setup.json'))['stamp'])")
EMAIL="v.$STAMP@ui.test"
TITLE="Pin smoke $STAMP"

echo "== 2) open + hydration =="
agent-browser set viewport 390 844 > /dev/null
agent-browser open "$BASE/?fresh=pin3" > /dev/null
agent-browser wait --load networkidle > /dev/null
HYD=$(agent-browser eval "(() => { const i=[...document.querySelectorAll('input')][0]; const bad=performance.getEntriesByType('resource').filter(r=>r.responseStatus>=400 && !r.name.includes('favicon')).length; return JSON.stringify({hydrated: i?Object.keys(i).some(k=>k.startsWith('__react')):false, bad}); })()")
echo "hydration: $HYD"

echo "== 3) login =="
agent-browser eval "(() => { const set=(el,v)=>{const d=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el),'value'); d.set.call(el,v); el.dispatchEvent(new Event('input',{bubbles:true}));}; const em=[...document.querySelectorAll('input')].find(i=>i.type==='email'); const pw=[...document.querySelectorAll('input')].find(i=>i.type==='password'); set(em,'$EMAIL'); set(pw,'ui-pass-123'); return 'ok'; })()" > /dev/null
agent-browser find role button click --name "Sign In" > /dev/null
LOGGED=no
for i in $(seq 1 20); do
  if agent-browser eval "!!document.querySelector('button[aria-label=\"My Library\"]')" | rg -q "true"; then LOGGED=yes; break; fi
  sleep 1
done
echo "login: $LOGGED"

echo "== 3.5) reset pin from previous run (server truth) =="
VC=$(python3 -c "import json;print(json.load(open('/tmp/pin-setup.json'))['viewerCookie'])")
TID=$(python3 -c "import json;print(json.load(open('/tmp/pin-setup.json'))['testId'])")
curl -s -X DELETE "$BASE/api/bookmarks?testId=$TID" -H "Cookie: $VC" -o /dev/null -w "unpin=%{http_code}\n"

echo "== 4) switch to Discover (bottom pages dock: tap the Public page button) =="
agent-browser eval "(() => { const b=document.querySelector('button[aria-label=\"Discover\"]'); if(!b) return 'no-toggle'; b.click(); return 'toggled'; })()" > /dev/null
sleep 2.5
DISC=$(agent-browser eval "(() => { const b=document.querySelector('button[aria-label=\"Discover\"]'); return !!b && b.className.includes('bg-cta'); })()")
echo "discover-mode: $DISC"

echo "== 5) search the tag =="
agent-browser eval "document.querySelector('button[aria-label=\"Search by tags…\"]').click(); 'search-open'" > /dev/null
sleep 1
agent-browser eval "(() => { const inp=document.querySelector('input[placeholder*=\"Search\"]'); if(!inp) return 'no-input'; const set=(el,v)=>{const d=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el),'value'); d.set.call(el,v); el.dispatchEvent(new Event('input',{bubbles:true}));}; set(inp,'pinsmoke$STAMP'); return 'typed'; })()"
sleep 2.5
agent-browser eval "(() => { const items=[...document.querySelectorAll('button')].filter(b=>b.textContent.includes('$TITLE')); if(!items.length) return 'no-results'; items[0].click(); return 'result-clicked'; })()"
sleep 2.5
ONCARD=$(agent-browser eval "document.body.innerText.includes('$TITLE')")
echo "card-open: $ONCARD"

echo "== 6) PIN it (the user's action) =="
agent-browser eval "(() => { const vis=b=>{const r=b.getBoundingClientRect(); return r.width>0 && r.right>0 && r.right<=420 && r.bottom>=0 && r.bottom<=900;}; const btns=[...document.querySelectorAll('button[aria-label=\"Save to my library\"]')].filter(vis); if(!btns.length) return 'no-pin-button'; btns[0].click(); return 'pin-clicked'; })()"
sleep 1.5
FLIP=$(agent-browser eval "(() => { const vis=b=>{const r=b.getBoundingClientRect(); return r.width>0 && r.right>0 && r.right<=420 && r.bottom>=0 && r.bottom<=900;}; const flip=[...document.querySelectorAll('button[aria-label=\"Remove from my library\"]')].some(vis); const still=[...document.querySelectorAll('button[aria-label=\"Save to my library\"]')].filter(vis).length; return JSON.stringify({flip, still}); })()")
echo "instant-flip (no reload): $FLIP"

echo "== 7) back to My Library (bottom pages dock: tap the Personal page button) =="
agent-browser eval "(() => { const b=document.querySelector('button[aria-label=\"My Library\"]'); if(!b) return 'no-toggle'; b.click(); return 'toggled'; })()" > /dev/null
sleep 2.5
BACK=$(agent-browser eval "(() => { const vis=b=>{const r=b.getBoundingClientRect(); return r.width>0 && r.right>0 && r.right<=420 && r.bottom>=0 && r.bottom<=900;}; const mine=[...document.querySelectorAll('button[aria-label=\"My Library\"]')]; return JSON.stringify({ mineMode: mine.some(b => b.className.includes('bg-cta')), titleVisible: document.body.innerText.includes('$TITLE'), pinShown: [...document.querySelectorAll('button[aria-label=\"Remove from my library\"]')].some(vis) }); })()")
echo "library-state (no reload!): $BACK"
agent-browser screenshot /home/z/my-project/download/ui-instant-pin.png > /dev/null && echo "screenshot: download/ui-instant-pin.png"

echo "== 8) reload sanity: the pin survived (server truth) =="
agent-browser reload > /dev/null
agent-browser wait --load networkidle > /dev/null
sleep 2
RE=$(agent-browser eval "document.body.innerText.includes('$TITLE')")
echo "after-F5-still-there: $RE"

echo "== 9) cleanup fixtures =="
node scripts/ui-smoke-instant-pin-cleanup.cjs "$(cat /tmp/pin-setup.json)"
