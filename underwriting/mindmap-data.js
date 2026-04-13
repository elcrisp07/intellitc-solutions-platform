/* IntelliTC Solutions — Mind Map Data: underwriting */
window.MINDMAP_DATA = {
  title: "Deal Underwriting Worksheet",
  tree: {
    name: "Deal Underwriting",
    children: [
      {
        name: "Property Financials",
        children: [
          { name: "Gross Scheduled Income", desc: "The total potential income if every unit were rented at market rate with zero vacancy." },
          { name: "Vacancy & Credit Loss Allowance", desc: "Income lost due to unoccupied units or non-paying tenants." },
          { name: "Effective Gross Income (EGI)", desc: "Gross rent minus vacancy plus other income — the realistic annual revenue." },
          { name: "Operating Expenses (Line-by-Line)", desc: "A quantitative assessment used to evaluate this factor." },
          { name: "Net Operating Income (NOI)", desc: "Gross income minus all operating expenses, before mortgage payments. The key measure of property profitability." }
        ]
      },
      {
        name: "T-12 Analysis",
        children: [
          { name: "Trailing 12-Month Actuals", desc: "The property's actual income and expenses over the most recent 12 months." },
          { name: "Month-by-Month Income", desc: "A detailed monthly breakdown of all income sources." },
          { name: "Month-by-Month Expenses", desc: "A detailed monthly breakdown of all operating expenses." },
          { name: "T-12 NOI", desc: "Net Operating Income — gross income minus all operating expenses before debt service." },
          { name: "Normalized NOI (Remove Anomalies)", desc: "Net Operating Income — gross income minus all operating expenses before debt service." },
          { name: "Expense Ratio Trend", desc: "How the expense ratio has changed over recent months, indicating operational efficiency trends." }
        ]
      },
      {
        name: "Rent Roll",
        children: [
          { name: "Unit Number & Type", desc: "The specific unit identifier and its configuration (1BR, 2BR, etc.)." },
          { name: "In-Place Rent vs. Market Rent", desc: "A comparison analyzing In-Place Rent versus Market Rent." },
          { name: "Lease Start / End Dates", desc: "The contractual agreement defining terms of the tenant\'s occupancy." },
          { name: "Delinquency Status", desc: "Whether the tenant is current, late, or in default on rent payments." },
          { name: "Rent Roll Total", desc: "The schedule of lease expirations and expected renewals." },
          { name: "Mark-to-Market Upside", desc: "The potential income increase from raising rents to current market rates." }
        ]
      },
      {
        name: "Pro Forma",
        children: [
          { name: "Stabilized Revenue Assumptions", desc: "Projected income once the property reaches full occupancy at market rents." },
          { name: "Expense Growth Assumptions", desc: "The projected annual increase in operating expenses." },
          { name: "Pro Forma NOI (Year 1-5)", desc: "Projected Net Operating Income based on anticipated rents and expenses." },
          { name: "Reversion Value at Exit", desc: "The estimated property value at the time of future sale." },
          { name: "Sensitivity of Pro Forma", desc: "An analysis testing how results change under different assumptions." }
        ]
      },
      {
        name: "Debt Sizing",
        children: [
          { name: "DSCR Constraint (Min 1.25x)", desc: "The minimum Debt Service Coverage Ratio required by the lender, typically 1.20–1.25x." },
          { name: "LTV Constraint", desc: "The ratio of the loan amount to the property\'s appraised value." },
          { name: "Debt Yield Constraint (NOI / Loan)", desc: "Net Operating Income — gross income minus all operating expenses before debt service." },
          { name: "Maximum Loan Amount", desc: "The largest mortgage a lender will approve based on the buyer\'s financial profile." },
          { name: "Loan Terms & Amortization", desc: "The number of years over which the loan principal is gradually repaid." }
        ]
      },
      {
        name: "Returns",
        children: [
          { name: "Cash-on-Cash Return", desc: "Annual cash flow divided by total cash invested, showing the return on out-of-pocket capital." },
          { name: "Unlevered IRR", desc: "Internal Rate of Return calculated with debt financing included." },
          { name: "Levered IRR", desc: "Internal Rate of Return calculated with debt financing included." },
          { name: "Equity Multiple", desc: "The owner\'s financial interest in the property, equal to value minus debt." },
          { name: "Return on Equity (ROE)", desc: "The owner\'s financial interest in the property, equal to value minus debt." }
        ]
      },
      {
        name: "Risk Scoring",
        children: [
          { name: "Market Risk Score", desc: "A composite assessment of downside risk factors in the local market." },
          { name: "Physical Condition Risk", desc: "The risk of unexpected repairs or structural issues affecting returns." },
          { name: "Tenant / Lease Risk", desc: "The contractual agreement defining terms of the tenant\'s occupancy." },
          { name: "Financing Risk", desc: "The risk that financing terms change unfavorably, such as rate resets or inability to refinance." },
          { name: "Composite Risk Rating", desc: "A numerical assessment of the investment\'s risk level." }
        ]
      }
    ]
  }
};

// 29. Wrap Mortgage Calculator;
