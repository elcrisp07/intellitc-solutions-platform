/* ============================================================
   Housing Code Compliance Estimator — IntelliTC Solutions
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
  const propType=document.getElementById('propType').value;
  const yearBuilt=parseNum(document.getElementById('yearBuilt').value);
  const units=parseNum(document.getElementById('units').value)||1;
  const electrical=parseNum(document.getElementById('electrical').value);
  const plumbing=parseNum(document.getElementById('plumbing').value);
  const structural=parseNum(document.getElementById('structural').value);
  const fire=parseNum(document.getElementById('fire').value);
  const hvac=parseNum(document.getElementById('hvac').value);
  const mold=parseNum(document.getElementById('mold').value);
  const pest=parseNum(document.getElementById('pest').value);
  const leadPaint=parseNum(document.getElementById('leadPaint').value);

  // Scale costs by unit count for multi-unit
  const unitMult=units>1?1+(units-1)*0.6:1;
  const costs={
    'Electrical':electrical*unitMult,
    'Plumbing':plumbing*unitMult,
    'Structural':structural*unitMult,
    'Fire Safety':fire*unitMult,
    'HVAC':hvac*unitMult,
    'Mold':mold*unitMult,
    'Pest Control':pest*unitMult,
    'Lead Paint':yearBuilt<1978?leadPaint*unitMult:0
  };

  const totalCost=Object.values(costs).reduce((s,v)=>s+v,0);

  // Risk scoring: higher for older buildings, more violations, safety items
  let riskScore=0;
  const currentYear=2026;
  const buildingAge=currentYear-yearBuilt;
  riskScore+=Math.min(buildingAge/2,25); // age factor (max 25)
  if(electrical>0)riskScore+=15;
  if(structural>0)riskScore+=20;
  if(fire>0)riskScore+=20;
  if(mold>0)riskScore+=10;
  if(yearBuilt<1978&&leadPaint>0)riskScore+=15;
  if(plumbing>0)riskScore+=8;
  if(hvac>0)riskScore+=7;
  if(pest>0)riskScore+=5;
  riskScore=Math.min(riskScore,100);

  // Count critical violations (safety-related)
  let critical=0;
  if(electrical>0)critical++;
  if(structural>0)critical++;
  if(fire>0)critical++;
  if(yearBuilt<1978&&leadPaint>0)critical++;

  // Penalty risk assessment
  const penaltyPerDay=critical>=3?500:critical>=2?250:critical>=1?100:0;
  const annualPenalty=penaltyPerDay*365;

  document.getElementById('kpiTotalCost').textContent=formatCurrency(totalCost);
  document.getElementById('kpiTotalCostDetail').textContent=units>1?formatCurrency(totalCost/units)+' per unit':'Single unit estimate';
  document.getElementById('kpiRiskScore').textContent=Math.round(riskScore)+'/100';
  document.getElementById('kpiRiskScore').className='kpi-value '+(riskScore<=30?'kpi-positive':riskScore<=60?'':'kpi-negative');
  document.getElementById('kpiRiskScoreDetail').textContent=riskScore<=30?'Low risk':riskScore<=60?'Moderate risk':'High risk';
  document.getElementById('kpiCritical').textContent=critical;
  document.getElementById('kpiCritical').className='kpi-value '+(critical===0?'kpi-positive':critical<=1?'':'kpi-negative');
  document.getElementById('kpiCriticalDetail').textContent=critical===0?'No critical issues':critical+' safety-related violation'+(critical>1?'s':'');
  document.getElementById('kpiPenaltyRisk').textContent=formatCurrency(annualPenalty);
  document.getElementById('kpiPenaltyRisk').className='kpi-value '+(annualPenalty===0?'kpi-positive':'kpi-negative');
  document.getElementById('kpiPenaltyRiskDetail').textContent=penaltyPerDay>0?formatCurrency(penaltyPerDay)+'/day potential fines':'No penalty exposure';

  destroyCharts();const cs=getCS();

  // Violation Cost by Category bar chart
  const cats=Object.keys(costs).filter(k=>costs[k]>0);
  const vals=cats.map(k=>costs[k]);
  const barColors=cats.map((_,i)=>[cs.c1,cs.c2,cs.c3,cs.c4,cs.c5,cs.c6,cs.c1,cs.c2][i%8]);
  window.__charts.sev=new Chart(document.getElementById('chartSeverity'),{type:'bar',
    data:{labels:cats,datasets:[{data:vals,backgroundColor:barColors}]},
    options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  // Priority Matrix horizontal bar (sorted by priority score)
  const priorities=[];
  const priorityWeights={'Fire Safety':10,'Electrical':9,'Structural':8,'Lead Paint':7,'Mold':6,'HVAC':5,'Plumbing':4,'Pest Control':3};
  Object.keys(costs).forEach(k=>{if(costs[k]>0)priorities.push({name:k,cost:costs[k],weight:priorityWeights[k]||1,score:priorityWeights[k]*10});});
  priorities.sort((a,b)=>b.score-a.score);
  const priColors=priorities.map(p=>p.score>=80?cs.c2:p.score>=50?cs.c5:cs.c1);
  window.__charts.pri=new Chart(document.getElementById('chartPriority'),{type:'bar',
    data:{labels:priorities.map(p=>p.name),datasets:[{label:'Priority Score',data:priorities.map(p=>p.score),backgroundColor:priColors}]},
    options:{...chartOpts('','bar'),indexAxis:'y',plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text},grid:{color:cs.grid}},y:{ticks:{color:cs.text},grid:{display:false}}}}});

  showResults();}