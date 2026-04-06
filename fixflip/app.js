/* ===========================================================
   Fix & Flip Calculator — app.js
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
  var pp=parseNum(document.getElementById('purchasePrice').value);
  var arv=parseNum(document.getElementById('arv').value);
  var repairs=parseNum(document.getElementById('repairCosts').value);
  var months=parseNum(document.getElementById('holdingMonths').value);

  if(pp<=0) errs.push('Purchase price must be greater than $0.');
  if(arv<=0) errs.push('ARV must be greater than $0.');
  if(repairs<0) errs.push('Repair costs cannot be negative.');
  if(months<1||months>36) errs.push('Holding period must be 1–36 months.');

  var el=document.getElementById('errorMsg');
  if(errs.length){
    el.textContent=errs.join(' ');
    el.classList.remove('hidden');
    return false;
  }
  el.classList.add('hidden');
  return true;
}

/* ---- Main calculation ---- */
function calculate(){
  if(!validate()) return;

  // Read inputs
  var purchasePrice  = parseNum(document.getElementById('purchasePrice').value);
  var arv            = parseNum(document.getElementById('arv').value);
  var repairCosts    = parseNum(document.getElementById('repairCosts').value);
  var holdingMonths  = parseNum(document.getElementById('holdingMonths').value);
  var holdInsurance  = parseNum(document.getElementById('holdInsurance').value);
  var holdTaxes      = parseNum(document.getElementById('holdTaxes').value);
  var holdUtilities  = parseNum(document.getElementById('holdUtilities').value);
  var closingBuyPct  = parseNum(document.getElementById('closingBuyPct').value)/100;
  var closingSellPct = parseNum(document.getElementById('closingSellPct').value)/100;
  var hmRate         = parseNum(document.getElementById('hmRate').value)/100;
  var hmPoints       = parseNum(document.getElementById('hmPoints').value)/100;
  var hmLTV          = parseNum(document.getElementById('hmLTV').value)/100;
  var desiredMargin  = parseNum(document.getElementById('desiredMargin').value)/100;

  // Derived values
  var holdingCostPerMonth = holdInsurance + holdTaxes + holdUtilities;
  var totalHoldingCosts   = holdingCostPerMonth * holdingMonths;
  var closingBuy          = purchasePrice * closingBuyPct;
  var closingSell         = arv * closingSellPct;
  var loanAmount          = purchasePrice * hmLTV;
  var downPayment         = purchasePrice - loanAmount;
  var loanPointsCost      = loanAmount * hmPoints;
  var loanInterest        = loanAmount * hmRate * (holdingMonths / 12);
  var totalFinancingCosts = loanPointsCost + loanInterest;

  var totalCost        = purchasePrice + repairCosts + totalHoldingCosts + closingBuy + closingSell + totalFinancingCosts;
  var netProfit        = arv - totalCost;
  // Cash invested = everything paid out of pocket (down payment + rehab + holding + buy closing + points + interest)
  var cashInvested     = downPayment + repairCosts + totalHoldingCosts + closingBuy + loanPointsCost + loanInterest;
  var roi              = cashInvested > 0 ? (netProfit / cashInvested) * 100 : 0;
  var profitMargin     = arv > 0 ? (netProfit / arv) * 100 : 0;
  var mao              = arv * 0.70 - repairCosts;
  // Break-even sale price: sale price S where S - S*closingSellPct = costWithoutSellClosing
  var costWithoutSellClosing = purchasePrice + repairCosts + totalHoldingCosts + closingBuy + totalFinancingCosts;
  var breakEvenSale    = closingSellPct < 1 ? costWithoutSellClosing / (1 - closingSellPct) : costWithoutSellClosing;
  var annualizedROI    = holdingMonths > 0 ? roi * (12 / holdingMonths) : 0;

  // Update results subtitle
  var summaryEl = document.getElementById('resultsSummary');
  if(summaryEl){
    summaryEl.textContent = formatCurrency(purchasePrice) + ' purchase \u2192 ' + formatCurrency(arv) + ' ARV \u2022 ' + holdingMonths + ' month hold \u2022 ' + formatCurrency(netProfit) + ' profit';
  }

  // ===== KPI Cards =====
  var kpiRow = document.getElementById('kpiRow');
  kpiRow.innerHTML = '';
  var kpis = [
    {label:'Net Profit', value: formatCurrency(netProfit), delta: netProfit >= 0 ? 'Profitable flip' : 'Loss on this deal', cls: netProfit >= 0 ? 'kpi-positive' : 'kpi-negative'},
    {label:'ROI', value: formatPercent(roi), delta: 'On ' + formatCurrency(cashInvested) + ' cash invested', cls: roi >= 20 ? 'kpi-positive' : roi >= 0 ? '' : 'kpi-negative'},
    {label:'Profit Margin', value: formatPercent(profitMargin), delta: 'Net profit \u00f7 ARV', cls: profitMargin >= desiredMargin*100 ? 'kpi-positive' : 'kpi-negative'},
    {label:'MAO (70% Rule)', value: formatCurrency(mao), delta: mao >= purchasePrice ? 'Purchase is at or below MAO' : 'Purchase exceeds MAO by ' + formatCurrency(purchasePrice - mao), cls: mao >= purchasePrice ? 'kpi-positive' : 'kpi-negative'},
  ];
  kpis.forEach(function(k){
    var card = document.createElement('div');
    card.className = 'kpi-card';
    card.innerHTML = '<span class="kpi-label">'+k.label+'</span><span class="kpi-value '+k.cls+'">'+k.value+'</span><span class="kpi-delta">'+k.delta+'</span>';
    kpiRow.appendChild(card);
  });

  // ===== Waterfall Chart =====
  renderWaterfallChart(purchasePrice, repairCosts, totalHoldingCosts, closingBuy + closingSell, totalFinancingCosts, netProfit);

  // ===== Sensitivity Chart =====
  renderSensitivityChart(arv, purchasePrice, repairCosts, totalHoldingCosts, closingBuy, closingSellPct, totalFinancingCosts);

  // ===== Deal Scorecard =====
  renderScorecard(netProfit, roi, profitMargin, mao, purchasePrice, annualizedROI, desiredMargin, breakEvenSale, arv);

  // ===== Itemization Table =====
  renderItemTable(purchasePrice, repairCosts, holdInsurance, holdTaxes, holdUtilities, holdingMonths, closingBuy, closingSell, loanPointsCost, loanInterest, totalCost, arv, netProfit, breakEvenSale, annualizedROI, cashInvested);

  showResults();
}

