# SCRA Agent — Governance and Risk Management Framework

This document defines the specific actions, cadences, and human-in-the-loop
requirements for operating the SCRA DMDC Integration Agent (Type 1) in a
compliance context. It is organized into five governance domains. Each domain
specifies what must happen, how often, and what human review actually means
at each checkpoint — not just that it is required.

> This document is a companion to Layer 4 (Agent Characterization and
> Governance). Layer 4 defines the governance architecture. This document
> defines the operational execution of that architecture.

> Status: v0.2, updated 2026-07-03. Added Domain 8 — AI System Availability and Business Continuity, covering LLM provider outage scenarios, fallback operating modes, and BCP requirements. Updated demonstration scope notice and next steps accordingly.

> **⚠ Demonstration Scope Notice**
>
> This document is part of the RMAS showcase methodology. The following gaps
> exist between this demonstration and production use:
>
> **1. Roles are defined but not assigned.**
> This document specifies accountable roles (Compliance Officer, SCRA Reviewer,
> Model Risk / AI Governance, Legal, CRO). In a production deployment, each
> role must have a named individual or team assigned before the framework is
> operational. Roles without names are not accountability — they are placeholders.
> The governance summary table in the final section shows who does what; a
> production version of that table has job titles and names, not role labels.
>
> **2. Pass thresholds require formal adoption.**
> The eval suite pass thresholds defined in Domain 2 are methodology
> recommendations. A production deployment requires these to be formally
> adopted in a signed governance document before the first eval run. The act
> of formal adoption — not just documentation — is what creates the
> accountable standard.
>
> **3. Gate hold review interface not designed.**
> Domain 4 defines what genuine human review requires. It does not specify
> the interface through which SCRA Reviewers receive, assess, and act on
> gate holds. A production deployment requires that interface to be designed
> and built — presenting sufficient context (DMDC certificate, account
> history, prior SCRA flags, required actions) for a reviewer to exercise
> real judgment, not just an approve/reject button.
>
> **4. SR 11-7 integration not addressed.**
> This framework governs the SCRA agent specifically. It does not address
> integration with the institution's broader model risk management program
> under SR 11-7. A production deployment requires this framework to sit
> explicitly within — not parallel to — the institution's model governance
> program, with the model validation function involved in pre-deployment
> eval review.
>
> **5. Record retention schedule not defined.**
> Audit logs, eval results, governance changelog entries, and DMDC
> certificates are identified as compliance records requiring retention.
> The specific retention period is not defined here — it must be set
> consistent with the institution's SCRA record retention policy and
> general compliance record retention requirements before production
> deployment.
>
> **6. This document covers Type 1 only.**
> The governance framework is written for the DMDC Integration Agent (Type 1).
> As Types 2, 3, and 4 are built, each requires its own governance domain
> extensions — particularly the eval suite (Domain 2) and human-in-the-loop
> map (Domain 4), which will differ materially by capability type.
>
> **7. Business continuity plan is demonstration-level only.**
> The agents implement a fallback mode that substitutes pre-written compliance
> guidance when the AI model is unavailable. This is a functional demonstration
> of the BCP concept, not a production-grade continuity plan. A production
> deployment requires formally documented and tested manual procedures, adopted
> RTO/RPO targets, staff training on fallback operation, and periodic BCP
> testing per Domain 8.
>
> The governance actions, cadences, and human-in-the-loop standards defined
> here are complete for showcase purposes. These gaps represent the
> operationalization work required before this framework governs a live
> compliance workflow.

---

## How to read this document

**Cadence definitions:**
- **Per-run** — every time the agent executes, without exception
- **Event-triggered** — when a specific condition occurs (DMDC result, status change, incident)
- **Daily** — once per business day
- **Weekly** — once per calendar week
- **Monthly** — once per calendar month
- **Quarterly** — once per calendar quarter
- **Pre-deployment** — before any change to model, prompt, or code goes to production

**Human review quality standard:**
Human review is not rubber-stamping. Where this document requires human
review, it means a qualified person examines the specific output, applies
their own judgment, and produces a documented decision. A human who approves
500 items in 10 minutes has not reviewed them. Governance design must account
for review volume — if the agent produces more output than a qualified
reviewer can genuinely assess, the agent scope must be reduced or the
reviewer capacity must be increased.

**Accountable roles referenced:**
- **Compliance Officer** — the designated SCRA compliance owner
- **SCRA Reviewer** — trained staff member with authority to confirm SCRA
  determinations and release or maintain holds
- **Model Risk / AI Governance** — the function responsible for model
  versioning, eval suite execution, and drift monitoring
- **Legal** — internal or external counsel with SCRA expertise
- **CRO / Senior Management** — escalation point for P1 incidents and
  material governance decisions

---

## Domain 1 — Model and Prompt Governance

Covers version control, change management, and the validation process
before any change reaches production.

| Action | Cadence | Human review required | What review means in practice |
|---|---|---|---|
| Record current model version, prompt version, and code version in a persistent governance log | Per-run (automatic) | None — log is automated | N/A |
| Verify that production agent is running the pinned model version, not a provider default | Daily (automated check) | Compliance Officer reviews alert if version mismatch detected | Confirm whether version drift was intentional; if not, initiate rollback |
| Review provider release notes for any announced changes to the pinned model | Weekly | Model Risk reviews release notes | Assess whether announced changes affect SCRA-relevant behaviors; flag for eval re-run if yes |
| Run full eval suite before any model, prompt, or code change goes to production | Pre-deployment (every change) | Model Risk executes; Compliance Officer reviews results | Review pass/fail results against defined thresholds; sign off or reject the change — this sign-off must be documented |
| Maintain changelog: model version, prompt version, code version, effective date, who approved | Per change event | Compliance Officer signs each entry | Confirm change is documented with sufficient detail to support audit defense |
| Conduct scheduled model review — assess whether current model version is still fit for purpose or whether an upgrade should be considered | Quarterly | Model Risk + Compliance Officer | Review provider's model roadmap, deprecation timeline, and any announced capability changes; decide whether to evaluate an upgrade |

