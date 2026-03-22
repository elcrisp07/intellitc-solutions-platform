/* ============================================================
   Strategic Market Valuation — IntelliTC Solutions
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

function calculate(){const mp=parseNum(document.getElementById('medianPrice').value);const mi=parseNum(document.getElementById('medianIncome').value);const avgRent=parseNum(document.getElementById('avgRent').value);const mortRate=parseNum(document.getElementById('mortgageRate').value)/100;const supply=parseNum(document.getElementById('monthsSupply').value);const popGr=parseNum(document.getElementById('popGrowth').value);const jobGr=parseNum(document.getElementById('jobGrowth').value);const dom=parseNum(document.getElementById('daysOnMarket').value);const overAsk=parseNum(document.getElementById('pctOverAsking').value);const rentGr=parseNum(document.getElementById('rentGrowth').value);
  // Normalize each factor to 0-100 (higher = hotter market)
  function clamp(v){return Math.max(0,Math.min(100,v));}
  const priceToIncome=mi>0?mp/mi:0;
  const affordScore=clamp(100-((priceToIncome-3)/7)*100); // 3x=100, 10x=0
  const mr=mortRate/12;const n=360;const loanAmt=mp*0.8;const mortPmt=mr>0?loanAmt*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):loanAmt/n;
  const piti=mortPmt+mp*0.012/12+150;const dti=mi>0?piti/(mi/12)*100:100;
  const dtiScore=clamp(100-(dti-20)/30*100); // 20%DTI=100, 50%=0
  const supplyScore=clamp((supply-1)/5*100); // 1mo=0(hot), 6mo=100(cold) — invert for heat
  const supplyHeat=100-supplyScore;
  const popScore=clamp(popGr/3*100); // 0%=0, 3%=100
  const jobScore=clamp(jobGr/5*100); // 0%=0, 5%=100
  const domScore=clamp(100-(dom/90)*100); // 0days=100, 90days=0
  const overAskScore=clamp(overAsk/60*100); // 0%=0, 60%=100
  const grm=avgRent>0?mp/(avgRent*12):0;
  const grmScore=clamp(100-((grm-8)/12)*100); // 8=100, 20=0
  const rentGrScore=clamp(rentGr/8*100); // 0%=0, 8%=100
  // Weights
  const weights={afford:0.15,dti:0.1,supply:0.15,pop:0.1,job:0.1,dom:0.15,overAsk:0.1,grm:0.15};
  const scores={afford:affordScore,dti:dtiScore,supply:supplyHeat,pop:popScore,job:jobScore,dom:domScore,overAsk:overAskScore,grm:grmScore};
  const heatScore=scores.afford*weights.afford+scores.dti*weights.dti+scores.supply*weights.supply+scores.pop*weights.pop+scores.job*weights.job+scores.dom*weights.dom+scores.overAsk*weights.overAsk+scores.grm*weights.grm;
  const affordIdx=mi>0?(mi*0.28/12)/piti*100:0;
  const sdScore=(supplyHeat+popScore+jobScore)/3;
  let verdict='Neutral',verdictCls='';
  if(heatScore>=75){verdict='Hot Seller\'s Market';verdictCls='kpi-negative';}
  else if(heatScore>=55){verdict='Warm Market';verdictCls='';}
  else if(heatScore>=40){verdict='Balanced Market';verdictCls='kpi-positive';}
  else if(heatScore>=25){verdict='Cool Buyer\'s Market';verdictCls='kpi-positive';}
  else{verdict='Cold Market';verdictCls='kpi-positive';}
  document.getElementById('kpiHeatScore').textContent=Math.round(heatScore);document.getElementById('kpiHeatScore').className='kpi-value '+(heatScore>=60?'kpi-negative':heatScore>=40?'':'kpi-positive');document.getElementById('kpiHeatScoreDetail').textContent='0 = cold, 100 = extremely hot';
  document.getElementById('kpiAffordability').textContent=affordIdx.toFixed(0)+'%';document.getElementById('kpiAffordabilityDetail').textContent=affordIdx>=100?'Affordable':'Stretched — '+formatPct(dti)+' DTI';
  document.getElementById('kpiSupplyDemand').textContent=sdScore.toFixed(0)+'/100';document.getElementById('kpiSupplyDemandDetail').textContent=supply.toFixed(1)+' months supply';
  document.getElementById('kpiVerdict').textContent=verdict;document.getElementById('kpiVerdict').className='kpi-value '+verdictCls;document.getElementById('kpiVerdictDetail').textContent='Based on 8-factor composite analysis';
  destroyCharts();const cs=getCS();
  const labels=['Affordability','DTI Capacity','Supply Heat','Pop Growth','Job Growth','Days on Mkt','Over Asking','Rent Value'];
  const vals=[scores.afford,scores.dti,scores.supply,scores.pop,scores.job,scores.dom,scores.overAsk,scores.grm];
  window.__charts.radar=new Chart(document.getElementById('chartRadar'),{type:'radar',data:{labels:labels,datasets:[{label:'Market Score',data:vals,borderColor:cs.c1,backgroundColor:cs.c1+'33',pointBackgroundColor:cs.c1,pointRadius:4}]},options:{responsive:true,maintainAspectRatio:false,scales:{r:{min:0,max:100,ticks:{stepSize:20,color:cs.text,backdropColor:'transparent'},grid:{color:cs.grid},pointLabels:{color:cs.text,font:{size:11}}}},plugins:{legend:{display:false}}}});
  const barColors=vals.map(v=>v>=70?cs.c2:v>=40?cs.c3:cs.c1);
  window.__charts.bar=new Chart(document.getElementById('chartBar'),{type:'bar',data:{labels:labels,datasets:[{data:vals,backgroundColor:barColors}]},options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text,maxRotation:45},grid:{display:false}},y:{min:0,max:100,ticks:{color:cs.text,callback:v=>v},grid:{color:cs.grid}}}}});
  showResults();}