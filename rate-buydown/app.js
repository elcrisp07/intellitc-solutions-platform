/* ============================================================
   Rate Buydown Calculator — IntelliTC Solutions
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
  const loanAmt=parseNum(document.getElementById('loanAmt').value);
  const baseRate=parseNum(document.getElementById('baseRate').value)/100;
  const term=parseNum(document.getElementById('term').value);
  const permPoints=parseNum(document.getElementById('permPoints').value);
  const costPerPoint=parseNum(document.getElementById('costPerPoint').value)/100;
  const buydownType=document.getElementById('buydownType').value;
  const sellerCredit=parseNum(document.getElementById('sellerCredit').value);
  const n=term*12;

  function calcPmt(principal,annRate){const mr=annRate/12;return mr>0?principal*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):principal/n;}

  // Base payment (no buydown)
  const basePmt=calcPmt(loanAmt,baseRate);

  // Permanent buydown
  const permRateReduction=permPoints*0.0025; // each point = 0.25%
  const permRate=Math.max(baseRate-permRateReduction,0.001);
  const permPmt=calcPmt(loanAmt,permRate);
  const permCost=loanAmt*costPerPoint*permPoints;
  const permMonthlySave=basePmt-permPmt;
  const permBreakEven=permMonthlySave>0?Math.ceil(permCost/permMonthlySave):0;

  // Temporary buydown
  let tempYears=[];
  if(buydownType==='3-2-1') tempYears=[3,2,1];
  else if(buydownType==='2-1') tempYears=[2,1];
  else tempYears=[1];

  const tempRates=tempYears.map(reduction=>baseRate-reduction/100);
  tempRates.push(baseRate); // final year at full rate
  const tempPmts=tempRates.map(r=>calcPmt(loanAmt,r));

  // Temp buydown cost = sum of monthly savings over subsidized years
  let tempCost=0;
  for(let i=0;i<tempYears.length;i++){
    tempCost+=(basePmt-tempPmts[i])*12;
  }
  const netTempCost=Math.max(0,tempCost-sellerCredit);

  // KPIs
  document.getElementById('kpiPermPmt').textContent=formatCurrency(permPmt);
  document.getElementById('kpiPermPmtDetail').textContent=formatPct(permRate*100)+' rate (was '+formatPct(baseRate*100)+')';
  document.getElementById('kpiPermSave').textContent=formatCurrency(permMonthlySave);
  document.getElementById('kpiPermSave').className='kpi-value '+(permMonthlySave>0?'kpi-positive':'');
  document.getElementById('kpiPermSaveDetail').textContent=formatCurrency(permMonthlySave*12)+'/year savings';
  document.getElementById('kpiTempYr1').textContent=formatCurrency(tempPmts[0]);
  document.getElementById('kpiTempYr1Detail').textContent=buydownType+': '+formatPct(tempRates[0]*100)+' Year 1 rate';
  document.getElementById('kpiBreakEven').textContent=permBreakEven>0?permBreakEven+' mo':'N/A';
  document.getElementById('kpiBreakEvenDetail').textContent=permBreakEven>0?(permBreakEven/12).toFixed(1)+' years to recoup '+formatCurrency(permCost):'No savings';

  destroyCharts();const cs=getCS();

  // Payment timeline (60 months)
  const timeLabels=[];const baseLine=[];const permLine=[];const tempLine=[];
  for(let m=1;m<=60;m++){
    timeLabels.push(m%12===0?'Yr '+(m/12):'');
    baseLine.push(Math.round(basePmt));
    permLine.push(Math.round(permPmt));
    // temp payment
    let yr=Math.ceil(m/12)-1;
    if(yr<tempPmts.length) tempLine.push(Math.round(tempPmts[yr]));
    else tempLine.push(Math.round(basePmt));
  }
  window.__charts.timeline=new Chart(document.getElementById('chartTimeline'),{type:'line',
    data:{labels:timeLabels,datasets:[
      {label:'No Buydown',data:baseLine,borderColor:cs.c5,borderDash:[4,4],tension:0,pointRadius:0},
      {label:'Permanent',data:permLine,borderColor:cs.c1,tension:0,pointRadius:0},
      {label:'Temporary ('+buydownType+')',data:tempLine,borderColor:cs.c3,tension:0,pointRadius:0,stepped:true}
    ]},
    options:{...chartOpts('','line'),scales:{x:{ticks:{color:cs.text,maxTicksLimit:5},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  // Cumulative savings chart (permanent)
  const cumLabels=[];const cumData=[];let cumSave=-permCost;
  for(let m=1;m<=60;m++){
    cumSave+=permMonthlySave;
    if(m%6===0){cumLabels.push(m<12?m+'mo':'Yr '+(m/12));cumData.push(Math.round(cumSave));}
  }
  window.__charts.cum=new Chart(document.getElementById('chartCumulative'),{type:'bar',
    data:{labels:cumLabels,datasets:[{label:'Net Savings',data:cumData,backgroundColor:cumData.map(v=>v>=0?cs.c1:cs.c2)}]},
    options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},
      scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  // Table
  const tbody=document.getElementById('buydownBody');tbody.innerHTML='';
  const tRows=[
    ['Base Payment (No Buydown)',formatCurrency(basePmt),formatPct(baseRate*100),'highlight'],
    ['','','','divider'],
    ['Permanent Buydown Payment',formatCurrency(permPmt),formatPct(permRate*100),''],
    ['Permanent Buydown Cost',formatCurrency(permCost),permPoints+' points',''],
    ['Monthly Savings',formatCurrency(permMonthlySave),'','highlight'],
    ['Break-Even',permBreakEven>0?permBreakEven+' months':'N/A','',''],
    ['','','','divider']
  ];
  for(let i=0;i<tempYears.length;i++){
    tRows.push(['Temp Year '+(i+1)+' Payment',formatCurrency(tempPmts[i]),formatPct(tempRates[i]*100),'']);
  }
  tRows.push(['Temp: Full Rate Resumes',formatCurrency(basePmt),'Year '+(tempYears.length+1)+'+','']);
  tRows.push(['Temp Buydown Cost',formatCurrency(tempCost),sellerCredit>0?'Less '+formatCurrency(sellerCredit)+' credit':'','']);
  tRows.push(['Net Temp Cost',formatCurrency(netTempCost),'','highlight']);

  tRows.forEach(r=>{
    if(r[3]==='divider'){tbody.innerHTML+='<tr><td colspan="3" style="padding:0"><div style="border-top:1px solid var(--color-divider)"></div></td></tr>';return;}
    const bold=r[3]==='highlight'?'font-weight:600;':'';
    tbody.innerHTML+=`<tr style="${bold}"><td>${r[0]}</td><td class="text-right">${r[1]}</td><td class="text-right">${r[2]}</td></tr>`;
  });
  showResults();}