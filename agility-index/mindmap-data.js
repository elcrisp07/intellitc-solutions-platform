/* IntelliTC Solutions — Mind Map Data: agility-index */
window.MINDMAP_DATA = {
    title: 'Market Agility Index',
    tree: {
      name: 'Investment Agility Index',
      children: [
        {
          name: 'Liquidity Score',
          children: [
            { name: 'Cash Reserves (months of expenses)', desc: 'Liquid savings measured in months of mortgage payments, required by lenders as a financial cushion.' },
            { name: 'Liquid Asset Ratio', desc: 'The proportion of total assets that can be quickly converted to cash.' },
            { name: 'Days to Liquidate Real Estate Holdings', desc: 'The estimated time to sell investment properties and convert them to available cash.' },
            { name: 'Credit Line Availability (HELOC, LOC)', desc: 'Available credit from home equity lines or other lines of credit.' }
          ]
        },
        {
          name: 'Diversification Score',
          children: [
            { name: 'Asset Class Spread (RE, stocks, bonds, cash)', desc: 'The diversification of investments across real estate, equities, fixed income, and cash.' },
            { name: 'Geographic Distribution', desc: 'A metric related to short-term rental performance and operations.' },
            { name: 'Property Type Spread (SFR, MF, commercial)', desc: 'The diversification of real estate holdings across single-family, multifamily, and commercial properties.' },
            { name: 'Tenant Concentration Risk', desc: 'A party renting and occupying the property.' },
            { name: 'Herfindahl–Hirschman Index (HHI) Proxy', desc: 'A concentration measure adapted to assess portfolio diversification — lower values indicate better diversification.' }
          ]
        },
        {
          name: 'Leverage Score',
          children: [
            { name: 'Portfolio LTV (total debt ÷ portfolio value)', desc: 'Formula: Portfolio LTV (total debt ÷ portfolio value).' },
            { name: 'Debt Service Coverage Ratio (DSCR)', desc: 'NOI divided by annual mortgage payments. Lenders typically require 1.25× or higher.' },
            { name: 'Interest Rate Exposure (fixed vs. variable)', desc: 'A comparison analyzing Interest Rate Exposure (fixed versus variable).' },
            { name: 'Balloon Payment Risk Timeline', desc: 'The schedule showing when large lump-sum payments come due on the loan.' }
          ]
        },
        {
          name: 'Market Exposure Score',
          children: [
            { name: 'Market Cycle Position (expansion/contraction)', desc: 'Where the current real estate market sits in the economic cycle, affecting investment strategy.' },
            { name: 'Vacancy Rate vs. Market Vacancy', desc: 'A comparison analyzing Vacancy Rate versus Market Vacancy.' },
            { name: 'Rent Growth vs. Inflation', desc: 'A comparison analyzing Rent Growth versus Inflation.' },
            { name: 'Cap Rate Compression Risk', desc: 'Net Operating Income divided by property value, expressing the property\'s yield.' }
          ]
        },
        {
          name: 'Operational Agility',
          children: [
            { name: 'Self-Managed vs. PM Ratio', desc: 'A comparison analyzing Self-Managed versus PM Ratio.' },
            { name: 'Average Lease Duration', desc: 'The length of the lease agreement between landlord and tenant.' },
            { name: 'Deferred Maintenance Backlog (% of value)', desc: 'Repairs and upkeep that have been postponed, potentially decreasing property value.' },
            { name: 'CapEx Reserve Adequacy', desc: 'Funds set aside annually for future major repairs and replacements.' }
          ]
        },
        {
          name: 'Composite Agility Score',
          children: [
            { name: 'Weighted Category Scores (0–100)', desc: 'A quantitative assessment used to evaluate this factor.' },
            { name: 'Agility Band (High / Moderate / Low)', desc: 'A classification of the investment\'s flexibility or risk exposure.' },
            { name: 'Benchmark vs. Peer Portfolio', desc: 'A comparison analyzing Benchmark versus Peer Portfolio.' }
          ]
        }
      ]
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. BRRRR Strategy Calculator
  // ─────────────────────────────────────────────────────────────────────────────;
