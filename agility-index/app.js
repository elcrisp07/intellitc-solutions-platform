/* ============================================================
   Market Agility Index — IntelliTC Solutions
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

function calculate(){const dom=parseNum(document.getElementById('daysOnMarket').value);const ltc=parseNum(document.getElementById('listToClose').value);const priceRedux=parseNum(document.getElementById('priceChangeFreq').value);const supply=parseNum(document.getElementById('monthsSupply').value);const absorption=parseNum(document.getElementById('absorptionRate').value);const newList=parseNum(document.getElementById('newListings').value);const offers=parseNum(document.getElementById('offersPerListing').value);const overAsk=parseNum(document.getElementById('pctOverAsking').value);const cashPct=parseNum(document.getElementById('cashBuyerPct').value);const wS=parseNum(document.getElementById('wSpeed').value)/100;const wSc=parseNum(document.getElementById('wScarcity').value)/100;const wC=parseNum(document.getElementById('wCompetition').value)/100;
  function clamp(v){return Math.max(0,Math.min(100,v));}
  // Speed subscores (higher = faster/more agile)
  const domScore=clamp(100-(dom/60)*100); // 0days=100, 60days=0
  const ltcScore=clamp(100-(ltc/90)*100); // 0=100, 90days=0
  const priceReduxScore=clamp(100-(priceRedux/40)*100); // 0%=100(no reductions=fast), 40%=0
  const speedScore=(domScore+ltcScore+priceReduxScore)/3;
  // Scarcity subscores
  const supplyScore=clamp(100-(supply/6)*100); // 0mo=100, 6mo=0
  const absorpScore=clamp(absorption/80*100); // 0%=0, 80%=100
  const listScore=clamp(100-(newList/500)*100); // 0=100(super scarce), 500=0(flooded)
  const scarcityScore=(supplyScore+absorpScore+listScore)/3;
  // Competition subscores
  const offerScore=clamp((offers-1)/7*100); // 1offer=0, 8offers=100
  const overAskScore=clamp(overAsk/60*100); // 0%=0, 60%=100
  const cashScore=clamp(cashPct/50*100); // 0%=0, 50%=100
  const compScore=(offerScore+overAskScore+cashScore)/3;
  // Weighted total
  const totalW=wS+wSc+wC;const normWs=totalW>0?wS/totalW:0.33;const normWSc=totalW>0?wSc/totalW:0.34;const normWC=totalW>0?wC/totalW:0.33;
  const agilityScore=speedScore*normWs+scarcityScore*normWSc+compScore*normWC;
  let marketType='Balanced',mtCls='';
  if(agilityScore>=80){marketType='Hyper-Competitive';mtCls='kpi-negative';}
  else if(agilityScore>=60){marketType='Fast & Competitive';mtCls='kpi-negative';}
  else if(agilityScore>=40){marketType='Balanced / Transitional';mtCls='';}
  else if(agilityScore>=20){marketType='Buyer-Friendly';mtCls='kpi-positive';}
  else{marketType='Stagnant / Cold';mtCls='kpi-positive';}
  document.getElementById('kpiAgilityScore').textContent=Math.round(agilityScore)+'/100';document.getElementById('kpiAgilityScore').className='kpi-value '+(agilityScore>=60?'kpi-negative':agilityScore>=40?'':'kpi-positive');document.getElementById('kpiAgilityScoreDetail').textContent='Weighted composite score';
  document.getElementById('kpiSpeedScore').textContent=Math.round(speedScore)+'/100';document.getElementById('kpiSpeedScoreDetail').textContent='DOM '+dom+'d, Close '+ltc+'d';
  document.getElementById('kpiScarcityScore').textContent=Math.round(scarcityScore)+'/100';document.getElementById('kpiScarcityScoreDetail').textContent=supply+' months supply';
  document.getElementById('kpiMarketType').textContent=marketType;document.getElementById('kpiMarketType').className='kpi-value '+mtCls;document.getElementById('kpiMarketTypeDetail').textContent='Based on agility composite';
  destroyCharts();const cs=getCS();
  const labels=['Days on Market','List-to-Close','Price Stability','Supply Scarcity','Absorption','Listing Scarcity','Offer Volume','Over Asking','Cash Buyers'];
  const vals=[domScore,ltcScore,priceReduxScore,supplyScore,absorpScore,listScore,offerScore,overAskScore,cashScore];
  window.__charts.radar=new Chart(document.getElementById('chartRadar'),{type:'radar',data:{labels:labels,datasets:[{label:'Factor Score',data:vals,borderColor:cs.c1,backgroundColor:cs.c1+'33',pointBackgroundColor:cs.c1,pointRadius:4}]},options:{responsive:true,maintainAspectRatio:false,scales:{r:{min:0,max:100,ticks:{stepSize:20,color:cs.text,backdropColor:'transparent'},grid:{color:cs.grid},pointLabels:{color:cs.text,font:{size:10}}}},plugins:{legend:{display:false}}}});
  window.__charts.sub=new Chart(document.getElementById('chartSubscores'),{type:'bar',data:{labels:['Speed','Scarcity','Competition','Overall'],datasets:[{data:[speedScore,scarcityScore,compScore,agilityScore],backgroundColor:[cs.c1,cs.c3,cs.c2,cs.c5]}]},options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{min:0,max:100,ticks:{color:cs.text},grid:{color:cs.grid}}}}});
  const tbody=document.getElementById('factorBody');if(tbody){tbody.innerHTML='';
  const factors=[['Days on Market',dom+'d',Math.round(domScore),'Speed'],['List-to-Close',ltc+'d',Math.round(ltcScore),'Speed'],['Price Reductions',priceRedux+'%',Math.round(priceReduxScore),'Speed'],['Months Supply',supply,Math.round(supplyScore),'Scarcity'],['Absorption Rate',absorption+'%',Math.round(absorpScore),'Scarcity'],['New Listings/Mo',newList,Math.round(listScore),'Scarcity'],['Offers/Listing',offers,Math.round(offerScore),'Competition'],['% Over Asking',overAsk+'%',Math.round(overAskScore),'Competition'],['Cash Buyers',cashPct+'%',Math.round(cashScore),'Competition']];
  factors.forEach(f=>{const cls=f[2]>=70?'kpi-negative':f[2]>=40?'':'kpi-positive';tbody.innerHTML+=`<tr><td>${f[3]}</td><td>${f[0]}</td><td class="text-right">${f[1]}</td><td class="text-right"><span class="${cls}">${f[2]}/100</span></td></tr>`;});}
  showResults();}