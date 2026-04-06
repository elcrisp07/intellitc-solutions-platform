/* ============================================================
   Rent vs. Buy Calculator — IntelliTC Solutions
   ============================================================ */

/* ---- Theme Toggle ---- */
(function(){const toggles=document.querySelectorAll('[data-theme-toggle]'),r=document.documentElement;let d=localStorage.getItem('intellitc-theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');r.setAttribute('data-theme',d);function updateIcon(){const icon=d==='dark'?'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>':'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';toggles.forEach(function(t){t.innerHTML=icon;});}updateIcon();toggles.forEach(function(t){t.addEventListener('click',function(){d=d==='dark'?'light':'dark';r.setAttribute('data-theme',d);localStorage.setItem('intellitc-theme',d);t.setAttribute('aria-label','Switch to '+(d==='dark'?'light':'dark')+' mode');updateIcon();Object.values(window.__charts||{}).forEach(function(c){if(c&&c.update)c.update()});if(typeof onThemeChange==='function')onThemeChange();});});})();

/* ---- Utilities ---- */
function parseNum(s){return parseFloat(String(s).replace(/[^0-9.\-]/g,''))||0;}
function formatCurrency(n){if(Math.abs(n)>=1e6)return(n<0?'-':'')+'$'+(Math.abs(n)/1e6).toFixed(1)+'M';return(n<0?'-$':'$')+Math.abs(Math.round(n)).toLocaleString();}
function formatPct(n){return n.toFixed(1)+'%';}
function formatNum(n){return Math.round(n).toLocaleString();}
window.__charts={};
function getCS(){const s=getComputedStyle(document.documentElement);return{c1:s.getPropertyValue('--chart-1').trim(),c2:s.getPropertyValue('--chart-2').trim(),c3:s.getPropertyValue('--chart-3').trim(),c4:s.getPropertyValue('--chart-4').trim(),c5:s.getPropertyValue('--chart-5').trim(),c6:s.getPropertyValue('--chart-6').trim(),text:s.getPropertyValue('--color-text-muted').trim(),grid:s.getPropertyValue('--color-divider').trim(),surface:s.getPropertyValue('--color-surface').trim(),primary:s.getPropertyValue('--color-primary').trim()};}
function destroyCharts(){Object.values(window.__charts).forEach(c=>{if(c&&c.destroy)c.destroy()});window.__charts={};}
function chartOpts(title,type){const cs=getCS();return{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true,labels:{color:cs.text,font:{family:'DM Sans'}}},title:{display:!!title,text:title,color:cs.text,font:{family:'DM Sans',size:14,weight:600}},tooltip:{backgroundColor:cs.surface,titleColor:cs.text,bodyColor:cs.text,borderColor:cs.grid,borderWidth:1,callbacks:{label:function(ctx){return ctx.dataset.label+': '+formatCurrency(ctx.raw);}}}},scales:type==='pie'||type==='doughnut'||type==='radar'?undefined:{x:{ticks:{color:cs.text},grid:{color:cs.grid}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}};}

/* ---- Currency auto-format ---- */
document.querySelectorAll('input[data-currency]').forEach(inp=>{inp.addEventListener('blur',()=>{const v=parseNum(inp.value);if(v)inp.value=Math.round(v).toLocaleString();});});

/* ---- Panel toggle ---- */
const inputPanel=document.getElementById('inputPanel');
const resultsPanel=document.getElementById('resultsPanel');
function showResults(){inputPanel.classList.add('hidden');resultsPanel.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});}
function showInputs(){resultsPanel.classList.add('hidden');inputPanel.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});}
document.querySelectorAll('[data-back]').forEach(b=>b.addEventListener('click',showInputs));

/* ============================================================
   CORE CALCULATION ENGINE
   Year-by-year differential analysis modeling:
   - Renter: rent + renter's insurance, investing the "saved" money
   - Buyer: mortgage P&I, property tax, insurance, maintenance,
            HOA, PMI, closing costs, tax deduction benefit
   - Net wealth comparison at each year
   ============================================================ */
