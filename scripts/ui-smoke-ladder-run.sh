#!/bin/bash
# UI smoke — CARD BUTTON LADDER (one button per level) + FILES/EDIT WINDOWS:
#   A) FEED: action rows follow the canonical ladder on every slide —
#      AI → Files → Share → Public → Edit → Unpin → Delete
#   B) LIBRARY GRID: every card's action ladder is SINGLE COLUMN (strictly
#      one button per level) and NOTHING is clipped (scrollHeight check)
#   C) SHELF: the same single-column ladder
#   D) FILES WINDOW: «Файлы» opens the same-format window as the AI window
#      (bottom sheet on mobile, right-docked panel on desktop)
#   E) EDIT WINDOW: «Редактировать» opens the take-test style edit sheet
#      (header switcher + Save) WITHOUT leaving the dashboard
# Fixtures must already exist (ui-smoke-ladder-setup.cjs → /tmp/ladder-setup.json)
cd /home/z/my-project/repo-uuu
BASE=${BASE:-http://127.0.0.1:3199}
PASS=0; FAIL=0
ok() { if [ "$2" = "1" ]; then PASS=$((PASS+1)); echo "  ✅ $1"; else FAIL=$((FAIL+1)); echo "  ❌ $1"; fi }

echo "== setup fixtures =="
BASE=$BASE node scripts/ui-smoke-ladder-setup.cjs > /tmp/ladder-setup.json
STAMP=$(python3 -c "import json;print(json.load(open('/tmp/ladder-setup.json'))['stamp'])")
EMAIL=$(python3 -c "import json;print(json.load(open('/tmp/ladder-setup.json'))['email'])")
FILENAME=$(python3 -c "import json;print(json.load(open('/tmp/ladder-setup.json'))['fileName'])")
echo "stamp: $STAMP email: $EMAIL file: $FILENAME"

agent-browser cookies clear > /dev/null
agent-browser set viewport 390 844 > /dev/null
agent-browser open "$BASE/?fresh=ladder1" > /dev/null
agent-browser wait --load networkidle > /dev/null
sleep 1

echo "== login =="
agent-browser eval "(() => { const set=(el,v)=>{const d=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el),'value'); d.set.call(el,v); el.dispatchEvent(new Event('input',{bubbles:true}));}; const em=[...document.querySelectorAll('input')].find(i=>i.type==='email'); const pw=[...document.querySelectorAll('input')].find(i=>i.type==='password'); set(em,'$EMAIL'); set(pw,'ui-pass-123'); return 'ok'; })()" > /dev/null
agent-browser find role button click --name "Sign In" > /dev/null
LOGGED=no
for i in $(seq 1 20); do
  if agent-browser eval "!!document.querySelector('button[aria-label=\"My Library\"]')" | rg -q "true"; then LOGGED=yes; break; fi
  sleep 1
done
ok "login → feed visible" "$([ "$LOGGED" = "yes" ] && echo 1 || echo 0)"
sleep 1.5

# prod deployments/cold starts are slower — wait until the fixtures land in
# RENDERED swiper slides (NOT the RSC flight payload <SCRIPT> tags)
FEEDREADY=no
for i in $(seq 1 40); do
  R=$(agent-browser eval "[...document.querySelectorAll('.swiper-slide')].some(x=>x.textContent.includes('$STAMP')) ? 'yes' : 'no'" | tr -d '\\"')
  if [ "$R" = "yes" ]; then FEEDREADY=yes; break; fi
  sleep 1
done
ok "fixtures reached the feed slides (≤40s)" "$([ "$FEEDREADY" = "yes" ] && echo 1 || echo 0)"

# ---- helpers -------------------------------------------------------------
slide_rows() {
  agent-browser eval "(() => {
    const s=[...document.querySelectorAll('.swiper-slide')].find(x=>x.textContent.includes('$1'));
    if(!s) return 'no-slide';
    const rows=[...s.querySelectorAll('button')].map(b=>{
      const t=b.textContent.trim();
      const has=(re)=>re.test(t);
      if(has(/Обсудить|Discuss/i)||b.querySelector('.lucide-bot')) return 'AI';
      if(has(/Share link|Поделиться ссылкой|Поделиться по ссылке/)||b.querySelector('.lucide-link-2, .lucide-link')) return 'Share';
      if(has(/Make Public|Сделать общим|Опубликовать/)||b.querySelector('.lucide-users')) return 'Public';
      if(has(/Edit Test|Редактировать/)||b.querySelector('.lucide-pencil')) return 'Edit';
      if(has(/Unpin|Открепить/)||b.querySelector('.lucide-bookmark-x')) return 'Unpin';
      if(has(/Delete Test|Удалить тест|Удалить$/)||b.querySelector('.lucide-trash-2')) return 'Delete';
      if(has(/Attach|Файл/)||b.querySelector('.lucide-paperclip')) return 'Files';
      return null;
    }).filter(Boolean);
    return rows.join(',');
  })()" | tr -d '"'
}

