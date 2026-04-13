/* IntelliTC Solutions — Mind Map Data: short-term-rental */
window.MINDMAP_DATA = {
  title: 'Short-Term Rental Calculator',
  tree: {
    name: "STR / Airbnb Analysis",
    children: [
      {
        name: "Revenue",
        children: [
          { name: "Average Daily Rate (ADR)", desc: "The average nightly rental price charged for the property." },
          { name: "Seasonal ADR Variation", desc: "How the Average Daily Rate changes by season due to demand fluctuations." },
          { name: "Annual Occupancy Rate (%)", desc: "The yearly interest rate charged on the loan." },
          { name: "Revenue Per Available Night (RevPAN)", desc: "Average revenue per available night, factoring in both rate and occupancy." },
          { name: "Gross Annual Revenue", desc: "Annual Revenue before any deductions or expenses." }
        ]
      },
      {
        name: "Platform Fees & Cleaning",
        children: [
          { name: "Airbnb / VRBO Host Fee (3%)", desc: "Airbnb / VRBO Host Fee — 3%." },
          { name: "Channel Manager Fees", desc: "Fees for software that manages listings across multiple booking platforms." },
          { name: "Cleaning Fee per Stay", desc: "The fee charged to guests for cleaning between stays." },
          { name: "Cleaning Cost per Stay", desc: "The actual cost to clean the property between guest stays." },
          { name: "Net Revenue After Platform Fees", desc: "Revenue After Platform Fees remaining after all deductions and subtractions." }
        ]
      },
      {
        name: "Operating Expenses",
        children: [
          { name: "Property Management (20-30%)", desc: "Property Management — 20-30%." },
          { name: "Utilities (Electric, Water, Internet)", desc: "Essential services including electricity, water, gas, and sewer." },
          { name: "Supplies / Amenities Restocking", desc: "Costs for replenishing toiletries, linens, and other guest supplies." },
          { name: "Property Taxes", desc: "Annual taxes levied by the local government, often paid monthly into escrow." },
          { name: "Insurance (STR Policy)", desc: "A coverage policy protecting the property or owner against specified risks." },
          { name: "HOA Dues (If Applicable)", desc: "Monthly fees paid to the homeowners association for shared services and maintenance." },
          { name: "Maintenance & Repairs", desc: "Ongoing costs to keep the facility in good condition." }
        ]
      },
      {
        name: "Financing & Cash Flow",
        children: [
          { name: "Purchase Price", desc: "The agreed-upon price to acquire the property before additional costs." },
          { name: "Mortgage Payment (DSCR Loan)", desc: "NOI divided by annual debt service — measures the property\'s ability to cover loan payments." },
          { name: "Annual Debt Service", desc: "Total annual mortgage payments including principal and interest." },
          { name: "Net Cash Flow (After All Expenses)", desc: "The remaining income after all expenses and obligations are paid." },
          { name: "Cash-on-Cash Return", desc: "Annual cash flow divided by total cash invested, showing the return on out-of-pocket capital." }
        ]
      },
      {
        name: "Regulations & Risk",
        children: [
          { name: "Local STR Permit Requirements", desc: "Local regulations governing short-term rental operations." },
          { name: "HOA STR Restrictions", desc: "A feature or cost related to the homeowners association." },
          { name: "Zoning Compliance", desc: "Local government regulations governing permitted property use and development." },
          { name: "Regulatory Risk Discount", desc: "A value reduction reflecting the risk that local regulations may restrict short-term rentals." },
          { name: "Platform Dependency Risk", desc: "The risk of relying heavily on a single booking platform for revenue." }
        ]
      }
    ]
  }
};

// 22. Solar ROI Calculator;
