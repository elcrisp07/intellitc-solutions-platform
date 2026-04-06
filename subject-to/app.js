/* ============================================================
   Subject-To Calculator — IntelliTC Solutions
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

function calculate(){const bal=parseNum(document.getElementById('mortBal').value);const pmt=parseNum(document.getElementById('mortPmt').value);const mRate=parseNum(document.getElementById('mortRate').value)/100;const remYrs=parseNum(document.getElementById('mortRemaining').value);const toSeller=parseNum(document.getElementById('purchasePrice').value);const value=parseNum(document.getElementById('propValue').value);const closing=parseNum(document.getElementById('closingCosts').value);const rent=parseNum(document.getElementById('rent').value);const vacPct=parseNum(document.getElementById('vacancy').value)/100;const expPct=parseNum(document.getElementById('expenses').value)/100;
  const cashNeeded=toSeller+closing;const equity=value-bal-toSeller;const egi=rent*(1-vacPct);const exp=egi*expPct;const cf=egi-exp-pmt;const coc=cashNeeded>0?cf*12/cashNeeded*100:0;
  const newRate=0.07;const newLoan=value*0.8;const nmr=newRate/12;const nn=30*12;const newPmt=nmr>0?newLoan*(nmr*Math.pow(1+nmr,nn))/(Math.pow(1+nmr,nn)-1):newLoan/nn;const newDP=value*0.2;
  const savings=(newPmt-pmt)*12;const totalSaveLife=(newPmt-pmt)*remYrs*12;
  document.getElementById('kpiInstantEquity').textContent=formatCurrency(equity);document.getElementById('kpiInstantEquityDetail').textContent=formatPct(equity/value*100)+' equity';
  document.getElementById('kpiCashFlow').textContent=formatCurrency(cf);document.getElementById('kpiCashFlow').className='kpi-value '+(cf>=0?'kpi-positive':'kpi-negative');document.getElementById('kpiCashFlowDetail').textContent=formatCurrency(cf*12)+'/year';
  document.getElementById('kpiCoC').textContent=coc===Infinity?'∞':formatPct(coc);document.getElementById('kpiCoCDetail').textContent='On '+formatCurrency(cashNeeded)+' invested';
  document.getElementById('kpiSavings').textContent=formatCurrency(savings);document.getElementById('kpiSavingsDetail').textContent=formatCurrency(totalSaveLife)+' over remaining term';
  destroyCharts();const cs=getCS();
  const yrs=[];const subPmts=[];const newPmts=[];for(let y=1;y<=Math.min(remYrs,10);y++){yrs.push('Yr '+y);subPmts.push(pmt);newPmts.push(newPmt);}
  window.__charts.comp=new Chart(document.getElementById('chartCompare'),{type:'line',data:{labels:yrs,datasets:[{label:'Subject-To Payment',data:subPmts,borderColor:cs.c1,tension:0},{label:'New 7% Loan Payment',data:newPmts,borderColor:cs.c2,borderDash:[5,3],tension:0}]},options:{...chartOpts('','line'),scales:{x:{ticks:{color:cs.text},grid:{color:cs.grid}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});
  window.__charts.eq=new Chart(document.getElementById('chartEquity'),{type:'bar',data:{labels:['Deal Structure'],datasets:[{label:'Cash to Seller',data:[toSeller],backgroundColor:cs.c2},{label:'Mortgage',data:[bal],backgroundColor:cs.c5},{label:'Your Equity',data:[equity],backgroundColor:cs.c1}]},options:{...chartOpts('','bar'),indexAxis:'y',plugins:{...chartOpts('','bar').plugins},scales:{x:{stacked:true,ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}},y:{stacked:true,ticks:{color:cs.text},grid:{display:false}}}}});
  const tbody=document.getElementById('compBody');tbody.innerHTML='';
  [['Cash Needed',formatCurrency(cashNeeded),formatCurrency(newDP+value*0.03)],['Monthly Payment',formatCurrency(pmt),formatCurrency(newPmt)],['Interest Rate',formatPct(mRate*100),formatPct(newRate*100)],['Monthly Cash Flow',formatCurrency(cf),formatCurrency(egi-exp-newPmt)],['Annual Savings',formatCurrency(savings),'Baseline']].forEach(r=>{tbody.innerHTML+=`<tr><td>${r[0]}</td><td class="text-right">${r[1]}</td><td class="text-right">${r[2]}</td></tr>`;});
  showResults();}