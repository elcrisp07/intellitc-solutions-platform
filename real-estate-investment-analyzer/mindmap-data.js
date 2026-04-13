/* IntelliTC Solutions — Mind Map Data: real-estate-investment-analyzer */
window.MINDMAP_DATA = {
  title: "Real Estate Investment Analyzer",
  tree: {
    name: "Investment Analysis",
    children: [
      {
        name: "Acquisition",
        children: [
          { name: "Purchase Price", desc: "The agreed-upon price to acquire the property before additional costs." },
          { name: "Closing Costs", desc: "Fees associated with the refinance including appraisal, title, and lender charges." },
          { name: "Immediate Repairs / CapEx", desc: "Major property improvements that extend the useful life and are capitalized rather than expensed." },
          { name: "Total Acquisition Cost", desc: "The sum of all acquisition cost components." },
          { name: "Equity at Purchase", desc: "The owner\'s financial interest in the property, equal to value minus debt." }
        ]
      },
      {
        name: "Operating Income",
        children: [
          { name: "Gross Potential Income (GPI)", desc: "Potential Income (GPI) before any deductions or expenses." },
          { name: "Vacancy & Credit Loss", desc: "Income lost due to unoccupied units or non-paying tenants." },
          { name: "Effective Gross Income (EGI)", desc: "Gross rent minus vacancy plus other income — the realistic annual revenue." },
          { name: "Operating Expenses", desc: "All costs to run the property excluding mortgage payments." },
          { name: "Net Operating Income (NOI)", desc: "Gross income minus all operating expenses, before mortgage payments. The key measure of property profitability." },
          { name: "Cap Rate at Purchase", desc: "Net Operating Income divided by property value, expressing the property\'s yield." }
        ]
      },
      {
        name: "Financing",
        children: [
          { name: "Loan Amount", desc: "The principal amount lent to the borrower." },
          { name: "LTV Ratio", desc: "The ratio of the loan amount to the property\'s appraised value." },
          { name: "Interest Rate", desc: "The annual cost of borrowing expressed as a percentage of the loan balance." },
          { name: "Amortization Period", desc: "The number of years over which the loan principal is gradually repaid." },
          { name: "Annual Debt Service", desc: "Total annual mortgage payments including principal and interest." },
          { name: "DSCR", desc: "NOI divided by annual debt service — measures the property\'s ability to cover loan payments." }
        ]
      },
      {
        name: "Cash Flow",
        children: [
          { name: "NOI Less Debt Service", desc: "Net Operating Income — gross income minus all operating expenses before debt service." },
          { name: "Annual Cash Flow", desc: "Total cash flow over 12 months — the primary measure of passive income." },
          { name: "Cash-on-Cash Return", desc: "Annual cash flow divided by total cash invested, showing the return on out-of-pocket capital." },
          { name: "Monthly Net Cash Flow", desc: "Net income received each month after all expenses and debt service." }
        ]
      },
      {
        name: "IRR & Returns",
        children: [
          { name: "Hold Period (Years)", desc: "The number of years the investor plans to own the property." },
          { name: "Projected Exit Cap Rate", desc: "The projected capitalization rate at the time of future sale, used to estimate exit value." },
          { name: "Exit / Reversion Value", desc: "The estimated property value at the end of the holding period." },
          { name: "Projected Appreciation", desc: "The increase in property value over time." },
          { name: "Loan Paydown (Equity Buildup)", desc: "The gradual increase in ownership value through principal paydown and appreciation." },
          { name: "Internal Rate of Return (IRR)", desc: "The discount rate that makes the NPV of all cash flows equal to zero, representing the annualized return." },
          { name: "Equity Multiple", desc: "The owner\'s financial interest in the property, equal to value minus debt." },
          { name: "Total Return on Investment", desc: "The sum of all return on investment components." }
        ]
      }
    ]
  }
};

// 12. Refinance Calculator;
