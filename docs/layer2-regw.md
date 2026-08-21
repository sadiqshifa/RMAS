# Layer 2 — Control Matrix: Transactions with Affiliates (Regulation W)

Maps each regulatory obligation from [Layer 1](layer1-regw.md) to the
control(s) a bank actually uses to satisfy it today, who executes the
control, and what a rules-based workflow tool would replace or assist —
following the same domain-specific caution the Anti-Bribery/COI matrix
established: several of these rows should explicitly **not** be AI. A
percentage-of-capital limit or a collateral haircut is a routing decision,
not a language problem, and building it as deterministic software is
cheaper and more defensible under audit than asking a model to evaluate it.

**A note on where this control matrix comes from:** the process below —
identification through funding and ongoing monitoring — reflects how this
actually runs inside a commercial bank's line-of-business compliance
function, not just the regulatory text. A line of business (LOB) typically
owns steps 1–9 for its own transactions; a top-of-house Reg W program owns
consolidated limit tracking, periodic testing, and board-level reporting
across every LOB and affiliate at once. That two-tier structure is why the
tool's Layer 3 build includes both an LOB-level intake/ledger view and a
top-of-house aggregate view, not just a single flat calculator.

---

## A. The end-to-end process, and where each step sits today

| # | Process step | Typical execution today | Automation potential |
|---|---|---|---|
| 1 | Affiliate identification | A business line checks a counterparty against a centrally maintained affiliate list; the list itself is maintained by legal/compliance and updated as ownership changes | **High — deterministic.** Matching a counterparty name/ID against a maintained registry, and flagging common-control relationships (≥80% ownership) is a lookup problem, not a language problem |
| 2 | Transaction classification (is this a "covered transaction," and does the attribution rule pull in an ostensibly third-party deal?) | Compliance/legal reviews the proposed transaction against the five §223.1–223.3 categories | **High for the clear cases (deterministic rule match against transaction type). Judgment-gated for the attribution rule** — whether proceeds genuinely benefit an affiliate through an intermediary is a fact-pattern question a rules engine can flag as *ambiguous* but should not resolve on its own. Named here as the domain's Track A candidate for a later phase, not built in this version |
| 3 | Quantitative-limit capacity check (§§ 223.11–223.12) | A Reg W tracking ledger (often a spreadsheet or a treasury/legal system module) sums outstanding covered transactions against the 10%/20% caps, measured against current capital stock and surplus | **High — deterministic.** Pure running-total arithmetic against a percentage-of-capital threshold — the same shape of problem as Reg O's board-approval trigger and bank-wide ceiling, which the sibling tool in this repo already treats as a non-AI build |
| 4 | Collateral analysis for credit extensions (§ 223.14) | Collateral is identified, valued, and checked against the applicable haircut (100/110/120/130%); legal confirms it isn't affiliate-issued or otherwise ineligible | **High — deterministic.** A fixed lookup table by collateral type plus a coverage-ratio calculation |
| 5 | Market-terms / pricing review (§§ 223.51–223.52) | An independent function (credit risk, treasury, or valuation) benchmarks pricing and terms against what the bank would offer or accept from an unaffiliated counterparty | **Low for automation of the determination itself.** Comparability judgment requires real market data and credit-risk comparison a rules engine cannot see; the tool can only capture an affirmative attestation and gate on it, the same pattern the Reg O tool uses for its terms-comparison check |
| 6 | Legal/compliance sign-off | Legal/compliance reviews classification, capacity, collateral, and pricing support, and issues a formal sign-off before the transaction proceeds | **Workflow-automatable, not decision-automatable.** The tool can gate funding on a recorded sign-off; it should not generate the sign-off itself |
| 7 | Credit/business approval | Normal credit approval or investment-committee process runs in parallel with, not instead of, the Reg W sign-off | **Out of scope for this tool** — this is the bank's general credit process, not a Reg W-specific control |
| 8 | Documentation | Deal documents are drafted and executed reflecting the approved terms and any collateral perfection | **Low.** Document drafting is a legal function; the tool's role is limited to recording that documentation was completed, not producing it |
| 9 | Funding and ledger booking | Funds are disbursed and the transaction is booked into the affiliate-transaction ledger, updating the running total against the caps | **High — deterministic.** Booking a completed transaction into a running ledger is exactly the kind of record-keeping a rules engine should own |
| 10 | Ongoing monitoring | Outstanding affiliate exposure is monitored against the caps as capital and balances fluctuate; collateral value is monitored against required haircuts | **High — deterministic**, and the clearest "should already be software, not a spreadsheet" case in the whole matrix — capital stock and surplus changes over time, so a limit that was fine at booking can become a breach later without any new transaction |
| 11 | Periodic testing, audit, and top-of-house reporting | Internal audit/independent risk management samples affiliate transactions; results roll up to a board risk committee; top-of-house compiles LOB-level activity into a consolidated Reg W report | **High for the reporting mechanics** (aggregating LOB-level data into a top-of-house view), **low for what gets sampled and why** — that remains an audit-judgment call |
| 12 | Exception handling | A discovered breach or misapplied exemption is escalated, remediated, and — where required — self-reported to the primary regulator | **Detection is deterministic** (the same limit-tracking engine that runs step 10 should be what raises the alert); **the remediation decision is not automated** |

## B. Why the LOB / top-of-house split matters for this build

Every other Layer 3 tool in this repo has modeled a single decision-maker
role. Reg W compliance work, in practice, runs through two altitudes at
once:

