/* IntelliTC Solutions — Mind Map Data: rental-analysis */
window.MINDMAP_DATA = {
  title: 'Rental Analysis Calculator',
  tree: {
    name: "Rental Analysis",
    children: [
      {
        name: "Gross Rent",
        children: [
          { name: "Monthly Market Rent", desc: "The current going rate for comparable rental units in the area." },
          { name: "Gross Annual Rent", desc: "Total rent collected before deducting any expenses." },
          { name: "Other Income (Parking, Laundry)", desc: "Income generated from parking spaces or parking fees." },
          { name: "Gross Scheduled Income", desc: "The total potential income if every unit were rented at market rate with zero vacancy." }
        ]
      },
      {
        name: "Vacancy",
        children: [
          { name: "Vacancy Rate (%)", desc: "The percentage of time units are expected to be unoccupied, reducing effective income." },
          { name: "Annual Vacancy Loss ($)", desc: "Income lost due to unoccupied units or non-paying tenants." },
          { name: "Credit Loss Allowance", desc: "A reserve for income that will not be collected due to non-payment." },
          { name: "Effective Gross Income (EGI)", desc: "Gross rent minus vacancy plus other income — the realistic annual revenue." }
        ]
      },
      {
        name: "Operating Expenses",
        children: [
          { name: "Property Taxes", desc: "Annual taxes levied by the local government, often paid monthly into escrow." },
          { name: "Insurance", desc: "Hazard and liability coverage premiums for the property." },
          { name: "Property Management (8-10%)", desc: "Property Management — 8-10%." },
          { name: "Repairs & Maintenance", desc: "Ongoing costs for routine upkeep, typically budgeted at 5–10% of rent." },
          { name: "Capital Expenditure Reserve", desc: "Funds set aside annually for future major repairs and replacements." },
          { name: "Utilities (If Landlord-Paid)", desc: "Essential services including electricity, water, gas, and sewer." },
          { name: "Total Operating Expenses", desc: "Sum of all costs to operate the property excluding debt service." }
        ]
      },
      {
        name: "Mortgage & Financing",
        children: [
          { name: "Purchase Price", desc: "The agreed-upon price to acquire the property before additional costs." },
          { name: "Down Payment (%)", desc: "The down payment expressed as a percentage of the purchase price." },
          { name: "Loan Amount", desc: "The principal amount lent to the borrower." },
          { name: "Interest Rate & Term", desc: "The periodic cost of borrowing expressed as a percentage." },
          { name: "Monthly Principal & Interest", desc: "Principal & Interest calculated on a monthly basis." },
          { name: "Annual Debt Service", desc: "Total annual mortgage payments including principal and interest." }
        ]
      },
      {
        name: "Cash Flow & Returns",
        children: [
          { name: "Net Operating Income (NOI)", desc: "Gross income minus all operating expenses, before mortgage payments. The key measure of property profitability." },
          { name: "Annual Cash Flow (After Debt)", desc: "Total cash flow over 12 months from the investment." },
          { name: "Monthly Cash Flow", desc: "Income remaining after paying the existing mortgage and operating expenses." },
          { name: "Cash-on-Cash Return", desc: "Annual cash flow divided by total cash invested, showing the return on out-of-pocket capital." },
          { name: "Cap Rate", desc: "Net Operating Income divided by property value, expressing the property\'s yield." },
          { name: "Gross Rent Multiplier", desc: "Purchase price divided by annual gross rent — a quick valuation screening tool." }
        ]
      },
      {
        name: "Appreciation & ROI",
        children: [
          { name: "Annual Appreciation Rate", desc: "The annual percentage increase in property value." },
          { name: "Projected Value (5/10-Year)", desc: "A forecast of value (5/10-year) based on current data and assumptions." },
          { name: "Equity Buildup (Amortization)", desc: "The gradual repayment of loan principal through scheduled payments over time." },
          { name: "Total ROI (All Sources)", desc: "Return on Investment — net profit divided by total capital invested." }
        ]
      }
    ]
  }
};

// 15. RV Park Investment;
