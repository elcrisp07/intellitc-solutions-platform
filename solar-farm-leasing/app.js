/* ============================================================
   Solar Farm Leasing Calculator — IntelliTC Solutions
   ============================================================ */

/* ---- Theme Toggle ---- */
(function(){const toggles=document.querySelectorAll('[data-theme-toggle]'),r=document.documentElement;let d=localStorage.getItem('intellitc-theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');r.setAttribute('data-theme',d);function updateIcon(){const icon=d==='dark'?'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>':'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';toggles.forEach(function(t){t.innerHTML=icon;});}updateIcon();toggles.forEach(function(t){t.addEventListener('click',function(){d=d==='dark'?'light':'dark';r.setAttribute('data-theme',d);localStorage.setItem('intellitc-theme',d);t.setAttribute('aria-label','Switch to '+(d==='dark'?'light':'dark')+' mode');updateIcon();Object.values(window.__charts||{}).forEach(function(c){if(c&&c.update)c.update()});if(typeof onThemeChange==='function')onThemeChange();});});})();

/* ---- Utilities ---- */
function parseNum(s){return parseFloat(String(s).replace(/[^0-9.\-]/g,''))||0;}
function formatCurrency(n){if(Math.abs(n)>=1e6)return(n<0?'-':'')+'$'+(Math.abs(n)/1e6).toFixed(2)+'M';return(n<0?'-$':'$')+Math.abs(Math.round(n)).toLocaleString();}
function formatPct(n){return n.toFixed(1)+'%';}
function formatNum(n){return Math.round(n).toLocaleString();}
window.__charts={};
function getCS(){const s=getComputedStyle(document.documentElement);return{c1:s.getPropertyValue('--chart-1').trim(),c2:s.getPropertyValue('--chart-2').trim(),c3:s.getPropertyValue('--chart-3').trim(),c4:s.getPropertyValue('--chart-4').trim(),c5:s.getPropertyValue('--chart-5').trim(),c6:s.getPropertyValue('--chart-6').trim(),text:s.getPropertyValue('--color-text-muted').trim(),grid:s.getPropertyValue('--color-divider').trim(),surface:s.getPropertyValue('--color-surface').trim(),primary:s.getPropertyValue('--color-primary').trim()};}
function destroyCharts(){Object.values(window.__charts).forEach(c=>{if(c&&c.destroy)c.destroy()});window.__charts={};}
function chartOpts(title,type){const cs=getCS();return{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true,labels:{color:cs.text,font:{family:'DM Sans'}}},title:{display:!!title,text:title,color:cs.text,font:{family:'DM Sans',size:14,weight:600}},tooltip:{backgroundColor:cs.surface,titleColor:cs.text,bodyColor:cs.text,borderColor:cs.grid,borderWidth:1}},scales:type==='pie'||type==='doughnut'||type==='radar'?undefined:{x:{ticks:{color:cs.text},grid:{color:cs.grid}},y:{ticks:{color:cs.text},grid:{color:cs.grid}}}};}

/* ---- Currency auto-format ---- */
document.querySelectorAll('input[data-currency]').forEach(inp=>{inp.addEventListener('blur',()=>{const v=parseNum(inp.value);if(v)inp.value=Math.round(v).toLocaleString();});});

/* ---- Panel toggle ---- */
const inputPanel=document.getElementById('inputPanel');
const resultsPanel=document.getElementById('resultsPanel');
function showResults(){inputPanel.classList.add('hidden');resultsPanel.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});}
function showInputs(){resultsPanel.classList.add('hidden');inputPanel.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});}
document.querySelectorAll('[data-back]').forEach(b=>b.addEventListener('click',showInputs));

