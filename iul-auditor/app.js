/* ============================================================
   IUL Auditor — IntelliTC Solutions
   Educational diagnostic of an existing Indexed Universal Life policy.
   Outputs structural findings only — never recommends action.
   ============================================================ */

/* ---- Theme Toggle ---- */
(function(){const toggles=document.querySelectorAll('[data-theme-toggle]'),r=document.documentElement;let d=localStorage.getItem('intellitc-theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');r.setAttribute('data-theme',d);function updateIcon(){const icon=d==='dark'?'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>':'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';toggles.forEach(function(t){t.innerHTML=icon;});}updateIcon();toggles.forEach(function(t){t.addEventListener('click',function(){d=d==='dark'?'light':'dark';r.setAttribute('data-theme',d);localStorage.setItem('intellitc-theme',d);t.setAttribute('aria-label','Switch to '+(d==='dark'?'light':'dark')+' mode');updateIcon();Object.values(window.__charts||{}).forEach(function(c){if(c&&c.update)c.update()});});});})();

/* ---- Utilities ---- */
function parseNum(s){return parseFloat(String(s).replace(/[^0-9.\-]/g,''))||0;}
function formatCurrency(n){if(Math.abs(n)>=1e6)return(n<0?'-':'')+'$'+(Math.abs(n)/1e6).toFixed(2)+'M';if(Math.abs(n)>=1e3)return(n<0?'-':'')+'$'+(Math.abs(n)/1e3).toFixed(0)+'K';return(n<0?'-$':'$')+Math.abs(Math.round(n)).toLocaleString();}
function formatPct(n){return n.toFixed(1)+'%';}
window.__charts={};
function getCS(){const s=getComputedStyle(document.documentElement);return{c1:s.getPropertyValue('--chart-1').trim(),c2:s.getPropertyValue('--chart-2').trim(),c3:s.getPropertyValue('--chart-3').trim(),c4:s.getPropertyValue('--chart-4').trim(),c5:s.getPropertyValue('--chart-5').trim(),c6:s.getPropertyValue('--chart-6').trim(),text:s.getPropertyValue('--color-text-muted').trim(),grid:s.getPropertyValue('--color-divider').trim(),surface:s.getPropertyValue('--color-surface').trim()};}
function destroyCharts(){Object.values(window.__charts).forEach(c=>{if(c&&c.destroy)c.destroy()});window.__charts={};}
function chartOpts(title,type){const cs=getCS();return{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true,labels:{color:cs.text,font:{family:'DM Sans'}}},title:{display:!!title,text:title,color:cs.text,font:{family:'DM Sans',size:14,weight:600}},tooltip:{backgroundColor:cs.surface,titleColor:cs.text,bodyColor:cs.text,borderColor:cs.grid,borderWidth:1}},scales:type==='pie'||type==='doughnut'?undefined:{x:{ticks:{color:cs.text},grid:{color:cs.grid}},y:{ticks:{color:cs.text},grid:{color:cs.grid}}}};}

/* ---- Currency auto-format ---- */
document.querySelectorAll('input[data-currency]').forEach(inp=>{inp.addEventListener('blur',()=>{const v=parseNum(inp.value);if(v)inp.value=Math.round(v).toLocaleString();});});

/* ---- Panel toggle ---- */
const inputPanel=document.getElementById('inputPanel');
const resultsPanel=document.getElementById('resultsPanel');
function showResults(){inputPanel.classList.add('hidden');resultsPanel.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});}
function showInputs(){resultsPanel.classList.add('hidden');inputPanel.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});}
document.querySelectorAll('[data-back]').forEach(b=>b.addEventListener('click',showInputs));

/* ============================================================
   INPUTS — read all fields from the DOM into a single object.
   ============================================================ */
