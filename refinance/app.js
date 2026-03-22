/* ============================================================
   Refinance Analyzer — IntelliTC Solutions
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
  const curBal=parseNum(document.getElementById('curBal').value);
  const curRate=parseNum(document.getElementById('curRate').value)/100;
  const curTerm=parseNum(document.getElementById('curTerm').value);
  const curPmt=parseNum(document.getElementById('curPmt').value);
  const newRate=parseNum(document.getElementById('newRate').value)/100;
  const newTerm=parseNum(document.getElementById('newTerm').value);
  const newClosing=parseNum(document.getElementById('newClosing').value);
  const cashOut=parseNum(document.getElementById('cashOut').value);

  const newLoan=curBal+cashOut;
  const nmr=newRate/12;const nn=newTerm*12;
  const newPmt=nmr>0?newLoan*(nmr*Math.pow(1+nmr,nn))/(Math.pow(1+nmr,nn)-1):newLoan/nn;
  const monthlySave=curPmt-newPmt;

  // Break-even months
  let breakEvenMo=0;
  if(monthlySave>0){breakEvenMo=Math.ceil(newClosing/monthlySave);}

  // Lifetime savings = total remaining current payments - total new payments - closing costs
  const totalCurRemaining=curPmt*curTerm*12;
  const totalNewPayments=newPmt*newTerm*12;
  const lifeSave=totalCurRemaining-totalNewPayments-newClosing;

  // KPIs
  document.getElementById('kpiNewPmt').textContent=formatCurrency(newPmt);
  document.getElementById('kpiNewPmtDetail').textContent='P&I on '+formatCurrency(newLoan);
  document.getElementById('kpiMonthlySave').textContent=formatCurrency(monthlySave);
  document.getElementById('kpiMonthlySave').className='kpi-value '+(monthlySave>0?'kpi-positive':'kpi-negative');
  document.getElementById('kpiMonthlySaveDetail').textContent=formatCurrency(monthlySave*12)+'/year';
  document.getElementById('kpiBreakEven').textContent=monthlySave>0?breakEvenMo+' mo':'N/A';
  document.getElementById('kpiBreakEvenDetail').textContent=monthlySave>0?(breakEvenMo/12).toFixed(1)+' years':'No savings';
  document.getElementById('kpiLifeSave').textContent=formatCurrency(lifeSave);
  document.getElementById('kpiLifeSave').className='kpi-value '+(lifeSave>0?'kpi-positive':'kpi-negative');
  document.getElementById('kpiLifeSaveDetail').textContent='Over life of new loan';

  // Chart: Cumulative savings
  destroyCharts();const cs=getCS();
  const cumLabels=[];const cumData=[];
  let cumSave=-newClosing;
  const maxMo=Math.min(newTerm*12, 120);
  for(let m=1;m<=maxMo;m++){
    cumSave+=monthlySave;
    if(m%6===0||m===1){cumLabels.push(m<12?m+'mo':Math.round(m/12)+'yr');cumData.push(Math.round(cumSave));}
  }
  window.__charts.cum=new Chart(document.getElementById('chartCumulative'),{type:'line',
    data:{labels:cumLabels,datasets:[{label:'Cumulative Savings',data:cumData,borderColor:cs.c1,backgroundColor:cs.c1+'22',fill:true,tension:0.3,pointRadius:2}]},
    options:{...chartOpts('','line'),plugins:{...chartOpts('','line').plugins,legend:{display:false},annotation:undefined},
      scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  // Chart: Balance comparison
  const curLabels=[];const curBals=[];const newBals=[];
  let cb=curBal;const cmr=curRate/12;const cn=curTerm*12;
  let nb=newLoan;
  for(let yr=0;yr<=Math.min(newTerm,10);yr++){
    curLabels.push('Yr '+yr);
    curBals.push(Math.round(yr===0?curBal:cb));
    newBals.push(Math.round(yr===0?newLoan:nb));
    if(yr>0) continue;
    // project forward
  }
  // Redo properly
  curLabels.length=0;curBals.length=0;newBals.length=0;
  cb=curBal;nb=newLoan;
  for(let yr=0;yr<=10;yr++){
    curLabels.push('Yr '+yr);
    curBals.push(Math.round(cb));
    newBals.push(Math.round(nb));
    for(let m=0;m<12;m++){
      if(cb>0){const ci=cb*cmr;const cp=Math.min(curPmt-ci,cb);cb-=cp;}
      if(nb>0){const ni=nb*nmr;const np=Math.min(newPmt-ni,nb);nb-=np;}
    }
  }
  window.__charts.bal=new Chart(document.getElementById('chartBalance'),{type:'line',
    data:{labels:curLabels,datasets:[
      {label:'Current Loan',data:curBals,borderColor:cs.c2,borderDash:[5,3],tension:0.3,pointRadius:3},
      {label:'New Loan',data:newBals,borderColor:cs.c1,tension:0.3,pointRadius:3}
    ]},
    options:{...chartOpts('','line'),scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  // Table
  const tbody=document.getElementById('refiBody');tbody.innerHTML='';
  const rows=[
    ['Current Payment',formatCurrency(curPmt),formatCurrency(curPmt*12)],
    ['New Payment',formatCurrency(newPmt),formatCurrency(newPmt*12)],
    ['Monthly Savings',formatCurrency(monthlySave),formatCurrency(monthlySave*12)],
    ['Closing Costs','',formatCurrency(newClosing)],
    ['Break-Even','',monthlySave>0?breakEvenMo+' months':'N/A'],
    ['Total Current Remaining','',formatCurrency(totalCurRemaining)],
    ['Total New Payments','',formatCurrency(totalNewPayments)],
    ['Lifetime Net Savings','',formatCurrency(lifeSave)]
  ];
  rows.forEach((r,i)=>{
    const bold=i===2||i===7?'font-weight:700;':'';
    const clr=i===7?(lifeSave>=0?'color:var(--color-success)':'color:var(--color-error)'):'';
    tbody.innerHTML+=`<tr style="${bold}${clr}"><td>${r[0]}</td><td class="text-right">${r[1]}</td><td class="text-right">${r[2]}</td></tr>`;
  });
  showResults();}