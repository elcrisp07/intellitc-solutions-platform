/* IntelliTC Solutions — Mind Map Data: heloc-optimizer */
window.MINDMAP_DATA = {
    title: 'HELOC Optimizer',
    tree: {
      name: 'HELOC Optimization Strategy',
      children: [
        {
          name: 'Available Equity',
          children: [
            { name: 'Current Home Market Value', desc: 'The current going rate for comparable rental units in the area.' },
            { name: 'Outstanding Mortgage Balance(s)', desc: 'The remaining unpaid principal on the mortgage.' },
            { name: 'Combined LTV = All Liens ÷ Value', desc: 'Formula: Combined LTV = All Liens ÷ Value.' },
            { name: 'Max CLTV (85–90% typical)', desc: 'Max CLTV (85–90% typical) — the boundary value in this calculation.' },
            { name: 'Maximum HELOC Line = Value × 85% − Mortgage', desc: 'Formula: Maximum HELOC Line = Value × 85% − Mortgage.' }
          ]
        },
        {
          name: 'Draw Period',
          children: [
            { name: 'Draw Period Duration (5–10 years typical)', desc: 'The initial period during which the borrower can access funds from the HELOC.' },
            { name: 'Interest-Only Payments During Draw', desc: 'During the draw period, only interest payments are required.' },
            { name: 'Variable Rate (Prime + Margin)', desc: 'The HELOC rate is typically tied to the prime rate plus a lender margin.' },
            { name: 'Line Availability for Multiple Draws', desc: 'Funds can be borrowed, repaid, and re-borrowed during the draw period.' },
            { name: 'Minimum Draw Amount', desc: 'Minimum Draw Amount — the boundary value in this calculation.' }
          ]
        },
        {
          name: 'Repayment Period',
          children: [
            { name: 'Repayment Period (10–20 years)', desc: 'The period after the draw phase when the balance must be fully repaid.' },
            { name: 'Amortizing P&I Payment', desc: 'Monthly payments during repayment include both principal and interest.' },
            { name: 'Payment Shock Risk at Repayment Onset', desc: 'The significant increase in monthly payments when the draw period ends.' },
            { name: 'Rate Cap & Floor on Variable Rate', desc: 'Limits on how high or low the HELOC interest rate can adjust.' }
          ]
        },
        {
          name: 'Rate & Cost Analysis',
          children: [
            { name: 'Current Prime Rate', desc: 'The periodic payment made by a tenant for use of the property.' },
            { name: 'Lender Margin (0.5%–2%)', desc: 'Lender Margin — 0.5%–2%.' },
            { name: 'Effective APR', desc: 'The actual apr after adjustments and real-world factors.' },
            { name: 'Annual Fee', desc: 'Fee calculated on a annual basis.' },
            { name: 'Early Closure Fee', desc: 'A penalty charged if the HELOC is closed within a specified period after opening.' }
          ]
        },
        {
          name: 'Strategic Uses',
          children: [
            { name: 'Down Payment on Investment Property', desc: 'The initial cash contribution toward the property purchase.' },
            { name: 'Bridge Financing (Buy Before You Sell)', desc: 'Using a HELOC to fund a new purchase while waiting for the current home to sell.' },
            { name: 'Rehab Financing (BRRRR draw source)', desc: 'Staged payments released to contractors as work milestones are completed.' },
            { name: 'Debt Consolidation (high-rate consumer debt)', desc: 'Using HELOC funds at a lower rate to pay off higher-interest credit cards or loans.' },
            { name: 'Opportunity Reserve (dry powder)', desc: 'Keeping a HELOC available as ready capital for unexpected investment opportunities.' }
          ]
        },
        {
          name: 'HELOC vs. Cash-Out Refi',
          children: [
            { name: 'No Rate Impact on Existing First Mortgage (HELOC)', desc: 'The interest rate on the mortgage loan.' },
            { name: 'Cash-Out Refi Resets Entire Mortgage Rate', desc: 'The interest rate on the mortgage loan.' },
            { name: 'Cost of Funds Comparison', desc: 'Comparing the HELOC rate to alternative borrowing costs to determine the cheapest option.' },
            { name: 'Break-Even Analysis', desc: 'The timeline by which the current home must sell to avoid financial loss.' }
          ]
        }
      ]
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 23. Home Equity Calculator
  // ─────────────────────────────────────────────────────────────────────────────;
