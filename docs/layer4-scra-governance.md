# Layer 4 — Agent Characterization and Governance: SCRA

This layer does two things. First, it characterizes the agents needed to
execute the High-rated controls identified in Layer 3 — organized by
capability type, not by process, because agents are built around capabilities,
not org-chart boundaries. Second, it specifies the governance structures
required to keep those agents trustworthy as the models underneath them
change.

> **The central governance question:** When the model powering an agent
> changes — a version upgrade, a silent behavior shift, a provider-side
> update — how do you know the agent is still doing its job correctly?
> For a compliance workflow, "still working correctly" isn't a subjective
> judgment. It has a testable answer. This document specifies what that
> answer looks like for SCRA.

> Status: v0, drafted 2026-06-22. Built from the 22 High-rated controls
> in Layer 3 and the process map in Layer 2. Architecture not yet prescribed —
> this layer characterizes what agents need to do and how they need to be
> governed, not how they are built.

> **⚠ Demonstration Scope Notice**
>
> This document is part of the Risk Management LLM Toolkit showcase methodology. The following gaps
> exist between this demonstration and production use:
>
> **1. Architecture is intentionally not prescribed.**
> This document characterizes what each agent capability type must do and
> how it must be governed — not how it is built. A production deployment
> requires architecture decisions not made here: whether capability types
> are implemented as one agent or several, which orchestration framework
> is used, how agent components integrate with the institution's loan
> servicing and case management systems, and which API provider and
> infrastructure host the model. These decisions are institution-specific
> and depend on the existing technology environment.
>
> **2. Only Type 1 (DMDC Integration) has been built.**
> This document characterizes four capability types. Only Type 1 has a
> working demonstration agent. Types 2 (Mandatory Gate Enforcement), 3
> (Deterministic Calculations), and 4 (Language Recognition) are
> characterized but not built. A production SCRA agent program requires
> all four capability types to cover the 22 High-rated controls.
>
> **3. Eval suite is partially implemented.**
> The Layer 4 eval suite design specifies more test cases than the six
> currently implemented in the demonstration agent — particularly for
> Reserve/Guard accuracy lag scenarios, written-notice-controls-over-DMDC
> cases, and the 180-day post-service window. A production eval suite
> requires the full case set to be built and validated before deployment.
>
> **4. Pass thresholds are recommendations, not adopted policy.**
> The pass thresholds defined in this document (100% for zero-tolerance
> cases, 98%+ overall) are methodology recommendations. A production
> deployment requires these thresholds to be formally adopted in a signed
> governance document by the Compliance Officer and relevant stakeholders
> before the eval suite is run for the first time.
>
> **5. SR 11-7 integration not addressed.**
> This document defines SCRA-specific agent governance. It does not address
> how the agent governance program integrates with the institution's broader
> model risk management framework under SR 11-7 (or equivalent). A
> production deployment requires that integration to be explicitly designed
> and documented.
>
> The capability characterization and governance architecture in this document
> are complete for showcase purposes. These gaps represent the work required
> to move from methodology to production implementation.

---

## A. The core problem, stated precisely for SCRA

An agent built on an LLM is not a deterministic program. Two failure modes
matter most for compliance use cases generally:

1. **Capability drift** — the model gets *better* at something in a way
   that changes its output format or reasoning style, breaking downstream
   parsing or changing what counts as a flag.
2. **Silent regression** — the model gets *worse* or *different* at the
   specific narrow task the agent depends on, even while improving on
   general benchmarks. Nothing in a vendor's release notes will say "this
   update may cause your SCRA trigger-recognition agent to miss verbal
   notice on collections calls."

For SCRA specifically, these failure modes are not symmetric in their
consequences. A false negative on a mandatory gate — the agent fails to
block a foreclosure referral on an active-duty servicemember — creates
strict liability exposure, criminal penalty risk, and DOJ enforcement
attention. A false positive — the agent incorrectly holds a non-protected
account — creates operational friction but no regulatory violation. Governance
design has to account for this asymmetry: the cost of missing a protection
is categorically higher than the cost of over-applying one.

