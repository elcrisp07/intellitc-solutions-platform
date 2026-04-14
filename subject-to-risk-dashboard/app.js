/* ============================================================
   Subject-To Risk Dashboard — IntelliTC Solutions
   Due-on-sale trigger score, land trust checklist, refi exit
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

/* ---- Hold period slider label ---- */
const holdSlider=document.getElementById('holdPeriod');
const holdVal=document.getElementById('holdPeriodVal');
if(holdSlider&&holdVal){holdSlider.addEventListener('input',()=>{holdVal.textContent=holdSlider.value+' yrs';});}

/* ---- Panel toggle ---- */
const inputPanel=document.getElementById('inputPanel');
const resultsPanel=document.getElementById('resultsPanel');
function showResults(){inputPanel.classList.add('hidden');resultsPanel.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});}
function showInputs(){resultsPanel.classList.add('hidden');inputPanel.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});}
document.querySelectorAll('[data-back]').forEach(b=>b.addEventListener('click',showInputs));

/* ============================================================
   RISK SCORING ENGINE
   ============================================================ */
const RISK_WEIGHTS = {
  loanStatus:    { label:'Loan Status',       current:0, '1-30':15, '30-60':30, '60+':45 },
  insuranceChange:{ label:'Insurance Change',  keep:0, investor:12, new:20 },
  titleMethod:   { label:'Title Method',       trust:0, direct:15, llc:10 },
  rateDiff:      { label:'Rate Differential',  fn: v => v<=1?0 : v<=2?4 : v<=3?8 : v<=4?14 : 20 },
  loanType:      { label:'Loan Type',          conventional:5, fha:8, va:6, usda:7, portfolio:3 },
  lenderSize:    { label:'Lender Size',        national:0, regional:4, 'credit-union':8, private:12 },
  timeSinceOrig: { label:'Loan Age',           fn: v => v>=7?0 : v>=5?2 : v>=3?5 : v>=1?8 : 10 }
};

function scoreRisk(){
  const scores = {};
  // Loan Status
  const ls = document.getElementById('loanStatus').value;
  scores.loanStatus = RISK_WEIGHTS.loanStatus[ls] || 0;
  // Insurance
  const ins = document.getElementById('insuranceChange').value;
  scores.insuranceChange = RISK_WEIGHTS.insuranceChange[ins] || 0;
  // Title method
  const tm = document.getElementById('titleMethod').value;
  scores.titleMethod = RISK_WEIGHTS.titleMethod[tm] || 0;
  // Rate diff
  const rd = parseNum(document.getElementById('rateDiff').value);
  scores.rateDiff = RISK_WEIGHTS.rateDiff.fn(rd);
  // Loan type
  const lt = document.getElementById('loanType').value;
  scores.loanType = RISK_WEIGHTS.loanType[lt] || 5;
  // Lender size
  const lz = document.getElementById('lenderSize').value;
  scores.lenderSize = RISK_WEIGHTS.lenderSize[lz] || 0;
  // Time since orig
  const tso = parseNum(document.getElementById('timeSinceOrig').value);
  scores.timeSinceOrig = RISK_WEIGHTS.timeSinceOrig.fn(tso);

  const total = Object.values(scores).reduce((a,b)=>a+b,0);
  // Cap at 100
  return { scores, total: Math.min(total, 100) };
}

function riskLevel(score){
  if(score<=30) return {level:'Low',cls:'low',color:'#22c55e'};
  if(score<=60) return {level:'Moderate',cls:'mod',color:'#eab308'};
  return {level:'High',cls:'high',color:'#ef4444'};
}

function maxForFactor(key){
  const w = RISK_WEIGHTS[key];
  if(w.fn) return key==='rateDiff'?20:10;
  return Math.max(...Object.entries(w).filter(([k])=>k!=='label').map(([,v])=>v));
}

/* ============================================================
   CHECKLIST
   ============================================================ */