**Governance note on version pinning:**
Most API providers allow pinning to a specific model version. Some do not
guarantee indefinite availability of pinned versions — models are deprecated
on provider timelines, not the bank's. The governance log must track the
deprecation date of the pinned model so the bank is not forced into an
unplanned upgrade. Treat a deprecation notice as a pre-deployment change
event requiring full eval suite re-run.

---

## Domain 2 — Evaluation Suite Execution

Covers when the eval suite runs, who reviews results, what the pass
threshold means, and what happens when cases fail.

| Action | Cadence | Human review required | What review means in practice |
|---|---|---|---|
| Run full eval suite (all 6 test cases + any added cases) | Pre-deployment — mandatory gate; no change reaches production without a passing eval run | Model Risk executes; Compliance Officer reviews results | Review each failed case individually — not just the aggregate pass rate. A single failed case on TC-04 (API timeout → gate fails closed) or TC-03 (no record → escalate) is a blocking failure regardless of overall pass rate |
| Run targeted eval subset (DMDC edge cases: no-record, timeout, active/not-active routing) | Monthly in production | SCRA Reviewer reviews results | Confirm that production behavior on edge cases matches expected behavior; flag any deviation for investigation even if it does not breach the pass threshold |
| Add new eval cases when a novel edge case is encountered in production | Event-triggered (novel edge case identified) | Compliance Officer approves new case before it is added to the suite | Review proposed case for accuracy: is the "expected output" correctly defined? Is the scenario realistic? |
| Review eval suite coverage — confirm that the case set reflects current regulatory requirements | Quarterly | Compliance Officer + Legal | Assess whether any regulatory changes (new FinCEN/OCC guidance, NDAA amendments) require new eval cases or revision of existing expected outputs |
| Document eval results and store with governance log | Per eval run (automatic) | None — storage is automated | N/A |

**Pass threshold definition (must be set before production deployment):**

| Test case category | Minimum pass rate | Rationale |
|---|---|---|
| TC-04 (API timeout → fail closed) | 100% — zero tolerance | A gate that fails open under any condition is a strict liability risk |
| TC-03 (no record → escalate) | 100% — zero tolerance | Treating no-record as clearance is a systematic violation generator |
| TC-01, TC-02 (active/not-active routing) | 100% — zero tolerance | Core routing logic must be correct on every run |
| TC-05, TC-06 (sweep, certificate) | 98%+ | Higher tolerance for edge cases in sweep logic and cert fields |
| Overall suite | 98%+ | Below this threshold, change is rejected |

**Zero-tolerance cases must be called out explicitly.** An eval suite that
shows 5/6 passing with TC-04 as the failure is not "83% pass rate, close
enough." It is a blocking failure. The governance framework must state this
before deployment — not after the first incident.

---

## Domain 3 — Production Monitoring and Drift Detection

Covers what signals to monitor in production, how often, and who acts
on anomalies.

| Signal | Monitoring method | Cadence | Alert threshold | Human review required | What review means |
|---|---|---|---|---|---|
| DMDC API error rate (timeouts, connection failures, malformed responses) | Automated counter per batch run | Per-run | >2% error rate in any single run; any single timeout on a foreclosure/repossession trigger | Model Risk + SCRA Reviewer alerted immediately | Investigate cause: DMDC API degradation, network issue, or agent query format error. Do not resume gated workflows until error rate returns to baseline |
| DMDC "no record" rate | Automated counter per batch run | Per-run | >5% no-record rate in any single run (baseline deviation) | SCRA Reviewer reviews no-record accounts | Confirm no-record accounts are being correctly escalated; assess whether query input quality has degraded |
| Gate hold → human review SLA | Automated timer from hold placement to reviewer action | Daily | Any hold not reviewed within 1 business day | Compliance Officer alerted on SLA breach | Confirm reviewer capacity is sufficient; assess whether any unreviewed holds represent active violations |
| Gate override rate | Count of holds manually overridden by human reviewers | Weekly | >0 overrides in any week requires review; trend increase requires escalation | Compliance Officer reviews each override individually | Each override must have a documented basis. Trend increases suggest either (a) agent is over-holding or (b) reviewers are bypassing the control — both require investigation |
| Rate cap trigger rate (accounts flagged as SCRA-eligible per batch run) | Automated counter | Per-run | Sudden drop >20% from prior run baseline (without corresponding portfolio change) | Model Risk investigates | A drop in trigger rate is the most dangerous drift signal — it may indicate the agent is under-identifying active duty servicemembers. Rule out portfolio explanation before ruling out model regression |
| Audit log completeness | Automated check: confirm every agent action has a corresponding log entry | Daily | Any gap in log coverage | Model Risk + Compliance Officer alerted | A log gap means a compliance record is incomplete. Assess what actions occurred during the gap and reconstruct manually if possible. If gap covers a gated workflow, treat as P2 incident |
| Certificate generation success rate | Automated counter | Per-run | <100% — every DMDC query must produce a certificate | SCRA Reviewer reviews any query without a certificate | A DMDC query without a certificate is not a compliance record. Investigate cause and regenerate if possible |
| Calculation output spot-check (rate cap calculations) | Random sample review | Monthly | N/A — sample-based | SCRA Reviewer independently recalculates 5% sample | Manually verify calculation methodology and output. Any error found in sample triggers full review of all calculations in the period |

