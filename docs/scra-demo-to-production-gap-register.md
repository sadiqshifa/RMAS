# RMAS SCRA — Demonstration to Production Gap Register

This document consolidates every identified gap between the RMAS SCRA
showcase methodology and a production deployment. It answers the question
any sophisticated reviewer will ask: "This is compelling — but what would
it actually take to deploy this?"

Gaps are organized by category, not by document. Each gap identifies: what
is present in the showcase, what is missing for production, the effort
category, and which showcase document(s) the gap originates from.

> This document does not diminish the showcase. It demonstrates that the
> methodology is honest about its own limits — which is itself a
> demonstration of the governance rigor the project claims.

> Status: v0.1, updated 2026-07-03. Added Category 7 (Business Continuity gaps) reflecting Domain 8 addition to governance framework. Updated gap summary counts and production readiness roadmap.

---

## How to read this register

**Effort categories:**
- **Data / Systems** — requires resolving a data availability or systems
  integration problem; cannot be solved by documentation or process alone
- **Institutional** — requires institution-specific decisions, assignments,
  or existing program infrastructure; methodology provides the framework,
  institution provides the specifics
- **Legal / Regulatory** — requires legal review, regulatory verification,
  or formal adoption of a policy position
- **Build** — requires additional agent, code, or interface development
- **Validation** — requires testing, review, or confirmation against
  real-world practice rather than regulatory guidance

**Priority:**
- **P1 — Blocking** — must be resolved before production deployment;
  agent cannot function correctly or safely without it
- **P2 — Required** — must be resolved for production compliance program
  integrity; does not block agent function but creates compliance or
  governance gap
- **P3 — Important** — materially strengthens the program; should be
  resolved before scale or expansion
- **P4 — Enhancement** — improves coverage or precision; appropriate
  for a mature program

---

## Category 1 — Regulatory Coverage Gaps

Gaps in the regulatory requirements layer that affect the accuracy or
completeness of the compliance framework.

| Gap ID | What the showcase has | What production requires | Effort | Priority | Source |
|---|---|---|---|---|---|
| RCG-01 | SCRA requirements verified against OCC Handbook v1.1 (Nov 2025) and statutory text as of that date | Targeted review of 2025 and 2026 NDAA cycles to confirm no amendments since November 2025 affect covered persons, protection scope, or compliance mechanics | Legal / Regulatory | P1 — Blocking | Layer 1 |
| RCG-02 | Federal SCRA requirements documented in full | State law overlay for institution's operating geography — several states (CA, NY, others) have enhanced servicemember protections beyond the federal floor | Legal / Regulatory | P2 — Required | Layers 1, 2, 3 |
| RCG-03 | SCRA/MLA boundary identified and routing distinction documented | Full MLA Layer 1 document at equivalent detail to the SCRA Layer 1; MLA is a separate compliance regime requiring its own process map and control matrix | Build | P2 — Required | Layer 1 |
| RCG-04 | Federal SCRA requirements only | International angle assessment for institutions with cross-border operations — FATF recommendations, allied-nation equivalent protections | Legal / Regulatory | P4 — Enhancement | Layer 1 |

---

## Category 2 — Process Map Gaps

Gaps in the process documentation that affect how controls are implemented
and tested in practice.

| Gap ID | What the showcase has | What production requires | Effort | Priority | Source |
|---|---|---|---|---|---|
| PMG-01 | Nine process maps derived from regulatory guidance and exam findings | Validation of each process map against the institution's actual SOPs and servicing platform workflows — steps, decision points, and data inputs will differ by institution and platform | Validation | P1 — Blocking | Layer 2 |
| PMG-02 | Process steps reference loan servicing systems, collections platforms, and foreclosure management systems generically | System inventory and integration assessment confirming each data input named in process tables is available in the institution's specific environment | Data / Systems | P1 — Blocking | Layer 2 |
| PMG-03 | P9 (Civil Litigation) process map assumes legal function has access to SCRA compliance data | Confirmed integration between legal case management and loan-level SCRA status records — in many institutions these are separate systems with no direct data sharing | Data / Systems | P2 — Required | Layer 2 |
| PMG-04 | Federal process flows only | State law process steps added to each affected process for the institution's operating geography | Legal / Regulatory | P2 — Required | Layer 2 |
| PMG-05 | Process flows cover the nine named processes | Periodic review cadence for each process map — regulatory changes, exam findings, and operational experience will require process map updates over time | Institutional | P3 — Important | Layer 2 |

