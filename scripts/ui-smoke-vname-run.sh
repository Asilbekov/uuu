#!/bin/bash
# UI smoke — VERSION NAME + CARD COLOR rules (agent-browser), driven through
# the REAL dashboard UI:
#   A) toggle Edit mode → "Edit This Test" (active slide) → editor Save → the
#      chat-style naming sheet appears (prefilled) → empty name disables Save →
#      name entered → save completes (toast "Test updated!")
#   B) first share-by-link of the OTHER (still unnamed) test → naming sheet →
#      confirm → sheet closes + link toast; second share → straight through
#   C) color rule in the editor: used-colors strip renders; picking the taken
#      color is rejected (toast + value unchanged); a free color is accepted
# Fixtures must already exist (ui-smoke-vname-setup.cjs → /tmp/vname-setup.json)
cd /home/z/my-project/repo-uuu
BASE=http://127.0.0.1:3199
PASS=0; FAIL=0
ok() { if [ "$2" = "1" ]; then PASS=$((PASS+1)); echo "  ✅ $1"; else FAIL=$((FAIL+1)); echo "  ❌ $1"; fi }

echo "== setup fixtures =="
BASE=$BASE node scripts/ui-smoke-vname-setup.cjs > /tmp/vname-setup.json
STAMP=$(python3 -c "import json;print(json.load(open('/tmp/vname-setup.json'))['stamp'])")
EMAIL=$(python3 -c "import json;print(json.load(open('/tmp/vname-setup.json'))['email'])")
echo "stamp: $STAMP email: $EMAIL"

agent-browser cookies clear > /dev/null
agent-browser set viewport 390 844 > /dev/null
agent-browser open "$BASE/?fresh=vname2" > /dev/null
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
ok "login → library visible" "$([ "$LOGGED" = "yes" ] && echo 1 || echo 0)"
sleep 1.5

# Which test sits on the ACTIVE slide? (feed order is recsys-ranked — never assume)
ACTIVE=$(agent-browser eval "(() => { const s=document.querySelector('.swiper-slide-active'); if(!s) return 'none'; return s.textContent.includes('XColor') ? 'XColor' : 'XClash'; })()" | tr -d '\\"')
OTHER=$([ "$ACTIVE" = "XColor" ] && echo XClash || echo XColor)
OTHERHEX=$([ "$OTHER" = "XColor" ] && echo '#FFAA00' || echo '#00AAFF')
echo "active slide: $ACTIVE | other: $OTHER ($OTHERHEX)"

# header "Edit Test" toggle — click whichever visual state it is in
toggle_edit_any() {
  agent-browser eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('Edit Test') && x.className.includes('rounded-full') && (x.className.includes('border-black') || x.className.includes('border-cta'))); if(!b) return 'no-toggle'; b.click(); return 'toggled'; })()" > /dev/null
}
# header "Edit Test" toggle (edit mode: the bottom bar becomes Edit This Test)
toggle_edit() {
  agent-browser eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('Edit Test') && x.className.includes('rounded-full') && x.className.includes('border-black')); if(!b) return 'no-toggle'; b.click(); return 'toggled'; })()"
}
open_editor() { # bottom-bar "Edit This Test" on the ACTIVE slide
  agent-browser eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('Edit This Test')); if(!b) return 'no-btn'; b.click(); return 'clicked'; })()" > /dev/null
  sleep 2
  agent-browser eval "!!document.querySelector('input[placeholder*=\"Chemistry\"], input[placeholder*=\"например\"]')"
}

