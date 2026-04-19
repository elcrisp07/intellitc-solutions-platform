/* ── Tax Strategy Pathfinder — app.js ── */

/* ── Theme Toggle IIFE ── */
;(function(){
  const btn=document.querySelector('[data-theme-toggle]');
  if(!btn)return;
  const KEY='intellitc-theme';
  function apply(t){document.documentElement.setAttribute('data-theme',t);localStorage.setItem(KEY,t);}
  const saved=localStorage.getItem(KEY)||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
  apply(saved);
  btn.addEventListener('click',()=>apply(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark'));
})();

/* ── Strategy Definitions ── */
const STRATEGIES = [
  {
    id: 'exchange_1031',
    name: '1031 Exchange',
    benefitType: 'Deferral',
    complexity: 'medium',
    professionals: ['Qualified Intermediary', 'CPA'],
    link: '../1031-exchange/',
    linkLabel: 'Open 1031 Calculator',
    whyFits: 'Defers capital gains tax by rolling sale proceeds into a like-kind investment property. Preserves buying power and keeps equity working — some investors chain exchanges for decades and never trigger the gain.',
    whenAvoid: 'You need immediate cash from the sale, you are exiting real estate entirely, or the property is a primary residence (not eligible).',
    scoring: {
      dealStage:  { selling:3, exchanging:3, holding:1 },
      goal:       { defer_gains:3, transition:2, improve_cashflow:1 },
      propType:   { ltr:2, str:2, mixed:2, commercial:2, land:1 },
      complexityMax: 'medium'
    }
  },
  {
    id: 'cost_segregation',
    name: 'Cost Segregation',
    benefitType: 'Deduction Acceleration',
    complexity: 'high',
    professionals: ['Cost Segregation Engineer', 'CPA'],
    link: null,
    linkLabel: null,
    whyFits: 'Reclassifies building components (cabinetry, flooring, site improvements) into shorter depreciation schedules — 5, 7, or 15 years instead of 27.5 or 39. Generates larger deductions in early years of ownership.',
    whenAvoid: 'Property value is under $500,000, you plan to sell within 2–3 years (recapture risk), or the property is primarily land with minimal improvements.',
    scoring: {
      dealStage:  { buying:3, holding:2 },
      goal:       { reduce_income:3, improve_cashflow:2 },
      propType:   { commercial:3, mixed:2, ltr:2, str:2, land:0 },
      complexityMax: 'high',
      renovationBonus: 2
    }
  },
  {
    id: 'bonus_depreciation',
    name: 'Bonus Depreciation',
    benefitType: 'Deduction Acceleration',
    complexity: 'medium',
    professionals: ['CPA'],
    link: null,
    linkLabel: null,
    whyFits: 'Allows a large first-year deduction on qualifying shorter-life assets identified through cost segregation. Even as the percentage phases down (20% in 2026), it can still front-load meaningful deductions in the acquisition year.',
    whenAvoid: 'You are past the first year of ownership without a cost segregation study, or your income is too low to absorb the accelerated deductions this year.',
    scoring: {
      dealStage:  { buying:3, holding:1 },
      goal:       { reduce_income:3, improve_cashflow:2 },
      propType:   { commercial:2, mixed:2, ltr:2, str:2, land:0 },
      complexityMax: 'medium',
      renovationBonus: 2
    }
  },
  {
    id: 'str_strategy',
    name: 'Short-Term Rental Tax Strategy',
    benefitType: 'Deduction Planning',
    complexity: 'high',
    professionals: ['CPA specializing in STR', 'Property Manager'],
    link: '../short-term-rental/',
    linkLabel: 'Open STR Analyzer',
    whyFits: 'Short-term rentals with material participation may allow more aggressive deduction planning compared to passive long-term rental structures. The average rental period and your level of involvement determine the tax treatment.',
    whenAvoid: 'You cannot commit to active management or material participation requirements, local regulations restrict short-term rentals, or you prefer a fully passive investment.',
    scoring: {
      dealStage:  { buying:2, holding:3 },
      goal:       { reduce_income:3, improve_cashflow:3 },
      propType:   { str:3, mixed:2, ltr:0, commercial:0, land:0 },
      complexityMax: 'high'
    }
  },
  {
    id: 'opportunity_zone',
    name: 'Opportunity Zone Investment',
    benefitType: 'Deferral + Incentive',
    complexity: 'high',
    professionals: ['QOF Attorney', 'CPA', 'Real Estate Attorney'],
    link: null,
    linkLabel: null,
    whyFits: 'Invest capital gains through a Qualified Opportunity Fund (QOF) in designated census tracts for deferral and potential partial exclusion of new gains after a 10-year hold. Strongest when you have a realized gain and a long time horizon.',
    whenAvoid: 'You need liquidity in the near term, you are not comfortable with geographic investment restrictions, or the 10-year hold requirement does not fit your timeline. Requires investment through a properly structured QOF.',
    scoring: {
      dealStage:  { selling:3, buying:2 },
      goal:       { defer_gains:3, transition:2 },
      propType:   { land:3, commercial:2, mixed:2, ltr:1, str:1 },
      complexityMax: 'high',
      renovationBonus: 2
    }
  },
  {
    id: 'upreit_721',
    name: '721 Exchange / UPREIT',
    benefitType: 'Portfolio Transition',
    complexity: 'high',
    professionals: ['Securities Attorney', 'CPA', 'Financial Advisor'],
    link: null,
    linkLabel: null,
    whyFits: 'Exchange property for operating partnership (OP) units in a Real Estate Investment Trust, deferring gain while gaining diversification and liquidity. Useful for investors who want to exit direct property management without triggering a taxable event.',
    whenAvoid: 'Your portfolio is small, you want to maintain full control over property decisions, or you are unfamiliar with REIT/partnership structures. This is an advanced strategy that requires sophisticated legal counsel.',
    scoring: {
      dealStage:  { selling:2, estate:3 },
      goal:       { transition:3, pass_assets:2, defer_gains:2 },
      propType:   { commercial:2, ltr:2, mixed:2, str:1, land:1 },
      complexityMax: 'high'
    }
  },
  {
    id: 'estate_trust',
    name: 'Estate and Trust Planning',
    benefitType: 'Estate Efficiency',
    complexity: 'high',
    professionals: ['Estate Attorney', 'CPA', 'Trust Officer'],
    link: null,
    linkLabel: null,
    whyFits: 'Real property held until death receives a stepped-up basis, potentially eliminating embedded capital gains for heirs. Irrevocable trusts, family LLCs, and other structures can facilitate orderly transfers, reduce estate exposure, and protect assets across generations.',
    whenAvoid: 'You are a younger investor with no current succession needs, your portfolio is small relative to estate thresholds, or you are not ready to give up control over transferred assets.',
    scoring: {
      dealStage:  { estate:3, holding:2 },
      goal:       { pass_assets:3, transition:2 },
      propType:   { ltr:1, str:1, mixed:1, commercial:1, land:1 },
      complexityMax: 'high',
      multigenerationalBonus: 3
    }
  }
];

const COMPLEXITY_ORDER = { low: 1, medium: 2, high: 3 };

/* ── Scoring Engine ── */
function scoreStrategies(inputs) {
  const { dealStage, primaryGoal, propType, complexity, renovation, multigenerational } = inputs;
  const userComplexity = COMPLEXITY_ORDER[complexity] || 2;

  return STRATEGIES.map(s => {
    let score = 0;

    // Deal stage match (0-3)
    score += (s.scoring.dealStage[dealStage] || 0);

    // Goal match (0-3)
    score += (s.scoring.goal[primaryGoal] || 0);

    // Property type match (0-3)
    score += (s.scoring.propType[propType] || 0);

    // Complexity penalty: if strategy complexity exceeds tolerance, penalize
    const stratComplexity = COMPLEXITY_ORDER[s.complexity] || 2;
    if (stratComplexity > userComplexity) {
      score -= (stratComplexity - userComplexity);
    } else {
      score += 1; // bonus for fitting within tolerance
    }

    // Renovation bonus
    if (renovation === 'yes' && s.scoring.renovationBonus) {
      score += s.scoring.renovationBonus;
    }

    // Multi-generational bonus
    if (multigenerational === 'yes' && s.scoring.multigenerationalBonus) {
      score += s.scoring.multigenerationalBonus;
    }

    // Multi-generational small boost for estate strategy even without explicit flag
    if (multigenerational === 'yes' && s.id === 'estate_trust') {
      // already handled above
    }

    return { ...s, score };
  })
  .sort((a, b) => b.score - a.score);
}

/* ── Fit Label ── */
function fitLabel(score, rank) {
  if (rank === 0 || score >= 7) return { text: 'Strong Fit', cls: 'fit-strong' };
  if (rank <= 2 || score >= 5) return { text: 'Good Fit', cls: 'fit-good' };
  return { text: 'Moderate Fit', cls: 'fit-moderate' };
}

/* ── Render ── */
function renderResults(ranked) {
  // KPI row
  const kpiRow = document.getElementById('kpiRow');
  const strongCount = ranked.filter(s => s.score >= 5).length;
  const topStrategy = ranked[0];
  const highestComplexity = ranked.slice(0, 3).reduce((max, s) => {
    return COMPLEXITY_ORDER[s.complexity] > COMPLEXITY_ORDER[max] ? s.complexity : max;
  }, 'low');

  kpiRow.innerHTML = `
    <div class="pathfinder-kpi-card">
      <span class="kpi-label">Strategies Matched</span>
      <span class="kpi-value">${strongCount} of ${ranked.length}</span>
    </div>
    <div class="pathfinder-kpi-card">
      <span class="kpi-label">Top Benefit Type</span>
      <span class="kpi-value">${topStrategy.benefitType}</span>
    </div>
    <div class="pathfinder-kpi-card">
      <span class="kpi-label">Peak Complexity</span>
      <span class="kpi-value">${highestComplexity.charAt(0).toUpperCase() + highestComplexity.slice(1)}</span>
    </div>
    <div class="pathfinder-kpi-card">
      <span class="kpi-label">Recommended Next Step</span>
      <span class="kpi-value" style="font-size:var(--text-sm)">${topStrategy.link ? 'Run ' + topStrategy.name : 'Consult ' + topStrategy.professionals[0]}</span>
    </div>
  `;

  // Strategy cards
  const container = document.getElementById('strategyCards');
  container.innerHTML = '';

  ranked.forEach((s, i) => {
    const fit = fitLabel(s.score, i);
    const complexityCls = s.complexity === 'low' ? 'complexity-low' : s.complexity === 'medium' ? 'complexity-medium' : 'complexity-high';
    const rankCls = i >= 3 ? 'rank-low' : '';

    const profTags = s.professionals.map(p => `<span class="pro-tag">${p}</span>`).join('');

    let ctaHTML = '';
    if (s.link) {
      ctaHTML = `<a href="${s.link}" class="strategy-cta">${s.linkLabel} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></a>`;
    } else {
      ctaHTML = `<span class="strategy-cta cta-secondary" style="cursor:default">Advisor Consultation Recommended</span>`;
    }

    const card = document.createElement('div');
    card.className = 'strategy-card';
    card.innerHTML = `
      <div class="strategy-card-header">
        <span class="strategy-rank ${rankCls}">${i + 1}</span>
        <div class="strategy-title-block">
          <h3 class="strategy-name">${s.name}</h3>
          <span class="strategy-benefit-tag">${s.benefitType}</span>
        </div>
        <span class="strategy-complexity ${complexityCls}">${s.complexity.charAt(0).toUpperCase() + s.complexity.slice(1)} Complexity</span>
      </div>
      <span class="strategy-fit ${fit.cls}">${fit.text}</span>
      <div class="strategy-sections">
        <div class="strategy-section">
          <h4>Why It Fits</h4>
          <p>${s.whyFits}</p>
        </div>
        <div class="strategy-section avoid-section">
          <h4>When to Avoid</h4>
          <p>${s.whenAvoid}</p>
        </div>
      </div>
      <div class="strategy-footer">
        <div class="strategy-pros-list">${profTags}</div>
        ${ctaHTML}
      </div>
    `;
    container.appendChild(card);
  });
}

/* ── Calculate ── */
function calculate() {
  const inputs = {
    dealStage: document.getElementById('dealStage').value,
    primaryGoal: document.getElementById('primaryGoal').value,
    propType: document.getElementById('propType').value,
    complexity: document.getElementById('complexity').value,
    renovation: document.getElementById('renovation').value,
    multigenerational: document.getElementById('multigenerational').value
  };

  const ranked = scoreStrategies(inputs);
  renderResults(ranked);

  document.getElementById('inputPanel').classList.add('hidden');
  document.getElementById('resultsPanel').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Back Button ── */
document.addEventListener('DOMContentLoaded', () => {
  const backBtn = document.querySelector('[data-back]');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      document.getElementById('resultsPanel').classList.add('hidden');
      document.getElementById('inputPanel').classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

/* ── Currency formatting helper (unused here but keeps shared JS happy) ── */
document.querySelectorAll('[data-currency]').forEach(el => {
  el.addEventListener('input', function() {
    let v = this.value.replace(/[^0-9]/g, '');
    if (v) this.value = Number(v).toLocaleString('en-US');
  });
});
