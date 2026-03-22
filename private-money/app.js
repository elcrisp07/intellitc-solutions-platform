/* ============================================================
   Private Money Lending Calculator — IntelliTC Solutions
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
  const propValue=parseNum(document.getElementById('propValue').value);
  const intRate=parseNum(document.getElementById('intRate').value)/100;
  const loanTerm=parseNum(document.getElementById('loanTerm').value);
  const points=parseNum(document.getElementById('points').value)/100;
  const origFee=parseNum(document.getElementById('origFee').value);
  const pmtType=document.getElementById('pmtType').value;
  const exitMonth=Math.min(parseNum(document.getElementById('exitMonth').value),loanTerm);
  const exitCosts=parseNum(document.getElementById('exitCosts').value);

  const mr=intRate/12;
  const pointsCost=loanAmt*points;
  const ltv=propValue>0?loanAmt/propValue*100:0;

  /* Monthly payment */
  let monthlyPmt;
  if(pmtType==='io'){
    monthlyPmt=loanAmt*mr;
  } else {
    const n=loanTerm;
    monthlyPmt=mr>0?loanAmt*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):loanAmt/n;
  }

  /* Amortization schedule */
  let bal=loanAmt;let totalInt=0;
  const months=[];const lenderIncome=[];const balances=[];const intParts=[];const prinParts=[];
  for(let m=1;m<=loanTerm;m++){
    const ip=bal*mr;
    const pp=pmtType==='io'?0:monthlyPmt-ip;
    totalInt+=ip;bal-=pp;
    months.push('Mo '+m);
    lenderIncome.push(Math.round(ip));
    balances.push(Math.round(Math.max(0,bal)));
    intParts.push(Math.round(ip));
    prinParts.push(Math.round(pp));
  }

  /* Lender totals */
  const totalIntEarned=intParts.reduce((s,v)=>s+v,0);
  const lenderTotalReturn=totalIntEarned+pointsCost+origFee;
  const lenderInvested=loanAmt-pointsCost-origFee;
  const lenderAnnualYield=lenderInvested>0?(lenderTotalReturn/(loanTerm/12))/loanAmt*100:0;

  /* Borrower effective APR */
  const borrowerTotalCost=totalIntEarned+pointsCost+origFee+exitCosts;
  const borrowerNetProceeds=loanAmt-pointsCost-origFee;
  const effectiveAPR=borrowerNetProceeds>0?(borrowerTotalCost/(loanTerm/12))/borrowerNetProceeds*100:0;

  /* KPIs */
  document.getElementById('kpiLenderYield').textContent=formatPct(lenderAnnualYield);
  document.getElementById('kpiLenderYieldDetail').textContent=formatCurrency(lenderTotalReturn)+' total return';
  document.getElementById('kpiBorrowerAPR').textContent=formatPct(effectiveAPR);
  document.getElementById('kpiBorrowerAPRDetail').textContent=formatCurrency(borrowerTotalCost)+' total cost';
  document.getElementById('kpiMonthlyPmt').textContent=formatCurrency(monthlyPmt);
  document.getElementById('kpiMonthlyPmtDetail').textContent=pmtType==='io'?'Interest-only':'Fully amortized';
  document.getElementById('kpiLTV').textContent=formatPct(ltv);
  const ltvCls=ltv<=65?'kpi-positive':ltv<=80?'':'kpi-negative';
  document.getElementById('kpiLTV').className='kpi-value '+ltvCls;
  document.getElementById('kpiLTVDetail').textContent=ltv<=65?'Conservative':ltv<=80?'Standard':'High risk';

  /* Charts */
  destroyCharts();const cs=getCS();

  window.__charts.income=new Chart(document.getElementById('chartIncome'),{type:'bar',data:{labels:months,datasets:[
    {label:'Interest',data:intParts,backgroundColor:cs.c1},
    {label:'Principal',data:prinParts,backgroundColor:cs.c3}
  ]},options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins},scales:{x:{stacked:true,ticks:{color:cs.text,maxTicksLimit:12},grid:{display:false}},y:{stacked:true,ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  window.__charts.cost=new Chart(document.getElementById('chartCost'),{type:'doughnut',data:{labels:['Interest Paid','Points','Origination Fee','Exit Costs'],datasets:[{data:[totalIntEarned,pointsCost,origFee,exitCosts],backgroundColor:[cs.c1,cs.c2,cs.c3,cs.c5]}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{color:cs.text}}}}});

  /* Table */
  const tbody=document.getElementById('schedBody');tbody.innerHTML='';
  let runBal=loanAmt;
  for(let m=1;m<=loanTerm;m++){
    const ip=runBal*mr;const pp=pmtType==='io'?0:monthlyPmt-ip;runBal-=pp;
    tbody.innerHTML+='<tr><td>'+m+'</td><td class="text-right">'+formatCurrency(monthlyPmt)+'</td><td class="text-right">'+formatCurrency(ip)+'</td><td class="text-right">'+formatCurrency(pp)+'</td><td class="text-right">'+formatCurrency(Math.max(0,runBal))+'</td></tr>';
  }
  tbody.innerHTML+='<tr style="font-weight:700;border-top:2px solid var(--color-divider)"><td>Totals</td><td class="text-right">'+formatCurrency(monthlyPmt*loanTerm)+'</td><td class="text-right">'+formatCurrency(totalIntEarned)+'</td><td class="text-right">'+formatCurrency(loanAmt-Math.max(0,bal))+'</td><td></td></tr>';
  showResults();}