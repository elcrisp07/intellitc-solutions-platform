/* ============================================================
   Lease-Option Calculator — IntelliTC Solutions
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
  const propValue=parseNum(document.getElementById('propValue').value);
  const optionPrice=parseNum(document.getElementById('optionPrice').value);
  const optionFee=parseNum(document.getElementById('optionFee').value);
  const leaseTerm=parseNum(document.getElementById('leaseTerm').value);
  const leasePmt=parseNum(document.getElementById('leasePmt').value);
  const rentCreditPct=parseNum(document.getElementById('rentCreditPct').value)/100;
  const marketRent=parseNum(document.getElementById('marketRent').value);
  const appreciation=parseNum(document.getElementById('appreciation').value)/100;
  const futureDPPct=parseNum(document.getElementById('futureDPPct').value)/100;
  const futureRate=parseNum(document.getElementById('futureRate').value)/100;

  /* Derived */
  const monthlyCredit=leasePmt*rentCreditPct;
  const totalCredits=monthlyCredit*leaseTerm;
  const effectivePrice=optionPrice-optionFee-totalCredits;
  const years=leaseTerm/12;
  const futureValue=propValue*Math.pow(1+appreciation,years);
  const equityAtExercise=futureValue-effectivePrice;
  const premiumOverMkt=leasePmt-marketRent;

  /* If bought now comparison */
  const buyNowDP=propValue*futureDPPct;
  const buyNowLoan=propValue-buyNowDP;
  const mr=futureRate/12;const n=30*12;
  const buyNowPmt=mr>0?buyNowLoan*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):buyNowLoan/n;
  const totalLeaseCost=leasePmt*leaseTerm+optionFee;
  const totalBuyNowCost=buyNowPmt*leaseTerm+buyNowDP;

  /* Mortgage at exercise */
  const exLoan=effectivePrice*(1-futureDPPct);
  const exPmt=mr>0?exLoan*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):exLoan/n;

  /* KPIs */
  document.getElementById('kpiTotalCredits').textContent=formatCurrency(totalCredits);
  document.getElementById('kpiTotalCreditsDetail').textContent=formatCurrency(monthlyCredit)+'/mo × '+leaseTerm+' months';
  document.getElementById('kpiEffectivePrice').textContent=formatCurrency(effectivePrice);
  document.getElementById('kpiEffectivePriceDetail').textContent=formatCurrency(optionPrice-effectivePrice)+' below option price';
  document.getElementById('kpiEquityExercise').textContent=formatCurrency(equityAtExercise);
  document.getElementById('kpiEquityExercise').className='kpi-value '+(equityAtExercise>=0?'kpi-positive':'kpi-negative');
  document.getElementById('kpiEquityExerciseDetail').textContent='Property worth '+formatCurrency(futureValue)+' at exercise';
  document.getElementById('kpiPremiumMkt').textContent=formatCurrency(premiumOverMkt);
  document.getElementById('kpiPremiumMktDetail').textContent=premiumOverMkt>0?formatCurrency(premiumOverMkt*12)+'/yr premium':'At or below market rent';

  /* Charts */
  destroyCharts();const cs=getCS();

  /* Equity buildup chart */
  const months=[];const eqData=[];const creditData=[];
  let cumCredits=optionFee;
  for(let m=1;m<=leaseTerm;m++){
    cumCredits+=monthlyCredit;
    const fv=propValue*Math.pow(1+appreciation,m/12);
    const ep=optionPrice-cumCredits;
    months.push(m%6===0||m===1||m===leaseTerm?'Mo '+m:'');
    eqData.push(Math.round(fv-ep));
    creditData.push(Math.round(cumCredits));
  }
  window.__charts.equity=new Chart(document.getElementById('chartEquity'),{type:'line',data:{labels:months,datasets:[
    {label:'Equity at Exercise',data:eqData,borderColor:cs.c1,backgroundColor:cs.c1+'22',fill:true,tension:0.3},
    {label:'Accumulated Credits',data:creditData,borderColor:cs.c3,backgroundColor:cs.c3+'22',fill:true,tension:0.3}
  ]},options:{...chartOpts('','line'),scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  /* Comparison bar chart */
  window.__charts.compare=new Chart(document.getElementById('chartCompare'),{type:'bar',data:{labels:['Upfront Cost','Monthly Payment','Total Cost ('+leaseTerm+' mo)','Equity Gained'],datasets:[
    {label:'Lease-Option',data:[optionFee,leasePmt,totalLeaseCost,equityAtExercise],backgroundColor:cs.c1},
    {label:'Buy Now',data:[buyNowDP,buyNowPmt,totalBuyNowCost,futureValue-propValue],backgroundColor:cs.c2}
  ]},options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins},scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  /* Table */
  const tbody=document.getElementById('creditBody');tbody.innerHTML='';
  let running=optionFee;
  for(let m=1;m<=leaseTerm;m++){
    running+=monthlyCredit;
    if(m<=12||m%6===0||m===leaseTerm){
      const fv=propValue*Math.pow(1+appreciation,m/12);
      tbody.innerHTML+='<tr><td>'+m+'</td><td class="text-right">'+formatCurrency(leasePmt)+'</td><td class="text-right">'+formatCurrency(monthlyCredit)+'</td><td class="text-right">'+formatCurrency(running)+'</td><td class="text-right">'+formatCurrency(fv)+'</td></tr>';
    }
  }
  tbody.innerHTML+='<tr style="font-weight:700;border-top:2px solid var(--color-divider)"><td>Exercise</td><td></td><td></td><td class="text-right">'+formatCurrency(totalCredits+optionFee)+'</td><td class="text-right highlight">'+formatCurrency(futureValue)+'</td></tr>';
  showResults();}