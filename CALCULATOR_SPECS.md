# IntelliTC Solutions — Calculator Build Specifications

## Architecture
Each calculator is a **standalone static webpage** (index.html + app.js) in its own folder under `/home/user/workspace/calculators/`. 
They share `/home/user/workspace/calculators/shared/base.css` and `/home/user/workspace/calculators/shared/style.css`.
Each calculator links to Chart.js v4 via CDN: `https://cdn.jsdelivr.net/npm/chart.js@4`
Each calculator links to Google Fonts: DM Sans + JetBrains Mono.

## Pattern (follow exactly)
- `index.html` loads shared/base.css, shared/style.css, Chart.js CDN, Google Fonts, and its own app.js
- CSS paths must use `../shared/base.css` and `../shared/style.css`
- `app.js` contains ALL calculator logic, chart rendering, and dark mode toggle
- The page has: header (logo + dark mode toggle), input panel, results panel (hidden initially), footer
- Results appear after clicking "Calculate" — show KPI cards + charts + detailed tables
- Include a "Modify Inputs" button to go back
- Every input field must have sensible defaults pre-filled
- Use the IntelliTC Solutions branding with teal accent

## Header HTML (use for every calculator):
```html
<header class="header">
  <div class="header-inner">
    <div class="logo">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <rect x="3" y="3" width="26" height="26" rx="4" stroke="currentColor" stroke-width="2"/>
        <path d="M10 16h12M16 10v12" stroke="var(--color-primary)" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
      <span class="logo-text">Intelli<span class="logo-accent">TC</span></span>
    </div>
    <button data-theme-toggle aria-label="Switch to dark mode">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    </button>
  </div>
</header>
```

## Footer HTML (use for every calculator):
```html
<footer class="footer">
  <p>This calculator is for educational purposes only and does not constitute financial, legal, or investment advice.</p>
  <p>&copy; IntelliTC Solutions &bull; <a href="https://intellitcsolutions.com" target="_blank">intellitcsolutions.com</a></p>
</footer>
```

## Dark mode toggle JS (include at top of every app.js):
```javascript
(function(){const t=document.querySelector('[data-theme-toggle]'),r=document.documentElement;let d=matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';r.setAttribute('data-theme',d);if(t){updateIcon();t.addEventListener('click',()=>{d=d==='dark'?'light':'dark';r.setAttribute('data-theme',d);t.setAttribute('aria-label','Switch to '+(d==='dark'?'light':'dark')+' mode');updateIcon();if(window.__charts){Object.values(window.__charts).forEach(c=>c.update())}});} function updateIcon(){if(!t)return;t.innerHTML=d==='dark'?'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>':'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';}})();
```

## Utility functions (include in every app.js):
```javascript
function parseNum(str){return parseFloat(String(str).replace(/[^0-9.\-]/g,''))||0;}
function formatCurrency(n){if(Math.abs(n)>=1e6)return'$'+(n/1e6).toFixed(1)+'M';if(Math.abs(n)>=1e3)return'$'+Math.round(n).toLocaleString();return'$'+n.toFixed(0);}
function formatPercent(n){return n.toFixed(1)+'%';}
function formatNumber(n){return Math.round(n).toLocaleString();}
window.__charts={};
function getChartColors(){const s=getComputedStyle(document.documentElement);return{c1:s.getPropertyValue('--chart-1').trim(),c2:s.getPropertyValue('--chart-2').trim(),c3:s.getPropertyValue('--chart-3').trim(),c4:s.getPropertyValue('--chart-4').trim(),c5:s.getPropertyValue('--chart-5').trim(),c6:s.getPropertyValue('--chart-6').trim(),text:s.getPropertyValue('--color-text-muted').trim(),grid:s.getPropertyValue('--color-divider').trim()};}
```

## Quality Requirements
1. ALL math must be correct — use standard financial formulas
2. Results must include at least 3 KPI cards and at least 1 chart (most should have 2-3 charts)
3. Charts must use Chart.js with theme-aware colors (read CSS variables)
4. All currency inputs auto-format with commas on blur
5. Include input validation with helpful error messages
6. Mobile-responsive using the shared CSS grid patterns
7. Print-friendly (header/footer hidden, clean layout)
8. Include a detailed amortization/projection table where applicable
9. Tooltips on field labels explaining what each input means

---

# CALCULATOR SPECIFICATIONS