---

## Category 3 — Control Matrix Gaps

Gaps in the control identification and assessment layer.

| Gap ID | What the showcase has | What production requires | Effort | Priority | Source |
|---|---|---|---|---|---|
| CMG-01 | "Current execution" column derived from industry exam findings and regulatory patterns | Institution-specific control inventory confirming which controls exist, how they are actually executed, and where gaps are in this institution's environment | Validation | P1 — Blocking | Layer 3 |
| CMG-02 | Agent opportunity ratings assume data availability for High-rated controls | Data availability audit confirming P1-C4 (origination-date military status and loan type as queryable servicing system fields) is resolved before High-rated controls are treated as actionable | Data / Systems | P1 — Blocking | Layers 3, 4 |
| CMG-03 | Control identification without cadence specification | Frequency and volume specification for each control — how often event-triggered controls fire, expected agent action volume per period; required for resource planning and drift monitoring baseline | Build | P2 — Required | Layer 3 |
| CMG-04 | Federal SCRA controls only | State law controls added for institution's operating geography | Legal / Regulatory | P2 — Required | Layer 3 |
| CMG-05 | Vendor controls identify the requirement | Production vendor controls require contract language, audit procedures, documentation standards, and periodic review cadence — particularly for foreclosure counsel, repossession vendors, and collection agencies | Institutional | P2 — Required | Layer 3 |
| CMG-06 | Control matrix is a point-in-time document | Ongoing maintenance process — regulatory changes, new exam findings, and operational experience require periodic control matrix updates with version control | Institutional | P3 — Important | Layer 3 |

---

## Category 4 — Agent Build Gaps

Gaps between the demonstration agent and a production-ready agent.

| Gap ID | What the showcase has | What production requires | Effort | Priority | Source |
|---|---|---|---|---|---|
| ABG-01 | Type 1 (DMDC Integration) demonstration agent | All four capability types built and integrated: Type 2 (Mandatory Gate Enforcement), Type 3 (Deterministic Calculations), Type 4 (Language Recognition and Document Generation) | Build | P1 — Blocking | Layer 4 |
| ABG-02 | Stateless demonstration agent — each run independent | Persistent state management — agent must remember prior DMDC results per account, detect when a prior "not active" result is superseded by subsequent written notice, and maintain a running account-level SCRA status | Build | P1 — Blocking | Agent |
| ABG-03 | Single trigger context per run (user selects one) | Multi-context concurrent operation — production agent handles batch scan, notice intake, delinquency flag, foreclosure gate, and origination triggers simultaneously with different timing and routing logic per context | Build | P1 — Blocking | Agent |
| ABG-04 | Mock DMDC API (simulated responses) | Real DMDC API integration — requires DoD DMDC access registration, credential management, API format implementation, and real response parsing | Build | P1 — Blocking | Agent |
| ABG-05 | Six eval suite test cases | Full eval suite per Layer 4 specification — additional cases for Reserve/Guard accuracy lag, written-notice-controls-over-DMDC, 180-day post-service window, institution-wide sweep edge cases, and multi-account scenarios | Build | P1 — Blocking | Layer 4, Agent |
| ABG-06 | Demonstration agent not integrated with any loan servicing system | Integration with the institution's loan servicing platform, collections system, foreclosure management platform, and legal case management system — the agent's inputs and outputs must flow through these systems, not a standalone interface | Data / Systems | P1 — Blocking | Agent |
| ABG-07 | Agent architecture not prescribed | Architecture decisions required: single agent vs. multiple agents, orchestration framework, hosting environment, model provider and version pinning mechanism, logging infrastructure | Build | P1 — Blocking | Layer 4 |
| ABG-08 | Demonstration runs in browser / standalone HTML | Production deployment infrastructure — API hosting, authentication, access controls, availability requirements, disaster recovery | Build | P2 — Required | Agent |

---

## Category 5 — Governance and Operations Gaps

Gaps between the governance framework as documented and an operational
governance program.

