/* ============================================================
   Tenant Turnover Cost Calculator — IntelliTC Solutions
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

/* ---- Calculate ---- */
function calculate(){
  // READ INPUTS
  const currentRent   = parseNum(document.getElementById('currentRent').value);
  const vacancyMos    = parseNum(document.getElementById('vacancyDuration').value);
  const makeReady     = parseNum(document.getElementById('makeReadyCost').value);
  const commission    = parseNum(document.getElementById('leasingCommission').value);
  const marketing     = parseNum(document.getElementById('marketingCost').value);
  const admin         = parseNum(document.getElementById('adminCost').value);
  const newRent       = parseNum(document.getElementById('newRent').value);
  const concessionMos = parseNum(document.getElementById('concessionMonths').value);

  // CALCULATIONS
  const vacancyLoss    = currentRent * vacancyMos;
  const concessionCost = newRent * concessionMos;
  const totalCost      = vacancyLoss + makeReady + commission + marketing + concessionCost + admin;
  const annualRent     = currentRent * 12;
  const costPctAnnual  = annualRent > 0 ? (totalCost / annualRent) * 100 : 0;

  // BREAK-EVEN CALCULATION
  // Scenario A (keep current tenant): earns currentRent every month from month 1 — no costs
  // Scenario B (new tenant): incurs hard costs upfront (make-ready, commission, marketing, admin),
  //   earns $0 during vacancy, earns $0 during concession months, then earns newRent/month.
  //   Vacancy loss and concession loss are captured by $0 income months — NOT double-counted.
  const hardCosts = makeReady + commission + marketing + admin;

  const maxMonths = 120;
  let breakEvenMonth = null;
  const cumCurrentArr = [];
  const cumNewArr = [];

  let cumCurrent = 0;
  let cumNew = -hardCosts; // only hard costs upfront; vacancy & concessions captured by $0 months

  for (let m = 1; m <= maxMonths; m++) {
    cumCurrent += currentRent;

    // New tenant income for this month
    if (m <= vacancyMos) {
      // Vacancy period — no income
      cumNew += 0;
    } else if (m <= vacancyMos + concessionMos) {
      // Concession period — free rent, no income
      cumNew += 0;
    } else {
      // Normal rent collection
      cumNew += newRent;
    }

    cumCurrentArr.push(cumCurrent);
    cumNewArr.push(cumNew);

    if (breakEvenMonth === null && cumNew >= cumCurrent) {
      breakEvenMonth = m;
    }
  }

  // Determine chart range — show up to break-even + 6 months, or 24 months minimum
  let chartMonths = Math.max(24, breakEvenMonth ? breakEvenMonth + 6 : 36);
  chartMonths = Math.min(chartMonths, maxMonths);

  const chartLabels = [];
  const chartCurrent = [];
  const chartNew = [];
  for (let i = 0; i < chartMonths; i++) {
    chartLabels.push('Mo ' + (i + 1));
    chartCurrent.push(cumCurrentArr[i]);
    chartNew.push(cumNewArr[i]);
  }

  // UPDATE KPI CARDS
  document.getElementById('kpiTotalCost').textContent = formatCurrency(totalCost);
  document.getElementById('kpiTotalCost').className = 'kpi-value kpi-negative';
  document.getElementById('kpiTotalCostDetail').textContent = 'All-in turnover expense';

  document.getElementById('kpiLostRent').textContent = formatCurrency(vacancyLoss);
  document.getElementById('kpiLostRent').className = 'kpi-value kpi-negative';
  document.getElementById('kpiLostRentDetail').textContent = vacancyMos + ' month' + (vacancyMos !== 1 ? 's' : '') + ' × ' + formatCurrency(currentRent);

  if (breakEvenMonth !== null) {
    document.getElementById('kpiBreakEven').textContent = breakEvenMonth + ' mo';
    document.getElementById('kpiBreakEven').className = 'kpi-value';
    document.getElementById('kpiBreakEvenDetail').textContent = 'vs. keeping current tenant';
  } else {
    document.getElementById('kpiBreakEven').textContent = '120+ mo';
    document.getElementById('kpiBreakEven').className = 'kpi-value kpi-negative';
    document.getElementById('kpiBreakEvenDetail').textContent = 'New rent may be too low';
  }

  document.getElementById('kpiCostPct').textContent = formatPct(costPctAnnual);
  document.getElementById('kpiCostPct').className = 'kpi-value' + (costPctAnnual > 30 ? ' kpi-negative' : '');
  document.getElementById('kpiCostPctDetail').textContent = 'of ' + formatCurrency(annualRent) + ' annual rent';

  // DESTROY AND CREATE CHARTS
  destroyCharts();
  const cs = getCS();

  // Chart 1: Cost Breakdown Doughnut
  const costItems = [
    ['Vacancy Loss', vacancyLoss],
    ['Make-Ready', makeReady],
    ['Commission', commission],
    ['Marketing', marketing],
    ['Concessions', concessionCost],
    ['Admin / Legal', admin]
  ].filter(e => e[1] > 0);

  const doughnutColors = [cs.c1, cs.c2, cs.c3, cs.c4, cs.c5, cs.c6];

  window.__charts.costBreakdown = new Chart(document.getElementById('chartCostBreakdown'), {
    type: 'doughnut',
    data: {
      labels: costItems.map(e => e[0]),
      datasets: [{
        data: costItems.map(e => e[1]),
        backgroundColor: doughnutColors.slice(0, costItems.length)
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { color: cs.text, font: { family: 'DM Sans' } }
        },
        tooltip: {
          backgroundColor: cs.surface,
          titleColor: cs.text,
          bodyColor: cs.text,
          borderColor: cs.grid,
          borderWidth: 1,
          callbacks: {
            label: function(ctx) {
              const val = ctx.parsed;
              const pct = totalCost > 0 ? ((val / totalCost) * 100).toFixed(1) : '0.0';
              return ctx.label + ': ' + formatCurrency(val) + ' (' + pct + '%)';
            }
          }
        }
      }
    }
  });

  // Chart 2: Break-Even Timeline (line chart, two lines)
  window.__charts.breakEven = new Chart(document.getElementById('chartBreakEven'), {
    type: 'line',
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: 'Keep Current Tenant',
          data: chartCurrent,
          borderColor: cs.c1,
          backgroundColor: cs.c1 + '22',
          fill: false,
          tension: 0.1,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: 2
        },
        {
          label: 'New Tenant (net of costs)',
          data: chartNew,
          borderColor: cs.c2,
          backgroundColor: cs.c2 + '22',
          fill: false,
          tension: 0.1,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: 2
        }
      ]
    },
    options: {
      ...chartOpts('', 'line'),
      plugins: {
        ...chartOpts('', 'line').plugins,
        legend: {
          display: true,
          labels: { color: cs.text, font: { family: 'DM Sans' } }
        },
        tooltip: {
          backgroundColor: cs.surface,
          titleColor: cs.text,
          bodyColor: cs.text,
          borderColor: cs.grid,
          borderWidth: 1,
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(ctx) {
              return ctx.dataset.label + ': ' + formatCurrency(ctx.parsed.y);
            }
          }
        }
      },
      scales: {
        x: {
          ticks: { color: cs.text, maxTicksLimit: 12 },
          grid: { color: cs.grid }
        },
        y: {
          ticks: {
            color: cs.text,
            callback: function(v) { return formatCurrency(v); }
          },
          grid: { color: cs.grid }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      }
    }
  });

  // BUILD TABLE
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';

  const tableRows = [
    ['Vacancy Loss', vacancyLoss],
    ['Make-Ready / Renovation', makeReady],
    ['Leasing Commission', commission],
    ['Marketing / Advertising', marketing],
    ['Rent Concessions', concessionCost],
    ['Admin / Legal / Screening', admin]
  ];

  tableRows.forEach(function(row) {
    const [label, amount] = row;
    const pct = totalCost > 0 ? ((amount / totalCost) * 100).toFixed(1) : '0.0';
    tbody.innerHTML += '<tr><td>' + label + '</td><td class="text-right">' + formatCurrency(amount) + '</td><td class="text-right">' + pct + '%</td></tr>';
  });

  // Total row
  tbody.innerHTML += '<tr style="font-weight:600;border-top:2px solid var(--color-divider)"><td>Total Turnover Cost</td><td class="text-right highlight">' + formatCurrency(totalCost) + '</td><td class="text-right highlight">100%</td></tr>';

  showResults();
}
