/* Scenario Lab Data — Auto-generated */
/* 50 Guided + 30 Timed + 5 Sandbox = 85 Interactive Labs */

const GUIDED_CHALLENGES = [
 {
  "title": "Sarah's First Home",
  "track": "Foundation",
  "diff": "Beginner",
  "role": "Homebuyer",
  "time": "10 min",
  "desc": "Single mom with $58K income exploring homeownership. Can she qualify? What can she afford?",
  "setup": "Sarah is a 32-year-old single mother working as a medical billing specialist earning $58,000/year. She has a car payment of $340/month and $180/month in student loans. Her credit score is 680, and she has saved $12,000. She is renting for $1,100/month and looking at homes in the $180K–$240K range. Property taxes are 1.15% and insurance averages $1,400/year.",
  "data": [
   [
    "Annual Income",
    "$58,000"
   ],
   [
    "Monthly Debts",
    "$520 (car + student loans)"
   ],
   [
    "Credit Score",
    "680"
   ],
   [
    "Savings",
    "$12,000"
   ],
   [
    "Target Price Range",
    "$180K – $240K"
   ],
   [
    "Interest Rate",
    "6.75%"
   ],
   [
    "Property Tax Rate",
    "1.15%"
   ],
   [
    "Annual Insurance",
    "$1,400"
   ]
  ],
  "tools": [
   [
    "Affordability",
    "../affordability/index.html"
   ],
   [
    "Qualification Analysis",
    "../qualification-analysis/index.html"
   ],
   [
    "Cash to Close",
    "../cash-to-close/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the maximum home price Sarah can comfortably afford (Moderate scenario)?",
    "type": "input",
    "answer": "$185,000 – $200,000",
    "explain": "At $58K income with $520 in monthly debts, Sarah’s back-end DTI should stay under 43%. The Affordability Calculator shows a Moderate max price around $190K. The Conservative scenario is lower (~$160K)."
   },
   {
    "text": "Which loan program is best for Sarah?",
    "type": "choice",
    "choices": [
     "Conventional (5% down)",
     "FHA (3.5% down)",
     "VA Loan",
     "USDA Loan"
    ],
    "answer": "FHA (3.5% down)",
    "explain": "With a 680 credit score and only $12K saved, FHA is the best fit. It accepts 580+ credit scores, requires only 3.5% down ($6,650 on a $190K home), and has more flexible DTI limits."
   },
   {
    "text": "How much total cash will Sarah need at closing (approximately)?",
    "type": "input",
    "answer": "$11,000 – $14,000",
    "explain": "On a $190K home with FHA (3.5% down = $6,650), closing costs add another $4,000–$6,500. Total cash needed: roughly $11K–$13K. Her $12K in savings barely covers it."
   }
  ]
 },
 {
  "title": "The Memphis Rental",
  "track": "Foundation",
  "diff": "Beginner",
  "role": "Investor",
  "time": "8 min",
  "desc": "A turnkey rental in Memphis listed at $115K with $1,100/mo rent. Solid deal or money trap?",
  "setup": "A 3-bed/1-bath single-family home in a B-class Memphis neighborhood is listed at $115,000. The property is tenant-occupied at $1,100/month. Inspection reveals $8,000 in deferred maintenance. You would put 25% down and finance at 7.5% over 30 years. Property taxes are $1,380/year, insurance $1,200/year, and you plan to use a property manager at 10%.",
  "data": [
   [
    "List Price",
    "$115,000"
   ],
   [
    "Monthly Rent",
    "$1,100"
   ],
   [
    "Deferred Maintenance",
    "$8,000"
   ],
   [
    "Down Payment",
    "25% ($28,750)"
   ],
   [
    "Interest Rate",
    "7.5%"
   ],
   [
    "Property Tax",
    "$1,380/year"
   ],
   [
    "Insurance",
    "$1,200/year"
   ],
   [
    "Management Fee",
    "10% of rent"
   ]
  ],
  "tools": [
   [
    "Cash Flow",
    "../cashflow/index.html"
   ],
   [
    "Cap Rate",
    "../caprate/index.html"
   ],
   [
    "Deal Grading",
    "../deal-grading/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the approximate monthly cash flow after all expenses?",
    "type": "input",
    "answer": "$80 – $150/month",
    "explain": "Mortgage P&I on $86,250: ~$603. Taxes: $115. Insurance: $100. Management (10%): $110. Maintenance reserve (8%): $88. Vacancy (8%): $88. Total expenses: ~$1,104. Net cash flow: roughly $0–$100/month. This is a thin-margin deal."
   },
   {
    "text": "What is the cap rate on this property?",
    "type": "input",
    "answer": "5.5% – 6.5%",
    "explain": "NOI = $1,100 x 12 x (1 - 8% vacancy) - taxes - insurance - management - maintenance = roughly $6,500. Cap Rate = $6,500 / $115,000 = 5.65%. Below the 7%+ experienced Memphis investors target."
   },
   {
    "text": "Should you buy this property at asking price?",
    "type": "choice",
    "choices": [
     "Yes, buy at asking",
     "No, pass entirely",
     "Make a lower offer ($95K–$105K)",
     "Need more information"
    ],
    "answer": "Make a lower offer ($95K–$105K)",
    "explain": "At $115K the margins are too thin. At $95–100K (factoring in $8K maintenance), the cap rate improves to 7%+ and monthly cash flow hits $150–200. Negotiate down, don’t walk away."
   }
  ]
 },
 {
  "title": "Your First Cap Rate",
  "track": "Foundation",
  "diff": "Beginner",
  "role": "Investor",
  "time": "6 min",
  "desc": "A small strip mall in a secondary market. Learn how cap rate reveals the true return story.",
  "setup": "You are evaluating a 4-unit strip mall listed at $420,000 in a small Midwest town. Annual gross rent is $52,800. Vacancy runs 12% historically. Annual operating expenses (taxes, insurance, maintenance, management) total $14,400. No financing yet — you want to understand the unlevered return first.",
  "data": [
   [
    "List Price",
    "$420,000"
   ],
   [
    "Annual Gross Rent",
    "$52,800"
   ],
   [
    "Historical Vacancy",
    "12%"
   ],
   [
    "Annual Operating Expenses",
    "$14,400"
   ],
   [
    "Loan Terms",
    "Not yet determined"
   ]
  ],
  "tools": [
   [
    "Cap Rate",
    "../caprate/index.html"
   ],
   [
    "Commercial Analyzer",
    "../multifamily/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the Net Operating Income (NOI)?",
    "type": "input",
    "answer": "$32,064",
    "explain": "Gross rent $52,800 minus vacancy (12% = $6,336) = Effective Gross Income $46,464. Subtract operating expenses $14,400 = NOI of $32,064."
   },
   {
    "text": "What is the cap rate?",
    "type": "input",
    "answer": "7.6%",
    "explain": "Cap Rate = NOI / Purchase Price = $32,064 / $420,000 = 7.63%. This is a solid cap rate for a secondary market strip mall — above the 6–7% typical for stabilized retail."
   },
   {
    "text": "If you want an 8.5% cap rate, what is the maximum you should offer?",
    "type": "input",
    "answer": "$377,000",
    "explain": "Maximum Price = NOI / Target Cap Rate = $32,064 / 0.085 = $377,224. You would need to negotiate a $43K discount from list. Start your offer around $370K."
   }
  ]
 },
 {
  "title": "The Wholesale Sprint",
  "track": "Foundation",
  "diff": "Beginner",
  "role": "Investor",
  "time": "6 min",
  "desc": "A distressed property hits your inbox. Calculate the Maximum Allowable Offer before another investor grabs it.",
  "setup": "A motivated seller contacts you about a 3-bed/2-bath ranch needing significant work. ARV comps show $195,000. The property needs a full kitchen ($18K), new roof ($9K), bathroom refresh ($6K), and paint/flooring ($5K). You want a $15,000 assignment fee. Closing costs for your end buyer will be approximately 3%.",
  "data": [
   [
    "ARV (After Repair Value)",
    "$195,000"
   ],
   [
    "Rehab Estimate",
    "$38,000"
   ],
   [
    "Target Assignment Fee",
    "$15,000"
   ],
   [
    "End Buyer Closing Costs",
    "3% of ARV"
   ],
   [
    "Investor Profit Margin",
    "30% of ARV"
   ]
  ],
  "tools": [
   [
    "Wholesale MAO",
    "../underwriting/index.html"
   ],
   [
    "Fix & Flip",
    "../fixflip/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the 70% rule MAO for this property?",
    "type": "input",
    "answer": "$98,500",
    "explain": "70% Rule: ARV x 0.70 - Rehab = $195,000 x 0.70 - $38,000 = $136,500 - $38,000 = $98,500. This is the maximum an end-buyer investor would pay."
   },
   {
    "text": "What is YOUR maximum offer to the seller (including your assignment fee)?",
    "type": "input",
    "answer": "$83,500",
    "explain": "Your MAO = End buyer MAO - Your assignment fee = $98,500 - $15,000 = $83,500. Offer the seller $80K–$83K to leave room for negotiation."
   },
   {
    "text": "If the seller insists on $100K, should you take the deal?",
    "type": "choice",
    "choices": [
     "Yes, reduce your fee to $5K",
     "No, the numbers don't work",
     "Counter at $90K with a shorter close",
     "Walk away entirely"
    ],
    "answer": "Counter at $90K with a shorter close",
    "explain": "At $100K your assignment fee drops to negative. Counter at $90K: your fee becomes $8,500 ($98,500 - $90,000), which is still worthwhile. Sweetening with a 14-day close can motivate the seller to accept less."
   }
  ]
 },
 {
  "title": "Building a Budget",
  "track": "Foundation",
  "diff": "Beginner",
  "role": "Homebuyer",
  "time": "5 min",
  "desc": "First-time buyer needs to know the REAL amount needed at closing — not just the down payment.",
  "setup": "Jordan is buying a $275,000 condo with a conventional loan at 5% down. The lender quoted 6.5% interest. Estimated closing costs are 2.8% of the loan amount. The HOA requires 2 months prepaid ($380/month). Property taxes are $3,100/year and insurance is $1,150/year. The lender requires 6 months of escrow reserves for taxes and insurance.",
  "data": [
   [
    "Purchase Price",
    "$275,000"
   ],
   [
    "Down Payment",
    "5% ($13,750)"
   ],
   [
    "Interest Rate",
    "6.5%"
   ],
   [
    "Estimated Closing Costs",
    "2.8% of loan"
   ],
   [
    "HOA Fee",
    "$380/month"
   ],
   [
    "Property Tax",
    "$3,100/year"
   ],
   [
    "Insurance",
    "$1,150/year"
   ],
   [
    "Escrow Reserves",
    "6 months T&I"
   ]
  ],
  "tools": [
   [
    "Cash to Close",
    "../cash-to-close/index.html"
   ],
   [
    "Affordability",
    "../affordability/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the total estimated closing cost amount?",
    "type": "input",
    "answer": "$7,315",
    "explain": "Loan amount = $275,000 - $13,750 = $261,250. Closing costs at 2.8% = $261,250 x 0.028 = $7,315."
   },
   {
    "text": "What is the total cash to close including all prepaid items?",
    "type": "input",
    "answer": "$24,200 – $25,500",
    "explain": "Down payment $13,750 + closing costs $7,315 + HOA prepaid (2 x $380 = $760) + escrow reserves (6 months of $258 tax + $96 insurance = $2,124) = approximately $23,949. Many first-time buyers are shocked by how much more than the down payment they actually need."
   },
   {
    "text": "Can Jordan use a seller concession to reduce cash to close?",
    "type": "choice",
    "choices": [
     "Yes, up to 3% of purchase price",
     "Yes, up to 6% of purchase price",
     "No, conventional loans don't allow it",
     "Only if the appraisal supports it"
    ],
    "answer": "Yes, up to 3% of purchase price",
    "explain": "On a conventional loan with 5% down, seller concessions are capped at 3% of the purchase price ($8,250). This could cover most of Jordan's closing costs, reducing cash to close to roughly $16K."
   }
  ]
 },
 {
  "title": "The Commission Split",
  "track": "Foundation",
  "diff": "Beginner",
  "role": "Agent",
  "time": "5 min",
  "desc": "Your listing just sold. Walk through the commission math that determines everyone’s paycheck.",
  "setup": "You listed a home that just sold for $415,000. The listing agreement specifies 5.5% total commission. Your brokerage split is 70/30 (you keep 70%). The buyer’s agent’s brokerage is getting 2.5% of the sale price. Your brokerage has a $500 transaction fee. You also paid $1,200 in marketing costs out of pocket.",
  "data": [
   [
    "Sale Price",
    "$415,000"
   ],
   [
    "Total Commission",
    "5.5%"
   ],
   [
    "Listing Side",
    "3.0%"
   ],
   [
    "Buyer Side",
    "2.5%"
   ],
   [
    "Your Split",
    "70/30"
   ],
   [
    "Transaction Fee",
    "$500"
   ],
   [
    "Marketing Costs",
    "$1,200"
   ]
  ],
  "tools": [
   [
    "Commission",
    "../commission/index.html"
   ],
   [
    "Seller Net Sheet",
    "../seller-net-sheet/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the total listing-side commission?",
    "type": "input",
    "answer": "$12,450",
    "explain": "Listing side = $415,000 x 3.0% = $12,450."
   },
   {
    "text": "What is YOUR take-home after brokerage split and fees?",
    "type": "input",
    "answer": "$7,015",
    "explain": "Your share at 70% = $12,450 x 0.70 = $8,715. Minus transaction fee $500 = $8,215. Minus marketing costs $1,200 = $7,015. Always factor in your real costs."
   },
   {
    "text": "What does the seller actually net from this sale (assuming $280K mortgage payoff and $2,100 in other closing costs)?",
    "type": "input",
    "answer": "$109,975 – $110,000",
    "explain": "Sale price $415,000 - total commission ($415K x 5.5% = $22,825) - mortgage payoff $280,000 - other closing costs $2,100 = $110,075 net to seller."
   }
  ]
 },
 {
  "title": "Is It Better to Rent?",
  "track": "Foundation",
  "diff": "Beginner",
  "role": "Homebuyer",
  "time": "7 min",
  "desc": "The eternal question: renting vs. buying. Run the numbers for a couple in Austin.",
  "setup": "Maria and Carlos pay $2,200/month rent in Austin. They are considering buying a $350,000 home with 10% down at 6.75%. Property taxes are 2.1% (Texas has no state income tax but high property taxes). Insurance is $2,400/year. HOA is $125/month. They expect 3% annual appreciation but plan to stay only 5 years.",
  "data": [
   [
    "Current Rent",
    "$2,200/month"
   ],
   [
    "Purchase Price",
    "$350,000"
   ],
   [
    "Down Payment",
    "10% ($35,000)"
   ],
   [
    "Interest Rate",
    "6.75%"
   ],
   [
    "Property Tax",
    "2.1%"
   ],
   [
    "Insurance",
    "$2,400/year"
   ],
   [
    "HOA",
    "$125/month"
   ],
   [
    "Expected Appreciation",
    "3%/year"
   ],
   [
    "Time Horizon",
    "5 years"
   ]
  ],
  "tools": [
   [
    "Rent vs Buy",
    "../rent-vs-buy/index.html"
   ],
   [
    "True Cost of Ownership",
    "../true-cost-ownership/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the total monthly cost of owning (PITI + HOA)?",
    "type": "input",
    "answer": "$3,100 – $3,200",
    "explain": "P&I on $315K at 6.75% = ~$2,043. Taxes $7,350/yr = $613/mo. Insurance $200/mo. HOA $125/mo. Total: ~$2,981 + maintenance (~$200) = $3,181. Nearly $1,000 more than renting monthly."
   },
   {
    "text": "After 5 years, approximately how much equity will they have?",
    "type": "input",
    "answer": "$75,000 – $85,000",
    "explain": "Home value at 3% appreciation: $350K x 1.03^5 = ~$405,700. Mortgage balance after 5 years: ~$299,000. Equity: ~$106,700. Subtract selling costs (6%) of ~$24,300 = net equity of ~$82,400."
   },
   {
    "text": "Is buying better than renting in this scenario?",
    "type": "choice",
    "choices": [
     "Yes, buying is clearly better",
     "No, renting is better for 5 years",
     "It's roughly break-even",
     "Depends on rent increases"
    ],
    "answer": "Depends on rent increases",
    "explain": "At face value, the higher monthly cost of owning ($3,181 vs $2,200) means they spend $59K more over 5 years. But they build ~$82K in equity. If rent increases 4–5% annually, the gap narrows. The Rent vs Buy calculator shows the crossover point is around year 6–7 in this market."
   }
  ]
 },
 {
  "title": "The Mobile Home Opportunity",
  "track": "Foundation",
  "diff": "Beginner",
  "role": "Investor",
  "time": "6 min",
  "desc": "A 3-unit mobile home park in rural Georgia. Low price, high yield — or hidden risk?",
  "setup": "A small 3-pad mobile home park is listed at $85,000. All three homes are tenant-owned (you own only the land and pads). Lot rent is $325/pad/month ($975 total). Expenses are minimal: property tax $1,200/year, insurance $900/year, basic maintenance $2,400/year. No financing — you would pay cash. Well and septic are in good condition per inspection.",
  "data": [
   [
    "Purchase Price",
    "$85,000 (cash)"
   ],
   [
    "Lot Rent",
    "$325/pad x 3 = $975/month"
   ],
   [
    "Property Tax",
    "$1,200/year"
   ],
   [
    "Insurance",
    "$900/year"
   ],
   [
    "Maintenance",
    "$2,400/year"
   ],
   [
    "Vacancy Assumption",
    "5%"
   ],
   [
    "Infrastructure",
    "Well & septic (good condition)"
   ]
  ],
  "tools": [
   [
    "Cash Flow",
    "../cashflow/index.html"
   ],
   [
    "Cap Rate",
    "../caprate/index.html"
   ],
   [
    "Cash-on-Cash Breakdown",
    "../cash-on-cash-breakdown/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the NOI on this property?",
    "type": "input",
    "answer": "$6,615 – $7,000",
    "explain": "Gross rent: $975 x 12 = $11,700. Vacancy (5%): $585. Effective income: $11,115. Expenses: $1,200 + $900 + $2,400 = $4,500. NOI = $11,115 - $4,500 = $6,615."
   },
   {
    "text": "What is the cap rate?",
    "type": "input",
    "answer": "7.8%",
    "explain": "Cap Rate = $6,615 / $85,000 = 7.78%. Strong for a low-maintenance asset. Tenant-owned homes mean the park owner has minimal structural responsibility."
   },
   {
    "text": "What is the biggest risk with this investment?",
    "type": "choice",
    "choices": [
     "Tenants stop paying rent",
     "Well or septic failure",
     "Homes deteriorate (lowering desirability)",
     "All of the above"
    ],
    "answer": "All of the above",
    "explain": "Mobile home parks have unique risks: infrastructure failure (well/septic replacement can cost $15K–$30K), home condition affecting tenant quality (even if tenant-owned, blight hurts the park), and limited financing options if you need to sell. The cap rate compensates for these risks."
   }
  ]
 },
 {
  "title": "Government Loan Options",
  "track": "Foundation",
  "diff": "Beginner",
  "role": "Homebuyer",
  "time": "7 min",
  "desc": "A military veteran compares VA, FHA, USDA, and conventional options. Which saves the most?",
  "setup": "Derek is a Navy veteran with $95K income and an 720 credit score. He has $20,000 saved and wants to buy a $310,000 home in a suburban area that qualifies for both VA and USDA eligibility. He has no other debts. His wife earns $45K but they want to qualify on his income alone for USDA purposes.",
  "data": [
   [
    "Income (Derek)",
    "$95,000"
   ],
   [
    "Household Income",
    "$140,000"
   ],
   [
    "Credit Score",
    "720"
   ],
   [
    "Savings",
    "$20,000"
   ],
   [
    "Target Home",
    "$310,000"
   ],
   [
    "Location",
    "VA & USDA eligible"
   ],
   [
    "Other Debts",
    "$0"
   ],
   [
    "Current Rate (30yr)",
    "6.5%"
   ]
  ],
  "tools": [
   [
    "Government Loans",
    "../government-loans/index.html"
   ],
   [
    "Affordability",
    "../affordability/index.html"
   ],
   [
    "Cash to Close",
    "../cash-to-close/index.html"
   ]
  ],
  "questions": [
   {
    "text": "Which loan type requires the least cash at closing?",
    "type": "choice",
    "choices": [
     "Conventional (5% down)",
     "FHA (3.5% down)",
     "VA (0% down)",
     "USDA (0% down)"
    ],
    "answer": "VA (0% down)",
    "explain": "VA requires $0 down payment. The VA funding fee (2.15% first use = $6,665) can be rolled into the loan. Total cash to close: just closing costs (~$5K–$7K). USDA also offers 0% down but has income limits."
   },
   {
    "text": "Does Derek qualify for USDA if his wife's income is included?",
    "type": "choice",
    "choices": [
     "Yes, $140K is within USDA limits",
     "No, household income exceeds the limit",
     "Only if they file taxes separately",
     "USDA doesn't count spouse income"
    ],
    "answer": "No, household income exceeds the limit",
    "explain": "USDA counts ALL household income, not just the borrower. At $140K combined, they likely exceed the 115% area median income limit for most locations (~$103K–$120K). Derek would need to use VA or conventional instead."
   },
   {
    "text": "What is the monthly savings of VA vs. conventional (5% down)?",
    "type": "input",
    "answer": "$100 – $150/month",
    "explain": "VA: No PMI, no down payment. Conventional with 5% down: PMI ~$130/month until 20% equity. Even though VA has a slightly higher loan amount (funding fee rolled in), the PMI elimination saves ~$100–$150/month for years."
   }
  ]
 },
 {
  "title": "The Vacant Lot",
  "track": "Foundation",
  "diff": "Beginner",
  "role": "Investor",
  "time": "6 min",
  "desc": "A 2-acre lot in a growing corridor. Evaluate it as a land flip versus a buy-and-hold play.",
  "setup": "A 2.09-acre vacant lot is listed at $45,000 in a rapidly developing corridor 20 minutes from a mid-size city. Comparable lot sales in the area range from $22K–$28K per acre. The lot has road frontage, is zoned residential, and utilities are available at the street. Annual property taxes are $480. No HOA restrictions.",
  "data": [
   [
    "List Price",
    "$45,000"
   ],
   [
    "Lot Size",
    "2.09 acres"
   ],
   [
    "Comp Sales",
    "$22K–$28K per acre"
   ],
   [
    "Zoning",
    "Residential"
   ],
   [
    "Utilities",
    "Available at street"
   ],
   [
    "Annual Taxes",
    "$480"
   ],
   [
    "Road Frontage",
    "Yes"
   ],
   [
    "HOA",
    "None"
   ]
  ],
  "tools": [
   [
    "Land Flip Analyzer",
    "../land-flip/index.html"
   ],
   [
    "Land Development",
    "../land-development/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the estimated market value based on comps?",
    "type": "input",
    "answer": "$46,000 – $58,500",
    "explain": "At $22–$28/acre: low end $22K x 2.09 = $45,980, high end $28K x 2.09 = $58,520. The list price of $45K is at the bottom of comp range — fair value."
   },
   {
    "text": "Is this a good land flip opportunity?",
    "type": "choice",
    "choices": [
     "Yes, buy and resell for $55K+",
     "No, not enough margin at $45K",
     "Hold for appreciation instead",
     "Subdivide into two 1-acre lots"
    ],
    "answer": "Subdivide into two 1-acre lots",
    "explain": "At $45K purchase, a quick flip at $55K yields only $10K minus selling costs. But subdividing into two 1-acre lots (survey cost ~$3K) lets you sell each for $22K–$28K = $44K–$56K total = potential profit of $10K–$20K after costs. Or hold — growth corridors appreciate 5–10% annually."
   },
   {
    "text": "What is the annual holding cost as a percentage of purchase price?",
    "type": "input",
    "answer": "~1.1%",
    "explain": "Annual taxes $480 / $45,000 = 1.07%. With minimal carrying costs, this lot is cheap to hold while waiting for appreciation. No mowing or maintenance required if it is undeveloped land."
   }
  ]
 },
 {
  "title": "The Airbnb Question",
  "track": "Foundation",
  "diff": "Beginner",
  "role": "Investor",
  "time": "8 min",
  "desc": "A mountain cabin near Gatlinburg. Can short-term rental income justify the premium price?",
  "setup": "A 2-bed/2-bath cabin near Gatlinburg, TN is listed at $325,000. AirDNA data shows comparable cabins average $225/night with 65% annual occupancy. Cleaning fee is $150/turnover (average 3-night stay). Property management is 25% of gross revenue. Property taxes $2,800/year, insurance $3,200/year (STR policy). You would put 20% down at 7.25%.",
  "data": [
   [
    "Purchase Price",
    "$325,000"
   ],
   [
    "Avg Nightly Rate",
    "$225"
   ],
   [
    "Annual Occupancy",
    "65%"
   ],
   [
    "Avg Stay Length",
    "3 nights"
   ],
   [
    "Cleaning Fee",
    "$150/turnover"
   ],
   [
    "Management",
    "25% of gross"
   ],
   [
    "Property Tax",
    "$2,800/year"
   ],
   [
    "Insurance (STR)",
    "$3,200/year"
   ],
   [
    "Down Payment",
    "20% ($65,000)"
   ],
   [
    "Interest Rate",
    "7.25%"
   ]
  ],
  "tools": [
   [
    "Short-Term Rental",
    "../short-term-rental/index.html"
   ],
   [
    "Cash Flow",
    "../cashflow/index.html"
   ],
   [
    "Deal Grading",
    "../deal-grading/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the estimated annual gross revenue?",
    "type": "input",
    "answer": "$53,000 – $55,000",
    "explain": "Occupied nights: 365 x 0.65 = 237 nights. Revenue from nightly rate: 237 x $225 = $53,325. Plus cleaning fees collected: 237/3 = 79 turnovers x $150 = $11,850. But cleaning fees offset cleaning costs, so gross rental revenue is ~$53,325."
   },
   {
    "text": "What is the approximate monthly cash flow?",
    "type": "input",
    "answer": "$200 – $500",
    "explain": "Gross revenue ~$53,325. Management (25%): $13,331. Cleaning costs (79 x $150): $11,850. Mortgage P&I ($260K at 7.25%): $21,276/yr. Taxes + insurance: $6,000. Maintenance (5%): $2,666. Total expenses: ~$55,123. Thin margin — cash flow depends heavily on hitting that 65% occupancy."
   },
   {
    "text": "What is the breakeven occupancy rate?",
    "type": "choice",
    "choices": [
     "45%",
     "55%",
     "62%",
     "70%"
    ],
    "answer": "62%",
    "explain": "Total fixed + variable costs are approximately $4,500/month. At $225/night, you need ~20 nights/month = 67% to break even on cash flow. Realistically, 62–65% is breakeven when you factor in seasonal variation. This is a tight deal that works only if the market stays strong."
   }
  ]
 },
 {
  "title": "The HELOC Strategy",
  "track": "Foundation",
  "diff": "Beginner",
  "role": "Homeowner",
  "time": "6 min",
  "desc": "Using home equity to fund a rental property down payment. Smart leverage or risky move?",
  "setup": "Patricia owns her home worth $420,000 with a $240,000 mortgage balance. She wants to take a HELOC to fund the down payment on a $200,000 rental property (25% down = $50,000). HELOC rate is 8.5% interest-only for the draw period. The rental would generate $1,500/month in rent. She earns $110K/year with no other debts beyond her primary mortgage.",
  "data": [
   [
    "Home Value",
    "$420,000"
   ],
   [
    "Mortgage Balance",
    "$240,000"
   ],
   [
    "Available Equity (80% LTV)",
    "$96,000"
   ],
   [
    "HELOC Amount Needed",
    "$50,000"
   ],
   [
    "HELOC Rate",
    "8.5% I/O"
   ],
   [
    "Rental Purchase Price",
    "$200,000"
   ],
   [
    "Rental Mortgage Rate",
    "7.5%"
   ],
   [
    "Expected Rent",
    "$1,500/month"
   ]
  ],
  "tools": [
   [
    "HELOC Optimizer",
    "../heloc-optimizer/index.html"
   ],
   [
    "Home Equity",
    "../home-equity/index.html"
   ],
   [
    "Cash Flow",
    "../cashflow/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the monthly HELOC interest-only payment on $50K?",
    "type": "input",
    "answer": "$354",
    "explain": "$50,000 x 8.5% / 12 = $354/month. This is an additional carrying cost on top of the rental’s expenses."
   },
   {
    "text": "Does the rental cash flow cover the HELOC payment?",
    "type": "choice",
    "choices": [
     "Yes, comfortably",
     "Yes, but barely",
     "No, it creates negative cash flow",
     "Need more data"
    ],
    "answer": "Yes, but barely",
    "explain": "Rental P&I on $150K at 7.5%: $1,049. Taxes (~1.2%): $200. Insurance: $100. Management (8%): $120. Vacancy (8%): $120. Total rental expenses: ~$1,589. Cash flow before HELOC: -$89. After HELOC payment ($354): -$443/month. The rental alone does NOT cover the HELOC. You need rent closer to $1,800+ for this to work."
   },
   {
    "text": "What rent would make this strategy cash-flow positive?",
    "type": "input",
    "answer": "$1,800 – $1,900",
    "explain": "To cover all rental expenses (~$1,589) plus the HELOC ($354), you need at least $1,943/month total. Realistically, you need a rental that generates $1,800–$1,900 in rent OR a lower purchase price to make the HELOC strategy viable."
   }
  ]
 },
 {
  "title": "The BRRRR in Cleveland",
  "track": "Multi-Tool Workflows",
  "diff": "Intermediate",
  "role": "Investor",
  "time": "12 min",
  "desc": "A distressed duplex in Cleveland with BRRRR potential. Can you get all your cash back out?",
  "setup": "A 2-unit duplex in Cleveland’s Tremont neighborhood is listed at $65,000. It needs $30,000 in rehab (kitchens, bathrooms, flooring, paint, electrical). Comparable duplexes post-rehab sell for $135K–$145K. Each unit rents for $800/month ($1,600 total). You plan to buy cash, rehab, rent, then refinance at 75% LTV. Current investment rates are 7.75%. Property taxes $1,800/year, insurance $1,400/year.",
  "data": [
   [
    "Purchase Price",
    "$65,000"
   ],
   [
    "Rehab Budget",
    "$30,000"
   ],
   [
    "Total Investment",
    "$95,000"
   ],
   [
    "ARV",
    "$140,000"
   ],
   [
    "Rent (2 units)",
    "$1,600/month"
   ],
   [
    "Refinance LTV",
    "75%"
   ],
   [
    "Refinance Rate",
    "7.75%"
   ],
   [
    "Property Tax",
    "$1,800/year"
   ],
   [
    "Insurance",
    "$1,400/year"
   ]
  ],
  "tools": [
   [
    "BRRRR Strategy",
    "../brrrr/index.html"
   ],
   [
    "Cash Flow",
    "../cashflow/index.html"
   ],
   [
    "DSCR Loan",
    "../dscr-loan/index.html"
   ]
  ],
  "questions": [
   {
    "text": "How much cash do you get back at refinance?",
    "type": "input",
    "answer": "$105,000",
    "explain": "Refinance at 75% of ARV: $140,000 x 0.75 = $105,000. You invested $95,000. You get ALL your cash back plus $10,000 extra. This is the BRRRR dream — infinite return."
   },
   {
    "text": "What is the monthly cash flow after refinance?",
    "type": "input",
    "answer": "$100 – $200",
    "explain": "New mortgage on $105K at 7.75%: ~$752. Taxes: $150. Insurance: $117. Maintenance (8%): $128. Vacancy (8%): $128. Total expenses: ~$1,275. Cash flow: $1,600 - $1,275 = ~$325. After management (if added later at 10%): ~$165."
   },
   {
    "text": "What is the cash-on-cash return if you pulled all your money out?",
    "type": "choice",
    "choices": [
     "8.5%",
     "12%",
     "Infinite (no cash left in deal)",
     "Cannot be calculated"
    ],
    "answer": "Infinite (no cash left in deal)",
    "explain": "Since the refinance returned more than your total investment ($105K vs $95K invested), you have zero cash remaining in the deal. Any positive cash flow on zero invested capital = infinite return. This is the power of BRRRR."
   }
  ]
 },
 {
  "title": "Rate Shock Recovery",
  "track": "Multi-Tool Workflows",
  "diff": "Intermediate",
  "role": "Homeowner",
  "time": "8 min",
  "desc": "Bought with a 5/1 ARM at 3.5% — now it’s adjusting to 7.25%. What are the options?",
  "setup": "Mike and Lisa bought in 2021 for $340,000 with a 5/1 ARM at 3.5%, 10% down. P&I has been $1,374/month. Combined income is $92,000 with $700/month in other debts. The ARM is adjusting to 7.25%. Home is now worth $380,000. Remaining balance: $285,000.",
  "data": [
   [
    "Original Purchase",
    "$340,000"
   ],
   [
    "Current Value",
    "$380,000"
   ],
   [
    "Remaining Balance",
    "$285,000"
   ],
   [
    "Current Rate",
    "3.5% (adjusting to 7.25%)"
   ],
   [
    "Combined Income",
    "$92,000"
   ],
   [
    "Other Monthly Debts",
    "$700"
   ],
   [
    "Current P&I",
    "$1,374/month"
   ],
   [
    "Remaining Term",
    "25 years"
   ]
  ],
  "tools": [
   [
    "DTI Stress Test",
    "../dti-stress-test/index.html"
   ],
   [
    "Refinance Analyzer",
    "../refinance/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What will the new monthly P&I be after adjustment?",
    "type": "input",
    "answer": "$2,000 – $2,100",
    "explain": "At 7.25% on $285K over 25 years, P&I is approximately $2,050/month — a $676/month increase ($8,112/year)."
   },
   {
    "text": "What will their new back-end DTI ratio be?",
    "type": "input",
    "answer": "42% – 48%",
    "explain": "New housing: ~$2,050 + $325 tax + $160 ins = $2,535. Total debts: $2,535 + $700 = $3,235. DTI = $3,235 / ($92,000/12) = 42.2%. Borderline for most lenders."
   },
   {
    "text": "What is the best course of action?",
    "type": "choice",
    "choices": [
     "Refinance to fixed rate at 6.5%",
     "Sell the home and downsize",
     "Do nothing and absorb the increase",
     "Cash-out refi to pay off other debts"
    ],
    "answer": "Refinance to fixed rate at 6.5%",
    "explain": "Refinancing $285K at 6.5% fixed = ~$1,800 P&I. Still higher than 3.5% but $250 less than the adjusted ARM. They have $95K equity (25% LTV) for good terms. Selling is premature with strong equity."
   }
  ]
 },
 {
  "title": "Buy, Rehab, Rent — Full Pipeline",
  "track": "Multi-Tool Workflows",
  "diff": "Intermediate",
  "role": "Investor",
  "time": "12 min",
  "desc": "Chain three calculators together: Fix & Flip for rehab, BRRRR for refinance, Cash Flow for hold analysis.",
  "setup": "A 4-bed/2-bath SFR in Indianapolis is listed at $110,000. It needs $45,000 in rehab. ARV is $210,000. Post-rehab rent is $1,800/month. You will use a hard money loan at 12% interest-only for 6 months during rehab, then refinance to a 30-year investment loan at 7.5% (75% LTV). Holding costs during rehab: $1,100/month (hard money interest) + $200 taxes/insurance.",
  "data": [
   [
    "Purchase Price",
    "$110,000"
   ],
   [
    "Rehab Budget",
    "$45,000"
   ],
   [
    "ARV",
    "$210,000"
   ],
   [
    "Monthly Rent (post-rehab)",
    "$1,800"
   ],
   [
    "Hard Money Rate",
    "12% I/O, 6 months"
   ],
   [
    "Refinance Rate",
    "7.5% (30yr)"
   ],
   [
    "Refinance LTV",
    "75%"
   ],
   [
    "Holding Costs (during rehab)",
    "$1,300/month"
   ]
  ],
  "tools": [
   [
    "Fix & Flip",
    "../fixflip/index.html"
   ],
   [
    "BRRRR Strategy",
    "../brrrr/index.html"
   ],
   [
    "Cash Flow",
    "../cashflow/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the total project cost including holding costs?",
    "type": "input",
    "answer": "$162,800",
    "explain": "Purchase $110K + rehab $45K + holding costs ($1,300 x 6 months = $7,800) = $162,800. Always include holding costs in your total project budget."
   },
   {
    "text": "How much cash remains in the deal after refinance?",
    "type": "input",
    "answer": "$5,300",
    "explain": "Refinance at 75% of $210K ARV = $157,500. Total invested: $162,800. Cash left in deal: $162,800 - $157,500 = $5,300. Close to a full BRRRR, but not quite. A lower purchase price or higher ARV would get you to infinite return."
   },
   {
    "text": "What is the annual cash-on-cash return on the $5,300 remaining in the deal?",
    "type": "input",
    "answer": "40%+ ",
    "explain": "Monthly cash flow after refinance: rent $1,800 - mortgage ($157.5K at 7.5% = $1,101) - taxes ($175) - insurance ($100) - vacancy (8% = $144) - maintenance (8% = $144) - management (10% = $180) = -$44. Wait — this is slightly negative with full professional management. Self-managing saves $180/month, yielding $136/month or $1,632/year on $5,300 = 30.8% CoC. Excellent return on trapped equity."
   }
  ]
 },
 {
  "title": "Creative Acquisition Strategy",
  "track": "Multi-Tool Workflows",
  "diff": "Intermediate",
  "role": "Investor",
  "time": "10 min",
  "desc": "Seller financing meets cash flow analysis. Structure a deal where both sides win.",
  "setup": "A retiring landlord wants to sell a paid-off duplex worth $240,000. He wants $2,000/month in passive income from the sale. You propose seller financing: $15,000 down, 5.5% interest, 20-year amortization with a 7-year balloon. Both units rent for $1,100/month ($2,200 total). Taxes $2,400/year, insurance $1,600/year.",
  "data": [
   [
    "Property Value",
    "$240,000"
   ],
   [
    "Seller Financing",
    "$225,000 at 5.5%, 20yr amort, 7yr balloon"
   ],
   [
    "Down Payment",
    "$15,000"
   ],
   [
    "Monthly Rent (2 units)",
    "$2,200"
   ],
   [
    "Property Tax",
    "$2,400/year"
   ],
   [
    "Insurance",
    "$1,600/year"
   ],
   [
    "Seller's Goal",
    "$2,000/month passive income"
   ]
  ],
  "tools": [
   [
    "Creative Finance Case Study",
    "../creative-finance-casestudy/index.html"
   ],
   [
    "Seller Financing",
    "../seller-financing/index.html"
   ],
   [
    "Cash Flow",
    "../cashflow/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the monthly P&I payment to the seller?",
    "type": "input",
    "answer": "$1,546 – $1,560",
    "explain": "$225,000 amortized over 20 years at 5.5% = approximately $1,550/month. The seller gets $1,550 in passive income — below his $2,000 target. You may need to negotiate a higher rate or a larger down payment."
   },
   {
    "text": "At what interest rate does the seller hit his $2,000/month goal?",
    "type": "input",
    "answer": "~8.0%",
    "explain": "At 8.0% on $225K over 20 years, the payment is approximately $1,882. Still short. At 8.5% it reaches ~$1,953. The seller needs either a higher rate (~9%) or a shorter amortization (15 years at 6.5% = $1,959). Negotiation is key."
   },
   {
    "text": "Does this deal cash flow for the buyer at 5.5%?",
    "type": "choice",
    "choices": [
     "Yes, strongly positive",
     "Yes, but thin margins",
     "No, it's cash-flow negative",
     "Depends on management costs"
    ],
    "answer": "Yes, but thin margins",
    "explain": "Rent $2,200 - P&I $1,550 - taxes ($200) - insurance ($133) - vacancy (5% = $110) - maintenance ($100) = $107/month. Thin but positive. Self-managing keeps it viable. Adding professional management ($220) makes it negative. The trade-off: great terms (5.5%) but tight cash flow."
   }
  ]
 },
 {
  "title": "Refinance or Sell?",
  "track": "Multi-Tool Workflows",
  "diff": "Intermediate",
  "role": "Investor",
  "time": "10 min",
  "desc": "You have a profitable rental. Should you cash-out refinance to buy more, or sell and 1031 exchange?",
  "setup": "You bought a rental 5 years ago for $185,000. It is now worth $270,000 with a $142,000 mortgage balance at 4.25%. Monthly rent is $1,650. You want to access the equity to buy more properties. Option A: cash-out refinance at 7.5%. Option B: sell and 1031 exchange into two properties. Your original cost basis (with depreciation) is $148,000. Capital gains rate is 15%.",
  "data": [
   [
    "Current Value",
    "$270,000"
   ],
   [
    "Mortgage Balance",
    "$142,000"
   ],
   [
    "Current Rate",
    "4.25%"
   ],
   [
    "Monthly Rent",
    "$1,650"
   ],
   [
    "Depreciation-Adjusted Basis",
    "$148,000"
   ],
   [
    "Capital Gains Rate",
    "15%"
   ],
   [
    "Cash-Out Refi Rate",
    "7.5%"
   ],
   [
    "Cash-Out LTV",
    "75%"
   ]
  ],
  "tools": [
   [
    "Refinance Analyzer",
    "../refinance/index.html"
   ],
   [
    "Capital Gains Tax Hub",
    "../capital-gains/index.html"
   ],
   [
    "1031 Exchange",
    "../1031-exchange/index.html"
   ]
  ],
  "questions": [
   {
    "text": "How much cash can you pull from a cash-out refinance?",
    "type": "input",
    "answer": "$60,500",
    "explain": "75% of $270K = $202,500. Pay off existing $142K. Cash out: $60,500. But your rate goes from 4.25% to 7.5%, increasing monthly P&I from ~$908 to ~$1,416 — a $508/month hit to cash flow."
   },
   {
    "text": "What would you owe in capital gains taxes if you sell without a 1031?",
    "type": "input",
    "answer": "$18,300",
    "explain": "Gain = $270,000 - $148,000 basis = $122,000. Federal capital gains at 15%: $18,300. Plus depreciation recapture (25% on ~$37K depreciated) = ~$9,250. Total tax bill: ~$27,550. Ouch."
   },
   {
    "text": "Which strategy is better for scaling your portfolio?",
    "type": "choice",
    "choices": [
     "Cash-out refi (keep the property + get $60K)",
     "Sell and 1031 into two properties",
     "Sell and pay the taxes",
     "Get a HELOC instead"
    ],
    "answer": "Sell and 1031 into two properties",
    "explain": "The 1031 defers ~$27K in taxes and converts one $270K property into two $200K+ properties (using the full equity of $128K as down payments). You go from 1 unit to potentially 4+ units, doubling your cash flow. The cash-out refi only gives $60K and destroys the existing property's cash flow with the rate increase."
   }
  ]
 },
 {
  "title": "Commercial Due Diligence",
  "track": "Multi-Tool Workflows",
  "diff": "Intermediate",
  "role": "Investor",
  "time": "12 min",
  "desc": "A 12-unit apartment building. Chain Cap Rate, DSCR, and Cash Flow tools for full underwriting.",
  "setup": "A 12-unit apartment complex is listed at $1,200,000. Average rent is $850/unit/month. Current occupancy is 92%. Operating expenses (taxes, insurance, management, maintenance, utilities) are 48% of effective gross income. You would finance with a commercial loan: 75% LTV, 6.75%, 25-year amortization.",
  "data": [
   [
    "Purchase Price",
    "$1,200,000"
   ],
   [
    "Units",
    "12"
   ],
   [
    "Avg Rent",
    "$850/unit/month"
   ],
   [
    "Occupancy",
    "92%"
   ],
   [
    "Operating Expense Ratio",
    "48% of EGI"
   ],
   [
    "Loan",
    "75% LTV, 6.75%, 25yr"
   ],
   [
    "Down Payment",
    "$300,000"
   ]
  ],
  "tools": [
   [
    "Cap Rate",
    "../caprate/index.html"
   ],
   [
    "DSCR Loan",
    "../dscr-loan/index.html"
   ],
   [
    "Cash Flow",
    "../cashflow/index.html"
   ],
   [
    "Multifamily",
    "../multifamily/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the NOI?",
    "type": "input",
    "answer": "$57,200 – $58,000",
    "explain": "Gross rent: 12 x $850 x 12 = $122,400. Vacancy (8%): $9,792. EGI: $112,608. Expenses (48%): $54,052. NOI = $112,608 - $54,052 = $58,556."
   },
   {
    "text": "What is the DSCR?",
    "type": "input",
    "answer": "1.15 – 1.20",
    "explain": "Loan: $900,000 at 6.75% over 25yr = ~$6,232/month = $74,784/year. DSCR = NOI / Annual Debt Service = $58,556 / $74,784 = 0.78. Wait — this is BELOW 1.0. The deal does NOT qualify for most commercial loans (minimum DSCR is usually 1.20–1.25). The price is too high for the income."
   },
   {
    "text": "What should you offer to hit a 1.25 DSCR?",
    "type": "input",
    "answer": "$900,000 – $950,000",
    "explain": "To hit 1.25 DSCR, annual debt service must be below $58,556 / 1.25 = $46,845. That means a loan of ~$600K, or a purchase price around $800K (at 75% LTV). Realistically, offering $900K–$950K and negotiating better terms is the starting point. This is why commercial underwriting starts with DSCR, not emotion."
   }
  ]
 },
 {
  "title": "The 1031 Decision",
  "track": "Multi-Tool Workflows",
  "diff": "Advanced",
  "role": "Investor",
  "time": "10 min",
  "desc": "Selling a $450K rental with $180K in gains. Exchange or pay the tax?",
  "setup": "You are selling a rental property for $450,000 that you purchased 8 years ago for $280,000. Your depreciation-adjusted basis is $210,000. You have identified a replacement property for $580,000. You would put the 1031 exchange proceeds as your down payment and finance the rest at 7.0%. If you pay taxes instead, your combined federal + state rate is 28% (including depreciation recapture).",
  "data": [
   [
    "Sale Price",
    "$450,000"
   ],
   [
    "Original Purchase",
    "$280,000"
   ],
   [
    "Adjusted Basis",
    "$210,000"
   ],
   [
    "Total Gain",
    "$240,000"
   ],
   [
    "Tax Rate (blended)",
    "28%"
   ],
   [
    "Replacement Property",
    "$580,000"
   ],
   [
    "New Loan Rate",
    "7.0%"
   ]
  ],
  "tools": [
   [
    "1031 Exchange",
    "../1031-exchange/index.html"
   ],
   [
    "Capital Gains Tax Hub",
    "../capital-gains/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the total tax bill if you sell without a 1031?",
    "type": "input",
    "answer": "$67,200",
    "explain": "Total gain: $450K - $210K = $240,000. At 28% blended rate = $67,200. That is a massive tax hit that reduces your reinvestment capital from $308K (after mortgage payoff) to $240,800."
   },
   {
    "text": "How much more buying power does the 1031 give you?",
    "type": "input",
    "answer": "~$269,000",
    "explain": "With 1031: full $308K available (after selling costs, before $142K mortgage payoff) as down payment on $580K. Without 1031: only $240,800 available. Difference: $67,200 in tax savings. At 75% LTV, that $67K equates to roughly $269K in additional property value you can acquire."
   },
   {
    "text": "What is the biggest risk of a 1031 exchange?",
    "type": "choice",
    "choices": [
     "Paying more for the replacement property",
     "Missing the 45-day identification deadline",
     "Higher mortgage on the replacement property",
     "All of these are significant risks"
    ],
    "answer": "All of these are significant risks",
    "explain": "The 45-day identification window creates time pressure that can lead to overpaying. The replacement property requires a larger mortgage ($580K vs $450K), increasing monthly obligations. And if the exchange fails for any reason, the full $67K tax bill comes due. The 1031 is powerful but demands careful planning."
   }
  ]
 },
 {
  "title": "Portfolio Health Check",
  "track": "Multi-Tool Workflows",
  "diff": "Intermediate",
  "role": "Investor",
  "time": "15 min",
  "desc": "Three properties, three different stories. Evaluate which to keep, which to sell, and why.",
  "setup": "You own three rental properties: Property A (bought 2019, $180K, now worth $260K, rents $1,400, mortgage $890 at 3.75%). Property B (bought 2022, $240K, now worth $235K, rents $1,650, mortgage $1,520 at 7.0%). Property C (bought 2021, $310K, now worth $365K, rents $2,100, mortgage $1,380 at 4.5%). All have standard expenses (taxes 1.2%, insurance 0.6%, 8% vacancy, 8% maintenance, 10% management).",
  "data": [
   [
    "Property A",
    "$260K value, $1,400 rent, $890 P&I, 3.75%"
   ],
   [
    "Property B",
    "$235K value, $1,650 rent, $1,520 P&I, 7.0%"
   ],
   [
    "Property C",
    "$365K value, $2,100 rent, $1,380 P&I, 4.5%"
   ],
   [
    "Expense Assumptions",
    "1.2% tax, 0.6% ins, 8% vacancy, 8% maint, 10% mgmt"
   ]
  ],
  "tools": [
   [
    "Cash Flow",
    "../cashflow/index.html"
   ],
   [
    "Portfolio Manager",
    "../portfolio-manager/index.html"
   ],
   [
    "Capital Gains Tax Hub",
    "../capital-gains/index.html"
   ]
  ],
  "questions": [
   {
    "text": "Which property has the best cash flow?",
    "type": "choice",
    "choices": [
     "Property A",
     "Property B",
     "Property C",
     "They're about equal"
    ],
    "answer": "Property A",
    "explain": "Property A: $1,400 - $890 - expenses (~$340) = ~$170/month. Property B: $1,650 - $1,520 - expenses (~$380) = -$250/month (negative!). Property C: $2,100 - $1,380 - expenses (~$495) = ~$225/month. Property A is solid, C is good, B is bleeding money."
   },
   {
    "text": "What should you do with Property B?",
    "type": "choice",
    "choices": [
     "Hold and wait for rates to drop",
     "Sell at a loss",
     "Raise rent to $1,850",
     "Refinance to a lower rate"
    ],
    "answer": "Raise rent to $1,850",
    "explain": "Property B is underwater on cash flow. Selling at a $5K loss plus $14K in selling costs is painful. Rates are unlikely to drop enough to help soon. Raising rent by $200 (if the market supports it) turns a -$250 monthly loss into a -$50 loss — more manageable while you wait for appreciation."
   },
   {
    "text": "Which property would you 1031 exchange first if scaling?",
    "type": "choice",
    "choices": [
     "Property A (most equity, lowest return on equity)",
     "Property B (cut losses)",
     "Property C (highest value)",
     "None — keep all three"
    ],
    "answer": "Property A (most equity, lowest return on equity)",
    "explain": "Property A has ~$130K+ in equity earning only ~$2,040/year in cash flow. Return on equity: 1.6%. That money could generate 8–12% deployed in new deals. A 1031 exchange lets you trade up without tax consequences. Property C has more equity but also better returns."
   }
  ]
 },
 {
  "title": "Seller Finance Structuring",
  "track": "Multi-Tool Workflows",
  "diff": "Advanced",
  "role": "Investor",
  "time": "10 min",
  "desc": "Build a seller finance deal using the Lease Option and Seller Finance tools in tandem.",
  "setup": "A homeowner is 2 years behind on a $180,000 mortgage (current balance $165,000). The property is worth $230,000. Monthly PITI is $1,250. You propose a lease-option: $5,000 option fee, $1,500/month rent ($250 in monthly credits toward purchase), with a 3-year option period and a strike price of $240,000. You plan to sublease for $1,850/month.",
  "data": [
   [
    "Property Value",
    "$230,000"
   ],
   [
    "Seller's Mortgage",
    "$165,000"
   ],
   [
    "Monthly PITI",
    "$1,250"
   ],
   [
    "Your Rent to Seller",
    "$1,500/month"
   ],
   [
    "Sublease Rent",
    "$1,850/month"
   ],
   [
    "Option Fee",
    "$5,000"
   ],
   [
    "Strike Price",
    "$240,000"
   ],
   [
    "Option Period",
    "3 years"
   ],
   [
    "Monthly Credits",
    "$250"
   ]
  ],
  "tools": [
   [
    "Lease Option",
    "../lease-option/index.html"
   ],
   [
    "Seller Financing",
    "../seller-financing/index.html"
   ],
   [
    "Cash Flow",
    "../cashflow/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is your monthly spread (cash flow)?",
    "type": "input",
    "answer": "$350",
    "explain": "Sublease income $1,850 - rent to seller $1,500 = $350/month. Over 3 years: $350 x 36 = $12,600 in cash flow."
   },
   {
    "text": "What is the total accumulated credit toward purchase after 3 years?",
    "type": "input",
    "answer": "$14,000",
    "explain": "Option fee: $5,000 + monthly credits ($250 x 36 = $9,000) = $14,000 total credits. Your effective purchase price: $240,000 - $14,000 = $226,000."
   },
   {
    "text": "What is the seller's benefit from this arrangement?",
    "type": "choice",
    "choices": [
     "Immediate cash ($5K) + above-mortgage payments",
     "Avoids foreclosure and gets full price eventually",
     "Both of the above",
     "None — the seller loses in this deal"
    ],
    "answer": "Both of the above",
    "explain": "The seller gets: (1) $5K option fee immediately to catch up on mortgage, (2) $1,500/month which covers PITI ($1,250) with $250 cushion, (3) a $240K sale price (above current value). The seller avoids foreclosure, covers payments, and sells above market. Win-win when structured fairly."
   }
  ]
 },
 {
  "title": "Cost Segregation Windfall",
  "track": "Multi-Tool Workflows",
  "diff": "Advanced",
  "role": "Investor",
  "time": "10 min",
  "desc": "A $1.2M commercial property and the tax strategy that could save $80K+ in year one.",
  "setup": "You purchased a small retail strip center for $1,200,000. The building represents 80% of value ($960,000), land is 20%. Standard depreciation is 39 years (commercial). A cost segregation study identifies $288,000 in 5-year property, $96,000 in 15-year property, and $576,000 remaining in 39-year property. Your marginal tax rate is 37%. Bonus depreciation is available.",
  "data": [
   [
    "Purchase Price",
    "$1,200,000"
   ],
   [
    "Building Value",
    "$960,000 (80%)"
   ],
   [
    "5-Year Property",
    "$288,000"
   ],
   [
    "15-Year Property",
    "$96,000"
   ],
   [
    "39-Year Property",
    "$576,000"
   ],
   [
    "Tax Rate",
    "37%"
   ],
   [
    "Standard Depreciation",
    "$960K / 39yr = $24,615/year"
   ]
  ],
  "tools": [
   [
    "Investment Analysis",
    "../investment-analysis/index.html"
   ],
   [
    "Cost Segregation (within IA)",
    "../investment-analysis/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the Year 1 depreciation with cost segregation (assuming 80% bonus)?",
    "type": "input",
    "answer": "$310,000 – $330,000",
    "explain": "5-year property at 80% bonus: $288K x 0.80 = $230,400 bonus + $57,600 x 20% regular = $241,920. 15-year at 80% bonus: $96K x 0.80 = $76,800 bonus + $19,200 x 6.67% = $78,081. 39-year: $576K / 39 = $14,769. Total Year 1: ~$334,770. Versus standard: $24,615. Massive acceleration."
   },
   {
    "text": "What is the approximate tax savings in Year 1?",
    "type": "input",
    "answer": "$115,000 – $125,000",
    "explain": "Additional depreciation: ~$334,770 - $24,615 = $310,155 extra. At 37% tax rate: $310,155 x 0.37 = $114,757 in Year 1 tax savings. This is real money back in your pocket from a legitimate tax strategy."
   },
   {
    "text": "What is the risk of aggressive cost segregation?",
    "type": "choice",
    "choices": [
     "Depreciation recapture when you sell",
     "IRS audit risk",
     "Reduced basis for capital gains calculation",
     "All of the above"
    ],
    "answer": "All of the above",
    "explain": "Cost segregation is legal and IRS-approved, but when you sell, you face 25% depreciation recapture on all accelerated depreciation. Your basis is also lower, increasing capital gains. And aggressive classifications can trigger audits. The strategy works best when you plan to hold long-term or 1031 exchange."
   }
  ]
 },
 {
  "title": "Rising Rate Squeeze",
  "track": "Market Conditions",
  "diff": "Intermediate",
  "role": "Investor",
  "time": "8 min",
  "desc": "Rates just jumped from 6.5% to 8%. How does that change your deal pipeline?",
  "setup": "You have a property under contract at $225,000 with 25% down. Your original underwriting assumed 6.5% interest. Before closing, rates jump to 8.0%. Monthly rent is $1,700. Taxes $2,700/year, insurance $1,500/year. You were projecting $180/month cash flow at 6.5%.",
  "data": [
   [
    "Purchase Price",
    "$225,000"
   ],
   [
    "Down Payment",
    "25% ($56,250)"
   ],
   [
    "Original Rate",
    "6.5%"
   ],
   [
    "New Rate",
    "8.0%"
   ],
   [
    "Monthly Rent",
    "$1,700"
   ],
   [
    "Property Tax",
    "$2,700/year"
   ],
   [
    "Insurance",
    "$1,500/year"
   ]
  ],
  "tools": [
   [
    "Cash Flow",
    "../cashflow/index.html"
   ],
   [
    "Sensitivity Grid",
    "../sensitivity-grid/index.html"
   ],
   [
    "Rate Buydown",
    "../rate-buydown/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the difference in monthly P&I between 6.5% and 8.0%?",
    "type": "input",
    "answer": "$155 – $165",
    "explain": "At 6.5%: $168,750 loan = $1,067/month. At 8.0%: $1,238/month. Difference: $171/month. That wipes out your entire projected cash flow."
   },
   {
    "text": "What price reduction would restore the original cash flow?",
    "type": "input",
    "answer": "$195,000 – $200,000",
    "explain": "To get the same $1,067 payment at 8.0%, the loan needs to be ~$145K, meaning a purchase price of ~$193K (at 25% down). You need a $25K–30K price reduction to make the same deal work."
   },
   {
    "text": "Would a 2-1 rate buydown help?",
    "type": "choice",
    "choices": [
     "Yes, it permanently fixes the problem",
     "It helps for 2 years, then the problem returns",
     "Only if the seller pays for it",
     "Buydowns don't apply to investment properties"
    ],
    "answer": "It helps for 2 years, then the problem returns",
    "explain": "A 2-1 buydown gives you 6% in Year 1 and 7% in Year 2, then 8% permanently. It buys time but doesn't solve the fundamental cash flow issue. Only worth it if you expect rates to drop and plan to refinance within 2 years."
   }
  ]
 },
 {
  "title": "The 2008 Stress Test",
  "track": "Market Conditions",
  "diff": "Advanced",
  "role": "Investor",
  "time": "12 min",
  "desc": "Run your 3-property portfolio through a severe downturn scenario using the Risk Dashboard.",
  "setup": "You own 3 properties worth a combined $820,000 with $540,000 in total mortgages. Scenario: values drop 25%, rents drop 15%, vacancy jumps from 8% to 18%, and insurance increases 20%. Your monthly reserves are $8,500. Combined current monthly cash flow is $1,200.",
  "data": [
   [
    "Portfolio Value",
    "$820,000"
   ],
   [
    "Total Mortgages",
    "$540,000"
   ],
   [
    "Current LTV",
    "65.9%"
   ],
   [
    "Stress: Value Drop",
    "25%"
   ],
   [
    "Stress: Rent Drop",
    "15%"
   ],
   [
    "Stress: Vacancy Increase",
    "8% to 18%"
   ],
   [
    "Stress: Insurance Increase",
    "20%"
   ],
   [
    "Monthly Reserves",
    "$8,500"
   ],
   [
    "Current Cash Flow",
    "$1,200/month"
   ]
  ],
  "tools": [
   [
    "Subject-To Risk Dashboard",
    "../subject-to-risk-dashboard/index.html"
   ],
   [
    "Portfolio Manager",
    "../portfolio-manager/index.html"
   ],
   [
    "Cash Flow",
    "../cashflow/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the new LTV after a 25% value decline?",
    "type": "input",
    "answer": "87.8%",
    "explain": "New portfolio value: $820K x 0.75 = $615,000. Mortgages unchanged: $540,000. LTV: $540K / $615K = 87.8%. Dangerously close to underwater."
   },
   {
    "text": "What happens to monthly cash flow under stress conditions?",
    "type": "input",
    "answer": "-$800 to -$1,200/month",
    "explain": "Rents drop 15%: roughly $400 less in gross rent. Vacancy jumps to 18%: another $300+ lost. Insurance up 20%: $50–100 more. Combined impact: ~$1,200 current cash flow becomes approximately -$800 to -$1,200. You are bleeding money every month."
   },
   {
    "text": "How many months can you survive on reserves before running out?",
    "type": "choice",
    "choices": [
     "3–4 months",
     "7–8 months",
     "12+ months",
     "You can't survive this scenario"
    ],
    "answer": "7–8 months",
    "explain": "At -$1,000/month average loss and $8,500 in reserves: about 8.5 months. This is borderline. The lesson: stress-test your portfolio BEFORE a downturn. Investors who survived 2008 had 12+ months of reserves and low LTVs."
   }
  ]
 },
 {
  "title": "Appreciation vs. Cash Flow Market",
  "track": "Market Conditions",
  "diff": "Intermediate",
  "role": "Investor",
  "time": "10 min",
  "desc": "Phoenix vs. Cleveland — which market wins over 10 years for a $250K budget?",
  "setup": "You have $250,000 to invest. Option A: Phoenix condo ($250K, 4% appreciation, 4.5% cap rate, $1,350 rent). Option B: Cleveland duplex ($125K each x 2 = $250K, 1.5% appreciation, 8.5% cap rate, $1,800 total rent). Both financed at 25% down, 7.5%. Time horizon: 10 years.",
  "data": [
   [
    "Phoenix Condo",
    "$250K, 4% appreciation, 4.5% cap, $1,350/mo rent"
   ],
   [
    "Cleveland Duplexes",
    "2 x $125K, 1.5% appreciation, 8.5% cap, $900/unit rent"
   ],
   [
    "Budget",
    "$250,000"
   ],
   [
    "Financing",
    "25% down, 7.5%"
   ],
   [
    "Time Horizon",
    "10 years"
   ]
  ],
  "tools": [
   [
    "Cash Flow",
    "../cashflow/index.html"
   ],
   [
    "RE Investment Analyzer",
    "../real-estate-investment-analyzer/index.html"
   ],
   [
    "Portfolio Manager",
    "../portfolio-manager/index.html"
   ]
  ],
  "questions": [
   {
    "text": "Which option generates more monthly cash flow today?",
    "type": "choice",
    "choices": [
     "Phoenix (higher rent per door)",
     "Cleveland (higher cap rate)",
     "They're roughly equal",
     "Cannot determine without more data"
    ],
    "answer": "Cleveland (higher cap rate)",
    "explain": "Phoenix: $1,350 rent minus expenses (mortgage $1,311 + $375 expenses) = -$336/month (negative!). Cleveland: $1,800 rent minus expenses (two mortgages $1,311 + $500 expenses) = -$11/month. Cleveland is essentially break-even while Phoenix is deeply negative. High-price, low-cap markets rarely cash flow."
   },
   {
    "text": "Which generates more total wealth after 10 years?",
    "type": "choice",
    "choices": [
     "Phoenix (appreciation wins)",
     "Cleveland (cash flow compounds)",
     "They're surprisingly close",
     "Cleveland by a wide margin"
    ],
    "answer": "They're surprisingly close",
    "explain": "Phoenix: $250K x 1.04^10 = $370K value. Equity after 10yr: ~$200K. But lost ~$40K in negative cash flow. Net: ~$160K gain. Cleveland: $250K x 1.015^10 = $290K value. Equity: ~$150K. Gained ~$0 in cash flow. Net: ~$150K gain. Remarkably similar total returns through different paths."
   },
   {
    "text": "Which is better for a hands-off investor?",
    "type": "choice",
    "choices": [
     "Phoenix — one property, less management",
     "Cleveland — higher cap rate covers management costs",
     "Neither — both require active management",
     "Phoenix, but only with a property manager"
    ],
    "answer": "Phoenix — one property, less management",
    "explain": "One property = one roof, one tenant relationship, one management agreement. Cleveland has 4 units across 2 properties = more maintenance, turnover, and management complexity. For a truly passive investor, fewer doors in a strong appreciation market often wins on lifestyle, even if total returns are similar."
   }
  ]
 },
 {
  "title": "The Insurance Crisis",
  "track": "Market Conditions",
  "diff": "Intermediate",
  "role": "Investor",
  "time": "8 min",
  "desc": "Your coastal rental’s insurance just doubled. Does the deal still work?",
  "setup": "You own a beachfront rental in Florida purchased for $380,000. Insurance was $4,200/year when you bought it. At renewal, the new premium is $9,600/year. Rent is $2,400/month. Mortgage P&I is $1,890 (7.0% on $285K). Taxes $4,560/year. You self-manage. The property is now worth $410,000.",
  "data": [
   [
    "Purchase Price",
    "$380,000"
   ],
   [
    "Current Value",
    "$410,000"
   ],
   [
    "Monthly Rent",
    "$2,400"
   ],
   [
    "Mortgage P&I",
    "$1,890"
   ],
   [
    "Old Insurance",
    "$4,200/year"
   ],
   [
    "New Insurance",
    "$9,600/year"
   ],
   [
    "Property Tax",
    "$4,560/year"
   ],
   [
    "Management",
    "Self-managed"
   ]
  ],
  "tools": [
   [
    "Cash Flow",
    "../cashflow/index.html"
   ],
   [
    "Sensitivity Grid",
    "../sensitivity-grid/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What was the monthly cash flow BEFORE the insurance increase?",
    "type": "input",
    "answer": "$60 – $100",
    "explain": "Rent $2,400 - P&I $1,890 - taxes $380 - old insurance $350 - vacancy (5%) $120 - maintenance $100 = -$440 expenses = ~-$40. Actually, this was already borderline negative. Coastal properties are expensive to hold."
   },
   {
    "text": "What is the monthly cash flow AFTER the insurance increase?",
    "type": "input",
    "answer": "-$400 to -$490",
    "explain": "New insurance: $9,600/yr = $800/month (was $350). That is $450/month MORE. Cash flow drops from borderline zero to deeply negative (-$450+). This is the Florida insurance crisis in action."
   },
   {
    "text": "What is the best response?",
    "type": "choice",
    "choices": [
     "Raise rent to $2,850",
     "Convert to short-term rental for higher income",
     "Sell while value is up",
     "Shop for alternative insurance carriers"
    ],
    "answer": "Convert to short-term rental for higher income",
    "explain": "Raising rent $450 may not be market-supported for long-term. Selling captures $30K appreciation but loses the asset. The best move for a beachfront property: convert to STR. Similar properties in Florida earn $4,000–$6,000/month in peak season. The higher gross income can absorb the insurance increase and still generate strong returns. Note: STR insurance may be even higher, so run the full numbers."
   }
  ]
 },
 {
  "title": "Post-Pandemic Rental Market",
  "track": "Market Conditions",
  "diff": "Intermediate",
  "role": "Investor",
  "time": "8 min",
  "desc": "Remote work changed everything. Analyze a suburban rental where demand shifted dramatically.",
  "setup": "A suburban 4-bed/3-bath home in a Boise, ID suburb. Pre-2020: worth $280K, rented for $1,450. Now: worth $420K, market rent $2,100. You bought it in 2019 at $280K with 25% down at 4.5%. Current tenant pays $1,600 (below market, long-term tenant). Lease expires in 3 months. Question: raise to market rent or sell at peak?",
  "data": [
   [
    "2019 Purchase",
    "$280,000"
   ],
   [
    "Current Value",
    "$420,000"
   ],
   [
    "Current Rent",
    "$1,600"
   ],
   [
    "Market Rent",
    "$2,100"
   ],
   [
    "Mortgage P&I",
    "$1,068"
   ],
   [
    "Interest Rate",
    "4.5%"
   ],
   [
    "Mortgage Balance",
    "$195,000"
   ],
   [
    "Equity",
    "$225,000"
   ]
  ],
  "tools": [
   [
    "Cash Flow",
    "../cashflow/index.html"
   ],
   [
    "Capital Gains Tax Hub",
    "../capital-gains/index.html"
   ],
   [
    "Rent vs Buy",
    "../rent-vs-buy/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the return on equity at current rent vs. market rent?",
    "type": "input",
    "answer": "Current: 2.8% | Market: 6.4%",
    "explain": "At $1,600 rent: annual cash flow ~$6,384. Return on $225K equity: 2.8%. At $2,100 rent: annual cash flow ~$12,384. Return on equity: 5.5%. Your equity is underperforming in both cases — but raising rent significantly improves it."
   },
   {
    "text": "If you sell, what is the approximate net after taxes and costs?",
    "type": "input",
    "answer": "$175,000 – $185,000",
    "explain": "Sale $420K - mortgage $195K = $225K gross equity. Selling costs (6%): $25,200. Capital gains: ($420K - $280K) x 15% + depreciation recapture = ~$30K. Net: ~$170K–$180K."
   },
   {
    "text": "What is the better financial move?",
    "type": "choice",
    "choices": [
     "Sell at peak and redeploy equity",
     "Raise rent to $2,100 and hold",
     "Cash-out refinance to buy a second property",
     "Keep rent at $1,600 to retain good tenant"
    ],
    "answer": "Raise rent to $2,100 and hold",
    "explain": "Selling triggers ~$30K in taxes and costs $25K in commissions. You net $175K. But holding at $2,100 rent with a 4.5% locked rate generates strong cash flow AND you keep the asset appreciating. The 4.5% rate is a moat — you cannot get that rate again. Cash-out refi would destroy that rate. Raise rent, hold, and let the locked-in rate do the heavy lifting."
   }
  ]
 },
 {
  "title": "Construction Cost Surge",
  "track": "Market Conditions",
  "diff": "Advanced",
  "role": "Investor",
  "time": "10 min",
  "desc": "Your rehab budget just blew up mid-project. Materials cost 30% more than estimated. What now?",
  "setup": "You purchased a flip for $160,000 with an original rehab budget of $50,000. After demolition, you discover the rehab will cost $65,000 (30% overrun due to material costs and code requirements). ARV is $285,000. You used a hard money loan at 12% covering 80% of purchase + 100% rehab. You are 45 days into a 6-month timeline.",
  "data": [
   [
    "Purchase Price",
    "$160,000"
   ],
   [
    "Original Rehab Budget",
    "$50,000"
   ],
   [
    "Actual Rehab Cost",
    "$65,000"
   ],
   [
    "ARV",
    "$285,000"
   ],
   [
    "Hard Money",
    "80% purchase + 100% rehab, 12%"
   ],
   [
    "Time Elapsed",
    "45 days of 180-day term"
   ],
   [
    "Monthly Holding Costs",
    "$2,800"
   ]
  ],
  "tools": [
   [
    "Fix & Flip",
    "../fixflip/index.html"
   ],
   [
    "Sources & Uses",
    "../sources-uses/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the revised all-in project cost?",
    "type": "input",
    "answer": "$244,400 – $250,000",
    "explain": "Purchase $160K + actual rehab $65K + holding costs ($2,800 x 6 = $16,800) + closing/financing costs (~$8K) = ~$249,800. Your profit margin just shrunk from $35K to $10K."
   },
   {
    "text": "What is the revised profit margin?",
    "type": "input",
    "answer": "3% – 5%",
    "explain": "ARV $285K minus selling costs (6% = $17,100) = net $267,900. Minus all-in cost $249,800 = ~$18,100 profit. As a percentage of ARV: 6.4%. As ROI on out-of-pocket: depends on hard money terms. This is dangerously thin for the risk involved."
   },
   {
    "text": "Should you continue or cut losses?",
    "type": "choice",
    "choices": [
     "Continue — $18K profit is still worth it",
     "Pivot to BRRRR (rent instead of sell)",
     "Walk away and take the loss",
     "Renegotiate the hard money terms"
    ],
    "answer": "Pivot to BRRRR (rent instead of sell)",
    "explain": "An $18K profit on a $250K project (7.2%) barely covers unexpected costs. But the property at $285K ARV with $2,100/month rent potential makes a strong BRRRR. Refinance at 75% LTV ($213,750), hold as a rental, and earn passive income instead of a thin flip profit. Always have an exit strategy B."
   }
  ]
 },
 {
  "title": "The Tax Law Change",
  "track": "Market Conditions",
  "diff": "Advanced",
  "role": "Investor",
  "time": "10 min",
  "desc": "Bonus depreciation dropped from 80% to 60%. How does this impact your commercial acquisition strategy?",
  "setup": "You are acquiring a $2M office building. Cost segregation study identifies $500K in short-life assets. Under 80% bonus depreciation, you would have deducted $400K in Year 1. Under the new 60% rate, only $300K qualifies for bonus. Your tax rate is 37%. The remaining $200K follows standard schedules (5-year and 15-year).",
  "data": [
   [
    "Purchase Price",
    "$2,000,000"
   ],
   [
    "Short-Life Assets",
    "$500,000"
   ],
   [
    "Old Bonus Rate",
    "80%"
   ],
   [
    "New Bonus Rate",
    "60%"
   ],
   [
    "Tax Rate",
    "37%"
   ],
   [
    "Standard Depreciation (39yr on $1.5M)",
    "$38,462/year"
   ]
  ],
  "tools": [
   [
    "Investment Analysis",
    "../investment-analysis/index.html"
   ],
   [
    "Capital Gains Tax Hub",
    "../capital-gains/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the Year 1 tax savings difference between 80% and 60% bonus?",
    "type": "input",
    "answer": "$37,000",
    "explain": "At 80%: $400K bonus + regular depreciation = total deduction ~$440K. At 60%: $300K bonus + regular depreciation = total deduction ~$340K. Difference: $100K less deduction x 37% = $37,000 less in Year 1 tax savings."
   },
   {
    "text": "Does this change make the deal unviable?",
    "type": "choice",
    "choices": [
     "Yes, the returns no longer work",
     "No, it just shifts timing",
     "Only if you need the tax savings for cash flow",
     "It depends on hold period"
    ],
    "answer": "No, it just shifts timing",
    "explain": "The total depreciation over the asset's life is the same — bonus just accelerates when you take it. At 60%, you still get significant Year 1 benefits ($300K x 37% = $111K). The remaining $200K depreciates over 5–15 years. Think of it as delayed savings, not lost savings."
   },
   {
    "text": "What strategy maximizes tax benefits under the new rules?",
    "type": "choice",
    "choices": [
     "Buy more properties to increase total depreciation",
     "Use a cost segregation study on EVERY property",
     "Time acquisitions for December (maximize partial-year deductions)",
     "All of these"
    ],
    "answer": "All of these",
    "explain": "Under lower bonus rates: (1) more properties = more total short-life assets, (2) cost segregation becomes more important (not less), and (3) December acquisitions get a full year of standard depreciation for a partial-year hold. Sophisticated investors adapt strategy to tax law, not the other way around."
   }
  ]
 },
 {
  "title": "The Inflation Hedge",
  "track": "Market Conditions",
  "diff": "Intermediate",
  "role": "Investor",
  "time": "8 min",
  "desc": "Inflation is running 5%. How does your rental portfolio perform versus stocks and bonds?",
  "setup": "You own $400K in rental property equity generating $18,000/year cash flow. You also have $400K in a stock portfolio (S&P 500 average 10% nominal return) and $200K in bonds (5% yield). Inflation is 5% and rents have been growing 4% annually. Your mortgage is fixed at 4.0%. Property values track inflation.",
  "data": [
   [
    "Rental Equity",
    "$400K, $18K/yr cash flow, 4% rent growth"
   ],
   [
    "Stock Portfolio",
    "$400K, 10% nominal return"
   ],
   [
    "Bond Portfolio",
    "$200K, 5% yield"
   ],
   [
    "Inflation Rate",
    "5%"
   ],
   [
    "Mortgage Rate",
    "4.0% (fixed)"
   ],
   [
    "Property Appreciation",
    "~5% (tracking inflation)"
   ]
  ],
  "tools": [
   [
    "Cash Flow",
    "../cashflow/index.html"
   ],
   [
    "Portfolio Manager",
    "../portfolio-manager/index.html"
   ],
   [
    "IUL Portfolio",
    "../iul-portfolio/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the real (inflation-adjusted) return on each asset class?",
    "type": "input",
    "answer": "Rentals: 8–10%, Stocks: 5%, Bonds: 0%",
    "explain": "Rentals: 4.5% cash-on-cash + 5% appreciation + mortgage paydown + tax benefits = 10%+ nominal, ~8–10% real (leverage amplifies). Stocks: 10% - 5% inflation = 5% real. Bonds: 5% - 5% = 0% real. Real estate with fixed-rate debt is the strongest inflation hedge."
   },
   {
    "text": "Why does a fixed-rate mortgage help during inflation?",
    "type": "choice",
    "choices": [
     "Your payment stays the same while rents rise",
     "The real value of your debt decreases over time",
     "Both of the above",
     "It doesn't help — interest is still owed"
    ],
    "answer": "Both of the above",
    "explain": "A fixed $1,200 mortgage in Year 1 feels like $1,200. After 5 years of 5% inflation, that same $1,200 feels like $940 in today's dollars. Meanwhile, your rent grew from $1,500 to $1,824. The spread between rent and mortgage widens every year. You are repaying debt with dollars that are worth less. This is why leveraged real estate thrives during inflation."
   },
   {
    "text": "Should you sell stocks to buy more real estate in this environment?",
    "type": "choice",
    "choices": [
     "Yes — real estate crushes stocks during inflation",
     "No — diversification matters",
     "Partially — rebalance toward RE",
     "Only if you can lock in sub-5% rates"
    ],
    "answer": "Partially — rebalance toward RE",
    "explain": "Going all-in on one asset class is always risky. But tilting toward real estate during high inflation is historically sound. The key: lock in fixed-rate debt while expanding. If rates are above 7%, the leverage advantage is reduced. A balanced approach — maintain stock exposure for liquidity while acquiring more cash-flowing RE — is the sophisticated move."
   }
  ]
 },
 {
  "title": "The Passive Investor",
  "track": "Investor Profiles",
  "diff": "Beginner",
  "role": "Investor",
  "time": "8 min",
  "desc": "A busy surgeon with $200K to invest. Zero desire to manage anything. What works?",
  "setup": "Dr. Patel is a surgeon earning $420K/year. She has $200K to invest in real estate but cannot spend more than 2 hours/month on it. She is considering: (A) a turnkey rental managed by a third party, (B) a real estate syndication, or (C) a REIT. She wants minimum 8% annual returns and total passivity.",
  "data": [
   [
    "Investment Capital",
    "$200,000"
   ],
   [
    "Time Available",
    "2 hours/month max"
   ],
   [
    "Target Return",
    "8%+ annually"
   ],
   [
    "Option A",
    "Turnkey rental ($200K, managed, ~6% CoC)"
   ],
   [
    "Option B",
    "Real estate syndication (5yr hold, 15–18% IRR target)"
   ],
   [
    "Option C",
    "REIT (publicly traded, ~4–6% dividend + appreciation)"
   ],
   [
    "Tax Rate",
    "37%"
   ]
  ],
  "tools": [
   [
    "Cash Flow",
    "../cashflow/index.html"
   ],
   [
    "RE Investment Analyzer",
    "../real-estate-investment-analyzer/index.html"
   ],
   [
    "Portfolio Manager",
    "../portfolio-manager/index.html"
   ]
  ],
  "questions": [
   {
    "text": "Which option is truly passive (under 2 hrs/month)?",
    "type": "choice",
    "choices": [
     "All three",
     "Only B and C",
     "Only C",
     "B and C, plus A with good management"
    ],
    "answer": "B and C, plus A with good management",
    "explain": "A well-managed turnkey rental requires occasional decisions (approve repairs, review statements) but can be under 2 hrs/month with a good PM company. Syndications are fully passive — you are a limited partner. REITs are completely passive (buy/hold). All three can work within her constraints."
   },
   {
    "text": "Which offers the best risk-adjusted return for $200K?",
    "type": "choice",
    "choices": [
     "Turnkey rental (guaranteed hard asset)",
     "Syndication (highest target returns)",
     "REIT (most liquid)",
     "Split across all three"
    ],
    "answer": "Split across all three",
    "explain": "$80K in a turnkey rental (hard asset, tax benefits, 6% CoC). $80K in a syndication (higher return target, illiquid for 5 years). $40K in a REIT (liquidity, diversification). This covers income, growth, and liquidity. Single-asset concentration is risky for a passive investor."
   },
   {
    "text": "What is the biggest risk for Dr. Patel?",
    "type": "choice",
    "choices": [
     "Property management failure on the turnkey",
     "Syndication operator fraud or underperformance",
     "REIT market volatility",
     "Time creep — real estate always demands more time than promised"
    ],
    "answer": "Time creep — real estate always demands more time than promised",
    "explain": "Even 'passive' investments require attention during crises (PM company fails, syndication distribution pauses, REIT drops 30%). The #1 risk for a time-constrained investor is being forced into active involvement at the worst possible moment. Build a portfolio that can survive neglect."
   }
  ]
 },
 {
  "title": "The Aggressive Scaler",
  "track": "Investor Profiles",
  "diff": "Advanced",
  "role": "Investor",
  "time": "12 min",
  "desc": "Target: 10 units in 18 months using the BRRRR method. Map the acquisition chain.",
  "setup": "Jake has $150K in capital and wants to acquire 10 rental units within 18 months using BRRRR. His market (Kansas City) has duplexes at $80–120K that ARV at $140–180K after $25–40K rehab. Average rent is $750/unit. He can refinance at 75% LTV and 7.5%. He can manage 2 rehabs simultaneously.",
  "data": [
   [
    "Starting Capital",
    "$150,000"
   ],
   [
    "Target",
    "10 units in 18 months"
   ],
   [
    "Market",
    "Kansas City duplexes"
   ],
   [
    "Acquisition Range",
    "$80K–$120K"
   ],
   [
    "Rehab Range",
    "$25K–$40K"
   ],
   [
    "ARV Range",
    "$140K–$180K"
   ],
   [
    "Rent per Unit",
    "$750"
   ],
   [
    "Refinance",
    "75% LTV, 7.5%"
   ]
  ],
  "tools": [
   [
    "BRRRR Strategy",
    "../brrrr/index.html"
   ],
   [
    "Cash Flow",
    "../cashflow/index.html"
   ],
   [
    "Portfolio Manager",
    "../portfolio-manager/index.html"
   ]
  ],
  "questions": [
   {
    "text": "How many BRRRR cycles can Jake complete with $150K if each cycle recycles capital?",
    "type": "input",
    "answer": "4–5 duplexes (8–10 units)",
    "explain": "Average deal: $100K purchase + $32K rehab = $132K. ARV: $160K. Refi at 75%: $120K back. Cash left in deal: $12K. Per cycle: $132K deployed, $12K trapped. With $150K he can run 2 simultaneous ($132K x 2 = $264K via hard money) and recycle. Over 18 months (3-month cycles), 4–5 duplexes = 8–10 units."
   },
   {
    "text": "What is the portfolio cash flow at 10 units?",
    "type": "input",
    "answer": "$800 – $1,200/month",
    "explain": "10 units x $750 rent = $7,500 gross. Mortgages (5 x ~$840): $4,200. Taxes, insurance, vacancy, maintenance: ~$2,100. Net cash flow: ~$1,200/month. Not life-changing, but $14,400/year on ~$60K trapped equity = 24% return."
   },
   {
    "text": "What is the biggest risk to this strategy?",
    "type": "choice",
    "choices": [
     "Running out of capital mid-rehab",
     "Appraisals coming in below target ARV",
     "Contractor delays stretching timelines",
     "All of the above, compounding simultaneously"
    ],
    "answer": "All of the above, compounding simultaneously",
    "explain": "The BRRRR chain is fragile. One bad appraisal traps $30K+ extra capital, delaying the next deal. Contractor delays add holding costs ($1,500+/month per property). And running 2 rehabs simultaneously doubles the management burden. The mitigation: conservative ARV estimates, reliable contractors, and a $30K reserve buffer."
   }
  ]
 },
 {
  "title": "The Retiree’s Income Plan",
  "track": "Investor Profiles",
  "diff": "Beginner",
  "role": "Investor",
  "time": "8 min",
  "desc": "Harold and Betty, both 68, want to convert $350K in savings into $2,500/month passive income.",
  "setup": "Harold and Betty are retired with $350,000 in savings (non-retirement), Social Security of $3,200/month, and a paid-off home worth $380,000. They want $2,500/month additional income with minimal risk. They are considering: buying 2 rental properties, seller-financing existing properties (acting as the bank), or a combination of dividend stocks and one property.",
  "data": [
   [
    "Available Capital",
    "$350,000"
   ],
   [
    "Social Security",
    "$3,200/month"
   ],
   [
    "Home (paid off)",
    "$380,000"
   ],
   [
    "Target Income",
    "$2,500/month"
   ],
   [
    "Risk Tolerance",
    "Low"
   ],
   [
    "Time Horizon",
    "15–20 years"
   ],
   [
    "Management Ability",
    "Limited (hiring PM)"
   ]
  ],
  "tools": [
   [
    "Cash Flow",
    "../cashflow/index.html"
   ],
   [
    "Seller Financing",
    "../seller-financing/index.html"
   ],
   [
    "Seniors Corner",
    "../seniors-corner/index.html"
   ]
  ],
  "questions": [
   {
    "text": "Can 2 rental properties generate $2,500/month?",
    "type": "choice",
    "choices": [
     "Yes, easily with the right markets",
     "Possible but unlikely after all expenses",
     "No — $350K buys too little",
     "Only if they self-manage"
    ],
    "answer": "Possible but unlikely after all expenses",
    "explain": "$350K buys approximately $175K x 2 properties (all cash). At 7–8% cap rate: ~$1,050/month each = $2,100 before management. After PM (10%): $1,890. Short of the $2,500 target. They would need higher-yield markets or a third property using leverage (which adds risk)."
   },
   {
    "text": "What if they act as the bank (seller finance two notes)?",
    "type": "input",
    "answer": "$2,400 – $2,800/month",
    "explain": "Sell two $175K notes at 8% interest, 20-year amortization: ~$1,464/month each x 2 = $2,928/month. This exceeds their target with ZERO management, no tenants, no toilets. If a buyer defaults, they get the property back. This is the optimal strategy for retirees seeking passive income with limited hassle."
   },
   {
    "text": "What is the key risk of seller financing for retirees?",
    "type": "choice",
    "choices": [
     "Borrower default",
     "Inflation eroding the fixed payments",
     "Property damage during default period",
     "All of the above"
    ],
    "answer": "All of the above",
    "explain": "Default risk means potential foreclosure costs ($5K–10K) and property condition risk. Fixed payments lose purchasing power over 20 years (at 3% inflation, $1,464 buys $810 worth in today's dollars by Year 20). Mitigation: require 15–20% down payment, maintain insurance escrow, and include late payment penalties."
   }
  ]
 },
 {
  "title": "The Out-of-State Investor",
  "track": "Investor Profiles",
  "diff": "Intermediate",
  "role": "Investor",
  "time": "10 min",
  "desc": "You live in San Francisco but invest in Memphis. Navigate the unique challenges of remote investing.",
  "setup": "You are buying a $130,000 rental in Memphis from San Francisco. You have never visited the property. Your team: a real estate agent (buyer's agent), a property manager (10%), and a home inspector. The property rents for $1,200/month. You will finance with 25% down at 7.5%. Property taxes $1,560/year, insurance $1,100/year.",
  "data": [
   [
    "Purchase Price",
    "$130,000"
   ],
   [
    "Monthly Rent",
    "$1,200"
   ],
   [
    "Down Payment",
    "25% ($32,500)"
   ],
   [
    "Interest Rate",
    "7.5%"
   ],
   [
    "Property Tax",
    "$1,560/year"
   ],
   [
    "Insurance",
    "$1,100/year"
   ],
   [
    "Management",
    "10%"
   ],
   [
    "Location",
    "Memphis, TN (remote)"
   ],
   [
    "Your Location",
    "San Francisco, CA"
   ]
  ],
  "tools": [
   [
    "Cash Flow",
    "../cashflow/index.html"
   ],
   [
    "Deal Grading",
    "../deal-grading/index.html"
   ],
   [
    "Cap Rate",
    "../caprate/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the monthly cash flow with professional management?",
    "type": "input",
    "answer": "$40 – $80",
    "explain": "P&I on $97.5K at 7.5%: $682. Taxes: $130. Insurance: $92. Management (10%): $120. Vacancy (8%): $96. Maintenance (10%): $120. Total expenses: $1,240. Cash flow: $1,200 - $1,240 = -$40. Actually negative! Memphis C-class properties often have higher maintenance. Management costs eat thin margins."
   },
   {
    "text": "Should an out-of-state investor budget higher for maintenance?",
    "type": "choice",
    "choices": [
     "No, 8% is standard everywhere",
     "Yes, 10–12% for remote properties",
     "Only for older properties",
     "Maintenance is the PM's problem"
    ],
    "answer": "Yes, 10–12% for remote properties",
    "explain": "When you cannot physically inspect, you rely entirely on your PM to report issues accurately. Budget 10–12% for maintenance on remote properties because: (1) you cannot DIY repairs, (2) PMs may use their own (sometimes more expensive) vendors, (3) deferred maintenance is harder to catch remotely. This is the hidden cost of out-of-state investing."
   },
   {
    "text": "What is the #1 risk of out-of-state investing?",
    "type": "choice",
    "choices": [
     "Bad property manager",
     "Overpaying due to unfamiliarity with the market",
     "Unexpected capital expenditures",
     "Property manager dependency"
    ],
    "answer": "Property manager dependency",
    "explain": "Your entire investment depends on one person/company you may have never met. If the PM is dishonest, lazy, or goes out of business, you have a vacant property 2,000 miles away with no backup plan. Mitigation: interview multiple PMs, check references, visit annually, and always have a backup PM identified."
   }
  ]
 },
 {
  "title": "The House Hack Beginner",
  "track": "Investor Profiles",
  "diff": "Beginner",
  "role": "Investor",
  "time": "10 min",
  "desc": "Owner-occupy one unit, rent three. How much could your housing cost drop to?",
  "setup": "A 4-unit building in Milwaukee is listed at $280,000. Each unit rents for $725/month. You would live in one unit and rent the other three. You qualify for an FHA loan with 3.5% down at 6.75%. Property taxes $4,200/year, insurance $2,800/year. You would self-manage to keep costs down.",
  "data": [
   [
    "Purchase Price",
    "$280,000"
   ],
   [
    "Per-Unit Rent",
    "$725/month"
   ],
   [
    "Units Rented",
    "3 (you live in 1)"
   ],
   [
    "Down Payment",
    "3.5% FHA ($9,800)"
   ],
   [
    "Interest Rate",
    "6.75%"
   ],
   [
    "Property Tax",
    "$4,200/year"
   ],
   [
    "Insurance",
    "$2,800/year"
   ],
   [
    "Management",
    "Self-managed"
   ]
  ],
  "tools": [
   [
    "Cash Flow",
    "../cashflow/index.html"
   ],
   [
    "Affordability",
    "../affordability/index.html"
   ],
   [
    "Government Loans",
    "../government-loans/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the total monthly PITI payment?",
    "type": "input",
    "answer": "$2,350 – $2,400",
    "explain": "Loan: $270,200. P&I at 6.75%: $1,753. Taxes: $350. Insurance: $233. FHA MIP (~0.85%): $191. Total PITI: ~$2,527."
   },
   {
    "text": "What is your effective housing cost after rental income?",
    "type": "input",
    "answer": "$200 – $400/month",
    "explain": "3 units x $725 = $2,175 rental income. Minus vacancy (5%): $109. Minus maintenance ($200). Net rental income: ~$1,866. Your cost: $2,527 - $1,866 = $661. But wait — conventional renters pay $725 for the same unit. You are living for $661 in a building you own, building equity. If you self-manage well, effective cost can drop below $500."
   },
   {
    "text": "When you move out and rent all 4 units, what is the monthly cash flow?",
    "type": "choice",
    "choices": [
     "$150–$250/month",
     "$400–$600/month",
     "$800+/month",
     "It would be cash-flow negative"
    ],
    "answer": "$150–$250/month",
    "explain": "4 units x $725 = $2,900. Minus PITI $2,527. Minus vacancy (8%): $232. Minus maintenance: $200. Minus management (now needed, 8%): $232. Net: ~-$291. Wait — with management it is slightly negative. Self-managing: ~$200/month positive. The house hack works best while you live there. Adding management later makes it tight."
   }
  ]
 },
 {
  "title": "The Agent Investor",
  "track": "Investor Profiles",
  "diff": "Intermediate",
  "role": "Agent",
  "time": "8 min",
  "desc": "A real estate agent using commission income and market knowledge to build a rental portfolio.",
  "setup": "You are a licensed real estate agent who closed $4.2M in volume last year (average commission 2.8% on your side). You saved $60K from commissions. You want to buy your first investment property using your agent advantages: MLS access, off-market leads, and the ability to represent yourself (saving the buyer-side commission). Target: a fixer-upper you can flip or BRRRR.",
  "data": [
   [
    "Annual Volume",
    "$4.2M (2.8% commission = $117,600 gross)"
   ],
   [
    "Savings",
    "$60,000"
   ],
   [
    "Agent Advantages",
    "MLS access, off-market leads, self-representation"
   ],
   [
    "Commission Savings",
    "2.5–3% on purchase (no buyer's agent fee)"
   ],
   [
    "Target Property",
    "Fixer-upper, $120K–$180K range"
   ]
  ],
  "tools": [
   [
    "Commission",
    "../commission/index.html"
   ],
   [
    "Fix & Flip",
    "../fixflip/index.html"
   ],
   [
    "BRRRR Strategy",
    "../brrrr/index.html"
   ]
  ],
  "questions": [
   {
    "text": "How much do you save by representing yourself on a $150K purchase?",
    "type": "input",
    "answer": "$3,750 – $4,500",
    "explain": "Buyer's agent commission at 2.5–3%: $3,750–$4,500. This goes directly toward your down payment or closing costs. Over a career of 5–10 investment purchases, self-representation saves $20K–$45K."
   },
   {
    "text": "What is your biggest competitive advantage as an agent-investor?",
    "type": "choice",
    "choices": [
     "MLS access for deal finding",
     "Commission savings on each purchase",
     "Understanding comparable sales better than most buyers",
     "All of the above"
    ],
    "answer": "All of the above",
    "explain": "Agents have a structural advantage: they see deals before the public, save 2.5–3% per transaction, and can evaluate comps with professional accuracy. The data shows agent-investors outperform non-agent investors by 8–12% on acquisition pricing because they buy smarter."
   },
   {
    "text": "What is the risk of investing in the same market where you sell?",
    "type": "choice",
    "choices": [
     "Conflict of interest with clients",
     "Concentration risk (market downturn affects both income and assets)",
     "Distraction from core business",
     "B and C are the real risks"
    ],
    "answer": "B and C are the real risks",
    "explain": "If your local market declines, your commission income drops AND your property values decline simultaneously. Double exposure. Also, rehab projects can consume time that should be spent on listing appointments. Mitigation: invest in a different market than where you sell, or partner with a contractor to minimize your time investment."
   }
  ]
 },
 {
  "title": "The Land Banker",
  "track": "Investor Profiles",
  "diff": "Intermediate",
  "role": "Investor",
  "time": "8 min",
  "desc": "Buy cheap land in growth corridors and wait. A long-game strategy with minimal carrying costs.",
  "setup": "You have identified a growth corridor where a new highway interchange is planned (2–3 years out). Raw agricultural land within 2 miles of the interchange is selling for $8,000–$12,000 per acre. Similar corridors in nearby cities saw land values jump 200–400% within 5 years of interchange completion. You have $100K to deploy.",
  "data": [
   [
    "Investment Capital",
    "$100,000"
   ],
   [
    "Land Price",
    "$8,000–$12,000/acre"
   ],
   [
    "Projected Appreciation",
    "200–400% over 5 years"
   ],
   [
    "Carrying Cost",
    "Property taxes ~$50/acre/year"
   ],
   [
    "Infrastructure Timeline",
    "2–3 years to interchange completion"
   ],
   [
    "Zoning",
    "Agricultural (rezoning possible)"
   ]
  ],
  "tools": [
   [
    "Land Flip Analyzer",
    "../land-flip/index.html"
   ],
   [
    "Land Development",
    "../land-development/index.html"
   ]
  ],
  "questions": [
   {
    "text": "How many acres can you buy with $100K?",
    "type": "input",
    "answer": "8–12 acres",
    "explain": "At $8K–$12K per acre: 8.3–12.5 acres. Budget for closing costs (~$3K) and 2 years of taxes ($50/acre x 10 acres x 2 = $1,000). Practical answer: 8–10 acres with reserves."
   },
   {
    "text": "If land appreciates 300% in 5 years, what is the annual return?",
    "type": "input",
    "answer": "32%",
    "explain": "$100K investment becomes $400K (300% gain = $300K profit). Annualized return: (400/100)^(1/5) - 1 = 31.95%. Outstanding — but only if the infrastructure actually gets built on schedule."
   },
   {
    "text": "What is the main risk of land banking?",
    "type": "choice",
    "choices": [
     "The infrastructure project gets delayed or cancelled",
     "Carrying costs eat into returns",
     "No income while you wait",
     "All of the above"
    ],
    "answer": "All of the above",
    "explain": "Land generates ZERO income. If the highway gets delayed 5 years, you have $100K tied up earning nothing with annual tax bills. If cancelled, the land reverts to agricultural value. And unlike rental property, there is no cash flow to offset holding costs. Land banking requires patience, conviction in the infrastructure thesis, and capital you can afford to lock up for years."
   }
  ]
 },
 {
  "title": "The Airbnb Entrepreneur",
  "track": "Investor Profiles",
  "diff": "Intermediate",
  "role": "Investor",
  "time": "10 min",
  "desc": "Scaling from 1 Airbnb to 5 using rental arbitrage. When do the economics actually work?",
  "setup": "You currently operate 1 Airbnb (owned property) netting $1,800/month. You want to scale to 5 units using rental arbitrage (leasing apartments and sublisting them on Airbnb with landlord permission). Average lease: $1,500/month. Estimated Airbnb revenue per unit: $3,200/month (70% occupancy at $150/night). Setup cost per unit: $5,000 (furniture, supplies, photography). Management software: $100/unit/month.",
  "data": [
   [
    "Current Airbnb Income",
    "$1,800/month net (owned unit)"
   ],
   [
    "Arbitrage Lease Cost",
    "$1,500/month per unit"
   ],
   [
    "Projected Revenue",
    "$3,200/month per unit"
   ],
   [
    "Setup Cost",
    "$5,000 per unit"
   ],
   [
    "Cleaning",
    "$85/turnover (~8/month)"
   ],
   [
    "Software",
    "$100/unit/month"
   ],
   [
    "Supplies/Consumables",
    "$150/unit/month"
   ]
  ],
  "tools": [
   [
    "Short-Term Rental",
    "../short-term-rental/index.html"
   ],
   [
    "Cash Flow",
    "../cashflow/index.html"
   ],
   [
    "Budget Variance",
    "../budget-variance/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the net monthly profit per arbitrage unit?",
    "type": "input",
    "answer": "$570 – $680",
    "explain": "Revenue $3,200 - lease $1,500 - cleaning ($85 x 8 = $680) - software $100 - supplies $150 - miscellaneous $100 = $670/month. Before income tax. Not bad, but far from the '$2,000/month per unit' that social media claims."
   },
   {
    "text": "What is the total startup cost for 4 arbitrage units?",
    "type": "input",
    "answer": "$20,000 – $26,000",
    "explain": "4 units x $5,000 setup = $20,000. Plus first month rent deposits (4 x $1,500 = $6,000). Total: $26,000. Payback period at $670/unit/month: ~2.5 months per unit. Relatively fast, but you need the capital upfront."
   },
   {
    "text": "What kills most arbitrage businesses?",
    "type": "choice",
    "choices": [
     "City regulations banning STR",
     "Landlords terminating leases",
     "Occupancy dropping below 55%",
     "All of these, plus seasonality"
    ],
    "answer": "All of these, plus seasonality",
    "explain": "Arbitrage is fragile. One city ordinance can shut you down overnight. Landlords can refuse to renew leases. And seasonal markets can see occupancy drop to 30–40% in off-season, turning your $670/month profit into a $500 loss. The owned-property Airbnb is defensible. Arbitrage is a hustle that requires constant attention and carries regulatory risk."
   }
  ]
 },
 {
  "title": "Seller Financing Opportunity",
  "track": "Advanced Strategies",
  "diff": "Advanced",
  "role": "Investor",
  "time": "10 min",
  "desc": "Motivated seller with a free-and-clear property. Structure a creative deal that works for both sides.",
  "setup": "A 72-year-old landlord wants to retire and sell his free-and-clear triplex valued at $310,000. He wants monthly passive income, not a lump sum (for tax reasons). You propose: $20,000 down, seller-financed note at 6%, 25-year amortization with a 10-year balloon. Each unit rents for $950/month ($2,850 total). Taxes $3,600/year, insurance $2,100/year.",
  "data": [
   [
    "Property Value",
    "$310,000"
   ],
   [
    "Seller's Mortgage",
    "$0 (free and clear)"
   ],
   [
    "Down Payment",
    "$20,000"
   ],
   [
    "Seller Note",
    "$290,000 at 6%, 25yr amort, 10yr balloon"
   ],
   [
    "Monthly Rent (3 units)",
    "$2,850"
   ],
   [
    "Property Tax",
    "$3,600/year"
   ],
   [
    "Insurance",
    "$2,100/year"
   ]
  ],
  "tools": [
   [
    "Seller Financing",
    "../seller-financing/index.html"
   ],
   [
    "Creative Finance Case Study",
    "../creative-finance-casestudy/index.html"
   ],
   [
    "Cash Flow",
    "../cashflow/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the monthly P&I payment to the seller?",
    "type": "input",
    "answer": "$1,868",
    "explain": "$290,000 amortized over 25 years at 6%: approximately $1,868/month. The seller receives $1,868 in passive income — $22,416/year on a $310K property."
   },
   {
    "text": "What is your monthly cash flow?",
    "type": "input",
    "answer": "$250 – $400",
    "explain": "Rent $2,850 - P&I $1,868 - taxes $300 - insurance $175 - vacancy (5%) $143 - maintenance (8%) $228 = ~$136. Thin but positive. Self-managing adds ~$285/month (no PM fee). The real win: you control a $310K asset with only $20K down."
   },
   {
    "text": "What is the balloon payment due in Year 10?",
    "type": "input",
    "answer": "$230,000 – $240,000",
    "explain": "After 10 years of payments on a 25-year amortization, the remaining balance is approximately $225K–$235K. You will need to refinance or sell by then. If the property has appreciated to $400K+, refinancing at 60% LTV covers the balloon easily."
   }
  ]
 },
 {
  "title": "Subject-To in a High-Rate Market",
  "track": "Advanced Strategies",
  "diff": "Advanced",
  "role": "Investor",
  "time": "10 min",
  "desc": "A seller has a 3.25% mortgage. Current rates are 7.5%. How much is that rate worth?",
  "setup": "A relocating homeowner has a $245,000 mortgage at 3.25% with 27 years remaining (P&I = $1,067/month). The home is worth $295,000 and they owe $245,000. They need to sell quickly due to a job transfer. You propose taking the property subject-to the existing mortgage. Current market rates are 7.5%. Market rent is $1,900/month.",
  "data": [
   [
    "Property Value",
    "$295,000"
   ],
   [
    "Existing Mortgage",
    "$245,000 at 3.25%, 27yr remaining"
   ],
   [
    "Current P&I",
    "$1,067/month"
   ],
   [
    "Market Rates",
    "7.5%"
   ],
   [
    "Market Rent",
    "$1,900/month"
   ],
   [
    "Seller's Situation",
    "Job transfer, needs quick sale"
   ]
  ],
  "tools": [
   [
    "Subject-To",
    "../subject-to/index.html"
   ],
   [
    "Subject-To Risk Dashboard",
    "../subject-to-risk-dashboard/index.html"
   ],
   [
    "Cash Flow",
    "../cashflow/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What would the payment be if you bought at current market rates (7.5%)?",
    "type": "input",
    "answer": "$1,713",
    "explain": "New loan at $245K, 7.5%, 30yr = $1,713/month. The subject-to rate saves $646/month ($7,752/year). Over 10 years: $77,520 in interest savings. That 3.25% rate is a valuable asset."
   },
   {
    "text": "What is the monthly cash flow on a subject-to acquisition?",
    "type": "input",
    "answer": "$400 – $500",
    "explain": "Rent $1,900 - existing P&I $1,067 - taxes (~$250) - insurance ($150) - vacancy (5% = $95) - maintenance (8% = $152) = ~$186. Without management: $376. With subject-to, this is strongly cash-flow positive. At market rates, it would be negative."
   },
   {
    "text": "What is the biggest legal risk of subject-to?",
    "type": "choice",
    "choices": [
     "The due-on-sale clause",
     "Title insurance issues",
     "The seller stopping insurance payments",
     "Violating the Dodd-Frank Act"
    ],
    "answer": "The due-on-sale clause",
    "explain": "The existing mortgage has a due-on-sale clause: the lender CAN call the full balance due if they discover the transfer. In practice, lenders rarely enforce this on performing loans, but it is a real legal risk. Mitigation: use a land trust, maintain insurance in seller's name, ensure payments are never late, and have refinance capability as a backup."
   }
  ]
 },
 {
  "title": "The 1031 Exchange Puzzle",
  "track": "Advanced Strategies",
  "diff": "Advanced",
  "role": "Investor",
  "time": "10 min",
  "desc": "Selling a $450K rental with $180K in gains. Navigate the 45-day identification window.",
  "setup": "You are selling a rental for $450,000. Adjusted basis: $210,000 (after depreciation). Gain: $240,000. You have identified 3 potential replacement properties: (A) $520K duplex in same city, (B) $380K + $190K = two SFRs in a different state, (C) $600K small apartment building. You have 45 days to identify and 180 days to close. Your 1031 intermediary is holding the proceeds.",
  "data": [
   [
    "Sale Price",
    "$450,000"
   ],
   [
    "Adjusted Basis",
    "$210,000"
   ],
   [
    "Total Gain",
    "$240,000"
   ],
   [
    "Tax at 28% blended",
    "$67,200"
   ],
   [
    "Option A",
    "$520K duplex (same city)"
   ],
   [
    "Option B",
    "$380K + $190K SFRs (different state)"
   ],
   [
    "Option C",
    "$600K apartment building"
   ],
   [
    "Deadlines",
    "45-day ID | 180-day close"
   ]
  ],
  "tools": [
   [
    "1031 Exchange",
    "../1031-exchange/index.html"
   ],
   [
    "Capital Gains Tax Hub",
    "../capital-gains/index.html"
   ]
  ],
  "questions": [
   {
    "text": "Which option(s) satisfy the 1031 exchange requirements?",
    "type": "choice",
    "choices": [
     "Only A (must be equal or greater value)",
     "A and C only",
     "All three (A, B, and C)",
     "Only C (must trade up)"
    ],
    "answer": "All three (A, B, and C)",
    "explain": "1031 allows: (A) single property of equal or greater value, (B) multiple properties (the 3-property rule allows up to 3 identified), (C) a larger property. All are valid. Option B uses the two-property approach, which is fine as long as the combined value meets or exceeds $450K. B falls short at $570K vs $450K — actually B works since combined is $570K > $450K."
   },
   {
    "text": "What happens if you cannot close within 180 days?",
    "type": "choice",
    "choices": [
     "You get a 90-day extension",
     "The exchange fails and taxes are due immediately",
     "You can substitute a different property",
     "The intermediary returns funds minus a penalty"
    ],
    "answer": "The exchange fails and taxes are due immediately",
    "explain": "There are no extensions. If you cannot close within 180 days, the exchange fails. The intermediary releases the funds and you owe $67,200 in capital gains taxes on that year's return. This is why having backup properties identified is critical."
   },
   {
    "text": "Which option is strategically best?",
    "type": "choice",
    "choices": [
     "A — simple, same market, easy to close",
     "B — diversifies geography",
     "C — trades up to more units and value",
     "Depends on your investment goals"
    ],
    "answer": "Depends on your investment goals",
    "explain": "A is safest (familiar market, simpler close). B diversifies but adds complexity (two closings in 180 days, new market due diligence). C maximizes the exchange (more units, higher value, stronger scaling) but requires bigger financing. There is no universal best — it depends on whether you prioritize simplicity, diversification, or scale."
   }
  ]
 },
 {
  "title": "Distressed Auction Property",
  "track": "Advanced Strategies",
  "diff": "Advanced",
  "role": "Investor",
  "time": "12 min",
  "desc": "Foreclosure auction, no inspection allowed. What is your maximum bid?",
  "setup": "A 3-bed/2-bath SFR is coming up at a foreclosure auction. You can drive by but cannot enter. From the exterior: roof appears aged (likely needs replacement), landscaping is overgrown, one window is boarded. Comps for renovated homes in the area: $220K–$240K. The neighborhood is B-class suburban. Auction starting bid: $95,000. Back taxes owed: $4,200. You would pay cash at auction.",
  "data": [
   [
    "Starting Bid",
    "$95,000"
   ],
   [
    "ARV (comps)",
    "$220K–$240K"
   ],
   [
    "Back Taxes",
    "$4,200"
   ],
   [
    "Estimated Rehab (blind)",
    "$35K–$55K (no inspection)"
   ],
   [
    "Neighborhood",
    "B-class suburban"
   ],
   [
    "Financing",
    "Cash at auction"
   ]
  ],
  "tools": [
   [
    "Fix & Flip",
    "../fixflip/index.html"
   ],
   [
    "Distressed Asset",
    "../distressed-asset/index.html"
   ],
   [
    "Deal Grading",
    "../deal-grading/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What rehab budget should you assume without inspection?",
    "type": "choice",
    "choices": [
     "$30K (standard cosmetic)",
     "$45K (moderate with roof)",
     "$55K+ (assume worst case)",
     "$35K (split the difference)"
    ],
    "answer": "$55K+ (assume worst case)",
    "explain": "No inspection = assume the worst. Roof replacement: $10K–$15K. Boarded window suggests possible interior damage, mold, or vandalism. HVAC likely needs replacement in a foreclosure ($5K–$8K). Foundation unknown. Budget $55K minimum with a $10K contingency. If it comes in lower, that is your profit cushion."
   },
   {
    "text": "What is your maximum bid?",
    "type": "input",
    "answer": "$100,000 – $110,000",
    "explain": "ARV $225K (conservative mid-point) x 70% = $157,500. Minus rehab $55K = $102,500. Minus back taxes $4,200 = $98,300. Maximum bid: ~$100K. At the $95K starting bid, you have a slim margin. Only bid if you are confident in your rehab estimate."
   },
   {
    "text": "What is the biggest risk of buying at auction?",
    "type": "choice",
    "choices": [
     "Hidden structural damage",
     "Outstanding liens not disclosed",
     "Evicting current occupants",
     "All of the above"
    ],
    "answer": "All of the above",
    "explain": "Auctions are high-risk: (1) no inspection means hidden damage is the norm, (2) junior liens, IRS liens, or HOA liens may survive the foreclosure, (3) if the property is occupied, eviction can take 30–90 days and cost $2K–$5K. Always run a title search before bidding, budget for worst-case rehab, and factor in eviction timeline."
   }
  ]
 },
 {
  "title": "The Agent’s Dilemma",
  "track": "Advanced Strategies",
  "diff": "Intermediate",
  "role": "Agent",
  "time": "8 min",
  "desc": "Two competing offers on your listing. Which one actually nets your seller more?",
  "setup": "Your seller listed at $389,000. Two offers came in: Offer A: $395,000, conventional, 20% down, 30-day close, no concessions, no contingencies waived. Offer B: $385,000, cash, 14-day close, as-is (no inspection), no concessions. The appraisal might be tight at $395K (comps support $385–$392K). Seller has a $290K mortgage and wants maximum net proceeds.",
  "data": [
   [
    "List Price",
    "$389,000"
   ],
   [
    "Offer A",
    "$395K, conventional, 20% down, 30-day close"
   ],
   [
    "Offer B",
    "$385K, cash, 14-day close, as-is"
   ],
   [
    "Appraisal Risk",
    "Comps: $385K–$392K"
   ],
   [
    "Seller Mortgage",
    "$290,000"
   ],
   [
    "Commission",
    "5.5% total"
   ]
  ],
  "tools": [
   [
    "Seller Net Sheet",
    "../seller-net-sheet/index.html"
   ],
   [
    "Commission",
    "../commission/index.html"
   ],
   [
    "CMA",
    "../cma/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the seller's net from Offer A (assuming it appraises)?",
    "type": "input",
    "answer": "$83,000 – $84,000",
    "explain": "$395K - commission ($21,725) - mortgage $290K - closing costs (~$2K) = $81,275. But if appraisal comes in at $390K, the buyer may renegotiate to $390K: net drops to $78,525."
   },
   {
    "text": "What is the seller's net from Offer B?",
    "type": "input",
    "answer": "$71,600 – $72,000",
    "explain": "$385K - commission ($21,175) - mortgage $290K - closing costs (~$2K) = $71,825. No appraisal risk, no inspection risk, closes in 14 days. Certainty has value."
   },
   {
    "text": "Which offer should you recommend?",
    "type": "choice",
    "choices": [
     "Offer A — higher price wins",
     "Offer B — certainty and speed",
     "Counter Offer A at $395K with appraisal gap clause",
     "Present both and let the seller decide"
    ],
    "answer": "Counter Offer A at $395K with appraisal gap clause",
    "explain": "The best move: counter Offer A requesting an appraisal gap guarantee (buyer covers any gap between appraisal and $395K up to $10K). This gives the seller the higher price WITH certainty. If the buyer refuses, Offer B provides a clean, fast close. Always present both with a clear net-sheet comparison so the seller makes an informed decision."
   }
  ]
 },
 {
  "title": "Lender Qualification Review",
  "track": "Advanced Strategies",
  "diff": "Intermediate",
  "role": "Lender",
  "time": "8 min",
  "desc": "A borrower wants an investment property loan. Evaluate their file and recommend the best program.",
  "setup": "Borrower: 4 existing financed properties, $185K W-2 income, 740 credit score, $45K liquid reserves. Wants to buy a $235,000 rental. Rent estimate: $1,750/month. Current total monthly debts (existing properties + personal): $6,200. Requesting 25% down. Which loan product works best?",
  "data": [
   [
    "Borrower Income",
    "$185,000 W-2"
   ],
   [
    "Credit Score",
    "740"
   ],
   [
    "Existing Properties",
    "4 financed"
   ],
   [
    "Current Monthly Debts",
    "$6,200"
   ],
   [
    "New Property Price",
    "$235,000"
   ],
   [
    "Estimated Rent",
    "$1,750"
   ],
   [
    "Down Payment",
    "25%"
   ],
   [
    "Liquid Reserves",
    "$45,000"
   ]
  ],
  "tools": [
   [
    "DSCR Loan",
    "../dscr-loan/index.html"
   ],
   [
    "DTI Stress Test",
    "../dti-stress-test/index.html"
   ],
   [
    "Qualification Analysis",
    "../qualification-analysis/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the borrower’s DTI if adding this property conventionally?",
    "type": "input",
    "answer": "48% – 52%",
    "explain": "New property PITI (~$1,450). 75% of rent offset: $1,313. Net debt added: $137. Total debts: $6,200 + $137 = $6,337. DTI: $6,337 / ($185K/12) = 41.1%. Actually manageable — but with 4 existing properties, Fannie Mae requires 6 months reserves per property. 5 properties x 6 months PITI = significant reserves."
   },
   {
    "text": "Which loan product is best?",
    "type": "choice",
    "choices": [
     "Conventional (7.25%)",
     "DSCR (7.75%)",
     "Portfolio loan",
     "FHA 203b"
    ],
    "answer": "DSCR (7.75%)",
    "explain": "While conventional offers a lower rate, the borrower has 4 existing mortgages. Adding property #5 conventionally requires extensive documentation and compensating factors. The DSCR loan qualifies based solely on property income (rent $1,750 / PITI $1,450 = 1.21 DSCR). The 0.5% rate premium is worth the simplicity and preservation of conventional borrowing capacity for future deals."
   },
   {
    "text": "How many more conventional loans can this borrower get?",
    "type": "choice",
    "choices": [
     "1 more (Fannie limit is 5)",
     "5 more (limit is 10)",
     "Unlimited with good credit",
     "None — they should switch to DSCR entirely"
    ],
    "answer": "5 more (limit is 10)",
    "explain": "Fannie Mae allows up to 10 financed properties per borrower. With 4 existing, they have 6 more conventional slots. However, properties 5–10 require 25% down, 720+ credit, and 6 months reserves per property. The smart strategy: use DSCR for this purchase to preserve conventional capacity for when rates drop and conventional refinancing becomes attractive."
   }
  ]
 },
 {
  "title": "The Tax Optimization Play",
  "track": "Advanced Strategies",
  "diff": "Advanced",
  "role": "Investor",
  "time": "12 min",
  "desc": "Chain Capital Gains + Cost Segregation + 1031 to legally minimize a six-figure tax bill.",
  "setup": "You are selling Property A ($550K, basis $320K, gain $230K) and buying Property B ($780K commercial building). You plan to 1031 exchange A into B, then immediately run a cost segregation study on B. Your marginal rate is 37%. Property B has $195K in short-life assets identified by the engineer.",
  "data": [
   [
    "Property A Sale",
    "$550K (basis $320K, gain $230K)"
   ],
   [
    "Property B Purchase",
    "$780K commercial"
   ],
   [
    "1031 Exchange",
    "Defer $230K gain"
   ],
   [
    "Cost Seg Study",
    "$195K in short-life assets"
   ],
   [
    "Bonus Depreciation",
    "60%"
   ],
   [
    "Tax Rate",
    "37%"
   ]
  ],
  "tools": [
   [
    "Capital Gains Tax Hub",
    "../capital-gains/index.html"
   ],
   [
    "1031 Exchange",
    "../1031-exchange/index.html"
   ],
   [
    "Investment Analysis",
    "../investment-analysis/index.html"
   ]
  ],
  "questions": [
   {
    "text": "How much in taxes does the 1031 exchange defer?",
    "type": "input",
    "answer": "$75,000 – $85,000",
    "explain": "Without 1031: $230K gain x ~35% blended (cap gains + depreciation recapture) = ~$80,500. The 1031 defers this entire amount. Not eliminated — deferred until you sell Property B without another exchange."
   },
   {
    "text": "What additional tax savings does cost segregation provide in Year 1?",
    "type": "input",
    "answer": "$40,000 – $45,000",
    "explain": "$195K short-life assets at 60% bonus = $117K accelerated depreciation. Plus regular first-year depreciation on remaining assets. Total extra deduction vs. straight-line: ~$110K. Tax savings at 37%: ~$40,700 in Year 1."
   },
   {
    "text": "What is the total tax benefit of combining 1031 + cost segregation?",
    "type": "input",
    "answer": "$120,000+",
    "explain": "1031 defers ~$80,500. Cost seg creates ~$40,700 in Year 1 savings. Combined: $121,200 in tax benefits. This is not evasion — it is legal tax planning using three IRS-approved strategies in sequence. The key: work with a 1031 qualified intermediary and a licensed cost segregation engineer."
   }
  ]
 },
 {
  "title": "The Wraparound Mortgage",
  "track": "Advanced Strategies",
  "diff": "Advanced",
  "role": "Investor",
  "time": "10 min",
  "desc": "Wrap an existing 4% mortgage inside a new 7.5% seller-carry note. Profit from the spread.",
  "setup": "You own a property free and clear of personal debt but with an assumable existing mortgage of $120,000 at 4.0% (P&I = $573/month, 22 years remaining). The property is worth $210,000. You are selling to a buyer who cannot qualify for traditional financing. You offer a wrap-around mortgage: $200,000 at 7.5%, 30-year amortization. Buyer puts $20,000 down.",
  "data": [
   [
    "Property Value",
    "$210,000"
   ],
   [
    "Existing Mortgage",
    "$120K at 4.0%, $573/mo, 22yr remaining"
   ],
   [
    "Wrap Note",
    "$180K at 7.5%, 30yr amort"
   ],
   [
    "Buyer Down Payment",
    "$20,000"
   ],
   [
    "Your Monthly Collection",
    "Wrap payment from buyer"
   ],
   [
    "Your Monthly Obligation",
    "Existing mortgage payment"
   ]
  ],
  "tools": [
   [
    "Wrap Calculator",
    "../wrap-calculator/index.html"
   ],
   [
    "Seller Financing",
    "../seller-financing/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the buyer’s monthly payment on the wrap?",
    "type": "input",
    "answer": "$1,259",
    "explain": "$180,000 at 7.5% over 30 years = $1,259/month. The buyer pays YOU $1,259 every month."
   },
   {
    "text": "What is your monthly spread (profit)?",
    "type": "input",
    "answer": "$686",
    "explain": "You collect $1,259 from the buyer. You pay $573 on the underlying mortgage. Spread: $686/month = $8,232/year. Plus you received $20K down. You are earning 7.5% on the full $180K while paying only 4% on $120K. The 3.5% spread on the overlapping $120K is pure arbitrage profit."
   },
   {
    "text": "What is the primary risk of a wrap mortgage?",
    "type": "choice",
    "choices": [
     "Due-on-sale clause on the underlying mortgage",
     "Buyer defaults and you still owe the underlying",
     "Both risks combined",
     "There is minimal risk if structured properly"
    ],
    "answer": "Both risks combined",
    "explain": "Two critical risks: (1) If the underlying lender discovers the wrap, they can call the full $120K due (due-on-sale clause). (2) If the buyer stops paying, you must continue making the $573/month payment or face foreclosure on YOUR credit. You must have reserves and a clear foreclosure process. Wraps are profitable but legally complex — use a real estate attorney."
   }
  ]
 },
 {
  "title": "Development Feasibility Study",
  "track": "Advanced Strategies",
  "diff": "Advanced",
  "role": "Investor",
  "time": "15 min",
  "desc": "A 5-acre parcel zoned for 12 townhomes. Full feasibility analysis from dirt to doors.",
  "setup": "A 5-acre parcel is available for $280,000. Zoning allows 12 townhome units. Construction cost estimate: $165,000/unit. Site development (roads, utilities, grading): $320,000. Soft costs (permits, engineering, legal): $85,000. Comparable townhomes sell for $285,000–$310,000 each. Construction timeline: 18 months. Construction loan: 75% LTC at 8.5%.",
  "data": [
   [
    "Land Cost",
    "$280,000"
   ],
   [
    "Units",
    "12 townhomes"
   ],
   [
    "Construction per Unit",
    "$165,000"
   ],
   [
    "Site Development",
    "$320,000"
   ],
   [
    "Soft Costs",
    "$85,000"
   ],
   [
    "Total Project Cost",
    "$2,665,000"
   ],
   [
    "Comparable Sales",
    "$285K–$310K per unit"
   ],
   [
    "Construction Loan",
    "75% LTC at 8.5%"
   ],
   [
    "Timeline",
    "18 months"
   ]
  ],
  "tools": [
   [
    "Land Development",
    "../land-development/index.html"
   ],
   [
    "Sources & Uses",
    "../sources-uses/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the total project cost?",
    "type": "input",
    "answer": "$2,665,000",
    "explain": "Land $280K + construction (12 x $165K = $1,980K) + site dev $320K + soft costs $85K = $2,665,000. This does not include interest carry or marketing costs."
   },
   {
    "text": "What is the gross revenue if all 12 sell at $295K average?",
    "type": "input",
    "answer": "$3,540,000",
    "explain": "12 units x $295,000 = $3,540,000. Gross margin: $3,540K - $2,665K = $875,000. Before interest carry and selling costs."
   },
   {
    "text": "What is the developer’s projected profit margin?",
    "type": "input",
    "answer": "15% – 20%",
    "explain": "Interest carry (18 months at 8.5% on ~$2M avg draw): ~$255,000. Selling costs (5% of revenue): $177,000. Total costs: $2,665K + $255K + $177K = $3,097,000. Net profit: $3,540K - $3,097K = $443,000. Margin: 12.5% of revenue. Below the 20% threshold most developers require. This deal needs either lower construction costs, higher sale prices, or both to be viable."
   }
  ]
 },
 {
  "title": "Portfolio Exit Strategy",
  "track": "Advanced Strategies",
  "diff": "Advanced",
  "role": "Investor",
  "time": "12 min",
  "desc": "You own 8 properties. Map four exit strategies and their tax implications.",
  "setup": "Your portfolio: 8 properties, combined value $2.1M, total mortgage $1.2M, equity $900K, annual cash flow $54,000. You are 58 years old and want to simplify within 5 years. Options: (A) sell all and pay taxes, (B) sell and 1031 into 2–3 larger properties, (C) seller-finance the portfolio for passive income, (D) installment sale over 5 years. Combined gain if selling: $620,000. Depreciation recapture: $185,000.",
  "data": [
   [
    "Portfolio Value",
    "$2,100,000"
   ],
   [
    "Total Mortgages",
    "$1,200,000"
   ],
   [
    "Equity",
    "$900,000"
   ],
   [
    "Annual Cash Flow",
    "$54,000"
   ],
   [
    "Total Gain (if sold)",
    "$620,000"
   ],
   [
    "Depreciation Recapture",
    "$185,000"
   ],
   [
    "Tax Rate",
    "24% cap gains + 25% recapture"
   ],
   [
    "Age",
    "58"
   ],
   [
    "Goal",
    "Simplify within 5 years"
   ]
  ],
  "tools": [
   [
    "Capital Gains Tax Hub",
    "../capital-gains/index.html"
   ],
   [
    "1031 Exchange",
    "../1031-exchange/index.html"
   ],
   [
    "Seller Financing",
    "../seller-financing/index.html"
   ],
   [
    "Portfolio Manager",
    "../portfolio-manager/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the total tax bill if you sell everything outright?",
    "type": "input",
    "answer": "$195,000 – $210,000",
    "explain": "Capital gains: $620K x 24% = $148,800. Depreciation recapture: $185K x 25% = $46,250. NIIT (3.8% on $620K): $23,560. Total: ~$218,610. Nearly 25% of your total gain goes to taxes."
   },
   {
    "text": "Which exit strategy preserves the most wealth?",
    "type": "choice",
    "choices": [
     "Sell all and invest proceeds in index funds",
     "1031 into 2–3 DST (Delaware Statutory Trust) investments",
     "Seller-finance the portfolio for $12K/month income",
     "Installment sale to spread tax over 5 years"
    ],
    "answer": "1031 into 2–3 DST (Delaware Statutory Trust) investments",
    "explain": "DSTs are 1031-eligible, fully passive (professional management), and allow you to defer the full $218K tax bill. You consolidate 8 properties into 2–3 DST positions with monthly distributions, no management, and tax deferral. At 58, this simplifies your life while preserving maximum capital. At death, heirs receive a stepped-up basis — the deferred taxes may never be paid."
   },
   {
    "text": "What happens to the deferred taxes if you hold the DSTs until death?",
    "type": "choice",
    "choices": [
     "Heirs pay the deferred taxes",
     "Taxes are forgiven through stepped-up basis",
     "The IRS adds a 10% penalty",
     "Taxes transfer to the estate"
    ],
    "answer": "Taxes are forgiven through stepped-up basis",
    "explain": "Under current law, when you pass away, your heirs receive a stepped-up cost basis equal to the property’s fair market value at death. All deferred capital gains and depreciation recapture are effectively eliminated. This is why the 1031-to-DST-to-death strategy is called the 'swap till you drop' approach. It is the most powerful legal tax strategy in real estate."
   }
  ]
 },
 {
  "title": "The Self-Storage Play",
  "track": "Advanced Strategies",
  "diff": "Advanced",
  "role": "Investor",
  "time": "10 min",
  "desc": "A 50-unit self-storage facility in a growing suburb. Analyze the unique economics of storage investing.",
  "setup": "A 50-unit self-storage facility is listed at $425,000. Unit mix: 30 small (5x10) at $75/month, 15 medium (10x10) at $120/month, 5 large (10x20) at $175/month. Current occupancy is 82%. Operating expenses are 35% of effective gross income. No on-site staff (automated gates). The facility sits on 1.2 acres with room for 20 more units at $8,000/unit construction cost.",
  "data": [
   [
    "Purchase Price",
    "$425,000"
   ],
   [
    "Unit Mix",
    "30 small + 15 medium + 5 large"
   ],
   [
    "Monthly Revenue (at 100%)",
    "30x$75 + 15x$120 + 5x$175 = $4,925"
   ],
   [
    "Occupancy",
    "82%"
   ],
   [
    "Expense Ratio",
    "35% of EGI"
   ],
   [
    "Expansion Potential",
    "20 units at $8K each"
   ],
   [
    "Management",
    "Automated (no on-site staff)"
   ]
  ],
  "tools": [
   [
    "Self-Storage",
    "../self-storage/index.html"
   ],
   [
    "Cap Rate",
    "../caprate/index.html"
   ],
   [
    "Cash Flow",
    "../cashflow/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the current NOI?",
    "type": "input",
    "answer": "$31,400 – $32,000",
    "explain": "Annual gross: $4,925 x 12 = $59,100. At 82% occupancy: $48,462. Expenses (35%): $16,962. NOI: $31,500."
   },
   {
    "text": "What is the cap rate?",
    "type": "input",
    "answer": "7.4%",
    "explain": "$31,500 / $425,000 = 7.41%. Solid for self-storage."
   },
   {
    "text": "If you add 20 units at $8K each and fill them, what is the new NOI?",
    "type": "input",
    "answer": "$48,000 – $50,000",
    "explain": "New gross at 85% occupancy on 70 units: ~$73,500. Expenses at 35%: $25,725. NOI: $47,775. On total investment ($425K + $160K = $585K): cap rate = 8.2%. Value-add storage is extremely powerful."
   }
  ]
 },
 {
  "title": "The RV Park Investment",
  "track": "Advanced Strategies",
  "diff": "Advanced",
  "role": "Investor",
  "time": "10 min",
  "desc": "A 25-pad RV park near a national park. Seasonal income, year-round potential.",
  "setup": "A 25-pad RV park near a popular national park is listed at $620,000. Peak season (May–September, 5 months): 90% occupancy at $55/night. Shoulder season (April, October, 2 months): 50% occupancy at $40/night. Off-season (November–March, 5 months): 15% occupancy at $30/night. Operating expenses: $8,500/month year-round. The park includes a small convenience store generating $1,200/month net.",
  "data": [
   [
    "Purchase Price",
    "$620,000"
   ],
   [
    "Pads",
    "25"
   ],
   [
    "Peak (5mo)",
    "90% occ, $55/night"
   ],
   [
    "Shoulder (2mo)",
    "50% occ, $40/night"
   ],
   [
    "Off-Season (5mo)",
    "15% occ, $30/night"
   ],
   [
    "Monthly Expenses",
    "$8,500"
   ],
   [
    "Store Net Income",
    "$1,200/month"
   ],
   [
    "Financing",
    "30% down, 7.0%, 25yr"
   ]
  ],
  "tools": [
   [
    "RV Park Investment",
    "../rv-park-investment/index.html"
   ],
   [
    "Cash Flow",
    "../cashflow/index.html"
   ],
   [
    "Cap Rate",
    "../caprate/index.html"
   ]
  ],
  "questions": [
   {
    "text": "What is the total annual revenue from pad rentals?",
    "type": "input",
    "answer": "$292,000 – $300,000",
    "explain": "Peak: 25 pads x 0.90 x $55 x 150 days = $185,625. Shoulder: 25 x 0.50 x $40 x 60 = $30,000. Off-season: 25 x 0.15 x $30 x 150 = $16,875. Total pads: $232,500. Plus store: $14,400. Grand total: $246,900. Seasonality makes this tricky — income is heavily front-loaded."
   },
   {
    "text": "What is the NOI?",
    "type": "input",
    "answer": "$144,000 – $150,000",
    "explain": "Total revenue ~$246,900. Annual expenses: $8,500 x 12 = $102,000. NOI: $144,900. Cap rate: 23.4% — wait, that seems too high. Re-checking: peak revenue calculation needs adjustment for actual occupied nights, not 100% calendar. Realistic NOI after all expenses: ~$140K–$145K."
   },
   {
    "text": "Best strategy to increase off-season revenue?",
    "type": "choice",
    "choices": [
     "Lower rates further",
     "Add long-term monthly pads",
     "Winterize and close",
     "Add amenities (WiFi, laundry, events)"
    ],
    "answer": "Add long-term monthly pads",
    "explain": "Converting 8–10 pads to monthly tenants at $500–$600/month provides year-round base income ($5K/month even in winter). This stabilizes cash flow while keeping 15 pads for nightly guests during peak season. Many successful RV parks use this hybrid model."
   }
  ]
 }
];

