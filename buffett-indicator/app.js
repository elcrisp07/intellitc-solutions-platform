/* ============================================================
   Buffett Indicator — IntelliTC Solutions
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

function calculate(){const hv=parseNum(document.getElementById('totalHousingValue').value);const gdp=parseNum(document.getElementById('gdp').value);const histAvg=parseNum(document.getElementById('historicalAvg').value);const localPrice=parseNum(document.getElementById('localMedianPrice').value);const localIncome=parseNum(document.getElementById('localMedianIncome').value);const localHistPI=parseNum(document.getElementById('localPriceToIncome').value);
  if(gdp<=0)return alert('GDP must be greater than 0.');
  const ratio=hv/gdp;const deviation=histAvg>0?((ratio-histAvg)/histAvg*100):0;
  let zone='Fairly Valued',zoneCls='';
  if(ratio>histAvg*1.25){zone='Significantly Overvalued';zoneCls='kpi-negative';}
  else if(ratio>histAvg*1.1){zone='Moderately Overvalued';zoneCls='kpi-negative';}
  else if(ratio>histAvg*0.9){zone='Fairly Valued';zoneCls='kpi-positive';}
  else if(ratio>histAvg*0.75){zone='Moderately Undervalued';zoneCls='kpi-positive';}
  else{zone='Significantly Undervalued';zoneCls='kpi-positive';}
  const localPI=localIncome>0?localPrice/localIncome:0;const localDev=localHistPI>0?((localPI-localHistPI)/localHistPI*100):0;
  document.getElementById('kpiRatio').textContent=ratio.toFixed(2)+'x';document.getElementById('kpiRatioDetail').textContent='Housing Value / GDP';
  document.getElementById('kpiZone').textContent=zone;document.getElementById('kpiZone').className='kpi-value '+zoneCls;document.getElementById('kpiZoneDetail').textContent='Based on '+histAvg+'x historical average';
  document.getElementById('kpiLocalPI').textContent=localPI.toFixed(1)+'x';document.getElementById('kpiLocalPIDetail').textContent=(localDev>=0?'+':'')+localDev.toFixed(1)+'% vs historical '+localHistPI+'x';
  document.getElementById('kpiDeviation').textContent=(deviation>=0?'+':'')+deviation.toFixed(1)+'%';document.getElementById('kpiDeviation').className='kpi-value '+(Math.abs(deviation)<=10?'kpi-positive':'kpi-negative');document.getElementById('kpiDeviationDetail').textContent='Deviation from historical average';
  destroyCharts();const cs=getCS();
  // Gauge-style horizontal bar
  const zones=[{label:'Undervalued',min:0,max:histAvg*0.9,color:cs.c1},{label:'Fair Value',min:histAvg*0.9,max:histAvg*1.1,color:cs.c3},{label:'Overvalued',min:histAvg*1.1,max:histAvg*1.5,color:cs.c2}];
  window.__charts.gauge=new Chart(document.getElementById('chartGauge'),{type:'bar',data:{labels:zones.map(z=>z.label),datasets:[{data:zones.map(z=>z.max-z.min),backgroundColor:zones.map(z=>z.color),borderWidth:0}]},options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:function(item){const z=zones[item.dataIndex];return z.label+': '+z.min.toFixed(2)+'x – '+z.max.toFixed(2)+'x';}}},annotation:false},scales:{x:{stacked:true,ticks:{color:cs.text,callback:v=>v.toFixed(1)+'x'},grid:{color:cs.grid},title:{display:true,text:'Housing/GDP Ratio',color:cs.text}},y:{stacked:true,ticks:{color:cs.text},grid:{display:false}}}}});
  // Local market bar
  if(localPrice>0&&localIncome>0){
    window.__charts.local=new Chart(document.getElementById('chartLocal'),{type:'bar',data:{labels:['Current Price-to-Income','Historical Average'],datasets:[{data:[localPI,localHistPI],backgroundColor:[localPI>localHistPI*1.1?cs.c2:cs.c1,cs.c3]}]},options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>v.toFixed(1)+'x'},grid:{color:cs.grid}}}}});
  }
  showResults();}