/* ---- Site Suitability Scoring ---- */
function scoreSuitability(inputs){
  const factors=[];
  // Acreage (10+ ideal, 5-10 acceptable, <5 marginal)
  const usable=inputs.usableAcres;
  if(usable>=20)factors.push({label:'Usable Acreage',score:5,note:usable+' acres — excellent capacity'});
  else if(usable>=10)factors.push({label:'Usable Acreage',score:4,note:usable+' acres — good capacity'});
  else if(usable>=5)factors.push({label:'Usable Acreage',score:3,note:usable+' acres — minimum viable'});
  else factors.push({label:'Usable Acreage',score:1,note:usable+' acres — below typical minimum'});

  // Terrain
  const tMap={flat:5,gentle:4,moderate:2,steep:1};
  const tNote={flat:'Ideal — minimal grading needed',gentle:'Good — minor grading may be needed',moderate:'Challenging — significant site work',steep:'Not suitable for most solar installations'};
  factors.push({label:'Terrain',score:tMap[inputs.terrain]||3,note:tNote[inputs.terrain]||''});

  // Substation distance (<1mi ideal, 1-2 good, 2-5 fair, >5 poor)
  const dist=inputs.substationDist;
  if(dist<=1)factors.push({label:'Substation Proximity',score:5,note:dist+' mi — ideal interconnection distance'});
  else if(dist<=2)factors.push({label:'Substation Proximity',score:4,note:dist+' mi — within preferred range'});
  else if(dist<=5)factors.push({label:'Substation Proximity',score:3,note:dist+' mi — additional interconnection costs'});
  else factors.push({label:'Substation Proximity',score:1,note:dist+' mi — may be cost-prohibitive'});

  // 3-phase power
  if(inputs.threePhase==='yes')factors.push({label:'3-Phase Power',score:5,note:'Available — no upgrade needed'});
  else if(inputs.threePhase==='unknown')factors.push({label:'3-Phase Power',score:3,note:'Unknown — verify with utility'});
  else factors.push({label:'3-Phase Power',score:2,note:'Not available — upgrade required'});

  // Road access
  const rMap={paved:5,gravel:3,none:1};
  const rNote={paved:'Paved road — construction-ready',gravel:'Gravel — adequate for most equipment',none:'No access — road build needed'};
  factors.push({label:'Road Access',score:rMap[inputs.roadAccess]||3,note:rNote[inputs.roadAccess]||''});

  // Zoning
  const zMap={agricultural:5,commercial:4,mixed:3,residential:2};
  const zNote={agricultural:'Agricultural — typically solar-friendly',commercial:'Commercial — usually permitted',mixed:'Mixed — may need conditional use permit',residential:'Residential — zoning variance likely needed'};
  factors.push({label:'Zoning',score:zMap[inputs.zoning]||3,note:zNote[inputs.zoning]||''});

  const total=factors.reduce((s,f)=>s+f.score,0);
  const max=factors.length*5;
  const pct=Math.round(total/max*100);
  let grade,gradeClass;
  if(pct>=85){grade='A';gradeClass='grade-a';}
  else if(pct>=70){grade='B';gradeClass='grade-b';}
  else if(pct>=55){grade='C';gradeClass='grade-c';}
  else if(pct>=40){grade='D';gradeClass='grade-d';}
  else{grade='F';gradeClass='grade-f';}
  return{factors,total,max,pct,grade,gradeClass};
}

function renderSuitability(result){
  const grid=document.getElementById('suitabilityGrid');
  grid.innerHTML='';
  result.factors.forEach(f=>{
    const stars='★'.repeat(f.score)+'☆'.repeat(5-f.score);
    const card=document.createElement('div');
    card.style.cssText='background:var(--color-bg);border:1px solid var(--color-divider);border-radius:var(--radius-lg);padding:var(--space-3) var(--space-4);';
    card.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px"><span style="font-size:var(--text-xs);font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--color-text-muted)">${f.label}</span><span style="font-size:13px;color:var(--color-primary);letter-spacing:1px">${stars}</span></div><div style="font-size:var(--text-xs);color:var(--color-text-muted);line-height:1.4">${f.note}</div>`;
    grid.appendChild(card);
  });
  // Overall score card
  const overall=document.createElement('div');
  overall.style.cssText='background:var(--color-primary-surface);border:1px solid var(--color-primary);border-radius:var(--radius-lg);padding:var(--space-3) var(--space-4);display:flex;align-items:center;gap:var(--space-3);';
  overall.innerHTML=`<span class="grade-badge ${result.gradeClass}" style="font-size:var(--text-lg);min-width:44px;height:44px">${result.grade}</span><div><div style="font-size:var(--text-sm);font-weight:600">Overall Suitability: ${result.pct}%</div><div style="font-size:var(--text-xs);color:var(--color-text-muted)">${result.total} of ${result.max} points across ${result.factors.length} factors</div></div>`;
  grid.appendChild(overall);
}

