/* ============================================================
   Net Effective Rent Calculator — IntelliTC Solutions
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
  // Read inputs
  const leaseTerm = Math.max(1, Math.round(parseNum(document.getElementById('leaseTerm').value)));
  const baseRent = parseNum(document.getElementById('baseRent').value);
  const escalation = parseNum(document.getElementById('escalation').value) / 100;
  const freeMonths = Math.min(leaseTerm, Math.max(0, Math.round(parseNum(document.getElementById('freeMonths').value))));
  const tiAllowance = parseNum(document.getElementById('tiAllowance').value);
  const commissionPct = parseNum(document.getElementById('commission').value) / 100;
  const otherConcessions = parseNum(document.getElementById('otherConcessions').value);

  // Build month-by-month rent schedule with annual escalation
  const months = [];
  let totalFaceRent = 0;
  let totalNetRent = 0;
  let cumulativeRent = 0;
  let cumulativeConcessions = 0;
  let freeRentCost = 0;

  for (let m = 1; m <= leaseTerm; m++) {
    // Determine the year (0-indexed) for escalation
    const year = Math.floor((m - 1) / 12);
    const scheduledRent = baseRent * Math.pow(1 + escalation, year);
    const roundedScheduled = Math.round(scheduledRent * 100) / 100;

    // Free rent applies to the first N months
    const isFreeMonth = m <= freeMonths;
    const freeRentAdj = isFreeMonth ? -roundedScheduled : 0;
    const netRent = isFreeMonth ? 0 : roundedScheduled;

    if (isFreeMonth) {
      freeRentCost += roundedScheduled;
    }

    totalFaceRent += roundedScheduled;
    totalNetRent += netRent;
    cumulativeRent += netRent;

    // Cumulative concessions: free rent so far + prorated share of TI/commission/other
    const freeRentConcSoFar = freeRentCost;
    // TI, commission, and other concessions are front-loaded (paid at lease start)
    // but for cumulative display we show them as distributed evenly
    const otherConcPerMonth = (tiAllowance + otherConcessions) / leaseTerm;
    cumulativeConcessions = freeRentConcSoFar + (tiAllowance + otherConcessions) * (m / leaseTerm);

    months.push({
      month: m,
      scheduledRent: roundedScheduled,
      freeRentAdj: freeRentAdj,
      netRent: netRent,
      cumulativeRent: cumulativeRent,
      cumulativeConcessions: Math.round(cumulativeConcessions * 100) / 100
    });
  }

  // Calculate leasing commission based on total face rent
  const commissionCost = totalFaceRent * commissionPct;

  // Total concession cost
  const totalConcessions = freeRentCost + tiAllowance + commissionCost + otherConcessions;

  // Net effective rent per month = (total face rent - total concessions) / lease term
  const netEffectivePerMonth = (totalFaceRent - totalConcessions) / leaseTerm;

  // Effective discount
  const faceRentPerMonth = totalFaceRent / leaseTerm;
  const effectiveDiscount = faceRentPerMonth > 0 ? ((faceRentPerMonth - netEffectivePerMonth) / faceRentPerMonth) * 100 : 0;

  // Update KPIs
  document.getElementById('kpiFaceRent').textContent = formatCurrency(totalFaceRent);
  document.getElementById('kpiFaceRentDetail').textContent = formatCurrency(faceRentPerMonth) + '/mo avg';

  document.getElementById('kpiNetEffective').textContent = formatCurrency(netEffectivePerMonth);
  document.getElementById('kpiNetEffective').className = 'kpi-value';
  document.getElementById('kpiNetEffectiveDetail').textContent = formatCurrency(netEffectivePerMonth * leaseTerm) + ' total';

  document.getElementById('kpiConcessionCost').textContent = formatCurrency(totalConcessions);
  document.getElementById('kpiConcessionCostDetail').textContent = formatCurrency(totalConcessions / leaseTerm) + '/mo amortized';

  document.getElementById('kpiDiscount').textContent = formatPct(effectiveDiscount);
  document.getElementById('kpiDiscountDetail').textContent = formatCurrency(faceRentPerMonth - netEffectivePerMonth) + '/mo savings';

  // Charts
  destroyCharts();
  const cs = getCS();

  // Chart 1: Rent Schedule — line chart
  const monthLabels = months.map(r => 'Mo ' + r.month);
  const netRentData = months.map(r => Math.round(r.netRent));
  const scheduledRentData = months.map(r => Math.round(r.scheduledRent));

  window.__charts.rentSchedule = new Chart(document.getElementById('chartRentSchedule'), {
    type: 'line',
    data: {
      labels: monthLabels,
      datasets: [
        {
          label: 'Scheduled Rent',
          data: scheduledRentData,
          borderColor: cs.c3,
          backgroundColor: cs.c3 + '20',
          borderWidth: 1.5,
          borderDash: [5, 3],
          pointRadius: 0,
          fill: false,
          tension: 0
        },
        {
          label: 'Net Rent (After Free Rent)',
          data: netRentData,
          borderColor: cs.c1,
          backgroundColor: cs.c1 + '30',
          borderWidth: 2,
          pointRadius: 0,
          fill: true,
          tension: 0
        }
      ]
    },
    options: {
      ...chartOpts('', 'line'),
      plugins: {
        ...chartOpts('', 'line').plugins,
        legend: { display: true, labels: { color: cs.text, font: { family: 'DM Sans' } } },
        tooltip: {
          ...chartOpts('', 'line').plugins.tooltip,
          callbacks: {
            label: function(ctx) {
              return ctx.dataset.label + ': $' + ctx.parsed.y.toLocaleString();
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: cs.text,
            maxTicksLimit: 12,
            maxRotation: 45
          },
          grid: { color: cs.grid }
        },
        y: {
          ticks: {
            color: cs.text,
            callback: function(v) { return '$' + v.toLocaleString(); }
          },
          grid: { color: cs.grid },
          beginAtZero: true
        }
      }
    }
  });

  // Chart 2: Cost Breakdown — doughnut
  const breakdownItems = [
    ['Net Effective Rent', netEffectivePerMonth * leaseTerm],
    ['Free Rent', freeRentCost],
    ['TI Allowance', tiAllowance],
    ['Commission', commissionCost],
    ['Other Concessions', otherConcessions]
  ].filter(e => e[1] > 0);

  window.__charts.costBreakdown = new Chart(document.getElementById('chartCostBreakdown'), {
    type: 'doughnut',
    data: {
      labels: breakdownItems.map(e => e[0]),
      datasets: [{
        data: breakdownItems.map(e => Math.round(e[1])),
        backgroundColor: [cs.c1, cs.c2, cs.c3, cs.c5, cs.c6]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { color: cs.text, font: { family: 'DM Sans' } } },
        tooltip: {
          backgroundColor: cs.surface,
          titleColor: cs.text,
          bodyColor: cs.text,
          borderColor: cs.grid,
          borderWidth: 1,
          callbacks: {
            label: function(ctx) {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : '0.0';
              return ctx.label + ': $' + ctx.parsed.toLocaleString() + ' (' + pct + '%)';
            }
          }
        }
      }
    }
  });

  // Build table
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';

  // Recalculate cumulative concessions properly for table display
  let cumRent = 0;
  let cumFreeRent = 0;
  for (let i = 0; i < months.length; i++) {
    const r = months[i];
    cumRent += r.netRent;
    if (r.month <= freeMonths) {
      cumFreeRent += r.scheduledRent;
    }
    // Total cumulative concessions: free rent so far + proportional share of other costs
    const proportionalOther = (tiAllowance + commissionCost + otherConcessions) * (r.month / leaseTerm);
    const cumConc = cumFreeRent + proportionalOther;

    tbody.innerHTML += '<tr>' +
      '<td>' + r.month + '</td>' +
      '<td class="text-right">' + formatCurrency(r.scheduledRent) + '</td>' +
      '<td class="text-right">' + (r.freeRentAdj < 0 ? '-' + formatCurrency(Math.abs(r.freeRentAdj)) : '—') + '</td>' +
      '<td class="text-right">' + formatCurrency(r.netRent) + '</td>' +
      '<td class="text-right">' + formatCurrency(cumRent) + '</td>' +
      '<td class="text-right">' + formatCurrency(Math.round(cumConc)) + '</td>' +
      '</tr>';
  }

  showResults();
}
