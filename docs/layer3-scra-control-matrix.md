# Layer 3 — Control Matrix: Servicemembers Civil Relief Act (SCRA)

Maps each process step from Layer 2 to a specific, testable control. For
each control, identifies current execution model, what failure looks like in
practice, and where an agent can meaningfully assist.

The "Agent opportunity" column characterizes *what kind of task* the agent
would be performing and *why that task is well-suited to agent execution* —
not yet how the agent is built. Architecture comes in Layer 4.

> Status: v0.2, updated 2026-06-22. Reclassified P2-C3, P6-C4, P7-C4, and P7-C5 from Medium to Low-Medium, reflecting honest assessment that agent opportunity is constrained by data availability or human accountability dependencies rather than judgment. Added Low-Medium tier to summary tables.

> **⚠ Demonstration Scope Notice**
>
> This document is part of the RMAS showcase methodology. The following gaps
> exist between this demonstration and production use:
>
> **1. "Current execution" assessments are industry-derived, not institution-specific.**
> The execution model column (Manual / Tool-assisted / Automated / Absent)
> reflects patterns observed in OCC examination findings and regulatory guidance
> across the industry — not the actual control environment of any specific
> institution. A production control matrix requires a control inventory exercise
> at the institution: confirming which controls exist, how they are executed,
> and where gaps actually are. The industry-derived assessments here are a
> starting point for that exercise, not a substitute for it.
>
> **2. Agent opportunity ratings assume data availability that may not exist.**
> Several High-rated controls carry an implicit assumption that P1-C4
> (origination-date military status and loan type as queryable fields in the
> servicing system) has been resolved. If that systems integration work has
> not been done, multiple downstream High-rated controls cannot be executed
> by an agent regardless of agent quality. A production deployment requires
> a data availability audit before agent opportunity ratings are treated as
> actionable.
>
> **3. Control frequency and cadence column not yet built.**
> The matrix identifies what each control does and who executes it, but does
> not specify how often event-triggered controls fire in practice or what the
> expected volume of agent actions is per period. A production control matrix
> requires cadence specification — both for resource planning and for
> establishing the drift monitoring baselines in Domain 3 of the governance
> framework.
>
> **4. State law controls not included.**
> Controls reflect federal SCRA requirements only. State-level servicemember
> protections may require additional controls not present in this matrix.
>
> **5. Vendor controls are placeholders.**
> The vendor-related controls (P6-C4 and references to foreclosure counsel
> and collection agency oversight) identify the requirement without specifying
> the contract language, audit procedures, or documentation standards a
> production vendor oversight program would require.
>
> The control identification and agent opportunity ratings are accurate for
> the federal SCRA framework. These gaps represent the work required to
> translate this methodology into an institution-specific control environment.

---

## How to read this matrix

**Control ID:** P[process number]-C[control sequence]. P2-C3 is the third
control in Process 2.

**Execution model:**
- **Manual** — a human performs this step with no system support
- **Tool-assisted** — a human performs this step with system support (a platform flags, a tool queries, but a human decides)
- **Automated** — the step executes without human intervention per defined rules
- **Absent** — this control is required but commonly missing at one or more tier

**Agent opportunity rating:**
- **High** — the task is well-defined, the failure mode is costly, and the task characteristics match agent strengths (language understanding, pattern recognition, structured reasoning, API integration)
- **Medium** — agent can assist meaningfully but human judgment remains load-bearing at the decision point
- **Low** — the control is already well-automated, or the task characteristics do not favor agent execution

---

## P1 Controls — Loan Origination

