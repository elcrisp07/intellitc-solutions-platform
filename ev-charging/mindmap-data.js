/* IntelliTC Solutions — Mind Map Data: ev-charging */
window.MINDMAP_DATA = {
  title: "EV Charging ROI Calculator",
  tree: {
    name: "EV Charging Investment",
    children: [
      {
        name: "Charger Types & Costs",
        children: [
          { name: "Level 2 (240V, 7-19 kW)", desc: "The most common EV charger for residential and commercial use. Charges an EV in 4-10 hours depending on vehicle and charger speed. Hardware costs range from $900 to $2,500 per port." },
          { name: "DC Fast Charger (50-350 kW)", desc: "High-power commercial charging that can add 100+ miles of range in 20-30 minutes. Hardware costs range from $50,000 to $250,000+ per unit, suitable for highway corridors and fleet depots." },
          { name: "Hardware Cost per Port", desc: "The purchase price of the EV charging equipment itself, before installation. Smart networked chargers cost more but enable payment processing and usage tracking." },
          { name: "Installation Cost per Port", desc: "Electrical work, permits, trenching, panel upgrades, and labor required to install each charging port. Typically ranges from $800 to $2,500 for L2 and $15,000 to $50,000+ for DCFC." },
          { name: "Electrical Panel Capacity", desc: "Your property's existing electrical service must support the additional load. A Level 2 charger draws 30-80 amps; DCFC may require dedicated utility service and transformers." },
          { name: "Smart vs. Non-Networked", desc: "Networked (smart) chargers connect to cloud platforms for remote management, payment processing, and usage data. Non-networked chargers are simpler and cheaper but lack revenue-collection capability." }
        ]
      },
      {
        name: "Revenue Models",
        children: [
          { name: "Per-kWh Pricing", desc: "Charging customers based on electricity consumed. Commercial L2 rates typically range from $0.25-$0.40/kWh; DCFC rates from $0.35-$0.55/kWh. The spread between your electricity cost and charging price is your gross margin." },
          { name: "Nightly Surcharge (RV / Airbnb)", desc: "A flat per-night fee added to the accommodation rate for guests who use EV charging. RV parks typically charge $10-$25/night; Airbnb hosts add $10-$35/night as a premium amenity." },
          { name: "Fuel Cost Savings (Home)", desc: "For home charging, the primary return is avoiding gas station costs. At $0.17/kWh electricity and 3.5 mi/kWh efficiency, EV fuel costs roughly $0.05/mile vs. $0.13/mile for a 28 MPG gas car at $3.50/gal." },
          { name: "Property Value Premium", desc: "Properties with EV charging infrastructure typically command a 3-5% value premium, similar to other green amenities. This is an indirect but significant component of total ROI." },
          { name: "Booking Visibility Boost (Airbnb)", desc: "Listing EV charging as an amenity increases search visibility on platforms like Airbnb, Vrbo, and booking sites. ChargePoint data suggests EV-equipped rentals attract more bookings from the growing EV traveler segment." },
          { name: "Demand Response Credits", desc: "Some utilities offer credits or payments for participating in demand response programs where your charger reduces power during peak grid events. This can add $50-$200+ per year per port." }
        ]
      },
      {
        name: "Tax Credits & Incentives",
        children: [
          { name: "Federal 30C Tax Credit", desc: "The Alternative Fuel Vehicle Refueling Property Credit (IRC Section 30C) provides a 30% tax credit on EV charger costs — up to $1,000 for residential and $100,000 for commercial installations. Scheduled to expire June 30, 2026." },
          { name: "State Rebate Programs", desc: "Many states offer additional rebates for EV charger installation. California, New York, Colorado, and others provide $500-$5,000+ per port depending on charger type and location." },
          { name: "Utility Company Incentives", desc: "Local utilities may offer rebates, reduced commercial rates for EV charging, or free charger installation programs to encourage load growth and manage grid demand." },
          { name: "MACRS Depreciation (Commercial)", desc: "Commercial EV charging equipment may qualify for accelerated depreciation under the Modified Accelerated Cost Recovery System, allowing businesses to deduct the cost over 5-7 years." },
          { name: "NEVI Formula Program", desc: "The National Electric Vehicle Infrastructure program provides federal funding for EV charging along highway corridors. Operators and site hosts may benefit from reduced installation costs in eligible locations." },
          { name: "Low-Income Community Bonus", desc: "Additional tax credit bonuses may apply for EV charger installations in low-income or rural communities, increasing the base 30C credit by up to 10-20 percentage points in qualifying census tracts." }
        ]
      },
      {
        name: "Operating Economics",
        children: [
          { name: "Electricity Cost ($/kWh)", desc: "Your cost per kilowatt-hour for electricity — the primary ongoing expense. US average is roughly $0.17/kWh residential and $0.12/kWh commercial. Rates vary significantly by state and utility." },
          { name: "Demand Charges", desc: "Commercial utility rates often include demand charges based on peak power draw ($/kW). DCFC units can trigger high demand charges ($10-$20+/kW/month) that significantly impact profitability." },
          { name: "Software / Network Fees", desc: "Cloud-connected chargers typically charge $15-$30/month per port for network services including payment processing, usage reporting, remote diagnostics, and firmware updates." },
          { name: "Annual Maintenance (~1%)", desc: "Regular maintenance costs approximately 1% of hardware value per year. This covers connector wear, software updates, cleaning, and minor repairs. DCFC units require more maintenance than L2." },
          { name: "Electricity Rate Escalation", desc: "Electricity prices have historically risen 2-4% annually. This impacts both your costs (as a charger operator) and your savings (for home charging, as gas prices also tend to rise)." },
          { name: "Utilization Rate", desc: "The percentage of time your chargers are actually in use. Higher utilization means more revenue but also more wear. Commercial stations average 10-20% utilization; prime locations can reach 30-40%." }
        ]
      },
      {
        name: "Property & Location Factors",
        children: [
          { name: "Home Garage / Driveway", desc: "Residential installations in attached garages are simplest and cheapest. Detached garages or outdoor installations may require trenching and weatherproof equipment, adding $500-$2,000 to installation." },
          { name: "Commercial / Workplace", desc: "Workplace charging attracts and retains employees while generating potential revenue. Parking garage installations may require additional electrical infrastructure but benefit from high daily utilization." },
          { name: "RV Park / Campground", desc: "RV parks are prime EV charging locations due to existing electrical infrastructure (50A hookups), long guest stays, and the growing overlap between RV travelers and EV owners." },
          { name: "Airbnb / Short-Term Rental", desc: "EV charging differentiates rental listings in a competitive market. ChargePoint partnerships offer up to 36% off hardware for hospitality hosts. The amenity attracts a growing demographic of EV drivers." },
          { name: "Highway Corridor (DCFC)", desc: "High-traffic highway locations are ideal for DC Fast Chargers due to demand from road-trip EV drivers. These locations require significant investment but command premium per-kWh pricing." },
          { name: "Multi-Unit Dwelling", desc: "Apartment and condo buildings face unique challenges: shared electrical panels, parking allocation, and cost-sharing among residents. Dedicated metering and managed charging solutions address these issues." }
        ]
      },
      {
        name: "Market Trends & Growth",
        children: [
          { name: "EV Sales Growth (9%+ of new cars)", desc: "EV sales now represent over 9% of new car sales in the US and are growing rapidly. By 2030, projections suggest 30-50% of new car sales will be electric, dramatically increasing charging demand." },
          { name: "Charging Infrastructure Gap", desc: "The US currently has approximately 186,000 public charging ports but needs an estimated 1.2 million by 2030 to meet demand. This gap represents a significant investment opportunity." },
          { name: "Vehicle-to-Grid (V2G)", desc: "Emerging technology allowing EVs to feed stored energy back to the grid during peak demand. V2G-capable chargers may generate additional revenue from grid services in the near future." },
          { name: "Fleet Electrification", desc: "Corporate and government fleets are rapidly transitioning to electric vehicles, creating sustained demand for workplace and depot charging infrastructure." },
          { name: "Autonomous Vehicle Charging", desc: "As autonomous vehicles emerge, automated charging solutions will become critical infrastructure. Early charging network operators will be well-positioned for this transition." },
          { name: "Solar + Storage + EV Synergy", desc: "Pairing EV charging with on-site solar panels and battery storage reduces electricity costs, provides grid independence, and maximizes environmental and financial returns." }
        ]
      }
    ]
  }
};