## 1. Real Estate Investment Analyzer
**Folder:** `real-estate-investment-analyzer`
**Purpose:** Comprehensive deal analysis across 5 wealth-building dimensions
**Inputs:** Purchase price, ARV, repair costs, down payment %, interest rate, loan term, monthly rent, vacancy rate %, property tax %, insurance/yr, maintenance %, property management %, closing costs, annual appreciation rate
**Calculations:**
- Cash flow (monthly/annual): rent - mortgage - taxes - insurance - maintenance - management - vacancy
- Cash-on-cash return: annual cash flow / total cash invested
- Cap rate: NOI / purchase price
- Total ROI (5-year): (equity gain + cash flow + appreciation + tax benefits + principal paydown) / investment
- Equity buildup from principal paydown over time
- 5 wealth dimensions: Cash Flow, Appreciation, Principal Paydown, Tax Benefits (depreciation), Leverage amplification
**KPIs:** Monthly cash flow, CoC return, Cap rate, 5-year total ROI
**Charts:** 5-year wealth accumulation stacked bar (showing each dimension), monthly cash flow waterfall, equity buildup line chart
**Table:** Year-by-year breakdown of all 5 dimensions

## 2. RE Investment Analyzer
**Folder:** `re-investment-analyzer`
**Purpose:** Streamlined rental/income property underwriting
**Inputs:** Purchase price, down payment %, interest rate, loan term, gross monthly rent, vacancy rate %, operating expenses (taxes, insurance, maintenance, management as % or $), closing costs
**Calculations:**
- Gross rent multiplier: price / annual gross rent
- NOI: gross rent - vacancy - operating expenses
- Cap rate: NOI / price
- Cash flow: NOI - debt service
- DSCR: NOI / annual debt service
- Cash-on-cash: annual cash flow / total cash invested
- Break-even ratio: (debt service + operating expenses) / gross rent
**KPIs:** Monthly cash flow, Cap rate, CoC return, DSCR
**Charts:** Income vs expenses pie chart, 10-year cash flow projection line chart
**Table:** Monthly P&L breakdown

## 3. Investment Analysis
**Folder:** `investment-analysis`
**Purpose:** Quick ROI, cap rate, and cash flow snapshot
**Inputs:** Purchase price, down payment, interest rate, term, monthly income, monthly expenses breakdown (taxes, insurance, maintenance, utilities, management, HOA)
**Calculations:**
- Cap rate, GRM, CoC return, total monthly expenses, net cash flow, annual ROI, break-even occupancy
**KPIs:** Cap Rate, CoC Return, Monthly Cash Flow, Break-even Occupancy
**Charts:** Expense breakdown donut chart, ROI comparison bar chart (CoC vs cap rate vs total)
**Table:** Detailed expense itemization

## 4. BRRRR Calculator
**Folder:** `brrrr`
**Purpose:** Buy-Rehab-Rent-Refinance-Repeat cycle analysis
**Inputs:** Purchase price, rehab costs, ARV (after repair value), holding costs during rehab (months, monthly costs), refinance LTV %, refinance rate, refinance term, monthly rent, vacancy %, operating expenses, down payment on initial purchase
**Calculations:**
- Total cash invested: down payment + rehab + holding costs + closing costs
- After refinance: new loan = ARV × LTV%, cash out = new loan - original loan balance
- Cash left in deal: total invested - cash out
- Monthly cash flow after refi: rent - new mortgage - expenses
- CoC return on remaining cash
- Infinite return check: is cash left in deal ≤ 0?
**KPIs:** Cash left in deal, Monthly cash flow, CoC return, Infinite return (yes/no)
**Charts:** BRRRR phase waterfall (investment → rehab → refi → cash recouped), equity position diagram, projected cash flow chart
**Table:** Phase-by-phase breakdown with timeline

## 5. Cash Flow Calculator
**Folder:** `cashflow`
**Purpose:** Detailed monthly and annual rental property cash flow
**Inputs:** Monthly rent, other income, vacancy %, property taxes/yr, insurance/yr, maintenance %, management %, utilities, HOA, mortgage payment (or inputs to calculate it: price, down payment, rate, term)
**Calculations:**
- Gross scheduled income, effective gross income, total operating expenses, NOI, debt service, net cash flow, expense ratio, DSCR
**KPIs:** Monthly cash flow, Annual cash flow, NOI, Expense ratio
**Charts:** Income waterfall chart (gross → vacancy → expenses → debt → net), monthly cash flow breakdown donut
**Table:** Full monthly P&L statement

## 6. Cap Rate Calculator
**Folder:** `caprate`
**Purpose:** Quick cap rate comparison across multiple properties
**Inputs:** Allow up to 5 properties side-by-side. For each: property name, purchase price, gross annual income, vacancy %, annual operating expenses
**Calculations:**
- NOI = gross income - vacancy - expenses
- Cap rate = NOI / purchase price
- Price per unit (if units entered)
- GRM
**KPIs:** Best cap rate property, Average cap rate, Range
**Charts:** Horizontal bar chart comparing cap rates, scatter plot (price vs cap rate)
**Table:** Side-by-side comparison table

