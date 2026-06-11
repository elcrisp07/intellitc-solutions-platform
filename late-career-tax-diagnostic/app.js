/* ============================================================
   Late-Career Tax Diagnostic
   IntelliTC Solutions — Hidden Gem #12
   "The High Cost of Working Past 60" — diagnostic toolkit
   Values current as of June 2026.
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

/* ============================================================
   TAX-YEAR CONSTANTS
   2026 baseline (per IRS Rev. Proc. projections, CMS Trustees,
   SECURE 2.0 Act, and Tax Relief for American Families Act).
   Projected years apply ~2.6% annual indexing where applicable.
   Senior Bonus Deduction sunsets after 2028 by current law.
   ============================================================ */
const TAX_CONSTANTS = {
  2026: {
    stdDeduction:    { mfj: 30000, single: 15000 },
    seniorAddOn:     { mfj: 1300,  single: 1650 }, // per qualifying filer 65+
    seniorBonus:     { perFiler: 6000, phaseStart: 150000, phaseEnd: 175000, sunset: false },
    irmaaTier1:      { mfj: 218000, single: 109000 },
    irmaaAnnualByTier: [0, 1100, 2750, 4400, 6050, 6600], // single-person annual surcharge, all Parts B+D
    // Provisional-income thresholds for SS taxation (IRC §86) — never indexed since 1983/1993
    ssLowerThresh:   { mfj: 32000, single: 25000 },
    ssUpperThresh:   { mfj: 44000, single: 34000 },
    // Marginal brackets (MFJ shown; single is roughly half on most edges)
    mfjBrackets: [
      { rate: 0.10, top: 23850 },
      { rate: 0.12, top: 96950 },
      { rate: 0.22, top: 206700 },
      { rate: 0.24, top: 394600 },
      { rate: 0.32, top: 501050 },
      { rate: 0.35, top: 751600 },
      { rate: 0.37, top: Infinity }
    ],
    singleBrackets: [
      { rate: 0.10, top: 11925 },
      { rate: 0.12, top: 48475 },
      { rate: 0.22, top: 103350 },
      { rate: 0.24, top: 197300 },
      { rate: 0.32, top: 250525 },
      { rate: 0.35, top: 626350 },
      { rate: 0.37, top: Infinity }
    ],
    rothCatchUpTrigger: 150000, // SECURE 2.0 §603 — indexed; was $145K base in 2024
    label: "2026"
  }
};
// Build projected years with ~2.6% indexing (brackets, IRMAA, std deduction)
function projectYear(baseYear, targetYear){
  const base = TAX_CONSTANTS[baseYear];
  const yrs = targetYear - baseYear;
  const f = Math.pow(1.026, yrs);
  return {
    stdDeduction: { mfj: Math.round(base.stdDeduction.mfj * f), single: Math.round(base.stdDeduction.single * f) },
    seniorAddOn:  { mfj: Math.round(base.seniorAddOn.mfj * f), single: Math.round(base.seniorAddOn.single * f) },
    // Senior Bonus Deduction expires after 2028 by current law
    seniorBonus:  { perFiler: targetYear <= 2028 ? base.seniorBonus.perFiler : 0,
                    phaseStart: Math.round(base.seniorBonus.phaseStart * f),
                    phaseEnd: Math.round(base.seniorBonus.phaseEnd * f),
                    sunset: targetYear > 2028 },
    irmaaTier1:   { mfj: Math.round(base.irmaaTier1.mfj * f), single: Math.round(base.irmaaTier1.single * f) },
    irmaaAnnualByTier: base.irmaaAnnualByTier.map(v => Math.round(v * f)),
    // SS thresholds are NEVER indexed by statute (IRC §86)
    ssLowerThresh: base.ssLowerThresh,
    ssUpperThresh: base.ssUpperThresh,
    mfjBrackets: base.mfjBrackets.map(b => ({ rate: b.rate, top: b.top === Infinity ? Infinity : Math.round(b.top * f) })),
    singleBrackets: base.singleBrackets.map(b => ({ rate: b.rate, top: b.top === Infinity ? Infinity : Math.round(b.top * f) })),
    rothCatchUpTrigger: Math.round(base.rothCatchUpTrigger * f),
    label: String(targetYear) + " (projected)"
  };
}
function getTaxYearConstants(year){
  year = parseInt(year, 10);
  if (TAX_CONSTANTS[year]) return TAX_CONSTANTS[year];
  return projectYear(2026, year);
}

/* ---- Federal income tax (progressive) ---- */
function federalTax(taxableIncome, brackets){
  if (taxableIncome <= 0) return 0;
  let tax = 0, prev = 0;
  for (const b of brackets){
    if (taxableIncome > b.top){
      tax += (b.top - prev) * b.rate;
      prev = b.top;
    } else {
      tax += (taxableIncome - prev) * b.rate;
      return tax;
    }
  }
  return tax;
}
/* Find the marginal bracket for a given taxable income */
function marginalBracket(taxableIncome, brackets){
  for (const b of brackets) if (taxableIncome <= b.top) return b.rate;
  return brackets[brackets.length-1].rate;
}