| Control ID | Control (specific, testable) | Current execution | Failure mode | Agent opportunity |
|---|---|---|---|---|
| P1-C1 | At application, capture military affiliation indicator — record whether applicant self-identifies as servicemember, dependent, or neither | Manual — staff ask; reliability depends on training and applicant disclosure | Affiliation not captured; no flag in loan record; downstream SCRA/MLA routing has no basis to work from | **Medium.** Agent can monitor application data for indirect indicators of military status (military employer, military address, military email domain) and flag for follow-up. Does not replace direct inquiry but catches cases where applicant doesn't self-identify. |
| P1-C2 | Run DMDC query at origination using applicant SSN; record result and query date in loan record | Tool-assisted (where implemented) / **Absent** at community bank tier | No origination-date DMDC record; pre/in-service determination cannot be made at future activation; MLA/SCRA routing error | **High.** DMDC query is an API call with a deterministic input (SSN) and structured output (active/not active, status date). Agent can execute the query, parse the result, write it to the loan record, and flag routing decision — no human judgment required for the mechanical step. Human review warranted only on ambiguous or error results. |
| P1-C3 | Based on DMDC result at origination: route to SCRA (pre-service) or MLA (in-service) compliance framework; record routing decision and basis in loan file | Manual / Tool-assisted | Wrong regime applied; MLA protections missed for in-service borrower; or SCRA protections missed at future activation for pre-service borrower | **Medium.** Routing logic is rule-based once DMDC result is known. Agent can apply the routing rule and produce a written determination. Edge cases (e.g., borrower recently discharged, short active duty gap) require human review. |
| P1-C4 | Record origination date, DMDC result, military status flag, and loan type (mortgage/non-mortgage) as queryable fields in the loan servicing system | Tool-assisted / **Absent** where loan origination system and servicing system are not integrated | Critical fields not in servicing system; P2 batch screening has no loan-type or status data to work with; tail period logic cannot be applied | **Low.** This is a data architecture and systems integration problem, not an agent task. Agent cannot compensate for missing fields in the servicing system. |
| P1-C5 | Provide SCRA rights disclosure to borrower at origination (mortgage: HUD/CFPB prescribed form; non-mortgage: written notice of SCRA availability) | Manual / Tool-assisted (disclosure package generation) | Disclosure not provided; examination finding; not independently a major harm but compounds other failures | **Low.** Already handled by disclosure generation systems in most platforms. Agent adds little here. |

---

## P2 Controls — Servicing: Ongoing Portfolio Monitoring

| Control ID | Control (specific, testable) | Current execution | Failure mode | Agent opportunity |
|---|---|---|---|---|
| P2-C1 | Run DMDC batch query against all open loan accounts (or accounts with note rate > 6%) on a defined schedule; minimum quarterly for mortgage portfolios | Tool-assisted (large bank) / Manual or **Absent** (community/midsize) | Servicemember activates; bank does not detect; rate cap not applied; excess interest accumulates; DOJ/CFPB enforcement exposure (December 2024 joint letter specifically targets this gap) | **High.** Scheduled batch DMDC query is a defined, repeatable, API-driven task with no inherent judgment requirement. Agent can execute the batch query, parse results, produce a match report, and trigger downstream workflows for any new active-duty matches — with a full audit log of each run. This is the most directly agent-addressable control in the entire SCRA program. |
| P2-C2 | For each new active-duty match from batch query: calculate 6% interest rate cap retroactive to DMDC-reported active duty start date; quantify excess interest charged since that date | Tool-assisted / Manual | Incorrect retroactive start date used; excess interest understated; partial or no refund; restitution risk | **High.** Calculation is deterministic given inputs (balance history, rate history, active duty start date, loan type). Agent can perform the calculation, document the methodology, and produce a calculation output for human review before application. Human review of the output is appropriate; the calculation itself does not require it. |
| P2-C3 | Apply rate cap: reduce rate to 6%, forgive (not defer) excess interest, reduce periodic payment, confirm no principal acceleration | Tool-assisted / Manual | Interest deferred rather than forgiven; payment not reduced; principal accelerated — all are distinct violations of 50 U.S.C. § 3937(a)(3) | **Low-Medium.** The application mechanics must execute in the loan servicing system — agent cannot directly modify loan terms without system integration. Agent value is in verifying that all three required mechanics are confirmed in the system output, but only where the servicing platform exposes those fields in a queryable way. At institutions where it does not, the agent has no surface to verify against and the real fix is servicing system configuration. |
| P2-C4 | Institution-wide sweep: upon identifying one SCRA-eligible account, query all accounts held by that servicemember at the institution and apply cap to all eligible pre-service accounts | Manual / **Absent** (most tiers) | Rate cap applied to one account; other accounts at same institution not identified; servicemember receives partial protection; documented DOJ enforcement pattern | **High.** Cross-account identification by SSN is a structured query task. Agent can execute the sweep query, identify all accounts, apply eligibility rules to each, and produce a complete account list for rate cap application — systematically, not relying on staff to remember to check. |
| P2-C5 | Retain DMDC certificate (date, result, certificate format) for each account reviewed in each batch run | Manual / Tool-assisted | DMDC result not retained in certificate format; safe harbor not established; examination finding; litigation defense gap | **High.** Retention of structured query output in a defined format is an agent-native task. Agent executing the DMDC query can simultaneously produce and log the certificate in the required format, linked to the account and the batch run date. No additional human step required. |
| P2-C6 | Notify servicemember of rate cap application and payment change before next statement; first adjusted statement must reflect new rate | Manual | Notification not sent; or sent after the statement cycle has already closed; first statement shows wrong rate — itself a compliance finding | **Medium.** Agent can draft the notification and trigger it at the right point in the workflow. Timing control (before next statement) requires integration with the statement cycle — a systems dependency, not a judgment dependency. |

