/* ============================================================
   Short-Term Rental Calculator — IntelliTC Solutions
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
  const pp=parseNum(document.getElementById('price').value);
  const dpPct=parseNum(document.getElementById('dp').value)/100;
  const rate=parseNum(document.getElementById('rate').value)/100;
  const trm=parseNum(document.getElementById('term').value);
  const nightly=parseNum(document.getElementById('nightlyRate').value);
  const occPct=parseNum(document.getElementById('occupancy').value)/100;
  const cleanFee=parseNum(document.getElementById('cleanFee').value);
  const avgStay=parseNum(document.getElementById('avgStay').value);
  const platPct=parseNum(document.getElementById('platformFee').value)/100;
  const furnish=parseNum(document.getElementById('furnishing').value);
  const mgmtPct=parseNum(document.getElementById('mgmt').value)/100;
  const taxYr=parseNum(document.getElementById('taxYr').value);
  const insYr=parseNum(document.getElementById('insYr').value);
  const utils=parseNum(document.getElementById('utils').value);
  const supplies=parseNum(document.getElementById('supplies').value);
  const maintPct=parseNum(document.getElementById('maintenance').value)/100;
  const hoa=parseNum(document.getElementById('hoa').value);
  const ltrRent=parseNum(document.getElementById('ltrRent').value);

  const loan=pp*(1-dpPct);const mr=rate/12;const n=trm*12;
  const mortPmt=mr>0?loan*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):loan/n;

  // STR revenue
  const bookedNights=365*occPct;
  const nightlyRev=bookedNights*nightly;
  const numStays=bookedNights/avgStay;
  const cleanRev=numStays*cleanFee;
  const grossRev=nightlyRev+cleanRev;
  const platFee=grossRev*platPct;
  const netRev=grossRev-platFee;

  // STR expenses
  const mgmtAnn=netRev*mgmtPct;
  const maintAnn=pp*maintPct;
  const cleanCostPerStay=cleanFee*0.8;
  const cleanExp=numStays*cleanCostPerStay;
  const totalExpAnn=taxYr+insYr+utils*12+supplies*12+maintAnn+hoa*12+mgmtAnn+cleanExp;

  const noiAnn=netRev-totalExpAnn;
  const debtAnn=mortPmt*12;
  const cfAnn=noiAnn-debtAnn;
  const cfMo=cfAnn/12;

  const cashIn=pp*dpPct+pp*0.03+furnish;
  const coc=cashIn>0?cfAnn/cashIn*100:0;

  // Break-even occupancy
  const fixedCosts=totalExpAnn-mgmtAnn-cleanExp+debtAnn;
  const revPerNight=nightly+(cleanFee/avgStay);
  const varCostPerNight=revPerNight*platPct+revPerNight*(1-platPct)*mgmtPct+cleanCostPerStay/avgStay;
  const beOcc=fixedCosts/((revPerNight-varCostPerNight)*365)*100;

  // LTR comparison
  let ltrCF=0;
  if(ltrRent>0){
    const ltrEGI=ltrRent*12*0.95;
    const ltrExp=taxYr+insYr*0.7+pp*0.01+ltrRent*0.08*12;
    ltrCF=ltrEGI-ltrExp-debtAnn;
  }

  document.getElementById('kpiNetIncome').textContent=formatCurrency(cfMo);
  document.getElementById('kpiNetIncome').className='kpi-value '+(cfMo>=0?'kpi-positive':'kpi-negative');
  document.getElementById('kpiNetIncomeDetail').textContent=formatCurrency(cfAnn)+'/year';
  document.getElementById('kpiRevenue').textContent=formatCurrency(grossRev);
  document.getElementById('kpiRevenueDetail').textContent=Math.round(bookedNights)+' nights booked';
  document.getElementById('kpiCoC').textContent=formatPct(coc);
  document.getElementById('kpiCoCDetail').textContent='On '+formatCurrency(cashIn)+' invested';
  document.getElementById('kpiBEOcc').textContent=formatPct(Math.min(beOcc,100));
  document.getElementById('kpiBEOccDetail').textContent='Current: '+formatPct(occPct*100);

  destroyCharts();const cs=getCS();

  window.__charts.rev=new Chart(document.getElementById('chartRevExp'),{
    type:'bar',data:{labels:['Gross Revenue','Platform Fees','Management','Taxes+Insurance','Utilities+Supplies','Maintenance','Cleaning','Mortgage','Net Income'],
    datasets:[{data:[grossRev,-platFee,-mgmtAnn,-(taxYr+insYr),-(utils+supplies)*12,-maintAnn,-cleanExp,-debtAnn,cfAnn],
      backgroundColor:[cs.c1,cs.c2,cs.c2,cs.c2,cs.c2,cs.c2,cs.c2,cs.c5,cfAnn>=0?cs.c1:cs.c2]}]},
    options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text,maxRotation:45},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}
  });

  if(ltrRent>0){
    window.__charts.comp=new Chart(document.getElementById('chartComp'),{
      type:'bar',data:{labels:['STR Income','LTR Income'],datasets:[{data:[cfAnn,ltrCF],backgroundColor:[cs.c1,cs.c3]}]},
      options:{...chartOpts('','bar'),plugins:{...chartOpts('','bar').plugins,legend:{display:false}},scales:{x:{ticks:{color:cs.text},grid:{display:false}},y:{ticks:{color:cs.text,callback:v=>formatCurrency(v)},grid:{color:cs.grid}}}}
    });
  }

  const tbody=document.getElementById('plBody');tbody.innerHTML='';
  const items=[['Nightly Revenue',nightlyRev/12,nightlyRev,''],['Cleaning Revenue',cleanRev/12,cleanRev,''],['Gross Revenue',grossRev/12,grossRev,'bold'],['Platform Fees',-platFee/12,-platFee,''],['Net Revenue',netRev/12,netRev,'bold'],['---'],['Property Tax',-taxYr/12,-taxYr,''],['Insurance',-insYr/12,-insYr,''],['Utilities',-utils,-utils*12,''],['Supplies',-supplies,-supplies*12,''],['Maintenance',-maintAnn/12,-maintAnn,''],['Management',-mgmtAnn/12,-mgmtAnn,''],['Cleaning Costs',-cleanExp/12,-cleanExp,''],['HOA',-hoa,-hoa*12,''],['Total Expenses',-totalExpAnn/12,-totalExpAnn,'bold'],['---'],['NOI',noiAnn/12,noiAnn,'bold'],['Mortgage',-mortPmt,-debtAnn,''],['Net Cash Flow',cfMo,cfAnn,'bold highlight']];
  items.forEach(r=>{
    if(r[0]==='---'){tbody.innerHTML+='<tr><td colspan="3" style="border-bottom:2px solid var(--color-divider)"></td></tr>';return;}
    const [l,mo,yr,cls]=r;const s=cls.includes('bold')?'font-weight:600':'';const hi=cls.includes('highlight')?' highlight':'';
    tbody.innerHTML+=`<tr style="${s}"><td>${l}</td><td class="text-right${hi}">${formatCurrency(mo)}</td><td class="text-right${hi}">${formatCurrency(yr)}</td></tr>`;
  });
  showResults();
}
