/* ============================================================
   EV Charging ROI Calculator — IntelliTC Solutions
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

/* ---- Active Scenario ---- */
let activeScenario='home';

function switchScenario(scenario){
  activeScenario=scenario;
  // Update tabs
  document.querySelectorAll('.scenario-tab').forEach(t=>{
    t.classList.toggle('active',t.dataset.scenario===scenario);
  });
  // Show/hide field groups
  document.querySelectorAll('.scenario-fields').forEach(f=>f.classList.remove('active'));
  const fieldMap={home:'fieldsHome',business:'fieldsBusiness',rvpark:'fieldsRvpark',airbnb:'fieldsAirbnb'};
  const target=document.getElementById(fieldMap[scenario]);
  if(target)target.classList.add('active');
  // Adjust defaults based on scenario
  const isCommercial=scenario!=='home';
  const swFeeField=document.getElementById('fieldSoftwareFee');
  if(swFeeField){
    // Home users may not need software fees
    if(scenario==='home'){
      document.getElementById('softwareFee').value='0';
    }else{
      document.getElementById('softwareFee').value='20';
    }
  }
}

/* ---- Charger Type Auto-adjust ---- */
function onChargerTypeChange(){
  const type=document.getElementById('chargerType').value;
  if(type==='dcfc'){
    document.getElementById('hardwareCost').value='75,000';
    document.getElementById('installCost').value='25,000';
    document.getElementById('bmHardware').innerHTML='<span class="bm-tag" onclick="document.getElementById(\'hardwareCost\').value=\'50000\';document.getElementById(\'hardwareCost\').dispatchEvent(new Event(\'input\',{bubbles:true}))">$50K Basic</span> <span class="bm-tag" onclick="document.getElementById(\'hardwareCost\').value=\'75000\';document.getElementById(\'hardwareCost\').dispatchEvent(new Event(\'input\',{bubbles:true}))">$75K Mid</span> <span class="bm-tag" onclick="document.getElementById(\'hardwareCost\').value=\'150000\';document.getElementById(\'hardwareCost\').dispatchEvent(new Event(\'input\',{bubbles:true}))">$150K+ Premium</span>';
    document.getElementById('bmInstall').innerHTML='<span class="bm-tag" onclick="document.getElementById(\'installCost\').value=\'15000\';document.getElementById(\'installCost\').dispatchEvent(new Event(\'input\',{bubbles:true}))">$15K Simple</span> <span class="bm-tag" onclick="document.getElementById(\'installCost\').value=\'25000\';document.getElementById(\'installCost\').dispatchEvent(new Event(\'input\',{bubbles:true}))">$25K Avg</span> <span class="bm-tag" onclick="document.getElementById(\'installCost\').value=\'50000\';document.getElementById(\'installCost\').dispatchEvent(new Event(\'input\',{bubbles:true}))">$50K Complex</span>';
  }else{
    document.getElementById('hardwareCost').value='1,500';
    document.getElementById('installCost').value='1,200';
    document.getElementById('bmHardware').innerHTML='<span class="bm-tag" onclick="document.getElementById(\'hardwareCost\').value=\'900\';document.getElementById(\'hardwareCost\').dispatchEvent(new Event(\'input\',{bubbles:true}))">$900 Basic</span> <span class="bm-tag" onclick="document.getElementById(\'hardwareCost\').value=\'1500\';document.getElementById(\'hardwareCost\').dispatchEvent(new Event(\'input\',{bubbles:true}))">$1,500 Smart</span> <span class="bm-tag" onclick="document.getElementById(\'hardwareCost\').value=\'2500\';document.getElementById(\'hardwareCost\').dispatchEvent(new Event(\'input\',{bubbles:true}))">$2,500 Premium</span>';
    document.getElementById('bmInstall').innerHTML='<span class="bm-tag" onclick="document.getElementById(\'installCost\').value=\'800\';document.getElementById(\'installCost\').dispatchEvent(new Event(\'input\',{bubbles:true}))">$800 Simple</span> <span class="bm-tag" onclick="document.getElementById(\'installCost\').value=\'1200\';document.getElementById(\'installCost\').dispatchEvent(new Event(\'input\',{bubbles:true}))">$1,200 Avg</span> <span class="bm-tag" onclick="document.getElementById(\'installCost\').value=\'2500\';document.getElementById(\'installCost\').dispatchEvent(new Event(\'input\',{bubbles:true}))">$2,500 Complex</span>';
  }
}

