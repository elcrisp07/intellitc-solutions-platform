/* ============================================================
   Real Estate Investment Analyzer — IntelliTC Solutions
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
  const arv=parseNum(document.getElementById('arv').value);
  const repair=parseNum(document.getElementById('repairCosts').value);
  const dpPct=parseNum(document.getElementById('downPayment').value)/100;
  const rate=parseNum(document.getElementById('interestRate').value)/100;
  const term=parseNum(document.getElementById('loanTerm').value);
  const rent=parseNum(document.getElementById('monthlyRent').value);
  const vacPct=parseNum(document.getElementById('vacancyRate').value)/100;
  const taxRate=parseNum(document.getElementById('propertyTax').value)/100;
  const ins=parseNum(document.getElementById('insurance').value);
  const maintPct=parseNum(document.getElementById('maintenance').value)/100;
  const mgmtPct=parseNum(document.getElementById('management').value)/100;
  const appRate=parseNum(document.getElementById('appreciation').value)/100;
  const closePct=parseNum(document.getElementById('closingCosts').value)/100;
  const taxBracket=parseNum(document.getElementById('taxBracket').value)/100;

  // Mortgage calculation
  const loanAmt=pp*(1-dpPct);
  const mr=rate/12;
  const n=term*12;
  const mortPmt=mr>0?loanAmt*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):loanAmt/n;

  // Monthly expenses
  const vacLoss=rent*vacPct;
  const effRent=rent-vacLoss;
  const monthTax=pp*taxRate/12;
  const monthIns=ins/12;
  const monthMaint=pp*maintPct/12;
  const monthMgmt=rent*mgmtPct;
  const totalExp=monthTax+monthIns+monthMaint+monthMgmt;
  const noi=(effRent-totalExp)*12;
  const monthlyCF=effRent-totalExp-mortPmt;
  const annualCF=monthlyCF*12;

  // Cash invested
  const cashIn=pp*dpPct+repair+pp*closePct;
  const coc=cashIn>0?(annualCF/cashIn)*100:0;
  const capRate=(noi/pp)*100;

  // 5-year projections
  const years=[1,2,3,4,5];
  let balance=loanAmt;
  const data={cf:[],app:[],ppd:[],tax:[],lev:[],total:[],equity:[]};
  const depAnnual=(pp-pp*0.2)/27.5; // building only (80% of value) over 27.5 years

  let cumEquity=pp*dpPct+repair;
  for(let y=1;y<=5;y++){
    const yrCF=annualCF*Math.pow(1.02,y-1); // slight rent growth
    const propVal=pp*Math.pow(1+appRate,y);
    const appGain=propVal-pp*Math.pow(1+appRate,y-1);
    
    // Principal paydown this year
    let yrPPD=0;
    for(let m=0;m<12;m++){
      const intPmt=balance*mr;
      const prinPmt=mortPmt-intPmt;
      yrPPD+=prinPmt;
      balance-=prinPmt;
    }
    
    const taxBenefit=depAnnual*taxBracket;
    const leverage=(yrCF+appGain+yrPPD+taxBenefit)/cashIn*100;
    
    data.cf.push(Math.round(yrCF));
    data.app.push(Math.round(appGain));
    data.ppd.push(Math.round(yrPPD));
    data.tax.push(Math.round(taxBenefit));
    data.lev.push(Math.round(leverage));
    data.total.push(Math.round(yrCF+appGain+yrPPD+taxBenefit));
    cumEquity+=yrPPD+appGain;
    data.equity.push(Math.round(cumEquity));
  }

  const totalROI=data.total.reduce((a,b)=>a+b,0)/cashIn*100;

  // KPIs
  document.getElementById('kpiCashFlow').textContent=formatCurrency(monthlyCF);
  document.getElementById('kpiCashFlow').className='kpi-value '+(monthlyCF>=0?'kpi-positive':'kpi-negative');
  document.getElementById('kpiCashFlowDetail').textContent=formatCurrency(annualCF)+'/year';
  document.getElementById('kpiCoC').textContent=formatPct(coc);
  document.getElementById('kpiCoCDetail').textContent='On '+formatCurrency(cashIn)+' invested';
  document.getElementById('kpiCapRate').textContent=formatPct(capRate);
  document.getElementById('kpiCapRateDetail').textContent='NOI: '+formatCurrency(noi);
  document.getElementById('kpiTotalROI').textContent=formatPct(totalROI);
  document.getElementById('kpiTotalROIDetail').textContent='All 5 dimensions combined';

  // Charts
  destroyCharts();
  const cs=getCS();

  // Wealth accumulation stacked bar
  window.__charts.wealth=new Chart(document.getElementById('chartWealth'),{
    type:'bar',
    data:{
      labels:years.map(y=>'Year '+y),
      datasets:[
        {label:'Cash Flow',data:data.cf,backgroundColor:cs.c1},
        {label:'Appreciation',data:data.app,backgroundColor:cs.c2},
        {label:'Principal Paydown',data:data.ppd,backgroundColor:cs.c3},
        {label:'Tax Benefits',data:data.tax,backgroundColor:cs.c6},
      ]
    },
    options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:true,labels:{color:cs.text,font:{family:'DM Sans'}}}},scales:{x:{stacked:true,ticks:{color:cs.text},grid:{color:cs.grid}},y:{stacked:true,ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}
  });

  // Waterfall
  const wfLabels=['Gross Rent','Vacancy','Taxes','Insurance','Maintenance','Management','Mortgage','Net Cash Flow'];
  const wfVals=[rent, -vacLoss, -monthTax, -monthIns, -monthMaint, -monthMgmt, -mortPmt, monthlyCF];
  let running=0;
  const wfBase=[], wfPos=[], wfNeg=[];
  for(let i=0;i<wfVals.length;i++){
    if(i===wfVals.length-1){wfBase.push(0);wfPos.push(Math.max(0,monthlyCF));wfNeg.push(Math.min(0,monthlyCF));}
    else if(wfVals[i]>=0){wfBase.push(running);wfPos.push(wfVals[i]);wfNeg.push(0);running+=wfVals[i];}
    else{running+=wfVals[i];wfBase.push(running);wfPos.push(0);wfNeg.push(-wfVals[i]);}
  }
  window.__charts.waterfall=new Chart(document.getElementById('chartWaterfall'),{
    type:'bar',
    data:{
      labels:wfLabels,
      datasets:[
        {label:'Base',data:wfBase,backgroundColor:'transparent',borderWidth:0},
        {label:'Income',data:wfPos,backgroundColor:cs.c1},
        {label:'Expense',data:wfNeg,backgroundColor:cs.c2},
      ]
    },
    options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{x:{stacked:true,ticks:{color:cs.text},grid:{display:false}},y:{stacked:true,ticks:{color:cs.text,callback:v=>'$'+v.toLocaleString()},grid:{color:cs.grid}}}}
  });

  // Equity line
  window.__charts.equity=new Chart(document.getElementById('chartEquity'),{
    type:'line',
    data:{
      labels:years.map(y=>'Year '+y),
      datasets:[{label:'Total Equity',data:data.equity,borderColor:cs.c1,backgroundColor:cs.c1+'20',fill:true,tension:0.3}]
    },
    options:{...chartOpts('','line'),plugins:{...chartOpts('','line').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text},grid:{color:cs.grid}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}
  });

  // Table
  const tbody=document.getElementById('yearTableBody');
  tbody.innerHTML='';
  for(let i=0;i<5;i++){
    tbody.innerHTML+=`<tr><td>Year ${i+1}</td><td class="text-right">${formatCurrency(data.cf[i])}</td><td class="text-right">${formatCurrency(data.app[i])}</td><td class="text-right">${formatCurrency(data.ppd[i])}</td><td class="text-right">${formatCurrency(data.tax[i])}</td><td class="text-right">${formatPct(data.lev[i])}</td><td class="text-right highlight">${formatCurrency(data.total[i])}</td></tr>`;
  }
  const totals=data.total.reduce((a,b)=>a+b,0);
  tbody.innerHTML+=`<tr style="font-weight:700;border-top:2px solid var(--color-divider)"><td>5-Year Total</td><td class="text-right">${formatCurrency(data.cf.reduce((a,b)=>a+b,0))}</td><td class="text-right">${formatCurrency(data.app.reduce((a,b)=>a+b,0))}</td><td class="text-right">${formatCurrency(data.ppd.reduce((a,b)=>a+b,0))}</td><td class="text-right">${formatCurrency(data.tax.reduce((a,b)=>a+b,0))}</td><td class="text-right">—</td><td class="text-right highlight">${formatCurrency(totals)}</td></tr>`;

  showResults();
}

function onThemeChange(){if(window.__lastData)calculate();}
