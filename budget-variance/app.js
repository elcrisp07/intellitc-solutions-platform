/* ============================================================
   Budget vs. Actual Variance Calculator — IntelliTC Solutions
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

/* ---- Calculate ---- */
function calculate(){
  // Read inputs
  const items = [
    {
      name: 'Gross Rental Income',
      type: 'income',
      budget: parseNum(document.getElementById('budgetGrossRent').value),
      actual: parseNum(document.getElementById('actualGrossRent').value)
    },
    {
      name: 'Other Income',
      type: 'income',
      budget: parseNum(document.getElementById('budgetOtherIncome').value),
      actual: parseNum(document.getElementById('actualOtherIncome').value)
    },
    {
      name: 'Vacancy Loss',
      type: 'income_loss',
      budget: parseNum(document.getElementById('budgetVacancy').value),
      actual: parseNum(document.getElementById('actualVacancy').value)
    },
    {
      name: 'Property Taxes',
      type: 'expense',
      budget: parseNum(document.getElementById('budgetTaxes').value),
      actual: parseNum(document.getElementById('actualTaxes').value)
    },
    {
      name: 'Insurance',
      type: 'expense',
      budget: parseNum(document.getElementById('budgetInsurance').value),
      actual: parseNum(document.getElementById('actualInsurance').value)
    },
    {
      name: 'Maintenance & Repairs',
      type: 'expense',
      budget: parseNum(document.getElementById('budgetMaintenance').value),
      actual: parseNum(document.getElementById('actualMaintenance').value)
    },
    {
      name: 'Property Management',
      type: 'expense',
      budget: parseNum(document.getElementById('budgetManagement').value),
      actual: parseNum(document.getElementById('actualManagement').value)
    },
    {
      name: 'Utilities',
      type: 'expense',
      budget: parseNum(document.getElementById('budgetUtilities').value),
      actual: parseNum(document.getElementById('actualUtilities').value)
    },
    {
      name: 'HOA / Common Area',
      type: 'expense',
      budget: parseNum(document.getElementById('budgetHOA').value),
      actual: parseNum(document.getElementById('actualHOA').value)
    },
    {
      name: 'Capital Reserves',
      type: 'expense',
      budget: parseNum(document.getElementById('budgetCapReserves').value),
      actual: parseNum(document.getElementById('actualCapReserves').value)
    }
  ];

  // Calculate variance for each item
  // For income items: positive variance = actual > budget (favorable)
  // For income_loss: positive variance = actual < budget (favorable, less loss)
  // For expense items: positive variance = actual < budget (favorable, spent less)
  items.forEach(item => {
    if (item.type === 'income') {
      item.variance = item.actual - item.budget;
      item.variancePct = item.budget !== 0 ? ((item.actual - item.budget) / item.budget) * 100 : 0;
      // Favorable if actual > budget (collected more)
      item.favorable = item.variance >= 0;
    } else if (item.type === 'income_loss') {
      item.variance = item.budget - item.actual;
      item.variancePct = item.budget !== 0 ? ((item.budget - item.actual) / item.budget) * 100 : 0;
      // Favorable if actual < budget (less vacancy)
      item.favorable = item.variance >= 0;
    } else {
      // expense
      item.variance = item.budget - item.actual;
      item.variancePct = item.budget !== 0 ? ((item.budget - item.actual) / item.budget) * 100 : 0;
      // Favorable if actual < budget (spent less)
      item.favorable = item.variance >= 0;
    }

    // Status
    if (Math.abs(item.variancePct) < 0.5) {
      item.status = 'On Target';
    } else if (item.favorable) {
      item.status = 'Under';
    } else {
      item.status = 'Over';
    }
  });

  // Compute totals
  const incomeItems = items.filter(i => i.type === 'income');
  const lossItems = items.filter(i => i.type === 'income_loss');
  const expenseItems = items.filter(i => i.type === 'expense');

  const budgetGrossIncome = incomeItems.reduce((s, i) => s + i.budget, 0);
  const actualGrossIncome = incomeItems.reduce((s, i) => s + i.actual, 0);
  const budgetVacancyTotal = lossItems.reduce((s, i) => s + i.budget, 0);
  const actualVacancyTotal = lossItems.reduce((s, i) => s + i.actual, 0);

  const budgetNetIncome = budgetGrossIncome - budgetVacancyTotal;
  const actualNetIncome = actualGrossIncome - actualVacancyTotal;
  const incomeVariance = actualNetIncome - budgetNetIncome;
  const incomeVariancePct = budgetNetIncome !== 0 ? (incomeVariance / budgetNetIncome) * 100 : 0;

  const budgetTotalExpenses = expenseItems.reduce((s, i) => s + i.budget, 0);
  const actualTotalExpenses = expenseItems.reduce((s, i) => s + i.actual, 0);
  const expenseVariance = budgetTotalExpenses - actualTotalExpenses;
  const expenseVariancePct = budgetTotalExpenses !== 0 ? (expenseVariance / budgetTotalExpenses) * 100 : 0;

  const budgetNOI = budgetNetIncome - budgetTotalExpenses;
  const actualNOI = actualNetIncome - actualTotalExpenses;
  const netVariance = actualNOI - budgetNOI;

  // Update KPI cards
  const kpiNOI = document.getElementById('kpiNOI');
  kpiNOI.textContent = formatCurrency(actualNOI);
  kpiNOI.className = 'kpi-value ' + (actualNOI >= budgetNOI ? 'kpi-positive' : 'kpi-negative');
  document.getElementById('kpiNOIDetail').textContent = 'Budget: ' + formatCurrency(budgetNOI) + ' | Δ ' + (netVariance >= 0 ? '+' : '') + formatCurrency(netVariance);

  const kpiIncomeVar = document.getElementById('kpiIncomeVar');
  kpiIncomeVar.textContent = (incomeVariance >= 0 ? '+' : '') + formatCurrency(incomeVariance);
  kpiIncomeVar.className = 'kpi-value ' + (incomeVariance >= 0 ? 'kpi-positive' : 'kpi-negative');
  document.getElementById('kpiIncomeVarDetail').textContent = formatPct(incomeVariancePct) + ' vs budget';

  const kpiExpenseVar = document.getElementById('kpiExpenseVar');
  kpiExpenseVar.textContent = (expenseVariance >= 0 ? '+' : '') + formatCurrency(expenseVariance);
  kpiExpenseVar.className = 'kpi-value ' + (expenseVariance >= 0 ? 'kpi-positive' : 'kpi-negative');
  document.getElementById('kpiExpenseVarDetail').textContent = formatPct(expenseVariancePct) + ' vs budget';

  const kpiNetVar = document.getElementById('kpiNetVar');
  kpiNetVar.textContent = (netVariance >= 0 ? '+' : '') + formatCurrency(netVariance);
  kpiNetVar.className = 'kpi-value ' + (netVariance >= 0 ? 'kpi-positive' : 'kpi-negative');
  document.getElementById('kpiNetVarDetail').textContent = netVariance >= 0 ? 'Under Budget' : 'Over Budget';

  // Charts
  destroyCharts();
  const cs = getCS();

  // Chart 1: Grouped bar chart — Budget vs Actual for each line item
  const labels = items.map(i => i.name);
  const budgetData = items.map(i => i.budget);
  const actualData = items.map(i => i.actual);

  window.__charts.grouped = new Chart(document.getElementById('chartGroupedBar'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: 'Budget', data: budgetData, backgroundColor: cs.c1, borderRadius: 3 },
        { label: 'Actual', data: actualData, backgroundColor: cs.c2, borderRadius: 3 }
      ]
    },
    options: {
      ...chartOpts('', 'bar'),
      plugins: {
        ...chartOpts('', 'bar').plugins,
        legend: { display: true, labels: { color: cs.text, font: { family: 'DM Sans' } } },
        tooltip: {
          ...chartOpts('', 'bar').plugins.tooltip,
          callbacks: {
            label: function(ctx) { return ctx.dataset.label + ': ' + formatCurrency(ctx.raw); }
          }
        }
      },
      scales: {
        x: {
          ticks: { color: cs.text, maxRotation: 45, font: { size: 11 } },
          grid: { display: false }
        },
        y: {
          ticks: { color: cs.text, callback: v => '$' + v.toLocaleString() },
          grid: { color: cs.grid }
        }
      }
    }
  });

  // Chart 2: Horizontal bar chart — Variance per category
  const varianceLabels = items.map(i => i.name);
  const varianceData = items.map(i => i.variance);
  const varianceColors = items.map(i => i.favorable ? '#22c55e' : '#ef4444');

  window.__charts.variance = new Chart(document.getElementById('chartVarianceBar'), {
    type: 'bar',
    data: {
      labels: varianceLabels,
      datasets: [{
        label: 'Variance ($)',
        data: varianceData,
        backgroundColor: varianceColors,
        borderRadius: 3
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: cs.surface,
          titleColor: cs.text,
          bodyColor: cs.text,
          borderColor: cs.grid,
          borderWidth: 1,
          callbacks: {
            label: function(ctx) {
              const val = ctx.raw;
              return (val >= 0 ? 'Favorable: +' : 'Unfavorable: ') + formatCurrency(val);
            }
          }
        }
      },
      scales: {
        x: {
          ticks: { color: cs.text, callback: v => (v >= 0 ? '+$' : '-$') + Math.abs(v).toLocaleString() },
          grid: { color: cs.grid }
        },
        y: {
          ticks: { color: cs.text, font: { size: 11 } },
          grid: { display: false }
        }
      }
    }
  });

  // Build results table
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';

  // Income section
  const sectionHeader = (label) => {
    return `<tr><td colspan="6" style="font-weight:700;padding-top:var(--space-4);border-bottom:2px solid var(--color-divider)">${label}</td></tr>`;
  };

  let html = sectionHeader('Income');

  incomeItems.forEach(item => {
    html += buildRow(item);
  });

  lossItems.forEach(item => {
    html += buildRow(item);
  });

  // Net Income row
  html += `<tr style="font-weight:700;background:var(--color-surface-raised)">
    <td>Net Income (EGI)</td>
    <td class="text-right">${formatCurrency(budgetNetIncome)}</td>
    <td class="text-right">${formatCurrency(actualNetIncome)}</td>
    <td class="text-right">${(incomeVariance >= 0 ? '+' : '') + formatCurrency(incomeVariance)}</td>
    <td class="text-right">${(incomeVariancePct >= 0 ? '+' : '') + formatPct(incomeVariancePct)}</td>
    <td class="text-right">${statusBadge(incomeVariance >= 0 ? (Math.abs(incomeVariancePct) < 0.5 ? 'On Target' : 'Under') : 'Over')}</td>
  </tr>`;

  html += sectionHeader('Operating Expenses');

  expenseItems.forEach(item => {
    html += buildRow(item);
  });

  // Total Expenses row
  html += `<tr style="font-weight:700;background:var(--color-surface-raised)">
    <td>Total Expenses</td>
    <td class="text-right">${formatCurrency(budgetTotalExpenses)}</td>
    <td class="text-right">${formatCurrency(actualTotalExpenses)}</td>
    <td class="text-right">${(expenseVariance >= 0 ? '+' : '') + formatCurrency(expenseVariance)}</td>
    <td class="text-right">${(expenseVariancePct >= 0 ? '+' : '') + formatPct(expenseVariancePct)}</td>
    <td class="text-right">${statusBadge(expenseVariance >= 0 ? (Math.abs(expenseVariancePct) < 0.5 ? 'On Target' : 'Under') : 'Over')}</td>
  </tr>`;

  // Divider
  html += '<tr><td colspan="6" style="border-bottom:2px solid var(--color-divider)"></td></tr>';

  // NOI row
  html += `<tr style="font-weight:700;background:var(--color-surface-raised)">
    <td>Net Operating Income (NOI)</td>
    <td class="text-right">${formatCurrency(budgetNOI)}</td>
    <td class="text-right">${formatCurrency(actualNOI)}</td>
    <td class="text-right">${(netVariance >= 0 ? '+' : '') + formatCurrency(netVariance)}</td>
    <td class="text-right">${budgetNOI !== 0 ? ((netVariance >= 0 ? '+' : '') + formatPct((netVariance / budgetNOI) * 100)) : '—'}</td>
    <td class="text-right">${statusBadge(netVariance >= 0 ? (budgetNOI !== 0 && Math.abs((netVariance / budgetNOI) * 100) < 0.5 ? 'On Target' : 'Under') : 'Over')}</td>
  </tr>`;

  tbody.innerHTML = html;
  showResults();
}

function buildRow(item) {
  return `<tr>
    <td>${item.name}</td>
    <td class="text-right">${formatCurrency(item.budget)}</td>
    <td class="text-right">${formatCurrency(item.actual)}</td>
    <td class="text-right">${(item.variance >= 0 ? '+' : '') + formatCurrency(item.variance)}</td>
    <td class="text-right">${(item.variancePct >= 0 ? '+' : '') + formatPct(item.variancePct)}</td>
    <td class="text-right">${statusBadge(item.status)}</td>
  </tr>`;
}

function statusBadge(status) {
  if (status === 'On Target') {
    return '<span style="color:#22c55e;font-weight:600">On Target</span>';
  } else if (status === 'Under') {
    return '<span style="color:#22c55e;font-weight:600">Under ✓</span>';
  } else {
    return '<span style="color:#ef4444;font-weight:600">Over ✗</span>';
  }
}
