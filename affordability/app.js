/* ============================================================
   Affordability Calculator — IntelliTC Solutions
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
  const income=parseNum(document.getElementById('income').value);
  const debts=parseNum(document.getElementById('debts').value);
  const rate=parseNum(document.getElementById('rate').value)/100;
  const term=parseNum(document.getElementById('term').value);
  const dpAvail=parseNum(document.getElementById('dp').value);
  const taxRate=parseNum(document.getElementById('taxRate').value)/100;
  const insYr=parseNum(document.getElementById('insYr').value);
  const hoa=parseNum(document.getElementById('hoa').value);
  const moIncome=income/12;

  /* 3 DTI levels: conservative(25% front/36% back), moderate(28%/43%), aggressive(36%/50%) */
  const levels=[
    {name:'Conservative',frontMax:0.25,backMax:0.36},
    {name:'Moderate',frontMax:0.28,backMax:0.43},
    {name:'Aggressive',frontMax:0.36,backMax:0.50}
  ];

  function solveMaxPrice(frontPct,backPct){
    /* Max housing from front-end DTI */
    const maxHousingFront=moIncome*frontPct;
    /* Max housing from back-end DTI (housing+debts) */
    const maxHousingBack=moIncome*backPct-debts;
    /* Binding constraint */
    const maxHousing=Math.max(0,Math.min(maxHousingFront,maxHousingBack));
    /* Deduct non-mortgage items — we iterate since tax depends on price */
    const mr=rate/12;const n=term*12;
    /* Budget for P&I = maxHousing - tax/mo - ins/mo - hoa */
    /* tax/mo = price*taxRate/12, so: PI = maxHousing - price*taxRate/12 - insYr/12 - hoa */
    /* PI = price*(1-dpPct) * [mr*(1+mr)^n / ((1+mr)^n - 1)] */
    /* Let dpPct = dpAvail/price. We iterate to solve. */
    let price=maxHousing*150;/* initial guess */
    for(let i=0;i<20;i++){
      const dpPct=Math.min(dpAvail/price,1);
      const loan=price*(1-dpPct);
      const pi=mr>0?loan*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):loan/n;
      const taxMo=price*taxRate/12;
      const totalHousing=pi+taxMo+insYr/12+hoa;
      /* Adjust price proportionally */
      if(totalHousing<=0)break;
      price=price*(maxHousing/totalHousing);
      if(price<0)price=0;
    }
    /* Cap by available down payment: dpAvail must cover some down payment */
    const dpPct=Math.min(dpAvail/price,0.50);
    const loan=price*(1-dpPct);
    const pi=mr>0?loan*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):loan/n;
    const taxMo=price*taxRate/12;
    const totalPmt=pi+taxMo+insYr/12+hoa;
    const cashClose=dpAvail+price*0.03;/* down + ~3% closing */
    return{price:Math.max(0,price),loan:loan,pi:pi,taxMo:taxMo,insMo:insYr/12,hoa:hoa,totalPmt:totalPmt,dpPct:dpPct,cashClose:cashClose};
  }

  const results=levels.map(l=>({...l,...solveMaxPrice(l.frontMax,l.backMax)}));

  /* Use moderate as primary recommendation */
  const mod=results[1];
  const frontDTI=moIncome>0?(mod.totalPmt/moIncome*100):0;
  const backDTI=moIncome>0?((mod.totalPmt+debts)/moIncome*100):0;
  let rating='Comfortable';
  if(backDTI>45)rating='Stretched';
  else if(backDTI>38)rating='Moderate';
  else if(backDTI<=30)rating='Very Comfortable';

  document.getElementById('kpiMaxPrice').textContent=formatCurrency(mod.price);
  document.getElementById('kpiMaxPriceDetail').textContent='Moderate ('+formatPct(mod.frontMax*100)+' front-end DTI)';
  document.getElementById('kpiPayment').textContent=formatCurrency(mod.totalPmt);
  document.getElementById('kpiPaymentDetail').textContent='PITI + HOA at '+formatPct(rate*100)+' rate';
  document.getElementById('kpiCashClose').textContent=formatCurrency(mod.cashClose);
  document.getElementById('kpiCashCloseDetail').textContent=formatCurrency(dpAvail)+' down + 3% closing';
  document.getElementById('kpiRating').textContent=rating;
  document.getElementById('kpiRating').className='kpi-value '+(backDTI<=36?'kpi-positive':backDTI<=43?'':'kpi-negative');
  document.getElementById('kpiRatingDetail').textContent='Front DTI '+formatPct(frontDTI)+' / Back DTI '+formatPct(backDTI);

  destroyCharts();const cs=getCS();

  /* Chart 1: bar chart of max price at each level */
  window.__charts.levels=new Chart(document.getElementById('chartLevels'),{type:'bar',data:{
    labels:results.map(r=>r.name),
    datasets:[{label:'Max Purchase Price',data:results.map(r=>Math.round(r.price)),backgroundColor:[cs.c1,cs.c3,cs.c2]}]
  },options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  /* Chart 2: doughnut of moderate payment breakdown */
  const bkData=[mod.pi,mod.taxMo,mod.insMo,mod.hoa].filter(v=>v>0);
  const bkLabels=['Principal & Interest','Property Tax','Insurance','HOA'].filter((_,i)=>[mod.pi,mod.taxMo,mod.insMo,mod.hoa][i]>0);
  window.__charts.bd=new Chart(document.getElementById('chartBreakdown'),{type:'doughnut',data:{
    labels:bkLabels,datasets:[{data:bkData,backgroundColor:[cs.c1,cs.c2,cs.c3,cs.c5]}]
  },options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{color:cs.text}}}}});

  /* Chart 3: rate sensitivity */
  const rates=[];const prices=[];
  for(let r=rate-0.02;r<=rate+0.021;r+=0.005){
    rates.push((r*100).toFixed(1)+'%');
    const mr2=r/12;const n2=term*12;
    /* Quick solve for moderate level */
    const maxH=Math.min(moIncome*0.28,moIncome*0.43-debts);
    let p=maxH*150;
    for(let j=0;j<15;j++){const dp2=Math.min(dpAvail/p,1);const ln=p*(1-dp2);const pi2=mr2>0?ln*(mr2*Math.pow(1+mr2,n2))/(Math.pow(1+mr2,n2)-1):ln/n2;const t2=p*taxRate/12;const tot=pi2+t2+insYr/12+hoa;if(tot<=0)break;p=p*(maxH/tot);}
    prices.push(Math.round(Math.max(0,p)));
  }
  window.__charts.sens=new Chart(document.getElementById('chartSensitivity'),{type:'line',data:{
    labels:rates,datasets:[{label:'Max Price (Moderate)',data:prices,borderColor:cs.c1,backgroundColor:cs.c1+'20',fill:true,tension:0.3,pointRadius:3}]
  },options:{...chartOpts('','line'),plugins:{...chartOpts('','line').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text},grid:{color:cs.grid}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  /* Table */
  const tbody=document.getElementById('affordBody');tbody.innerHTML='';
  results.forEach(r=>{
    const fDTI=moIncome>0?(r.totalPmt/moIncome*100):0;
    const bDTI=moIncome>0?((r.totalPmt+debts)/moIncome*100):0;
    tbody.innerHTML+=`<tr><td style="font-weight:600">${r.name}</td><td class="text-right">${formatCurrency(r.price)}</td><td class="text-right">${formatCurrency(r.totalPmt)}</td><td class="text-right">${formatPct(r.dpPct*100)}</td><td class="text-right">${formatPct(fDTI)}</td><td class="text-right">${formatPct(bDTI)}</td><td class="text-right">${formatCurrency(r.cashClose)}</td></tr>`;
  });
  showResults();}