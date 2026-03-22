/* ============================================================
   IntelliTC Solutions — Learn Mode Engine
   ============================================================
   Usage: Include this script after app.js. Define window.LEARN_DATA
   before this script loads (or inline it) with the structure:
   
   window.LEARN_DATA = {
     tooltips: { fieldId: "explanation text", ... },
     examples: [ { name: "...", desc: "...", values: { fieldId: value, ... } }, ... ],
     whyThisMatters: {
       title: "Why Use This Calculator?",
       purpose: "...",
       whenToUse: ["...", "..."],
       keyInsight: "..."
     },
     kpiExplains: { kpiElementId: "explanation text", ... },
     coupled: [
       { name: "Calculator Name", folder: "folder-name", reason: "Why use together" },
       ...
     ]
   };
   ============================================================ */

(function() {
  'use strict';

  const DATA = window.LEARN_DATA || {};
  let isActive = false;

  /* ---- Build Toggle ---- */
  function buildToggle() {
    const header = document.querySelector('.header-inner');
    if (!header) return;

    const wrap = document.createElement('div');
    wrap.className = 'learn-toggle-wrap';
    wrap.innerHTML = `
      <label class="learn-toggle-label" for="learnToggle">
        <svg class="learn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
        Learn
      </label>
      <div class="learn-toggle" id="learnToggle" role="switch" aria-checked="false" aria-label="Toggle Learn Mode" tabindex="0"></div>
    `;

    // Insert before theme toggle
    const themeBtn = header.querySelector('[data-theme-toggle]');
    if (themeBtn) {
      header.insertBefore(wrap, themeBtn);
    } else {
      header.appendChild(wrap);
    }

    const toggle = document.getElementById('learnToggle');
    toggle.addEventListener('click', () => toggleLearnMode());
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleLearnMode(); }
    });
  }

  /* ---- Toggle State ---- */
  function toggleLearnMode() {
    isActive = !isActive;
    const toggle = document.getElementById('learnToggle');
    toggle.classList.toggle('active', isActive);
    toggle.setAttribute('aria-checked', isActive);
    document.body.classList.toggle('learn-active', isActive);

    // Show/hide the Why panel after results are shown (coupled is always visible)
    const whyPanel = document.querySelector('.learn-why-panel');
    if (whyPanel) whyPanel.classList.toggle('visible', isActive);

    // Save preference
    window.__learnModePref = isActive ? '1' : '0';
  }

  /* ---- Field Tooltips ---- */
  function injectTooltips() {
    if (!DATA.tooltips) return;
    Object.entries(DATA.tooltips).forEach(([fieldId, text]) => {
      const input = document.getElementById(fieldId);
      if (!input) return;
      const field = input.closest('.field');
      if (!field) return;
      // Don't duplicate
      if (field.querySelector('.learn-tooltip')) return;
      const tip = document.createElement('div');
      tip.className = 'learn-tooltip';
      tip.innerHTML = text;
      field.appendChild(tip);
    });
  }

  /* ---- Example Scenarios ---- */
  function injectExamples() {
    if (!DATA.examples || DATA.examples.length === 0) return;
    const divider = document.querySelector('.divider');
    if (!divider) return;
    // Don't duplicate
    if (document.querySelector('.learn-examples')) return;

    const section = document.createElement('div');
    section.className = 'learn-examples';
    section.innerHTML = `
      <div class="learn-examples-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        Try an Example Scenario
      </div>
      <div class="learn-example-cards">
        ${DATA.examples.map((ex, i) => `
          <div class="learn-example-card" data-example="${i}" tabindex="0" role="button" aria-label="Load ${ex.name} example">
            <div class="learn-example-card-title">${ex.name}</div>
            <div class="learn-example-card-desc">${ex.desc}</div>
          </div>
        `).join('')}
      </div>
    `;
    divider.parentNode.insertBefore(section, divider.nextSibling);

    // Bind click handlers
    section.querySelectorAll('.learn-example-card').forEach(card => {
      const handler = () => {
        const idx = parseInt(card.dataset.example);
        const ex = DATA.examples[idx];
        if (!ex || !ex.values) return;
        Object.entries(ex.values).forEach(([fid, val]) => {
          const inp = document.getElementById(fid);
          if (!inp) return;
          if (inp.tagName === 'SELECT') {
            inp.value = val;
          } else {
            inp.value = typeof val === 'number' ? 
              (inp.hasAttribute('data-currency') ? Math.round(val).toLocaleString() : val) : val;
          }
          inp.dispatchEvent(new Event('input', { bubbles: true }));
        });
        // Visual feedback
        card.style.borderColor = 'var(--color-success)';
        card.style.background = 'var(--color-primary-surface)';
        setTimeout(() => {
          card.style.borderColor = '';
          card.style.background = '';
        }, 1200);
      };
      card.addEventListener('click', handler);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
      });
    });
  }

  /* ---- Why This Matters Panel ---- */
  function injectWhyPanel() {
    if (!DATA.whyThisMatters) return;
    const resultsPanel = document.getElementById('resultsPanel');
    if (!resultsPanel) return;
    if (resultsPanel.querySelector('.learn-why-panel')) return;

    const wtm = DATA.whyThisMatters;
    const panel = document.createElement('div');
    panel.className = 'learn-why-panel' + (isActive ? ' visible' : '');
    panel.innerHTML = `
      <div class="learn-why-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        ${wtm.title || 'Why This Matters'}
      </div>
      <div class="learn-why-section">
        <h4>Purpose</h4>
        <p>${wtm.purpose}</p>
      </div>
      ${wtm.whenToUse ? `
      <div class="learn-why-section">
        <h4>When to Use This Calculator</h4>
        <ul>${wtm.whenToUse.map(item => `<li>${item}</li>`).join('')}</ul>
      </div>` : ''}
      ${wtm.keyInsight ? `
      <div class="learn-why-section">
        <h4>Key Insight</h4>
        <p>${wtm.keyInsight}</p>
      </div>` : ''}
      ${wtm.proTip ? `
      <div class="learn-why-section">
        <h4>Pro Tip</h4>
        <p>${wtm.proTip}</p>
      </div>` : ''}
    `;
    resultsPanel.appendChild(panel);
  }

  /* ---- KPI Explanations ---- */
  function injectKpiExplains() {
    if (!DATA.kpiExplains) return;
    Object.entries(DATA.kpiExplains).forEach(([kpiId, text]) => {
      const kpiEl = document.getElementById(kpiId);
      if (!kpiEl) return;
      const card = kpiEl.closest('.kpi-card');
      if (!card || card.querySelector('.learn-kpi-explain')) return;
      const explain = document.createElement('div');
      explain.className = 'learn-kpi-explain';
      explain.innerHTML = text;
      card.appendChild(explain);
    });
  }

  /* ---- Coupled Calculator Suggestions (always visible after results) ---- */
  function injectCoupled() {
    if (!DATA.coupled || DATA.coupled.length === 0) return;
    const resultsPanel = document.getElementById('resultsPanel');
    if (!resultsPanel) return;
    if (resultsPanel.querySelector('.learn-coupled')) return;

    const section = document.createElement('div');
    section.className = 'learn-coupled visible';
    section.innerHTML = `
      <div class="learn-coupled-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
        Pair With These Calculators
      </div>
      <div class="learn-coupled-list">
        ${DATA.coupled.map((c, i) => `
          <a class="learn-coupled-item" href="../${c.folder}/index.html">
            <div class="coupled-icon">${i + 1}</div>
            <div class="coupled-info">
              <h5>${c.name}</h5>
              <p>${c.reason}</p>
            </div>
          </a>
        `).join('')}
      </div>
    `;
    resultsPanel.appendChild(section);
  }

  /* ---- Initialize ---- */
  function init() {
    buildToggle();
    injectTooltips();
    injectExamples();
    injectWhyPanel();
    injectKpiExplains();
    injectCoupled();

    // Restore saved preference
    try {
      const saved = window.__learnModePref;
      if (saved === '1') {
        toggleLearnMode();
      }
    } catch(e) {}

    // Re-inject KPI explains after calculate (they may be dynamically created)
    const calcBtn = document.getElementById('calcBtn');
    if (calcBtn) {
      // Keep the original onclick, just add a listener for Learn Mode re-injection
      calcBtn.addEventListener('click', () => {
        // Re-inject after a tick (results render)
        setTimeout(() => {
          injectKpiExplains();
          injectWhyPanel();
          injectCoupled();
        }, 150);
      });
    }
  }

  // Run when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
