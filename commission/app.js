/* ============================================================
   Commission Calculator — IntelliTC Solutions
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
  const salePrice=parseNum(document.getElementById('salePrice').value);
  const commPct=parseNum(document.getElementById('commPct').value)/100;
  const flatFee=parseNum(document.getElementById('flatFee').value);
  const teamSplit=parseNum(document.getElementById('teamSplit').value)/100;
  const brokerSplit=parseNum(document.getElementById('brokerSplit').value)/100;
  const txnFee=parseNum(document.getElementById('txnFee').value);
  const eoFee=parseNum(document.getElementById('eoFee').value);
  const dealsYear=parseNum(document.getElementById('dealsYear').value);
  const avgPrice=parseNum(document.getElementById('avgPrice').value);

  /* Single deal calculation */
  const grossComm=flatFee>0?flatFee:salePrice*commPct;
  const afterTeam=grossComm*teamSplit;
  const teamTake=grossComm-afterTeam;
  const afterBroker=afterTeam*brokerSplit;
  const brokerTake=afterTeam-afterBroker;
  const netTakeHome=afterBroker-txnFee-eoFee;
  const effectiveRate=salePrice>0?(netTakeHome/salePrice*100):0;

  /* Annual projection based on avg price */
  const avgGross=flatFee>0?flatFee:avgPrice*commPct;
  const avgAfterTeam=avgGross*teamSplit;
  const avgAfterBroker=avgAfterTeam*brokerSplit;
  const avgNet=avgAfterBroker-txnFee-eoFee;
  const annualNet=avgNet*dealsYear;

  document.getElementById('kpiGrossComm').textContent=formatCurrency(grossComm);
  document.getElementById('kpiGrossCommDetail').textContent=formatPct(commPct*100)+' of '+formatCurrency(salePrice);
  document.getElementById('kpiNetTake').textContent=formatCurrency(netTakeHome);
  document.getElementById('kpiNetTake').className='kpi-value '+(netTakeHome>0?'kpi-positive':'kpi-negative');
  document.getElementById('kpiNetTakeDetail').textContent='Effective rate: '+formatPct(effectiveRate);
  document.getElementById('kpiPerDeal').textContent=formatCurrency(avgNet);
  document.getElementById('kpiPerDealDetail').textContent='On avg '+formatCurrency(avgPrice)+' sale';
  document.getElementById('kpiAnnualNet').textContent=formatCurrency(annualNet);
  document.getElementById('kpiAnnualNetDetail').textContent=dealsYear+' deals × '+formatCurrency(avgNet)+'/deal';

  destroyCharts();const cs=getCS();

  /* Chart 1: Waterfall — gross to net */
  const wLabels=['Gross Commission','Team Split','Broker Split','Transaction Fee','E&O Fee','Your Net'];
  const wData=[];
  let running=0;
  /* Gross */
  wData.push([0,grossComm]);running=grossComm;
  /* Team split deduction */
  wData.push([running-teamTake,running]);running-=teamTake;
  /* Broker split deduction */
  wData.push([running-brokerTake,running]);running-=brokerTake;
  /* Txn fee */
  wData.push([running-txnFee,running]);running-=txnFee;
  /* E&O */
  wData.push([running-eoFee,running]);running-=eoFee;
  /* Net */
  wData.push([0,netTakeHome]);

  window.__charts.wf=new Chart(document.getElementById('chartWaterfall'),{type:'bar',data:{
    labels:wLabels,
    datasets:[{data:wData,backgroundColor:wLabels.map((_,i)=>i===0?cs.c1:i===wLabels.length-1?cs.c1:cs.c2)}]
  },options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  /* Chart 2: Annual projection at varying deal counts */
  const dealCounts=[6,8,10,12,15,18,24];
  const annualData=dealCounts.map(d=>Math.round(avgNet*d));
  window.__charts.annual=new Chart(document.getElementById('chartAnnual'),{type:'bar',data:{
    labels:dealCounts.map(d=>d+' deals'),
    datasets:[{label:'Annual Net Income',data:annualData,backgroundColor:dealCounts.map(d=>d===dealsYear?cs.c1:cs.c3)}]
  },options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  /* Chart 3: Split breakdown doughnut */
  const splitData=[netTakeHome,teamTake,brokerTake,txnFee+eoFee].filter(v=>v>0);
  const splitLabels=['Your Net','Team Lead','Brokerage','Fees'].filter((_,i)=>[netTakeHome,teamTake,brokerTake,txnFee+eoFee][i]>0);
  window.__charts.split=new Chart(document.getElementById('chartSplit'),{type:'doughnut',data:{
    labels:splitLabels,datasets:[{data:splitData,backgroundColor:[cs.c1,cs.c2,cs.c5,cs.c6]}]
  },options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{color:cs.text}}}}});

  /* Table */
  const tbody=document.getElementById('commBody');tbody.innerHTML='';
  const trows=[
    ['Gross Commission (one side)',formatCurrency(grossComm),'100%'],
    ['Less: Team Lead Share','-'+formatCurrency(teamTake),formatPct((1-teamSplit)*100)],
    ['After Team Split',formatCurrency(afterTeam),formatPct(teamSplit*100)],
    ['Less: Brokerage Share','-'+formatCurrency(brokerTake),formatPct((1-brokerSplit)*100)+' of your share'],
    ['After Broker Split',formatCurrency(afterBroker),formatPct(teamSplit*brokerSplit*100)+' of gross'],
    ['Less: Transaction Fee','-'+formatCurrency(txnFee),''],
    ['Less: E&O Fee','-'+formatCurrency(eoFee),''],
    ['Net Take-Home',formatCurrency(netTakeHome),formatPct(effectiveRate)+' effective']
  ];
  trows.forEach((r,i)=>{
    const style=i===trows.length-1?'font-weight:700;border-top:2px solid var(--color-divider);color:'+(netTakeHome>=0?'var(--color-success)':'var(--color-error)'):'';
    tbody.innerHTML+=`<tr style="${style}"><td>${r[0]}</td><td class="text-right">${r[1]}</td><td class="text-right">${r[2]}</td></tr>`;
  });
  showResults();}