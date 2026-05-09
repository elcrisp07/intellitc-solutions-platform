/* HELOC vs. Home Equity Loan Decision Engine */

/* ---------- Dark / Light theme toggle ---------- */
(function(){
  const toggles = document.querySelectorAll('[data-theme-toggle]');
  const r = document.documentElement;
  let d = localStorage.getItem('intellitc-theme') || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
  r.setAttribute('data-theme', d);
  function updateIcon(){
    const icon = d === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    toggles.forEach(t => { t.innerHTML = icon; });
  }
  updateIcon();
  toggles.forEach(t => {
    t.addEventListener('click', () => {
      d = d === 'dark' ? 'light' : 'dark';
      r.setAttribute('data-theme', d);
      localStorage.setItem('intellitc-theme', d);
      t.setAttribute('aria-label', 'Switch to ' + (d === 'dark' ? 'light' : 'dark') + ' mode');
      updateIcon();
    });
  });
})();

/* ---------- Tool Logic ---------- */
const $ = id => document.getElementById(id);
function num(id){ return Number(String($(id).value).replace(/[^0-9.\-]/g,''))||0; }
function fmt$(n){ return '$' + Math.round(n).toLocaleString(); }
function fmtPct(n){ return n.toFixed(2) + '%'; }

['homeValue','mortgageBalance','borrowAmount'].forEach(id=>{
  const el = $(id);
  if(!el) return;
  el.addEventListener('input', ()=>{
    const raw = String(el.value).replace(/[^0-9]/g,'');
    if(raw==='') return;
    el.value = Number(raw).toLocaleString();
  });
});

function rateForScore(score, isHeloc){
  let baseHel, baseHeloc;
  if(score >= 760){ baseHel = 8.25; baseHeloc = 8.50; }
  else if(score >= 720){ baseHel = 8.75; baseHeloc = 9.00; }
  else if(score >= 680){ baseHel = 9.50; baseHeloc = 9.75; }
  else if(score >= 640){ baseHel = 10.75; baseHeloc = 10.99; }
  else if(score >= 600){ baseHel = 12.50; baseHeloc = 12.75; }
  else { baseHel = 14.00; baseHeloc = 14.25; }
  return isHeloc ? baseHeloc : baseHel;
}

function monthlyPmt(principal, annualRatePct, years){
  const r = (annualRatePct/100) / 12;
  const n = years * 12;
  if(r === 0) return principal / n;
  return principal * r / (1 - Math.pow(1+r, -n));
}

function showInputs(){
  $('inputPanel').classList.remove('hidden');
  $('resultsPanel').classList.add('hidden');
  window.scrollTo({top:0,behavior:'smooth'});
}