**A third failure mode specific to SCRA:**

3. **Input integrity failure** — the agent reasons correctly from bad inputs.
   If the DMDC query returns a stale or incorrect result, or if the loan
   record is missing the origination-date military status flag (P1-C4), the
   agent's output is wrong regardless of how well the model performs. This
   is not a model governance problem — it is a data dependency problem —
   but it has to be governed alongside model governance because the failure
   mode looks identical from the outside.

---

## B. Capability type framework

The 22 High-rated controls in Layer 3 do not each require a separate agent.
They cluster around four distinct capability types. Understanding the
clustering is what makes agent design tractable — and what makes governance
requirements precise.

### Capability Type 1 — DMDC API Integration and Scheduled Execution

**What it does:** Executes DMDC queries (event-triggered and batch-scheduled),
parses structured results, routes based on active/not-active determination,
and logs certificates.

**Controls served:**
P1-C2, P2-C1, P2-C4, P2-C5, P3-C4, P4-C2, P5-C4, P6-C3, P7-C1, P9-C1, P9-C5

**Task characteristics:** Deterministic inputs (SSN), structured outputs
(active duty status, start/end dates), no LLM judgment required for the
query execution itself. The LLM layer, if present, handles parsing ambiguous
DMDC responses and routing edge cases. The core query-execute-log loop is
not an LLM task.

**Governance sensitivity:** Medium-High. The query itself is deterministic
but the DMDC API has its own data quality issues (records lag real-world
status by days to weeks for some reserve components). The agent must be
designed to flag DMDC uncertainty, not just pass through a binary result.
An agent that treats a DMDC "not found" as equivalent to "not active duty"
is a governance failure, not just a design choice.

**Human-in-the-loop boundary:** Agent executes query and routes result
autonomously. Human review required only on: (a) DMDC error or no-record
response, (b) conflict between DMDC result and servicemember-submitted
documentation, (c) any result that would release a foreclosure or repossession
hold. Hold releases are never autonomous — they require human confirmation
even when the DMDC result clearly supports release.

---

### Capability Type 2 — Mandatory Gate Enforcement

**What it does:** Sits at defined workflow decision points and blocks
downstream action until required conditions are satisfied — DMDC query
complete, certificate logged, active duty status confirmed negative.

**Controls served:**
P4-C3, P5-C1, P5-C2, P6-C1, P9-C1

**Task characteristics:** Entirely rules-based once the DMDC result is
available. The gate is binary: conditions met → proceed; conditions not
met → hold. No LLM reasoning required at the gate itself. The value is
not intelligence — it is enforcement. A policy that says "check DMDC before
foreclosure referral" fails when humans skip it under pressure. An agent
gate that blocks the referral workflow until the check is complete does not.

**Governance sensitivity:** High. This is the highest-consequence capability
type in the SCRA program. A gate that fails open — allows the workflow to
proceed without completing the required check — is a strict liability
violation in the foreclosure and repossession contexts. Gate failures must
be detectable, logged, and treated as P1 incidents regardless of whether
a violation actually occurred. The gate's audit log is the primary defense
artifact if a violation is later alleged.

**Human-in-the-loop boundary:** The gate is the human-in-the-loop mechanism
for the downstream decision. The agent does not decide whether to foreclose
or repossess — it ensures the human making that decision has completed the
required check first. The gate itself operates autonomously. Override of
the gate by a human requires an explicit logged exception with documented
basis — it cannot be a silent bypass.

**Critical design requirement:** Gate failures must fail closed, not open.
If the DMDC API is unavailable, if the query times out, or if the certificate
cannot be written to the audit log, the gate must hold the workflow — not
allow it to proceed on the assumption that the check would have cleared.
An agent that fails open under technical error conditions is worse than no
agent at all, because it creates a false record of compliance.

---

### Capability Type 3 — Deterministic Date and Financial Calculations

**What it does:** Performs rule-based calculations from structured inputs —
retroactive interest cap calculations, tail period expiry dates, limitations
period calculations with tolling, payment reduction amounts.

