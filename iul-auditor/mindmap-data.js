/* IntelliTC Solutions — Mind Map Data: iul-auditor */
window.MINDMAP_DATA = {
  title: 'IUL Auditor — Anatomy of an Existing Indexed Universal Life Policy',
  tree: {
    name: 'How an IUL Policy Is Actually Structured',
    children: [
      {
        name: 'Policy Chassis',
        children: [
          { name: 'Face Amount', desc: 'The death benefit your policy will pay if you die in-force. Also drives the per-thousand cost of insurance charges deducted from cash value every month. A larger face means higher monthly drag on accumulation.' },
          { name: 'Death Benefit Option A (Level)', desc: 'Death benefit stays level at the face amount; as cash value grows, the net amount at risk to the insurer shrinks. Best for max-funded accumulation IUL — minimizes cost of insurance over time.' },
          { name: 'Death Benefit Option B (Increasing)', desc: 'Death benefit equals face plus accumulated cash value. Higher cost of insurance because the net amount at risk does not shrink. Useful when the goal is death benefit growth or estate transfer rather than pure cash accumulation.' },
          { name: 'Death Benefit Option C (ROP)', desc: 'Death benefit equals face plus return of premiums paid. Common when policy was sold for legacy with a premium-recovery feature. Higher cost than Option A; less efficient for accumulation.' },
          { name: 'Policy Intent', desc: 'Accumulation, protection, or hybrid. The "right" structure depends on intent. A policy sold for accumulation with an Option A + heavy PUA looks very different from a protection-first policy with Option B + minimum PUA.' }
        ]
      },
      {
        name: 'Funding Structure',
        children: [
          { name: 'Base Premium', desc: 'The portion of premium that buys the underlying permanent insurance. Higher base = more cost of insurance, higher agent commission, less efficient cash accumulation per dollar.' },
          { name: 'PUA Rider Premium', desc: 'Paid-Up Additions rider. Buys mini paid-up insurance with most of the dollar going to cash value. A max-funded accumulation IUL typically allocates 40–60% of premium to PUA. Low PUA share is often a sign of commission-optimized rather than client-optimized design.' },
          { name: '7-Pay Test (MEC)', desc: 'IRC §7702A. If cumulative premiums in the first 7 years exceed the MEC limit, the policy becomes a Modified Endowment Contract — losing tax-free loan access. Once classified MEC, the policy stays MEC for life.' },
          { name: 'Target vs Minimum vs Maximum', desc: 'Carrier illustrations show three premium tiers. Target premium drives commission. Minimum keeps the policy in force. Maximum is the MEC ceiling. Premiums between target and maximum (with full PUA) are the accumulation sweet spot.' },
          { name: 'Underfunded Caution', desc: 'Premium below 60% of MEC limit with accumulation intent typically signals the policy was sold for protection but pitched as cash accumulation. Cash value growth will lag the illustration materially.' }
        ]
      },
      {
        name: 'Index Strategy Mechanics',
        children: [
          { name: 'Cap Rate', desc: 'Upper limit on credited interest for an index period. If the index gains 22% and the cap is 9%, you receive 9%. Caps reset annually at carrier discretion (within contractually disclosed minimums).' },
          { name: 'Floor', desc: 'Lower limit on credited interest. A 0% floor means you never lose principal to negative index returns (you still pay policy charges). Floors below 0% expose principal to index losses — a critical structural risk flag.' },
          { name: 'Participation Rate', desc: 'Percentage of the index gain credited before cap/spread is applied. A 100% participation rate is standard. Below 100% effectively layers a second cap on top of the cap itself ("double-cap" structure).' },
          { name: 'Spread', desc: 'Fixed percentage subtracted from index return before crediting. Common on uncapped strategies. A 3% spread on a 12% index gain credits 9%. Spreads above 3% on uncapped strategies materially reduce expected return.' },
          { name: 'Volatility-Controlled Indices', desc: 'Custom indices (e.g. S&P 500 Daily Risk Control 5%, BlackRock ESG, JP Morgan Mozaic) that target a volatility level rather than a benchmark. Often paired with higher caps or no caps — but the underlying index already caps upside through volatility targeting.' }
        ]
      },
      {
        name: 'Loan Architecture',
        children: [
          { name: 'Variable (Participating) Loans', desc: 'Loan interest rate floats with a published index (often Moody\'s corporate bond rate). Loaned cash value continues to participate in index strategies. Spread between loan cost and crediting can be positive or negative — variable loans amplify both outcomes.' },
          { name: 'Fixed Loans', desc: 'Loan interest rate is set in the contract (often 2–5%). Loaned cash value typically moves to a fixed account and stops participating in index strategies. Predictable but caps upside.' },
          { name: 'Wash / Zero-Cost Loans', desc: 'Loan interest rate equals the crediting rate on the loaned cash value — net cost is zero. Often available after a stated number of policy years (commonly 10+). The most efficient structure for retirement income via tax-free loans.' },
          { name: 'Overloan Protection Rider', desc: 'Carrier provision that prevents the policy from lapsing due to outstanding loans triggering tax recognition of all prior gain. Essential for any policy structured for tax-free retirement income via loans. Activation requirements vary by carrier.' },
          { name: 'Loan / Cash Value Ratio', desc: 'A loan balance above 50% of cash value without overloan protection is a structural lapse risk. A lapsed loaned policy treats the loan as a distribution — every prior gain becomes immediately taxable.' }
        ]
      },
      {
        name: 'Illustration Sanity (AG-49A)',
        children: [
          { name: 'What AG-49A Limits', desc: 'NAIC Actuarial Guideline 49A constrains the maximum crediting rate an insurer can show in an illustration based on the lookback math of the underlying index and the index strategy. Adopted to stop the early-2010s illustration arms race.' },
          { name: 'Why It Matters', desc: 'Pre-AG-49A illustrations sometimes assumed 8–9% steady crediting. AG-49A caps depend on strategy and carrier (most fall in the 5.5–6.5% range). Any illustration above the cap was either pre-AG-49A or non-compliant.' },
          { name: 'Volatility-Controlled Carve-Out', desc: 'AG-49A includes specific limits for volatility-controlled indices, generally lower than vanilla S&P 500 caps. Some carriers exploited the original guideline; AG-49A revisions closed those loopholes.' },
          { name: 'Reasonable Range', desc: 'For a vanilla S&P 500 capped strategy in 2026, an illustrated rate above 7% should trigger a sanity check, and above the strategy\'s AG-49A maximum is a critical flag.' }
        ]
      },
      {
        name: 'Liquidity & Surrender',
        children: [
          { name: 'Surrender Charge Period', desc: 'Years during which surrendering the policy reduces cash value by a declining charge. Typical range: 10–15 years. The longer the period and the higher the back-end charge, the more upfront commission the policy paid.' },
          { name: 'Why Period Length Matters', desc: 'A surrender period that extends past the policyholder\'s stated retirement income year creates a liquidity mismatch. Cash surrender value is materially less than reported cash value during this window.' },
          { name: 'Loan Access vs Surrender', desc: 'Policy loans are not surrenders and do not trigger surrender charges. Properly structured retirement income IUL is accessed via loans, not surrenders — preserving tax-free treatment.' }
        ]
      },
      {
        name: 'Rider Coverage',
        children: [
          { name: 'Chronic Illness Rider', desc: 'Accelerates a portion of the death benefit if the insured cannot perform 2 of 6 Activities of Daily Living. Often free or low-cost on accumulation IULs. Material gap if missing on a policy held into late life.' },
          { name: 'Long-Term Care Rider', desc: 'Similar to chronic illness but with formal LTC certification and benefit periods. Typically has a charge. Common on premium accumulation IULs designed for retirement income.' },
          { name: 'No-Lapse Guarantee', desc: 'Carrier guarantee that the policy stays in force if minimum premiums are paid, regardless of cash value performance. Shorter NLG periods on accumulation IUL are normal; longer NLGs trade off cash growth.' },
          { name: 'Lifetime Income Benefit Rider', desc: 'Some carriers offer a guaranteed lifetime withdrawal rider that locks in income regardless of cash value performance. Adds cost; useful where lifetime income certainty matters more than maximum accumulation.' }
        ]
      },
      {
        name: 'How This Tool Reads Your Policy',
        children: [
          { name: 'It Computes, Not Recommends', desc: 'The Auditor measures published policy mechanics against industry norms for the policy type you entered. It surfaces structural facts. It does not tell you to surrender, exchange, or replace — those are regulated suitability decisions.' },
          { name: 'Three Severity Levels', desc: 'Critical: material risk to the contract\'s tax treatment, lapse-resistance, or stated purpose. Caution: meaningful drag on the policy\'s ability to meet its stated intent. Informational: structural notes a licensed advisor should know about.' },
          { name: 'Findings Always Defer', desc: 'Every finding ends with "Consult a licensed advisor about [specific topic]." There is no version of this tool that recommends action on a policy. By design.' },
          { name: 'Use With Your Licensed Advisor', desc: 'Bring the findings list, your in-force illustration, and your most recent annual statement to a licensed life insurance professional. The Auditor is a structured starting point for that conversation, not a substitute for it.' }
        ]
      }
    ]
  }
};
