/* ── Tax Strategy Pathfinder — Mind Map Data ── */
window.MINDMAP_DATA = {
  title: "Tax Strategies for Real Estate Investors",
  center: "Leveraging the Tax Code",
  branches: [
    {
      label: "Deferral Strategies",
      color: "#01696f",
      children: [
        {
          label: "1031 Like-Kind Exchange",
          children: [
            { label: "Defer capital gains by reinvesting in like-kind property" },
            { label: "Must identify replacement within 45 days" },
            { label: "Must close within 180 days" },
            { label: "Requires a Qualified Intermediary" },
            { label: "Boot (cash or debt relief not reinvested) is taxable" }
          ]
        },
        {
          label: "Opportunity Zone Investment",
          children: [
            { label: "Invest capital gains through a Qualified Opportunity Fund" },
            { label: "Must invest within 180 days of realizing gain" },
            { label: "10-year hold may exclude gain on new appreciation" },
            { label: "Property must be in a designated census tract" },
            { label: "Substantial improvement requirement for existing structures" }
          ]
        },
        {
          label: "721 Exchange / UPREIT",
          children: [
            { label: "Exchange property for operating partnership units in a REIT" },
            { label: "Defers gain while providing diversification" },
            { label: "OP units may convert to REIT shares over time" },
            { label: "Advanced strategy — requires securities counsel" },
            { label: "Useful for large portfolios seeking liquidity without triggering gain" }
          ]
        }
      ]
    },
    {
      label: "Depreciation Strategies",
      color: "#D19900",
      children: [
        {
          label: "Standard Depreciation",
          children: [
            { label: "Residential: 27.5-year straight-line schedule" },
            { label: "Commercial: 39-year straight-line schedule" },
            { label: "Only the building portion is depreciable (not land)" },
            { label: "Depreciation reduces taxable income each year" },
            { label: "Recaptured at 25% upon sale if not exchanged" }
          ]
        },
        {
          label: "Cost Segregation",
          children: [
            { label: "Engineering study reclassifies building components" },
            { label: "Personal property (cabinets, flooring): 5-7 year life" },
            { label: "Land improvements (parking, landscaping): 15-year life" },
            { label: "Front-loads deductions into early years of ownership" },
            { label: "Most effective on properties valued over $500,000" }
          ]
        },
        {
          label: "Bonus Depreciation",
          children: [
            { label: "First-year deduction on qualifying shorter-life assets" },
            { label: "Applies to 5, 7, and 15-year property identified by cost seg" },
            { label: "Phasing down: 40% (2025), 20% (2026), 0% (2027+)" },
            { label: "Pairs naturally with cost segregation studies" },
            { label: "Can generate a paper loss even on profitable properties" }
          ]
        }
      ]
    },
    {
      label: "Income & Deduction Planning",
      color: "#5c6bc0",
      children: [
        {
          label: "Business Expense Write-Offs",
          children: [
            { label: "Property management and maintenance costs" },
            { label: "Insurance premiums and property taxes" },
            { label: "Travel to inspect or manage properties" },
            { label: "Home office deduction for real estate businesses" },
            { label: "Professional fees (CPA, attorney, property manager)" }
          ]
        },
        {
          label: "Short-Term Rental Strategy",
          children: [
            { label: "Average rental period under 7 days: not passive by default" },
            { label: "Material participation may unlock more aggressive deduction planning" },
            { label: "Real Estate Professional Status (REPS) can reclassify passive losses" },
            { label: "Losses from STR may offset other income depending on participation" },
            { label: "Requires careful documentation of hours and involvement" }
          ]
        },
        {
          label: "Tax Credits",
          children: [
            { label: "Energy-efficient property improvements may qualify for credits" },
            { label: "Historic rehabilitation: 20% credit on qualified expenses" },
            { label: "Low-Income Housing Tax Credit (LIHTC) for affordable housing" },
            { label: "Credits reduce tax dollar-for-dollar (more powerful than deductions)" },
            { label: "Each credit has specific eligibility and documentation requirements" }
          ]
        }
      ]
    },
    {
      label: "Estate & Entity Planning",
      color: "#c62828",
      children: [
        {
          label: "Stepped-Up Basis",
          children: [
            { label: "Property held until death receives a new cost basis at fair market value" },
            { label: "Eliminates embedded capital gains and depreciation recapture for heirs" },
            { label: "One of the most powerful wealth-transfer mechanisms in the tax code" },
            { label: "Can be combined with a lifetime of 1031 exchanges" },
            { label: "Applies automatically — no special filing required" }
          ]
        },
        {
          label: "Trusts & Family Entities",
          children: [
            { label: "Irrevocable trusts remove assets from taxable estate" },
            { label: "Family LLCs allow fractional gifting with valuation discounts" },
            { label: "Revocable trusts provide probate avoidance but no estate tax benefit" },
            { label: "Grantor Retained Annuity Trusts (GRATs) for high-appreciation assets" },
            { label: "All trust strategies require qualified estate planning counsel" }
          ]
        },
        {
          label: "Entity Structure",
          children: [
            { label: "LLCs provide liability protection with pass-through taxation" },
            { label: "S-Corps can reduce self-employment tax in active businesses" },
            { label: "Rental income is generally not subject to self-employment tax" },
            { label: "Multi-member LLCs useful for partnership and joint-venture properties" },
            { label: "Choice of entity affects deduction flow, liability, and estate transfer" }
          ]
        }
      ]
    }
  ]
};
