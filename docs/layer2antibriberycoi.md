# Layer 2 — Control Matrix: Anti-Bribery/Corruption & Conflicts of Interest

Maps each regulatory obligation from [Layer 1](../../layer1-regulatory-map/anti-bribery-coi)
to the control(s) firms actually use to satisfy it today, who/what executes
the control, and what an agent — or, in this domain's case, a rules-based
workflow tool — would actually replace or assist.

**A note on this domain specifically:** every other Layer 2 matrix in this project so
far has used "automation potential" to point toward an AI agent. This domain
breaks that pattern on purpose. Several of the rows below are automation
candidates that should explicitly **not** be AI — they're threshold-and-
routing logic, and building them as deterministic software is both cheaper
and more defensible under audit than asking an LLM to evaluate a dollar
amount against a limit. The right-most column calls this out row by row.

---

## A. Anti-Bribery/Corruption & Conflicts of Interest Controls

| Regulation | Control | Typical execution today | Automation potential |
|---|---|---|---|
| FCPA — anti-bribery provisions | Pre-clearance of gifts/entertainment/hospitality involving foreign officials or state-owned-entity counterparties; third-party due diligence | Manual — email requests, paper/PDF forms, or a generic GRC ticketing tool with no domain-specific routing logic | **Medium (deterministic) + narrow AI-assist.** The recipient-type and threshold check is deterministic; explaining *why* a scenario is high-risk (e.g., proximity to a cartel/TCO fact pattern per current DOJ priorities) is closer to a judgment task and would need human review, not automation |
| Bank Bribery Act (18 U.S.C. § 215) | Disclosure and pre-approval of gifts/gratuities involving bank customers or counterparties | Manual disclosure forms, reviewed ad hoc by a designated compliance official | **High — deterministic.** Recipient type, dollar value, and aggregation-to-date are all structured inputs; approve/escalate/deny logic is rule-based, not language-based. This is the clearest case in the whole matrix for "don't use an LLM here" |
| FINRA Rule 3220 / MSRB Rule G-20 | Gift-limit tracking and per-recipient annual aggregation | Tool-assisted at larger broker-dealers (GRC/compliance platforms); spreadsheet or manual log at smaller firms | **High — deterministic, and arguably overdue.** This is a pure aggregation-against-a-threshold problem with a hard dollar figure ($300 as of March 2026) and a defined lookback period. No judgment component at all once the recipient and value are captured correctly |
| Regulation O (12 CFR Part 215) | Board pre-approval routing for insider credit above the $25,000-or-5%-of-capital threshold; absolute sub-cap enforcement for executive-officer "other purpose" credit; bank-wide aggregate insider-lending ceiling; overdraft-prohibition check | Tool-assisted — most core banking/loan origination systems already flag insider status, but threshold calculation and routing exceptions are often manual | **High — deterministic, and more precisely so than first scoped.** Three of the four Reg O sub-rules (board-approval trigger, executive-officer sub-cap, bank-wide aggregate ceiling) are pure arithmetic against a citable dollar/percentage threshold — no judgment component. The fourth (preferential-terms comparison) is a genuine judgment call and is explicitly *not* a rules-engine candidate — see below |
| General conflicts-of-interest disclosure | Annual COI attestations, ad hoc disclosure of outside business activity or personal relationships | Almost entirely manual — annual attestation forms, reviewed by HR/compliance without much systematic cross-referencing | **Low-medium.** Routing and escalation are automatable; determining whether a disclosed relationship *is* a conflict requiring mitigation is a judgment call that shouldn't be delegated to either a rules engine or an LLM without human sign-off |
| Gifts/entertainment to government officials generally | Screening whether a customer or counterparty contact is a government official before any gift/entertainment offer, then applying the correct threshold | **Almost entirely manual today** — relies on the offering employee's own knowledge of who they're dealing with, often without a reliable "is this person a government official" data flag in the CRM | **High for the workflow, but gated by a data-quality dependency.** The approval logic itself is simple once you know the recipient's status; the honest gap is that most institutions don't have a trustworthy, structured government-official flag to feed it — worth stating explicitly rather than assuming it away |

---

## B. Why this is the right domain for the first non-AI Layer 3 artifact

Looking at the automation-potential column, four of six rows are marked
**deterministic** rather than AI-assisted — a sharp contrast with AML/KYC's
matrix, where the strongest case (OFAC false-positive triage) was
specifically an LLM-suited *language and judgment* task. That contrast is
the point: this domain is where the project can show it knows the difference.

The gifts/entertainment pre-clearance workflow (Bank Bribery Act + FINRA
3220/MSRB G-20 + government-official-recipient rows) is the strongest first
build:

1. **The inputs are structured, not narrative.** Recipient type, dollar
   value, aggregation-to-date, and government-official status are all
   discrete fields — there's no ambiguous text to interpret, which is
   exactly the condition under which a deterministic rules engine
   outperforms an LLM on cost, latency, and auditability.