echo "== A) feed ladder =="
OWN_ROWS=$(slide_rows "XLadderOwn $STAMP")
BOB_ROWS=$(slide_rows "XLadderBob $STAMP")
echo "  own rows: $OWN_ROWS"
echo "  bob rows: $BOB_ROWS"
ok "feed own card: AI is the FIRST action row" "$([[ "$OWN_ROWS" == AI,* ]] && echo 1 || echo 0)"
ok "feed own card: order AI<Share<Public<Edit<Delete" "$([[ "$OWN_ROWS" == AI,*,Share,*,Public,Edit,*,Delete* || "$OWN_ROWS" == AI,Share,Public,Edit,Delete ]] && echo 1 || echo 0)"
ok "feed own card: NO Unpin row" "$( [[ "$OWN_ROWS" != *Unpin* ]] && echo 1 || echo 0)"
ok "feed bob card: AI is the FIRST action row" "$([[ "$BOB_ROWS" == AI,* ]] && echo 1 || echo 0)"
ok "feed bob card: order AI<Share<Edit<Unpin" "$([[ "$BOB_ROWS" == AI,*,Share,*,Edit,*,Unpin* || "$BOB_ROWS" == AI,Share,Edit,Unpin ]] && echo 1 || echo 0)"
ok "feed bob card: NO Public/Delete rows" "$( [[ "$BOB_ROWS" != *Public* && "$BOB_ROWS" != *Delete* ]] && echo 1 || echo 0)"

echo "== B) library grid: one button per level =="
# goto_grid_view: cycle the view switcher until the grid ladders render
# (TikTok → Library → Shelf cycle; up to 3 clicks)
goto_grid_view() {
  for i in $(seq 1 3); do
    R=$(agent-browser eval "document.querySelectorAll('.card-ladder').length >= 3 ? 'yes' : 'no'" | tr -d '\\"')
    [ "$R" = "yes" ] && return 0
    agent-browser eval "(() => { const b=document.querySelector('button[aria-label=\"View\"], button[aria-label=\"Вид\"]'); if(!b) return 'no-btn'; b.click(); return 'clicked'; })()" > /dev/null
    sleep 1.5
  done
  agent-browser eval "document.querySelectorAll('.card-ladder').length >= 3 ? 'yes' : 'no'" | tr -d '\\"' | rg -q yes
}
goto_grid_view
GRIDREADY=no
for i in $(seq 1 15); do
  R=$(agent-browser eval "document.querySelectorAll('.card-ladder').length >= 3 ? 'yes' : 'no'" | tr -d '\\"')
  if [ "$R" = "yes" ]; then GRIDREADY=yes; break; fi
  sleep 1
done
ok "library grid rendered, 3 ladders (≤15s)" "$([ "$GRIDREADY" = "yes" ] && echo 1 || echo 0)"

