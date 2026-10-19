#!/bin/bash
# Проба: в окне редактирования ВЕРСИИ другого теста НЕТ селектора публикации
# («Только по ссылке» / «Всему сообществу»); у обычного своего теста он ЕСТЬ.
BASE=${BASE:-http://127.0.0.1:3199}
REPO=/home/z/my-project/repo-uuu
PASS=0; FAIL=0
ok(){ if [ "$2" = "1" ]; then echo "  ✅ $1"; PASS=$((PASS+1)); else echo "  ❌ $1"; FAIL=$((FAIL+1)); fi; }

cd "$REPO"

# --- фикстуры
BASE=$BASE node scripts/vpub-setup.cjs > /tmp/vpub-setup.json 2>/tmp/vpub-setup.err || { echo "SETUP FAILED: $(cat /tmp/vpub-setup.err)"; exit 1; }
STAMP=$(python3 -c "import json;print(json.load(open('/tmp/vpub-setup.json'))['stamp'])")
BEMAIL=$(python3 -c "import json;print(json.load(open('/tmp/vpub-setup.json'))['bobEmail'])")
VTITLE=$(python3 -c "import json;print(json.load(open('/tmp/vpub-setup.json'))['versionTitle'])")
OTITLE=$(python3 -c "import json;print(json.load(open('/tmp/vpub-setup.json'))['ownTitle'])")
echo "stamp: $STAMP  bob: $BEMAIL"
echo "version title: $VTITLE"
echo "own title:     $OTITLE"

agent-browser cookies clear > /dev/null
agent-browser set viewport 390 844 > /dev/null
agent-browser open "$BASE/?fresh=vpub1" > /dev/null
agent-browser wait --load networkidle > /dev/null
sleep 1

echo "== login as bob =="
agent-browser eval "(() => { const set=(el,v)=>{const d=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el),'value'); d.set.call(el,v); el.dispatchEvent(new Event('input',{bubbles:true}));}; const em=[...document.querySelectorAll('input')].find(i=>i.type==='email'); const pw=[...document.querySelectorAll('input')].find(i=>i.type==='password'); set(em,'$BEMAIL'); set(pw,'vpub-pass-123'); return 'ok'; })()" > /dev/null
agent-browser find role button click --name "Sign In" > /dev/null
LOGGED=no
for i in $(seq 1 20); do
  if agent-browser eval "!!document.querySelector('button[aria-label=\"My Library\"]')" | rg -q "true"; then LOGGED=yes; break; fi
  sleep 1
done
ok "login → feed visible" "$([ "$LOGGED" = "yes" ] && echo 1 || echo 0)"

READY=no
for i in $(seq 1 40); do
  R=$(agent-browser eval "[...document.querySelectorAll('.swiper-slide')].some(x=>x.textContent.includes('$STAMP')) ? 'yes' : 'no'" | tr -d '\\"')
  if [ "$R" = "yes" ]; then READY=yes; break; fi
  sleep 1
done
ok "bob's fixtures reached the feed" "$([ "$READY" = "yes" ] && echo 1 || echo 0)"

# --- открыть окно редактирования для слайда с данным названием
open_edit(){
  agent-browser eval "(() => {
    const s=[...document.querySelectorAll('.swiper-slide')].find(x=>x.textContent.includes('$1'));
    if(!s) return 'no-slide';
    const b=[...s.querySelectorAll('button')].find(x=>x.querySelector('.lucide-pencil'));
    if(!b) return 'no-btn';
    b.click(); return 'clicked';
  })()" > /dev/null
  for i in $(seq 1 15); do
    R=$(agent-browser eval "(() => { const ins=[...document.querySelectorAll('input')].filter(i=>i.value.includes('$1')); const sv=[...document.querySelectorAll('button')].some(b=>/Save Test|Сохранить тест/.test(b.textContent)); return (ins.length && sv) ? 'yes' : 'no'; })()" | tr -d '\\"')
    if [ "$R" = "yes" ]; then echo "opened"; return 0; fi
    sleep 1
  done
  echo "timeout"; return 1
}

close_edit(){
  agent-browser eval "(() => { const b=[...document.querySelectorAll('button')].reverse().find(x=>x.className.includes('h-7 w-7 p-0')&&x.querySelector('.lucide-x')); if(!b) return 'no-x'; b.click(); return 'closed'; })()" > /dev/null
  sleep 1.5
}

# раскрыть секцию «Информация о тесте» внутри открытого окна редактирования
expand_info(){
  agent-browser eval "(() => {
    const hdr=[...document.querySelectorAll('button')].find(b=>/Информация о тесте|Test Information/.test(b.textContent));
    if(!hdr) return 'no-hdr';
    if(hdr.querySelector('.lucide-chevron-down')) hdr.click();
    return 'ok';
  })()" > /dev/null
  sleep 1
}

# публикационный селектор внутри окна редактирования (по поиску строки по всему DOM окна)
pub_state(){
  agent-browser eval "(() => {
    const txt=document.body.innerText;
    const has=/Только по ссылке|Only by link|Всему сообществу|Whole community|Вариант публикации|Publication/.test(txt);
    return has ? 'present' : 'absent';
  })()" | tr -d '\\"'
}

echo "== A) version edit window: publication selector ABSENT =="
R=$(open_edit "$VTITLE")
ok "edit window opens for the version ($R)" "$([ "$R" = "opened" ] && echo 1 || echo 0)"
expand_info
ST=$(pub_state)
ok "publication selector ABSENT in version editor ($ST)" "$([ "$ST" = "absent" ] && echo 1 || echo 0)"
close_edit

echo "== B) own (non-version) test edit window: selector PRESENT =="
R=$(open_edit "$OTITLE")
ok "edit window opens for own test ($R)" "$([ "$R" = "opened" ] && echo 1 || echo 0)"
expand_info
ST=$(pub_state)
ok "publication selector PRESENT in own-test editor ($ST)" "$([ "$ST" = "present" ] && echo 1 || echo 0)"
close_edit

echo "== cleanup =="
TID=$(python3 -c "import json;print(json.load(open('/tmp/vpub-setup.json'))['trunkId'])")
VID=$(python3 -c "import json;print(json.load(open('/tmp/vpub-setup.json'))['versionId'])")
OID=$(python3 -c "import json;print(json.load(open('/tmp/vpub-setup.json'))['ownId'])")
BCOOK=$(python3 -c "import json;print(json.load(open('/tmp/vpub-setup.json'))['bobCookie'])")
ACOOK=$(python3 -c "import json;print(json.load(open('/tmp/vpub-setup.json'))['aliceCookie'])")
curl -s -X DELETE -H "Cookie: $BCOOK" "$BASE/api/tests/$VID" > /dev/null
curl -s -X DELETE -H "Cookie: $BCOOK" "$BASE/api/tests/$OID" > /dev/null
curl -s -X DELETE -H "Cookie: $ACOOK" "$BASE/api/tests/$TID" > /dev/null
curl -s -X DELETE -H "Cookie: $BCOOK" "$BASE/api/me" > /dev/null
curl -s -X DELETE -H "Cookie: $ACOOK" "$BASE/api/me" > /dev/null
echo "fixtures removed"

echo ""
echo "=== VERSION-PUBLISH PROBE: $PASS passed, $FAIL failed ==="
exit $([ "$FAIL" = "0" ] && echo 0 || echo 1)
