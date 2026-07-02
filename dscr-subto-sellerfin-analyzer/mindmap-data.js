/* IntelliTC Solutions — Mind Map Data: dscr-subto-sellerfin-analyzer */
window.MINDMAP_DATA = {
  title: 'DSCR/SubTo/SellerFin Analyzer — Anatomy of a Creative-Finance Capital Stack',
  tree: {
    name: 'How Sources of Funds Balance Uses of Funds at Close',
    children: [
      {
        name: 'Sources of Funds',
        children: [
          { name: 'Existing Mortgage (Sub-To)', desc: 'The seller\u2019s existing lien that stays in place under Sub-To. Leg 1 of the capital stack. The core reason Sub-To works: it locks in a legacy interest rate the buyer could not obtain today.' },
          { name: 'New 1st-Position Loan', desc: 'A newly originated institutional loan (DSCR, hard money, bank) in first-lien position. In pure Sub-To this is $0. In Seller Finance mode this may be the seller-carry itself. In Hybrid it stacks above the seller carry.' },
          { name: 'Seller Financing (Carry)', desc: 'The seller acts as the bank for a portion of the purchase price. Typically junior lien (Leg 2) behind any 1st position. Auto-calculated as the plug that balances the stack.' },
          { name: 'Transactional Funding', desc: 'Same-day wet-close bridge capital for A-B / B-C double-closes. Repaid the same day from the B-C proceeds. Fee (1.5–3%) is a real cost of capital that hits buyer out-of-pocket.' },
          { name: 'Buyer Cash-In', desc: 'Any buyer cash brought to the closing table. Escrow, closing costs, 3rd-party fees, and cash to seller all draw from this pocket. Zero-cash-in structures make cash-back deals possible.' }
        ]
      },
      {
        name: 'Uses of Funds',
        children: [
          { name: 'Purchase Price', desc: 'Contract price from the PSA. The primary use of funds. Every source must sum to this amount plus buyer-side costs.' },
          { name: 'Escrow & Reserves', desc: 'Tax and insurance escrow, plus any seller catch-up (delinquent taxes, past-due HOA, mechanic\u2019s liens). Required by most title companies to close.' },
          { name: 'Buyer Closing Costs', desc: 'Title insurance, recording, attorney, inspection, appraisal. Typical range: 1.5–3% of purchase price.' },
          { name: '3rd-Party Fees', desc: 'Appraisal, doc prep, notary, wire, courier. Small individually but sum to $1,500–$3,000 on most deals.' },
          { name: 'Cash to Seller', desc: 'Down payment paid to seller at closing. Reduces the seller-carry amount. Sellers typically want some cash to cover moving costs, back taxes, or personal use.' },
          { name: 'Transactional Fee', desc: 'The transactional lender\u2019s fee, 1.5–3% of face amount. On a $300K bridge at 2.5%, that\u2019s $7,500 out of the deal.' }
        ]
      },
      {
        name: 'Sub-To Structure',
        children: [
          { name: 'Title Transfers, Loan Doesn\u2019t', desc: 'Buyer takes ownership via warranty deed while the seller\u2019s existing mortgage stays in the seller\u2019s name. The buyer becomes responsible for the payments contractually, but the loan is still legally the seller\u2019s.' },
          { name: 'Due-on-Sale Clause', desc: 'Most mortgages contain a due-on-sale clause allowing the lender to demand full payoff when title transfers. Sub-To relies on either the lender not noticing or placing title in a land trust to reduce triggering risk. Consult counsel.' },
          { name: 'Insurance Re-Issue', desc: 'Homeowners insurance must be re-issued in the buyer\u2019s name (or the entity holding title). The lender must remain listed as loss payee. Skipping this creates a coverage gap.' },
          { name: 'Property Tax Reassessment', desc: 'Depending on state law (California Prop 13, Texas homestead rules), a title transfer may trigger reassessment at market value. Model this in the OpEx line.' },
          { name: 'Servicing & Escrow', desc: 'Buyer either pays the servicer directly or routes payments through a third-party loan servicing company (recommended). Escrow shortages become the buyer\u2019s obligation.' }
        ]
      },
      {
        name: 'Seller Financing Structure',
        children: [
          { name: 'Seller Acts as the Bank', desc: 'The seller carries a promissory note secured by a deed of trust or mortgage. Buyer makes monthly payments to seller. Terms are fully negotiable between parties.' },
          { name: 'Interest-Only Notes', desc: 'Lowest monthly payment. Principal never reduces. Requires a refinance or sale to retire. Common for 3–7 year seller carries where buyer plans to refi out.' },
          { name: 'Amortized Notes', desc: 'Payment includes principal + interest over the note term. Builds buyer equity but higher monthly payment. Standard for 10-20 year seller carries.' },
          { name: 'Balloon Notes', desc: 'Low amortized payment (often 30-year schedule) with a lump-sum payoff at year 3, 5, or 7. Requires a refinance plan. Rising-rate environments make short balloons high-risk.' },
          { name: 'SAFE Act / Dodd-Frank', desc: 'Owner-occupied seller financing may require a licensed loan originator under the SAFE Act. Investor-to-investor deals are typically exempt. Check state licensing rules.' }
        ]
      },
      {
        name: 'Structural Fragility Flags',
        children: [
          { name: 'LTV Cap Violation', desc: 'When a 1st-position loan exceeds the institutional LTV cap (75–80% for DSCR), no lender will underwrite. Non-starter.' },
          { name: 'DSCR Below 1.0', desc: 'NOI does not cover total debt service. The property loses money every month. Only viable if you plan an immediate rent bump, tax appeal, or operational fix.' },
          { name: 'DSCR 1.0–1.25 (Marginal)', desc: 'Debt is covered but below institutional refi threshold. Exit strategy requires operational improvement.' },
          { name: 'Total Leverage > 100%', desc: 'When existing + new + seller carry exceeds purchase price, the buyer has extracted more capital than the property is worth. Signals a "cash-out at close" structure that will collapse if values drop.' },
          { name: 'House of Cards', desc: 'Combined risk of over-leverage, negative cashflow, and cash-back extraction. If rents dip or a lien is called, the stack collapses. Educational flag only.' }
        ]
      },
      {
        name: 'Exit Strategy',
        children: [
          { name: 'Residential Refi (Comp-Based)', desc: 'ARV = comparable sale price at exit. Typical for 1–4 unit properties. Exit LTV: 75% (DSCR product). Refi proceeds pay off existing lien + new 1st + seller carry.' },
          { name: 'Commercial Refi (Cap-Rate)', desc: 'ARV = stabilized NOI ÷ market cap rate. Typical for 5+ units and commercial. Exit LTV: 65–70%. Cap rate expansion in rising-rate environments compresses ARV.' },
          { name: 'Balloon Payoff Alignment', desc: 'If the seller-carry has a balloon, your refi timeline must align with the balloon year. Missing the balloon triggers default.' },
          { name: 'Cash-Out Refi Proceeds', desc: 'Max exit loan (ARV × LTV) minus all lien payoffs equals refi proceeds. Positive proceeds are your extractable return-of-capital. Negative proceeds mean the exit strategy fails.' }
        ]
      }
    ]
  }
};
