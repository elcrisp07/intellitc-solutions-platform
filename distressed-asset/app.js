/* ============================================================
   Distressed Asset Calculator — IntelliTC Solutions
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

/* ---- Calculate ---- */
function calculate(){
  const mv=parseNum(document.getElementById('marketValue').value);
  const pp=parseNum(document.getElementById('purchasePrice').value);
  const repair=parseNum(document.getElementById('repairCosts').value);
  const backTax=parseNum(document.getElementById('backTaxes').value);
  const liens=parseNum(document.getElementById('liens').value);
  const closePct=parseNum(document.getElementById('closingPct').value)/100;
  const exit=document.getElementById('exitStrategy').value;
  const arv=parseNum(document.getElementById('arv').value);
  const sellPct=parseNum(document.getElementById('sellCostPct').value)/100;
  const rent=parseNum(document.getElementById('monthlyRent').value);
  const vacPct=parseNum(document.getElementById('vacancy').value)/100;
  const expPct=parseNum(document.getElementById('expenses').value)/100;
  const dpPct=parseNum(document.getElementById('dp').value)/100;
  const rate=parseNum(document.getElementById('rate').value)/100;
  const trm=parseNum(document.getElementById('term').value);

  const closing=pp*closePct;
  const totalCost=pp+repair+backTax+liens+closing;
  const discount=mv>0?((mv-pp)/mv*100):0;
  const cashIn=pp*dpPct+repair+backTax+liens+closing;

  let profit,roi;
  if(exit==='flip'){
    const sellCost=arv*sellPct;
    profit=arv-totalCost-sellCost;
    roi=cashIn>0?profit/cashIn*100:0;
  }else{
    const loan=pp*(1-dpPct);const mr=rate/12;const n=trm*12;
    const mortPmt=mr>0?loan*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):loan/n;
    const egi=rent*(1-vacPct);const exp=egi*expPct;
    const cfMo=egi-exp-mortPmt;profit=cfMo*12;
    roi=cashIn>0?profit/cashIn*100:0;
  }

  const riskExposure=totalCost/(exit==='flip'?arv:mv);
  const riskScore=riskExposure<0.65?'Low':riskExposure<0.8?'Medium':'High';

  document.getElementById('kpiDiscount').textContent=formatPct(discount);
  document.getElementById('kpiDiscountDetail').textContent=formatCurrency(mv-pp)+' below market';
  document.getElementById('kpiProfit').textContent=formatCurrency(profit);
  document.getElementById('kpiProfitDetail').textContent=exit==='flip'?'On flip':'Annual cash flow';
  document.getElementById('kpiProfit').className='kpi-value '+(profit>=0?'kpi-positive':'kpi-negative');
  document.getElementById('kpiROI').textContent=formatPct(roi);
  document.getElementById('kpiRisk').textContent=riskScore;
  document.getElementById('kpiRisk').className='kpi-value '+(riskScore==='Low'?'kpi-positive':riskScore==='High'?'kpi-negative':'');
  document.getElementById('kpiRiskDetail').textContent='Exposure: '+formatPct(riskExposure*100)+' of '+(exit==='flip'?'ARV':'value');

  destroyCharts();const cs=getCS();
  const exitVal=exit==='flip'?arv:mv;
  window.__charts.cv=new Chart(document.getElementById('chartCostValue'),{
    type:'bar',data:{labels:['Total Cost','Exit Value','Profit'],datasets:[{data:[totalCost,exitVal,profit],backgroundColor:[cs.c2,cs.c1,profit>=0?cs.c1:cs.c2]}]},
    options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}
  });
  window.__charts.risk=new Chart(document.getElementById('chartRisk'),{
    type:'doughnut',data:{labels:['Exposure','Safety Margin'],datasets:[{data:[riskExposure*100,(1-riskExposure)*100],backgroundColor:[cs.c2,cs.c1]}]},
    options:{responsive:true,maintainAspectRatio:false,cutout:'60%',plugins:{legend:{display:true,labels:{color:cs.text}}}}
  });

  const tbody=document.getElementById('costBody');
  tbody.innerHTML='';
  [['Purchase Price',pp],['Repair Costs',repair],['Back Taxes',backTax],['Liens',liens],['Closing Costs',closing],['Total Investment',totalCost],['---'],['Market Value',mv],['Acquisition Discount %',discount.toFixed(1)+'%'],['Cash Required',cashIn]].forEach(([l,v])=>{
    if(l==='---'){tbody.innerHTML+='<tr><td colspan="2" style="border-bottom:2px solid var(--color-divider)"></td></tr>';return;}
    tbody.innerHTML+=`<tr><td>${l}</td><td class="text-right">${typeof v==='number'?formatCurrency(v):v}</td></tr>`;
  });

  showResults();
}