| Gap ID | What the showcase has | What production requires | Effort | Priority | Source |
|---|---|---|---|---|---|
| GOG-01 | Accountable roles defined (Compliance Officer, SCRA Reviewer, Model Risk, Legal, CRO) | Named individuals or teams assigned to each role before deployment — roles without names are not accountability | Institutional | P1 — Blocking | Governance doc |
| GOG-02 | Pass thresholds defined as methodology recommendations | Formally adopted pass thresholds in a signed governance document, reviewed and approved by Compliance Officer and relevant stakeholders before the first eval run | Institutional | P1 — Blocking | Governance doc, Layer 4 |
| GOG-03 | Human-in-the-loop requirements specified | Gate hold review interface designed and built — presenting DMDC certificate, account history, prior SCRA flags, and required actions in a format that supports genuine review, not just approve/reject | Build | P1 — Blocking | Governance doc |
| GOG-04 | Governance framework covers Type 1 agent only | Governance domain extensions for Types 2, 3, and 4 as they are built — eval suite, human-in-the-loop map, and drift monitoring signals differ materially by capability type | Build | P2 — Required | Governance doc |
| GOG-05 | SCRA-specific governance framework | Integration with the institution's SR 11-7 model risk management framework — model validation function involvement in pre-deployment eval review, model inventory registration, ongoing model monitoring integration | Institutional | P2 — Required | Layers 4, Governance doc |
| GOG-06 | Record retention identified as a requirement | Specific retention schedule defined and implemented for audit logs, eval results, governance changelog, and DMDC certificates — consistent with SCRA record retention requirements and institution's compliance record retention policy | Institutional | P2 — Required | Governance doc |
| GOG-07 | Rollback procedure defined conceptually | Rollback procedure tested and confirmed executable — the ability to revert to a prior known-good version must be confirmed to work before it is needed in a P1 incident | Build | P2 — Required | Governance doc |
| GOG-08 | DMDC outage policy defined | DMDC outage policy formally adopted and communicated to SCRA Reviewers — including the manual portal verification procedure tested and confirmed accessible | Institutional | P2 — Required | Governance doc, Domain 7 |
| GOG-09 | Drift monitoring signals defined | Drift monitoring infrastructure built — automated counters, alert thresholds, and notification routing for each signal defined in Domain 3 | Build | P2 — Required | Governance doc |
| GOG-10 | Governance framework is a document | Ongoing governance program operation — the framework requires periodic execution (daily log checks, weekly override reviews, monthly monitoring reviews, quarterly eval runs) by real people with real capacity | Institutional | P2 — Required | Governance doc |

---

## Category 6 — Broader Program Gaps (Institutional Assumptions)

Items scoped out of this showcase that a production deployment assumes
exist in surrounding institutional infrastructure.

| Gap ID | What the showcase assumes exists | Why it is out of scope here | Priority |
|---|---|---|---|
| BPG-01 | SCRA compliance program governance — written policies, training program, independent testing, management reporting, exam readiness | Institutional infrastructure assumed to exist; showcase demonstrates agent methodology within this program, not the program itself | Institutional assumption |
| BPG-02 | Loan origination process that captures and records military status, origination date, and loan type as queryable fields (P1-C4) | Prerequisite data architecture; showcase assumes it exists or identifies it as a blocking gap (CMG-02) | P1 — Blocking if absent |
| BPG-03 | Staff training on SCRA requirements and on the agent's role in the compliance program | Institutional responsibility; showcased governance framework specifies reviewer qualifications but does not build the training program | Institutional assumption |
| BPG-04 | Independent testing of SCRA controls | Required by OCC examination standards; not within RMAS scope | Institutional assumption |
| BPG-05 | Broader vendor / third-party risk management program governing foreclosure counsel, repossession vendors, and collection agencies | RMAS identifies SCRA-specific vendor requirements (Layer 1, Section J; Layer 3 vendor controls) but assumes this is integrated into an existing TPRM program | Institutional assumption |

---

## Category 7 — Business Continuity Gaps

Gaps between the demonstration-level fallback implementation and a
production-grade business continuity plan for AI system unavailability.