function readInputs(){
  const carrierNote=document.getElementById('carrier').value;
  return {
    // Insured profile
    age: parseNum(document.getElementById('currentAge').value),
    issueAge: parseNum(document.getElementById('issueAge').value),
    yearsInForce: parseNum(document.getElementById('yearsInForce').value),
    rateClass: document.getElementById('rateClass').value,

    // Policy structure
    faceAmount: parseNum(document.getElementById('faceAmount').value),
    dbOption: document.getElementById('dbOption').value,        // 'A'|'B'|'C'
    intent: document.getElementById('intent').value,            // 'accumulation'|'protection'|'hybrid'
    carrier: carrierNote,

    // Funding
    annualPremium: parseNum(document.getElementById('annualPremium').value),
    basePremium: parseNum(document.getElementById('basePremium').value),
    puaPremium: parseNum(document.getElementById('puaPremium').value),
    premiumsPaid: parseNum(document.getElementById('premiumsPaid').value),
    sevenPayLimit: parseNum(document.getElementById('sevenPayLimit').value),
    targetPremium: parseNum(document.getElementById('targetPremium').value),

    // Index strategy (single primary strategy for engine; spec allows expansion later)
    cap: parseNum(document.getElementById('cap').value),
    floor: parseNum(document.getElementById('floor').value),
    participation: parseNum(document.getElementById('participation').value),
    spread: parseNum(document.getElementById('spread').value),
    indexType: document.getElementById('indexType').value,      // 'capped'|'uncapped'|'volcontrol'

    // Current values
    currentCV: parseNum(document.getElementById('currentCV').value),
    currentSV: parseNum(document.getElementById('currentSV').value),
    surrenderYearsLeft: parseNum(document.getElementById('surrenderYearsLeft').value),
    loanBalance: parseNum(document.getElementById('loanBalance').value),

    // Loan structure
    loanType: document.getElementById('loanType').value,        // 'variable'|'fixed'|'wash'|'indexed'|'none'
    loanRate: parseNum(document.getElementById('loanRate').value),
    loanCredit: parseNum(document.getElementById('loanCredit').value),

    // Riders
    overloan: document.getElementById('overloan').value === 'yes',
    chronicLTC: document.getElementById('chronicLTC').value === 'yes',
    lifetimeIncome: document.getElementById('lifetimeIncome').value === 'yes',
    nlgYears: parseNum(document.getElementById('nlgYears').value),

    // Illustration
    illustratedRate: parseNum(document.getElementById('illustratedRate').value),

    // Stated retirement age (for surrender-mismatch rule)
    retirementAge: parseNum(document.getElementById('retirementAge').value)
  };
}

/* ============================================================
   RULE ENGINE — 25 rules per spec §5.
   Each rule:
     { id, severity, topic, test(inputs), format(inputs) }
   ============================================================ */
