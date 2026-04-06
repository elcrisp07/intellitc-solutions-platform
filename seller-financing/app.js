/* ============================================================
   Seller Financing Calculator — IntelliTC Solutions
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

function calculate(){const price=parseNum(document.getElementById('price').value);const dp=parseNum(document.getElementById('downPmt').value);const note=parseNum(document.getElementById('noteAmt').value);const noteRate=parseNum(document.getElementById('noteRate').value)/100;const noteTerm=parseNum(document.getElementById('noteTerm').value);const hasBalloon=document.getElementById('hasBalloon').value==='yes';const balloonYr=parseNum(document.getElementById('balloonYr').value);const rent=parseNum(document.getElementById('rent').value);const vacPct=parseNum(document.getElementById('vacancy').value)/100;const expPct=parseNum(document.getElementById('expenses').value)/100;
  const mr=noteRate/12;const n=noteTerm*12;const pmt=mr>0?note*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):note/n;
  let bal=note;let totalInt=0;const yrs=[];const ints=[];const prins=[];const bals=[];
  for(let y=1;y<=Math.min(noteTerm,hasBalloon?balloonYr:30);y++){let yrInt=0,yrPrin=0;
    for(let m=0;m<12;m++){const ip=bal*mr;const pp=pmt-ip;yrInt+=ip;yrPrin+=pp;bal-=pp;}
    totalInt+=yrInt;yrs.push(y);ints.push(Math.round(yrInt));prins.push(Math.round(yrPrin));bals.push(Math.round(Math.max(0,bal)));}
  const balloonAmt=hasBalloon?Math.max(0,bal):0;
  const egi=rent*(1-vacPct);const exp=egi*expPct;const cf=egi-exp-pmt;const coc=dp>0?cf*12/dp*100:0;
  const convRate=0.07;const convMr=convRate/12;const convN=30*12;const convPmt=convMr>0?note*(convMr*Math.pow(1+convMr,convN))/(Math.pow(1+convMr,convN)-1):note/convN;
  document.getElementById('kpiPayment').textContent=formatCurrency(pmt);document.getElementById('kpiPaymentDetail').textContent='P&I on '+formatCurrency(note);
  document.getElementById('kpiTotalInterest').textContent=formatCurrency(totalInt);
  document.getElementById('kpiBalloon').textContent=hasBalloon?formatCurrency(balloonAmt):'None';document.getElementById('kpiBalloonDetail').textContent=hasBalloon?'Due year '+balloonYr:'No balloon payment';
  document.getElementById('kpiBuyerCoC').textContent=formatPct(coc);document.getElementById('kpiBuyerCoCDetail').textContent=formatCurrency(cf)+'/mo cash flow';
  destroyCharts();const cs=getCS();
  window.__charts.amort=new Chart(document.getElementById('chartAmort'),{type:'bar',data:{labels:yrs.map(y=>'Yr '+y),datasets:[{label:'Interest',data:ints,backgroundColor:cs.c2},{label:'Principal',data:prins,backgroundColor:cs.c1}]},options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins},scales:{x:{stacked:true,ticks:{color:cs.text},grid:{display:false}},y:{stacked:true,ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});
  window.__charts.comp=new Chart(document.getElementById('chartCompare'),{type:'bar',data:{labels:['Monthly Payment','Year 1 Interest','Cash Flow'],datasets:[{label:'Seller Finance',data:[pmt,ints[0],cf*12],backgroundColor:cs.c1},{label:'Conventional 7%',data:[convPmt,note*convRate,rent*(1-vacPct)*(1-expPct)*12-convPmt*12],backgroundColor:cs.c2}]},options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins},scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});
  const tbody=document.getElementById('amortBody');tbody.innerHTML='';
  for(let i=0;i<yrs.length;i++){tbody.innerHTML+=`<tr><td>${yrs[i]}</td><td class="text-right">${formatCurrency(pmt*12)}</td><td class="text-right">${formatCurrency(ints[i])}</td><td class="text-right">${formatCurrency(prins[i])}</td><td class="text-right">${formatCurrency(bals[i])}</td></tr>`;}
  if(hasBalloon)tbody.innerHTML+=`<tr style="font-weight:700;background:var(--color-primary-surface)"><td>Balloon Due</td><td colspan="3"></td><td class="text-right highlight">${formatCurrency(balloonAmt)}</td></tr>`;
  showResults();}