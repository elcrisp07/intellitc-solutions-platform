/* ============================================================
   Land Flip — Learn Mode Data
   Tooltips + Example Scenarios + Why This Matters + Coupled Calcs
   ============================================================ */
window.LEARN_DATA = {
  tooltips: {
    /* ---- Deal Doctor (dealPanel) inputs ---- */
    dAcqCost: "<strong>Acquisition Cost</strong> — What you'd pay the seller for the parcel. In rural/tax-delinquent land flipping this is often a steep discount (40–70% off market) because you're buying directly from an uninterested, distant, or motivated owner.",
    dAcqClosing: "<strong>Buyer Closing Costs</strong> — Title search, deed recording, attorney or escrow, and any title insurance. For small land deals expect $300–$800 total; some flippers self-close with just a recording fee.",
    dCompValue: "<strong>Estimated Market Value</strong> — What comparable parcels nearby actually sold for in the last 6–12 months. Use real closed sales (not active listings) from the county assessor, Lands of America, or AcreValue. This is your ceiling — never guess.",
    dAcreage: "<strong>Parcel Size</strong> — Total acreage. Used to compute your price-per-acre vs. comps. For raw land, price-per-acre is the most honest comparison because parcels are never identical in shape or features.",
    dBackTaxes: "<strong>Back Taxes Owed</strong> — Unpaid property taxes that transfer with the parcel. Always verify with the county treasurer before closing. This is one of the most common \"hidden\" costs that kills rookie land deals.",
    dHoldMonths: "<strong>Expected Hold Time</strong> — How many months you'll own the parcel before selling. Cash sales average 2–4 months. Improve-and-sell runs 4–8 months. Owner-financed listings can sell in days once priced right.",
    dMonthlyTax: "<strong>Monthly Property Tax</strong> — Annual tax ÷ 12. For rural land this is often $10–$50/mo, but check the county record — some parcels have unexpected special assessments.",
    dInsurance: "<strong>Monthly Insurance</strong> — Most raw land needs no insurance. Add it only if there are structures (sheds, fences, wells) or if your lender requires it. Most flippers carry a cheap liability-only land policy ($10–$25/mo).",

    /* ---- Exit Strategist (exitPanel) — common ---- */
    eAcqCost: "<strong>Total Acquisition Cost (All-In)</strong> — The full amount invested upfront: what you paid + buyer-side closing + back taxes + any initial fees. Copy this from the \"All-In Cost\" result on the Deal Doctor above.",
    eHoldCosts: "<strong>Total Holding Costs</strong> — Property tax + insurance × hold months. This eats your margin month after month. Low-cost rural parcels may hold for $5–$50/mo; high-tax Texas or California parcels can run $200+/mo.",

    /* ---- Exit: Cash Sale strategy ---- */
    eCashPrice: "<strong>Target Sale Price</strong> — What you plan to list and close at. Conservative flippers price at 70–80% of comps for a fast cash exit. Aggressive flippers list at full market and wait longer.",
    eCashClosing: "<strong>Seller Closing Costs</strong> — Title work, deed prep, recording fees on your side as the seller. Typical small-deal total: $400–$1,200.",
    eCashAgent: "<strong>Agent Commission</strong> — Realtor fee. FSBO (for sale by owner) = 0%. MLS with flat-fee broker ≈ 2–3%. Full-service agent ≈ 5–6%. Land sells slower through MLS because most agents avoid raw land, so many flippers go FSBO.",
    eCashMarketing: "<strong>Marketing Costs</strong> — Lands of America listing (~$40/mo), Craigslist ads, signs on the property, Facebook Marketplace promo. Plan $100–$400 per flip.",
    eCashTimeline: "<strong>Estimated Time to Sell</strong> — Months on market before closing. A well-priced rural parcel listed on Lands of America + Facebook sells in 2–4 months on average.",

    /* ---- Exit: Owner Financing strategy ---- */
    eOfPrice: "<strong>Sale Price (Financed)</strong> — You can price owner-financed deals 20–40% above cash comps because you're giving the buyer financing they can't get anywhere else. This is the core profit lever in owner financing.",
    eOfDown: "<strong>Buyer Down Payment</strong> — What the buyer puts up upfront. Standard is 10–20%. Higher down payment = less default risk but fewer eligible buyers. Most land flippers require $1,500–$3,000 minimum.",
    eOfRate: "<strong>Interest Rate</strong> — What the buyer pays you annually. Typical owner-financed land notes run 8–12%. Some states cap rates — verify your state's usury laws.",
    eOfTerm: "<strong>Loan Term</strong> — Months of amortization. 60 months (5 yr) is common. Longer terms give lower monthly payments but take longer to fully cash out.",
    eOfClosing: "<strong>Seller Closing Costs</strong> — Title, deed, servicing setup fees. Owner-financed deals often have lower closing costs since no bank is involved.",
    eOfDefault: "<strong>Default Risk Discount</strong> — A haircut on projected revenue to reflect real-world default rates. Land note portfolios typically see 10–20% of notes go into default at some point. Build this into every projection.",

    /* ---- Exit: Improve & Sell strategy ---- */
    eImpCost: "<strong>Improvement Costs</strong> — Clearing brush, adding a driveway, perking for septic, survey, well, or electric drop. Even a simple survey + driveway cut ($2K–$4K) can double a parcel's marketable value.",
    eImpPrice: "<strong>Target Sale Price (After Improvements)</strong> — New comp target after the work is done. Buildable parcels sell for 2–5× the price of raw, landlocked, or unbuildable parcels.",
    eImpClosing: "<strong>Seller Closing Costs</strong> — Same as cash sale but typically higher because improved parcels often go through a retail buyer + agent + bank.",
    eImpAgent: "<strong>Agent Commission</strong> — Improved parcels are more likely to be sold through MLS because they appeal to end-user buyers (families, builders) who work with agents.",
    eImpMarketing: "<strong>Marketing Costs</strong> — Professional photos, drone footage, staged signs, MLS listing. Plan $300–$800 to present an improved parcel well.",
    eImpTimeline: "<strong>Total Time (Improve + Sell)</strong> — Months of work + months on market. Improvements alone take 30–90 days; then you market. Budget 4–8 months total."
  },

  examples: [
    {
      name: "Rural Texas Flip — Cash Sale",
      desc: "5 acres bought at $8,000, comps say $20,000. Flip it fast for cash. Classic beginner play.",
      values: {
        dAcqCost: 8000,
        dAcqClosing: 600,
        dCompValue: 20000,
        dAcreage: 5,
        dBackTaxes: 0,
        dHoldMonths: 3,
        dMonthlyTax: 22,
        dInsurance: 0,
        eAcqCost: 8600,
        eHoldCosts: 66,
        eCashPrice: 18000,
        eCashClosing: 800,
        eCashAgent: "0",
        eCashMarketing: 300,
        eCashTimeline: 3
      }
    },
    {
      name: "Appalachia Owner-Finance",
      desc: "2.3 acres, $4,500 acquired, offered with $1,000 down at 9% over 60 months. Premium pricing for the note.",
      values: {
        dAcqCost: 4500,
        dAcqClosing: 450,
        dCompValue: 9000,
        dAcreage: 2.3,
        dBackTaxes: 150,
        dHoldMonths: 2,
        dMonthlyTax: 18,
        dInsurance: 0,
        eAcqCost: 5100,
        eHoldCosts: 36,
        eOfPrice: 12500,
        eOfDown: 1000,
        eOfRate: 9,
        eOfTerm: 60,
        eOfClosing: 400,
        eOfDefault: "15"
      }
    },
    {
      name: "Florida Buildable Upgrade",
      desc: "1 acre near a growing suburb. Add a survey, driveway cut, and clear brush. Resell as buildable.",
      values: {
        dAcqCost: 14000,
        dAcqClosing: 800,
        dCompValue: 28000,
        dAcreage: 1,
        dBackTaxes: 0,
        dHoldMonths: 5,
        dMonthlyTax: 42,
        dInsurance: 15,
        eAcqCost: 14800,
        eHoldCosts: 285,
        eImpCost: 4200,
        eImpPrice: 38000,
        eImpClosing: 1400,
        eImpAgent: "3",
        eImpMarketing: 450,
        eImpTimeline: 6
      }
    },
    {
      name: "Back-Taxes Deep Discount",
      desc: "Direct-to-owner offer on a neglected parcel. $2,200 + $800 back taxes. Sell fast for cash at $9,500.",
      values: {
        dAcqCost: 2200,
        dAcqClosing: 300,
        dCompValue: 11000,
        dAcreage: 4,
        dBackTaxes: 800,
        dHoldMonths: 4,
        dMonthlyTax: 12,
        dInsurance: 0,
        eAcqCost: 3300,
        eHoldCosts: 48,
        eCashPrice: 9500,
        eCashClosing: 500,
        eCashAgent: "0",
        eCashMarketing: 250,
        eCashTimeline: 4
      }
    }
  ],

  whyThisMatters: {
    title: "Why Use the Land Flip Calculator?",
    purpose: "Land flipping is one of the most accessible real-estate strategies — low capital, no tenants, no contractors. But rookie mistakes (overpaying, missing back taxes, underestimating hold costs) quietly kill margins. This calculator stress-tests every deal before you wire money.",
    whenToUse: [
      "Before making an offer — run the numbers with your target acquisition price to confirm the spread",
      "When comparing cash sale vs. owner financing vs. improve-and-sell on the same parcel",
      "When a seller counters your offer — rerun to see how much margin you still have",
      "When budgeting how much you can spend on improvements while staying profitable"
    ],
    keyInsight: "The number that matters most isn't purchase price — it's the <strong>spread</strong> between your all-in cost and your market value. A $2,000 parcel you sell for $8,000 is a better deal than a $20,000 parcel you sell for $30,000, because your cash-on-cash return is 4× higher.",
    proTip: "Run the same parcel through all three exit strategies. Most flippers default to cash sale because it's simple, but owner financing typically produces 30–60% more total profit per parcel — with the tradeoff of slower payback. Pick the exit that fits your cash-flow needs, not just your habits."
  },

  coupled: [
    { name: "Deal Underwriting", folder: "deal-grading", reason: "Grade any land parcel on a 100-point rubric before you commit" },
    { name: "Creative Finance", folder: "creative-finance", reason: "Structure seller financing, wraps, and subject-to on larger land deals" },
    { name: "Capital Gains Tax", folder: "capital-gains", reason: "Estimate what you'll owe when you sell — flips held under 1 year are taxed as ordinary income" },
    { name: "Scenario Lab", folder: "scenario-lab", reason: "Sandbox for running multiple parcels side-by-side to rank opportunities" }
  ]
};