const CHECKLIST_ITEMS = [
  { text:'Create revocable land trust (Garn-St. Germain protected)', tip:'A revocable inter vivos trust is explicitly protected under the Garn-St. Germain Act of 1982. The lender cannot enforce the due-on-sale clause for transfers into this type of trust where the borrower remains a beneficiary.' },
  { text:'Name trust with a generic name (not property address)', tip:'Using a generic trust name like "Sunrise Trust" rather than "123 Main St Trust" prevents easy identification if the lender searches public records. The trust name appears on the deed, so keep it neutral.' },
  { text:'Seller listed as initial beneficiary of the trust', tip:'Garn-St. Germain requires the borrower to remain a beneficiary. The seller must be listed as initial beneficiary to satisfy the federal statutory requirement before any beneficial interest assignment.' },
  { text:'Transfer deed into trust (recorded at county)', tip:'The deed transfer from the seller to the trust is the only public, recorded step. This appears as routine estate planning, not a sale — which is why it does not trigger the due-on-sale clause under federal law.' },
  { text:'Assign beneficial interest to investor/LLC (private, unrecorded)', tip:'The beneficial interest assignment is a private document between the trust parties. It is NOT recorded at the county recorder\'s office. This is the step that actually transfers control to the investor, but it happens privately.' },
  { text:'Maintain seller\'s existing homeowner\'s insurance policy', tip:'Changing insurance is one of the top 3 triggers for lender discovery. Many lenders receive automatic notifications when the named insured changes. Keep the seller\'s policy active or add the trust as an additional insured.' },
  { text:'Keep mortgage payments current — set up auto-pay', tip:'A performing loan gives the lender zero financial incentive to investigate your file. Set up automated payments from a dedicated bank account to ensure payments are never late. This is the single most important risk mitigation step.' },
  { text:'Do NOT contact the lender about the transfer', tip:'Proactively informing the lender about the ownership change invites scrutiny. There is no legal obligation to notify the lender of a trust transfer. Let the automated systems work in your favor — performing loans are rarely audited.' },
  { text:'Keep seller\'s name on all lender correspondence', tip:'Mail forwarding or address changes on lender correspondence can trigger review. Keep the seller\'s mailing address on file with the lender. Route statements and notices through the seller or a shared P.O. Box.' },
  { text:'Set up dedicated escrow account for mortgage payments', tip:'A dedicated bank account for mortgage payments creates a clear paper trail and ensures funds are always available. Set up automatic drafts from this account to the lender on a consistent date each month.' },
  { text:'Document all agreements between buyer and seller', tip:'Written agreements protect both parties. Document the purchase terms, beneficial interest assignment, payment responsibilities, insurance arrangements, and exit strategy. Have both parties sign and notarize where appropriate.' },
  { text:'Consult real estate attorney licensed in property state', tip:'Land trust laws vary by state. Some states (like Florida and Illinois) have well-established land trust statutes. Others may have different requirements. An attorney licensed in the property\'s state ensures your structure is legally sound.' }
];

function renderChecklist(){
  const ul = document.getElementById('checklistItems');
  ul.innerHTML = '';
  CHECKLIST_ITEMS.forEach((item, i)=>{
    const li = document.createElement('li');
    li.className = 'checklist-item';
    li.innerHTML = `
      <label><input type="checkbox" data-cl="${i}" ${getCheckState(i)?'checked':''}> ${item.text}</label>
      <span class="cl-info" data-tip="${i}">?</span>
    `;
    ul.appendChild(li);
  });
  // Bind events
  ul.querySelectorAll('input[type="checkbox"]').forEach(cb=>{
    cb.addEventListener('change', updateChecklistProgress);
  });
  // Tooltips
  ul.querySelectorAll('.cl-info').forEach(btn=>{
    btn.addEventListener('mouseenter', showClTip);
    btn.addEventListener('mouseleave', hideClTip);
    btn.addEventListener('focus', showClTip);
    btn.addEventListener('blur', hideClTip);
  });
  updateChecklistProgress();
}

function getCheckState(i){
  try{ const s=JSON.parse(localStorage.getItem('intellitc-risk-cl')||'{}'); return !!s[i]; }catch(e){return false;}
}

function saveCheckState(){
  const states={};
  document.querySelectorAll('#checklistItems input[type="checkbox"]').forEach(cb=>{
    states[cb.dataset.cl] = cb.checked;
  });
  localStorage.setItem('intellitc-risk-cl', JSON.stringify(states));
}

function updateChecklistProgress(){
  saveCheckState();
  const cbs = document.querySelectorAll('#checklistItems input[type="checkbox"]');
  const total = cbs.length;
  let checked = 0;
  cbs.forEach(cb=>{ if(cb.checked) checked++; });
  const pct = total>0 ? Math.round(checked/total*100) : 0;
  document.getElementById('clProgressFill').style.width = pct+'%';
  document.getElementById('clProgressText').textContent = checked+' of '+total+' complete';
  // Update KPI
  document.getElementById('kpiChecklist').textContent = checked+'/'+total;
  document.getElementById('kpiChecklistDetail').textContent = pct+'% complete';
}