---

## P3 Controls — Servicemember Notice Intake

| Control ID | Control (specific, testable) | Current execution | Failure mode | Agent opportunity |
|---|---|---|---|---|
| P3-C1 | Log receipt of any SCRA-related communication (written, verbal, or through representative) with date, channel, and content summary; treat verbal mention of military service as a potential trigger requiring escalation | Manual — entirely dependent on staff recognition | Staff do not recognize verbal trigger on collections or servicing call; call not escalated; no SCRA hold placed; collection activity continues against an active-duty servicemember | **High.** This is precisely the task LLMs handle well — recognizing SCRA-relevant language in unstructured text or call transcripts. Agent monitoring call transcripts or secure message content for military service indicators (deployment, orders, active duty, PCS, commanding officer) can flag potential triggers for human review before any adverse action proceeds. |
| P3-C2 | Validate that notice includes required documentation (written notice + orders or CO letter or equivalent); if incomplete, request missing items — do not deny benefits without opportunity to supplement | Manual | Notice rejected as incomplete without opportunity to cure; servicemember loses benefits they are entitled to; SCRA violation | **Medium.** Agent can assess completeness of submitted documentation against defined checklist (written notice present? orders or CO letter present? dates legible and consistent?) and generate a deficiency notice requesting specific missing items. Human review of borderline cases is appropriate. |
| P3-C3 | Establish active duty period start date from documentation; if DMDC does not reflect the period, written notice controls — apply benefits retroactively to documented start date | Manual | DMDC used as sole determination even when servicemember provides documentation of a period not yet reflected in DMDC; benefits denied for valid protected period | **Medium.** Agent can compare DMDC result against submitted documentation dates and flag discrepancies for human resolution. The adjudication of "written notice controls over DMDC" in a specific case requires human decision, but agent can surface the conflict clearly. |
| P3-C4 | Upon receiving notice on any account, execute institution-wide account sweep (same as P2-C4): identify all accounts held by servicemember and apply rate cap determination to each | Manual / **Absent** | Rate cap applied to account on which notice was received; other accounts at institution not swept; partial protection only | **High.** Same characterization as P2-C4. Triggered here by notice receipt rather than batch query — the sweep logic is identical. |
| P3-C5 | Send written confirmation to servicemember of benefits applied, accounts covered, effective date, and new payment amount before next statement | Manual | Confirmation not sent; servicemember has no record of what benefits were applied; dispute resolution difficult; if first statement shows wrong amount, that is itself a finding | **Medium.** Agent can generate the confirmation letter from structured data (accounts, rates, effective dates, payment amounts) and route for sending. Content is templated once data inputs are known. |

---

## P4 Controls — Collections / Default Management

| Control ID | Control (specific, testable) | Current execution | Failure mode | Agent opportunity |
|---|---|---|---|---|
| P4-C1 | At point of delinquency flag, check for existing SCRA status indicator in loan record before initiating any collections contact; route SCRA-flagged accounts to SCRA-aware queue | Tool-assisted (where SCRA flag is populated in servicing system) / Manual or **Absent** (where flag not populated) | Collections contact initiated against active-duty servicemember without checking status; collections pressure applied in violation of SCRA spirit even if not yet at foreclosure/repossession threshold | **Medium.** Queue routing based on existing flag is a rules-based task already suited to automation. Agent value is in the upstream flag population (P2) — if that is done well, this control executes reliably. If not, agent can query DMDC at delinquency flag as a compensating control. |
| P4-C2 | Before initiating any collections contact, run DMDC query on delinquent borrower; apply rate cap if active duty and cap not already applied; hold escalation pending SCRA determination | Manual / Tool-assisted | Collections escalation proceeds without DMDC check; rate cap not applied before contact; if servicemember is active duty, every subsequent collection step is potentially a violation | **High.** DMDC query at a defined workflow trigger point (delinquency flag) is an agent-executable task. Agent can query, parse result, apply rate cap trigger if needed, and hold or release the account for collections — with the DMDC certificate logged automatically. |
| P4-C3 | Before escalating to outside collections, foreclosure referral, repossession referral, or legal action: run a fresh DMDC query regardless of prior query results; treat this as a mandatory gate, not a discretionary check | Manual — escalation decisions are human-driven; DMDC re-query is easily skipped under volume pressure | Servicemember activates between initial collections contact and escalation; prior DMDC result (not active duty) relied upon; escalation proceeds; foreclosure or repossession initiated against protected servicemember | **High.** Mandatory gate enforcement is an agent-native task. Agent can be placed at the escalation decision point as a required step — the escalation workflow does not proceed until the agent has queried DMDC, logged the result, and either cleared or held the account. Removes the human option to skip the check under time pressure. |
| P4-C4 | Before seeking any default judgment, prepare and file affidavit of military status per 50 U.S.C. § 3931; affidavit must state active/not active/unable to determine | Manual — legal team / outside counsel | Affidavit not filed; default judgment obtained without required affidavit; judgment subject to reopening; court sanctions possible | **Medium.** Agent can generate the affidavit content from DMDC query results and flag the filing requirement to legal counsel. Filing itself is a legal action requiring human execution. |
| P4-C5 | Review any adverse credit reporting during active duty period; suppress or correct any delinquency caused by excess interest that SCRA required to be forgiven | Manual / **Absent** | Delinquency caused by excess interest (above 6% cap) reported to credit bureaus; FCRA accuracy violation layered on top of SCRA violation; servicemember credit damaged by bank's own compliance failure | **Medium.** Agent can identify accounts where both (a) SCRA rate cap was applied retroactively and (b) adverse credit reporting occurred during the protected period, and flag for human review and correction. The correction itself requires human action with the credit bureaus. |

