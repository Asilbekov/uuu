/* v3 scene builders. Every frame is a pure function of narrative time. */

BUILDERS.question = (blk, t0) => {
  const root = el('div', 'block b-question', $('#ground'));
  const heading = el('h2', '', root);
  heading.textContent = blk.data.heading || 'Сначала — самостоятельно';
  const card = el('div', 'q-problem card', root);
  const label = el('div', 'q-label', card);
  label.textContent = blk.data.mode === 'quick' ? 'Повторная задача · только ответ' : 'Условие · решите до разбора';
  const text = el('div', 'q-text', card);
  richText(text, blk.data.problem || '');
  const timer = el('div', 'q-timer', root);
  const time = el('div', 'q-time', timer);
  const unit = el('div', 'q-unit', timer);
  unit.textContent = 'на решение';
  const hint = el('div', 'q-hint', root);
  hint.textContent = 'Запишите идею и первый шаг. Видео можно поставить на паузу.';
  let answer = null;
  if (blk.data.answer) {
    answer = el('div', 'q-answer', root);
    richText(answer, blk.data.answer);
  }
  const hold = Math.max(1, Number(blk.data.hold || 12));
  for (let second = 0; second <= Math.ceil(hold); second++) {
    move(t0 + 0.9 + second, t0 + 0.95 + second, 1);
  }
  move(t0, t0 + 0.75, 70);
  return (tl) => {
    const enter = spr(clamp01(tl / 0.75), 0.75, 0.8, 14);
    heading.style.opacity = String(enter);
    card.style.opacity = String(enter);
    card.style.transform = `translateY(${(1-enter)*56}px) scale(${0.975+0.025*enter})`;
    const work = clamp01((tl - 0.9) / hold);
    timer.style.setProperty('--qprogress', String(1-work));
    timer.style.opacity = String(spr(clamp01((tl-0.2)/0.6), 0.6, 0.8, 14));
    time.textContent = String(Math.max(0, Math.ceil(hold * (1-work))));
    hint.style.opacity = work >= 1 ? '0' : '1';
    if (answer) {
      const show = tl >= 0.9 + Math.max(0, hold - 4);
      answer.style.opacity = show ? '1' : '0';
      answer.style.transform = show ? 'translateY(0)' : 'translateY(24px)';
      hint.style.opacity = show ? '0' : '1';
      if (show) { card.style.display = 'none'; timer.style.display = 'none'; }
      else { card.style.display = ''; timer.style.display = ''; }
    }
  };
};

function visualShell(blk, className='') {
  const root = el('div', 'block b-visual '+className, $('#ground'));
  const h2 = el('h2', '', root); h2.textContent = blk.data.heading;
  const stage = el('div', 'visual-stage card', root);
  return {root, h2, stage};
}

function visualEnter(h2, stage, tl) {
  const kh = spr(clamp01(tl/0.65), 0.65, 0.8, 14);
  h2.style.opacity = String(kh);
  h2.style.transform = `translateY(${(1-kh)*34}px)`;
  const ks = spr(clamp01((tl-0.15)/0.8), 0.8, 0.78, 14);
  stage.style.opacity = String(ks);
  stage.style.transform = `translateY(${(1-ks)*48}px) scale(${0.98+0.02*ks})`;
}

function complexRootsScene(blk, t0) {
  const {root, h2, stage} = visualShell(blk);
  const cx=850, cy=335, radius=220;
  const points = blk.data.angles.map((angle, i) => {
    const a=angle*Math.PI/180;
    return {x:cx+radius*Math.cos(a), y:cy-radius*Math.sin(a), label:blk.data.labels[i], angle};
  });
  let grid='';
  for(let x=170;x<=1530;x+=85) grid+=`<line class="complex-grid" x1="${x}" y1="55" x2="${x}" y2="615"/>`;
  for(let y=55;y<=615;y+=70) grid+=`<line class="complex-grid" x1="170" y1="${y}" x2="1530" y2="${y}"/>`;
  const spokes=points.map(p=>`<line class="complex-spoke" x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}"/>`).join('');
  const polygon=points.map(p=>`${p.x},${p.y}`).join(' ');
  const nodes=points.map((p,i)=>{
    const above=p.y<cy, lx=p.x+(p.x<cx?-28:28), anchor=p.x<cx?'end':'start';
    return `<g class="root-point" data-i="${i}" opacity="0"><circle class="complex-point" cx="${p.x}" cy="${p.y}" r="13"/>
      <text class="complex-label" x="${lx}" y="${p.y+(above?-28:42)}" text-anchor="${anchor}">${p.label}</text></g>`;
  }).join('');
  stage.innerHTML=`<svg class="complex-svg" viewBox="0 0 1700 680">${grid}
    <line class="complex-axis" x1="140" y1="${cy}" x2="1570" y2="${cy}"/><line class="complex-axis" x1="${cx}" y1="630" x2="${cx}" y2="35"/>
    <text class="complex-origin" x="1560" y="${cy-18}" text-anchor="end">Re</text><text class="complex-origin" x="${cx+20}" y="45">Im</text>
    <circle class="complex-circle" pathLength="1" cx="${cx}" cy="${cy}" r="${radius}"/>
    ${spokes}<polygon class="complex-polygon" points="${polygon}"/>${nodes}
    <text class="complex-label" x="${cx+radius+26}" y="${cy-20}">r = 2</text></svg>`;
  const caption=el('div','visual-caption',stage); caption.textContent='Один модуль · равные углы 2π/3 · сумма корней равна нулю';
  move(t0,t0+2.8,240);
  return tl=>{
    visualEnter(h2,stage,tl);
    const draw=clamp01((tl-0.35)/1.8);
    stage.style.setProperty('--draw',String(draw));
    stage.querySelectorAll('.root-point').forEach((node,i)=>{
      const k=spr(clamp01((tl-1.0-i*0.38)/0.55),0.55,0.65,14);
      node.setAttribute('opacity',String(k));
      node.style.transform=`translateY(${(1-k)*18}px)`;
    });
  };
}

