/* ============================================================
   DTI & Payment Shock Stress Test — IntelliTC Solutions
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
  const grossIncome=parseNum(document.getElementById('grossIncome').value);
  const coIncome=parseNum(document.getElementById('coIncome').value);
  const price=parseNum(document.getElementById('price').value);
  const dpPct=parseNum(document.getElementById('dpPct').value)/100;
  const rate=parseNum(document.getElementById('rate').value)/100;
  const term=parseNum(document.getElementById('term').value);
  const taxRate=parseNum(document.getElementById('taxRate').value)/100;
  const insYr=parseNum(document.getElementById('insYr').value);
  const hoa=parseNum(document.getElementById('hoa').value);
  const carPmt=parseNum(document.getElementById('carPmt').value);
  const studentLoans=parseNum(document.getElementById('studentLoans').value);
  const creditCards=parseNum(document.getElementById('creditCards').value);
  const otherDebt=parseNum(document.getElementById('otherDebt').value);

  const totalIncome=grossIncome+coIncome;
  const loan=price*(1-dpPct);
  const totalDebts=carPmt+studentLoans+creditCards+otherDebt;

  /* PMI if < 20% down */
  const pmi=dpPct<0.20?loan*0.005/12:0;

  /* Property costs */
  const taxMo=price*taxRate/12;
  const insMo=insYr/12;
  const n=term*12;

  /* Calculate for 3 rate scenarios */
  const scenarios=[
    {label:'Current Rate',rateVal:rate},
    {label:'+1% Rate',rateVal:rate+0.01},
    {label:'+2% Rate',rateVal:rate+0.02}
  ];
  const results=scenarios.map(s=>{
    const mr=s.rateVal/12;
    const pi=mr>0?loan*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):loan/n;
    const totalPITI=pi+taxMo+insMo+hoa+pmi;
    const frontDTI=totalIncome>0?(totalPITI/totalIncome*100):0;
    const backDTI=totalIncome>0?((totalPITI+totalDebts)/totalIncome*100):0;
    return{...s,pi:pi,pmi:pmi,taxMo:taxMo,insMo:insMo,hoa:hoa,totalPITI:totalPITI,frontDTI:frontDTI,backDTI:backDTI};
  });

  const cur=results[0];
  const paymentShock=cur.totalPITI>0?((results[2].totalPITI-cur.totalPITI)/cur.totalPITI*100):0;

  /* Front DTI colors */
  function dtiClass(front,back){return back<=36?'kpi-positive':back<=43?'':'kpi-negative';}

  document.getElementById('kpiFrontDTI').textContent=formatPct(cur.frontDTI);
  document.getElementById('kpiFrontDTI').className='kpi-value '+dtiClass(cur.frontDTI,cur.backDTI);
  document.getElementById('kpiFrontDTIDetail').textContent=cur.frontDTI<=28?'Within conventional limit (28%)':'Above 28% conventional guideline';
  document.getElementById('kpiBackDTI').textContent=formatPct(cur.backDTI);
  document.getElementById('kpiBackDTI').className='kpi-value '+dtiClass(cur.frontDTI,cur.backDTI);
  document.getElementById('kpiBackDTIDetail').textContent=cur.backDTI<=36?'Comfortable range':'Above 36% — '+(cur.backDTI<=43?'FHA may approve':'high risk');
  document.getElementById('kpiPmtPlus1').textContent=formatCurrency(results[1].totalPITI);
  document.getElementById('kpiPmtPlus1Detail').textContent='+'+formatCurrency(results[1].totalPITI-cur.totalPITI)+'/mo vs current';
  document.getElementById('kpiPmtPlus2').textContent=formatCurrency(results[2].totalPITI);
  document.getElementById('kpiPmtPlus2Detail').textContent=formatPct(paymentShock)+' payment shock';

  destroyCharts();const cs=getCS();

  /* Chart 1: Grouped bar — PITI breakdown at each rate */
  window.__charts.shock=new Chart(document.getElementById('chartShock'),{type:'bar',data:{
    labels:results.map(r=>r.label+' ('+formatPct(r.rateVal*100)+')'),
    datasets:[
      {label:'P&I',data:results.map(r=>Math.round(r.pi)),backgroundColor:cs.c1},
      {label:'Tax',data:results.map(r=>Math.round(r.taxMo)),backgroundColor:cs.c2},
      {label:'Insurance',data:results.map(r=>Math.round(r.insMo)),backgroundColor:cs.c3},
      {label:'HOA/PMI',data:results.map(r=>Math.round(r.hoa+r.pmi)),backgroundColor:cs.c5}
    ]
  },options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins},scales:{x:{stacked:true,ticks:{color:cs.text},grid:{display:false}},y:{stacked:true,ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  /* Chart 2: DTI gauge — horizontal bar */
  const dtiLabels=['Front-End DTI','Back-End DTI'];
  const dtiVals=[cur.frontDTI,cur.backDTI];
  window.__charts.dti=new Chart(document.getElementById('chartDTI'),{type:'bar',data:{
    labels:dtiLabels,
    datasets:[
      {label:'Your DTI',data:dtiVals,backgroundColor:[cur.frontDTI<=28?cs.c1:cur.frontDTI<=31?cs.c6:cs.c2,cur.backDTI<=36?cs.c1:cur.backDTI<=43?cs.c6:cs.c2]},
      {label:'Conv. Limit',data:[28,36],backgroundColor:'transparent',borderColor:cs.c5,borderWidth:2,type:'bar'},
      {label:'FHA Limit',data:[31,43],backgroundColor:'transparent',borderColor:cs.c3,borderWidth:2,borderDash:[5,3],type:'bar'}
    ]
  },options:{...chartOpts('','bar'),indexAxis:'y',plugins:{...chartOpts('','bar').plugins},scales:{y:{ticks:{color:cs.text},grid:{display:false}},x:{min:0,max:60,ticks:{color:cs.text,callback:v=>v+'%'},grid:{color:cs.grid}}}}});

  /* Table: Payment breakdown at each scenario */
  const tbody=document.getElementById('stressBody');tbody.innerHTML='';
  const header='<tr style="font-weight:600;background:var(--color-primary-surface)"><td>Component</td>'+results.map(r=>'<td class="text-right">'+r.label+'<br><span style="font-weight:400;font-size:var(--text-sm)">'+formatPct(r.rateVal*100)+'</span></td>').join('')+'</tr>';
  tbody.innerHTML=header;
  const components=[
    ['Principal & Interest',results.map(r=>r.pi)],
    ['Property Tax',results.map(r=>r.taxMo)],
    ['Insurance',results.map(r=>r.insMo)],
    ['HOA',results.map(r=>r.hoa)],
    ['PMI',results.map(r=>r.pmi)],
    ['Total PITI',results.map(r=>r.totalPITI)],
    ['Front-End DTI',results.map(r=>r.frontDTI)],
    ['Back-End DTI',results.map(r=>r.backDTI)]
  ];
  components.forEach((c,ci)=>{
    const isTotalRow=ci===5;const isDTI=ci>=6;
    const style=isTotalRow?'font-weight:700;border-top:2px solid var(--color-divider)':'';
    let row='<tr style="'+style+'"><td>'+c[0]+'</td>';
    c[1].forEach((v,vi)=>{
      if(isDTI){
        const color=ci===6?(v<=28?'var(--color-success)':v<=31?'var(--color-warning)':'var(--color-error)'):(v<=36?'var(--color-success)':v<=43?'var(--color-warning)':'var(--color-error)');
        row+='<td class="text-right" style="color:'+color+'">'+formatPct(v)+'</td>';
      } else {
        row+='<td class="text-right"'+(isTotalRow?' class="highlight"':'')+'>'+formatCurrency(v)+'</td>';
      }
    });
    tbody.innerHTML+=row+'</tr>';
  });
  showResults();}