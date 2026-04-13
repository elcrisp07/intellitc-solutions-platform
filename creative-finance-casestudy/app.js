/* ============================================================
   Foundation of Creative Finance — IntelliTC Solutions
   Five Pillars of Returns Calculator
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
function showResults(){inputPanel.classList.add('hidden');resultsPanel.classList.remove('hidden');resultsPanel.scrollIntoView({behavior:'smooth',block:'start'});}
function showInputs(){resultsPanel.classList.add('hidden');inputPanel.classList.remove('hidden');inputPanel.scrollIntoView({behavior:'smooth',block:'start'});}
document.querySelectorAll('[data-back]').forEach(b=>b.addEventListener('click',showInputs));

/* ---- Five Pillars Calculator ---- */
function calculate(){
  // Parse inputs
  const dealName = document.getElementById('propertyName').value.trim();
  const price    = parseNum(document.getElementById('purchasePrice').value);
  const dp       = parseNum(document.getElementById('downPayment').value);
  const reno     = parseNum(document.getElementById('renobudget').value);
  const loan     = parseNum(document.getElementById('loanAmt').value);
  const rate     = parseNum(document.getElementById('intRate').value) / 100;
  const term     = parseNum(document.getElementById('loanTerm').value);
  const rentE    = parseNum(document.getElementById('rentEarly').value);
  const rentL    = parseNum(document.getElementById('rentLater').value);
  const opex     = parseNum(document.getElementById('opexPct').value) / 100;
  const arvVal   = parseNum(document.getElementById('arv').value);
  const hold     = Math.max(1, Math.round(parseNum(document.getElementById('holdYears').value)));
  const taxPct   = parseNum(document.getElementById('taxRate').value) / 100;

  const totalCash = dp + reno;

  // Monthly mortgage payment (P&I)
  const mr = rate / 12;
  const n  = term * 12;
  const pmt = mr > 0 ? loan * (mr * Math.pow(1+mr, n)) / (Math.pow(1+mr, n) - 1) : loan / n;

  // ── Pillar 1: Cash on Cash Return ──
  let totalCF = 0;
  const cfByYear = [];
  const rentByYear = [];
  const expByYear = [];
  const mtgByYear = [];
  // Determine early/later split: first 2 years = early, rest = later (if hold > 2)
  const earlyYears = Math.min(2, hold);
  const laterYears = hold - earlyYears;

  for (let y = 1; y <= hold; y++) {
    const monthlyRent = y <= 2 ? rentE : rentL;
    const grossAnnual = monthlyRent * 12;
    const expAnnual   = grossAnnual * opex;
    const mtgAnnual   = pmt * 12;
    const netCF       = grossAnnual - expAnnual - mtgAnnual;
    totalCF += netCF;
    cfByYear.push(Math.round(netCF));
    rentByYear.push(Math.round(grossAnnual));
    expByYear.push(Math.round(expAnnual));
    mtgByYear.push(Math.round(mtgAnnual));
  }
  const avgAnnualCF = totalCF / hold;
  const cocReturn = totalCash > 0 ? (avgAnnualCF / totalCash) * 100 : 0;

  // ── Pillar 2: Appreciation ──
  const appreciation = arvVal - price;

  // ── Pillar 3: Tax Benefits (Depreciation) ──
  const annualDeprec = price / 27.5;
  const totalDeprec  = annualDeprec * hold;
  const taxSavings   = totalDeprec * taxPct;

  // ── Pillar 4: Principal Pay Down ──
  let bal = loan;
  let totalPrinPaid = 0;
  for (let m = 0; m < hold * 12; m++) {
    const ip = bal * mr;
    const pp = pmt - ip;
    totalPrinPaid += pp;
    bal -= pp;
  }

  // ── Pillar 5: Leverage ──
  const leverageRatio = dp > 0 ? (price / dp) : 0;

  // ── Total Wealth ──
  const totalWealth = totalCF + appreciation + taxSavings + totalPrinPaid;
  const avgAnnualWealth = totalWealth / hold;

  // ── Populate KPIs ──
  document.getElementById('kpiTotal').textContent = formatCurrency(totalWealth);
  document.getElementById('kpiTotalDetail').textContent = hold + '-year combined return';
  document.getElementById('kpiAnnual').textContent = formatCurrency(avgAnnualWealth);
  document.getElementById('kpiAnnualDetail').textContent = 'Avg per year across all 5 pillars';
  document.getElementById('kpiCoC').textContent = formatPct(cocReturn);
  document.getElementById('kpiCoCDetail').textContent = formatCurrency(avgAnnualCF) + '/yr on ' + formatCurrency(totalCash);
  document.getElementById('kpiLeverage').textContent = leverageRatio.toFixed(1) + 'x';
  document.getElementById('kpiLeverageDetail').textContent = formatCurrency(price) + ' asset / ' + formatCurrency(dp) + ' down';

  // Deal name banner
  const banner = document.getElementById('dealNameBanner');
  banner.textContent = dealName ? '📋 ' + dealName : '';

  // ── Pillar breakdown table ──
  const pillars = [
    { name: 'Net Cash Flow',    val: totalCF },
    { name: 'Appreciation',     val: appreciation },
    { name: 'Tax Savings',      val: taxSavings },
    { name: 'Principal Pay Down', val: totalPrinPaid }
  ];
  const tbody = document.getElementById('pillarBody');
  tbody.innerHTML = '';
  pillars.forEach(p => {
    const pct = totalWealth !== 0 ? (p.val / totalWealth * 100) : 0;
    tbody.innerHTML += `<tr><td>${p.name}</td><td class="text-right">${formatCurrency(p.val)}</td><td class="text-right">${formatPct(pct)}</td></tr>`;
  });
  tbody.innerHTML += `<tr style="font-weight:700;background:var(--color-primary-surface)"><td><strong>Total</strong></td><td class="text-right"><strong>${formatCurrency(totalWealth)}</strong></td><td class="text-right"><strong>100%</strong></td></tr>`;

  // ── Cash flow table ──
  const cfTbody = document.getElementById('cfBody');
  cfTbody.innerHTML = '';
  let runningCF = 0;
  for (let y = 0; y < hold; y++) {
    runningCF += cfByYear[y];
    cfTbody.innerHTML += `<tr><td>${y+1}</td><td class="text-right">${formatCurrency(rentByYear[y])}</td><td class="text-right">${formatCurrency(expByYear[y])}</td><td class="text-right">${formatCurrency(mtgByYear[y])}</td><td class="text-right">${formatCurrency(cfByYear[y])}</td></tr>`;
  }
  cfTbody.innerHTML += `<tr style="font-weight:700;background:var(--color-primary-surface)"><td>Total</td><td class="text-right">${formatCurrency(rentByYear.reduce((a,b)=>a+b,0))}</td><td class="text-right">${formatCurrency(expByYear.reduce((a,b)=>a+b,0))}</td><td class="text-right">${formatCurrency(mtgByYear.reduce((a,b)=>a+b,0))}</td><td class="text-right">${formatCurrency(Math.round(totalCF))}</td></tr>`;

  // ── Charts ──
  destroyCharts();
  const cs = getCS();

  // Doughnut: Five Pillars
  window.__charts.pillars = new Chart(document.getElementById('chartPillars'), {
    type: 'doughnut',
    data: {
      labels: pillars.map(p => p.name),
      datasets: [{
        data: pillars.map(p => Math.max(0, Math.round(p.val))),
        backgroundColor: [cs.c1, cs.c2, cs.c3, cs.c4],
        borderWidth: 2,
        borderColor: cs.surface
      }]
    },
    options: {
      ...chartOpts('', 'doughnut'),
      cutout: '55%',
      plugins: {
        ...chartOpts('', 'doughnut').plugins,
        tooltip: {
          ...chartOpts('', 'doughnut').plugins.tooltip,
          callbacks: {
            label: function(ctx) {
              return ctx.label + ': ' + formatCurrency(ctx.raw);
            }
          }
        }
      }
    }
  });

  // Line: Cumulative wealth over time
  const cumLabels = [];
  const cumCF = [];
  const cumTotal = [];
  let runCF = 0;
  // Approximate annual principal pay down + appreciation spread evenly
  const annualAppreciation = appreciation / hold;
  const annualTax = taxSavings / hold;
  const annualPrin = totalPrinPaid / hold;
  let runTotal = 0;

  for (let y = 1; y <= hold; y++) {
    cumLabels.push('Year ' + y);
    runCF += cfByYear[y-1];
    cumCF.push(Math.round(runCF));
    runTotal += cfByYear[y-1] + annualAppreciation + annualTax + annualPrin;
    cumTotal.push(Math.round(runTotal));
  }

  window.__charts.cumulative = new Chart(document.getElementById('chartCumulative'), {
    type: 'line',
    data: {
      labels: cumLabels,
      datasets: [
        {
          label: 'Cash Flow Only',
          data: cumCF,
          borderColor: cs.c2,
          backgroundColor: cs.c2 + '22',
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'All Five Pillars',
          data: cumTotal,
          borderColor: cs.c1,
          backgroundColor: cs.c1 + '22',
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      ...chartOpts('', 'line'),
      plugins: {
        ...chartOpts('', 'line').plugins,
        tooltip: {
          ...chartOpts('', 'line').plugins.tooltip,
          callbacks: {
            label: function(ctx) {
              return ctx.dataset.label + ': ' + formatCurrency(ctx.raw);
            }
          }
        }
      },
      scales: {
        x: { ticks: { color: cs.text }, grid: { color: cs.grid } },
        y: { ticks: { color: cs.text, callback: v => formatCurrency(v) }, grid: { color: cs.grid } }
      }
    }
  });

  showResults();
}