const RULES = [
  // ── MEC ──
  { id:'R-001', severity:'caution', topic:'MEC proximity',
    test:i=>i.sevenPayLimit>0 && (i.premiumsPaid/i.sevenPayLimit)>0.95 && (i.premiumsPaid/i.sevenPayLimit)<=1,
    format:i=>({
      flag:`Cumulative premiums = ${formatCurrency(i.premiumsPaid)} (${((i.premiumsPaid/i.sevenPayLimit)*100).toFixed(1)}% of 7-pay limit).`,
      standard:'A 7-pay ratio above 95% is the warning band; crossing 100% creates a Modified Endowment Contract permanently.',
      why:'Once classified MEC, loans and withdrawals become taxable as ordinary income to the extent of gain — eliminating the tool\'s tax-advantaged retirement-income use.',
      consult:'7-pay test management and remaining-year premium pacing.'
    })
  },
  { id:'R-002', severity:'critical', topic:'MEC violation',
    test:i=>i.sevenPayLimit>0 && i.premiumsPaid>i.sevenPayLimit,
    format:i=>({
      flag:`Cumulative premiums = ${formatCurrency(i.premiumsPaid)}, exceeding the entered 7-pay limit of ${formatCurrency(i.sevenPayLimit)}.`,
      standard:'Total premiums in any 7-year window must stay at or below the 7-pay limit to preserve non-MEC treatment.',
      why:'A MEC loses the IUL\'s tax-free loan access. Distributions are LIFO-taxed to the extent of gain and may incur a 10% penalty before age 59½.',
      consult:'MEC classification status and any available carrier remediation windows.'
    })
  },

  // ── Funding Structure ──
  { id:'R-010', severity:'caution', topic:'Funding structure',
    test:i=>{ if(i.intent!=='accumulation'&&i.intent!=='hybrid')return false; const tot=i.basePremium+i.puaPremium; if(tot<=0)return false; const r=i.puaPremium/tot; return r<0.25 && r>=0.15; },
    format:i=>{ const tot=i.basePremium+i.puaPremium; const r=tot>0?i.puaPremium/tot:0; return {
      flag:`PUA-to-total-premium ratio = ${(r*100).toFixed(1)}%.`,
      standard:'A max-funded accumulation IUL typically targets 40–60% PUA allocation.',
      why:'Lower PUA share means more of each premium dollar pays base policy charges (which include the largest first-year agent commission), reducing the dollars working as cash value.',
      consult:'PUA rider funding allocation relative to base premium.'
    };}
  },
  { id:'R-011', severity:'critical', topic:'Funding structure',
    test:i=>{ if(i.intent!=='accumulation'&&i.intent!=='hybrid')return false; const tot=i.basePremium+i.puaPremium; if(tot<=0)return false; return (i.puaPremium/tot)<0.15; },
    format:i=>{ const tot=i.basePremium+i.puaPremium; const r=tot>0?i.puaPremium/tot:0; return {
      flag:`PUA-to-total-premium ratio = ${(r*100).toFixed(1)}% on a policy stated as accumulation-intent.`,
      standard:'A PUA share below 15% is well outside the accumulation-IUL norm and is structurally closer to a protection or commission-optimized design.',
      why:'At this allocation, the policy will materially underperform any accumulation-style illustration over time.',
      consult:'whether the in-force structure matches the originally stated client intent.'
    };}
  },
  { id:'R-012', severity:'caution', topic:'Cost loading',
    test:i=>i.targetPremium>0 && i.basePremium>i.targetPremium*1.20,
    format:i=>({
      flag:`Base premium = ${formatCurrency(i.basePremium)}, exceeds illustration target premium (${formatCurrency(i.targetPremium)}) by more than 20%.`,
      standard:'Base premium above target premium increases commissionable basis and policy charges without improving cash-value efficiency.',
      why:'Premium above target is generally more efficient when allocated to the PUA rider rather than to base.',
      consult:'base vs. PUA allocation of any premium above the carrier\'s target premium.'
    })
  },
  { id:'R-013', severity:'informational', topic:'Funding level',
    test:i=>i.sevenPayLimit>0 && i.annualPremium>0 && (i.annualPremium/i.sevenPayLimit)<0.60 && (i.intent==='accumulation'||i.intent==='hybrid'),
    format:i=>({
      flag:`Annual premium = ${formatCurrency(i.annualPremium)}, ${((i.annualPremium/i.sevenPayLimit)*100).toFixed(0)}% of the 7-pay limit.`,
      standard:'Accumulation-intent IULs are typically funded at 80–99% of the MEC limit to maximize cash-value efficiency.',
      why:'A policy funded well below MEC limit will accumulate cash value more slowly than the illustrations typically used to pitch accumulation IUL.',
      consult:'whether funding level matches the policy\'s stated purpose.'
    })
  },

  // ── DB Option Sanity ──
  { id:'R-020', severity:'caution', topic:'DB option fit',
    test:i=>i.dbOption==='A' && false, // placeholder — Option A + accumulation is actually FINE; we flip the rule below
    format:i=>({flag:'',standard:'',why:'',consult:''})
  },
  { id:'R-021', severity:'caution', topic:'DB option fit',
    test:i=>(i.dbOption==='B'||i.dbOption==='C') && i.intent==='accumulation' && i.yearsInForce<5,
    format:i=>({
      flag:`Death Benefit Option ${i.dbOption} elected on a policy stated as accumulation-intent.`,
      standard:'Accumulation IULs typically use Option A (level) to minimize the cost-of-insurance drag as cash value grows.',
      why:`Option ${i.dbOption} keeps a higher net-amount-at-risk, so the per-thousand insurance cost stays elevated for longer — slowing accumulation.`,
      consult:'whether the elected DB option matches the stated accumulation goal, particularly if a contractual switch from B to A is allowed.'
    })
  },

  // ── Index Strategy ──
  { id:'R-030', severity:'caution', topic:'Index strategy',
    test:i=>i.indexType==='capped' && i.cap>0 && i.cap<8,
    format:i=>({
      flag:`Cap rate = ${formatPct(i.cap)} on a capped index strategy.`,
      standard:'Capped IUL strategies in 2026 commonly land in the 9–12% range; sub-8% caps are below current market norms.',
      why:'A low cap directly limits crediting in strong index years, materially reducing long-run accumulation.',
      consult:'whether other strategies offered by the carrier provide higher caps and whether reallocation is contractually available.'
    })
  },
  { id:'R-031', severity:'critical', topic:'Double-cap structure',
    test:i=>i.indexType==='capped' && i.cap>0 && i.cap<10 && i.participation>0 && i.participation<100,
    format:i=>({
      flag:`Cap = ${formatPct(i.cap)} AND participation rate = ${formatPct(i.participation)} on the same strategy.`,
      standard:'A cap combined with sub-100% participation effectively layers two limits — credited interest is first scaled down by participation and then capped.',
      why:'In strong index years the realized credit can be materially lower than the headline cap suggests.',
      consult:'how this "double-cap" strategy compares to the carrier\'s other available strategies.'
    })
  },
  { id:'R-032', severity:'caution', topic:'Index strategy',
    test:i=>i.indexType==='uncapped' && i.spread>3,
    format:i=>({
      flag:`Spread = ${formatPct(i.spread)} on an uncapped strategy.`,
      standard:'Spreads above 3% on uncapped strategies are a meaningful drag — uncapped is normally pitched as the upside option.',
      why:'A large spread converts an "uncapped" strategy into a structurally limited one without the visible cap number.',
      consult:'realized historical credited rates for this specific uncapped strategy at this carrier.'
    })
  },
  { id:'R-033', severity:'critical', topic:'Uncapped downside',
    test:i=>i.floor<0,
    format:i=>({
      flag:`Floor = ${formatPct(i.floor)}.`,
      standard:'IUL strategies marketed as principal-protected use a 0% floor — credited interest cannot go below zero in a down index year (policy charges still apply).',
      why:'A floor below zero exposes cash value to negative index returns on top of normal policy charges. This is a structural risk that conflicts with the standard IUL value proposition.',
      consult:'whether a 0%-floor strategy is available at this carrier for reallocation.'
    })
  },
  { id:'R-034', severity:'caution', topic:'Volatility-controlled index',
    test:i=>i.indexType==='volcontrol' && i.cap>0 && i.cap<100,
    format:i=>({
      flag:`Volatility-controlled index with a ${formatPct(i.cap)} cap.`,
      standard:'Volatility-controlled indices already cap upside through their target-volatility mechanism; layering a strategy cap on top adds a second limit.',
      why:'Stacked limits typically produce lower realized credits than the cap alone would suggest. AG-49A also imposes specific illustration limits on vol-controlled designs.',
      consult:'whether an uncapped vol-control allocation is available, and how realized credits compare to a vanilla capped S&P 500 strategy.'
    })
  },

  // ── Loan Structure ──
  { id:'R-040', severity:'caution', topic:'Loan type fit',
    test:i=>i.loanType==='variable' && i.age>55,
    format:i=>({
      flag:`Loan type = Variable (Participating) at age ${i.age}.`,
      standard:'Variable loan rates float with a published index; loan cost can rise during retirement-income years and amplify both gains and shortfalls.',
      why:'For policyholders within 10 years of using policy loans as retirement income, locking in a fixed or wash loan structure removes interest-rate uncertainty.',
      consult:'whether a contractual loan-type switch to fixed or wash is available and at what cost.'
    })
  },
  { id:'R-041', severity:'caution', topic:'Loan drag',
    test:i=>i.loanType!=='wash' && i.loanType!=='none' && i.loanRate>0 && i.loanCredit>0 && (i.loanRate-i.loanCredit)>2,
    format:i=>({
      flag:`Loan rate (${formatPct(i.loanRate)}) exceeds loaned-value crediting rate (${formatPct(i.loanCredit)}) by more than 2 points.`,
      standard:'A loan-cost-to-credit spread above 2% creates persistent negative arbitrage on any outstanding loan balance.',
      why:'Over time, this drag reduces the cash value backing the loan and increases the risk of policy lapse if the loan compounds.',
      consult:'available loan-type alternatives and projected long-run loan-cost spread for this policy.'
    })
  },
  { id:'R-042', severity:'critical', topic:'Lapse risk from loan',
    test:i=>!i.overloan && i.currentCV>0 && i.loanBalance>0 && (i.loanBalance/i.currentCV)>0.50,
    format:i=>({
      flag:`Loan balance ${formatCurrency(i.loanBalance)} = ${((i.loanBalance/i.currentCV)*100).toFixed(0)}% of cash value, with NO overloan protection rider.`,
      standard:'A loan-to-cash-value ratio above 50% without overloan protection is the classic IUL lapse-risk profile.',
      why:'If charges and loan interest erode the remaining cash value, the policy can lapse with an outstanding loan — making the full prior gain taxable as ordinary income in that year.',
      consult:'whether an overloan protection rider can still be added and how loan-balance management options work at this carrier.'
    })
  },
  { id:'R-043', severity:'informational', topic:'Loan option not elected',
    test:i=>i.loanType==='variable' && i.yearsInForce>=10,
    format:i=>({
      flag:`Policy has been in force ${i.yearsInForce} years with loan type still set to Variable.`,
      standard:'Many carriers allow a one-time conversion to a wash/fixed loan after 10+ years.',
      why:'For a policy entering its retirement-income phase, switching to a wash loan removes interest-rate risk on the loaned portion.',
      consult:'whether a one-time loan-type conversion is available under this contract.'
    })
  },

  // ── Illustration Sanity (AG-49A) ──
  { id:'R-050', severity:'critical', topic:'Illustration sanity',
    test:i=>i.illustratedRate>6.5 && i.indexType==='volcontrol',
    format:i=>({
      flag:`Illustrated crediting rate = ${formatPct(i.illustratedRate)} on a volatility-controlled index strategy.`,
      standard:'AG-49A imposes a strategy-specific maximum illustrated rate; vol-controlled indices typically fall in the 5.0–6.0% range.',
      why:'An illustration above the AG-49A maximum was either non-compliant or used pre-2020 rules. Forward expectations should be reset to the AG-49A-compliant range.',
      consult:'current AG-49A-compliant illustration values for this carrier and strategy.'
    })
  },
  { id:'R-051', severity:'caution', topic:'Illustration sanity',
    test:i=>i.illustratedRate>7,
    format:i=>({
      flag:`Illustrated crediting rate = ${formatPct(i.illustratedRate)}.`,
      standard:'Most 2026 AG-49A-compliant IUL illustrations sit in the 5.5–6.5% range, depending on strategy.',
      why:'Forward projections built on a 7%+ assumption likely overstate cash-value growth versus what the policy will deliver under current guidelines.',
      consult:'a current in-force re-illustration at the carrier\'s AG-49A-compliant rate for stress comparison.'
    })
  },

  // ── Surrender / Liquidity ──
  { id:'R-060', severity:'caution', topic:'Liquidity timing',
    test:i=>i.surrenderYearsLeft>10 && i.age>60,
    format:i=>({
      flag:`${i.surrenderYearsLeft} years of surrender charge remain at age ${i.age}.`,
      standard:'Most accumulation IULs are sold with 10–15-year surrender schedules. Long-remaining surrender periods late in life signal a recent purchase or a long-charge product design.',
      why:'Cash surrender value is materially less than reported cash value during the surrender window; planned liquidity events inside this window will not realize full reported CV.',
      consult:'cash-surrender-value projections through the end of the surrender charge period.'
    })
  },
  { id:'R-061', severity:'caution', topic:'Liquidity timing',
    test:i=>i.retirementAge>0 && (i.age+i.surrenderYearsLeft)>i.retirementAge && i.surrenderYearsLeft>5,
    format:i=>({
      flag:`Surrender charge period ends at approximate age ${i.age+i.surrenderYearsLeft}, after stated retirement age ${i.retirementAge}.`,
      standard:'Properly structured retirement-income IUL has the surrender charge fully run off before income loans begin.',
      why:'If structured income begins inside the surrender window, any unexpected non-loan liquidity event would surrender at a reduced value.',
      consult:'sequencing of policy-loan income against the surrender-charge runoff schedule.'
    })
  },

  // ── Rider Coverage ──
  { id:'R-070', severity:'caution', topic:'Rider coverage',
    test:i=>!i.overloan && (i.intent==='accumulation'||i.intent==='hybrid'),
    format:i=>({
      flag:'Overloan Protection Rider: NOT elected.',
      standard:'Accumulation IULs structured for tax-free retirement income via loans typically include the overloan protection rider to prevent loan-driven lapse.',
      why:'Without overloan protection, an in-force IUL relying on policy loans for retirement income is exposed to lapse-triggered tax recognition of all prior gain.',
      consult:'whether the overloan protection rider can be added at this stage and what the activation conditions are.'
    })
  },
  { id:'R-071', severity:'informational', topic:'Rider coverage',
    test:i=>!i.chronicLTC && i.age>55,
    format:i=>({
      flag:`No chronic illness / LTC accelerator rider at age ${i.age}.`,
      standard:'Chronic illness and LTC accelerators are commonly included on IULs at low or no cost when offered before late-career age windows.',
      why:'A missing accelerator on a policy held into late life means the death benefit cannot be tapped to fund chronic-care needs while alive.',
      consult:'whether an accelerator rider can be added now, and at what cost.'
    })
  },

  // ── Lapse Stress ──
  { id:'R-080', severity:'critical', topic:'Lapse stress (0% scenario)',
    test:i=>{ /* simplified 0%-credit lapse projector — see runLapseProjection */
      const proj = lapseProjection(i,'zero'); return proj.lapseAge>0 && proj.lapseAge<90;
    },
    format:i=>{ const proj = lapseProjection(i,'zero'); return {
      flag:`At a sustained 0% credited rate, this policy projects to lapse near age ${proj.lapseAge}.`,
      standard:'A structurally sound IUL with stated funding should sustain in-force status through age 90 even under a sustained 0%-credit scenario.',
      why:'A sub-90 lapse age under 0% credits indicates either underfunding, a heavy charge structure, or an outstanding loan unsupported by overloan protection.',
      consult:'in-force re-illustrations at 0% credit and corrective-funding options.'
    };}
  },
  { id:'R-081', severity:'caution', topic:'Lapse stress (floor scenario)',
    test:i=>{ const proj=lapseProjection(i,'floor'); return proj.lapseAge>0 && proj.lapseAge<90; },
    format:i=>{ const proj=lapseProjection(i,'floor'); return {
      flag:`At a sustained floor-only crediting rate (${formatPct(i.floor)}), this policy projects to lapse near age ${proj.lapseAge}.`,
      standard:'A 0%-floor IUL should sustain in-force status through age 90 even with credited interest pinned at the floor every year.',
      why:'A sub-90 lapse age in the floor-only scenario points to a structural funding or charge issue, not just an unlucky index year.',
      consult:'in-force re-illustrations at the policy floor and PUA top-up options if available.'
    };}
  }
];

