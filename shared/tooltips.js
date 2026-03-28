/* ============================================================
   IntelliTC Solutions — Contextual Hover Tooltips
   ============================================================
   Adds hover tooltips to KPI cards and key financial terms in
   results tables. Auto-detects common real estate / finance
   terms and provides plain-English explanations.
   ============================================================ */
(function() {
  'use strict';

  /* ---- Financial term glossary ---- */
  var GLOSSARY = {
    /* Profitability & Return */
    'cap rate':          'Capitalization Rate — annual net income divided by property price. Higher = better yield. Ignores financing.',
    'capitalization rate':'Annual net income divided by property price. Higher = better yield. Ignores financing.',
    'noi':               'Net Operating Income — annual income after all operating expenses, but before debt service.',
    'net operating income':'Annual income after all operating expenses, but before debt service.',
    'cash-on-cash':      'Cash-on-Cash Return — annual cash flow divided by total cash invested. Shows the return on YOUR money, not the property price.',
    'cash on cash':      'Annual cash flow divided by total cash invested. Shows the return on YOUR money.',
    'coc':               'Cash-on-Cash Return — annual cash flow divided by total cash invested.',
    'irr':               'Internal Rate of Return — the annualized rate of return accounting for timing of all cash flows.',
    'roi':               'Return on Investment — total profit divided by total cash invested.',
    'grm':               'Gross Rent Multiplier — purchase price divided by annual gross rent. Lower = better value.',

    /* Debt & Financing */
    'dscr':              'Debt Service Coverage Ratio — NOI divided by annual debt payments. Lenders want 1.20+ minimum.',
    'debt service':      'Total annual loan payments (principal + interest). Does not include taxes, insurance, or maintenance.',
    'ltv':               'Loan-to-Value Ratio — loan amount divided by property value. Lower = less risk to the lender.',
    'dti':               'Debt-to-Income Ratio — monthly debt payments divided by gross monthly income. Lenders prefer under 43%.',
    'amortization':      'The schedule of loan payments over time. Each payment splits between interest (decreasing) and principal (increasing).',
    'p&i':               'Principal & Interest — the two components of each mortgage payment.',
    'piti':              'Principal, Interest, Taxes & Insurance — the full monthly housing cost.',

    /* Cash Flow */
    'cash flow':         'Money remaining after all expenses and debt payments. Positive = profit, negative = out-of-pocket.',
    'monthly cash flow': 'Monthly income minus all expenses and mortgage payment.',
    'annual cash flow':  'Yearly income minus all operating expenses and annual debt service.',
    'egi':               'Effective Gross Income — gross rent minus vacancy and credit loss. The realistic income to expect.',
    'effective gross income':'Gross rent minus vacancy and credit loss.',
    'gross rent':        'Total rental income before any deductions for vacancy, expenses, or debt.',
    'vacancy':           'Expected percentage of time units sit empty. Directly reduces income.',
    'vacancy rate':      'Expected percentage of time units sit empty. Typical: 5-10% for most markets.',
    'opex':              'Operating Expenses — all costs to run the property excluding mortgage payments.',
    'operating expenses':'All costs to run the property: taxes, insurance, maintenance, management, utilities.',
    'expense ratio':     'Total operating expenses divided by gross income. Typical range: 35-50%.',

    /* Valuation */
    'arv':               'After Repair Value — the estimated market value of a property after all renovations are complete.',
    'as-is value':       'Current market value of the property in its present condition, before any repairs.',
    'comps':             'Comparable sales — recently sold properties similar in size, condition, and location used to estimate value.',
    'equity':            'The difference between property value and remaining loan balance. Your ownership stake.',
    'appreciation':      'The increase in property value over time. Historically averages 3-5% annually in the US.',
    'depreciation':      'Tax deduction for wear and tear on the property. Residential = 27.5 years, commercial = 39 years.',

    /* Deal Analysis */
    'break-even':        'The point where income exactly covers all expenses and debt. Below this = losing money.',
    'break even':        'The point where income exactly covers all expenses and debt.',
    'spread':            'The difference between best and worst outcomes in a scenario. Wider spread = more risk.',
    'sensitivity':       'How much a result changes when you adjust one input. Helps identify which variables matter most.',
    'downside risk':     'The potential for loss. In real estate: vacancy, repairs, market decline, or interest rate increases.',
    'margin of safety':  'The cushion between your projected returns and the break-even point.',

    /* Costs & Fees */
    'closing costs':     'Fees paid at purchase: title insurance, appraisal, lender fees, attorney, recording. Typically 2-5% of price.',
    'cash to close':     'Total money needed at closing: down payment + closing costs + prepaid items.',
    'rehab cost':        'Total renovation budget including materials, labor, permits, and contingency.',
    'holding costs':     'Monthly costs while owning a property: loan payments, taxes, insurance, utilities. Critical for flips.',
    'commission':        'Agent fees, typically 5-6% of sale price split between buyer and seller agents.',

    /* Ratios & Metrics */
    'price per unit':    'Total price divided by number of units. Used to compare multifamily properties.',
    'price per sq ft':   'Total price divided by square footage. Used to compare properties of different sizes.',
    'rent per sq ft':    'Monthly rent divided by square footage. Helps compare rental values across properties.',
    'net yield':         'Income return after all expenses, expressed as a percentage of the investment.',
    'gross yield':       'Annual rent divided by property price, before expenses. A quick screening metric.',

    /* Loan Types */
    'conventional':      'Standard bank mortgage. Typically requires 20-25% down for investment properties, good credit.',
    'fha':               'Federal Housing Administration loan — low down payment (3.5%), but owner-occupancy required.',
    'va':                'Veterans Affairs loan — zero down payment for eligible veterans. Owner-occupancy required.',
    'hard money':        'Short-term, high-interest loan from private lenders. Used for flips. Based on asset value, not borrower income.',
    'private money':     'Loan from a private individual, not a bank. Terms are negotiable. Often used for creative deals.',
    'seller financing':  'The seller acts as the bank — you make payments directly to them instead of a mortgage company.',
    'subject to':        'Buying property "subject to" the existing mortgage. The loan stays in the seller\'s name.',
    'heloc':             'Home Equity Line of Credit — a revolving credit line secured by your home equity. Variable rate.',
    'rate buydown':      'Paying upfront points to lower your interest rate. Each point = 1% of the loan amount.',

    /* Tax & Legal */
    '1031 exchange':     'Tax-deferred exchange — sell one investment property and buy another without paying capital gains tax.',
    'cost segregation':  'Accelerated depreciation study that front-loads tax deductions in the early years of ownership.',
    'capital gains':     'Profit from selling a property. Short-term (< 1 year) taxed as income. Long-term taxed at lower rates.',
    'phantom income':    'Taxable income that doesn\'t produce actual cash flow. Common with syndications and partnerships.'
  };

  /* ---- Create tooltip element ---- */
  var tooltipEl = null;
  function ensureTooltip() {
    if (tooltipEl) return tooltipEl;
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'itc-hover-tooltip';
    tooltipEl.setAttribute('role', 'tooltip');
    tooltipEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(tooltipEl);
    return tooltipEl;
  }

  /* ---- Position tooltip ---- */
  function showTooltip(target, text) {
    var tip = ensureTooltip();
    // Hide first to reset position for accurate measurement
    tip.classList.remove('visible');
    tip.textContent = text;
    tip.style.left = '0px';
    tip.style.top = '0px';
    // Force layout recalculation
    tip.offsetHeight;
    tip.classList.add('visible');
    tip.setAttribute('aria-hidden', 'false');

    var rect = target.getBoundingClientRect();
    var tipRect = tip.getBoundingClientRect();
    var left = rect.left + rect.width / 2 - tipRect.width / 2;
    var top = rect.top - tipRect.height - 10;

    // Clamp to viewport
    if (left < 8) left = 8;
    if (left + tipRect.width > window.innerWidth - 8) left = window.innerWidth - tipRect.width - 8;
    if (top < 8) {
      top = rect.bottom + 10; // Show below if no room above
    }

    tip.style.left = left + 'px';
    tip.style.top = top + window.scrollY + 'px';
  }

  function hideTooltip() {
    if (!tooltipEl) return;
    tooltipEl.classList.remove('visible');
    tooltipEl.setAttribute('aria-hidden', 'true');
  }

  /* ---- Annotate KPI cards ---- */
  function annotateKPIs() {
    document.querySelectorAll('#resultsPanel .kpi-card').forEach(function(card) {
      if (card.dataset.tooltipBound) return;
      card.dataset.tooltipBound = '1';

      var label = card.querySelector('.kpi-label');
      if (!label) return;
      var text = label.textContent.trim().toLowerCase();

      // Match against glossary
      var match = null;
      var keys = Object.keys(GLOSSARY);
      for (var i = 0; i < keys.length; i++) {
        if (text.indexOf(keys[i]) !== -1) {
          match = GLOSSARY[keys[i]];
          break;
        }
      }
      if (!match) return;

      // Add info icon
      var icon = document.createElement('span');
      icon.className = 'itc-tooltip-icon';
      icon.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
      icon.setAttribute('aria-label', 'More info');
      icon.setAttribute('tabindex', '0');
      label.appendChild(icon);

      // Tooltip on icon hover
      icon.addEventListener('mouseenter', function() { showTooltip(icon, match); });
      icon.addEventListener('mouseleave', hideTooltip);
      icon.addEventListener('focus', function() { showTooltip(icon, match); });
      icon.addEventListener('blur', hideTooltip);

      // Also trigger on entire label hover for easier access
      label.style.cursor = 'help';
      label.addEventListener('mouseenter', function() { showTooltip(label, match); });
      label.addEventListener('mouseleave', hideTooltip);
    });
  }

  /* ---- Annotate table header cells ---- */
  function annotateTables() {
    document.querySelectorAll('#resultsPanel .results-table th').forEach(function(th) {
      if (th.dataset.tooltipBound) return;
      th.dataset.tooltipBound = '1';

      var text = th.textContent.trim().toLowerCase();
      var match = null;
      var keys = Object.keys(GLOSSARY);
      for (var i = 0; i < keys.length; i++) {
        if (text.indexOf(keys[i]) !== -1) {
          match = GLOSSARY[keys[i]];
          break;
        }
      }
      if (!match) return;

      th.style.cursor = 'help';
      th.addEventListener('mouseenter', function() { showTooltip(th, match); });
      th.addEventListener('mouseleave', hideTooltip);
    });
  }

  /* ---- Theme toggle tooltip ---- */
  function annotateThemeToggle() {
    var toggle = document.querySelector('[data-theme-toggle]');
    if (!toggle || toggle.dataset.tooltipBound) return;
    toggle.dataset.tooltipBound = '1';
    toggle.addEventListener('mouseenter', function() {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      showTooltip(toggle, isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });
    toggle.addEventListener('mouseleave', hideTooltip);
  }

  /* ---- Initialize ---- */
  function init() {
    annotateKPIs();
    annotateTables();
    annotateThemeToggle();

    // Re-annotate after calculation (results may be rebuilt)
    var calcBtn = document.getElementById('calcBtn');
    if (calcBtn) {
      calcBtn.addEventListener('click', function() {
        setTimeout(function() {
          annotateKPIs();
          annotateTables();
        }, 250);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