| Gap ID | What the showcase has | What production requires | Effort | Priority | Source |
|---|---|---|---|---|---|
| BCG-01 | Fallback mode implemented in agent code — pre-written compliance guidance substitutes for AI output when API is unavailable | Formally documented manual procedures for each fallback function (DMDC verification, rate cap calculation, notice screening, tail period, tolling) — written at procedure level, not guidance level | Institutional | P1 — Blocking | Governance doc, Domain 8 |
| BCG-02 | Fallback activates automatically with 15-second timeout | Formally adopted RTO and RPO targets in a signed BCP document — including RTO for manual procedure activation and RPO for compliance obligation continuity | Institutional | P1 — Blocking | Governance doc, Domain 8E |
| BCG-03 | Fallback mode has never been tested | BCP testing schedule executed before production deployment — fallback activation test, manual procedure drills, full manual exercise per Domain 8F | Institutional | P1 — Blocking | Governance doc, Domain 8F |
| BCG-04 | Notice intake has no fallback (correctly documented) | Formal policy documenting that notice intake routes to manual human review during AI unavailability; staff trained on manual notice screening procedure | Institutional | P1 — Blocking | Governance doc, Domain 8C |
| BCG-05 | Fallback content is pre-written scenario-specific guidance | Manual procedure documentation referenced by fallback content — so reviewers can execute the procedure, not just read guidance | Build | P2 — Required | Governance doc, Domain 8D |
| BCG-06 | Fallback audit log records activation | Integration of fallback activation events into the institution's operational risk event log — so AI outages are tracked as operational risk events, not just system logs | Institutional | P2 — Required | Governance doc, Domain 8G |
| BCG-07 | Silent degradation not detectable by fallback mechanism | Silent degradation addressed only through drift monitoring (Domain 3) and eval suite (Domain 2) — confirm both are operational before relying on AI output for compliance decisions | Build | P2 — Required | Governance doc, Domain 8B |

---

## Gap summary by priority

| Priority | Count | Blocking nature |
|---|---|---|
| P1 — Blocking | 19 | Must be resolved before any production deployment |
| P2 — Required | 15 | Must be resolved for program integrity; does not block initial deployment in a controlled environment |
| P3 — Important | 3 | Strengthens program; appropriate for pre-scale resolution |
| P4 — Enhancement | 2 | Appropriate for mature program |
| Institutional assumptions | 5 | Out of scope; assumed to exist |

**The honest production readiness picture:**

Of the 19 P1 gaps, eight are in Category 4 (agent build gaps), four are
in Category 7 (business continuity), and the remaining seven are in
regulatory coverage, process validation, control matrix, and governance.
The BCP gaps are P1 because SCRA compliance obligations do not pause
during AI outages — the institution must be able to meet its statutory
obligations manually if the agent is unavailable.

A production deployment could proceed in phases:
- **Phase 0 (prerequisite):** Resolve CMG-02 (data availability audit)
  and CMG-01 (institution-specific control inventory) — these gate everything
- **Phase 1 (foundation):** Resolve RCG-01 (NDAA verification), PMG-01
  (SOP validation), GOG-01/02/03 (named roles, formal thresholds, review
  interface), ABG-04/06 (real DMDC integration, servicing system integration),
  BCG-01/02/03/04 (manual procedures, BCP document, BCP testing, notice policy)
- **Phase 2 (full Type 1 production):** Resolve ABG-02/03/05 (state
  management, multi-context operation, full eval suite), GOG-09 (drift
  monitoring infrastructure), BCG-05/06/07 (procedure documentation,
  operational risk integration, silent degradation monitoring)
- **Phase 3 (expand capability types):** ABG-01 (Types 2, 3, 4 built),
  GOG-04 (governance extensions for new types)
- **Phase 4 (program maturity):** State law overlay (RCG-02, PMG-04,
  CMG-04), MLA integration (RCG-03), SR 11-7 integration (GOG-05)

---

## Next steps for this document

- [ ] Assign gap ownership — each gap should have a named owner responsible
      for resolution before production deployment
- [ ] Estimate effort for each gap — rough order of magnitude (days / weeks /
      months) for resource planning
- [ ] Sequence P1 gaps into a production readiness roadmap with target dates
- [ ] Update this register as gaps are resolved — it is a living document,
      not a one-time assessment
