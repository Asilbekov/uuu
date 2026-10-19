#!/bin/bash
# UI smoke — CARD BUTTON LEVEL LADDER (agent-browser), through the REAL UI:
#   A) FEED: action rows follow the canonical ladder on every slide —
#      AI → Files → Share → Public → Edit → Unpin → Delete (own card:
#      AI/Share/Public/Edit/Delete; bookmarked foreign card: AI/Share/Edit/Unpin)
#   B) LIBRARY GRID: both cards keep the SAME cell ladder — placeholders hold
#      the cells of absent buttons; Share/Edit sit at identical indexes on
#      both cards (the exact misalignment this feature fixes)
#   C) SHELF: same ladder as the library
# Fixtures must already exist (ui-smoke-ladder-setup.cjs → /tmp/ladder-setup.json)
cd /home/z/my-project/repo-uuu
BASE=${BASE:-http://127.0.0.1:3199}
PASS=0; FAIL=0
ok() { if [ "$2" = "1" ]; then PASS=$((PASS+1)); echo "  ✅ $1"; else FAIL=$((FAIL+1)); echo "  ❌ $1"; fi }

echo "== setup fixtures =="
BASE=$BASE node scripts/ui-smoke-ladder-setup.cjs > /tmp/ladder-setup.json
STAMP=$(python3 -c "import json;print(json.load(open('/tmp/ladder-setup.json'))['stamp'])")
EMAIL=$(python3 -c "import json;print(json.load(open('/tmp/ladder-setup.json'))['email'])")
echo "stamp: $STAMP email: $EMAIL"

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
# RENDERED swiper slides (NOT the RSC flight payload <SCRIPT> tags) before
# asserting — up to 40s
FEEDREADY=no
for i in $(seq 1 40); do
  R=$(agent-browser eval "[...document.querySelectorAll('.swiper-slide')].some(x=>x.textContent.includes('$STAMP')) ? 'yes' : 'no'" | tr -d '\\"')
  if [ "$R" = "yes" ]; then FEEDREADY=yes; break; fi
  sleep 1
done
ok "fixtures reached the feed slides (≤40s)" "$([ "$FEEDREADY" = "yes" ] && echo 1 || echo 0)"

# ---- helpers -------------------------------------------------------------
# A slide's action rows in DOM order: buttons (and their kind) inside the
# swiper-slide whose text contains $1, filtered to the ladder actions.
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

echo "== B) library grid ladder =="
# switch TikTok → Library (view cycler)
agent-browser eval "(() => { const b=document.querySelector('button[aria-label=\"View\"], button[aria-label=\"Вид\"]'); if(!b) return 'no-btn'; b.click(); return 'clicked'; })()" > /dev/null
sleep 1.5
GRIDREADY=no
for i in $(seq 1 15); do
  R=$(agent-browser eval "[...document.querySelectorAll('div')].some(x=>x.className&&String(x.className).includes('rounded-2xl')&&x.querySelector('.grid.grid-cols-2')) ? 'yes' : 'no'" | tr -d '\\"')
  if [ "$R" = "yes" ]; then GRIDREADY=yes; break; fi
  sleep 1
done
ok "library grid rendered (≤15s)" "$([ "$GRIDREADY" = "yes" ] && echo 1 || echo 0)"
# For each card: the action grid = last .grid.grid-cols-2; children kinds:
# B=button, D=placeholder div. Map to ladder codes.
card_kinds() {
  agent-browser eval "(() => {
    const card=[...document.querySelectorAll('div')].find(x=>x.className&&String(x.className).includes('rounded-2xl')&&x.textContent.includes('$1')&&x.querySelector('.grid.grid-cols-2'));
    if(!card) return 'no-card';
    const g=card.querySelector('.grid.grid-cols-2');
    const kind=(el)=>{
      if(el.tagName==='BUTTON'){
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
      }
      return 'D';
    };
    return [...g.children].map(kind).join('');
  })()" | tr -d '"'
}
OWNK=$(card_kinds "XLadderOwn $STAMP")
BOBK=$(card_kinds "XLadderBob $STAMP")
echo "  own kinds:  $OWNK"
echo "  bob kinds:  $BOBK"
ok "library own card ladder SRA[DF]L[PD]E[UD]X" "$(python3 -c "import re,sys;print(1 if re.match(r'^SRA[DF]L[PD]E[UD]X$', sys.argv[1]) else 0)" "$OWNK")"
ok "library bob card ladder SRA[DF]L[PD]EU[DX]" "$(python3 -c "import re,sys;print(1 if re.match(r'^SRA[DF]L[PD]EU[DX]$', sys.argv[1]) else 0)" "$BOBK")"
# THE core alignment assertions: same cell index across DIFFERENT cards
idxof() { python3 -c "import sys;s=sys.argv[1];c=sys.argv[2];print(s.find(c))" "$1" "$2"; }
OWNK_SANE=$([ ${#OWNK} -ge 9 ] && echo yes || echo no)
ok "library: both ladders have 9+ cells" "$([ "$OWNK_SANE" = yes ] && [ ${#BOBK} -ge 9 ] && echo 1 || echo 0)"
ok "library: Share at SAME index on both cards" "$([ "$(idxof "$OWNK" L)" = "$(idxof "$BOBK" L)" ] && [ "$(idxof "$OWNK" L)" -ge 0 ] && echo 1 || echo 0)"
ok "library: Edit at SAME index on both cards" "$([ "$(idxof "$OWNK" E)" = "$(idxof "$BOBK" E)" ] && [ "$(idxof "$OWNK" E)" -ge 0 ] && echo 1 || echo 0)"
ok "library: AI at SAME index on both cards" "$([ "$(idxof "$OWNK" A)" = "$(idxof "$BOBK" A)" ] && [ "$(idxof "$OWNK" A)" -ge 0 ] && echo 1 || echo 0)"
ok "library: own card Public=BUTTON, bob card Public=PLACEHOLDER" "$([[ "$OWNK" == *P* ]] && [[ "$BOBK" == *D* ]] && echo 1 || echo 0)"
ok "library: own card Delete=BUTTON, bob card Delete=PLACEHOLDER" "$([[ "$OWNK" == *X* ]] && echo 1 || echo 0)"

echo "== C) shelf ladder =="
agent-browser eval "(() => { const b=document.querySelector('button[aria-label=\"View\"], button[aria-label=\"Вид\"]'); if(!b) return 'no-btn'; b.click(); return 'clicked'; })()" > /dev/null
sleep 1.5
SOWNK=$(card_kinds "XLadderOwn $STAMP")
SBOBK=$(card_kinds "XLadderBob $STAMP")
echo "  shelf own kinds: $SOWNK"
echo "  shelf bob kinds: $SBOBK"
ok "shelf: Share at SAME index on both cards" "$([ "$(idxof "$SOWNK" L)" = "$(idxof "$SBOBK" L)" ] && [ "$(idxof "$SOWNK" L)" -ge 0 ] && echo 1 || echo 0)"
ok "shelf: Edit at SAME index on both cards" "$([ "$(idxof "$SOWNK" E)" = "$(idxof "$SBOBK" E)" ] && [ "$(idxof "$SOWNK" E)" -ge 0 ] && echo 1 || echo 0)"
ok "shelf: ladder identical to library own card" "$([ "$SOWNK" = "$OWNK" ] && echo 1 || echo 0)"

echo "== cleanup =="
OWNID=$(python3 -c "import json;print(json.load(open('/tmp/ladder-setup.json'))['ownId'])")
BOBID=$(python3 -c "import json;print(json.load(open('/tmp/ladder-setup.json'))['bobId'])")
ACOOK=$(python3 -c "import json;print(json.load(open('/tmp/ladder-setup.json'))['aCookie'])")
BCOOK=$(python3 -c "import json;print(json.load(open('/tmp/ladder-setup.json'))['bCookie'])")
curl -s -X DELETE -H "Cookie: $ACOOK" "$BASE/api/tests/$OWNID" > /dev/null
curl -s -X DELETE -H "Cookie: $BCOOK" "$BASE/api/tests/$BOBID" > /dev/null
curl -s -X DELETE -H "Cookie: $ACOOK" "$BASE/api/me" > /dev/null
curl -s -X DELETE -H "Cookie: $BCOOK" "$BASE/api/me" > /dev/null
echo "fixtures removed"

echo ""
echo "=== LADDER SMOKE: $PASS passed, $FAIL failed ==="
[ "$FAIL" = "0" ]
