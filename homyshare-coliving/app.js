/* ============================================================
   HomyShare Co-Living Calculator — IntelliTC Solutions
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
  const price=parseNum(document.getElementById('price').value);
  const dpPct=parseNum(document.getElementById('dpPct').value)/100;
  const rate=parseNum(document.getElementById('rate').value)/100;
  const term=parseNum(document.getElementById('term').value);
  const totalRooms=Math.max(1,Math.round(parseNum(document.getElementById('totalRooms').value)));
  const rentPerRoom=parseNum(document.getElementById('rentPerRoom').value);
  const commonCosts=parseNum(document.getElementById('commonCosts').value);
  const furnishCost=parseNum(document.getElementById('furnishCost').value);
  const vacancyPct=parseNum(document.getElementById('vacancyPct').value)/100;
  const mgmtPct=parseNum(document.getElementById('mgmtPct').value)/100;
  const taxesYr=parseNum(document.getElementById('taxesYr').value);
  const insYr=parseNum(document.getElementById('insYr').value);
  const maintPct=parseNum(document.getElementById('maintPct').value)/100;
  const ownerOccupy=document.getElementById('ownerOccupy').value==='yes';
  const altRent=parseNum(document.getElementById('altRent').value);

  /* Mortgage */
  const dp=price*dpPct;
  const loan=price-dp;
  const mr=rate/12;const n=term*12;
  const mortPmt=mr>0?loan*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):loan/n;

  /* Revenue */
  const rentedRooms=ownerOccupy?totalRooms-1:totalRooms;
  const grossRentMo=rentedRooms*rentPerRoom;
  const grossRentYr=grossRentMo*12;
  const vacancyLoss=grossRentMo*vacancyPct;
  const effectiveRentMo=grossRentMo-vacancyLoss;

  /* Expenses */
  const mgmtMo=effectiveRentMo*mgmtPct;
  const maintMo=grossRentMo*maintPct;
  const taxesMo=taxesYr/12;
  const insMo=insYr/12;
  const totalExpMo=taxesMo+insMo+maintMo+mgmtMo+commonCosts;
  const noiMo=effectiveRentMo-totalExpMo;
  const cashFlowMo=noiMo-mortPmt;

  /* House-hacking savings */
  const housingSavings=ownerOccupy?altRent:0;
  const effectiveCF=cashFlowMo+housingSavings;

  /* Key metrics */
  const totalCashIn=dp+furnishCost;
  const cocReturn=totalCashIn>0?(effectiveCF*12)/totalCashIn*100:0;
  const revenuePerRoom=rentedRooms>0?effectiveRentMo/rentedRooms:0;

  /* Break-even rooms */
  const costPerRoom=rentPerRoom*(1-vacancyPct)*(1-mgmtPct-maintPct);
  const fixedCosts=mortPmt+taxesMo+insMo+commonCosts;
  const breakEvenRooms=costPerRoom>0?Math.ceil(fixedCosts/costPerRoom):totalRooms;

  /* Whole-unit comparison */
  const wholeUnitRent=rentPerRoom*totalRooms*0.55;/* typical whole-unit ~55% of room total */

  /* KPIs */
  document.getElementById('kpiMonthlyCF').textContent=formatCurrency(effectiveCF);
  document.getElementById('kpiMonthlyCF').className='kpi-value '+(effectiveCF>=0?'kpi-positive':'kpi-negative');
  document.getElementById('kpiMonthlyCFDetail').textContent=ownerOccupy?formatCurrency(cashFlowMo)+' rent income + '+formatCurrency(housingSavings)+' housing savings':formatCurrency(cashFlowMo*12)+'/year';
  document.getElementById('kpiRevenueRoom').textContent=formatCurrency(revenuePerRoom);
  document.getElementById('kpiRevenueRoomDetail').textContent=rentedRooms+' rooms rented at '+formatCurrency(rentPerRoom)+'/each';
  document.getElementById('kpiCoC').textContent=formatPct(cocReturn);
  document.getElementById('kpiCoCDetail').textContent='On '+formatCurrency(totalCashIn)+' invested';
  document.getElementById('kpiBreakEvenRooms').textContent=breakEvenRooms+' rooms';
  document.getElementById('kpiBreakEvenRoomsDetail').textContent=breakEvenRooms<=rentedRooms?'Within capacity — viable':'Need more rooms to break even';

  /* Charts */
  destroyCharts();const cs=getCS();

  /* Room revenue donut */
  const roomLabels=[];const roomData=[];const roomColors=[cs.c1,cs.c2,cs.c3,cs.c5,cs.c6,cs.c4,cs.c1,cs.c2];
  for(let r=1;r<=rentedRooms;r++){
    roomLabels.push('Room '+r);
    roomData.push(Math.round(rentPerRoom*(1-vacancyPct)));
  }
  if(ownerOccupy){roomLabels.push('Owner Suite');roomData.push(Math.round(housingSavings));}
  window.__charts.revenue=new Chart(document.getElementById('chartRevenue'),{type:'doughnut',data:{labels:roomLabels,datasets:[{data:roomData,backgroundColor:roomColors.slice(0,roomLabels.length)}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{color:cs.text}}}}});

  /* Co-living vs whole-unit comparison */
  const wholeEGI=wholeUnitRent*(1-vacancyPct);
  const wholeExp=wholeEGI*mgmtPct+wholeUnitRent*maintPct+taxesMo+insMo+commonCosts*0.5;
  const wholeCF=wholeEGI-wholeExp-mortPmt;
  window.__charts.compare=new Chart(document.getElementById('chartCompare'),{type:'bar',data:{labels:['Gross Revenue','Effective Income','Operating Expenses','Cash Flow'],datasets:[
    {label:'Co-Living ('+rentedRooms+' rooms)',data:[Math.round(grossRentMo),Math.round(effectiveRentMo),Math.round(-totalExpMo),Math.round(cashFlowMo)],backgroundColor:cs.c1},
    {label:'Whole-Unit Rental',data:[Math.round(wholeUnitRent),Math.round(wholeEGI),Math.round(-wholeExp),Math.round(wholeCF)],backgroundColor:cs.c2}
  ]},options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins},scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}});

  /* Table — room-by-room P&L */
  const tbody=document.getElementById('roomBody');tbody.innerHTML='';
  for(let r=1;r<=rentedRooms;r++){
    const effRent=rentPerRoom*(1-vacancyPct);
    const roomExp=(effRent*mgmtPct)+(rentPerRoom*maintPct)+(commonCosts/totalRooms);
    const roomNOI=effRent-roomExp;
    tbody.innerHTML+='<tr><td>Room '+r+'</td><td class="text-right">'+formatCurrency(rentPerRoom)+'</td><td class="text-right">'+formatCurrency(effRent)+'</td><td class="text-right">'+formatCurrency(roomExp)+'</td><td class="text-right">'+formatCurrency(roomNOI)+'</td></tr>';
  }
  if(ownerOccupy){
    tbody.innerHTML+='<tr style="opacity:0.7"><td>Owner Suite</td><td class="text-right">—</td><td class="text-right">'+formatCurrency(housingSavings)+' saved</td><td class="text-right">—</td><td class="text-right">'+formatCurrency(housingSavings)+'</td></tr>';
  }
  const totalNOI=noiMo;
  tbody.innerHTML+='<tr style="font-weight:700;border-top:2px solid var(--color-divider)"><td>Total</td><td class="text-right">'+formatCurrency(grossRentMo)+'</td><td class="text-right">'+formatCurrency(effectiveRentMo)+'</td><td class="text-right">'+formatCurrency(totalExpMo)+'</td><td class="text-right highlight">'+formatCurrency(totalNOI)+'</td></tr>';
  showResults();}