**Drift monitoring philosophy:**
Do not wait for a known model change to check for drift. Output patterns
can shift without a version change — provider infrastructure updates, prompt
caching behavior, and input distribution changes can all affect agent behavior.
The monitoring signals above are sensitive to behavioral change regardless
of whether a version change has been announced.

---

## Domain 4 — Human-in-the-Loop Execution

This domain defines every point where human review is required, what
qualifies as genuine review, and what authority the reviewer holds.

### 4A — Per-run human review requirements

| Agent output | Reviewer role | Review standard | Authority |
|---|---|---|---|
| Gate hold — active duty confirmed | SCRA Reviewer | Review DMDC certificate, confirm active duty start date, confirm all eligible accounts identified in sweep, confirm required actions are complete and accurate | Authorize rate cap application and notify servicemember; or escalate to Compliance Officer if anomaly identified |
| Gate hold — no record | SCRA Reviewer | Review borrower file for indicia of military service; initiate outreach to borrower for documentation | Determine whether to request documentation, escalate to Compliance Officer, or — only after documented investigation — clear the hold |
| Gate hold — API timeout | SCRA Reviewer | Manually query DMDC portal or contact borrower; do not clear hold until status is established | Clear hold only upon confirmed not-active-duty determination with documentation; escalate to Compliance Officer if status cannot be established |
| Gate hold — foreclosure referral blocked | SCRA Reviewer + Compliance Officer | Both must review: confirm active duty status, confirm no court order exists, confirm foreclosure hold is recorded in loan file and servicing system | Compliance Officer authorizes hold; Legal notified if foreclosure was already in process |
| Gate hold — repossession referral blocked | SCRA Reviewer | Confirm active duty status, confirm pre-service payment condition met, confirm hold recorded in loan file | Authorize hold; notify repossession vendor immediately |
| Gate override request | Compliance Officer (minimum) | Review documented basis for override; confirm override does not create SCRA violation | Approve or deny override; document decision with basis; Legal review required for any foreclosure/repossession override |
| Rate cap calculation output | SCRA Reviewer | Review calculation inputs (active duty start date, rate history, fee structure), verify excess interest amount, verify forgiven (not deferred) treatment | Authorize application to account; confirm payment reduction calculated correctly |
| Institution-wide sweep results | SCRA Reviewer | Confirm all accounts identified; confirm in-service accounts correctly excluded; confirm MLA routing for in-service accounts | Authorize rate cap application to all eligible accounts as a single action — not account by account |

### 4B — Event-triggered human review requirements

| Triggering event | Reviewer role | Review standard | Required within |
|---|---|---|---|
| Servicemember provides written notice | SCRA Reviewer | Validate documentation (written notice + orders or CO letter), establish active duty start date, initiate sweep | 1 business day of notice receipt |
| Servicemember verbal mention of military service on any call | SCRA Reviewer | Review call transcript or note; determine whether formal SCRA workflow should be initiated; place informal hold on adverse action pending determination | Same business day |
| DMDC status change detected (active → not active) | SCRA Reviewer | Confirm end-of-service date, calculate mortgage tail period if applicable, initiate return-from-service workflow | 2 business days of status change detection |
| Return-from-service — mortgage account | SCRA Reviewer + Compliance Officer | Confirm tail period calculation, confirm rate restoration date, confirm Reg Z advance notice requirement, confirm credit bureau review | Before tail period expiry date |
| Post-service notice received (within 180-day window) | SCRA Reviewer | Confirm notice is within 180-day window, apply SCRA protections retroactively even if DMDC does not show active duty | 1 business day of notice receipt |
| Novel DMDC response not in defined routing logic | Model Risk + SCRA Reviewer | Assess response type, determine correct routing, add to agent routing logic if recurring | Same business day — do not route automatically |

### 4C — What "genuine" human review requires

The following conditions must be met for a human review to count as a
compliance control — not just a logged action:

1. **Qualified reviewer.** The reviewer must have completed SCRA training
   within the past 12 months and have demonstrated knowledge of the specific
   control being reviewed. A junior operations staff member approving a
   foreclosure hold release is not a compliant review.

2. **Sufficient time.** Review workload must be sized so each review
   receives adequate attention. As a guideline: a rate cap calculation
   review should take no less than 5 minutes per account; a foreclosure
   hold release review should take no less than 15 minutes including file
   review.

3. **Independent judgment.** The reviewer must be able to override the
   agent output. A system that presents the agent's recommendation as the
   default and requires the reviewer to actively override it to disagree
   is not structured for independent judgment — it is structured for
   confirmation bias.

4. **Documented decision.** Every human review must produce a documented
   decision: what was reviewed, what was found, and what was decided. "Reviewed
   and approved" with no further detail is not a documented decision for
   SCRA purposes.

5. **Escalation path.** The reviewer must have a clear escalation path to
   the Compliance Officer for any determination they are not confident making
   independently. The governance framework must not create pressure to resolve
   holds without escalating uncertainty.

---

## Domain 5 — Incident Response

Covers what happens when something goes wrong — detected by the eval suite,
drift monitoring, or an external event.

### 5A — Incident classification