**Controls served:**
P2-C2, P5-C5, P7-C2, P9-C2, P9-C5 (calculation component)

**Task characteristics:** Fully deterministic given correct inputs. The
calculation logic is statutory — not heuristic, not probabilistic. There
is one correct answer for any given set of inputs, and it is verifiable by
a human reviewer independently. This is the capability type least dependent
on LLM quality — the math does not change when the model changes.

**Governance sensitivity:** Low-Medium for the calculation logic itself;
High for input integrity. The calculation is only as good as its inputs.
Active duty start date, loan origination date, applicable state limitations
period, pre-service interest rate, and fee structure must all be correct
for the calculation to be correct. Input validation — confirming that the
data feeding the calculation is complete and internally consistent — is a
required upstream step, not an optional one.

**Human-in-the-loop boundary:** Agent performs calculation and produces
documented output. Human review of the calculation output is appropriate
before it is applied (rate cap) or relied upon (limitations period). The
human is reviewing the output, not re-performing the calculation — the
agent's value is in doing the arithmetic correctly and documenting the
methodology, not in replacing human sign-off on consequential decisions.

**Specific SCRA requirements:**
- Interest cap calculation must show: active duty start date, excess
  interest per period, total forgiven amount, new payment amount, and
  retroactive effective date
- Tail period calculation must show: end-of-service date, tail period
  expiry date (end-of-service + 365 days), and product type (mortgage
  only — other products have no tail)
- Tolling calculation must show: charge-off/default date, state limitations
  period, active duty periods excluded, adjusted expiry date, and data
  sources for each input

---

### Capability Type 4 — Unstructured Language Recognition and Document Generation

**What it does:** Recognizes SCRA-relevant language in unstructured inputs
(call transcripts, secure messages, written notices), classifies triggers,
and generates structured outputs (affidavit content, confirmation letters,
audit summaries, remediation lists).

**Controls served:**
P3-C1 (trigger recognition), P5-C6, P9-C6 (audit record assembly),
P9-C2 (calculation documentation)

**Task characteristics:** This is the only capability type where LLM
reasoning is doing genuine work that could not be replicated by rules-based
logic. Recognizing that "I just got my orders and I'm shipping out next
week" in a collections call transcript is an SCRA trigger requires language
understanding, not pattern matching. Document generation from structured
inputs is lower-stakes — the content is largely templated once the data
is known — but quality and completeness matter for exam defensibility.

**Governance sensitivity:** High for trigger recognition; Medium for
document generation. Trigger recognition is where silent regression is most
dangerous: a model update that makes the agent slightly less sensitive to
deployment language in call transcripts will not announce itself. It will
show up as a drop in the rate of SCRA triggers identified from unstructured
sources — which looks like compliance, but is actually a detection gap.
Drift monitoring of trigger recognition rates over time is a required
production control, not a nice-to-have.

**Human-in-the-loop boundary:** Trigger recognition output → human review
before any SCRA hold or rate cap action is taken on the basis of an
unstructured trigger alone. The agent flags; the human confirms and initiates
the formal SCRA workflow. Document generation output → human review before
any externally-sent document (confirmation letter, affidavit routing). Audit
record assembly → no human review required for the assembly itself; content
is drawn from structured prior outputs.

---

## C. Governance pillars — applied to SCRA

The six pillars below apply across all four capability types. Where the
application differs materially by capability type, that is noted explicitly.

### Pillar 1 — Model version pinning and controlled upgrades

Pin each agent to a specific model version where the platform allows it.
Treat any model upgrade — including "minor" versions — as a change event
requiring re-validation before adoption.

**SCRA-specific requirement:** The changelog must record model version,
prompt version, and code version for each agent component, linked to the
time period it was in production. If a SCRA violation is later alleged for
a specific date, the bank must be able to identify precisely which model,
prompt, and code version was operating on that date. This is an audit
defensibility requirement, not just a debugging convenience.

