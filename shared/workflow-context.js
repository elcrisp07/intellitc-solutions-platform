/* ============================================================
   Workflow Context — IntelliTC Solutions
   Handles: Return-to-workflow banner + Data carry-forward
   ============================================================ */
(function() {
  'use strict';

  // Workflow definitions (auto-generated)
  var WORKFLOWS = {
  "agent-cma": {
    "title": "Agent CMA Workflow",
    "steps": [
      {
        "label": "Step 1 \u2014 Determine property value",
        "calc": "cma",
        "step": 1
      },
      {
        "label": "Step 2 \u2014 Analyze seller proceeds",
        "calc": "seller-net-sheet",
        "step": 2
      },
      {
        "label": "Step 3 \u2014 Calculate deal economics",
        "calc": "commission",
        "step": 3
      },
      {
        "label": "Step 4 \u2014 Assess investment metrics",
        "calc": "investment-analysis",
        "step": 4
      },
      {
        "label": "Step 5 \u2014 Set the recommended price",
        "calc": "caprate",
        "step": 5
      }
    ],
    "totalSteps": 5,
    "file": "agent-cma.html"
  },
  "brrrr-pipeline": {
    "title": "BRRRR Analysis Pipeline",
    "steps": [
      {
        "label": "Step 1 \u2014 Determine after-repair value",
        "calc": "investment-analysis",
        "step": 1
      },
      {
        "label": "Step 2 \u2014 Estimate renovation costs",
        "calc": "fixflip",
        "step": 2
      },
      {
        "label": "Step 3 \u2014 Model acquisition financing",
        "calc": "private-money",
        "step": 3
      },
      {
        "label": "Step 4 \u2014 Plan the refinance",
        "calc": "refinance",
        "step": 4
      },
      {
        "label": "Step 5 \u2014 Validate long-term returns",
        "calc": "cashflow",
        "step": 5
      }
    ],
    "totalSteps": 5,
    "file": "brrrr-pipeline.html"
  },
  "fix-flip": {
    "title": "Fix & Flip Profitability",
    "steps": [
      {
        "label": "Step 1 \u2014 Estimate post-renovation value",
        "calc": "investment-analysis",
        "step": 1
      },
      {
        "label": "Step 2 \u2014 Budget the rehab",
        "calc": "fixflip",
        "step": 2
      },
      {
        "label": "Step 3 \u2014 Model short-term financing",
        "calc": "private-money",
        "step": 3
      },
      {
        "label": "Step 4 \u2014 Score total profit/ROI",
        "calc": "deal-grading",
        "step": 4
      }
    ],
    "totalSteps": 4,
    "file": "fix-flip.html"
  },
  "house-hacking": {
    "title": "House Hacking Blueprint",
    "steps": [
      {
        "label": "Step 1 \u2014 Determine buying power",
        "calc": "affordability",
        "step": 1
      },
      {
        "label": "Step 2 \u2014 Model your monthly obligation",
        "calc": "dti-stress-test",
        "step": 2
      },
      {
        "label": "Step 3 \u2014 Estimate rental income",
        "calc": "rental-analysis",
        "step": 3
      },
      {
        "label": "Step 4 \u2014 Calculate net housing cost",
        "calc": "homyshare-coliving",
        "step": 4
      },
      {
        "label": "Step 5 \u2014 Project when you live free",
        "calc": "cashflow",
        "step": 5
      }
    ],
    "totalSteps": 5,
    "file": "house-hacking.html"
  },
  "portfolio-growth": {
    "title": "Portfolio Growth Strategy",
    "steps": [
      {
        "label": "Step 1 \u2014 Assess current holdings",
        "calc": "portfolio-manager",
        "step": 1
      },
      {
        "label": "Step 2 \u2014 Calculate available equity",
        "calc": "home-equity",
        "step": 2
      },
      {
        "label": "Step 3 \u2014 Model tax-deferred growth",
        "calc": "1031-exchange",
        "step": 3
      },
      {
        "label": "Step 4 \u2014 Project future values",
        "calc": "sensitivity-grid",
        "step": 4
      },
      {
        "label": "Step 5 \u2014 Aggregate portfolio cash flow",
        "calc": "cashflow",
        "step": 5
      }
    ],
    "totalSteps": 5,
    "file": "portfolio-growth.html"
  },
  "rental-deep-dive": {
    "title": "Rental Property Deep Dive",
    "steps": [
      {
        "label": "Step 1 \u2014 Quick viability screening",
        "calc": "caprate",
        "step": 1
      },
      {
        "label": "Step 2 \u2014 Model all expenses",
        "calc": "cash-on-cash-breakdown",
        "step": 2
      },
      {
        "label": "Step 3 \u2014 Net monthly income",
        "calc": "cashflow",
        "step": 3
      },
      {
        "label": "Step 4 \u2014 Total return analysis",
        "calc": "real-estate-investment-analyzer",
        "step": 4
      }
    ],
    "totalSteps": 4,
    "file": "rental-deep-dive.html"
  },
  "seller-finance": {
    "title": "Seller Financing Deal Structure",
    "steps": [
      {
        "label": "Step 1 \u2014 Understand carrying costs",
        "calc": "true-cost-ownership",
        "step": 1
      },
      {
        "label": "Step 2 \u2014 Structure buyer/seller terms",
        "calc": "seller-financing",
        "step": 2
      },
      {
        "label": "Step 3 \u2014 Build the payment schedule",
        "calc": "dscr-loan",
        "step": 3
      },
      {
        "label": "Step 4 \u2014 Validate deal economics",
        "calc": "cashflow",
        "step": 4
      }
    ],
    "totalSteps": 4,
    "file": "seller-finance.html"
  },
  "subject-to": {
    "title": "Subject-To Acquisition",
    "steps": [
      {
        "label": "Step 1 \u2014 Analyze existing loan terms",
        "calc": "qualification-analysis",
        "step": 1
      },
      {
        "label": "Step 2 \u2014 Model the takeover structure",
        "calc": "subject-to",
        "step": 2
      },
      {
        "label": "Step 3 \u2014 Validate profitability",
        "calc": "cashflow",
        "step": 3
      },
      {
        "label": "Step 4 \u2014 Track equity accumulation",
        "calc": "rental-analysis",
        "step": 4
      }
    ],
    "totalSteps": 4,
    "file": "subject-to.html"
  }
};

  // ---- Read URL params ----
  var params = new URLSearchParams(window.location.search);
  var wfSlug = params.get('wf');
  var wfStep = parseInt(params.get('wfstep'), 10);

  if (!wfSlug || !WORKFLOWS[wfSlug]) return; // Not coming from a workflow

  var wf = WORKFLOWS[wfSlug];
  var currentStep = wf.steps.find(function(s) { return s.step === wfStep; });
  var nextStep = wf.steps.find(function(s) { return s.step === wfStep + 1; });
  var isLastStep = wfStep >= wf.totalSteps;

  // Store workflow context in sessionStorage so it persists through page reloads
  sessionStorage.setItem('itc_wf_active', JSON.stringify({
    slug: wfSlug,
    step: wfStep,
    title: wf.title,
    file: wf.file,
    totalSteps: wf.totalSteps
  }));

  // ---- 1. Inject Return-to-Workflow Banner ----
  var banner = document.createElement('div');
  banner.id = 'wf-banner';
  banner.setAttribute('role', 'navigation');
  banner.setAttribute('aria-label', 'Workflow progress');

  var stepLabel = currentStep ? currentStep.label : 'Step ' + wfStep;
  var progressPct = Math.round((wfStep / wf.totalSteps) * 100);

  var bannerHTML = '<div class="wf-banner-inner">' +
    '<div class="wf-banner-left">' +
      '<svg class="wf-banner-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>' +
      '<div class="wf-banner-text">' +
        '<span class="wf-banner-workflow">' + wf.title + '</span>' +
        '<span class="wf-banner-step">' + stepLabel + ' — Step ' + wfStep + ' of ' + wf.totalSteps + '</span>' +
      '</div>' +
    '</div>' +
    '<div class="wf-banner-right">' +
      '<div class="wf-banner-progress">' +
        '<div class="wf-banner-progress-bar" style="width:' + progressPct + '%"></div>' +
      '</div>' +
      '<a href="../workflows/' + wf.file + '" class="wf-banner-btn" title="Return to workflow">Return to Workflow ↩</a>' +
    '</div>' +
  '</div>';

  banner.innerHTML = bannerHTML;

  // Insert inside the header as a second row (stays sticky with the header)
  var header = document.querySelector('header.header');
  if (header) {
    header.appendChild(banner);
  } else {
    document.body.insertBefore(banner, document.body.firstChild);
  }

  // ---- 2. Data Carry-Forward System ----
  // On calculate(), save key results to localStorage keyed by workflow + step
  var storageKey = 'itc_wf_data_' + wfSlug;

  // Load any existing workflow data
  var wfData = {};
  try {
    wfData = JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch(e) {}

  // Pre-fill inputs from previous steps if available
  prefillFromPreviousSteps(wfData, wfStep);

  // Hook into the calculate function to save results
  var origCalc = window.calculate;
  if (typeof origCalc === 'function') {
    window.calculate = function() {
      origCalc.apply(this, arguments);
      // After calculation, save key results
      saveStepResults(wfSlug, wfStep);
      // Show "next step" prompt if not last step
      if (!isLastStep && nextStep) {
        showNextStepPrompt(nextStep, wfSlug, wf.file);
      } else if (isLastStep) {
        showWorkflowComplete(wf.title, wf.file, wfSlug);
      }
    };
  }

  function saveStepResults(slug, step) {
    // Capture all KPI values
    var kpis = {};
    document.querySelectorAll('.kpi-value').forEach(function(el) {
      var label = el.closest('.kpi-card');
      if (label) {
        var labelEl = label.querySelector('.kpi-label');
        if (labelEl) {
          kpis[labelEl.textContent.trim()] = el.textContent.trim();
        }
      }
    });

    // Capture all input values
    var inputs = {};
    document.querySelectorAll('#inputPanel input').forEach(function(el) {
      if (el.id) {
        inputs[el.id] = el.value;
      }
    });

    var data = {};
    try {
      data = JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch(e) {}

    data['step_' + step] = {
      kpis: kpis,
      inputs: inputs,
      timestamp: Date.now()
    };

    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  function prefillFromPreviousSteps(data, currentStepNum) {
    if (currentStepNum <= 1) return; // No previous data for step 1

    // Collect all previous results
    var prevResults = {};
    var prevInputs = {};
    for (var i = 1; i < currentStepNum; i++) {
      var stepData = data['step_' + i];
      if (stepData) {
        Object.assign(prevResults, stepData.kpis || {});
        Object.assign(prevInputs, stepData.inputs || {});
      }
    }

    if (Object.keys(prevResults).length === 0 && Object.keys(prevInputs).length === 0) return;

    // Smart field matching — try to pre-fill current inputs from previous outputs/inputs
    var fieldMap = {
      // KPI output -> input field mappings (common across calculators)
      'Monthly Cash Flow': ['monthlyIncome', 'monthlyCF'],
      'Cap Rate': ['capRate'],
      'Cash-on-Cash Return': ['cashOnCash', 'coc'],
      'NOI': ['noi', 'annualNOI'],
      'Monthly Payment': ['monthlyPayment', 'mortgagePayment'],
      'Max Purchase Price': ['purchasePrice', 'propertyValue'],
      'Estimated Value': ['propertyValue', 'purchasePrice', 'currentValue'],
      'Available Equity': ['equityAvailable'],
      'Net to Seller': ['purchasePrice'],
      'DSCR': ['dscr']
    };

    // Try to match previous inputs to current inputs by ID
    var currentInputs = document.querySelectorAll('#inputPanel input');
    var prefilled = [];

    currentInputs.forEach(function(input) {
      // First: try matching by same input ID from previous steps
      if (prevInputs[input.id] && !input.value.match(/[1-9]/)) {
        // Only prefill if current value looks like a default (0 or empty)
        return; // Don't overwrite non-zero defaults
      }

      // Match purchase price from previous property value outputs
      if (input.id === 'purchasePrice' || input.id === 'propertyValue' || input.id === 'currentValue') {
        var val = prevInputs['purchasePrice'] || prevInputs['propertyValue'] || prevInputs['currentValue'];
        if (val) {
          input.value = val;
          prefilled.push(input.id);
          highlightPrefilled(input);
        }
      }

      // Match interest rate
      if (input.id === 'interestRate' || input.id === 'rate') {
        var val = prevInputs['interestRate'] || prevInputs['rate'];
        if (val) {
          input.value = val;
          prefilled.push(input.id);
          highlightPrefilled(input);
        }
      }

      // Match down payment  
      if (input.id === 'downPayment' || input.id === 'downPct') {
        var val = prevInputs['downPayment'] || prevInputs['downPct'];
        if (val) {
          input.value = val;
          prefilled.push(input.id);
          highlightPrefilled(input);
        }
      }

      // Match loan term
      if (input.id === 'loanTerm' || input.id === 'term') {
        var val = prevInputs['loanTerm'] || prevInputs['term'];
        if (val) {
          input.value = val;
          prefilled.push(input.id);
          highlightPrefilled(input);
        }
      }

      // Match monthly rent
      if (input.id === 'monthlyIncome' || input.id === 'monthlyRent' || input.id === 'rent') {
        var val = prevInputs['monthlyIncome'] || prevInputs['monthlyRent'] || prevInputs['rent'];
        if (val) {
          input.value = val;
          prefilled.push(input.id);
          highlightPrefilled(input);
        }
      }
    });

    // Show info notice about prefilled data
    if (prefilled.length > 0) {
      showPrefillNotice(prefilled.length, currentStepNum);
    }
  }

  function highlightPrefilled(input) {
    input.style.transition = 'box-shadow .4s, border-color .4s';
    input.style.borderColor = 'var(--color-primary)';
    input.style.boxShadow = '0 0 0 3px var(--color-primary-surface)';
    setTimeout(function() {
      input.style.borderColor = '';
      input.style.boxShadow = '';
    }, 3000);
  }

  function showPrefillNotice(count, step) {
    var notice = document.createElement('div');
    notice.className = 'wf-prefill-notice';
    notice.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' +
      '<span>' + count + ' field' + (count > 1 ? 's' : '') + ' pre-filled from previous step' + (step > 2 ? 's' : '') + '</span>' +
      '<button class="wf-prefill-dismiss" aria-label="Dismiss">✕</button>';
    
    var panel = document.getElementById('inputPanel');
    if (panel) {
      var subtitle = panel.querySelector('.panel-subtitle');
      if (subtitle) {
        subtitle.parentNode.insertBefore(notice, subtitle.nextSibling);
      }
    }

    notice.querySelector('.wf-prefill-dismiss').addEventListener('click', function() {
      notice.style.opacity = '0';
      setTimeout(function() { notice.remove(); }, 300);
    });
  }

  function showNextStepPrompt(nextStep, slug, wfFile) {
    // Remove existing prompt if any
    var existing = document.getElementById('wf-next-prompt');
    if (existing) existing.remove();

    var prompt = document.createElement('div');
    prompt.id = 'wf-next-prompt';
    prompt.className = 'wf-next-prompt';
    
    var nextCalcHref = '../' + nextStep.calc + '/index.html?wf=' + slug + '&wfstep=' + nextStep.step;
    
    prompt.innerHTML = '<div class="wf-next-inner">' +
      '<div class="wf-next-check"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>' +
      '<div class="wf-next-text">' +
        '<span class="wf-next-done">Step ' + wfStep + ' complete</span>' +
        '<span class="wf-next-label">' + nextStep.label + '</span>' +
      '</div>' +
      '<div class="wf-next-actions">' +
        '<a href="' + nextCalcHref + '" target="_blank" class="wf-next-btn">Continue to Step ' + nextStep.step + ' →</a>' +
        '<a href="../workflows/' + wfFile + '" class="wf-next-back">Return to Workflow ↩</a>' +
      '</div>' +
    '</div>';

    // Insert after results panel
    var results = document.getElementById('resultsPanel');
    if (results) {
      results.parentNode.insertBefore(prompt, results.nextSibling);
      // Smooth scroll to prompt
      setTimeout(function() {
        prompt.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }

  function showWorkflowComplete(title, wfFile, slug) {
    var existing = document.getElementById('wf-next-prompt');
    if (existing) existing.remove();

    var prompt = document.createElement('div');
    prompt.id = 'wf-next-prompt';
    prompt.className = 'wf-next-prompt wf-complete';
    
    prompt.innerHTML = '<div class="wf-next-inner">' +
      '<div class="wf-next-check wf-complete-check"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>' +
      '<div class="wf-next-text">' +
        '<span class="wf-next-done wf-complete-title">🎉 Workflow Complete</span>' +
        '<span class="wf-next-label">You\'ve finished all steps of the ' + title + '.</span>' +
      '</div>' +
      '<div class="wf-next-actions">' +
        '<a href="../workflows/' + wfFile + '" class="wf-next-btn">Review Workflow ↩</a>' +
        '<button class="wf-next-back" onclick="localStorage.removeItem(\'itc_wf_data_' + slug + '\');this.textContent=\'Data cleared ✓\';this.disabled=true;">Clear Workflow Data</button>' +
      '</div>' +
    '</div>';

    var results = document.getElementById('resultsPanel');
    if (results) {
      results.parentNode.insertBefore(prompt, results.nextSibling);
      setTimeout(function() {
        prompt.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }

})();