/* ---- Waterfall Chart ---- */
function renderWaterfallChart(purchase, repairs, holding, closing, financing, profit){
  var c = getChartColors();
  var ctx = document.getElementById('waterfallChart').getContext('2d');

  var labels = ['Purchase', 'Repairs', 'Holding', 'Closing', 'Financing', 'Profit'];
  var values = [purchase, repairs, holding, closing, financing, profit];

  // Build cumulative floating bars
  var cumulative = 0;
  var data = [];
  for(var i = 0; i < values.length - 1; i++){
    var base = cumulative;
    cumulative += values[i];
    data.push([base, cumulative]);
  }
  // Profit bar floats from total costs to total costs + profit
  var costTotal = cumulative;
  data.push([costTotal, costTotal + profit]);

  var barColors = [c.c3, c.c2, c.c7, c.c6, c.c8, profit >= 0 ? c.c1 : c.c5];

  if(window.__charts.waterfall) window.__charts.waterfall.destroy();
  window.__charts.waterfall = new Chart(ctx,{
    type:'bar',
    data:{
      labels: labels,
      datasets:[{
        data: data,
        backgroundColor: barColors,
        borderRadius: 4,
        borderSkipped: false,
      }]
    },
    options:{
      responsive:true,
      maintainAspectRatio:false,
      plugins:{
        legend:{display:false},
        tooltip:{
          callbacks:{
            label:function(item){
              return formatCurrency(values[item.dataIndex]);
            }
          }
        }
      },
      scales:{
        x:{
          ticks:{color:c.text, font:{size:11}},
          grid:{display:false}
        },
        y:{
          ticks:{color:c.text, callback:function(v){return formatCurrency(v);}},
          grid:{color:c.grid},
          beginAtZero:true
        }
      }
    }
  });
}

