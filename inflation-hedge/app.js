/* ============================================================
   Inflation Hedge Analyzer — app.js
   Analyzes real estate as an inflation hedge via three mechanisms:
   1. Rent Growth (income tracks CPI)
   2. Property Appreciation (value correlation with CPI)
   3. Debt Devaluation (fixed payments shrink in real terms)
   ============================================================ */

/* ---------- helpers ---------- */
function num(id) {
  var el = document.getElementById(id);
  return parseFloat(String(el.value).replace(/[^0-9.\-]/g, '')) || 0;
}
function fmt(n) { return n.toLocaleString('en-US', { maximumFractionDigits: 0 }); }
function fmtD(n) { return '$' + fmt(Math.abs(n)); }
function pct(n) { return (n * 100).toFixed(1) + '%'; }

/* ---------- scenario multipliers ----------
   These scale how rent growth and appreciation respond to
   inflation type. Based on historical data:
   - 1970-1982 stagflation: home prices matched CPI (159%)
     but real gains were near zero, vacancies rose
   - Demand-pull: strong economy, rent/values exceed CPI
   - Cost-push: supply-side inflation, mixed performance
*/
var SCENARIOS = {
  'demand-pull': {
    label: 'Demand-Pull',
    rentMult: 1.10,   /* rents exceed inflation slightly */
    appMult: 1.05,    /* property appreciates above CPI */
    vacAdj: 0.0,      /* no vacancy adjustment */
    desc: 'Strong economy with rising wages and consumer spending. Rents and values outpace inflation.'
  },
  'cost-push': {
    label: 'Cost-Push',
    rentMult: 0.75,   /* rents lag inflation */
    appMult: 0.70,    /* appreciation lags CPI */
    vacAdj: 0.03,     /* 3% vacancy increase */
    desc: 'Rising input costs (energy, materials) squeeze margins. Rents and values lag inflation.'
  },
  'stagflation': {
    label: 'Stagflation',
    rentMult: 0.50,   /* rents significantly lag */
    appMult: 0.40,    /* nominal appreciation is weak */
    vacAdj: 0.08,     /* 8% vacancy increase */
    desc: 'High inflation with stagnant growth and rising unemployment. Only debt devaluation reliably holds.'
  }
};

function getScenario() {
  var active = document.querySelector('.scenario-card.active');
  return active ? active.dataset.scenario : 'demand-pull';
}

/* ---------- scenario selector ---------- */
window.selectScenario = function(el) {
  document.querySelectorAll('.scenario-card').forEach(function(c) { c.classList.remove('active'); });
  el.classList.add('active');
};