| Severity | Definition | Examples |
|---|---|---|
| **P1 — Active violation** | Agent failure resulted or likely resulted in an SCRA violation affecting a real borrower | Gate failed open; active-duty servicemember proceeded to foreclosure or repossession; rate cap not applied retroactively to start of active duty |
| **P2 — Near miss** | Agent failure detected before a violation occurred; or agent error caught in human review before it affected a borrower | Calculation error caught by SCRA Reviewer; gate hold placed but audit log incomplete; certificate generation failed |
| **P3 — Drift signal** | Output pattern deviation detected without confirmed cause; no violation confirmed | Rate cap trigger rate drops 25% without portfolio explanation; gate override rate doubles over 30 days |
| **P4 — Eval regression** | Model or prompt change fails eval suite before deployment | TC-04 fails on pre-deployment run; overall pass rate falls below 98% threshold |

### 5B — Response actions by severity

**P1 — Active Violation**

| Action | Timing | Owner |
|---|---|---|
| Suspend agent from production immediately | Within 1 hour of detection | Model Risk |
| Revert to last known-good version (model + prompt + code) | Within 2 hours | Model Risk |
| Notify Compliance Officer and Legal | Within 1 hour | Whoever detects the incident |
| Identify all accounts affected during gap period | Within 24 hours | Compliance Officer + SCRA Reviewer |
| Assess remediation required for each affected account | Within 48 hours | Compliance Officer + Legal |
| Assess regulatory self-disclosure obligation | Within 72 hours | Legal + Compliance Officer |
| Conduct root cause analysis | Within 5 business days | Model Risk + Compliance Officer |
| Implement fix and re-run full eval suite before re-deployment | Before re-deployment | Model Risk |
| Document incident fully in governance log | Within 5 business days | Compliance Officer |
| Report to senior management / CRO | Within 24 hours | Compliance Officer |

**P2 — Near Miss**

| Action | Timing | Owner |
|---|---|---|
| Document incident and root cause | Within 1 business day | Model Risk |
| Implement fix | Within 3 business days | Model Risk |
| Re-run full eval suite before re-deployment | Before re-deployment | Model Risk |
| Notify Compliance Officer | Within 1 business day | Model Risk |
| Compliance Officer reviews and signs off on fix | Before re-deployment | Compliance Officer |

**P3 — Drift Signal**

| Action | Timing | Owner |
|---|---|---|
| Investigate cause | Within 48 hours | Model Risk |
| Re-run relevant eval suite subset | Within 48 hours | Model Risk |
| If cause not identified within 48 hours, escalate to P2 | 48-hour mark | Model Risk |
| Document investigation and findings | Within 3 business days | Model Risk |

**P4 — Eval Regression**

| Action | Timing | Owner |
|---|---|---|
| Change not deployed | Immediate | Model Risk |
| Document which cases failed and why | Within 1 business day | Model Risk |
| Identify fix — prompt revision, model version change, or code change | Within 3 business days | Model Risk |
| Re-run full eval suite after fix | Before any re-deployment consideration | Model Risk |

### 5C — Gap period assessment (P1 incidents)

When a P1 incident is confirmed, the bank must determine the scope of harm:

1. **When did the failure begin?**
   Review the audit log to identify the first timestamp where the agent
   behaved incorrectly. If the log has gaps, the gap period must be treated
   as potentially affected — not assumed clean.

2. **Which accounts were processed during the gap period?**
   Pull all accounts the agent acted on between the failure start and
   detection. This is the potentially affected population.

3. **What remediation does each account require?**
   For each affected account, determine: was a protection missed? Was
   excess interest charged? Was an adverse action taken without required
   DMDC clearance? Each account requires individual assessment.

4. **Is regulatory self-disclosure required or advisable?**
   Legal must make this determination. DOJ and CFPB have both indicated
   that self-disclosure of SCRA violations, accompanied by a remediation
   plan, is viewed favorably relative to violations discovered in examination.
   The decision not to self-disclose must be documented with legal basis.

### 5D — Rollback procedure

The rollback procedure must be executable without a full redeployment:

1. The production environment maintains a pointer to the current active
   version (model ID + prompt version + code version)
2. A rollback is a configuration change — update the pointer to the prior
   known-good version
3. Rollback does not restore processed data — accounts acted on during
   the failed version remain in their current state; the gap period
   assessment covers them
4. After rollback, run the eval suite against the restored version to
   confirm it passes before resuming production operation
5. Document the rollback: what version was reverted from, what version
   was restored, who authorized, and at what time

---

## Domain 6 — Regulatory Currency

Covers how the agent's underlying regulatory basis stays current as
SCRA requirements evolve.

| Action | Cadence | Human review required | What review means |
|---|---|---|---|
| Monitor OCC, DOJ, CFPB, and FinCEN for SCRA-related guidance, enforcement actions, and examination findings | Monthly | Compliance Officer reviews monitoring output | Assess whether any new guidance changes the agent's routing logic, eval suite expected outputs, or human-in-the-loop boundaries |
| Monitor NDAA legislation for SCRA amendments (NDAA is enacted annually, frequently amends SCRA) | Annually (December–January) + event-triggered on NDAA passage | Compliance Officer + Legal review NDAA SCRA provisions | Identify any amendments affecting covered persons, protection scope, or compliance mechanics; assess agent logic impact |
| Review Layer 1 (SCRA regulatory requirements document) for accuracy and currency | Quarterly | Compliance Officer + Legal | Confirm Layer 1 reflects current law and guidance; update if required; any Layer 1 change triggers review of downstream layers (process map, control matrix, agent logic, eval suite) |
| Review eval suite expected outputs against current regulatory requirements | Quarterly (concurrent with Layer 1 review) | Compliance Officer | Confirm that "expected outputs" in each eval case reflect what current law actually requires — not what the regulation said when the case was written |
| Brief senior management on material regulatory changes affecting the SCRA agent program | Event-triggered (material change) | CRO / Senior Management | Understand scope of change, resource requirements for remediation, and timeline |

