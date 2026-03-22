/* ============================================================
   Sources & Uses Calculator — IntelliTC Solutions
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
  // READ INPUTS — Sources
  const equity = parseNum(document.getElementById('equity').value);
  const seniorLoan = parseNum(document.getElementById('seniorLoan').value);
  const mezzLoan = parseNum(document.getElementById('mezzLoan').value);
  const sellerCredit = parseNum(document.getElementById('sellerCredit').value);
  const otherSource = parseNum(document.getElementById('otherSource').value);

  // READ INPUTS — Uses
  const purchasePrice = parseNum(document.getElementById('purchasePrice').value);
  const closingCosts = parseNum(document.getElementById('closingCosts').value);
  const titleEscrow = parseNum(document.getElementById('titleEscrow').value);
  const inspectionDD = parseNum(document.getElementById('inspectionDD').value);
  const loanOrigFee = parseNum(document.getElementById('loanOrigFee').value);
  const initialRepairs = parseNum(document.getElementById('initialRepairs').value);
  const opReserves = parseNum(document.getElementById('opReserves').value);
  const otherCosts = parseNum(document.getElementById('otherCosts').value);

  // CALCULATIONS
  const totalSources = equity + seniorLoan + mezzLoan + sellerCredit + otherSource;
  const totalUses = purchasePrice + closingCosts + titleEscrow + inspectionDD + loanOrigFee + initialRepairs + opReserves + otherCosts;
  const surplus = totalSources - totalUses;
  const totalDebt = seniorLoan + mezzLoan;
  const ltcRatio = totalUses > 0 ? (totalDebt / totalUses) * 100 : 0;

  // UPDATE KPI CARDS
  document.getElementById('kpiTotalSources').textContent = formatCurrency(totalSources);
  document.getElementById('kpiTotalUses').textContent = formatCurrency(totalUses);

  const surplusEl = document.getElementById('kpiSurplus');
  surplusEl.textContent = formatCurrency(surplus);
  surplusEl.className = 'kpi-value ' + (surplus >= 0 ? 'kpi-positive' : 'kpi-negative');
  document.getElementById('kpiSurplusDetail').textContent = surplus >= 0 ? 'Surplus — deal is funded' : 'Shortfall — need more capital';

  document.getElementById('kpiLTC').textContent = formatPct(ltcRatio);
  document.getElementById('kpiLTCDetail').textContent = ltcRatio <= 75 ? 'Conservative leverage' : ltcRatio <= 85 ? 'Moderate leverage' : 'High leverage';

  // DESTROY AND CREATE CHARTS
  destroyCharts();
  const cs = getCS();

  // --- Chart 1: Sources vs Uses stacked bar ---
  // All items as individual datasets. Each has [sourcesValue, usesValue].
  const allItems = [
    { label: 'Equity / Cash', data: [equity, 0], color: cs.c1 },
    { label: 'Senior Loan', data: [seniorLoan, 0], color: cs.c2 },
    { label: 'Mezz / 2nd Loan', data: [mezzLoan, 0], color: cs.c3 },
    { label: 'Seller Credit', data: [sellerCredit, 0], color: cs.c4 },
    { label: 'Other Source', data: [otherSource, 0], color: cs.c5 },
    { label: 'Purchase Price', data: [0, purchasePrice], color: '#5a7d9a' },
    { label: 'Closing Costs', data: [0, closingCosts], color: '#8b6c5c' },
    { label: 'Title & Escrow', data: [0, titleEscrow], color: '#7a8b6c' },
    { label: 'Inspection / DD', data: [0, inspectionDD], color: '#9b7a8b' },
    { label: 'Loan Orig. Fee', data: [0, loanOrigFee], color: cs.c6 },
    { label: 'Repairs / Reno', data: [0, initialRepairs], color: '#c4956a' },
    { label: 'Op. Reserves', data: [0, opReserves], color: '#6c8b9b' },
    { label: 'Other Costs', data: [0, otherCosts], color: '#a0a0a0' }
  ].filter(d => (d.data[0] + d.data[1]) > 0);

  window.__charts.su = new Chart(document.getElementById('chartSourcesUses'), {
    type: 'bar',
    data: {
      labels: ['Sources', 'Uses'],
      datasets: allItems.map(item => ({
        label: item.label,
        data: item.data,
        backgroundColor: item.color
      }))
    },
    options: {
      ...chartOpts('', 'bar'),
      plugins: {
        ...chartOpts('', 'bar').plugins,
        legend: { display: true, position: 'bottom', labels: { color: cs.text, font: { family: 'DM Sans', size: 11 }, boxWidth: 12, padding: 10, filter: function(item, data) { var ds = data.datasets[item.datasetIndex]; return ds.data[0] > 0 || ds.data[1] > 0; } } },
        tooltip: {
          ...chartOpts('', 'bar').plugins.tooltip,
          callbacks: {
            label: function(ctx) {
              if (ctx.raw === 0) return null;
              return ctx.dataset.label + ': ' + formatCurrency(ctx.raw);
            }
          }
        }
      },
      scales: {
        x: { stacked: true, ticks: { color: cs.text, font: { family: 'DM Sans', weight: 600, size: 13 } }, grid: { display: false } },
        y: { stacked: true, ticks: { color: cs.text, callback: function(v) { return formatCurrency(v); } }, grid: { color: cs.grid } }
      }
    }
  });

  // --- Chart 2: Capital Structure doughnut (equity vs debt) ---
  const capData = [];
  const capLabels = [];
  const capColors = [];
  if (equity > 0) { capLabels.push('Equity / Cash'); capData.push(equity); capColors.push(cs.c1); }
  if (seniorLoan > 0) { capLabels.push('Senior Loan'); capData.push(seniorLoan); capColors.push(cs.c2); }
  if (mezzLoan > 0) { capLabels.push('Mezz / 2nd Loan'); capData.push(mezzLoan); capColors.push(cs.c3); }
  if (sellerCredit > 0) { capLabels.push('Seller Credit'); capData.push(sellerCredit); capColors.push(cs.c4); }
  if (otherSource > 0) { capLabels.push('Other Source'); capData.push(otherSource); capColors.push(cs.c5); }

  window.__charts.cap = new Chart(document.getElementById('chartCapStructure'), {
    type: 'doughnut',
    data: {
      labels: capLabels,
      datasets: [{
        data: capData,
        backgroundColor: capColors
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
              const pct = totalSources > 0 ? ((ctx.raw / totalSources) * 100).toFixed(1) : '0.0';
              return ctx.label + ': ' + formatCurrency(ctx.raw) + ' (' + pct + '%)';
            }
          }
        }
      }
    }
  });

  // BUILD TABLES
  // Sources table
  const sourcesBody = document.getElementById('sourcesBody');
  sourcesBody.innerHTML = '';
  const sourceRows = [
    ['Equity / Cash Investment', equity],
    ['Senior Loan', seniorLoan],
    ['Mezzanine / Second Loan', mezzLoan],
    ['Seller Credit', sellerCredit],
    ['Other Source', otherSource]
  ];
  sourceRows.forEach(function(row) {
    const [label, amount] = row;
    if (amount === 0) return;
    const pct = totalSources > 0 ? ((amount / totalSources) * 100).toFixed(1) : '0.0';
    sourcesBody.innerHTML += '<tr><td>' + label + '</td><td class="text-right">' + formatCurrency(amount) + '</td><td class="text-right">' + pct + '%</td></tr>';
  });
  sourcesBody.innerHTML += '<tr style="font-weight:600;border-top:2px solid var(--color-divider)"><td>Total Sources</td><td class="text-right">' + formatCurrency(totalSources) + '</td><td class="text-right">100.0%</td></tr>';

  // Uses table
  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';
  const useRows = [
    ['Purchase Price', purchasePrice],
    ['Closing Costs', closingCosts],
    ['Title & Escrow', titleEscrow],
    ['Inspection / Due Diligence', inspectionDD],
    ['Loan Origination Fee', loanOrigFee],
    ['Initial Repairs / Renovation', initialRepairs],
    ['Operating Reserves', opReserves],
    ['Other Costs', otherCosts]
  ];
  useRows.forEach(function(row) {
    const [label, amount] = row;
    if (amount === 0) return;
    const pct = totalUses > 0 ? ((amount / totalUses) * 100).toFixed(1) : '0.0';
    tableBody.innerHTML += '<tr><td>' + label + '</td><td class="text-right">' + formatCurrency(amount) + '</td><td class="text-right">' + pct + '%</td></tr>';
  });
  tableBody.innerHTML += '<tr style="font-weight:600;border-top:2px solid var(--color-divider)"><td>Total Uses</td><td class="text-right">' + formatCurrency(totalUses) + '</td><td class="text-right">100.0%</td></tr>';

  // Add surplus/shortfall summary row
  const surplusClass = surplus >= 0 ? 'kpi-positive' : 'kpi-negative';
  tableBody.innerHTML += '<tr style="font-weight:600"><td>' + (surplus >= 0 ? 'Surplus' : 'Shortfall') + '</td><td class="text-right ' + surplusClass + '">' + formatCurrency(surplus) + '</td><td class="text-right"></td></tr>';

  showResults();
}
