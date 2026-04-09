/* ============================================================
   Cap Rate Calculator — IntelliTC Solutions
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


function calculate(){
  const props=[];
  for(let i=1;i<=3;i++){
    const name=document.getElementById('name'+i).value.trim();
    const price=parseNum(document.getElementById('price'+i).value);
    if(!name||!price)continue;
    const income=parseNum(document.getElementById('income'+i).value);
    const vac=parseNum(document.getElementById('vacancy'+i).value)/100;
    const exp=parseNum(document.getElementById('expenses'+i).value);
    const egi=income*(1-vac);const noi=egi-exp;const capRate=price>0?noi/price*100:0;const grm=income>0?price/income:0;
    props.push({name,price,income,noi,capRate,grm});
  }
  if(props.length===0)return alert('Enter at least one property.');

  const caps=props.map(p=>p.capRate);
  const bestIdx=caps.indexOf(Math.max(...caps));
  const avg=caps.reduce((a,b)=>a+b,0)/caps.length;
  const grms=props.map(p=>p.grm).filter(g=>g>0);

  document.getElementById('kpiBest').textContent=formatPct(caps[bestIdx]);
  document.getElementById('kpiBestDetail').textContent=props[bestIdx].name;
  document.getElementById('kpiAvg').textContent=formatPct(avg);
  document.getElementById('kpiRange').textContent=formatPct(Math.min(...caps))+' – '+formatPct(Math.max(...caps));
  document.getElementById('kpiBestGRM').textContent=grms.length>0?Math.min(...grms).toFixed(1):'N/A';

  destroyCharts();const cs=getCS();
  const colors=[cs.c1,cs.c2,cs.c3,cs.c5,cs.c6];

  window.__charts.compare=new Chart(document.getElementById('chartCompare'),{
    type:'bar',data:{labels:props.map(p=>p.name),datasets:[{label:'Cap Rate %',data:caps,backgroundColor:props.map((_,i)=>colors[i])}]},
    options:{...chartOpts('','bar'),indexAxis:'y',plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{y:{ticks:{color:cs.text},grid:{display:false}},x:{ticks:{color:cs.text,callback:v=>v+'%'},grid:{color:cs.grid}}}}
  });

  window.__charts.scatter=new Chart(document.getElementById('chartScatter'),{
    type:'scatter',data:{datasets:props.map((p,i)=>({label:p.name,data:[{x:p.price,y:p.capRate}],backgroundColor:colors[i],pointRadius:10}))},
    options:{...chartOpts('','scatter'),plugins:{...chartOpts('','scatter').plugins,legend:{display:true,labels:{color:cs.text}}},scales:{x:{title:{display:true,text:'Purchase Price',color:cs.text},ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}},y:{title:{display:true,text:'Cap Rate %',color:cs.text},ticks:{color:cs.text,callback:v=>v+'%'},grid:{color:cs.grid}}}}
  });

  const tbody=document.getElementById('compBody');tbody.innerHTML='';
  props.forEach((p,i)=>{
    const best=i===bestIdx?' highlight':'';
    tbody.innerHTML+=`<tr><td${best?' class="highlight"':''}>${p.name}${i===bestIdx?' ★':''}</td><td class="text-right">${formatCurrency(p.price)}</td><td class="text-right">${formatCurrency(p.noi)}</td><td class="text-right${best}">${formatPct(p.capRate)}</td><td class="text-right">${p.grm.toFixed(1)}</td></tr>`;
  });
  showResults();
  // Save best cap rate + price for cross-calculator use
  if (props.length > 0) {
    DealData.save({
      capRate:       caps[bestIdx],
      purchasePrice: props[bestIdx].price,
      noi:           props[bestIdx].noi
    });
  }
}