/* ---- SS Tax Torpedo (provisional income method, IRC §86) ---- */
function ssTaxable(ssBenefit, otherTaxableIncome, taxExemptInterest, filingStatus, K){
  if (ssBenefit <= 0) return { taxable: 0, zone: '0%', provisional: 0 };
  const lower = K.ssLowerThresh[filingStatus];
  const upper = K.ssUpperThresh[filingStatus];
  const provisional = otherTaxableIncome + taxExemptInterest + 0.5 * ssBenefit;
  let taxable = 0, zone = '0%';
  if (provisional <= lower){
    taxable = 0; zone = '0%';
  } else if (provisional <= upper){
    taxable = Math.min(0.5 * ssBenefit, 0.5 * (provisional - lower));
    zone = '50%';
  } else {
    const base50 = Math.min(0.5 * (upper - lower), 0.5 * ssBenefit);
    const extra85 = 0.85 * (provisional - upper);
    taxable = Math.min(0.85 * ssBenefit, base50 + extra85);
    zone = '85%';
  }
  return { taxable: Math.max(0, taxable), zone, provisional };
}

/* ---- IRMAA tier from MAGI ---- */
function irmaaTier(magi, filingStatus, K){
  const t1 = K.irmaaTier1[filingStatus];
  // Tier widths roughly: t1, +$56K, +$68K, +$68K, +$340K (mfj). Halve for single.
  const widths = filingStatus === 'mfj' ? [56000, 68000, 68000, 340000] : [28000, 34000, 34000, 170000];
  if (magi <= t1) return 0;
  let edge = t1, tier = 1;
  for (const w of widths){
    if (magi <= edge + w) return tier;
    edge += w; tier += 1;
  }
  return 5;
}

/* ---- ACA subsidy (simplified ARPA/IRA framework) ---- */
function acaSubsidy(magi, householdSize, premiumAnnual){
  // 2026 FPL approx: 1 person ~$15,650; 2 ~$21,150; 3 ~$26,650
  const fpl = householdSize === 1 ? 15650 : householdSize === 2 ? 21150 : (15650 + (householdSize - 1) * 5500);
  const fplPct = magi / fpl;
  // Applicable contribution %: 0% up to 150% FPL, scaling to 8.5% at 400%+
  // (Reflects extended IRA framework; baseline ACA without enhancements caps subsidy at 400% — kept 8.5% cap for 2026.)
  let contribPct;
  if (fplPct <= 1.5) contribPct = 0;
  else if (fplPct <= 2.0) contribPct = 0.02;
  else if (fplPct <= 2.5) contribPct = 0.04;
  else if (fplPct <= 3.0) contribPct = 0.06;
  else if (fplPct <= 4.0) contribPct = 0.085;
  else contribPct = 1.0; // no subsidy above 400% FPL in baseline 2026 absent extension
  const expectedContrib = magi * contribPct;
  const subsidy = Math.max(0, premiumAnnual - expectedContrib);
  return { subsidy, fplPct: fplPct * 100, contribPct: contribPct * 100 };
}

/* ============================================================
   MAIN CALCULATION
   Mode-dispatched after computing the shared diagnostic engine.
   ============================================================ */
let CURRENT_MODE = 'diagnose';

/* Mode tab handlers — switch which result section is visible
   AND swap header copy + descriptor for the input panel */