**Capability type notes:**
- Types 1 and 2 (DMDC integration, gate enforcement): model version changes
  are lower risk because these components are primarily rules-based. The
  risk is in parsing DMDC response edge cases — re-validate edge case
  handling specifically.
- Type 3 (calculations): model changes are lowest risk. Calculation logic
  should be implemented in deterministic code, not LLM prompting, wherever
  possible. If LLM is used for calculation, the output must be independently
  verifiable.
- Type 4 (language recognition): model version changes are highest risk.
  Trigger recognition sensitivity can shift with model updates in ways that
  are not reflected in general benchmarks. Full eval suite re-run required
  before any model change is adopted in production.

### Pillar 2 — Evaluation suite and regression gate

Maintain a fixed set of test cases with known correct answers. Before
adopting any model, prompt, or code change, re-run the full eval suite and
compare against the prior baseline. Define a pass threshold and an explicit
sign-off process.

**This is the single most important governance artifact.** It is the
concrete answer to "how do you know it still works."

**SCRA eval suite design — by capability type:**

*Type 1 — DMDC Integration:*
- DMDC active duty result → correct routing to rate cap workflow (true positive)
- DMDC not active duty result → correct clearance with certificate logged (true negative)
- DMDC no-record result → correct escalation to human review (edge case)
- DMDC API timeout → gate holds, not clears (failure mode)
- Servicemember-submitted documentation conflicts with DMDC result → correct
  escalation (the written notice controls)
- Reserve component member whose DMDC record lags actual orders → correct
  handling of documentation-over-DMDC rule

*Type 2 — Mandatory Gate:*
- Gate holds workflow when DMDC query not yet complete (primary function)
- Gate holds workflow when DMDC returns active duty (primary function)
- Gate holds workflow when certificate not yet logged (primary function)
- Gate fails closed on API error, not open (critical failure mode)
- Gate override attempt without logged exception → override blocked or
  exception required (process integrity)
- Active duty result on foreclosure workflow → hold placed, servicing team
  notified, referral blocked (end-to-end)

*Type 3 — Calculations:*
- Standard interest cap calculation: known inputs → verify correct excess
  interest amount, payment reduction, forgiven (not deferred) amount
- Retroactive calculation spanning multiple rate periods: verify correct
  per-period calculation
- Mortgage tail period: end-of-service date → correct tail expiry date,
  non-mortgage account correctly excluded from tail
- Tolling calculation: known active duty periods → correct adjusted
  limitations expiry date
- Input missing (origination date not in record) → calculation blocked,
  missing input flagged, not estimated

*Type 4 — Language Recognition:*
- Explicit SCRA invocation in writing → correctly flagged (easy true positive)
- Verbal deployment mention on collections call transcript → correctly
  flagged (core use case)
- Ambiguous language ("I'm going away for a while") → correctly escalated
  rather than dismissed (edge case)
- Non-military language that superficially resembles deployment → correctly
  not flagged (false positive control)
- Notice submitted by power-of-attorney holder → correctly flagged as valid
  SCRA trigger
- Post-service notice (within 180-day window) → correctly flagged as valid
  retroactive trigger, not dismissed because service has ended
- Document generation: affidavit content from DMDC active duty result →
  verify required statutory language present and accurate
- Document generation: rate cap confirmation letter → verify all required
  elements present (accounts covered, effective date, new payment amount)

**Pass threshold:** Define before building, not after seeing results. A
reasonable starting threshold for Type 4 (language recognition) is 95%
on true positives (SCRA triggers correctly identified) and 90% on true
negatives (non-triggers correctly not flagged). The asymmetry is intentional
— given the strict liability risk, missing a real trigger is worse than
a false positive that a human review step will catch. For Types 1, 2, and 3,
the threshold should be higher (98%+) because the tasks are more deterministic
and failure modes are more severe.

### Pillar 3 — Human-in-the-loop checkpoints

Define explicitly, per capability type and per control, which decisions the
agent makes autonomously and which require human confirmation before action.
The boundary is stated in Layer 4, not left to implementation discretion.

**SCRA human-in-the-loop map:**

