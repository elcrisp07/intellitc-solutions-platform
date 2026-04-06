/* ===========================================================
   RE Investment Analyzer — app.js
   IntelliTC Solutions
   =========================================================== */

/* ---- Dark-mode toggle (from spec) ---- */
/* ---- Theme Toggle ---- */
(function(){const toggles=document.querySelectorAll('[data-theme-toggle]'),r=document.documentElement;let d=localStorage.getItem('intellitc-theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');r.setAttribute('data-theme',d);function updateIcon(){const icon=d==='dark'?'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>':'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';toggles.forEach(function(t){t.innerHTML=icon;});}updateIcon();toggles.forEach(function(t){t.addEventListener('click',function(){d=d==='dark'?'light':'dark';r.setAttribute('data-theme',d);localStorage.setItem('intellitc-theme',d);t.setAttribute('aria-label','Switch to '+(d==='dark'?'light':'dark')+' mode');updateIcon();Object.values(window.__charts||{}).forEach(function(c){if(c&&c.update)c.update()});if(typeof onThemeChange==='function')onThemeChange();});});})();

/* ---- Utility functions (from spec) ---- */
function parseNum(str){return parseFloat(String(str).replace(/[^0-9.\-]/g,''))||0;}
function formatCurrency(n){if(Math.abs(n)>=1e6)return'$'+(n/1e6).toFixed(1)+'M';if(Math.abs(n)>=1e3)return'$'+Math.round(n).toLocaleString();return'$'+n.toFixed(0);}
function formatPercent(n){return n.toFixed(1)+'%';}
function formatNumber(n){return Math.round(n).toLocaleString();}
window.__charts={};
function getChartColors(){const s=getComputedStyle(document.documentElement);return{c1:s.getPropertyValue('--chart-1').trim(),c2:s.getPropertyValue('--chart-2').trim(),c3:s.getPropertyValue('--chart-3').trim(),c4:s.getPropertyValue('--chart-4').trim(),c5:s.getPropertyValue('--chart-5').trim(),c6:s.getPropertyValue('--chart-6').trim(),c7:s.getPropertyValue('--chart-7').trim(),c8:s.getPropertyValue('--chart-8').trim(),text:s.getPropertyValue('--color-text-muted').trim(),grid:s.getPropertyValue('--color-divider').trim()};}

/* ---- Auto-format currency inputs on blur ---- */
document.querySelectorAll('[data-currency]').forEach(function(input){
  input.addEventListener('blur',function(){
    var v=parseNum(this.value);
    if(v) this.value=Math.round(v).toLocaleString();
  });
  input.addEventListener('focus',function(){
    var v=parseNum(this.value);
    if(v) this.value=v.toString();
  });
});

/* ---- Panel toggling ---- */
function showResults(){
  document.getElementById('inputPanel').classList.add('hidden');
  document.getElementById('resultsPanel').classList.remove('hidden');
  window.scrollTo({top:0,behavior:'smooth'});
}
function modifyInputs(){
  document.getElementById('resultsPanel').classList.add('hidden');
  document.getElementById('inputPanel').classList.remove('hidden');
  window.scrollTo({top:0,behavior:'smooth'});
}

/* ---- Validation ---- */
function validate(){
  var errs=[];
  if(parseNum(document.getElementById('purchasePrice').value)<=0) errs.push('Purchase price must be greater than $0.');
  if(parseNum(document.getElementById('grossRent').value)<=0) errs.push('Gross monthly rent must be greater than $0.');
  var dp=parseNum(document.getElementById('downPaymentPct').value);
  if(dp<0||dp>100) errs.push('Down payment must be 0–100%.');
  var el=document.getElementById('errorMsg');
  if(errs.length){el.textContent=errs.join(' ');el.classList.remove('hidden');return false;}
  el.classList.add('hidden');
  return true;
}

