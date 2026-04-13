/* IntelliTC Solutions — Mind Map Data: multifamily */
window.MINDMAP_DATA = {
  title: 'Multi-Family Investment Calculator',
  tree: {
    name: "Multifamily Property",
    children: [
      {
        name: "Unit Mix",
        children: [
          { name: "Studio / 0BR Unit Count", desc: "The number of studio (zero-bedroom) units in the property." },
          { name: "1BR Unit Count", desc: "Total number of 1BR units in the property." },
          { name: "2BR Unit Count", desc: "Total number of 2BR units in the property." },
          { name: "3BR+ Unit Count", desc: "Total number of 3BR+ units in the property." },
          { name: "Total Unit Count", desc: "The sum of all unit count components." },
          { name: "Avg. SF per Unit Type", desc: "The metric expressed per individual rental unit for standardized comparison." }
        ]
      },
      {
        name: "Rental Income",
        children: [
          { name: "Market Rent per Unit by Type", desc: "The current going rate for comparable rental units in the area." },
          { name: "Gross Potential Rent (GPR)", desc: "Total rent collected before deducting any expenses." },
          { name: "Physical Vacancy Rate", desc: "The percentage of time units are expected to be unoccupied, reducing effective income." },
          { name: "Economic Vacancy / Credit Loss", desc: "Income lost due to unoccupied units or non-paying tenants." },
          { name: "Effective Gross Income (EGI)", desc: "Gross rent minus vacancy plus other income — the realistic annual revenue." },
          { name: "Ancillary / Other Income", desc: "Non-rent income such as parking, laundry, late fees, and application fees." }
        ]
      },
      {
        name: "Operating Expenses",
        children: [
          { name: "Property Taxes", desc: "Annual taxes levied by the local government, often paid monthly into escrow." },
          { name: "Insurance", desc: "Hazard and liability coverage premiums for the property." },
          { name: "Property Management Fee", desc: "Compensation to a management company, typically 8–12% of collected rent." },
          { name: "Repairs & Maintenance", desc: "Ongoing costs for routine upkeep, typically budgeted at 5–10% of rent." },
          { name: "Utilities (Common Area)", desc: "Essential services including electricity, water, gas, and sewer." },
          { name: "Payroll / On-Site Staff", desc: "Labor costs for property managers, maintenance workers, and other on-site employees." },
          { name: "Reserves for Replacement", desc: "Funds set aside for future capital expenditures like roof, HVAC, and appliance replacement." },
          { name: "Expense Ratio (% of EGI)", desc: "Gross scheduled income minus vacancy and credit loss, plus other income." }
        ]
      },
      {
        name: "NOI & Valuation",
        children: [
          { name: "Net Operating Income (NOI)", desc: "Gross income minus all operating expenses, before mortgage payments. The key measure of property profitability." },
          { name: "Market Cap Rate", desc: "The prevailing cap rate for comparable properties in the local market." },
          { name: "Income Approach Value", desc: "Property value estimated by capitalizing the net operating income using a market cap rate." },
          { name: "Price per Unit", desc: "Total purchase price divided by the number of units — used to compare multifamily deals." },
          { name: "Price per SF", desc: "The purchase price divided by total square footage for standardized comparison." },
          { name: "GRM (Gross Rent Multiplier)", desc: "Property price divided by gross annual rent — a quick valuation benchmark." }
        ]
      },
      {
        name: "Financing",
        children: [
          { name: "LTV Ratio", desc: "The ratio of the loan amount to the property\'s appraised value." },
          { name: "Loan Amount", desc: "The principal amount lent to the borrower." },
          { name: "Interest Rate & Amortization", desc: "The gradual repayment of loan principal through scheduled payments over time." },
          { name: "Annual Debt Service", desc: "Total annual mortgage payments including principal and interest." },
          { name: "Debt Service Coverage Ratio (DSCR)", desc: "NOI divided by annual mortgage payments. Lenders typically require 1.25× or higher." },
          { name: "Cash-on-Cash Return", desc: "Annual cash flow divided by total cash invested, showing the return on out-of-pocket capital." },
          { name: "Equity Required", desc: "The owner\'s financial interest in the property, equal to value minus debt." }
        ]
      }
    ]
  }
};

// 4. Net Effective Rent;