## 7. Fix & Flip Calculator
**Folder:** `fixflip`
**Purpose:** Rehab profit, risk, and margin analysis
**Inputs:** Purchase price, ARV, repair costs, holding period (months), holding costs/mo (insurance, taxes, utilities, loan interest), closing costs buy %, closing costs sell %, financing (hard money rate, points, LTV), desired profit margin
**Calculations:**
- Total cost: purchase + repairs + holding + closing (buy & sell)
- Profit: ARV - total cost
- ROI: profit / cash invested
- Profit margin: profit / ARV
- Maximum allowable offer (MAO): ARV × 70% - repairs
- Break-even sale price
- Annualized ROI based on holding period
**KPIs:** Net profit, ROI, Profit margin %, MAO
**Charts:** Cost breakdown waterfall, profit sensitivity chart (varying ARV ±10%), deal scorecard gauge
**Table:** Full cost itemization

## 8. Rental Analysis
**Folder:** `rental-analysis`
**Purpose:** Long-term rental property performance projection
**Inputs:** Purchase price, down payment %, rate, term, rent, vacancy %, expenses, annual rent growth %, annual appreciation %, annual expense growth %
**Calculations:**
- Year-by-year projections for 30 years: rent growth, expense growth, appreciation, principal paydown, equity, cash flow, cumulative wealth
**KPIs:** Year-1 cash flow, 10-year total return, IRR, Equity at year 10
**Charts:** 30-year wealth projection (stacked area: cash flow + equity + appreciation), year-over-year cash flow line
**Table:** Year-by-year projection table (scrollable)

## 9. Short-Term Rental (STR)
**Folder:** `short-term-rental`
**Purpose:** Airbnb/VRBO revenue and expense modeling
**Inputs:** Purchase price, down payment %, rate, term, nightly rate, occupancy rate %, cleaning fee, number of cleanings/month, platform fee %, property management %, furnishing costs, utilities/mo, insurance/yr, property tax/yr, maintenance %, HOA, supplies/mo
**Calculations:**
- Gross revenue: nightly rate × 365 × occupancy
- Net revenue after platform fees
- Total annual expenses
- NOI, cash flow, CoC return, cap rate
- Break-even occupancy rate
- STR vs LTR comparison if LTR rent provided
**KPIs:** Monthly net income, Annual revenue, CoC return, Break-even occupancy
**Charts:** Revenue vs expense breakdown, monthly seasonality model (allow high/med/low season inputs), STR vs LTR comparison bar
**Table:** Monthly P&L