function calculate(){
  /* ---- Read inputs ---- */
  const monthlyRent    = parseNum(document.getElementById('monthlyRent').value);
  const rentIncrease   = parseNum(document.getElementById('rentIncrease').value)/100;
  const rentersIns     = parseNum(document.getElementById('rentersIns').value);
  const homePrice      = parseNum(document.getElementById('homePrice').value);
  const downPct        = parseNum(document.getElementById('downPct').value)/100;
  const mortRate       = parseNum(document.getElementById('mortRate').value)/100;
  const loanTerm       = parseNum(document.getElementById('loanTerm').value);
  const closingPct     = parseNum(document.getElementById('closingPct').value)/100;
  const propTaxRate    = parseNum(document.getElementById('propTaxRate').value)/100;
  const homeInsYr      = parseNum(document.getElementById('homeInsYr').value);
  const maintPct       = parseNum(document.getElementById('maintPct').value)/100;
  const hoaMonth       = parseNum(document.getElementById('hoaMonth').value);
  const homeAppreciation = parseNum(document.getElementById('homeAppreciation').value)/100;
  const investReturn   = parseNum(document.getElementById('investReturn').value)/100;
  const sellingCostsPct = parseNum(document.getElementById('sellingCosts').value)/100;
  const taxBracket     = parseNum(document.getElementById('taxBracket').value)/100;
  const timeHorizon    = Math.max(1,Math.min(30,Math.round(parseNum(document.getElementById('timeHorizon').value))));

  /* ---- Derived values ---- */
  const downPayment    = homePrice * downPct;
  const closingCosts   = homePrice * closingPct;
  const loanAmount     = homePrice - downPayment;
  const totalUpfront   = downPayment + closingCosts; /* cash locked up by buyer */
  const mr             = mortRate / 12;
  const n              = loanTerm * 12;
  const monthlyPI      = mr > 0 ? loanAmount * (mr * Math.pow(1+mr, n)) / (Math.pow(1+mr, n) - 1) : loanAmount / n;

  /* Standard deduction (2024): $14,600 single. Mortgage interest deduction only helps if itemized deductions exceed this. */
  const standardDeduction = 14600;

  /* ---- Year-by-year simulation ---- */
  const years = [];
  let loanBalance      = loanAmount;
  let homeValue        = homePrice;
  let renterPortfolio  = totalUpfront; /* renter invests the money buyer spends upfront */
  let cumRentCost      = 0;
  let cumBuyCost       = closingCosts; /* buyer already spent closing costs */
  let breakEvenYear    = null;
  let currentRent      = monthlyRent;
  let costInflation    = 0.03; /* annual increase for taxes, insurance, maintenance */

  for(let yr = 1; yr <= timeHorizon; yr++){
    /* ---- RENTER SIDE ---- */
    const annualRent = currentRent * 12;
    const annualRentersIns = rentersIns * 12;
    const totalRentCost = annualRent + annualRentersIns;
    cumRentCost += totalRentCost;

    /* ---- BUYER SIDE ---- */
    /* Mortgage payment (P&I is fixed) */
    const annualPI = monthlyPI * 12;

    /* Track principal vs interest for this year */
    let yearInterest = 0;
    let yearPrincipal = 0;
    for(let m = 0; m < 12; m++){
      const interestPmt = loanBalance * mr;
      const principalPmt = monthlyPI - interestPmt;
      yearInterest += interestPmt;
      yearPrincipal += Math.min(principalPmt, loanBalance);
      loanBalance = Math.max(0, loanBalance - principalPmt);
    }

    /* Property tax, insurance, maintenance — escalate annually */
    const escalator = Math.pow(1 + costInflation, yr - 1);
    const annualPropTax = homeValue * propTaxRate; /* based on current home value */
    const annualHomeIns = homeInsYr * escalator;
    const annualMaint   = homeValue * maintPct;
    const annualHOA     = hoaMonth * 12 * escalator;

    /* PMI: removed once equity reaches 20% */
    const currentLTV = loanBalance / homeValue;
    const annualPMI = (downPct < 0.20 && currentLTV > 0.80) ? loanAmount * 0.005 : 0;

    /* Tax benefit: mortgage interest deduction (only if exceeds standard deduction) */
    const itemizedDeductions = yearInterest + annualPropTax; /* simplified */
    const taxBenefit = itemizedDeductions > standardDeduction
      ? (itemizedDeductions - standardDeduction) * taxBracket
      : 0;

    const totalBuyCost = annualPI + annualPropTax + annualHomeIns + annualMaint + annualHOA + annualPMI - taxBenefit;
    cumBuyCost += totalBuyCost;

    /* Home appreciation */
    homeValue *= (1 + homeAppreciation);

    /* ---- RENTER INVESTMENT ---- */
    /* Renter grows their portfolio and invests any monthly savings */
    renterPortfolio *= (1 + investReturn); /* existing portfolio grows */
    /* If renting is cheaper, invest the difference */
    const monthlyBuyCost = totalBuyCost / 12;
    const monthlyRentCost = totalRentCost / 12;
    if(monthlyRentCost < monthlyBuyCost){
      /* Renter invests the monthly difference — approximate as lump sum at year end */
      renterPortfolio += (monthlyBuyCost - monthlyRentCost) * 12;
    }

    /* ---- NET WEALTH ---- */
    /* Buyer: home equity minus selling costs */
    const homeEquity = homeValue - loanBalance;
    const netSaleProceeds = homeValue * (1 - sellingCostsPct) - loanBalance;
    const buyerNetWealth = Math.max(0, netSaleProceeds);

    /* Renter: portfolio value */
    const renterNetWealth = renterPortfolio;

    /* Advantage (positive = buying wins) */
    const advantage = buyerNetWealth - renterNetWealth;

    /* Break-even detection */
    if(breakEvenYear === null && advantage >= 0 && yr > 1){
      breakEvenYear = yr;
    }
    /* If advantage flips back negative after break-even, update */
    if(breakEvenYear !== null && advantage < 0){
      breakEvenYear = null;
    }

    years.push({
      year: yr,
      rentCostCum: cumRentCost,
      buyCostCum: cumBuyCost,
      homeEquity: homeEquity,
      renterPortfolio: renterPortfolio,
      buyerNetWealth: buyerNetWealth,
      renterNetWealth: renterNetWealth,
      advantage: advantage,
      monthlyRent: currentRent,
      monthlyBuy: totalBuyCost / 12,
      homeValue: homeValue,
      loanBalance: loanBalance,
      yearInterest: yearInterest,
      yearPrincipal: yearPrincipal,
      taxBenefit: taxBenefit
    });

    /* Escalate rent for next year */
    currentRent *= (1 + rentIncrease);
  }

  const finalYear = years[years.length - 1];
  const year1 = years[0];

  /* ---- VERDICT ---- */
  const verdictBanner = document.getElementById('verdictBanner');
  const verdictText = document.getElementById('verdictText');
  const verdictSub = document.getElementById('verdictSub');

  if(finalYear.advantage > 0){
    verdictText.textContent = 'Buying wins by ' + formatCurrency(finalYear.advantage) + ' over ' + timeHorizon + ' years';
    verdictSub.textContent = breakEvenYear
      ? 'You break even in year ' + breakEvenYear + '. After that, every year tips further in favor of buying.'
      : 'Buying is favorable from the start given your inputs.';
    verdictBanner.style.borderColor = 'var(--color-primary)';
    verdictBanner.style.background = 'var(--color-primary-surface, var(--color-surface))';
  } else {
    verdictText.textContent = 'Renting wins by ' + formatCurrency(Math.abs(finalYear.advantage)) + ' over ' + timeHorizon + ' years';
    verdictSub.textContent = breakEvenYear
      ? 'Buying would break even in year ' + breakEvenYear + ', but over your ' + timeHorizon + '-year horizon, renting + investing comes out ahead.'
      : 'Buying never catches up to renting + investing within your ' + timeHorizon + '-year horizon.';
    verdictBanner.style.borderColor = 'var(--color-divider)';
    verdictBanner.style.background = 'var(--color-surface)';
  }

  /* ---- KPIs ---- */
  document.getElementById('kpiBreakeven').textContent = breakEvenYear ? 'Year ' + breakEvenYear : 'Never';
  document.getElementById('kpiBreakeven').className = 'kpi-value ' + (breakEvenYear && breakEvenYear <= timeHorizon ? '' : 'kpi-negative');
  document.getElementById('kpiBreakevenDetail').textContent = breakEvenYear
    ? 'Buying overtakes renting in year ' + breakEvenYear
    : 'Buying doesn\'t break even within ' + timeHorizon + ' years';

  document.getElementById('kpiBuyWealth').textContent = formatCurrency(finalYear.buyerNetWealth);
  document.getElementById('kpiBuyWealthDetail').textContent = 'Home equity after selling costs';

  document.getElementById('kpiRentWealth').textContent = formatCurrency(finalYear.renterNetWealth);
  document.getElementById('kpiRentWealthDetail').textContent = 'Portfolio from investing the difference';

  const advEl = document.getElementById('kpiAdvantage');
  advEl.textContent = (finalYear.advantage >= 0 ? '+' : '') + formatCurrency(finalYear.advantage);
  advEl.className = 'kpi-value ' + (finalYear.advantage >= 0 ? 'kpi-positive' : 'kpi-negative');
  document.getElementById('kpiAdvantageDetail').textContent = finalYear.advantage >= 0 ? 'Buying is the better financial choice' : 'Renting + investing is the better financial choice';

  /* ---- CHARTS ---- */
  destroyCharts();
  const cs = getCS();
  const yearLabels = years.map(y => 'Year ' + y.year);

  /* Chart 1: Cumulative cost comparison (full width) */
  window.__charts.cumCost = new Chart(document.getElementById('chartCumCost'), {
    type: 'line',
    data: {
      labels: yearLabels,
      datasets: [
        {
          label: 'Cumulative Rent Cost',
          data: years.map(y => Math.round(y.rentCostCum)),
          borderColor: cs.c2,
          backgroundColor: cs.c2 + '18',
          fill: true,
          tension: 0.3,
          pointRadius: 3
        },
        {
          label: 'Cumulative Buy Cost',
          data: years.map(y => Math.round(y.buyCostCum)),
          borderColor: cs.c1,
          backgroundColor: cs.c1 + '18',
          fill: true,
          tension: 0.3,
          pointRadius: 3
        }
      ]
    },
    options: chartOpts('', 'line')
  });

  /* Chart 2: Net wealth comparison */
  window.__charts.wealth = new Chart(document.getElementById('chartWealth'), {
    type: 'line',
    data: {
      labels: yearLabels,
      datasets: [
        {
          label: 'Buyer Net Wealth',
          data: years.map(y => Math.round(y.buyerNetWealth)),
          borderColor: cs.c1,
          backgroundColor: cs.c1 + '25',
          fill: true,
          tension: 0.3,
          pointRadius: 3
        },
        {
          label: 'Renter Net Wealth',
          data: years.map(y => Math.round(y.renterNetWealth)),
          borderColor: cs.c2,
          backgroundColor: cs.c2 + '25',
          fill: true,
          tension: 0.3,
          pointRadius: 3
        }
      ]
    },
    options: chartOpts('', 'line')
  });

  /* Chart 3: Monthly cost comparison — Year 1 vs Final Year */
  const finalYr = years[years.length - 1];
  window.__charts.monthly = new Chart(document.getElementById('chartMonthly'), {
    type: 'bar',
    data: {
      labels: ['Year 1', 'Year ' + timeHorizon],
      datasets: [
        {
          label: 'Monthly Rent',
          data: [Math.round(year1.monthlyRent + rentersIns), Math.round(finalYr.monthlyRent + rentersIns * Math.pow(1 + costInflation, timeHorizon - 1))],
          backgroundColor: cs.c2
        },
        {
          label: 'Monthly Buy',
          data: [Math.round(year1.monthlyBuy), Math.round(finalYr.monthlyBuy)],
          backgroundColor: cs.c1
        }
      ]
    },
    options: {
      ...chartOpts('', 'bar'),
      scales: {
        x: { ticks: { color: cs.text }, grid: { display: false } },
        y: { ticks: { color: cs.text, callback: v => formatCurrency(v) }, grid: { color: cs.grid } }
      }
    }
  });

  /* Chart 4: Opportunity cost of down payment */
  const investedAmounts = [];
  let invested = totalUpfront;
  for(let yr = 1; yr <= timeHorizon; yr++){
    invested *= (1 + investReturn);
    investedAmounts.push(Math.round(invested));
  }
  window.__charts.opportunity = new Chart(document.getElementById('chartOpportunity'), {
    type: 'bar',
    data: {
      labels: yearLabels,
      datasets: [
        {
          label: 'Original Amount',
          data: years.map(() => Math.round(totalUpfront)),
          backgroundColor: cs.c3
        },
        {
          label: 'Growth (Invested)',
          data: investedAmounts.map(v => v - Math.round(totalUpfront)),
          backgroundColor: cs.c4
        }
      ]
    },
    options: {
      ...chartOpts('', 'bar'),
      plugins: {
        ...chartOpts('', 'bar').plugins,
        tooltip: {
          ...chartOpts('', 'bar').plugins.tooltip,
          callbacks: {
            label: function(ctx) {
              if(ctx.datasetIndex === 0) return 'Down Payment + Closing: ' + formatCurrency(ctx.raw);
              return 'Investment Growth: ' + formatCurrency(ctx.raw);
            },
            afterBody: function(items) {
              const idx = items[0].dataIndex;
              return ['Total Value: ' + formatCurrency(investedAmounts[idx])];
            }
          }
        }
      },
      scales: {
        x: { stacked: true, ticks: { color: cs.text }, grid: { display: false } },
        y: { stacked: true, ticks: { color: cs.text, callback: v => formatCurrency(v) }, grid: { color: cs.grid } }
      }
    }
  });

  /* ---- TABLE ---- */
  const tbody = document.getElementById('yearlyBody');
  tbody.innerHTML = '';
  years.forEach(y => {
    const advClass = y.advantage >= 0 ? 'kpi-positive' : 'kpi-negative';
    const advLabel = y.advantage >= 0 ? 'Buy +' + formatCurrency(y.advantage) : 'Rent +' + formatCurrency(Math.abs(y.advantage));
    tbody.innerHTML += `<tr>
      <td style="font-weight:600">${y.year}</td>
      <td class="text-right">${formatCurrency(y.rentCostCum)}</td>
      <td class="text-right">${formatCurrency(y.buyCostCum)}</td>
      <td class="text-right">${formatCurrency(y.homeEquity)}</td>
      <td class="text-right">${formatCurrency(y.renterPortfolio)}</td>
      <td class="text-right">${formatCurrency(y.buyerNetWealth)}</td>
      <td class="text-right">${formatCurrency(y.renterNetWealth)}</td>
      <td class="text-right ${advClass}" style="font-weight:600">${advLabel}</td>
    </tr>`;
  });

  showResults();
}
