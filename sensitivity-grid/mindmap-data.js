/* IntelliTC Solutions — Mind Map Data: sensitivity-grid */
window.MINDMAP_DATA = {
  title: 'Investment Sensitivity Grid',
  tree: {
    name: "Sensitivity Analysis",
    children: [
      {
        name: "Variable Inputs",
        children: [
          { name: "Purchase Price Range", desc: "The range of acceptable purchase prices based on the analysis." },
          { name: "Interest Rate Range", desc: "The periodic cost of borrowing expressed as a percentage." },
          { name: "Cap Rate Range", desc: "Net Operating Income divided by property value, expressing the property\'s yield." },
          { name: "Rent / Revenue Range", desc: "The periodic payment made by a tenant for use of the property." },
          { name: "Vacancy Rate Range", desc: "The percentage of time units are expected to be unoccupied, reducing effective income." },
          { name: "Exit Cap Rate Range", desc: "The projected capitalization rate at the time of future sale, used to estimate exit value." }
        ]
      },
      {
        name: "Scenario Matrix",
        children: [
          { name: "Two-Variable Grid (X vs. Y Axis)", desc: "A comparison analyzing Two-Variable Grid (X versus Y Axis)." },
          { name: "Output Metric (CoC, IRR, NOI)", desc: "The annualized return rate that makes the net present value of all cash flows equal to zero." },
          { name: "Cell Values Across Scenario Grid", desc: "An analysis testing how results change under different assumptions." },
          { name: "Heatmap Color Coding", desc: "A visual indicator using color to quickly communicate performance levels." },
          { name: "Target Return Threshold Line", desc: "The desired return threshold line set as a goal for this investment." }
        ]
      },
      {
        name: "Best Case Scenario",
        children: [
          { name: "Optimistic Rent Growth", desc: "The annual percentage increase in rental rates." },
          { name: "Aggressive Appreciation", desc: "A higher-than-average appreciation assumption used for best-case projections." },
          { name: "Low Vacancy / High Occupancy", desc: "The portion of potential income lost when units are unoccupied." },
          { name: "Favorable Exit Cap Rate", desc: "The projected capitalization rate at the time of future sale, used to estimate exit value." }
        ]
      },
      {
        name: "Worst Case Scenario",
        children: [
          { name: "Rent Decline / Flat Growth", desc: "The annual percentage increase in rental rates." },
          { name: "Rising Cap Rate (Value Compression)", desc: "Net Operating Income divided by property value, expressing the property\'s yield." },
          { name: "High Vacancy / Tenant Default", desc: "The portion of potential income lost when units are unoccupied." },
          { name: "Rising Interest Rate at Refi", desc: "The periodic cost of borrowing expressed as a percentage." }
        ]
      },
      {
        name: "Risk Assessment",
        children: [
          { name: "Standard Deviation of Returns", desc: "A measure of how much returns may vary from the expected value." },
          { name: "Probability-Weighted Expected Return", desc: "The average return weighted by the likelihood of each scenario." },
          { name: "Downside Protection Analysis", desc: "An evaluation of how much the investment can lose in adverse conditions." },
          { name: "Margin of Safety at Purchase", desc: "The discount to intrinsic value built into the purchase price as a buffer." }
        ]
      },
      {
        name: "Decision Support",
        children: [
          { name: "Go / No-Go Return Thresholds", desc: "The criteria determining whether the investment meets minimum requirements to proceed." },
          { name: "Acceptable Risk Band", desc: "A classification of the investment\'s flexibility or risk exposure." },
          { name: "Sensitivity Ranking by Variable", desc: "An analysis testing how results change under different assumptions." },
          { name: "Data-Driven Offer Price", desc: "A purchase offer calculated from comparable data and financial analysis." }
        ]
      }
    ]
  }
};

// 21. Short-Term Rental;
