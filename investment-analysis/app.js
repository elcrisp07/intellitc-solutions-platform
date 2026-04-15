/* ============================================================
   Investment Analysis + Cost Segregation Calculator
   IntelliTC Solutions
   ============================================================ */

/* ---- Theme Toggle (IIFE — must remain first) ---- */
(function(){const toggles=document.querySelectorAll('[data-theme-toggle]'),r=document.documentElement;let d=localStorage.getItem('intellitc-theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');r.setAttribute('data-theme',d);function updateIcon(){const icon=d==='dark'?'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>':'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';toggles.forEach(function(t){t.innerHTML=icon;});}updateIcon();toggles.forEach(function(t){t.addEventListener('click',function(){d=d==='dark'?'light':'dark';r.setAttribute('data-theme',d);localStorage.setItem('intellitc-theme',d);t.setAttribute('aria-label','Switch to '+(d==='dark'?'light':'dark')+' mode');updateIcon();Object.values(window.__charts||{}).forEach(function(c){if(c&&c.update)c.update();});if(typeof onThemeChange==='function')onThemeChange();});});})();

/* ---- Utilities ---- */
function parseNum(s){return parseFloat(String(s).replace(/[^0-9.\-]/g,''))||0;}
function formatCurrency(n){if(Math.abs(n)>=1e6)return(n<0?'-':'')+'$'+(Math.abs(n)/1e6).toFixed(1)+'M';return(n<0?'-$':'$')+Math.abs(Math.round(n)).toLocaleString();}
function formatPct(n){return n.toFixed(1)+'%';}
function formatNum(n){return Math.round(n).toLocaleString();}

/* ---- Chart helpers ---- */
window.__charts = {};
function getCS(){
  var s=getComputedStyle(document.documentElement);
  return {
    c1: s.getPropertyValue('--chart-1').trim(),
    c2: s.getPropertyValue('--chart-2').trim(),
    c3: s.getPropertyValue('--chart-3').trim(),
    c4: s.getPropertyValue('--chart-4').trim(),
    c5: s.getPropertyValue('--chart-5').trim(),
    c6: s.getPropertyValue('--chart-6').trim(),
    text: s.getPropertyValue('--color-text-muted').trim(),
    grid: s.getPropertyValue('--color-divider').trim(),
    surface: s.getPropertyValue('--color-surface').trim()
  };
}
function destroyCharts(){
  Object.values(window.__charts).forEach(function(c){if(c&&c.destroy)c.destroy();});
  window.__charts = {};
}
function chartOpts(title, type){
  var cs = getCS();
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, labels: { color: cs.text, font: { family: 'DM Sans' } } },
      title:  { display: !!title, text: title, color: cs.text, font: { family: 'DM Sans', size: 14, weight: 600 } },
      tooltip: { backgroundColor: cs.surface, titleColor: cs.text, bodyColor: cs.text, borderColor: cs.grid, borderWidth: 1 }
    },
    scales: (type==='pie'||type==='doughnut'||type==='radar') ? undefined : {
      x: { ticks: { color: cs.text }, grid: { color: cs.grid } },
      y: { ticks: { color: cs.text }, grid: { color: cs.grid } }
    }
  };
}

/* ---- Currency auto-format on blur ---- */
document.querySelectorAll('input[data-currency]').forEach(function(inp){
  inp.addEventListener('blur', function(){
    var v = parseNum(inp.value);
    if(v) inp.value = Math.round(v).toLocaleString();
  });
});

/* ---- Panel toggle ---- */
var inputPanel   = document.getElementById('inputPanel');
var resultsPanel = document.getElementById('resultsPanel');
function showResults(){ inputPanel.classList.add('hidden');    resultsPanel.classList.remove('hidden'); window.scrollTo({top:0,behavior:'smooth'}); }
function showInputs(){  resultsPanel.classList.add('hidden'); inputPanel.classList.remove('hidden');    window.scrollTo({top:0,behavior:'smooth'}); }
document.querySelectorAll('[data-back]').forEach(function(b){ b.addEventListener('click', showInputs); });

/* ---- Bonus depreciation phase-down schedule ---- */
var BONUS_DEPR = {
  2020: 1.00,
  2021: 1.00,
  2022: 1.00,
  2023: 0.80,
  2024: 0.60,
  2025: 0.40,
  2026: 0.20,
  2027: 0.00
};