---

## Governance summary — who does what and how often

| Role | Daily | Weekly | Monthly | Quarterly | Per-change | Per-incident |
|---|---|---|---|---|---|---|
| SCRA Reviewer | Review all gate holds within SLA | Review gate override log | Review no-record escalation outcomes; calculation spot-check sample | — | — | P1/P2: gap period assessment |
| Compliance Officer | Alert review (version mismatch, log gap, SLA breach) | Override rate review | Monitoring signal review | Eval suite coverage review; Layer 1 review | Sign off on eval results; sign off on changelog | P1: notify management, disclosure decision; P2: sign off on fix |
| Model Risk / AI Governance | Log completeness check; version pin check | Release note review | Targeted eval run; drift signal review | Scheduled model review | Execute eval suite; execute rollback if needed | P1: suspend agent, root cause; P2/P3: investigate and fix |
| Legal | — | — | — | Layer 1 legal review | — | P1: disclosure assessment, remediation guidance |
| CRO / Senior Management | — | — | — | — | — | P1: notification within 24 hours; material regulatory change briefing |

---

## Domain 7 — DMDC Data Dependency and Operational Resilience

### 7A — Classification: government data source, not a vendor

DMDC (Defense Manpower Data Center) is a U.S. Department of Defense system.
It is the authoritative federal database for active duty military status
verification. The bank's relationship with DMDC is not a vendor relationship
in the third-party risk management sense:

- There is no contract between the bank and DoD governing DMDC access
- The bank has no ability to audit DMDC's operations or data quality processes
- The bank cannot require remediation if DMDC underperforms or returns
  inaccurate data
- The bank is not responsible for DMDC's accuracy — it is responsible for
  how it uses DMDC's output

This distinction matters for governance design. OCC Bulletin 2023-17 defines
third parties as entities the bank has a business arrangement with. DMDC
does not meet that definition. Applying a vendor oversight framework to DMDC
would be both inaccurate and operationally unworkable.

The correct frame is **data dependency governance and operational resilience**
— governing how the bank manages its dependence on a critical external data
source it does not control.

---

### 7B — Known dependency risks

**Risk 1 — Availability (DMDC downtime)**

DMDC experiences both scheduled maintenance windows and unscheduled outages.
During downtime, the agent cannot execute DMDC queries. The fail-closed
requirement (Domain 2, TC-04) addresses individual query timeouts — but a
sustained DMDC outage is a distinct operational scenario requiring a policy
response, not just a timeout handler.

*Nature of risk:* If DMDC is unavailable for an extended period and the bank
has no policy for gated workflows during that period, one of two things
happens — both bad. Either gated workflows (foreclosure referrals, repossession
referrals, collections escalations) are silently blocked indefinitely without
human awareness, creating operational backlogs. Or humans begin bypassing the
gate because "DMDC is down," destroying the gate's value as a compliance
control.

**Risk 2 — Accuracy lag (record propagation delay)**

DMDC records do not always reflect a servicemember's actual military status
in real time. Known lag scenarios include:

- Reserve and National Guard members whose orders have recently been issued
  but not yet propagated to DMDC (can lag by days to weeks)
- Members with recently amended orders (change may not yet be reflected)
- Members separated from active duty whose DMDC record has not yet been updated
- Short-term activations that are administratively delayed in DMDC

*Nature of risk:* The bank queries DMDC, receives a "not active duty" or
"no record" result, and treats it as determinative — but the servicemember
is legally protected by SCRA. This is the failure mode the 180-day
post-service notice window was designed to address, and it is why the
no-record routing must escalate rather than clear.

**Risk 3 — Format and API change (interface instability)**

DoD can modify the DMDC query interface, response format, or API endpoint
without advance notice calibrated to the bank's change management process.
A format change that the agent's certificate parser does not handle will
produce parsing errors, certificate generation failures, or — most
dangerously — silent misclassification of response fields.

*Nature of risk:* Unlike a commercial vendor that would issue release notes
and a migration timeline, DoD operates DMDC for its own purposes. The bank
is an external consumer. Format changes may be announced on DoD channels
the bank does not actively monitor.

**Risk 4 — Query input error (bank-side data quality)**

DMDC queries require correct SSN and name inputs. If the bank's loan records
contain SSN errors, name mismatches (nickname vs. legal name), or data entry
errors from origination, the DMDC query may return a no-record result not
because the servicemember is absent from DMDC but because the query was
incorrect.

*Nature of risk:* This is a bank-side data quality problem, not a DMDC
problem — but its failure mode looks identical to a genuine no-record result.
The agent cannot distinguish between "DMDC has no record for this person"
and "the query input was wrong and DMDC had no match." Both produce a
no-record response.

---

### 7C — Compensating controls by risk

**Risk 1 — Availability: DMDC outage policy**

| Control | Description | Owner |
|---|---|---|
| Outage detection | Agent monitors DMDC response time and error rate per-run; sustained error rate >50% over a 30-minute window triggers an outage alert | Model Risk (automated) |
| Outage notification | Alert sent to SCRA Reviewer and Compliance Officer upon outage detection | Automated alert |
| Gated workflow policy during outage | During a confirmed DMDC outage: all gated workflows (foreclosure referral, repossession referral, collections escalation) remain held. Holds are not manually released without an alternative military status determination method. The bank does not proceed with adverse actions against borrowers whose status cannot be confirmed. | Compliance Officer authorizes any exception |
| Alternative verification during outage | SCRA Reviewer may use the DMDC public web portal (scra.dmdc.osd.mil) for individual manual queries when the API is unavailable. Manual query results must be documented with the same fields as an automated certificate. | SCRA Reviewer |
| Outage duration threshold | If DMDC outage exceeds 5 business days, Compliance Officer and Legal assess whether any regulatory notification obligation applies and whether any operational accommodations are needed | Compliance Officer + Legal |
| Outage log | Every outage is logged with start time, end time, duration, workflows affected, and alternative verification actions taken during the outage | Model Risk |