/* ---- Mortgage payment calc (standard amortization) ---- */
function calcMortgagePayment(principal, annualRate, years){
  if(principal<=0) return 0;
  if(annualRate<=0) return principal/(years*12);
  var r=annualRate/12;
  var n=years*12;
  return principal*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);
}

/* ================================================================
   Main Calculation
   ================================================================ */
function calculate(){
  if(!validate()) return;

  /* --- Read inputs --- */
  var purchasePrice  = parseNum(document.getElementById('purchasePrice').value);
  var downPaymentPct = parseNum(document.getElementById('downPaymentPct').value)/100;
  var interestRate   = parseNum(document.getElementById('interestRate').value)/100;
  var loanTerm       = parseNum(document.getElementById('loanTerm').value);
  var closingCosts   = parseNum(document.getElementById('closingCosts').value);
  var grossRentMo    = parseNum(document.getElementById('grossRent').value);
  var vacancyRate    = parseNum(document.getElementById('vacancyRate').value)/100;
  var taxesYear      = parseNum(document.getElementById('taxesYear').value);
  var insuranceYear  = parseNum(document.getElementById('insuranceYear').value);
  var maintenancePct = parseNum(document.getElementById('maintenancePct').value)/100;
  var managementPct  = parseNum(document.getElementById('managementPct').value)/100;

  /* --- Derived values --- */
  var downPayment      = purchasePrice * downPaymentPct;
  var loanAmount       = purchasePrice - downPayment;
  var monthlyMortgage  = calcMortgagePayment(loanAmount, interestRate, loanTerm);
  var annualDebtService= monthlyMortgage * 12;

  var grossRentYear    = grossRentMo * 12;
  var vacancyLoss      = grossRentYear * vacancyRate;
  var effectiveGross   = grossRentYear - vacancyLoss;

  var maintenanceCost  = grossRentYear * maintenancePct;
  var managementCost   = effectiveGross * managementPct;
  var totalOpex        = taxesYear + insuranceYear + maintenanceCost + managementCost;

  var noi              = effectiveGross - totalOpex;
  var annualCashFlow   = noi - annualDebtService;
  var monthlyCashFlow  = annualCashFlow / 12;

  var totalCashInvested= downPayment + closingCosts;

  /* --- Key metrics --- */
  var grm             = grossRentYear > 0 ? purchasePrice / grossRentYear : 0;
  var capRate         = purchasePrice > 0 ? (noi / purchasePrice) * 100 : 0;
  var dscr            = annualDebtService > 0 ? noi / annualDebtService : 0;
  var cocReturn       = totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0;
  var breakEvenRatio  = grossRentYear > 0 ? ((annualDebtService + totalOpex) / grossRentYear) * 100 : 0;

  /* --- Summary text --- */
  document.getElementById('resultsSummary').textContent =
    formatCurrency(purchasePrice) + ' purchase  \u2022  ' + formatCurrency(grossRentMo) + '/mo rent  \u2022  ' +
    formatCurrency(monthlyCashFlow) + '/mo cash flow';

  /* --- KPI cards --- */
  renderKPIs(monthlyCashFlow, capRate, cocReturn, dscr, grm, breakEvenRatio);

  /* --- Charts --- */
  renderPieChart(vacancyLoss, taxesYear, insuranceYear, maintenanceCost, managementCost, annualDebtService, annualCashFlow, grossRentYear);
  renderProjectionChart(grossRentYear, vacancyRate, totalOpex, annualDebtService);

  /* --- Monthly P&L Table --- */
  renderPLTable(grossRentMo, vacancyLoss/12, taxesYear/12, insuranceYear/12, maintenanceCost/12, managementCost/12, monthlyMortgage, monthlyCashFlow, noi/12);

  showResults();
}

/* ================================================================
   KPI Cards
   ================================================================ */