/* ============================================================
   LAPSE PROJECTION — simplified, illustrative.
   We model cash value year-by-year:
     CV_{n+1} = (CV_n + Premium - Charges + LoanInterestNetIfAny) * (1 + creditRate)
   With a stylized charge schedule (% of CV + cost-of-insurance per thousand face).
   This is NOT a carrier in-force projection; it is an internal stress
   estimate so the diagnostic can flag lapse-risk patterns.
   ============================================================ */
function lapseProjection(i,scenario){
  let cv = i.currentCV;
  let loan = i.loanBalance;
  const startAge = i.age;
  const endAge = 95;
  let credit;
  switch(scenario){
    case 'zero': credit = 0; break;
    case 'floor': credit = Math.max(i.floor,0)/100; break;
    case 'illustrated': credit = i.illustratedRate/100; break;
    case 'historical': credit = Math.min(i.illustratedRate/100*0.85, 0.06); break; // historical median proxy
    default: credit = 0;
  }
  // Stylized annual charges
  function chargeRate(age){ if(age<60)return 0.018; if(age<70)return 0.022; if(age<80)return 0.030; if(age<90)return 0.040; return 0.055; }
  // Net amount at risk (Option A shrinks with CV; B/C does not)
  function naar(age,cv){ if(i.dbOption==='A') return Math.max(i.faceAmount-cv,0); return i.faceAmount; }
  const path = [];
  let lapseAge = 0;
  for(let age=startAge; age<=endAge; age++){
    const yearsFromNow = age - startAge;
    // Stop receiving premium once stated retirement age reached
    const premium = (i.retirementAge>0 && age>=i.retirementAge) ? 0 : i.annualPremium;
    // Cost of insurance on net amount at risk
    const coi = (naar(age,cv)/1000) * (3 + Math.max(0,(age-50))*0.4);
    // Policy charges as % of CV
    const policyCharges = cv * chargeRate(age);
    // Loan interest cost (variable/fixed/indexed); wash is net zero
    let loanCost = 0;
    if(loan>0 && i.loanType!=='wash' && i.loanType!=='none'){
      loanCost = loan * Math.max(i.loanRate-i.loanCredit,0)/100;
      loan = loan * (1 + i.loanRate/100);
    }
    // Apply charges + premium + crediting
    cv = (cv + premium - coi - policyCharges - loanCost) * (1 + credit);
    path.push({age, cv: Math.round(cv)});
    if(cv <= 0 && lapseAge===0){ lapseAge = age; break; }
  }
  return { lapseAge, path };
}

