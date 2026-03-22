/* ============================================================
   IUL + Real Estate Portfolio Analyzer — IntelliTC Solutions
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
  const premium=parseNum(document.getElementById('premium').value);
  const iulTerm=parseNum(document.getElementById('iulTerm').value);
  const capRate=parseNum(document.getElementById('capRate').value)/100;
  const floorRate=parseNum(document.getElementById('floorRate').value)/100;
  const avgReturn=parseNum(document.getElementById('avgReturn').value)/100;
  const reValue=parseNum(document.getElementById('reValue').value);
  const reCashFlow=parseNum(document.getElementById('reCashFlow').value);
  const reApp=parseNum(document.getElementById('reAppreciation').value)/100;
  const age=parseNum(document.getElementById('age').value);

  // IUL modeling: cash value grows at avg return, capped at cap rate, floored at floor rate
  const effectiveRate=Math.min(Math.max(avgReturn,floorRate),capRate);
  const costOfInsurance=0.015; // ~1.5% annual COI deduction
  const netRate=effectiveRate-costOfInsurance;

  const years=[];const iulValues=[];const reValues=[];const combinedValues=[];
  let iulCV=0;let reVal=reValue;let reCF=reCashFlow;let totalRECashFlow=0;

  for(let y=1;y<=iulTerm;y++){
    // IUL: add premium, grow by net rate
    iulCV=(iulCV+premium)*(1+netRate);
    // RE: appreciate value, accumulate cash flow (reinvested at 5%)
    reVal=reVal*(1+reApp);
    totalRECashFlow+=reCF;
    reCF=reCashFlow*Math.pow(1.03,y); // 3% rent growth

    years.push(y);
    iulValues.push(Math.round(iulCV));
    reValues.push(Math.round(reVal+totalRECashFlow));
    combinedValues.push(Math.round(iulCV+reVal+totalRECashFlow));
  }

  const finalIUL=iulCV;
  const finalRE=reVal+totalRECashFlow;
  const combinedNW=finalIUL+finalRE;
  // Tax-free income: ~4-5% withdrawal from IUL cash value via policy loans
  const taxFreeIncome=finalIUL*0.045;
  // Legacy: death benefit typically 2-3x cash value in early years, converges later
  const legacyValue=finalIUL*1.5;

  document.getElementById('kpiCombinedNW').textContent=formatCurrency(combinedNW);
  document.getElementById('kpiCombinedNWDetail').textContent='After '+iulTerm+' years (age '+(age+iulTerm)+')';
  document.getElementById('kpiIULCash').textContent=formatCurrency(finalIUL);
  document.getElementById('kpiIULCashDetail').textContent=formatCurrency(premium*iulTerm)+' total premiums paid';
  document.getElementById('kpiTaxFree').textContent=formatCurrency(taxFreeIncome);
  document.getElementById('kpiTaxFreeDetail').textContent='Annual tax-free via policy loans';
  document.getElementById('kpiLegacy').textContent=formatCurrency(legacyValue);
  document.getElementById('kpiLegacyDetail').textContent='Estimated death benefit';

  destroyCharts();const cs=getCS();

  // Combined Wealth Growth stacked area
  window.__charts.wealth=new Chart(document.getElementById('chartWealth'),{type:'line',
    data:{labels:years.map(y=>'Year '+y),
      datasets:[
        {label:'IUL Cash Value',data:iulValues,borderColor:cs.c1,backgroundColor:cs.c1+'33',fill:true,tension:0.3,pointRadius:0},
        {label:'RE Equity + Cash Flow',data:reValues,borderColor:cs.c3,backgroundColor:cs.c3+'33',fill:true,tension:0.3,pointRadius:0}
      ]},
    options:{...chartOpts('','line'),plugins:{...chartOpts('','line').plugins},scales:{x:{ticks:{color:cs.text,maxTicksLimit:10},grid:{display:false}},y:{stacked:true,ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  // Year-by-Year Projection line
  window.__charts.proj=new Chart(document.getElementById('chartProjection'),{type:'line',
    data:{labels:years.map(y=>'Year '+y),
      datasets:[
        {label:'IUL Cash Value',data:iulValues,borderColor:cs.c1,tension:0.3,pointRadius:2,pointHoverRadius:5},
        {label:'RE Value',data:reValues,borderColor:cs.c3,tension:0.3,pointRadius:2,pointHoverRadius:5},
        {label:'Combined',data:combinedValues,borderColor:cs.c2,borderDash:[5,3],tension:0.3,pointRadius:0}
      ]},
    options:{...chartOpts('','line'),plugins:{...chartOpts('','line').plugins},scales:{x:{ticks:{color:cs.text,maxTicksLimit:10},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  showResults();}