/* IntelliTC Solutions — Mind Map Data: cma */
window.MINDMAP_DATA = {
    title: 'Comp Analysis / CMA Calculator',
    tree: {
      name: 'Comparative Market Analysis (CMA)',
      children: [
        {
          name: 'Comparable Selection',
          children: [
            { name: 'Proximity (same neighborhood / submarket)', desc: 'Comparable properties should be located in the same neighborhood or submarket as the subject.' },
            { name: 'Recency (sold within 3–6 months)', desc: 'Comparable sales should have closed within the last 3 to 6 months for market relevance.' },
            { name: 'Size Similarity (GLA ±20%)', desc: 'Gross Living Area — the total above-grade finished living space.' },
            { name: 'Property Type Match (SFR, condo, etc.)', desc: 'Comparable properties must be the same type as the subject (single-family, condo, etc.).' },
            { name: 'Minimum 3 Comparable Sales', desc: 'Recently sold similar properties used to estimate the subject property\'s value.' }
          ]
        },
        {
          name: 'Adjustment Grid',
          children: [
            { name: 'Square Footage Adjustment ($/sqft)', desc: 'The price or cost expressed per square foot for standardized comparison.' },
            { name: 'Bedroom / Bathroom Count Adjustment', desc: 'A value adjustment for differences in bedroom and bathroom count between comps and the subject.' },
            { name: 'Garage / Parking Adjustment', desc: 'Parking facilities and their contribution to property value or income.' },
            { name: 'Lot Size Adjustment', desc: 'The total area of the land parcel.' },
            { name: 'Age & Condition Adjustment', desc: 'A value adjustment for differences in property age and physical condition.' },
            { name: 'Pool / Outbuilding Adjustment', desc: 'A value adjustment for the presence or absence of pools, garages, or outbuildings.' },
            { name: 'Location / View Adjustment', desc: 'A value adjustment for differences in location quality, views, or lot characteristics.' }
          ]
        },
        {
          name: 'Price Per Square Foot',
          children: [
            { name: 'Comparable Sale Price ÷ GLA', desc: 'Formula: Comparable Sale Price ÷ GLA.' },
            { name: 'Adjusted $/sqft Range', desc: 'The price or cost expressed per square foot for standardized comparison.' },
            { name: 'Subject Property Implied Value', desc: 'The estimated value of the subject property derived from adjusted comparable sales.' },
            { name: 'Above-Grade vs. Below-Grade GLA Distinction', desc: 'A comparison analyzing Above-Grade versus Below-Grade GLA Distinction.' }
          ]
        },
        {
          name: 'Market Conditions',
          children: [
            { name: 'Days on Market (DOM) Trend', desc: 'The average time properties take to sell, indicating market speed.' },
            { name: 'List Price to Sale Price Ratio', desc: 'The percentage of asking price that sellers actually receive, indicating negotiating leverage.' },
            { name: 'Months of Supply', desc: 'The number of months it would take to sell all active listings at the current sales pace.' },
            { name: 'Appreciation Rate (time adjustment)', desc: 'The annual percentage increase in property value.' },
            { name: 'Buyer vs. Seller Market Classification', desc: 'A comparison analyzing Buyer versus Seller Market Classification.' }
          ]
        },
        {
          name: 'Final Value Opinion',
          children: [
            { name: 'Reconciled Value Range', desc: 'The final value range determined by weighing all comparable sales and adjustments.' },
            { name: 'Point Value Estimate', desc: 'A single best estimate of value within the reconciled range.' },
            { name: 'Recommended List Price', desc: 'The suggested asking price based on the comparable analysis.' },
            { name: 'Confidence Level (# comps, recency)', desc: 'The degree of certainty in the estimate based on available data quality and quantity.' }
          ]
        }
      ]
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 15. Real Estate Commission Calculator
  // ─────────────────────────────────────────────────────────────────────────────;
