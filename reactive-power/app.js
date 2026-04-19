/* ============================================================
   Reactive Power Estimator — IntelliTC Solutions
   Educational tool: explores the physics of reactive power
   ============================================================ */

/* ---- Theme Toggle ---- */
(function(){const toggles=document.querySelectorAll('[data-theme-toggle]'),r=document.documentElement;let d=localStorage.getItem('intellitc-theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');r.setAttribute('data-theme',d);function updateIcon(){const icon=d==='dark'?'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>':'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';toggles.forEach(function(t){t.innerHTML=icon;});}updateIcon();toggles.forEach(function(t){t.addEventListener('click',function(){d=d==='dark'?'light':'dark';r.setAttribute('data-theme',d);localStorage.setItem('intellitc-theme',d);t.setAttribute('aria-label','Switch to '+(d==='dark'?'light':'dark')+' mode');updateIcon();Object.values(window.__charts||{}).forEach(function(c){if(c&&c.update)c.update()});if(typeof onThemeChange==='function')onThemeChange();});});})();

/* ---- Utilities ---- */
function parseNum(s){return parseFloat(String(s).replace(/[^0-9.\-]/g,''))||0;}
function formatCurrency(n){if(Math.abs(n)>=1e6)return(n<0?'-':'')+'$'+(Math.abs(n)/1e6).toFixed(1)+'M';return(n<0?'-$':'$')+Math.abs(Math.round(n)).toLocaleString();}
function formatPct(n){return n.toFixed(1)+'%';}
function formatNum(n){return Math.round(n).toLocaleString();}
window.__charts={};
function getCS(){const s=getComputedStyle(document.documentElement);return{c1:s.getPropertyValue('--chart-1').trim(),c2:s.getPropertyValue('--chart-2').trim(),c3:s.getPropertyValue('--chart-3').trim(),c4:s.getPropertyValue('--chart-4').trim(),c5:s.getPropertyValue('--chart-5').trim(),c6:s.getPropertyValue('--chart-6').trim(),text:s.getPropertyValue('--color-text-muted').trim(),grid:s.getPropertyValue('--color-divider').trim(),surface:s.getPropertyValue('--color-surface').trim()};}
function destroyCharts(){Object.values(window.__charts).forEach(c=>{if(c&&c.destroy)c.destroy()});window.__charts={};}
function chartOpts(title,type){const cs=getCS();return{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true,labels:{color:cs.text,font:{family:'DM Sans'}}},title:{display:!!title,text:title,color:cs.text,font:{family:'DM Sans',size:14,weight:600}},tooltip:{backgroundColor:cs.surface,titleColor:cs.text,bodyColor:cs.text,borderColor:cs.grid,borderWidth:1}},scales:type==='pie'||type==='doughnut'||type==='radar'?undefined:{x:{ticks:{color:cs.text},grid:{color:cs.grid}},y:{ticks:{color:cs.text},grid:{color:cs.grid}}}};}

/* ---- Currency auto-format ---- */
document.querySelectorAll('input[data-currency]').forEach(inp=>{inp.addEventListener('blur',()=>{const v=parseNum(inp.value);if(v)inp.value=Math.round(v).toLocaleString();});});

/* ---- Appliance toggle styling ---- */
document.querySelectorAll('.appliance-item input[type="checkbox"]').forEach(cb=>{
  cb.addEventListener('change',()=>{cb.closest('.appliance-item').classList.toggle('active',cb.checked);});
});

/* ---- Panel toggle ---- */
const inputPanel=document.getElementById('inputPanel');
const resultsPanel=document.getElementById('resultsPanel');
function showResults(){inputPanel.classList.add('hidden');resultsPanel.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});}
function showInputs(){resultsPanel.classList.add('hidden');inputPanel.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});}
document.querySelectorAll('[data-back]').forEach(b=>b.addEventListener('click',showInputs));

/* ============================================================
   CORE CALCULATION
   Uses Steinmetz's power triangle math:
   S (Apparent) = P (Real) / PF
   Q (Reactive) = sqrt(S^2 - P^2)
   Phase Angle = arccos(PF)
   Required Capacitance = Q / (2 * pi * f * V^2)
   ============================================================ */