| Agent action | Autonomous or human-confirmed? | Basis |
|---|---|---|
| Execute DMDC query | Autonomous | Ministerial — no judgment involved |
| Log DMDC certificate | Autonomous | Ministerial |
| Route active duty result to rate cap workflow | Autonomous | Rules-based trigger |
| Block foreclosure/repossession referral (gate hold) | Autonomous | Gate enforcement — this is the point |
| Release foreclosure hold | **Human-confirmed** | Strict liability — autonomous release is never acceptable |
| Release repossession hold | **Human-confirmed** | Same basis as foreclosure |
| Apply rate cap calculation output | **Human-confirmed** | Consequential financial action |
| Send rate cap refund/credit | **Human-confirmed** | Consequential financial action |
| Flag verbal SCRA trigger from transcript | Autonomous | Flagging only — no action taken |
| Initiate SCRA workflow on verbal trigger | **Human-confirmed** | Human confirms trigger before workflow starts |
| Generate affidavit content | Autonomous | Content generation only |
| File or route affidavit | **Human-confirmed** | Legal filing — never autonomous |
| Assemble audit record | Autonomous | Ministerial assembly from prior outputs |
| Release gate override | **Human-confirmed + logged exception** | Override must be auditable |

**The bright line:** The agent executes checks, calculations, holds, and
document generation autonomously. The agent never autonomously releases a
protection, applies a financial change to an account, or takes a legal
action. These boundaries are enforced at the system level — not by policy
alone — wherever possible.

### Pillar 4 — Audit logging

Every agent action must be logged with: input, output, model version, prompt
version, code version, timestamp, and — where a human-in-the-loop step
exists — the identity of the human who confirmed the action and when.

**SCRA-specific audit log requirements:**

The audit log for SCRA agents is not just a debugging tool. It is a
compliance record. In a SCRA enforcement action or litigation, the bank
must be able to produce:
- The DMDC query executed (inputs, timestamp, certificate)
- The routing decision made on the result (and which agent version made it)
- Any gate hold placed and the basis for it
- Any gate release and the human who authorized it
- Any calculation performed and its methodology
- Any document generated and its inputs
- The complete chain from DMDC query to final disposition for every
  account that touched a High-rated control

**Minimum log fields per agent action:**

| Field | Required for |
|---|---|
| Account/case identifier | All actions |
| Action type | All actions |
| Input data (sanitized) | All actions |
| Output (full) | All actions |
| Model version | All LLM-involved actions |
| Prompt version | All LLM-involved actions |
| Code version | All actions |
| Timestamp (UTC) | All actions |
| DMDC certificate (if applicable) | All DMDC queries |
| Human confirmation (ID + timestamp) | All human-in-the-loop actions |
| Exception basis (if gate overridden) | All gate overrides |

### Pillar 5 — Drift monitoring in production

Beyond the eval suite (run before changes), track ongoing output patterns
in production. A change in output patterns without a known model or prompt
change is a signal requiring investigation.

**SCRA-specific drift signals to monitor:**

| Signal | What it might indicate |
|---|---|
| Drop in SCRA triggers identified from transcripts (Type 4) | Silent regression in language recognition — most dangerous signal |
| Increase in DMDC "no record" responses without corresponding increase in reserve/Guard activity | DMDC query quality issue — wrong SSN format, API version change |
| Gate holds not followed by human review within defined SLA | Process breakdown downstream of agent — humans not acting on holds |
| Rate cap calculation outputs deviating from manual spot-check | Input integrity issue or calculation logic regression |
| Audit log gaps — actions without corresponding log entries | Logging failure — compliance record is incomplete |
| Gate override rate increasing | Human bypass behavior — process discipline issue, not agent issue |

**Monitoring cadence:**
- Trigger recognition rate: weekly review
- DMDC query error/no-record rate: per-batch review
- Gate hold → human review SLA: daily
- Audit log completeness: daily automated check
- Calculation spot-checks: monthly (random sample)
- Gate override rate: monthly review with compliance officer

