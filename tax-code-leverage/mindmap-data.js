/* ── Tax Strategy Pathfinder — Mind Map Data ── */
window.MINDMAP_DATA = {
  title: "Tax Strategies for Real Estate Investors",
  tree: {
    name: "Leveraging the Tax Code",
    children: [
      {
        name: "Deferral Strategies",
        children: [
          {
            name: "1031 Like-Kind Exchange",
            children: [
              { name: "Defer capital gains by reinvesting in like-kind property" },
              { name: "Must identify replacement within 45 days" },
              { name: "Must close within 180 days" },
              { name: "Requires a Qualified Intermediary" },
              { name: "Boot (cash or debt relief not reinvested) is taxable" }
            ]
          },
          {
            name: "Opportunity Zone Investment",
            children: [
              { name: "Invest capital gains through a Qualified Opportunity Fund" },
              { name: "Must invest within 180 days of realizing gain" },
              { name: "10-year hold may exclude gain on new appreciation" },
              { name: "Property must be in a designated census tract" },
              { name: "Substantial improvement requirement for existing structures" }
            ]
          },
          {
            name: "721 Exchange / UPREIT",
            children: [
              { name: "Exchange property for operating partnership units in a REIT" },
              { name: "Defers gain while providing diversification" },
              { name: "OP units may convert to REIT shares over time" },
              { name: "Advanced strategy — requires securities counsel" },
              { name: "Useful for large portfolios seeking liquidity without triggering gain" }
            ]
          }
        ]
      },
      {
        name: "Depreciation Strategies",
        children: [
          {
            name: "Standard Depreciation",
            children: [
              { name: "Residential: 27.5-year straight-line schedule" },
              { name: "Commercial: 39-year straight-line schedule" },
              { name: "Only the building portion is depreciable (not land)" },
              { name: "Depreciation reduces taxable income each year" },
              { name: "Recaptured at 25% upon sale if not exchanged" }
            ]
          },
          {
            name: "Cost Segregation",
            children: [
              { name: "Engineering study reclassifies building components" },
              { name: "Personal property (cabinets, flooring): 5-7 year life" },
              { name: "Land improvements (parking, landscaping): 15-year life" },
              { name: "Front-loads deductions into early years of ownership" },
              { name: "Most effective on properties valued over $500,000" }
            ]
          },
          {
            name: "Bonus Depreciation",
            children: [
              { name: "First-year deduction on qualifying shorter-life assets" },
              { name: "Applies to 5, 7, and 15-year property identified by cost seg" },
              { name: "Phasing down: 40% (2025), 20% (2026), 0% (2027+)" },
              { name: "Pairs naturally with cost segregation studies" },
              { name: "Can generate a paper loss even on profitable properties" }
            ]
          }
        ]
      },
      {
        name: "Income and Deduction Planning",
        children: [
          {
            name: "Business Expense Write-Offs",
            children: [
              { name: "Property management and maintenance costs" },
              { name: "Insurance premiums and property taxes" },
              { name: "Travel to inspect or manage properties" },
              { name: "Home office deduction for real estate businesses" },
              { name: "Professional fees (CPA, attorney, property manager)" }
            ]
          },
          {
            name: "Short-Term Rental Strategy",
            children: [
              { name: "Average rental period under 7 days: not passive by default" },
              { name: "Material participation may unlock more aggressive deduction planning" },
              { name: "Real Estate Professional Status (REPS) can reclassify passive losses" },
              { name: "Losses from STR may offset other income depending on participation" },
              { name: "Requires careful documentation of hours and involvement" }
            ]
          },
          {
            name: "Tax Credits",
            children: [
              { name: "Energy-efficient property improvements may qualify for credits" },
              { name: "Historic rehabilitation: 20% credit on qualified expenses" },
              { name: "Low-Income Housing Tax Credit (LIHTC) for affordable housing" },
              { name: "Credits reduce tax dollar-for-dollar (more powerful than deductions)" },
              { name: "Each credit has specific eligibility and documentation requirements" }
            ]
          }
        ]
      },
      {
        name: "Estate and Entity Planning",
        children: [
          {
            name: "Stepped-Up Basis",
            children: [
              { name: "Property held until death receives a new cost basis at fair market value" },
              { name: "Eliminates embedded capital gains and depreciation recapture for heirs" },
              { name: "One of the most powerful wealth-transfer mechanisms in the tax code" },
              { name: "Can be combined with a lifetime of 1031 exchanges" },
              { name: "Applies automatically — no special filing required" }
            ]
          },
          {
            name: "Trusts and Family Entities",
            children: [
              { name: "Irrevocable trusts remove assets from taxable estate" },
              { name: "Family LLCs allow fractional gifting with valuation discounts" },
              { name: "Revocable trusts provide probate avoidance but no estate tax benefit" },
              { name: "Grantor Retained Annuity Trusts (GRATs) for high-appreciation assets" },
              { name: "All trust strategies require qualified estate planning counsel" }
            ]
          },
          {
            name: "Entity Structure",
            children: [
              { name: "LLCs provide liability protection with pass-through taxation" },
              { name: "S-Corps can reduce self-employment tax in active businesses" },
              { name: "Rental income is generally not subject to self-employment tax" },
              { name: "Multi-member LLCs useful for partnership and joint-venture properties" },
              { name: "Choice of entity affects deduction flow, liability, and estate transfer" }
            ]
          }
        ]
      }
    ]
  }
};
