/* ============================================================
   RV Park Investment Analyzer — IntelliTC Solutions
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

function calculate(){
  const sites=parseNum(document.getElementById('sites').value);
  const price=parseNum(document.getElementById('price').value);
  const dpPct=parseNum(document.getElementById('dp').value)/100;
  const rate=parseNum(document.getElementById('rate').value)/100;
  const term=parseNum(document.getElementById('term').value);
  const avgRent=parseNum(document.getElementById('avgRent').value);
  const occPct=parseNum(document.getElementById('occupancy').value)/100;
  const otherIncome=parseNum(document.getElementById('otherIncome').value);
  const expRatio=parseNum(document.getElementById('expenseRatio').value)/100;

  const loan=price*(1-dpPct);
  const mr=rate/12;const n=term*12;
  const mortPmt=mr>0?loan*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):loan/n;
  const annualDebt=mortPmt*12;

  const grossRentYear=sites*avgRent*occPct*12;
  const otherYear=otherIncome*12;
  const grossRevenue=grossRentYear+otherYear;
  const totalExpenses=grossRevenue*expRatio;
  const noi=grossRevenue-totalExpenses;
  const annualCF=noi-annualDebt;
  const cashInvested=price*dpPct+price*0.03;

  const capRate=price>0?(noi/price)*100:0;
  const coc=cashInvested>0?(annualCF/cashInvested)*100:0;
  const revPerSite=sites>0?grossRevenue/sites:0;

  document.getElementById('kpiNOI').textContent=formatCurrency(noi);
  document.getElementById('kpiNOIDetail').textContent=formatCurrency(annualCF)+'/yr cash flow';
  document.getElementById('kpiCapRate').textContent=formatPct(capRate);
  document.getElementById('kpiCapRateDetail').textContent=capRate>=7?'Strong return':'Below 7% target';
  document.getElementById('kpiRevPerSite').textContent=formatCurrency(revPerSite);
  document.getElementById('kpiRevPerSiteDetail').textContent=formatCurrency(revPerSite/12)+'/mo per site';
  document.getElementById('kpiCoC').textContent=formatPct(coc);
  document.getElementById('kpiCoC').className='kpi-value '+(coc>=8?'kpi-positive':coc>=0?'':'kpi-negative');
  document.getElementById('kpiCoCDetail').textContent='On '+formatCurrency(cashInvested)+' invested';

  destroyCharts();const cs=getCS();

  // Revenue by Occupancy chart
  const occLevels=[50,55,60,65,70,75,80,85,90,95,100];
  const cfByOcc=occLevels.map(o=>{
    const gr=sites*avgRent*(o/100)*12+otherYear;
    const exp=gr*expRatio;
    return Math.round(gr-exp-annualDebt);
  });
  window.__charts.occ=new Chart(document.getElementById('chartOccupancy'),{type:'line',
    data:{labels:occLevels.map(o=>o+'%'),datasets:[{label:'Annual Cash Flow',data:cfByOcc,borderColor:cs.c1,backgroundColor:cs.c1+'22',fill:true,tension:0.3,pointRadius:4,pointHoverRadius:7}]},
    options:{...chartOpts('','line'),plugins:{...chartOpts('','line').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  // Expense Breakdown doughnut
  const netCF=Math.max(0,annualCF);
  window.__charts.exp=new Chart(document.getElementById('chartExpenses'),{type:'doughnut',
    data:{labels:['Operating Expenses','Debt Service',netCF>0?'Net Cash Flow':''].filter(Boolean),
      datasets:[{data:[totalExpenses,annualDebt,netCF].filter((_,i)=>i<2||netCF>0),backgroundColor:[cs.c2,cs.c3,cs.c1],borderWidth:0}]},
    options:{responsive:true,maintainAspectRatio:false,cutout:'55%',plugins:{legend:{position:'bottom',labels:{color:cs.text}},tooltip:{callbacks:{label:function(item){return item.label+': '+formatCurrency(item.raw)+' ('+formatPct(grossRevenue>0?item.raw/grossRevenue*100:0)+')'}}}}}});

  showResults();}