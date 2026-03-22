#!/usr/bin/env python3
"""
Build script to inject Learn Mode into all 47 IntelliTC calculators.
Adds learn-mode.css, learn-mode.js, and LEARN_DATA definitions.
"""

import os, json, re

BASE = os.path.dirname(os.path.abspath(__file__))

# ============================================================
# EDUCATIONAL CONTENT FOR ALL 47 CALCULATORS
# ============================================================

LEARN_CONTENT = {
    "affordability": {
        "tooltips": {
            "income": "<strong>Annual Gross Income</strong> — Your total household income before taxes. Include all W-2 wages, self-employment income, and any recurring sources like alimony or Social Security. Lenders use gross (pre-tax) income, not take-home pay.",
            "debts": "<strong>Monthly Debt Payments</strong> — Add up minimums on car loans, student loans, credit cards, personal loans, and child support. Do NOT include utilities, groceries, or subscriptions — lenders only count debts that appear on your credit report.",
            "rate": "<strong>Interest Rate</strong> — The current mortgage rate you'd qualify for. Even a 0.5% difference can shift your buying power by $20K–$40K. Check current rates at Freddie Mac's PMMS.",
            "term": "<strong>Loan Term</strong> — 30-year terms give lower payments but cost more in total interest. A 15-year term saves tens of thousands in interest but requires higher monthly payments.",
            "dp": "<strong>Down Payment Available</strong> — Cash you can put toward the purchase. 20% avoids PMI (private mortgage insurance). FHA loans allow as low as 3.5%. VA loans may require 0% down.",
            "taxRate": "<strong>Property Tax Rate</strong> — Varies by county. U.S. average is ~1.1%. Texas and New Jersey exceed 2%, while Hawaii is under 0.3%. Check your target county's assessor website.",
            "insYr": "<strong>Insurance / Year</strong> — Annual homeowner's insurance premium. Averages $1,500–$2,500 nationally. Flood zones, hurricane areas, and high-value homes cost significantly more.",
            "hoa": "<strong>HOA / Month</strong> — Homeowner Association dues for condos or planned communities. Can range from $100 to $1,000+/month. This directly reduces how much house you can afford."
        },
        "examples": [
            {"name": "First-Time Buyer, Midwest", "desc": "$55K income, minimal debt, small savings — typical starter home search", "values": {"income": 55000, "debts": 200, "rate": "6.75", "term": "30", "dp": 15000, "taxRate": "1.1", "insYr": 1400, "hoa": 0}},
            {"name": "Dual Income, Coastal City", "desc": "$145K combined income, student loans, saving for competitive market", "values": {"income": 145000, "debts": 850, "rate": "6.5", "term": "30", "dp": 60000, "taxRate": "1.4", "insYr": 2400, "hoa": 350}},
            {"name": "VA Loan Eligible Veteran", "desc": "$75K income, no down payment needed, low debt — VA benefit in action", "values": {"income": 75000, "debts": 300, "rate": "6.0", "term": "30", "dp": 0, "taxRate": "1.0", "insYr": 1600, "hoa": 0}}
        ],
        "whyThisMatters": {
            "title": "Why Use the Affordability Calculator?",
            "purpose": "This calculator shows you the maximum home price you can afford based on your income, debts, and down payment — using the same DTI (Debt-to-Income) ratios that real lenders use to approve or deny your mortgage.",
            "whenToUse": [
                "Before you start house hunting — know your price ceiling so you don't waste time on homes outside your budget",
                "When your financial situation changes — raise, new car payment, or paying off student loans",
                "To compare conservative vs. aggressive scenarios — understand the trade-off between comfort and buying power"
            ],
            "keyInsight": "Lenders look at two DTI ratios: Front-end (housing costs ÷ income) and Back-end (all debts + housing ÷ income). Most conventional loans cap back-end DTI at 43%. Going above that doesn't mean you can't get a loan, but it means you'll be financially stretched.",
            "proTip": "The 'Moderate' scenario (28% front / 43% back) represents the maximum most lenders will approve. The 'Conservative' scenario (25% / 36%) is what financial advisors recommend for comfortable living. Start with Conservative — you can always stretch if needed."
        },
        "kpiExplains": {
            "kpiMaxPrice": "This is the <strong>highest purchase price</strong> a lender would likely approve at the Moderate DTI level. It factors in your down payment, interest rate, taxes, and insurance — not just your income.",
            "kpiPayment": "Your estimated <strong>total monthly housing cost</strong> — principal, interest, property tax, insurance, and HOA combined. This is the number to compare against your actual monthly budget.",
            "kpiCashClose": "The <strong>total cash you'll need at closing</strong> — your down payment plus approximately 3% in closing costs (lender fees, title insurance, appraisal, etc.).",
            "kpiRating": "How <strong>comfortable</strong> this mortgage would be relative to your income. 'Very Comfortable' means plenty of breathing room. 'Stretched' means you'll feel the payments."
        },
        "coupled": [
            {"name": "DTI Stress Test", "folder": "dti-stress-test", "reason": "See how rate increases would impact your payment and DTI ratios over time"},
            {"name": "Cash to Close", "folder": "cash-to-close", "reason": "Get a detailed breakdown of every dollar you'll need at the closing table"},
            {"name": "Qualification Analysis", "folder": "qualification-analysis", "reason": "Check which specific loan programs (FHA, VA, Conventional) you qualify for"},
            {"name": "True Cost of Ownership", "folder": "true-cost-ownership", "reason": "See the full monthly cost beyond just the mortgage — maintenance, utilities, and more"}
        ]
    },

    "dti-stress-test": {
        "tooltips": {
            "income": "<strong>Annual Gross Income</strong> — Your total pre-tax household income. This is the denominator in the DTI ratio — a higher income means a lower DTI at the same payment level.",
            "homePrice": "<strong>Home Price</strong> — The purchase price of the home you're considering. This drives your loan amount and therefore your monthly payment.",
            "downPayment": "<strong>Down Payment</strong> — Cash paid upfront. A larger down payment means a smaller loan, which means a lower monthly payment and better DTI ratio.",
            "currentRate": "<strong>Current Interest Rate</strong> — Today's mortgage rate. The stress test shows what happens if rates rise 1% and 2% from this starting point.",
            "loanTerm": "<strong>Loan Term</strong> — Number of years to repay. 30 years = lower payments. 15 years = higher payments but massive interest savings.",
            "monthlyDebts": "<strong>Monthly Debts</strong> — All non-housing debt payments (auto, student loans, credit cards). These add to your back-end DTI and reduce how much housing you can carry.",
            "propertyTax": "<strong>Property Tax Rate</strong> — Annual tax as a percentage of home value. This is a significant part of your monthly payment that many first-time buyers underestimate.",
            "insurance": "<strong>Annual Insurance</strong> — Homeowner's insurance premium. Required by all lenders. Shop around — quotes can vary by 30-50% between carriers."
        },
        "examples": [
            {"name": "First-Time Buyer, Cautious", "desc": "$65K income eyeing a $250K home — will the payment be comfortable?", "values": {"income": 65000, "homePrice": 250000, "downPayment": 15000, "currentRate": "7.0", "loanTerm": "30", "monthlyDebts": 350, "propertyTax": "1.2", "insurance": 1500}},
            {"name": "Stretch Purchase", "desc": "$90K income reaching for a $400K home — stress test reveals the risk", "values": {"income": 90000, "homePrice": 400000, "downPayment": 30000, "currentRate": "6.75", "loanTerm": "30", "monthlyDebts": 600, "propertyTax": "1.3", "insurance": 2000}},
            {"name": "ARM Rate Reset", "desc": "Bought with 5/1 ARM at 5.5% — what happens when it adjusts?", "values": {"income": 80000, "homePrice": 350000, "downPayment": 70000, "currentRate": "5.5", "loanTerm": "30", "monthlyDebts": 400, "propertyTax": "1.1", "insurance": 1800}}
        ],
        "whyThisMatters": {
            "title": "Why Stress Test Your Payment?",
            "purpose": "This calculator shows you what happens to your DTI ratio and monthly payment if interest rates increase. It's the financial equivalent of asking 'What if things get harder?' before you commit.",
            "whenToUse": [
                "Before making an offer — ensure you can handle rate changes if you have an adjustable-rate mortgage",
                "When deciding between a fixed and adjustable-rate mortgage",
                "To understand your financial cushion — how much room do you have before payments become unmanageable?"
            ],
            "keyInsight": "A 1% rate increase on a $300K loan adds roughly $200/month to your payment. Over 30 years, that's $72,000 more in interest. The stress test helps you visualize this impact before you're locked in.",
            "proTip": "If your DTI exceeds 43% at the +1% stress level, consider a less expensive home or a larger down payment. Financial resilience means being able to handle the unexpected."
        },
        "kpiExplains": {
            "kpiCurrentPmt": "Your <strong>monthly payment at today's rate</strong> — this is your baseline. Compare this to the stressed scenarios to see your exposure.",
            "kpiCurrentDTI": "Your <strong>debt-to-income ratio at today's rate</strong>. Below 36% is comfortable. 36-43% is acceptable. Above 43% means most conventional lenders will decline.",
            "kpiStress1": "What your payment becomes if rates rise <strong>1 percentage point</strong>. This is a realistic scenario — rates moved 2%+ in 2022 alone.",
            "kpiStress2": "The <strong>worst-case scenario</strong> at +2% above current rates. If you can still afford this payment, you have strong financial resilience."
        },
        "coupled": [
            {"name": "Affordability Calculator", "folder": "affordability", "reason": "Find the right price range before stress testing a specific home"},
            {"name": "Rate Buydown", "folder": "rate-buydown", "reason": "See if paying points to lock a lower rate is worth the upfront cost"},
            {"name": "Cash to Close", "folder": "cash-to-close", "reason": "Calculate exactly how much cash you need beyond the down payment"}
        ]
    },

    "cash-to-close": {
        "tooltips": {
            "purchasePrice": "<strong>Purchase Price</strong> — The agreed-upon price for the home. This determines your loan amount, transfer taxes, and several closing cost items that are calculated as a percentage of the price.",
            "downPaymentPct": "<strong>Down Payment %</strong> — Percentage of purchase price paid in cash. 20% avoids PMI. FHA requires 3.5% minimum. Conventional loans start at 3%.",
            "loanOrigination": "<strong>Loan Origination Fee</strong> — What the lender charges to process your loan, typically 0.5%–1% of the loan amount. This is negotiable — ask your lender.",
            "appraisalFee": "<strong>Appraisal Fee</strong> — Paid to a licensed appraiser to confirm the home's value. Typically $400–$700. Required by the lender to ensure they're not over-lending.",
            "titleInsurance": "<strong>Title Insurance</strong> — Protects against ownership disputes. The lender requires a policy, and you should get an owner's policy too. Costs $1,000–$3,000 depending on the state.",
            "inspectionFee": "<strong>Inspection Fee</strong> — Covers a professional home inspection. Not required by lenders but strongly recommended. Typically $300–$500. Worth every penny.",
            "escrowMonths": "<strong>Escrow Months</strong> — Lenders require 2–6 months of property tax and insurance to be deposited in escrow at closing. This protects them (and you) if you miss future payments.",
            "prepaidInterest": "<strong>Prepaid Interest Days</strong> — Interest from your closing date to the end of that month. Close early in the month = more prepaid interest. Close late = less."
        },
        "examples": [
            {"name": "FHA First-Time Buyer", "desc": "3.5% down on a $280K home — see the real cash needed beyond just the down payment", "values": {"purchasePrice": 280000, "downPaymentPct": "3.5", "loanOrigination": "1.0", "appraisalFee": 550, "titleInsurance": 1800, "inspectionFee": 450, "escrowMonths": "3", "prepaidInterest": "15"}},
            {"name": "Conventional 20% Down", "desc": "$375K home with 20% down — no PMI but significant closing costs", "values": {"purchasePrice": 375000, "downPaymentPct": "20", "loanOrigination": "0.75", "appraisalFee": 600, "titleInsurance": 2200, "inspectionFee": 500, "escrowMonths": "4", "prepaidInterest": "10"}},
            {"name": "VA Loan, Zero Down", "desc": "Veteran buying $320K home — $0 down but still need closing cash", "values": {"purchasePrice": 320000, "downPaymentPct": "0", "loanOrigination": "1.0", "appraisalFee": 500, "titleInsurance": 1600, "inspectionFee": 400, "escrowMonths": "3", "prepaidInterest": "20"}}
        ],
        "whyThisMatters": {
            "title": "Why Calculate Cash to Close?",
            "purpose": "The down payment is just one part of the cash you need at closing. This calculator reveals all the other costs — lender fees, title insurance, escrow deposits, and prepaid items — so you're not blindsided at the closing table.",
            "whenToUse": [
                "After you've found a home and before making an offer — ensure you actually have enough cash",
                "When comparing loan programs — FHA, VA, and Conventional have different closing cost structures",
                "To plan your savings timeline — knowing the total helps you set a realistic savings goal"
            ],
            "keyInsight": "Closing costs typically add 2–5% of the purchase price ON TOP of your down payment. On a $300K home, that's $6,000–$15,000 extra that many first-time buyers don't budget for. This calculator prevents that surprise.",
            "proTip": "You can negotiate seller concessions (seller pays part of your closing costs) — common in buyer's markets. Ask your agent about writing this into the offer."
        },
        "kpiExplains": {
            "kpiTotalCash": "The <strong>total amount of cash</strong> you need to bring to the closing table. This includes your down payment plus all fees, escrow deposits, and prepaid items.",
            "kpiDownPayment": "Your <strong>down payment amount</strong> — the largest single item. This goes directly toward your home equity.",
            "kpiClosingCosts": "All <strong>fees and charges</strong> beyond the down payment — lender fees, title, appraisal, inspections, and prepaid items.",
            "kpiEscrow": "Cash deposited into an <strong>escrow account</strong> to cover upcoming property taxes and insurance payments. You get this money 'back' as the lender pays those bills from escrow."
        },
        "coupled": [
            {"name": "Affordability Calculator", "folder": "affordability", "reason": "Make sure the home price fits your budget before calculating closing costs"},
            {"name": "DTI Stress Test", "folder": "dti-stress-test", "reason": "Verify the monthly payment is sustainable at different rate scenarios"},
            {"name": "Government Loans", "folder": "government-loans", "reason": "Compare FHA, VA, and USDA — each has different closing cost structures and down payment rules"}
        ]
    },

    "true-cost-ownership": {
        "tooltips": {
            "monthlyMortgage": "<strong>Monthly Mortgage Payment</strong> — Your principal and interest payment. This is typically the largest single cost, but it's far from the only one.",
            "propertyTax": "<strong>Monthly Property Tax</strong> — Varies dramatically by location. Always verify with the county assessor — listed values on real estate sites can be outdated.",
            "insurance": "<strong>Monthly Insurance</strong> — Homeowner's insurance. Add flood insurance if in a flood zone — it can double this cost.",
            "hoa": "<strong>Monthly HOA</strong> — Association dues for condos/planned communities. Review what's included (water, exterior maintenance, etc.) as it affects your total picture.",
            "maintenance": "<strong>Monthly Maintenance</strong> — Budget 1% of home value per year (÷12 for monthly). Older homes and larger properties need more. This is the cost most new homeowners underestimate.",
            "utilities": "<strong>Monthly Utilities</strong> — Electric, gas, water, sewer, trash, internet. Ask the seller or utility company for a 12-month history to get a realistic average."
        },
        "examples": [
            {"name": "New Construction Condo", "desc": "Low maintenance, high HOA — see where the money really goes", "values": {"monthlyMortgage": 1800, "propertyTax": 250, "insurance": 120, "hoa": 375, "maintenance": 100, "utilities": 180}},
            {"name": "1960s Single Family", "desc": "No HOA but higher maintenance and utility costs for an older home", "values": {"monthlyMortgage": 1650, "propertyTax": 320, "insurance": 165, "hoa": 0, "maintenance": 350, "utilities": 280}},
            {"name": "Suburban House, Young Family", "desc": "4-bed home in the suburbs — the full picture of monthly homeownership", "values": {"monthlyMortgage": 2200, "propertyTax": 400, "insurance": 185, "hoa": 50, "maintenance": 250, "utilities": 320}}
        ],
        "whyThisMatters": {
            "title": "Why Calculate True Cost of Ownership?",
            "purpose": "Your mortgage payment is only 50–65% of what homeownership actually costs each month. This calculator reveals the full picture — maintenance, utilities, HOA, and opportunity costs that many buyers overlook.",
            "whenToUse": [
                "Before buying — compare the true monthly cost to your current rent to see if you're really saving money",
                "When budgeting — know exactly how much monthly income homeownership will consume",
                "When deciding between renting and buying — this shows the real numbers, not just the mortgage"
            ],
            "keyInsight": "The rule of thumb is that total homeownership costs roughly 1.5x your mortgage payment. A $2,000/month mortgage really costs about $3,000/month when you include everything. This calculator shows you the exact multiplier for your situation.",
            "proTip": "Maintenance costs aren't optional — they're deferred expenses. Skip the roof repair now, and it becomes a $15K emergency later. Budget for maintenance like a bill, not an option."
        },
        "kpiExplains": {
            "kpiTrueCost": "The <strong>actual total monthly cost</strong> of owning this home — every expense combined. Compare this number to your rent to see the real difference.",
            "kpiMortgagePct": "What percentage of your <strong>total cost is just the mortgage</strong>. If this is above 70%, your non-mortgage costs are relatively low. Below 60% means significant costs beyond the loan.",
            "kpiAnnualCost": "Your <strong>total annual ownership cost</strong>. This is the number to compare against your annual housing budget.",
            "kpiHiddenCosts": "The monthly amount <strong>beyond your mortgage</strong> — taxes, insurance, maintenance, utilities, and HOA. This is what catches most new homeowners off guard."
        },
        "coupled": [
            {"name": "Affordability Calculator", "folder": "affordability", "reason": "Start here to find the right price range based on your income and debts"},
            {"name": "Cash to Close", "folder": "cash-to-close", "reason": "Calculate the upfront cash needed before you get to the monthly costs"},
            {"name": "Home Equity", "folder": "home-equity", "reason": "See how your equity grows over time to understand the investment side of ownership"}
        ]
    },

    "seller-net-sheet": {
        "tooltips": {
            "salePrice": "<strong>Sale Price</strong> — The expected or agreed-upon selling price. This is the starting point — every cost below gets subtracted from this number.",
            "mortgageBalance": "<strong>Remaining Mortgage Balance</strong> — What you still owe on your current loan. Call your lender for the exact payoff amount — it includes accrued interest.",
            "agentCommission": "<strong>Agent Commission %</strong> — Total commission split between listing and buyer's agents. Traditionally 5-6%, but this is always negotiable. Recent NAR settlement changes may affect this.",
            "closingCostPct": "<strong>Seller Closing Costs %</strong> — Title fees, escrow, recording, and transfer taxes. Typically 1-3% of sale price, varies by state.",
            "repairs": "<strong>Agreed Repairs</strong> — Concessions made after the inspection. Buyers may request $0 to $20K+ depending on what the inspection reveals.",
            "otherFees": "<strong>Other Fees</strong> — HOA transfer fees, home warranty for buyer, staging costs, or any other agreed-upon expenses."
        },
        "examples": [
            {"name": "Selling After 5 Years", "desc": "Bought at $280K, selling at $350K — see the actual profit after all costs", "values": {"salePrice": 350000, "mortgageBalance": 245000, "agentCommission": "5.5", "closingCostPct": "2.0", "repairs": 3500, "otherFees": 500}},
            {"name": "Downsizing in Retirement", "desc": "Long-held home with low balance — maximizing proceeds for next chapter", "values": {"salePrice": 475000, "mortgageBalance": 85000, "agentCommission": "5.0", "closingCostPct": "1.8", "repairs": 0, "otherFees": 1200}},
            {"name": "Underwater Scenario", "desc": "Market dipped — selling at a potential loss. Net sheet reveals the reality.", "values": {"salePrice": 250000, "mortgageBalance": 265000, "agentCommission": "5.0", "closingCostPct": "2.0", "repairs": 2000, "otherFees": 0}}
        ],
        "whyThisMatters": {
            "title": "Why Use a Seller Net Sheet?",
            "purpose": "The sale price is not your profit. After agent commissions, closing costs, mortgage payoff, and repair credits, your actual take-home (net proceeds) can be 8-15% less than the sale price. This calculator shows the real number.",
            "whenToUse": [
                "Before listing your home — know what you'll actually walk away with",
                "When evaluating multiple offers — a higher offer with more concessions may net you less",
                "When planning your next purchase — your net proceeds become the down payment on your next home"
            ],
            "keyInsight": "On a $400K sale with 5.5% commission, you'll pay $22,000 in agent fees alone. Add closing costs and repairs, and 8-10% of the sale price never reaches your pocket. Always calculate net proceeds, not gross sale price.",
            "proTip": "If you're buying and selling simultaneously, your net proceeds from the sale directly impact your buying power for the next home. Run this calculator first, then plug the net into the Affordability Calculator."
        },
        "kpiExplains": {
            "kpiNetProceeds": "Your <strong>actual take-home money</strong> after every cost is deducted from the sale price. This is the check you walk away with.",
            "kpiTotalCosts": "The <strong>total amount deducted</strong> from your sale price — commissions, closing costs, repairs, and mortgage payoff combined.",
            "kpiCommission": "The <strong>total agent commission</strong> — typically the single largest selling expense. Worth negotiating, especially on high-value properties.",
            "kpiEquity": "Your <strong>equity position</strong> — the difference between sale price and mortgage balance, before selling costs. If this is negative, you're 'underwater.'"
        },
        "coupled": [
            {"name": "Commission Calculator", "folder": "commission", "reason": "Break down the agent commission structure and negotiate effectively"},
            {"name": "Affordability Calculator", "folder": "affordability", "reason": "Use your net proceeds as the down payment to see what you can buy next"},
            {"name": "1031 Exchange", "folder": "1031-exchange", "reason": "If selling an investment property, see how to defer capital gains taxes"}
        ]
    },

    "brrrr": {
        "tooltips": {
            "purchasePrice": "<strong>Purchase Price</strong> — The acquisition cost of the distressed property. BRRRR works best when you buy 20-30% below after-repair value (ARV).",
            "rehabCost": "<strong>Rehab Cost</strong> — Total renovation budget. Get contractor bids BEFORE buying. Add 10-15% contingency for unexpected issues.",
            "arv": "<strong>After-Repair Value (ARV)</strong> — What the property will be worth after renovation. Base this on recent comparable sales (comps) of similar, renovated homes within 0.5 miles.",
            "monthlyRent": "<strong>Monthly Rent</strong> — Expected rental income after rehab. Research comparable rents on Rentometer or Zillow. Conservative estimate = market rent minus $50-100.",
            "refinanceRate": "<strong>Refinance Rate</strong> — The interest rate on your permanent (refinance) loan. This replaces your initial hard money or cash purchase.",
            "refinanceLTV": "<strong>Refinance LTV</strong> — Loan-to-Value ratio the lender will allow. 75% is standard for investment properties. Some portfolio lenders offer up to 80%."
        },
        "examples": [
            {"name": "Classic BRRRR, Midwest", "desc": "$80K purchase, $35K rehab, $165K ARV — textbook deal in a cash-flow market", "values": {"purchasePrice": 80000, "rehabCost": 35000, "arv": 165000, "monthlyRent": 1400, "refinanceRate": "7.5", "refinanceLTV": "75"}},
            {"name": "High-Value BRRRR, Southeast", "desc": "$180K purchase, $60K rehab, $320K ARV — larger deal, larger returns", "values": {"purchasePrice": 180000, "rehabCost": 60000, "arv": 320000, "monthlyRent": 2200, "refinanceRate": "7.25", "refinanceLTV": "75"}},
            {"name": "Failed BRRRR (Learn From It)", "desc": "Rehab over budget, ARV missed — see what happens when numbers are tight", "values": {"purchasePrice": 150000, "rehabCost": 75000, "arv": 250000, "monthlyRent": 1600, "refinanceRate": "8.0", "refinanceLTV": "70"}}
        ],
        "whyThisMatters": {
            "title": "Why Use the BRRRR Calculator?",
            "purpose": "BRRRR (Buy, Rehab, Rent, Refinance, Repeat) is the most powerful wealth-building strategy in real estate. This calculator shows whether a deal lets you pull out most or all of your invested cash through refinancing — so you can do it again.",
            "whenToUse": [
                "When evaluating a distressed property — is the spread between purchase+rehab and ARV wide enough?",
                "To determine how much cash stays trapped in the deal after refinancing",
                "When comparing multiple potential BRRRR deals side by side"
            ],
            "keyInsight": "The magic of BRRRR is 'infinite returns' — when the refinance proceeds return ALL your original cash. This happens when (Purchase + Rehab) ≤ ARV × LTV. If you buy at 70% of ARV and rehab for 10-15% of ARV, the math usually works.",
            "proTip": "Never estimate ARV yourself. Pull 3-5 recent sold comps within 0.5 miles, same bed/bath count, similar condition. The deal lives or dies on an accurate ARV."
        },
        "kpiExplains": {
            "kpiCashLeft": "Cash <strong>remaining in the deal</strong> after the refinance. Ideally this is $0 or negative (you got MORE back than you put in). If it's high, your capital is trapped.",
            "kpiCashFlow": "Monthly <strong>cash flow after all expenses</strong> — mortgage, taxes, insurance, maintenance, vacancy, and management. This needs to be positive for the deal to work long-term.",
            "kpiCOC": "Your <strong>cash-on-cash return</strong> on the money left in the deal. If you pulled all cash out, this is infinity — you're earning returns on $0 invested.",
            "kpiROI": "The <strong>total return on investment</strong> including equity captured through the rehab. This is the full picture of what the deal produces."
        },
        "coupled": [
            {"name": "Fix & Flip", "folder": "fixflip", "reason": "Compare: should you BRRRR (hold) or flip (sell) this property?"},
            {"name": "Rental Analysis", "folder": "rental-analysis", "reason": "Deep-dive into the rental income projections after the refinance"},
            {"name": "DSCR Loan", "folder": "dscr-loan", "reason": "Many BRRRR refinances use DSCR loans — check if the rental income qualifies"},
            {"name": "Deal Grading", "folder": "deal-grading", "reason": "Score the overall deal quality before committing capital"}
        ]
    },

    "cashflow": {
        "tooltips": {
            "rent": "<strong>Monthly Rent</strong> — Gross rental income. Use market-rate comps, not the asking price on a listing. If the current rent is below market, factor in lease expiration dates.",
            "vacancy": "<strong>Vacancy Rate %</strong> — Percentage of time the unit is empty. National average is 5-8%. Use 10% for conservative projections. College towns may have seasonal vacancy.",
            "mortgage": "<strong>Monthly Mortgage</strong> — Your principal and interest payment. This is typically the largest expense line item.",
            "taxes": "<strong>Monthly Taxes</strong> — Property tax divided by 12. Remember: taxes can increase after purchase if the property is reassessed at your purchase price.",
            "insurance": "<strong>Monthly Insurance</strong> — Landlord insurance policy (not homeowner's). Typically 15-25% more than a regular homeowner policy.",
            "maintenance": "<strong>Monthly Maintenance</strong> — Budget 8-12% of rent for repairs and capital expenditures (roof, HVAC, water heater). Older properties need more.",
            "management": "<strong>Property Management %</strong> — If using a property manager, typically 8-12% of collected rent. Even if self-managing, consider your time's value.",
            "otherExpenses": "<strong>Other Expenses</strong> — Utilities you pay (common areas, water), lawn care, pest control, HOA, or any recurring cost."
        },
        "examples": [
            {"name": "Single Family Rental", "desc": "Classic SFR with $1,400 rent — does it cash flow after all expenses?", "values": {"rent": 1400, "vacancy": "8", "mortgage": 850, "taxes": 180, "insurance": 100, "maintenance": 140, "management": "10", "otherExpenses": 0}},
            {"name": "Duplex, House Hack", "desc": "Live in one unit, rent the other — see how much your housing cost drops", "values": {"rent": 2600, "vacancy": "5", "mortgage": 1600, "taxes": 280, "insurance": 150, "maintenance": 200, "management": "0", "otherExpenses": 75}},
            {"name": "Section 8 Property", "desc": "Government-guaranteed rent, low vacancy — the numbers look different", "values": {"rent": 1200, "vacancy": "3", "mortgage": 650, "taxes": 140, "insurance": 90, "maintenance": 120, "management": "10", "otherExpenses": 0}}
        ],
        "whyThisMatters": {
            "title": "Why Cash Flow Analysis?",
            "purpose": "Cash flow is the lifeblood of rental investing. This calculator reveals whether a property puts money in your pocket every month or drains it — after accounting for every real expense, not just the mortgage.",
            "whenToUse": [
                "Before purchasing any rental property — the #1 mistake investors make is buying properties that don't cash flow",
                "To compare potential investments — which property puts the most money in your pocket?",
                "To monitor existing properties — are your actual expenses matching your projections?"
            ],
            "keyInsight": "A property that 'seems' profitable at the rental price can become a money pit when you add vacancy, maintenance, management, and capital reserves. The Cash Flow Calculator accounts for all of these. If it doesn't cash flow on paper, it won't cash flow in reality.",
            "proTip": "Target a minimum of $200/month cash flow per unit after ALL expenses. Below that, one bad repair wipes out your annual profit. Strong markets deliver $300-500/unit."
        },
        "kpiExplains": {
            "kpiCashFlow": "Your <strong>monthly net cash flow</strong> — what's left after every expense. Positive = money in your pocket. Negative = you're paying to own this property.",
            "kpiNOI": "<strong>Net Operating Income</strong> — rental income minus operating expenses (but before mortgage). Lenders and appraisers use NOI to value investment properties.",
            "kpiCapRate": "The property's <strong>capitalization rate</strong> — NOI ÷ property value. Higher cap rates mean higher returns. 5-8% is typical for residential rentals.",
            "kpiCOC": "<strong>Cash-on-cash return</strong> — annual cash flow ÷ total cash invested. Compare this to what you'd earn in stocks or a savings account."
        },
        "coupled": [
            {"name": "Rental Analysis", "folder": "rental-analysis", "reason": "Deeper rental projections with appreciation and equity buildup over time"},
            {"name": "Cap Rate", "folder": "caprate", "reason": "Compare this property's cap rate to market averages to assess value"},
            {"name": "DSCR Loan", "folder": "dscr-loan", "reason": "Check if the cash flow qualifies for a DSCR (investor) loan"},
            {"name": "Deal Grading", "folder": "deal-grading", "reason": "Score the overall investment quality across multiple dimensions"}
        ]
    },

    "caprate": {
        "tooltips": {
            "price": "<strong>Property Price / Value</strong> — The current market value or purchase price. The cap rate tells you the return this property would deliver if you paid all cash (no financing).",
            "grossRent": "<strong>Annual Gross Rent</strong> — Total rental income before any expenses. Multiply monthly rent by 12. Include all units if multi-family.",
            "vacancy": "<strong>Vacancy %</strong> — Expected vacancy as a percentage of gross rent. Use local market data. 5% in tight markets, 10%+ in oversupplied areas.",
            "taxes": "<strong>Annual Taxes</strong> — Property taxes per year. Verify with the county assessor — online listings can be wrong.",
            "insurance": "<strong>Annual Insurance</strong> — Landlord insurance premium per year. Get actual quotes for accuracy.",
            "maintenance": "<strong>Annual Maintenance</strong> — Repairs and capital reserves. Budget 8-12% of gross rent. Older properties = higher percentage.",
            "management": "<strong>Annual Management</strong> — Property management fees, typically 8-12% of collected rent per year.",
            "otherExpenses": "<strong>Other Annual Expenses</strong> — Utilities, HOA, landscaping, legal, accounting, and any other recurring costs."
        },
        "examples": [
            {"name": "Turnkey SFR, 6% Cap", "desc": "Solid rental in a stable market — is the cap rate competitive?", "values": {"price": 200000, "grossRent": 21600, "vacancy": "7", "taxes": 2400, "insurance": 1500, "maintenance": 2400, "management": 2160, "otherExpenses": 0}},
            {"name": "Multi-Family, Urban", "desc": "8-unit building in a growing metro — higher price, higher income", "values": {"price": 850000, "grossRent": 96000, "vacancy": "5", "taxes": 10200, "insurance": 5500, "maintenance": 9600, "management": 9120, "otherExpenses": 3600}},
            {"name": "Class C Property, High Cap", "desc": "Lower-income area, high returns on paper — but maintenance is a factor", "values": {"price": 95000, "grossRent": 14400, "vacancy": "12", "taxes": 1200, "insurance": 1100, "maintenance": 2400, "management": 1440, "otherExpenses": 600}}
        ],
        "whyThisMatters": {
            "title": "Why Does Cap Rate Matter?",
            "purpose": "The capitalization rate (Cap Rate) is the universal language of commercial real estate. It tells you the yield a property produces independent of financing — making it the best tool for comparing properties of different sizes, prices, and locations.",
            "whenToUse": [
                "When comparing investment properties — cap rate normalizes across different price points",
                "To determine if a market is expensive or cheap — low cap rates = expensive, high cap rates = higher yield",
                "When evaluating a listing price — if the cap rate is below market average, the property may be overpriced"
            ],
            "keyInsight": "Cap Rate = NOI ÷ Price. A 6% cap rate means the property earns 6% of its value annually before financing. But cap rate ignores financing, so a property with a 5% cap rate can still be profitable with 80% leverage if your interest rate is below 5%.",
            "proTip": "Cap rates and property values move inversely. When cap rates compress (go down), values go up — and vice versa. This is why low-interest-rate environments inflate property prices."
        },
        "kpiExplains": {
            "kpiCapRate": "The <strong>capitalization rate</strong> — your annual yield if you paid all cash. Compare to the 10-year Treasury rate (risk-free return) to assess the risk premium you're earning.",
            "kpiNOI": "<strong>Net Operating Income</strong> — annual income after all operating expenses but before debt service. This is the number that drives property value in commercial real estate.",
            "kpiGRM": "<strong>Gross Rent Multiplier</strong> — price ÷ annual rent. A quick screening tool: lower GRM = better deal. Typically 8-15 for residential rentals.",
            "kpiExpenseRatio": "<strong>Operating Expense Ratio</strong> — total expenses ÷ gross income. Typical range is 35-50%. Above 50% suggests high expenses or deferred maintenance."
        },
        "coupled": [
            {"name": "Cash Flow", "folder": "cashflow", "reason": "Cap rate ignores financing — Cash Flow shows the reality with a mortgage"},
            {"name": "Investment Analysis", "folder": "investment-analysis", "reason": "Full investment analysis with appreciation, equity, and long-term returns"},
            {"name": "Multi-Family", "folder": "multifamily", "reason": "Specialized analysis for apartment buildings with unit-level detail"},
            {"name": "Deal Grading", "folder": "deal-grading", "reason": "Score the deal across multiple dimensions, not just cap rate"}
        ]
    },

    "fixflip": {
        "tooltips": {
            "purchasePrice": "<strong>Purchase Price</strong> — What you're paying for the property. The profit in a flip is made at the purchase, not the sale. Buy below 70% of ARV minus repairs.",
            "rehabCost": "<strong>Rehab Cost</strong> — Total renovation budget. Get multiple contractor bids. Add 15-20% contingency — rehabs almost always cost more than estimated.",
            "arv": "<strong>After-Repair Value</strong> — What the home will sell for after renovation. Pull recent comps (sold, not listed). This is the most important number in the entire analysis.",
            "holdingMonths": "<strong>Holding Period</strong> — Months from purchase to sale. Average flip takes 4-6 months. Every extra month costs you in holding expenses.",
            "sellingCosts": "<strong>Selling Costs %</strong> — Agent commissions + closing costs when you sell. Typically 8-10% of the sale price.",
            "financingCost": "<strong>Financing Costs</strong> — Hard money loan interest, points, and fees. Hard money rates run 10-14% with 1-3 points upfront."
        },
        "examples": [
            {"name": "Bread & Butter Flip", "desc": "$130K buy, $40K rehab, $225K ARV — clean cosmetic flip with good margins", "values": {"purchasePrice": 130000, "rehabCost": 40000, "arv": 225000, "holdingMonths": "5", "sellingCosts": "9", "financingCost": 8500}},
            {"name": "Tight Margin Flip", "desc": "Numbers look okay until you add all costs — see the real profit", "values": {"purchasePrice": 195000, "rehabCost": 55000, "arv": 290000, "holdingMonths": "7", "sellingCosts": "9", "financingCost": 14000}},
            {"name": "Luxury Flip", "desc": "High-end renovation — bigger investment, bigger potential return", "values": {"purchasePrice": 320000, "rehabCost": 120000, "arv": 575000, "holdingMonths": "8", "sellingCosts": "8", "financingCost": 28000}}
        ],
        "whyThisMatters": {
            "title": "Why Use the Fix & Flip Calculator?",
            "purpose": "Flipping looks profitable on TV, but the margins are thinner than most people think. This calculator reveals the true profit after accounting for rehab, holding costs, financing, and selling expenses — the costs that turn a 'great deal' into a break-even.",
            "whenToUse": [
                "Before making an offer on a flip property — know your maximum allowable offer (MAO)",
                "To compare potential flip deals and prioritize the most profitable one",
                "When deciding: should I flip this property or hold it as a BRRRR rental?"
            ],
            "keyInsight": "The 70% Rule: Never pay more than 70% of ARV minus repair costs. On a $200K ARV property needing $30K in work: Max offer = ($200K × 0.70) - $30K = $110K. This rule leaves room for holding costs, selling costs, and profit.",
            "proTip": "Your holding costs are a ticking clock. Every month you hold adds mortgage payments, insurance, utilities, and taxes. Finish the rehab on time and price it to sell fast. A quick nickel beats a slow dime."
        },
        "kpiExplains": {
            "kpiProfit": "Your <strong>net profit</strong> — what you keep after every single cost. If this number is below $20K, the risk may not be worth it.",
            "kpiROI": "<strong>Return on investment</strong> — profit ÷ total cash invested. Compare this annualized to other investment options.",
            "kpiMargin": "<strong>Profit margin</strong> — profit as a percentage of the sale price. Experienced flippers target 10-15% minimum.",
            "kpiMAO": "<strong>Maximum Allowable Offer</strong> — the most you should pay using the 70% rule. Offer above this and your margins evaporate."
        },
        "coupled": [
            {"name": "BRRRR Strategy", "folder": "brrrr", "reason": "Compare: should you flip (sell) or BRRRR (hold and rent)?"},
            {"name": "Deal Grading", "folder": "deal-grading", "reason": "Score the flip opportunity across multiple risk dimensions"},
            {"name": "Cash Flow", "folder": "cashflow", "reason": "If the flip doesn't sell quickly, can you hold it as a rental?"}
        ]
    },

    "rental-analysis": {
        "tooltips": {},
        "examples": [
            {"name": "Turnkey SFR, Midwest", "desc": "Fully rented property, stable market — long-term wealth builder", "values": {}},
            {"name": "Value-Add Duplex", "desc": "Under-rented property with renovation potential", "values": {}},
            {"name": "High-Appreciation Market", "desc": "Lower cash flow but strong appreciation potential in a growing city", "values": {}}
        ],
        "whyThisMatters": {
            "title": "Why Analyze Rental Performance?",
            "purpose": "Rental analysis projects your investment returns over time — not just today's cash flow, but how appreciation, equity paydown, and rent increases compound over 5, 10, or 30 years.",
            "whenToUse": ["When comparing rental properties for long-term hold", "To project wealth building from a rental portfolio over decades", "When deciding if a lower-cash-flow property in an appreciating market is still a good investment"],
            "keyInsight": "Cash flow is year-one return. Total return includes appreciation, principal paydown, and tax benefits. A property with modest cash flow in a 5% appreciation market can outperform a high-cash-flow property in a flat market over 10 years."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Cash Flow", "folder": "cashflow", "reason": "Detailed monthly cash flow analysis for the current snapshot"},
            {"name": "Cap Rate", "folder": "caprate", "reason": "Compare the yield to similar properties in the market"},
            {"name": "Cash-on-Cash Breakdown", "folder": "cash-on-cash-breakdown", "reason": "Dissect where your returns actually come from"}
        ]
    },

    "short-term-rental": {
        "tooltips": {},
        "examples": [
            {"name": "Beach House, Peak Season", "desc": "Seasonal rental — high summer rates, lower off-season occupancy", "values": {}},
            {"name": "Urban Airbnb, Year-Round", "desc": "City apartment with consistent bookings throughout the year", "values": {}},
            {"name": "Mountain Cabin, Weekends", "desc": "Weekend warrior rental near a ski resort — unique seasonal pattern", "values": {}}
        ],
        "whyThisMatters": {
            "title": "Why Analyze Short-Term Rentals Separately?",
            "purpose": "Short-term rentals (Airbnb, VRBO) have completely different economics than long-term rentals. Higher income potential, but also higher expenses, seasonal variability, and management complexity. This calculator accounts for all of it.",
            "whenToUse": ["When evaluating a property for Airbnb/VRBO use", "To compare STR income vs. long-term rental income for the same property", "When forecasting seasonal revenue patterns"],
            "keyInsight": "Short-term rentals can earn 2-3x the monthly income of a long-term rental, but expenses (cleaning, furnishing, utilities, management, platform fees) eat 40-60% of gross revenue. The net profit gap is often smaller than the revenue gap suggests."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Rental Analysis", "folder": "rental-analysis", "reason": "Compare STR returns against a traditional long-term rental strategy"},
            {"name": "Cash Flow", "folder": "cashflow", "reason": "See the long-term rental alternative for the same property"},
            {"name": "DSCR Loan", "folder": "dscr-loan", "reason": "Check if STR income qualifies you for a DSCR loan on the next purchase"}
        ]
    },

    "multifamily": {
        "tooltips": {},
        "examples": [
            {"name": "4-Unit Starter", "desc": "First multifamily purchase — FHA-eligible, live in one unit", "values": {}},
            {"name": "8-Unit Value Add", "desc": "Under-rented building with potential for rent increases after renovation", "values": {}},
            {"name": "16-Unit Apartment", "desc": "Small apartment complex — crosses into commercial lending territory", "values": {}}
        ],
        "whyThisMatters": {
            "title": "Why a Dedicated Multi-Family Calculator?",
            "purpose": "Multi-family properties (2-20+ units) are valued based on income, not comparable sales. This calculator uses the income approach — the same method commercial appraisers and banks use to determine what a multi-family building is worth.",
            "whenToUse": ["When evaluating apartment buildings or multi-unit properties", "To determine the value increase from raising rents or reducing expenses", "When structuring an offer based on cap rate and NOI analysis"],
            "keyInsight": "In multi-family, you create value by increasing NOI. Raising rents $50/unit across 10 units at a 7% cap rate increases the building's value by $85,714. That's forced appreciation — you control it."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Cap Rate", "folder": "caprate", "reason": "Cap rate is the primary valuation metric for multi-family"},
            {"name": "Cash Flow", "folder": "cashflow", "reason": "Break down the per-unit cash flow picture"},
            {"name": "DSCR Loan", "folder": "dscr-loan", "reason": "Multi-family loans are typically underwritten using DSCR"}
        ]
    },

    "distressed-asset": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Analyze Distressed Assets?",
            "purpose": "Distressed properties (foreclosures, REOs, tax sales) offer the deepest discounts but carry the highest risk. This calculator helps you evaluate whether the discount is large enough to compensate for the unknowns.",
            "whenToUse": ["When bidding on a foreclosure or REO property", "To estimate total investment including hidden repair costs", "When comparing distressed vs. market-price investment opportunities"],
            "keyInsight": "Distressed properties often can't be inspected before purchase. Budget 20-30% of purchase price for unknowns — mold, foundation, plumbing, and electrical issues are common. The discount must cover these risks."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Fix & Flip", "folder": "fixflip", "reason": "Distressed properties are the ideal fix & flip pipeline"},
            {"name": "BRRRR Strategy", "folder": "brrrr", "reason": "Distressed assets are also BRRRR candidates — rehab, rent, refinance"},
            {"name": "Deal Grading", "folder": "deal-grading", "reason": "Score the risk-adjusted return of the distressed deal"}
        ]
    },

    "land-development": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why a Land Development Calculator?",
            "purpose": "Land development is the most complex real estate strategy — involving entitlements, infrastructure, construction, and market timing. This calculator helps estimate profitability before you commit millions in capital.",
            "whenToUse": ["When evaluating raw land for residential or commercial development", "To estimate total development costs including site work and infrastructure", "When comparing build-to-sell vs. build-to-rent exit strategies"],
            "keyInsight": "Land development has the highest potential returns (30-50%+) but also the highest risk and longest timeline. The key variables are entitlement risk (will you get approved?) and absorption rate (how fast will units sell?)."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Investment Analysis", "folder": "investment-analysis", "reason": "Broader investment analysis for the completed project"},
            {"name": "Cash Flow", "folder": "cashflow", "reason": "If building to rent, model the rental cash flow after completion"}
        ]
    },

    "deal-grading": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Grade Your Deals?",
            "purpose": "Not all profitable deals are good deals. The Deal Grading Calculator scores a property across multiple dimensions — returns, risk, market, and effort — to give you a holistic grade. It helps prevent analysis paralysis and emotional decision-making.",
            "whenToUse": ["When you have multiple deals to compare and need to pick one", "To maintain discipline and avoid 'deal fever' — buying a mediocre deal because you've been searching too long", "When presenting deals to partners or investors who need a standardized evaluation"],
            "keyInsight": "A deal with amazing returns but terrible location or high risk might only grade a C. A deal with moderate returns in a great market with low risk might grade an A. The Deal Grading Calculator prevents you from chasing returns at the expense of safety."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Cash Flow", "folder": "cashflow", "reason": "Get the detailed cash flow numbers that feed into the grading model"},
            {"name": "Cap Rate", "folder": "caprate", "reason": "Cap rate is one of the key grading dimensions"},
            {"name": "Investment Analysis", "folder": "investment-analysis", "reason": "Full investment analysis to support the grade"}
        ]
    },

    "portfolio-manager": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Use the Portfolio Manager?",
            "purpose": "Individual property analysis is important, but portfolio-level thinking is what builds real wealth. This tool helps you see your entire real estate portfolio as one entity — total equity, aggregate cash flow, diversification, and overall return on investment.",
            "whenToUse": ["When you own 2+ investment properties and need the big picture", "To identify which properties to sell, refinance, or reinvest in", "When reviewing your portfolio allocation across markets, property types, and strategies"],
            "keyInsight": "Portfolio management is about optimization: which property contributes most to your goals? Sometimes selling your worst performer and reinvesting into a better deal creates more value than buying a new property with fresh capital."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Cash Flow", "folder": "cashflow", "reason": "Analyze individual property performance within the portfolio"},
            {"name": "1031 Exchange", "folder": "1031-exchange", "reason": "Tax-deferred way to swap underperformers for better assets"},
            {"name": "Sensitivity Grid", "folder": "sensitivity-grid", "reason": "Stress-test your portfolio against market changes"}
        ]
    },

    "cash-on-cash-breakdown": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Break Down Cash-on-Cash?",
            "purpose": "Cash-on-cash return is the single best metric for comparing rental investments. This calculator goes deeper — breaking the return into its components (cash flow, principal paydown, appreciation, tax benefits) so you understand WHERE your returns come from.",
            "whenToUse": ["When comparing two properties that seem similar on the surface", "To understand whether your returns come from cash flow or appreciation", "When explaining investment returns to partners or family members"],
            "keyInsight": "Two properties can have the same cash-on-cash return but very different risk profiles. One might be all cash flow (safe), while the other is mostly appreciation (speculative). Knowing the breakdown helps you invest according to your risk tolerance."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Cash Flow", "folder": "cashflow", "reason": "Get the detailed monthly cash flow that drives the CoC calculation"},
            {"name": "Rental Analysis", "folder": "rental-analysis", "reason": "See the long-term picture including appreciation and equity buildup"},
            {"name": "Cap Rate", "folder": "caprate", "reason": "Compare the yield perspective (cap rate) vs. the leveraged perspective (CoC)"}
        ]
    },

    "subject-to": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Analyze Subject-To Deals?",
            "purpose": "Subject-to is a creative financing strategy where you take ownership of a property while the seller's mortgage stays in place. This calculator shows the financial advantage of assuming a lower-rate existing mortgage vs. getting a new loan at today's rates.",
            "whenToUse": ["When a seller has a below-market interest rate loan you could potentially assume", "To calculate the payment difference between subject-to vs. new financing", "When structuring creative offers on distressed or motivated seller properties"],
            "keyInsight": "In a high-rate environment (7%+), taking over a seller's 3% mortgage can save you $500-1,000/month on the same property. That's the power of subject-to — you inherit their rate. The risk: lenders have a 'due on sale' clause they could technically enforce."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Seller Financing", "folder": "seller-financing", "reason": "Another creative financing approach — compare which structure works better"},
            {"name": "Wrap Calculator", "folder": "wrap-calculator", "reason": "Combine subject-to with a wrap note for additional arbitrage profit"},
            {"name": "Cash Flow", "folder": "cashflow", "reason": "Model the cash flow using the assumed payment vs. a new loan"}
        ]
    },

    "payment-reverse-engineering": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Reverse-Engineer a Payment?",
            "purpose": "Instead of starting with price and calculating payment, this works backwards: you enter your ideal monthly payment, and the calculator tells you the maximum price, loan amount, or interest rate that produces that payment.",
            "whenToUse": ["When you know your monthly budget but need to find the right price range", "When negotiating — determine what price makes a deal work at your target payment", "To quickly see how much room you have if rates change"],
            "keyInsight": "This is especially powerful for investors: if you need $200/month cash flow and the property rents for $1,400, you know the maximum mortgage payment can be ~$950-1,000 (after expenses). Reverse-engineer that to find your max purchase price."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Affordability", "folder": "affordability", "reason": "Traditional approach: start with income, find the payment. This calc does the reverse."},
            {"name": "Cash Flow", "folder": "cashflow", "reason": "For investors: work backward from target cash flow to max price"}
        ]
    },

    "seller-financing": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Consider Seller Financing?",
            "purpose": "Seller financing means the seller IS your lender — no bank involved. This calculator models the deal structure, showing monthly payments, total interest paid, and how the note performs for both buyer and seller.",
            "whenToUse": ["When traditional bank financing is unavailable or too expensive", "When the seller is willing to carry a note (common with paid-off properties)", "To structure a win-win deal: below-market rate for buyer, passive income for seller"],
            "keyInsight": "Seller financing is often better for BOTH parties. The buyer gets flexible terms and avoids bank fees. The seller earns interest income (often better than a savings account) and defers capital gains taxes through installment sale treatment."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Subject-To", "folder": "subject-to", "reason": "Compare: seller financing vs. taking over the existing loan"},
            {"name": "Wrap Calculator", "folder": "wrap-calculator", "reason": "If using both existing mortgage + seller note, model the wrap"},
            {"name": "Private Money", "folder": "private-money", "reason": "Compare seller financing terms vs. private lender terms"}
        ]
    },

    "lease-option": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Use a Lease-Option?",
            "purpose": "A lease-option gives you the right (not obligation) to buy a property at a set price after renting for a period. This calculator shows the financial breakdown — option fee, rent credits, and how the numbers compare to buying now.",
            "whenToUse": ["When you can't qualify for a mortgage today but expect to qualify soon", "To lock in today's price in an appreciating market while building credit or savings", "As an investor: to control properties with minimal capital"],
            "keyInsight": "The lease-option is a powerful tool for both sides. Tenants build equity through rent credits. Investors control properties with small option fees. But read the contract carefully — option fees are typically non-refundable if you don't exercise."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Affordability", "folder": "affordability", "reason": "Check if you'll qualify for the mortgage when the option period ends"},
            {"name": "True Cost of Ownership", "folder": "true-cost-ownership", "reason": "Model the full cost once you exercise the option and become an owner"}
        ]
    },

    "private-money": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Understand Private Money?",
            "purpose": "Private money lenders are individuals (not banks) who lend their own capital for real estate deals. This calculator models the terms and shows the true cost of borrowing — critical for comparing against hard money, bank loans, or seller financing.",
            "whenToUse": ["When evaluating a private lender's terms vs. traditional financing", "To calculate the total cost of borrowing for a short-term project (flip or BRRRR)", "When pitching a deal to a private lender — show them their return on investment"],
            "keyInsight": "Private money is faster and more flexible than bank loans, but more expensive (8-15%+ with points). The key question: does the deal generate enough profit to cover the higher financing cost AND leave a healthy margin?"
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Fix & Flip", "folder": "fixflip", "reason": "Private money is the most common funding source for flips"},
            {"name": "BRRRR Strategy", "folder": "brrrr", "reason": "Use private money for the buy + rehab phase, then refinance out"},
            {"name": "Seller Financing", "folder": "seller-financing", "reason": "Compare private money cost vs. seller financing terms"}
        ]
    },

    "buy-before-you-sell": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Calculate Buy-Before-You-Sell?",
            "purpose": "Carrying two mortgages simultaneously is the biggest fear for homeowners who want to upgrade. This calculator models the overlap period, showing your total monthly costs and how long you can carry both properties.",
            "whenToUse": ["When you want to move into a new home before selling your current one", "To determine if you can afford the double-payment period", "When evaluating bridge loan or HELOC options to fund the transition"],
            "keyInsight": "The average home takes 30-60 days to sell. If you buy first, you'll likely carry two mortgages for 2-4 months. This calculator shows the exact cost of that overlap so you can plan your savings buffer."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Seller Net Sheet", "folder": "seller-net-sheet", "reason": "Calculate what you'll net from selling your current home"},
            {"name": "HELOC Optimizer", "folder": "heloc-optimizer", "reason": "Use HELOC equity from your current home to fund the new purchase"},
            {"name": "Affordability", "folder": "affordability", "reason": "Confirm you can afford the new home on its own after the old one sells"}
        ]
    },

    "heloc-optimizer": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Optimize Your HELOC?",
            "purpose": "A Home Equity Line of Credit (HELOC) is one of the most versatile financial tools available. This calculator helps you determine how much equity is accessible, what the payments would be, and whether using a HELOC makes financial sense for your goal.",
            "whenToUse": ["When considering using home equity for renovations, investments, or debt consolidation", "To compare HELOC vs. cash-out refinance vs. personal loan", "When planning to use HELOC funds as a down payment on an investment property"],
            "keyInsight": "A HELOC is a line of credit, not a lump sum — you only pay interest on what you draw. This makes it ideal for variable-cost projects (rehabs) or as an emergency fund. But remember: your home is the collateral. Default = potential foreclosure."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Home Equity", "folder": "home-equity", "reason": "First check how much equity you have available"},
            {"name": "Refinance", "folder": "refinance", "reason": "Compare HELOC vs. cash-out refinance for accessing equity"},
            {"name": "BRRRR Strategy", "folder": "brrrr", "reason": "Use HELOC as the funding source for BRRRR acquisitions"}
        ]
    },

    "homyshare-coliving": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Analyze Co-Living / HomyShare?",
            "purpose": "Co-living rents rooms individually in a single property, generating 30-80% more revenue than renting to a single tenant. This calculator models the per-room economics to show the income boost and added complexity.",
            "whenToUse": ["When considering renting rooms individually vs. the whole house", "To model house-hacking income — live in one room, rent the others", "When evaluating larger homes (4+ bedrooms) for investment potential"],
            "keyInsight": "A 4-bedroom home renting for $2,000/month to a family could rent for $800/room ($3,200/month) as a co-living arrangement. But factor in higher turnover, utilities you'll pay, furnishing costs, and more management time."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Rental Analysis", "folder": "rental-analysis", "reason": "Compare co-living income vs. traditional single-tenant rental"},
            {"name": "Cash Flow", "folder": "cashflow", "reason": "Model the cash flow using co-living rental income"}
        ]
    },

    "refinance": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Analyze a Refinance?",
            "purpose": "Refinancing replaces your current mortgage with a new one — ideally at a lower rate, shorter term, or with cash out. This calculator shows the break-even point, total savings, and whether the upfront costs are worth it.",
            "whenToUse": ["When interest rates drop below your current rate — even 0.5-1% can save thousands", "When considering a cash-out refinance to fund investments or renovations", "When switching from an adjustable-rate to a fixed-rate mortgage for stability"],
            "keyInsight": "The break-even point is critical: how many months until your monthly savings exceed the closing costs? If you plan to stay in the home longer than the break-even period, refinancing makes sense. If not, it's a net loss."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "HELOC Optimizer", "folder": "heloc-optimizer", "reason": "Compare cash-out refi vs. HELOC for accessing equity"},
            {"name": "Rate Buydown", "folder": "rate-buydown", "reason": "See if buying down the rate makes the refinance even better"},
            {"name": "Home Equity", "folder": "home-equity", "reason": "Check your current equity position before refinancing"}
        ]
    },

    "dscr-loan": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Use the DSCR Loan Calculator?",
            "purpose": "DSCR (Debt Service Coverage Ratio) loans qualify you based on the property's income, not your personal income. This calculator shows whether a property's rental income is sufficient to qualify for financing — essential for investors who own multiple properties.",
            "whenToUse": ["When you own 4+ properties and conventional lending limits are reached", "To check if a rental property's income qualifies for a DSCR loan before making an offer", "When comparing DSCR loan terms against conventional or portfolio lending"],
            "keyInsight": "Most DSCR lenders require a ratio of 1.2x or higher — meaning the rent must be at least 120% of the total mortgage payment (PITIA). A DSCR of 1.0 means break-even. Below 1.0, you'll likely be declined."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Cash Flow", "folder": "cashflow", "reason": "The cash flow determines whether the DSCR qualifies"},
            {"name": "Rental Analysis", "folder": "rental-analysis", "reason": "Project the long-term performance of the DSCR-financed property"},
            {"name": "Cap Rate", "folder": "caprate", "reason": "Compare yield metrics alongside debt service coverage"}
        ]
    },

    "government-loans": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Compare Government Loan Programs?",
            "purpose": "FHA, VA, and USDA loans offer lower down payments and more flexible qualifications than conventional loans. This calculator compares all three side by side so you can choose the best program for your situation.",
            "whenToUse": ["When you have less than 20% down — government programs may save you thousands", "If you're a veteran — VA loans offer 0% down with no PMI", "When your credit score is below 680 — FHA is more forgiving than conventional"],
            "keyInsight": "VA loans are the best mortgage product in America — 0% down, no PMI, competitive rates. If you qualify, use it. FHA allows 3.5% down with 580+ credit. USDA offers 0% down in rural areas. Know your eligibility before defaulting to conventional."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Qualification Analysis", "folder": "qualification-analysis", "reason": "Determine which specific programs you qualify for based on your profile"},
            {"name": "Affordability", "folder": "affordability", "reason": "See how different loan programs change your buying power"},
            {"name": "DTI Stress Test", "folder": "dti-stress-test", "reason": "Stress test the payment under each program's terms"}
        ]
    },

    "rate-buydown": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Analyze Rate Buydowns?",
            "purpose": "Buying 'points' (prepaid interest) reduces your mortgage rate. This calculator shows the break-even period and total savings — answering the critical question: is it worth paying upfront to get a lower rate?",
            "whenToUse": ["When deciding between paying points or putting more money toward the down payment", "To evaluate seller-paid buydowns (common negotiation tactic in buyer's markets)", "When comparing loan offers from multiple lenders with different rate/point combinations"],
            "keyInsight": "One point = 1% of the loan amount and typically reduces the rate by 0.25%. On a $300K loan, one point costs $3,000 and saves ~$50/month. Break-even: 60 months. If you keep the loan 5+ years, it pays off."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Affordability", "folder": "affordability", "reason": "See how the lower rate changes your buying power"},
            {"name": "DTI Stress Test", "folder": "dti-stress-test", "reason": "The bought-down rate improves your DTI — see the impact"},
            {"name": "Refinance", "folder": "refinance", "reason": "If rates drop later, you might refinance — factor that into the buydown decision"}
        ]
    },

    "qualification-analysis": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Run Qualification Analysis?",
            "purpose": "Before you fall in love with a property, this calculator checks whether you actually qualify for the financing. It evaluates your income, debts, credit, and assets against the requirements of multiple loan programs simultaneously.",
            "whenToUse": ["Before starting your home search — know what you qualify for so you search in the right range", "When your financial situation changes — new job, paid off debt, credit score improvement", "To identify the gaps between where you are and where you need to be for approval"],
            "keyInsight": "Pre-qualification is not pre-approval. This calculator gives you a self-assessment. A lender will verify income, pull credit, and review assets for official pre-approval. But knowing your position beforehand prevents wasted time and disappointment."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Affordability", "folder": "affordability", "reason": "Once you know you qualify, see how much you can afford"},
            {"name": "Government Loans", "folder": "government-loans", "reason": "Compare FHA, VA, USDA options if conventional qualification is tight"},
            {"name": "DTI Stress Test", "folder": "dti-stress-test", "reason": "Stress test your qualified payment against rate changes"}
        ]
    },

    "home-equity": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Track Home Equity?",
            "purpose": "Home equity is the difference between your home's value and what you owe. This calculator tracks your equity growth from both appreciation and mortgage paydown — showing how your largest asset builds wealth over time.",
            "whenToUse": ["To see how much equity you've built for a HELOC, refinance, or sale", "When planning to access equity for investments or home improvements", "To understand how monthly payments split between interest and principal over time"],
            "keyInsight": "In the early years of a 30-year mortgage, most of your payment goes to interest. By year 15, it flips — most goes to principal. This calculator shows that inflection point and how much equity you're building each year."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "HELOC Optimizer", "folder": "heloc-optimizer", "reason": "Use your equity to open a line of credit for investments"},
            {"name": "Refinance", "folder": "refinance", "reason": "Cash-out refinance lets you access equity in a lump sum"},
            {"name": "Seller Net Sheet", "folder": "seller-net-sheet", "reason": "Your equity determines your net proceeds when selling"}
        ]
    },

    "commission": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Calculate Commissions?",
            "purpose": "Real estate commissions are the largest transaction cost in most home sales. This calculator breaks down who gets paid, how much, and how different commission structures affect your net proceeds as a seller or your earnings as an agent.",
            "whenToUse": ["As a seller: to understand how much of your sale price goes to agent fees", "As an agent: to calculate your take-home on each deal after splits and fees", "When negotiating commission rates — understand what's standard vs. what's possible"],
            "keyInsight": "Following the 2024 NAR settlement, commission structures are changing. Buyer commissions are no longer automatically offered through the MLS. This makes commission calculation and negotiation more important than ever."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Seller Net Sheet", "folder": "seller-net-sheet", "reason": "See how commission affects your total selling costs"},
            {"name": "Affordability", "folder": "affordability", "reason": "As a buyer, understand if you need to budget for buyer agent fees"}
        ]
    },

    "1031-exchange": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Use a 1031 Exchange Calculator?",
            "purpose": "A 1031 exchange lets you defer capital gains taxes when selling an investment property by reinvesting the proceeds into a 'like-kind' property. This calculator shows the tax savings and the rules you must follow.",
            "whenToUse": ["When selling an investment property with significant capital gains", "To compare: sell and pay taxes vs. 1031 exchange and defer taxes", "When evaluating replacement property requirements (must be equal or greater value)"],
            "keyInsight": "A 1031 exchange doesn't eliminate taxes — it defers them. But deferral is powerful: invest the tax savings for decades of compounding returns. Some investors chain 1031 exchanges their entire career and never pay capital gains."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Seller Net Sheet", "folder": "seller-net-sheet", "reason": "Calculate your proceeds before running the 1031 analysis"},
            {"name": "Investment Analysis", "folder": "investment-analysis", "reason": "Evaluate the replacement property's investment potential"},
            {"name": "Portfolio Manager", "folder": "portfolio-manager", "reason": "See how the exchange affects your overall portfolio"}
        ]
    },

    "investment-analysis": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Full Investment Analysis?",
            "purpose": "This is the most comprehensive investment calculator in the suite. It combines cash flow, appreciation, equity paydown, tax benefits, and leverage into a complete picture of an investment property's performance over time.",
            "whenToUse": ["For serious investment decisions where you need the complete financial picture", "When presenting a deal to partners, lenders, or investors who need professional-grade analysis", "To project 5, 10, or 30-year returns including all wealth-building components"],
            "keyInsight": "Real estate has 5 profit centers: cash flow, appreciation, principal paydown, tax benefits, and leverage. Most investors only look at 1-2. This calculator captures all five, showing the true power of real estate investment."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Cash Flow", "folder": "cashflow", "reason": "Focused deep-dive into the cash flow component"},
            {"name": "Cap Rate", "folder": "caprate", "reason": "Compare yield against market benchmarks"},
            {"name": "Deal Grading", "folder": "deal-grading", "reason": "Grade the deal across risk and return dimensions"}
        ]
    },

    "re-investment-analyzer": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Use the RE Investment Analyzer?",
            "purpose": "A streamlined investment analysis tool focused on key metrics that matter most — IRR, equity multiple, and cash-on-cash return. Designed for quick deal evaluation and comparison.",
            "whenToUse": ["For quick deal screening before doing a full investment analysis", "To compare multiple deals side by side using standardized metrics", "When you need a fast answer: is this deal worth pursuing?"],
            "keyInsight": "Speed matters in competitive markets. This analyzer gives you the critical metrics in minutes, not hours. Use it to screen deals quickly, then do a deep-dive with the full Investment Analysis calculator on the winners."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Investment Analysis", "folder": "investment-analysis", "reason": "Full analysis once a deal passes initial screening"},
            {"name": "Deal Grading", "folder": "deal-grading", "reason": "Score the deal across multiple dimensions"}
        ]
    },

    "real-estate-investment-analyzer": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why This Analyzer?",
            "purpose": "A comprehensive real estate investment analysis tool that evaluates properties across multiple return metrics — cash flow, appreciation, tax benefits, and equity buildup — giving you the complete investment picture.",
            "whenToUse": ["When evaluating any investment property for purchase", "To model different holding periods and exit strategies", "When comparing real estate returns against stocks, bonds, or other investments"],
            "keyInsight": "Real estate's total return is much higher than cash flow alone suggests. A property yielding 8% cash-on-cash might deliver 20%+ total returns when you include appreciation, debt paydown, and tax benefits. This calculator captures it all."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Cash Flow", "folder": "cashflow", "reason": "Detailed monthly cash flow breakdown"},
            {"name": "Cap Rate", "folder": "caprate", "reason": "Compare cap rates across properties"}
        ]
    },

    "wrap-calculator": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Analyze Wrap Mortgages?",
            "purpose": "A wrap mortgage 'wraps' a new, higher loan around an existing mortgage. You profit from the spread between the existing rate and the wrap rate. This calculator shows the arbitrage opportunity and the monthly cash flow from the spread.",
            "whenToUse": ["When buying subject-to and selling with seller financing — the wrap captures the rate spread", "To calculate the profit from carrying a note at a higher rate than the underlying loan", "When structuring creative deals with multiple financing layers"],
            "keyInsight": "A wrap creates profit from the interest rate spread. If you take a property subject-to a 3.5% existing mortgage and create a wrap note at 7%, you earn the spread on every payment. On a $200K balance, that's ~$7,000/year in passive income from the rate difference alone."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Subject-To", "folder": "subject-to", "reason": "Subject-to is the acquisition strategy that feeds into wrap deals"},
            {"name": "Seller Financing", "folder": "seller-financing", "reason": "The wrap note IS a form of seller financing — compare structures"},
            {"name": "Cash Flow", "folder": "cashflow", "reason": "Model the overall cash flow including wrap spread income"}
        ]
    },

    "sensitivity-grid": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Use a Sensitivity Grid?",
            "purpose": "Investment returns depend on assumptions — rent growth, appreciation, vacancy, rates. The Sensitivity Grid shows how your returns change across a RANGE of assumptions, revealing which variables matter most and where the deal breaks.",
            "whenToUse": ["When stress-testing a deal against multiple scenarios simultaneously", "To identify the 'break-even' point for each key variable", "When presenting risk analysis to partners or lenders — the grid tells the complete story"],
            "keyInsight": "Most investors run one scenario and make a decision. The Sensitivity Grid runs dozens. If a deal is profitable across 80% of the scenarios, it's robust. If it only works in the best case, it's fragile. This tool shows you the difference."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Investment Analysis", "folder": "investment-analysis", "reason": "Run the base case, then stress-test it with the Sensitivity Grid"},
            {"name": "Cash Flow", "folder": "cashflow", "reason": "Cash flow is the most common variable to stress-test"},
            {"name": "Deal Grading", "folder": "deal-grading", "reason": "The sensitivity analysis feeds into overall deal quality assessment"}
        ]
    },

    "rv-park-investment": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Analyze RV Park Investments?",
            "purpose": "RV parks are a niche asset class with unique economics — low per-site costs, seasonal demand, and utility infrastructure requirements. This calculator models the specific revenue and cost structure of RV park ownership.",
            "whenToUse": ["When evaluating an RV park purchase or development opportunity", "To model occupancy rates across seasonal patterns", "When comparing RV park returns to traditional multifamily or self-storage"],
            "keyInsight": "RV parks can generate strong cap rates (8-12%) with low maintenance costs per site. The key metrics are per-site revenue, occupancy by season, and utility infrastructure costs. Unlike apartments, tenants bring their own 'unit.'"
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Cap Rate", "folder": "caprate", "reason": "Compare RV park cap rates to other commercial asset classes"},
            {"name": "Self-Storage", "folder": "self-storage", "reason": "Compare two niche asset classes with similar economics"},
            {"name": "Land Development", "folder": "land-development", "reason": "If developing raw land into an RV park, model the development costs"}
        ]
    },

    "self-storage": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Analyze Self-Storage?",
            "purpose": "Self-storage is one of the most recession-resilient real estate asset classes. This calculator models unit mix, occupancy, and operating costs specific to self-storage facilities.",
            "whenToUse": ["When evaluating a self-storage facility purchase", "To model different unit mixes (5x10, 10x10, 10x20, climate-controlled)", "When comparing self-storage vs. other commercial real estate investments"],
            "keyInsight": "Self-storage has the highest operating margins in real estate (60-70% NOI margins) because there are no kitchens, bathrooms, or living spaces to maintain. Demand is also sticky — people rarely move their stuff out quickly, providing stable income."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Cap Rate", "folder": "caprate", "reason": "Compare storage facility cap rates to market benchmarks"},
            {"name": "RV Park Investment", "folder": "rv-park-investment", "reason": "Compare two niche commercial asset classes"},
            {"name": "Cash Flow", "folder": "cashflow", "reason": "Model the monthly cash flow from the storage facility"}
        ]
    },

    "iul-portfolio": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Combine IUL + Real Estate?",
            "purpose": "An Indexed Universal Life (IUL) policy combined with real estate creates a unique wealth strategy — tax-advantaged insurance cash value plus real estate appreciation and cash flow. This calculator models the combined portfolio performance.",
            "whenToUse": ["When evaluating IUL as part of a broader investment strategy", "To compare: real estate only vs. IUL + real estate combined portfolio", "When your insurance advisor suggests IUL — run the numbers yourself"],
            "keyInsight": "IUL policies offer tax-free loans against cash value, which can fund real estate down payments. But IUL fees are high, caps limit upside, and the strategy is complex. This calculator helps you see if the math actually works."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Investment Analysis", "folder": "investment-analysis", "reason": "Compare real estate only returns vs. the combined IUL strategy"},
            {"name": "Cash Flow", "folder": "cashflow", "reason": "Model the real estate side of the portfolio"}
        ]
    },

    "housing-code-compliance": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Estimate Compliance Costs?",
            "purpose": "Housing code violations can derail a deal or eat into rehab budgets. This calculator estimates the cost of common code compliance items — helping investors budget accurately for older or neglected properties.",
            "whenToUse": ["When evaluating a property with known or suspected code violations", "To budget for code-related repairs in a rehab project", "When assessing the true cost of bringing a distressed property to rentable condition"],
            "keyInsight": "Code violations aren't optional expenses — they're legal requirements. Unpermitted work, lead paint, asbestos, missing smoke detectors, and electrical issues must be addressed. Budget these BEFORE making an offer, not after."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Fix & Flip", "folder": "fixflip", "reason": "Add compliance costs to your rehab budget"},
            {"name": "BRRRR Strategy", "folder": "brrrr", "reason": "Factor compliance into the rehab phase of BRRRR"},
            {"name": "Distressed Asset", "folder": "distressed-asset", "reason": "Distressed properties almost always have code issues"}
        ]
    },

    "buffett-indicator": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Track the Buffett Indicator?",
            "purpose": "The Buffett Indicator (total market cap ÷ GDP) measures whether the stock market is overvalued relative to the economy. For real estate investors, this macro signal helps time entries — when stocks are overvalued, capital often rotates into real estate.",
            "whenToUse": ["When assessing whether to allocate more capital to stocks or real estate", "As a macro market health indicator for your overall investment strategy", "When evaluating market cycle timing for large real estate acquisitions"],
            "keyInsight": "Warren Buffett called this 'the best single measure of where valuations stand at any given moment.' Above 120% historically signals overvaluation. Real estate investors watch this because capital flows between asset classes based on relative value."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Strategic Market Valuation", "folder": "strategic-market-valuation", "reason": "Broader market analysis to complement the Buffett signal"},
            {"name": "Market Agility Index", "folder": "agility-index", "reason": "Local market conditions to pair with macro indicators"}
        ]
    },

    "strategic-market-valuation": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Analyze Market Valuation?",
            "purpose": "This calculator assesses whether a real estate market is fairly valued, overheated, or undervalued based on multiple indicators — price-to-rent ratios, price-to-income ratios, and historical trends.",
            "whenToUse": ["When deciding WHICH market to invest in — not just which property", "To time market entry and exit based on valuation signals", "When comparing markets across different cities or regions"],
            "keyInsight": "Market-level analysis comes before property-level analysis. Even the best deal in an overheated market carries macro risk. Conversely, an average deal in an undervalued market has a tailwind. This calculator helps you pick the right market first."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Buffett Indicator", "folder": "buffett-indicator", "reason": "National macro context for your market-level analysis"},
            {"name": "Market Agility Index", "folder": "agility-index", "reason": "Operational market dynamics beyond just valuation"},
            {"name": "Cap Rate", "folder": "caprate", "reason": "Market cap rates indicate whether a market is expensive or cheap"}
        ]
    },

    "burial-cemetery-tax": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why a Cemetery Tax Calculator?",
            "purpose": "Burial and cemetery properties have unique tax exemptions in many states. This calculator helps cemetery operators and investors understand the potential tax benefits and exemptions available for this specialized real estate niche.",
            "whenToUse": ["When evaluating cemetery property for investment or operation", "To estimate tax exemptions specific to burial/cemetery land", "When assessing the total tax picture of a cemetery-related real estate investment"],
            "keyInsight": "Cemetery land often qualifies for significant property tax exemptions — sometimes 100% exemption on active burial land. But the rules vary dramatically by state. This calculator helps you model the tax impact before investing."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Land Development", "folder": "land-development", "reason": "If developing land for cemetery use, model the development costs"},
            {"name": "Investment Analysis", "folder": "investment-analysis", "reason": "Full investment analysis including the tax exemption benefits"}
        ]
    },

    "agility-index": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Track Market Agility?",
            "purpose": "The Market Agility Index measures how quickly you can enter, execute, and exit deals in a specific market. It factors in days on market, inventory levels, financing availability, and regulatory environment.",
            "whenToUse": ["When comparing markets for investment — which allows the fastest deal execution?", "For flippers: markets with high agility mean faster turns and less holding risk", "When assessing whether a market suits your investment strategy timeline"],
            "keyInsight": "High agility markets have fast sales, abundant inventory, and investor-friendly regulations. Low agility markets have long holding times, scarce inventory, and complex regulations. Match your strategy to the market's agility: flip in high-agility, hold in low-agility."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "Strategic Market Valuation", "folder": "strategic-market-valuation", "reason": "Combine agility with valuation for a complete market assessment"},
            {"name": "Buffett Indicator", "folder": "buffett-indicator", "reason": "National context for local market dynamics"},
            {"name": "Fix & Flip", "folder": "fixflip", "reason": "High agility markets are ideal for flipping strategies"}
        ]
    },

    "solar-roi": {
        "tooltips": {},
        "examples": [],
        "whyThisMatters": {
            "title": "Why Calculate Solar ROI?",
            "purpose": "Solar panels are both an environmental and financial decision. This calculator shows the true return — payback period, lifetime savings, and impact on home value — so you can make a data-driven decision rather than an emotional one.",
            "whenToUse": ["When considering solar panel installation for your home or rental property", "To compare: solar purchase vs. lease vs. PPA (Power Purchase Agreement)", "When evaluating solar as a property value add for resale or rental premium"],
            "keyInsight": "Solar panels typically pay for themselves in 6-10 years and add $15,000-$25,000 to home value (about $4,000 per kW installed). The 30% federal tax credit makes the ROI even stronger. But returns vary dramatically by location, utility rates, and sun exposure."
        },
        "kpiExplains": {},
        "coupled": [
            {"name": "True Cost of Ownership", "folder": "true-cost-ownership", "reason": "See how solar reduces your total homeownership costs"},
            {"name": "Home Equity", "folder": "home-equity", "reason": "Solar adds to your home's value and equity position"},
            {"name": "Cash Flow", "folder": "cashflow", "reason": "For rental properties: solar reduces operating costs, improving cash flow"}
        ]
    }
}