const modeDescriptions = {
  diagnose:  "<strong>Diagnose:</strong> compute the Real Net Value of one more working year after federal tax, FICA, the SS Tax Torpedo, IRMAA surcharge, lost ACA subsidy, lost Roth gap-year conversion, and the Senior Bonus Deduction you may be phasing out.",
  optimize:  "<strong>Optimize:</strong> build a gap-year Roth conversion ladder from exit through age 72, sized to stay inside the 12% federal bracket. See the cumulative Roth basis you would build and the tax saved vs. deferring into RMD years.",
  timing:    "<strong>Time the Exit:</strong> compare three sequencing strategies — Age 62 Early Exit, 62-70 Gap Conversion, and Work-to-70 — across lifetime after-tax income through age 90."
};
document.querySelectorAll('.mode-tab').forEach(tab => {
  tab.addEventListener('click', function(){
    document.querySelectorAll('.mode-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    this.classList.add('active'); this.setAttribute('aria-selected', 'true');
    CURRENT_MODE = this.getAttribute('data-mode');
    document.getElementById('modeTabDesc').innerHTML = modeDescriptions[CURRENT_MODE];
    // If we have results showing, swap section visibility
    document.querySelectorAll('.mode-section').forEach(sec => {
      sec.style.display = sec.getAttribute('data-section') === CURRENT_MODE ? '' : 'none';
    });
    // Update results title
    const titles = { diagnose:'Late-Career Tax Diagnostic — Diagnose', optimize:'Late-Career Tax Diagnostic — Optimize', timing:'Late-Career Tax Diagnostic — Time the Exit' };
    const rt = document.getElementById('resultsTitle'); if (rt) rt.textContent = titles[CURRENT_MODE];
  });
});

function calculate(){
  // ───── Read inputs ─────
  const taxYear = document.getElementById('taxYear').value;
  const K = getTaxYearConstants(taxYear);

  const filingStatus = document.getElementById('filingStatus').value; // 'mfj' or 'single'
  const isMFJ = filingStatus === 'mfj';

  const myAge = parseNum(document.getElementById('currentAge').value);
  const spouseAge = parseNum(document.getElementById('spouseAge').value);
  const fra = parseNum(document.getElementById('fraAge').value);

  const mySalary = parseNum(document.getElementById('currentSalary').value);
  const spouseSalary = parseNum(document.getElementById('spouseSalary').value);
  const otherIncome = parseNum(document.getElementById('otherIncome').value);
  const cgIncome = parseNum(document.getElementById('capGainsIncome').value);

  const ssPIA = parseNum(document.getElementById('ssPIA').value); // monthly
  const spouseSSPIA = parseNum(document.getElementById('spouseSSPIA').value);
  const ssCollecting = document.getElementById('ssCollecting').value;
  const claimAge = parseNum(document.getElementById('ssClaimAge').value);

  const tradBalance = parseNum(document.getElementById('tradBalance').value);
  const rothBalance = parseNum(document.getElementById('rothBalance').value);
  const taxableBalance = parseNum(document.getElementById('taxableBalance').value);
  const retSpend = parseNum(document.getElementById('retSpendNeed').value);

  const healthSource = document.getElementById('healthSource').value;
  const acaPremMonthly = parseNum(document.getElementById('acaPremiumGross').value);
  const catchUp = parseNum(document.getElementById('catchUpAmount').value);
  const peakRate = parseNum(document.getElementById('topBracket').value) / 100;

  const brackets = isMFJ ? K.mfjBrackets : K.singleBrackets;
  const stdDed = isMFJ ? K.stdDeduction.mfj : K.stdDeduction.single;
  const householdSize = isMFJ ? 2 : 1;

  // ───── Build current-year (working) tax picture ─────
  const totalWages = mySalary + spouseSalary;
  const annualSSMine = (ssCollecting !== 'no') ? ssPIA * 12 : 0;
  const annualSSSpouse = (ssCollecting !== 'no') ? spouseSSPIA * 12 : 0;
  const annualSSCombined = annualSSMine + annualSSSpouse;

  // Provisional income for SS torpedo
  const otherTaxable = totalWages + otherIncome + cgIncome; // (cg is in MAGI)
  const tor = ssTaxable(annualSSCombined, otherTaxable, 0, filingStatus, K);

  // AGI = wages + other ord + CG + taxable SS
  const agi = totalWages + otherIncome + cgIncome + tor.taxable;
  // MAGI for IRMAA = AGI + tax-exempt interest (none modeled)
  const magi = agi;

  // Senior Bonus Deduction eligibility (65+ filers; couple if both 65+)
  const myEligible = myAge >= 65;
  const spouseEligible = isMFJ && spouseAge >= 65;
  const seniorBonusGross = K.seniorBonus.perFiler * ((myEligible?1:0) + (spouseEligible?1:0));
  // Phase-out (linear across phaseStart to phaseEnd by MAGI)
  let seniorBonus = seniorBonusGross;
  if (magi > K.seniorBonus.phaseStart && K.seniorBonus.phaseEnd > K.seniorBonus.phaseStart){
    const t = Math.min(1, (magi - K.seniorBonus.phaseStart) / (K.seniorBonus.phaseEnd - K.seniorBonus.phaseStart));
    seniorBonus = seniorBonusGross * (1 - t);
  }
  if (magi > K.seniorBonus.phaseEnd) seniorBonus = 0;
  if (K.seniorBonus.sunset) seniorBonus = 0;

  // Senior add-on standard deduction (age 65+)
  const stdDedAddOn = (isMFJ ? (myEligible?K.seniorAddOn.mfj:0) + (spouseEligible?K.seniorAddOn.mfj:0) : (myEligible?K.seniorAddOn.single:0));

  // Taxable income (ordinary portion)
  // Separate LTCG/QD from ordinary income for proper tax math
  const ordinaryTaxable = Math.max(0, agi - cgIncome - stdDed - stdDedAddOn - seniorBonus);
  const fedOrdinaryTax = federalTax(ordinaryTaxable, brackets);
  // LTCG rate proxy: 0% if ordinary income low, 15% middle, 20% high
  const ltcgRate = ordinaryTaxable < (isMFJ ? 96700 : 48350) ? 0.0 : ordinaryTaxable < (isMFJ ? 600050 : 533400) ? 0.15 : 0.20;
  const fedLTCGTax = cgIncome * ltcgRate;
  const totalFedTax = fedOrdinaryTax + fedLTCGTax;

  // FICA on wages (assumes Social Security wage base $176K-ish in 2026, Medicare uncapped)
  const ssWageBase = 176100 * Math.pow(1.026, parseInt(taxYear,10) - 2026);
  const myFICA_SS = Math.min(mySalary, ssWageBase) * 0.062;
  const spouseFICA_SS = Math.min(spouseSalary, ssWageBase) * 0.062;
  const ficaMedicare = (totalWages) * 0.0145;
  const totalFICA = myFICA_SS + spouseFICA_SS + ficaMedicare;

  // IRMAA in 2 years (today's MAGI determines premium in year+2)
  const irTier = irmaaTier(magi, filingStatus, K);
  const irmaaAnnual = K.irmaaAnnualByTier[irTier] * (isMFJ ? 2 : 1);

  // ACA subsidy lost (only if pre-65 and household uses ACA — but we model the COUNTERFACTUAL)
  const myMonthsToMedicare = Math.max(0, (65 - myAge) * 12);
  const spouseMonthsToMedicare = isMFJ ? Math.max(0, (65 - spouseAge) * 12) : 0;
  const acaApplicable = myAge < 65 || (isMFJ && spouseAge < 65);
  // Counterfactual: if user retired, MAGI would drop to retirement income only
  const counterfactualMAGI = otherIncome + cgIncome + (annualSSCombined * 0.5); // rough — no torpedo when low
  const acaUnsubsidized = acaPremMonthly * 12;
  const acaRetire = acaApplicable && acaPremMonthly > 0 ? acaSubsidy(counterfactualMAGI, householdSize, acaUnsubsidized).subsidy : 0;
  const acaWorking = acaApplicable && acaPremMonthly > 0 ? acaSubsidy(magi, householdSize, acaUnsubsidized).subsidy : 0;
  const acaLost = Math.max(0, acaRetire - acaWorking);

  // Lost Roth Gap Space — convert at 12% if exited; convert today at peakRate
  // Headroom inside the 12% bracket = bracket top - (other income + std deduction subtraction inverted)
  const twelveTop = isMFJ ? K.mfjBrackets[1].top : K.singleBrackets[1].top;
  const stdAfterExit = stdDed + stdDedAddOn; // exit-year std (assume same)
  // Post-exit headroom: bracket top stays nominal; income comes only from otherIncome + CG (no wages)
  const postExitOrdIncome = otherIncome; // CG separate
  const rothHeadroomYr = Math.max(0, twelveTop - Math.max(0, postExitOrdIncome - stdAfterExit));
  // Lost premium per dollar of conversion if forced at peakRate instead of 12% gap-year rate
  const rothRateGap = peakRate - 0.12;
  const lostRothPremium = Math.max(0, rothRateGap) * rothHeadroomYr;

  // Forced-Roth catch-up premium (SECURE 2.0 §603 — applies only if prior-year wages > $150K)
  const subjectToForcedRoth = mySalary > K.rothCatchUpTrigger;
  const forcedRothPremium = subjectToForcedRoth ? Math.max(0, peakRate - 0.12) * catchUp : 0;

  // Real Net Value of One More Year (per the user's salary, isolating from spouse)
  // Marginal federal tax on MY salary alone
  const baselineForMyWage = ordinaryTaxable - mySalary; // baseline if I retired
  const taxIfRetired = federalTax(Math.max(0, baselineForMyWage), brackets);
  const myMarginalFedTax = Math.max(0, fedOrdinaryTax - taxIfRetired);

  // SS Torpedo cost attributable to my wage: difference in taxed-SS between with-wage and without-wage scenarios
  const torNoWage = ssTaxable(annualSSCombined, otherIncome + cgIncome + spouseSalary, 0, filingStatus, K);
  const ssDeltaTaxable = Math.max(0, tor.taxable - torNoWage.taxable);
  const ssTorpedoCost = ssDeltaTaxable * peakRate;

  // IRMAA delta from working: compare tier without my wage
  const magiNoMe = (otherIncome + cgIncome + spouseSalary + torNoWage.taxable);
  const irTierNoMe = irmaaTier(magiNoMe, filingStatus, K);
  const irmaaDelta = (K.irmaaAnnualByTier[irTier] - K.irmaaAnnualByTier[irTierNoMe]) * (isMFJ ? 2 : 1);

  // Senior Bonus loss attributable to working
  const seniorBonusFullEligible = seniorBonusGross;
  const seniorBonusValueWorking = seniorBonus * peakRate; // tax savings actually realized
  // Counterfactual (no my-wage) phase-out
  let counterBonus = seniorBonusGross;
  const counterMagi = magi - mySalary;
  if (counterMagi > K.seniorBonus.phaseStart && K.seniorBonus.phaseEnd > K.seniorBonus.phaseStart){
    const t = Math.min(1, (counterMagi - K.seniorBonus.phaseStart) / (K.seniorBonus.phaseEnd - K.seniorBonus.phaseStart));
    counterBonus = seniorBonusGross * (1 - t);
  }
  if (counterMagi > K.seniorBonus.phaseEnd) counterBonus = 0;
  if (K.seniorBonus.sunset) counterBonus = 0;
  const seniorBonusLost = Math.max(0, counterBonus - seniorBonus) * peakRate;

  // Build the waterfall (per "+1 year of working at salary")
  const gross = mySalary;
  const wfFed = -myMarginalFedTax;
  const wfFICA = -(myFICA_SS + mySalary * 0.0145);
  const wfTorpedo = -ssTorpedoCost;
  const wfIRMAA = -irmaaDelta;
  const wfACA = -acaLost;
  const wfRoth = -lostRothPremium;
  const wfForcedRoth = -forcedRothPremium;
  const wfSeniorBonus = -seniorBonusLost;
  const realNet = gross + wfFed + wfFICA + wfTorpedo + wfIRMAA + wfACA + wfRoth + wfForcedRoth + wfSeniorBonus;

  // Effective marginal rate
  const totalSubtractions = -(wfFed + wfFICA + wfTorpedo + wfIRMAA + wfACA + wfRoth + wfForcedRoth + wfSeniorBonus);
  const trueMarginalRate = gross > 0 ? (totalSubtractions / gross) * 100 : 0;
  const statedMarginalRate = peakRate * 100;

  // ───── POPULATE 4 HEADLINE KPIs ─────
  const kpiNet = document.getElementById('kpiRealNet');
  kpiNet.textContent = formatCurrencyFull(realNet);
  kpiNet.className = 'kpi-value ' + (realNet > gross * 0.55 ? 'kpi-positive' : realNet > gross * 0.4 ? '' : 'kpi-negative');
  document.getElementById('kpiRealNetDetail').textContent = formatPct((realNet/Math.max(1,gross))*100) + ' of gross · true marginal ' + formatPct(trueMarginalRate);

  const kpiT = document.getElementById('kpiTorpedo');
  kpiT.textContent = tor.zone;
  kpiT.className = 'kpi-value ' + (tor.zone === '85%' ? 'kpi-negative' : tor.zone === '50%' ? '' : 'kpi-positive');
  document.getElementById('kpiTorpedoDetail').textContent = 'Provisional ' + formatCurrencyFull(tor.provisional) + ' · thresholds $' + K.ssLowerThresh[filingStatus]/1000 + 'K / $' + K.ssUpperThresh[filingStatus]/1000 + 'K';

  const kpiI = document.getElementById('kpiIRMAA');
  kpiI.textContent = formatCurrencyFull(irmaaAnnual);
  kpiI.className = 'kpi-value ' + (irTier === 0 ? 'kpi-positive' : irTier >= 3 ? 'kpi-negative' : '');
  document.getElementById('kpiIRMAADetail').textContent = irTier === 0 ? 'Below tier 1 threshold' : 'Tier ' + irTier + ' · paid in ' + (parseInt(taxYear,10)+2);

  const kpiR = document.getElementById('kpiRothSpace');
  kpiR.textContent = formatCurrencyFull(rothHeadroomYr);
  kpiR.className = 'kpi-value ' + (rothHeadroomYr > 50000 ? 'kpi-positive' : '');
  document.getElementById('kpiRothSpaceDetail').textContent = 'Each gap year · 12% bracket top ' + formatCurrency(twelveTop);

  // ───── VERDICT CARD ─────
  const netPct = (realNet / Math.max(1,gross)) * 100;
  let headline = '';
  let explainer = '';
  if (netPct >= 70){
    headline = formatPct(netPct) + ' of gross — working +1 year still puts real money in the household.';
    explainer = 'No torpedo, no IRMAA cliff, and gap-year Roth opportunity is modest. The standard wage-vs-retirement math applies. Senior Bonus and ACA aren\'t major levers at this income.';
  } else if (netPct >= 50){
    headline = formatPct(netPct) + ' of gross — the wage is leaking about half through hidden mechanisms.';
    explainer = 'The combination of marginal federal, FICA-with-no-future-SS, partial torpedo, IRMAA tier, and lost Roth conversion space is meaningfully eroding the year. Worth pricing against a delayed-claim + gap-year-conversion alternative.';
  } else {
    headline = 'Only ' + formatPct(netPct) + ' of gross actually nets — this year is mostly tax.';
    explainer = 'You are deep in the 85% SS torpedo zone, paying an IRMAA tier, losing ACA subsidy (if pre-65), forfeiting the 12%-bracket Roth window, and likely phasing out the Senior Bonus Deduction. The retirement-and-convert scenario almost certainly wins on lifetime after-tax dollars.';
  }
  document.getElementById('verdictHeadline').textContent = headline;
  document.getElementById('verdictExplainer').textContent = explainer;

  // ───── DIAGNOSE: Waterfall body ─────
  const wfRows = [
    { label: 'Gross Salary',                                 amt: gross,            note: 'Headline annual wage; the starting line of the diagnosis.' },
    { label: 'Federal Income Tax (marginal)',                amt: wfFed,            note: 'Tax on this wage stacked on top of household other income at the ' + formatPct(statedMarginalRate) + ' bracket.' },
    { label: 'FICA (no future SS benefit)',                  amt: wfFICA,           note: '6.2% SS + 1.45% Medicare. SS portion buys no new benefit once top-35 years are locked.' },
    { label: 'Social Security Tax Torpedo',                  amt: wfTorpedo,        note: tor.zone === '0%' ? 'Not in the torpedo zone at current provisional income.' : 'Additional federal tax on ' + formatCurrencyFull(ssDeltaTaxable) + ' of SS pulled into ordinary income by this wage.' },
    { label: 'IRMAA Surcharge (paid in ' + (parseInt(taxYear,10)+2) + ')', amt: wfIRMAA, note: irTier === 0 ? 'Below IRMAA tier 1; no surcharge.' : 'Tier ' + irTier + ' surcharge difference vs. retired counterfactual.' },
    { label: 'Lost ACA Subsidy (pre-65)',                    amt: wfACA,            note: acaLost > 0 ? 'Premium credit you would have received if MAGI dropped to retirement levels.' : (acaApplicable ? 'No subsidy at this MAGI in either scenario.' : 'Not pre-65 / not on ACA — not applicable.') },
    { label: 'Lost Gap-Year Roth (rate spread)',             amt: wfRoth,           note: rothRateGap > 0 ? formatPct(rothRateGap*100) + ' rate spread on ' + formatCurrencyFull(rothHeadroomYr) + ' of conversion you could have done at 12% in a gap year.' : 'Peak rate already at or below 12%; no spread.' },
    { label: 'Forced-Roth Catch-Up Premium',                 amt: wfForcedRoth,     note: subjectToForcedRoth ? 'SECURE 2.0 §603: catch-up forced to Roth at peak rate (' + formatPct(statedMarginalRate) + ') instead of 12% in a gap year.' : 'Prior-year wages below the $' + (K.rothCatchUpTrigger/1000).toFixed(0) + 'K trigger — not forced.' },
    { label: 'Lost Senior Bonus Deduction',                  amt: wfSeniorBonus,    note: K.seniorBonus.sunset ? 'Senior Bonus Deduction has sunset for this tax year.' : (myAge >= 65 || (isMFJ && spouseAge >= 65)) ? 'Phase-out from the wage costs you tax benefit at ' + formatPct(statedMarginalRate) + ' on the lost deduction.' : 'Not yet 65 — deduction not yet available.' }
  ];
  let wfHTML = '';
  for (const r of wfRows){
    const cls = r.amt > 0 ? 'wf-pos' : r.amt < 0 ? 'wf-neg' : '';
    wfHTML += '<div class="wf-row"><div class="wf-label">' + r.label + '<small>' + r.note + '</small></div><div class="wf-amount ' + cls + '">' + formatCurrencyFull(r.amt) + '</div><div class="wf-note">' + (Math.abs(r.amt) > 0 ? formatPct(Math.abs(r.amt)/gross*100) + ' of gross' : '—') + '</div></div>';
  }
  wfHTML += '<div class="wf-row wf-total"><div class="wf-label">Real Net Value of One More Year<small>What this year actually adds to the household balance sheet</small></div><div class="wf-amount wf-total-val">' + formatCurrencyFull(realNet) + '</div><div class="wf-note">' + formatPct(netPct) + ' of gross</div></div>';
  document.getElementById('wfBody').innerHTML = wfHTML;

  // ───── DIAGNOSE: Mechanism Grid (7 cards) ─────
  const mech = [
    { title: 'Wage Trap',           value: formatCurrencyFull(myFICA_SS + mySalary * 0.0145), detail: 'FICA dollars buying zero future SS (' + formatPct(7.65) + ' on $' + (mySalary/1000).toFixed(0) + 'K)' },
    { title: 'SS Tax Torpedo',      value: tor.zone, detail: tor.zone === '0%' ? 'Below $' + (K.ssLowerThresh[filingStatus]/1000) + 'K provisional' : formatCurrencyFull(ssDeltaTaxable) + ' SS pulled into income' },
    { title: 'IRMAA Lookback',      value: irTier === 0 ? '$0' : 'Tier ' + irTier, detail: irTier === 0 ? 'Below first tier' : formatCurrencyFull(irmaaAnnual) + '/yr in ' + (parseInt(taxYear,10)+2) },
    { title: 'Lost Roth Gap Years', value: formatCurrencyFull(lostRothPremium), detail: 'Rate spread × ' + formatCurrency(rothHeadroomYr) + ' headroom' },
    { title: 'ACA Subsidy Bridge',  value: acaApplicable ? formatCurrencyFull(acaLost) : '—', detail: acaApplicable ? (acaLost > 0 ? 'Pre-65 subsidy forfeited' : 'No subsidy gap at this MAGI') : 'Both 65+ — Medicare path' },
    { title: 'Senior Bonus',        value: K.seniorBonus.sunset ? 'Sunset' : formatCurrencyFull(seniorBonus), detail: K.seniorBonus.sunset ? 'Expired after 2028' : (seniorBonus < seniorBonusGross ? 'Phased ' + formatPct((1-seniorBonus/Math.max(1,seniorBonusGross))*100) + ' out' : 'Full deduction in reach') },
    { title: 'Forced Roth Catch-Up',value: formatCurrencyFull(forcedRothPremium), detail: subjectToForcedRoth ? formatPct((peakRate-0.12)*100) + ' premium on $' + (catchUp/1000).toFixed(1) + 'K catch-up' : 'Not subject (wage below trigger)' }
  ];
  let mechHTML = '';
  for (const m of mech){
    mechHTML += '<div class="mech-card"><p class="mech-card-title">' + m.title + '</p><p class="mech-card-value">' + m.value + '</p><p class="mech-card-detail">' + m.detail + '</p></div>';
  }
  document.getElementById('mechGrid').innerHTML = mechHTML;

  // ───── OPTIMIZE: Roth Ladder Table ─────
  // Build year-by-year from exit (assumed next year) to age 72
  // Exit year: assume user retires at end of THIS tax year
  const exitAge = myAge + 1;
  const ladderEndAge = 72; // last conversion year before age 73 RMDs
  const ladderRows = [];
  let cumulConv = 0, cumulTax = 0, cumulRMDDeferRate = 0.22; // assume 22% in RMD years
  for (let age = exitAge; age <= ladderEndAge; age++){
    const yr = parseInt(taxYear,10) + (age - myAge);
    // Other income excludes wages (retired)
    // After SS claim, add taxable SS (rough — half PIA factor for torpedo)
    const isClaimed = age >= claimAge;
    const claimFactor = claimAge <= 62 ? 0.75 : claimAge >= 70 ? 1.24 : 1 + (claimAge - fra) * 0.08;
    const annualSSPostClaim = isClaimed ? (ssPIA + spouseSSPIA) * 12 * claimFactor : 0;
    const otherInc = otherIncome + (isClaimed ? annualSSPostClaim * 0.85 : 0); // 85% of SS taxable once claimed (worst-case)
    const headroom = Math.max(0, twelveTop - Math.max(0, otherInc - stdDed));
    const blendedTax = headroom * 0.105; // blended 10/12% rate average
    cumulConv += headroom;
    cumulTax += blendedTax;
    ladderRows.push({ year: yr, age, otherInc, headroom, conversion: headroom, tax: blendedTax });
  }
  let rothTBody = '';
  for (const r of ladderRows){
    rothTBody += '<tr><td>' + r.year + '</td><td>' + r.age + '</td><td>' + formatCurrencyFull(r.otherInc) + '</td><td>' + formatCurrencyFull(r.headroom) + '</td><td>' + formatCurrencyFull(r.conversion) + '</td><td>' + formatCurrencyFull(r.tax) + '</td></tr>';
  }
  document.getElementById('rothTableBody').innerHTML = rothTBody;
  const taxSavedVsRMD = cumulConv * (cumulRMDDeferRate - 0.105);
  document.getElementById('rothTableFoot').innerHTML = '<tr><td colspan="4">Cumulative across the gap window</td><td>' + formatCurrencyFull(cumulConv) + '</td><td>' + formatCurrencyFull(cumulTax) + '</td></tr>' +
    '<tr><td colspan="4">Tax saved vs. deferring into 22% RMD-era rates</td><td colspan="2" style="text-align:right">' + formatCurrencyFull(taxSavedVsRMD) + '</td></tr>';

  // ───── TIMING: Three Scenarios ─────
  const lifeEnd = 90;
  function projectTimeline(stratClaimAge, workYears, label, stage){
    const years = lifeEnd - myAge;
    let lifetimeNetIncome = 0, lifetimeSS = 0, lifetimeTax = 0;
    for (let y = 0; y < years; y++){
      const ageAtY = myAge + y;
      const isWorking = y < workYears;
      const isClaimed = ageAtY >= stratClaimAge;
      const claimFactor = stratClaimAge <= 62 ? 0.75 : stratClaimAge >= 70 ? 1.24 : 1 + (stratClaimAge - fra) * 0.08;
      const annualSS = isClaimed ? (ssPIA + spouseSSPIA) * 12 * claimFactor : 0;
      const wage = isWorking ? mySalary + spouseSalary : 0;
      // RMD from trad balance starting age 73 (oversimplified: balance × 1/27 rough divisor)
      const isRMD = ageAtY >= 73;
      const rmd = isRMD ? Math.max(0, tradBalance * Math.pow(1.05, y) * 0.04) : 0;
      const otherInc = otherIncome + rmd;
      const tor2 = ssTaxable(annualSS, wage + otherInc + cgIncome, 0, filingStatus, K);
      const agi2 = wage + otherInc + cgIncome + tor2.taxable;
      const ord2 = Math.max(0, agi2 - cgIncome - stdDed - stdDedAddOn - (ageAtY >= 65 && !K.seniorBonus.sunset ? K.seniorBonus.perFiler * (isMFJ ? 2 : 1) : 0));
      const fedTax2 = federalTax(ord2, brackets);
      const fica2 = isWorking ? (Math.min(wage, ssWageBase) * 0.062 + wage * 0.0145) : 0;
      const irTier2 = ageAtY >= 65 ? irmaaTier(agi2, filingStatus, K) : 0;
      const irmaa2 = K.irmaaAnnualByTier[irTier2] * (isMFJ ? 2 : 1);
      const grossY = wage + annualSS + otherInc;
      const netY = grossY - fedTax2 - fica2 - irmaa2;
      lifetimeNetIncome += netY;
      lifetimeSS += annualSS;
      lifetimeTax += fedTax2 + fica2 + irmaa2;
    }
    return { label, stage, lifetimeNetIncome, lifetimeSS, lifetimeTax, claimAge: stratClaimAge, workYears };
  }

  const earlyExit = projectTimeline(62, Math.max(0, 62 - myAge), 'Age 62 Exit', 'EARLY · STAGE 1');
  const gapConvert = projectTimeline(70, Math.max(0, exitAge - myAge), '62-70 Gap + Delay to 70', 'GAP · STAGE 2');
  const workTo70  = projectTimeline(70, Math.max(0, 70 - myAge), 'Work to 70', 'WORK · STAGE 3');

  const scenarios = [earlyExit, gapConvert, workTo70].sort((a,b) => b.lifetimeNetIncome - a.lifetimeNetIncome);
  const tlWinner = scenarios[0];

  let tlHTML = '';
  for (const s of [earlyExit, gapConvert, workTo70]){
    tlHTML += '<div class="tl-card' + (s.label === tlWinner.label ? ' winner' : '') + '"><p class="tl-stage">' + s.stage + '</p><h4 class="tl-name">' + s.label + '</h4>' +
      '<div class="tl-row"><span>Lifetime Net Income (to 90)</span><strong>' + formatCurrency(s.lifetimeNetIncome) + '</strong></div>' +
      '<div class="tl-row"><span>Lifetime SS Benefit</span><strong>' + formatCurrency(s.lifetimeSS) + '</strong></div>' +
      '<div class="tl-row"><span>Lifetime Federal Tax + IRMAA</span><strong>' + formatCurrency(s.lifetimeTax) + '</strong></div>' +
      '<div class="tl-row"><span>SS Claim Age</span><strong>' + s.claimAge + '</strong></div>' +
      '<div class="tl-row"><span>Years Worked from Now</span><strong>' + s.workYears + '</strong></div>' +
      '</div>';
  }
  document.getElementById('timingGrid').innerHTML = tlHTML;

  // Show only the active mode
  document.querySelectorAll('.mode-section').forEach(sec => {
    sec.style.display = sec.getAttribute('data-section') === CURRENT_MODE ? '' : 'none';
  });
  const titles = { diagnose:'Late-Career Tax Diagnostic — Diagnose', optimize:'Late-Career Tax Diagnostic — Optimize', timing:'Late-Career Tax Diagnostic — Time the Exit' };
  document.getElementById('resultsTitle').textContent = titles[CURRENT_MODE];

  // ============ CHARTS ============
  destroyCharts();
  const cs = getCS();

  // Waterfall (negative bars + final positive net)
  window.__charts.waterfall = new Chart(document.getElementById('chartWaterfall'), {
    type: 'bar',
    data: {
      labels: ['Gross', 'Fed Tax', 'FICA', 'Torpedo', 'IRMAA', 'Lost ACA', 'Lost Roth', 'Forced Roth', 'Lost Sr Bonus', 'Real Net'],
      datasets: [{
        label: 'Dollar Impact',
        data: [gross, wfFed, wfFICA, wfTorpedo, wfIRMAA, wfACA, wfRoth, wfForcedRoth, wfSeniorBonus, realNet],
        backgroundColor: function(ctx){
          const v = ctx.parsed && ctx.parsed.y;
          if (ctx.dataIndex === 0) return cs.c1;
          if (ctx.dataIndex === 9) return cs.c2;
          return v < 0 ? cs.c5 : cs.c4;
        }
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: cs.surface, titleColor: cs.text, bodyColor: cs.text, borderColor: cs.grid, borderWidth: 1,
          callbacks: { label: ctx => formatCurrencyFull(ctx.parsed.y) }
        }
      },
      scales: {
        x: { ticks: { color: cs.text, font: { size: 10 } }, grid: { display: false } },
        y: { ticks: { color: cs.text, callback: v => formatCurrency(v) }, grid: { color: cs.grid } }
      }
    }
  });

  // Effective marginal rate comparison
  window.__charts.effective = new Chart(document.getElementById('chartEffective'), {
    type: 'bar',
    data: {
      labels: ['Stated Bracket', 'True Marginal Rate'],
      datasets: [{
        label: 'Rate (%)',
        data: [statedMarginalRate, trueMarginalRate],
        backgroundColor: [cs.c4, trueMarginalRate >= statedMarginalRate * 1.5 ? cs.c5 : cs.c1]
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: cs.surface, titleColor: cs.text, bodyColor: cs.text, borderColor: cs.grid, borderWidth: 1, callbacks: { label: ctx => ctx.parsed.y.toFixed(1) + '%' } }
      },
      scales: {
        x: { ticks: { color: cs.text }, grid: { display: false } },
        y: { ticks: { color: cs.text, callback: v => v.toFixed(0) + '%' }, grid: { color: cs.grid }, beginAtZero: true }
      }
    }
  });

  // Roth Ladder cumulative
  const cumulLadder = [];
  let running = 0;
  for (const r of ladderRows){ running += r.conversion; cumulLadder.push(running); }
  window.__charts.ladder = new Chart(document.getElementById('chartLadder'), {
    type: 'bar',
    data: {
      labels: ladderRows.map(r => 'Age ' + r.age),
      datasets: [{ label: 'Cumulative Roth Built', data: cumulLadder, backgroundColor: cs.c1 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { backgroundColor: cs.surface, titleColor: cs.text, bodyColor: cs.text, borderColor: cs.grid, borderWidth: 1, callbacks: { label: ctx => formatCurrencyFull(ctx.parsed.y) } } },
      scales: { x: { ticks: { color: cs.text, font:{size:10} }, grid: { display:false } }, y: { ticks: { color: cs.text, callback: v => formatCurrency(v) }, grid: { color: cs.grid } } }
    }
  });

  // Tax saved
  window.__charts.taxsaved = new Chart(document.getElementById('chartTaxSaved'), {
    type: 'bar',
    data: {
      labels: ['Gap-Year Conversion (10.5% blended)', 'Deferred to RMD (22% blended)'],
      datasets: [{ label: 'Tax on $' + (cumulConv/1000).toFixed(0) + 'K Total', data: [cumulTax, cumulConv * 0.22], backgroundColor: [cs.c1, cs.c5] }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { backgroundColor: cs.surface, titleColor: cs.text, bodyColor: cs.text, borderColor: cs.grid, borderWidth: 1, callbacks: { label: ctx => formatCurrencyFull(ctx.parsed.y) } } },
      scales: { x: { ticks: { color: cs.text, font:{size:10} }, grid: { display:false } }, y: { ticks: { color: cs.text, callback: v => formatCurrency(v) }, grid: { color: cs.grid } } }
    }
  });

  // Lifetime net income
  window.__charts.lifetime = new Chart(document.getElementById('chartLifetime'), {
    type: 'bar',
    data: {
      labels: ['Age 62 Exit', '62-70 Gap', 'Work to 70'],
      datasets: [{
        label: 'Lifetime Net Income',
        data: [earlyExit.lifetimeNetIncome, gapConvert.lifetimeNetIncome, workTo70.lifetimeNetIncome],
        backgroundColor: [
          earlyExit.label === tlWinner.label ? cs.c1 : cs.c4,
          gapConvert.label === tlWinner.label ? cs.c1 : cs.c4,
          workTo70.label === tlWinner.label ? cs.c1 : cs.c4
        ]
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { backgroundColor: cs.surface, titleColor: cs.text, bodyColor: cs.text, borderColor: cs.grid, borderWidth: 1, callbacks: { label: ctx => formatCurrency(ctx.parsed.y) } } },
      scales: { x: { ticks: { color: cs.text }, grid: { display:false } }, y: { ticks: { color: cs.text, callback: v => formatCurrency(v) }, grid: { color: cs.grid } } }
    }
  });

  // Cumulative SS
  window.__charts.ss = new Chart(document.getElementById('chartSS'), {
    type: 'bar',
    data: {
      labels: ['Age 62 Exit', '62-70 Gap', 'Work to 70'],
      datasets: [{
        label: 'Lifetime SS to 90',
        data: [earlyExit.lifetimeSS, gapConvert.lifetimeSS, workTo70.lifetimeSS],
        backgroundColor: cs.c2
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { backgroundColor: cs.surface, titleColor: cs.text, bodyColor: cs.text, borderColor: cs.grid, borderWidth: 1, callbacks: { label: ctx => formatCurrency(ctx.parsed.y) } } },
      scales: { x: { ticks: { color: cs.text }, grid: { display:false } }, y: { ticks: { color: cs.text, callback: v => formatCurrency(v) }, grid: { color: cs.grid } } }
    }
  });

  showResults();
}
