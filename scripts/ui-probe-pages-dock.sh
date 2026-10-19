#!/bin/bash
# Probe: LIBRARY PAGES DOCK — the very-bottom panel with two permanent page
# buttons (Personal | Public) replacing the old top-panel mode toggle.
#   MOBILE 390px : both buttons side by side at the very bottom edge,
#                  Personal active; NO library button left in the top panel;
#                  tap Public -> Discover active; tap Personal -> back.
#   DESKTOP 1440 : pages pill floats at bottom:1.25rem; the raised Start pill
#                  sits ABOVE it (no overlap); full labels visible.
BASE=${BASE:-http://127.0.0.1:3199}
cd /home/z/my-project/repo-uuu
PASS=0; FAIL=0
ok() { if [ "$2" = "1" ]; then PASS=$((PASS+1)); echo "  ✅ $1"; else FAIL=$((FAIL+1)); echo "  ❌ $1"; fi }

# agent-browser eval returns a DOUBLY-escaped JSON string; normalize it to
# compact single JSON so the rg assertions below match reliably.
norm() { python3 -c "
import json,sys
s=sys.stdin.read().strip()
try: d=json.loads(s)
except Exception: d={}
if isinstance(d,str):
    try: d=json.loads(d)
    except Exception: d={}
print(json.dumps(d,separators=(',',':')))"; }

BASE=$BASE node scripts/ui-smoke-ladder-setup.cjs > /tmp/probe-pages.json
STAMP=$(python3 -c "import json;print(json.load(open('/tmp/probe-pages.json'))['stamp'])")
EMAIL=$(python3 -c "import json;print(json.load(open('/tmp/probe-pages.json'))['email'])")
echo "stamp: $STAMP email: $EMAIL"

agent-browser cookies clear > /dev/null
agent-browser set viewport 390 844 > /dev/null
agent-browser open "$BASE/?fresh=pages1" > /dev/null
agent-browser wait --load networkidle > /dev/null
sleep 1

agent-browser eval "(() => { const set=(el,v)=>{const d=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el),'value'); d.set.call(el,v); el.dispatchEvent(new Event('input',{bubbles:true}));}; const em=[...document.querySelectorAll('input')].find(i=>i.type==='email'); const pw=[...document.querySelectorAll('input')].find(i=>i.type==='password'); set(em,'$EMAIL'); set(pw,'ui-pass-123'); return 'ok'; })()" > /dev/null
agent-browser find role button click --name "Sign In" > /dev/null
for i in $(seq 1 20); do
  agent-browser eval "!!document.querySelector('button[aria-label=\"My Library\"]')" | rg -q true && break
  sleep 1
done
for i in $(seq 1 40); do
  R=$(agent-browser eval "[...document.querySelectorAll('.swiper-slide')].some(x=>x.textContent.includes('$STAMP'))" | tr -d '\\"')
  [ "$R" = "true" ] && break
  sleep 1
done

echo "== MOBILE 390px =="
M=$(agent-browser eval "(() => {
  const mine=document.querySelector('button[aria-label=\"My Library\"]');
  const disc=document.querySelector('button[aria-label=\"Discover\"]');
  if(!mine||!disc) return JSON.stringify({err:'no-buttons'});
  const rm=mine.getBoundingClientRect(), rd=disc.getBoundingClientRect();
  const startPill=document.querySelector('.desktop-dock-raised');
  const rs=startPill?startPill.getBoundingClientRect():null;
  return JSON.stringify({
    bothExist: true,
    sideBySide: Math.abs(rm.top - rd.top) < 6,
    mineLeft: rm.left < rd.left,
    atBottom: (844 - rm.bottom) < 26 && (844 - rd.bottom) < 26,
    mineActive: mine.className.includes('bg-cta'),
    discActive: disc.className.includes('bg-cta'),
    noneInHeader: rm.top > 200 && rd.top > 200,
    startAbove: rs ? (rs.bottom <= rm.top + 2) : 'no-start-pill',
    labelsVisible: (mine.innerText.length > 3) && (disc.innerText.length > 3)
  });
})()")
M=$(echo "$M" | norm)
echo "$M"
ok "mobile: both page buttons exist" "$(echo "$M" | rg -q '"err":"no-buttons"' && echo 0 || echo 1)"
ok "mobile: side by side (same row)" "$(echo "$M" | rg -q '"sideBySide":true' && echo 1 || echo 0)"
ok "mobile: Personal left of Public" "$(echo "$M" | rg -q '"mineLeft":true' && echo 1 || echo 0)"
ok "mobile: dock at the very bottom edge" "$(echo "$M" | rg -q '"atBottom":true' && echo 1 || echo 0)"
ok "mobile: Personal active (bg-cta), Public not" "$(echo "$M" | rg -q '"mineActive":true' && ! echo "$M" | rg -q '"discActive":true' && echo 1 || echo 0)"
ok "mobile: top panel has NO library buttons" "$(echo "$M" | rg -q '"noneInHeader":true' && echo 1 || echo 0)"
ok "mobile: Start pill floats ABOVE pages dock" "$(echo "$M" | rg -q '"startAbove":true' && echo 1 || echo 0)"
ok "mobile: full labels visible" "$(echo "$M" | rg -q '"labelsVisible":true' && echo 1 || echo 0)"

echo "== mode switch via the dock (mobile) =="
agent-browser eval "document.querySelector('button[aria-label=\"Discover\"]').click(); 'clicked'" > /dev/null
sleep 2.5
D=$(agent-browser eval "(() => { const m=document.querySelector('button[aria-label=\"My Library\"]'); const d=document.querySelector('button[aria-label=\"Discover\"]'); return JSON.stringify({discActive: d.className.includes('bg-cta'), mineActive: m.className.includes('bg-cta')}); })()" | norm)
ok "tap Public -> Discover active, Personal idle" "$(echo "$D" | rg -q '"discActive":true' && ! echo "$D" | rg -q '"mineActive":true' && echo 1 || echo 0)"
agent-browser eval "document.querySelector('button[aria-label=\"My Library\"]').click(); 'clicked'" > /dev/null
sleep 2.5
B=$(agent-browser eval "(() => { const m=document.querySelector('button[aria-label=\"My Library\"]'); const d=document.querySelector('button[aria-label=\"Discover\"]'); return JSON.stringify({discActive: d.className.includes('bg-cta'), mineActive: m.className.includes('bg-cta')}); })()" | norm)
ok "tap Personal -> back to own library" "$(echo "$B" | rg -q '"mineActive":true' && ! echo "$B" | rg -q '"discActive":true' && echo 1 || echo 0)"

echo "== DESKTOP 1440x900 =="
agent-browser set viewport 1440 900 > /dev/null
sleep 2
DK=$(agent-browser eval "(() => {
  const mine=document.querySelector('button[aria-label=\"My Library\"]');
  const disc=document.querySelector('button[aria-label=\"Discover\"]');
  if(!mine||!disc) return JSON.stringify({err:'no-buttons'});
  const rm=mine.getBoundingClientRect(), rd=disc.getBoundingClientRect();
  const startPill=document.querySelector('.desktop-dock-raised');
  const rs=startPill?startPill.getBoundingClientRect():null;
  const pill=mine.closest('.desktop-dock');
  const rp=pill?pill.getBoundingClientRect():null;
  return JSON.stringify({
    dockFixedBottom: rp ? (900 - rp.bottom) < 26 : 'no-pill',
    pillBottom20: rs ? Math.abs(900 - rs.bottom - 84) < 12 : 'no-start-pill',
    noOverlap: rs ? (rs.bottom <= rp.top + 2) : 'no-start-pill',
    labelsVisible: (mine.innerText.length > 3) && (disc.innerText.length > 3),
    slideVisible: [...document.querySelectorAll('.swiper-slide')].some(x=>x.textContent.includes('$STAMP'))
  });
})()")
DK=$(echo "$DK" | norm)
echo "$DK"
ok "desktop: pages pill at the very bottom (fixed)" "$(echo "$DK" | rg -q '"dockFixedBottom":true' && echo 1 || echo 0)"
ok "desktop: Start pill raised ~84px above bottom" "$(echo "$DK" | rg -q '"pillBottom20":true' && echo 1 || echo 0)"
ok "desktop: no overlap Start vs pages" "$(echo "$DK" | rg -q '"noOverlap":true' && echo 1 || echo 0)"
ok "desktop: full labels visible" "$(echo "$DK" | rg -q '"labelsVisible":true' && echo 1 || echo 0)"
ok "desktop: feed slide still renders" "$(echo "$DK" | rg -q '"slideVisible":true' && echo 1 || echo 0)"

