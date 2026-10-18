#!/bin/bash
# UI smoke — GUEST SHARE LINK (the anonymous ?test=<id> flow):
#   open a test link without a session → the TAKING screen boots (first
#   question up, no login card) → answer works → Edit / AI Tutor / Home all
#   open the registration wall (chat-style bottom sheet) → Cancel returns →
#   reload mid-test restores position (localStorage snapshot) → Sign up →
#   auth card (with Cancel back) → register → resume EXACTLY where stopped,
#   no dashboard detour. Server + all agent-browser steps run in ONE bash
#   call (background processes are recycled between calls).
cd /home/z/my-project/repo-uuu
BASE=http://127.0.0.1:3199
PASS=0; FAIL=0
ok() { if [ "$1" = "1" ]; then PASS=$((PASS+1)); echo "  ✅ $2"; else FAIL=$((FAIL+1)); echo "  ❌ $2 — got: $3"; fi; }
# agent-browser eval returns a JSON string (sometimes double-encoded) — decode
# once or twice, then eval the check expression with `d` bound to the object.
pj() { python3 -c "
import json,sys
x=json.loads(sys.stdin.read())
if isinstance(x,str):
  try: x=json.loads(x)
  except: pass
d=x
print(eval(sys.argv[1]))
" "$1"; }
HOMESEL="svg.lucide-house, svg.lucide-home"

echo "== 0) server + fixtures =="
(PORT=3199 HOSTNAME=127.0.0.1 STANDALONE=1 node .next/standalone/server.js > /tmp/srv-guest.log 2>&1 &)
code=000
for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w "%{http_code}" $BASE/api/me --max-time 2 2>/dev/null)
  [ "$code" = "401" ] && break
  sleep 1
done
echo "server: $code"
BASE=$BASE node scripts/ui-smoke-guest-setup.cjs > /tmp/guest-setup.json && echo "fixtures: ok" || { echo "SETUP FAILED"; exit 2; }
TESTID=$(python3 -c "import json;print(json.load(open('/tmp/guest-setup.json'))['testId'])")
STAMP=$(python3 -c "import json;print(json.load(open('/tmp/guest-setup.json'))['stamp'])")
agent-browser cookies clear > /dev/null && echo "cookies: cleared"

echo "== 1) guest opens the link → taking screen, no login card =="
agent-browser set viewport 390 844 > /dev/null
agent-browser open "$BASE/?test=$TESTID" > /dev/null
sleep 3
R=$(agent-browser eval "(() => { const b=document.body.innerText; return JSON.stringify({q1: b.includes('GQ1 $STAMP'), login: !!document.querySelector('#email'), wall: b.includes('Sign up to continue')}); })()")
ok "$(echo "$R" | pj "1 if d['q1'] and not d['login'] and not d['wall'] else 0")" "first question visible, no login card, no wall" "$R"

echo "== 2) answer the first question =="
agent-browser eval "(document.querySelector('button[role=\"radio\"][id\$=\"-A\"]')||{}).click?.()" > /dev/null
sleep 1
R=$(agent-browser eval "(() => { const el=document.querySelector('button[role=\"radio\"][id\$=\"-A\"]'); return JSON.stringify({checked: el ? el.getAttribute('aria-checked') : 'none'}); })()")
ok "$(echo "$R" | pj "1 if d['checked']=='true' else 0")" "option A selected on the guest session" "$R"

echo "== 3) Edit → registration wall (chat-style sheet) =="
agent-browser eval "([...document.querySelectorAll('header button[title]')].find(b=>b.getAttribute('title')==='Edit this test')||{}).click?.()" > /dev/null
sleep 1
R=$(agent-browser eval "(() => { const b=document.body.innerText; return JSON.stringify({wall: b.includes('Sign up to continue'), cancel: b.includes('Cancel'), editor: !!document.querySelector('#test-title')}); })()")
ok "$(echo "$R" | pj "1 if d['wall'] and d['cancel'] and not d['editor'] else 0")" "wall opened instead of the editor" "$R"