/* ---- Timeline ---- */
function renderTimeline(devMonths){
  const bar=document.getElementById('timelineBar');
  const legend=document.getElementById('timelineLegend');
  // Phases: LOI/Option, Permitting, Construction, Production Start
  const loiMonths=Math.max(3,Math.round(devMonths*0.2));
  const permitMonths=Math.max(6,Math.round(devMonths*0.4));
  const constructMonths=Math.max(3,devMonths-loiMonths-permitMonths);
  const total=loiMonths+permitMonths+constructMonths;
  const phases=[
    {label:'LOI / Option',months:loiMonths,color:'#20808D'},
    {label:'Permitting & Interconnection',months:permitMonths,color:'#D19900'},
    {label:'Construction',months:constructMonths,color:'#A84B2F'}
  ];
  bar.innerHTML='';
  legend.innerHTML='';
  phases.forEach(p=>{
    const seg=document.createElement('div');
    seg.className='timeline-seg';
    seg.style.flex=p.months;
    seg.style.background=p.color;
    seg.innerHTML=`<span>${p.months} mo</span>`;
    bar.appendChild(seg);
    const li=document.createElement('div');
    li.className='timeline-legend-item';
    li.innerHTML=`<span class="timeline-legend-dot" style="background:${p.color}"></span>${p.label} (${p.months} months)`;
    legend.appendChild(li);
  });
  // Add production start marker
  const prodLi=document.createElement('div');
  prodLi.className='timeline-legend-item';
  prodLi.innerHTML=`<span class="timeline-legend-dot" style="background:var(--color-success)"></span>Lease Payments Begin (~month ${total+1})`;
  legend.appendChild(prodLi);
}