function renderKPIs(monthlyCF, capRate, coc, dscr, grm, breakEven){
  var kpiRow=document.getElementById('kpiRow');
  var kpis=[
    {label:'Monthly Cash Flow', value:formatCurrency(monthlyCF), delta:formatCurrency(monthlyCF*12)+'/yr', cls:monthlyCF>=0?'kpi-positive':'kpi-negative'},
    {label:'Cap Rate', value:formatPercent(capRate), delta:capRate>=6?'Solid return':'Below 6% target', cls:capRate>=6?'kpi-positive':capRate>=4?'':'kpi-negative'},
    {label:'Cash-on-Cash Return', value:formatPercent(coc), delta:'Annual return on cash invested', cls:coc>=8?'kpi-positive':coc>=0?'':'kpi-negative'},
    {label:'DSCR', value:dscr.toFixed(2)+'x', delta:dscr>=1.25?'Healthy coverage':dscr>=1.0?'Marginal — aim for 1.25x+':'Below break-even', cls:dscr>=1.25?'kpi-positive':dscr>=1.0?'':'kpi-negative'},
  ];
  kpiRow.innerHTML=kpis.map(function(k){
    return '<div class="kpi-card"><span class="kpi-label">'+k.label+'</span><span class="kpi-value '+k.cls+'">'+k.value+'</span><span class="kpi-delta">'+k.delta+'</span></div>';
  }).join('');
}

/* ================================================================
   Income vs Expenses Pie Chart
   ================================================================ */
function renderPieChart(vacancy, taxes, insurance, maintenance, management, debtService, cashFlow, grossRent){
  var c=getChartColors();
  var labels=['Vacancy Loss','Property Taxes','Insurance','Maintenance','Management','Debt Service'];
  var data=[vacancy,taxes,insurance,maintenance,management,debtService];
  var colors=[c.c5,c.c2,c.c6,c.c7,c.c8,c.c3];

  // If positive cash flow, include it
  if(cashFlow>0){
    labels.push('Net Cash Flow');
    data.push(cashFlow);
    colors.push(c.c1);
  }

  if(window.__charts.pie) window.__charts.pie.destroy();
  var ctx=document.getElementById('pieChart').getContext('2d');
  window.__charts.pie=new Chart(ctx,{
    type:'doughnut',
    data:{labels:labels,datasets:[{data:data,backgroundColor:colors,borderWidth:0,hoverOffset:6}]},
    options:{
      responsive:true,
      maintainAspectRatio:false,
      cutout:'55%',
      plugins:{
        legend:{position:'bottom',labels:{color:c.text,font:{size:11,family:"'DM Sans'"},boxWidth:12,padding:12}},
        tooltip:{callbacks:{label:function(item){
          var pct=grossRent>0?(item.raw/grossRent*100).toFixed(1)+'%':'';
          return item.label+': '+formatCurrency(item.raw)+' ('+pct+')';
        }}}
      }
    }
  });
}

/* ================================================================
   10-Year Cash Flow Projection
   ================================================================ */
function renderProjectionChart(grossRentYear, vacancyRate, totalOpex, annualDebt){
  var c=getChartColors();
  var rentGrowth=0.03;    // 3% annual rent growth
  var expenseGrowth=0.02; // 2% annual expense growth

  var labels=[];
  var cfData=[];
  var noiData=[];

  var rent=grossRentYear;
  var opex=totalOpex;

  for(var yr=1;yr<=10;yr++){
    if(yr>1){
      rent*=(1+rentGrowth);
      opex*=(1+expenseGrowth);
    }
    var effGross=rent*(1-vacancyRate);
    var noi=effGross-opex;
    var cf=noi-annualDebt;
    labels.push('Year '+yr);
    noiData.push(Math.round(noi));
    cfData.push(Math.round(cf));
  }

  if(window.__charts.projection) window.__charts.projection.destroy();
  var ctx=document.getElementById('projectionChart').getContext('2d');
  window.__charts.projection=new Chart(ctx,{
    type:'line',
    data:{
      labels:labels,
      datasets:[
        {label:'NOI',data:noiData,borderColor:c.c3,backgroundColor:c.c3+'22',fill:true,tension:0.3,pointRadius:3,pointHoverRadius:6},
        {label:'Cash Flow',data:cfData,borderColor:c.c1,backgroundColor:c.c1+'22',fill:true,tension:0.3,pointRadius:3,pointHoverRadius:6}
      ]
    },
    options:{
      responsive:true,
      maintainAspectRatio:false,
      interaction:{mode:'index',intersect:false},
      plugins:{
        legend:{labels:{color:c.text,font:{size:11,family:"'DM Sans'"},boxWidth:12,padding:16}},
        tooltip:{callbacks:{label:function(item){return item.dataset.label+': '+formatCurrency(item.raw);}}}
      },
      scales:{
        x:{ticks:{color:c.text,font:{size:11}},grid:{display:false}},
        y:{ticks:{color:c.text,callback:function(v){return formatCurrency(v);}},grid:{color:c.grid}}
      }
    }
  });
}

