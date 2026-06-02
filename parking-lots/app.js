/* ============================================================
   Parking Lots — Operate, Optimize, or Land-Bank?
   IntelliTC Solutions — Hidden Gem #11
   ============================================================ */

/* ---- Theme Toggle ---- */
(function(){const toggles=document.querySelectorAll('[data-theme-toggle]'),r=document.documentElement;let d=localStorage.getItem('intellitc-theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');r.setAttribute('data-theme',d);function updateIcon(){const icon=d==='dark'?'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>':'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';toggles.forEach(function(t){t.innerHTML=icon;});}updateIcon();toggles.forEach(function(t){t.addEventListener('click',function(){d=d==='dark'?'light':'dark';r.setAttribute('data-theme',d);localStorage.setItem('intellitc-theme',d);t.setAttribute('aria-label','Switch to '+(d==='dark'?'light':'dark')+' mode');updateIcon();Object.values(window.__charts||{}).forEach(function(c){if(c&&c.update)c.update()});if(typeof onThemeChange==='function')onThemeChange();});});})();

/* ---- Utilities ---- */
function parseNum(s){return parseFloat(String(s).replace(/[^0-9.\-]/g,''))||0;}
function formatCurrency(n){if(Math.abs(n)>=1e6)return(n<0?'-':'')+'$'+(Math.abs(n)/1e6).toFixed(2)+'M';if(Math.abs(n)>=1e3)return(n<0?'-':'')+'$'+(Math.abs(n)/1e3).toFixed(1)+'K';return(n<0?'-$':'$')+Math.abs(Math.round(n)).toLocaleString();}
function formatCurrencyFull(n){return(n<0?'-$':'$')+Math.abs(Math.round(n)).toLocaleString();}
function formatPct(n){return n.toFixed(1)+'%';}
window.__charts={};
function getCS(){const s=getComputedStyle(document.documentElement);return{c1:s.getPropertyValue('--chart-1').trim(),c2:s.getPropertyValue('--chart-2').trim(),c3:s.getPropertyValue('--chart-3').trim(),c4:s.getPropertyValue('--chart-4').trim(),c5:s.getPropertyValue('--chart-5').trim(),c6:s.getPropertyValue('--chart-6').trim(),text:s.getPropertyValue('--color-text-muted').trim(),grid:s.getPropertyValue('--color-divider').trim(),surface:s.getPropertyValue('--color-surface').trim()};}
function destroyCharts(){Object.values(window.__charts).forEach(c=>{if(c&&c.destroy)c.destroy()});window.__charts={};}

/* ---- Currency auto-format ---- */
document.querySelectorAll('input[data-currency]').forEach(inp=>{inp.addEventListener('blur',()=>{const v=parseNum(inp.value);if(v)inp.value=Math.round(v).toLocaleString();});});

/* ---- Panel toggle ---- */
const inputPanel=document.getElementById('inputPanel');
const resultsPanel=document.getElementById('resultsPanel');
function showResults(){inputPanel.classList.add('hidden');resultsPanel.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});}
function showInputs(){resultsPanel.classList.add('hidden');inputPanel.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});}
document.querySelectorAll('[data-back]').forEach(b=>b.addEventListener('click',showInputs));

/* ---- IRR Solver (Newton-Raphson) ---- */
function computeIRR(cashflows, guess) {
  guess = guess || 0.10;
  let rate = guess;
  for (let i = 0; i < 60; i++) {
    let npv = 0, dnpv = 0;
    for (let t = 0; t < cashflows.length; t++) {
      const denom = Math.pow(1 + rate, t);
      npv += cashflows[t] / denom;
      if (t > 0) dnpv -= t * cashflows[t] / (denom * (1 + rate));
    }
    if (Math.abs(dnpv) < 1e-10) break;
    const newRate = rate - npv / dnpv;
    if (Math.abs(newRate - rate) < 1e-7) return newRate;
    rate = newRate;
    if (rate < -0.99) rate = -0.99;
    if (rate > 10) rate = 10;
  }
  return rate;
}

/* ============================================================
   CORE CALCULATION
   Three-scenario IRR analysis over a 7-year hold
   ============================================================ */
