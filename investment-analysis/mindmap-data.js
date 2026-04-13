/* IntelliTC Solutions — Mind Map Data: investment-analysis */
window.MINDMAP_DATA = {
    title: 'Investment Analysis Calculator',
    tree: {
      name: 'Real Estate Investment Analysis',
      children: [
        {
          name: 'Purchase & Acquisition',
          children: [
            { name: 'Purchase Price', desc: 'The agreed-upon price to acquire the property before additional costs.' },
            { name: 'Closing Costs (buyer)', desc: 'Fees paid at closing including title insurance, attorney fees, recording, and lender charges.' },
            { name: 'Immediate Renovation / CapEx', desc: 'Capital expenditures needed right away such as roof, HVAC, or structural repairs.' },
            { name: 'Total Acquisition Cost (all-in basis)', desc: 'Purchase price plus all closing costs and immediate capital expenditures.' }
          ]
        },
        {
          name: 'Income Projections',
          children: [
            { name: 'Year-1 Gross Scheduled Income', desc: 'The total potential income if every unit were rented at market rate with zero vacancy.' },
            { name: 'Annual Rent Growth Rate Assumption', desc: 'The annual percentage increase in rental rates.' },
            { name: 'Vacancy & Credit Loss Rate', desc: 'The percentage of time units are expected to be unoccupied, reducing effective income.' },
            { name: 'Other Income Sources', desc: 'Additional income such as parking, laundry, vending, and late fees.' },
            { name: 'Effective Gross Income (EGI) by Year', desc: 'Gross scheduled income minus vacancy and credit loss, plus other income.' }
          ]
        },
        {
          name: 'Operating Expenses',
          children: [
            { name: 'Property Taxes (with annual increase)', desc: 'The annual tax levied by the local government based on the property\'s assessed value.' },
            { name: 'Insurance', desc: 'Hazard and liability coverage premiums for the property.' },
            { name: 'Management Fee', desc: 'The fee paid to a property manager, typically 8–12% of collected rent.' },
            { name: 'Maintenance & Repairs', desc: 'Ongoing costs to keep the facility in good condition.' },
            { name: 'CapEx Reserve', desc: 'Monthly set-aside for major future expenses like roof replacement or HVAC overhaul.' },
            { name: 'Total Operating Expense Ratio', desc: 'Total operating expenses divided by gross income, measuring operational efficiency.' }
          ]
        },
        {
          name: 'Financing',
          children: [
            { name: 'Loan Amount', desc: 'The principal amount lent to the borrower.' },
            { name: 'Interest Rate & Loan Term', desc: 'The periodic cost of borrowing expressed as a percentage.' },
            { name: 'Monthly Debt Service', desc: 'The total monthly payment covering principal and interest on the loan.' },
            { name: 'Amortization Schedule (interest vs. principal)', desc: 'A comparison analyzing Amortization Schedule (interest versus principal).' },
            { name: 'Balloon / Maturity Date', desc: 'The date when the remaining loan balance comes due in full.' }
          ]
        },
        {
          name: 'Return Metrics',
          children: [
            { name: 'Cap Rate (Year 1)', desc: 'Net Operating Income divided by the property value, expressing the unleveraged return in the first year.' },
            { name: 'Cash-on-Cash Return (Year 1)', desc: 'Annual pre-tax cash flow divided by total cash invested, measuring the return on out-of-pocket capital.' },
            { name: 'Net Present Value (NPV)', desc: 'The sum of all future cash flows discounted to today\'s dollars, indicating whether the investment creates value.' },
            { name: 'Internal Rate of Return (IRR)', desc: 'The discount rate that makes the NPV of all cash flows equal to zero, representing the annualized return.' },
            { name: 'Equity Multiple (EM = Total Distributions ÷ Equity In)', desc: 'Total cash returned to the investor divided by total cash invested, showing how many times the original investment is returned.' }
          ]
        },
        {
          name: 'Holding Period & Exit',
          children: [
            { name: 'Projected Hold Duration (years)', desc: 'A forecast of hold duration (years) based on current data and assumptions.' },
            { name: 'Exit / Terminal Cap Rate Assumption', desc: 'The projected capitalization rate at the time of future sale, used to estimate exit value.' },
            { name: 'Projected Sale Price = Exit-Year NOI ÷ Exit Cap Rate', desc: 'Formula: Projected Sale Price = Exit-Year NOI ÷ Exit Cap Rate.' },
            { name: 'Selling Costs (commission, closing)', desc: 'The fee paid to real estate agents, typically a percentage of the sale price.' },
            { name: 'Net Sale Proceeds', desc: 'Sale price minus all selling expenses.' },
            { name: 'Total Return (Cash Flow + Equity + Appreciation)', desc: 'The owner\'s financial interest in the property, equal to value minus debt.' }
          ]
        }
      ]
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 27. IUL Portfolio Analysis
  // ─────────────────────────────────────────────────────────────────────────────;
