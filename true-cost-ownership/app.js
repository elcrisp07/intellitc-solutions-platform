/* ============================================================
   True Cost of Homeownership — IntelliTC Solutions
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
  const price=parseNum(document.getElementById('price').value);
  const dpPct=parseNum(document.getElementById('dpPct').value)/100;
  const rate=parseNum(document.getElementById('rate').value)/100;
  const term=parseNum(document.getElementById('term').value);
  const taxRate=parseNum(document.getElementById('taxRate').value)/100;
  const insYr=parseNum(document.getElementById('insYr').value);
  const hoa=parseNum(document.getElementById('hoa').value);
  const maintPct=parseNum(document.getElementById('maintPct').value)/100;
  const utilities=parseNum(document.getElementById('utilities').value);
  const capex=parseNum(document.getElementById('capex').value);
  const yard=parseNum(document.getElementById('yard').value);
  const pest=parseNum(document.getElementById('pest').value);
  const warranty=parseNum(document.getElementById('warranty').value);

  const loan=price*(1-dpPct);
  const mr=rate/12;const n=term*12;
  const pi=mr>0?loan*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):loan/n;
  const pmi=dpPct<0.20?loan*0.005/12:0;
  const taxMo=price*taxRate/12;
  const insMo=insYr/12;
  const maintMo=price*maintPct/12;

  const trueCost=pi+taxMo+insMo+hoa+pmi+maintMo+utilities+capex+yard+pest+warranty;
  const hiddenCosts=trueCost-pi;
  const pctAbove=pi>0?(hiddenCosts/pi*100):0;

  document.getElementById('kpiTrueCost').textContent=formatCurrency(trueCost);
  document.getElementById('kpiTrueCostDetail').textContent='Total monthly out-of-pocket';
  document.getElementById('kpiMortOnly').textContent=formatCurrency(pi);
  document.getElementById('kpiMortOnlyDetail').textContent='What most people think they\'ll pay';
  document.getElementById('kpiHidden').textContent=formatCurrency(hiddenCosts);
  document.getElementById('kpiHidden').className='kpi-value kpi-negative';
  document.getElementById('kpiHiddenDetail').textContent='Everything beyond your P&I payment';
  document.getElementById('kpiPctAbove').textContent=formatPct(pctAbove);
  document.getElementById('kpiPctAboveDetail').textContent='Your true cost is '+formatPct(pctAbove)+' more than P&I';

  destroyCharts();const cs=getCS();

  /* Chart 1: Stacked bar showing each component */
  const catAmounts=[pi,taxMo,insMo,hoa,pmi,maintMo,utilities,capex,yard,pest,warranty].filter(v=>v>0);
  const catLabels=['Mortgage P&I','Property Tax','Insurance','HOA','PMI','Maintenance','Utilities','CapEx Reserve','Yard/Landscaping','Pest Control','Home Warranty'].filter((_,i)=>[pi,taxMo,insMo,hoa,pmi,maintMo,utilities,capex,yard,pest,warranty][i]>0);
  const catColors=[cs.c1,cs.c2,cs.c3,cs.c5,cs.c6,cs.c4,cs.c7,cs.c8,cs.c1,cs.c2,cs.c3];
  window.__charts.stack=new Chart(document.getElementById('chartStack'),{type:'bar',data:{
    labels:['Monthly Cost'],
    datasets:catLabels.map((label,i)=>({label:label,data:[Math.round(catAmounts[i])],backgroundColor:catColors[i]}))
  },options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins},scales:{x:{stacked:true,ticks:{color:cs.text},grid:{display:false}},y:{stacked:true,ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  /* Chart 2: 5-year cumulative cost line */
  const annualIncrease=0.03;
  const yrs=[];const cumData=[];
  let cumTotal=0;
  /* Mortgage P&I and PMI stay flat; taxes, ins, maintenance, utils, capex, yard, pest, warranty increase 3%/yr */
  for(let y=1;y<=5;y++){
    yrs.push('Year '+y);
    const growthFactor=Math.pow(1+annualIncrease,y-1);
    const yearCost=(pi+pmi)*12+(taxMo+insMo+hoa+maintMo+utilities+capex+yard+pest+warranty)*12*growthFactor;
    cumTotal+=yearCost;
    cumData.push(Math.round(cumTotal));
  }
  window.__charts.proj=new Chart(document.getElementById('chartProj'),{type:'line',data:{
    labels:yrs,
    datasets:[{label:'Cumulative Cost',data:cumData,borderColor:cs.c1,backgroundColor:cs.c1+'20',fill:true,tension:0.3,pointRadius:4}]
  },options:{...chartOpts('','line'),plugins:{...chartOpts('','line').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text},grid:{color:cs.grid}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  /* Table: Monthly itemized */
  const tbody=document.getElementById('costBody');tbody.innerHTML='';
  const items=[
    ['Mortgage (P&I)',pi,'Your principal + interest payment'],
    ['Property Tax',taxMo,formatPct(taxRate*100)+' of home value'],
    ['Homeowners Insurance',insMo,''],
    ['HOA Dues',hoa,''],
    ['PMI',pmi,dpPct>=0.20?'Not required (20%+ down)':'Until you reach 20% equity'],
    ['Maintenance Reserve',maintMo,formatPct(maintPct*100)+' of home value/yr'],
    ['Utilities',utilities,'Electric, gas, water, trash, internet'],
    ['CapEx Reserve',capex,'Major repairs & replacements'],
    ['Yard / Landscaping',yard,''],
    ['Pest Control',pest,''],
    ['Home Warranty',warranty,'Optional coverage']
  ];
  items.forEach(r=>{
    if(r[1]<=0&&r[0]==='PMI'){
      tbody.innerHTML+='<tr style="color:var(--color-text-muted)"><td>'+r[0]+'</td><td class="text-right">$0</td><td style="font-size:var(--text-sm)">'+r[2]+'</td></tr>';
    } else if(r[1]>0){
      tbody.innerHTML+='<tr><td>'+r[0]+'</td><td class="text-right">'+formatCurrency(r[1])+'</td><td style="color:var(--color-text-muted);font-size:var(--text-sm)">'+r[2]+'</td></tr>';
    }
  });
  tbody.innerHTML+='<tr style="font-weight:700;border-top:2px solid var(--color-divider)"><td>True Monthly Cost</td><td class="text-right highlight">'+formatCurrency(trueCost)+'</td><td style="font-size:var(--text-sm)">'+formatCurrency(trueCost*12)+'/year</td></tr>';
  tbody.innerHTML+='<tr style="color:var(--color-text-muted)"><td>Of which: Mortgage P&I</td><td class="text-right">'+formatCurrency(pi)+'</td><td style="font-size:var(--text-sm)">'+formatPct(pi/trueCost*100)+' of total</td></tr>';
  tbody.innerHTML+='<tr style="color:var(--color-error)"><td>Of which: Hidden Costs</td><td class="text-right">'+formatCurrency(hiddenCosts)+'</td><td style="font-size:var(--text-sm)">'+formatPct(hiddenCosts/trueCost*100)+' of total</td></tr>';
  showResults();}