/* ---------- mortgage math ---------- */
function monthlyPayment(principal, annualRate, years) {
  if (annualRate <= 0) return principal / (years * 12);
  var r = annualRate / 12;
  var n = years * 12;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

/* ---------- main analysis ---------- */
var rentChartInstance = null;
var debtChartInstance = null;

window.analyze = function() {
  var price = num('purchasePrice');
  var dp = num('downPayment') / 100;
  var rate = num('mortgageRate') / 100;
  var term = num('mortgageTerm');
  var rent = num('monthlyRent');
  var infl = num('inflationRate') / 100;
  var hold = num('holdingPeriod');
  var scenKey = getScenario();
  var scen = SCENARIOS[scenKey];

  var loanAmt = price * (1 - dp);
  var pmt = monthlyPayment(loanAmt, rate, term);

  /* ---------- Year-by-year projection ---------- */
  var years = [];
  var rentGrowthRate = infl * scen.rentMult;
  var appRate = infl * scen.appMult;

  for (var y = 0; y <= hold; y++) {
    var rentY = rent * Math.pow(1 + rentGrowthRate, y);
    var valueY = price * Math.pow(1 + appRate, y);
    var cpiIndex = Math.pow(1 + infl, y);
    var realPmt = pmt / cpiIndex;
    var realValue = valueY / cpiIndex;
    var nomEquity = valueY - price;
    var realEquity = realValue - (price / 1); /* real equity = real value - original price (in year-0 dollars) */

    years.push({
      year: y,
      rent: rentY,
      annualRent: rentY * 12,
      propertyValue: valueY,
      cpiIndex: cpiIndex,
      nominalPayment: pmt,
      realPayment: realPmt,
      debtSavings: (pmt - realPmt) * 12,
      realValue: realValue,
      nomEquity: nomEquity,
      realEquity: realValue - price
    });
  }

  var finalYear = years[years.length - 1];

  /* ---------- KPI calculations ---------- */
  /* 1. Rent growth multiplier */
  var rentMultiplier = finalYear.rent / rent;

  /* 2. Real equity gain */
  var realEquityGain = finalYear.realEquity;

  /* 3. Cumulative debt devaluation benefit */
  var totalDebtBenefit = 0;
  for (var i = 1; i <= hold; i++) {
    totalDebtBenefit += years[i].debtSavings;
  }

  /* 4. Hedge effectiveness score (0-100) */
  /* Rent score: how well rent tracks inflation (1.0 = perfect) */
  var rentScore = Math.min(rentGrowthRate / infl, 1.2);
  /* Appreciation score: how well value tracks CPI */
  var appScore = Math.min(appRate / infl, 1.2);
  /* Debt score: based on leverage ratio and inflation rate */
  var leverage = loanAmt / price;
  var debtScore = Math.min(leverage * infl * hold / 2, 1.0);

  var hedgeScore = Math.round(
    (rentScore * 30) + (appScore * 35) + (debtScore * 35)
  );
  hedgeScore = Math.min(hedgeScore, 100);

  /* ---------- Render KPIs ---------- */
  document.getElementById('kpiHedgeVal').textContent = hedgeScore + '/100';
  document.getElementById('kpiHedgeSub').textContent =
    hedgeScore >= 70 ? 'Strong hedge' : hedgeScore >= 40 ? 'Partial hedge' : 'Weak hedge';

  document.getElementById('kpiRentVal').textContent = rentMultiplier.toFixed(2) + 'x';
  document.getElementById('kpiRentSub').textContent =
    fmtD(rent) + ' \u2192 ' + fmtD(finalYear.rent) + '/mo';

  document.getElementById('kpiEquityVal').textContent =
    (realEquityGain >= 0 ? '+' : '-') + fmtD(realEquityGain);
  document.getElementById('kpiEquitySub').textContent =
    realEquityGain >= 0 ? 'Beats inflation' : 'Inflation outpaced property';

  document.getElementById('kpiDebtVal').textContent = fmtD(totalDebtBenefit);
  document.getElementById('kpiDebtSub').textContent =
    'Real payment: ' + fmtD(pmt) + ' \u2192 ' + fmtD(finalYear.realPayment) + '/mo';

  /* ---------- Three Mechanisms ---------- */
  var mechHTML = '';
  /* Mechanism 1: Rent Growth */
  var totalRentNominal = 0, totalRentReal = 0;
  for (var i = 1; i <= hold; i++) {
    totalRentNominal += years[i].annualRent;
    totalRentReal += years[i].annualRent / years[i].cpiIndex;
  }
  mechHTML += '<div class="mechanism-card">' +
    '<h5>1. Rent Income Rises</h5>' +
    '<div class="mech-value">' + fmtD(totalRentNominal) + '</div>' +
    '<div class="mech-label">Total rent collected over ' + hold + ' years. ' +
    'At ' + pct(rentGrowthRate) + ' annual growth, rent rises from ' + fmtD(rent) + ' to ' + fmtD(finalYear.rent) + '/month.' +
    '</div></div>';

  /* Mechanism 2: Property Appreciation */
  mechHTML += '<div class="mechanism-card">' +
    '<h5>2. Values Track Inflation</h5>' +
    '<div class="mech-value">' + fmtD(finalYear.propertyValue) + '</div>' +
    '<div class="mech-label">Projected value after ' + hold + ' years at ' + pct(appRate) + ' annual appreciation. ' +
    'Nominal gain: ' + fmtD(finalYear.nomEquity) + '. Real gain (inflation-adjusted): ' +
    (realEquityGain >= 0 ? '+' : '-') + fmtD(realEquityGain) + '.' +
    '</div></div>';

  /* Mechanism 3: Debt Devaluation */
  mechHTML += '<div class="mechanism-card">' +
    '<h5>3. Debt Gets Cheaper</h5>' +
    '<div class="mech-value">' + fmtD(totalDebtBenefit) + '</div>' +
    '<div class="mech-label">Cumulative savings from paying fixed ' + fmtD(pmt) + '/month with inflating dollars. ' +
    'By year ' + hold + ', the real cost of each payment drops to ' + fmtD(finalYear.realPayment) + '.' +
    '</div></div>';

  document.getElementById('mechanismGrid').innerHTML = mechHTML;

  /* ---------- Scenario Comparison ---------- */
  var scCompHTML = '';
  Object.keys(SCENARIOS).forEach(function(key) {
    var sc = SCENARIOS[key];
    var scRentRate = infl * sc.rentMult;
    var scAppRate = infl * sc.appMult;
    var scFinalRent = rent * Math.pow(1 + scRentRate, hold);
    var scFinalVal = price * Math.pow(1 + scAppRate, hold);
    var scCPI = Math.pow(1 + infl, hold);
    var scRealVal = scFinalVal / scCPI;
    var scRealEquity = scRealVal - price;
    var scDebt = 0;
    for (var y = 1; y <= hold; y++) {
      scDebt += (pmt - pmt / Math.pow(1 + infl, y)) * 12;
    }
    var scRentScore = Math.min(scRentRate / infl, 1.2);
    var scAppScore = Math.min(scAppRate / infl, 1.2);
    var scDebtScore = Math.min(leverage * infl * hold / 2, 1.0);
    var scHedge = Math.round((scRentScore * 30) + (scAppScore * 35) + (scDebtScore * 35));
    scHedge = Math.min(scHedge, 100);

    var verdictClass = scHedge >= 70 ? 'sc-verdict-strong' : scHedge >= 40 ? 'sc-verdict-mixed' : 'sc-verdict-weak';
    var verdictText = scHedge >= 70 ? 'Strong Hedge' : scHedge >= 40 ? 'Partial Hedge' : 'Weak Hedge';

    scCompHTML += '<div class="sc-card' + (key === scenKey ? ' sc-active' : '') + '">' +
      '<h5>' + sc.label + '</h5>' +
      '<div class="sc-verdict ' + verdictClass + '">' + verdictText + ' (' + scHedge + ')</div>' +
      '<p style="margin-bottom:var(--space-2);">' + sc.desc + '</p>' +
      '<div class="sc-row"><span>Property Value</span><span>' + fmtD(scFinalVal) + '</span></div>' +
      '<div class="sc-row"><span>Real Equity</span><span>' + (scRealEquity >= 0 ? '+' : '-') + fmtD(scRealEquity) + '</span></div>' +
      '<div class="sc-row"><span>Monthly Rent</span><span>' + fmtD(scFinalRent) + '</span></div>' +
      '<div class="sc-row"><span>Debt Benefit</span><span>' + fmtD(scDebt) + '</span></div>' +
      '</div>';
  });
  document.getElementById('scenarioCompare').innerHTML = scCompHTML;

  /* ---------- Projection Table ---------- */
  var tHTML = '<thead><tr>' +
    '<th>Year</th><th>Monthly Rent</th><th>Property Value</th>' +
    '<th>CPI Index</th><th>Real Payment</th><th>Debt Savings/yr</th><th>Real Equity</th>' +
    '</tr></thead><tbody>';
  years.forEach(function(r) {
    tHTML += '<tr>' +
      '<td>' + r.year + '</td>' +
      '<td>' + fmtD(r.rent) + '</td>' +
      '<td>' + fmtD(r.propertyValue) + '</td>' +
      '<td>' + r.cpiIndex.toFixed(3) + '</td>' +
      '<td>' + fmtD(r.realPayment) + '</td>' +
      '<td>' + (r.year === 0 ? '&mdash;' : fmtD(r.debtSavings)) + '</td>' +
      '<td>' + (r.realEquity >= 0 ? '+' : '-') + fmtD(r.realEquity) + '</td>' +
      '</tr>';
  });
  tHTML += '</tbody>';
  document.getElementById('projectionTable').innerHTML = tHTML;

  /* ---------- Charts ---------- */
  var labels = years.map(function(r) { return 'Yr ' + r.year; });
  var tealRGB = '1,105,111';
  var goldRGB = '209,153,0';

  /* Rent vs Inflation chart */
  if (rentChartInstance) rentChartInstance.destroy();
  var rentCtx = document.getElementById('rentChart').getContext('2d');
  rentChartInstance = new Chart(rentCtx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Monthly Rent',
          data: years.map(function(r) { return Math.round(r.rent); }),
          borderColor: 'rgb(' + tealRGB + ')',
          backgroundColor: 'rgba(' + tealRGB + ',0.1)',
          fill: true,
          tension: 0.3
        },
        {
          label: 'Rent if Matching CPI',
          data: years.map(function(r) { return Math.round(rent * r.cpiIndex); }),
          borderColor: 'rgb(' + goldRGB + ')',
          borderDash: [5, 5],
          fill: false,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 12 } } },
      scales: {
        y: {
          ticks: { callback: function(v) { return '$' + v.toLocaleString(); } },
          grid: { color: 'rgba(0,0,0,0.06)' }
        },
        x: { grid: { display: false } }
      }
    }
  });

  /* Debt devaluation chart */
  if (debtChartInstance) debtChartInstance.destroy();
  var debtCtx = document.getElementById('debtChart').getContext('2d');
  debtChartInstance = new Chart(debtCtx, {
    type: 'bar',
    data: {
      labels: labels.slice(1),
      datasets: [
        {
          label: 'Nominal Payment',
          data: years.slice(1).map(function() { return Math.round(pmt); }),
          backgroundColor: 'rgba(' + goldRGB + ',0.25)',
          borderColor: 'rgb(' + goldRGB + ')',
          borderWidth: 1
        },
        {
          label: 'Real Payment (Today\'s Dollars)',
          data: years.slice(1).map(function(r) { return Math.round(r.realPayment); }),
          backgroundColor: 'rgba(' + tealRGB + ',0.6)',
          borderColor: 'rgb(' + tealRGB + ')',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 12 } } },
      scales: {
        y: {
          ticks: { callback: function(v) { return '$' + v.toLocaleString(); } },
          grid: { color: 'rgba(0,0,0,0.06)' }
        },
        x: { grid: { display: false } }
      }
    }
  });

  /* Show results */
  document.getElementById('inputSection').style.display = 'none';
  document.getElementById('resultsSection').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/* ---------- Modify Inputs ---------- */
