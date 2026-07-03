/* ============================================================
   MobileHome Blueprint — Land + New HUD-Code Home = Retail Exit
   IntelliTC Solutions — Hidden Gem #18
   ============================================================ */

/* ---- Theme Toggle ---- */
(function(){const toggles=document.querySelectorAll('[data-theme-toggle]'),r=document.documentElement;let d=localStorage.getItem('intellitc-theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');r.setAttribute('data-theme',d);function updateIcon(){const icon=d==='dark'?'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>':'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';toggles.forEach(function(t){t.innerHTML=icon;});}updateIcon();toggles.forEach(function(t){t.addEventListener('click',function(){d=d==='dark'?'light':'dark';r.setAttribute('data-theme',d);localStorage.setItem('intellitc-theme',d);t.setAttribute('aria-label','Switch to '+(d==='dark'?'light':'dark')+' mode');updateIcon();Object.values(window.__charts||{}).forEach(function(c){if(c&&c.update)c.update()});if(typeof onThemeChange==='function')onThemeChange();});});})();

/* ---- Utilities ---- */
function parseNum(s){return parseFloat(String(s).replace(/[^0-9.\-]/g,''))||0;}
function formatCurrency(n){if(Math.abs(n)>=1e6)return(n<0?'-':'')+'$'+(Math.abs(n)/1e6).toFixed(2)+'M';if(Math.abs(n)>=1e3)return(n<0?'-':'')+'$'+(Math.abs(n)/1e3).toFixed(1)+'K';return(n<0?'-$':'$')+Math.abs(Math.round(n)).toLocaleString();}
function formatCurrencyFull(n){return(n<0?'-$':'$')+Math.abs(Math.round(n)).toLocaleString();}
function formatPct(n){return n.toFixed(1)+'%';}
window.__charts={};
function getCS(){const s=getComputedStyle(document.documentElement);return{c1:s.getPropertyValue('--chart-1').trim()||'#20808D',c2:s.getPropertyValue('--chart-2').trim()||'#A84B2F',c3:s.getPropertyValue('--chart-3').trim()||'#1B474D',c4:s.getPropertyValue('--chart-4').trim()||'#BCE2E7',c5:s.getPropertyValue('--chart-5').trim()||'#944454',c6:s.getPropertyValue('--chart-6').trim()||'#FFC553',primary:s.getPropertyValue('--color-primary').trim()||'#01696F',text:s.getPropertyValue('--color-text-muted').trim(),grid:s.getPropertyValue('--color-divider').trim(),surface:s.getPropertyValue('--color-surface').trim()};}
function destroyCharts(){Object.values(window.__charts).forEach(c=>{if(c&&c.destroy)c.destroy()});window.__charts={};}

/* ---- Currency auto-format ---- */
document.querySelectorAll('input[data-currency]').forEach(inp=>{inp.addEventListener('blur',()=>{const v=parseNum(inp.value);if(v)inp.value=Math.round(v).toLocaleString();});});

/* ---- Panel toggle ---- */
const inputPanel=document.getElementById('inputPanel');
const resultsPanel=document.getElementById('resultsPanel');
function showResults(){inputPanel.classList.add('hidden');resultsPanel.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});}
function showInputs(){resultsPanel.classList.add('hidden');inputPanel.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});}
document.querySelectorAll('[data-back]').forEach(b=>b.addEventListener('click',showInputs));

/* ---- Auto-adjust: septic cost by type ---- */
document.getElementById('septicType').addEventListener('change', function(){
  const map = {conv:10000, atu:15000, sewer:3500};
  const v = map[this.value];
  if (v) document.getElementById('septicCost').value = v.toLocaleString();
});

/* ---- Auto-adjust: foundation cost by type ---- */
document.getElementById('foundationType').addEventListener('change', function(){
  const map = {pier:5200, slab:7800, permanent:9800};
  const v = map[this.value];
  if (v) document.getElementById('foundationCost').value = v.toLocaleString();
  // No cert cost for non-permanent foundations
  if (this.value !== 'permanent') document.getElementById('engineerCert').value = '0';
  else if (parseNum(document.getElementById('engineerCert').value) === 0) document.getElementById('engineerCert').value = '850';
});

/* ---- Auto-adjust: financing rate by class ---- */
document.getElementById('financing').addEventListener('change', function(){
  const map = {cash:0, hard:11, line:8.5, real:7.5};
  const v = map[this.value];
  if (v !== undefined) document.getElementById('rate').value = v;
});

