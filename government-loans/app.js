/* ============================================================
   Government Loan Comparison — IntelliTC Solutions
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
  const price=parseNum(document.getElementById('price').value);
  const credit=parseNum(document.getElementById('credit').value);
  const income=parseNum(document.getElementById('income').value);
  const debt=parseNum(document.getElementById('debt').value);
  const isVet=document.getElementById('veteran').value==='yes';
  const isRural=document.getElementById('rural').value==='yes';
  const dpPct=parseNum(document.getElementById('dp').value)/100;
  const baseRate=parseNum(document.getElementById('rate').value)/100;
  const term=parseNum(document.getElementById('term').value);
  const n=term*12;

  function calcPmt(principal,annRate){const mr=annRate/12;return mr>0?principal*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):principal/n;}

  // Conventional
  const convDP=Math.max(dpPct,0.03);
  const convLoan=price*(1-convDP);
  const convRate=baseRate;
  const convPmt=calcPmt(convLoan,convRate);
  const convPMI=convDP<0.20?convLoan*0.005/12:0; // ~0.5% annual PMI
  const convClose=price*0.025;
  const convTotal=convPmt+convPMI;
  const convCash=price*convDP+convClose;
  const convFrontDTI=(convTotal)*100/income;
  const convBackDTI=(convTotal+debt)*100/income;
  const convQual=convFrontDTI<=28&&convBackDTI<=36;

  // FHA
  const fhaDP=Math.max(credit>=580?0.035:0.10, dpPct);
  const fhaLoan=price*(1-fhaDP);
  const fhaUFMIP=fhaLoan*0.0175; // 1.75% upfront MIP
  const fhaTotalLoan=fhaLoan+fhaUFMIP;
  const fhaRate=baseRate-0.0025; // FHA typically slightly lower
  const fhaPmt=calcPmt(fhaTotalLoan,fhaRate);
  const fhaMIPAnnual=fhaLoan*0.0055; // 0.55% annual MIP (>95% LTV)
  const fhaMIPMo=fhaMIPAnnual/12;
  const fhaClose=price*0.025;
  const fhaTotal=fhaPmt+fhaMIPMo;
  const fhaCash=price*fhaDP+fhaClose;
  const fhaFrontDTI=fhaTotal*100/income;
  const fhaBackDTI=(fhaTotal+debt)*100/income;
  const fhaQual=fhaFrontDTI<=31&&fhaBackDTI<=43&&credit>=500;

  // VA
  const vaLoan=price; // 0% down
  const vaFundingFee=vaLoan*0.023; // 2.3% first use, 0 down
  const vaTotalLoan=vaLoan+vaFundingFee;
  const vaRate=baseRate-0.005; // VA typically lower
  const vaPmt=calcPmt(vaTotalLoan,vaRate);
  const vaClose=price*0.02;
  const vaTotal=vaPmt; // no MI
  const vaCash=vaClose;
  const vaBackDTI=(vaTotal+debt)*100/income;
  const vaQual=isVet&&vaBackDTI<=41;

  // USDA
  const usdaLoan=price; // 0% down
  const usdaGuaranteeFee=usdaLoan*0.01; // 1% upfront
  const usdaTotalLoan=usdaLoan+usdaGuaranteeFee;
  const usdaRate=baseRate-0.005;
  const usdaPmt=calcPmt(usdaTotalLoan,usdaRate);
  const usdaAnnualFee=usdaLoan*0.0035; // 0.35% annual
  const usdaFeeMo=usdaAnnualFee/12;
  const usdaClose=price*0.02;
  const usdaTotal=usdaPmt+usdaFeeMo;
  const usdaCash=usdaClose;
  const usdaFrontDTI=usdaTotal*100/income;
  const usdaBackDTI=(usdaTotal+debt)*100/income;
  const usdaQual=isRural&&usdaFrontDTI<=29&&usdaBackDTI<=41;

  const programs=[
    {name:'Conventional',pmt:convTotal,cash:convCash,qual:convQual,rate:convRate,dp:convDP,loan:convLoan,close:convClose,mi:convPMI,basePmt:convPmt,frontDTI:convFrontDTI,backDTI:convBackDTI},
    {name:'FHA',pmt:fhaTotal,cash:fhaCash,qual:fhaQual,rate:fhaRate,dp:fhaDP,loan:fhaTotalLoan,close:fhaClose,mi:fhaMIPMo,basePmt:fhaPmt,frontDTI:fhaFrontDTI,backDTI:fhaBackDTI},
    {name:'VA',pmt:vaTotal,cash:vaCash,qual:vaQual&&isVet,rate:vaRate,dp:0,loan:vaTotalLoan,close:vaClose,mi:0,basePmt:vaPmt,frontDTI:0,backDTI:vaBackDTI},
    {name:'USDA',pmt:usdaTotal,cash:usdaCash,qual:usdaQual&&isRural,rate:usdaRate,dp:0,loan:usdaTotalLoan,close:usdaClose,mi:usdaFeeMo,basePmt:usdaPmt,frontDTI:usdaFrontDTI,backDTI:usdaBackDTI}
  ];

  const qualProgs=programs.filter(p=>p.qual);
  const best=qualProgs.length?qualProgs.reduce((a,b)=>a.pmt<b.pmt?a:b):programs[0];
  const lowestPmt=programs.reduce((a,b)=>a.pmt<b.pmt?a:b);
  const lowestCash=programs.reduce((a,b)=>a.cash<b.cash?a:b);
  const lowestTotal=programs.reduce((a,b)=>(a.pmt*84+a.cash)<(b.pmt*84+b.cash)?a:b);

  document.getElementById('kpiBestProg').textContent=best.name;
  document.getElementById('kpiBestProg').className='kpi-value kpi-positive';
  document.getElementById('kpiBestProgDetail').textContent=best.qual?'Qualified — lowest payment':'Review eligibility';
  document.getElementById('kpiLowestPmt').textContent=formatCurrency(lowestPmt.pmt);
  document.getElementById('kpiLowestPmtDetail').textContent=lowestPmt.name+' program';
  document.getElementById('kpiLowestCash').textContent=formatCurrency(lowestCash.cash);
  document.getElementById('kpiLowestCashDetail').textContent=lowestCash.name+' — '+formatPct(lowestCash.dp*100)+' down';
  document.getElementById('kpiLowestTotal').textContent=formatCurrency(lowestTotal.pmt*84+lowestTotal.cash);
  document.getElementById('kpiLowestTotalDetail').textContent=lowestTotal.name+' over 7 years';

  destroyCharts();const cs=getCS();
  const progNames=programs.map(p=>p.name);
  const colors=[cs.c1,cs.c2,cs.c3,cs.c5];

  window.__charts.pmts=new Chart(document.getElementById('chartPayments'),{type:'bar',
    data:{labels:progNames,datasets:[
      {label:'P&I',data:programs.map(p=>Math.round(p.basePmt)),backgroundColor:cs.c1},
      {label:'MI/Fees',data:programs.map(p=>Math.round(p.mi)),backgroundColor:cs.c2}
    ]},
    options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins},
      scales:{x:{stacked:true,ticks:{color:cs.text},grid:{display:false}},y:{stacked:true,ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  window.__charts.total=new Chart(document.getElementById('chartTotalCost'),{type:'bar',
    data:{labels:progNames,datasets:[{label:'7-Year Total Cost',data:programs.map(p=>Math.round(p.pmt*84+p.cash)),backgroundColor:colors}]},
    options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},
      scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  // Comparison table
  const tbody=document.getElementById('govBody');tbody.innerHTML='';
  const rows=[
    ['Down Payment',...programs.map(p=>formatPct(p.dp*100))],
    ['Loan Amount',...programs.map(p=>formatCurrency(p.loan))],
    ['Interest Rate',...programs.map(p=>formatPct(p.rate*100))],
    ['P&I Payment',...programs.map(p=>formatCurrency(p.basePmt))],
    ['Monthly MI/Fee',...programs.map(p=>p.mi>0?formatCurrency(p.mi):'None')],
    ['Total Payment',...programs.map(p=>formatCurrency(p.pmt))],
    ['Cash to Close',...programs.map(p=>formatCurrency(p.cash))],
    ['Front DTI',...programs.map(p=>p.name==='VA'?'N/A':formatPct(p.frontDTI))],
    ['Back DTI',...programs.map(p=>formatPct(p.backDTI))],
    ['Qualified',...programs.map(p=>p.qual?'✓ Yes':'✗ No')]
  ];
  rows.forEach((r,i)=>{
    const bold=i===5||i===9?'font-weight:700;':'';
    const cells=r.slice(1).map((v,j)=>{
      let clr='';
      if(i===9)clr=programs[j].qual?'color:var(--color-success)':'color:var(--color-error)';
      return `<td class="text-right" style="${clr}">${v}</td>`;
    }).join('');
    tbody.innerHTML+=`<tr style="${bold}"><td>${r[0]}</td>${cells}</tr>`;
  });
  showResults();}