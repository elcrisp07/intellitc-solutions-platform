/* ============================================================
   Investment Sensitivity Grid — IntelliTC Solutions
   ============================================================ */

/* ---- Theme Toggle ---- */
(function(){const t=document.querySelector('[data-theme-toggle]'),r=document.documentElement;let d=matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';r.setAttribute('data-theme',d);if(t){updateIcon();t.addEventListener('click',()=>{d=d==='dark'?'light':'dark';r.setAttribute('data-theme',d);t.setAttribute('aria-label','Switch to '+(d==='dark'?'light':'dark')+' mode');updateIcon();Object.values(window.__charts||{}).forEach(c=>{if(c&&c.update)c.update()});if(typeof onThemeChange==='function')onThemeChange();});} function updateIcon(){if(!t)return;t.innerHTML=d==='dark'?'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>':'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';}})();

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

function calculate(){
  const basePrice=parseNum(document.getElementById('price').value);
  const dpPct=parseNum(document.getElementById('dp').value)/100;
  const baseRate=parseNum(document.getElementById('rate').value)/100;
  const term=parseNum(document.getElementById('term').value);
  const baseRent=parseNum(document.getElementById('rent').value);
  const var1=document.getElementById('var1').value;
  const var2=document.getElementById('var2').value;
  const baseOpex=parseNum(document.getElementById('opex').value)/100;
  const baseVac=parseNum(document.getElementById('vac').value)/100;
  const metric=document.getElementById('metric').value;

  if(var1===var2){alert('Please select two different variables.');return;}

  /* Define ranges for each variable */
  function getRange(v){
    switch(v){
      case 'vacancy': return [0,3,5,8,10,15];
      case 'rent': return [baseRent-400,baseRent-200,baseRent,baseRent+200,baseRent+400,baseRent+600];
      case 'rate': return [5,5.5,6,6.5,7,7.5,8];
      case 'expenses': return [25,30,35,40,45,50];
      case 'price': return [basePrice*0.85,basePrice*0.9,basePrice*0.95,basePrice,basePrice*1.05,basePrice*1.1];
      default: return [0];
    }
  }
  function getLabel(v,val){
    switch(v){
      case 'vacancy': return val+'%';
      case 'rent': return formatCurrency(val);
      case 'rate': return val+'%';
      case 'expenses': return val+'%';
      case 'price': return formatCurrency(val);
      default: return String(val);
    }
  }
  function getVarName(v){
    switch(v){
      case 'vacancy': return 'Vacancy';
      case 'rent': return 'Rent';
      case 'rate': return 'Rate';
      case 'expenses': return 'Expenses';
      case 'price': return 'Price';
      default: return v;
    }
  }

  const range1=getRange(var1);
  const range2=getRange(var2);

  /* Core calculation for a given set of params */
  function calcMetric(p,r,rent,vacPct,expPct){
    const loan=p*(1-dpPct);
    const mr=(r/100)/12;const n=term*12;
    const mortPmt=mr>0?loan*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):loan/n;
    const egi=rent*12*(1-vacPct/100);
    const noi=egi*(1-expPct/100);
    const annualDS=mortPmt*12;
    const cashflow=noi-annualDS;
    const cashIn=p*dpPct;
    const caprate=p>0?noi/p*100:0;
    const coc=cashIn>0?cashflow/cashIn*100:0;
    const dscr=annualDS>0?noi/annualDS:0;
    switch(metric){
      case 'cashflow': return cashflow;
      case 'caprate': return caprate;
      case 'coc': return coc;
      case 'dscr': return dscr;
      default: return cashflow;
    }
  }

  /* Resolve variable values for each cell */
  function resolveParams(v1Val,v2Val){
    let p=basePrice,r=baseRate*100,rnt=baseRent,vac=baseVac*100,exp=baseOpex*100;
    function applyVar(varName,val){
      switch(varName){
        case 'vacancy': vac=val;break;
        case 'rent': rnt=val;break;
        case 'rate': r=val;break;
        case 'expenses': exp=val;break;
        case 'price': p=val;break;
      }
    }
    applyVar(var1,v1Val);
    applyVar(var2,v2Val);
    return calcMetric(p,r,rnt,vac,exp);
  }

  /* Build grid */
  const grid=[];
  let best=-Infinity,worst=Infinity,baseVal=0;
  const midR=Math.floor(range1.length/2);
  const midC=Math.floor(range2.length/2);
  for(let i=0;i<range1.length;i++){
    grid[i]=[];
    for(let j=0;j<range2.length;j++){
      const val=resolveParams(range1[i],range2[j]);
      grid[i][j]=val;
      if(val>best)best=val;
      if(val<worst)worst=val;
      if(i===midR&&j===midC)baseVal=val;
    }
  }

  /* Format metric value */
  function fmtVal(v){
    switch(metric){
      case 'cashflow': return formatCurrency(v);
      case 'caprate': return formatPct(v);
      case 'coc': return formatPct(v);
      case 'dscr': return v.toFixed(2);
      default: return formatCurrency(v);
    }
  }

  /* Smooth green-to-red heat map coloring */
  function cellColor(v){
    /* Normalize value to 0-1 range across the grid */
    var range=best-worst;
    var t=range>0?(v-worst)/range:0.5;
    /* Clamp */
    t=Math.max(0,Math.min(1,t));
    /* Green (good) to Yellow (mid) to Red (bad) gradient */
    var r,g,b;
    if(t>=0.5){
      /* Yellow to Green */
      var s=(t-0.5)*2;
      r=Math.round(245-245*s+16*s);
      g=Math.round(158+(185-158)*s);
      b=Math.round(11+(129-11)*s);
    } else {
      /* Red to Yellow */
      var s=t*2;
      r=Math.round(239+(245-239)*s);
      g=Math.round(68+(158-68)*s);
      b=Math.round(68-(68-11)*s);
    }
    var alpha=0.22;
    return 'background:rgba('+r+','+g+','+b+','+alpha+');color:var(--color-text)';
  }

  /* KPIs */
  document.getElementById('kpiBest').textContent=fmtVal(best);
  document.getElementById('kpiBestDetail').textContent='Best combination in grid';
  document.getElementById('kpiBase').textContent=fmtVal(baseVal);
  document.getElementById('kpiBaseDetail').textContent='Center of grid (base assumptions)';
  document.getElementById('kpiWorst').textContent=fmtVal(worst);
  document.getElementById('kpiWorstDetail').textContent='Worst combination in grid';
  const rangeVal=best-worst;
  document.getElementById('kpiRange').textContent=fmtVal(rangeVal);
  document.getElementById('kpiRangeDetail').textContent='Spread between best and worst';

  /* Build sensitivity grid HTML table */
  const container=document.getElementById('sensitivityGrid');
  let html='<table class="results-table" style="min-width:600px"><thead><tr>';
  html+='<th style="position:sticky;left:0;background:var(--color-surface);z-index:1">'+getVarName(var1)+' \\ '+getVarName(var2)+'</th>';
  for(let j=0;j<range2.length;j++){
    html+='<th class="text-right">'+getLabel(var2,range2[j])+'</th>';
  }
  html+='</tr></thead><tbody>';
  for(let i=0;i<range1.length;i++){
    html+='<tr><td style="font-weight:600;white-space:nowrap;position:sticky;left:0;background:var(--color-surface);z-index:1">'+getLabel(var1,range1[i])+'</td>';
    for(let j=0;j<range2.length;j++){
      const v=grid[i][j];
      html+='<td class="text-right" style="'+cellColor(v)+(i===midR&&j===midC?';font-weight:700;outline:2px solid var(--color-primary)':'')+'">'+fmtVal(v)+'</td>';
    }
    html+='</tr>';
  }
  html+='</tbody></table>';
  /* Heat map legend */
  html+='<div class="heatmap-legend"><span class="heatmap-legend-label">Worst</span><div class="heatmap-legend-bar"></div><span class="heatmap-legend-label">Best</span></div>';
  container.innerHTML=html;

  /* Chart: Base Case Waterfall */
  destroyCharts();const cs=getCS();
  const baseLoan=basePrice*(1-dpPct);
  const baseMr=(baseRate)/12;const baseN=term*12;
  const baseMortPmt=baseMr>0?baseLoan*(baseMr*Math.pow(1+baseMr,baseN))/(Math.pow(1+baseMr,baseN)-1):baseLoan/baseN;
  const baseGross=baseRent*12;
  const baseVacLoss=baseGross*baseVac;
  const baseEGI=baseGross-baseVacLoss;
  const baseExpenses=baseEGI*baseOpex;
  const baseNOI=baseEGI-baseExpenses;
  const baseDS=baseMortPmt*12;
  const baseCF=baseNOI-baseDS;

  /* Floating waterfall bars: [base, top] */
  const wfLabels=['Gross Rent','Vacancy','EGI','Expenses','NOI','Debt Service','Cash Flow'];
  const wfData=[
    [0,baseGross],
    [baseEGI,baseGross],
    [0,baseEGI],
    [baseNOI,baseEGI],
    [0,baseNOI],
    [baseCF,baseNOI],
    [Math.min(0,baseCF),Math.max(0,baseCF)]
  ];
  const wfColors=[cs.c1,cs.c2,cs.c1,cs.c2,cs.c3,cs.c2,baseCF>=0?cs.c3:cs.c5];
  window.__charts.waterfall=new Chart(document.getElementById('chartWaterfall'),{type:'bar',
    data:{labels:wfLabels,datasets:[{data:wfData,backgroundColor:wfColors}]},
    options:{...chartOpts('Base Case Waterfall','bar'),
      plugins:{...chartOpts('','bar').plugins,legend:{display:false},
        tooltip:{callbacks:{label:function(ctx){const v=ctx.raw;return formatCurrency(v[1]-v[0]);}}}
      },
      scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}
    }
  });

  showResults();
}