/* Standard depreciation life by property type */
var STD_LIFE = {
  residential: 27.5,
  apartment:   27.5,
  industrial:  39,
  office:      39,
  retail:      39,
  hotel:       39,
  mixed:       39
};

/*
  Component reclassification percentages by property type.
  Conservative is typical study outcome; Optimistic is aggressive but achievable.
*/
var CS_SCENARIOS = {
  residential: {
    conservative: { '5yr': 0.10, '7yr': 0.03, '15yr': 0.07, 'std': 0.80 },
    optimistic:   { '5yr': 0.18, '7yr': 0.05, '15yr': 0.12, 'std': 0.65 }
  },
  apartment: {
    conservative: { '5yr': 0.12, '7yr': 0.03, '15yr': 0.08, 'std': 0.77 },
    optimistic:   { '5yr': 0.20, '7yr': 0.05, '15yr': 0.14, 'std': 0.61 }
  },
  industrial: {
    conservative: { '5yr': 0.08, '7yr': 0.05, '15yr': 0.12, 'std': 0.75 },
    optimistic:   { '5yr': 0.14, '7yr': 0.08, '15yr': 0.18, 'std': 0.60 }
  },
  office: {
    conservative: { '5yr': 0.10, '7yr': 0.04, '15yr': 0.10, 'std': 0.76 },
    optimistic:   { '5yr': 0.17, '7yr': 0.07, '15yr': 0.16, 'std': 0.60 }
  },
  retail: {
    conservative: { '5yr': 0.09, '7yr': 0.04, '15yr': 0.11, 'std': 0.76 },
    optimistic:   { '5yr': 0.16, '7yr': 0.06, '15yr': 0.17, 'std': 0.61 }
  },
  hotel: {
    conservative: { '5yr': 0.14, '7yr': 0.05, '15yr': 0.10, 'std': 0.71 },
    optimistic:   { '5yr': 0.22, '7yr': 0.08, '15yr': 0.15, 'std': 0.55 }
  },
  mixed: {
    conservative: { '5yr': 0.11, '7yr': 0.04, '15yr': 0.09, 'std': 0.76 },
    optimistic:   { '5yr': 0.18, '7yr': 0.06, '15yr': 0.14, 'std': 0.62 }
  }
};

/* MACRS GDS year-1 deduction rates (half-year convention) */
var MACRS_Y1 = {
  '5yr':   0.20,
  '7yr':   0.1429,
  '15yr':  0.05,
  '27.5yr': 1 / 27.5,
  '39yr':   1 / 39
};

/* 5-year cumulative MACRS deduction rates */
var MACRS_5YR_CUM = {
  '5yr':    0.20 + 0.32 + 0.192 + 0.1152 + 0.1152,
  '7yr':    0.1429 + 0.2449 + 0.1749 + 0.1249 + 0.0893,
  '15yr':   0.05 + 0.095 + 0.0855 + 0.077 + 0.0693,
  '27.5yr': 5 / 27.5,
  '39yr':   5 / 39
};

/* ---- Update bonus rate display badge when year changes ---- */
function updateBonusRate(){
  var yearEl  = document.getElementById('csYearPlaced');
  var badgeEl = document.getElementById('bonusRateBadge');
  if(!yearEl || !badgeEl) return;
  var yr   = parseInt(yearEl.value) || 2025;
  var rate = BONUS_DEPR[yr];
  if(rate === undefined) rate = 0;
  var pct = Math.round(rate * 100);
  badgeEl.textContent = pct + '% Bonus';
  badgeEl.style.opacity = rate === 0 ? '0.5' : '1';
}

/* ---- Tab switching ---- */
function switchTab(tabId, btn){
  /* Hide all tab contents */
  document.querySelectorAll('.tab-content').forEach(function(tc){
    tc.classList.remove('active');
  });
  /* Deactivate all tab buttons */
  document.querySelectorAll('.tab-btn').forEach(function(tb){
    tb.classList.remove('active');
  });
  /* Show the selected tab */
  var tabEl = document.getElementById(tabId);
  if(tabEl) tabEl.classList.add('active');
  if(btn)   btn.classList.add('active');
  /* Resize charts after show (they may be hidden/zero-sized) */
  setTimeout(function(){
    Object.values(window.__charts||{}).forEach(function(c){
      if(c && c.resize) c.resize();
    });
  }, 50);
  /* If switching to cost-seg or full-picture and not yet calculated, run it */
  if((tabId === 'tab-costseg' || tabId === 'tab-fullpicture') && !window._costSegCalculated){
    calculateCostSeg();
  }
}

