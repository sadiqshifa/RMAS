# Fair Lending — Regulation B (ECOA) + HMDA (Regulation C)

Covered together because they're examined together: Reg B governs the
prohibition on credit discrimination, and HMDA data is the primary tool
regulators and examiners use to test whether Reg B is actually being
followed in practice (e.g., redlining/disparate-treatment analysis runs on
HMDA-reported data). A bank's fair lending risk assessment treats these as
one connected discipline, not two.

> Status: v0, verified via web search 2026-06-20. Both regs have had
> significant, recent rule changes — flagged explicitly below since this
> domain is currently in active flux.

---

## A. Regulation B / ECOA — what it requires

ECOA (15 U.S.C. §1691 et seq.), implemented by Regulation B (12 CFR Part 1002), prohibits discrimination in credit transactions and requires adverse action notices in appropriate circumstances. It applies to all creditors. Rulemaking authority sits with the CFPB (transferred from the Federal Reserve Board by Dodd-Frank), and the CFPB has direct supervisory/enforcement authority over institutions with more than $10 billion in assets.

**Core operational requirement — adverse action notices:**
A creditor must notify an applicant of the action taken within 30 days after receiving a completed application (approval, counteroffer, or adverse action), within 30 days after taking adverse action on an incomplete application, within 30 days after taking adverse action on an existing account, or within 90 days after a counteroffer if the applicant doesn't respond. Adverse action notices must be in writing and must state the action taken, the creditor's name and address, the ECOA notice provision, and the relevant federal regulator.

### ⚠️ Major verified change — April 2026 final rule (effective July 21, 2026)

This is a live, currently-pending change as of today's date:

On April 22, 2026, the CFPB issued a final rule that removed the "effects test" from Regulation B and affirmatively stated that ECOA does not recognize disparate-impact liability. It also modified the discouragement prohibition to focus on statements of intent to discriminate rather than statements merely creating negative impressions, and prohibited for-profit creditors from using race, color, national origin, or sex as a common eligibility characteristic under Special Purpose Credit Programs (SPCPs). The rule is effective July 21, 2026.

This is a significant doctrinal shift — it changes the legal theory under
which a fair lending violation can be established (disparate treatment
remains actionable; disparate impact, as a standalone theory, does not under
this rule). A compliance program built before April 2026 would be testing
against the old standard.

### Second verified change — May 2026 (Section 1071 / small business lending data, Reg B Subpart B)

On May 1, 2026, the CFPB issued a final rule revising Regulation B Subpart B (which implements Section 1071 of Dodd-Frank), narrowing coverage to core lenders, products, and data points. The rule excluded merchant cash advances, small-dollar transactions, and agricultural loans from coverage, minimized data collection, eliminated pricing and denial-reason data, and removed LGBTQIA+-owned business status and disaggregated race/ethnicity categories from collection.

### AI-specific regulatory hook (directly relevant to Layer 4 governance)

CFPB guidance reminds financial institutions that ECOA compliance obligations apply regardless of whether AI is used in the credit decision, and institutions must confirm with AI vendors that their systems can produce fully compliant adverse action notices. The CFPB has issued Circulars 2022-03 and 2023-03 specifically addressing AI/complex-algorithm use in credit decisions. This is a direct, citable regulatory basis for why RMAS's governance layer (model versioning, eval gates) isn't theoretical — a bank using AI in adverse-action-notice generation has an existing regulatory obligation to prove the system still works correctly after changes.

---

## B. HMDA / Regulation C — what it requires

Regulation C implements HMDA (12 U.S.C. 2801 et seq.) and is intended to provide the public with loan data used to determine whether financial institutions are serving the housing needs of their communities, among other purposes (fair lending enforcement, market analysis). A bank or credit union is subject to Regulation C if it meets five tests: Asset-Size Threshold, Location, Loan Activity, Federally Related, and Loan-Volume Threshold.

**Coverage thresholds are inflation-adjusted annually** — this is itself a
recurring, predictable regulatory-change event worth automating tracking
for:

For 2026, the asset-size exemption threshold for depository institutions is $59 million (up from $58 million in 2025), based on a 2.5% increase in the CPI-W over the 12 months ending November 2025. Institutions with assets of $59 million or less as of December 31, 2025 are exempt from collecting HMDA data in 2026 — though this exemption doesn't relieve the institution of its obligation to report data it was already required to collect in 2025.

**Operational deadline:** the HMDA Loan Application Register (LAR) must be submitted to the CFPB by March 1 each year.

**Stability note:** unlike Reg B, the core HMDA rule has remained relatively unchanged since the last major revision in 2018 — the main recurring change is the annual threshold adjustment, not substantive rule changes. This is a useful contrast for the RMAS narrative: Reg B is in active doctrinal flux right now; HMDA's main "change risk" is a predictable annual index adjustment. Different domains have different drift profiles, which has implications for how aggressively each needs to be monitored.

---

## C. Why these are linked in practice

HMDA data is the dataset regulators and banks themselves use to test Reg B
compliance (e.g., comparing denial rates and pricing across demographic
groups for statistically significant disparities). A bank's fair lending
risk assessment process typically:
1. Pulls HMDA-reportable loan data
2. Runs comparative analysis across protected classes
3. Flags statistical outliers for manual underwriter-file review
4. Determines whether disparities reflect legitimate, documented
   underwriting criteria or unexplained disparate treatment

This is a clear, bounded, data-heavy workflow — a strong candidate for
agent-assisted analysis later in this project (see Layer 2).

---

## D. Bank-tier notes

- **Community bank:** may fall under HMDA's asset/volume exemption
  thresholds entirely (especially smaller community banks under the $59M
  threshold, though most community banks exceed this). Fair lending risk
  assessments are often simpler due to smaller, more local loan portfolios.
- **Midsize bank:** typically fully HMDA-reportable, files annually, fair
  lending analysis usually done via a compliance vendor tool or in-house
  analyst with statistical software — this is the segment where the July
  2026 Reg B change creates real near-term work (updating SPCP programs,
  retraining compliance staff on the new disparate-treatment-only standard).
- **Large bank:** dedicated fair lending team, often runs its own internal
  HMDA-based disparity testing continuously rather than just annually,
  highest CFPB direct-supervision exposure (the >$10B threshold noted above
  in Reg B's enforcement structure).

---

## Next steps for this document

- [ ] Track the "updated version of Regulation B" the CFPB indicated would
      be published following the April 2026 final rule — confirm once issued
- [ ] Add a worked example: what a Reg B-compliant adverse action notice
      actually contains (useful for the future agent's eval suite)
- [ ] Cross-reference SPCP changes to actual community bank/CDFI lending
      program impact, if relevant
- [x] Cross-domain regulatory change monitoring for this domain is now
      covered by [`reg-change-monitor.html`](../reg-change-monitor.html) — a
      dedicated Layer 2 control matrix for Fair Lending (mirroring the
      AML/KYC one) is still outstanding