echo "== A) save naming sheet (edit → save) =="
toggle_edit
sleep 1
open_editor > /tmp/editpage.txt
ok "editor opened (Edit This Test)" "$(rg -q "true" /tmp/editpage.txt && echo 1 || echo 0)"
agent-browser eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='Save' && x.className.includes('w-full')); if(!b) return 'no-btn'; b.click(); return 'clicked'; })()" > /dev/null
sleep 1.2
SHEET=$(agent-browser eval "(() => { const i=document.querySelector('input[aria-label=\"Version name\"]'); if(!i) return 'no-sheet'; return 'SHEET_OPEN|'+(i.value||'').slice(0,40); })()")
echo "sheet: $SHEET"
ok "naming sheet appears on first save (prefilled with the title)" "$(echo "$SHEET" | rg -q 'SHEET_OPEN' && echo 1 || echo 0)"
agent-browser eval "(() => { const i=document.querySelector('input[aria-label=\"Version name\"]'); if(!i) return 'no'; const d=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i),'value'); d.set.call(i,''); i.dispatchEvent(new Event('input',{bubbles:true})); return 'ok'; })()" > /dev/null
sleep 0.4
DISABLED=$(agent-browser eval "(() => { const i=document.querySelector('input[aria-label=\"Version name\"]'); if(!i) return 'no-input'; const root=i.closest('div.fixed.inset-0'); const bs=[...(root?root.querySelectorAll('button'):[])].filter(b=>b.textContent.trim()==='Save'); const b=bs[bs.length-1]; return b? String(b.disabled) : 'no-btn'; })()" | tr -d '"')
ok "empty name → sheet Save disabled" "$([ "$DISABLED" = "true" ] && echo 1 || echo 0)"
echo "disabled-state: $DISABLED"
agent-browser eval "(() => { const i=document.querySelector('input[aria-label=\"Version name\"]'); if(!i) return 'no'; const root=i.closest('div.fixed.inset-0'); const bs=[...(root?root.querySelectorAll('button'):[])].filter(b=>b.textContent.trim()==='Save'); const b=bs[bs.length-1]; const d=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i),'value'); d.set.call(i,'Redakcia A'); i.dispatchEvent(new Event('input',{bubbles:true})); b.click(); return 'ok'; })()" > /dev/null
SAVED=no
for i in $(seq 1 15); do
  if agent-browser eval "(() => { const t=[...document.querySelectorAll('ol li')].map(x=>x.textContent).join(' '); return t.includes('Test updated'); })()" | rg -q "true"; then SAVED=yes; break; fi
  sleep 1
done
ok "name entered → save completes (toast 'Test updated!')" "$([ "$SAVED" = "yes" ] && echo 1 || echo 0)"
SHEETGONE=$(agent-browser eval "!document.querySelector('input[aria-label=\"Version name\"]')")
ok "sheet closed after confirm" "$([ "$SHEETGONE" = "true" ] && echo 1 || echo 0)"

echo "== B) share naming sheet on the still-unnamed $OTHER =="
# edit mode HIDES the card action grid — switch it off so Share link is back
toggle_edit_any
sleep 1.5
agent-browser eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='Back'); if(b) { b.click(); return 'back'; } return 'already-dashboard'; })()" > /dev/null
sleep 2
# wait for the feed slides to be present
SLIDES=no
for i in $(seq 1 10); do
  N=$(agent-browser eval "document.querySelectorAll('.swiper-slide').length")
  if [ "$N" != "0" ]; then SLIDES=yes; break; fi
  sleep 1
done
agent-browser eval "(() => { const s=[...document.querySelectorAll('.swiper-slide')].find(x=>x.textContent.includes('$OTHER') && !x.textContent.includes('$ACTIVE')); if(!s) return 'no-slide'; const b=[...s.querySelectorAll('button')].find(x=>x.textContent.trim().startsWith('Share link')); if(!b) return 'no-share'; b.click(); return 'clicked'; })()" > /dev/null
SHEET2='no-sheet'
for i in $(seq 1 8); do
  R=$(agent-browser eval "(() => { const i=document.querySelector('input[aria-label=\"Version name\"]'); return i ? 'sheet-open' : 'no-sheet'; })()" | tr -d '"')
  if [ "$R" = "sheet-open" ]; then SHEET2='sheet-open'; break; fi
  sleep 0.8