/* ============================================================
   RUN AUDIT
   ============================================================ */
function calculate(){
  const inputs = readInputs();

  // Evaluate rules
  const findings = [];
  RULES.forEach(rule=>{
    try{
      if(rule.test(inputs)){
        const f = rule.format(inputs);
        if(f.flag) findings.push({id:rule.id,severity:rule.severity,topic:rule.topic,...f});
      }
    }catch(e){ console.error('Rule error', rule.id, e); }
  });

  // Severity ordering
  const order = {critical:0, caution:1, informational:2};
  findings.sort((a,b)=>order[a.severity]-order[b.severity]);

  // Scorecard
  const counts = {critical:0,caution:0,informational:0};
  findings.forEach(f=>counts[f.severity]++);
  document.getElementById('scCritical').textContent = counts.critical;
  document.getElementById('scCaution').textContent = counts.caution;
  document.getElementById('scInfo').textContent = counts.informational;

  // Render findings
  const list = document.getElementById('findingsList');
  list.innerHTML = '';
  if(findings.length===0){
    list.innerHTML = '<div class="finding-empty">No structural flags triggered against the entered parameters. This does not constitute a clean bill of health — bring your in-force illustration and most recent annual statement to a licensed advisor for full review.</div>';
  } else {
    findings.forEach(f=>{
      const card = document.createElement('div');
      card.className = 'finding-card finding-'+f.severity;
      card.innerHTML = `
        <div class="finding-head">
          <span class="finding-badge finding-badge-${f.severity}">${f.severity.toUpperCase()}</span>
          <span class="finding-id">${f.id}</span>
          <span class="finding-topic">${f.topic}</span>
        </div>
        <p class="finding-flag"><strong>Flag:</strong> ${f.flag}</p>
        <p class="finding-standard"><strong>Standard:</strong> ${f.standard}</p>
        <p class="finding-why"><strong>Why it matters:</strong> ${f.why}</p>
        <p class="finding-consult"><strong>Consult a licensed advisor about</strong> ${f.consult}</p>
      `;
      list.appendChild(card);
    });
  }

  // Build the four-line lapse stress chart
  destroyCharts();
  const cs = getCS();
  const scenarios = [
    {key:'illustrated', label:'Illustrated Rate', color:cs.c1||'#01696F'},
    {key:'historical', label:'Historical Median', color:cs.c2||'#D19900'},
    {key:'floor', label:'Floor Only', color:cs.c3||'#5B7A99'},
    {key:'zero', label:'0% Return', color:cs.c4||'#B54033'}
  ];
  const labels = [];
  for(let a=inputs.age;a<=95;a++) labels.push('Age '+a);
  const datasets = scenarios.map(s=>{
    const proj = lapseProjection(inputs,s.key);
    // Pad the path to full length, treating post-lapse as zero
    const data = [];
    for(let idx=0; idx<labels.length; idx++){
      const p = proj.path[idx];
      if(p) data.push(p.cv);
      else data.push(0);
    }
    return {
      label: s.label,
      data,
      borderColor: s.color,
      backgroundColor: s.color+'22',
      tension: .25,
      borderWidth: 2,
      pointRadius: 0,
      fill: false
    };
  });
  const ctx = document.getElementById('chartLapse');
  if(ctx){
    const opts = chartOpts('Cash Value Path Under Four Crediting Scenarios','line');
    opts.scales.y.ticks.callback = v=>formatCurrency(v);
    opts.plugins.tooltip.callbacks = {label: c => `${c.dataset.label}: ${formatCurrency(c.parsed.y)}`};
    window.__charts.lapse = new Chart(ctx.getContext('2d'), { type:'line', data:{labels,datasets}, options:opts });
  }

  // Show results
  showResults();

  // Recent tracker hook (matches other tools)
  if(typeof window.IntelliTC!=='undefined' && window.IntelliTC.recentTracker){
    try{ window.IntelliTC.recentTracker.log('IUL Auditor'); }catch(e){}
  }
}

window.calculate = calculate;

/* ============================================================
   EXAMPLES — populate input fields from a saved scenario.
   Wired via Learn Mode shared/learn-mode.js using window.LEARN_DATA.examples.
   ============================================================ */
window.loadExample = function(values){
  Object.keys(values).forEach(k=>{
    const el = document.getElementById(k);
    if(!el) return;
    el.value = values[k];
    if(el.matches('input[data-currency]')){
      const v = parseNum(el.value); if(v) el.value = Math.round(v).toLocaleString();
    }
  });
};