### Pillar 6 — Incident response

Define what happens when a failure is detected — via eval suite, drift
monitoring, or external event (exam finding, servicemember complaint,
litigation).

**SCRA incident classification:**

| Severity | Definition | Response |
|---|---|---|
| P1 — Active violation | Agent failed in a way that resulted or likely resulted in an SCRA violation (e.g., gate failed open, active duty servicemember proceeded to foreclosure) | Immediate: agent suspended from production; last-known-good version restored; compliance officer and legal notified; gap period assessed for remediation |
| P2 — Near miss | Agent failure detected before a violation occurred (e.g., gate held but audit log incomplete; calculation error caught in human review) | Same-day: root cause identified; fix validated against eval suite before re-deployment; incident documented |
| P3 — Drift signal | Output pattern change detected without known cause; no violation confirmed | 48 hours: investigation initiated; eval suite re-run; if cause not identified within 48 hours, escalate to P2 |
| P4 — Eval regression | Model/prompt change fails eval suite before deployment | Change not deployed; root cause identified; fix re-evaluated before reconsideration |

**Gap period assessment (P1 incidents):**
When a P1 incident is identified, the bank must determine:
1. When did the failure begin? (audit log review)
2. Which accounts were affected during the gap period?
3. What remediation is required for each affected account?
4. Is regulatory self-disclosure required or advisable?

This assessment is a legal and compliance function, not an agent function.
The agent's audit log is the primary input — which is why audit log
completeness is a first-order governance requirement, not an afterthought.

**Rollback plan:**
- Each production deployment maintains a pointer to the prior known-good
  version (model + prompt + code)
- Rollback is executable without a new deployment process — it is a
  configuration change, not a build
- Rollback does not restore processed data — accounts that were acted on
  during the failed version remain, and the gap period assessment covers them

---

## D. Data dependency governance

This section addresses the third failure mode identified in Section A:
input integrity failure. The agent reasons correctly from bad inputs.

The High-rated controls in Layer 3 have the following upstream data
dependencies that must exist for the agent to function correctly:

| Data element | Where it must exist | Required by controls | Risk if absent |
|---|---|---|---|
| Military status at origination (DMDC result + date) | Loan servicing system (from P1-C2/P1-C4) | P2-C1, P4-C2, P5-C1, P9-C1, P9-C2 | Agent queries DMDC but cannot establish pre/in-service boundary; rate cap may be applied to in-service obligations (MLA scope) or missed for pre-service ones |
| Origination date | Loan servicing system | P9-C2 (tolling), P5-C5 (tail) | Tolling calculation cannot be performed; tail period cannot be calculated |
| Loan type (mortgage vs. non-mortgage) | Loan servicing system | P5-C5, P7-C2 | Tail period applied to non-mortgage products (error) or missed for mortgage (violation) |
| Active duty period start/end dates | Loan record (from DMDC certificates) | P9-C2 (tolling), P7-C2 (tail), P2-C2 (cap calculation) | Date calculations are wrong regardless of calculation logic |
| Prior SCRA flag | Loan servicing system | P4-C1, P5-C3, P9-C1 | Agent proceeds without awareness of prior military status; indicia check skipped |
| DMDC certificate (prior queries) | Audit log / loan record | P5-C3 (indicia review), P9-C1 (prior flag check) | Agent cannot detect gap between prior DMDC result and current query |

**Governance requirement:** Before any SCRA agent is deployed in production,
the data dependency audit must confirm that each required field is:
1. Populated for the account population the agent will process
2. Structured in a way the agent can query (not a PDF attachment, not
   a free-text note field)
3. Updated by an upstream process that the agent can trust

If any required field is absent or unqueryable for a material portion of
the portfolio, the agent should not be deployed for that portfolio segment
until the data gap is resolved. Deploying an agent against an incomplete
dataset and treating the output as a compliance control is worse than not
deploying — it creates a false record of compliance.

**P1-C4 is the prerequisite, not a parallel workstream.** The systems
integration work required to populate origination-date military status and
loan type as queryable fields in the servicing system is not a Layer 4
concern — it is a pre-deployment requirement. Layer 4 governance cannot
compensate for missing data.