/* ---- Live chattel uplift preview ---- */
function updateChattelPreview(){
  const exit = parseNum(document.getElementById('exitPrice').value);
  const on = document.getElementById('chattelToReal').checked;
  const foundation = document.getElementById('foundationType').value;
  // Uplift only real if foundation is permanent AND toggle is on
  const eligible = on && foundation === 'permanent';
  const uplift = eligible ? Math.round(exit * 0.18) : 0;
  const el = document.getElementById('chattelUpliftPreview');
  if (eligible) {
    el.textContent = '+' + formatCurrencyFull(uplift) + ' uplift';
    el.style.color = 'var(--color-primary)';
  } else {
    el.textContent = 'Chattel exit — no real-property uplift';
    el.style.color = 'var(--color-text-muted)';
  }
}
['chattelToReal','foundationType','exitPrice'].forEach(id=>{
  const el = document.getElementById(id);
  el.addEventListener('change', updateChattelPreview);
  el.addEventListener('input', updateChattelPreview);
});
updateChattelPreview();

/* ============================================================
   CORE CALCULATION
   ============================================================ */
function calculate(){
  // ---- Inputs ----
  const landPrice   = parseNum(document.getElementById('landPrice').value);
  const zoning      = document.getElementById('zoning').value;
  const floodZone   = document.getElementById('floodZone').value;
  const backTax     = parseNum(document.getElementById('backTax').value);
  const timberExempt= document.getElementById('timberExempt').value === 'yes';

  const homeType    = document.getElementById('homeType').value;
  const homeCost    = parseNum(document.getElementById('homeCost').value);
  const bedrooms    = parseNum(document.getElementById('bedrooms').value);
  const setupCost   = parseNum(document.getElementById('setupCost').value);

  const clearing    = parseNum(document.getElementById('clearing').value);
  const driveway    = parseNum(document.getElementById('driveway').value);
  const septicType  = document.getElementById('septicType').value;
  const septicCost  = parseNum(document.getElementById('septicCost').value);
  const well        = parseNum(document.getElementById('well').value);
  const powerTap    = parseNum(document.getElementById('powerTap').value);

  const foundationType = document.getElementById('foundationType').value;
  const foundationCost = parseNum(document.getElementById('foundationCost').value);
  const engineerCert   = parseNum(document.getElementById('engineerCert').value);

  const skirting    = parseNum(document.getElementById('skirting').value);
  const deckPorch   = parseNum(document.getElementById('deckPorch').value);
  const contingency = parseNum(document.getElementById('contingency').value) / 100;
  const exitPrice   = parseNum(document.getElementById('exitPrice').value);
  const daysToExit  = Math.max(1, parseNum(document.getElementById('daysToExit').value));
  const closingCost = parseNum(document.getElementById('closingCost').value) / 100;

  const financing   = document.getElementById('financing').value;
  const rate        = parseNum(document.getElementById('rate').value) / 100;
  const holdMonths  = Math.max(1, parseNum(document.getElementById('holdMonths').value));
  const ltv         = parseNum(document.getElementById('ltv').value) / 100;

  const chattelToReal = document.getElementById('chattelToReal').checked;

  // ---- Subtotals ----
  const landTotal   = landPrice + backTax;
  const homeTotal   = homeCost + setupCost;
  const siteTotal   = clearing + driveway;
  const utilTotal   = septicCost + well + powerTap;
  const foundTotal  = foundationCost + engineerCert;
  const finishTotal = skirting + deckPorch;

  const baseCost = landTotal + homeTotal + siteTotal + utilTotal + foundTotal + finishTotal;
  const contDollar = baseCost * contingency;

  // Carrying interest on financed portion for hold period
  const financedAmount = baseCost * ltv;
  const carry = financedAmount * rate * (holdMonths / 12);

  const allIn = baseCost + contDollar + carry;

  // ---- Chattel-to-real uplift (18% of exit price when eligible) ----
  const permanentAndConverted = chattelToReal && foundationType === 'permanent';
  const upliftRatio = permanentAndConverted ? 0.18 : 0;
  const upliftDollars = Math.round(exitPrice * upliftRatio);
  const effectiveClass = permanentAndConverted ? 'Real Property' : 'Chattel';
  const effectiveRate = permanentAndConverted ? 6.75 : 11.0;

  // ---- Sell-side ----
  const sellSideCosts = exitPrice * closingCost;
  const netProfit = exitPrice - allIn - sellSideCosts;
  const grossSpread = exitPrice - allIn;

  // ---- Annualized ROI ----
  const capitalAtRisk = baseCost * (1 - ltv) + contDollar; // equity portion
  const holdYears = holdMonths / 12 + (daysToExit / 365);
  const roi = capitalAtRisk > 0 ? (netProfit / capitalAtRisk) / Math.max(0.25, holdYears) : 0;

  // ---- KPI writes ----
  document.getElementById('kpiAllin').textContent  = formatCurrencyFull(allIn);
  document.getElementById('kpiAllinDetail').textContent = 'Land + Home + Site + Foundation + Cont + Carry';
  document.getElementById('kpiExit').textContent = formatCurrencyFull(exitPrice);
  document.getElementById('kpiExitDetail').textContent = bedrooms + ' BR retail comp bracket';
  document.getElementById('kpiNet').textContent = formatCurrencyFull(netProfit);
  document.getElementById('kpiNetDetail').textContent = 'After ' + (closingCost*100).toFixed(1) + '% sell-side costs';
  document.getElementById('kpiROI').textContent = formatPct(roi * 100);
  document.getElementById('kpiROIDetail').textContent = 'Annualized on capital at risk';
  document.getElementById('kpiDays').textContent = daysToExit + 'd';
  document.getElementById('kpiDaysDetail').textContent = daysToExit <= 90 ? 'Elite pace' : (daysToExit <= 150 ? 'Healthy pace' : 'Cut price at day 60/90');
  document.getElementById('kpiUplift').textContent = permanentAndConverted ? formatCurrencyFull(upliftDollars) : '$0';
  document.getElementById('kpiUpliftDetail').textContent = permanentAndConverted ? 'Chattel → Real conversion' : 'Foundation blocks conversion';
  document.getElementById('kpiFinClass').textContent = effectiveClass + ' · ' + effectiveRate.toFixed(2) + '%';
  document.getElementById('kpiFinClassDetail').textContent = permanentAndConverted ? 'Conventional / GSE eligible' : 'Chattel buyer pool only';
  document.getElementById('kpiSpread').textContent = formatCurrencyFull(grossSpread);
  document.getElementById('kpiSpreadDetail').textContent = 'Before sell-side closing costs';

  // ---- Verdict ----
  const verdictH = document.getElementById('verdictHeadline');
  const verdictE = document.getElementById('verdictExplainer');
  if (netProfit <= 0) {
    verdictH.textContent = 'This deal loses money at these numbers.';
    verdictE.textContent = 'The retail exit at ' + formatCurrencyFull(exitPrice) + ' does not cover the ' + formatCurrencyFull(allIn) + ' all-in cost plus sell-side closing. Cut land price, cut foundation class, or find a higher-comp market.';
  } else if (roi >= 0.20 && permanentAndConverted) {
    verdictH.textContent = 'Strong real-property MH play — clear to close.';
    verdictE.textContent = 'The ' + formatPct(roi*100) + ' annualized ROI clears the healthy target with the permanent-foundation, real-property exit. Chattel-to-real conversion adds an estimated ' + formatCurrencyFull(upliftDollars) + ' of appraised uplift and opens conventional and GSE financing to your buyers.';
  } else if (roi >= 0.15 && !permanentAndConverted) {
    verdictH.textContent = 'Workable chattel exit — but you\'re leaving money on the table.';
    verdictE.textContent = 'The ' + formatPct(roi*100) + ' annualized ROI is workable but you\'re capped at the chattel buyer pool. Converting to real property with a permanent foundation typically adds 15-25% of appraised value and drops the buyer\'s financing rate 3-5 points. Model it.';
  } else {
    verdictH.textContent = 'Thin margin — this deal needs one lever moved.';
    verdictE.textContent = 'Annualized ROI of ' + formatPct(roi*100) + ' is below the healthy 20% target. The three biggest levers: land price, septic/utility trifecta, and chattel-to-real conversion. Move one meaningfully or pass.';
  }

  // ---- Red-flag chips ----
  const flags = [];
  if (zoning === 'unclear') flags.push({t:'Zoning: variance required', c:'flag-alert'});
  else if (zoning === 'mixed') flags.push({t:'Zoning: check setbacks', c:'flag-warn'});
  else flags.push({t:'Zoning: MH allowed', c:'flag-ok'});
  if (floodZone === 've') flags.push({t:'Flood: VE (coastal high)', c:'flag-alert'});
  else if (floodZone === 'ae' || floodZone === 'a') flags.push({t:'Flood: elevation required', c:'flag-warn'});
  else flags.push({t:'Flood: zone X', c:'flag-ok'});
  if (timberExempt) flags.push({t:'Ag/Timber rollback risk', c:'flag-warn'});
  if (septicType === 'atu') flags.push({t:'Septic: ATU premium', c:'flag-warn'});
  if (foundationType !== 'permanent') flags.push({t:'Foundation: chattel only', c:'flag-warn'});
  else if (chattelToReal) flags.push({t:'Real-property conversion', c:'flag-ok'});
  if (daysToExit > 180) flags.push({t:'DOM > 180 days', c:'flag-alert'});
  const flagStrip = document.getElementById('flagStrip');
  flagStrip.innerHTML = flags.map(f=>'<span class="flag-chip '+f.c+'">'+f.t+'</span>').join('');

  // ---- Waterfall chart ----
  destroyCharts();
  const cs = getCS();
  const wfCtx = document.getElementById('chartWaterfall').getContext('2d');
  const wfLabels = ['Land','Home','Site','Utilities','Foundation','Finishes','Cont+Carry','All-In','Exit'];
  const wfValues = [landTotal, homeTotal, siteTotal, utilTotal, foundTotal, finishTotal, Math.round(contDollar+carry), Math.round(allIn), exitPrice];
  const wfColors = [cs.c3, cs.c1, cs.c6, cs.c4, cs.c5, cs.c2, '#7A7974', cs.primary, cs.c1];
  window.__charts.wf = new Chart(wfCtx, {
    type:'bar',
    data:{
      labels: wfLabels,
      datasets:[{ label:'Amount', data: wfValues, backgroundColor: wfColors, borderRadius: 4 }]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false}, tooltip:{callbacks:{label:function(ctx){return formatCurrencyFull(ctx.raw);}}}},
      scales:{
        y:{ ticks:{ color: cs.text, callback:function(v){return formatCurrency(v);}}, grid:{color: cs.grid}},
        x:{ ticks:{ color: cs.text, font:{size:11}}, grid:{display:false}}
      }
    }
  });

  // ---- Timeline (Day 0-180 phase bars) ----
  const timelineHtml = [
    {label:'Day 0-30',   pct:16, cost:landTotal, note:'Land close'},
    {label:'Day 15-60',  pct:25, cost:siteTotal+utilTotal-septicCost-well, note:'Clearing + power'},
    {label:'Day 30-75',  pct:25, cost:septicCost+well, note:'Septic + well'},
    {label:'Day 60-120', pct:33, cost:foundTotal, note:'Foundation + cert'},
    {label:'Day 90-150', pct:33, cost:homeTotal, note:'Home delivered + set up'},
    {label:'Day 120-180',pct:33, cost:finishTotal+Math.round(carry), note:'Finishes + list'}
  ].map(r =>
    '<div class="tl-row"><span class="tl-label">'+r.label+'</span><div class="tl-bar-wrap"><div class="tl-bar" style="width:'+r.pct+'%"></div></div><span class="tl-cost">'+formatCurrencyFull(r.cost)+'</span></div>'
  ).join('');
  document.getElementById('timelineList').innerHTML = timelineHtml;

  // ---- Days-on-market sensitivity ----
  // Carry cost per day, then price cut model at day 60/90 baseline
  const carryPerDay = (financedAmount * rate) / 365;
  const sensCases = [
    {days:60,  cut:0,    note:'On time'},
    {days:90,  cut:0,    note:'On time'},
    {days:120, cut:0.03, note:'-3% cut day 60'},
    {days:180, cut:0.06, note:'-3% cut day 60 + day 90'}
  ];
  const sensHtml = sensCases.map(c => {
    const extraDays = Math.max(0, c.days - daysToExit);
    // For sensitivity we compute AS IF the deal took THIS many days
    const testDays = c.days;
    const cutExit = exitPrice * (1 - c.cut);
    const holdCarry = carryPerDay * testDays;
    const sensAllin = baseCost + contDollar + holdCarry;
    const sensClosing = cutExit * closingCost;
    const sensNet = cutExit - sensAllin - sensClosing;
    const winner = sensNet > 0 && testDays <= 90;
    return '<div class="sens-card'+(winner?' winner':'')+'">'
      + '<p class="sens-days">'+c.days+' days</p>'
      + '<p class="sens-net">'+formatCurrencyFull(sensNet)+'</p>'
      + '<p class="sens-note">'+c.note+(c.cut>0?' · '+formatPct(-c.cut*100):' · full price')+'</p>'
      + '</div>';
  }).join('');
  document.getElementById('sensGrid').innerHTML = sensHtml;

  showResults();
}

/* ---- On theme change, re-render charts to pick up new palette ---- */
function onThemeChange(){ if (!resultsPanel.classList.contains('hidden')) calculate(); }