---

## P5 Controls — Foreclosure Initiation and Management

| Control ID | Control (specific, testable) | Current execution | Failure mode | Agent opportunity |
|---|---|---|---|---|
| P5-C1 | Mandatory DMDC query before any referral to foreclosure counsel; referral may not proceed until DMDC result is obtained and reviewed; retain DMDC certificate with referral package | Manual / Tool-assisted — but "mandatory" is policy, not always a system gate | DMDC check skipped under volume or time pressure; referral proceeds; if borrower is active duty, strict liability violation from the moment of referral | **High.** Mandatory gate enforcement is the exact use case where an agent provides structural value beyond what policy alone achieves. Agent placed as a required step in the foreclosure referral workflow: no referral packet is generated until DMDC query is complete and certificate is logged. The gate is mechanical, not advisory. |
| P5-C2 | If DMDC returns active duty: immediately place foreclosure hold; notify servicing team; document hold basis and date; do not proceed without court order | Manual | Active duty result returned; hold not placed promptly; referral continues in pipeline; strict liability exposure accumulates | **High.** Active duty result triggers a defined set of actions (hold, notify, document) — each is deterministic and time-sensitive. Agent can execute the hold trigger, generate the internal notification, and create the documentation record immediately upon receiving the DMDC result, without waiting for human processing. |
| P5-C3 | If DMDC returns not active duty: review loan file for indicia of military service before proceeding (returned overseas mail, prior SCRA flag, prior rate cap applied, military affiliation from origination) | Manual — requires human review of file | DMDC "not active duty" result treated as all-clear; file contains indicia of military service that should trigger further investigation; foreclosure proceeds; servicemember was on active duty but DMDC record was stale or incorrect | **Medium.** Agent can execute a structured file review — check for prior SCRA flags, prior rate cap applications, military affiliation indicator from origination — and produce a summary of whether any indicia are present. Human decision on whether to proceed despite indicia is appropriate. |
| P5-C4 | For protracted foreclosure proceedings: re-query DMDC at each material step (e.g., notice of default, referral to counsel, scheduled sale date); retain each certificate | Manual / **Absent** | Initial DMDC query treated as sufficient for entire proceedings; servicemember activates during proceedings; foreclosure completes against protected servicemember | **High.** Scheduled re-query at defined workflow milestones is an agent-schedulable task. Agent can be triggered at each defined milestone, execute re-query, compare to prior result, and escalate if status has changed. No human involvement required for the check itself; human decision required only on status change. |
| P5-C5 | Check post-service tail period: confirm foreclosure does not occur within one year after end of active duty; if end-of-service date is known, calculate tail period expiry before scheduling sale | Manual | End-of-service date not tracked; foreclosure scheduled within tail period; strict liability violation even though servicemember is no longer active duty | **High.** Tail period calculation is deterministic: end-of-service date + 365 days = protection expiry. Agent can calculate, flag any foreclosure action scheduled before expiry, and block scheduling until tail period clears. |
| P5-C6 | Produce complete foreclosure file audit record: all DMDC queries and results (date + certificate), all hold/release decisions with basis and date, court filings, affidavit of military status, final disposition | Manual | Incomplete file; safe harbor not documentable; examination finding; litigation defense gap — especially critical given strict liability exposure | **High.** Audit record assembly is an agent-native task. Agent executing the DMDC queries and hold/release workflows can simultaneously maintain the audit file in real time, producing a complete, timestamped record without a separate manual documentation step. |

