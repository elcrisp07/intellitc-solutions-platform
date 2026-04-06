/* ============================================================
   Cash Flow Calculator — IntelliTC Solutions
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
  const pp=parseNum(document.getElementById('purchasePrice').value);
  const dpPct=parseNum(document.getElementById('downPayment').value)/100;
  const rate=parseNum(document.getElementById('interestRate').value)/100;
  const term=parseNum(document.getElementById('loanTerm').value);
  const rent=parseNum(document.getElementById('monthlyRent').value);
  const other=parseNum(document.getElementById('otherIncome').value);
  const vacPct=parseNum(document.getElementById('vacancyRate').value)/100;
  const taxYr=parseNum(document.getElementById('propTaxYr').value);
  const insYr=parseNum(document.getElementById('insuranceYr').value);
  const maintPct=parseNum(document.getElementById('maintenance').value)/100;
  const mgmtPct=parseNum(document.getElementById('management').value)/100;
  const util=parseNum(document.getElementById('utilities').value);
  const hoa=parseNum(document.getElementById('hoa').value);

  const loan=pp*(1-dpPct);const mr=rate/12;const n=term*12;
  const mortPmt=mr>0?loan*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):loan/n;
  const gsi=(rent+other);const vacLoss=gsi*vacPct;const egi=gsi-vacLoss;
  const taxMo=taxYr/12;const insMo=insYr/12;const maintMo=pp*maintPct/12;const mgmtMo=rent*mgmtPct;
  const totalExpMo=taxMo+insMo+maintMo+mgmtMo+util+hoa;
  const noiMo=egi-totalExpMo;const noi=noiMo*12;
  const cfMo=noiMo-mortPmt;const cfYr=cfMo*12;
  const expRatio=gsi>0?(totalExpMo/egi)*100:0;
  const dscr=mortPmt>0?noiMo/mortPmt:Infinity;

  document.getElementById('kpiMonthlyCF').textContent=formatCurrency(cfMo);
  document.getElementById('kpiMonthlyCF').className='kpi-value '+(cfMo>=0?'kpi-positive':'kpi-negative');
  document.getElementById('kpiAnnualCF').textContent=formatCurrency(cfYr);
  document.getElementById('kpiAnnualCF').className='kpi-value '+(cfYr>=0?'kpi-positive':'kpi-negative');
  document.getElementById('kpiAnnualCFDetail').textContent='DSCR: '+dscr.toFixed(2);
  document.getElementById('kpiNOI').textContent=formatCurrency(noi);
  document.getElementById('kpiExpRatio').textContent=formatPct(expRatio);

  destroyCharts();const cs=getCS();

  // Waterfall
  const labels=['Gross Rent','Other Inc.','Vacancy','Taxes','Insurance','Maint.','Mgmt','Utils','HOA','Mortgage','Net CF'];
  const vals=[rent,other,-vacLoss,-taxMo,-insMo,-maintMo,-mgmtMo,-util,-hoa,-mortPmt,cfMo];
  let run=0;const base=[],pos=[],neg=[];
  for(let i=0;i<vals.length;i++){
    if(i===vals.length-1){base.push(0);pos.push(Math.max(0,cfMo));neg.push(Math.min(0,cfMo));}
    else if(vals[i]>=0){base.push(run);pos.push(vals[i]);neg.push(0);run+=vals[i];}
    else{run+=vals[i];base.push(run);pos.push(0);neg.push(-vals[i]);}
  }
  window.__charts.wf=new Chart(document.getElementById('chartWaterfall'),{
    type:'bar',data:{labels,datasets:[
      {label:'_',data:base,backgroundColor:'transparent'},
      {label:'Income',data:pos,backgroundColor:cs.c1},
      {label:'Expense',data:neg,backgroundColor:cs.c2}
    ]},options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{x:{stacked:true,ticks:{color:cs.text,maxRotation:45},grid:{display:false}},y:{stacked:true,ticks:{color:cs.text,callback:v=>'$'+v.toLocaleString()},grid:{color:cs.grid}}}}
  });

  const expItems=[['Taxes',taxMo],['Insurance',insMo],['Maintenance',maintMo],['Management',mgmtMo],['Utilities',util],['HOA',hoa]].filter(e=>e[1]>0);
  window.__charts.exp=new Chart(document.getElementById('chartExpBreak'),{
    type:'doughnut',data:{labels:expItems.map(e=>e[0]),datasets:[{data:expItems.map(e=>e[1]),backgroundColor:[cs.c1,cs.c2,cs.c3,cs.c5,cs.c6,cs.c4]}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{color:cs.text,font:{family:'DM Sans'}}}}}
  });

  // P&L Table
  const tbody=document.getElementById('plBody');tbody.innerHTML='';
  const rows=[
    ['Gross Rental Income',rent,rent*12,''],['Other Income',other,other*12,''],
    ['Vacancy Allowance',-vacLoss,-vacLoss*12,''],['Effective Gross Income',egi,egi*12,'bold'],
    ['---'],
    ['Property Taxes',-taxMo,-taxYr,''],['Insurance',-insMo,-insYr,''],['Maintenance',-maintMo,-pp*maintPct,''],
    ['Management',-mgmtMo,-mgmtMo*12,''],['Utilities',-util,-util*12,''],['HOA',-hoa,-hoa*12,''],
    ['Total Operating Expenses',-totalExpMo,-totalExpMo*12,'bold'],['---'],
    ['Net Operating Income (NOI)',noiMo,noi,'bold'],['Mortgage Payment',-mortPmt,-mortPmt*12,''],
    ['Net Cash Flow',cfMo,cfYr,'bold highlight']
  ];
  rows.forEach(r=>{
    if(r[0]==='---'){tbody.innerHTML+='<tr><td colspan="3" style="border-bottom:2px solid var(--color-divider)"></td></tr>';return;}
    const [label,mo,yr,cls]=r;
    const style=cls.includes('bold')?'font-weight:600':'';
    const hi=cls.includes('highlight')?' highlight':'';
    tbody.innerHTML+=`<tr style="${style}"><td>${label}</td><td class="text-right${hi}">${formatCurrency(mo)}</td><td class="text-right${hi}">${formatCurrency(yr)}</td></tr>`;
  });
  showResults();
}
