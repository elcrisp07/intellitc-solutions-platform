/* ============================================================
   HELOC Optimizer — IntelliTC Solutions
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

function calculate(){
  const mortBal=parseNum(document.getElementById('mortBal').value);
  const mortRate=parseNum(document.getElementById('mortRate').value)/100;
  const mortRemYrs=parseNum(document.getElementById('mortRemYrs').value);
  const mortPmt=parseNum(document.getElementById('mortPmt').value);
  const helocLimit=parseNum(document.getElementById('helocLimit').value);
  const helocRate=parseNum(document.getElementById('helocRate').value)/100;
  const helocChunk=parseNum(document.getElementById('helocChunk').value);
  const monthlyIncome=parseNum(document.getElementById('monthlyIncome').value);
  const monthlyExpenses=parseNum(document.getElementById('monthlyExpenses').value);
  const extraPmt=parseNum(document.getElementById('extraPmt').value);

  const mmr=mortRate/12;
  const hmr=helocRate/12;
  const surplus=monthlyIncome-monthlyExpenses-mortPmt;

  /* Strategy 1: Standard (no extra) */
  function simStandard(){
    let bal=mortBal;let months=0;let totInt=0;const bals=[];
    while(bal>0&&months<mortRemYrs*12+1){
      const ip=bal*mmr;const pp=Math.min(mortPmt-ip,bal);
      totInt+=ip;bal-=pp;months++;
      if(months%12===0||bal<=0)bals.push(Math.round(Math.max(0,bal)));
    }
    return{months,totInt,bals};
  }

  /* Strategy 2: Extra payments */
  function simExtra(){
    let bal=mortBal;let months=0;let totInt=0;const bals=[];
    while(bal>0&&months<mortRemYrs*12+1){
      const ip=bal*mmr;const pp=Math.min(mortPmt+extraPmt-ip,bal);
      totInt+=ip;bal-=pp;months++;
      if(months%12===0||bal<=0)bals.push(Math.round(Math.max(0,bal)));
    }
    return{months,totInt,bals};
  }

  /* Strategy 3: HELOC velocity banking */
  function simHELOC(){
    let mortB=mortBal;let helocB=0;let months=0;let totMortInt=0;let totHelocInt=0;const bals=[];
    let monthsSinceChunk=999;
    while((mortB>0||helocB>0)&&months<mortRemYrs*12+1){
      /* If HELOC is paid off and mortgage still exists, do another chunk */
      if(helocB<=0&&mortB>0&&monthsSinceChunk>=1){
        const chunk=Math.min(helocChunk,helocLimit,mortB);
        mortB-=chunk;helocB+=chunk;monthsSinceChunk=0;
      }
      /* Mortgage interest */
      const mortInt=mortB*mmr;const mortPP=Math.min(mortPmt-mortInt,mortB);
      totMortInt+=mortInt;mortB=Math.max(0,mortB-mortPP);
      /* HELOC: pay with surplus */
      const helocInt=helocB*hmr;totHelocInt+=helocInt;
      helocB+=helocInt;
      const helocPay=Math.min(surplus+extraPmt,helocB);
      helocB=Math.max(0,helocB-helocPay);
      months++;monthsSinceChunk++;
      if(months%12===0||(mortB<=0&&helocB<=0))bals.push(Math.round(Math.max(0,mortB+helocB)));
    }
    return{months,totInt:totMortInt+totHelocInt,bals};
  }

  const std=simStandard();
  const ext=simExtra();
  const vel=simHELOC();

  const yearsSaved=(std.months-vel.months)/12;
  const intSaved=std.totInt-vel.totInt;
  const now=new Date();
  const payoffDate=new Date(now.getFullYear(),now.getMonth()+vel.months);
  const payoffStr=payoffDate.toLocaleDateString('en-US',{month:'short',year:'numeric'});

  /* KPIs */
  document.getElementById('kpiYearsSaved').textContent=yearsSaved.toFixed(1)+' yrs';
  document.getElementById('kpiYearsSavedDetail').textContent=Math.round(std.months/12)+' yrs → '+Math.round(vel.months/12)+' yrs';
  document.getElementById('kpiIntSaved').textContent=formatCurrency(intSaved);
  document.getElementById('kpiIntSaved').className='kpi-value '+(intSaved>0?'kpi-positive':'');
  document.getElementById('kpiIntSavedDetail').textContent='vs '+formatCurrency(std.totInt)+' standard interest';
  document.getElementById('kpiNewPayoff').textContent=payoffStr;
  document.getElementById('kpiNewPayoffDetail').textContent='With HELOC velocity strategy';
  document.getElementById('kpiStrategyPmt').textContent=formatCurrency(surplus);
  document.getElementById('kpiStrategyPmtDetail').textContent='Monthly surplus after expenses';

  /* Charts */
  destroyCharts();const cs=getCS();

  const maxYrs=Math.ceil(std.months/12);
  const labels=[];for(let y=1;y<=maxYrs;y++)labels.push('Yr '+y);

  /* Pad arrays to same length */
  function pad(arr,len){while(arr.length<len)arr.push(0);return arr.slice(0,len);}

  window.__charts.payoff=new Chart(document.getElementById('chartPayoff'),{type:'line',data:{labels:labels,datasets:[
    {label:'Standard',data:pad([...std.bals],maxYrs),borderColor:cs.c5,tension:0.3},
    {label:'Extra Payments (+'+formatCurrency(extraPmt)+'/mo)',data:pad([...ext.bals],maxYrs),borderColor:cs.c2,borderDash:[5,3],tension:0.3},
    {label:'HELOC Velocity',data:pad([...vel.bals],maxYrs),borderColor:cs.c1,tension:0.3,borderWidth:3}
  ]},options:{...chartOpts('','line'),scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  window.__charts.savings=new Chart(document.getElementById('chartSavings'),{type:'bar',data:{labels:['Standard','Extra Payments','HELOC Velocity'],datasets:[
    {label:'Total Interest',data:[Math.round(std.totInt),Math.round(ext.totInt),Math.round(vel.totInt)],backgroundColor:[cs.c5,cs.c2,cs.c1]}
  ]},options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  /* Table */
  const tbody=document.getElementById('compBody');tbody.innerHTML='';
  const rows=[
    ['Payoff Time',Math.round(std.months/12)+' yrs ('+std.months+' mo)',Math.round(ext.months/12)+' yrs ('+ext.months+' mo)',Math.round(vel.months/12)+' yrs ('+vel.months+' mo)'],
    ['Total Interest',formatCurrency(std.totInt),formatCurrency(ext.totInt),formatCurrency(vel.totInt)],
    ['Interest Saved','—',formatCurrency(std.totInt-ext.totInt),formatCurrency(intSaved)],
    ['Years Saved','—',((std.months-ext.months)/12).toFixed(1)+' yrs',yearsSaved.toFixed(1)+' yrs'],
    ['Monthly Extra','$0',formatCurrency(extraPmt),formatCurrency(surplus)+' surplus'],
  ];
  rows.forEach(r=>{
    tbody.innerHTML+='<tr><td>'+r[0]+'</td><td class="text-right">'+r[1]+'</td><td class="text-right">'+r[2]+'</td><td class="text-right highlight">'+r[3]+'</td></tr>';
  });
  showResults();}