---

## P6 Controls — Repossession Initiation

| Control ID | Control (specific, testable) | Current execution | Failure mode | Agent opportunity |
|---|---|---|---|---|
| P6-C1 | Mandatory DMDC query before any referral to repossession vendor; confirm deposit or installment payment was made pre-service; retain DMDC certificate | Manual / Tool-assisted | DMDC check skipped; repossession proceeds against active-duty servicemember; knowing violation | **High.** Same mandatory gate characterization as P5-C1. Agent executes DMDC query as required step before repossession referral packet is generated; no referral without completed query and logged certificate. |
| P6-C2 | Verify pre-service payment condition: confirm at least one installment payment or deposit was made before servicemember's active duty start date | Manual | Repossession hold applied to an obligation that did not have a pre-service payment — protection does not apply; or conversely, protection incorrectly denied for a qualifying obligation | **Medium.** Comparison of origination/first payment date against active duty start date is a structured data check. Agent can execute the comparison and flag cases where the pre-service condition is met or not met. |
| P6-C3 | Monitor for end of active duty (via P7 / DMDC batch query); release repossession hold and resume standard process once end of service is confirmed; note: no tail period for repossession | Manual / **Absent** | Repossession hold maintained indefinitely after service ends; bank loses ability to act on a legitimate default; or hold released prematurely based on informal information rather than confirmed DMDC status change | **High.** Hold release triggered by DMDC status change is a defined, agent-executable event. Agent monitoring DMDC status on held accounts can trigger hold release upon confirmed end of service and document the basis. |
| P6-C4 | Where repossession vendor is used: confirm vendor has completed DMDC check before any repossession action; retain vendor DMDC documentation | Manual / **Absent** — vendor compliance often not verified | Third-party vendor repossesses without DMDC check; bank remains responsible; no documentation to support defense | **Low-Medium.** Agent can generate vendor instruction packages and flag incomplete returned documentation. But vendor oversight is fundamentally a human accountability relationship — contracts, audits, escalation when a vendor repeatedly fails. An agent that reviews documentation and flags gaps is useful at the margin, but vendors who don't maintain DMDC capability at all are a problem an agent cannot solve. |

---

## P7 Controls — Return from Service

| Control ID | Control (specific, testable) | Current execution | Failure mode | Agent opportunity |
|---|---|---|---|---|
| P7-C1 | Detect end of active duty via DMDC status change on regular batch query or servicemember notification; do not rely solely on servicemember to self-report end of service | Manual / Tool-assisted | End of service not detected; SCRA rate cap continues indefinitely on non-mortgage products beyond required period; or mortgage tail period not properly tracked; return-from-service workflow never triggered | **High.** DMDC status change detection on accounts currently under SCRA rate cap is a scheduled monitoring task. Agent can run targeted DMDC queries on SCRA-active accounts, detect status change to not-active-duty, and trigger the return-from-service workflow automatically. |
| P7-C2 | For mortgage accounts: calculate tail period end date (end-of-service date + 365 days); do not restore pre-service rate until tail period expires; record tail period end date as a system field | Manual / **Absent** | Mortgage rate restored before tail period expires; borrower charged above 6% during the protected tail; violation | **High.** Calculation is deterministic. Agent can calculate tail period expiry, record it, and place a rate restoration hold on mortgage accounts that releases automatically only after tail period expiry date is passed and confirmed by a fresh DMDC query. |
| P7-C3 | For non-mortgage products: restore pre-service contractual rate upon confirmed end of service; provide required Regulation Z advance notice before rate increase takes effect | Manual | Rate restored without required Reg Z advance notice; or rate restored to a rate higher than pre-service contractual rate; both are violations independent of SCRA | **Medium.** Agent can calculate required notice period, generate the Reg Z notice, and schedule rate restoration for the correct date after notice delivery. Timing logic is deterministic; content is templated. |
| P7-C4 | For credit card accounts: restore pre-service rate for new transactions; confirm rate above pre-service level is not applied to any transaction that occurred before active duty | Manual | Post-service rate applied retroactively to pre-service transactions on credit card; Regulation Z violation (12 C.F.R. § 1026.55(b)(6)) independent of SCRA | **Low-Medium.** The check itself is straightforward but requires transaction-level data at the account level, which many core banking systems don't expose in a queryable way. This is a data availability problem before it is an agent problem — where the data is accessible, agent can verify prospective-only application; where it isn't, the control must be executed manually regardless. |
| P7-C5 | Review credit bureau furnishing for SCRA-protected period: identify any delinquency reported during period that was caused by excess interest the SCRA required to be forgiven; suppress or correct | Manual / **Absent** | Adverse reporting caused by bank's own SCRA compliance failure remains on servicemember's credit report; FCRA accuracy obligation not met | **Low-Medium.** Agent can identify accounts meeting both conditions (SCRA cap applied retroactively + adverse reporting during protected period) and generate a remediation list. But the actual correction requires submitting disputes or corrections to credit bureaus through defined channels — a human-executed process with its own workflow. Agent contribution is limited to producing the list; whether that's worth building depends on volume of affected accounts. |
| P7-C6 | Verify first post-SCRA statement reflects correct restored rate and payment amount | Manual | First statement after rate restoration shows wrong rate; compliance finding; borrower confusion and potential dispute | **Medium.** Agent can compare statement data against expected rate and payment post-restoration and flag discrepancies before statement is issued or immediately upon issuance. |