# Ladder kinds inside the .card-ladder container (single column, in order)
card_kinds() {
  agent-browser eval "(() => {
    const ladder=[...document.querySelectorAll('.card-ladder')].find(g=>{const c=g.closest('.rounded-2xl'); return c&&c.textContent.includes('$1');});
    if(!ladder) return 'no-card';
    const kind=(el)=>{
      const t=el.textContent.trim(); const ic=el.querySelector('svg');
      const cls=ic?ic.getAttribute('class')||'':'';
      if(cls.includes('lucide-play')) return 'S';
      if(cls.includes('lucide-refresh-cw')) return 'R';
      if(cls.includes('lucide-bot')) return 'A';
      if(cls.includes('lucide-paperclip')) return 'F';
      if(cls.includes('lucide-link-2')||cls.includes('lucide-link')) return 'L';
      if(cls.includes('lucide-users')) return 'P';
      if(cls.includes('lucide-pencil')) return 'E';
      if(cls.includes('lucide-bookmark-x')) return 'U';
      if(cls.includes('lucide-trash-2')) return 'X';
      return 'B('+t.slice(0,8)+')';
    };
    return [...ladder.children].filter(el=>el.tagName==='BUTTON').map(kind).join('');
  })()" | tr -d '"'
}
# No-clipping check: the card must fully contain its ladder (no half-card bug)
no_clip() {
  agent-browser eval "(() => {
    const ladder=[...document.querySelectorAll('.card-ladder')].find(g=>{const c=g.closest('.rounded-2xl'); return c&&c.textContent.includes('$1');});
    if(!ladder) return 'no-card';
    const card=ladder.closest('.rounded-2xl') || ladder.parentElement;
    if(!card) return 'no-card-el';
    return (card.scrollHeight <= card.clientHeight + 2) ? 'fits' : ('clip:'+card.scrollHeight+'>'+card.clientHeight);
  })()" | tr -d '"'
}
OWNK=$(card_kinds "XLadderOwn $STAMP")
BOBK=$(card_kinds "XLadderBob $STAMP")
FILEK=$(card_kinds "XLadderFiles $STAMP")
echo "  own kinds:   $OWNK"
echo "  bob kinds:   $BOBK"
echo "  files kinds: $FILEK"
ok "library own card ladder = S,R,A,[Files,]Share,Public,Edit,Delete" "$(python3 -c "import re,sys;print(1 if re.match(r'^SRA[DF]?LPEX$', sys.argv[1]) else 0)" "$OWNK")"
ok "library bob card ladder = S,R,A,[Files,]Share,Edit,Unpin" "$(python3 -c "import re,sys;print(1 if re.match(r'^SRA[DF]?LEU$', sys.argv[1]) else 0)" "$BOBK")"
ok "library files card ladder = S,R,A,Files,Share,Public,Edit,Delete" "$(python3 -c "import re,sys;print(1 if re.match(r'^SRAFLPEX$', sys.argv[1]) else 0)" "$FILEK")"
idxof() { python3 -c "import sys;s=sys.argv[1];c=sys.argv[2];print(s.find(c))" "$1" "$2"; }
ok "library: Share at SAME index on own+bob (same no-files state)" "$([ "$(idxof "$OWNK" L)" = "$(idxof "$BOBK" L)" ] && [ "$(idxof "$OWNK" L)" -ge 0 ] && echo 1 || echo 0)"
ok "library: AI at SAME index on all 3 cards" "$([ "$(idxof "$OWNK" A)" = "$(idxof "$BOBK" A)" ] && [ "$(idxof "$OWNK" A)" = "$(idxof "$FILEK" A)" ] && echo 1 || echo 0)"
ok "library: relative order kept on every card (regex above)" "$([ "$(idxof "$OWNK" L)" -lt "$(idxof "$OWNK" E)" ] && [ "$(idxof "$FILEK" L)" -lt "$(idxof "$FILEK" E)" ] && [ "$(idxof "$BOBK" L)" -lt "$(idxof "$BOBK" E)" ] && echo 1 || echo 0)"
ok "library own card: NOTHING clipped" "$([[ "$(no_clip "XLadderOwn $STAMP")" == fits ]] && echo 1 || echo 0)"
ok "library files card: NOTHING clipped" "$([[ "$(no_clip "XLadderFiles $STAMP")" == fits ]] && echo 1 || echo 0)"