---

## E. Capability-type build sequence

The four capability types are not equally ready to build. The sequence below
reflects both dependency order and risk profile.

**Phase 1 — Type 1: DMDC API Integration and Scheduled Execution**

Build first. Every other capability type depends on DMDC query results.
The integration itself is the foundation — without it, gate enforcement
has nothing to enforce, calculations have no date inputs, and the trigger
recognition workflow has no status verification step.

Eval suite for Type 1 should be built and validated before any other agent
work begins. The DMDC edge cases (no-record, API timeout, reserve component
lag) must be confirmed handled correctly before they become assumptions
in downstream capability types.

**Phase 2 — Type 3: Deterministic Calculations**

Build second, once Type 1 is stable. The calculation inputs (active duty
start date, end date) come from Type 1. Calculation logic should be
implemented in deterministic code — not LLM prompting — wherever the
statutory formula is unambiguous. LLM is appropriate for: explaining the
calculation methodology in human-readable form, flagging input inconsistencies,
and handling edge cases (e.g., multiple short active duty periods within
a single account history).

**Phase 3 — Type 2: Mandatory Gate Enforcement**

Build third, after Types 1 and 3 are stable. Gate enforcement requires
the DMDC query (Type 1) to be running reliably, and the gate output needs
to trigger calculation workflows (Type 3) when active duty is confirmed.
The gate itself is simple; the integration between gate output and downstream
workflows is where complexity lives.

**Phase 4 — Type 4: Language Recognition and Document Generation**

Build last. This is the only capability type where LLM reasoning is doing
genuine work, and it carries the highest model-change governance burden.
Building it after the more deterministic capabilities are stable means the
eval suite design is informed by real production edge cases, not hypothetical
ones.

---

## F. How governance pillars map to SCRA capability types

| Pillar | Type 1 (DMDC) | Type 2 (Gate) | Type 3 (Calc) | Type 4 (Language) |
|---|---|---|---|---|
| Version pinning | Required; low change-risk | Required; low change-risk | Required; lowest change-risk; prefer deterministic code | Required; highest change-risk |
| Eval suite | DMDC edge cases; API failure modes | Gate open/closed behavior; override blocking | Calculation accuracy; input validation; edge cases | Trigger recognition; false positive/negative rates; doc generation completeness |
| Human-in-the-loop | Hold releases only | Gate override only | Calculation output review before application | Trigger confirmation before workflow; doc review before external send |
| Audit logging | DMDC certificate + routing decision | Gate hold/release + override log | Calculation inputs + methodology + output | Trigger flag + human confirmation; doc inputs + output |
| Drift monitoring | DMDC error rate; query quality | Gate override rate; hold→review SLA | Calculation spot-checks | Trigger recognition rate — most critical |
| Incident response | P1 if gate-relevant query fails | P1 if gate fails open | P2 if calculation error caught; P1 if applied uncaught | P1 if trigger recognition drops; P2 if doc error |

---

## Next steps for this document

- [ ] Build Type 1 eval suite (DMDC edge cases) — this is the immediate
      next build artifact, before any agent code is written
- [ ] Confirm P1-C4 data dependency status: are origination-date military
      status and loan type queryable as structured fields in the target
      servicing system? If not, resolve before deployment planning
- [ ] Define "model version" concretely for the target API/platform —
      this differs by provider and affects version pinning design
- [ ] Draft incident response runbook (P1 and P2 incidents) as a standalone
      operational document once agent v0 design is confirmed
- [ ] Define pass thresholds for each eval suite explicitly, with sign-off
      authority named (compliance officer? legal? both?)
- [ ] Determine whether Type 3 calculations are implemented in deterministic
      code or LLM prompting — if the latter, eval suite and drift monitoring
      requirements increase significantly
- [ ] Revisit AML/KYC layers using SCRA framework as template — Layer 2
      process map is the most significant structural addition relative to
      the existing AML/KYC documents
