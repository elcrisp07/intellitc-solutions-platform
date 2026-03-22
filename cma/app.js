/* ============================================================
   Comp Analysis / CMA Calculator — IntelliTC Solutions
   ============================================================ */

/* ---- Theme Toggle ---- */
(function(){const t=document.querySelector('[data-theme-toggle]'),r=document.documentElement;let d=matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';r.setAttribute('data-theme',d);if(t){updateIcon();t.addEventListener('click',()=>{d=d==='dark'?'light':'dark';r.setAttribute('data-theme',d);t.setAttribute('aria-label','Switch to '+(d==='dark'?'light':'dark')+' mode');updateIcon();Object.values(window.__charts||{}).forEach(c=>{if(c&&c.update)c.update()});if(typeof onThemeChange==='function')onThemeChange();});} function updateIcon(){if(!t)return;t.innerHTML=d==='dark'?'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>':'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';}})();

/* ---- Utilities ---- */
function parseNum(s){return parseFloat(String(s).replace(/[^0-9.\-]/g,''))||0;}
function formatCurrency(n){if(Math.abs(n)>=1e6)return(n<0?'-':'')+'$'+(Math.abs(n)/1e6).toFixed(1)+'M';return(n<0?'-$':'$')+Math.abs(Math.round(n)).toLocaleString();}
function formatPct(n){return n.toFixed(1)+'%';}
function formatNum(n){return Math.round(n).toLocaleString();}
window.__charts={};
function getCS(){const s=getComputedStyle(document.documentElement);return{c1:s.getPropertyValue('--chart-1').trim(),c2:s.getPropertyValue('--chart-2').trim(),c3:s.getPropertyValue('--chart-3').trim(),c4:s.getPropertyValue('--chart-4').trim(),c5:s.getPropertyValue('--chart-5').trim(),c6:s.getPropertyValue('--chart-6').trim(),c7:s.getPropertyValue('--chart-7').trim(),c8:s.getPropertyValue('--chart-8').trim(),text:s.getPropertyValue('--color-text-muted').trim(),grid:s.getPropertyValue('--color-divider').trim(),surface:s.getPropertyValue('--color-surface').trim()};}
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

/* ==== STEP NAVIGATION ==== */
let currentStep = 1;
const stepBtns = document.querySelectorAll('.cma-step-btn');
const steps = [document.getElementById('step1'), document.getElementById('step2'), document.getElementById('step3')];

function goStep(n) {
  // Mark completed steps
  for (let i = 1; i < n; i++) {
    const btn = document.querySelector(`.cma-step-btn[data-step="${i}"]`);
    if (btn) btn.classList.add('done');
  }
  currentStep = n;
  stepBtns.forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector(`.cma-step-btn[data-step="${n}"]`);
  if (activeBtn) activeBtn.classList.add('active');
  steps.forEach(s => s.classList.remove('active'));
  if (steps[n - 1]) steps[n - 1].classList.add('active');

  // When entering step 2, ensure at least 3 comps exist
  if (n === 2 && compCount < 3) {
    while (compCount < 3) addComp();
  }
  // When entering step 3, build adjustment table
  if (n === 3) buildAdjustmentTable();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

stepBtns.forEach(btn => {
  btn.addEventListener('click', () => goStep(parseInt(btn.dataset.step)));
});

/* ==== COMPARABLE SALES MANAGEMENT ==== */
let compCount = 0;
const MAX_COMPS = 6;
const MIN_COMPS = 3;

function addComp() {
  if (compCount >= MAX_COMPS) return;
  compCount++;
  const idx = compCount;
  const container = document.getElementById('compCards');
  const card = document.createElement('div');
  card.className = 'comp-card';
  card.id = `comp${idx}`;
  card.innerHTML = `
    <div class="comp-card-header">
      <span class="comp-card-title">Comparable #${idx}</span>
      ${idx > MIN_COMPS ? `<button class="comp-remove" onclick="removeComp(${idx})" title="Remove this comp">✕ Remove</button>` : ''}
    </div>
    <div class="comp-fields">
      <div class="field">
        <label for="comp${idx}Address">Address</label>
        <input type="text" id="comp${idx}Address" placeholder="456 Oak Ave">
      </div>
      <div class="field">
        <label for="comp${idx}Price">Sale Price</label>
        <div class="input-with-unit"><span class="unit">$</span><input type="text" id="comp${idx}Price" value="" inputmode="numeric" data-currency placeholder="350,000"></div>
      </div>
      <div class="field">
        <label for="comp${idx}Date">Sale Date</label>
        <input type="date" id="comp${idx}Date" value="${getDefaultDate()}">
      </div>
      <div class="field">
        <label for="comp${idx}Sqft">Square Feet</label>
        <div class="input-with-unit"><input type="text" id="comp${idx}Sqft" value="" inputmode="numeric" data-currency placeholder="1,800"><span class="unit">sf</span></div>
      </div>
      <div class="field">
        <label for="comp${idx}Beds">Bedrooms</label>
        <input type="text" id="comp${idx}Beds" value="" inputmode="numeric" placeholder="3">
      </div>
      <div class="field">
        <label for="comp${idx}Baths">Bathrooms</label>
        <input type="text" id="comp${idx}Baths" value="" inputmode="decimal" placeholder="2">
      </div>
      <div class="field">
        <label for="comp${idx}Year">Year Built</label>
        <input type="text" id="comp${idx}Year" value="" inputmode="numeric" placeholder="2000">
      </div>
      <div class="field">
        <label for="comp${idx}Lot">Lot Size (sf)</label>
        <div class="input-with-unit"><input type="text" id="comp${idx}Lot" value="" inputmode="numeric" data-currency placeholder="7,500"><span class="unit">sf</span></div>
      </div>
      <div class="field">
        <label for="comp${idx}Condition">Condition</label>
        <select id="comp${idx}Condition" class="cond-select">
          <option value="1">Poor</option>
          <option value="2">Fair</option>
          <option value="3" selected>Average</option>
          <option value="4">Good</option>
          <option value="5">Excellent</option>
        </select>
      </div>
      <div class="field">
        <label for="comp${idx}Garage">Garage</label>
        <input type="text" id="comp${idx}Garage" value="" inputmode="numeric" placeholder="2">
      </div>
      <div class="field">
        <label for="comp${idx}Pool">Pool</label>
        <select id="comp${idx}Pool" class="cond-select">
          <option value="0" selected>No</option>
          <option value="1">Yes</option>
        </select>
      </div>
      <div class="field">
        <label for="comp${idx}Basement">Finished Basement (sf)</label>
        <div class="input-with-unit"><input type="text" id="comp${idx}Basement" value="" inputmode="numeric" data-currency placeholder="0"><span class="unit">sf</span></div>
      </div>
    </div>
  `;
  container.appendChild(card);

  // Re-attach currency formatters for new inputs
  card.querySelectorAll('input[data-currency]').forEach(inp => {
    inp.addEventListener('blur', () => { const v = parseNum(inp.value); if (v) inp.value = Math.round(v).toLocaleString(); });
  });

  updateAddBtn();
}

function removeComp(idx) {
  const card = document.getElementById(`comp${idx}`);
  if (card) card.remove();
  reindexComps();
  updateAddBtn();
}

function reindexComps() {
  const cards = document.querySelectorAll('#compCards .comp-card');
  compCount = cards.length;
  cards.forEach((card, i) => {
    const num = i + 1;
    card.id = `comp${num}`;
    card.querySelector('.comp-card-title').textContent = `Comparable #${num}`;
    // Update all IDs and labels within the card
    card.querySelectorAll('[id]').forEach(el => {
      el.id = el.id.replace(/comp\d+/, `comp${num}`);
    });
    card.querySelectorAll('label[for]').forEach(el => {
      el.setAttribute('for', el.getAttribute('for').replace(/comp\d+/, `comp${num}`));
    });
    // Update remove button
    const removeBtn = card.querySelector('.comp-remove');
    if (removeBtn) {
      if (num <= MIN_COMPS) {
        removeBtn.remove();
      } else {
        removeBtn.setAttribute('onclick', `removeComp(${num})`);
      }
    } else if (num > MIN_COMPS) {
      const header = card.querySelector('.comp-card-header');
      const btn = document.createElement('button');
      btn.className = 'comp-remove';
      btn.setAttribute('onclick', `removeComp(${num})`);
      btn.title = 'Remove this comp';
      btn.textContent = '✕ Remove';
      header.appendChild(btn);
    }
  });
}

function updateAddBtn() {
  const btn = document.getElementById('addCompBtn');
  if (compCount >= MAX_COMPS) {
    btn.style.display = 'none';
  } else {
    btn.style.display = '';
    btn.textContent = `+ Add Comparable Sale (${compCount}/${MAX_COMPS})`;
  }
}

function getDefaultDate() {
  const d = new Date();
  d.setMonth(d.getMonth() - 2);
  return d.toISOString().slice(0, 10);
}

/* ==== READ SUBJECT & COMPS ==== */
function getSubject() {
  return {
    address: document.getElementById('subAddress').value || 'Subject Property',
    sqft: parseNum(document.getElementById('subSqft').value),
    beds: parseNum(document.getElementById('subBeds').value),
    baths: parseNum(document.getElementById('subBaths').value),
    year: parseNum(document.getElementById('subYear').value),
    lot: parseNum(document.getElementById('subLot').value),
    condition: parseInt(document.getElementById('subCondition').value),
    garage: parseNum(document.getElementById('subGarage').value),
    pool: parseInt(document.getElementById('subPool').value),
    basement: parseNum(document.getElementById('subBasement').value),
  };
}

function getComps() {
  const comps = [];
  for (let i = 1; i <= compCount; i++) {
    const card = document.getElementById(`comp${i}`);
    if (!card) continue;
    const price = parseNum(document.getElementById(`comp${i}Price`).value);
    if (price <= 0) continue; // skip comps without a price
    comps.push({
      idx: i,
      address: document.getElementById(`comp${i}Address`).value || `Comp #${i}`,
      price,
      date: document.getElementById(`comp${i}Date`).value,
      sqft: parseNum(document.getElementById(`comp${i}Sqft`).value),
      beds: parseNum(document.getElementById(`comp${i}Beds`).value),
      baths: parseNum(document.getElementById(`comp${i}Baths`).value),
      year: parseNum(document.getElementById(`comp${i}Year`).value),
      lot: parseNum(document.getElementById(`comp${i}Lot`).value),
      condition: parseInt(document.getElementById(`comp${i}Condition`).value),
      garage: parseNum(document.getElementById(`comp${i}Garage`).value),
      pool: parseInt(document.getElementById(`comp${i}Pool`).value),
      basement: parseNum(document.getElementById(`comp${i}Basement`).value),
    });
  }
  return comps;
}

/* ==== ADJUSTMENT CALCULATIONS ==== */
const CONDITION_LABELS = ['', 'Poor', 'Fair', 'Average', 'Good', 'Excellent'];

// Adjustment value estimators (reasonable residential defaults)
const ADJ_RATES = {
  sqftPerSf: 0, // Will be calculated from comps or override
  bedAdj: 10000,
  bathAdj: 15000,
  yearAdj: 1500, // per year
  lotPerSf: 2, // per sqft of lot
  conditionAdj: 0.05, // 5% per level
  garageAdj: 10000,
  poolAdj: 20000,
  basementPerSf: 30, // per sqft of finished basement
};

function calcPricePerSf(comps) {
  if (comps.length === 0) return 150; // fallback
  const vals = comps.filter(c => c.sqft > 0).map(c => c.price / c.sqft);
  if (vals.length === 0) return 150;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function monthsBetween(dateStr) {
  if (!dateStr) return 0;
  const sale = new Date(dateStr);
  const now = new Date();
  return (now.getFullYear() - sale.getFullYear()) * 12 + (now.getMonth() - sale.getMonth());
}

function calcAdjustments(subject, comp, psfOverride) {
  const psf = psfOverride > 0 ? psfOverride : calcPricePerSf([comp]);
  const adjustments = {};

  // Time/market adjustment
  const months = monthsBetween(comp.date);
  const mktRate = parseNum(document.getElementById('mktAppreciation').value) / 100;
  adjustments.time = Math.round(comp.price * mktRate * months);

  // Square footage
  const sqftDiff = subject.sqft - comp.sqft;
  adjustments.sqft = Math.round(sqftDiff * psf);

  // Bedrooms
  adjustments.beds = Math.round((subject.beds - comp.beds) * ADJ_RATES.bedAdj);

  // Bathrooms
  adjustments.baths = Math.round((subject.baths - comp.baths) * ADJ_RATES.bathAdj);

  // Year built (age difference)
  adjustments.year = Math.round((subject.year - comp.year) * ADJ_RATES.yearAdj);

  // Lot size
  adjustments.lot = Math.round((subject.lot - comp.lot) * ADJ_RATES.lotPerSf);

  // Condition
  const condDiff = subject.condition - comp.condition;
  adjustments.condition = Math.round(comp.price * ADJ_RATES.conditionAdj * condDiff);

  // Garage
  adjustments.garage = Math.round((subject.garage - comp.garage) * ADJ_RATES.garageAdj);

  // Pool
  adjustments.pool = Math.round((subject.pool - comp.pool) * ADJ_RATES.poolAdj);

  // Finished basement
  adjustments.basement = Math.round((subject.basement - comp.basement) * ADJ_RATES.basementPerSf);

  // Net adjustment
  adjustments.net = Object.values(adjustments).reduce((a, b) => a + b, 0);
  adjustments.adjPrice = comp.price + adjustments.net;

  return adjustments;
}

/* ==== ADJUSTMENT TABLE (Step 3) ==== */
let adjOverrides = {}; // { "comp1_sqft": 5000, ... }

function buildAdjustmentTable() {
  const subject = getSubject();
  const comps = getComps();

  if (comps.length === 0) {
    document.getElementById('adjTable').innerHTML = '<tr><td style="padding:var(--space-4);color:var(--color-text-muted)">No comps with sale prices entered. Go back and enter at least 3 comparable sales.</td></tr>';
    return;
  }

  const psfOverride = parseNum(document.getElementById('priceSqft').value);
  const avgPsf = psfOverride > 0 ? psfOverride : calcPricePerSf(comps);

  const rows = [
    { key: 'time', label: 'Time/Market', sub: 'Months since sale × appreciation' },
    { key: 'sqft', label: 'Square Footage', sub: `${formatNum(subject.sqft)} sf subject · $${Math.round(avgPsf)}/sf` },
    { key: 'beds', label: 'Bedrooms', sub: `${subject.beds} BR subject · $${formatNum(ADJ_RATES.bedAdj)}/BR` },
    { key: 'baths', label: 'Bathrooms', sub: `${subject.baths} BA subject · $${formatNum(ADJ_RATES.bathAdj)}/BA` },
    { key: 'year', label: 'Year Built', sub: `${subject.year} subject · $${formatNum(ADJ_RATES.yearAdj)}/yr` },
    { key: 'lot', label: 'Lot Size', sub: `${formatNum(subject.lot)} sf subject · $${ADJ_RATES.lotPerSf}/sf` },
    { key: 'condition', label: 'Condition', sub: `${CONDITION_LABELS[subject.condition]} subject · 5% per level` },
    { key: 'garage', label: 'Garage Spaces', sub: `${subject.garage} spaces subject · $${formatNum(ADJ_RATES.garageAdj)} each` },
    { key: 'pool', label: 'Pool', sub: `${subject.pool ? 'Yes' : 'No'} subject · $${formatNum(ADJ_RATES.poolAdj)}` },
    { key: 'basement', label: 'Finished Basement', sub: `${formatNum(subject.basement)} sf subject · $${ADJ_RATES.basementPerSf}/sf` },
  ];

  // Calculate all adjustments
  const allAdj = comps.map(c => calcAdjustments(subject, c, avgPsf));

  let html = '<thead><tr><th style="min-width:160px">Adjustment</th><th style="min-width:100px">Subject</th>';
  comps.forEach((c, i) => { html += `<th style="min-width:110px">Comp #${c.idx}</th>`; });
  html += '</tr></thead><tbody>';

  // Sale price row
  html += '<tr><td><span class="row-label">Sale Price</span></td><td>—</td>';
  comps.forEach(c => { html += `<td style="font-family:'JetBrains Mono',monospace;font-weight:600">${formatCurrency(c.price)}</td>`; });
  html += '</tr>';

  // Subject values for display
  const subjectVals = {
    time: '—',
    sqft: formatNum(subject.sqft) + ' sf',
    beds: subject.beds,
    baths: subject.baths,
    year: subject.year,
    lot: formatNum(subject.lot) + ' sf',
    condition: CONDITION_LABELS[subject.condition],
    garage: subject.garage,
    pool: subject.pool ? 'Yes' : 'No',
    basement: formatNum(subject.basement) + ' sf',
  };

  // Adjustment rows
  rows.forEach(row => {
    html += `<tr><td><span class="row-label">${row.label}</span><br><span class="row-sub">${row.sub}</span></td>`;
    html += `<td style="font-size:var(--text-sm);color:var(--color-text-muted)">${subjectVals[row.key]}</td>`;
    comps.forEach((c, i) => {
      const autoVal = allAdj[i][row.key];
      const overrideKey = `comp${c.idx}_${row.key}`;
      const val = adjOverrides[overrideKey] !== undefined ? adjOverrides[overrideKey] : autoVal;
      const cls = val > 0 ? 'cell-pos' : val < 0 ? 'cell-neg' : 'cell-neutral';
      html += `<td><input class="adj-input" type="text" value="${val.toLocaleString()}" data-key="${overrideKey}" data-auto="${autoVal}" onchange="onAdjChange(this)"><br><span class="${cls}" style="font-size:11px">${val > 0 ? '+' : ''}${formatCurrency(val)}</span></td>`;
    });
    html += '</tr>';
  });

  // Net adjustment row
  html += '<tr class="total-row"><td><span class="row-label">Net Adjustment</span></td><td>—</td>';
  comps.forEach((c, i) => {
    const net = calcNetFromOverrides(subject, c, allAdj[i], avgPsf);
    const cls = net > 0 ? 'cell-pos' : net < 0 ? 'cell-neg' : 'cell-neutral';
    html += `<td class="${cls}">${net > 0 ? '+' : ''}${formatCurrency(net)}</td>`;
  });
  html += '</tr>';

  // Adjusted price row
  html += '<tr class="total-row"><td><span class="row-label">Adjusted Sale Price</span></td><td>—</td>';
  comps.forEach((c, i) => {
    const net = calcNetFromOverrides(subject, c, allAdj[i], avgPsf);
    html += `<td style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--color-primary)">${formatCurrency(c.price + net)}</td>`;
  });
  html += '</tr>';

  html += '</tbody>';
  document.getElementById('adjTable').innerHTML = html;
}

function calcNetFromOverrides(subject, comp, autoAdj, avgPsf) {
  const keys = ['time', 'sqft', 'beds', 'baths', 'year', 'lot', 'condition', 'garage', 'pool', 'basement'];
  let net = 0;
  keys.forEach(k => {
    const overrideKey = `comp${comp.idx}_${k}`;
    net += adjOverrides[overrideKey] !== undefined ? adjOverrides[overrideKey] : autoAdj[k];
  });
  return net;
}

function onAdjChange(el) {
  const key = el.dataset.key;
  const val = parseNum(el.value);
  adjOverrides[key] = val;
  buildAdjustmentTable(); // Rebuild to update totals
}

/* ==== MAIN CALCULATE ==== */
function calculate() {
  const subject = getSubject();
  const comps = getComps();

  if (comps.length < 3) {
    alert('Please enter at least 3 comparable sales with sale prices to generate a CMA.');
    goStep(2);
    return;
  }

  const psfOverride = parseNum(document.getElementById('priceSqft').value);
  const avgPsf = psfOverride > 0 ? psfOverride : calcPricePerSf(comps);

  // Calculate adjusted prices
  const results = comps.map(c => {
    const autoAdj = calcAdjustments(subject, c, avgPsf);
    const net = calcNetFromOverrides(subject, c, autoAdj, avgPsf);
    return {
      comp: c,
      autoAdj,
      netAdj: net,
      adjPrice: c.price + net,
      adjPsf: subject.sqft > 0 ? (c.price + net) / subject.sqft : 0,
    };
  });

  const adjPrices = results.map(r => r.adjPrice);
  const minVal = Math.min(...adjPrices);
  const maxVal = Math.max(...adjPrices);
  const meanVal = adjPrices.reduce((a, b) => a + b, 0) / adjPrices.length;

  // Weighted mean (weight more recent sales and closer sqft comps higher)
  let wSum = 0, wWeight = 0;
  results.forEach(r => {
    const months = monthsBetween(r.comp.date);
    const sqftDiff = Math.abs(subject.sqft - r.comp.sqft);
    const timeW = Math.max(0.5, 1 - months * 0.03);
    const sizeW = Math.max(0.5, 1 - sqftDiff / (subject.sqft || 1) * 0.5);
    const w = timeW * sizeW;
    wSum += r.adjPrice * w;
    wWeight += w;
  });
  const weightedMean = wWeight > 0 ? wSum / wWeight : meanVal;

  // Confidence score
  const spread = maxVal - minVal;
  const spreadPct = meanVal > 0 ? (spread / meanVal) * 100 : 0;
  let confidence = 100;
  // Deduct for spread
  confidence -= Math.min(40, spreadPct * 3);
  // Deduct for few comps
  if (comps.length < 4) confidence -= 15;
  if (comps.length < 5) confidence -= 10;
  // Deduct for old comps
  const avgMonths = comps.reduce((a, c) => a + monthsBetween(c.date), 0) / comps.length;
  if (avgMonths > 6) confidence -= 10;
  if (avgMonths > 12) confidence -= 10;
  confidence = Math.max(10, Math.min(100, Math.round(confidence)));

  const confLevel = confidence >= 70 ? 'High' : confidence >= 45 ? 'Moderate' : 'Low';
  const confClass = confidence >= 70 ? 'conf-high' : confidence >= 45 ? 'conf-med' : 'conf-low';

  // Avg adjusted PSF
  const avgAdjPsf = results.reduce((a, r) => a + r.adjPsf, 0) / results.length;

  // ---- Populate results ----
  document.getElementById('valEstimate').textContent = formatCurrency(weightedMean);
  document.getElementById('valSpread').textContent = `Range: ${formatCurrency(minVal)} — ${formatCurrency(maxVal)}`;
  document.getElementById('confLabel').textContent = `${confLevel} Confidence (${confidence}%)`;
  document.getElementById('confLabel').className = 'confidence-label';
  const confFill = document.getElementById('confFill');
  confFill.style.width = confidence + '%';
  confFill.className = 'confidence-fill ' + confClass;

  // KPIs
  document.getElementById('kpiComps').textContent = comps.length;
  document.getElementById('kpiCompsDetail').textContent = comps.length >= 5 ? 'Strong sample' : comps.length >= 4 ? 'Good sample' : 'Minimum sample';
  document.getElementById('kpiPSF').textContent = '$' + Math.round(avgAdjPsf).toLocaleString();
  document.getElementById('kpiPSFDetail').textContent = 'Adjusted avg across comps';
  document.getElementById('kpiRange').textContent = formatCurrency(spread);
  document.getElementById('kpiRangeDetail').textContent = `${formatCurrency(minVal)} to ${formatCurrency(maxVal)}`;
  document.getElementById('kpiSpread').textContent = formatPct(spreadPct);
  document.getElementById('kpiSpreadDetail').textContent = spreadPct < 10 ? 'Tight — high confidence' : spreadPct < 20 ? 'Normal range' : 'Wide — review comps';

  // ---- Charts ----
  destroyCharts();
  const cs = getCS();
  const compLabels = results.map(r => r.comp.address.length > 18 ? r.comp.address.slice(0, 16) + '…' : r.comp.address);

  // Chart 1: Adjusted vs Raw
  window.__charts.adj = new Chart(document.getElementById('chartAdj'), {
    type: 'bar',
    data: {
      labels: compLabels,
      datasets: [
        { label: 'Raw Sale Price', data: results.map(r => r.comp.price), backgroundColor: cs.c3 + '99', borderColor: cs.c3, borderWidth: 1 },
        { label: 'Adjusted Price', data: results.map(r => r.adjPrice), backgroundColor: cs.c1, borderColor: cs.c1, borderWidth: 1 },
      ]
    },
    options: {
      ...chartOpts('', 'bar'),
      plugins: { ...chartOpts('', 'bar').plugins, legend: { display: true, labels: { color: cs.text, font: { family: 'DM Sans' } } } },
      scales: {
        x: { ticks: { color: cs.text, font: { size: 11 } }, grid: { display: false } },
        y: { ticks: { color: cs.text, callback: v => formatCurrency(v) }, grid: { color: cs.grid } }
      }
    }
  });

  // Chart 2: Adjustment breakdown stacked bar
  const adjKeys = ['time', 'sqft', 'beds', 'baths', 'year', 'lot', 'condition', 'garage', 'pool', 'basement'];
  const adjLabels = ['Time/Market', 'Sq Footage', 'Bedrooms', 'Bathrooms', 'Year Built', 'Lot Size', 'Condition', 'Garage', 'Pool', 'Basement'];
  const adjColors = [cs.c1, cs.c2, cs.c3, cs.c4, cs.c5, cs.c6, cs.c7, cs.c8, cs.c1 + '80', cs.c2 + '80'];

  const datasets = adjKeys.map((key, ki) => ({
    label: adjLabels[ki],
    data: results.map(r => {
      const overrideKey = `comp${r.comp.idx}_${key}`;
      return adjOverrides[overrideKey] !== undefined ? adjOverrides[overrideKey] : r.autoAdj[key];
    }),
    backgroundColor: adjColors[ki],
  }));

  window.__charts.breakdown = new Chart(document.getElementById('chartBreakdown'), {
    type: 'bar',
    data: { labels: compLabels, datasets },
    options: {
      ...chartOpts('', 'bar'),
      plugins: {
        ...chartOpts('', 'bar').plugins,
        legend: { display: true, position: 'bottom', labels: { color: cs.text, font: { family: 'DM Sans', size: 10 }, boxWidth: 12 } },
        tooltip: { ...chartOpts('', 'bar').plugins.tooltip, callbacks: { label: ctx => `${ctx.dataset.label}: ${formatCurrency(ctx.raw)}` } }
      },
      scales: {
        x: { stacked: true, ticks: { color: cs.text, font: { size: 11 } }, grid: { display: false } },
        y: { stacked: true, ticks: { color: cs.text, callback: v => formatCurrency(v) }, grid: { color: cs.grid } }
      }
    }
  });

  // ---- Detail table ----
  const tbody = document.getElementById('detailBody');
  tbody.innerHTML = results.map(r => {
    const netCls = r.netAdj > 0 ? 'kpi-positive' : r.netAdj < 0 ? 'kpi-negative' : '';
    return `<tr>
      <td>${r.comp.address}</td>
      <td class="text-right">${formatCurrency(r.comp.price)}</td>
      <td class="text-right">${r.comp.sqft > 0 ? '$' + Math.round(r.comp.price / r.comp.sqft).toLocaleString() : '—'}</td>
      <td class="text-right ${netCls}">${r.netAdj > 0 ? '+' : ''}${formatCurrency(r.netAdj)}</td>
      <td class="text-right" style="font-weight:600">${formatCurrency(r.adjPrice)}</td>
      <td class="text-right">${subject.sqft > 0 ? '$' + Math.round(r.adjPrice / subject.sqft).toLocaleString() : '—'}</td>
    </tr>`;
  }).join('');

  // Mean row
  tbody.innerHTML += `<tr style="font-weight:700;border-top:2px solid var(--color-text)">
    <td>Weighted Mean</td><td></td><td></td><td></td>
    <td class="text-right" style="color:var(--color-primary)">${formatCurrency(weightedMean)}</td>
    <td class="text-right">${subject.sqft > 0 ? '$' + Math.round(weightedMean / subject.sqft).toLocaleString() : '—'}</td>
  </tr>`;

  // ---- Feed grid ----
  buildFeedGrid(weightedMean);

  showResults();
}

/* ==== FEED INTO OTHER CALCULATORS ==== */
function buildFeedGrid(value) {
  const grid = document.getElementById('feedGrid');
  const coupled = window.LEARN_DATA && window.LEARN_DATA.coupled ? window.LEARN_DATA.coupled : [];
  grid.innerHTML = coupled.map(c => `
    <button class="feed-btn" onclick="feedValue('${c.folder}', ${Math.round(value)}, '${c.name}')">
      <span>
        <strong>${c.name}</strong><br>
        <span style="font-size:12px;color:var(--color-text-muted)">${c.reason}</span>
      </span>
      <span class="feed-arrow">→</span>
    </button>
  `).join('');
}

function feedValue(folder, value, name) {
  // Copy value to clipboard
  navigator.clipboard.writeText(value.toString()).then(() => {
    showToast(`${formatCurrency(value)} copied! Open ${name} calculator to paste.`);
  }).catch(() => {
    // Fallback
    const t = document.createElement('textarea');
    t.value = value.toString();
    document.body.appendChild(t);
    t.select();
    document.execCommand('copy');
    document.body.removeChild(t);
    showToast(`${formatCurrency(value)} copied! Open ${name} calculator to paste.`);
  });

  // Open the calculator in a new tab
  setTimeout(() => {
    window.open(`../${folder}/`, '_blank');
  }, 300);
}

/* ---- Toast notification ---- */
function showToast(msg) {
  let toast = document.getElementById('cmaToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cmaToast';
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--color-text);color:var(--color-bg);padding:12px 24px;border-radius:var(--radius-md);font:500 var(--text-sm)/1.4 "DM Sans",sans-serif;z-index:999;opacity:0;transition:opacity .3s;box-shadow:0 4px 12px rgba(0,0,0,.25);max-width:90vw;text-align:center;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}
