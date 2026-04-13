/* IntelliTC Solutions — Mind Map Data: deal-grading */
window.MINDMAP_DATA = {
    title: 'Deal Grading Calculator',
    tree: {
      name: 'Deal Grading Scorecard',
      children: [
        {
          name: 'Financial Metrics Score',
          children: [
            { name: 'Cap Rate (score vs. market benchmark)', desc: 'A comparison analyzing Cap Rate (score versus market benchmark).' },
            { name: 'Cash-on-Cash Return (target ≥ 8%)', desc: 'Annual cash flow divided by total cash invested, measuring the return on out-of-pocket capital.' },
            { name: 'DSCR (score ≥ 1.25)', desc: 'NOI divided by annual debt service — measures the property\'s ability to cover loan payments.' },
            { name: 'IRR (target ≥ 15%)', desc: 'The minimum IRR required for the investment to meet return objectives.' },
            { name: 'Equity Multiple (target ≥ 1.5×)', desc: 'The owner\'s financial interest in the property, equal to value minus debt.' }
          ]
        },
        {
          name: 'Location Score',
          children: [
            { name: 'MSA Population Growth Rate', desc: 'Annual population growth in the Metropolitan Statistical Area, indicating demand trends.' },
            { name: 'Job Market Diversification', desc: 'How varied the local employment base is across different industries.' },
            { name: 'School District Rating', desc: 'A quantitative assessment used to evaluate this factor.' },
            { name: 'Crime Index', desc: 'A statistical measure of crime levels in the area, affecting property values and tenant demand.' },
            { name: 'Proximity to Employment Centers & Amenities', desc: 'The distance to major employers, shopping, schools, and transportation.' }
          ]
        },
        {
          name: 'Property Condition Score',
          children: [
            { name: 'Age & Remaining Useful Life of Systems', desc: 'The age and expected remaining lifespan of major building components (roof, HVAC, etc.).' },
            { name: 'Deferred Maintenance Estimate', desc: 'Repairs and upkeep that have been postponed, potentially decreasing property value.' },
            { name: 'Structural Integrity (inspection findings)', desc: 'A professional examination of the property\'s physical condition and systems.' },
            { name: 'CapEx Requirement in Year 1–3', desc: 'Major property improvements that extend the useful life and are capitalized rather than expensed.' }
          ]
        },
        {
          name: 'Market Timing Score',
          children: [
            { name: 'Market Cycle Phase (expansion / peak / contraction)', desc: 'The current phase of the real estate market cycle in this location.' },
            { name: 'Days on Market Trend', desc: 'Whether properties are selling faster or slower compared to recent months.' },
            { name: 'Rent Growth Trajectory', desc: 'The annual percentage increase in rental rates.' },
            { name: 'New Supply Pipeline (# units under construction)', desc: 'A metric related to short-term rental performance and operations.' }
          ]
        },
        {
          name: 'Risk Factor Deductions',
          children: [
            { name: 'Single-Tenant Concentration Risk', desc: 'A party renting and occupying the property.' },
            { name: 'Environmental Risk Flag', desc: 'An environmental consideration affecting the property\'s condition or value.' },
            { name: 'Flood Zone / Catastrophe Risk', desc: 'A metric related to short-term rental performance and operations.' },
            { name: 'Litigation / Title Issues', desc: 'A matter related to legal ownership documentation of the property.' }
          ]
        },
        {
          name: 'Weighted Composite Grade',
          children: [
            { name: 'Category Weights (Financial 40%, Location 25%, etc.)', desc: 'The relative importance assigned to each scoring category in the overall assessment.' },
            { name: 'Raw Score × Weight = Weighted Score', desc: 'Formula: Raw Score × Weight = Weighted Score.' },
            { name: 'Total Score → Grade (A / B / C / D / F)', desc: 'A quantitative assessment used to evaluate this factor.' },
            { name: 'Go / No-Go Decision Threshold', desc: 'The criteria determining whether the investment meets minimum requirements to proceed.' }
          ]
        }
      ]
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 17. Distressed Asset Analyzer
  // ─────────────────────────────────────────────────────────────────────────────;
