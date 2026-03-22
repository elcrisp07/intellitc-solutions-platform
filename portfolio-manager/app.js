/* ============================================================
   Portfolio Manager — IntelliTC Solutions
   ============================================================ */

/* ---- Theme Toggle ---- */
(function(){const t=document.querySelector('[data-theme-toggle]'),r=document.documentElement;let d=matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';r.setAttribute('data-theme',d);if(t){updateIcon();t.addEventListener('click',()=>{d=d==='dark'?'light':'dark';r.setAttribute('data-theme',d);t.setAttribute('aria-label','Switch to '+(d==='dark'?'light':'dark')+' mode');updateIcon();Object.values(window.__charts||{}).forEach(c=>{if(c&&c.update)c.update()});if(typeof onThemeChange==='function')onThemeChange();});} function updateIcon(){if(!t)return;t.innerHTML=d==='dark'?'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>':'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';}})();

/* ---- Utilities ---- */
function parseNum(s){return parseFloat(String(s).replace(/[^0-9.\-]/g,''))||0;}
function formatCurrency(n){if(Math.abs(n)>=1e6)return(n<0?'-':'')+'$'+(Math.abs(n)/1e6).toFixed(1)+'M';return(n<0?'-$':'$')+Math.abs(Math.round(n)).toLocaleString();}
function formatPct(n){return n.toFixed(1)+'%';}
function formatNum(n){return Math.round(n).toLocaleString();}
window.__charts={};
function getCS(){const s=getComputedStyle(document.documentElement);return{c1:s.getPropertyValue('--chart-1').trim(),c2:s.getPropertyValue('--chart-2').trim(),c3:s.getPropertyValue('--chart-3').trim(),c4:s.getPropertyValue('--chart-4').trim(),c5:s.getPropertyValue('--chart-5').trim(),c6:s.getPropertyValue('--chart-6').trim(),text:s.getPropertyValue('--color-text-muted').trim(),grid:s.getPropertyValue('--color-divider').trim(),surface:s.getPropertyValue('--color-surface').trim()};}
function destroyCharts(){Object.values(window.__charts).forEach(c=>{if(c&&c.destroy)c.destroy()});window.__charts={};}
function chartOpts(title,type){const cs=getCS();return{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true,labels:{color:cs.text,font:{family:'DM Sans'}}},title:{display:!!title,text:title,color:cs.text,font:{family:'DM Sans',size:14,weight:600}},tooltip:{backgroundColor:cs.surface,titleColor:cs.text,bodyColor:cs.text,borderColor:cs.grid,borderWidth:1}},scales:type==='pie'||type==='doughnut'||type==='radar'?undefined:{x:{ticks:{color:cs.text},grid:{color:cs.grid}},y:{ticks:{color:cs.text},grid:{color:cs.grid}}}};}

/* ---- Currency auto-format ---- */
document.querySelectorAll('input[data-currency]').forEach(inp=>{inp.addEventListener('blur',()=>{const v=parseNum(inp.value);if(v)inp.value=Math.round(v).toLocaleString();});});

/* ---- Panel toggle ---- */
const inputPanel=document.getElementById('inputPanel');
const resultsPanel=document.getElementById('resultsPanel');
function showResults(){inputPanel.classList.add('hidden');resultsPanel.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});}
function showInputs(){resultsPanel.classList.add('hidden');inputPanel.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});}
document.querySelectorAll('[data-back]').forEach(b=>b.addEventListener('click',showInputs));

function calculate(){const props=[];
  for(let i=1;i<=3;i++){const n=document.getElementById('p'+i+'name').value.trim();if(!n)continue;
    const p={name:n,price:parseNum(document.getElementById('p'+i+'price').value),value:parseNum(document.getElementById('p'+i+'value').value),rent:parseNum(document.getElementById('p'+i+'rent').value),exp:parseNum(document.getElementById('p'+i+'exp').value),mortBal:parseNum(document.getElementById('p'+i+'mortBal').value),mortPmt:parseNum(document.getElementById('p'+i+'mortPmt').value)};
    p.equity=p.value-p.mortBal;p.cf=p.rent-p.exp-p.mortPmt;p.cashIn=p.price*0.25;p.coc=p.cashIn>0?p.cf*12/p.cashIn*100:0;p.noi=(p.rent-p.exp)*12;p.capRate=p.price>0?p.noi/p.price*100:0;p.appreciation=p.price>0?(p.value-p.price)/p.price*100:0;
    props.push(p);}
  if(!props.length)return alert('Enter at least one property.');
  const tv=props.reduce((s,p)=>s+p.value,0);const te=props.reduce((s,p)=>s+p.equity,0);const tcf=props.reduce((s,p)=>s+p.cf,0);const avgCoc=props.reduce((s,p)=>s+p.coc,0)/props.length;
  document.getElementById('kpiTotalValue').textContent=formatCurrency(tv);document.getElementById('kpiTotalEquity').textContent=formatCurrency(te);
  document.getElementById('kpiTotalCF').textContent=formatCurrency(tcf);document.getElementById('kpiTotalCF').className='kpi-value '+(tcf>=0?'kpi-positive':'kpi-negative');
  document.getElementById('kpiTotalCFDetail').textContent=formatCurrency(tcf*12)+'/year';
  document.getElementById('kpiAvgCoC').textContent=formatPct(avgCoc);
  destroyCharts();const cs=getCS();const colors=[cs.c1,cs.c2,cs.c3,cs.c5,cs.c6,cs.c4];
  window.__charts.alloc=new Chart(document.getElementById('chartAlloc'),{type:'doughnut',data:{labels:props.map(p=>p.name),datasets:[{data:props.map(p=>p.value),backgroundColor:colors}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{color:cs.text}}}}});
  window.__charts.cf=new Chart(document.getElementById('chartCF'),{type:'bar',data:{labels:props.map(p=>p.name),datasets:[{data:props.map(p=>p.cf),backgroundColor:props.map((p,i)=>p.cf>=0?colors[i]:cs.c2)}]},options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});
  const tbody=document.getElementById('portBody');tbody.innerHTML='';
  props.forEach(p=>{tbody.innerHTML+=`<tr><td>${p.name}</td><td class="text-right">${formatCurrency(p.value)}</td><td class="text-right">${formatCurrency(p.equity)}</td><td class="text-right">${formatCurrency(p.cf)}</td><td class="text-right">${formatPct(p.coc)}</td><td class="text-right">${formatPct(p.capRate)}</td></tr>`;});
  tbody.innerHTML+=`<tr style="font-weight:700;border-top:2px solid var(--color-divider)"><td>Portfolio Total</td><td class="text-right">${formatCurrency(tv)}</td><td class="text-right">${formatCurrency(te)}</td><td class="text-right highlight">${formatCurrency(tcf)}</td><td class="text-right">${formatPct(avgCoc)}</td><td></td></tr>`;
  showResults();}