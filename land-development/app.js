/* ============================================================
   Land Development Calculator — IntelliTC Solutions
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
  const land=parseNum(document.getElementById('landCost').value);
  const lots=parseNum(document.getElementById('lots').value);
  const dev=parseNum(document.getElementById('devCosts').value);
  const constPU=parseNum(document.getElementById('constPerUnit').value);
  const softPct=parseNum(document.getElementById('softPct').value)/100;
  const salePU=parseNum(document.getElementById('salePerUnit').value);
  const timeline=parseNum(document.getElementById('timeline').value);
  const pace=parseNum(document.getElementById('salesPace').value);
  const ltc=parseNum(document.getElementById('loanPct').value)/100;
  const loanRate=parseNum(document.getElementById('loanRate').value)/100;

  const hardCosts=dev+constPU*lots;
  const softCosts=hardCosts*softPct;
  const totalCost=land+hardCosts+softCosts;
  const loanAmt=totalCost*ltc;
  const equity=totalCost-loanAmt;
  const intCost=loanAmt*loanRate*(timeline/12);
  const totalWithFin=totalCost+intCost;

  const revenue=lots*salePU;
  const profit=revenue-totalWithFin;
  const margin=revenue>0?profit/revenue*100:0;
  const roi=equity>0?profit/equity*100:0;
  const beUnits=salePU>0?Math.ceil(totalWithFin/salePU):lots;

  document.getElementById('kpiProfit').textContent=formatCurrency(profit);
  document.getElementById('kpiProfit').className='kpi-value '+(profit>=0?'kpi-positive':'kpi-negative');
  document.getElementById('kpiMargin').textContent=formatPct(margin);
  document.getElementById('kpiROI').textContent=formatPct(roi);
  document.getElementById('kpiBEUnits').textContent=beUnits+' of '+lots;
  document.getElementById('kpiBEUnitsDetail').textContent=beUnits<=lots?'Achievable':'Exceeds planned units';

  destroyCharts();
  const cs=getCS();

  window.__charts.budget=new Chart(document.getElementById('chartBudget'),{type:'bar',data:{labels:['Land','Development','Construction','Soft Costs','Interest','Total Cost','Revenue','Profit'],datasets:[{data:[land,dev,constPU*lots,softCosts,intCost,totalWithFin,revenue,profit],backgroundColor:[cs.c3,cs.c2,cs.c2,cs.c2,cs.c5,cs.c3,cs.c1,profit>=0?cs.c1:cs.c2]}]},options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text,maxRotation:45},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  const sens=[-15,-10,-5,0,5,10,15].map(d=>{const sp=salePU*(1+d/100);return{label:(d>=0?'+':'')+d+'%',profit:lots*sp-totalWithFin};});
  window.__charts.sens=new Chart(document.getElementById('chartSensitivity'),{type:'bar',data:{labels:sens.map(s=>s.label),datasets:[{data:sens.map(s=>s.profit),backgroundColor:sens.map(s=>s.profit>=0?cs.c1:cs.c2)}]},options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  const tbody=document.getElementById('budgetBody');
  tbody.innerHTML='';
  [['Land',land],['Site Development',dev],['Construction',constPU*lots],['Soft Costs',softCosts],['Interest Reserve',intCost],['Total Development Cost',totalWithFin]].forEach(([l,v])=>{
    tbody.innerHTML+=`<tr><td>${l}</td><td class="text-right">${formatCurrency(v)}</td><td class="text-right">${formatPct(v/totalWithFin*100)}</td></tr>`;
  });
  tbody.innerHTML+='<tr style="font-weight:700;border-top:2px solid var(--color-divider)"><td>Gross Revenue</td><td class="text-right">'+formatCurrency(revenue)+'</td><td></td></tr>';
  tbody.innerHTML+='<tr style="font-weight:700"><td>Net Profit</td><td class="text-right highlight">'+formatCurrency(profit)+'</td><td class="text-right">'+formatPct(margin)+'</td></tr>';

  showResults();
}