/* ---- Sensitivity Chart ---- */
function renderSensitivityChart(arv, purchase, repairs, holding, closingBuy, closingSellPct, financing){
  var c = getChartColors();
  var ctx = document.getElementById('sensitivityChart').getContext('2d');

  var multipliers = [0.85, 0.90, 0.95, 1.00, 1.05, 1.10, 1.15];
  var labels = ['-15%', '-10%', '-5%', 'Base ARV', '+5%', '+10%', '+15%'];
  var profits = multipliers.map(function(m){
    var adjARV = arv * m;
    var adjCloseSell = adjARV * closingSellPct;
    var total = purchase + repairs + holding + closingBuy + adjCloseSell + financing;
    return adjARV - total;
  });

  var bgColors = profits.map(function(p){ return p >= 0 ? c.c1 : c.c5; });

  if(window.__charts.sensitivity) window.__charts.sensitivity.destroy();
  window.__charts.sensitivity = new Chart(ctx,{
    type:'bar',
    data:{
      labels: labels,
      datasets:[{
        label:'Net Profit',
        data: profits,
        backgroundColor: bgColors,
        borderRadius: 4,
      }]
    },
    options:{
      responsive:true,
      maintainAspectRatio:false,
      plugins:{
        legend:{display:false},
        tooltip:{
          callbacks:{
            title:function(items){
              var i = items[0].dataIndex;
              return 'ARV: ' + formatCurrency(arv * multipliers[i]);
            },
            label:function(item){
              return 'Profit: ' + formatCurrency(item.raw);
            }
          }
        }
      },
      scales:{
        x:{
          ticks:{color:c.text, font:{size:11}},
          grid:{display:false}
        },
        y:{
          ticks:{color:c.text, callback:function(v){return formatCurrency(v);}},
          grid:{color:c.grid}
        }
      }
    }
  });
}

/* ---- Deal Scorecard ---- */
function renderScorecard(netProfit, roi, profitMargin, mao, purchasePrice, annualizedROI, desiredMargin, breakEvenSale, arv){
  var body = document.getElementById('scorecardBody');

  var checks = [
    {
      name: 'Net Profit > $0',
      value: formatCurrency(netProfit),
      status: netProfit > 0 ? 'pass' : 'fail',
    },
    {
      name: 'ROI \u2265 20%',
      value: formatPercent(roi),
      status: roi >= 20 ? 'pass' : roi >= 10 ? 'warn' : 'fail',
    },
    {
      name: 'Profit Margin \u2265 ' + formatPercent(desiredMargin*100),
      value: formatPercent(profitMargin),
      status: profitMargin >= desiredMargin*100 ? 'pass' : profitMargin >= desiredMargin*50 ? 'warn' : 'fail',
    },
    {
      name: 'Purchase \u2264 MAO',
      value: formatCurrency(purchasePrice) + ' vs ' + formatCurrency(mao),
      status: purchasePrice <= mao ? 'pass' : 'fail',
    },
    {
      name: 'Annualized ROI \u2265 30%',
      value: formatPercent(annualizedROI),
      status: annualizedROI >= 30 ? 'pass' : annualizedROI >= 15 ? 'warn' : 'fail',
    },
    {
      name: 'Break-even < ARV',
      value: formatCurrency(breakEvenSale),
      status: breakEvenSale < arv ? 'pass' : 'fail',
    },
  ];

  var passCount = checks.filter(function(c){return c.status==='pass';}).length;
  var total = checks.length;
  var overallStatus = passCount === total ? 'pass' : passCount >= Math.ceil(total * 0.65) ? 'warn' : 'fail';
  var overallLabel = overallStatus === 'pass' ? 'Strong Deal' : overallStatus === 'warn' ? 'Marginal Deal' : 'Risky Deal';
  var overallColor = overallStatus === 'pass' ? 'success' : overallStatus === 'warn' ? 'warning' : 'error';

  var html = '<div style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-4) var(--space-5);background:var(--color-surface-offset);border-radius:var(--radius-lg);margin-bottom:var(--space-4);">';
  html += '<span style="width:14px;height:14px;border-radius:var(--radius-full);background:var(--color-'+overallColor+');display:inline-block;flex-shrink:0;"></span>';
  html += '<span style="font-weight:700;font-size:var(--text-base);color:var(--color-'+overallColor+');">'+overallLabel+'</span>';
  html += '<span style="color:var(--color-text-muted);font-size:var(--text-xs);margin-left:auto;">'+passCount+'/'+total+' criteria passed</span>';
  html += '</div>';

  html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:var(--space-3);">';
  checks.forEach(function(ck){
    var clr = ck.status==='pass' ? 'success' : ck.status==='warn' ? 'warning' : 'error';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-3) var(--space-4);background:var(--color-bg);border:1px solid var(--color-divider);border-radius:var(--radius-md);font-size:var(--text-sm);">';
    html += '<span style="display:flex;align-items:center;gap:var(--space-2);">';
    html += '<span style="width:10px;height:10px;border-radius:var(--radius-full);background:var(--color-'+clr+');display:inline-block;flex-shrink:0;"></span>';
    html += '<span style="color:var(--color-text-muted);font-size:var(--text-xs);font-weight:500;">'+ck.name+'</span>';
    html += '</span>';
    html += '<span style="font-weight:700;font-family:var(--font-mono);font-size:var(--text-xs);color:var(--color-'+clr+');">'+ck.value+'</span>';
    html += '</div>';
  });
  html += '</div>';

  body.innerHTML = html;
}

