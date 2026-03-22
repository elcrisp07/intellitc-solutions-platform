/* ============================================================
   Buy Before You Sell Calculator — IntelliTC Solutions
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
  const curValue=parseNum(document.getElementById('curValue').value);
  const curMortBal=parseNum(document.getElementById('curMortBal').value);
  const curMortPmt=parseNum(document.getElementById('curMortPmt').value);
  const curCarry=parseNum(document.getElementById('curCarry').value);
  const sellCostPct=parseNum(document.getElementById('sellCostPct').value)/100;
  const newPrice=parseNum(document.getElementById('newPrice').value);
  const newDPPct=parseNum(document.getElementById('newDPPct').value)/100;
  const newRate=parseNum(document.getElementById('newRate').value)/100;
  const newTerm=parseNum(document.getElementById('newTerm').value);
  const newCarry=parseNum(document.getElementById('newCarry').value);
  const bridgeRate=parseNum(document.getElementById('bridgeRate').value)/100;
  const bridgeFee=parseNum(document.getElementById('bridgeFee').value)/100;
  const estSaleMonths=parseNum(document.getElementById('estSaleMonths').value);

  /* New home mortgage */
  const newDP=newPrice*newDPPct;
  const newLoan=newPrice-newDP;
  const nmr=newRate/12;const nn=newTerm*12;
  const newMortPmt=nmr>0?newLoan*(nmr*Math.pow(1+nmr,nn))/(Math.pow(1+nmr,nn)-1):newLoan/nn;

  /* Sale proceeds */
  const sellCosts=curValue*sellCostPct;
  const netFromSale=curValue-curMortBal-sellCosts;

  /* Monthly double carry */
  const curTotal=curMortPmt+curCarry;
  const newTotal=newMortPmt+newCarry;
  const doubleCarry=curTotal+newTotal;

  /* Bridge loan (covers down payment from current equity) */
  const bridgeAmt=newDP;
  const bridgeMoRate=bridgeRate/12;
  const bridgeInterestMo=bridgeAmt*bridgeMoRate;
  const bridgeFeeAmt=bridgeAmt*bridgeFee;

  /* Total transition cost at estimated timeline */
  const totalDoubleCarry=doubleCarry*estSaleMonths;
  const totalBridgeInt=bridgeInterestMo*estSaleMonths;
  const totalTransition=totalDoubleCarry+bridgeFeeAmt+totalBridgeInt+sellCosts;

  /* Break-even: months where net sale proceeds cover cumulative costs */
  let breakEvenMo=0;
  for(let m=1;m<=24;m++){
    const cumCost=(doubleCarry+bridgeInterestMo)*m+bridgeFeeAmt;
    if(netFromSale>=cumCost&&breakEvenMo===0) breakEvenMo=m;
  }

  /* KPIs */
  document.getElementById('kpiDoubleCarry').textContent=formatCurrency(doubleCarry);
  document.getElementById('kpiDoubleCarryDetail').textContent=formatCurrency(curTotal)+' current + '+formatCurrency(newTotal)+' new';
  document.getElementById('kpiTransitionCost').textContent=formatCurrency(totalTransition);
  document.getElementById('kpiTransitionCostDetail').textContent='Over '+estSaleMonths+' month timeline';
  document.getElementById('kpiNetFromSale').textContent=formatCurrency(netFromSale);
  document.getElementById('kpiNetFromSale').className='kpi-value '+(netFromSale>=0?'kpi-positive':'kpi-negative');
  document.getElementById('kpiNetFromSaleDetail').textContent=formatCurrency(curValue)+' value - '+formatCurrency(curMortBal)+' mortgage - '+formatCurrency(sellCosts)+' costs';
  document.getElementById('kpiBreakEven').textContent=breakEvenMo>0?breakEvenMo+' months':'> 24 months';
  document.getElementById('kpiBreakEvenDetail').textContent=breakEvenMo>0?'Sale proceeds cover carry costs':'May need additional funds';

  /* Charts */
  destroyCharts();const cs=getCS();

  /* Cumulative cost timeline */
  const tLabels=[];const cumCosts=[];const cumBridge=[];
  for(let m=1;m<=12;m++){
    tLabels.push('Mo '+m);
    cumCosts.push(Math.round(doubleCarry*m));
    cumBridge.push(Math.round((doubleCarry+bridgeInterestMo)*m+bridgeFeeAmt));
  }
  window.__charts.timeline=new Chart(document.getElementById('chartTimeline'),{type:'line',data:{labels:tLabels,datasets:[
    {label:'Double-Carry Only',data:cumCosts,borderColor:cs.c1,tension:0.3},
    {label:'With Bridge Loan',data:cumBridge,borderColor:cs.c2,borderDash:[5,3],tension:0.3},
    {label:'Net Sale Proceeds',data:Array(12).fill(Math.round(netFromSale)),borderColor:cs.c3,borderDash:[2,4],pointRadius:0}
  ]},options:{...chartOpts('','line'),scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  /* Scenario comparison */
  const sellFirstCost=curCarry*2+newCarry*0;/* minimal — sell, rent, then buy */
  const buyFirstCost=totalDoubleCarry+bridgeFeeAmt+totalBridgeInt;
  const simultCost=doubleCarry*1+bridgeFeeAmt;/* 1 month overlap */
  window.__charts.scenario=new Chart(document.getElementById('chartScenario'),{type:'bar',data:{labels:['Sell First\n(temp housing)','Buy First\n('+estSaleMonths+' mo carry)','Simultaneous\n(1 mo overlap)'],datasets:[
    {label:'Total Strategy Cost',data:[Math.round(curCarry*estSaleMonths+2000),Math.round(buyFirstCost),Math.round(simultCost)],backgroundColor:[cs.c3,cs.c2,cs.c1]}
  ]},options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  /* Table */
  const tbody=document.getElementById('carryBody');tbody.innerHTML='';
  let cumTotal=0;
  for(let m=1;m<=Math.min(estSaleMonths+3,12);m++){
    const bridgeInt=bridgeInterestMo;
    const moTotal=doubleCarry+bridgeInt;
    cumTotal+=moTotal;
    const isSold=m>estSaleMonths;
    tbody.innerHTML+='<tr'+(isSold?' style="opacity:0.5"':'')+'><td>'+m+(isSold?' (sold)':'')+'</td><td class="text-right">'+formatCurrency(curTotal)+'</td><td class="text-right">'+formatCurrency(newTotal)+'</td><td class="text-right">'+formatCurrency(bridgeInt)+'</td><td class="text-right">'+formatCurrency(moTotal)+'</td><td class="text-right">'+formatCurrency(cumTotal)+'</td></tr>';
  }
  tbody.innerHTML+='<tr style="font-weight:700;border-top:2px solid var(--color-divider)"><td>Total ('+estSaleMonths+' mo)</td><td></td><td></td><td class="text-right">'+formatCurrency(totalBridgeInt)+'</td><td></td><td class="text-right highlight">'+formatCurrency((doubleCarry+bridgeInterestMo)*estSaleMonths)+'</td></tr>';
  showResults();}