# ============================================================
# INJECTION LOGIC
# ============================================================

def inject_learn_mode(folder_name):
    """Inject Learn Mode into a single calculator."""
    calc_dir = os.path.join(BASE, folder_name)
    html_path = os.path.join(calc_dir, 'index.html')
    
    if not os.path.exists(html_path):
        print(f"  SKIP {folder_name} (no index.html)")
        return False
    
    with open(html_path, 'r') as f:
        html = f.read()
    
    # Don't inject twice
    if 'learn-mode.js' in html:
        print(f"  SKIP {folder_name} (already injected)")
        return False
    
    content = LEARN_CONTENT.get(folder_name, {})
    
    # 1. Add learn-mode.css link after style.css
    css_injection = '<link rel="stylesheet" href="../shared/learn-mode.css">'
    html = html.replace(
        '<link rel="stylesheet" href="../shared/style.css">',
        '<link rel="stylesheet" href="../shared/style.css">\n' + css_injection
    )
    
    # 2. Build LEARN_DATA script
    learn_data_json = json.dumps(content, ensure_ascii=False, indent=2)
    learn_script = f'''<script>window.LEARN_DATA = {learn_data_json};</script>
<script src="../shared/learn-mode.js"></script>'''
    
    # 3. Insert before closing </body>
    html = html.replace('</body>', learn_script + '\n</body>')
    
    with open(html_path, 'w') as f:
        f.write(html)
    
    print(f"  OK   {folder_name}")
    return True


def main():
    injected = 0
    skipped = 0
    
    # Get all calculator folders
    folders = sorted([
        d for d in os.listdir(BASE) 
        if os.path.isdir(os.path.join(BASE, d)) 
        and d != 'shared' 
        and os.path.exists(os.path.join(BASE, d, 'index.html'))
    ])
    
    print(f"Found {len(folders)} calculators\n")
    
    for folder in folders:
        if inject_learn_mode(folder):
            injected += 1
        else:
            skipped += 1
    
    print(f"\nDone: {injected} injected, {skipped} skipped")
    print(f"Calculators with custom content: {len(LEARN_CONTENT)}")
    
    # Report any folders without content
    missing = [f for f in folders if f not in LEARN_CONTENT]
    if missing:
        print(f"\nWARNING: {len(missing)} calculators have no custom LEARN_DATA:")
        for m in missing:
            print(f"  - {m}")


if __name__ == '__main__':
    main()