/* ---- Itemization Table ---- */
function renderItemTable(purchase, repairs, holdIns, holdTax, holdUtil, months, closeBuy, closeSell, loanPoints, loanInterest, totalCost, arv, netProfit, breakEven, annualizedROI, cashInvested){
  var tbody = document.getElementById('itemTableBody');

  var rows = [
    ['Acquisition',  'Purchase Price',                           purchase],
    ['Acquisition',  'Closing Costs (Buy)',                      closeBuy],
    ['Rehab',        'Repair / Rehab Costs',                     repairs],
    ['Holding',      'Insurance (' + months + ' mo)',            holdIns * months],
    ['Holding',      'Property Taxes (' + months + ' mo)',       holdTax * months],
    ['Holding',      'Utilities (' + months + ' mo)',            holdUtil * months],
    ['Financing',    'Loan Origination Points',                  loanPoints],
    ['Financing',    'Loan Interest (' + months + ' mo)',        loanInterest],
    ['Sale',         'Closing Costs (Sell)',                      closeSell],
  ];

  var totalAll = rows.reduce(function(s,r){return s+r[2];},0);

  var html = '';
  rows.forEach(function(r){
    var pct = totalAll > 0 ? (r[2] / totalAll * 100) : 0;
    html += '<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td class="text-right">'+formatCurrency(r[2])+'</td><td class="text-right">'+formatPercent(pct)+'</td></tr>';
  });

  // Summary rows
  html += '<tr style="font-weight:700;border-top:2px solid var(--color-divider);background:var(--color-surface-offset);"><td></td><td>Total Costs</td><td class="text-right">'+formatCurrency(totalAll)+'</td><td class="text-right">100.0%</td></tr>';
  html += '<tr style="border-top:2px solid var(--color-primary);"><td></td><td class="highlight">Sale Price (ARV)</td><td class="text-right highlight">'+formatCurrency(arv)+'</td><td></td></tr>';
  html += '<tr><td></td><td class="highlight">Net Profit</td><td class="text-right" style="font-weight:700;color:'+(netProfit>=0?'var(--color-success)':'var(--color-error)')+';">'+formatCurrency(netProfit)+'</td><td class="text-right">'+formatPercent(arv>0?(netProfit/arv*100):0)+' of ARV</td></tr>';
  html += '<tr><td></td><td>Break-even Sale Price</td><td class="text-right">'+formatCurrency(breakEven)+'</td><td></td></tr>';
  html += '<tr><td></td><td>Total Cash Invested</td><td class="text-right">'+formatCurrency(cashInvested)+'</td><td></td></tr>';
  html += '<tr><td></td><td>Annualized ROI</td><td class="text-right" style="font-weight:600;">'+formatPercent(annualizedROI)+'</td><td></td></tr>';

  tbody.innerHTML = html;
}

/* ---- Wire up buttons ---- */
document.getElementById('calcBtn').addEventListener('click', calculate);
document.getElementById('btnModify').addEventListener('click', modifyInputs);
document.getElementById('btnModify2').addEventListener('click', modifyInputs);