**Risk 2 — Accuracy lag: compensating controls**

| Control | Description | Owner |
|---|---|---|
| No-record escalation (primary) | Agent routes all no-record results to human review — never auto-clears. This is the primary compensating control for accuracy lag on Reserve/Guard members. | Agent routing logic (enforced in eval TC-03) |
| Written notice controls over DMDC | Institution policy explicitly states that written notice from a servicemember accompanied by qualifying documentation establishes SCRA protection regardless of DMDC result. Agent routing reflects this: a prior DMDC "not active" result does not close the file if subsequent written notice is received. | Layer 1, Section A.3 — operationalized in P3 process |
| 180-day post-service window | Institution policy and agent routing account for the 180-day window during which a servicemember may submit retroactive notice. A DMDC result showing end of service does not extinguish the potential for a valid retroactive notice submission. | SCRA Reviewer awareness; P7 process |
| DMDC query freshness | For any account where adverse action is being considered, the DMDC query must have been executed within the prior 30 days. A DMDC result older than 30 days is considered stale and a fresh query is required before proceeding. | Agent logic; SCRA Reviewer confirms on gate hold review |
| Accuracy lag documentation | When a servicemember's SCRA protection is established through written notice despite a negative DMDC result, the file must document both the DMDC result and the basis for the written-notice determination. | SCRA Reviewer |

**Risk 3 — Format/API change: monitoring controls**

| Control | Description | Owner |
|---|---|---|
| Response format validation | Agent validates DMDC response structure on every query — confirms required fields are present and in expected format before parsing. Unexpected structure triggers an error log and escalation, not a silent misparse. | Agent logic |
| Certificate field completeness check | Every generated certificate is checked for completeness before being logged — all required fields must be present. An incomplete certificate triggers an alert. | Agent logic (enforced in eval TC-06) |
| DoD channel monitoring | Model Risk monitors DoD/DMDC communications channels (dmdc.osd.mil, relevant Federal Register notices) for announced changes to the DMDC interface | Model Risk — monthly review |
| Format change response | If a format change is detected (via validation failure or DoD announcement), agent is suspended from production pending a code update and full eval suite re-run. Treat as a P2 incident minimum. | Model Risk |

**Risk 4 — Query input error: data quality controls**

| Control | Description | Owner |
|---|---|---|
| SSN format validation | Agent validates SSN input format before executing any DMDC query. Malformed SSN triggers an input error — not a DMDC query. | Agent logic |
| No-record → input review | When a no-record result is returned, SCRA Reviewer confirms that the query inputs (SSN, name) match the loan record before treating the result as a genuine no-record. If input error is identified, re-query with corrected inputs. | SCRA Reviewer — part of no-record review workflow |
| Origination data quality | Loan origination process (P1-C4) must populate SSN and legal name as structured, validated fields in the loan record. These fields are the agent's query inputs — their accuracy is a prerequisite for agent reliability. | Origination process owner |
| Name mismatch handling | If a servicemember's name in the loan record differs from their legal name (nickname, name change, hyphenation), SCRA Reviewer attempts query with alternate name formats before treating the result as no-record. | SCRA Reviewer |

---

### 7D — DMDC dependency governance cadence

| Action | Cadence | Owner | Human review |
|---|---|---|---|
| Monitor DMDC API availability and error rate | Per-run (automated) | Model Risk | Alert review on threshold breach |
| Review DMDC outage log | Monthly | Compliance Officer | Confirm outages were handled per policy; assess whether any held workflows require follow-up |
| Confirm DMDC query freshness on all accounts in gated workflows | Per gate hold review | SCRA Reviewer | Part of standard gate hold review checklist |
| Monitor DoD channels for DMDC interface changes | Monthly | Model Risk | Flag any announced changes for assessment |
| Review no-record escalation outcomes | Monthly | SCRA Reviewer | How many no-record cases resolved as genuine not-active vs. input error vs. accuracy lag? Trend informs query quality improvement |
| Test DMDC alternative verification procedure (manual portal) | Quarterly | SCRA Reviewer | Confirm manual query process is documented and staff know how to execute it during an API outage |
| Review DMDC query input quality (SSN/name error rate) | Quarterly | Compliance Officer | Assess whether input errors are a systematic data quality problem requiring upstream remediation |

---

### 7E — What DMDC dependency governance does not require

For completeness — the following actions are appropriate for vendor
relationships but are not applicable to DMDC:

- Vendor due diligence or risk assessment of DoD/DMDC operations
- Contractual SLA requirements or remediation rights
- Audit rights over DMDC data quality or availability processes
- Inclusion of DMDC in the institution's third-party risk inventory as a vendor
- Vendor concentration risk assessment

DMDC should be documented in the institution's operational resilience
framework as a critical data dependency — similar to how a bank would
document its dependency on Federal Reserve payment systems or SWIFT — not
as a third-party vendor.

---

## Domain 8 — AI System Availability and Business Continuity

### 8A — The core question

**What is the compliance program's business continuity plan if the AI
systems don't work?**

