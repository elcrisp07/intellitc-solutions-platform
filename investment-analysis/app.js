/* ============================================================
   Investment Analysis Calculator — IntelliTC Solutions
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
  const dpPct=parseNum(document.getElementById('downPayment').value)/100;
  const rate=parseNum(document.getElementById('interestRate').value)/100;
  const term=parseNum(document.getElementById('loanTerm').value);
  const rent=parseNum(document.getElementById('monthlyIncome').value);
  const other=parseNum(document.getElementById('otherIncome').value);
  const vac=parseNum(document.getElementById('vacancyRate').value)/100;
  const tax=parseNum(document.getElementById('propTax').value);
  const ins=parseNum(document.getElementById('insurance').value);
  const maint=parseNum(document.getElementById('maintenance').value);
  const util=parseNum(document.getElementById('utilities').value);
  const mgmt=rent*parseNum(document.getElementById('propMgmt').value)/100;
  const hoa=parseNum(document.getElementById('hoa').value);

  const loan=pp*(1-dpPct);const mr=rate/12;const n=term*12;
  const mortPmt=mr>0?loan*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):loan/n;
  const grossInc=rent+other;const effInc=grossInc*(1-vac);
  const totalExp=tax+ins+maint+util+mgmt+hoa;
  const noi=(effInc-totalExp)*12;
  const monthlyCF=effInc-totalExp-mortPmt;
  const annualCF=monthlyCF*12;
  const cashIn=pp*dpPct+pp*0.03;
  const capRate=noi/pp*100;
  const coc=annualCF/cashIn*100;
  const grm=pp/(grossInc*12);
  const beOcc=((totalExp+mortPmt)/grossInc)*100;

  document.getElementById('kpiCapRate').textContent=formatPct(capRate);
  document.getElementById('kpiCoC').textContent=formatPct(coc);
  document.getElementById('kpiCashFlow').textContent=formatCurrency(monthlyCF);
  document.getElementById('kpiCashFlow').className='kpi-value '+(monthlyCF>=0?'kpi-positive':'kpi-negative');
  document.getElementById('kpiCashFlowDetail').textContent=formatCurrency(annualCF)+'/year';
  document.getElementById('kpiBEOcc').textContent=formatPct(Math.min(beOcc,100));
  document.getElementById('kpiBEOccDetail').textContent='GRM: '+grm.toFixed(1);

  destroyCharts();const cs=getCS();
  const expLabels=['Taxes','Insurance','Maintenance','Utilities','Management','HOA'];
  const expVals=[tax,ins,maint,util,mgmt,hoa].filter((_,i)=>[tax,ins,maint,util,mgmt,hoa][i]>0);
  const expLbls=expLabels.filter((_,i)=>[tax,ins,maint,util,mgmt,hoa][i]>0);
  window.__charts.exp=new Chart(document.getElementById('chartExpenses'),{
    type:'doughnut',data:{labels:expLbls,datasets:[{data:expVals,backgroundColor:[cs.c1,cs.c2,cs.c3,cs.c4,cs.c5,cs.c6]}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{color:cs.text,font:{family:'DM Sans'}}}}}
  });
  window.__charts.roi=new Chart(document.getElementById('chartROI'),{
    type:'bar',data:{labels:['Cap Rate','CoC Return','Break-Even Occ.'],datasets:[{data:[capRate,coc,beOcc],backgroundColor:[cs.c1,cs.c3,cs.c2]}]},
    options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>v+'%'},grid:{color:cs.grid}}}}
  });

  const items=[['Gross Rental Income',grossInc,grossInc*12],['Other Income',other,other*12],['Vacancy Loss',-grossInc*vac,-grossInc*vac*12],['Effective Income',effInc,effInc*12],['---','',''],['Property Tax',-tax,-tax*12],['Insurance',-ins,-ins*12],['Maintenance',-maint,-maint*12],['Utilities',-util,-util*12],['Management',-mgmt,-mgmt*12],['HOA',-hoa,-hoa*12],['Total Expenses',-totalExp,-totalExp*12],['---','',''],['NOI',effInc-totalExp,noi],['Mortgage Payment',-mortPmt,-mortPmt*12],['Net Cash Flow',monthlyCF,annualCF]];
  const tbody=document.getElementById('plBody');tbody.innerHTML='';
  items.forEach(([label,mo,yr])=>{
    if(label==='---'){tbody.innerHTML+='<tr><td colspan="3" style="border-bottom:2px solid var(--color-divider)"></td></tr>';return;}
    const bold=['Effective Income','Total Expenses','NOI','Net Cash Flow'].includes(label)?'font-weight:600':'';
    const hi=label==='Net Cash Flow'?' highlight':'';
    tbody.innerHTML+=`<tr style="${bold}"><td>${label}</td><td class="text-right${hi}">${typeof mo==='number'?formatCurrency(mo):''}</td><td class="text-right${hi}">${typeof yr==='number'?formatCurrency(yr):''}</td></tr>`;
  });
  showResults();
}