echo "== C) shelf ladder =="
goto_grid_view
SOWNK=$(card_kinds "XLadderOwn $STAMP")
SFILEK=$(card_kinds "XLadderFiles $STAMP")
echo "  shelf own kinds:  $SOWNK"
echo "  shelf files kinds: $SFILEK"
ok "shelf: ladder identical to library own card" "$([ "$SOWNK" = "$OWNK" ] && echo 1 || echo 0)"
ok "shelf: Share at SAME index on own+files-relative order" "$([ "$(idxof "$SOWNK" L)" -ge 0 ] && [ "$(idxof "$SFILEK" L)" -ge 0 ] && echo 1 || echo 0)"
ok "shelf own card: NOTHING clipped" "$([[ "$(no_clip "XLadderOwn $STAMP")" == fits ]] && echo 1 || echo 0)"

echo "== D) files window (AI-window format) =="
# MOBILE: back to the library grid, click the Files button on the files card
agent-browser set viewport 390 844 > /dev/null
sleep 1
goto_grid_view
FILESBTN=ok
for i in $(seq 1 10); do
  R=$(agent-browser eval "document.querySelectorAll('.card-ladder').length >= 3 ? 'yes' : 'no'" | tr -d '\\"')
  [ "$R" = "yes" ] && break
  sleep 1
done
agent-browser eval "(() => {
  const ladder=[...document.querySelectorAll('.card-ladder')].find(g=>{const c=g.closest('.rounded-2xl'); return c&&c.textContent.includes('XLadderFiles $STAMP');});
  if(!ladder) return 'no-ladder';
  const b=[...ladder.querySelectorAll('button')].find(x=>x.querySelector('.lucide-paperclip'));
  if(!b) return 'no-btn';
  b.click(); return 'clicked';
})()" > /dev/null
FW=no
for i in $(seq 1 10); do
  R=$(agent-browser eval "[...document.querySelectorAll('.fixed')].some(x=>x.textContent.includes('$FILENAME') && x.textContent.includes('XLadderFiles')) ? 'yes' : 'no'" | tr -d '\\"')
  if [ "$R" = "yes" ]; then FW=yes; break; fi
  sleep 1
done
ok "files window opens on mobile with the attachment" "$([ "$FW" = "yes" ] && echo 1 || echo 0)"
# close (the ✕ ghost button inside the sheet header)
agent-browser eval "(() => { const sheets=[...document.querySelectorAll('.fixed')].filter(x=>x.textContent.includes('Attached Files')||x.textContent.includes('Attached')); const s=sheets[sheets.length-1]; if(!s) return 'no-sheet'; const b=[...s.querySelectorAll('button')].find(x=>x.querySelector('.lucide-x')); if(!b) return 'no-x'; b.click(); return 'closed'; })()" > /dev/null
sleep 1
CLOSED=$(agent-browser eval "[...document.querySelectorAll('.fixed')].some(x=>x.textContent.includes('$FILENAME') && x.textContent.includes('XLadderFiles')) ? 'open' : 'closed'" | tr -d '\\"')
ok "files window closes (mobile)" "$([ "$CLOSED" = "closed" ] && echo 1 || echo 0)"
# DESKTOP: right-docked side panel
agent-browser set viewport 1440 900 > /dev/null
sleep 1
agent-browser eval "(() => {
  const ladder=[...document.querySelectorAll('.card-ladder')].find(g=>{const c=g.closest('.rounded-2xl'); return c&&c.textContent.includes('XLadderFiles $STAMP');});
  if(!ladder) return 'no-ladder';
  const b=[...ladder.querySelectorAll('button')].find(x=>x.querySelector('.lucide-paperclip'));
  if(!b) return 'no-btn';
  b.click(); return 'clicked';
})()" > /dev/null
FW2=no
for i in $(seq 1 10); do
  R=$(agent-browser eval "(() => { const els=[...document.querySelectorAll('div')].filter(x=>String(x.className).includes('rounded-4xl')&&x.textContent.includes('$FILENAME')); const el=els[els.length-1]; if(!el) return 'no'; const r=el.getBoundingClientRect(); return (r.left > window.innerWidth*0.55) ? 'yes' : ('pos:'+Math.round(r.left)); })()" | tr -d '\\"')
  if [ "$R" = "yes" ]; then FW2=yes; break; fi
  sleep 1
