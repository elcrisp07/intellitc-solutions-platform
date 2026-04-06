/* ============================================================
   Rental Analysis Calculator — IntelliTC Solutions
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
  const pp=parseNum(document.getElementById('price').value);
  const dpPct=parseNum(document.getElementById('dp').value)/100;
  const rate=parseNum(document.getElementById('rate').value)/100;
  const term=parseNum(document.getElementById('term').value);
  const startRent=parseNum(document.getElementById('rent').value);
  const vacPct=parseNum(document.getElementById('vacancy').value)/100;
  const expPct=parseNum(document.getElementById('expPct').value)/100;
  const rentG=parseNum(document.getElementById('rentGrowth').value)/100;
  const appG=parseNum(document.getElementById('appreciation').value)/100;
  const expG=parseNum(document.getElementById('expGrowth').value)/100;

  const loan=pp*(1-dpPct);const mr=rate/12;const n=term*12;
  const mortPmt=mr>0?loan*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):loan/n;
  const cashIn=pp*dpPct+pp*0.03;

  let balance=loan;let cumCF=0;let cumReturn=0;
  const years=[],rents=[],cfs=[],values=[],equities=[],cumReturns=[];

  for(let y=1;y<=30;y++){
    const moRent=startRent*Math.pow(1+rentG,y-1);
    const egi=moRent*(1-vacPct);
    const exp=egi*expPct*Math.pow(1+expG,y-1)/Math.pow(1+rentG,y-1);
    const noiMo=egi-exp;
    const cfMo=noiMo-mortPmt;const cfYr=cfMo*12;

    let yrPPD=0;
    for(let m=0;m<12;m++){
      if(balance<=0)break;
      const intP=balance*mr;const prinP=Math.min(mortPmt-intP,balance);
      yrPPD+=prinP;balance-=prinP;
    }
    const val=pp*Math.pow(1+appG,y);
    const equity=val-Math.max(0,balance);
    cumCF+=cfYr;cumReturn+=cfYr+yrPPD+(val-pp*Math.pow(1+appG,y-1));

    years.push(y);rents.push(Math.round(moRent));cfs.push(Math.round(cfYr));
    values.push(Math.round(val));equities.push(Math.round(equity));cumReturns.push(Math.round(cumReturn));
  }

  // Simple IRR approximation
  const totalReturn=cumReturns[cumReturns.length-1];
  const irr=(Math.pow((totalReturn+cashIn)/cashIn,1/30)-1)*100;

  document.getElementById('kpiCF1').textContent=formatCurrency(cfs[0]);
  document.getElementById('kpiCF1').className='kpi-value '+(cfs[0]>=0?'kpi-positive':'kpi-negative');
  document.getElementById('kpiCF1Detail').textContent=formatCurrency(cfs[0]/12)+'/month';
  document.getElementById('kpiReturn10').textContent=formatCurrency(cumReturns[9]);
  document.getElementById('kpiReturn10Detail').textContent=formatPct(cumReturns[9]/cashIn*100)+' on invested';
  document.getElementById('kpiEquity10').textContent=formatCurrency(equities[9]);
  document.getElementById('kpiIRR').textContent=formatPct(irr);

  destroyCharts();const cs=getCS();
  window.__charts.wealth=new Chart(document.getElementById('chartWealth'),{
    type:'line',data:{labels:years.map(y=>'Yr '+y),datasets:[
      {label:'Equity',data:equities,borderColor:cs.c1,backgroundColor:cs.c1+'15',fill:true,tension:0.3},
      {label:'Cumulative Return',data:cumReturns,borderColor:cs.c3,borderDash:[5,3],fill:false,tension:0.3},
    ]},options:{...chartOpts('','line'),scales:{x:{ticks:{color:cs.text,maxTicksLimit:10},grid:{color:cs.grid}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}
  });
  window.__charts.cf=new Chart(document.getElementById('chartCF'),{
    type:'bar',data:{labels:years.map(y=>'Yr '+y),datasets:[{label:'Annual Cash Flow',data:cfs,backgroundColor:cfs.map(c=>c>=0?cs.c1:cs.c2)}]},
    options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text,maxTicksLimit:10},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}
  });

  const tbody=document.getElementById('projBody');tbody.innerHTML='';
  for(let i=0;i<30;i++){
    const bold=i===0||i===4||i===9||i===19||i===29?'font-weight:600':'';
    tbody.innerHTML+=`<tr style="${bold}"><td>${years[i]}</td><td class="text-right">${formatCurrency(rents[i])}/mo</td><td class="text-right">${formatCurrency(cfs[i])}</td><td class="text-right">${formatCurrency(values[i])}</td><td class="text-right">${formatCurrency(equities[i])}</td><td class="text-right">${formatCurrency(cumReturns[i])}</td></tr>`;
  }
  showResults();
}
