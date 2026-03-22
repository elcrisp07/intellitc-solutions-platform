/* ============================================================
   RE Cash-on-Cash Breakdown — IntelliTC Solutions
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

function calculate(){const pp=parseNum(document.getElementById('price').value);const dpPct=parseNum(document.getElementById('dp').value)/100;const rate=parseNum(document.getElementById('rate').value)/100;const term=parseNum(document.getElementById('term').value);const rent=parseNum(document.getElementById('rent').value);const vacPct=parseNum(document.getElementById('vacancy').value)/100;const expPct=parseNum(document.getElementById('expenses').value)/100;const appRate=parseNum(document.getElementById('appreciation').value)/100;const taxBr=parseNum(document.getElementById('taxBracket').value)/100;
  const loan=pp*(1-dpPct);const mr=rate/12;const n=term*12;const mortPmt=mr>0?loan*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):loan/n;const cashIn=pp*dpPct+pp*0.03;
  const egi=rent*(1-vacPct);const exp=egi*expPct;const cfMo=egi-exp-mortPmt;const depAnnual=(pp*0.8)/27.5;
  let bal=loan;const cfs=[],apps=[],ppds=[],taxs=[],totals=[];
  for(let y=1;y<=10;y++){const annCF=cfMo*12*Math.pow(1.02,y-1);const appGain=pp*Math.pow(1+appRate,y)-pp*Math.pow(1+appRate,y-1);
    let yrPPD=0;for(let m=0;m<12;m++){if(bal<=0)break;const ip=bal*mr;const pp2=Math.min(mortPmt-ip,bal);yrPPD+=pp2;bal-=pp2;}
    const taxBen=depAnnual*taxBr;const total=annCF+appGain+yrPPD+taxBen;
    cfs.push(Math.round(annCF));apps.push(Math.round(appGain));ppds.push(Math.round(yrPPD));taxs.push(Math.round(taxBen));totals.push(Math.round(total));}
  const yr1Total=totals[0];const allInCoC=cashIn>0?yr1Total/cashIn*100:0;const cfCoC=cashIn>0?cfs[0]/cashIn*100:0;const appContrib=yr1Total>0?apps[0]/yr1Total*100:0;
  document.getElementById('kpiTotalReturn').textContent=formatCurrency(yr1Total);document.getElementById('kpiTotalReturnDetail').textContent='Year 1 total from all 5 centers';
  document.getElementById('kpiAllInCoC').textContent=formatPct(allInCoC);document.getElementById('kpiAllInCoCDetail').textContent='vs '+formatPct(cfCoC)+' cash flow only';
  document.getElementById('kpiCFOnly').textContent=formatPct(cfCoC);document.getElementById('kpiAppContrib').textContent=formatPct(appContrib);document.getElementById('kpiAppContribDetail').textContent=formatCurrency(apps[0])+'/year';
  destroyCharts();const cs=getCS();
  window.__charts.stacked=new Chart(document.getElementById('chartStacked'),{type:'bar',data:{labels:Array.from({length:10},(_,i)=>'Yr '+(i+1)),datasets:[{label:'Cash Flow',data:cfs,backgroundColor:cs.c1},{label:'Appreciation',data:apps,backgroundColor:cs.c2},{label:'Paydown',data:ppds,backgroundColor:cs.c3},{label:'Tax Benefits',data:taxs,backgroundColor:cs.c6}]},options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins},scales:{x:{stacked:true,ticks:{color:cs.text},grid:{display:false}},y:{stacked:true,ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});
  window.__charts.donut=new Chart(document.getElementById('chartDonut'),{type:'doughnut',data:{labels:['Cash Flow','Appreciation','Principal Paydown','Tax Benefits'],datasets:[{data:[cfs[0],apps[0],ppds[0],taxs[0]],backgroundColor:[cs.c1,cs.c2,cs.c3,cs.c6]}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{color:cs.text}}}}});
  const tbody=document.getElementById('yearBody');tbody.innerHTML='';
  for(let i=0;i<10;i++){tbody.innerHTML+=`<tr><td>Year ${i+1}</td><td class="text-right">${formatCurrency(cfs[i])}</td><td class="text-right">${formatCurrency(apps[i])}</td><td class="text-right">${formatCurrency(ppds[i])}</td><td class="text-right">${formatCurrency(taxs[i])}</td><td class="text-right highlight">${formatCurrency(totals[i])}</td></tr>`;}
  showResults();}