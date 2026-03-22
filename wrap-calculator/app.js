/* ============================================================
   Wrap Mortgage Calculator — IntelliTC Solutions
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
  const existBal=parseNum(document.getElementById('existBal').value);
  const existRate=parseNum(document.getElementById('existRate').value)/100;
  const existPmt=parseNum(document.getElementById('existPmt').value);
  const existTerm=parseNum(document.getElementById('existTerm').value);
  const propValue=parseNum(document.getElementById('propValue').value);
  const wrapPrice=parseNum(document.getElementById('wrapPrice').value);
  const buyerDP=parseNum(document.getElementById('buyerDP').value);
  const wrapRate=parseNum(document.getElementById('wrapRate').value)/100;
  const wrapTerm=parseNum(document.getElementById('wrapTerm').value);
  const rent=parseNum(document.getElementById('monthlyRent').value);

  /* Wrap note amount */
  const wrapNote=wrapPrice-buyerDP;

  /* Wrap payment (standard amortization) */
  const wmr=wrapRate/12;const wn=wrapTerm*12;
  const wrapPmt=wmr>0?wrapNote*(wmr*Math.pow(1+wmr,wn))/(Math.pow(1+wmr,wn)-1):wrapNote/wn;

  /* Use stated existing payment */
  const existingPmt=existPmt;

  /* Monthly & annual spread */
  const monthlySpread=wrapPmt-existingPmt;
  const annualSpread=monthlySpread*12;

  /* Seller equity captured */
  const equityCaptured=wrapPrice-existBal;

  /* Conventional comparison: what buyer would pay at 7.5% on same note amount, 30yr */
  const convRate=0.075;const cmr=convRate/12;const cn=30*12;
  const convPmt=cmr>0?wrapNote*(cmr*Math.pow(1+cmr,cn))/(Math.pow(1+cmr,cn)-1):wrapNote/cn;
  const buyerSavings=(convPmt-wrapPmt)*12;

  /* Subject-To comparison: buyer takes over existing mtg, pays seller equity as DP */
  const subToPmt=existingPmt;
  const subToDP=wrapPrice-existBal;

  /* KPIs */
  document.getElementById('kpiSpread').textContent=formatCurrency(monthlySpread);
  document.getElementById('kpiSpread').className='kpi-value '+(monthlySpread>=0?'kpi-positive':'kpi-negative');
  document.getElementById('kpiSpreadDetail').textContent=formatCurrency(wrapPmt)+' collected - '+formatCurrency(existingPmt)+' paid out';

  document.getElementById('kpiAnnualSpread').textContent=formatCurrency(annualSpread);
  document.getElementById('kpiAnnualSpreadDetail').textContent='Passive income from spread';

  document.getElementById('kpiEquityCaptured').textContent=formatCurrency(equityCaptured);
  document.getElementById('kpiEquityCapturedDetail').textContent=formatPct(propValue>0?equityCaptured/propValue*100:0)+' of property value';

  document.getElementById('kpiBuyerSavings').textContent=formatCurrency(buyerSavings);
  document.getElementById('kpiBuyerSavings').className='kpi-value '+(buyerSavings>=0?'kpi-positive':'kpi-negative');
  document.getElementById('kpiBuyerSavingsDetail').textContent='Annual savings vs 7.5% conventional';

  destroyCharts();const cs=getCS();

  /* Chart 1: Payment Flow — stacked bar showing buyer payment breakdown */
  window.__charts.flow=new Chart(document.getElementById('chartFlow'),{type:'bar',
    data:{
      labels:['Buyer Payment','Seller Keeps','Underlying Mortgage'],
      datasets:[{
        label:'Amount',
        data:[wrapPmt,monthlySpread,existingPmt],
        backgroundColor:[cs.c1,cs.c3,cs.c2]
      }]
    },
    options:{...chartOpts('Monthly Payment Flow ($)','bar'),
      plugins:{...chartOpts('','bar').plugins,legend:{display:false}},
      scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}
    }
  });

  /* Chart 2: Wrap vs Conventional — buyer comparison */
  const wrapTotalPaid=wrapPmt*wn;
  const convTotalPaid=convPmt*cn;
  const wrapTotalInt=wrapTotalPaid-wrapNote;
  const convTotalInt=convTotalPaid-wrapNote;
  window.__charts.compare=new Chart(document.getElementById('chartCompare'),{type:'bar',
    data:{
      labels:['Monthly Payment','Total Interest','Total Paid'],
      datasets:[
        {label:'Wrap Mortgage',data:[wrapPmt,wrapTotalInt,wrapTotalPaid],backgroundColor:cs.c1},
        {label:'Conventional 7.5%',data:[convPmt,convTotalInt,convTotalPaid],backgroundColor:cs.c2}
      ]
    },
    options:{...chartOpts('Buyer: Wrap vs Conventional','bar'),
      scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}
    }
  });

  /* Comparison Table: Wrap vs Conventional vs Subject-To */
  const tbody=document.getElementById('wrapBody');tbody.innerHTML='';
  const rows=[
    ['Sale Price',formatCurrency(wrapPrice),formatCurrency(wrapPrice),formatCurrency(wrapPrice)],
    ['Down Payment',formatCurrency(buyerDP),formatCurrency(wrapNote*0.2),'Seller equity: '+formatCurrency(subToDP)],
    ['Loan/Note Amount',formatCurrency(wrapNote),formatCurrency(wrapNote),formatCurrency(existBal)],
    ['Interest Rate',formatPct(wrapRate*100),formatPct(convRate*100),formatPct(existRate*100)],
    ['Term',wrapTerm+' yrs','30 yrs',existTerm+' yrs remaining'],
    ['Monthly Payment',formatCurrency(wrapPmt),formatCurrency(convPmt),formatCurrency(subToPmt)],
    ['Total Interest',formatCurrency(wrapTotalInt),formatCurrency(convTotalInt),'Existing note interest'],
    ['Seller Spread/mo','N/A (buyer view)','N/A',formatCurrency(0)],
  ];
  rows.forEach(r=>{tbody.innerHTML+=`<tr><td>${r[0]}</td><td class="text-right">${r[1]}</td><td class="text-right">${r[2]}</td><td class="text-right">${r[3]}</td></tr>`;});
  tbody.innerHTML+=`<tr style="font-weight:700;border-top:2px solid var(--color-divider)"><td>Buyer Annual Cost</td><td class="text-right highlight">${formatCurrency(wrapPmt*12)}</td><td class="text-right">${formatCurrency(convPmt*12)}</td><td class="text-right">${formatCurrency(subToPmt*12)}</td></tr>`;

  showResults();
}