echo "== 4) Cancel → back to the test =="
agent-browser eval "([...document.querySelectorAll('button')].filter(b=>b.textContent.trim()==='Cancel').pop()||{}).click?.()" > /dev/null
sleep 1
R=$(agent-browser eval "(() => { const b=document.body.innerText; return JSON.stringify({wall: b.includes('Sign up to continue'), q1: b.includes('GQ1 $STAMP')}); })()")
ok "$(echo "$R" | pj "1 if not d['wall'] and d['q1'] else 0")" "cancel closes the wall, test intact" "$R"

echo "== 5) AI Tutor → wall =="
agent-browser eval "([...document.querySelectorAll('header button[title]')].find(b=>b.getAttribute('title')==='AI Tutor')||{}).click?.()" > /dev/null
sleep 1
R=$(agent-browser eval "document.body.innerText.includes('Sign up to continue')")
ok "$(echo "$R" | pj "1 if d==True or d=='true' else 0")" "AI tutor is walled for guests" "$R"
agent-browser eval "([...document.querySelectorAll('button')].filter(b=>b.textContent.trim()==='Cancel').pop()||{}).click?.()" > /dev/null
sleep 1

echo "== 6) Home → wall =="
agent-browser eval "(document.querySelector('header button $HOMESEL')?.closest('button')||{}).click?.()" > /dev/null
sleep 1
R=$(agent-browser eval "(() => { const b=document.body.innerText; return JSON.stringify({wall: b.includes('Sign up to continue'), auth: !!document.querySelector('#email')}); })()")
ok "$(echo "$R" | pj "1 if d['wall'] and not d['auth'] else 0")" "home is walled (no dashboard behind, no login card)" "$R"
agent-browser eval "([...document.querySelectorAll('button')].filter(b=>b.textContent.trim()==='Cancel').pop()||{}).click?.()" > /dev/null
sleep 1

echo "== 7) reload mid-test → guest snapshot restores the session =="
R=$(agent-browser eval "(() => { try { return JSON.stringify({snap: !!localStorage.getItem('uuu_guest_progress:$TESTID')}); } catch { return JSON.stringify({snap: false}); } })()")
ok "$(echo "$R" | pj "1 if d['snap'] else 0")" "guest snapshot saved in localStorage" "$R"
agent-browser open "$BASE/?test=$TESTID" > /dev/null
sleep 3
R=$(agent-browser eval "(() => { const el=document.querySelector('button[role=\"radio\"][id\$=\"-A\"]'); return JSON.stringify({q1: document.body.innerText.includes('GQ1 $STAMP'), checked: el ? el.getAttribute('aria-checked') : 'none'}); })()")
ok "$(echo "$R" | pj "1 if d['q1'] and d['checked']=='true' else 0")" "after reload: same question, same answer" "$R"

echo "== 8) wall → Sign up → auth card with cancel back =="
agent-browser eval "(document.querySelector('header button $HOMESEL')?.closest('button')||{}).click?.()" > /dev/null
sleep 1
agent-browser eval "([...document.querySelectorAll('button')].filter(b=>b.textContent.trim()==='Sign up').pop()||{}).click?.()" > /dev/null
sleep 2
R=$(agent-browser eval "(() => JSON.stringify({name: !!document.querySelector('#name'), email: !!document.querySelector('#email'), cancelBack: document.body.innerText.includes('Cancel')}))()")
ok "$(echo "$R" | pj "1 if d['name'] and d['email'] and d['cancelBack'] else 0")" "auth card in signup mode with the cancel link" "$R"

echo "== 9) auth Cancel → back on the same question =="
agent-browser eval "([...document.querySelectorAll('button')].filter(b=>b.textContent.trim()==='Cancel').pop()||{}).click?.()" > /dev/null
sleep 1
R=$(agent-browser eval "(() => JSON.stringify({q1: document.body.innerText.includes('GQ1 $STAMP'), auth: !!document.querySelector('#email')}))()")
ok "$(echo "$R" | pj "1 if d['q1'] and not d['auth'] else 0")" "cancel returns to the running test" "$R"