echo "== cleanup =="
OWNID=$(python3 -c "import json;print(json.load(open('/tmp/probe-pages.json'))['ownId'])")
BOBID=$(python3 -c "import json;print(json.load(open('/tmp/probe-pages.json'))['bobId'])")
FILESID=$(python3 -c "import json;print(json.load(open('/tmp/probe-pages.json'))['filesId'])")
ACOOK=$(python3 -c "import json;print(json.load(open('/tmp/probe-pages.json'))['aCookie'])")
BCOOK=$(python3 -c "import json;print(json.load(open('/tmp/probe-pages.json'))['bCookie'])")
curl -s -X DELETE -H "Cookie: $ACOOK" "$BASE/api/tests/$OWNID" > /dev/null
curl -s -X DELETE -H "Cookie: $BCOOK" "$BASE/api/tests/$BOBID" > /dev/null
curl -s -X DELETE -H "Cookie: $ACOOK" "$BASE/api/tests/$FILESID" > /dev/null
curl -s -X DELETE -H "Cookie: $ACOOK" "$BASE/api/me" > /dev/null
curl -s -X DELETE -H "Cookie: $BCOOK" "$BASE/api/me" > /dev/null
echo "fixtures removed"
echo "=== RESULT: $PASS passed, $FAIL failed ==="
[ "$FAIL" = "0" ]
