/* ============================================================
   Lease Expiration Schedule — IntelliTC Solutions
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

/* ---- Panel toggle ---- */
const inputPanel=document.getElementById('inputPanel');
const resultsPanel=document.getElementById('resultsPanel');
function showResults(){inputPanel.classList.add('hidden');resultsPanel.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});}
function showInputs(){resultsPanel.classList.add('hidden');inputPanel.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});}
document.querySelectorAll('[data-back]').forEach(b=>b.addEventListener('click',showInputs));

/* ---- Dynamic Tenant Rows ---- */
const numTenantsSelect = document.getElementById('numTenants');
function updateTenantRows(){
  const n = parseInt(numTenantsSelect.value);
  for(let i=1; i<=8; i++){
    const row = document.getElementById('tenantRow'+i);
    if(row) row.style.display = i<=n ? '' : 'none';
  }
}
numTenantsSelect.addEventListener('change', updateTenantRows);
updateTenantRows();

/* ---- Helper: parse month input to Date ---- */
function parseMonth(val){
  if(!val) return null;
  const parts = val.split('-');
  return new Date(parseInt(parts[0]), parseInt(parts[1])-1, 1);
}
function formatMonth(d){
  const m = d.getMonth()+1;
  return d.getFullYear()+'-'+(m<10?'0':'')+m;
}
function formatMonthDisplay(val){
  if(!val) return '—';
  const d = parseMonth(val);
  if(!d) return '—';
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[d.getMonth()]+' '+d.getFullYear();
}

