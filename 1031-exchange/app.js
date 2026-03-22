/* ============================================================
   1031 Exchange Calculator — IntelliTC Solutions
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
  const salePrice=parseNum(document.getElementById('salePrice').value);
  const adjBasis=parseNum(document.getElementById('adjBasis').value);
  const sellCosts=parseNum(document.getElementById('sellCosts').value);
  const mortBal=parseNum(document.getElementById('mortBal').value);
  const replPrice=parseNum(document.getElementById('replPrice').value);
  const replMort=parseNum(document.getElementById('replMort').value);
  const replClosing=parseNum(document.getElementById('replClosing').value);
  const fedRate=parseNum(document.getElementById('fedRate').value)/100;
  const stateRate=parseNum(document.getElementById('stateRate').value)/100;
  const recapRate=parseNum(document.getElementById('recapRate').value)/100;
  const deprecTaken=parseNum(document.getElementById('deprecTaken').value);

  /* Net proceeds from sale */
  const netProceeds=salePrice-sellCosts-mortBal;

  /* Capital gain */
  const realizedGain=salePrice-sellCosts-adjBasis;
  const capitalGain=Math.max(0,realizedGain-deprecTaken);
  const recaptureGain=Math.min(deprecTaken,Math.max(0,realizedGain));

  /* Tax without exchange */
  const taxCapGains=capitalGain*(fedRate+stateRate);
  const taxRecapture=recaptureGain*recapRate;
  const totalTaxNoExchange=taxCapGains+taxRecapture;

  /* 1031 Exchange requirements */
  /* Must reinvest: price >= sale price, equity >= equity */
  const relinquishedEquity=salePrice-mortBal;
  const replacementEquity=replPrice-replMort;

  /* Boot = cash not reinvested + debt relief not replaced */
  const cashBoot=Math.max(0,netProceeds-(replPrice-replMort-replClosing));
  const debtBoot=Math.max(0,mortBal-replMort);
  const totalBoot=cashBoot+debtBoot;

  /* Tax on boot (proportional) */
  const gainPct=realizedGain>0?Math.min(totalBoot/realizedGain,1):0;
  const bootTax=totalBoot>0?gainPct*totalTaxNoExchange:0;

  /* Tax deferred */
  const taxDeferred=Math.max(0,totalTaxNoExchange-bootTax);

  /* Minimum replacement property price for full deferral */
  const minReplPrice=salePrice;
  const minReplEquity=relinquishedEquity;

  document.getElementById('kpiDeferred').textContent=formatCurrency(taxDeferred);
  document.getElementById('kpiDeferred').className='kpi-value kpi-positive';
  document.getElementById('kpiDeferredDetail').textContent='Saved vs '+formatCurrency(totalTaxNoExchange)+' total tax';
  document.getElementById('kpiGain').textContent=formatCurrency(realizedGain);
  document.getElementById('kpiGainDetail').textContent=formatCurrency(capitalGain)+' cap gains + '+formatCurrency(recaptureGain)+' recapture';
  document.getElementById('kpiBoot').textContent=formatCurrency(totalBoot);
  document.getElementById('kpiBoot').className='kpi-value '+(totalBoot<=0?'kpi-positive':'kpi-negative');
  document.getElementById('kpiBootDetail').textContent=totalBoot>0?'Boot tax: '+formatCurrency(bootTax):'No boot — full deferral!';
  document.getElementById('kpiMinReplace').textContent=formatCurrency(minReplPrice);
  document.getElementById('kpiMinReplaceDetail').textContent='Min equity: '+formatCurrency(minReplEquity);

  destroyCharts();const cs=getCS();

  /* Chart 1: Tax with vs without exchange */
  window.__charts.tax=new Chart(document.getElementById('chartTax'),{type:'bar',data:{
    labels:['Without 1031 Exchange','With 1031 Exchange'],
    datasets:[
      {label:'Capital Gains Tax',data:[Math.round(taxCapGains),Math.round(bootTax>0?gainPct*taxCapGains:0)],backgroundColor:cs.c2},
      {label:'Depreciation Recapture',data:[Math.round(taxRecapture),Math.round(bootTax>0?gainPct*taxRecapture:0)],backgroundColor:cs.c5}
    ]
  },options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins},scales:{x:{stacked:true,ticks:{color:cs.text},grid:{display:false}},y:{stacked:true,ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  /* Chart 2: Timeline — horizontal bar showing key dates */
  window.__charts.tl=new Chart(document.getElementById('chartTimeline'),{type:'bar',data:{
    labels:['Identification Period','Exchange Period'],
    datasets:[{data:[45,180],backgroundColor:[cs.c1,cs.c3]}]
  },options:{...chartOpts('','bar'),indexAxis:'y',plugins:{...chartOpts('','bar').plugins,legend:{display:false},tooltip:{callbacks:{label:function(item){return item.label+': '+item.raw+' days';}}}},scales:{x:{ticks:{color:cs.text,callback:v=>v+' days'},grid:{color:cs.grid}},y:{ticks:{color:cs.text},grid:{display:false}}}}});

  /* Chart 3: Reinvestment requirements */
  window.__charts.req=new Chart(document.getElementById('chartRequire'),{type:'bar',data:{
    labels:['Sale Price','Replacement Price','Relinquished Equity','Replacement Equity'],
    datasets:[
      {label:'Required',data:[salePrice,minReplPrice,relinquishedEquity,minReplEquity],backgroundColor:cs.c5},
      {label:'Actual',data:[salePrice,replPrice,relinquishedEquity,replacementEquity],backgroundColor:replPrice>=minReplPrice&&replacementEquity>=minReplEquity?cs.c1:cs.c2}
    ]
  },options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins},scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  /* Table: Full tax calculation */
  const tbody=document.getElementById('exchBody');tbody.innerHTML='';
  const trows=[
    ['Sale Price',formatCurrency(salePrice),'','highlight'],
    ['Less: Selling Costs','-'+formatCurrency(sellCosts),'',''],
    ['Net Sale Amount',formatCurrency(salePrice-sellCosts),'','highlight'],
    ['Less: Adjusted Basis','-'+formatCurrency(adjBasis),'Original cost + improvements − depreciation',''],
    ['Realized Gain',formatCurrency(realizedGain),'','highlight'],
    ['','','','divider'],
    ['Capital Gain (excl. recapture)',formatCurrency(capitalGain),'Taxed at '+formatPct((fedRate+stateRate)*100),''],
    ['Depreciation Recapture',formatCurrency(recaptureGain),'Taxed at '+formatPct(recapRate*100),''],
    ['Total Tax Without Exchange',formatCurrency(totalTaxNoExchange),'','highlight'],
    ['','','','divider'],
    ['Cash Boot',formatCurrency(cashBoot),'Cash not reinvested',''],
    ['Debt Boot',formatCurrency(debtBoot),'Mortgage relief not replaced',''],
    ['Total Boot',formatCurrency(totalBoot),'','highlight'],
    ['Tax on Boot',formatCurrency(bootTax),'',''],
    ['','','','divider'],
    ['Tax Deferred via 1031',formatCurrency(taxDeferred),'','total'],
    ['','','','divider'],
    ['Replacement Price Required','≥ '+formatCurrency(minReplPrice),'Must equal or exceed sale price',''],
    ['Replacement Equity Required','≥ '+formatCurrency(minReplEquity),'Must equal or exceed relinquished equity',''],
    ['Actual Replacement Price',formatCurrency(replPrice),replPrice>=minReplPrice?'✓ Meets requirement':'✗ Below minimum',''],
    ['Actual Replacement Equity',formatCurrency(replacementEquity),replacementEquity>=minReplEquity?'✓ Meets requirement':'✗ Below minimum','']
  ];
  trows.forEach(r=>{
    if(r[3]==='divider'){tbody.innerHTML+='<tr><td colspan="3" style="padding:0"><div style="border-top:1px solid var(--color-divider)"></div></td></tr>';return;}
    let style='';
    if(r[3]==='total')style='font-weight:700;border-top:2px solid var(--color-divider);color:var(--color-success);';
    else if(r[3]==='highlight')style='font-weight:600;';
    tbody.innerHTML+=`<tr style="${style}"><td>${r[0]}</td><td class="text-right">${r[1]}</td><td style="color:var(--color-text-muted);font-size:var(--text-sm)">${r[2]}</td></tr>`;
  });
  showResults();}