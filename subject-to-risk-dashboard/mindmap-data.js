/* IntelliTC Solutions — Mind Map Data: subject-to-risk-dashboard */
window.MINDMAP_DATA = {
  title: "Subject-To Risk Dashboard",
  tree: {
    name: "Subject-To Risk Analysis",
    children: [
      {
        name: "Due-on-Sale Clause",
        children: [
          { name: "Acceleration", desc: "The lender's right to demand immediate full repayment of the remaining loan balance when a due-on-sale clause is triggered. Once acceleration is invoked, the borrower typically has 30 days to pay in full or face foreclosure proceedings." },
          { name: "Alienation Clause", desc: "Another term for the due-on-sale clause — a provision in the mortgage that allows the lender to call the loan due upon transfer of ownership or any interest in the property. Nearly all conventional mortgages originated after 1982 contain this clause." },
          { name: "Performing Loan", desc: "A loan where payments are current and the borrower is in compliance with all terms. Lenders rarely scrutinize performing loans because enforcing a due-on-sale clause on a current loan generates administrative cost with little financial upside." },
          { name: "Non-Performing Loan", desc: "A loan that is in default or seriously delinquent (typically 90+ days past due). Non-performing loans receive heightened lender scrutiny, making due-on-sale enforcement more likely as the lender is already reviewing the file." },
          { name: "Loan Call", desc: "The formal act of a lender invoking the acceleration clause and demanding full repayment. A loan call is not immediate foreclosure — it starts a timeline (usually 30–90 days) during which the borrower can pay off, refinance, or negotiate." },
          { name: "Demand Letter", desc: "The written notice from the lender to the borrower stating that the due-on-sale clause has been triggered and the full balance is due. This is the first formal step in enforcement and typically provides a cure period of 30 days." },
          { name: "Foreclosure Timeline", desc: "The legal process timeline from loan default to property sale, which varies by state (judicial vs. non-judicial). Judicial states average 12–18 months; non-judicial states can complete in 3–6 months. This timeline is the investor's window to refinance or sell." }
        ]
      },
      {
        name: "Garn-St. Germain Act",
        children: [
          { name: "Federal Preemption", desc: "The Garn-St. Germain Depository Institutions Act of 1982 federally preempts state laws that enforce due-on-sale clauses in certain protected transfer scenarios. This means federal law overrides any state-level restrictions on these exempt transfers." },
          { name: "Inter Vivos Trust", desc: "A trust created during the grantor's lifetime (as opposed to a testamentary trust). Under Garn-St. Germain, transferring a property into an inter vivos trust where the borrower remains a beneficiary is explicitly protected from due-on-sale enforcement." },
          { name: "Occupancy Rights", desc: "For the Garn-St. Germain exemption to apply, the transfer must not affect the borrower's occupancy rights. The borrower (or a relative) must continue to occupy the property as their principal residence for the transfer to remain protected." },
          { name: "Beneficial Interest", desc: "The right to receive benefits from a trust (income, use of property) without holding legal title. In a land trust strategy, the seller initially holds beneficial interest, which is then privately assigned to the investor — this assignment is not recorded publicly." },
          { name: "Exempt Transfers", desc: "Specific transfer types protected by Garn-St. Germain: transfers to a spouse or children, transfers resulting from death, transfers into an inter vivos trust where borrower is beneficiary, and transfers due to divorce or separation. Lenders cannot enforce due-on-sale for these." },
          { name: "Residential Property Limit", desc: "Garn-St. Germain protections apply to residential real property containing fewer than five dwelling units, including individual condominium units. Properties with five or more units (commercial) may not receive the same protections." }
        ]
      },
      {
        name: "Land Trust Protection",
        children: [
          { name: "Revocable Trust", desc: "A trust that can be modified or dissolved by the grantor during their lifetime. For subject-to deals, a revocable land trust is used because Garn-St. Germain specifically protects transfers into revocable inter vivos trusts where the borrower is a beneficiary." },
          { name: "Settlor / Grantor", desc: "The person who creates the trust and transfers property into it. In a subject-to land trust structure, the seller acts as the settlor, creating the trust and deeding the property into it. This is the recorded, public-facing transaction." },
          { name: "Trustee", desc: "The person or entity that holds legal title to the trust property and manages it according to the trust terms. The trustee should be a neutral third party (not the buyer or seller) — often a title company or attorney — to maintain the trust's legitimacy." },
          { name: "Beneficial Interest Assignment", desc: "The private, unrecorded transfer of the right to benefit from the trust property. After the seller creates the trust and deeds the property in, they assign their beneficial interest to the investor or investor's LLC. This step is not recorded in public records." },
          { name: "Privacy of Beneficial Interest", desc: "Unlike deeds and mortgages, beneficial interest assignments in a land trust are private documents not filed with the county recorder. This privacy is central to the strategy — the lender sees a trust transfer (protected by Garn-St. Germain) but not the subsequent beneficial interest change." }
        ]
      },
      {
        name: "Risk Mitigation",
        children: [
          { name: "Insurance Continuity", desc: "Maintaining the seller's existing homeowner's insurance policy (or adding the trust as an additional insured) rather than switching to a new policy in the investor's name. Changing insurance is one of the most common triggers that alerts a lender to an ownership change." },
          { name: "Payment Performance", desc: "Keeping the mortgage payments current and on-time through an automated payment system. A performing loan gives the lender zero incentive to investigate the file. Late payments are the single biggest trigger for lender scrutiny and potential due-on-sale enforcement." },
          { name: "Title Method", desc: "The method used to transfer property ownership. Direct deed transfers to an individual or LLC are visible in public records and easily flagged. Land trust transfers appear as estate planning (protected by Garn-St. Germain) and draw less attention." },
          { name: "Lender Monitoring", desc: "The degree to which a lender actively monitors its loan portfolio for ownership changes. National banks with millions of loans have less per-loan oversight than small community banks or credit unions that may personally review transfers." },
          { name: "Rate Differential Incentive", desc: "The financial incentive a lender has to enforce the due-on-sale clause based on the spread between the existing loan rate and current market rates. If the borrower has a 3% rate and market rates are 7%, the lender has strong financial motivation to call the loan and redeploy capital at higher rates." }
        ]
      },
      {
        name: "Exit Strategies",
        children: [
          { name: "Refinance", desc: "Obtaining a new conventional mortgage to pay off the existing subject-to loan. This is the cleanest exit — it puts the loan in the investor's name, eliminates due-on-sale risk, and frees the seller's credit. Requires sufficient equity, credit score, and income qualification." },
          { name: "DSCR Loan", desc: "A Debt Service Coverage Ratio loan that qualifies based on the property's rental income rather than the borrower's personal income. DSCR loans are popular exit strategies for subject-to investors because they don't require W-2 income verification — only that rent covers 1.0–1.25× the payment." },
          { name: "Hard Money Bridge", desc: "A short-term (6–18 month) high-interest loan from a private lender used to pay off the subject-to mortgage quickly. Used when the investor needs to exit immediately (lender discovered the transfer) but hasn't yet qualified for permanent financing." },
          { name: "Deed-Back", desc: "Transferring the property back to the original seller via a deed, effectively unwinding the subject-to transaction. This is the emergency exit strategy if the lender calls the loan and no refinance option is available. It restores the original ownership structure." },
          { name: "Wraparound Mortgage", desc: "A secondary financing arrangement where the investor sells the property to an end buyer with a new note that 'wraps around' the existing mortgage. The investor collects a higher payment from the end buyer and continues making the lower subject-to payment, pocketing the spread." }
        ]
      }
    ]
  }
};