/* ============================================================
   Cost Segregation Engine
   ============================================================ */
function calcCostSeg(pp, landValue, renovation, taxBracket, yearPlaced, propertyType){
  var depreciableBasis = (pp - landValue) + renovation;
  if(depreciableBasis < 0) depreciableBasis = 0;

  var stdLife  = STD_LIFE[propertyType] || 27.5;
  var stdKey   = stdLife === 27.5 ? '27.5yr' : '39yr';
  var bonusPct = BONUS_DEPR[parseInt(yearPlaced)] !== undefined ? BONUS_DEPR[parseInt(yearPlaced)] : 0;
  var bracket  = (parseFloat(taxBracket) || 24) / 100;

  /* No-study scenario: straight-line standard depreciation */
  var noStudyY1Depr = depreciableBasis * MACRS_Y1[stdKey];
  var noStudyTaxSvg = noStudyY1Depr * bracket;
  var noStudy5Yr    = depreciableBasis * MACRS_5YR_CUM[stdKey];

  function calcScenario(pcts){
    var basis5   = depreciableBasis * pcts['5yr'];
    var basis7   = depreciableBasis * pcts['7yr'];
    var basis15  = depreciableBasis * pcts['15yr'];
    var basisStd = depreciableBasis * pcts['std'];

    /* Year-1 depreciation: bonus applies to 5-yr, 7-yr, and 15-yr property */
    var depr5   = basis5  * (bonusPct + (1 - bonusPct) * MACRS_Y1['5yr']);
    var depr7   = basis7  * (bonusPct + (1 - bonusPct) * MACRS_Y1['7yr']);
    var depr15  = basis15 * (bonusPct + (1 - bonusPct) * MACRS_Y1['15yr']);
    var deprStd = basisStd * MACRS_Y1[stdKey];
    var totalY1Depr = depr5 + depr7 + depr15 + deprStd;

    /* 5-year cumulative (bonus front-loads year 1 for shorter classes) */
    var cum5   = basis5  * (bonusPct + (1 - bonusPct) * MACRS_5YR_CUM['5yr']);
    var cum7   = basis7  * (bonusPct + (1 - bonusPct) * MACRS_5YR_CUM['7yr']);
    var cum15  = basis15 * (bonusPct + (1 - bonusPct) * MACRS_5YR_CUM['15yr']);
    var cumStd = basisStd * MACRS_5YR_CUM[stdKey];
    var total5YrCum = cum5 + cum7 + cum15 + cumStd;

    return {
      y1Depr:   totalY1Depr,
      taxSvg:   totalY1Depr * bracket,
      cum5yr:   total5YrCum,
      basis5:   basis5,
      basis7:   basis7,
      basis15:  basis15,
      basisStd: basisStd,
      depr5:    depr5,
      depr7:    depr7,
      depr15:   depr15,
      deprStd:  deprStd
    };
  }

  var pcts = CS_SCENARIOS[propertyType] || CS_SCENARIOS.residential;
  var conservative = calcScenario(pcts.conservative);
  var optimistic   = calcScenario(pcts.optimistic);

  return {
    depreciableBasis: depreciableBasis,
    stdLife:          stdLife,
    stdKey:           stdKey,
    bonusPct:         bonusPct,
    bracket:          bracket,
    noStudy: {
      y1Depr: noStudyY1Depr,
      taxSvg: noStudyTaxSvg,
      cum5yr: noStudy5Yr
    },
    conservative: conservative,
    optimistic:   optimistic,
    pcts:         pcts
  };
}

/* ============================================================
   Render Cost Segregation Tab (Tab 2)
   ============================================================ */