---

## P8 Controls — Lease Termination Processing

| Control ID | Control (specific, testable) | Current execution | Failure mode | Agent opportunity |
|---|---|---|---|---|
| P8-C1 | Log and date-stamp receipt of lease termination notice; confirm written notice is present; confirm documentation establishes qualifying military orders | Manual | Notice received but not logged with date; bank later disputes that timely notice was given; servicemember loses benefit of timely termination | **Medium.** Agent can log receipt, extract key fields from submitted documentation (orders type, duration, dates), and produce a completeness assessment against qualifying criteria. |
| P8-C2 | Determine lease type (premises vs. motor vehicle) and apply correct qualifying criteria for that lease type | Manual | Wrong qualifying criteria applied; valid termination denied because staff applied motor vehicle rules to premises lease or vice versa | **Medium.** Lease type determination and criteria application is a rule-based task once documentation is reviewed. Agent can classify lease type and apply the correct eligibility rules, flagging edge cases for human review. |
| P8-C3 | For motor vehicle leases: track 15-day vehicle return deadline from date of notice delivery; confirm vehicle returned within deadline before processing termination | Manual | Deadline not tracked; vehicle returned late; termination processing delayed or disputed | **Medium.** Deadline tracking is a deterministic date calculation. Agent can calculate deadline, send reminder, and flag if return confirmation is not received before deadline. |
| P8-C4 | Process termination without early termination penalty; calculate and refund any pre-paid amounts beyond termination date | Manual | Early termination penalty charged; pre-paid amounts not refunded; SCRA violation | **Medium.** Agent can flag accounts for penalty suppression and calculate refund amounts from lease payment schedule. Execution of the refund requires human action in the payment system. |
| P8-C5 | Send written confirmation of termination, effective date, and refund amount to servicemember | Manual | Confirmation not sent; servicemember has no record of termination; dispute risk | **Medium.** Agent can generate confirmation letter from structured data inputs and route for sending. |

---

## P9 Controls — Civil Litigation / Debt Recovery Actions

