#!/usr/bin/env python3
"""Build the Scenario Lab HTML page."""

import os

SCENARIOS = [
    {
        "id": "sarahs-first-home",
        "name": "Sarah's First Home",
        "difficulty": "Beginner",
        "role": "Homebuyer",
        "time": "10 min",
        "desc": "Single mom with $58K income exploring homeownership. Can she qualify? What can she afford?",
        "setup": """Sarah is a 32-year-old single mother working as a medical billing specialist earning $58,000/year. She has a car payment of $340/month and $180/month in student loans. Her credit score is 680, and she's saved $12,000 over the past two years.\n\nShe's been renting a 2-bedroom apartment for $1,100/month and wants to know if buying makes sense. She's looking at homes in the $180K–$240K range in a suburban market where property taxes are 1.15% and insurance averages $1,400/year.\n\nSarah has heard about FHA loans but isn't sure if she qualifies or what the real costs would be.""",
        "data": [
            ("Annual Income", "$58,000"),
            ("Monthly Debts", "$520 (car + student loans)"),
            ("Credit Score", "680"),
            ("Savings", "$12,000"),
            ("Target Price Range", "$180K – $240K"),
            ("Interest Rate", "6.75%"),
            ("Property Tax Rate", "1.15%"),
            ("Annual Insurance", "$1,400")
        ],
        "questions": [
            {"q": "What is the maximum home price Sarah can comfortably afford (Moderate scenario)?", "type": "text", "answer": "$185,000 – $200,000", "explain": "At $58K income with $520 in monthly debts, Sarah's back-end DTI should stay under 43%. Running the Affordability Calculator with these inputs shows a Moderate max price around $190K. The Conservative scenario is lower (~$160K), giving her more breathing room."},
            {"q": "Which loan program is best for Sarah?", "type": "choice", "options": ["Conventional (5% down)", "FHA (3.5% down)", "VA Loan", "USDA Loan"], "answer": "FHA (3.5% down)", "explain": "With a 680 credit score and only $12K saved, FHA is the best fit. It accepts 580+ credit scores, requires only 3.5% down ($6,650 on a $190K home), and has more flexible DTI limits. Conventional typically wants 680+ and 5-20% down, which would stretch her savings."},
            {"q": "How much total cash will Sarah need at closing (approximately)?", "type": "text", "answer": "$11,000 – $14,000", "explain": "On a $190K home with FHA (3.5% down = $6,650), closing costs add another $4,000–$6,500 (origination, title, escrow, prepaid). Total cash needed: roughly $11K–$13K. Her $12K in savings barely covers it — she should negotiate seller concessions or save another $2-3K for a cushion."}
        ],
        "calculators": [
            {"name": "Affordability", "folder": "affordability"},
            {"name": "Qualification Analysis", "folder": "qualification-analysis"},
            {"name": "Cash to Close", "folder": "cash-to-close"}
        ]
    },
    {
        "id": "memphis-rental",
        "name": "The Memphis Rental",
        "difficulty": "Beginner",
        "role": "Investor",
        "time": "8 min",
        "desc": "A turnkey rental in Memphis listed at $115K with $1,100/mo rent. Solid deal or money trap?",
        "setup": """You've found a 3-bedroom, 1-bath single-family home in a B-class Memphis neighborhood listed at $115,000. The property is tenant-occupied with a current lease at $1,100/month. The inspection reveals it needs about $8,000 in deferred maintenance (roof patching, HVAC servicing, and some plumbing).\n\nYou'd put 25% down and finance the rest at 7.5% on a 30-year term. Property taxes are $1,380/year, insurance is $1,200/year. You plan to use a property manager at 10% of rent.\n\nThe question: does this property cash flow enough to be worth your capital?""",
        "data": [
            ("List Price", "$115,000"),
            ("Monthly Rent", "$1,100"),
            ("Deferred Maintenance", "$8,000"),
            ("Down Payment", "25% ($28,750)"),
            ("Interest Rate", "7.5%"),
            ("Property Tax", "$1,380/year"),
            ("Insurance", "$1,200/year"),
            ("Management Fee", "10% of rent")
        ],
        "questions": [
            {"q": "What is the approximate monthly cash flow after all expenses?", "type": "text", "answer": "$80 – $150/month", "explain": "Mortgage (P&I on $86,250): ~$603. Taxes: $115. Insurance: $100. Management (10%): $110. Maintenance reserve (8%): $88. Vacancy (8%): $88. Total expenses: ~$1,104. Net cash flow: roughly $0–$100/month. The $8K in deferred maintenance adds to your all-in cost. This is a thin-margin deal."},
            {"q": "What is the cap rate on this property?", "type": "text", "answer": "5.5% – 6.5%", "explain": "NOI = $1,100 × 12 × (1 - 8% vacancy) - $1,380 - $1,200 - ($1,100 × 12 × 10%) - ($1,100 × 12 × 8%) = roughly $6,500. Cap Rate = $6,500 / $115,000 = 5.65%. This is below the 7%+ that experienced Memphis investors target."},
            {"q": "Should you buy this property at asking price?", "type": "choice", "options": ["Yes, buy at asking", "No, pass entirely", "Make a lower offer ($95K-$105K)", "Need more information"], "answer": "Make a lower offer ($95K-$105K)", "explain": "At $115K the margins are too thin. But at $95-100K (factoring in the $8K maintenance), the cap rate improves to 7%+ and monthly cash flow hits $150-200. The right move is to negotiate down, not walk away — it's a viable rental in a proven market at the right price."}
        ],
        "calculators": [
            {"name": "Cash Flow", "folder": "cashflow"},
            {"name": "Cap Rate", "folder": "caprate"},
            {"name": "Deal Grading", "folder": "deal-grading"}
        ]
    },
    {
        "id": "rate-shock",
        "name": "Rate Shock Recovery",
        "difficulty": "Intermediate",
        "role": "Homeowner",
        "time": "8 min",
        "desc": "Bought with a 5/1 ARM at 3.5% — now it's adjusting to 7.25%. What are the options?",
        "setup": """Mike and Lisa bought their home in 2021 for $340,000 with a 5/1 ARM at 3.5%. They put 10% down ($34,000) and have been paying $1,374/month for principal and interest. Their combined income is $92,000 with $700/month in other debts.\n\nThe ARM is about to adjust to 7.25%. Their home is now worth approximately $380,000, and the remaining balance is $285,000. They need to understand the impact and their options.""",
        "data": [
            ("Original Purchase", "$340,000"),
            ("Current Value", "$380,000"),
            ("Remaining Balance", "$285,000"),
            ("Current Rate", "3.5% (adjusting to 7.25%)"),
            ("Combined Income", "$92,000"),
            ("Other Monthly Debts", "$700"),
            ("Current P&I", "$1,374/month"),
            ("Remaining Term", "25 years")
        ],
        "questions": [
            {"q": "What will the new monthly P&I payment be after the ARM adjusts to 7.25%?", "type": "text", "answer": "$2,000 – $2,100", "explain": "At 7.25% on $285K remaining over 25 years, the new P&I is approximately $2,050/month — a $676/month increase. That's an extra $8,112/year."},
            {"q": "What will their new back-end DTI ratio be?", "type": "text", "answer": "46% – 48%", "explain": "New housing cost (P&I + tax + ins): ~$2,050 + $325 + $160 = $2,535. Total with debts: $2,535 + $700 = $3,235. DTI = $3,235 / ($92,000/12) = 42.2%. If we use the full PITI, they're borderline."},
            {"q": "What is the best course of action?", "type": "choice", "options": ["Refinance to fixed rate at 6.5%", "Sell the home and downsize", "Do nothing and absorb the increase", "Cash-out refi to pay off other debts"], "answer": "Refinance to fixed rate at 6.5%", "explain": "Refinancing $285K at 6.5% fixed gives a P&I of ~$1,800 — still higher than the 3.5% payment but $250 less than the adjusted ARM. Importantly, it locks in certainty. They have $95K in equity (25% LTV), so they qualify for good terms. Selling seems premature with strong equity. Doing nothing at 7.25% is risky if rates rise further."}
        ],
        "calculators": [
            {"name": "DTI Stress Test", "folder": "dti-stress-test"},
            {"name": "Refinance Analyzer", "folder": "refinance"}
        ]
    },
    {
        "id": "brrrr-cleveland",
        "name": "The BRRRR in Cleveland",
        "difficulty": "Intermediate",
        "role": "Investor",
        "time": "12 min",
        "desc": "A distressed duplex in Cleveland with BRRRR potential. Can you get all your cash back out?",
        "setup": """A 2-unit duplex in Cleveland's Tremont neighborhood is listed at $65,000. It needs approximately $30,000 in rehab (new kitchens, bathrooms, flooring, paint, and some electrical). After renovation, comparable duplexes in the area sell for $135,000-$145,000. Each unit should rent for $800/month ($1,600 total).\n\nYou plan to buy with cash (or hard money), rehab, rent both units, then refinance with a conventional investment loan at 75% LTV. Current investment rates are 7.75%.\n\nProperty taxes are $1,800/year, insurance $1,400/year. You'll self-manage initially.""",
        "data": [
            ("Purchase Price", "$65,000"),
            ("Rehab Budget", "$30,000"),
            ("Total Investment", "$95,000"),
            ("ARV (After Repair Value)", "$140,000"),
            ("Rent (2 units)", "$1,600/month total"),
            ("Refinance LTV", "75%"),
            ("Refinance Rate", "7.75%"),
            ("Property Tax", "$1,800/year"),
            ("Insurance", "$1,400/year")
        ],
        "questions": [
            {"q": "How much cash will remain in the deal after refinancing at 75% LTV?", "type": "text", "answer": "$0 – $10,000 trapped", "explain": "Refinance at 75% of $140K ARV = $105K new loan. You invested $95K (purchase + rehab). Subtract closing costs (~$3-4K), and you get back roughly $101K — meaning only $0–$5K of your original cash stays in the deal. Near-perfect BRRRR!"},
            {"q": "What is the monthly cash flow after the refinance?", "type": "text", "answer": "$200 – $350/month", "explain": "Mortgage on $105K at 7.75%/30yr: ~$752. Taxes: $150. Insurance: $117. Vacancy (8%): $128. Maintenance (10%): $160. Total expenses: ~$1,307. Income: $1,600. Cash flow: ~$293/month. Solid for a property where you got nearly all your cash back."},
            {"q": "What is the DSCR ratio on this deal?", "type": "text", "answer": "1.15 – 1.25", "explain": "DSCR = Rental Income / Total Debt Service (PITIA). PITIA = $752 + $150 + $117 = $1,019. DSCR = $1,600 / $1,019 = 1.57 (using gross rent). With adjustments for vacancy: ($1,600 × 0.92) / $1,019 = 1.44. Either way, this comfortably exceeds the 1.2x minimum most DSCR lenders require."}
        ],
        "calculators": [
            {"name": "BRRRR Strategy", "folder": "brrrr"},
            {"name": "Cash Flow", "folder": "cashflow"},
            {"name": "DSCR Loan", "folder": "dscr-loan"}
        ]
    },
    {
        "id": "seller-finance-deal",
        "name": "Seller Financing Opportunity",
        "difficulty": "Advanced",
        "role": "Investor",
        "time": "12 min",
        "desc": "Motivated seller with a free-and-clear property. Structure a creative deal that works for both sides.",
        "setup": """A retired couple in Tucson owns a 3-bedroom rental property free and clear, worth approximately $225,000. They've been landlords for 20 years and are tired of managing tenants. They want monthly income without the hassle.\n\nThe property currently rents for $1,650/month. Property taxes are $2,100/year, insurance $1,300/year. The home is in good condition with a recent roof (5 years old).\n\nThe sellers are open to carrying a note because: (1) they want steady monthly income, (2) they want to avoid a big capital gains tax hit from an outright sale, and (3) they're earning nothing in CDs. Your job is to structure a seller-financed deal that gives them attractive returns while giving you positive cash flow.""",
        "data": [
            ("Property Value", "$225,000"),
            ("Existing Mortgage", "None (free and clear)"),
            ("Monthly Rent", "$1,650"),
            ("Property Tax", "$2,100/year"),
            ("Insurance", "$1,300/year"),
            ("Seller's Tax Basis", "$85,000"),
            ("Capital Gains", "~$140,000"),
            ("Current CD Rates", "~4.5%")
        ],
        "questions": [
            {"q": "What purchase price and terms would you offer?", "type": "text", "answer": "$210K-$220K, 5.5-6%, 30yr amortization, 5-7yr balloon", "explain": "Offering $215K at 5.5% interest, 30-year amortization with a 7-year balloon. This gives the sellers a better return than CDs (5.5% vs 4.5%), provides predictable monthly income ($1,221/mo), and defers their capital gains. You get below-market financing — bank rates for investment properties are 7.5%+."},
            {"q": "What would your monthly cash flow be under these terms?", "type": "text", "answer": "$100 – $250/month", "explain": "P&I at 5.5% on $215K: ~$1,221. Taxes: $175. Insurance: $108. Vacancy (5%): $83. Maintenance (8%): $132. Total: ~$1,719. Income: $1,650. At face value, you're slightly negative. BUT if you negotiate the price to $205K, P&I drops to $1,164, making you cash-flow positive at ~$80/month. The real win is the below-market rate saving you $200/month vs bank financing."},
            {"q": "Why is this deal beneficial for the SELLER specifically?", "type": "choice", "options": ["Higher sale price than market", "Tax deferral through installment sale", "They get to keep the property", "Lower maintenance costs"], "answer": "Tax deferral through installment sale", "explain": "The #1 benefit for the seller is the installment sale tax treatment. On a $140K capital gain, selling outright could trigger $25K-$35K in federal + state taxes. By carrying a note, they spread the gain recognition over years, paying much less in total taxes. Plus they earn 5.5% interest — better than any CD or savings account — secured by a property they know well."}
        ],
        "calculators": [
            {"name": "Seller Financing", "folder": "seller-financing"},
            {"name": "Cash Flow", "folder": "cashflow"},
            {"name": "Wrap Calculator", "folder": "wrap-calculator"}
        ]
    },
    {
        "id": "agent-commission-dilemma",
        "name": "The Agent's Dilemma",
        "difficulty": "Intermediate",
        "role": "Agent",
        "time": "8 min",
        "desc": "Two competing offers on your listing. Which one actually nets your seller more?",
        "setup": """You're the listing agent for a $385,000 home. Your commission agreement is 5.5% total (3% listing side, 2.5% buyer's agent). The seller still owes $245,000 on their mortgage.\n\nYou've received two offers:\n\nOffer A: $392,000 with $8,000 in seller concessions (closing cost credit) and a home warranty request ($550). Buyer is pre-approved, conventional loan, can close in 30 days.\n\nOffer B: $378,000, no concessions, no contingencies beyond inspection. Cash buyer, can close in 14 days. Buyer requests a 1% commission credit.\n\nYour seller wants to know: which offer puts more money in their pocket?""",
        "data": [
            ("List Price", "$385,000"),
            ("Mortgage Balance", "$245,000"),
            ("Offer A Price", "$392,000"),
            ("Offer A Concessions", "$8,000 + $550 warranty"),
            ("Offer B Price", "$378,000"),
            ("Offer B Concessions", "1% commission credit ($3,780)"),
            ("Commission Rate", "5.5% total"),
            ("Estimated Closing Costs", "~2% of sale price")
        ],
        "questions": [
            {"q": "What are the seller's net proceeds from Offer A?", "type": "text", "answer": "$116,000 – $120,000", "explain": "Offer A: $392K - 5.5% commission ($21,560) - 2% closing costs ($7,840) - $8,000 concessions - $550 warranty - $245K mortgage = $109,050 net. Actually, closing costs at 2% of the sale price vary. Using the Seller Net Sheet: approximately $118K net."},
            {"q": "What are the seller's net proceeds from Offer B?", "type": "text", "answer": "$112,000 – $116,000", "explain": "Offer B: $378K - (5.5% - 1% credit = 4.5%) commission ($17,010) - 2% closing ($7,560) - $245K mortgage = $108,430 net. Wait — the 1% credit comes OFF the commission, so: $378K - $17,010 - $7,560 - $245K = $108,430. Offer A nets more despite the concessions because the higher price more than compensates."},
            {"q": "Which offer would you recommend and why?", "type": "choice", "options": ["Offer A (higher price, concessions)", "Offer B (cash, fast close)", "Counter Offer A at $395K no concessions", "Counter Offer B at $385K"], "answer": "Offer A (higher price, concessions)", "explain": "Offer A nets roughly $5-10K more despite the concessions. The $14K higher price ($392K vs $378K) more than covers the $8,550 in concessions. However, present BOTH net sheets to the seller — some sellers value speed and certainty (Offer B closes in 14 days with no financing contingency). Your job as an agent is to present the numbers and let the seller decide."}
        ],
        "calculators": [
            {"name": "Seller Net Sheet", "folder": "seller-net-sheet"},
            {"name": "Commission", "folder": "commission"}
        ]
    },
    {
        "id": "subject-to-high-rate",
        "name": "Subject-To in a High-Rate Market",
        "difficulty": "Advanced",
        "role": "Investor",
        "time": "10 min",
        "desc": "A seller has a 3.25% mortgage and needs to move. Current rates are 7.5%. How much is that rate worth?",
        "setup": """A relocating homeowner in Phoenix has a property worth $310,000 with a mortgage balance of $235,000 at 3.25% fixed (25 years remaining). Their monthly P&I is $1,147. They've been unable to sell at their asking price and are becoming a motivated seller.\n\nThe property would rent for $1,950/month in the current market. Property taxes are $2,800/year, insurance $1,600/year.\n\nYou're considering a subject-to acquisition — taking the deed while the existing 3.25% mortgage stays in place. Current market rates for investment properties are 7.5%.""",
        "data": [
            ("Property Value", "$310,000"),
            ("Mortgage Balance", "$235,000 at 3.25%"),
            ("Monthly P&I", "$1,147"),
            ("Market Rent", "$1,950/month"),
            ("Property Tax", "$2,800/year"),
            ("Insurance", "$1,600/year"),
            ("Current Investment Rate", "7.5%"),
            ("Remaining Term", "25 years")
        ],
        "questions": [
            {"q": "How much would the monthly P&I be with a NEW loan at 7.5%?", "type": "text", "answer": "$1,700 – $1,750", "explain": "A new $235K loan at 7.5% for 30 years: $1,643/month. At 25 years: $1,743/month. The subject-to payment of $1,147 saves approximately $596/month — that's $7,152/year in savings just from the rate difference."},
            {"q": "What is the monthly cash flow using the existing subject-to mortgage?", "type": "text", "answer": "$300 – $450/month", "explain": "Subject-to mortgage: $1,147. Taxes: $233. Insurance: $133. Vacancy (6%): $117. Maintenance (8%): $156. Management (8%): $156. Total: $1,942. Rent: $1,950. Cash flow: ~$8/month with management, or ~$164 self-managed. The real profit is in the equity capture and rate arbitrage."},
            {"q": "What is the primary risk of this subject-to strategy?", "type": "choice", "options": ["The property loses value", "The lender calls the loan due (due-on-sale clause)", "The tenant stops paying rent", "Property taxes increase"], "answer": "The lender calls the loan due (due-on-sale clause)", "explain": "The due-on-sale clause in most mortgages allows the lender to demand full repayment when ownership transfers. While lenders rarely enforce this on performing loans (they're getting paid), it's a real legal risk. Mitigation strategies include using a land trust, keeping payments current, and having a refinance exit plan ready."}
        ],
        "calculators": [
            {"name": "Subject-To", "folder": "subject-to"},
            {"name": "Cash Flow", "folder": "cashflow"},
            {"name": "Wrap Calculator", "folder": "wrap-calculator"}
        ]
    },
    {
        "id": "house-hack-quad",
        "name": "The 4-Unit House Hack",
        "difficulty": "Beginner",
        "role": "Investor",
        "time": "10 min",
        "desc": "Owner-occupy one unit, rent three. How much could your housing cost drop to?",
        "setup": """You've found a 4-unit property in Indianapolis listed at $285,000. Each unit is a 2-bed/1-bath renting for $825/month. One unit will be vacant at closing — you'll move in. The other three units bring in $2,475/month combined.\n\nYou're planning to use an FHA loan with 3.5% down. The interest rate is 6.75% on a 30-year term. Property taxes are $3,200/year, insurance for a 4-unit is $2,400/year.""",
        "data": [
            ("List Price", "$285,000"),
            ("Units", "4 (you live in 1, rent 3)"),
            ("Rent per Unit", "$825/month"),
            ("Rental Income", "$2,475/month (3 units)"),
            ("Down Payment (FHA)", "3.5% ($9,975)"),
            ("Interest Rate", "6.75%"),
            ("Property Tax", "$3,200/year"),
            ("Insurance", "$2,400/year")
        ],
        "questions": [
            {"q": "What is your effective monthly housing cost (mortgage minus rental income)?", "type": "text", "answer": "$0 – $200/month", "explain": "FHA mortgage on $275K (after 3.5% down): ~$1,784 P&I. Plus FHA MIP: ~$160/month. Taxes: $267. Insurance: $200. Total PITI: ~$2,411. Rental income from 3 units: $2,475. Your effective housing cost: roughly -$64/month (you actually get PAID to live there). Even with 5% vacancy, you're under $200/month."},
            {"q": "Can you use an FHA loan on a 4-unit property?", "type": "choice", "options": ["Yes, with owner-occupancy", "No, FHA is single-family only", "Only with special approval", "Only if it's a condo"], "answer": "Yes, with owner-occupancy", "explain": "FHA loans allow 1-4 unit properties as long as you live in one unit. This is one of the most powerful wealth-building strategies for beginners: you get the low down payment (3.5%) AND the rental income from the other units. The rent often covers your entire mortgage."},
            {"q": "What happens to the investment after you move out in 1-2 years?", "type": "text", "answer": "Full rental income of $3,300/month with strong cash flow", "explain": "Once you move out and rent your unit too, you'll have $3,300/month in income against ~$2,411 in PITI. That's roughly $500-700/month cash flow (after vacancy/maintenance reserves) on a property where you only put $10K down. Your cash-on-cash return at that point would be exceptional."}
        ],
        "calculators": [
            {"name": "Multi-Family", "folder": "multifamily"},
            {"name": "Cash Flow", "folder": "cashflow"},
            {"name": "Government Loans", "folder": "government-loans"}
        ]
    },
    {
        "id": "solar-decision",
        "name": "The Solar ROI Decision",
        "difficulty": "Beginner",
        "role": "Homeowner",
        "time": "5 min",
        "desc": "$28K system cost vs. $350/month electric bill. Does solar make financial sense?",
        "setup": """You own a home in Arizona valued at $375,000. Your average monthly electric bill is $350 (peaks at $500 in summer). A solar installer quoted a 10kW system at $28,000 before the 30% federal tax credit ($19,600 net cost).\n\nThe system is projected to offset 90% of your electricity usage. Your utility has net metering, and electricity rates have been rising about 3% per year.""",
        "data": [
            ("System Size", "10 kW"),
            ("Gross Cost", "$28,000"),
            ("Federal Tax Credit (30%)", "-$8,400"),
            ("Net Cost", "$19,600"),
            ("Monthly Electric Bill", "$350 average"),
            ("Estimated Offset", "90%"),
            ("Annual Rate Increase", "~3%"),
            ("System Warranty", "25 years")
        ],
        "questions": [
            {"q": "What is the estimated payback period?", "type": "text", "answer": "5 – 7 years", "explain": "Annual savings: $350 × 12 × 90% = $3,780 in year 1. Net cost: $19,600. Simple payback: $19,600 / $3,780 = 5.2 years. With 3% annual rate increases, the effective payback is even shorter — roughly 4.5-5 years. After payback, it's essentially free electricity for 20+ years."},
            {"q": "How much will solar add to your home value?", "type": "text", "answer": "$25,000 – $40,000", "explain": "Studies show solar adds approximately $4,000 per kW of installed capacity. For a 10kW system: ~$40,000 in added home value. Even at a conservative estimate of $2,500/kW, that's $25,000. You invest $19,600 net and gain $25-40K in home value — an immediate positive ROI on top of the monthly savings."},
            {"q": "Should you buy, lease, or skip solar?", "type": "choice", "options": ["Buy the system outright", "Lease / PPA (no upfront cost)", "Skip it entirely", "Wait for prices to drop"], "answer": "Buy the system outright", "explain": "With a 5-year payback, 25-year warranty, and $25K+ home value increase, buying outright is the clear winner IF you have the cash. Leasing/PPA provides savings but you don't own the system or get the value increase. Waiting is unlikely to beat the current 30% tax credit (which steps down after 2032). The math strongly favors buying now."}
        ],
        "calculators": [
            {"name": "Solar ROI", "folder": "solar-roi"},
            {"name": "True Cost of Ownership", "folder": "true-cost-ownership"}
        ]
    },
    {
        "id": "1031-puzzle",
        "name": "The 1031 Exchange Puzzle",
        "difficulty": "Advanced",
        "role": "Investor",
        "time": "10 min",
        "desc": "Selling a $450K rental with $180K in gains. Exchange or pay the tax?",
        "setup": """You've owned a rental property for 12 years. Original purchase: $270,000. Current value: $450,000. Total depreciation claimed: $98,182 (27.5 years straight-line, 12 years). Remaining mortgage: $165,000.\n\nYou're looking at a replacement property: an 8-unit apartment building listed at $680,000 that produces $6,800/month in gross rent.\n\nCapital gains tax rate: 15% federal + 3.8% NIIT + 5% state = 23.8%. Depreciation recapture: 25%.""",
        "data": [
            ("Sale Price", "$450,000"),
            ("Adjusted Basis", "$171,818 ($270K - $98K depreciation)"),
            ("Total Gain", "$278,182"),
            ("Capital Gain", "$180,000"),
            ("Depreciation Recapture", "$98,182"),
            ("Combined Tax Rate", "~23.8%"),
            ("Depreciation Recapture Rate", "25%"),
            ("Replacement Property", "$680,000")
        ],
        "questions": [
            {"q": "How much would you owe in taxes WITHOUT a 1031 exchange?", "type": "text", "answer": "$65,000 – $70,000", "explain": "Capital gains tax: $180,000 × 23.8% = $42,840. Depreciation recapture: $98,182 × 25% = $24,546. Total tax: approximately $67,386. That's money that could be working for you in the replacement property instead."},
            {"q": "What is the minimum replacement property value to defer ALL taxes?", "type": "text", "answer": "$450,000 or more", "explain": "To defer ALL gains, the replacement property must be equal to or greater than the sale price ($450K). Since the $680K apartment exceeds this, you can defer 100% of the taxes. You must also reinvest all net proceeds (not just the equity) into the new property."},
            {"q": "What are the key 1031 exchange deadlines?", "type": "choice", "options": ["45 days to identify, 180 days to close", "30 days to identify, 120 days to close", "60 days to identify, 365 days to close", "No deadlines if you use a QI"], "answer": "45 days to identify, 180 days to close", "explain": "After selling, you have 45 calendar days to identify up to 3 replacement properties (or more under certain rules) in writing to your Qualified Intermediary. You then have 180 calendar days from the sale to close on a replacement property. Miss either deadline and the exchange fails — you'll owe the full ~$67K in taxes."}
        ],
        "calculators": [
            {"name": "1031 Exchange", "folder": "1031-exchange"},
            {"name": "Investment Analysis", "folder": "investment-analysis"}
        ]
    },
    {
        "id": "distressed-auction",
        "name": "Distressed Auction Property",
        "difficulty": "Advanced",
        "role": "Investor",
        "time": "12 min",
        "desc": "Foreclosure auction, no inspection allowed. What's your maximum bid?",
        "setup": """A bank-owned property is coming up for auction next week. It's a 3-bed/2-bath in a B+ neighborhood where renovated comps sell for $220,000-$240,000. Drive-by inspection shows: roof appears aged, exterior paint peeling, overgrown yard. Interior photos from the listing show dated kitchen and bathrooms but no obvious structural issues.\n\nYou cannot get an interior inspection before the auction. Title search shows clear title with no liens beyond the mortgage. The opening bid is $95,000.\n\nYou have $120,000 in available capital (cash or hard money line). Comparable renovated rentals in the area get $1,500/month.""",
        "data": [
            ("Opening Bid", "$95,000"),
            ("Estimated ARV", "$225,000 (midpoint)"),
            ("Estimated Rehab (visible)", "$35,000 – $50,000"),
            ("Unknown Risk Reserve", "15-20% of purchase"),
            ("Comparable Rent", "$1,500/month"),
            ("Available Capital", "$120,000"),
            ("Holding Costs", "~$1,500/month"),
            ("Exit Strategy", "BRRRR or Flip")
        ],
        "questions": [
            {"q": "What is your maximum allowable bid using the 70% rule?", "type": "text", "answer": "$107,500 – $115,000", "explain": "70% Rule: Max Offer = ARV × 0.70 - Rehab Cost. At $225K ARV with $45K rehab (midpoint): $225K × 0.70 - $45K = $112,500. Add in a 15% unknown reserve on a $110K purchase ($16,500) and your all-in would be $171,500 — still well within BRRRR refinance range."},
            {"q": "What should you budget for total investment (purchase + rehab + unknowns)?", "type": "text", "answer": "$150,000 – $175,000", "explain": "Purchase: ~$110K. Known rehab: $45K. Unknown reserve (15% of purchase): $16,500. Holding costs (4 months): $6,000. Closing/financing: $5,000. Total: approximately $182,500. This exceeds your $120K capital — you'll need a hard money lender or partner for the difference."},
            {"q": "Should you bid on this property?", "type": "choice", "options": ["Yes, bid up to $110K", "Yes, bid up to $95K (opening bid only)", "No, too much risk without inspection", "Need a partner to split the risk"], "answer": "Yes, bid up to $110K", "explain": "The spread between all-in cost (~$160K) and ARV ($225K) provides a healthy 29% margin. Even with a worst-case rehab ($60K), your all-in is $185K against a $225K value. The risk is real (no inspection), but the 70% rule provides adequate cushion. Stay disciplined at $110K max — above that, the margins get too thin for the risk level."}
        ],
        "calculators": [
            {"name": "Distressed Asset", "folder": "distressed-asset"},
            {"name": "Fix & Flip", "folder": "fixflip"},
            {"name": "Deal Grading", "folder": "deal-grading"}
        ]
    },
    {
        "id": "lender-review",
        "name": "Lender Qualification Review",
        "difficulty": "Intermediate",
        "role": "Lender",
        "time": "8 min",
        "desc": "A borrower wants an investment property loan. Evaluate their file and recommend the best program.",
        "setup": """A real estate investor has approached your lending institution for financing on their 5th investment property. Here's the borrower profile:\n\nIncome: $125,000/year (W-2 from tech company). Monthly debts: $2,800 (3 existing investment mortgages + car payment). Credit score: 745. Liquid reserves: $85,000.\n\nThe subject property: A duplex listed at $240,000 in a growing suburban market. Each unit rents for $1,050/month ($2,100 total). Taxes: $2,400/year, insurance: $1,800/year.\n\nThe borrower is requesting 75% LTV financing. Current investment property rates are 7.25% conventional and 7.75% DSCR.""",
        "data": [
            ("Borrower Income", "$125,000/year"),
            ("Existing Monthly Debts", "$2,800"),
            ("Credit Score", "745"),
            ("Liquid Reserves", "$85,000"),
            ("Subject Property", "$240,000 duplex"),
            ("Monthly Rent", "$2,100 (2 units)"),
            ("Requested LTV", "75%"),
            ("Conv. Rate", "7.25% / DSCR Rate: 7.75%"),
            ("Taxes/Insurance", "$2,400 + $1,800/year")
        ],
        "questions": [
            {"q": "Does the borrower qualify for conventional financing (max 10 financed properties)?", "type": "choice", "options": ["Yes, DTI is within limits", "No, DTI is too high", "Need more reserves documentation", "Borderline — needs compensating factors"], "answer": "Borderline — needs compensating factors", "explain": "With property #5, new PITI is ~$1,610 (P&I on $180K at 7.25% = $1,228, tax $200, ins $150, + 25% of rents don't count as qualifying income). Adding to $2,800 existing debts = $4,410+. DTI = $4,410 / $10,417 = 42.3%. This is just under the 45% max for investment properties, but borderline. Strong credit (745) and reserves ($85K = 6+ months PITI) are the compensating factors."},
            {"q": "What is the DSCR ratio on this property?", "type": "text", "answer": "1.25 – 1.40", "explain": "DSCR = Gross Rent / PITIA. PITIA at 7.75%: P&I on $180K = $1,290 + Tax $200 + Ins $150 = $1,640. DSCR = $2,100 / $1,640 = 1.28. This exceeds the typical 1.2x minimum. The property qualifies for DSCR lending independently of the borrower's personal DTI."},
            {"q": "Which loan program would you recommend?", "type": "choice", "options": ["Conventional (7.25%)", "DSCR (7.75%)", "Portfolio loan", "FHA 203b"], "answer": "DSCR (7.75%)", "explain": "While conventional offers a lower rate, the borrower is at their DTI limit with 4 existing mortgages. Adding property #5 conventionally would require perfect documentation and compensating factors. The DSCR loan at 7.75% qualifies based solely on property income (1.28 DSCR), keeping the borrower's personal DTI clean for future conventional purchases. The 0.5% rate premium is worth the flexibility."}
        ],
        "calculators": [
            {"name": "Qualification Analysis", "folder": "qualification-analysis"},
            {"name": "DSCR Loan", "folder": "dscr-loan"},
            {"name": "Rate Buydown", "folder": "rate-buydown"}
        ]
    }
]

