/* ============================================================
   Qualification Analysis — IntelliTC Solutions
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
  const grossIncome=parseNum(document.getElementById('grossIncome').value);
  const otherIncome=parseNum(document.getElementById('otherIncome').value);
  const totalIncome=grossIncome+otherIncome;
  const carPmt=parseNum(document.getElementById('carPmt').value);
  const studentPmt=parseNum(document.getElementById('studentPmt').value);
  const ccMin=parseNum(document.getElementById('ccMin').value);
  const otherDebt=parseNum(document.getElementById('otherDebt').value);
  const totalDebt=carPmt+studentPmt+ccMin+otherDebt;
  const price=parseNum(document.getElementById('price').value);
  const dpPct=parseNum(document.getElementById('dp').value)/100;
  const rate=parseNum(document.getElementById('rate').value)/100;
  const term=parseNum(document.getElementById('term').value);
  const taxesYr=parseNum(document.getElementById('taxes').value);
  const insYr=parseNum(document.getElementById('insurance').value);
  const hoa=parseNum(document.getElementById('hoa').value);

  const n=term*12;const mr=rate/12;
  const loan=price*(1-dpPct);
  const pi=mr>0?loan*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):loan/n;
  const taxesMo=taxesYr/12;const insMo=insYr/12;
  const housing=pi+taxesMo+insMo+hoa;
  const frontDTI=totalIncome>0?housing/totalIncome*100:0;
  const backDTI=totalIncome>0?(housing+totalDebt)/totalIncome*100:0;

  // Program qualification
  const programs=[
    {name:'Conventional',frontMax:28,backMax:36,minDP:0.03},
    {name:'FHA',frontMax:31,backMax:43,minDP:0.035},
    {name:'VA',frontMax:999,backMax:41,minDP:0},
    {name:'USDA',frontMax:29,backMax:41,minDP:0}
  ];

  programs.forEach(p=>{
    p.frontOK=frontDTI<=p.frontMax||p.frontMax===999;
    p.backOK=backDTI<=p.backMax;
    p.qual=p.frontOK&&p.backOK;
  });

  // Max purchase price back-solve for each program
  function maxPurchase(prog){
    const maxHousing=Math.min(
      prog.frontMax===999?Infinity:totalIncome*prog.frontMax/100,
      totalIncome*prog.backMax/100-totalDebt
    );
    const availPI=maxHousing-taxesMo-insMo-hoa;
    if(availPI<=0)return 0;
    const maxLoan=mr>0?availPI*(Math.pow(1+mr,n)-1)/(mr*Math.pow(1+mr,n)):availPI*n;
    return maxLoan/(1-Math.max(dpPct,prog.minDP));
  }
  programs.forEach(p=>{p.maxPrice=maxPurchase(p);});

  const qualCount=programs.filter(p=>p.qual).length;
  const bestMax=programs.reduce((a,b)=>a.maxPrice>b.maxPrice?a:b);

  document.getElementById('kpiFrontDTI').textContent=formatPct(frontDTI);
  document.getElementById('kpiFrontDTI').className='kpi-value '+(frontDTI<=28?'kpi-positive':frontDTI<=31?'':'kpi-negative');
  document.getElementById('kpiFrontDTIDetail').textContent='Housing ratio (target ≤28%)';
  document.getElementById('kpiBackDTI').textContent=formatPct(backDTI);
  document.getElementById('kpiBackDTI').className='kpi-value '+(backDTI<=36?'kpi-positive':backDTI<=43?'':'kpi-negative');
  document.getElementById('kpiBackDTIDetail').textContent='Total debt ratio (target ≤36%)';
  document.getElementById('kpiMaxPrice').textContent=formatCurrency(bestMax.maxPrice);
  document.getElementById('kpiMaxPriceDetail').textContent=bestMax.name+' program max';
  document.getElementById('kpiPrograms').textContent=qualCount+' of 4';
  document.getElementById('kpiPrograms').className='kpi-value '+(qualCount>=3?'kpi-positive':qualCount>=1?'':'kpi-negative');
  document.getElementById('kpiProgramsDetail').textContent=programs.filter(p=>p.qual).map(p=>p.name).join(', ')||'None qualified';

  destroyCharts();const cs=getCS();

  // DTI comparison chart
  window.__charts.dti=new Chart(document.getElementById('chartDTI'),{type:'bar',
    data:{labels:programs.map(p=>p.name),datasets:[
      {label:'Your Front DTI',data:programs.map(()=>+frontDTI.toFixed(1)),backgroundColor:cs.c1},
      {label:'Front Limit',data:programs.map(p=>p.frontMax===999?0:p.frontMax),backgroundColor:cs.c5},
      {label:'Your Back DTI',data:programs.map(()=>+backDTI.toFixed(1)),backgroundColor:cs.c3},
      {label:'Back Limit',data:programs.map(p=>p.backMax),backgroundColor:cs.c2}
    ]},
    options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins},
      scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>v+'%'},grid:{color:cs.grid}}}}});

  // Max purchase by program
  window.__charts.maxP=new Chart(document.getElementById('chartMax'),{type:'bar',
    data:{labels:programs.map(p=>p.name),datasets:[{label:'Max Purchase Price',data:programs.map(p=>Math.round(p.maxPrice)),backgroundColor:[cs.c1,cs.c2,cs.c3,cs.c5]}]},
    options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},
      scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  // Qualification table
  const tbody=document.getElementById('qualBody');tbody.innerHTML='';
  programs.forEach(p=>{
    const frontClr=p.frontOK?'color:var(--color-success)':'color:var(--color-error)';
    const backClr=p.backOK?'color:var(--color-success)':'color:var(--color-error)';
    const qualClr=p.qual?'color:var(--color-success);font-weight:700':'color:var(--color-error);font-weight:700';
    tbody.innerHTML+=`<tr>
      <td style="font-weight:600">${p.name}</td>
      <td class="text-right" style="${frontClr}">${p.frontMax===999?'N/A':p.frontMax+'%'}</td>
      <td class="text-right" style="${frontClr}">${formatPct(frontDTI)}</td>
      <td class="text-right" style="${backClr}">${p.backMax}%</td>
      <td class="text-right" style="${backClr}">${formatPct(backDTI)}</td>
      <td class="text-right">${formatCurrency(p.maxPrice)}</td>
      <td class="text-right" style="${qualClr}">${p.qual?'✓ Yes':'✗ No'}</td>
    </tr>`;
  });

  // Income/debt summary row
  const summBody=document.getElementById('summBody');summBody.innerHTML='';
  const summRows=[
    ['Gross Monthly Income',formatCurrency(totalIncome),'highlight'],
    ['Other Income',formatCurrency(otherIncome),''],
    ['Total Monthly Income',formatCurrency(totalIncome),'highlight'],
    ['','','divider'],
    ['Housing Payment (PITI+HOA)',formatCurrency(housing),''],
    ['Car Payment',formatCurrency(carPmt),''],
    ['Student Loans',formatCurrency(studentPmt),''],
    ['Credit Cards',formatCurrency(ccMin),''],
    ['Other Debts',formatCurrency(otherDebt),''],
    ['Total Monthly Obligations',formatCurrency(housing+totalDebt),'highlight'],
    ['','','divider'],
    ['Front-End DTI',formatPct(frontDTI),frontDTI<=28?'pass':'fail'],
    ['Back-End DTI',formatPct(backDTI),backDTI<=36?'pass':'fail']
  ];
  summRows.forEach(r=>{
    if(r[2]==='divider'){summBody.innerHTML+='<tr><td colspan="2" style="padding:0"><div style="border-top:1px solid var(--color-divider)"></div></td></tr>';return;}
    let style='';
    if(r[2]==='highlight')style='font-weight:600;';
    if(r[2]==='pass')style='font-weight:700;color:var(--color-success);';
    if(r[2]==='fail')style='font-weight:700;color:var(--color-error);';
    summBody.innerHTML+=`<tr style="${style}"><td>${r[0]}</td><td class="text-right">${r[1]}</td></tr>`;
  });
  showResults();}