This is not a theoretical question. LLM providers experience outages,
rate limits, latency spikes, and silent degradations. A compliance workflow
that depends on AI model availability without a documented continuity plan
is not a compliance workflow — it is a compliance workflow with an
undisclosed single point of failure.

The answer to this question must exist before an agent touches a live
compliance obligation. It must be tested before the agent goes to
production. And it must be documented in a form that a regulator or
auditor can review.

---

### 8B — Failure mode taxonomy

AI system unavailability manifests in four distinct ways, each with
different detection characteristics and operational impacts:

| Failure mode | Detection signal | Impact on agent | Agent behavior |
|---|---|---|---|
| **Complete API outage** | All API calls fail immediately | All AI-generated content unavailable | Fallback mode activates; deterministic logic continues |
| **Partial outage / degraded service** | Some calls succeed; others time out | Inconsistent AI output quality | Fallback activates after timeout threshold; flagged in audit log |
| **Rate limiting** | API returns 429 Too Many Requests | AI calls fail during high-volume periods | Fallback activates for affected calls; logged with rate limit indicator |
| **Silent degradation** | API calls succeed but output quality has decreased | AI reasoning less precise; edge cases potentially missed | Not detectable by the agent — requires drift monitoring (Domain 3) and eval suite (Domain 2) |

The fourth failure mode — silent degradation — is the most dangerous
because it produces no error signal. The agent appears to be working
while the quality of its AI-generated output has degraded. This is why
the eval suite and drift monitoring exist as independent controls rather
than relying on API health signals alone.

---

### 8C — Fallback operating mode

The RMAS agents implement a two-tier operating model:

**Tier 1 — Full operation (AI available):**
- All deterministic logic executes — routing, calculations, gate
  decisions, certificate generation, audit logging
- AI model generates compliance analysis, edge case review, escalation
  notices, and remediation summaries in real time
- AI output labeled with model version for audit traceability

**Tier 2 — Fallback mode (AI unavailable):**
- All deterministic logic continues without interruption
- AI-generated content sections display pre-written compliance guidance
  specific to each scenario
- Fallback content labeled visibly as "FALLBACK MODE" — reviewers know
  they are not receiving AI-generated output
- Audit log records fallback activation with timestamp
- Agent does not retry failed API calls indefinitely — fallback activates
  after a 15-second timeout to prevent workflow delays
- Once fallback activates, it remains active for the session — avoids
  repeated timeout delays on subsequent calls

**What continues to work in fallback mode:**

| Function | Fallback available? | Notes |
|---|---|---|
| DMDC query routing (active/not active/no record/timeout) | ✅ Yes | Fully deterministic — does not use AI |
| Gate hold placement and display | ✅ Yes | Rules-based — does not use AI |
| DMDC certificate generation | ✅ Yes | Structured output — does not use AI |
| Institution-wide account sweep | ✅ Yes | Data query — does not use AI |
| Interest rate cap calculation | ✅ Yes | Statutory formula — does not use AI |
| Tail period calculation | ✅ Yes | Date arithmetic — does not use AI |
| Tolling calculation | ✅ Yes | Date arithmetic — does not use AI |
| Audit log generation | ✅ Yes | System function — does not use AI |
| Eval suite execution | ✅ Yes | Logic-based — does not use AI |
| AI compliance analysis and edge case review | ⚠️ Partial | Pre-written scenario-specific guidance substituted |
| Notice intake trigger recognition | ❌ No | Core LLM task — no deterministic substitute |

**The critical distinction:** Notice intake trigger recognition (Type 4
capability) has no meaningful fallback — recognizing SCRA triggers in
unstructured language is an LLM-native task that cannot be replicated
by rules-based logic without significant false negative risk. During AI
unavailability, notice intake must route to manual human review rather
than agent-assisted screening.

---

### 8D — Manual procedure requirements

Fallback mode provides pre-written compliance guidance. Guidance alone
is not a complete BCP. A production deployment requires documented
manual procedures that staff can execute when the agent is in fallback
mode or fully unavailable.

**Required manual procedures (production):**

| Procedure | Trigger | Owner | Documentation required |
|---|---|---|---|
| Manual DMDC verification | AI unavailable AND DMDC query needed | SCRA Reviewer | Step-by-step portal query procedure; certificate documentation format |
| Manual interest rate cap calculation | AI unavailable AND rate cap application needed | SCRA Reviewer | Calculation worksheet with statutory formula; sign-off checklist |
| Manual notice screening | AI unavailable AND inbound communications need review | SCRA Reviewer | SCRA trigger language guide; escalation decision tree |
| Manual tail period calculation | AI unavailable AND return-from-service triggered | SCRA Reviewer | Date calculation worksheet; mortgage vs. non-mortgage distinction |
| Manual tolling calculation | AI unavailable AND legal action being considered | Legal | Limitations period reference by state; tolling calculation worksheet |

**Documentation standard:** Each manual procedure must be written at a
level of detail that allows a trained SCRA Reviewer to execute it
correctly without referring to the agent. The agent's fallback output
can reference the manual procedure but cannot substitute for it.

---

### 8E — Recovery time and recovery point objectives

| Scenario | Recommended RTO | Recommended RPO | Rationale |
|---|---|---|---|
| Complete AI provider outage | 4 business hours to activate fallback mode | No data loss — fallback preserves all deterministic outputs | Fallback already implemented; RTO covers detection and notification |
| Partial outage / rate limiting | Immediate — fallback auto-activates | No data loss | Agent detects and switches without human intervention |
| Silent degradation detected | 24 hours to suspend AI output; 48 hours to rollback or fix | Audit log review of affected period | Detected via drift monitoring; rollback per Domain 5 |
| Manual procedure activation | 1 business day to confirm manual procedures operational | No data loss — manual procedures produce same outputs as agent | Requires SCRA Reviewer availability and procedure documentation |