function calculate(){
  // Inputs
  const stalls = Math.max(1, parseNum(document.getElementById('stalls').value));
  const lotSize = parseNum(document.getElementById('lotSize').value) || 1;
  const lotType = document.getElementById('lotType').value;
  const landBasis = parseNum(document.getElementById('landBasis').value) || 1;

  const hourlyRate = parseNum(document.getElementById('hourlyRate').value);
  const dailyMax = parseNum(document.getElementById('dailyMax').value);
  const weekdayUtil = parseNum(document.getElementById('weekdayUtil').value) / 100;
  const weekendUtil = parseNum(document.getElementById('weekendUtil').value) / 100;
  const monthlyContracts = parseNum(document.getElementById('monthlyContracts').value);
  const monthlyRate = parseNum(document.getElementById('monthlyRate').value);
  const eventRevenue = parseNum(document.getElementById('eventRevenue').value);

  const opStaff = parseNum(document.getElementById('opStaff').value);
  const opMaint = parseNum(document.getElementById('opMaint').value);
  const opUtil = parseNum(document.getElementById('opUtil').value);
  const opInsurance = parseNum(document.getElementById('opInsurance').value);
  const opTax = parseNum(document.getElementById('opTax').value);
  const opProcessor = parseNum(document.getElementById('opProcessor').value) / 100;

  const capexGate = parseNum(document.getElementById('capexGate').value);
  const capexLighting = parseNum(document.getElementById('capexLighting').value);
  const evCount = parseNum(document.getElementById('evCount').value);
  const evCost = parseNum(document.getElementById('evCost').value);
  const evRevenue = parseNum(document.getElementById('evRevenue').value);

  const redevValue = parseNum(document.getElementById('redevValue').value);
  const redevYears = Math.max(1, parseNum(document.getElementById('redevYears').value));
  const userCap = parseNum(document.getElementById('capRate').value) / 100;
  const landAppr = parseNum(document.getElementById('landAppr').value) / 100;

  // ============ TRANSIENT REVENUE ============
  // Turnover-based model: each occupied stall sees a number of customer turns
  // per day. Each turn earns avg-stay * hourly-rate, capped at daily max.
  // This is the standard industry approach (IPMI revenue surveys).
  const avgStayHours = 3;
  const avgTicket = Math.min(hourlyRate * avgStayHours, dailyMax);
  const weekdayTurnovers = 1.5;
  const weekendTurnovers = 1.2;

  // Stalls available for transient (subtract monthly contract stalls)
  const transientStalls = Math.max(0, stalls - monthlyContracts);

  const weekdaysPerYear = 260, weekendDaysPerYear = 104;

  const weekdayRevPerOccDay = avgTicket * weekdayTurnovers;
  const weekendRevPerOccDay = avgTicket * weekendTurnovers;

  const transientWeekday = transientStalls * weekdayUtil * weekdaysPerYear * weekdayRevPerOccDay;
  const transientWeekend = transientStalls * weekendUtil * weekendDaysPerYear * weekendRevPerOccDay;
  const transientAnnual = transientWeekday + transientWeekend;

  const monthlyAnnual = monthlyContracts * monthlyRate * 12;
  const grossRevenue = transientAnnual + monthlyAnnual + eventRevenue;

  // ============ OPEX (AS-IS) ============
  const processorCost = grossRevenue * opProcessor;
  const totalOpex = opStaff + opMaint + opUtil + opInsurance + opTax + processorCost;
  const NOI = grossRevenue - totalOpex;
  const capRateAsIs = NOI / landBasis;
  const revPerStall = grossRevenue / stalls;
  const revPerSqft = grossRevenue / lotSize;

  // Break-even utilization (constant weekday+weekend level needed to cover fixed opex)
  const fixedOpex = opStaff + opMaint + opUtil + opInsurance + opTax;
  const procRetention = 1 - opProcessor;
  const revPerOnePctUtil = transientStalls * 0.01 * (weekdaysPerYear * weekdayRevPerOccDay + weekendDaysPerYear * weekendRevPerOccDay);
  const nonUtilRevenue = monthlyAnnual + eventRevenue;
  const beUtil = revPerOnePctUtil > 0 ? Math.max(0, (fixedOpex - nonUtilRevenue * procRetention) / (revPerOnePctUtil * procRetention)) : 0;

  // ============ SCENARIO IRRS (7-year hold) ============
  const holdYears = 7;
  const inflRev = 0.025, inflOpex = 0.030;

  // --- Scenario A: Operate As-Is ---
  let cfOperate = [-landBasis];
  for (let y = 1; y <= holdYears; y++) {
    const yrRev = grossRevenue * Math.pow(1 + inflRev, y - 1);
    const yrOpex = totalOpex * Math.pow(1 + inflOpex, y - 1);
    let cf = yrRev - yrOpex;
    if (y === holdYears) {
      // Terminal sale at NOI yr / cap rate (using user cap)
      const terminalNOI = yrRev - yrOpex;
      const saleValue = terminalNOI / Math.max(0.04, userCap);
      cf += saleValue;
    }
    cfOperate.push(cf);
  }
  const irrOperate = computeIRR(cfOperate);

  // --- Scenario B: Optimize (EV + Automation) ---
  // Year 0 capex; staff cost drops 65%, utilities drop 20% (LED), processor stays
  const totalOptimizeCapex = capexGate + capexLighting + (evCount * evCost);
  const optStaff = opStaff * 0.35;  // 65% reduction
  const optUtil = opUtil * 0.80;    // 20% reduction
  let cfOptimize = [-landBasis - totalOptimizeCapex];
  for (let y = 1; y <= holdYears; y++) {
    // EV revenue ramps: year 1 = 60%, year 2 = 85%, year 3+ = 100%
    const evRamp = y === 1 ? 0.60 : y === 2 ? 0.85 : 1.0;
    const yrRev = (grossRevenue + evRevenue * evRamp) * Math.pow(1 + inflRev, y - 1);
    const optOpexBase = optStaff + opMaint + optUtil + opInsurance + opTax;
    const yrOpex = optOpexBase * Math.pow(1 + inflOpex, y - 1) + yrRev * opProcessor;
    let cf = yrRev - yrOpex;
    if (y === holdYears) {
      const terminalNOI = yrRev - yrOpex;
      // Optimized lots sell at slightly tighter cap (50bps)
      const saleValue = terminalNOI / Math.max(0.04, userCap - 0.005);
      cf += saleValue;
    }
    cfOptimize.push(cf);
  }
  const irrOptimize = computeIRR(cfOptimize);

  // --- Scenario C: Land-Bank ---
  // Operate at slightly lower cost (minimal staff, just monthly + event income to cover carry)
  // Lot is held until redevYears, then sold at redevValue (or land appreciates if user redevValue is 0)
  let cfLandbank = [-landBasis];
  for (let y = 1; y <= redevYears; y++) {
    const yrRev = grossRevenue * Math.pow(1 + inflRev, y - 1);
    const yrOpex = totalOpex * Math.pow(1 + inflOpex, y - 1);
    let cf = yrRev - yrOpex;
    if (y === redevYears) {
      // Exit at user-supplied redev value, OR land appreciation if redevValue is missing
      const exitVal = redevValue > 0 ? redevValue : landBasis * Math.pow(1 + landAppr, redevYears);
      cf += exitVal;
    }
    cfLandbank.push(cf);
  }
  const irrLandbank = computeIRR(cfLandbank);

  // ============ DETERMINE VERDICT ============
  const irrs = [
    { name: 'Operate As-Is', value: irrOperate, key: 'operate' },
    { name: 'Optimize (EV + Automation)', value: irrOptimize, key: 'optimize' },
    { name: 'Land-Bank for Redev', value: irrLandbank, key: 'landbank' }
  ];
  irrs.sort((a, b) => b.value - a.value);
  const winner = irrs[0];

  // ============ POPULATE KPIS ============
  document.getElementById('kpiNOI').textContent = formatCurrencyFull(NOI);
  document.getElementById('kpiNOI').className = 'kpi-value ' + (NOI > 0 ? 'kpi-positive' : 'kpi-negative');
  document.getElementById('kpiNOIDetail').textContent = 'Gross ' + formatCurrency(grossRevenue) + ' \u2212 Opex ' + formatCurrency(totalOpex);

  document.getElementById('kpiCap').textContent = formatPct(capRateAsIs * 100);
  const capClass = capRateAsIs >= 0.08 ? 'kpi-positive' : capRateAsIs >= 0.06 ? '' : 'kpi-negative';
  document.getElementById('kpiCap').className = 'kpi-value ' + capClass;
  document.getElementById('kpiCapDetail').textContent = capRateAsIs >= 0.08 ? 'Healthy yield' : capRateAsIs >= 0.06 ? 'Market-rate' : 'Below market';

  document.getElementById('kpiRevStall').textContent = formatCurrencyFull(revPerStall);
  const bench = lotType === 'structured' ? [2500, 7000] : [1000, 3000];
  const benchTxt = revPerStall >= bench[1] ? 'Above benchmark' : revPerStall >= bench[0] ? 'In ' + lotType + ' range' : 'Below benchmark';
  document.getElementById('kpiRevStall').className = 'kpi-value ' + (revPerStall >= bench[0] ? 'kpi-positive' : 'kpi-negative');
  document.getElementById('kpiRevStallDetail').textContent = benchTxt + ' (' + formatCurrency(bench[0]) + '\u2013' + formatCurrency(bench[1]) + ')';

  const beDisplay = Math.min(100, Math.max(0, beUtil));
  document.getElementById('kpiBE').textContent = beUtil <= 0.01 ? 'Covered' : formatPct(beDisplay);
  document.getElementById('kpiBE').className = 'kpi-value ' + (beDisplay < weekdayUtil * 100 ? 'kpi-positive' : 'kpi-negative');
  document.getElementById('kpiBEDetail').textContent = beUtil <= 0.01 ? 'Contracts + events cover fixed costs' : beDisplay < weekdayUtil * 100 ? 'Comfortable margin' : 'Tight \u2014 high risk';

  // ============ POPULATE VERDICT CARD ============
  let headline = '';
  let explainer = '';
  if (winner.key === 'operate') {
    headline = 'Operate as-is wins at ' + formatPct(irrOperate * 100) + ' IRR.';
    explainer = 'The current cash flow story beats both the capex of optimizing and the patience required for land-banking. Run the lot as it sits, reinvest cash flow elsewhere, and revisit when zoning or demand shifts.';
  } else if (winner.key === 'optimize') {
    headline = 'Optimize wins at ' + formatPct(irrOptimize * 100) + ' IRR \u2014 ' + formatCurrency(totalOptimizeCapex) + ' in capex pays back.';
    explainer = 'Automation, LED lighting, and EV chargers lift NOI enough to overcome the upfront cost and beat both alternatives over the hold. The optimized lot also commands a tighter cap rate at exit.';
  } else {
    headline = 'Land-bank wins at ' + formatPct(irrLandbank * 100) + ' IRR over ' + redevYears + ' years.';
    explainer = 'Parking income covers the carry while the parcel appreciates into a redevelopment exit. The real return is the land basis trending into a higher-and-better use, not the operating yield.';
  }
  document.getElementById('verdictHeadline').textContent = headline;
  document.getElementById('verdictExplainer').textContent = explainer;

  // Scenario cards
  document.getElementById('irrOperate').textContent = formatPct(irrOperate * 100);
  document.getElementById('detailOperate').innerHTML = '<strong>' + formatCurrency(NOI) + '/yr NOI</strong> \u00B7 ' + formatPct(capRateAsIs * 100) + ' cap rate today';
  document.getElementById('irrOptimize').textContent = formatPct(irrOptimize * 100);
  document.getElementById('detailOptimize').innerHTML = '<strong>' + formatCurrency(totalOptimizeCapex) + '</strong> capex \u00B7 +' + formatCurrency(evRevenue) + ' EV \u00B7 lower opex';
  document.getElementById('irrLandbank').textContent = formatPct(irrLandbank * 100);
  document.getElementById('detailLandbank').innerHTML = '<strong>' + redevYears + '-yr hold</strong> \u00B7 exit at ' + formatCurrency(redevValue);

  // Mark winner
  document.querySelectorAll('.scenario-card').forEach(c => c.classList.remove('winner'));
  if (winner.key === 'operate') document.getElementById('scenarioOperate').classList.add('winner');
  else if (winner.key === 'optimize') document.getElementById('scenarioOptimize').classList.add('winner');
  else document.getElementById('scenarioLandbank').classList.add('winner');

  // ============ CHARTS ============
  destroyCharts();
  const cs = getCS();

  // Revenue Mix
  window.__charts.revenue = new Chart(document.getElementById('chartRevenue'), {
    type: 'doughnut',
    data: {
      labels: ['Transient (Hourly/Daily)', 'Monthly Contracts', 'Events & Valet'],
      datasets: [{
        data: [transientAnnual, monthlyAnnual, eventRevenue],
        backgroundColor: [cs.c1, cs.c2, cs.c3],
        borderWidth: 2,
        borderColor: cs.surface
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: cs.text, font: { family: 'DM Sans' } } },
        tooltip: {
          backgroundColor: cs.surface, titleColor: cs.text, bodyColor: cs.text, borderColor: cs.grid, borderWidth: 1,
          callbacks: { label: ctx => ctx.label + ': ' + formatCurrencyFull(ctx.parsed) }
        }
      }
    }
  });

  // Scenario IRR Comparison
  window.__charts.irr = new Chart(document.getElementById('chartIRR'), {
    type: 'bar',
    data: {
      labels: ['Operate As-Is', 'Optimize', 'Land-Bank'],
      datasets: [{
        label: 'IRR (%)',
        data: [irrOperate * 100, irrOptimize * 100, irrLandbank * 100],
        backgroundColor: [
          winner.key === 'operate' ? cs.c1 : cs.c4,
          winner.key === 'optimize' ? cs.c1 : cs.c4,
          winner.key === 'landbank' ? cs.c1 : cs.c4
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: cs.surface, titleColor: cs.text, bodyColor: cs.text, borderColor: cs.grid, borderWidth: 1,
          callbacks: { label: ctx => ctx.parsed.y.toFixed(1) + '% IRR' }
        }
      },
      scales: {
        x: { ticks: { color: cs.text }, grid: { display: false } },
        y: { ticks: { color: cs.text, callback: v => v.toFixed(0) + '%' }, grid: { color: cs.grid } }
      }
    }
  });

  showResults();
}