window.modifyInputs = function() {
  document.getElementById('resultsSection').style.display = 'none';
  document.getElementById('inputSection').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/* ---------- Export CSV ---------- */
window.exportCSV = function() {
  var table = document.getElementById('projectionTable');
  var rows = table.querySelectorAll('tr');
  var csv = [];
  rows.forEach(function(row) {
    var cols = row.querySelectorAll('th, td');
    var line = [];
    cols.forEach(function(col) { line.push('"' + col.textContent.replace(/"/g, '""') + '"'); });
    csv.push(line.join(','));
  });
  var blob = new Blob([csv.join('\n')], { type: 'text/csv' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'inflation-hedge-analysis.csv';
  a.click();
};

/* ---------- Export PDF ---------- */
window.exportPDF = function() {
  if (typeof jspdf === 'undefined' && typeof window.jspdf === 'undefined') return;
  var jsPDF = window.jspdf.jsPDF;
  var doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Inflation Hedge Analysis', 14, 20);
  doc.setFontSize(10);
  doc.text('Generated by IntelliTC Solutions', 14, 28);

  var y = 38;
  var table = document.getElementById('projectionTable');
  var rows = table.querySelectorAll('tr');
  rows.forEach(function(row, i) {
    var cols = row.querySelectorAll('th, td');
    var line = [];
    cols.forEach(function(col) { line.push(col.textContent); });
    doc.setFontSize(i === 0 ? 9 : 8);
    doc.text(line.join('  |  '), 14, y);
    y += 6;
    if (y > 280) { doc.addPage(); y = 20; }
  });

  doc.save('inflation-hedge-analysis.pdf');
};

/* ---------- Share ---------- */
window.shareResults = function() {
  if (typeof window.buildShareURL === 'function') {
    window.buildShareURL();
  }
};

/* ---------- Currency formatting on input ---------- */
document.querySelectorAll('#purchasePrice, #monthlyRent').forEach(function(el) {
  el.addEventListener('blur', function() {
    var v = parseFloat(el.value.replace(/[^0-9.]/g, ''));
    if (!isNaN(v)) el.value = v.toLocaleString('en-US', { maximumFractionDigits: 0 });
  });
});