function runDecision(){
  const homeValue = num('homeValue');
  const mortBal = num('mortgageBalance');
  const lenderCltv = num('lenderCltv');
  const credit = num('creditScore');
  const borrow = num('borrowAmount');
  const useCase = $('useCase').value;
  const stability = $('incomeStability').value;
  const ratePref = $('ratePref').value;
  const term = num('termYears');

  if(homeValue <= 0 || borrow <= 0 || term <= 0){
    alert('Please fill in home value, borrow amount, and term.');
    return;
  }

  const newCombinedDebt = mortBal + borrow;
  const newCltvPct = (newCombinedDebt / homeValue) * 100;
  $('cltvOut').textContent = fmtPct(newCltvPct) + ' (max ' + lenderCltv + '%)';
  $('cltvFill').style.width = Math.min(100, newCltvPct) + '%';

  const cltvStat = $('cltvStatus');
  cltvStat.classList.remove('ok','warn','danger');
  if(newCltvPct <= lenderCltv - 5){
    cltvStat.classList.add('ok');
    cltvStat.textContent = 'You\u2019re within the lender\u2019s CLTV cap with room to spare.';
  } else if(newCltvPct <= lenderCltv){
    cltvStat.classList.add('warn');
    cltvStat.textContent = 'Tight \u2014 you\u2019re right at the lender\u2019s CLTV ceiling. Expect closer scrutiny.';
  } else {
    cltvStat.classList.add('danger');
    cltvStat.textContent = 'You exceed the lender\u2019s max CLTV by ' + (newCltvPct - lenderCltv).toFixed(1) + ' pts. You\u2019ll need to borrow less, raise the home value, or find a higher-CLTV lender.';
  }

  const helRate = rateForScore(credit, false);
  const helocRate = rateForScore(credit, true);

  const helPmt = monthlyPmt(borrow, helRate, term);
  const helTotalPaid = helPmt * term * 12;
  const helInterest = helTotalPaid - borrow;

  $('hetRate').textContent = fmtPct(helRate);
  $('hetPmt').textContent = fmt$(helPmt) + '/mo';
  $('hetInterest').textContent = fmt$(helInterest);
  $('hetTotal').textContent = fmt$(helTotalPaid);

  const drawYears = Math.min(5, Math.max(1, Math.floor(term/3)));
  const repayYears = term - drawYears;
  const helocIOpmt = borrow * (helocRate/100) / 12;
  const helocAmortPmt = repayYears > 0 ? monthlyPmt(borrow, helocRate, repayYears) : 0;
  const helocTotalPaid = helocIOpmt * drawYears * 12 + helocAmortPmt * repayYears * 12;

  $('helocRate').textContent = fmtPct(helocRate) + ' (variable)';
  $('helocPmtIO').textContent = fmt$(helocIOpmt) + '/mo';
  $('helocPmtAmort').textContent = fmt$(helocAmortPmt) + '/mo';
  $('helocTotal').textContent = fmt$(helocTotalPaid) + ' (full draw)';

  let helocScore = 0, helScore = 0;
  if(['ongoing','emergency','unknown','education'].includes(useCase)) helocScore += 3;
  if(['renovation','debt-consol','business'].includes(useCase)) helScore += 3;
  if(stability === 'stable') helScore += 2;
  else helocScore += 2;
  if(ratePref === 'fixed') helScore += 2;
  else if(ratePref === 'variable') helocScore += 2;
  if(helTotalPaid < helocTotalPaid) helScore += 1;
  else helocScore += 1;

  let banner, bannerClass;
  $('hetRec').classList.add('hidden');
  $('helocRec').classList.add('hidden');
  $('hetCard').classList.remove('recommended');
  $('helocCard').classList.remove('recommended');

  if(newCltvPct > lenderCltv){
    banner = '<strong>Neither path works at this borrow amount.</strong> Your post-loan CLTV of ' + newCltvPct.toFixed(1) + '% exceeds the ' + lenderCltv + '% lender cap. Reduce the borrow amount to about ' + fmt$(homeValue * (lenderCltv/100) - mortBal) + ' or shop for a higher-CLTV lender.';
    bannerClass = 'verdict-tie';
  } else if(helScore > helocScore){
    banner = 'Based on your inputs, a <strong>Home Equity Loan</strong> is the better fit. You know exactly how much you need, your income is stable, and a fixed rate gives you a predictable payoff. Estimated cost: ' + fmt$(helTotalPaid) + ' total over ' + term + ' years at ' + fmtPct(helRate) + '.';
    bannerClass = 'verdict-hel';
    $('hetRec').classList.remove('hidden');
    $('hetCard').classList.add('recommended');
  } else if(helocScore > helScore){
    banner = 'Based on your inputs, a <strong>HELOC</strong> is the better fit. Your need is variable or your income is uneven, and the flexibility of drawing only what you use will likely save you money. Pay attention to the variable rate \u2014 budget as if it could rise 1\u20132 points.';
    bannerClass = 'verdict-heloc';
    $('helocRec').classList.remove('hidden');
    $('helocCard').classList.add('recommended');
  } else {
    banner = 'It\u2019s essentially a <strong>toss-up</strong>. Both products score evenly on your inputs. Default to the Home Equity Loan if you value certainty; choose the HELOC if you value flexibility.';
    bannerClass = 'verdict-tie';
  }

  const v = $('verdictBanner');
  v.className = 'verdict-banner ' + bannerClass;
  v.innerHTML = banner;

  if(credit < 670){
    $('badCreditCallout').classList.remove('hidden');
  } else {
    $('badCreditCallout').classList.add('hidden');
  }

  $('inputPanel').classList.add('hidden');
  $('resultsPanel').classList.remove('hidden');
  window.scrollTo({top:0,behavior:'smooth'});
}
