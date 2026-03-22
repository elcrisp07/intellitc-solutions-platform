/* ============================================================
   Seller Net Sheet Calculator — IntelliTC Solutions
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
  const salePrice=parseNum(document.getElementById('salePrice').value);
  const mortPayoff=parseNum(document.getElementById('mortPayoff').value);
  const secondMort=parseNum(document.getElementById('secondMort').value);
  const listComm=parseNum(document.getElementById('listComm').value)/100;
  const buyerComm=parseNum(document.getElementById('buyerComm').value)/100;
  const titleIns=parseNum(document.getElementById('titleIns').value);
  const escrowFees=parseNum(document.getElementById('escrowFees').value);
  const transferTax=parseNum(document.getElementById('transferTax').value)/100;
  const recordingFees=parseNum(document.getElementById('recordingFees').value);
  const hoaTransfer=parseNum(document.getElementById('hoaTransfer').value);
  const warranty=parseNum(document.getElementById('warranty').value);
  const repairCredits=parseNum(document.getElementById('repairCredits').value);
  const stagingPrep=parseNum(document.getElementById('stagingPrep').value);
  const liens=parseNum(document.getElementById('liens').value);
  const proratedTax=parseNum(document.getElementById('proratedTax').value);

  /* Calculations */
  const listCommAmt=salePrice*listComm;
  const buyerCommAmt=salePrice*buyerComm;
  const totalComm=listCommAmt+buyerCommAmt;
  const transferTaxAmt=salePrice*transferTax;

  const totalCosts=totalComm+titleIns+escrowFees+transferTaxAmt+recordingFees+hoaTransfer+warranty+repairCredits+stagingPrep+liens+proratedTax;
  const netProceeds=salePrice-mortPayoff-secondMort-totalCosts;
  const costPct=salePrice>0?(totalCosts/salePrice*100):0;
  const perDollar=salePrice>0?(netProceeds/salePrice):0;

  document.getElementById('kpiNet').textContent=formatCurrency(netProceeds);
  document.getElementById('kpiNet').className='kpi-value '+(netProceeds>=0?'kpi-positive':'kpi-negative');
  document.getElementById('kpiNetDetail').textContent=netProceeds>=0?'Your estimated check at closing':'You may owe money at closing';
  document.getElementById('kpiCosts').textContent=formatCurrency(totalCosts);
  document.getElementById('kpiCostsDetail').textContent='Commissions + fees + credits';
  document.getElementById('kpiCostPct').textContent=formatPct(costPct);
  document.getElementById('kpiCostPctDetail').textContent=formatCurrency(totalCosts)+' out of '+formatCurrency(salePrice);
  document.getElementById('kpiPerDollar').textContent='$'+perDollar.toFixed(2);
  document.getElementById('kpiPerDollarDetail').textContent='You keep $'+perDollar.toFixed(2)+' of every dollar';

  destroyCharts();const cs=getCS();

  /* Chart 1: Waterfall — sale price minus each category = net */
  const wLabels=['Sale Price','Mortgage Payoff','2nd Mortgage','Commissions','Title & Escrow','Taxes & Fees','Other Costs','Net Proceeds'];
  const wItems=[mortPayoff,secondMort,totalComm,titleIns+escrowFees,transferTaxAmt+recordingFees+hoaTransfer,warranty+repairCredits+stagingPrep+liens+proratedTax];
  const wData=[];
  let running=salePrice;
  /* Sale price bar */
  wData.push([0,salePrice]);
  /* Deduction bars (floating) */
  wItems.forEach(amt=>{
    if(amt>0){wData.push([running-amt,running]);running-=amt;}
    else{wData.push([running,running]);}
  });
  /* Net proceeds bar */
  wData.push([0,Math.max(0,netProceeds)]);

  window.__charts.wf=new Chart(document.getElementById('chartWaterfall'),{type:'bar',data:{
    labels:wLabels,
    datasets:[{data:wData,backgroundColor:wLabels.map((_,i)=>i===0?cs.c1:i===wLabels.length-1?(netProceeds>=0?cs.c1:cs.c2):cs.c2)}]
  },options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text,maxRotation:45},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  /* Chart 2: Doughnut of cost categories */
  const costParts=[listCommAmt,buyerCommAmt,titleIns,escrowFees,transferTaxAmt,recordingFees+hoaTransfer,warranty,repairCredits,stagingPrep+liens+proratedTax].filter(v=>v>0);
  const costLabels=['Listing Agent','Buyer Agent','Title Insurance','Escrow Fees','Transfer Tax','Recording/HOA','Home Warranty','Repair Credits','Other'].filter((_,i)=>[listCommAmt,buyerCommAmt,titleIns,escrowFees,transferTaxAmt,recordingFees+hoaTransfer,warranty,repairCredits,stagingPrep+liens+proratedTax][i]>0);
  window.__charts.costs=new Chart(document.getElementById('chartCosts'),{type:'doughnut',data:{
    labels:costLabels,datasets:[{data:costParts,backgroundColor:[cs.c1,cs.c2,cs.c3,cs.c4,cs.c5,cs.c6,cs.c7,cs.c8,cs.c1]}]
  },options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{color:cs.text,font:{size:11}}}}}});

  /* Table: Line-by-line with running total */
  const tbody=document.getElementById('netBody');tbody.innerHTML='';
  let runTotal=salePrice;
  const lines=[
    ['Sale Price',salePrice,'Starting point','highlight'],
    ['Less: Mortgage Payoff',-mortPayoff,formatCurrency(mortPayoff)+' remaining',''],
    ['Less: Second Mortgage/HELOC',-secondMort,'',''],
    ['Less: Listing Agent ('+formatPct(listComm*100)+')',-listCommAmt,'',''],
    ['Less: Buyer Agent ('+formatPct(buyerComm*100)+')',-buyerCommAmt,'',''],
    ['Less: Title Insurance',-titleIns,'',''],
    ['Less: Escrow / Settlement',-escrowFees,'',''],
    ['Less: Transfer Tax ('+formatPct(transferTax*100)+')',-transferTaxAmt,'',''],
    ['Less: Recording Fees',-recordingFees,'',''],
    ['Less: HOA Transfer Fee',-hoaTransfer,'',''],
    ['Less: Home Warranty',-warranty,'Buyer incentive',''],
    ['Less: Repair Credits',-repairCredits,'',''],
    ['Less: Staging / Prep',-stagingPrep,'',''],
    ['Less: Liens / Judgments',-liens,'',''],
    ['Less: Prorated Taxes',-proratedTax,'','']
  ];
  lines.forEach(r=>{
    const amt=r[1];
    if(r[0]!=='Sale Price'&&Math.abs(amt)===0)return;
    runTotal+=r[0]==='Sale Price'?0:amt;
    const style=r[3]==='highlight'?'font-weight:600':'';
    const displayAmt=r[0]==='Sale Price'?formatCurrency(amt):'-'+formatCurrency(Math.abs(amt));
    tbody.innerHTML+='<tr style="'+style+'"><td>'+r[0]+'</td><td class="text-right">'+displayAmt+'</td><td class="text-right">'+formatCurrency(runTotal)+'</td></tr>';
  });
  tbody.innerHTML+='<tr style="font-weight:700;border-top:2px solid var(--color-divider);color:'+(netProceeds>=0?'var(--color-success)':'var(--color-error)')+'"><td>Estimated Net Proceeds</td><td class="text-right">'+formatCurrency(netProceeds)+'</td><td class="text-right">'+formatCurrency(netProceeds)+'</td></tr>';
  showResults();}