function renderCostSeg(cs){
  function fc(n){ return formatCurrency(n); }
  function fp(n){ return n.toFixed(1) + '%'; }

  /* Scenario cards */
  document.getElementById('csNoStudyDepr').textContent      = fc(cs.noStudy.y1Depr);
  document.getElementById('csNoStudyTax').textContent       = fc(cs.noStudy.taxSvg);
  document.getElementById('csNoStudy5Yr').textContent       = fc(cs.noStudy.cum5yr);

  document.getElementById('csConservativeDepr').textContent     = fc(cs.conservative.y1Depr);
  document.getElementById('csConservativeTax').textContent      = fc(cs.conservative.taxSvg);
  document.getElementById('csConservativeIncrease').textContent = fc(cs.conservative.y1Depr - cs.noStudy.y1Depr);
  document.getElementById('csConservative5Yr').textContent      = fc(cs.conservative.cum5yr);

  document.getElementById('csOptimisticDepr').textContent     = fc(cs.optimistic.y1Depr);
  document.getElementById('csOptimisticTax').textContent      = fc(cs.optimistic.taxSvg);
  document.getElementById('csOptimisticIncrease').textContent = fc(cs.optimistic.y1Depr - cs.noStudy.y1Depr);
  document.getElementById('csOptimistic5Yr').textContent      = fc(cs.optimistic.cum5yr);

  /* Component reclassification table */
  var db       = cs.depreciableBasis;
  var pcts     = cs.pcts;
  var stdLabel = cs.stdLife === 27.5 ? '27.5-Year (Residential)' : '39-Year (Commercial)';
  var rows = [
    { label: '5-Year Personal Property',  pctC: pcts.conservative['5yr'],  pctO: pcts.optimistic['5yr'],  deprC: cs.conservative.depr5,   deprO: cs.optimistic.depr5   },
    { label: '7-Year Personal Property',  pctC: pcts.conservative['7yr'],  pctO: pcts.optimistic['7yr'],  deprC: cs.conservative.depr7,   deprO: cs.optimistic.depr7   },
    { label: '15-Year Land Improvements', pctC: pcts.conservative['15yr'], pctO: pcts.optimistic['15yr'], deprC: cs.conservative.depr15,  deprO: cs.optimistic.depr15  },
    { label: stdLabel,                    pctC: pcts.conservative['std'],  pctO: pcts.optimistic['std'],  deprC: cs.conservative.deprStd, deprO: cs.optimistic.deprStd }
  ];

  var tbody = document.getElementById('csComponentBody');
  tbody.innerHTML = '';
  rows.forEach(function(r){
    var avgPct    = (r.pctC + r.pctO) / 2;
    var dollarAmt = db * avgPct;
    tbody.innerHTML += '<tr>'
      + '<td>' + r.label + '</td>'
      + '<td class="text-right">' + fp(avgPct * 100) + '</td>'
      + '<td class="text-right">' + fc(dollarAmt) + '</td>'
      + '<td class="text-right">' + fc(r.deprC) + '</td>'
      + '<td class="text-right">' + fc(r.deprO) + '</td>'
      + '</tr>';
  });

  /* Stacked bar chart: depreciation by asset class per scenario */
  if(window.__charts.costseg){ window.__charts.costseg.destroy(); }
  var cs2 = getCS();

  window.__charts.costseg = new Chart(document.getElementById('chartCostSeg'), {
    type: 'bar',
    data: {
      labels: ['No Study', 'Conservative', 'Optimistic'],
      datasets: [
        {
          label: '5-Year',
          data: [0, cs.conservative.depr5, cs.optimistic.depr5],
          backgroundColor: cs2.c1,
          stack: 'stack0'
        },
        {
          label: '7-Year',
          data: [0, cs.conservative.depr7, cs.optimistic.depr7],
          backgroundColor: cs2.c6,
          stack: 'stack0'
        },
        {
          label: '15-Year',
          data: [0, cs.conservative.depr15, cs.optimistic.depr15],
          backgroundColor: cs2.c2,
          stack: 'stack0'
        },
        {
          label: 'Standard (' + cs.stdLife + '-yr)',
          data: [cs.noStudy.y1Depr, cs.conservative.deprStd, cs.optimistic.deprStd],
          backgroundColor: cs2.grid,
          stack: 'stack0'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, labels: { color: cs2.text, font: { family: 'DM Sans' } } },
        tooltip: {
          backgroundColor: cs2.surface,
          titleColor: cs2.text,
          bodyColor: cs2.text,
          borderColor: cs2.grid,
          borderWidth: 1,
          callbacks: {
            label: function(ctx){ return ctx.dataset.label + ': ' + formatCurrency(ctx.raw); }
          }
        }
      },
      scales: {
        x: { stacked: true, ticks: { color: cs2.text }, grid: { display: false } },
        y: {
          stacked: true,
          ticks: { color: cs2.text, callback: function(v){ return formatCurrency(v); } },
          grid: { color: cs2.grid }
        }
      }
    }
  });
}

/* ============================================================
   Render Full Picture Tab (Tab 3)
   ============================================================ */
