/* ============================================================
   Payment Reverse Engineering — IntelliTC Solutions
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

function calculate(){const target=parseNum(document.getElementById('targetPmt').value);const taxR=parseNum(document.getElementById('taxRate').value)/100;const insYr=parseNum(document.getElementById('insYr').value);const hoa=parseNum(document.getElementById('hoa').value);const pmi=parseNum(document.getElementById('pmi').value);const rate=parseNum(document.getElementById('rate').value)/100;const term=parseNum(document.getElementById('term').value);const dpPct=parseNum(document.getElementById('dp').value)/100;
  function maxPrice(r,dp,tgt){const nonMort=hoa+pmi+insYr/12;const availForPI=tgt-nonMort;if(availForPI<=0)return 0;const mr=r/12;const n=term*12;const loanMax=mr>0?availForPI*(Math.pow(1+mr,n)-1)/(mr*Math.pow(1+mr,n)):availForPI*n;
    let price=loanMax/(1-dp);for(let i=0;i<10;i++){const taxMo=price*taxR/12;const piAvail=tgt-nonMort-taxMo;const ln=mr>0?piAvail*(Math.pow(1+mr,n)-1)/(mr*Math.pow(1+mr,n)):piAvail*n;price=ln/(1-dp);}return Math.max(0,price);}
  const mp=maxPrice(rate,dpPct,target);const loan=mp*(1-dpPct);const mr=rate/12;const n=term*12;const pi=mr>0?loan*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):loan/n;const taxMo=mp*taxR/12;const totalPITI=pi+taxMo+insYr/12+hoa+pmi;const totalInt=pi*n-loan;
  document.getElementById('kpiMaxPrice').textContent=formatCurrency(mp);document.getElementById('kpiMaxPriceDetail').textContent='At '+formatPct(dpPct*100)+' down, '+formatPct(rate*100)+' rate';
  document.getElementById('kpiMaxLoan').textContent=formatCurrency(loan);document.getElementById('kpiTotalPITI').textContent=formatCurrency(totalPITI);
  document.getElementById('kpiTotalInt').textContent=formatCurrency(totalInt);document.getElementById('kpiTotalIntDetail').textContent='Over '+term+' year term';
  destroyCharts();const cs=getCS();
  const rates=[5,5.5,6,6.5,7,7.5,8,8.5];const prices=rates.map(r=>maxPrice(r/100,dpPct,target));
  window.__charts.sens=new Chart(document.getElementById('chartSensitivity'),{type:'line',data:{labels:rates.map(r=>r+'%'),datasets:[{label:'Max Purchase Price',data:prices,borderColor:cs.c1,backgroundColor:cs.c1+'20',fill:true,tension:0.3}]},options:{...chartOpts('','line'),plugins:{...chartOpts('','line').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text},grid:{color:cs.grid}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});
  const bkParts=[pi,taxMo,insYr/12,hoa+pmi].filter(v=>v>0);const bkLabels=['Principal & Interest','Property Tax','Insurance','HOA/PMI'].filter((_,i)=>[pi,taxMo,insYr/12,hoa+pmi][i]>0);
  window.__charts.bd=new Chart(document.getElementById('chartBreakdown'),{type:'doughnut',data:{labels:bkLabels,datasets:[{data:bkParts,backgroundColor:[cs.c1,cs.c2,cs.c3,cs.c5]}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{color:cs.text}}}}});
  const tbody=document.getElementById('sensBody');tbody.innerHTML='';
  rates.forEach(r=>{tbody.innerHTML+=`<tr${r===rate*100?' style="font-weight:700;background:var(--color-primary-surface)"':''}><td>${r}%</td><td class="text-right">${formatCurrency(maxPrice(r/100,0.05,target))}</td><td class="text-right">${formatCurrency(maxPrice(r/100,0.10,target))}</td><td class="text-right">${formatCurrency(maxPrice(r/100,0.15,target))}</td><td class="text-right">${formatCurrency(maxPrice(r/100,0.20,target))}</td></tr>`;});
  showResults();}