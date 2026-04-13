/* IntelliTC Solutions — Mind Map Data: cashflow */
window.MINDMAP_DATA = {
    title: 'Cash Flow Calculator',
    tree: {
      name: 'Rental Property Cash Flow',
      children: [
        {
          name: 'Gross Income',
          children: [
            { name: 'Gross Scheduled Rent (GSR)', desc: 'Total rent collected before deducting any expenses.' },
            { name: 'Ancillary Income (parking, laundry, storage, pet fees)', desc: 'Income generated from parking spaces or parking fees.' },
            { name: 'Gross Potential Income (GPI)', desc: 'Potential Income (GPI) before any deductions or expenses.' }
          ]
        },
        {
          name: 'Vacancy & Credit Loss',
          children: [
            { name: 'Physical Vacancy Rate (%)', desc: 'The percentage of time units are expected to be unoccupied, reducing effective income.' },
            { name: 'Economic Vacancy (loss to lease, concessions)', desc: 'Income lost due to unoccupied units or non-paying tenants.' },
            { name: 'Bad Debt / Credit Loss', desc: 'Income lost from tenants who fail to pay rent.' },
            { name: 'Effective Gross Income (EGI) = GPI − Vacancy', desc: 'Formula: Effective Gross Income (EGI) = GPI − Vacancy.' }
          ]
        },
        {
          name: 'Operating Expenses',
          children: [
            { name: 'Property Taxes', desc: 'Annual taxes levied by the local government, often paid monthly into escrow.' },
            { name: 'Insurance (hazard + liability)', desc: 'Coverage for fire, storms, theft, and other property damage.' },
            { name: 'Property Management Fee (% of EGI)', desc: 'The fee paid to a property manager, typically 8–12% of collected rent.' },
            { name: 'Maintenance & Repairs (% of value)', desc: 'Routine upkeep required to preserve the property\'s condition and value.' },
            { name: 'Capital Expenditure Reserve (CapEx)', desc: 'Funds set aside annually for future major repairs and replacements.' },
            { name: 'Utilities (landlord-paid)', desc: 'Essential services including electricity, water, gas, and sewer.' },
            { name: 'Landscaping / Snow Removal', desc: 'Seasonal property maintenance costs for grounds upkeep.' },
            { name: 'Accounting & Legal', desc: 'Professional fees for bookkeeping, tax preparation, and legal services related to the property.' }
          ]
        },
        {
          name: 'Net Operating Income (NOI)',
          children: [
            { name: 'NOI = EGI − Operating Expenses', desc: 'Formula: NOI = EGI − Operating Expenses.' },
            { name: 'Operating Expense Ratio (OER = Expenses ÷ EGI)', desc: 'Formula: Operating Expense Ratio (OER = Expenses ÷ EGI).' },
            { name: 'NOI Margin', desc: 'Net Operating Income — gross income minus all operating expenses before debt service.' }
          ]
        },
        {
          name: 'Debt Service',
          children: [
            { name: 'Monthly Principal & Interest (P&I)', desc: 'Principal & Interest (P&I) calculated on a monthly basis.' },
            { name: 'Annual Debt Service', desc: 'Total annual mortgage payments including principal and interest.' },
            { name: 'Interest-Only Period (if applicable)', desc: 'A loan phase where payments cover only interest, with no principal reduction.' }
          ]
        },
        {
          name: 'Net Cash Flow',
          children: [
            { name: 'Before-Tax Cash Flow = NOI − Debt Service', desc: 'Formula: Before-Tax Cash Flow = NOI − Debt Service.' },
            { name: 'Tax Benefit (depreciation shelter)', desc: 'The annual tax deduction for the wear and aging of the property\'s improvements.' },
            { name: 'After-Tax Cash Flow', desc: 'A tax consideration affecting the investment\'s net return.' },
            { name: 'Cumulative Cash Flow (holding period)', desc: 'The running total of all cash flows from the investment.' }
          ]
        }
      ]
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 14. Comparative Market Analysis (CMA)
  // ─────────────────────────────────────────────────────────────────────────────;