1. **The LOB view** is where a transaction actually gets classified,
   checked against capacity, and logged — the work of steps 1–9 above, and
   the work a line-of-business compliance/operational-risk consultant
   typically owns day to day.
2. **The top-of-house view** aggregates every LOB's affiliate exposure
   against the bank-wide 10%/20% ceilings — because the aggregate limit in
   § 223.12 doesn't care which business line originated a given
   transaction, only that the bank's total exposure to all affiliates
   combined stays under the cap. A business line operating well within its
   own sense of "normal" can still push the bank over an aggregate limit
   another business line is also drawing against.

Building both views into one tool — rather than a single flat calculator —
is what actually demonstrates the operational-risk-consultant experience
this project is meant to showcase, not just knowledge of the 10%/20%
numbers.

## C. Track A candidate, explicitly deferred

Step 2's attribution-rule judgment call (is a nominally third-party
transaction really benefiting an affiliate through an intermediary) is a
legitimate Type 4 (unstructured-language-recognition) candidate, in the
same family as the OFAC triage agent and the SCRA notice-intake agent
elsewhere in this repo — reading a transaction narrative for indirect
signs of affiliate benefit is a language problem, not a routing decision.
It is deliberately **not** built in this version. The Track B tool below
implements a manual attribution-rule flag (a reviewer-asserted checkbox,
consistent with how the rest of the engine treats judgment gates) and
leaves the language-recognition version as a named next phase rather than
building it without the same governance rigor (versioning, eval suite,
human-in-the-loop boundary) applied to this repo's other Track A agents.

---

## D. From tool output to closed loop

Every decision the engine produces is a stop, not a completion — the tool
never itself finishes a transaction that requires escalation. It always
hands off to a named human or committee, and the transaction only proceeds
once that owner acts and the case is re-run through the tool with the
updated facts. This section makes that handoff explicit rather than leaving
a reader to infer it from the engine's `routing` field — the same fix
applied to every other domain in this project once this gap was found (see
[AML/KYC's Layer 2, Section C](layer2-aml-kyc.md),
[Fair Lending's Layer 2, Section D](layer2-fair-lending.md), and
[Anti-Bribery/COI's Layer 2, Section C](layer2-anti-bribery-coi.md) for the
sibling versions), and already present for SCRA in its dedicated
[human-in-the-loop map](layer4-scra-governance.md).

| Decision | Routes to | Required action | How the loop closes |
|---|---|---|---|
| `not_covered` | LOB Compliance (register only) | None | Closed at logging |
| `escalate_attribution` | Compliance Officer / Legal | Manual fact-pattern determination of whether the attribution rule applies | Closes when the determination is made and documented; the transaction is then re-run through the tool as covered or not-covered |
| `exempt` (sister-bank, cash/Treasury-secured, or intraday) | LOB Compliance (register only) | None — not booked to the exposure ledger | Closed at logging; periodically sampled to confirm the exemption's underlying conditions (e.g., ≥80% common control) still hold — an exemption isn't a one-time determination if the ownership structure can change |
| `escalate_market_terms` | Independent Pricing/Credit Review, then Compliance | Document comparable-transaction support and an independent confirmation (as of v1.1, captured via the tool's reviewer-name field and evidence attachment) | Closes when the reviewer confirms "yes" with that support attached and the transaction is re-run |
| `blocked_aggregate` / `blocked_single_affiliate` | Legal / Top-of-House Reg W Program | Restructure or decline the transaction, or pursue an individual exemption from the primary federal regulator | Closes when the transaction is declined/restructured, or when the regulator grants an exemption (a real, current example: OCC Interpretive Letter #1191 — see [Layer 1, Section B](layer1-regw.md)) and the transaction is re-run under that exemption's specific conditions |
| `ineligible_collateral` / `insufficient_collateral` | LOB Compliance / Legal | Pledge eligible or sufficient collateral before funding | Closes when the transaction is re-run with corrected collateral |
| `approved` | LOB Compliance (register only) | None | Booked to the exposure ledger; feeds the top-of-house aggregate view and the quarterly reporting package (Section B above) |

**How this ties the LOB and top-of-house altitudes together:** regardless
of which row above a given determination lands on, every logged
determination — approved or not — becomes part of the quarterly reporting
package and the pool internal audit samples from during periodic testing
(process step 11 in Section A). That's the actual closure at the
consolidated level: an individual transaction's loop closes when its
specific routing action completes, but the *program's* loop closes when
that activity is visible in aggregate to the people who own the bank-wide
20% ceiling and to whoever tests the control for the board.

One gap worth naming rather than glossing over: for `blocked_aggregate` and
`blocked_single_affiliate`, the tool does not currently track whether an
individual-exemption request was actually filed or granted — it stops and
names who to route to, but doesn't hold a "pending exemption" state the way
a production system would need to (this is gap register item #9). The
table above describes the intended loop; the gap register describes exactly
where the current build stops short of enforcing it.

---

## Next steps for this document

- [ ] Once the Track A attribution-rule agent is scoped, add an
      "automation status" column matching the pattern used elsewhere
- [ ] Cross-link each row back to its Layer 1 citation
- [ ] Confirm whether derivative transactions (§ 223.33) belong in a future
      version of the control matrix or stay explicitly out of scope
- [x] Document the tool-output-to-closed-loop handoff for every engine
      decision type — see Section D