| Control ID | Control (specific, testable) | Current execution | Failure mode | Agent opportunity |
|---|---|---|---|---|
| P9-C1 | Before initiating any civil action against a borrower, run DMDC query and review loan record for prior SCRA flags; treat as mandatory gate before filing instructions are issued to counsel | Manual / **Absent** — pre-filing DMDC check is rarely systematized in legal/recovery workflows | Civil action filed against active-duty servicemember; stay imposed by court; litigation costs and delay; reputational harm; potential DOJ scrutiny | **High.** Same mandatory gate character as P5-C1 and P6-C1. Agent placed at filing instruction step executes DMDC query, checks for prior SCRA flags in loan record, and blocks or flags the filing until status is confirmed and documented. Removes the option to skip under caseload pressure. |
| P9-C2 | Before filing on any account where a statute of limitations is a factor, calculate the applicable limitations period with any active duty tolling periods excluded; document calculation and inputs | Manual / **Absent** — tolling calculation routinely omitted in collections and recovery workflows | Action filed after limitations period has actually expired (bank loses on timeliness grounds); or action not filed because limitations period appears expired when tolling has actually extended it (bank loses recoverable debt) | **High.** Limitations period calculation with tolling is deterministic given inputs: charge-off or default date, applicable state limitations period, and confirmed active duty dates from DMDC and loan record. Agent can execute the calculation, document the methodology, and produce a clear output — tolled period excluded, adjusted expiry date stated. Legal review of the output is appropriate; the arithmetic does not require it. |
| P9-C3 | Prepare affidavit of military status per 50 U.S.C. § 3931 before seeking any default judgment in a civil proceeding; affidavit must state active / not active / unable to determine | Manual — legal team or outside counsel | Default judgment obtained without required affidavit; judgment subject to court challenge and reopening; court sanctions possible | **Medium.** Agent can generate the affidavit content from DMDC query result and route to counsel for review and filing. Filing is a legal action requiring human execution; content generation and routing are agent-executable. |
| P9-C4 | Upon receipt of a stay order under 50 U.S.C. § 3932: place matter in litigation hold; calendar stay period end date; confirm limitations period is not treated as running during the stay | Manual | Stay received but not calendared; matter proceeds after stay expires without reassessment; or limitations period miscalculated because stay period was treated as running time | **Medium.** Agent can log the stay order, calculate and calendar the stay expiry, and flag the matter for reassessment at expiry. Limitations period recalculation at expiry requires human legal review but agent can produce the inputs. |
| P9-C5 | Upon stay expiry or end of military service: re-run DMDC query before resuming proceedings; recalculate limitations period as of date of resumption; document reassessment | Manual | Proceedings resume without confirming end of active duty; or limitations period recalculated incorrectly at resumption | **High.** Re-query on a defined trigger event (stay expiry date or DMDC status change) is an agent-schedulable task. Agent can execute re-query, recalculate limitations period, and produce a resumption-readiness summary for legal review before proceedings restart. |
| P9-C6 | Retain complete litigation file: DMDC certificates for all queries, limitations period calculation with methodology, affidavit of military status, any stay orders, and final disposition | Manual / **Absent** — litigation files often held by outside counsel without systematic SCRA documentation requirements | Incomplete file; bank cannot demonstrate pre-filing DMDC check or limitations calculation; examination finding; litigation defense gap | **High.** Audit record assembly from structured inputs (DMDC results, calculations, court documents) is agent-native. Agent executing the pre-filing workflow can simultaneously assemble and maintain the documentation file, including flagging when outside counsel has not returned required SCRA documentation. |

---

## Control summary by agent opportunity rating

### High — agent is structural, not advisory

These controls have task characteristics (deterministic logic, API-executable,
mandatory gate enforcement, audit record generation) where agent execution
provides structural compliance value — not just efficiency. Human policy
alone does not reliably achieve these controls at scale.

| Control ID | Control summary | Why high |
|---|---|---|
| P1-C2 | DMDC query at origination | API-executable, deterministic output, audit log native |
| P2-C1 | DMDC batch query — portfolio monitoring | Scheduled, repeatable, no judgment required |
| P2-C2 | Rate cap calculation — retroactive | Deterministic given inputs; error-prone manually at volume |
| P2-C4 | Institution-wide account sweep | Structured cross-account query; systematically missed manually |
| P2-C5 | DMDC certificate retention | Agent executing query can simultaneously produce and log certificate |
| P3-C1 | Verbal/written trigger recognition | LLM-native task — unstructured language recognition |
| P3-C4 | Institution-wide sweep on notice receipt | Same as P2-C4, triggered by notice rather than batch |
| P4-C2 | DMDC query at delinquency flag | Defined workflow trigger; DMDC query is API-executable |
| P4-C3 | Mandatory gate before escalation | Gate enforcement — removes human option to skip under pressure |
| P5-C1 | Mandatory gate before foreclosure referral | Gate enforcement — strict liability makes skipping catastrophic |
| P5-C2 | Hold trigger on active duty result | Deterministic trigger → defined action set; time-sensitive |
| P5-C4 | Re-query at foreclosure milestones | Scheduled re-query; milestone-triggered; no judgment required |
| P5-C5 | Tail period calculation and gate | Deterministic date math; blocks scheduling before expiry |
| P5-C6 | Foreclosure audit record assembly | Agent executing workflow simultaneously builds audit record |
| P6-C1 | Mandatory gate before repossession referral | Same as P5-C1 |
| P6-C3 | Hold release on end-of-service detection | DMDC status change → defined trigger; no tail period complication |
| P7-C1 | Return-from-service detection | DMDC monitoring on SCRA-active accounts; status change trigger |
| P7-C2 | Mortgage tail period calculation and hold | Deterministic; failure mode is a documented common exam finding |
| P9-C1 | Mandatory gate before civil filing | Gate enforcement; pre-filing check systematically absent today |
| P9-C2 | Limitations period calculation with tolling | Deterministic arithmetic; tolling routinely omitted in practice |
| P9-C5 | Re-query and recalculation at stay expiry | Scheduled trigger; deterministic calculation; agent-executable |
| P9-C6 | Civil litigation audit record assembly | Agent executing pre-filing workflow simultaneously builds file |

