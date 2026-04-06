/* ============================================================
   BRRRR Strategy Calculator — IntelliTC Solutions
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
  const pp=parseNum(document.getElementById('purchasePrice').value);
  const rehab=parseNum(document.getElementById('rehabCosts').value);
  const arv=parseNum(document.getElementById('arv').value);
  const dpPct=parseNum(document.getElementById('purchaseDP').value)/100;
  const closePct=parseNum(document.getElementById('closingCosts').value)/100;
  const holdMo=parseNum(document.getElementById('holdMonths').value);
  const holdCost=parseNum(document.getElementById('holdCostMo').value);
  const refiLTV=parseNum(document.getElementById('refiLTV').value)/100;
  const refiRate=parseNum(document.getElementById('refiRate').value)/100;
  const refiTerm=parseNum(document.getElementById('refiTerm').value);
  const refiClosePct=parseNum(document.getElementById('refiCosts').value)/100;
  const rent=parseNum(document.getElementById('monthlyRent').value);
  const vacPct=parseNum(document.getElementById('vacancy').value)/100;
  const expPct=parseNum(document.getElementById('expenses').value)/100;

  // Phase 1: Buy
  const downPmt=pp*dpPct;
  const buyClose=pp*closePct;
  const origLoan=pp*(1-dpPct);

  // Phase 2: Rehab
  const holdTotal=holdMo*holdCost;
  const totalInvested=downPmt+buyClose+rehab+holdTotal;

  // Phase 3: Rent (projected)
  const effRent=rent*(1-vacPct);
  const opExp=effRent*expPct;

  // Phase 4: Refinance
  const newLoan=arv*refiLTV;
  const refiClose=newLoan*refiClosePct;
  const cashOut=newLoan-origLoan-refiClose;
  const cashLeft=totalInvested-cashOut;

  // New mortgage payment
  const mr=refiRate/12;const n=refiTerm*12;
  const newPmt=mr>0?newLoan*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):newLoan/n;

  const monthlyCF=effRent-opExp-newPmt;
  const annualCF=monthlyCF*12;
  const coc=cashLeft>0?(annualCF/cashLeft)*100:Infinity;
  const infinite=cashLeft<=0;
  const equity=arv-newLoan;

  // KPIs
  document.getElementById('kpiCashLeft').textContent=infinite?formatCurrency(0):formatCurrency(cashLeft);
  document.getElementById('kpiCashLeftDetail').textContent=infinite?'All cash recovered!':'Of '+formatCurrency(totalInvested)+' invested';
  document.getElementById('kpiCashLeft').className='kpi-value '+(infinite||cashLeft<totalInvested*0.5?'kpi-positive':'');
  document.getElementById('kpiCashFlow').textContent=formatCurrency(monthlyCF);
  document.getElementById('kpiCashFlow').className='kpi-value '+(monthlyCF>=0?'kpi-positive':'kpi-negative');
  document.getElementById('kpiCashFlowDetail').textContent=formatCurrency(annualCF)+'/year';
  document.getElementById('kpiCoC').textContent=infinite?'∞':formatPct(coc);
  document.getElementById('kpiCoCDetail').textContent=infinite?'Infinite return achieved':'On remaining cash';
  document.getElementById('kpiInfinite').textContent=infinite?'YES':'NO';
  document.getElementById('kpiInfinite').className='kpi-value '+(infinite?'kpi-positive':'');
  document.getElementById('kpiInfiniteDetail').textContent=infinite?'Cash left ≤ $0':'Cash still in deal: '+formatCurrency(cashLeft);

  destroyCharts();const cs=getCS();

  // Phase waterfall
  window.__charts.phases=new Chart(document.getElementById('chartPhases'),{
    type:'bar',
    data:{labels:['Down Payment','Closing','Rehab','Holding','Total Invested','Cash Out','Cash Left'],
      datasets:[
        {label:'Cost',data:[downPmt,buyClose,rehab,holdTotal,0,0,0],backgroundColor:cs.c2},
        {label:'Total/Recovery',data:[0,0,0,0,totalInvested,cashOut,Math.max(0,cashLeft)],backgroundColor:[,,,,cs.c3,cs.c1,cashLeft<=0?cs.c1:cs.c5]},
      ]
    },
    options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}
  });

  // Equity
  window.__charts.equity=new Chart(document.getElementById('chartEquity'),{
    type:'bar',data:{labels:['Property Value'],datasets:[
      {label:'Loan Balance',data:[newLoan],backgroundColor:cs.c2},
      {label:'Your Equity',data:[equity],backgroundColor:cs.c1},
    ]},
    options:{...chartOpts('','bar'),indexAxis:'y',plugins:{...chartOpts('','bar').plugins,legend:{display:true,labels:{color:cs.text}}},scales:{x:{stacked:true,ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}},y:{stacked:true,ticks:{color:cs.text},grid:{display:false}}}}
  });

  // Cash flow projection
  const cfYears=[];for(let y=1;y<=5;y++)cfYears.push(monthlyCF*Math.pow(1.03,y-1));
  window.__charts.cf=new Chart(document.getElementById('chartCF'),{
    type:'line',data:{labels:['Year 1','Year 2','Year 3','Year 4','Year 5'],
      datasets:[{label:'Monthly Cash Flow',data:cfYears,borderColor:cs.c1,backgroundColor:cs.c1+'20',fill:true,tension:0.3}]},
    options:{...chartOpts('','line'),plugins:{...chartOpts('','line').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text},grid:{color:cs.grid}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}
  });

  // Phase table
  const tbody=document.getElementById('phaseBody');
  tbody.innerHTML='';
  const phases=[
    ['1. BUY','',''],
    ['Down Payment',formatCurrency(downPmt),'Purchase price × '+dpPct*100+'%'],
    ['Closing Costs',formatCurrency(buyClose),'Purchase closing costs'],
    ['2. REHAB','',''],
    ['Renovation',formatCurrency(rehab),'Total rehab budget'],
    ['Holding Costs',formatCurrency(holdTotal),holdMo+' months × '+formatCurrency(holdCost)+'/mo'],
    ['3. TOTAL INVESTED',formatCurrency(totalInvested),'All cash into the deal'],
    ['4. REFINANCE','',''],
    ['New Loan',formatCurrency(newLoan),'ARV × '+refiLTV*100+'% LTV'],
    ['Pay Off Original','-'+formatCurrency(origLoan),'Original loan balance'],
    ['Refi Closing','-'+formatCurrency(refiClose),'Refinance closing costs'],
    ['Cash Out',formatCurrency(cashOut),'Cash returned to you'],
    ['5. RESULT','',''],
    ['Cash Left in Deal',formatCurrency(Math.max(0,cashLeft)),infinite?'INFINITE RETURN':'Remaining investment'],
    ['Monthly Cash Flow',formatCurrency(monthlyCF),'After refi payment + expenses'],
    ['Equity',formatCurrency(equity),'ARV minus new loan'],
  ];
  phases.forEach(([label,amt,desc])=>{
    const isHeader=/^\d\./.test(label);
    tbody.innerHTML+=`<tr style="${isHeader?'background:var(--color-surface-offset);font-weight:700':''}">`+
      `<td>${label}</td><td class="text-right">${amt}</td><td>${desc}</td></tr>`;
  });
  showResults();
}