let activeClTip = null;
function showClTip(e){
  hideClTip();
  const idx = e.currentTarget.dataset.tip;
  const item = CHECKLIST_ITEMS[idx];
  if(!item) return;
  const tip = document.createElement('div');
  tip.className = 'cl-tooltip show';
  tip.textContent = item.tip;
  const rect = e.currentTarget.getBoundingClientRect();
  document.body.appendChild(tip);
  tip.style.top = (rect.bottom + window.scrollY + 8) + 'px';
  tip.style.left = Math.min(rect.left, window.innerWidth - 320) + 'px';
  activeClTip = tip;
}
function hideClTip(){
  if(activeClTip){activeClTip.remove();activeClTip=null;}
}

/* ============================================================
   SVG GAUGE
   ============================================================ */
function renderGauge(score){
  const {level, cls, color} = riskLevel(score);
  const el = document.getElementById('riskGauge');
  // Semi-circle gauge: 180 degrees
  const radius = 80;
  const cx = 100, cy = 95;
  const circumference = Math.PI * radius;
  const pct = score / 100;
  const dashOffset = circumference * (1 - pct);

  el.innerHTML = `
    <svg viewBox="0 0 200 110">
      <path d="M 20 95 A 80 80 0 0 1 180 95" fill="none" stroke="var(--color-divider)" stroke-width="12" stroke-linecap="round"/>
      <path d="M 20 95 A 80 80 0 0 1 180 95" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round"
        stroke-dasharray="${circumference}" stroke-dashoffset="${dashOffset}" style="transition:stroke-dashoffset .8s ease"/>
    </svg>
    <div class="gauge-label risk-${cls}">${score}</div>
  `;
}

/* ============================================================
   RISK BREAKDOWN TABLE
   ============================================================ */
function renderRiskBreakdown(scores, total){
  const tbody = document.getElementById('riskBody');
  tbody.innerHTML = '';
  const {level, cls, color} = riskLevel(total);
  Object.entries(scores).forEach(([key, pts])=>{
    const maxPts = maxForFactor(key);
    const label = RISK_WEIGHTS[key].label;
    const pct = maxPts>0 ? Math.round(pts/maxPts*100) : 0;
    const barColor = pts===0?'#22c55e': pts<=maxPts*0.5?'#eab308':'#ef4444';
    tbody.innerHTML += `<tr>
      <td>${label}</td>
      <td><div class="risk-bar"><div class="risk-bar-fill" style="width:${pct}%;background:${barColor}"></div></div></td>
      <td>${pts}</td>
    </tr>`;
  });
}

function renderRecommendation(total){
  const el = document.getElementById('riskRecommendation');
  const {level, cls} = riskLevel(total);
  let text = '';
  if(total<=30){
    text = `<strong>Low Risk — Proceed with Standard Precautions</strong>
Your risk profile is favorable. The combination of a performing loan, proper trust structure, and conservative approach means lender enforcement is extremely unlikely. Maintain current practices: keep payments on time, don't change insurance, and avoid contacting the lender. Monitor annually.`;
  } else if(total<=60){
    text = `<strong>Moderate Risk — Enhanced Structuring Required</strong>
Several risk factors need attention. Review each factor scoring above zero in the breakdown above and take corrective action where possible. Priority items: ensure payments are automated, verify insurance is in the seller's name, and confirm your title method uses a land trust (not direct deed). Consider shortening your hold period and accelerating your refinance timeline.`;
  } else {
    text = `<strong>High Risk — Consider Alternative Strategies</strong>
Your current deal structure has significant due-on-sale exposure. Before proceeding, address the highest-scoring risk factors immediately. If the loan is delinquent, bring it current before any transfer. If using direct deed, restructure to a land trust. If the rate differential is large and the lender is a small institution, strongly consider seller financing or a DSCR loan as safer alternatives. Consult a real estate attorney.`;
  }
  el.innerHTML = `<div class="recommendation-box ${cls}">${text}</div>`;
}

/* ============================================================
   REFINANCE EXIT CALCULATIONS
   ============================================================ */