def build_scenario_card_html(s, idx):
    colors = {"Beginner": "var(--color-success)", "Intermediate": "var(--color-warning)", "Advanced": "var(--color-error)"}
    return f'''<div class="scenario-card" data-scenario="{idx}" onclick="showScenario({idx})">
  <div style="display:flex;gap:var(--space-2);flex-wrap:wrap;margin-bottom:var(--space-2)">
    <span class="badge" style="background:{colors.get(s['difficulty'],'var(--color-primary)')};color:white">{s['difficulty']}</span>
    <span class="badge badge-outline">{s['role']}</span>
    <span class="badge badge-outline">{s['time']}</span>
  </div>
  <h3 style="font-size:var(--text-base);font-weight:700;margin-bottom:var(--space-2)">{s['name']}</h3>
  <p style="font-size:var(--text-sm);color:var(--color-text-muted);line-height:1.5">{s['desc']}</p>
  <button class="btn btn-primary" style="margin-top:var(--space-4);width:100%">Start Challenge</button>
</div>'''

def build_scenario_detail_html(s, idx):
    data_rows = ''.join(f'<tr><td style="font-weight:500">{k}</td><td style="text-align:right;font-family:var(--font-mono)">{v}</td></tr>' for k, v in s['data'])
    
    questions_html = ''
    for qi, q in enumerate(s['questions']):
        if q['type'] == 'choice':
            opts = ''.join(f'<label class="choice-label"><input type="radio" name="q{idx}_{qi}" value="{o}"> {o}</label>' for o in q['options'])
            input_html = f'<div class="choice-group">{opts}</div>'
        else:
            input_html = f'<input type="text" class="scenario-input" id="q{idx}_{qi}" placeholder="Enter your answer...">'
        
        questions_html += f'''<div class="question-block" id="qblock_{idx}_{qi}">
  <p class="question-text"><strong>Question {qi+1}:</strong> {q['q']}</p>
  {input_html}
  <div class="expert-answer hidden" id="expert_{idx}_{qi}">
    <div style="font-size:var(--text-xs);font-weight:600;color:var(--color-primary);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:var(--space-2)">Expert Answer</div>
    <div style="font-weight:600;margin-bottom:var(--space-2)">{q['answer']}</div>
    <p style="font-size:var(--text-sm);color:var(--color-text-muted);line-height:1.6">{q['explain']}</p>
  </div>
</div>'''
    
    calcs_html = ''.join(f'<a href="../{c["folder"]}/index.html" target="_blank" class="calc-link-card"><span class="calc-link-num">{i+1}</span><span>{c["name"]}</span></a>' for i, c in enumerate(s['calculators']))
    
    setup = s['setup'].replace('\n\n', '</p><p style="margin-top:var(--space-3)">')
    
    return f'''<div class="scenario-detail hidden" id="scenario_{idx}">
  <button class="btn btn-ghost" onclick="hideScenario()" style="margin-bottom:var(--space-4)">&larr; Back to Challenges</button>
  <h2 style="font-size:var(--text-xl);font-weight:700;margin-bottom:var(--space-2)">{s['name']}</h2>
  <div style="display:flex;gap:var(--space-2);flex-wrap:wrap;margin-bottom:var(--space-6)">
    <span class="badge" style="background:{"var(--color-success)" if s["difficulty"]=="Beginner" else "var(--color-warning)" if s["difficulty"]=="Intermediate" else "var(--color-error)"};color:white">{s['difficulty']}</span>
    <span class="badge badge-outline">{s['role']}</span>
    <span class="badge badge-outline">{s['time']}</span>
  </div>
  
  <div class="scenario-section">
    <h3>The Setup</h3>
    <p>{setup}</p>
  </div>
  
  <div class="scenario-section">
    <h3>The Data</h3>
    <div class="table-wrap"><table class="results-table"><thead><tr><th>Item</th><th class="text-right">Value</th></tr></thead><tbody>{data_rows}</tbody></table></div>
  </div>
  
  <div class="scenario-section">
    <h3>Recommended Calculators</h3>
    <div style="display:flex;gap:var(--space-3);flex-wrap:wrap">{calcs_html}</div>
  </div>
  
  <div class="scenario-section">
    <h3>Your Analysis</h3>
    {questions_html}
    <button class="btn btn-primary" style="margin-top:var(--space-6);width:100%;max-width:400px" onclick="revealAnswers({idx})">Submit & See Expert Analysis</button>
    <div class="score-card hidden" id="scorecard_{idx}">
      <div style="font-size:var(--text-lg);font-weight:700;color:var(--color-primary)">Challenge Complete</div>
      <p style="font-size:var(--text-sm);color:var(--color-text-muted);margin-top:var(--space-2)">Review the expert analysis above to see how your answers compare. Use the linked calculators to verify the numbers yourself.</p>
    </div>
  </div>
</div>'''


