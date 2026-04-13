/* IntelliTC Solutions — Mind Map Data: capital-gains */
window.MINDMAP_DATA = {
    title: 'Capital Gains Tax Impact Analyzer',
    tree: {
      name: 'Capital Gains Tax Analysis',
      children: [
        {
          name: 'Gain Classification',
          children: [
            { name: 'Short-Term Gain (held ≤ 1 year → ordinary rates)' },
            { name: 'Long-Term Gain (held > 1 year → 0/15/20%)' },
            { name: 'Unrecaptured §1250 Gain (depreciation, taxed at 25%)' },
            { name: 'Net Investment Income Tax (NIIT, 3.8%)' }
          ]
        },
        {
          name: 'Cost Basis Calculation',
          children: [
            { name: 'Original Purchase Price' },
            { name: 'Capital Improvements Added to Basis' },
            { name: 'Accumulated Depreciation Subtracted from Basis' },
            { name: 'Acquisition Costs Added to Basis' },
            { name: 'Adjusted Cost Basis = Purchase + Improvements − Depreciation' }
          ]
        },
        {
          name: 'Primary Residence Exclusion (§121)',
          children: [
            { name: '$250,000 Exclusion (Single filer)' },
            { name: '$500,000 Exclusion (Married filing jointly)' },
            { name: '2-of-5-Year Ownership & Use Test' },
            { name: 'Partial Exclusion for Partial Qualification' },
            { name: 'Interaction with Rental Use Period' }
          ]
        },
        {
          name: 'Tax Bracket Impact',
          children: [
            { name: 'Taxable Income Thresholds (0% / 15% / 20%)' },
            { name: 'State Capital Gains Tax Rate' },
            { name: 'Combined Federal + State Effective Rate' },
            { name: 'Gain Stacking Effect on Ordinary Income Brackets' }
          ]
        },
        {
          name: '1031 Deferral Alternative',
          children: [
            { name: 'Deferred Tax = Gain × Combined Rate' },
            { name: 'Reinvestment Compounding Advantage' },
            { name: 'Step-Up in Basis at Death (§1014)' },
            { name: 'Installment Sale (§453) Alternative' }
          ]
        },
        {
          name: 'Net Proceeds Calculation',
          children: [
            { name: 'Gross Sale Price' },
            { name: 'Less: Selling Costs (commission, closing)' },
            { name: 'Less: Adjusted Cost Basis' },
            { name: 'Equals: Realized Gain' },
            { name: 'Less: Exclusion / Deferral' },
            { name: 'Equals: Taxable Gain' },
            { name: 'Less: Tax Liability' },
            { name: 'Equals: Net After-Tax Proceeds' }
          ]
        }
      ]
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 10. Cap Rate Calculator
  // ─────────────────────────────────────────────────────────────────────────────;