echo "== 10) register → resume where stopped (no dashboard detour) =="
NEWE="r$STAMP@ui.test"
agent-browser eval "(document.querySelector('header button $HOMESEL')?.closest('button')||{}).click?.()" > /dev/null
sleep 1
agent-browser eval "([...document.querySelectorAll('button')].filter(b=>b.textContent.trim()==='Sign up').pop()||{}).click?.()" > /dev/null
sleep 2
agent-browser eval "(() => { const fill=(sel,v)=>{ const el=document.querySelector(sel); if(!el) return 'missing'; const d=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value'); d.set.call(el,v); el.dispatchEvent(new Event('input',{bubbles:true})); return 'ok'; }; return JSON.stringify([fill('#name','Resume Smoke'), fill('#email','$NEWE'), fill('#password','ui-pass-123')]); })()" > /dev/null
agent-browser eval "([...document.querySelectorAll('button')].filter(b=>b.textContent.trim()==='Sign Up')[0]||{}).click?.()" > /dev/null
sleep 4
R=$(agent-browser eval "(() => JSON.stringify({q1: document.body.innerText.includes('GQ1 $STAMP'), auth: !!document.querySelector('#email'), guestTake: (()=>{try{return localStorage.getItem('uuu_guest_take');}catch{return 'x';}})()}))()")
ok "$(echo "$R" | pj "1 if d['q1'] and not d['auth'] and d['guestTake'] in (None,'null') else 0")" "registered → resumed the test, guest markers cleared" "$R"
R=$(agent-browser eval "(() => { const el=document.querySelector('button[role=\"radio\"][id\$=\"-A\"]'); return JSON.stringify({checked: el ? el.getAttribute('aria-checked') : 'none'}); })()")
ok "$(echo "$R" | pj "1 if d['checked']=='true' else 0")" "the answer carried over into the account" "$R"

echo "== 11) dead link → splash with registration way in =="
agent-browser cookies clear > /dev/null
agent-browser open "$BASE/?test=cmdeadlinkdeadlinkdeadlinkdead" > /dev/null
sleep 3
R=$(agent-browser eval "(() => JSON.stringify({dead: document.body.innerText.includes('Test unavailable'), signup: document.body.innerText.includes('Sign up')}))()")
ok "$(echo "$R" | pj "1 if d['dead'] and d['signup'] else 0")" "dead link splash offers registration" "$R"

echo "== 12) logged-in user opening the link keeps the old deep-link behavior =="
agent-browser cookies clear > /dev/null
agent-browser open "$BASE/" > /dev/null
sleep 2
OWNER=$(python3 -c "import json;print(json.load(open('/tmp/guest-setup.json'))['email'])")
agent-browser eval "(() => { const fill=(sel,v)=>{ const el=document.querySelector(sel); if(!el) return 'missing'; const d=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value'); d.set.call(el,v); el.dispatchEvent(new Event('input',{bubbles:true})); return 'ok'; }; return JSON.stringify([fill('#email','$OWNER'), fill('#password','ui-pass-123')]); })()" > /dev/null
agent-browser eval "([...document.querySelectorAll('button')].filter(b=>b.textContent.trim()==='Sign In')[0]||{}).click?.()" > /dev/null
sleep 4
agent-browser open "$BASE/?test=$TESTID&fresh=owner" > /dev/null
sleep 3
R=$(agent-browser eval "(() => JSON.stringify({taking: !!document.querySelector('button[role=\"radio\"]'), feed: document.body.innerText.includes('UI guest $STAMP')}))()")
ok "$(echo "$R" | pj "1 if not d['taking'] and d['feed'] else 0")" "logged-in deep link opens the dashboard feed (not the guest taking screen)" "$R"

echo ""
echo "=== GUEST SMOKE RESULT: $PASS passed, $FAIL failed ==="
[ "$FAIL" = "0" ] || exit 1