## 10. Multi-Family Investment
**Folder:** `multifamily`
**Purpose:** 5+ unit apartment building underwriting
**Inputs:** Number of units, unit mix (e.g., # of 1BR, 2BR, 3BR with rents), purchase price, down payment %, rate, term, vacancy %, expense ratio % or itemized (taxes, insurance, management, maintenance, utilities, reserves, admin), annual rent growth %, cap rate for exit valuation
**Calculations:**
- Gross scheduled rent, effective gross income, total expenses, NOI
- Cap rate (purchase), DSCR, CoC return
- Price per unit, price per sq ft
- 10-year projection with rent growth and expense growth
- Exit valuation: projected NOI / exit cap rate
- IRR calculation
**KPIs:** NOI, Cap rate, CoC return, Price per unit, DSCR
**Charts:** Unit mix income pie chart, 10-year NOI projection, expense breakdown
**Table:** Unit mix table, 10-year pro forma

## 11. Distressed Asset Acquisition
**Folder:** `distressed-asset`
**Purpose:** Foreclosure and REO opportunity analysis
**Inputs:** Estimated market value, purchase price (discount %), repair/rehab costs, holding period, exit strategy (flip or rent), ARV, monthly holding costs, financing terms, back taxes owed, liens, title insurance
**Calculations:**
- Total acquisition cost: purchase + repairs + back taxes + liens + closing
- Discount from market: (market value - purchase) / market value
- If flip: profit = ARV - total cost, ROI
- If rent: cash flow analysis post-rehab
- Risk assessment: total exposure / ARV
- Maximum bid calculation
**KPIs:** Acquisition discount %, Projected profit, ROI, Risk score
**Charts:** Cost vs value waterfall, exit strategy comparison (flip vs hold), risk/reward quadrant
**Table:** Full cost breakdown

## 12. Land Development
**Folder:** `land-development`
**Purpose:** Raw land and development project feasibility
**Inputs:** Land cost, lot size, zoning (residential/commercial), number of planned units/lots, development costs (grading, utilities, roads, permits, engineering, legal), construction costs per unit, expected sale price per unit, development timeline (months), financing (construction loan rate, LTC ratio), soft costs %
**Calculations:**
- Total development cost: land + hard costs + soft costs + financing + contingency
- Gross revenue: units × sale price
- Net profit: revenue - total cost
- Profit margin, ROI, profit per unit
- Development spread: revenue / cost ratio
- Break-even units to sell
**KPIs:** Total profit, Profit margin, ROI, Break-even units
**Charts:** Cost breakdown waterfall, development timeline Gantt-style, profit sensitivity (varying units sold and price)
**Table:** Development budget itemization

## 13. Deal Grading
**Folder:** `deal-grading`
**Purpose:** Score and rank deals for pipeline prioritization
**Inputs:** For each deal (up to 5): name, purchase price, ARV, monthly rent, repair costs, cap rate, CoC return, cash flow, neighborhood grade (A-D), exit strategy
**Calculations:**
- Weighted scoring: cash flow (25%), CoC return (20%), cap rate (15%), equity spread (20%), location (10%), exit options (10%)
- Letter grade A-F for each criterion and overall
- Rank deals by total score
- Risk-adjusted score
**KPIs:** Top-ranked deal, Average score, Highest cash flow deal, Best value deal
**Charts:** Radar chart comparing deals, horizontal bar chart ranking, grade distribution
**Table:** Side-by-side scorecard

## 14. Portfolio Manager
**Folder:** `portfolio-manager`
**Purpose:** Multi-property portfolio tracking and performance
**Inputs:** Add 1-10 properties: name, purchase price, current value, monthly rent, monthly expenses, mortgage balance, monthly mortgage payment, year purchased
**Calculations:**
- Per property: cash flow, equity, CoC return, cap rate, appreciation since purchase
- Portfolio totals: total value, total equity, total monthly cash flow, weighted avg cap rate, weighted avg CoC
- Portfolio allocation by property type/value
- Concentration risk metrics
**KPIs:** Total portfolio value, Total equity, Total monthly cash flow, Avg CoC return
**Charts:** Portfolio allocation pie chart, equity growth over time, cash flow contribution bar chart, property comparison table
**Table:** Property summary table with all metrics

## 15. RE Cash-on-Cash Breakdown
**Folder:** `cash-on-cash-breakdown`
**Purpose:** Analyze the 5 profit centers of real estate
**Inputs:** Purchase price, down payment %, rate, term, monthly rent, vacancy %, expenses, appreciation rate %, tax bracket %, property depreciation (27.5 years)
**Calculations:**
- Profit Center 1: Cash Flow (monthly/annual net income)
- Profit Center 2: Appreciation (property value increase per year)
- Profit Center 3: Principal Paydown (equity from mortgage payments)
- Profit Center 4: Tax Benefits (depreciation write-off × tax bracket)
- Profit Center 5: Leverage (total return on invested cash, not total value)
- Combined annual return from all 5 centers
- True CoC when all 5 included
**KPIs:** Total annual return (all 5 combined), CoC including all 5, Cash flow only CoC, Appreciation contribution
**Charts:** Stacked bar showing all 5 profit centers by year, donut showing relative contribution, 10-year cumulative wealth chart
**Table:** Year-by-year breakdown of each profit center

## 16. Subject-To Calculator
**Folder:** `subject-to`
**Purpose:** Analyze taking over existing mortgage payments
**Inputs:** Current mortgage balance, current mortgage payment, current interest rate, remaining term, purchase price (what you pay the seller), property value/ARV, planned exit (hold for rent or resell), monthly rent (if holding), estimated expenses, any cash to seller at closing
**Calculations:**
- Cash needed: price to seller + closing costs
- Equity capture: value - mortgage balance - cash to seller
- Monthly cash flow if holding: rent - existing mortgage - expenses
- CoC return on cash to seller
- Savings vs new loan: compare subject-to payment to what a new loan would cost
- Due-on-sale risk assessment
**KPIs:** Instant equity, Monthly cash flow, CoC return, Savings vs new financing
**Charts:** Cost comparison (sub-to vs new loan over time), equity position diagram, cash flow projection
**Table:** Side-by-side: subject-to vs conventional purchase

## 17. Payment Reverse Engineering
**Folder:** `payment-reverse-engineering`
**Purpose:** Back into purchase price/terms from a target monthly payment
**Inputs:** Target monthly payment, interest rate, loan term, property tax rate %, insurance/yr, HOA/mo, PMI (if applicable), down payment %
**Calculations:**
- Maximum loan amount from target payment (after deducting taxes, insurance, HOA)
- Maximum purchase price: loan / (1 - down payment %)
- Amortization at that price
- Sensitivity: show price at different rates (±1%) and different down payments (5%, 10%, 15%, 20%)
**KPIs:** Max purchase price, Max loan amount, Total monthly PITI, Interest over life of loan
**Charts:** Purchase price sensitivity (rate vs price), payment breakdown donut, amortization curve
**Table:** Sensitivity grid (rate × down payment)

## 18. Seller Financing
**Folder:** `seller-financing`
**Purpose:** Structure seller-carry notes and creative deals
**Inputs:** Purchase price, down payment, seller note amount, seller note rate, seller note term, balloon payment (yes/no, when), any underlying mortgage (if wrap), monthly rent (if investment), operating expenses
**Calculations:**
- Monthly payment on seller note
- Total interest paid to seller
- Balloon amount at specified year
- If wrap: spread between underlying mortgage and buyer payment
- Seller's yield/return analysis
- Buyer's cash flow if rental property
- Comparison to conventional terms
**KPIs:** Monthly payment, Total interest to seller, Balloon amount, Buyer CoC return
**Charts:** Payment schedule (with balloon), buyer vs seller cash flow, conventional vs seller finance comparison
**Table:** Full amortization schedule

## 19. Lease Option
**Folder:** `lease-option`
**Purpose:** Rent-to-own and lease purchase scenario modeling
**Inputs:** Property value, option price (agreed purchase price), option consideration (upfront fee), lease term (months), monthly lease payment, rent credit % (portion applied to purchase), market rent, expected appreciation, buyer's estimated future down payment capacity
**Calculations:**
- Total rent credits accumulated: monthly credit × months
- Effective purchase price: option price - option fee - rent credits
- Equity at exercise: appreciated value - effective price
- Monthly premium over market rent
- Break-even appreciation needed
- ROI if option exercised vs not
**KPIs:** Total rent credits, Effective purchase price, Equity at exercise, Premium over market rent
**Charts:** Equity buildup over lease term, cost comparison (lease-option vs traditional purchase), option exercise decision tree
**Table:** Month-by-month rent credit accumulation

## 20. Private Money Lending
**Folder:** `private-money`
**Purpose:** Structure private/hard money loan terms and analyze yields
**Inputs:** Loan amount, interest rate, loan term (months), points charged, origination fee %, LTV ratio, property value, borrower's exit strategy, monthly payment type (interest-only or amortized)
**Calculations:**
- Lender perspective: total yield (interest + points + fees), annualized return, monthly income, total interest earned
- Borrower perspective: total cost of capital, effective APR, monthly payment
- LTV risk assessment
- Break-even for borrower
**KPIs:** Lender annual yield, Borrower effective APR, Monthly payment, LTV ratio
**Charts:** Lender income timeline, borrower cost breakdown, LTV risk gauge
**Table:** Payment schedule (lender and borrower views)

## 21. Buy Before You Sell
**Folder:** `buy-before-you-sell`
**Purpose:** Bridge strategy for move-up/move-down buyers
**Inputs:** Current home value, current mortgage balance, new home price, new home down payment, new mortgage rate/term, bridge loan rate/term (if applicable), estimated sale timeline for current home, carrying costs for both homes, expected selling costs for current home
**Calculations:**
- Monthly carrying cost for both homes simultaneously
- Bridge financing costs
- Net proceeds from sale of current home
- Total cost of transition: double payments + bridge costs + selling costs
- Timeline analysis: cost at 1, 2, 3, 6 month sale scenarios
- Break-even: how fast must current home sell
**KPIs:** Monthly double-carry cost, Total transition cost, Net from current sale, Break-even timeline
**Charts:** Timeline cost waterfall, scenario comparison (sell first vs buy first vs simultaneous), cumulative cost chart
**Table:** Month-by-month carrying cost breakdown

## 22. HELOC Optimizer
**Folder:** `heloc-optimizer`
**Purpose:** Velocity banking / mortgage payoff acceleration
**Inputs:** Mortgage balance, mortgage rate, mortgage term remaining, HELOC limit, HELOC rate, monthly income, monthly expenses, extra monthly amount for acceleration
**Calculations:**
- Standard payoff timeline and total interest
- Velocity banking strategy: chunk payments from HELOC, pay HELOC with income
- Total interest saved
- Time saved (months/years)
- Monthly cash flow required
- Comparison: HELOC acceleration vs extra payments vs bi-weekly payments
**KPIs:** Years saved, Interest saved, New payoff date, Monthly strategy payment
**Charts:** Payoff comparison (standard vs accelerated), balance over time comparison, interest savings waterfall
**Table:** Month-by-month balance comparison

## 23. HomyShare Co-Living
**Folder:** `homyshare-coliving`
**Purpose:** Co-living / shared housing investment analysis
**Inputs:** Purchase price, down payment %, rate, term, number of rooms for rent, rent per room, common area costs, utilities split, property management %, vacancy %, conversion/furnishing costs, house-hacking (owner occupies one room)
**Calculations:**
- Gross rent (all rooms), effective income after vacancy
- If house-hacking: personal housing cost savings
- NOI, cash flow, CoC return
- Per-room revenue analysis
- Comparison: whole-unit rent vs room-by-room
- Break-even occupancy (rooms needed)
**KPIs:** Monthly cash flow, Revenue per room, CoC return, Break-even rooms
**Charts:** Room revenue breakdown, co-living vs traditional rental comparison, occupancy sensitivity
**Table:** Room-by-room P&L

## 24. Refinance Analyzer
**Folder:** `refinance`
**Purpose:** Evaluate rate/term and cash-out refinance decisions
**Inputs:** Current loan: balance, rate, payment, remaining term. New loan: rate, term, closing costs, points, cash-out amount (if any). Current property value.
**Calculations:**
- New monthly payment, payment difference
- Break-even month: closing costs / monthly savings
- Total interest: old loan remaining vs new loan
- Net interest savings
- If cash-out: new LTV, cash received, cost of cash
- NPV of refinance decision
**KPIs:** Monthly savings, Break-even months, Total interest savings, New LTV (if cash-out)
**Charts:** Break-even analysis line chart, old vs new balance over time, total cost comparison
**Table:** Side-by-side comparison (current vs new), amortization

## 25. DSCR Loan Calculator
**Folder:** `dscr-loan`
**Purpose:** DSCR qualification for investment properties
**Inputs:** Property monthly rent, vacancy %, operating expenses, requested loan amount, interest rate, term, DSCR requirement (typically 1.0-1.25)
**Calculations:**
- NOI: rent × (1 - vacancy) - expenses
- Annual debt service from loan terms
- DSCR: NOI / debt service
- Maximum loan amount at target DSCR
- Maximum purchase price at given LTV
- Sensitivity: DSCR at different rates and loan amounts
**KPIs:** DSCR ratio, Max loan amount, Qualifies (yes/no), Monthly payment
**Charts:** DSCR gauge/meter, qualification grid (rate vs loan amount), payment breakdown
**Table:** DSCR sensitivity table

## 26. Government Loans (FHA/VA/USDA)
**Folder:** `government-loans`
**Purpose:** Compare FHA, VA, USDA, and conventional financing
**Inputs:** Purchase price, credit score range, military status (for VA), location (rural for USDA), income, existing debt/mo, loan term
**Calculations:**
- For each loan type: min down payment, PMI/MIP/funding fee, monthly payment, total cost over loan life, DTI check
- FHA: 3.5% down, upfront MIP 1.75%, annual MIP 0.85%
- VA: 0% down, funding fee 2.15% (first use), no PMI
- USDA: 0% down, guarantee fee 1%, annual fee 0.35%
- Conv: 3-20% down, PMI until 80% LTV
**KPIs:** Lowest monthly payment (which program), Lowest total cost, Required down payment comparison
**Charts:** Monthly payment comparison bar chart, total cost over time comparison, down payment comparison
**Table:** Side-by-side 4-loan comparison

## 27. Rate Buydown Calculator
**Folder:** `rate-buydown`
**Purpose:** Evaluate points vs rate tradeoffs
**Inputs:** Loan amount, base rate, loan term, points options (1-2-1 buydown, permanent buydown), cost per point, planned holding period
**Calculations:**
- Permanent buydown: cost of points, monthly savings, break-even month, total savings over hold period
- 2-1 buydown: year 1 rate, year 2 rate, year 3+ rate, total cost, monthly payments each year
- 3-2-1 buydown: similar
- Seller concession analysis: if seller pays for buydown
- Comparison: invest the buydown cost instead
**KPIs:** Break-even month, Total savings, Effective rate with buydown, Monthly savings
**Charts:** Monthly payment timeline (showing reduced rates), break-even crossover chart, buydown vs invest comparison
**Table:** Year-by-year payment schedule

## 28. Qualification Analysis
**Folder:** `qualification-analysis`
**Purpose:** DTI calculation and loan qualification check
**Inputs:** Gross monthly income, monthly debts (car, student loans, credit cards, other), proposed housing payment (or auto-calculate from price/rate/term), down payment, property taxes/mo, insurance/mo, HOA/mo, PMI (if applicable)
**Calculations:**
- Front-end DTI: housing costs / income
- Back-end DTI: (housing + all debts) / income
- Qualification by program: FHA (43% back-end), Conv (45%), VA (41% guideline)
- Maximum purchase price at each DTI threshold
- Income needed for a target price
- Remaining qualifying capacity
**KPIs:** Front-end DTI, Back-end DTI, Max purchase price, Qualifying status by program
**Charts:** DTI gauge meters (front and back), qualifying capacity bar, max price by program
**Table:** Debt breakdown, program qualification grid

## 29. Affordability Calculator
**Folder:** `affordability`
**Purpose:** How much house can you afford
**Inputs:** Annual income, monthly debts, down payment available, interest rate, loan term, property tax rate %, insurance estimate, HOA, comfort level (conservative/moderate/aggressive DTI targets)
**Calculations:**
- Max price at conservative (28/36 DTI), moderate (31/43), aggressive (35/50)
- Monthly payment breakdown at each level
- Required income for a target price
- 5-year outlook: can you still afford if rates rise 1-2%
**KPIs:** Recommended max price, Monthly payment, Money needed to close, Affordability rating
**Charts:** Affordability range slider visualization, payment breakdown at each level, rate sensitivity
**Table:** Detailed costs at conservative/moderate/aggressive

## 30. Home Equity Calculator
**Folder:** `home-equity`
**Purpose:** Understand equity position and HELOC/HEL options
**Inputs:** Current home value, mortgage balance, original purchase price, year purchased, HELOC rate, HEL rate/term, desired cash-out amount
**Calculations:**
- Current equity: value - balance
- LTV ratio: balance / value
- Equity percentage
- Available equity (at 80% and 90% CLTV)
- HELOC: available line, monthly interest payment
- HEL: fixed monthly payment, total interest
- Appreciation since purchase
**KPIs:** Total equity, LTV ratio, Available to borrow, Appreciation since purchase
**Charts:** Equity position visual (stacked bar showing mortgage vs equity), borrowing capacity chart, equity growth timeline
**Table:** HELOC vs HEL comparison

## 31. Commission Calculator
**Folder:** `commission`
**Purpose:** Real estate agent commission estimation
**Inputs:** Sale price, listing agent commission %, buyer agent commission %, flat fee (if any), team split %, brokerage split %, transaction fee, E&O fee
**Calculations:**
- Total commission, listing side, buyer side
- After team split, after brokerage split
- Agent net take-home
- Per-transaction breakdown
- Annual income projection (at X deals/year)
- Comparison: different commission structures
**KPIs:** Total commission, Agent net, Per-deal average, Effective commission rate
**Charts:** Commission flow waterfall, annual income projection at different deal volumes, structure comparison
**Table:** Detailed split breakdown

## 32. 1031 Exchange Calculator
**Folder:** `1031-exchange`
**Purpose:** Like-kind exchange tax deferral planning
**Inputs:** Relinquished property: sale price, adjusted basis (purchase price + improvements - depreciation), selling costs, mortgage balance. Replacement property: purchase price, mortgage, closing costs. Tax rates: federal capital gains %, state %, depreciation recapture %
**Calculations:**
- Capital gain: sale price - selling costs - adjusted basis
- Tax owed without exchange: gain × tax rates + depreciation recapture
- Boot (if any): cash or debt reduction not reinvested
- Tax on boot
- Tax deferred: total tax - boot tax
- Replacement property requirements: price ≥ sale price, equity ≥ equity
- Timeline: 45-day identification, 180-day closing
**KPIs:** Tax deferred, Capital gain, Boot amount, Replacement property minimum
**Charts:** Tax savings visualization, exchange timeline, reinvestment requirements diagram
**Table:** Full tax calculation breakdown

## 33. RV Park Investment
**Folder:** `rv-park-investment`
**Purpose:** RV park and tiny home community underwriting
**Inputs:** Number of sites, average monthly site rent, occupancy rate %, purchase price, down payment %, rate, term, operating expenses (management, maintenance, utilities, insurance, taxes, reserves), additional income (laundry, store, dump station fees), seasonal adjustment (high/low occupancy months)
**Calculations:**
- Gross revenue (with seasonal adjustment), NOI, cap rate, CoC return, DSCR
- Revenue per site, expense per site
- Value by income approach: NOI / market cap rate
- Expansion analysis: cost per new site, ROI on expansion
**KPIs:** NOI, Cap rate, Revenue per site, CoC return
**Charts:** Seasonal revenue chart, expense breakdown, value growth projection
**Table:** Monthly seasonal P&L

## 34. Self-Storage Investment
**Folder:** `self-storage`
**Purpose:** Self-storage facility investment modeling
**Inputs:** Number of units by size (5x5, 5x10, 10x10, 10x15, 10x20, 10x30), rent per unit by size, occupancy rate %, purchase price, down payment %, rate, term, operating expenses, climate controlled (yes/no premium), additional income (insurance, truck rental, supplies)
**Calculations:**
- Unit mix revenue, total gross revenue, NOI, cap rate, CoC return, DSCR
- Revenue per sq ft, price per sq ft
- Break-even occupancy
- Value-add: rent increase sensitivity
**KPIs:** NOI, Cap rate, Revenue per sq ft, CoC return, Break-even occupancy
**Charts:** Revenue by unit size, occupancy sensitivity, expense breakdown
**Table:** Unit mix detail table

## 35. IUL Portfolio Performance
**Folder:** `iul-portfolio`
**Purpose:** Indexed Universal Life + real estate compounding strategy
**Inputs:** Annual IUL premium, policy term/years, cap rate (IUL index cap), floor rate, average index return, real estate portfolio value, RE annual cash flow, RE appreciation rate, age at start
**Calculations:**
- IUL cash value projection (year by year with cap/floor)
- IUL death benefit projection
- Real estate equity growth
- Combined net worth: RE equity + IUL cash value
- Tax-free income from IUL loans vs RE income
- Legacy value analysis
**KPIs:** Total combined net worth at retirement, IUL cash value, Tax-free income available, Legacy value
**Charts:** Combined wealth growth (stacked area: RE + IUL), year-by-year projection, tax comparison
**Table:** Year-by-year dual portfolio projection

## 36. Housing Code Compliance
**Folder:** `housing-code-compliance`
**Purpose:** Code violation risk assessment and cost estimation
**Inputs:** Property type, year built, number of units, checklist of common violations (smoke detectors, egress windows, handrails, lead paint, electrical, plumbing, structural, HVAC, fire suppression, ADA compliance), estimated repair cost per item, violation severity (minor/major/life-safety)
**Calculations:**
- Total estimated compliance cost
- Risk score (weighted by severity)
- Priority ranking of violations
- Cost per unit for compliance
- Penalty risk estimation
- ROI of compliance (avoided fines + insurance savings)
**KPIs:** Total compliance cost, Risk score, Critical violations count, Estimated penalty risk
**Charts:** Violation severity distribution, cost breakdown by category, priority matrix
**Table:** Violation checklist with costs and priorities

## 37. Buffett Indicator
**Folder:** `buffett-indicator`
**Purpose:** Macro market valuation signal using real estate Buffett indicator concept
**Inputs:** Total US housing market value (pre-filled with estimated current), US GDP (pre-filled), historical average ratio, current ratio, local market values (optional)
**Calculations:**
- Buffett Indicator: total market cap / GDP
- Historical comparison (significantly overvalued >150%, overvalued 120-150%, fair 80-120%, undervalued <80%)
- Deviation from historical average
- Local market comparison if entered
- Timing signal: buy/hold/caution
**KPIs:** Current indicator value, Valuation status, Deviation from average, Signal
**Charts:** Historical indicator timeline, valuation zone gauge, market cycle position
**Table:** Historical data comparison

## 38. Strategic Market Valuation
**Folder:** `strategic-market-valuation`
**Purpose:** Deep market timing and valuation analysis
**Inputs:** Metro area or custom values, median home price, median household income, average rent, price-to-rent ratio, price-to-income ratio, inventory months supply, days on market, YoY price change %, population growth %, job growth %, interest rate environment
**Calculations:**
- Price-to-income ratio (healthy: 3-5x)
- Price-to-rent ratio (buy signal <15, rent signal >20)
- Affordability index
- Market heat score (composite of inventory, DOM, price growth)
- Risk assessment (overheated/balanced/opportunity)
- Comparison to national averages
**KPIs:** Market heat score, Affordability index, Risk level, Recommendation (buy/wait/caution)
**Charts:** Multi-factor radar chart, historical trend comparison, national vs local benchmarks
**Table:** Factor-by-factor analysis with ratings

## 39. Burial & Cemetery Tax Exemption
**Folder:** `burial-cemetery-tax`
**Purpose:** Niche tax-advantaged real estate opportunities
**Inputs:** Property value, acreage, state/jurisdiction, percentage used for burial/cemetery purposes, property tax rate, current annual tax, conversion costs, maintenance costs, revenue potential (plot sales, services)
**Calculations:**
- Current tax burden
- Tax exemption amount (varies by state)
- Annual tax savings
- Net benefit after maintenance
- ROI of conversion
- Revenue projections from cemetery operations
- Payback period
**KPIs:** Annual tax savings, Exemption value, Net annual benefit, Payback period
**Charts:** Tax savings over 10 years, cost vs benefit analysis, revenue breakdown
**Table:** State-by-state exemption rules reference, annual projection

## 40. Real Estate Agility Index
**Folder:** `agility-index`
**Purpose:** Market speed and scarcity scoring for timing
**Inputs:** Days on market (average), inventory (months of supply), list-to-sale price ratio, new listings per month, absorption rate, bidding war frequency %, price reductions %, YoY inventory change
**Calculations:**
- Agility score 0-100 (composite weighted metric)
- Market classification: Hyper-Seller's (90+), Seller's (70-89), Balanced (40-69), Buyer's (20-39), Hyper-Buyer's (<20)
- Speed sub-score (DOM, absorption)
- Scarcity sub-score (inventory, new listings)
- Competition sub-score (bidding wars, list-to-sale)
- Trend direction (accelerating/decelerating)
**KPIs:** Agility score, Market type, Speed rating, Scarcity rating
**Charts:** Agility gauge meter, sub-score radar chart, trend arrow/direction
**Table:** Factor breakdown with weights and scores

## 41. Solar ROI Calculator
**Folder:** `solar-roi`
**Purpose:** Solar panel investment impact on property NOI and returns
**Inputs:** System size (kW), cost per watt, installation cost, federal tax credit (30%), state incentives, monthly electricity bill (current), electricity rate $/kWh, annual rate increase %, system production (kWh/year or calculate from location/size), annual degradation rate %, net metering (yes/no), property value increase estimate, maintenance/yr
**Calculations:**
- Net system cost after incentives
- Annual electricity savings
- Payback period
- 25-year savings projection (with degradation and rate increases)
- ROI, IRR
- Property value impact
- If rental: impact on NOI, cap rate improvement
- Environmental: CO2 offset
**KPIs:** Payback period, 25-year savings, ROI, Property value increase
**Charts:** Cumulative savings vs cost (breakeven crossover), annual savings projection, energy production forecast
**Table:** Year-by-year savings with degradation
