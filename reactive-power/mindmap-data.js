/* Mind Map — Reactive Power Estimator */
window.MINDMAP_DATA = {
  "title": "Reactive Power & Power Factor",
  "nodes": [
    {
      "id": "power-types",
      "label": "Types of Power",
      "children": [
        {
          "id": "real-power",
          "label": "Real Power (kW)",
          "definition": "The portion of electricity that performs actual work — generating heat, light, or mechanical motion. Measured in kilowatts (kW). This is what residential meters bill you for.",
          "children": [
            {"id": "rp-resistive", "label": "Resistive Loads", "definition": "Devices like incandescent bulbs, toasters, and electric heaters that convert electricity directly to heat. These have a power factor near 1.0 — almost no reactive waste."},
            {"id": "rp-billing", "label": "kWh Billing", "definition": "Residential meters in North America measure kilowatt-hours (kWh) — a unit of real power over time. Your bill is based on real power consumption, not apparent power."}
          ]
        },
        {
          "id": "reactive-power",
          "label": "Reactive Power (kVAR)",
          "definition": "Energy that oscillates between the power source and inductive loads 60 times per second without performing useful work. It builds and collapses magnetic fields in motors and transformers. Measured in kVAR.",
          "children": [
            {"id": "rp-inductive", "label": "Inductive Reactance", "definition": "The opposition to current flow caused by inductors (motor coils). When current flows through a coil, it creates a magnetic field that resists changes — causing current to lag behind voltage."},
            {"id": "rp-capacitive", "label": "Capacitive Reactance", "definition": "The opposition to current flow caused by capacitors. Capacitors store energy in electric fields and cause current to lead voltage — the mathematical opposite of inductive reactance."}
          ]
        },
        {
          "id": "apparent-power",
          "label": "Apparent Power (kVA)",
          "definition": "The total power drawn from the grid — the vector sum of real and reactive power. Measured in kilovolt-amperes (kVA). This is what the wires and transformers must carry, regardless of how much does useful work.",
          "children": [
            {"id": "ap-formula", "label": "S = P / PF", "definition": "Apparent Power equals Real Power divided by Power Factor. If your home uses 1.5 kW with a power factor of 0.75, the grid must deliver 2.0 kVA — 33% more than the useful work."},
            {"id": "ap-commercial", "label": "Commercial Billing", "definition": "Unlike residential customers, commercial and industrial facilities are often billed on kVA (apparent power) and face penalties for low power factor. This is where correction devices provide real savings."}
          ]
        }
      ]
    },
    {
      "id": "power-factor",
      "label": "Power Factor",
      "children": [
        {
          "id": "pf-definition",
          "label": "What Is Power Factor?",
          "definition": "The ratio of real power to apparent power: PF = kW / kVA. Ranges from 0 to 1.0. A PF of 1.0 means all power drawn is doing useful work. A typical home with motors operates at 0.7-0.85.",
          "children": [
            {"id": "pf-unity", "label": "Unity (PF = 1.0)", "definition": "A perfect power factor where voltage and current are perfectly aligned. Achieved by purely resistive loads like heaters and incandescent bulbs. No reactive power is present."},
            {"id": "pf-lagging", "label": "Lagging (PF < 1.0)", "definition": "When current lags behind voltage due to inductive loads (motors). The most common scenario in homes. The lower the PF, the more 'wasted' reactive power is circulating."}
          ]
        },
        {
          "id": "pf-phase",
          "label": "Phase Angle",
          "definition": "The angular difference between voltage and current sine waves. Phase angle = arccos(PF). At PF = 1.0, the angle is 0 degrees. At PF = 0.7, the angle is about 45 degrees — a significant misalignment.",
          "children": [
            {"id": "pf-lag-visual", "label": "The Swing Analogy", "definition": "Pushing a child on a swing: if you push at the peak (in phase), maximum energy transfers. If you push at the wrong moment (out of phase), you expend effort without increasing the swing height. Motors are 'pushing at the wrong moment.'"},
            {"id": "pf-steinmetz", "label": "Steinmetz (1893)", "definition": "Charles Proteus Steinmetz at General Electric formalized the math of reactive power in AC systems. His framework — using complex numbers to represent phase relationships — remains the foundation of electrical engineering."}
          ]
        }
      ]
    },
    {
      "id": "correction",
      "label": "Power Factor Correction",
      "children": [
        {
          "id": "pfc-how",
          "label": "How Capacitors Work",
          "definition": "Capacitors produce a 'leading' current that offsets the 'lagging' current from motors. When placed near inductive loads, they act as local energy recyclers — storing reactive power and feeding it back to the motor instead of letting it travel back through the meter.",
          "children": [
            {"id": "pfc-sizing", "label": "Capacitor Sizing", "definition": "The required capacitance (in microfarads) depends on the reactive power to offset: C = Q / (2 * pi * f * V^2). For residential 240V/60Hz, typical values range from 15 to 60 microfarads."},
            {"id": "pfc-placement", "label": "Placement Matters", "definition": "Correction is most effective when the capacitor is electrically close to the inductive load. A capacitor at the breaker panel only reduces losses in the short wire between panel and meter — not in the branch circuits."}
          ]
        },
        {
          "id": "pfc-who-benefits",
          "label": "Who Benefits?",
          "definition": "Power factor correction provides measurable bill savings for commercial and industrial customers who face kVA-based billing or power factor penalties. For residential customers billed by kWh, the bill impact is negligible according to NIST.",
          "children": [
            {"id": "pfc-industrial", "label": "Industrial Savings", "definition": "Factories, hospitals, and commercial buildings have used capacitor banks since 1920. With kVA-based billing and power factor penalty clauses, correction can save thousands of dollars per month."},
            {"id": "pfc-residential", "label": "Residential Reality", "definition": "NIST Technical Note 1654 confirmed that residential meters measure real power (kWh). While correction reduces current, it does not change the kWh registered — so the bill stays the same. The benefit is reduced heat in wiring."}
          ]
        }
      ]
    },
    {
      "id": "appliances",
      "label": "Inductive Loads",
      "children": [
        {
          "id": "app-hvac",
          "label": "HVAC Systems",
          "definition": "Air conditioners and heat pumps contain large compressor motors with power factors as low as 0.60-0.70. These are typically the largest source of reactive power in a home.",
          "children": [
            {"id": "app-ac", "label": "Central A/C (PF ~0.65)", "definition": "The compressor motor in a central air conditioner is the single largest inductive load in most homes. At 3,500+ watts and a power factor of 0.65, it generates substantial reactive power when running."},
            {"id": "app-furnace", "label": "Furnace Blower (PF ~0.67)", "definition": "Even gas furnaces use an electric blower motor to circulate air. This inductive load runs for extended periods during heating season."}
          ]
        },
        {
          "id": "app-kitchen",
          "label": "Kitchen Appliances",
          "definition": "Refrigerators run 24/7 with power factors around 0.70. Microwaves use high-voltage transformers with power factors as low as 0.60. Dishwashers have pump motors at PF 0.72.",
          "children": [
            {"id": "app-fridge", "label": "Refrigerator (PF ~0.70)", "definition": "The compressor motor in your refrigerator cycles on and off throughout the day. While its wattage is modest (~150W), its constant operation makes it a steady source of reactive power."},
            {"id": "app-micro", "label": "Microwave (PF ~0.60)", "definition": "Microwaves use a high-voltage transformer (magnetron) that has one of the lowest power factors of any household appliance. However, their short duty cycle limits total reactive contribution."}
          ]
        },
        {
          "id": "app-laundry",
          "label": "Laundry & Utility",
          "definition": "Washing machines (PF ~0.68), electric dryers (PF ~0.74), and pool pumps (PF ~0.62) all contain heavy-duty motors that generate significant reactive power during operation.",
          "children": [
            {"id": "app-washer", "label": "Washing Machine (PF ~0.68)", "definition": "The drive motor in a washing machine creates substantial reactive power during agitation and spin cycles. Modern front-loaders with variable-speed drives may have slightly better power factors."},
            {"id": "app-pool", "label": "Pool Pump (PF ~0.62)", "definition": "Pool pumps run for hours daily and have low power factors. For homes with pools, this is often the second-largest source of reactive power after the A/C."}
          ]
        }
      ]
    }
  ]
};
