/* ============================================================
   Home Equity Calculator — IntelliTC Solutions
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
  const value=parseNum(document.getElementById('value').value);
  const balance=parseNum(document.getElementById('balance').value);
  const origPrice=parseNum(document.getElementById('origPrice').value);
  const yearBought=parseNum(document.getElementById('yearBought').value);
  const helocRate=parseNum(document.getElementById('helocRate').value)/100;
  const helRate=parseNum(document.getElementById('helRate').value)/100;
  const helTerm=parseNum(document.getElementById('helTerm').value);
  const cashDesired=parseNum(document.getElementById('cashDesired').value);

  const equity=value-balance;
  const ltv=value>0?(balance/value*100):0;
  const equityPct=value>0?(equity/value*100):0;
  /* Available at 80% CLTV */
  const maxBorrow80=Math.max(0,value*0.80-balance);
  /* Available at 90% CLTV */
  const maxBorrow90=Math.max(0,value*0.90-balance);
  const appreciation=origPrice>0?((value-origPrice)/origPrice*100):0;
  const appreciationDollar=value-origPrice;
  const yearsOwned=2026-yearBought;
  const annualAppRate=yearsOwned>0?((Math.pow(value/origPrice,1/yearsOwned)-1)*100):0;

  /* HELOC: interest-only payment on desired amount */
  const helocAmt=Math.min(cashDesired,maxBorrow80);
  const helocPayment=helocAmt*helocRate/12;
  const helocTotalInt10=helocPayment*12*10;/* 10-year IO cost */

  /* HEL: amortized payment */
  const helAmt=Math.min(cashDesired,maxBorrow80);
  const hmr=helRate/12;const hn=helTerm*12;
  const helPayment=hmr>0?helAmt*(hmr*Math.pow(1+hmr,hn))/(Math.pow(1+hmr,hn)-1):helAmt/hn;
  const helTotalPaid=helPayment*hn;
  const helTotalInt=helTotalPaid-helAmt;

  document.getElementById('kpiEquity').textContent=formatCurrency(equity);
  document.getElementById('kpiEquityDetail').textContent=formatPct(equityPct)+' of home value';
  document.getElementById('kpiLTV').textContent=formatPct(ltv);
  document.getElementById('kpiLTV').className='kpi-value '+(ltv<=80?'kpi-positive':ltv<=90?'':'kpi-negative');
  document.getElementById('kpiLTVDetail').textContent=ltv<=80?'Eligible for HELOC/HEL':'Above 80% — limited options';
  document.getElementById('kpiAvailable').textContent=formatCurrency(maxBorrow80);
  document.getElementById('kpiAvailableDetail').textContent='At 80% CLTV ('+formatCurrency(maxBorrow90)+' at 90%)';
  document.getElementById('kpiAppreciation').textContent=formatPct(appreciation);
  document.getElementById('kpiAppreciationDetail').textContent=formatCurrency(appreciationDollar)+' over '+yearsOwned+' years';

  destroyCharts();const cs=getCS();

  /* Chart 1: Equity position stacked bar */
  window.__charts.eq=new Chart(document.getElementById('chartEquity'),{type:'bar',data:{
    labels:['Your Home'],
    datasets:[
      {label:'Mortgage Balance',data:[balance],backgroundColor:cs.c2},
      {label:'Your Equity',data:[equity],backgroundColor:cs.c1}
    ]
  },options:{...chartOpts('','bar'),indexAxis:'y',plugins:{...chartOpts('','bar').plugins},scales:{x:{stacked:true,ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}},y:{stacked:true,ticks:{color:cs.text},grid:{display:false}}}}});

  /* Chart 2: HELOC vs HEL comparison */
  window.__charts.comp=new Chart(document.getElementById('chartCompare'),{type:'bar',data:{
    labels:['Monthly Payment','Total Interest','Amount Borrowed'],
    datasets:[
      {label:'HELOC (IO)',data:[Math.round(helocPayment),Math.round(helocTotalInt10),helocAmt],backgroundColor:cs.c1},
      {label:'Home Equity Loan',data:[Math.round(helPayment),Math.round(helTotalInt),helAmt],backgroundColor:cs.c3}
    ]
  },options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins},scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  /* Chart 3: Equity growth projection (assuming continued appreciation) */
  const growthRate=annualAppRate>0?annualAppRate/100:0.03;
  const yrs=[];const eqData=[];const valData=[];
  let projVal=value;let projBal=balance;
  /* Rough mortgage paydown ~principal portion grows over time */
  const avgMortRate=0.065;const remTerm=25;
  const mmr=avgMortRate/12;const mn=remTerm*12;
  const mortPmt=mmr>0?projBal*(mmr*Math.pow(1+mmr,mn))/(Math.pow(1+mmr,mn)-1):projBal/mn;
  for(let y=0;y<=10;y++){
    yrs.push(y===0?'Now':'Year '+y);
    eqData.push(Math.round(projVal-projBal));
    valData.push(Math.round(projVal));
    projVal*=(1+growthRate);
    /* Approximate annual principal paydown */
    for(let m=0;m<12;m++){if(projBal<=0)break;const ip=projBal*mmr;const pp=Math.min(mortPmt-ip,projBal);projBal-=pp;}
  }
  window.__charts.growth=new Chart(document.getElementById('chartGrowth'),{type:'line',data:{
    labels:yrs,
    datasets:[
      {label:'Home Value',data:valData,borderColor:cs.c5,borderDash:[5,3],tension:0.3,pointRadius:2},
      {label:'Your Equity',data:eqData,borderColor:cs.c1,backgroundColor:cs.c1+'20',fill:true,tension:0.3,pointRadius:3}
    ]
  },options:{...chartOpts('','line'),scales:{x:{ticks:{color:cs.text},grid:{color:cs.grid}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  /* Table: HELOC vs HEL side-by-side */
  const tbody=document.getElementById('eqBody');tbody.innerHTML='';
  const rows=[
    ['Amount Borrowed',formatCurrency(helocAmt),formatCurrency(helAmt)],
    ['Interest Rate',formatPct(helocRate*100)+' (variable)',formatPct(helRate*100)+' (fixed)'],
    ['Monthly Payment',formatCurrency(helocPayment),formatCurrency(helPayment)],
    ['Payment Type','Interest Only','Fully Amortized'],
    ['Term','Revolving (10yr draw)',helTerm+' years fixed'],
    ['Total Interest (10yr)',formatCurrency(helocTotalInt10),formatCurrency(helTotalInt)],
    ['Total Cost',formatCurrency(helocAmt+helocTotalInt10),formatCurrency(helTotalPaid)],
    ['Max Available (80% CLTV)',formatCurrency(maxBorrow80),formatCurrency(maxBorrow80)],
    ['Max Available (90% CLTV)',formatCurrency(maxBorrow90),formatCurrency(maxBorrow90)]
  ];
  rows.forEach(r=>{tbody.innerHTML+=`<tr><td style="font-weight:500">${r[0]}</td><td class="text-right">${r[1]}</td><td class="text-right">${r[2]}</td></tr>`;});
  showResults();}