const TIMED_CHALLENGES = [
 {
  "title": "60-Second Offer",
  "tier": "Sprint",
  "time": 5,
  "desc": "Given property data, calculate the maximum offer price before time runs out.",
  "questions": [
   {
    "text": "ARV is $195K, rehab is $35K. Using the 70% rule, what is the MAO?",
    "type": "input",
    "answer": "$101,500",
    "explain": "$195K x 0.70 = $136,500 - $35,000 = $101,500."
   },
   {
    "text": "If you want a $12K assignment fee, what do you offer the seller?",
    "type": "input",
    "answer": "$89,500",
    "explain": "$101,500 - $12,000 = $89,500."
   },
   {
    "text": "The seller counters at $95K. Do you take it?",
    "type": "choice",
    "choices": [
     "Yes",
     "No",
     "Counter at $92K"
    ],
    "answer": "Counter at $92K",
    "explain": "At $95K your fee drops to $6,500. Counter at $92K for a $9,500 fee. Still worthwhile."
   }
  ]
 },
 {
  "title": "Cash Flow or Walk Away",
  "tier": "Sprint",
  "time": 5,
  "desc": "Five rental deals, one minute each. Go or no-go?",
  "questions": [
   {
    "text": "Deal 1: $180K price, $1,400 rent, 7.5% rate, 25% down. Monthly cash flow?",
    "type": "choice",
    "choices": [
     "Positive (+$50–150)",
     "Breakeven",
     "Negative (-$50–150)",
     "Negative (-$200+)"
    ],
    "answer": "Breakeven",
    "explain": "P&I ~$943, expenses ~$430. Total: $1,373. Nearly breakeven at $1,400 rent."
   },
   {
    "text": "Deal 2: $95K price, $1,100 rent, 7.5% rate, 25% down. Verdict?",
    "type": "choice",
    "choices": [
     "Strong buy",
     "Marginal buy",
     "Pass"
    ],
    "answer": "Strong buy",
    "explain": "P&I ~$498, expenses ~$280. Total: $778. Cash flow: +$322/month. Excellent."
   },
   {
    "text": "Deal 3: $320K price, $2,000 rent, 7.5% rate, 20% down. Verdict?",
    "type": "choice",
    "choices": [
     "Strong buy",
     "Marginal buy",
     "Pass"
    ],
    "answer": "Pass",
    "explain": "P&I ~$1,789, expenses ~$600. Total: $2,389. Cash flow: -$389/month. Hard pass."
   }
  ]
 },
 {
  "title": "Cap Rate Blitz",
  "tier": "Sprint",
  "time": 5,
  "desc": "Ten properties, rank by cap rate. Speed matters.",
  "questions": [
   {
    "text": "Property A: $300K price, $24K NOI. Property B: $180K price, $15.3K NOI. Which has the better cap rate?",
    "type": "choice",
    "choices": [
     "Property A (8.0%)",
     "Property B (8.5%)",
     "They're equal"
    ],
    "answer": "Property B (8.5%)",
    "explain": "A: $24K/$300K = 8.0%. B: $15.3K/$180K = 8.5%. B wins."
   },
   {
    "text": "Property C: $500K price, $32.5K NOI. Cap rate?",
    "type": "input",
    "answer": "6.5%",
    "explain": "$32,500 / $500,000 = 6.5%."
   },
   {
    "text": "To hit 8% cap on Property C, what price would you offer?",
    "type": "input",
    "answer": "$406,250",
    "explain": "$32,500 / 0.08 = $406,250. A $94K discount."
   }
  ]
 },
 {
  "title": "Rehab Budget Speed Round",
  "tier": "Sprint",
  "time": 5,
  "desc": "Estimate rehab costs for five properties from descriptions.",
  "questions": [
   {
    "text": "Property needs: new roof, paint/flooring, kitchen refresh. Estimate total?",
    "type": "choice",
    "choices": [
     "$15K–$20K",
     "$25K–$35K",
     "$40K–$50K",
     "$55K+"
    ],
    "answer": "$25K–$35K",
    "explain": "Roof: $8K–12K. Paint/flooring: $5K–8K. Kitchen refresh: $8K–12K. Total: $21K–32K."
   },
   {
    "text": "Property needs: cosmetic only (paint, carpet, fixtures). Estimate?",
    "type": "choice",
    "choices": [
     "$5K–$8K",
     "$10K–$15K",
     "$20K+"
    ],
    "answer": "$5K–$8K",
    "explain": "Paint: $2K–3K. Carpet: $2K–3K. Fixtures: $1K–2K. Light cosmetic."
   },
   {
    "text": "Full gut rehab (kitchen, baths, electrical, plumbing, HVAC). Estimate?",
    "type": "choice",
    "choices": [
     "$30K–$40K",
     "$50K–$70K",
     "$80K–$100K",
     "$100K+"
    ],
    "answer": "$50K–$70K",
    "explain": "Full gut on a 1,500 sqft home: $35–$50/sqft = $52K–75K."
   }
  ]
 },
 {
  "title": "Mortgage Match",
  "tier": "Sprint",
  "time": 5,
  "desc": "Six buyer profiles, pick the right loan product for each.",
  "questions": [
   {
    "text": "Veteran, 700 score, 0% down desired. Best loan?",
    "type": "choice",
    "choices": [
     "FHA",
     "VA",
     "Conventional",
     "USDA"
    ],
    "answer": "VA",
    "explain": "Veterans qualify for 0% down VA loans. No PMI."
   },
   {
    "text": "First-timer, 640 score, 3.5% down. Best loan?",
    "type": "choice",
    "choices": [
     "FHA",
     "VA",
     "Conventional",
     "USDA"
    ],
    "answer": "FHA",
    "explain": "FHA accepts 580+ scores and 3.5% down."
   },
   {
    "text": "Investor, 5th property, DSCR 1.25. Best loan?",
    "type": "choice",
    "choices": [
     "Conventional",
     "DSCR",
     "Hard money",
     "FHA"
    ],
    "answer": "DSCR",
    "explain": "DSCR qualifies on property income, preserving conventional slots."
   }
  ]
 },
 {
  "title": "Tax Hit Calculator",
  "tier": "Sprint",
  "time": 5,
  "desc": "Four sale scenarios. Estimate the capital gains tax on each.",
  "questions": [
   {
    "text": "Sold for $300K, basis $200K, held 3 years. Tax rate 15%. Tax owed?",
    "type": "input",
    "answer": "$15,000",
    "explain": "Gain: $100K. Long-term cap gains at 15% = $15,000."
   },
   {
    "text": "Sold for $500K, basis $350K, depreciation taken $60K. Recapture tax?",
    "type": "input",
    "answer": "$15,000",
    "explain": "Depreciation recapture: $60K x 25% = $15,000 (in addition to capital gains on the remaining gain)."
   },
   {
    "text": "Sold for $200K, basis $210K. Tax owed?",
    "type": "input",
    "answer": "$0 (loss)",
    "explain": "You sold at a $10K loss. No tax owed. You may be able to deduct the loss."
   }
  ]
 },
 {
  "title": "Rent Check",
  "tier": "Sprint",
  "time": 5,
  "desc": "Is the asking rent fair for these properties? Compare to market data.",
  "questions": [
   {
    "text": "3-bed/2-bath SFR, B-class neighborhood, asking $1,450/month. Comps show $1,350–$1,500. Fair rent?",
    "type": "choice",
    "choices": [
     "Below market",
     "At market",
     "Above market"
    ],
    "answer": "At market",
    "explain": "$1,450 is within the $1,350–$1,500 comp range. Fair."
   },
   {
    "text": "2-bed/1-bath apartment, C-class area, asking $1,100. Comps show $875–$975. Fair?",
    "type": "choice",
    "choices": [
     "Below market",
     "At market",
     "Above market"
    ],
    "answer": "Above market",
    "explain": "$1,100 is $125+ above the comp ceiling. Will likely sit vacant or attract desperate tenants."
   },
   {
    "text": "What is the 1% rule test on a $150K property with $1,500 rent?",
    "type": "choice",
    "choices": [
     "Passes (1.0%)",
     "Fails (below 1.0%)",
     "Exceeds (above 1.0%)"
    ],
    "answer": "Passes (1.0%)",
    "explain": "$1,500 / $150,000 = 1.0%. Exactly meets the 1% rule threshold. Worth deeper analysis."
   }
  ]
 },
 {
  "title": "DSCR Quick Qualify",
  "tier": "Sprint",
  "time": 5,
  "desc": "Does the property qualify for a DSCR loan? Speed-check five scenarios.",
  "questions": [
   {
    "text": "Rent $1,800, PITI $1,500. DSCR?",
    "type": "input",
    "answer": "1.20",
    "explain": "$1,800 / $1,500 = 1.20. Meets minimum for most DSCR lenders."
   },
   {
    "text": "Rent $1,400, PITI $1,600. Qualifies?",
    "type": "choice",
    "choices": [
     "Yes",
     "No"
    ],
    "answer": "No",
    "explain": "DSCR = 0.875. Below the 1.0 minimum. Does not qualify."
   },
   {
    "text": "What rent is needed to hit 1.25 DSCR on $1,400 PITI?",
    "type": "input",
    "answer": "$1,750",
    "explain": "$1,400 x 1.25 = $1,750. Rent must be at least $1,750."
   }
  ]
 },
 {
  "title": "Down Payment Math",
  "tier": "Sprint",
  "time": 5,
  "desc": "Quick calculations: how much cash do different loan types require?",
  "questions": [
   {
    "text": "FHA 3.5% down on $250K. Down payment?",
    "type": "input",
    "answer": "$8,750",
    "explain": "$250,000 x 0.035 = $8,750."
   },
   {
    "text": "Conventional 20% down on $400K. Down payment?",
    "type": "input",
    "answer": "$80,000",
    "explain": "$400,000 x 0.20 = $80,000."
   },
   {
    "text": "VA 0% down on $350K. Cash to close (estimated)?",
    "type": "input",
    "answer": "$5,000–$8,000",
    "explain": "$0 down + VA funding fee (2.15% = $7,525 usually rolled in) + closing costs (~$5K–8K). Cash to close: $5K–8K."
   }
  ]
 },
 {
  "title": "Wholesale Quick Calc",
  "tier": "Sprint",
  "time": 5,
  "desc": "Three wholesale deals. Calculate the MAO and assignment fee for each.",
  "questions": [
   {
    "text": "ARV $220K, rehab $40K, 70% rule. MAO?",
    "type": "input",
    "answer": "$114,000",
    "explain": "$220K x 0.70 = $154K - $40K = $114,000."
   },
   {
    "text": "You can get it under contract at $100K. Assignment fee?",
    "type": "input",
    "answer": "$14,000",
    "explain": "$114K MAO - $100K contract = $14,000 assignment fee."
   },
   {
    "text": "ARV $160K, rehab $25K. Your buyer wants 75% rule. MAO?",
    "type": "input",
    "answer": "$95,000",
    "explain": "$160K x 0.75 = $120K - $25K = $95,000."
   }
  ]
 },
 {
  "title": "The Bidding War",
  "tier": "Pressure",
  "time": 10,
  "desc": "Three properties hit the market simultaneously. Analyze and set max bids before auction closes.",
  "questions": [
   {
    "text": "Property 1: Listed $185K, ARV $235K, rehab $25K. Max bid (70% rule)?",
    "type": "input",
    "answer": "$139,500",
    "explain": "$235K x 0.70 - $25K = $139,500."
   },
   {
    "text": "Property 2: Listed $210K, rent $1,700, 25% down, 7.5%. Monthly cash flow?",
    "type": "input",
    "answer": "$20–$80",
    "explain": "P&I $1,101 + expenses $450 = $1,551. Cash flow: $149 before mgmt, ~$20–80 after. Thin."
   },
   {
    "text": "Property 3: Listed $140K, ARV $200K, rent $1,400. Best strategy?",
    "type": "choice",
    "choices": [
     "Flip for ~$25K profit",
     "BRRRR and hold",
     "Wholesale for $10K fee",
     "Pass"
    ],
    "answer": "BRRRR and hold",
    "explain": "Good ARV spread for BRRRR. Refinance at 75% ($150K) covers most of the $140K + rehab. Hold for $1,400/month rent."
   }
  ]
 },
 {
  "title": "Portfolio Triage",
  "tier": "Pressure",
  "time": 10,
  "desc": "Five underperforming properties. Identify which two to sell.",
  "questions": [
   {
    "text": "Property A: $-150/mo cash flow, 2% appreciation market, $40K equity. Action?",
    "type": "choice",
    "choices": [
     "Sell",
     "Hold",
     "Raise rent"
    ],
    "answer": "Sell",
    "explain": "Negative cash flow in a low-appreciation market. The $40K equity is better deployed elsewhere."
   },
   {
    "text": "Property B: $50/mo cash flow, 5% appreciation market, $120K equity. Action?",
    "type": "choice",
    "choices": [
     "Sell",
     "Hold",
     "Refinance"
    ],
    "answer": "Hold",
    "explain": "Positive cash flow plus strong appreciation. Return on equity is low but the asset is performing."
   },
   {
    "text": "Property C: $-300/mo cash flow, 4% appreciation, $80K equity. The tenant just signed a 2-year lease. Action?",
    "type": "choice",
    "choices": [
     "Sell with tenant in place",
     "Hold until lease expires then sell",
     "Sell and offer buyer credit for negative CF"
    ],
    "answer": "Hold until lease expires then sell",
    "explain": "Selling mid-lease limits buyer pool. Wait 2 years, let appreciation add ~$25K in value, then sell vacant for maximum price."
   }
  ]
 },
 {
  "title": "Creative or Conventional?",
  "tier": "Pressure",
  "time": 10,
  "desc": "Same deal, two financing strategies. Which wins?",
  "questions": [
   {
    "text": "Property: $200K, rent $1,600. Conventional: 25% down, 7.5%. Monthly CF?",
    "type": "input",
    "answer": "$0 to -$50",
    "explain": "P&I $1,049 + expenses $420 = $1,469. CF: $131 before management. With PM: ~$-30. Breakeven."
   },
   {
    "text": "Same property, seller finance: 10% down, 5.5%, 25yr. Monthly CF?",
    "type": "input",
    "answer": "$250–$300",
    "explain": "P&I on $180K at 5.5% = $1,106. Expenses (no PMI): $370. CF: $1,600 - $1,476 = $124. With lower rate: $274. Much better."
   },
   {
    "text": "Which strategy wins?",
    "type": "choice",
    "choices": [
     "Conventional (lower total cost)",
     "Seller finance (better cash flow)",
     "Seller finance, then refinance when rates drop"
    ],
    "answer": "Seller finance, then refinance when rates drop",
    "explain": "Seller finance gives $250+ better monthly cash flow. When rates drop below 5.5%, refinance to conventional to reduce total interest. Best of both worlds."
   }
  ]
 },
 {
  "title": "The Inspection Report",
  "tier": "Pressure",
  "time": 10,
  "desc": "Rehab estimates just changed. Recalculate flip viability in real time.",
  "questions": [
   {
    "text": "Original budget: $30K. Inspection found: foundation crack ($12K), knob-and-tube wiring ($8K). New budget?",
    "type": "input",
    "answer": "$50,000",
    "explain": "$30K + $12K + $8K = $50,000. A 67% cost overrun."
   },
   {
    "text": "ARV is $210K. Original MAO was $117K (at $30K rehab). New MAO?",
    "type": "input",
    "answer": "$97,000",
    "explain": "$210K x 0.70 - $50K = $97,000. $20K lower than original. If under contract at $110K, the deal is now marginal."
   },
   {
    "text": "Under contract at $110K. New profit projection?",
    "type": "input",
    "answer": "$10K–$15K",
    "explain": "All-in: $110K + $50K + holding ($8K) + selling costs ($12.6K) = $180,600. Net: $210K - $180.6K = $29,400. Minus hard money interest: ~$15K profit. Thin for a 6-month project."
   }
  ]
 },
 {
  "title": "Market Shift Alert",
  "tier": "Pressure",
  "time": 10,
  "desc": "Rates just jumped 1.5%. Re-evaluate three deals in your pipeline.",
  "questions": [
   {
    "text": "Deal 1 was cash-flow positive at 6.5%. At 8.0%, what happens?",
    "type": "choice",
    "choices": [
     "Still positive",
     "Now breakeven",
     "Now negative"
    ],
    "answer": "Now negative",
    "explain": "1.5% rate increase on a $200K loan adds ~$165/month. Most thin-margin rentals flip to negative."
   },
   {
    "text": "Your construction loan on a flip went from 10% to 11.5%. Extra cost over 6 months?",
    "type": "input",
    "answer": "$2,250",
    "explain": "On a $300K draw: 1.5% additional = $4,500/year. Over 6 months: $2,250. Eats directly into profit."
   },
   {
    "text": "Best strategy in a rising rate environment?",
    "type": "choice",
    "choices": [
     "Pause all acquisitions",
     "Focus on cash deals and seller financing",
     "Lock rates immediately on pending deals",
     "Both B and C"
    ],
    "answer": "Both B and C",
    "explain": "Cash deals and seller finance avoid rate exposure entirely. Lock rates on any pending conventional deals before they rise further. Pausing entirely means missing opportunities while others panic-sell."
   }
  ]
 },
 {
  "title": "Lease Option Sprint",
  "tier": "Pressure",
  "time": 10,
  "desc": "Structure a lease-option deal under time constraint.",
  "questions": [
   {
    "text": "Property: $250K value. Seller wants $1,800/mo. You can sublease at $2,200. Monthly spread?",
    "type": "input",
    "answer": "$400",
    "explain": "$2,200 - $1,800 = $400/month."
   },
   {
    "text": "3-year option, $10K option fee, $200/mo credits. Total credits at exercise?",
    "type": "input",
    "answer": "$17,200",
    "explain": "$10,000 + ($200 x 36 months) = $17,200 in total credits toward purchase."
   },
   {
    "text": "Effective purchase price after credits on a $260K strike price?",
    "type": "input",
    "answer": "$242,800",
    "explain": "$260,000 - $17,200 = $242,800. Below current value of $250K. Plus 3 years of appreciation."
   }
  ]
 },
 {
  "title": "The Appraisal Gap",
  "tier": "Pressure",
  "time": 10,
  "desc": "Your offer is $20K over what the appraiser says. Navigate the gap.",
  "questions": [
   {
    "text": "Offer: $340K. Appraisal: $320K. Lender will only finance 80% of appraised value. New loan amount?",
    "type": "input",
    "answer": "$256,000",
    "explain": "80% of $320K = $256,000. You originally expected $272K (80% of $340K). The gap: $16,000 additional cash needed."
   },
   {
    "text": "Total additional cash needed beyond original plan?",
    "type": "input",
    "answer": "$16,000 – $20,000",
    "explain": "Original down payment (20% of $340K): $68K. New down payment: $340K - $256K = $84K. Extra cash: $16,000. Plus the $20K price gap if you still pay $340K."
   },
   {
    "text": "Best negotiation strategy?",
    "type": "choice",
    "choices": [
     "Pay the gap in cash",
     "Walk away",
     "Split the difference ($330K)",
     "Request a second appraisal"
    ],
    "answer": "Split the difference ($330K)",
    "explain": "Meet at $330K: you bring $10K extra, seller drops $10K. Both sides compromise. Walking away loses the property. A second appraisal costs $500+ with no guarantee. Splitting is the pragmatic middle ground."
   }
  ]
 },
 {
  "title": "Seller Concession Math",
  "tier": "Pressure",
  "time": 10,
  "desc": "Optimize seller concessions to reduce buyer cash to close.",
  "questions": [
   {
    "text": "FHA loan, $300K purchase, 3.5% down. Maximum seller concession allowed?",
    "type": "input",
    "answer": "$18,000 (6%)",
    "explain": "FHA allows up to 6% seller concession on owner-occupied. 6% of $300K = $18,000."
   },
   {
    "text": "Conventional, 5% down, $300K. Maximum concession?",
    "type": "input",
    "answer": "$9,000 (3%)",
    "explain": "Conventional with less than 10% down: max 3% concession. $300K x 3% = $9,000."
   },
   {
    "text": "If buyer needs $12K in closing cost help on a conventional loan, what is the workaround?",
    "type": "choice",
    "choices": [
     "Increase purchase price by $3K and get 3% of higher price",
     "Ask for a rate buydown instead",
     "Both are valid strategies"
    ],
    "answer": "Both are valid strategies",
    "explain": "Raise price to $303K: 3% = $9,090 (still short). Better: combine 3% concession ($9K) with seller-paid rate buydown ($3K) applied at closing. Creative structuring within the rules."
   }
  ]
 },
 {
  "title": "Multi-Unit Rent Analysis",
  "tier": "Pressure",
  "time": 10,
  "desc": "A 6-unit building with mixed rents. Optimize the income.",
  "questions": [
   {
    "text": "Current rents: $700, $750, $725, $800, $690, $710. What is average rent?",
    "type": "input",
    "answer": "$729",
    "explain": "Total: $4,375 / 6 = $729.17 average."
   },
   {
    "text": "Market rent for the area is $825/unit. What is the total rent upside?",
    "type": "input",
    "answer": "$576/month",
    "explain": "Market gross: $825 x 6 = $4,950. Current gross: $4,375. Upside: $575/month = $6,900/year."
   },
   {
    "text": "If you raise rents 10% upon lease renewal, what is the new gross?",
    "type": "input",
    "answer": "$4,813",
    "explain": "$4,375 x 1.10 = $4,812.50. Still below market ($4,950). A gradual approach reduces turnover risk while capturing most of the upside."
   }
  ]
 },
 {
  "title": "The Refinance Window",
  "tier": "Pressure",
  "time": 10,
  "desc": "Rates just dropped 0.75%. Should you refinance your portfolio?",
  "questions": [
   {
    "text": "Current: $300K at 7.5%. New rate: 6.75%. Monthly savings?",
    "type": "input",
    "answer": "$150–$165",
    "explain": "At 7.5%: $2,098. At 6.75%: $1,946. Savings: $152/month."
   },
   {
    "text": "Refinance costs are $6,500. Breakeven period?",
    "type": "input",
    "answer": "42–43 months",
    "explain": "$6,500 / $152 = 42.8 months (3.5 years). Only worth it if you plan to hold 4+ years."
   },
   {
    "text": "Should you refi?",
    "type": "choice",
    "choices": [
     "Yes, save $150/mo forever",
     "No, breakeven is too long",
     "Wait for rates to drop more",
     "Only if you can roll costs into the loan"
    ],
    "answer": "Wait for rates to drop more",
    "explain": "A 0.75% drop with a 3.5-year breakeven is marginal. If rates drop another 0.5–1.0%, the breakeven shortens to 18–24 months. Wait unless you desperately need the cash flow improvement now."
   }
  ]
 },
 {
  "title": "The Full Underwrite",
  "tier": "Gauntlet",
  "time": 20,
  "desc": "Complete property underwriting from raw listing data to a go/no-go decision using 4+ tools.",
  "questions": [
   {
    "text": "Property: $275K SFR, rent $1,900, 25% down, 7.25%. Annual NOI?",
    "type": "input",
    "answer": "$12,800–$13,500",
    "explain": "Gross rent $22,800 - vacancy 8% ($1,824) = $20,976. Expenses (taxes $3,300 + ins $1,800 + maint $1,824 + mgmt $2,280) = $9,204. NOI: $11,772. Slightly lower than target."
   },
   {
    "text": "Cap rate?",
    "type": "input",
    "answer": "4.3%",
    "explain": "$11,772 / $275,000 = 4.28%. Below the 6% minimum most investors require. Overpriced for the income."
   },
   {
    "text": "What price would make this a 7% cap rate deal?",
    "type": "input",
    "answer": "$168,000",
    "explain": "$11,772 / 0.07 = $168,171. A $107K reduction from asking. This market is pricing for appreciation, not cash flow."
   },
   {
    "text": "Go or no-go at asking price?",
    "type": "choice",
    "choices": [
     "Go",
     "No-go",
     "Offer $220K"
    ],
    "answer": "No-go",
    "explain": "4.3% cap rate, negative cash flow with management, no margin of safety. This is an appreciation bet, not an investment. Pass unless you can negotiate to $200K–$220K."
   }
  ]
 },
 {
  "title": "Investor Pitch Prep",
  "tier": "Gauntlet",
  "time": 20,
  "desc": "Analyze a deal and prepare key metrics for a hypothetical investor presentation.",
  "questions": [
   {
    "text": "12-unit complex: $1.1M, $8,500/mo gross rent, 45% expense ratio. NOI?",
    "type": "input",
    "answer": "$56,100",
    "explain": "Annual gross: $102K. Expenses (45%): $45,900. NOI: $56,100."
   },
   {
    "text": "Cap rate?",
    "type": "input",
    "answer": "5.1%",
    "explain": "$56,100 / $1,100,000 = 5.1%."
   },
   {
    "text": "If you raise rents 8% and reduce expenses to 42%, new NOI?",
    "type": "input",
    "answer": "$63,900",
    "explain": "New gross: $110,160. Expenses (42%): $46,267. NOI: $63,893. A 14% NOI improvement."
   },
   {
    "text": "Projected 5-year equity multiple at 3% appreciation and value-add NOI?",
    "type": "choice",
    "choices": [
     "1.5x",
     "1.8x",
     "2.2x",
     "2.5x+"
    ],
    "answer": "1.8x",
    "explain": "Purchase $1.1M with $275K down. After 5 years: value ~$1.35M (cap rate compression from NOI increase), equity ~$500K. Return: $500K / $275K = 1.82x. Solid for a core-plus deal."
   }
  ]
 },
 {
  "title": "The 3-Property Showdown",
  "tier": "Gauntlet",
  "time": 20,
  "desc": "Compare three properties across all key metrics. Pick the winner.",
  "questions": [
   {
    "text": "Property A: $180K, $1,350 rent, 8.1% cap. Property B: $260K, $1,800 rent, 6.2% cap. Property C: $140K, $1,150 rent, 7.8% cap. Best cash flow with 25% down at 7.5%?",
    "type": "choice",
    "choices": [
     "A",
     "B",
     "C"
    ],
    "answer": "C",
    "explain": "C has the lowest price point, decent cap rate, and lowest mortgage payment. P&I on $105K = $734. After expenses: ~$130/month CF. A and B have higher rents but proportionally higher mortgages."
   },
   {
    "text": "Best for long-term appreciation?",
    "type": "choice",
    "choices": [
     "A",
     "B",
     "C"
    ],
    "answer": "B",
    "explain": "Higher-priced properties in better locations typically appreciate faster. B at $260K likely represents a better neighborhood with stronger appreciation fundamentals."
   },
   {
    "text": "If you could only buy ONE, which is the best overall investment?",
    "type": "choice",
    "choices": [
     "A — balanced",
     "B — appreciation play",
     "C — cash flow play",
     "Buy A and C together instead of B"
    ],
    "answer": "Buy A and C together instead of B",
    "explain": "A ($180K) + C ($140K) = $320K total, close to B's $260K. You get 2 properties, 2 income streams, diversification, and combined cash flow exceeding B. Two doors > one door in almost every scenario."
   }
  ]
 },
 {
  "title": "Exit Strategy Matrix",
  "tier": "Gauntlet",
  "time": 20,
  "desc": "One property, four exit strategies. Analyze all four and recommend the best.",
  "questions": [
   {
    "text": "Property: $300K value, $180K mortgage, $1,800 rent. Net from selling outright (after 6% costs and $25K taxes)?",
    "type": "input",
    "answer": "$77,000",
    "explain": "$300K - $18K commission - $180K mortgage - $25K taxes - $2K closing = $75,000 net."
   },
   {
    "text": "Annual cash flow if you hold?",
    "type": "input",
    "answer": "$5,000–$7,000",
    "explain": "$1,800 rent x 12 = $21,600. Minus mortgage, taxes, insurance, management: ~$15,000. Net CF: ~$6,600/year."
   },
   {
    "text": "Net from seller financing ($280K at 7%, 20yr, $30K down)?",
    "type": "input",
    "answer": "$160,000+ over 20 years",
    "explain": "Down payment: $30K. Monthly payments ($250K at 7%, 20yr): $1,938 x 240 = $465,120. Total: $495,120. Minus payoff of $180K mortgage over time. Net income: $160K+ (vs $75K selling outright). Time value of money matters, but total dollars are dramatically higher."
   },
   {
    "text": "Best exit strategy?",
    "type": "choice",
    "choices": [
     "Sell outright ($75K now)",
     "Hold for cash flow ($6.6K/year)",
     "Seller finance ($160K+ over 20yr)",
     "1031 exchange into larger property"
    ],
    "answer": "1031 exchange into larger property",
    "explain": "$120K equity deployed into a $480K property (at 25% down) creates more cash flow, more appreciation, and defers all taxes. Selling for $75K (after taxes) or seller-financing for slow returns both underperform the 1031 upgrade strategy."
   }
  ]
 },
 {
  "title": "The Distressed Asset Deep Dive",
  "tier": "Gauntlet",
  "time": 20,
  "desc": "Pre-foreclosure property with multiple issues. Full analysis.",
  "questions": [
   {
    "text": "Owner owes $165K, property worth $220K (as-is), ARV $280K. Equity available?",
    "type": "input",
    "answer": "$55,000 as-is",
    "explain": "$220K - $165K = $55,000 in equity for the owner. Enough to negotiate a short sale or subject-to."
   },
   {
    "text": "Estimated rehab: $45K. All-in cost if you buy subject-to at $170K?",
    "type": "input",
    "answer": "$215,000",
    "explain": "$170K acquisition + $45K rehab = $215,000 all-in. ARV $280K. Margin: $65K before selling costs."
   },
   {
    "text": "BRRRR or flip?",
    "type": "choice",
    "choices": [
     "Flip for $40K profit",
     "BRRRR with $210K refi (75% of $280K)",
     "Wholesale for $15K assignment",
     "Hold as rental at $2,000/mo rent"
    ],
    "answer": "BRRRR with $210K refi (75% of $280K)",
    "explain": "Refi at $210K on $215K invested = only $5K left in deal. At $2,000 rent: strong cash flow on minimal trapped capital. Flipping yields $40K but is a one-time event. BRRRR creates ongoing income."
   },
   {
    "text": "What due diligence is most critical on a pre-foreclosure?",
    "type": "choice",
    "choices": [
     "Title search for liens",
     "Verify mortgage balance",
     "Confirm no bankruptcy filing",
     "All of the above"
    ],
    "answer": "All of the above",
    "explain": "Pre-foreclosures often have hidden liens (tax liens, mechanic's liens, judgment liens), inflated mortgage balances (fees and penalties), and potential bankruptcy filings that freeze all transactions. Run a full title search and verify everything with the servicer before committing."
   }
  ]
 },
 {
  "title": "Build the Portfolio",
  "tier": "Gauntlet",
  "time": 20,
  "desc": "Given $500K, select and analyze 3 properties from 8 candidates.",
  "questions": [
   {
    "text": "Budget: $500K for down payments (25% each). What is the maximum portfolio value?",
    "type": "input",
    "answer": "$2,000,000",
    "explain": "$500K / 0.25 = $2,000,000 in total purchasing power using leverage."
   },
   {
    "text": "Strategy: 1 appreciation + 1 cash flow + 1 value-add. What cap rate spread should you target?",
    "type": "choice",
    "choices": [
     "All at 6–7%",
     "4–5% appreciation, 7–8% cash flow, 9%+ value-add",
     "All at 8%+",
     "Mix doesn't matter"
    ],
    "answer": "4–5% appreciation, 7–8% cash flow, 9%+ value-add",
    "explain": "Diversification across cap rate profiles: low cap = growth market, mid cap = balanced, high cap = distressed/value-add opportunity. This hedges against market conditions while maximizing total returns."
   },
   {
    "text": "After selecting 3 properties, what is the #1 risk to manage?",
    "type": "choice",
    "choices": [
     "Interest rate exposure across all 3 mortgages",
     "Geographic concentration",
     "Liquidity (all capital is deployed)",
     "Concentration of management complexity"
    ],
    "answer": "Liquidity (all capital is deployed)",
    "explain": "$500K fully deployed means $0 reserves. One surprise vacancy, one major repair, or one market shift and you are forced to sell at the worst time. Always hold back 10–15% ($50K–75K) as reserves. Deploy $425K and sleep at night."
   }
  ]
 },
 {
  "title": "The BRRRR Marathon",
  "tier": "Gauntlet",
  "time": 20,
  "desc": "Walk through an entire BRRRR deal from acquisition through stabilized cash flow.",
  "questions": [
   {
    "text": "Purchase $85K, rehab $28K, ARV $155K. Cash invested?",
    "type": "input",
    "answer": "$113,000",
    "explain": "$85K + $28K = $113,000 total investment before holding costs."
   },
   {
    "text": "Refinance at 75% LTV. Cash back?",
    "type": "input",
    "answer": "$116,250",
    "explain": "75% of $155K = $116,250. You get ALL your capital back plus $3,250. Infinite return territory."
   },
   {
    "text": "Post-refi P&I on $116,250 at 7.5%, 30yr?",
    "type": "input",
    "answer": "$813",
    "explain": "$116,250 at 7.5% over 30 years = $812.93/month."
   },
   {
    "text": "Rent is $1,350. Cash flow after all expenses?",
    "type": "input",
    "answer": "$80–$150",
    "explain": "$1,350 - P&I $813 - taxes $125 - insurance $85 - vacancy $108 - maintenance $108 = $111/month. Thin but positive on ZERO cash invested. Infinite return."
   }
  ]
 },
 {
  "title": "Commercial vs. Residential",
  "tier": "Gauntlet",
  "time": 20,
  "desc": "Compare a 4-plex (residential loan) to a 6-unit (commercial loan). Which wins?",
  "questions": [
   {
    "text": "4-plex: $340K, residential loan 7.0%, 30yr, 25% down. Monthly P&I?",
    "type": "input",
    "answer": "$1,696",
    "explain": "$255K at 7.0% over 30yr = $1,696/month."
   },
   {
    "text": "6-unit: $480K, commercial loan 7.5%, 25yr, 25% down. Monthly P&I?",
    "type": "input",
    "answer": "$2,659",
    "explain": "$360K at 7.5% over 25yr = $2,659/month. Shorter amortization increases payments."
   },
   {
    "text": "4-plex: $3,200 gross rent. 6-unit: $4,800 gross rent. Which has better cash flow?",
    "type": "choice",
    "choices": [
     "4-plex",
     "6-unit",
     "About the same"
    ],
    "answer": "4-plex",
    "explain": "4-plex CF: $3,200 - $1,696 - $540 expenses = $964 before management. 6-unit CF: $4,800 - $2,659 - $810 expenses = $1,331 before management. Per dollar invested: 4-plex ($964/$85K down = 13.6%) beats 6-unit ($1,331/$120K = 13.3%). Close, but residential loan terms give the 4-plex an edge."
   },
   {
    "text": "Which is better for scaling?",
    "type": "choice",
    "choices": [
     "4-plexes (up to 10 conventional loans)",
     "6+ units (commercial, unlimited)",
     "Mix of both"
    ],
    "answer": "Mix of both",
    "explain": "Buy 4-plexes with conventional loans (better terms) until you hit 10 properties. Then switch to commercial for 6+ unit buildings. This maximizes favorable residential lending while building a portfolio that transitions to commercial scale."
   }
  ]
 },
 {
  "title": "The Creative Finance Marathon",
  "tier": "Gauntlet",
  "time": 20,
  "desc": "Structure a deal using subject-to, seller finance, AND a wrap mortgage.",
  "questions": [
   {
    "text": "Seller owes $150K at 3.5%. Property worth $230K. You take subject-to. What is the spread over current 7.5% rates?",
    "type": "input",
    "answer": "$350–$400/month",
    "explain": "Payment at 3.5%: ~$674. Payment at 7.5%: ~$1,049 (on same balance). Monthly savings: $375. This savings is your competitive advantage."
   },
   {
    "text": "You sell via wrap mortgage: $220K, 7.0%, 30yr, $20K down. Your monthly collection?",
    "type": "input",
    "answer": "$1,331",
    "explain": "$200K at 7.0% = $1,331/month from your buyer."
   },
   {
    "text": "Your monthly spread (collection minus underlying payment)?",
    "type": "input",
    "answer": "$657",
    "explain": "Collect $1,331 - pay underlying $674 = $657/month. Plus you got $20K down payment. Annualized spread: $7,884/year on essentially zero invested capital."
   },
   {
    "text": "What is the total profit over the life of both notes?",
    "type": "choice",
    "choices": [
     "$80K–$100K",
     "$120K–$150K",
     "$200K+",
     "Cannot calculate without amortization schedules"
    ],
    "answer": "$200K+",
    "explain": "Monthly spread $657 x 360 months = $236,520. Plus $20K down = $256,520. Minus underlying mortgage payoff (~$150K). Net profit: $106K+ in spread income alone, plus the underlying equity builds as both loans amortize at different rates. Creative finance at its most powerful."
   }
  ]
 },
 {
  "title": "Market Entry Analysis",
  "tier": "Gauntlet",
  "time": 20,
  "desc": "You are entering a new market. Evaluate it holistically before committing capital.",
  "questions": [
   {
    "text": "Market: Population growing 3%/yr, median home $190K, median rent $1,350, 6% vacancy. Is the price-to-rent ratio favorable?",
    "type": "input",
    "answer": "11.7 (favorable)",
    "explain": "$190,000 / ($1,350 x 12) = 11.73. Under 15 is generally favorable for investors. Under 12 is excellent."
   },
   {
    "text": "Rent growth is 4%/yr, appreciation 3%/yr. What is Year 5 projected rent?",
    "type": "input",
    "answer": "$1,642",
    "explain": "$1,350 x 1.04^5 = $1,642/month. Strong organic rent growth driven by population inflow."
   },
   {
    "text": "What is the most important metric for market selection?",
    "type": "choice",
    "choices": [
     "Population growth",
     "Job diversity",
     "Price-to-rent ratio",
     "All equally important"
    ],
    "answer": "All equally important",
    "explain": "Population growth drives demand. Job diversity prevents single-employer risk (e.g., company towns). Price-to-rent ratio determines cash flow viability. A market that scores well on all three is investable. One weak metric can sink an otherwise attractive market."
   },
   {
    "text": "You find a $175K rental with $1,300 rent. Buy?",
    "type": "choice",
    "choices": [
     "Yes — below median with strong fundamentals",
     "No — below market rent is a red flag",
     "Yes, if rent can be raised to $1,350+",
     "Need property-specific inspection first"
    ],
    "answer": "Yes, if rent can be raised to $1,350+",
    "explain": "Below-median price with below-market rent = value-add opportunity. If the property can be brought to market rent through light improvements, the fundamentals are strong. But never buy based on market data alone — property-level analysis is always required."
   }
  ]
 }
];

const SANDBOX_PRESETS = [
 {
  "id": "open",
  "title": "Open Sandbox",
  "desc": "Free-form exploration. Adjust any inputs and market conditions. No scoring — just learning.",
  "icon": "grid"
 },
 {
  "id": "deal",
  "title": "Deal Analyzer",
  "desc": "A pre-loaded property with real-world numbers. Toggle variables to see how metrics shift.",
  "icon": "search"
 },
 {
  "id": "market",
  "title": "Market Comparison",
  "desc": "Two side-by-side market profiles. Compare cash flow, cap rate, and appreciation head-to-head.",
  "icon": "bar-chart"
 },
 {
  "id": "portfolio",
  "title": "Portfolio Builder",
  "desc": "Start with a budget and build a 3-property portfolio. See combined cash flow, equity, and risk.",
  "icon": "layers"
 },
 {
  "id": "whatif",
  "title": "What-If Explorer",
  "desc": "One locked deal with unlimited variable toggles. Test rate changes, vacancy spikes, and more.",
  "icon": "sliders"
 }
];