**RTO and RPO for the compliance obligation itself:** The SCRA compliance
obligation does not pause during AI system outages. A servicemember who
submits SCRA notice during an AI outage is still entitled to SCRA
protections within the required statutory timeframes. Manual procedures
are not optional — they are the compliance program's backstop when
technology fails.

---

### 8F — Testing requirements

A BCP that has not been tested is a document, not a plan.

| Test | Frequency | Owner | Pass criteria |
|---|---|---|---|
| Fallback mode activation test | Quarterly | Model Risk | Simulate API unavailability; confirm fallback activates within 15 seconds; confirm all deterministic functions continue; confirm fallback content displays correctly |
| Manual DMDC verification drill | Semi-annually | SCRA Reviewer | Execute manual portal query; produce certificate in required format; complete within time standard |
| Manual rate cap calculation drill | Semi-annually | SCRA Reviewer | Complete worksheet from provided inputs; result matches agent output within rounding tolerance |
| Manual notice screening drill | Semi-annually | SCRA Reviewer | Review 10 sample communications; identify all SCRA triggers; compare to reference answers |
| Full manual procedure exercise | Annually | Compliance Officer + SCRA Reviewer | Execute complete SCRA workflow manually from notice receipt to rate cap application, without agent assistance |
| BCP documentation review | Annually | Compliance Officer | Confirm manual procedures reflect current SCRA requirements and any regulatory changes since last review |

**Testing documentation:** Every BCP test must be documented with date,
participants, scenario, results, pass/fail determination, and any gaps
identified. Gap remediation must be tracked to closure before the next
scheduled test.

---

### 8G — Governance cadence

| Action | Cadence | Owner | Human review |
|---|---|---|---|
| Monitor API availability and error rate | Per-run (automated) | Model Risk | Alert on threshold breach |
| Review fallback activation log | Daily (when fallback has activated) | SCRA Reviewer | Confirm no compliance-critical functions were missed during fallback period |
| Review API provider status page and incident history | Weekly | Model Risk | Assess reliability trend; flag to Compliance Officer if pattern of degradation |
| Test fallback mode activation | Quarterly | Model Risk | Confirm fallback activates correctly; all deterministic functions continue |
| Review and update manual procedure documentation | Annually | Compliance Officer | Confirm procedures reflect current requirements |
| Full manual procedure exercise | Annually | Compliance Officer + SCRA Reviewer | Document results; remediate gaps |

---

### 8H — What this domain answers for regulators and auditors

When an examiner or auditor asks "what is your business continuity plan
if the AI systems don't work?", the answer this domain provides is:

**1. The compliance-critical functions don't depend on the AI.** Routing
decisions, gate holds, calculations, certificate generation, and audit
logging are all deterministic and execute regardless of AI availability.

**2. The AI-dependent functions have a defined fallback.** Pre-written
scenario-specific compliance guidance substitutes for AI-generated
analysis, clearly labeled so reviewers know the difference.

**3. Notice intake is the exception — and it routes to humans.** Trigger
recognition in unstructured language requires AI. During outages, notice
intake routes to manual human review — the same process that existed
before the agent was built.

**4. Manual procedures exist and are tested.** Staff can execute every
SCRA compliance function manually, documented at the procedure level,
tested on a defined schedule.

**5. Recovery objectives are defined.** RTO and RPO targets exist for
each failure scenario and are formally adopted before production deployment.

**6. The audit log records everything.** Including when fallback mode was
active, so the record of compliance activity is complete and accurate
regardless of AI system status.

---

## Next steps for this document

- [ ] Assign named individuals to each role (Compliance Officer, SCRA Reviewer,
      Model Risk) before deployment — roles without names are not accountability
- [ ] Define "last known-good version" at the time of initial deployment —
      the rollback target must be identified before it is needed
- [ ] Set formal pass thresholds in a signed governance document — the
      thresholds in Domain 2 above are recommendations; they must be formally
      adopted before the eval suite is run for the first time
- [ ] Design the gate hold review interface — the system through which SCRA
      Reviewers act on agent holds must present sufficient context for genuine
      review, not just an approve/reject button
- [ ] Integrate with the institution's existing model risk management framework
      (SR 11-7 or equivalent) — this document is SCRA-specific; it should
      sit within, not replace, the broader model governance program
- [ ] Establish record retention schedule for audit logs, eval results, and
      governance changelog — consistent with SCRA record retention requirements
      and the institution's general compliance record retention policy
- [ ] Document DMDC as a critical data dependency in the institution's
      operational resilience framework — not in the third-party vendor inventory
- [ ] Establish the DMDC outage duration threshold policy (currently set at
      5 business days in Domain 7 — confirm with Legal and Compliance Officer
      before adoption)
- [ ] Confirm that the DMDC public web portal manual verification procedure
      (scra.dmdc.osd.mil) is accessible to SCRA Reviewers and that access
      does not require separate registration or credentials that may not be
      in place at time of an API outage
- [ ] Draft manual procedure documentation for each function in Domain 8D —
      calculation worksheets, DMDC portal procedure, notice screening guide
- [ ] Formally adopt RTO and RPO targets from Domain 8E in a signed BCP document
      before production deployment
- [ ] Schedule and execute first BCP test (fallback mode activation) before
      production deployment
- [ ] Add Domain 8 BCP gap to the gap register as a production readiness item
