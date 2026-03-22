/* ============================================================
   Solar ROI Calculator — IntelliTC Solutions
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

function calculate(){const sysSize=parseNum(document.getElementById('systemSize').value);const cpw=parseNum(document.getElementById('costPerWatt').value);const degrad=parseNum(document.getElementById('panelDegradation').value)/100;const sysLife=parseNum(document.getElementById('systemLife').value);const itcPct=parseNum(document.getElementById('federalITC').value)/100;const stateRebate=parseNum(document.getElementById('stateRebate').value);const srecYr=parseNum(document.getElementById('srecValue').value);const monthlyBill=parseNum(document.getElementById('monthlyBill').value);const elecRate=parseNum(document.getElementById('electricityRate').value);const rateEsc=parseNum(document.getElementById('rateEscalation').value)/100;const annualProd=parseNum(document.getElementById('solarProduction').value);const loanAmt=parseNum(document.getElementById('loanAmount').value);const loanRate=parseNum(document.getElementById('loanRate').value)/100;const loanTerm=parseNum(document.getElementById('loanTerm').value);
  const grossCost=sysSize*cpw*1000;const itcCredit=grossCost*itcPct;const netCost=grossCost-itcCredit-stateRebate;
  // Loan payment
  let loanPmtYr=0;if(loanAmt>0&&loanRate>0&&loanTerm>0){const mr=loanRate/12;const n=loanTerm*12;const pmt=loanAmt*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1);loanPmtYr=pmt*12;}else if(loanAmt>0&&loanTerm>0){loanPmtYr=loanAmt/loanTerm;}
  const baseProduction=sysSize*annualProd;const yrs=[];const annualSavings=[];const cumSavings=[];const cumCosts=[];let totalSavings=0;let totalCosts=loanAmt>0?0:netCost; // upfront if cash
  let paybackYr=0;let cumSav=0;let cumCst=loanAmt>0?0:netCost;
  for(let y=1;y<=sysLife;y++){const production=baseProduction*Math.pow(1-degrad,y-1);const rate=elecRate*Math.pow(1+rateEsc,y-1);const energySavings=production*rate;const srec=srecYr;const loanCost=y<=loanTerm?loanPmtYr:0;const netYr=energySavings+srec-loanCost;
    totalSavings+=energySavings+srec;if(loanAmt>0)totalCosts+=loanCost;
    cumSav+=energySavings+srec;cumCst+=y<=loanTerm?loanPmtYr:0;
    yrs.push('Year '+y);annualSavings.push(Math.round(netYr));
    const cumNetForCash=cumSav-(loanAmt>0?cumCst:netCost);
    cumSavings.push(Math.round(cumSav));cumCosts.push(Math.round(loanAmt>0?cumCst:netCost));
    if(paybackYr===0&&cumNetForCash>=0)paybackYr=y;}
  const totalCostFinal=loanAmt>0?loanPmtYr*Math.min(sysLife,loanTerm):netCost;const lifetimeNet=totalSavings-totalCostFinal;const roi=totalCostFinal>0?lifetimeNet/totalCostFinal*100:0;
  const yr1Savings=annualSavings[0]||0;const monthlyImpact=yr1Savings/12;
  document.getElementById('kpiPayback').textContent=paybackYr>0?paybackYr+' yr'+(paybackYr>1?'s':''):'25+ yrs';document.getElementById('kpiPayback').className='kpi-value '+(paybackYr>0&&paybackYr<=10?'kpi-positive':paybackYr>0?'':'kpi-negative');document.getElementById('kpiPaybackDetail').textContent=paybackYr>0?'Investment recovered by year '+paybackYr:'May not recover within system life';
  document.getElementById('kpiTotalSavings').textContent=formatCurrency(lifetimeNet);document.getElementById('kpiTotalSavings').className='kpi-value '+(lifetimeNet>=0?'kpi-positive':'kpi-negative');document.getElementById('kpiTotalSavingsDetail').textContent=sysLife+'-year net savings after all costs';
  document.getElementById('kpiROI').textContent=formatPct(roi);document.getElementById('kpiROIDetail').textContent='Lifetime return on investment';
  document.getElementById('kpiMonthlyImpact').textContent=formatCurrency(monthlyImpact);document.getElementById('kpiMonthlyImpact').className='kpi-value '+(monthlyImpact>=0?'kpi-positive':'kpi-negative');document.getElementById('kpiMonthlyImpactDetail').textContent='Year 1 net monthly savings';
  destroyCharts();const cs=getCS();
  window.__charts.cross=new Chart(document.getElementById('chartCrossover'),{type:'line',data:{labels:yrs,datasets:[{label:'Cumulative Savings',data:cumSavings,borderColor:cs.c1,backgroundColor:cs.c1+'22',fill:true,tension:0.3},{label:'Cumulative Cost',data:cumCosts,borderColor:cs.c2,borderDash:[5,3],fill:false,tension:0}]},options:{...chartOpts('','line'),scales:{x:{ticks:{color:cs.text,maxTicksLimit:13},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});
  window.__charts.annual=new Chart(document.getElementById('chartAnnual'),{type:'bar',data:{labels:yrs,datasets:[{label:'Net Annual Savings',data:annualSavings,backgroundColor:annualSavings.map(v=>v>=0?cs.c1:cs.c2)}]},options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text,maxTicksLimit:13},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});
  const tbody=document.getElementById('solarBody');if(tbody){tbody.innerHTML='';
  const items=[['Gross System Cost',formatCurrency(grossCost),''],['Federal ITC ('+formatPct(itcPct*100)+')','-'+formatCurrency(itcCredit),''],['State/Local Rebate','-'+formatCurrency(stateRebate),''],['Net System Cost',formatCurrency(netCost),'highlight'],['Year 1 Production',formatNum(baseProduction)+' kWh',''],['Year 1 Energy Savings',formatCurrency(baseProduction*elecRate),''],['Year 1 SREC Income',formatCurrency(srecYr),''],['Payback Period',paybackYr>0?paybackYr+' years':'25+ years','highlight'],['Lifetime Energy Savings',formatCurrency(totalSavings),''],['Lifetime Net Benefit',formatCurrency(lifetimeNet),'highlight'],['Lifetime ROI',formatPct(roi),'highlight']];
  items.forEach(r=>{const style=r[2]==='highlight'?'font-weight:600':'';tbody.innerHTML+=`<tr style="${style}"><td>${r[0]}</td><td class="text-right">${r[1]}</td></tr>`;});}
  showResults();}