/* ================================================================
   Monthly P&L Table
   ================================================================ */
function renderPLTable(grossRent, vacancy, taxes, insurance, maintenance, management, mortgage, netCF, noi){
  var tbody=document.getElementById('plTableBody');

  var rows=[
    {item:'Gross Scheduled Rent',monthly:grossRent,annual:grossRent*12,cls:'highlight'},
    {item:'Less: Vacancy',monthly:-vacancy,annual:-vacancy*12,cls:''},
    {item:'Effective Gross Income',monthly:grossRent-vacancy,annual:(grossRent-vacancy)*12,cls:'highlight'},
    {item:'',monthly:null,annual:null,cls:'divider'},
    {item:'Property Taxes',monthly:-taxes,annual:-taxes*12,cls:''},
    {item:'Insurance',monthly:-insurance,annual:-insurance*12,cls:''},
    {item:'Maintenance & Repairs',monthly:-maintenance,annual:-maintenance*12,cls:''},
    {item:'Property Management',monthly:-management,annual:-management*12,cls:''},
    {item:'Total Operating Expenses',monthly:-(taxes+insurance+maintenance+management),annual:-(taxes+insurance+maintenance+management)*12,cls:'highlight'},
    {item:'',monthly:null,annual:null,cls:'divider'},
    {item:'Net Operating Income (NOI)',monthly:noi,annual:noi*12,cls:'highlight'},
    {item:'',monthly:null,annual:null,cls:'divider'},
    {item:'Mortgage Payment (P&I)',monthly:-mortgage,annual:-mortgage*12,cls:''},
    {item:'',monthly:null,annual:null,cls:'divider'},
    {item:'Net Cash Flow',monthly:netCF,annual:netCF*12,cls:'total'},
  ];

  var html='';
  rows.forEach(function(r){
    if(r.cls==='divider'){
      html+='<tr><td colspan="3" style="padding:0;"><div style="border-top:1px solid var(--color-divider);"></div></td></tr>';
      return;
    }
    var mStr=r.monthly!==null?formatCurrency(Math.abs(r.monthly)):'';
    var aStr=r.annual!==null?formatCurrency(Math.abs(r.annual)):'';
    // Show negative sign
    if(r.monthly<0){mStr='-'+mStr;}
    if(r.annual<0){aStr='-'+aStr;}

    var style='';
    if(r.cls==='total'){
      var clr=r.monthly>=0?'var(--color-success)':'var(--color-error)';
      style='font-weight:700;border-top:2px solid var(--color-divider);color:'+clr+';';
    } else if(r.cls==='highlight'){
      style='font-weight:600;';
    }

    html+='<tr style="'+style+'"><td>'+r.item+'</td><td class="text-right">'+mStr+'</td><td class="text-right">'+aStr+'</td></tr>';
  });

  tbody.innerHTML=html;
}

/* ---- Wire up buttons ---- */
document.getElementById('calcBtn').addEventListener('click', calculate);
document.getElementById('btnModify').addEventListener('click', modifyInputs);
document.getElementById('btnModify2').addEventListener('click', modifyInputs);