/* ---- Main Calculation ---- */
function calculate(){
  const usableAcres=parseNum(document.getElementById('usableAcres').value);
  const totalAcres=parseNum(document.getElementById('totalAcres').value);
  const terrain=document.getElementById('terrainGrade').value;
  const currentUse=document.getElementById('currentUse').value;
  const substationDist=parseNum(document.getElementById('substationDist').value);
  const threePhase=document.getElementById('threePhase').value;
  const roadAccess=document.getElementById('roadAccess').value;
  const zoning=document.getElementById('zoningStatus').value;
  const leaseRate=parseNum(document.getElementById('leaseRate').value);
  const escalator=parseNum(document.getElementById('escalator').value)/100;
  const leaseTerm=parseNum(document.getElementById('leaseTerm').value);
  const devPeriod=parseNum(document.getElementById('devPeriod').value);
  const propertyTax=parseNum(document.getElementById('propertyTax').value);
  const taxCoverage=parseNum(document.getElementById('taxCoverage').value)/100;
  const signingBonus=parseNum(document.getElementById('signingBonus').value);
  const legalCosts=parseNum(document.getElementById('legalCosts').value);

  // Year-by-year projections
  const yrs=[];const annual=[];const cumulative=[];
  let yr1Income=0;let lifetimeIncome=signingBonus;let cumTotal=signingBonus;
  for(let y=1;y<=leaseTerm;y++){
    const payment=usableAcres*leaseRate*Math.pow(1+escalator,y-1);
    if(y===1)yr1Income=payment;
    lifetimeIncome+=payment;
    cumTotal+=payment;
    yrs.push('Year '+y);
    annual.push(Math.round(payment));
    cumulative.push(Math.round(cumTotal));
  }

  const netLifetime=lifetimeIncome-legalCosts;
  const perAcreMonth=yr1Income/usableAcres/12;
  // Estimate capacity: 5-8 acres per MW → use 6.5 avg
  const estimatedMW=usableAcres/6.5;
  const homesServed=Math.round(estimatedMW*173);

  // KPIs
  document.getElementById('kpiYear1').textContent=formatCurrency(yr1Income);
  document.getElementById('kpiYear1').className='kpi-value kpi-positive';
  document.getElementById('kpiYear1Detail').textContent=formatCurrency(leaseRate)+'/acre × '+formatNum(usableAcres)+' acres';

  document.getElementById('kpiLifetime').textContent=formatCurrency(netLifetime);
  document.getElementById('kpiLifetime').className='kpi-value kpi-positive';
  document.getElementById('kpiLifetimeDetail').textContent=leaseTerm+'-year total after legal costs'+(signingBonus>0?' (incl. signing bonus)':'');

  document.getElementById('kpiPerMonth').textContent='$'+Math.round(perAcreMonth).toLocaleString();
  document.getElementById('kpiPerMonth').className='kpi-value';
  document.getElementById('kpiPerMonthDetail').textContent='Year 1 monthly equivalent per usable acre';

  document.getElementById('kpiCapacity').textContent=estimatedMW.toFixed(1)+' MW';
  document.getElementById('kpiCapacity').className='kpi-value';
  document.getElementById('kpiCapacityDetail').textContent='~'+formatNum(homesServed)+' homes powered (est.)';

  // Charts
  destroyCharts();const cs=getCS();

  window.__charts.income=new Chart(document.getElementById('chartIncome'),{type:'bar',data:{labels:yrs,datasets:[{label:'Annual Lease Payment',data:annual,backgroundColor:cs.c1}]},options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text,maxTicksLimit:Math.min(leaseTerm,15)},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  window.__charts.cum=new Chart(document.getElementById('chartCumulative'),{type:'line',data:{labels:yrs,datasets:[{label:'Cumulative Revenue',data:cumulative,borderColor:cs.c1,backgroundColor:cs.c1+'22',fill:true,tension:0.3}]},options:{...chartOpts('','line'),scales:{x:{ticks:{color:cs.text,maxTicksLimit:Math.min(leaseTerm,15)},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  // Timeline
  renderTimeline(devPeriod);

  // Suitability
  const suitResult=scoreSuitability({usableAcres,terrain,substationDist,threePhase,roadAccess,zoning});
  renderSuitability(suitResult);

  // Year-by-year table
  const leaseBody=document.getElementById('leaseBody');
  if(leaseBody){
    leaseBody.innerHTML='';
    for(let y=0;y<leaseTerm;y++){
      const highlight=y===0||y===leaseTerm-1||(y+1)%5===0?'font-weight:600':'';
      leaseBody.innerHTML+=`<tr style="${highlight}"><td>Year ${y+1}</td><td class="text-right">${formatCurrency(annual[y])}</td><td class="text-right">${formatCurrency(cumulative[y])}</td></tr>`;
    }
  }

  // Summary table
  const summaryBody=document.getElementById('summaryBody');
  if(summaryBody){
    summaryBody.innerHTML='';
    const finalYrPayment=annual[leaseTerm-1]||0;
    const items=[
      ['Usable Acres',formatNum(usableAcres)+' acres',''],
      ['Lease Rate (Year 1)',formatCurrency(leaseRate)+'/acre/year',''],
      ['Annual Escalator',formatPct(escalator*100),''],
      ['Lease Term',leaseTerm+' years',''],
      ['Signing Bonus',formatCurrency(signingBonus),''],
      ['Year 1 Annual Income',formatCurrency(yr1Income),'highlight'],
      ['Final Year Annual Income',formatCurrency(finalYrPayment),'highlight'],
      ['Income Growth (Year 1 → '+leaseTerm+')',formatPct((finalYrPayment/yr1Income-1)*100),''],
      ['Lifetime Gross Income',formatCurrency(lifetimeIncome),''],
      ['Legal / Negotiation Costs','-'+formatCurrency(legalCosts),''],
      ['Lifetime Net Income',formatCurrency(netLifetime),'highlight'],
      ['Estimated Solar Capacity',estimatedMW.toFixed(1)+' MW',''],
      ['Homes Powered (est.)',formatNum(homesServed),''],
      ['Development Period',devPeriod+' months',''],
      ['Site Suitability Grade',suitResult.grade+' ('+suitResult.pct+'%)','highlight']
    ];
    items.forEach(r=>{const style=r[2]==='highlight'?'font-weight:600':'';summaryBody.innerHTML+=`<tr style="${style}"><td>${r[0]}</td><td class="text-right">${r[1]}</td></tr>`;});
  }
  showResults();
}
