/* ============================================================
   Cash-to-Close Calculator — IntelliTC Solutions
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
  const price=parseNum(document.getElementById('price').value);
  const dpSel=document.getElementById('dpPctSel').value;
  const dpOverride=parseNum(document.getElementById('dpDollar').value);
  const closingPct=parseNum(document.getElementById('closingPct').value)/100;
  const lenderFees=parseNum(document.getElementById('lenderFees').value);
  const titleEscrow=parseNum(document.getElementById('titleEscrow').value);
  const appraisal=parseNum(document.getElementById('appraisal').value);
  const inspection=parseNum(document.getElementById('inspection').value);
  const prepaidDays=parseNum(document.getElementById('prepaidDays').value);
  const insYr=parseNum(document.getElementById('insYr').value);
  const escrowMonths=parseNum(document.getElementById('escrowMonths').value);
  const taxRate=parseNum(document.getElementById('taxRate').value)/100;
  const earnest=parseNum(document.getElementById('earnest').value);
  const moving=parseNum(document.getElementById('moving').value);
  const furniture=parseNum(document.getElementById('furniture').value);

  /* Down payment */
  let dpPct=parseFloat(dpSel)/100;
  if(dpSel==='other'||dpOverride>0){
    dpPct=dpOverride>0?dpOverride/price:dpPct;
  }
  const downPayment=dpOverride>0?dpOverride:Math.round(price*dpPct);

  /* Closing costs */
  const closingBase=price*closingPct;
  const closingTotal=closingBase+lenderFees+titleEscrow+appraisal+inspection;

  /* Pre-paids */
  const loanAmt=price-downPayment;
  const assumedRate=0.07;
  const prepaidInterest=loanAmt*assumedRate/365*prepaidDays;
  const taxEscrow=price*taxRate/12*escrowMonths;
  const insurancePrepaid=insYr;

  /* Total */
  const totalPrepaids=prepaidInterest+taxEscrow+insurancePrepaid;
  const totalBeforeCredits=downPayment+closingTotal+totalPrepaids+moving+furniture;
  const totalCashToClose=totalBeforeCredits-earnest;

  /* Recommended reserves = 3 months PITI */
  const mr=assumedRate/12;const n=360;
  const pi=mr>0?loanAmt*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):loanAmt/n;
  const monthlyPITI=pi+price*taxRate/12+insYr/12;
  const reserves=monthlyPITI*3;

  document.getElementById('kpiTotal').textContent=formatCurrency(totalCashToClose);
  document.getElementById('kpiTotalDetail').textContent='After '+formatCurrency(earnest)+' earnest money credit';
  document.getElementById('kpiDP').textContent=formatCurrency(downPayment);
  document.getElementById('kpiDPDetail').textContent=formatPct(dpPct*100)+' of '+formatCurrency(price);
  document.getElementById('kpiClosing').textContent=formatCurrency(closingTotal);
  document.getElementById('kpiClosingDetail').textContent=formatPct(closingTotal/price*100)+' of purchase price';
  document.getElementById('kpiReserves').textContent=formatCurrency(reserves);
  document.getElementById('kpiReservesDetail').textContent='3 months of PITI ('+formatCurrency(monthlyPITI)+'/mo)';

  destroyCharts();const cs=getCS();

  /* Chart 1: Doughnut breakdown */
  const parts=[downPayment,closingBase,lenderFees+titleEscrow,appraisal+inspection,prepaidInterest,taxEscrow,insurancePrepaid,moving,furniture].filter(v=>v>0);
  const labels=['Down Payment','Closing Costs (%)','Lender/Title Fees','Appraisal/Inspection','Pre-paid Interest','Tax Escrow','Insurance (1st yr)','Moving','Furniture/Repairs'].filter((_,i)=>[downPayment,closingBase,lenderFees+titleEscrow,appraisal+inspection,prepaidInterest,taxEscrow,insurancePrepaid,moving,furniture][i]>0);
  const colors=[cs.c1,cs.c2,cs.c3,cs.c4,cs.c5,cs.c6,cs.c7,cs.c8,cs.c1];
  window.__charts.bd=new Chart(document.getElementById('chartBreakdown'),{type:'doughnut',data:{
    labels:labels,datasets:[{data:parts,backgroundColor:colors.slice(0,parts.length)}]
  },options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{color:cs.text,font:{size:11}}}}}});

  /* Chart 2: DP comparison bar */
  const dpLevels=[3.5,5,10,20];
  const dpData=dpLevels.map(pct=>{
    const dp=price*pct/100;
    const ln=price-dp;
    const cl=price*closingPct+lenderFees+titleEscrow+appraisal+inspection;
    const pp=ln*assumedRate/365*prepaidDays+taxEscrow+insurancePrepaid;
    return Math.round(dp+cl+pp+moving+furniture-earnest);
  });
  window.__charts.comp=new Chart(document.getElementById('chartCompare'),{type:'bar',data:{
    labels:dpLevels.map(p=>p+'% Down'),
    datasets:[{label:'Total Cash Needed',data:dpData,backgroundColor:dpLevels.map(p=>Math.abs(p-dpPct*100)<0.5?cs.c1:cs.c3)}]
  },options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  /* Table */
  const tbody=document.getElementById('closeBody');tbody.innerHTML='';
  const rows=[
    ['Down Payment ('+formatPct(dpPct*100)+')',formatCurrency(downPayment),'Applied toward purchase'],
    ['Closing Costs ('+formatPct(closingPct*100)+')',formatCurrency(closingBase),'Percentage-based costs'],
    ['Lender Fees',formatCurrency(lenderFees),'Origination & underwriting'],
    ['Title & Escrow',formatCurrency(titleEscrow),'Title search & insurance'],
    ['Appraisal',formatCurrency(appraisal),'Required by lender'],
    ['Home Inspection',formatCurrency(inspection),'Recommended'],
    ['Pre-paid Interest ('+prepaidDays+' days)',formatCurrency(prepaidInterest),'Interest until first payment'],
    ['Tax Escrow ('+escrowMonths+' months)',formatCurrency(taxEscrow),'Reserve held by lender'],
    ['Homeowners Insurance (1st yr)',formatCurrency(insurancePrepaid),'Paid upfront at closing'],
    ['Moving Budget',formatCurrency(moving),''],
    ['Furniture & Repairs Reserve',formatCurrency(furniture),''],
    ['Less: Earnest Money Deposit','-'+formatCurrency(earnest),'Already deposited']
  ];
  let runningTotal=0;
  rows.forEach((r,i)=>{
    const amt=i===rows.length-1?-earnest:[downPayment,closingBase,lenderFees,titleEscrow,appraisal,inspection,prepaidInterest,taxEscrow,insurancePrepaid,moving,furniture][i];
    runningTotal+=amt;
    tbody.innerHTML+='<tr><td>'+r[0]+'</td><td class="text-right">'+r[1]+'</td><td style="color:var(--color-text-muted);font-size:var(--text-sm)">'+r[2]+'</td></tr>';
  });
  tbody.innerHTML+='<tr style="font-weight:700;border-top:2px solid var(--color-divider)"><td>Total Cash to Close</td><td class="text-right highlight">'+formatCurrency(totalCashToClose)+'</td><td></td></tr>';
  showResults();}