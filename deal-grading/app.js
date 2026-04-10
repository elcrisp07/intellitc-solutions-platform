/* ============================================================
   Deal Grading Calculator — IntelliTC Solutions
   ============================================================ */

/* ---- Theme Toggle ---- */
(function(){const toggles=document.querySelectorAll('[data-theme-toggle]'),r=document.documentElement;let d=localStorage.getItem('intellitc-theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');r.setAttribute('data-theme',d);function updateIcon(){const icon=d==='dark'?'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>':'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';toggles.forEach(function(t){t.innerHTML=icon;});}updateIcon();toggles.forEach(function(t){t.addEventListener('click',function(){d=d==='dark'?'light':'dark';r.setAttribute('data-theme',d);localStorage.setItem('intellitc-theme',d);t.setAttribute('aria-label','Switch to '+(d==='dark'?'light':'dark')+' mode');updateIcon();Object.values(window.__charts||{}).forEach(function(c){if(c&&c.update)c.update()});if(typeof onThemeChange==='function')onThemeChange();});});})();

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

/* ---- Calculate ---- */
function calculate(){
  const deals=[];
  for(let i=1;i<=2;i++){
    const n=document.getElementById('d'+i+'name').value.trim();
    if(!n) continue;
    deals.push({name:n,price:parseNum(document.getElementById('d'+i+'price').value),rent:parseNum(document.getElementById('d'+i+'rent').value),capRate:parseNum(document.getElementById('d'+i+'caprate').value),coc:parseNum(document.getElementById('d'+i+'coc').value),equity:parseNum(document.getElementById('d'+i+'equity').value)});
  }
  if(!deals.length) return alert('Enter at least one deal.');

  deals.forEach(d=>{
    d.cfScore=Math.min(d.rent*12/(d.price||1)*100*10,100);
    d.capScore=Math.min(d.capRate*12,100);
    d.cocScore=Math.min(d.coc*8,100);
    d.eqScore=Math.min(d.equity*4,100);
    d.total=d.cfScore*0.25+d.capScore*0.2+d.cocScore*0.25+d.eqScore*0.3;
    d.grade=d.total>=80?'A':d.total>=65?'B':d.total>=50?'C':d.total>=35?'D':'F';
  });
  deals.sort((a,b)=>b.total-a.total);

  document.getElementById('kpiTopDeal').textContent=deals[0].name;
  document.getElementById('kpiTopDealDetail').textContent='Score: '+deals[0].total.toFixed(0)+'/100';
  document.getElementById('kpiAvgScore').textContent=(deals.reduce((s,d)=>s+d.total,0)/deals.length).toFixed(0);
  const bestCF=deals.reduce((a,b)=>a.rent>b.rent?a:b);
  document.getElementById('kpiBestCF').textContent=formatCurrency(bestCF.rent)+'/mo';
  document.getElementById('kpiBestCFDetail').textContent=bestCF.name;
  const bestV=deals.reduce((a,b)=>a.equity>b.equity?a:b);
  document.getElementById('kpiBestValue').textContent=formatPct(bestV.equity);
  document.getElementById('kpiBestValueDetail').textContent=bestV.name;

  destroyCharts();
  const cs=getCS();

  window.__charts.radar=new Chart(document.getElementById('chartRadar'),{type:'radar',data:{labels:['Cash Flow','Cap Rate','CoC Return','Equity Spread'],datasets:deals.map((d,i)=>({label:d.name,data:[d.cfScore,d.capScore,d.cocScore,d.eqScore],borderColor:[cs.c1,cs.c2,cs.c3][i],backgroundColor:[cs.c1+'20',cs.c2+'20',cs.c3+'20'][i]}))},options:{responsive:true,maintainAspectRatio:false,scales:{r:{ticks:{color:cs.text},grid:{color:cs.grid},pointLabels:{color:cs.text}}},plugins:{legend:{labels:{color:cs.text}}}}});

  window.__charts.rank=new Chart(document.getElementById('chartRank'),{type:'bar',data:{labels:deals.map(d=>d.name),datasets:[{data:deals.map(d=>d.total),backgroundColor:[cs.c1,cs.c2,cs.c3]}]},options:{...chartOpts('','bar'),indexAxis:'y',plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{y:{ticks:{color:cs.text},grid:{display:false}},x:{max:100,ticks:{color:cs.text},grid:{color:cs.grid}}}}});

  const tbody=document.getElementById('rankBody');
  tbody.innerHTML='';
  deals.forEach(d=>{
    const gc=d.grade==='A'?'grade-a':d.grade==='B'?'grade-b':d.grade==='C'?'grade-c':d.grade==='D'?'grade-d':'grade-f';
    tbody.innerHTML+=`<tr><td>${d.name}</td><td class="text-right">${formatPct(d.capRate)}</td><td class="text-right">${formatPct(d.coc)}</td><td class="text-right">${formatPct(d.equity)}</td><td class="text-right">${d.total.toFixed(0)}</td><td class="text-center"><span class="grade-badge ${gc}">${d.grade}</span></td></tr>`;
  });

  showResults();
}