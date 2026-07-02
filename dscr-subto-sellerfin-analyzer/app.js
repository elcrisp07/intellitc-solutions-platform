/* IntelliTC Solutions — DSCR/SubTo/SellerFin Analyzer
   Hidden Gem #14. Educational only. Not lender qualification.
   Live calculation: as any field changes, capital stack + KPIs re-render.
*/
(function () {
  'use strict';

  // ─── State ─────────────────────────────────────────────────────
  let currentMode = 'subto'; // 'subto' | 'sellerfin' | 'hybrid'

  const modeDescriptions = {
    subto: '<strong>Sub-To:</strong> buyer takes title, seller\u2019s existing mortgage stays in place. Leg 1 = existing lien. Any remainder is either seller carry (Leg 2), transactional funding, or buyer cash.',
    sellerfin: '<strong>Seller Finance:</strong> seller acts as the bank. Leg 1 = new 1st-position seller-carry note. If the buyer also brings a new institutional loan, that becomes Leg 1 and seller carry moves to Leg 2.',
    hybrid: '<strong>Hybrid:</strong> existing mortgage stays (Sub-To leg) AND seller carries a second-position note for the remaining gap. Common when purchase price exceeds existing balance and buyer needs zero cash.'
  };

  // ─── Utility ───────────────────────────────────────────────────
  const $ = (id) => document.getElementById(id);
  const num = (id) => {
    const el = $(id);
    if (!el) return 0;
    const v = parseFloat(String(el.value).replace(/[$,\s]/g, ''));
    return isNaN(v) ? 0 : v;
  };
  const fmt$ = (n, opts = {}) => {
    const sign = n < 0 ? '-' : '';
    const abs = Math.abs(n);
    if (opts.compact && abs >= 1_000_000) return sign + '$' + (abs / 1_000_000).toFixed(2) + 'M';
    if (opts.compact && abs >= 10_000) return sign + '$' + Math.round(abs / 1000) + 'K';
    return sign + '$' + abs.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };
  const fmtPct = (n, dec = 1) => (isFinite(n) ? n.toFixed(dec) + '%' : '—');
  const fmtRatio = (n, dec = 2) => (isFinite(n) ? n.toFixed(dec) + 'x' : '—');

  // Standard mortgage P&I (monthly payment)
  function monthlyPmt(principal, annualRatePct, years) {
    if (principal <= 0 || years <= 0) return 0;
    const r = annualRatePct / 100 / 12;
    const n = years * 12;
    if (r === 0) return principal / n;
    return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  // ─── Currency input formatting ─────────────────────────────────
  function attachCurrency() {
    document.querySelectorAll('input[data-currency]').forEach((el) => {
      el.addEventListener('input', () => {
        const cursor = el.selectionStart;
        const raw = el.value.replace(/[^0-9.]/g, '');
        if (!raw) { el.value = ''; return; }
        const parts = raw.split('.');
        const int = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        el.value = parts.length > 1 ? int + '.' + parts[1] : int;
        try { el.setSelectionRange(cursor, cursor); } catch (e) {}
      });
    });
  }

  // ─── Mode switching ────────────────────────────────────────────
  function applyModeVisibility() {
    document.querySelectorAll('[data-show]').forEach((el) => {
      const show = el.getAttribute('data-show').split(',');
      el.style.display = show.includes(currentMode) ? '' : 'none';
    });
    document.getElementById('modeDesc').innerHTML = modeDescriptions[currentMode];

    // Sensible defaults per mode
    if (currentMode === 'subto') {
      $('firstLoanAmt').value = '0';
    }
    if (currentMode === 'sellerfin') {
      // Zero out existing mortgage since it's paid off at close
      if (num('existingBal') > 0 && num('firstLoanAmt') === 0) {
        // don't auto-clear; user may want a Hybrid mid-transition
      }
    }
  }

  function attachModeTabs() {
    document.querySelectorAll('.mode-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-tab').forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        currentMode = btn.getAttribute('data-mode');
        applyModeVisibility();
        recalc();
      });
    });
  }

  // ─── Exit-method conditional visibility ────────────────────────
  function applyExitVisibility() {
    const method = $('exitMethod').value;
    document.querySelectorAll('[data-exit]').forEach((el) => {
      el.style.display = el.getAttribute('data-exit') === method ? '' : 'none';
    });
  }

  // ─── Core calculation ──────────────────────────────────────────
  function calc() {
    const purchase = num('purchasePrice');
    const existingBal = (currentMode === 'sellerfin') ? 0 : num('existingBal');
    const existingRate = num('existingRate');
    const existingRemTerm = num('existingRemainingTerm');
    const firstLoan = (currentMode === 'subto') ? 0 : num('firstLoanAmt');
    const firstLTVCap = num('firstLoanLTVCap');
    const tfAmount = num('tfAmount');
    const tfFeePct = num('tfFee');
    const tfFee = tfAmount * (tfFeePct / 100);
    const escrow = num('escrow');
    const buyerCC = num('buyerCC');
    const thirdParty = num('thirdParty');
    const cashToSeller = num('cashToSeller');

    // Seller Financing Amount is the plug that closes the equation:
    // Sources = Uses.  Uses = purchase + buyer costs.  Sources = 1st loan + existing (stays) + seller carry + TF + buyer cash.
    // Buyer cash-in = escrow + buyerCC + thirdParty + tfFee + cashToSeller (baseline)
    // Seller carry = purchase - existingBal - firstLoan - tfAmount - cashToSeller
    let sellerFin = purchase - existingBal - firstLoan - tfAmount - cashToSeller;
    if (sellerFin < 0) sellerFin = 0;
    $('sellerFinAmt').value = sellerFin.toLocaleString('en-US', { maximumFractionDigits: 0 });

    // Buyer cash needed at close (positive = brings cash; negative = walks away with cash)
    // Sources at close = tfAmount (transactional wet-fund).  Uses at close (cash side) = escrow + buyerCC + 3rd party + tfFee + cashToSeller.
    // If tfAmount funds the wet close, tfAmount is repaid by end-of-day from the sellerFin note funding — modeled as a wash except for tfFee.
    // Buyer's true out-of-pocket = escrow + buyerCC + 3rd party + tfFee + cashToSeller  MINUS any structured cash-back from an over-funded 1st (First loan > payoff bal).
    const cashBackFromFirst = Math.max(0, firstLoan - existingBal);
    const buyerOutOfPocket = escrow + buyerCC + thirdParty + tfFee + cashToSeller - cashBackFromFirst;
    const cashBack = -buyerOutOfPocket; // positive = cash to buyer at table

    // Sanity: If 1st loan exceeds LTV cap it's structurally infeasible
    const firstLTV = purchase > 0 ? (firstLoan / purchase) * 100 : 0;
    const firstLTVViolation = firstLoan > 0 && firstLTV > firstLTVCap + 0.01;

    // Cashflow — Operating side
    const grossRent = num('grossRent');
    const occupancy = num('occupancy') / 100;
    const opexPct = num('opexPct') / 100;
    const egi = grossRent * 12 * occupancy;
    const opex = egi * opexPct;
    const noi = egi - opex;

    // Debt service
    const existingPI = monthlyPmt(existingBal, existingRate, existingRemTerm) * 12;
    const firstPI = monthlyPmt(firstLoan, num('existingRate'), 30) * 12; // if a new institutional 1st, assume 30yr am (rough; real DSCR loan varies)
    // For seller note debt service, respect amortization type
    const snRate = num('sellerNoteRate');
    const snTerm = num('sellerNoteTerm');
    const snAmort = $('sellerNoteAmort').value;
    let sellerNoteAnnualDS = 0;
    if (sellerFin > 0) {
      if (snAmort === 'io') {
        sellerNoteAnnualDS = sellerFin * (snRate / 100);
      } else {
        sellerNoteAnnualDS = monthlyPmt(sellerFin, snRate, snTerm) * 12;
      }
    }

    const totalDS = existingPI + firstPI + sellerNoteAnnualDS;
    const dscr = totalDS > 0 ? noi / totalDS : 0;
    const cashflowY1 = noi - totalDS;
    const coc = buyerOutOfPocket > 0 ? (cashflowY1 / buyerOutOfPocket) * 100 : (cashflowY1 > 0 ? Infinity : 0);

    // Equity at close = purchase - all debt at close
    const totalDebtAtClose = existingBal + firstLoan + sellerFin;
    const equityAtClose = purchase - totalDebtAtClose;

    // Exit refi
    const exitMethod = $('exitMethod').value;
    const exitLTV = num('exitLTV') / 100;
    let arv;
    if (exitMethod === 'commercial') {
      const exitNOI = num('exitNOI');
      const exitCap = num('exitCapRate') / 100;
      arv = exitCap > 0 ? exitNOI / exitCap : 0;
    } else {
      arv = num('exitCompPrice');
    }
    const exitMaxLoan = arv * exitLTV;
    // At exit, pay off existing balance (approximated, no amortization applied for simplicity) + seller note
    const exitRefiProceeds = exitMaxLoan - existingBal - firstLoan - sellerFin;

    // House-of-Cards flag
    // Triggered if: DSCR < 1.0 OR total leverage > 100% of purchase OR cash-back > 15% of purchase (extraction risk)
    const houseOfCards =
      dscr < 1.0 ||
      totalDebtAtClose > purchase * 1.02 ||
      cashBack > purchase * 0.15;

    return {
      purchase, existingBal, firstLoan, sellerFin, tfAmount, tfFee, cashToSeller,
      escrow, buyerCC, thirdParty, buyerOutOfPocket, cashBack,
      firstLTV, firstLTVViolation,
      egi, opex, noi, existingPI, firstPI, sellerNoteAnnualDS, totalDS, dscr,
      cashflowY1, coc, equityAtClose, totalDebtAtClose,
      arv, exitMaxLoan, exitRefiProceeds, houseOfCards, exitMethod,
    };
  }

  // ─── Render ────────────────────────────────────────────────────
  function render(r) {
    // Headline cash-back
    const cb = $('hkCashBack');
    cb.textContent = fmt$(r.cashBack);
    cb.style.color = r.cashBack >= 0 ? 'var(--color-success)' : '#b54033';
    $('hkCashBackSub').textContent =
      r.cashBack >= 0
        ? 'You leave the closing table with ' + fmt$(r.cashBack) + '. Confirm sources reconcile to uses.'
        : 'You bring ' + fmt$(Math.abs(r.cashBack)) + ' cash to close. Verify wire capacity and reserves.';

    // Stacked capital-stack bar
    // Denominator = purchase price (or total capitalized amount if it exceeds purchase)
    const denom = Math.max(r.purchase, r.totalDebtAtClose + Math.max(0, r.cashBack));
    const seg = (v) => (denom > 0 ? Math.max(0, (v / denom) * 100) : 0);
    const segLien1Amt = (currentMode === 'subto' || currentMode === 'hybrid') ? r.existingBal : r.firstLoan;
    const segLien2Amt = (currentMode === 'sellerfin') ? 0 : r.firstLoan; // only shown if hybrid+first
    const segCarryAmt = r.sellerFin;
    const segTFAmt = r.tfAmount;
    const segCashAmt = Math.max(0, r.cashBack);

    setSeg('segLien1', seg(segLien1Amt), segLien1Amt);
    setSeg('segLien2', seg(segLien2Amt), segLien2Amt);
    setSeg('segCarry', seg(segCarryAmt), segCarryAmt);
    setSeg('segTF', seg(segTFAmt), segTFAmt);
    setSeg('segCash', seg(segCashAmt), segCashAmt);

    // Legend
    const legend = [
      { swatch: '#01696f', label: (currentMode === 'sellerfin') ? '1st-Position Note (New)' : 'Leg 1 — Existing Mortgage (Sub-To)', amt: segLien1Amt },
      { swatch: '#20808D', label: 'Leg 2 — Institutional 1st (New)', amt: segLien2Amt },
      { swatch: '#D19900', label: 'Seller Carry (Junior)', amt: segCarryAmt },
      { swatch: '#A84B2F', label: 'Transactional Funding', amt: segTFAmt },
      { swatch: '#437A22', label: 'Buyer Cash-Back at Close', amt: segCashAmt },
    ].filter((x) => x.amt > 0);

    $('stackLegend').innerHTML = legend.length
      ? legend.map((x) => `
          <div class="leg-item">
            <span class="leg-swatch" style="background:${x.swatch}"></span>
            <span>${x.label}</span>
            <span class="leg-amt">${fmt$(x.amt)}</span>
          </div>`).join('')
      : '<div class="leg-item" style="grid-column:1/-1;text-align:center;font-style:italic">Enter Purchase Price to render stack.</div>';

    // Mini KPIs
    setKpi('kDSCR', 'kDSCRVal', fmtRatio(r.dscr), r.dscr >= 1.25 ? 'good' : r.dscr >= 1.0 ? 'warn' : 'bad');
    setKpi('kCoC', 'kCoCVal', isFinite(r.coc) ? fmtPct(r.coc) : '∞', r.coc >= 8 ? 'good' : r.coc >= 0 ? 'warn' : 'bad');
    setKpi('kEquity', 'kEquityVal', fmt$(r.equityAtClose, { compact: true }), r.equityAtClose > 0 ? 'good' : r.equityAtClose === 0 ? 'warn' : 'bad');
    setKpi('kExit', 'kExitVal', fmt$(r.exitRefiProceeds, { compact: true }), r.exitRefiProceeds > 10000 ? 'good' : r.exitRefiProceeds > 0 ? 'warn' : 'bad');

    // Overall deal status pill
    const status = $('dealStatus');
    if (r.firstLTVViolation || r.dscr < 1.0 || r.houseOfCards) {
      status.className = 'stack-status status-fail';
      status.textContent = 'Structurally Fragile';
    } else if (r.dscr < 1.25 || r.cashflowY1 < 0) {
      status.className = 'stack-status status-warn';
      status.textContent = 'Tight — Review Reserves';
    } else {
      status.className = 'stack-status status-ok';
      status.textContent = 'Feasible';
    }

    // Flag cards
    const flags = [];
    if (r.firstLTVViolation) {
      flags.push({ type: 'critical', title: 'LTV Cap Violation', body: `Your 1st-position loan (${fmtPct(r.firstLTV)}) exceeds the stated LTV cap of ${fmtPct(num('firstLoanLTVCap'))}. No institutional DSCR lender will underwrite this structure. Adjust loan amount or contribute more buyer equity.` });
    }
    if (r.dscr > 0 && r.dscr < 1.0) {
      flags.push({ type: 'critical', title: 'DSCR Below 1.0', body: `NOI does not cover total debt service. DSCR = ${fmtRatio(r.dscr)}. Year-1 cashflow = ${fmt$(r.cashflowY1)}/yr. This deal loses money at close unless rent grows materially or debt is restructured.` });
    } else if (r.dscr > 0 && r.dscr < 1.25) {
      flags.push({ type: 'warn', title: 'DSCR Below Lender Threshold', body: `DSCR = ${fmtRatio(r.dscr)}. Most institutional DSCR lenders require 1.25x minimum. Refi-out will require rent bump, tax appeal, or opex reduction.` });
    }
    if (r.houseOfCards) {
      flags.push({ type: 'critical', title: 'House of Cards Risk', body: 'Combination of leverage above 100%, negative cashflow, or large cash-back at close creates equity-extraction risk. If rents dip or a lien is called, the entire stack can collapse. Educational flag only.' });
    }
    if (r.cashBack > 0 && r.cashBack <= r.purchase * 0.15) {
      flags.push({ type: 'ok', title: 'Zero-Down + Cash-Back Structure', body: `You leave the table with ${fmt$(r.cashBack)}. Verify with title company that source-of-funds documentation is clean and that any 1st-position lender is aware of subordinate liens.` });
    }
    if (currentMode === 'subto' || currentMode === 'hybrid') {
      flags.push({ type: 'warn', title: 'Sub-To Structural Reminders', body: 'Existing mortgage will remain in seller\u2019s name. Due-on-sale clause can trigger acceleration. Insurance must be re-issued in buyer entity (or wrapped). Property tax reassessment may occur at transfer. Verify with counsel.' });
    }
    if (r.tfAmount > 0) {
      flags.push({ type: 'warn', title: 'Transactional Funding Present', body: `Transactional funding of ${fmt$(r.tfAmount)} is a same-day double-close instrument. Fee of ${fmt$(r.tfFee)} is a real cost of capital. Confirm your closer is experienced with A-B / B-C simultaneous closings.` });
    }

    $('flagContainer').innerHTML = flags.length
      ? flags.map((f) => `<div class="flag-card flag-${f.type}"><strong>${f.title}</strong>${f.body}</div>`).join('')
      : '';

    // Verdict
    let verdict;
    if (r.firstLTVViolation) {
      verdict = 'Non-starter. LTV cap violation. Restructure with more equity or lower 1st-position ask.';
    } else if (r.dscr < 1.0 || r.houseOfCards) {
      verdict = 'This structure is fragile. NOI does not cover debt service, or leverage/cash-back exceeds prudent thresholds. Educational finding — do not execute without an attorney and CPA sanity check.';
    } else if (r.dscr < 1.25) {
      verdict = 'Marginal. Debt service is covered but below institutional DSCR thresholds. Refi-out path requires rent growth, tax appeal, or opex reduction. Model 3–5 yr rent scenarios before committing.';
    } else if (r.cashBack > 0) {
      verdict = `Structurally sound. Zero-down + ${fmt$(r.cashBack)} at table. Confirm title, insurance, and lender disclosures. Verify seller-carry documentation with counsel.`;
    } else if (r.cashBack < 0) {
      verdict = `Structurally sound but requires ${fmt$(Math.abs(r.cashBack))} buyer cash-in. Verify reserves after close (recommended: 6 months PITI).`;
    } else {
      verdict = 'Deal balances at close. Review DSCR, reserves, and exit strategy before executing.';
    }
    $('verdictText').textContent = verdict;

    // Detail table
    const rows = [
      ['Purchase Price (PSA)', fmt$(r.purchase), 'Contract price'],
      ['Existing Mortgage Balance', fmt$(r.existingBal), currentMode === 'sellerfin' ? 'Paid off at close' : 'Stays in place under Sub-To'],
      ['New 1st-Position Loan', fmt$(r.firstLoan), 'LTV: ' + fmtPct(r.firstLTV)],
      ['Seller Financing Amount', fmt$(r.sellerFin), 'Junior lien — auto-calculated'],
      ['Transactional Funding', fmt$(r.tfAmount), 'Wet-close bridge; fee: ' + fmt$(r.tfFee)],
      ['Cash to Seller at Close', fmt$(r.cashToSeller), 'Reduces seller carry'],
      ['Buyer Out-of-Pocket at Close', fmt$(r.buyerOutOfPocket), r.cashBack >= 0 ? 'Net cash-back to buyer: ' + fmt$(r.cashBack) : 'Buyer brings cash'],
      ['—', '—', '—'],
      ['Effective Gross Income', fmt$(r.egi) + '/yr', 'Gross rent × occupancy'],
      ['Operating Expenses', fmt$(r.opex) + '/yr', 'OpEx % of EGI'],
      ['Net Operating Income (NOI)', fmt$(r.noi) + '/yr', 'EGI − OpEx'],
      ['Existing Mortgage DS', fmt$(r.existingPI) + '/yr', currentMode === 'sellerfin' ? '(Paid off)' : 'Wraps into buyer obligation'],
      ['New 1st-Position DS', fmt$(r.firstPI) + '/yr', '30-yr amortization assumed'],
      ['Seller Note DS', fmt$(r.sellerNoteAnnualDS) + '/yr', $('sellerNoteAmort').value === 'io' ? 'Interest-only' : 'Amortized'],
      ['Total Debt Service', fmt$(r.totalDS) + '/yr', ''],
      ['DSCR (Yr 1)', fmtRatio(r.dscr), r.dscr >= 1.25 ? 'Passes institutional threshold' : r.dscr >= 1.0 ? 'Covers debt but tight' : 'Negative cashflow risk'],
      ['Cashflow Yr 1', fmt$(r.cashflowY1) + '/yr', ''],
      ['—', '—', '—'],
      ['Exit ARV / Comp', fmt$(r.arv), r.exitMethod === 'commercial' ? 'NOI / Cap Rate' : 'Comp-based'],
      ['Max Exit Loan', fmt$(r.exitMaxLoan), 'ARV × exit LTV'],
      ['Exit Refi Proceeds', fmt$(r.exitRefiProceeds), 'After paying off all liens at exit'],
    ];
    $('detailBody').innerHTML = rows.map((row) => `<tr><td>${row[0]}</td><td class="num">${row[1]}</td><td>${row[2]}</td></tr>`).join('');
  }

  // ─── Amortization schedules ────────────────────────────────────
  // Standard amortizing schedule: returns [{year, begBal, payment, interest, principal, endBal}, ...]
  function amortizeStandard(principal, annualRatePct, termYears, horizonYears) {
    if (principal <= 0 || termYears <= 0) return [];
    const monthlyRate = annualRatePct / 100 / 12;
    const monthlyPayment = monthlyPmt(principal, annualRatePct, termYears);
    const rows = [];
    let bal = principal;
    const horizon = Math.min(horizonYears, termYears);
    for (let y = 1; y <= horizon; y++) {
      const begBal = bal;
      let yearInterest = 0;
      let yearPrincipal = 0;
      for (let m = 0; m < 12; m++) {
        if (bal <= 0.01) break;
        const interest = bal * monthlyRate;
        let principalPaid = monthlyPayment - interest;
        if (principalPaid > bal) principalPaid = bal;
        bal -= principalPaid;
        yearInterest += interest;
        yearPrincipal += principalPaid;
      }
      rows.push({
        year: y,
        begBal,
        payment: yearInterest + yearPrincipal,
        interest: yearInterest,
        principal: yearPrincipal,
        endBal: bal,
        isPayoff: bal <= 0.01
      });
      if (bal <= 0.01) break;
    }
    return rows;
  }

  // Interest-only schedule with optional balloon
  function amortizeInterestOnly(principal, annualRatePct, termYears, balloonYear, horizonYears) {
    if (principal <= 0) return [];
    const rows = [];
    const horizon = Math.min(horizonYears, termYears);
    const annualInterest = principal * (annualRatePct / 100);
    for (let y = 1; y <= horizon; y++) {
      const isBalloon = balloonYear && y === balloonYear;
      rows.push({
        year: y,
        begBal: principal,
        payment: isBalloon ? annualInterest + principal : annualInterest,
        interest: annualInterest,
        principal: isBalloon ? principal : 0,
        endBal: isBalloon ? 0 : principal,
        isBalloon,
        isPayoff: isBalloon
      });
      if (isBalloon) break;
    }
    return rows;
  }

  // Amortized w/ balloon: pay as if fully amortizing, then balloon in specified year
  function amortizeBalloon(principal, annualRatePct, amortYears, balloonYear, horizonYears) {
    if (principal <= 0 || amortYears <= 0) return [];
    const monthlyRate = annualRatePct / 100 / 12;
    const monthlyPayment = monthlyPmt(principal, annualRatePct, amortYears);
    const rows = [];
    let bal = principal;
    const horizon = Math.min(horizonYears, amortYears, balloonYear || horizonYears);
    for (let y = 1; y <= horizon; y++) {
      const begBal = bal;
      let yearInterest = 0;
      let yearPrincipal = 0;
      for (let m = 0; m < 12; m++) {
        if (bal <= 0.01) break;
        const interest = bal * monthlyRate;
        let principalPaid = monthlyPayment - interest;
        if (principalPaid > bal) principalPaid = bal;
        bal -= principalPaid;
        yearInterest += interest;
        yearPrincipal += principalPaid;
      }
      const isBalloon = balloonYear && y === balloonYear;
      rows.push({
        year: y,
        begBal,
        payment: yearInterest + yearPrincipal + (isBalloon ? bal : 0),
        interest: yearInterest,
        principal: yearPrincipal + (isBalloon ? bal : 0),
        endBal: isBalloon ? 0 : bal,
        isBalloon,
        isPayoff: isBalloon || bal <= 0.01
      });
      if (isBalloon || bal <= 0.01) break;
    }
    return rows;
  }

  function renderAmortization(r) {
    const horizon = parseInt(($('amortYears') || {}).value || '10', 10);
    const apprRate = num('apprRate') / 100;

    // Build each leg's schedule
    const legs = [];
    if (r.existingBal > 0 && currentMode !== 'sellerfin') {
      const rows = amortizeStandard(r.existingBal, num('existingRate'), num('existingRemainingTerm'), horizon);
      legs.push({
        title: 'Leg 1 — Existing Mortgage (Sub-To)',
        meta: `Balance ${fmt$(r.existingBal)} · ${num('existingRate').toFixed(2)}% · ${num('existingRemainingTerm')}-yr amort remaining`,
        rows
      });
    }
    if (r.firstLoan > 0) {
      const rows = amortizeStandard(r.firstLoan, num('existingRate'), 30, horizon);
      legs.push({
        title: currentMode === 'sellerfin' ? 'Leg 1 — New 1st-Position Note' : 'Leg 2 — Institutional 1st (New)',
        meta: `Balance ${fmt$(r.firstLoan)} · ${num('existingRate').toFixed(2)}% · 30-yr amort assumed`,
        rows
      });
    }
    if (r.sellerFin > 0) {
      const snRate = num('sellerNoteRate');
      const snTerm = num('sellerNoteTerm');
      const snAmort = $('sellerNoteAmort').value;
      const balloonYr = parseInt($('balloonYear').value || '0', 10) || 0;
      let rows;
      let amortLabel;
      if (snAmort === 'io') {
        rows = amortizeInterestOnly(r.sellerFin, snRate, snTerm, balloonYr || snTerm, horizon);
        amortLabel = balloonYr ? `Interest-only, balloon Yr ${balloonYr}` : `Interest-only, ${snTerm}-yr term`;
      } else if (snAmort === 'balloon') {
        rows = amortizeBalloon(r.sellerFin, snRate, snTerm, balloonYr || snTerm, horizon);
        amortLabel = balloonYr ? `Amortized ${snTerm}-yr, balloon Yr ${balloonYr}` : `Amortized ${snTerm}-yr with balloon`;
      } else {
        rows = amortizeStandard(r.sellerFin, snRate, snTerm, horizon);
        amortLabel = `Fully amortized ${snTerm}-yr`;
      }
      legs.push({
        title: currentMode === 'sellerfin' && r.firstLoan > 0 ? 'Leg 2 — Seller Carry (Junior)' :
               currentMode === 'sellerfin' ? 'Seller Carry Note' :
               (currentMode === 'hybrid' ? 'Leg 3 — Seller Carry (Junior)' : 'Leg 2 — Seller Carry (Junior)'),
        meta: `Balance ${fmt$(r.sellerFin)} · ${snRate.toFixed(2)}% · ${amortLabel}`,
        rows,
        highlight: 'gold'
      });
    }

    const tbl = $('amortTables');
    if (!tbl) return;
    if (legs.length === 0) {
      tbl.innerHTML = '<div class="amort-leg"><p style="font-style:italic;color:var(--color-text-muted);margin:0">No debt layers to amortize — enter loan amounts on the left.</p></div>';
      $('amortCombinedBody').innerHTML = '';
      return;
    }

    tbl.innerHTML = legs.map((leg) => `
      <div class="amort-leg">
        <h6>${leg.title}</h6>
        <div class="amort-leg-meta">${leg.meta}</div>
        <div class="amort-scroll">
          <table>
            <thead><tr><th>Yr</th><th class="num">Beg Bal</th><th class="num">Pmt</th><th class="num">Int</th><th class="num">Prin</th><th class="num">End Bal</th></tr></thead>
            <tbody>${leg.rows.map((row) => `
              <tr class="${row.isBalloon ? 'balloon-row' : row.isPayoff ? 'payoff-row' : ''}">
                <td>${row.year}${row.isBalloon ? ' \u2605' : ''}</td>
                <td class="num">${fmt$(row.begBal, {compact: true})}</td>
                <td class="num">${fmt$(row.payment, {compact: true})}</td>
                <td class="num">${fmt$(row.interest, {compact: true})}</td>
                <td class="num">${fmt$(row.principal, {compact: true})}</td>
                <td class="num">${fmt$(row.endBal, {compact: true})}</td>
              </tr>`).join('')}</tbody>
          </table>
        </div>
      </div>`).join('');

    // Combined by year — sum across legs, then compute equity
    const combined = {};
    legs.forEach((leg) => {
      leg.rows.forEach((row) => {
        if (!combined[row.year]) combined[row.year] = { year: row.year, payment: 0, interest: 0, principal: 0, endBal: 0 };
        combined[row.year].payment += row.payment;
        combined[row.year].interest += row.interest;
        combined[row.year].principal += row.principal;
        combined[row.year].endBal += row.endBal;
      });
    });

    // Fill in years where a leg has already paid off — its endBal carries forward at 0
    const maxYear = Math.max(...legs.map((l) => l.rows.length > 0 ? l.rows[l.rows.length - 1].year : 0));
    for (let y = 1; y <= maxYear; y++) {
      if (!combined[y]) combined[y] = { year: y, payment: 0, interest: 0, principal: 0, endBal: 0 };
    }

    // Est. equity = property value grown at appreciation - remaining debt
    const combinedRows = Object.values(combined).sort((a, b) => a.year - b.year);
    const purchase = r.purchase || 0;
    combinedRows.forEach((c) => {
      const propVal = purchase * Math.pow(1 + apprRate, c.year);
      c.propVal = propVal;
      c.equity = propVal - c.endBal;
    });

    $('amortCombinedBody').innerHTML = combinedRows.map((c) => `
      <tr>
        <td>${c.year}</td>
        <td class="num">${fmt$(c.payment)}</td>
        <td class="num">${fmt$(c.interest)}</td>
        <td class="num">${fmt$(c.principal)}</td>
        <td class="num">${fmt$(c.endBal)}</td>
        <td class="num">${fmt$(c.equity)}</td>
      </tr>`).join('');
  }

  function setSeg(id, pct, amt) {
    const el = $(id);
    if (!el) return;
    el.style.flexBasis = pct + '%';
    el.textContent = amt > 0 && pct > 6 ? fmt$(amt, { compact: true }) : '';
  }
  function setKpi(cardId, valId, txt, tone) {
    const card = $(cardId);
    if (!card) return;
    card.classList.remove('mk-good', 'mk-warn', 'mk-bad');
    if (tone) card.classList.add('mk-' + tone);
    $(valId).textContent = txt;
  }

  // ─── Wire up ───────────────────────────────────────────────────
  function recalc() {
    const r = calc();
    render(r);
    renderAmortization(r);
  }

  function attachInputListeners() {
    document.querySelectorAll('#inputPanel input, #inputPanel select').forEach((el) => {
      el.addEventListener('input', recalc);
      el.addEventListener('change', () => {
        if (el.id === 'exitMethod') applyExitVisibility();
        recalc();
      });
    });
    // Amortization panel controls (horizon dropdown + appreciation rate)
    ['amortYears', 'apprRate'].forEach((id) => {
      const el = $(id);
      if (el) {
        el.addEventListener('input', recalc);
        el.addEventListener('change', recalc);
      }
    });
  }

  function attachDetailToggle() {
    const btn = $('detailToggle');
    const panel = $('detailPanel');
    btn.addEventListener('click', () => {
      const open = panel.classList.toggle('open');
      btn.textContent = open ? 'Hide Full Analysis Detail ▴' : 'Show Full Analysis Detail ▾';
    });
    const abtn = $('amortToggle');
    const apanel = $('amortPanel');
    if (abtn && apanel) {
      abtn.addEventListener('click', () => {
        const open = apanel.classList.toggle('open');
        abtn.textContent = open ? 'Hide Year-by-Year Amortization Schedule ▴' : 'Show Year-by-Year Amortization Schedule ▾';
      });
    }
  }

  // Global no-op so shared/export.js "calculate()" hook doesn't error
  window.calculate = recalc;

  // ─── Init ──────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    attachCurrency();
    attachModeTabs();
    attachInputListeners();
    attachDetailToggle();
    applyModeVisibility();
    applyExitVisibility();
    recalc();

    // Learn Mode payload
    window.LEARN_DATA = {
      tooltips: {
        purchasePrice: '<strong>Purchase Price (PSA)</strong> — The contract price from the Purchase &amp; Sale Agreement. Anchors the entire capital stack. Every leg (existing lien, new loan, seller carry, buyer cash) must sum to this number.',
        existingBal: '<strong>Existing Mortgage Balance</strong> — Payoff amount on the seller\u2019s current loan that will remain in place under Sub-To. Verify via a written payoff statement from the seller\u2019s servicer; do not rely on the seller\u2019s memory.',
        existingRate: '<strong>Existing Mortgage Rate</strong> — Interest rate on the loan that stays in place. This is the primary reason Sub-To works: locking in a low legacy rate that would be unavailable today.',
        existingRemainingTerm: '<strong>Existing Mortgage Remaining Term</strong> — Years remaining on the original amortization. Determines annual debt service and how quickly the buyer\u2019s equity grows from principal paydown.',
        firstLoanAmt: '<strong>New 1st-Position Loan</strong> — A new institutional loan (DSCR, hard money, or seller-carry) sitting in first-lien position. In pure Sub-To, this is $0. In Seller Finance mode, this is typically the seller-carry amount. In Hybrid it is a stacked new loan.',
        firstLoanLTVCap: '<strong>1st-Position LTV Cap</strong> — Maximum loan-to-value the lender will underwrite. DSCR lenders typically cap at 75–80% of purchase or ARV. Exceeding this cap is a structural non-starter.',
        tfAmount: '<strong>Transactional Funding</strong> — Same-day bridge capital used to fund a wet-close A-B leg in a double-close creative-finance transaction. Repaid the same day from the B-C leg proceeds. Fee is a real cost of capital.',
        tfFee: '<strong>Transactional Fee</strong> — The transactional lender\u2019s fee, typically 1.5–3% of face amount. Even at 2.5% on a $300K bridge, that\u2019s $7,500 out of the deal — factor it into buyer out-of-pocket.',
        escrow: '<strong>Escrow / Reserves</strong> — Cash into escrow at closing for tax and insurance reserves, plus any seller catch-up (delinquent taxes, past-due HOA). Required by most title companies.',
        buyerCC: '<strong>Buyer Closing Costs</strong> — All buyer-side closing costs: title insurance, recording fees, attorney, inspection, appraisal. Typical range: 1.5–3% of purchase price.',
        thirdParty: '<strong>3rd-Party Fees</strong> — Appraisal, doc prep, notary, wire, courier. Small individually but sum to $1,500–$3,000 on most deals.',
        sellerFinAmt: '<strong>Seller Financing Amount</strong> — Auto-calculated as Purchase Price minus (Existing Mortgage + New 1st + Transactional + Cash to Seller). This is the plug that balances the stack. If negative, the buyer is overfunded and needs to reduce sources.',
        sellerNoteTerm: '<strong>Seller Note Term</strong> — Length of the seller-carry note in years. Longer terms lower monthly debt service but extend seller exposure to buyer default risk.',
        sellerNoteRate: '<strong>Seller Note Interest Rate</strong> — Annual interest rate on the seller-carry note. Typical creative-finance rates: 5–8%. Higher rates protect seller against inflation; lower rates make deals feasible.',
        sellerNoteAmort: '<strong>Seller Note Amortization</strong> — Interest-only (I/O) minimizes monthly payment; Amortized creates principal paydown; Balloon combines low monthly with a lump-sum payoff. Balloon structures require a refinance plan.',
        balloonYear: '<strong>Balloon Year</strong> — Year the balloon payoff is due (only if amortization = Balloon). Must align with your realistic refinance timeline. A 3-year balloon in a rising-rate environment is high-risk.',
        cashToSeller: '<strong>Cash to Seller at Close</strong> — Down payment paid to seller at closing. Reduces the seller carry (Leg 2). Sellers often demand $5K–$50K at close to cover their own moving costs and back taxes.',
        grossRent: '<strong>Gross Monthly Rent</strong> — Total rental income at full occupancy. Use market rent for comparable properties, not seller\u2019s pro forma.',
        occupancy: '<strong>Occupancy</strong> — Occupancy percentage (100 − vacancy). Typical: 92–95%. Conservative underwriting uses 90%.',
        opexPct: '<strong>Operating Expenses</strong> — Total OpEx as a percentage of Effective Gross Income (EGI). Includes taxes, insurance, repairs, management, utilities, CapEx reserve. Class B/C rentals average 40–50%.',
        exitMethod: '<strong>Exit Method</strong> — Residential exit uses comp-based ARV (typical for 1–4 unit). Commercial exit uses NOI ÷ cap rate (5+ units or commercial DSCR refinance).',
        exitLTV: '<strong>Exit LTV Cap</strong> — LTV the exit lender will underwrite. Residential DSCR: 75%. Commercial: 65–70%. Conservative underwriting: 70%.',
        exitCompPrice: '<strong>Exit Comp Sale Price</strong> — Projected residential comp sale value at exit year. Anchor to a specific ZIP-code comp set, not seller optimism.',
        exitNOI: '<strong>Exit Year NOI</strong> — Stabilized NOI at exit (commercial only). Reflects post-improvement rent bumps and expense reductions.',
        exitCapRate: '<strong>Exit Cap Rate</strong> — Market cap rate at exit (commercial only). Use current-year comps from CoStar, Crexi, or broker-of-record data. Cap rates expand in rising-rate environments.',
      },
      concepts: [
        {
          heading: 'Capital Stack (Leg 1 / Leg 2)',
          body: 'Every creative-finance deal has a senior debt position (Leg 1) and often a junior debt position (Leg 2). In Sub-To, Leg 1 = existing lien. In Seller Finance, Leg 1 = new seller-carry note. Hybrid stacks both. The Capital Stack Structurer visualizes the flow so you can see whether it balances — sources of funds must equal uses of funds at the closing table.'
        },
        {
          heading: 'DSCR (Debt Service Coverage Ratio)',
          body: 'Net Operating Income divided by total annual debt service. A DSCR of 1.25x means NOI is 125% of debt service — the industry-standard institutional threshold. Below 1.0 means the property loses money every month. Between 1.0 and 1.25 means it survives but any lender refi will require improvement.'
        },
        {
          heading: 'House of Cards Risk',
          body: 'A structure is fragile when combined leverage exceeds property value, cash-flow is negative, or the buyer extracts excessive cash at close. If rents drop or a senior lien is called (due-on-sale), the entire stack can collapse. This tool flags fragile structures — it does not endorse them.'
        },
        {
          heading: 'Due-on-Sale Risk (Sub-To)',
          body: 'Most mortgages contain a due-on-sale clause allowing the lender to demand full payoff when title transfers. Sub-To relies on either (a) the lender not noticing the transfer, or (b) placing title in a land trust to avoid triggering. Educational note: this is not a legal opinion — consult a real estate attorney in your state.'
        }
      ],
      source: 'Field definitions and structural thresholds from IntelliTC Solutions internal creative-finance canon (1,604-term glossary). Structural flags reference standard institutional DSCR underwriting thresholds and NAR/AAPL creative-finance guidelines.'
    };
  });
})();