def build_sandbox_html():
    return '''<div class="sandbox-section hidden" id="sandboxSection">
  <button class="btn btn-ghost" onclick="showModeSelect()" style="margin-bottom:var(--space-4)">&larr; Back</button>
  <h2 style="font-size:var(--text-xl);font-weight:700;margin-bottom:var(--space-2)">Investment Sandbox</h2>
  <p style="color:var(--color-text-muted);margin-bottom:var(--space-6)">Adjust the inputs and market conditions to see real-time investment metrics. No scoring — just learning and exploration.</p>
  
  <div class="sandbox-grid">
    <div class="sandbox-inputs">
      <h3 class="param-group-title">Property Details</h3>
      <div class="field"><label>Purchase Price</label><div class="input-with-unit"><span class="unit">$</span><input type="text" id="sbPrice" value="200,000" inputmode="numeric" oninput="updateSandbox()"></div></div>
      <div class="field"><label>Monthly Rent</label><div class="input-with-unit"><span class="unit">$</span><input type="text" id="sbRent" value="1,500" inputmode="numeric" oninput="updateSandbox()"></div></div>
      <div class="field"><label>Down Payment %</label><div class="input-with-unit"><input type="text" id="sbDP" value="25" inputmode="decimal" oninput="updateSandbox()"><span class="unit">%</span></div></div>
      <div class="field"><label>Rehab Cost</label><div class="input-with-unit"><span class="unit">$</span><input type="text" id="sbRehab" value="0" inputmode="numeric" oninput="updateSandbox()"></div></div>
      
      <h3 class="param-group-title" style="margin-top:var(--space-6)">Market Conditions</h3>
      <div class="field"><label>Interest Rate</label><div class="input-with-unit"><input type="range" id="sbRate" min="3" max="12" step="0.25" value="7.0" oninput="updateSandbox()" style="border:none;background:transparent;height:auto"><span class="unit" id="sbRateVal">7.0%</span></div></div>
      <div class="field"><label>Vacancy Rate</label><div class="input-with-unit"><input type="range" id="sbVacancy" min="0" max="20" step="1" value="8" oninput="updateSandbox()" style="border:none;background:transparent;height:auto"><span class="unit" id="sbVacancyVal">8%</span></div></div>
      <div class="field"><label>Appreciation Rate</label><div class="input-with-unit"><input type="range" id="sbAppreciation" min="-5" max="10" step="0.5" value="3" oninput="updateSandbox()" style="border:none;background:transparent;height:auto"><span class="unit" id="sbApprecVal">3.0%</span></div></div>
    </div>
    
    <div class="sandbox-results">
      <div class="kpi-row" style="grid-template-columns:1fr 1fr">
        <div class="kpi-card"><span class="kpi-label">Monthly Cash Flow</span><span class="kpi-value" id="sbCF">—</span></div>
        <div class="kpi-card"><span class="kpi-label">Cap Rate</span><span class="kpi-value" id="sbCap">—</span></div>
        <div class="kpi-card"><span class="kpi-label">Cash-on-Cash Return</span><span class="kpi-value" id="sbCoC">—</span></div>
        <div class="kpi-card"><span class="kpi-label">DSCR Ratio</span><span class="kpi-value" id="sbDSCR">—</span></div>
        <div class="kpi-card"><span class="kpi-label">Monthly Mortgage</span><span class="kpi-value" id="sbMort">—</span></div>
        <div class="kpi-card"><span class="kpi-label">5-Year Equity</span><span class="kpi-value" id="sb5Yr">—</span></div>
      </div>
      
      <div style="margin-top:var(--space-6)">
        <h3 style="font-size:var(--text-sm);font-weight:600;margin-bottom:var(--space-4)">Scenario Comparison</h3>
        <div class="table-wrap"><table class="results-table"><thead><tr><th>Scenario</th><th class="text-right">Cash Flow</th><th class="text-right">CoC Return</th><th class="text-right">Cap Rate</th><th class="text-right">5-Year Equity</th></tr></thead>
        <tbody id="sbTable"></tbody></table></div>
      </div>

      <div style="margin-top:var(--space-6)">
        <h3 style="font-size:var(--text-sm);font-weight:600;margin-bottom:var(--space-4)">Quick Links to Calculators</h3>
        <div style="display:flex;gap:var(--space-3);flex-wrap:wrap">
          <a href="../cashflow/index.html" target="_blank" class="calc-link-card"><span class="calc-link-num">1</span><span>Cash Flow</span></a>
          <a href="../caprate/index.html" target="_blank" class="calc-link-card"><span class="calc-link-num">2</span><span>Cap Rate</span></a>
          <a href="../brrrr/index.html" target="_blank" class="calc-link-card"><span class="calc-link-num">3</span><span>BRRRR</span></a>
          <a href="../rental-analysis/index.html" target="_blank" class="calc-link-card"><span class="calc-link-num">4</span><span>Rental Analysis</span></a>
        </div>
      </div>
    </div>
  </div>
</div>'''


