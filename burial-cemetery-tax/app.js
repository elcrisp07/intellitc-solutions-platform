/* ============================================================
   Burial & Cemetery Tax Exemption — IntelliTC Solutions
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

function calculate(){const assessed=parseNum(document.getElementById('assessedValue').value);const taxRate=parseNum(document.getElementById('taxRate').value)/100;const exemptPct=parseNum(document.getElementById('exemptionPct').value)/100;const appCost=parseNum(document.getElementById('applicationCost').value);const surveyCost=parseNum(document.getElementById('surveyingCost').value);const maintCost=parseNum(document.getElementById('maintenanceCostYr').value);const compCost=parseNum(document.getElementById('complianceCostYr').value);
  const annualTaxBefore=assessed*taxRate;const exemptValue=assessed*exemptPct;const annualTaxAfter=(assessed-exemptValue)*taxRate;const annualSavings=annualTaxBefore-annualTaxAfter;
  const upfrontCosts=appCost+surveyCost;const ongoingAnnual=maintCost+compCost;const netSavingsAnnual=annualSavings-ongoingAnnual;const netSavingsY1=netSavingsAnnual-upfrontCosts;
  let paybackYrs=0;if(netSavingsAnnual>0){let cumNet=-upfrontCosts;for(let y=1;y<=30;y++){cumNet+=netSavingsAnnual;if(cumNet>=0){paybackYrs=y;break;}}}
  let tenYearNet=-upfrontCosts;for(let y=1;y<=10;y++){tenYearNet+=netSavingsAnnual;}
  document.getElementById('kpiAnnualSavings').textContent=formatCurrency(annualSavings);document.getElementById('kpiAnnualSavingsDetail').textContent='Gross tax savings (before costs)';
  document.getElementById('kpiNetSavingsY1').textContent=formatCurrency(netSavingsY1);document.getElementById('kpiNetSavingsY1').className='kpi-value '+(netSavingsY1>=0?'kpi-positive':'kpi-negative');document.getElementById('kpiNetSavingsY1Detail').textContent='After upfront + ongoing costs';
  document.getElementById('kpiPayback').textContent=paybackYrs>0?paybackYrs+' yr'+(paybackYrs>1?'s':''):'Never';document.getElementById('kpiPayback').className='kpi-value '+(paybackYrs>0&&paybackYrs<=3?'kpi-positive':paybackYrs>0?'':'kpi-negative');document.getElementById('kpiPaybackDetail').textContent=paybackYrs>0?'Upfront costs recovered by year '+paybackYrs:'Costs exceed savings';
  document.getElementById('kpiTenYearNet').textContent=formatCurrency(tenYearNet);document.getElementById('kpiTenYearNet').className='kpi-value '+(tenYearNet>=0?'kpi-positive':'kpi-negative');document.getElementById('kpiTenYearNetDetail').textContent='Cumulative net benefit over 10 years';
  destroyCharts();const cs=getCS();
  const yrs=[];const cumSavings=[];const cumCosts=[];const cumNet=[];let rS=0,rC=upfrontCosts;
  for(let y=1;y<=10;y++){rS+=annualSavings;rC+=ongoingAnnual;yrs.push('Year '+y);cumSavings.push(Math.round(rS));cumCosts.push(Math.round(rC));cumNet.push(Math.round(rS-rC));}
  window.__charts.cum=new Chart(document.getElementById('chartCumulative'),{type:'line',data:{labels:yrs,datasets:[{label:'Cumulative Tax Savings',data:cumSavings,borderColor:cs.c1,backgroundColor:cs.c1+'22',fill:true,tension:0.3},{label:'Cumulative Costs',data:cumCosts,borderColor:cs.c2,borderDash:[5,3],fill:false,tension:0},{label:'Net Benefit',data:cumNet,borderColor:cs.c3,backgroundColor:cs.c3+'22',fill:true,tension:0.3}]},options:{...chartOpts('','line'),scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});
  const annualNets=[];for(let y=0;y<10;y++){annualNets.push(Math.round(netSavingsAnnual));}
  window.__charts.breakdown=new Chart(document.getElementById('chartBreakdown'),{type:'bar',data:{labels:yrs,datasets:[{label:'Net Annual Savings',data:annualNets,backgroundColor:annualNets.map(v=>v>=0?cs.c1:cs.c2)}]},options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});
  const tbody=document.getElementById('detailBody');if(tbody){tbody.innerHTML='';
  const rows=[['Assessed Value',formatCurrency(assessed),''],['Tax Rate',formatPct(taxRate*100),''],['Annual Tax (Before)',formatCurrency(annualTaxBefore),''],['Exempt Portion',formatPct(exemptPct*100),formatCurrency(exemptValue)],['Annual Tax (After)',formatCurrency(annualTaxAfter),''],['Gross Annual Savings',formatCurrency(annualSavings),'highlight'],['Upfront Costs',formatCurrency(upfrontCosts),''],['Annual Maintenance',formatCurrency(maintCost),''],['Annual Compliance',formatCurrency(compCost),''],['Net Annual Savings',formatCurrency(netSavingsAnnual),'highlight'],['10-Year Net Benefit',formatCurrency(tenYearNet),'highlight']];
  rows.forEach(r=>{const style=r[2]==='highlight'?'font-weight:600':'';tbody.innerHTML+=`<tr style="${style}"><td>${r[0]}</td><td class="text-right">${r[1]}</td><td class="text-right">${r[2]==='highlight'?'':r[2]}</td></tr>`;});}
  showResults();}