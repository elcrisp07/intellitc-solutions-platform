/* IntelliTC Solutions — Mind Map Data: capital-gains */
window.MINDMAP_DATA = {
    title: 'Capital Gains Tax Impact Analyzer',
    tree: {
      name: 'Capital Gains Tax Analysis',
      children: [
        {
          name: 'Gain Classification',
          children: [
            { name: 'Short-Term Gain (held ≤ 1 year → ordinary rates)', desc: 'The average nightly rate charged for the short-term rental.' },
            { name: 'Long-Term Gain (held > 1 year → 0/15/20%)', desc: 'Capital gains on property held over one year, taxed at 0%, 15%, or 20% depending on income.' },
            { name: 'Unrecaptured §1250 Gain (depreciation, taxed at 25%)', desc: 'Taxes owed on previously claimed depreciation when the property is sold, taxed at 25%.' },
            { name: 'Net Investment Income Tax (NIIT, 3.8%)', desc: 'Federal and/or state tax owed on rental income or investment gains.' }
          ]
        },
        {
          name: 'Cost Basis Calculation',
          children: [
            { name: 'Original Purchase Price', desc: 'The price paid when the property was originally acquired.' },
            { name: 'Capital Improvements Added to Basis', desc: 'Major property improvements that extend the useful life and are capitalized rather than expensed.' },
            { name: 'Accumulated Depreciation Subtracted from Basis', desc: 'The total depreciation claimed to date, which reduces the property\'s tax basis.' },
            { name: 'Acquisition Costs Added to Basis', desc: 'Purchase-related expenses that increase the property\'s tax basis, reducing future taxable gains.' },
            { name: 'Adjusted Cost Basis = Purchase + Improvements − Depreciation', desc: 'Formula: Adjusted Cost Basis = Purchase + Improvements − Depreciation.' }
          ]
        },
        {
          name: 'Primary Residence Exclusion (§121)',
          children: [
            { name: '$250,000 Exclusion (Single filer)', desc: '$250,000 Exclusion (Single filer) — a specific dollar threshold used in this calculation.' },
            { name: '$500,000 Exclusion (Married filing jointly)', desc: '$500,000 Exclusion (Married filing jointly) — a specific dollar threshold used in this calculation.' },
            { name: '2-of-5-Year Ownership & Use Test', desc: 'IRS requirement to have owned and lived in the home for at least 2 of the last 5 years for the exclusion.' },
            { name: 'Partial Exclusion for Partial Qualification', desc: 'A prorated capital gains exclusion when the full ownership/use test is not met.' },
            { name: 'Interaction with Rental Use Period', desc: 'The periodic payment made by a tenant for use of the property.' }
          ]
        },
        {
          name: 'Tax Bracket Impact',
          children: [
            { name: 'Taxable Income Thresholds (0% / 15% / 20%)', desc: 'Taxable Income Thresholds — 0% / 15% / 20%.' },
            { name: 'State Capital Gains Tax Rate', desc: 'Tax owed on the profit from selling an investment property.' },
            { name: 'Combined Federal + State Effective Rate', desc: 'The total tax rate when both federal and state capital gains taxes are applied.' },
            { name: 'Gain Stacking Effect on Ordinary Income Brackets', desc: 'How capital gains added to ordinary income can push the taxpayer into a higher tax bracket.' }
          ]
        },
        {
          name: '1031 Deferral Alternative',
          children: [
            { name: 'Deferred Tax = Gain × Combined Rate', desc: 'Formula: Deferred Tax = Gain × Combined Rate.' },
            { name: 'Reinvestment Compounding Advantage', desc: 'The benefit of deferring taxes through reinvestment, allowing more capital to compound over time.' },
            { name: 'Step-Up in Basis at Death (§1014)', desc: 'When inherited, the property\'s tax basis resets to its current market value, eliminating unrealized gains.' },
            { name: 'Installment Sale (§453) Alternative', desc: 'Spreading the sale over multiple years to defer capital gains recognition under IRS §453.' }
          ]
        },
        {
          name: 'Net Proceeds Calculation',
          children: [
            { name: 'Gross Sale Price', desc: 'Sale Price before any deductions or expenses.' },
            { name: 'Less: Selling Costs (commission, closing)', desc: 'Calculation step: less: Selling Costs (commission, closing).' },
            { name: 'Less: Adjusted Cost Basis', desc: 'Calculation step: less: Adjusted Cost Basis.' },
            { name: 'Equals: Realized Gain', desc: 'Calculation step: equals: Realized Gain.' },
            { name: 'Less: Exclusion / Deferral', desc: 'Calculation step: less: Exclusion / Deferral.' },
            { name: 'Equals: Taxable Gain', desc: 'Calculation step: equals: Taxable Gain.' },
            { name: 'Less: Tax Liability', desc: 'Calculation step: less: Tax Liability.' },
            { name: 'Equals: Net After-Tax Proceeds', desc: 'Calculation step: equals: Net After-Tax Proceeds.' }
          ]
        }
      ]
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 10. Cap Rate Calculator
  // ─────────────────────────────────────────────────────────────────────────────;