done
ok "first share → naming sheet appears" "$([ "$SHEET2" = "sheet-open" ] && echo 1 || echo 0)"
agent-browser eval "(() => { const i=document.querySelector('input[aria-label=\"Version name\"]'); if(!i) return 'no'; const root=i.closest('div.fixed.inset-0'); const bs=[...(root?root.querySelectorAll('button'):[])].filter(b=>b.textContent.trim()==='Save'); const b=bs[bs.length-1]; const d=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i),'value'); d.set.call(i,'Link edition'); i.dispatchEvent(new Event('input',{bubbles:true})); b.click(); return 'ok'; })()" > /dev/null
SHARED=no
for i in $(seq 1 15); do
  if agent-browser eval "(() => { const gone=!document.querySelector('input[aria-label=\"Version name\"]'); const t=[...document.querySelectorAll('ol li')].map(x=>x.textContent).join(' '); return gone && (t.includes('Link copied') || t.includes('clipboard') || t.includes('http')); })()" | rg -q "true"; then SHARED=yes; break; fi
  sleep 1
done
ok "share confirm → sheet closed + link toast" "$([ "$SHARED" = "yes" ] && echo 1 || echo 0)"
sleep 0.8
agent-browser eval "(() => { const s=[...document.querySelectorAll('.swiper-slide')].find(x=>x.textContent.includes('$OTHER') && !x.textContent.includes('$ACTIVE')); if(!s) return 'no-slide'; const b=[...s.querySelectorAll('button')].find(x=>x.textContent.trim().startsWith('Share link')); if(!b) return 'no-share'; b.click(); return 'clicked'; })()" > /dev/null
sleep 1
SECOND=$(agent-browser eval "(() => { const i=document.querySelector('input[aria-label=\"Version name\"]'); if(i) return 'sheet-again'; const t=[...document.querySelectorAll('ol li')].map(x=>x.textContent).join(' '); return (t.includes('Link copied')||t.includes('clipboard')||t.includes('http')) ? 'straight' : 'no-toast'; })()" | tr -d '"')
ok "second share of the same test → straight through (no sheet)" "$([ "$SECOND" = "straight" ] && echo 1 || echo 0)"

echo "== C) color rule in the editor =="
toggle_edit_any
sleep 1
open_editor > /tmp/editpage2.txt
agent-browser eval "(() => { const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim().startsWith('Cover')); if(!b) return 'no-cover'; b.click(); return 'opened'; })()" > /dev/null
sleep 1
STRIP=$(agent-browser eval "(() => { const el=[...document.querySelectorAll('span')].find(x=>(x.getAttribute('aria-label')||'').includes('Colors already in use')); return el? 'strip-visible' : 'no-strip'; })()" | tr -d '"')
ok "used-colors strip visible in the picker" "$([ "$STRIP" = "strip-visible" ] && echo 1 || echo 0)"
agent-browser eval "(() => { const i=[...document.querySelectorAll('input')].find(x=>x.placeholder==='#E3EEFF'); if(!i) return 'no-hex'; const d=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i),'value'); d.set.call(i,'$OTHERHEX'); i.dispatchEvent(new Event('input',{bubbles:true})); return 'ok'; })()" > /dev/null
sleep 0.8
REJECT=$(agent-browser eval "(() => { const t=[...document.querySelectorAll('ol li')].map(x=>x.textContent).join(' '); const i=[...document.querySelectorAll('input')].find(x=>x.placeholder==='#E3EEFF'); return 'TOAST:'+t.includes('already used')+'|HEX:'+(i?i.value:'?'); })()")
echo "reject: $REJECT"
ok "taken color rejected (toast + value not applied)" "$(echo "$REJECT" | rg -q 'TOAST:true' && echo 1 || echo 0)"
agent-browser eval "(() => { const i=[...document.querySelectorAll('input')].find(x=>x.placeholder==='#E3EEFF'); if(!i) return 'no-hex'; const d=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i),'value'); d.set.call(i,'#12CC88'); i.dispatchEvent(new Event('input',{bubbles:true})); return 'ok'; })()" > /dev/null
sleep 0.6
ACCEPT=$(agent-browser eval "(() => { const i=[...document.querySelectorAll('input')].find(x=>x.placeholder==='#E3EEFF'); return i? i.value : '?'; })()" | tr -d '"')
echo "free color → input shows: $ACCEPT"
ok "free color accepted" "$([ "$ACCEPT" = "#12CC88" ] && echo 1 || echo 0)"

echo ""
echo "=== UI RESULT: $PASS passed, $FAIL failed ==="
[ "$FAIL" = "0" ]
