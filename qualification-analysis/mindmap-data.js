/* IntelliTC Solutions — Mind Map Data: qualification-analysis */
window.MINDMAP_DATA = {
  title: "Qualification Analysis",
  tree: {
    name: "Borrower Qualification",
    children: [
      {
        name: "Income",
        children: [
          { name: "Gross Monthly Income", desc: "Total pre-tax monthly income from all sources." },
          { name: "Base Salary", desc: "Regular employment income before bonuses or overtime." },
          { name: "Bonus / Overtime (2-Year Avg)", desc: "Variable income averaged over two years for loan qualification." },
          { name: "Self-Employment Income (Net)", desc: "Net income from self-employment after business deductions." },
          { name: "Rental Income (75% Rule)", desc: "Rental Income — 75% Rule." },
          { name: "Total Qualifying Income", desc: "The sum of all qualifying income components." }
        ]
      },
      {
        name: "DTI Ratios",
        children: [
          { name: "Front-End DTI (Housing Ratio)", desc: "The ratio of housing costs to gross monthly income." },
          { name: "Back-End DTI (Total Debt)", desc: "The ratio of total monthly debts to gross monthly income." },
          { name: "Monthly Housing Payment (PITI)", desc: "Housing Payment (PITI) calculated on a monthly basis." },
          { name: "Monthly Debt Obligations", desc: "Debt Obligations calculated on a monthly basis." },
          { name: "Maximum Front-End DTI Limit", desc: "The ratio of housing costs to gross monthly income." },
          { name: "Maximum Back-End DTI Limit", desc: "The ratio of total monthly debts to gross monthly income." }
        ]
      },
      {
        name: "Credit Score",
        children: [
          { name: "FICO Score (Middle of 3)", desc: "A quantitative assessment used to evaluate this factor." },
          { name: "Minimum Score by Loan Program", desc: "A quantitative assessment used to evaluate this factor." },
          { name: "Rate Impact of Credit Score", desc: "The borrower\'s creditworthiness score used in loan qualification." },
          { name: "Derogatory Mark Considerations", desc: "How negative credit events (late payments, collections) affect loan eligibility." },
          { name: "Credit Score Improvement Steps", desc: "The borrower\'s creditworthiness score used in loan qualification." }
        ]
      },
      {
        name: "LTV",
        children: [
          { name: "Loan-to-Value Ratio", desc: "The ratio of the loan amount to the property\'s appraised value." },
          { name: "Down Payment Amount", desc: "Cash the buyer will contribute toward the purchase, reducing the loan amount." },
          { name: "PMI Threshold (80% LTV)", desc: "PMI Threshold — 80% LTV." },
          { name: "LTV by Loan Program", desc: "The ratio of the loan amount to the property\'s appraised value." }
        ]
      },
      {
        name: "Loan Program Eligibility",
        children: [
          { name: "Conventional Conforming", desc: "A standard mortgage that meets Fannie Mae and Freddie Mac guidelines." },
          { name: "FHA (3.5% Down)", desc: "FHA — 3.5% Down." },
          { name: "VA (0% Down)", desc: "VA — 0% Down." },
          { name: "USDA (Rural)", desc: "A feature specific to USDA Rural Development loans for eligible rural properties." },
          { name: "Jumbo / Non-QM", desc: "Loans exceeding conforming limits or that don't meet Qualified Mortgage standards." }
        ]
      },
      {
        name: "Max Purchase Price",
        children: [
          { name: "DTI-Constrained Max Loan", desc: "The maximum debt-to-income ratio allowed by the lender." },
          { name: "LTV-Constrained Max Price", desc: "The maximum loan-to-value ratio the lender will allow." },
          { name: "Max Purchase Price Formula", desc: "Max Purchase Price Formula — the boundary value in this calculation." },
          { name: "Reserve Requirements", desc: "Lender-mandated cash reserves the borrower must maintain after closing." }
        ]
      }
    ]
  }
};

// 9. Rate Buydown Calculator;