function calcRefi(){
  const balance = parseNum(document.getElementById('mortBalance').value);
  const value = parseNum(document.getElementById('propValue').value);
  const currentRate = parseNum(document.getElementById('currentRate').value)/100;
  const holdYrs = parseInt(document.getElementById('holdPeriod').value)||5;
  const appreciation = parseNum(document.getElementById('appreciation').value)/100;
  const creditBucket = document.getElementById('creditScore').value;

  // Estimated refi rate based on credit
  const refiRates = {excellent:0.065, good:0.07, fair:0.075, below:0.085};
  const refiRate = refiRates[creditBucket] || 0.07;

  // Current monthly payment (P&I on remaining balance, assume 30yr original)
  const cmr = currentRate/12;
  const cn = 30*12;
  const currentPmt = cmr>0 ? balance*(cmr*Math.pow(1+cmr,cn))/(Math.pow(1+cmr,cn)-1) : balance/cn;

  // Build year-by-year projections
  const yearData = [];
  let bal = balance;
  for(let y=1; y<=holdYrs; y++){
    // Property appreciation
    const futureValue = value * Math.pow(1+appreciation, y);
    // Approximate amortization: principal paid in year
    let principalPaid = 0;
    for(let m=0;m<12;m++){
      const interest = bal * cmr;
      const principal = currentPmt - interest;
      if(principal > 0) { principalPaid += principal; bal -= principal; }
    }
    const equity = futureValue - Math.max(bal,0);
    const ltv = Math.max(bal,0)/futureValue*100;
    yearData.push({year:y, value:futureValue, balance:Math.max(bal,0), equity, ltv, principalPaid});
  }

  // Refi calculations at end of hold period
  const finalData = yearData[yearData.length-1] || {value,balance:balance,equity:value-balance,ltv:balance/value*100};
  const refiBal = finalData.balance;
  const rmr = refiRate/12;
  const rn = 30*12;
  const refiPmt = rmr>0 ? refiBal*(rmr*Math.pow(1+rmr,rn))/(Math.pow(1+rmr,rn)-1) : refiBal/rn;
  const pmtChange = refiPmt - currentPmt;

  return {yearData, currentPmt, refiPmt, pmtChange, refiRate, refiBal, finalData, holdYrs, balance, value, creditBucket};
}

/* ============================================================
   MAIN CALCULATE FUNCTION
   ============================================================ */