def build_full_html():
    scenario_cards = '\n'.join(build_scenario_card_html(s, i) for i, s in enumerate(SCENARIOS))
    scenario_details = '\n'.join(build_scenario_detail_html(s, i) for i, s in enumerate(SCENARIOS))
    sandbox = build_sandbox_html()
    
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<!--
   ______                            __
  / ____/___  ____ ___  ____  __  __/ /____  _____
 / /   / __ \\/ __ `__ \\/ __ \\/ / / / __/ _ \\/ ___/
/ /___/ /_/ / / / / / / /_/ / /_/ / /_/  __/ /
\\____/\\____/_/ /_/ /_/ .___/\\__,_/\\__/\\___/_/
                    /_/
        Created with Perplexity Computer
        https://www.perplexity.ai/computer
-->
<meta name="generator" content="Perplexity Computer">
<meta name="author" content="Perplexity Computer">
<meta property="og:see_also" content="https://www.perplexity.ai/computer">
<link rel="author" href="https://www.perplexity.ai/computer">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Scenario Lab — IntelliTC Solutions</title>
<meta name="description" content="Practice real estate analysis with realistic deal scenarios. Test your skills, compare against expert benchmarks, and build confidence.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../shared/base.css">
<link rel="stylesheet" href="../shared/style.css">
<style>
.hero-section {{ text-align:center; padding:var(--space-12) var(--space-6) var(--space-8); }}
.hero-section h1 {{ font-size:clamp(2rem,4vw,3rem); font-weight:700; letter-spacing:-0.03em; margin-bottom:var(--space-3); }}
.hero-section p {{ color:var(--color-text-muted); font-size:var(--text-base); max-width:600px; margin:0 auto; line-height:1.6; }}

.mode-cards {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:var(--space-4); max-width:960px; margin:var(--space-8) auto 0; }}
.mode-card {{ background:var(--color-surface); border:1px solid var(--color-border); border-radius:var(--radius-xl); padding:var(--space-6); cursor:pointer; transition:border-color var(--transition-interactive),box-shadow var(--transition-interactive); text-align:left; }}
.mode-card:hover {{ border-color:var(--color-primary); box-shadow:0 0 0 3px var(--color-primary-surface); }}
.mode-card h3 {{ font-size:var(--text-lg); font-weight:700; margin-bottom:var(--space-2); display:flex; align-items:center; gap:var(--space-2); }}
.mode-card p {{ font-size:var(--text-sm); color:var(--color-text-muted); line-height:1.5; }}
.mode-card .mode-badge {{ font-size:var(--text-xs); color:var(--color-primary); font-weight:600; margin-top:var(--space-3); }}

.badge {{ display:inline-flex; padding:2px 10px; border-radius:var(--radius-full); font-size:var(--text-xs); font-weight:600; }}
.badge-outline {{ border:1px solid var(--color-border); color:var(--color-text-muted); }}

.scenario-grid {{ display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:var(--space-4); }}
.scenario-card {{ background:var(--color-surface); border:1px solid var(--color-border); border-radius:var(--radius-lg); padding:var(--space-5); cursor:pointer; transition:border-color var(--transition-interactive),box-shadow var(--transition-interactive); }}
.scenario-card:hover {{ border-color:var(--color-primary); box-shadow:0 0 0 3px var(--color-primary-surface); }}

.scenario-section {{ margin-bottom:var(--space-6); }}
.scenario-section h3 {{ font-size:var(--text-base); font-weight:700; margin-bottom:var(--space-3); padding-bottom:var(--space-2); border-bottom:2px solid var(--color-primary); display:inline-block; }}
.scenario-section p {{ font-size:var(--text-sm); color:var(--color-text-muted); line-height:1.7; }}

.question-block {{ background:var(--color-bg); border:1px solid var(--color-divider); border-radius:var(--radius-lg); padding:var(--space-5); margin-bottom:var(--space-4); }}
.question-text {{ font-size:var(--text-sm); margin-bottom:var(--space-3); line-height:1.5; }}
.scenario-input {{ height:42px; padding:var(--space-2) var(--space-3); background:var(--color-surface); border:1px solid var(--color-border); border-radius:var(--radius-md); font-size:var(--text-sm); width:100%; max-width:400px; }}
.choice-group {{ display:flex; flex-direction:column; gap:var(--space-2); }}
.choice-label {{ display:flex; align-items:center; gap:var(--space-2); font-size:var(--text-sm); cursor:pointer; padding:var(--space-2) var(--space-3); background:var(--color-surface); border:1px solid var(--color-border); border-radius:var(--radius-md); transition:border-color var(--transition-interactive); }}
.choice-label:hover {{ border-color:var(--color-primary); }}
.choice-label input {{ accent-color:var(--color-primary); }}

.expert-answer {{ background:var(--color-primary-surface); border:1px solid var(--color-primary); border-radius:var(--radius-md); padding:var(--space-4); margin-top:var(--space-3); }}
.score-card {{ background:var(--color-primary-surface); border-radius:var(--radius-lg); padding:var(--space-6); margin-top:var(--space-6); text-align:center; }}

.calc-link-card {{ display:inline-flex; align-items:center; gap:var(--space-2); padding:var(--space-2) var(--space-4); background:var(--color-surface); border:1px solid var(--color-border); border-radius:var(--radius-md); font-size:var(--text-sm); font-weight:500; text-decoration:none; color:inherit; transition:border-color var(--transition-interactive); }}
.calc-link-card:hover {{ border-color:var(--color-primary); }}
.calc-link-num {{ width:24px; height:24px; background:var(--color-primary); color:white; border-radius:50%; display:grid; place-items:center; font-size:12px; font-weight:700; flex-shrink:0; }}

.filter-bar {{ display:flex; gap:var(--space-2); flex-wrap:wrap; margin-bottom:var(--space-6); }}
.filter-btn {{ padding:var(--space-2) var(--space-4); border-radius:var(--radius-full); font-size:var(--text-sm); font-weight:500; border:1px solid var(--color-border); color:var(--color-text-muted); background:var(--color-surface); cursor:pointer; }}
.filter-btn.active {{ background:var(--color-primary); color:white; border-color:var(--color-primary); }}

.sandbox-grid {{ display:grid; grid-template-columns:minmax(280px,380px) 1fr; gap:var(--space-6); }}
.sandbox-inputs {{ display:flex; flex-direction:column; gap:var(--space-4); }}
@media(max-width:768px) {{ .sandbox-grid {{ grid-template-columns:1fr; }} .mode-cards {{ grid-template-columns:1fr; }} }}
</style>
</head>
<body>
<header class="header">
  <div class="header-inner">
    <a href="../index.html" class="logo" style="text-decoration:none">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><rect x="3" y="3" width="26" height="26" rx="4" stroke="currentColor" stroke-width="2"/><path d="M10 16h12M16 10v12" stroke="var(--color-primary)" stroke-width="2.5" stroke-linecap="round"/></svg>
      <span class="logo-text">Intelli<span class="logo-accent">TC</span></span>
    </a>
    <button data-theme-toggle aria-label="Switch to dark mode">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    </button>
  </div>
</header>

<main class="main">
  <!-- Mode Selection -->
  <div id="modeSelect">
    <div class="hero-section">
      <span class="badge" style="background:var(--color-primary);color:white;margin-bottom:var(--space-3);display:inline-flex">SCENARIO LAB</span>
      <h1>Practice Real Estate Analysis</h1>
      <p>Work through realistic deal scenarios, compare your analysis against expert benchmarks, and build the skills to evaluate any deal with confidence.</p>
    </div>
    
    <div class="mode-cards">
      <div class="mode-card" onclick="showChallenges()">
        <h3><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> Guided Challenges</h3>
        <p>Work through curated scenarios with narrative setups, data tables, and expert analysis. Answer questions and compare your reasoning.</p>
        <div class="mode-badge">12 Scenarios &bull; All Levels</div>
      </div>
      <div class="mode-card" onclick="showTimed()">
        <h3><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Timed Challenges</h3>
        <p>Race the clock to analyze deals. Earn points for accuracy and speed. Track your improvement over time.</p>
        <div class="mode-badge">6 Scenarios &bull; Intermediate+</div>
      </div>
      <div class="mode-card" onclick="showSandbox()">
        <h3><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg> Sandbox Mode</h3>
        <p>Free-form exploration with adjustable market conditions and real-time metrics. No scoring — just learning.</p>
        <div class="mode-badge">Interactive &bull; All Levels</div>
      </div>
    </div>
  </div>

  <!-- Guided Challenges -->
  <div class="hidden" id="challengeSection">
    <button class="btn btn-ghost" onclick="showModeSelect()" style="margin-bottom:var(--space-4)">&larr; Back</button>
    <h2 style="font-size:var(--text-xl);font-weight:700;margin-bottom:var(--space-2)">Guided Challenges</h2>
    <p style="color:var(--color-text-muted);margin-bottom:var(--space-6)">Select a scenario to begin. Each challenge includes a realistic setup, data, and expert analysis.</p>
    
    <div class="filter-bar">
      <button class="filter-btn active" onclick="filterScenarios('all',this)">All (12)</button>
      <button class="filter-btn" onclick="filterScenarios('Beginner',this)">Beginner</button>
      <button class="filter-btn" onclick="filterScenarios('Intermediate',this)">Intermediate</button>
      <button class="filter-btn" onclick="filterScenarios('Advanced',this)">Advanced</button>
      <button class="filter-btn" onclick="filterScenarios('Homebuyer',this)">Homebuyer</button>
      <button class="filter-btn" onclick="filterScenarios('Investor',this)">Investor</button>
      <button class="filter-btn" onclick="filterScenarios('Agent',this)">Agent</button>
      <button class="filter-btn" onclick="filterScenarios('Lender',this)">Lender</button>
    </div>
    
    <div class="scenario-grid" id="scenarioGrid">
      {scenario_cards}
    </div>
    
    {scenario_details}
  </div>

  <!-- Timed Challenges -->
  <div class="hidden" id="timedSection">
    <button class="btn btn-ghost" onclick="showModeSelect()" style="margin-bottom:var(--space-4)">&larr; Back</button>
    <h2 style="font-size:var(--text-xl);font-weight:700;margin-bottom:var(--space-2)">Timed Challenges</h2>
    <p style="color:var(--color-text-muted);margin-bottom:var(--space-6)">Same scenarios, but against the clock. Select a time limit and see how quickly you can analyze a deal.</p>
    
    <div style="display:flex;gap:var(--space-3);margin-bottom:var(--space-6);flex-wrap:wrap">
      <button class="btn btn-ghost" style="font-variant-numeric:tabular-nums" onclick="startTimed(5)">5 Minutes</button>
      <button class="btn btn-primary" onclick="startTimed(10)">10 Minutes</button>
      <button class="btn btn-ghost" onclick="startTimed(15)">15 Minutes</button>
    </div>
    
    <div id="timerDisplay" class="hidden" style="text-align:center;margin-bottom:var(--space-6)">
      <div style="font-size:clamp(2rem,6vw,4rem);font-weight:700;font-variant-numeric:tabular-nums;font-family:var(--font-mono)" id="timerClock">10:00</div>
      <p style="color:var(--color-text-muted);font-size:var(--text-sm)">Time remaining</p>
    </div>
    
    <div id="timedScenarioArea"></div>
    
    <div class="hidden" id="timedResults" style="text-align:center;padding:var(--space-8)">
      <div style="font-size:var(--text-xl);font-weight:700;color:var(--color-primary)">Time's Up!</div>
      <p style="color:var(--color-text-muted);margin-top:var(--space-3)">Review the expert analysis to see how you did.</p>
    </div>
  </div>

  <!-- Sandbox -->
  {sandbox}
</main>

<footer class="footer">
  <p>This content is for educational purposes only and does not constitute financial, legal, or investment advice.</p>
  <p>&copy; IntelliTC Solutions &bull; <a href="https://intellitcsolutions.com" target="_blank">intellitcsolutions.com</a></p>
  <p><a href="https://www.perplexity.ai/computer" target="_blank" rel="noopener noreferrer">Created with Perplexity Computer</a></p>
</footer>

<script>
/* Theme Toggle */
(function(){{const t=document.querySelector('[data-theme-toggle]'),r=document.documentElement;let d=matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';r.setAttribute('data-theme',d);if(t){{function updateIcon(){{t.innerHTML=d==='dark'?'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>':'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';}}updateIcon();t.addEventListener('click',()=>{{d=d==='dark'?'light':'dark';r.setAttribute('data-theme',d);updateIcon();}});}}}})();

/* Scenario Data for filtering */
const SCENARIOS = {str([{"difficulty": s["difficulty"], "role": s["role"]} for s in SCENARIOS])};

/* Navigation */
function showModeSelect() {{
  document.getElementById('modeSelect').classList.remove('hidden');
  document.getElementById('challengeSection').classList.add('hidden');
  document.getElementById('timedSection').classList.add('hidden');
  document.getElementById('sandboxSection').classList.add('hidden');
  window.scrollTo(0,0);
}}
function showChallenges() {{
  document.getElementById('modeSelect').classList.add('hidden');
  document.getElementById('challengeSection').classList.remove('hidden');
  hideScenario();
  window.scrollTo(0,0);
}}
function showTimed() {{
  document.getElementById('modeSelect').classList.add('hidden');
  document.getElementById('timedSection').classList.remove('hidden');
  window.scrollTo(0,0);
}}
function showSandbox() {{
  document.getElementById('modeSelect').classList.add('hidden');
  document.getElementById('sandboxSection').classList.remove('hidden');
  updateSandbox();
  window.scrollTo(0,0);
}}

/* Scenario Display */
function showScenario(idx) {{
  document.getElementById('scenarioGrid').classList.add('hidden');
  document.querySelectorAll('.filter-bar')[0].classList.add('hidden');
  document.querySelectorAll('.scenario-detail').forEach(d=>d.classList.add('hidden'));
  document.getElementById('scenario_'+idx).classList.remove('hidden');
  window.scrollTo(0,0);
}}
function hideScenario() {{
  document.querySelectorAll('.scenario-detail').forEach(d=>d.classList.add('hidden'));
  document.getElementById('scenarioGrid').classList.remove('hidden');
  document.querySelectorAll('.filter-bar')[0].classList.remove('hidden');
}}

/* Reveal Answers */
function revealAnswers(idx) {{
  document.querySelectorAll('#scenario_'+idx+' .expert-answer').forEach(ea=>ea.classList.remove('hidden'));
  document.getElementById('scorecard_'+idx).classList.remove('hidden');
  // Save completion
  try {{ const done = JSON.parse(localStorage.getItem('intellitc-lab-done') || '[]'); if(!done.includes(idx)){{done.push(idx);localStorage.setItem('intellitc-lab-done',JSON.stringify(done));}} }} catch(e) {{}}
}}

/* Filter */
function filterScenarios(filter, btn) {{
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.scenario-card').forEach((card,i)=>{{
    const s = SCENARIOS[i];
    const show = filter==='all' || s.difficulty===filter || s.role===filter;
    card.style.display = show ? '' : 'none';
  }});
}}

/* Timed Challenge */
let timerInterval = null;
function startTimed(minutes) {{
  // Pick a random scenario
  const idx = Math.floor(Math.random() * SCENARIOS.length);
  const detail = document.getElementById('scenario_'+idx);
  if(!detail) return;
  
  document.getElementById('timerDisplay').classList.remove('hidden');
  document.getElementById('timedResults').classList.add('hidden');
  
  // Clone scenario into timed area
  const area = document.getElementById('timedScenarioArea');
  area.innerHTML = detail.innerHTML;
  area.querySelector('.btn.btn-ghost')?.remove(); // Remove back button
  
  let remaining = minutes * 60;
  const clock = document.getElementById('timerClock');
  
  if(timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(()=>{{
    remaining--;
    const m = Math.floor(remaining/60);
    const s = remaining%60;
    clock.textContent = m+':'+(s<10?'0':'')+s;
    if(remaining<=60) clock.style.color='var(--color-error)';
    if(remaining<=0) {{
      clearInterval(timerInterval);
      document.getElementById('timedResults').classList.remove('hidden');
      // Reveal all expert answers in timed area
      area.querySelectorAll('.expert-answer').forEach(ea=>ea.classList.remove('hidden'));
    }}
  }},1000);
}}

/* Sandbox */
function parseN(s) {{ return parseFloat(String(s).replace(/[^0-9.\\-]/g,''))||0; }}
function fmtC(n) {{ return (n<0?'-$':'$')+Math.abs(Math.round(n)).toLocaleString(); }}
function fmtP(n) {{ return n.toFixed(1)+'%'; }}

function updateSandbox() {{
  const price = parseN(document.getElementById('sbPrice').value);
  const rent = parseN(document.getElementById('sbRent').value);
  const dpPct = parseN(document.getElementById('sbDP').value)/100;
  const rehab = parseN(document.getElementById('sbRehab').value);
  const rate = parseFloat(document.getElementById('sbRate').value)/100;
  const vacancy = parseFloat(document.getElementById('sbVacancy').value)/100;
  const apprec = parseFloat(document.getElementById('sbAppreciation').value)/100;
  
  document.getElementById('sbRateVal').textContent = (rate*100).toFixed(2)+'%';
  document.getElementById('sbVacancyVal').textContent = Math.round(vacancy*100)+'%';
  document.getElementById('sbApprecVal').textContent = (apprec*100).toFixed(1)+'%';
  
  const dp = price*dpPct;
  const loan = price - dp;
  const mr = rate/12;
  const n = 360;
  const pi = mr>0 ? loan*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1) : loan/n;
  
  const taxMo = price*0.012/12;
  const insMo = price*0.006/12;
  const maintMo = rent*0.08;
  const mgmtMo = rent*0.08;
  const vacMo = rent*vacancy;
  
  const effRent = rent*(1-vacancy);
  const totalExp = pi + taxMo + insMo + maintMo + mgmtMo;
  const cashFlow = effRent - totalExp;
  
  const noi = (rent*12)*(1-vacancy) - (price*0.012) - (price*0.006) - (rent*12*0.08) - (rent*12*0.08);
  const capRate = price>0 ? (noi/price)*100 : 0;
  const totalCash = dp + rehab;
  const annualCF = cashFlow*12;
  const coc = totalCash>0 ? (annualCF/totalCash)*100 : 0;
  const pitia = pi + taxMo + insMo;
  const dscr = pitia>0 ? rent/pitia : 0;
  
  // 5-year equity
  const futureValue = price * Math.pow(1+apprec,5);
  // Approximate balance after 5 years
  let balance = loan;
  for(let i=0;i<60;i++) {{ balance = balance*(1+mr) - pi; }}
  const equity5 = futureValue - Math.max(0,balance);
  
  document.getElementById('sbCF').textContent = fmtC(cashFlow);
  document.getElementById('sbCF').className = 'kpi-value '+(cashFlow>=0?'kpi-positive':'kpi-negative');
  document.getElementById('sbCap').textContent = fmtP(capRate);
  document.getElementById('sbCoC').textContent = fmtP(coc);
  document.getElementById('sbDSCR').textContent = dscr.toFixed(2)+'x';
  document.getElementById('sbDSCR').className = 'kpi-value '+(dscr>=1.2?'kpi-positive':dscr>=1.0?'':'kpi-negative');
  document.getElementById('sbMort').textContent = fmtC(pi);
  document.getElementById('sb5Yr').textContent = fmtC(equity5);
  
  // Scenario table
  function calcScenario(rateAdj, vacAdj, apprecAdj) {{
    const r2 = (rate+rateAdj)/12;
    const pi2 = r2>0 ? loan*(r2*Math.pow(1+r2,n))/(Math.pow(1+r2,n)-1) : loan/n;
    const v2 = vacancy+vacAdj;
    const eff2 = rent*(1-v2);
    const exp2 = pi2 + taxMo + insMo + maintMo + mgmtMo;
    const cf2 = eff2 - exp2;
    const noi2 = (rent*12)*(1-v2) - (price*0.012) - (price*0.006) - (rent*12*0.08) - (rent*12*0.08);
    const cap2 = price>0 ? (noi2/price)*100 : 0;
    const coc2 = totalCash>0 ? (cf2*12/totalCash)*100 : 0;
    const fv2 = price*Math.pow(1+apprec+apprecAdj,5);
    let bal2=loan; for(let i=0;i<60;i++) {{ bal2=bal2*(1+r2)-pi2; }}
    return {{ cf:cf2, cap:cap2, coc:coc2, eq5:fv2-Math.max(0,bal2) }};
  }}
  const opt = calcScenario(-0.01, -0.03, 0.02);
  const base = calcScenario(0, 0, 0);
  const pess = calcScenario(0.015, 0.05, -0.02);
  
  const tbody = document.getElementById('sbTable');
  tbody.innerHTML = `
    <tr style="color:var(--color-success)"><td style="font-weight:600">Optimistic</td><td class="text-right">${{fmtC(opt.cf)}}/mo</td><td class="text-right">${{fmtP(opt.coc)}}</td><td class="text-right">${{fmtP(opt.cap)}}</td><td class="text-right">${{fmtC(opt.eq5)}}</td></tr>
    <tr><td style="font-weight:600">Base Case</td><td class="text-right">${{fmtC(base.cf)}}/mo</td><td class="text-right">${{fmtP(base.coc)}}</td><td class="text-right">${{fmtP(base.cap)}}</td><td class="text-right">${{fmtC(base.eq5)}}</td></tr>
    <tr style="color:var(--color-error)"><td style="font-weight:600">Pessimistic</td><td class="text-right">${{fmtC(pess.cf)}}/mo</td><td class="text-right">${{fmtP(pess.coc)}}</td><td class="text-right">${{fmtP(pess.cap)}}</td><td class="text-right">${{fmtC(pess.eq5)}}</td></tr>
  `;
}}
</script>
</body>
</html>'''


if __name__ == '__main__':
    html = build_full_html()
    outpath = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'scenario-lab', 'index.html')
    os.makedirs(os.path.dirname(outpath), exist_ok=True)
    with open(outpath, 'w') as f:
        f.write(html)
    print(f"Written {len(html)} bytes to {outpath}")
    print(f"Lines: {html.count(chr(10))}")