function renderFullPicture(capRate, coc, monthlyCF, annualCF, cashIn, cs){
  function fc(n){ return formatCurrency(n); }
  function fp(n){ return n.toFixed(2) + '%'; }

  /* After-tax CoC: add Year-1 tax savings to annual cash flow, recalculate CoC */
  var cocConservative = ((annualCF + cs.conservative.taxSvg) / cashIn) * 100;
  var cocOptimistic   = ((annualCF + cs.optimistic.taxSvg)   / cashIn) * 100;

  /* KPI row */
  document.getElementById('fpKpiCapRate').textContent   = formatPct(capRate);
  document.getElementById('fpKpiCoCBefore').textContent = formatPct(coc);
  document.getElementById('fpKpiCoCAfter').textContent  = formatPct(cocConservative);
  var fpCF = document.getElementById('fpKpiCashFlow');
  fpCF.textContent = formatCurrency(monthlyCF);
  fpCF.className   = 'kpi-value ' + (monthlyCF >= 0 ? 'kpi-positive' : 'kpi-negative');
  document.getElementById('fpKpiTaxSavings').textContent = formatCurrency(cs.conservative.taxSvg);

  /* Comparison table */
  var tbody = document.getElementById('fpComparisonBody');
  tbody.innerHTML = '';

  var compRows = [
    {
      metric: 'Annual Depreciation (Year 1)',
      noSeg: fc(cs.noStudy.y1Depr),
      cons:  fc(cs.conservative.y1Depr),
      opt:   fc(cs.optimistic.y1Depr)
    },
    {
      metric: 'Year-1 Tax Savings',
      noSeg: fc(cs.noStudy.taxSvg),
      cons:  fc(cs.conservative.taxSvg),
      opt:   fc(cs.optimistic.taxSvg)
    },
    {
      metric: 'After-Tax Cash Flow (Annual)',
      noSeg: fc(annualCF + cs.noStudy.taxSvg),
      cons:  fc(annualCF + cs.conservative.taxSvg),
      opt:   fc(annualCF + cs.optimistic.taxSvg)
    },
    {
      metric: 'Effective CoC Return',
      noSeg: fp(((annualCF + cs.noStudy.taxSvg) / cashIn) * 100),
      cons:  fp(cocConservative),
      opt:   fp(cocOptimistic)
    },
    {
      metric: '5-Year Total Depreciation',
      noSeg: fc(cs.noStudy.cum5yr),
      cons:  fc(cs.conservative.cum5yr),
      opt:   fc(cs.optimistic.cum5yr)
    }
  ];

  compRows.forEach(function(r, i){
    var boldClass = (i === compRows.length - 1) ? ' class="bold-row"' : '';
    tbody.innerHTML += '<tr' + boldClass + '>'
      + '<td>' + r.metric + '</td>'
      + '<td>' + r.noSeg + '</td>'
      + '<td class="col-teal">' + r.cons + '</td>'
      + '<td class="col-gold">' + r.opt + '</td>'
      + '</tr>';
  });

  /* Before / After grouped bar chart */
  if(window.__charts.fullpicture){ window.__charts.fullpicture.destroy(); }
  var cs2 = getCS();

  var labels     = ['Annual Depreciation', 'Year-1 Tax Savings', 'After-Tax Annual CF'];
  var beforeVals = [cs.noStudy.y1Depr,      cs.noStudy.taxSvg,      annualCF + cs.noStudy.taxSvg];
  var consVals   = [cs.conservative.y1Depr, cs.conservative.taxSvg, annualCF + cs.conservative.taxSvg];
  var optVals    = [cs.optimistic.y1Depr,   cs.optimistic.taxSvg,   annualCF + cs.optimistic.taxSvg];

  window.__charts.fullpicture = new Chart(document.getElementById('chartFullPicture'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: 'No Study',     data: beforeVals, backgroundColor: cs2.grid },
        { label: 'Conservative', data: consVals,   backgroundColor: cs2.c1   },
        { label: 'Optimistic',   data: optVals,    backgroundColor: cs2.c6   }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, labels: { color: cs2.text, font: { family: 'DM Sans' } } },
        tooltip: {
          backgroundColor: cs2.surface,
          titleColor: cs2.text,
          bodyColor: cs2.text,
          borderColor: cs2.grid,
          borderWidth: 1,
          callbacks: {
            label: function(ctx){ return ctx.dataset.label + ': ' + formatCurrency(ctx.raw); }
          }
        }
      },
      scales: {
        x: { ticks: { color: cs2.text }, grid: { display: false } },
        y: {
          ticks: { color: cs2.text, callback: function(v){ return formatCurrency(v); } },
          grid: { color: cs2.grid }
        }
      }
    }
  });
}

