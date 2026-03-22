/* ============================================================
   DSCR Loan Calculator — IntelliTC Solutions
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
  const grossRent=parseNum(document.getElementById('grossRent').value);
  const vacPct=parseNum(document.getElementById('vacancy').value)/100;
  const taxes=parseNum(document.getElementById('taxes').value);
  const insurance=parseNum(document.getElementById('insurance').value);
  const hoa=parseNum(document.getElementById('hoa').value);
  const mgmtPct=parseNum(document.getElementById('mgmt').value)/100;
  const loanAmt=parseNum(document.getElementById('loanAmt').value);
  const rate=parseNum(document.getElementById('rate').value)/100;
  const term=parseNum(document.getElementById('term').value);
  const minDSCR=parseNum(document.getElementById('minDSCR').value);

  const grossAnnual=grossRent*12;
  const vacLoss=grossAnnual*vacPct;
  const egi=grossAnnual-vacLoss;
  const mgmtCost=egi*mgmtPct;
  const totalOpex=taxes+insurance+hoa*12+mgmtCost;
  const noi=egi-totalOpex;

  const mr=rate/12;const n=term*12;
  const pmt=mr>0?loanAmt*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):loanAmt/n;
  const annualDebt=pmt*12;
  const dscr=annualDebt>0?noi/annualDebt:0;

  // Binary search for max loan at minDSCR
  let lo=0,hi=loanAmt*3;
  for(let i=0;i<50;i++){
    const mid=(lo+hi)/2;
    const mp=mr>0?mid*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):mid/n;
    const ds=mp*12;
    const d=ds>0?noi/ds:999;
    if(d>=minDSCR) lo=mid; else hi=mid;
  }
  const maxLoan=Math.round(lo);

  const qualified=dscr>=minDSCR;
  document.getElementById('kpiDSCR').textContent=dscr.toFixed(2)+'x';
  document.getElementById('kpiDSCR').className='kpi-value '+(dscr>=minDSCR?'kpi-positive':dscr>=1.0?'':'kpi-negative');
  document.getElementById('kpiDSCRDetail').textContent=dscr>=minDSCR?'Meets '+minDSCR+'x requirement':'Below '+minDSCR+'x minimum';
  document.getElementById('kpiMaxLoan').textContent=formatCurrency(maxLoan);
  document.getElementById('kpiMaxLoanDetail').textContent='At '+minDSCR+'x DSCR, '+formatPct(rate*100)+' rate';
  document.getElementById('kpiNOI').textContent=formatCurrency(noi);
  document.getElementById('kpiNOIDetail').textContent=formatCurrency(noi/12)+'/month';
  document.getElementById('kpiQualify').textContent=qualified?'QUALIFIED':'NOT QUALIFIED';
  document.getElementById('kpiQualify').className='kpi-value '+(qualified?'kpi-positive':'kpi-negative');
  document.getElementById('kpiQualifyDetail').textContent=qualified?'DSCR exceeds minimum':'DSCR below lender requirement';

  destroyCharts();const cs=getCS();
  // DSCR sensitivity by rate
  const rates=[5,5.5,6,6.5,7,7.5,8,8.5,9,9.5];
  const dscrByRate=rates.map(r=>{
    const rmr=r/100/12;
    const rp=rmr>0?loanAmt*(rmr*Math.pow(1+rmr,n))/(Math.pow(1+rmr,n)-1):loanAmt/n;
    return noi/(rp*12);
  });
  window.__charts.dscr=new Chart(document.getElementById('chartDSCR'),{type:'bar',
    data:{labels:rates.map(r=>r+'%'),datasets:[{label:'DSCR',data:dscrByRate.map(d=>+d.toFixed(2)),backgroundColor:dscrByRate.map(d=>d>=minDSCR?cs.c1:cs.c2)}]},
    options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},
      scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>v.toFixed(1)+'x'},grid:{color:cs.grid}}}}});

  // Income vs Expenses donut
  window.__charts.bd=new Chart(document.getElementById('chartBreakdown'),{type:'doughnut',
    data:{labels:['Vacancy','Taxes','Insurance','HOA','Management','Debt Service','Net Cash Flow'].filter((_,i)=>[vacLoss,taxes,insurance,hoa*12,mgmtCost,annualDebt,noi-annualDebt][i]>0),
      datasets:[{data:[vacLoss,taxes,insurance,hoa*12,mgmtCost,annualDebt,Math.max(0,noi-annualDebt)].filter(v=>v>0),
        backgroundColor:[cs.c5,cs.c2,cs.c6,cs.c4,cs.c3,cs.c2,cs.c1].slice(0,[vacLoss,taxes,insurance,hoa*12,mgmtCost,annualDebt,Math.max(0,noi-annualDebt)].filter(v=>v>0).length)}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{color:cs.text}}}}});

  // Table
  const tbody=document.getElementById('dscrBody');tbody.innerHTML='';
  const items=[
    ['Gross Rental Income',formatCurrency(grossAnnual),'100%','highlight'],
    ['Less: Vacancy','-'+formatCurrency(vacLoss),formatPct(vacPct*100),''],
    ['Effective Gross Income',formatCurrency(egi),'','highlight'],
    ['Property Taxes','-'+formatCurrency(taxes),'',''],
    ['Insurance','-'+formatCurrency(insurance),'',''],
    ['HOA','-'+formatCurrency(hoa*12),'',''],
    ['Management','-'+formatCurrency(mgmtCost),formatPct(mgmtPct*100),''],
    ['Net Operating Income (NOI)',formatCurrency(noi),'','highlight'],
    ['Annual Debt Service','-'+formatCurrency(annualDebt),'',''],
    ['DSCR (NOI / Debt Service)',dscr.toFixed(2)+'x','Min: '+minDSCR+'x',dscr>=minDSCR?'pass':'fail']
  ];
  items.forEach(r=>{
    let style='';
    if(r[3]==='highlight')style='font-weight:600;';
    if(r[3]==='pass')style='font-weight:700;color:var(--color-success);';
    if(r[3]==='fail')style='font-weight:700;color:var(--color-error);';
    tbody.innerHTML+=`<tr style="${style}"><td>${r[0]}</td><td class="text-right">${r[1]}</td><td class="text-right">${r[2]}</td></tr>`;
  });
  showResults();}