function functionMachineScene(blk,t0) {
  const {root,h2,stage}=visualShell(blk);
  const wrap=el('div','machine-wrap',stage);
  const nodes=[['x','вход'],['g','сначала +1'],['f','затем квадрат'],['(x+1)²','результат']];
  const made=[];
  nodes.forEach((data,i)=>{
    if(i){const arrow=el('div','machine-arrow',wrap);arrow.textContent='→';made.push(arrow);}
    const node=el('div','machine-node'+(i===nodes.length-1?' output':''),wrap);
    const symbol=el('div','symbol',node);symbol.textContent=data[0];
    const label=el('div','label',node);label.textContent=data[1];made.push(node);
  });
  const equation=el('div','machine-equation',stage);equation.textContent='(f ∘ g)(x) = f(g(x))     ≠     (g ∘ f)(x)';
  made.forEach((_,i)=>move(t0+0.25+i*0.16,t0+0.85+i*0.16,90));
  return tl=>{
    visualEnter(h2,stage,tl);
    made.forEach((node,i)=>{
      const k=spr(clamp01((tl-0.25-i*0.16)/0.6),0.6,0.72,14);
      node.style.opacity=String(k);node.style.transform=`translateY(${(1-k)*70}px) scale(${0.9+0.1*k})`;
    });
    equation.style.opacity=String(clamp01((tl-1.4)/0.7));
  };
}

function squeezeScene(blk,t0) {
  const {root,h2,stage}=visualShell(blk);
  const left=170,right=1540,base=500,amp=330,center=850;
  const pathFor=(fn)=>{
    const pts=[];for(let i=0;i<=360;i++){const x=-1+2*i/360,y=Math.abs(x)<1e-9?0:fn(x);pts.push(`${left+(x+1)/2*(right-left)},${base-y*amp}`);}return 'M'+pts.join(' L');
  };
  let grid='';for(let x=left;x<=right;x+=95)grid+=`<line class="squeeze-grid" x1="${x}" y1="55" x2="${x}" y2="615"/>`;
  for(let y=85;y<=585;y+=70)grid+=`<line class="squeeze-grid" x1="${left}" y1="${y}" x2="${right}" y2="${y}"/>`;
  stage.innerHTML=`<svg class="squeeze-svg" viewBox="0 0 1700 680">${grid}
    <path class="squeeze-bound" stroke="#67e8c5" pathLength="1" d="${pathFor(x=>x*x)}"/>
    <path class="squeeze-bound" stroke="#60a5fa" pathLength="1" d="${pathFor(x=>-x*x)}"/>
    <path class="squeeze-mid" pathLength="1" d="${pathFor(x=>x*x*Math.sin(18/x))}"/>
    <line x1="${center}" y1="55" x2="${center}" y2="615" stroke="#71869b" stroke-width="2" stroke-dasharray="8 8"/>
    <circle cx="${center}" cy="${base}" r="12" fill="#f7c873"/></svg>`;
  const legend=el('div','squeeze-legend',stage);
  legend.innerHTML='<span style="color:#67e8c5">— верхняя: x²</span><span style="color:#60a5fa">— нижняя: −x²</span><span style="color:#f7c873">— x² sin(1/x)</span>';
  const caption=el('div','visual-caption',stage);caption.textContent='Полоса сжимается к нулю → предел средней функции тоже ноль';
  move(t0,t0+3.0,300);
  return tl=>{
    visualEnter(h2,stage,tl);
    const draw=clamp01((tl-0.3)/2.1);stage.style.setProperty('--draw',String(draw));
    const converge=clamp01((tl-1.1)/2.0);
    const paths=stage.querySelectorAll('.squeeze-bound,.squeeze-mid');
    paths.forEach(p=>{p.style.transformOrigin=`${center}px ${base}px`;p.style.transform=`scaleY(${1-0.12*converge})`;});
  };
}

function landauScene(blk,t0) {
  const {root,h2,stage}=visualShell(blk);
  const grid=el('div','landau-grid',stage);
  const cards=[
    ['O','Ограниченное отношение','|f / g| ≤ C','3x = O(x), потому что отношение равно 3'],
    ['o','Исчезающее отношение','|f / g| → 0','x² = o(x) при x → 0'],
  ].map(([big,rule,formula,example])=>{
    const card=el('div','landau-card',grid);
    const b=el('div','big',card);b.textContent=big;
    const r=el('div','rule',card);r.textContent=rule;
    const f=el('div','rule',card);f.textContent=formula;
    const e=el('div','example',card);e.textContent=example;return card;
  });
  cards.forEach((_,i)=>move(t0+0.35+i*0.35,t0+1.2+i*0.35,100));
  return tl=>{
    visualEnter(h2,stage,tl);
    cards.forEach((card,i)=>{const k=spr(clamp01((tl-0.35-i*0.35)/0.85),0.85,0.72,14);
      card.style.opacity=String(k);card.style.transform=`translateY(${(1-k)*80}px) scale(${0.94+0.06*k})`;});
  };
}

BUILDERS.visual = (blk,t0) => {
  const kind=blk.data.kind;
  if(kind==='complex_roots') return complexRootsScene(blk,t0);
  if(kind==='function_machine') return functionMachineScene(blk,t0);
  if(kind==='squeeze') return squeezeScene(blk,t0);
  if(kind==='landau') return landauScene(blk,t0);
  throw new Error('unknown visual kind: '+kind);
};
