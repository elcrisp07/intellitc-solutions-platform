/* IntelliTC Solutions — Mind Map Data: reactive-power */
window.MINDMAP_DATA = {
    title: 'Reactive Power Estimator',
    tree: {
      name: 'Reactive Power & Power Factor',
      children: [
        {
          name: 'Types of Power',
          children: [
            { name: 'Real Power (kW)', desc: 'The portion of electricity that performs actual work — generating heat, light, or mechanical motion. Measured in kilowatts. This is what residential meters bill you for.' },
            { name: 'Reactive Power (kVAR)', desc: 'Energy that oscillates between the power source and inductive loads 60 times per second without performing useful work. Builds and collapses magnetic fields in motors and transformers.' },
            { name: 'Apparent Power (kVA)', desc: 'The total power drawn from the grid — the vector sum of real and reactive power. This is what the wires and transformers must carry, regardless of how much does useful work.' },
            { name: 'kWh Billing (Residential)', desc: 'Residential meters in North America measure kilowatt-hours (kWh) — a unit of real power over time. Your bill is based on real power consumption, not apparent power.' },
            { name: 'kVA Billing (Commercial)', desc: 'Unlike residential customers, commercial and industrial facilities are often billed on kVA (apparent power) and face penalties for low power factor. This is where correction provides real savings.' }
          ]
        },
        {
          name: 'Power Factor',
          children: [
            { name: 'Definition: PF = kW / kVA', desc: 'The ratio of real power to apparent power. Ranges from 0 to 1.0. A PF of 1.0 means all drawn power is doing useful work. A typical home with motors operates at 0.7-0.85.' },
            { name: 'Unity Power Factor (1.0)', desc: 'A perfect power factor where voltage and current are perfectly aligned. Achieved by purely resistive loads like heaters and incandescent bulbs. No reactive power is present.' },
            { name: 'Lagging Power Factor (< 1.0)', desc: 'When current lags behind voltage due to inductive loads (motors). The most common scenario in homes. The lower the PF, the more reactive power is circulating.' },
            { name: 'Phase Angle = arccos(PF)', desc: 'The angular difference between voltage and current sine waves. At PF = 1.0, the angle is 0 degrees. At PF = 0.7, the angle is about 45 degrees — a significant misalignment.' },
            { name: 'Steinmetz Framework (1893)', desc: 'Charles Proteus Steinmetz at General Electric formalized the math of reactive power in AC systems. His framework using complex numbers remains the foundation of electrical engineering.' }
          ]
        },
        {
          name: 'Inductive Loads',
          children: [
            { name: 'Central A/C (PF ~0.65)', desc: 'The compressor motor in a central air conditioner is the single largest inductive load in most homes. At 3,500+ watts and a power factor of 0.65, it generates substantial reactive power.' },
            { name: 'Refrigerator (PF ~0.70)', desc: 'The compressor motor cycles on and off throughout the day. While its wattage is modest (~150W), its constant operation makes it a steady source of reactive power.' },
            { name: 'Washing Machine (PF ~0.68)', desc: 'The drive motor creates substantial reactive power during agitation and spin cycles. Modern front-loaders with variable-speed drives may have slightly better power factors.' },
            { name: 'Microwave (PF ~0.60)', desc: 'Uses a high-voltage transformer (magnetron) that has one of the lowest power factors of any household appliance. Short duty cycle limits total reactive contribution.' },
            { name: 'Pool Pump (PF ~0.62)', desc: 'Pool pumps run for hours daily and have low power factors. For homes with pools, this is often the second-largest source of reactive power after the A/C.' },
            { name: 'Furnace Blower (PF ~0.67)', desc: 'Even gas furnaces use an electric blower motor to circulate air. This inductive load runs for extended periods during heating season.' }
          ]
        },
        {
          name: 'Power Factor Correction',
          children: [
            { name: 'How Capacitors Work', desc: 'Capacitors produce a leading current that offsets the lagging current from motors. When placed near inductive loads, they store reactive power locally and recycle it back to the motor.' },
            { name: 'Capacitor Sizing (15-60 uF)', desc: 'The required capacitance depends on the reactive power to offset: C = Q / (2 * pi * f * V^2). For residential 240V/60Hz, typical values range from 15 to 60 microfarads.' },
            { name: 'Placement Matters', desc: 'Correction is most effective when the capacitor is electrically close to the inductive load. A capacitor at the breaker panel only reduces losses in the short wire between panel and meter.' },
            { name: 'Industrial Savings', desc: 'Factories, hospitals, and commercial buildings have used capacitor banks since 1920. With kVA-based billing and power factor penalties, correction saves thousands per month.' },
            { name: 'Residential Reality (NIST)', desc: 'NIST Technical Note 1654 confirmed residential meters measure real power (kWh). While correction reduces current, it does not change kWh registered — the bill stays the same.' },
            { name: 'Scam vs. Engineering', desc: 'A device without a microfarad rating is likely a marketing gimmick. Legitimate capacitors list 15-60 uF. ENERGY STAR does not certify any power factor correction devices for residential use.' }
          ]
        }
      ]
    }
  };
