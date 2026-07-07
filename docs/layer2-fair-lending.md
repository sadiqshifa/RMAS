# Layer 2 — Control Matrix (Fair Lending: Regulation B / ECOA + HMDA / Regulation C)

Maps each regulatory obligation from [Layer 1](layer1-fair-lending.md) to the
control(s) firms actually use to satisfy it today, who/what executes the
control, and how it's currently done (manual, tool-assisted, or automatable).

As with AML/KYC, the right-most column is the design target for Layer 3 —
the honest answer to "what would an agent actually replace or assist here,
and what shouldn't it touch." This domain has an added wrinkle AML/KYC
didn't: **two regulatory changes (April 2026 and May 2026) landed mid-build**,
so several rows below distinguish "control as it existed before the rule
change" from "control as it exists after July 21, 2026." That distinction is
itself a small governance case study — a control matrix has an effective
date too, not just the regulation it maps to.

> Status: v0, 2026-07-07. Built directly from layer1-fair-lending.md v0.

---

## A. Regulation B (ECOA) Controls

| Regulation | Control | Typical execution today | Automation potential |
|---|---|---|---|
| Reg B — Adverse action notice timing | Track application completion date, calculate applicable deadline (30 days standard; 90 days after unanswered counteroffer), issue notice before deadline | Tool-assisted — LOS (loan origination systems) generally calculate deadlines automatically; **manual override/exception cases are where misses happen** | High — deadline calculation is fully deterministic; a validator agent can independently check LOS output rather than trusting it blindly |
| Reg B — Adverse action notice content | Notice must state action taken, creditor name/address, ECOA notice provision, and the applicable federal regulator | Template-based — compliance teams maintain notice templates; content is close to boilerplate but must stay current with reg changes | High — checking a drafted notice against required-elements checklist is a strong deterministic-validation fit |
| Reg B — Disparate-treatment vs. disparate-impact standard (post-April 2026) | Fair lending monitoring program must test against the correct legal theory | **Currently manual/in-transition** — compliance teams are actively updating monitoring criteria and staff training as of this rule's effective date (July 21, 2026) | Low-medium automation directly, but **high value as a flagging/awareness tool** — an agent that checks whether a given policy or notice still references the old "effects test" standard is a concrete, useful narrow task |
| Reg B — SPCP eligibility criteria (post-April 2026) | For-profit creditors' Special Purpose Credit Programs may no longer use race, color, national origin, or sex as a common eligibility characteristic | Manual — legal/compliance review of SPCP program design | Low — this is a legal-judgment redesign task, not a good agent candidate; flag for human review, don't attempt to automate the redesign itself |
| Reg B Subpart B / Section 1071 (post-May 2026) | Collect and report small business lending data — now narrower scope: excludes merchant cash advances, small-dollar transactions, agricultural loans; excludes pricing/denial-reason data and LGBTQIA+/disaggregated race-ethnicity fields | Tool-assisted — data collection systems need reconfiguration to match narrowed scope | Medium — a "does this data collection template still match the current rule" checker is a reasonable scoped agent task, lower priority than the two chosen below |
| Reg B — AI/vendor accountability (CFPB Circulars 2022-03, 2023-03) | Confirm AI vendors used in credit decisioning can produce fully compliant adverse action notices | Manual — vendor due diligence, contractual review | N/A as a control to automate — this is actually the **regulatory justification for RMAS's own Layer 4 governance work**, not something Layer 3 automates away |

---

## B. HMDA / Regulation C Controls

| Regulation | Control | Typical execution today | Automation potential |
|---|---|---|---|
| HMDA coverage determination | Apply the five tests (asset-size, location, loan activity, federally related, loan-volume) to determine if the institution must report | Manual/spreadsheet-based at smaller institutions; larger institutions have this baked into compliance software | **High — this is the clearest agent use case in this domain.** Fully deterministic, rule-based, mirrors your SCRA Calculations agent almost exactly |
| HMDA asset-size threshold tracking | Threshold is inflation-adjusted annually (CPI-W, effective Jan 1 each year) — $59M for 2026, up from $58M in 2025 | Manual — compliance staff check the annual Federal Register notice | High for the *check*, but requires a **live/current threshold value** — this is where a stale calculator becomes actively wrong. Direct link to reg-change-monitor: the calculator's threshold input should be flagged for review each year |
| LAR data collection | Compile required data points for each covered loan application throughout the year | Tool-assisted — LOS/HMDA-specific software | Already largely automated; low incremental agent value |
| LAR submission | Submit to CFPB by March 1 annually | Automated submission via CFPB's HMDA Platform | Already automated; low incremental value |
| Fair lending disparity testing (uses HMDA data to test Reg B compliance) | Pull HMDA data, run comparative analysis across protected classes, flag statistical outliers, determine if disparities reflect documented underwriting criteria | Manual analyst review or compliance-vendor statistical software; **explaining *why* a flagged case is/isn't defensible is still a human judgment task** | Medium — good candidate for a future triage-style agent (parallel to the OFAC false-positive triage idea in AML/KYC), but the eval problem is genuinely harder: open-ended judgment rather than classification. Deferred for now. |

---

## C. Why the calculator + validator are the right starting pair

Two things stood out choosing between the three candidates identified earlier:

1. **HMDA Reportability Calculator is the fair lending equivalent of the SCRA
   Calculations agent** — deterministic, no eval-suite ambiguity (a coverage
   determination is either right or wrong given the inputs), and fast to
   build well. It also gives the portfolio a second live demonstration that
   a *reg-change-monitor feeds a calculator* — the 2025→2026 threshold bump
   ($58M → $59M) is a small, concrete, real example of exactly the kind of
   change the reg-change-monitor agent is built to catch, and exactly the
   kind of change that makes a hardcoded calculator go quietly stale.

2. **Adverse Action Notice Validator is the strongest available link to
   Layer 4's central question** — "how do you know the agent still works
   after something upstream changes?" — except here the thing that changed
   isn't the model, it's the *regulation itself* (April 22, 2026 rule,
   effective July 21, 2026). A notice-content checker built before the rule
   change would validate against a standard that no longer exists unless
   it's explicitly updated. That's a clean, dated, verifiable story for a
   recruiter: not "the AI got smarter," but "the ground truth moved, and
   here's how the system would need to catch that."

Together these two are lower eval-risk than the disparity triage agent
(deterministic vs. open-ended judgment), and both have a direct, dated
regulatory-change hook — which is the throughline of this whole domain per
Layer 1's framing ("Reg B is in active doctrinal flux; HMDA's main change
risk is a predictable annual adjustment").

The disparity triage agent stays identified but deferred — it's the right
next candidate once there's bandwidth for a harder, rubric-graded eval
suite, not before.

---

## Next steps for this document

- [x] Map Reg B and HMDA obligations to controls and automation potential
- [x] Identify and justify the two starting agents (calculator + validator)
- [ ] Cross-reference each control row back to its Layer 1 citation
- [ ] Build HMDA Reportability Calculator (Layer 3)
- [ ] Build Adverse Action Notice Validator (Layer 3)
- [ ] Revisit disparity triage agent once eval-suite approach for open-ended judgment tasks is more established