/* ---- Calculate ---- */
function calculate(){
  const numTenants = parseInt(numTenantsSelect.value);
  const rentGrowth = parseNum(document.getElementById('rentGrowth').value)/100;
  const vacancyCost = parseNum(document.getElementById('vacancyCost').value);
  const now = new Date();
  const nowMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Collect tenant data
  const tenants = [];
  for(let i=1; i<=numTenants; i++){
    const name = document.getElementById('tName'+i).value || ('Tenant '+i);
    const suite = document.getElementById('tSuite'+i).value || ('Unit '+i);
    const rent = parseNum(document.getElementById('tRent'+i).value);
    const startVal = document.getElementById('tStart'+i).value;
    const endVal = document.getElementById('tEnd'+i).value;
    const prob = parseNum(document.getElementById('tProb'+i).value)/100;
    const startDate = parseMonth(startVal);
    const endDate = parseMonth(endVal);

    // Calculate remaining months from now to lease end
    let remainingMonths = 0;
    if(endDate && endDate > nowMonth){
      remainingMonths = (endDate.getFullYear()-nowMonth.getFullYear())*12 + (endDate.getMonth()-nowMonth.getMonth());
    }

    // Annualized risk: probability of NOT renewing * vacancy cost * 12 months / total tenants
    // More precisely: (1 - renewal prob) * monthly vacancy cost * expected vacancy months
    // We'll assume if tenant doesn't renew, vacancy = ~3 months per occurrence, annualized
    const nonRenewalProb = 1 - prob;
    const annualizedRisk = nonRenewalProb * vacancyCost * 12;

    tenants.push({
      name, suite, rent, startVal, endVal, startDate, endDate,
      prob, remainingMonths, annualizedRisk, nonRenewalProb
    });
  }

  // KPI 1: Total Annual Rent
  const totalAnnualRent = tenants.reduce((s,t)=>s+t.rent*12, 0);

  // KPI 2: Leases Expiring Within 12 Months
  const twelveMonthsOut = new Date(nowMonth);
  twelveMonthsOut.setMonth(twelveMonthsOut.getMonth()+12);
  const expiringCount = tenants.filter(t=>t.endDate && t.endDate <= twelveMonthsOut && t.endDate >= nowMonth).length;
  const expiringPct = numTenants > 0 ? (expiringCount / numTenants) * 100 : 0;

  // KPI 3: Weighted Average Remaining Lease Term (weighted by rent)
  const totalRent = tenants.reduce((s,t)=>s+t.rent, 0);
  const wart = totalRent > 0 ? tenants.reduce((s,t)=>s + t.remainingMonths * t.rent, 0) / totalRent : 0;

  // KPI 4: Annualized Vacancy Risk
  const totalVacRisk = tenants.reduce((s,t)=>s+t.annualizedRisk, 0);

  // Update KPI cards
  document.getElementById('kpiTotalRent').textContent = formatCurrency(totalAnnualRent);
  document.getElementById('kpiTotalRentDetail').textContent = formatCurrency(totalAnnualRent/12)+'/mo';

  document.getElementById('kpiExpiring').textContent = expiringCount + ' of ' + numTenants;
  document.getElementById('kpiExpiringDetail').textContent = formatPct(expiringPct)+' of leases';

  document.getElementById('kpiWART').textContent = wart.toFixed(1)+' mo';
  document.getElementById('kpiWARTDetail').textContent = (wart/12).toFixed(1)+' years';

  document.getElementById('kpiVacRisk').textContent = formatCurrency(totalVacRisk);
  document.getElementById('kpiVacRisk').className = 'kpi-value'+(totalVacRisk > totalAnnualRent*0.1 ? ' kpi-negative' : '');
  document.getElementById('kpiVacRiskDetail').textContent = totalAnnualRent>0 ? formatPct(totalVacRisk/totalAnnualRent*100)+' of income' : '';

  // --- Charts ---
  destroyCharts();
  const cs = getCS();
  const chartColors = [cs.c1, cs.c2, cs.c3, cs.c4, cs.c5, cs.c6, cs.c1, cs.c2];

  // Chart 1: Lease Expiration Timeline (horizontal bar / Gantt-style)
  // We'll use a horizontal floating bar chart
  // Find the overall min start and max end for the x-axis
  const allStarts = tenants.map(t=>t.startDate).filter(d=>d);
  const allEnds = tenants.map(t=>t.endDate).filter(d=>d);
  const minDate = allStarts.length ? new Date(Math.min(...allStarts.map(d=>d.getTime()))) : nowMonth;
  const maxDate = allEnds.length ? new Date(Math.max(...allEnds.map(d=>d.getTime()))) : nowMonth;

  // Convert dates to numeric month offsets from minDate
  function monthOffset(d){
    if(!d) return 0;
    return (d.getFullYear()-minDate.getFullYear())*12 + (d.getMonth()-minDate.getMonth());
  }
  const maxOffset = monthOffset(maxDate) + 1;

  // Build tick labels for x-axis (year labels)
  const startYear = minDate.getFullYear();
  const endYear = maxDate.getFullYear();
  function offsetToLabel(offset){
    const d = new Date(minDate);
    d.setMonth(d.getMonth()+offset);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[d.getMonth()]+' '+d.getFullYear();
  }

  const timelineLabels = tenants.map(t=>t.name);
  const timelineData = tenants.map((t,i)=>{
    const s = t.startDate ? monthOffset(t.startDate) : 0;
    const e = t.endDate ? monthOffset(t.endDate) : s;
    return [s, e];
  });

  window.__charts.timeline = new Chart(document.getElementById('chartTimeline'),{
    type: 'bar',
    data: {
      labels: timelineLabels,
      datasets: [{
        label: 'Lease Period',
        data: timelineData,
        backgroundColor: tenants.map((t,i)=>chartColors[i % chartColors.length]),
        borderColor: tenants.map((t,i)=>chartColors[i % chartColors.length]),
        borderWidth: 1,
        borderSkipped: false,
        barPercentage: 0.6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {display: false},
        title: {display: false},
        tooltip: {
          backgroundColor: cs.surface,
          titleColor: cs.text,
          bodyColor: cs.text,
          borderColor: cs.grid,
          borderWidth: 1,
          callbacks: {
            label: function(ctx){
              const t = tenants[ctx.dataIndex];
              return formatMonthDisplay(t.startVal)+' → '+formatMonthDisplay(t.endVal)+' | '+formatCurrency(t.rent)+'/mo';
            }
          }
        }
      },
      scales: {
        x: {
          min: 0,
          max: maxOffset,
          ticks: {
            color: cs.text,
            callback: function(val){return offsetToLabel(val);},
            maxTicksLimit: 8
          },
          grid: {color: cs.grid}
        },
        y: {
          ticks: {color: cs.text},
          grid: {display: false}
        }
      }
    }
  });

  // Chart 2: Annual Rollover Exposure — bar chart showing $ of rent expiring by year
  const rolloverMap = {};
  tenants.forEach(t=>{
    if(t.endDate){
      const yr = t.endDate.getFullYear();
      rolloverMap[yr] = (rolloverMap[yr]||0) + t.rent * 12;
    }
  });
  const rolloverYears = Object.keys(rolloverMap).sort();
  const rolloverAmounts = rolloverYears.map(y=>rolloverMap[y]);

  window.__charts.rollover = new Chart(document.getElementById('chartRollover'),{
    type: 'bar',
    data: {
      labels: rolloverYears,
      datasets: [{
        label: 'Rent Expiring',
        data: rolloverAmounts,
        backgroundColor: rolloverYears.map((y,i)=>{
          const yr = parseInt(y);
          const thisYear = now.getFullYear();
          if(yr === thisYear) return cs.c2;       // Current year — highlighted
          if(yr === thisYear+1) return cs.c4;     // Next year
          return cs.c1;                            // Future years
        }),
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {display: false},
        title: {display: false},
        tooltip: {
          backgroundColor: cs.surface,
          titleColor: cs.text,
          bodyColor: cs.text,
          borderColor: cs.grid,
          borderWidth: 1,
          callbacks: {
            label: function(ctx){
              return formatCurrency(ctx.parsed.y)+' annual rent at risk';
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {color: cs.text},
          grid: {display: false}
        },
        y: {
          ticks: {
            color: cs.text,
            callback: function(v){return formatCurrency(v);}
          },
          grid: {color: cs.grid}
        }
      }
    }
  });

  // --- Results Table ---
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';
  tenants.forEach(t=>{
    const row = document.createElement('tr');
    const remainClass = t.remainingMonths <= 12 ? ' style="color:var(--chart-2);font-weight:600"' : '';
    row.innerHTML =
      '<td>'+t.name+'</td>'+
      '<td>'+t.suite+'</td>'+
      '<td class="text-right">'+formatCurrency(t.rent)+'</td>'+
      '<td>'+formatMonthDisplay(t.startVal)+'</td>'+
      '<td>'+formatMonthDisplay(t.endVal)+'</td>'+
      '<td class="text-right"'+remainClass+'>'+t.remainingMonths+'</td>'+
      '<td class="text-right">'+formatPct(t.prob*100)+'</td>'+
      '<td class="text-right">'+formatCurrency(t.annualizedRisk)+'</td>';
    tbody.appendChild(row);
  });

  // Totals row
  const totalRow = document.createElement('tr');
  totalRow.style.fontWeight = '600';
  totalRow.style.borderTop = '2px solid var(--color-divider)';
  totalRow.innerHTML =
    '<td>Total</td>'+
    '<td></td>'+
    '<td class="text-right">'+formatCurrency(totalRent)+'</td>'+
    '<td></td>'+
    '<td></td>'+
    '<td></td>'+
    '<td></td>'+
    '<td class="text-right">'+formatCurrency(totalVacRisk)+'</td>';
  tbody.appendChild(totalRow);

  showResults();
}

/* ---- Example loader support ---- */
window.loadExample = function(ex){
  if(!ex || !ex.values) return;
  const v = ex.values;
  if(v.numTenants){
    numTenantsSelect.value = v.numTenants;
    updateTenantRows();
  }
  if(v.rentGrowth !== undefined) document.getElementById('rentGrowth').value = v.rentGrowth;
  if(v.vacancyCost !== undefined) document.getElementById('vacancyCost').value = typeof v.vacancyCost === 'number' ? Math.round(v.vacancyCost).toLocaleString() : v.vacancyCost;
  if(v.tenants && Array.isArray(v.tenants)){
    v.tenants.forEach((t,i)=>{
      const idx = i+1;
      if(document.getElementById('tName'+idx)){
        document.getElementById('tName'+idx).value = t.name || '';
        document.getElementById('tSuite'+idx).value = t.suite || '';
        document.getElementById('tRent'+idx).value = typeof t.rent === 'number' ? Math.round(t.rent).toLocaleString() : t.rent;
        document.getElementById('tStart'+idx).value = t.start || '';
        document.getElementById('tEnd'+idx).value = t.end || '';
        document.getElementById('tProb'+idx).value = t.prob || '75';
      }
    });
  }
};