2. **The thresholds are current, dated, and citable** — $300 (FINRA, since
   March 30, 2026), $20/$50 (federal employee de minimis, 5 CFR 2635.204),
   with a known staggered effective date for bank-affiliated municipal
   dealers under MSRB G-20. A tool that hardcodes these needs the same
   "verify against primary source, log the source and date" discipline
   already established in this project — the risk of a stale threshold is
   just as real here as the HMDA $100-vs-$200 catch was in Fair Lending.
3. **The audit trail requirement is explicit in the underlying law, not
   inferred.** DOJ's own prosecutorial guidance on bank bribery treats
   *disclosure and review by a designated official* as evidence of good
   faith — meaning the workflow tool's approval log isn't just good
   practice, it's the specific artifact regulators and prosecutors look for.
4. **It cleanly demonstrates the "don't reach for AI" judgment call.** A
   reader skeptical of an AI-heavy portfolio can look at this row and see
   that the methodology, not the model, is what's being showcased.

This validates the build order: **gifts/entertainment pre-clearance tool
first**, as the deterministic counterpart to the reg-change-monitor agent —
same governance rigor (Layer 4 still applies: version control, audit
logging, documented decision logic), no model risk register entry needed
for the rules engine itself, though the *threshold values* still need the
same "verified against primary source, dated" treatment as any other
regulatory fact in this project.

---

## C. From tool output to closed loop

Both Track B tools in this domain are deterministic, but "deterministic"
only covers the calculation — neither tool completes a transaction or
event on its own. This section makes each tool's actual handoff explicit,
matching the same section added to every other domain in this project (see
[Regulation W's Layer 2, Section D](layer2-regw.md) for the fullest version
of this pattern, since it was the first domain where this gap was
identified and fixed).

**Pre-Clearance Determination System**

| Tool output | Routes to | Required action | How the loop closes |
|---|---|---|---|
| Manager rejects (first-line) | Nobody further | None — request never proceeds | Terminal. The tool's own doc states this plainly: "A manager's rejection is terminal — the request never reaches second-line review." |
| Manager approves (first-line) | Second-line independent rules engine | None — the manager's approval only clears the request to reach the second-line check; it does not decide the outcome | Loop continues, doesn't close yet |
| Second-line: APPROVE | Requestor (register only) | None | Closed — the gift/entertainment/hospitality may proceed as disclosed |
| Second-line: ESCALATE | Compliance / Legal | Independent review before the event may proceed | Closes when Compliance/Legal makes the call — the tool's determination is a routing decision, not a final one |
| Second-line: DENY | Requestor | None — may not proceed as structured | Terminal |

The tool's UI simulates this entire chain live (a Manager Approval Queue
with real Approve/Reject actions, feeding into the second-line engine) —
this table exists so the same logic is legible to a reader of the docs, not
only a user clicking through the demo.

**Regulation O Insider Credit Threshold Tool**

| Tool output | Routes to | Required action | How the loop closes |
|---|---|---|---|
| Approved (within all thresholds) | Compliance (register only) | None | Closed at logging; counted toward the running insider-exposure ledger for future determinations |
| ESCALATED — board approval required (§ 215.4(b)) | Board of Directors, insider abstaining from the vote | A board vote | Closes when the board's approval is recorded — noted in the tool's own gap register (item #7) as not yet tracked as real workflow state; today the tool logs the determination and stops, it does not confirm the vote happened |
| ESCALATED — terms comparison unconfirmed (§ 215.4(a)) | Compliance Officer / Legal | Confirm the extension is on substantially the same terms as a comparable non-insider transaction | Closes when that confirmation is documented — this is the one genuine judgment call in Reg O, and the tool is explicit that it doesn't attempt to resolve it |
| PROHIBITED — executive-officer sub-cap breach (§ 215.5(c)(4)) or overdraft without a qualifying plan/exception (§ 215.4(e)) | Compliance Officer | Cannot proceed as structured — no board override exists for this ceiling, unlike the general board-approval trigger | Terminal as structured; only closes by not proceeding, restructuring, or (for the aggregate ceiling) the bank-wide small-institution exception where applicable |

The distinction between "ESCALATED" (a process a board or reviewer can
complete) and "PROHIBITED" (an absolute ceiling nothing in the regulation
lets anyone approve past) is deliberate in the tool's own design — the same
distinction Regulation W's tool draws between its board-level escalations
and its hard 10%/20% statutory caps, which have no board-level override at
all (see Regulation W's Layer 2, Section D).

---

## Next steps for this document

- [ ] Confirm current FINRA 3220 valuation methodology detail (cost vs. face value for event tickets) is reflected accurately once the tool's entertainment-valuation logic is built
- [ ] Add a row for FCPA third-party due diligence (intermediary/agent vetting) if the tool's scope expands beyond gifts/entertainment
- [ ] Cross-link each control row back to its Layer 1 citation
- [x] Document the tool-output-to-closed-loop handoff for both Track B tools — see Section C
- [ ] Once the pre-clearance tool is built, add an "automation status" column (planned / built / deployed) matching the pattern used in other domains