### Medium — agent assists, human decides

These controls involve judgment calls, cross-system execution, or legal
actions where agent outputs inform but do not replace human decision.

| Control ID | Control summary | Human decision point |
|---|---|---|
| P1-C1 | Military affiliation flag from indirect indicators | Flag for follow-up; human confirms |
| P1-C3 | SCRA/MLA routing decision | Edge cases require human review |
| P2-C6 | Servicemember notification — timing | Statement cycle integration is systems dependency |
| P3-C2 | Notice completeness assessment | Borderline documentation cases |
| P3-C3 | DMDC vs. written notice conflict | Adjudication of which controls requires human decision |
| P3-C5 | Written confirmation to servicemember | Content generated by agent; human review appropriate |
| P4-C4 | Default judgment affidavit preparation | Filing is legal action requiring human execution |
| P4-C5 | Adverse credit reporting review | Correction action requires human bureau interaction |
| P5-C3 | File indicia review on DMDC "not active" result | Human decides whether to proceed despite indicia |
| P6-C2 | Pre-service payment condition verification | Structured check; edge cases need human review |
| P7-C3 | Reg Z advance notice and rate restoration | Notice generation automated; scheduling requires human confirmation |
| P7-C6 | Post-SCRA statement accuracy check | Comparison automated; discrepancy resolution is human |
| P8-C1 | Lease termination notice logging | Documentation completeness assessment |
| P8-C2 | Lease type and eligibility determination | Edge cases and ambiguous orders require human review |
| P8-C3 | Motor vehicle return deadline tracking | Tracking automated; dispute resolution is human |
| P8-C4 | Penalty suppression and refund calculation | Execution in payment system requires human action |
| P8-C5 | Lease termination confirmation letter | Generation automated; human review appropriate |
| P9-C3 | Default judgment affidavit generation | Filing requires human legal execution |
| P9-C4 | Stay order logging and calendaring | Stay expiry reassessment requires human legal review |

### Low-Medium — agent contribution is marginal or data-dependent

These controls are where agent opportunity was initially assessed as Medium
but is more accurately characterized as limited in practice. The constraint
is not judgment — it is either a data availability problem (the agent cannot
query what the system doesn't expose) or a human accountability relationship
(the agent can flag but cannot substitute for the responsible party).

| Control ID | Control summary | Why Low-Medium |
|---|---|---|
| P2-C3 | Rate cap application mechanics verification | Agent can only verify what the servicing platform exposes; where fields aren't queryable, the real fix is system configuration not an agent |
| P6-C4 | Vendor DMDC documentation review | Vendor oversight is a human accountability relationship; agent flags gaps but cannot fix vendors who lack DMDC capability |
| P7-C4 | Credit card retroactive rate check | Transaction-level data often not queryable; data availability problem precedes agent opportunity |
| P7-C5 | Credit bureau furnishing remediation list | Agent generates the list; correction requires human bureau interaction; value depends on volume of affected accounts |

### Low — already automated or not agent-suited

| Control ID | Control summary | Why low |
|---|---|---|
| P1-C4 | Loan record data fields — systems integration | Architecture problem, not agent task |
| P1-C5 | SCRA disclosure at origination | Already handled by disclosure systems |

---

## Next steps for this document

- [ ] Validate "Current execution" assessments against actual bank procedure documentation or industry survey data — current assessments are derived from exam findings and regulatory guidance
- [ ] Add control frequency / cadence column (some controls are event-triggered; others are scheduled)
- [ ] Map each High-rated agent opportunity to the specific agent capability it requires (DMDC API integration, transcript analysis, date calculation, document generation) — this is the bridge to Layer 4
- [ ] Identify which High-rated controls, if bundled, constitute a coherent first agent build vs. which require separate agent designs
- [ ] Add state law overlay: several states (California, New York, others) have SCRA-equivalent or enhanced protections that add controls on top of the federal floor mapped here
- [ ] Add vendor control rows for P4, P5, P6, P9 reflecting the explicit vendor responsibility framing now in Layer 1 Section J