/* ============================================================
   CALCULATION ENGINE
   ============================================================ */
function calculate(){
  // ---- Common inputs ----
  const numPorts=parseNum(document.getElementById('numPorts').value);
  const hardwareCostPer=parseNum(document.getElementById('hardwareCost').value);
  const installCostPer=parseNum(document.getElementById('installCost').value);
  const elecRate=parseNum(document.getElementById('electricityRate').value);
  const rateEsc=parseNum(document.getElementById('rateEscalation').value)/100;
  const softwareFee=parseNum(document.getElementById('softwareFee').value);
  const maintPct=parseNum(document.getElementById('maintenancePct').value)/100;
  const years=Math.max(1,Math.round(parseNum(document.getElementById('analysisPeriod').value)));
  const use30C=document.getElementById('taxCredit30C').value==='yes';
  const stateRebate=parseNum(document.getElementById('stateRebate').value);
  const utilityIncentive=parseNum(document.getElementById('utilityIncentive').value);
  const isHome=activeScenario==='home';

  // ---- Gross cost ----
  const grossHardware=numPorts*hardwareCostPer;
  const grossInstall=numPorts*installCostPer;
  const grossTotal=grossHardware+grossInstall;

  // ---- 30C tax credit ----
  let taxCredit=0;
  if(use30C){
    const creditPct=0.30;
    const rawCredit=grossTotal*creditPct;
    const cap=isHome?1000:100000;
    taxCredit=Math.min(rawCredit,cap);
  }

  // ---- Net investment ----
  const netInvestment=Math.max(0,grossTotal-taxCredit-stateRebate-utilityIncentive);

  // ---- Annual operating costs ----
  const annualSoftware=softwareFee*12*numPorts;
  const annualMaintenance=grossHardware*maintPct;

  // ---- Scenario-specific revenue/savings ----
  const yrs=[];const annualNet=[];const cumCash=[];
  let yr1Revenue=0;let yr1OpCost=0;let yr1ElecCost=0;
  let totalRevenue=0;let totalOpCost=0;let totalElecCost=0;
  let paybackYr=0;let cumulative=-netInvestment;
  let scenarioLabel='';let revenueLabel='';

  if(activeScenario==='home'){
    // HOME: savings = avoided gas cost - electricity cost
    scenarioLabel='Home Charging';
    revenueLabel='Annual Fuel Savings';
    const monthlyMiles=parseNum(document.getElementById('monthlyMiles').value);
    const efficiency=parseNum(document.getElementById('evEfficiency').value);
    const gasPrice=parseNum(document.getElementById('gasPrice').value);
    const gasMPG=parseNum(document.getElementById('gasMPG').value);
    const gasEsc=parseNum(document.getElementById('gasEscalation').value)/100;
    const annualMiles=monthlyMiles*12;
    const annualKwh=annualMiles/efficiency;

    for(let y=1;y<=years;y++){
      const eRate=elecRate*Math.pow(1+rateEsc,y-1);
      const gPrice=gasPrice*Math.pow(1+gasEsc,y-1);
      const gasCost=annualMiles/gasMPG*gPrice;
      const evElecCost=annualKwh*eRate;
      const fuelSavings=gasCost-evElecCost;
      const opCost=annualSoftware+annualMaintenance;
      const net=fuelSavings-opCost;
      if(y===1){yr1Revenue=fuelSavings;yr1OpCost=opCost;yr1ElecCost=evElecCost;}
      totalRevenue+=fuelSavings;totalOpCost+=opCost;totalElecCost+=evElecCost;
      cumulative+=net;
      yrs.push('Year '+y);annualNet.push(Math.round(net));cumCash.push(Math.round(cumulative));
      if(paybackYr===0&&cumulative>=0)paybackYr=y;
    }
  }else if(activeScenario==='business'){
    // BUSINESS: revenue from charging customers
    scenarioLabel='Business / Commercial';
    revenueLabel='Annual Revenue';
    const dailySessions=parseNum(document.getElementById('dailySessions').value);
    const avgKwh=parseNum(document.getElementById('avgSessionKwh').value);
    const chargePrice=parseNum(document.getElementById('chargingPrice').value);
    const opDays=parseNum(document.getElementById('operatingDays').value);
    const demandCharges=parseNum(document.getElementById('demandCharges').value);
    const annualSessions=dailySessions*numPorts*opDays;
    const annualKwh=annualSessions*avgKwh;

    for(let y=1;y<=years;y++){
      const eRate=elecRate*Math.pow(1+rateEsc,y-1);
      const revenue=annualKwh*chargePrice;
      const elecCost=annualKwh*eRate;
      const opCost=annualSoftware+annualMaintenance+demandCharges*12;
      const net=revenue-elecCost-opCost;
      if(y===1){yr1Revenue=revenue;yr1OpCost=opCost;yr1ElecCost=elecCost;}
      totalRevenue+=revenue;totalOpCost+=opCost;totalElecCost+=elecCost;
      cumulative+=net;
      yrs.push('Year '+y);annualNet.push(Math.round(net));cumCash.push(Math.round(cumulative));
      if(paybackYr===0&&cumulative>=0)paybackYr=y;
    }
  }else if(activeScenario==='rvpark'){
    // RV PARK: surcharge revenue + electricity cost
    scenarioLabel='RV Park / Campground';
    revenueLabel='Annual Revenue';
    const totalSites=parseNum(document.getElementById('rvTotalSites').value);
    const surcharge=parseNum(document.getElementById('rvEvSurcharge').value);
    const occupancy=parseNum(document.getElementById('rvOccupancy').value)/100;
    const evAdoption=parseNum(document.getElementById('rvEvAdoption').value)/100;
    const seasonMonths=parseNum(document.getElementById('rvSeasonMonths').value);
    const avgKwhNight=parseNum(document.getElementById('rvAvgKwhNight').value);
    const seasonDays=seasonMonths*30.44;
    const evNightsPerYear=totalSites*occupancy*evAdoption*seasonDays;

    for(let y=1;y<=years;y++){
      const eRate=elecRate*Math.pow(1+rateEsc,y-1);
      const revenue=evNightsPerYear*surcharge;
      const elecCost=evNightsPerYear*avgKwhNight*eRate;
      const opCost=annualSoftware+annualMaintenance;
      const net=revenue-elecCost-opCost;
      if(y===1){yr1Revenue=revenue;yr1OpCost=opCost;yr1ElecCost=elecCost;}
      totalRevenue+=revenue;totalOpCost+=opCost;totalElecCost+=elecCost;
      cumulative+=net;
      yrs.push('Year '+y);annualNet.push(Math.round(net));cumCash.push(Math.round(cumulative));
      if(paybackYr===0&&cumulative>=0)paybackYr=y;
    }
  }else if(activeScenario==='airbnb'){
    // AIRBNB: nightly premium + booking boost
    scenarioLabel='Airbnb / Vacation Rental';
    revenueLabel='Annual Revenue';
    const properties=parseNum(document.getElementById('abnbProperties').value);
    const nightlyPremium=parseNum(document.getElementById('abnbNightlyPremium').value);
    const occupancy=parseNum(document.getElementById('abnbOccupancy').value)/100;
    const evGuestPct=parseNum(document.getElementById('abnbEvGuestPct').value)/100;
    const avgKwh=parseNum(document.getElementById('abnbAvgKwh').value);
    const bookingBoost=parseNum(document.getElementById('abnbBookingBoost').value)/100;
    const nightsPerYear=365*occupancy;
    const evNights=nightsPerYear*evGuestPct*properties;
    const boostNights=365*occupancy*bookingBoost*properties;

    for(let y=1;y<=years;y++){
      const eRate=elecRate*Math.pow(1+rateEsc,y-1);
      const premiumRevenue=evNights*nightlyPremium;
      // Booking boost revenue: additional nights from visibility, assume average nightly rate $150
      const boostRevenue=boostNights*150;
      const totalRev=premiumRevenue+boostRevenue;
      const elecCost=evNights*avgKwh*eRate;
      const opCost=annualSoftware+annualMaintenance;
      const net=totalRev-elecCost-opCost;
      if(y===1){yr1Revenue=totalRev;yr1OpCost=opCost;yr1ElecCost=elecCost;}
      totalRevenue+=totalRev;totalOpCost+=opCost;totalElecCost+=elecCost;
      cumulative+=net;
      yrs.push('Year '+y);annualNet.push(Math.round(net));cumCash.push(Math.round(cumulative));
      if(paybackYr===0&&cumulative>=0)paybackYr=y;
    }
  }

  // Home scenario: totalRevenue = fuelSavings (already net of electricity), so don't subtract elec again
  // Other scenarios: totalRevenue is raw revenue, subtract electricity separately
  const lifetimeNet=isHome?(totalRevenue-totalOpCost-netInvestment):(totalRevenue-totalElecCost-totalOpCost-netInvestment);
  const roi=netInvestment>0?(lifetimeNet/netInvestment*100):0;
  const yr1Net=annualNet[0]||0;

  // ---- Update Results UI ----
  document.getElementById('scenarioBadge').innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> '+scenarioLabel;
  document.getElementById('kpiRevenueLabel').textContent=isHome?'Year 1 Fuel Savings':'Year 1 Net Revenue';
  document.getElementById('kpiROILabel').textContent=years+'-Year ROI';
  document.getElementById('annualColHeader').textContent=isHome?'Annual Savings':'Annual Net Revenue';
  document.getElementById('chartAnnualTitle').textContent=isHome?'Annual Fuel Savings':'Annual Net Revenue';
  document.getElementById('chartAnnualSub').textContent=isHome?'Year-over-year savings vs gas':'Year-over-year net income after costs';

  // KPIs
  document.getElementById('kpiInvestment').textContent=formatCurrency(netInvestment);
  document.getElementById('kpiInvestment').className='kpi-value';
  document.getElementById('kpiInvestmentDetail').textContent=formatCurrency(grossTotal)+' gross'+(taxCredit>0?' - '+formatCurrency(taxCredit)+' tax credit':'')+(stateRebate>0?' - '+formatCurrency(stateRebate)+' rebate':'');

  document.getElementById('kpiRevenue').textContent=formatCurrency(yr1Net);
  document.getElementById('kpiRevenue').className='kpi-value '+(yr1Net>=0?'kpi-positive':'kpi-negative');
  document.getElementById('kpiRevenueDetail').textContent=isHome?'Year 1 savings after operating costs':'Year 1 revenue minus electricity and operating costs';

  document.getElementById('kpiPayback').textContent=paybackYr>0?paybackYr+' yr'+(paybackYr>1?'s':''):years+'+ yrs';
  document.getElementById('kpiPayback').className='kpi-value '+(paybackYr>0&&paybackYr<=5?'kpi-positive':paybackYr>0?'':'kpi-negative');
  document.getElementById('kpiPaybackDetail').textContent=paybackYr>0?'Investment recovered by year '+paybackYr:'May not recover within analysis period';

  document.getElementById('kpiROI').textContent=formatPct(roi);
  document.getElementById('kpiROI').className='kpi-value '+(roi>=0?'kpi-positive':'kpi-negative');
  document.getElementById('kpiROIDetail').textContent=years+'-year return on net investment';

  // ---- Charts ----
  destroyCharts();const cs=getCS();

  // Cumulative cash flow
  window.__charts.cashflow=new Chart(document.getElementById('chartCashFlow'),{type:'line',data:{labels:yrs,datasets:[{label:'Cumulative Cash Flow',data:cumCash,borderColor:cs.c1,backgroundColor:cs.c1+'22',fill:true,tension:0.3},{label:'Break-Even',data:yrs.map(()=>0),borderColor:cs.c2,borderDash:[5,3],fill:false,pointRadius:0}]},options:{...chartOpts('','line'),plugins:{...chartOpts('','line').plugins,legend:{display:true,labels:{color:cs.text,font:{family:'DM Sans'}}}},scales:{x:{ticks:{color:cs.text,maxTicksLimit:Math.min(years,15)},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  // Annual bar
  window.__charts.annual=new Chart(document.getElementById('chartAnnual'),{type:'bar',data:{labels:yrs,datasets:[{label:isHome?'Net Fuel Savings':'Net Revenue',data:annualNet,backgroundColor:annualNet.map(v=>v>=0?cs.c1:cs.c2)}]},options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text,maxTicksLimit:Math.min(years,15)},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  // ---- Year-by-year table ----
  const yearBody=document.getElementById('yearBody');
  if(yearBody){
    yearBody.innerHTML='';
    for(let y=0;y<years;y++){
      const highlight=y===0||y===years-1||(y+1)%5===0?'font-weight:600':'';
      yearBody.innerHTML+='<tr style="'+highlight+'"><td>Year '+(y+1)+'</td><td class="text-right">'+formatCurrency(annualNet[y])+'</td><td class="text-right">'+formatCurrency(cumCash[y])+'</td></tr>';
    }
  }

  // ---- Summary table ----
  const summaryBody=document.getElementById('summaryBody');
  if(summaryBody){
    summaryBody.innerHTML='';
    const items=[];
    items.push(['Scenario',scenarioLabel,'']);
    items.push(['Charger Type',document.getElementById('chargerType').value==='dcfc'?'DC Fast Charger':'Level 2 (240V)','']);
    items.push(['Number of Ports',numPorts,'']);
    items.push(['Gross Hardware Cost',formatCurrency(grossHardware),'']);
    items.push(['Gross Installation Cost',formatCurrency(grossInstall),'']);
    items.push(['Gross Total',formatCurrency(grossTotal),'']);
    if(taxCredit>0)items.push(['Federal 30C Tax Credit (30%)','-'+formatCurrency(taxCredit),'']);
    if(stateRebate>0)items.push(['State / Local Rebate','-'+formatCurrency(stateRebate),'']);
    if(utilityIncentive>0)items.push(['Utility Incentive','-'+formatCurrency(utilityIncentive),'']);
    items.push(['Net Investment',formatCurrency(netInvestment),'highlight']);

    if(activeScenario==='home'){
      const monthlyMiles=parseNum(document.getElementById('monthlyMiles').value);
      const efficiency=parseNum(document.getElementById('evEfficiency').value);
      items.push(['Annual Driving Miles',formatNum(monthlyMiles*12)+' mi','']);
      items.push(['Annual kWh Consumption',formatNum(Math.round(monthlyMiles*12/efficiency))+' kWh','']);
      items.push(['Year 1 Gas Cost Avoided',formatCurrency(yr1Revenue),'']);
      items.push(['Year 1 Electricity Cost',formatCurrency(yr1ElecCost),'']);
    }else if(activeScenario==='business'){
      const dailySessions=parseNum(document.getElementById('dailySessions').value);
      const opDays=parseNum(document.getElementById('operatingDays').value);
      items.push(['Annual Sessions',formatNum(dailySessions*numPorts*opDays),'']);
      items.push(['Year 1 Charging Revenue',formatCurrency(yr1Revenue),'']);
      items.push(['Year 1 Electricity Cost',formatCurrency(yr1ElecCost),'']);
    }else if(activeScenario==='rvpark'){
      const totalSites=parseNum(document.getElementById('rvTotalSites').value);
      const occupancy=parseNum(document.getElementById('rvOccupancy').value);
      const evAdoption=parseNum(document.getElementById('rvEvAdoption').value);
      items.push(['Total RV Sites',formatNum(totalSites),'']);
      items.push(['Occupancy Rate',occupancy+'%','']);
      items.push(['EV Adoption Rate',evAdoption+'%','']);
      items.push(['Year 1 Surcharge Revenue',formatCurrency(yr1Revenue),'']);
      items.push(['Year 1 Electricity Cost',formatCurrency(yr1ElecCost),'']);
    }else if(activeScenario==='airbnb'){
      const properties=parseNum(document.getElementById('abnbProperties').value);
      const bookingBoost=parseNum(document.getElementById('abnbBookingBoost').value);
      items.push(['Properties',formatNum(properties),'']);
      items.push(['Booking Visibility Boost',bookingBoost+'%','']);
      items.push(['Year 1 Total Revenue',formatCurrency(yr1Revenue),'']);
      items.push(['Year 1 Electricity Cost',formatCurrency(yr1ElecCost),'']);
    }

    items.push(['Year 1 Operating Costs',formatCurrency(yr1OpCost),'']);
    items.push(['Year 1 Net '+(isHome?'Savings':'Revenue'),formatCurrency(yr1Net),'highlight']);
    items.push(['Payback Period',paybackYr>0?paybackYr+' years':years+'+ years','highlight']);
    items.push([years+'-Year Total '+(isHome?'Savings':'Revenue'),formatCurrency(totalRevenue),'']);
    items.push([years+'-Year Total Electricity Cost',formatCurrency(totalElecCost),'']);
    items.push([years+'-Year Total Operating Costs',formatCurrency(totalOpCost),'']);
    items.push([years+'-Year Net Benefit',formatCurrency(lifetimeNet),'highlight']);
    items.push([years+'-Year ROI',formatPct(roi),'highlight']);
    items.push(['Electricity Rate',('$'+elecRate.toFixed(2)+'/kWh'),'']);
    items.push(['Annual Rate Escalation',formatPct(rateEsc*100),'']);

    items.forEach(r=>{const style=r[2]==='highlight'?'font-weight:600':'';summaryBody.innerHTML+='<tr style="'+style+'"><td>'+r[0]+'</td><td class="text-right">'+r[1]+'</td></tr>';});
  }

  showResults();
}