function calculate(){
  // 1. Risk Score
  const {scores, total} = scoreRisk();
  const {level, cls, color} = riskLevel(total);

  // KPI: Risk Score
  document.getElementById('kpiRisk').textContent = total;
  document.getElementById('kpiRisk').className = 'kpi-value risk-'+cls;
  document.getElementById('kpiRiskDetail').textContent = level+' Risk';

  // Render gauge, breakdown, recommendation
  renderGauge(total);
  renderRiskBreakdown(scores, total);
  renderRecommendation(total);

  // 2. Checklist (render interactively)
  renderChecklist();

  // 3. Refinance Exit
  const refi = calcRefi();

  // KPI: Equity
  document.getElementById('kpiEquity').textContent = formatCurrency(refi.finalData.equity);
  document.getElementById('kpiEquityDetail').textContent = formatPct(100-refi.finalData.ltv)+' equity | LTV '+formatPct(refi.finalData.ltv);

  // KPI: Payment Change
  const pmtSign = refi.pmtChange >= 0 ? '+' : '';
  document.getElementById('kpiPayment').textContent = pmtSign+formatCurrency(refi.pmtChange);
  document.getElementById('kpiPayment').className = 'kpi-value '+(refi.pmtChange>0?'kpi-negative':'kpi-positive');
  document.getElementById('kpiPaymentDetail').textContent = formatCurrency(refi.currentPmt)+' → '+formatCurrency(refi.refiPmt)+'/mo';

  // 4. Charts
  destroyCharts();
  const cs = getCS();

  // Radar chart — risk factors
  const radarLabels = Object.keys(scores).map(k=>RISK_WEIGHTS[k].label);
  const radarData = Object.keys(scores).map(k=>scores[k]);
  const radarMax = Object.keys(scores).map(k=>maxForFactor(k));

  window.__charts.radar = new Chart(document.getElementById('chartRadar'),{
    type:'radar',
    data:{
      labels: radarLabels,
      datasets:[{
        label:'Your Score',
        data: radarData,
        borderColor: color,
        backgroundColor: color+'33',
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointRadius: 4
      },{
        label:'Max Possible',
        data: radarMax,
        borderColor: cs.grid,
        backgroundColor: 'transparent',
        borderDash:[5,3],
        pointRadius: 0
      }]
    },
    options:{
      ...chartOpts('','radar'),
      scales:{
        r:{
          beginAtZero:true,
          ticks:{color:cs.text, backdropColor:'transparent'},
          grid:{color:cs.grid},
          pointLabels:{color:cs.text, font:{family:'DM Sans',size:11}}
        }
      }
    }
  });

  // Equity timeline chart
  const eqLabels = refi.yearData.map(d=>'Year '+d.year);
  const eqValues = refi.yearData.map(d=>d.value);
  const eqBal = refi.yearData.map(d=>d.balance);
  const eqEquity = refi.yearData.map(d=>d.equity);

  window.__charts.equity = new Chart(document.getElementById('chartEquity'),{
    type:'line',
    data:{
      labels: eqLabels,
      datasets:[
        {label:'Property Value', data:eqValues, borderColor:cs.c1, backgroundColor:cs.c1+'20', fill:true, tension:0.3},
        {label:'Loan Balance', data:eqBal, borderColor:cs.c2, borderDash:[5,3], tension:0.3},
        {label:'Equity', data:eqEquity, borderColor:cs.c6, backgroundColor:cs.c6+'20', fill:true, tension:0.3}
      ]
    },
    options:{
      ...chartOpts('','line'),
      scales:{
        x:{ticks:{color:cs.text},grid:{color:cs.grid}},
        y:{ticks:{color:cs.text, callback:v=>formatCurrency(v)},grid:{color:cs.grid}}
      }
    }
  });

  // Decision matrix chart — horizontal bar comparing 3 exit strategies
  const refiCost = refi.refiBal * 0.025; // ~2.5% closing costs
  const sellNet = refi.finalData.value * 0.93 - refi.finalData.balance; // 7% selling costs
  const holdNet = refi.finalData.equity;

  window.__charts.decision = new Chart(document.getElementById('chartDecision'),{
    type:'bar',
    data:{
      labels:['Refinance','Sell Property','Continue Holding'],
      datasets:[{
        label:'Net Position',
        data:[refi.finalData.equity - refiCost, sellNet, holdNet],
        backgroundColor:[cs.c1, cs.c2, cs.c6],
        borderRadius:4
      }]
    },
    options:{
      ...chartOpts('','bar'),
      indexAxis:'y',
      plugins:{...chartOpts('','bar').plugins, legend:{display:false}},
      scales:{
        x:{ticks:{color:cs.text, callback:v=>formatCurrency(v)},grid:{color:cs.grid}},
        y:{ticks:{color:cs.text,font:{family:'DM Sans',size:12}},grid:{display:false}}
      }
    }
  });

  // Refi summary
  const summaryEl = document.getElementById('refiSummary');
  const bestYear = refi.yearData.find(d=>d.ltv<=80);
  const refiReady = bestYear ? `You reach 80% LTV (conventional refi threshold) in <strong>Year ${bestYear.year}</strong>.` : `At current appreciation, you will not reach 80% LTV within your ${refi.holdYrs}-year hold. Consider a DSCR loan (which may accept higher LTV) or extending your hold period.`;

  summaryEl.innerHTML = `<div class="recommendation-box low">
    <strong>Refinance Readiness</strong>
    ${refiReady} Your estimated refi rate is <strong>${formatPct(refi.refiRate*100)}</strong> based on a ${refi.creditBucket} credit profile.
    Current payment: <strong>${formatCurrency(refi.currentPmt)}/mo</strong> → Refi payment: <strong>${formatCurrency(refi.refiPmt)}/mo</strong> (${refi.pmtChange>=0?'+':''}${formatCurrency(refi.pmtChange)}).
  </div>`;

  // Decision matrix table
  const dmBody = document.getElementById('decisionBody');
  const strategies = [
    { name:'Refinance (Conventional)', cost:formatCurrency(refiCost), pmt:formatCurrency(refi.refiPmt)+'/mo', net:formatCurrency(refi.finalData.equity - refiCost), best: refi.finalData.ltv<=80 },
    { name:'Sell Property', cost:formatCurrency(refi.finalData.value*0.07), pmt:'—', net:formatCurrency(sellNet), best: sellNet > (refi.finalData.equity - refiCost) && refi.finalData.ltv > 80 },
    { name:'Continue Holding (Subject-To)', cost:'—', pmt:formatCurrency(refi.currentPmt)+'/mo', net:formatCurrency(holdNet), best: false }
  ];
  // Find best
  const nets = [refi.finalData.equity - refiCost, sellNet, holdNet];
  const bestIdx = nets.indexOf(Math.max(...nets));
  dmBody.innerHTML = strategies.map((s,i)=>`<tr class="${i===bestIdx?'decision-best':''}">
    <td>${s.name}${i===bestIdx?' ✓':''}</td><td>${s.cost}</td><td>${s.pmt}</td><td>${s.net}</td>
  </tr>`).join('');

  showResults();
}