/* ============================================================
   calculateCostSeg() — read inputs, run calcCostSeg, render both tabs
   Called when user switches to cost-seg/full-picture tab or after calculate()
   ============================================================ */
function calculateCostSeg(){
  var ppEl       = document.getElementById('purchasePrice');
  var landEl     = document.getElementById('csLandValue');
  var renoEl     = document.getElementById('csRenovation');
  var bracketEl  = document.getElementById('csTaxBracket');
  var yearEl     = document.getElementById('csYearPlaced');
  var typeEl     = document.getElementById('csPropertyType');

  if(!ppEl || !landEl || !bracketEl || !yearEl || !typeEl) return;

  var pp           = parseNum(ppEl.value);
  var landValue    = parseNum(landEl.value);
  var renovation   = renoEl ? parseNum(renoEl.value) : 0;
  var taxBracket   = bracketEl.value;
  var yearPlaced   = yearEl.value;
  var propertyType = typeEl.value;

  var csResult = calcCostSeg(pp, landValue, renovation, taxBracket, yearPlaced, propertyType);

  renderCostSeg(csResult);

  /* Full picture needs investment analysis results — use stored values */
  if(window._calcResults){
    var r = window._calcResults;
    renderFullPicture(r.capRate, r.coc, r.monthlyCF, r.annualCF, r.cashIn, csResult);
  }

  window._costSegCalculated = true;
}

/* ============================================================
   Main calculate() — Investment Analysis
   ============================================================ */
