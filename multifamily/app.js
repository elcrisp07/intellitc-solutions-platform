/* ============================================================
   Multi-Family Investment Calculator — IntelliTC Solutions
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
  const units=parseNum(document.getElementById('units').value);
  const pp=parseNum(document.getElementById('price').value);
  const dpPct=parseNum(document.getElementById('dp').value)/100;
  const rate=parseNum(document.getElementById('rate').value)/100;
  const trm=parseNum(document.getElementById('term').value);
  const avgRent=parseNum(document.getElementById('avgRent').value);
  const otherInc=parseNum(document.getElementById('otherInc').value);
  const vacPct=parseNum(document.getElementById('vacancy').value)/100;
  const rentG=parseNum(document.getElementById('rentGrowth').value)/100;
  const expR=parseNum(document.getElementById('expRatio').value)/100;
  const expG=parseNum(document.getElementById('expGrowth').value)/100;
  const exitCap=parseNum(document.getElementById('exitCap').value)/100;

  const loan=pp*(1-dpPct);const mr=rate/12;const n=trm*12;
  const mortPmt=mr>0?loan*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):loan/n;
  const debtAnn=mortPmt*12;const cashIn=pp*dpPct+pp*0.02;

  const gsi0=units*avgRent*12+otherInc*12;
  const egi0=gsi0*(1-vacPct);
  const exp0=egi0*expR;
  const noi0=egi0-exp0;
  const capRate=noi0/pp*100;
  const cf0=noi0-debtAnn;
  const coc=cashIn>0?cf0/cashIn*100:0;
  const dscr=debtAnn>0?noi0/debtAnn:Infinity;
  const ppu=pp/units;

  document.getElementById('kpiNOI').textContent=formatCurrency(noi0);
  document.getElementById('kpiNOIDetail').textContent=formatCurrency(ppu)+'/unit';
  document.getElementById('kpiCapRate').textContent=formatPct(capRate);
  document.getElementById('kpiCoC').textContent=formatPct(coc);
  document.getElementById('kpiCoCDetail').textContent=formatCurrency(cf0)+'/yr cash flow';
  document.getElementById('kpiDSCR').textContent=dscr.toFixed(2);
  document.getElementById('kpiDSCR').className='kpi-value '+(dscr>=1.25?'kpi-positive':dscr>=1?'':'kpi-negative');
  document.getElementById('kpiDSCRDetail').textContent=dscr>=1.25?'Strong':'Below 1.25 target';

  const years=[],nois=[],cfs=[],vals=[],gsis=[],egis=[],exps=[];
  for(let y=1;y<=10;y++){
    const gsi=gsi0*Math.pow(1+rentG,y-1);
    const egi=gsi*(1-vacPct);
    const exp=exp0*Math.pow(1+expG,y-1);
    const noi=egi-exp;const cf=noi-debtAnn;const val=exitCap>0?noi/exitCap:0;
    years.push(y);nois.push(Math.round(noi));cfs.push(Math.round(cf));vals.push(Math.round(val));
    gsis.push(Math.round(gsi));egis.push(Math.round(egi));exps.push(Math.round(exp));
  }

  destroyCharts();const cs=getCS();
  window.__charts.pf=new Chart(document.getElementById('chartProForma'),{
    type:'line',data:{labels:years.map(y=>'Year '+y),datasets:[
      {label:'NOI',data:nois,borderColor:cs.c1,backgroundColor:cs.c1+'20',fill:true,tension:0.3},
      {label:'Cash Flow',data:cfs,borderColor:cs.c3,borderDash:[5,3],fill:false,tension:0.3}
    ]},options:{...chartOpts('','line'),scales:{x:{ticks:{color:cs.text},grid:{color:cs.grid}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}
  });
  window.__charts.ei=new Chart(document.getElementById('chartExpInc'),{
    type:'bar',data:{labels:years.map(y=>'Yr '+y),datasets:[
      {label:'EGI',data:egis,backgroundColor:cs.c1},
      {label:'Expenses',data:exps.map(e=>-e),backgroundColor:cs.c2}
    ]},options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins},scales:{x:{stacked:true,ticks:{color:cs.text},grid:{display:false}},y:{stacked:true,ticks:{color:cs.text,callback:v=>formatCurrency(Math.abs(v))},grid:{color:cs.grid}}}}
  });

  const tbody=document.getElementById('pfBody');tbody.innerHTML='';
  for(let i=0;i<10;i++){
    tbody.innerHTML+=`<tr><td>Year ${years[i]}</td><td class="text-right">${formatCurrency(gsis[i])}</td><td class="text-right">${formatCurrency(egis[i])}</td><td class="text-right">${formatCurrency(exps[i])}</td><td class="text-right">${formatCurrency(nois[i])}</td><td class="text-right">${formatCurrency(cfs[i])}</td><td class="text-right">${formatCurrency(vals[i])}</td></tr>`;
  }
  showResults();
}
