/* IntelliTC Solutions — Mind Map Data: payment-reverse-engineering */
window.MINDMAP_DATA = {
  title: "Payment Reverse Engineering",
  tree: {
    name: "Reverse Engineering Payment",
    children: [
      {
        name: "Target Payment",
        children: [
          { name: "Maximum Affordable Monthly Payment", desc: "Maximum Affordable Monthly Payment — the boundary value in this calculation." },
          { name: "PITI Budget", desc: "The total monthly housing cost: Principal, Interest, Taxes, and Insurance." },
          { name: "Principal & Interest Allocation", desc: "How each payment is divided between reducing the loan balance and paying interest." },
          { name: "Tax & Insurance Estimates", desc: "A coverage policy protecting the property or owner against specified risks." }
        ]
      },
      {
        name: "Back-Solving for Rate",
        children: [
          { name: "Known: Payment, Principal, Term", desc: "The known variables in this calculation: Payment, Principal, Term." },
          { name: "Solve for Interest Rate", desc: "The periodic cost of borrowing expressed as a percentage." },
          { name: "Effective Rate Calculation", desc: "The actual rate calculation after adjustments and real-world factors." },
          { name: "Rate Shopping Target", desc: "The interest rate goal when comparing offers from multiple lenders." }
        ]
      },
      {
        name: "Back-Solving for Price",
        children: [
          { name: "Known: Payment, Rate, Term", desc: "The known variables in this calculation: Payment, Rate, Term." },
          { name: "Maximum Loan Amount Formula", desc: "The total principal borrowed from the lender." },
          { name: "Down Payment Added Back", desc: "The initial cash contribution toward the property purchase." },
          { name: "Maximum Purchase Price", desc: "The highest property price the buyer can afford based on income, debts, and lending criteria." },
          { name: "Closing Cost Adjustment", desc: "Fees and expenses paid at the finalization of a real estate transaction." }
        ]
      },
      {
        name: "Back-Solving for Term",
        children: [
          { name: "Known: Payment, Rate, Principal", desc: "The known variables in this calculation: Payment, Rate, Principal." },
          { name: "Solve for Amortization Period", desc: "The number of years over which the loan principal is gradually repaid." },
          { name: "15 vs. 20 vs. 30-Year Impact", desc: "A comparison analyzing 15 versus 20 vs. 30-Year Impact." },
          { name: "Accelerated Payoff Analysis", desc: "An analysis showing how extra payments shorten the loan term and reduce total interest." }
        ]
      },
      {
        name: "Affordability Scenarios",
        children: [
          { name: "DTI-Constrained Max Payment", desc: "The maximum debt-to-income ratio allowed by the lender." },
          { name: "Rate Sensitivity on Max Price", desc: "An analysis testing how results change under different assumptions." },
          { name: "Down Payment Sensitivity", desc: "The initial cash contribution toward the property purchase." },
          { name: "Buydown Impact on Affordability", desc: "How paying discount points to reduce the rate affects monthly payment affordability." },
          { name: "Combined Scenario Matrix", desc: "An analysis testing how results change under different assumptions." }
        ]
      }
    ]
  }
};

// 6. Portfolio Manager;