function calculate(){
  const monthlyBill = parseNum(document.getElementById('monthlyBill').value);
  const rate = parseNum(document.getElementById('elecRate').value) || 0.16;
  const meterType = document.getElementById('meterType').value;

  // Gather checked appliances
  const checks = document.querySelectorAll('.appliance-item input[type="checkbox"]:checked');
  const appliances = [];
  checks.forEach(cb => {
    appliances.push({
      name: cb.closest('.appliance-item').querySelector('.appliance-name').textContent,
      pf: parseFloat(cb.getAttribute('data-pf')),
      watts: parseFloat(cb.getAttribute('data-watts'))
    });
  });

  // Monthly kWh consumption
  const monthlyKWh = monthlyBill / rate;

  // Estimate blended power factor from appliance mix
  // Weight by wattage — heavier loads dominate the power factor
  let totalWatts = 0;
  let weightedPF = 0;
  const resistiveBaseWatts = monthlyKWh / 730 * 1000 * 0.3; // ~30% of avg draw is resistive (lights, electronics)
  const resistivePF = 0.98;
  totalWatts += resistiveBaseWatts;
  weightedPF += resistiveBaseWatts * resistivePF;

  appliances.forEach(a => {
    totalWatts += a.watts;
    weightedPF += a.watts * a.pf;
  });

  const blendedPF = totalWatts > 0 ? weightedPF / totalWatts : 0.85;
  const clampedPF = Math.max(0.50, Math.min(0.99, blendedPF));

  // Power triangle calculations
  const avgKW = monthlyKWh / 730; // average kW draw (730 hrs/month)
  const realPowerKW = avgKW;
  const apparentPowerKVA = realPowerKW / clampedPF;
  const reactivePowerKVAR = Math.sqrt(Math.max(0, apparentPowerKVA * apparentPowerKVA - realPowerKW * realPowerKW));
  const phaseAngleDeg = Math.acos(clampedPF) * (180 / Math.PI);

  // Corrected power factor (target 0.95)
  const targetPF = 0.95;
  const correctedApparentKVA = realPowerKW / targetPF;
  const correctedReactiveKVAR = Math.sqrt(Math.max(0, correctedApparentKVA * correctedApparentKVA - realPowerKW * realPowerKW));
  const requiredCapKVAR = reactivePowerKVAR - correctedReactiveKVAR;
  const correctedPhaseAngle = Math.acos(targetPF) * (180 / Math.PI);

  // Capacitor sizing: C = Q / (2*pi*f*V^2)  for single-phase 240V 60Hz
  const freq = 60;
  const voltage = 240;
  const requiredCapUF = (requiredCapKVAR * 1000) / (2 * Math.PI * freq * voltage * voltage) * 1e6;

  // Per-appliance reactive contribution
  const appContributions = appliances.map(a => {
    const q = a.watts / 1000 * Math.tan(Math.acos(a.pf));
    return { name: a.name, kvar: q };
  });
  appContributions.sort((a, b) => b.kvar - a.kvar);

  // ---- Populate KPIs ----
  document.getElementById('kpiPF').textContent = clampedPF.toFixed(2);
  const pfClass = clampedPF >= 0.90 ? 'kpi-positive' : clampedPF >= 0.75 ? '' : 'kpi-negative';
  document.getElementById('kpiPF').className = 'kpi-value ' + pfClass;
  document.getElementById('kpiPFDetail').textContent = clampedPF >= 0.90 ? 'Good efficiency' : clampedPF >= 0.75 ? 'Moderate — typical home' : 'Low — heavy inductive load';

  document.getElementById('kpiReactive').textContent = reactivePowerKVAR.toFixed(2) + ' kVAR';
  document.getElementById('kpiReactiveDetail').textContent = 'Oscillating energy doing no work';

  document.getElementById('kpiPhase').textContent = phaseAngleDeg.toFixed(1) + ' deg';
  document.getElementById('kpiPhaseDetail').textContent = 'Voltage-current lag (' + (phaseAngleDeg > 25 ? 'significant' : 'moderate') + ')';

  document.getElementById('kpiCorrected').textContent = targetPF.toFixed(2);
  document.getElementById('kpiCorrected').className = 'kpi-value kpi-positive';
  document.getElementById('kpiCorrectedDetail').textContent = 'With ' + requiredCapUF.toFixed(0) + ' uF capacitor (' + requiredCapKVAR.toFixed(2) + ' kVAR)';

  // ---- Triangle Legend ----
  const legend = document.getElementById('triangleLegend');
  legend.innerHTML = `
    <div class="triangle-item"><div class="triangle-dot" style="background:#20808D"></div><span class="triangle-label">Real Power</span><span class="triangle-val">${realPowerKW.toFixed(2)} kW</span></div>
    <div class="triangle-item"><div class="triangle-dot" style="background:#A84B2F"></div><span class="triangle-label">Reactive Power</span><span class="triangle-val">${reactivePowerKVAR.toFixed(2)} kVAR</span></div>
    <div class="triangle-item"><div class="triangle-dot" style="background:#1B474D"></div><span class="triangle-label">Apparent Power</span><span class="triangle-val">${apparentPowerKVA.toFixed(2)} kVA</span></div>
    <div class="triangle-item" style="margin-top:var(--space-2);padding-top:var(--space-2);border-top:1px solid var(--color-divider)"><div class="triangle-dot" style="background:#D19900"></div><span class="triangle-label">Phase Angle</span><span class="triangle-val">${phaseAngleDeg.toFixed(1)}&deg;</span></div>
    <div class="triangle-item"><div class="triangle-dot" style="background:#437A22"></div><span class="triangle-label">Capacitor Needed</span><span class="triangle-val">${requiredCapUF.toFixed(0)} uF</span></div>
  `;

  // ---- Charts ----
  destroyCharts();
  const cs = getCS();

  // Power Breakdown — grouped bar
  window.__charts.breakdown = new Chart(document.getElementById('chartBreakdown'), {
    type: 'bar',
    data: {
      labels: ['Current', 'After Correction'],
      datasets: [
        { label: 'Real Power (kW)', data: [realPowerKW, realPowerKW], backgroundColor: '#20808D' },
        { label: 'Reactive Power (kVAR)', data: [reactivePowerKVAR, correctedReactiveKVAR], backgroundColor: '#A84B2F' }
      ]
    },
    options: {
      ...chartOpts('', 'bar'),
      plugins: { ...chartOpts('', 'bar').plugins, legend: { display: true, labels: { color: cs.text, font: { family: 'DM Sans' } } } },
      scales: {
        x: { ticks: { color: cs.text }, grid: { display: false } },
        y: { ticks: { color: cs.text, callback: v => v.toFixed(1) + ' kW' }, grid: { color: cs.grid } }
      }
    }
  });

  // Appliance Contribution — horizontal bar
  if (appContributions.length > 0) {
    window.__charts.apps = new Chart(document.getElementById('chartAppliances'), {
      type: 'bar',
      data: {
        labels: appContributions.map(a => a.name),
        datasets: [{
          label: 'Reactive Power (kVAR)',
          data: appContributions.map(a => a.kvar),
          backgroundColor: appContributions.map((_, i) => [cs.c1, cs.c2, cs.c3, cs.c4, cs.c5, cs.c6][i % 6])
        }]
      },
      options: {
        ...chartOpts('', 'bar'),
        indexAxis: 'y',
        plugins: { ...chartOpts('', 'bar').plugins, legend: { display: false } },
        scales: {
          x: { ticks: { color: cs.text, callback: v => v.toFixed(2) }, grid: { color: cs.grid } },
          y: { ticks: { color: cs.text }, grid: { display: false } }
        }
      }
    });
  }

  // Power triangle chart — stacked bar showing the three components
  window.__charts.triangle = new Chart(document.getElementById('chartTriangle'), {
    type: 'doughnut',
    data: {
      labels: ['Real Power (kW)', 'Reactive Power (kVAR)'],
      datasets: [{
        data: [realPowerKW, reactivePowerKVAR],
        backgroundColor: ['#20808D', '#A84B2F'],
        borderWidth: 2,
        borderColor: cs.surface
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '55%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: cs.surface,
          titleColor: cs.text,
          bodyColor: cs.text,
          borderColor: cs.grid,
          borderWidth: 1,
          callbacks: { label: ctx => ctx.label + ': ' + ctx.parsed.toFixed(2) }
        }
      }
    }
  });

  showResults();
}