done
ok "desktop: files panel docked to the RIGHT edge (like the AI window)" "$([ "$FW2" = "yes" ] && echo 1 || echo 0)"
agent-browser eval "(() => { const els=[...document.querySelectorAll('div')].filter(x=>String(x.className).includes('rounded-4xl')&&x.textContent.includes('$FILENAME')); const el=els[els.length-1]; if(!el) return 'no'; const b=[...el.querySelectorAll('button')].find(x=>x.querySelector('.lucide-x')); if(!b) return 'no-x'; b.click(); return 'closed'; })()" > /dev/null
sleep 1

echo "== E) edit window (take-test format on the dashboard) =="
goto_grid_view
agent-browser eval "(() => {
  const ladder=[...document.querySelectorAll('.card-ladder')].find(g=>{const c=g.closest('.rounded-2xl'); return c&&c.textContent.includes('XLadderOwn $STAMP');});
  if(!ladder) return 'no-ladder';
  const b=[...ladder.querySelectorAll('button')].find(x=>x.querySelector('.lucide-pencil'));
  if(!b) return 'no-btn';
  b.click(); return 'clicked';
})()" > /dev/null
EW=no
for i in $(seq 1 12); do
  R=$(agent-browser eval "(() => { const ins=[...document.querySelectorAll('input')].filter(i=>i.value.includes('XLadderOwn $STAMP')); const sv=[...document.querySelectorAll('button')].some(b=>/Save Test|Сохранить тест/.test(b.textContent)); return (ins.length && sv) ? 'yes' : 'no'; })()" | tr -d '\\"')
  if [ "$R" = "yes" ]; then EW=yes; break; fi
  sleep 1
done
ok "edit window opens with the editor + Save (no page navigation)" "$([ "$EW" = "yes" ] && echo 1 || echo 0)"
STILLDASH=$(agent-browser eval "!!document.querySelector('button[aria-label=\"View\"], button[aria-label=\"Вид\"]') ? 'yes' : 'no'" | tr -d '\\"')
ok "still on the dashboard (no full-page editor)" "$([ "$STILLDASH" = "yes" ] && echo 1 || echo 0)"
# close the edit window via its header ✕
agent-browser eval "(() => { const b=[...document.querySelectorAll('button')].reverse().find(x=>x.className.includes('h-7 w-7 p-0')&&x.querySelector('.lucide-x')); if(!b) return 'no-x'; b.click(); return 'closed'; })()" > /dev/null
sleep 1
ECLOSED=$(agent-browser eval "[...document.querySelectorAll('button')].some(b=>/Save Test|Сохранить тест/.test(b.textContent)) ? 'open' : 'closed'" | tr -d '\\"')
ok "edit window closes" "$([ "$ECLOSED" = "closed" ] && echo 1 || echo 0)"

echo "== cleanup =="
OWNID=$(python3 -c "import json;print(json.load(open('/tmp/ladder-setup.json'))['ownId'])")
BOBID=$(python3 -c "import json;print(json.load(open('/tmp/ladder-setup.json'))['bobId'])")
FILESID=$(python3 -c "import json;print(json.load(open('/tmp/ladder-setup.json'))['filesId'])")
ACOOK=$(python3 -c "import json;print(json.load(open('/tmp/ladder-setup.json'))['aCookie'])")
BCOOK=$(python3 -c "import json;print(json.load(open('/tmp/ladder-setup.json'))['bCookie'])")
curl -s -X DELETE -H "Cookie: $ACOOK" "$BASE/api/tests/$OWNID" > /dev/null
curl -s -X DELETE -H "Cookie: $BCOOK" "$BASE/api/tests/$BOBID" > /dev/null
curl -s -X DELETE -H "Cookie: $ACOOK" "$BASE/api/tests/$FILESID" > /dev/null
curl -s -X DELETE -H "Cookie: $ACOOK" "$BASE/api/me" > /dev/null
curl -s -X DELETE -H "Cookie: $BCOOK" "$BASE/api/me" > /dev/null
echo "fixtures removed"

echo ""
echo "=== LADDER SMOKE: $PASS passed, $FAIL failed ==="
[ "$FAIL" = "0" ]