function calculate(){
  var pp    = parseNum(document.getElementById('purchasePrice').value);
  var dpPct = parseNum(document.getElementById('downPayment').value) / 100;
  var rate  = parseNum(document.getElementById('interestRate').value) / 100;
  var term  = parseNum(document.getElementById('loanTerm').value);
  var rent  = parseNum(document.getElementById('monthlyIncome').value);
  var other = parseNum(document.getElementById('otherIncome').value);
  var vac   = parseNum(document.getElementById('vacancyRate').value) / 100;
  var tax   = parseNum(document.getElementById('propTax').value);
  var ins   = parseNum(document.getElementById('insurance').value);
  var maint = parseNum(document.getElementById('maintenance').value);
  var util  = parseNum(document.getElementById('utilities').value);
  var mgmt  = rent * parseNum(document.getElementById('propMgmt').value) / 100;
  var hoa   = parseNum(document.getElementById('hoa').value);

  var loan    = pp * (1 - dpPct);
  var mr      = rate / 12;
  var n       = term * 12;
  var mortPmt = mr > 0 ? loan * (mr * Math.pow(1+mr,n)) / (Math.pow(1+mr,n) - 1) : (n > 0 ? loan / n : 0);

  var grossInc  = rent + other;
  var effInc    = grossInc * (1 - vac);
  var totalExp  = tax + ins + maint + util + mgmt + hoa;
  var noi       = (effInc - totalExp) * 12;
  var monthlyCF = effInc - totalExp - mortPmt;
  var annualCF  = monthlyCF * 12;
  var cashIn    = pp * dpPct + pp * 0.03;
  var capRate   = pp > 0 ? noi / pp * 100 : 0;
  var coc       = cashIn > 0 ? annualCF / cashIn * 100 : 0;
  var grm       = grossInc > 0 ? pp / (grossInc * 12) : 0;
  var beOcc     = grossInc > 0 ? ((totalExp + mortPmt) / grossInc) * 100 : 0;

  /* --- KPI display --- */
  document.getElementById('kpiCapRate').textContent    = formatPct(capRate);
  document.getElementById('kpiCoC').textContent        = formatPct(coc);
  document.getElementById('kpiCashFlow').textContent   = formatCurrency(monthlyCF);
  document.getElementById('kpiCashFlow').className     = 'kpi-value ' + (monthlyCF >= 0 ? 'kpi-positive' : 'kpi-negative');
  document.getElementById('kpiCashFlowDetail').textContent = formatCurrency(annualCF) + '/year';
  document.getElementById('kpiBEOcc').textContent      = formatPct(Math.min(beOcc, 100));
  document.getElementById('kpiBEOccDetail').textContent = 'GRM: ' + grm.toFixed(1);

  /* Store results for cross-tab use */
  window._calcResults = {
    pp:        pp,
    annualCF:  annualCF,
    cashIn:    cashIn,
    capRate:   capRate,
    coc:       coc,
    monthlyCF: monthlyCF,
    noi:       noi
  };
  /* Reset cost seg calc flag so it recalculates with new inputs */
  window._costSegCalculated = false;

  /* --- Destroy all previous charts --- */
  destroyCharts();
  var cs = getCS();

  /* --- Expense doughnut chart --- */
  var expLabels = ['Taxes', 'Insurance', 'Maintenance', 'Utilities', 'Management', 'HOA'];
  var expRaw    = [tax, ins, maint, util, mgmt, hoa];
  var expVals   = expRaw.filter(function(v){ return v > 0; });
  var expLbls   = expLabels.filter(function(_,i){ return expRaw[i] > 0; });

  window.__charts.exp = new Chart(document.getElementById('chartExpenses'), {
    type: 'doughnut',
    data: {
      labels: expLbls,
      datasets: [{ data: expVals, backgroundColor: [cs.c1, cs.c2, cs.c3, cs.c4, cs.c5, cs.c6] }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { color: cs.text, font: { family: 'DM Sans' } } }
      }
    }
  });

  /* --- ROI bar chart --- */
  window.__charts.roi = new Chart(document.getElementById('chartROI'), {
    type: 'bar',
    data: {
      labels: ['Cap Rate', 'CoC Return', 'Break-Even Occ.'],
      datasets: [{ data: [capRate, coc, beOcc], backgroundColor: [cs.c1, cs.c3, cs.c2] }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: cs.surface, titleColor: cs.text, bodyColor: cs.text, borderColor: cs.grid, borderWidth: 1 }
      },
      scales: {
        x: { ticks: { color: cs.text }, grid: { display: false } },
        y: { ticks: { color: cs.text, callback: function(v){ return v + '%'; } }, grid: { color: cs.grid } }
      }
    }
  });

  /* --- P&L table --- */
  var items = [
    ['Gross Rental Income', grossInc,         grossInc * 12],
    ['Other Income',        other,             other * 12],
    ['Vacancy Loss',       -grossInc * vac,   -grossInc * vac * 12],
    ['Effective Income',    effInc,            effInc * 12],
    ['---', '', ''],
    ['Property Tax',       -tax,              -tax * 12],
    ['Insurance',          -ins,              -ins * 12],
    ['Maintenance',        -maint,            -maint * 12],
    ['Utilities',          -util,             -util * 12],
    ['Management',         -mgmt,             -mgmt * 12],
    ['HOA',                -hoa,              -hoa * 12],
    ['Total Expenses',     -totalExp,         -totalExp * 12],
    ['---', '', ''],
    ['NOI',                 effInc - totalExp, noi],
    ['Mortgage Payment',   -mortPmt,          -mortPmt * 12],
    ['Net Cash Flow',       monthlyCF,         annualCF]
  ];
  var tbody = document.getElementById('plBody');
  tbody.innerHTML = '';
  items.forEach(function(row){
    var label = row[0]; var mo = row[1]; var yr = row[2];
    if(label === '---'){
      tbody.innerHTML += '<tr><td colspan="3" style="border-bottom:2px solid var(--color-divider)"></td></tr>';
      return;
    }
    var isBold = ['Effective Income','Total Expenses','NOI','Net Cash Flow'].indexOf(label) > -1;
    var boldStyle = isBold ? 'font-weight:600' : '';
    var hiClass   = label === 'Net Cash Flow' ? ' highlight' : '';
    tbody.innerHTML += '<tr style="' + boldStyle + '">'
      + '<td>' + label + '</td>'
      + '<td class="text-right' + hiClass + '">' + (typeof mo === 'number' ? formatCurrency(mo) : '') + '</td>'
      + '<td class="text-right' + hiClass + '">' + (typeof yr === 'number' ? formatCurrency(yr) : '') + '</td>'
      + '</tr>';
  });

  showResults();

  /* Also run cost seg so all tabs are populated immediately */
  calculateCostSeg();

  /* Save key outputs for cross-calculator data passing */
  DealData.save({
    purchasePrice: pp,
    noi:           noi,
    cashFlow:      annualCF,
    capRate:       capRate
  });
}
