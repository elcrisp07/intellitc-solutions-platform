/* IntelliTC Solutions — Mind Map Data: wrap-calculator */
window.MINDMAP_DATA = {
  title: "Wrap Mortgage Calculator",
  tree: {
    name: "Wrap Mortgage",
    children: [
      {
        name: "Underlying Loan",
        children: [
          { name: "Underlying Loan Balance", desc: "The remaining unpaid principal on the loan." },
          { name: "Underlying Interest Rate", desc: "The rate on the existing mortgage being wrapped." },
          { name: "Underlying Monthly P&I", desc: "The monthly payment on the original loan that the wrap mortgage covers." },
          { name: "Underlying Lender", desc: "The original mortgage holder whose loan is wrapped by the new financing." },
          { name: "Remaining Term on Underlying", desc: "The amount of term on underlying still outstanding or unused." }
        ]
      },
      {
        name: "Wrap Terms",
        children: [
          { name: "Wrap Loan Amount", desc: "The total loan amount presented to the buyer, which includes the underlying balance plus seller equity." },
          { name: "Wrap Interest Rate (Higher)", desc: "The periodic cost of borrowing expressed as a percentage." },
          { name: "Wrap Amortization Period", desc: "The number of years over which the loan principal is gradually repaid." },
          { name: "Buyer's Monthly Wrap Payment", desc: "The total monthly payment the buyer makes on the wrap-around mortgage." },
          { name: "Wrap Balloon Term", desc: "The date the buyer must pay off the wrap mortgage balance in full." },
          { name: "All-Inclusive Trust Deed (AITD)", desc: "A wrap-around mortgage that includes the underlying loan balance plus the seller-financed amount." }
        ]
      },
      {
        name: "Payment Spread",
        children: [
          { name: "Buyer's Wrap Payment", desc: "The total payment the buyer makes on the wrap-around financing." },
          { name: "Less: Underlying P&I", desc: "Calculation step: less: Underlying P&I." },
          { name: "Monthly Spread to Seller", desc: "Spread to Seller calculated on a monthly basis." },
          { name: "Spread = Rate Differential + Principal", desc: "Formula: Spread = Rate Differential + Principal." },
          { name: "Annual Cash Flow to Seller", desc: "Total cash flow over 12 months from the investment." }
        ]
      },
      {
        name: "Cash Flow to Seller",
        children: [
          { name: "Monthly Net Cash Flow", desc: "Net income received each month after all expenses and debt service." },
          { name: "Yield on Equity Carried", desc: "The owner\'s financial interest in the property, equal to value minus debt." },
          { name: "Total Cash Flow Over Wrap Term", desc: "The running total of all cash flows from the investment." },
          { name: "Yield Comparison to Other Investments", desc: "The income return on the investment expressed as a percentage." }
        ]
      },
      {
        name: "Risk Factors",
        children: [
          { name: "Due-on-Sale Clause Risk", desc: "The lender\'s right to demand full repayment if ownership transfers — the key risk in subject-to deals." },
          { name: "Buyer Default Risk", desc: "The risk that the buyer stops making wrap payments, jeopardizing the underlying loan." },
          { name: "Underlying Loan Acceleration Risk", desc: "The risk that the original lender calls the underlying loan due." },
          { name: "Escrow / Payment Servicing", desc: "Funds held by a neutral third party during the transaction process." },
          { name: "Title & Foreclosure Risk", desc: "A matter related to legal ownership documentation of the property." }
        ]
      },
      {
        name: "Exit Strategy",
        children: [
          { name: "Balloon Payoff by Buyer", desc: "The buyer paying off the wrap mortgage balance in full at maturity." },
          { name: "Buyer Refinance to Conventional", desc: "The buyer replacing the wrap mortgage with a traditional bank loan." },
          { name: "Sale of Wrapped Note", desc: "The seller selling the wrap-around note to a note investor at a discount." },
          { name: "Property Sale to Third Party", desc: "Selling the property to a new buyer who pays off or assumes the wrap financing." },
          { name: "Note Discount Analysis", desc: "Calculating what discount from face value a note buyer would require." }
        ]
      }
    ]
  }
};
