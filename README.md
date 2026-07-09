# RMAS — Risk Management Agent System

**A methodology for connecting regulatory requirements to compliance controls — built with AI, applied as AI agents where the control needs one and as deterministic software where it doesn't — with governance as a first-class concern either way.**

[**→ Try the SCRA DMDC Agent (live)**](https://sadiqshifa.github.io/RMAS/agents/scra-dmdc-agent.html) · [**→ Try the SCRA Calculations Agent (live)**](https://sadiqshifa.github.io/RMAS/agents/scra-calculations-agent.html) · [**→ Try the Regulatory Change Monitor (live)**](https://sadiqshifa.github.io/RMAS/agents/reg-change-monitor.html) · [**→ Try the Pre-Clearance Determination System (live, no AI)**](https://sadiqshifa.github.io/RMAS/tools/pre-clearance-tool.html)

---

## What this is

RMAS is an independent project demonstrating how to take a complex
regulatory obligation, decompose it into specific compliance processes and
controls, and build the right kind of system for each one — governed so it
stays trustworthy over time.

"The right kind of system" is doing real work in that sentence. Some
controls are genuinely language and judgment tasks — interpreting a
regulatory update, triaging a fuzzy sanctions-list match, drafting a
narrative summary — and those are built as **AI agents**. Other controls are
structured, threshold-based, and auditable by design — a dollar limit, a
recipient-type routing rule, an approval gate — and those are built as
ordinary **deterministic software**, with no model anywhere in the decision
path. RMAS builds both, on purpose, and treats correctly identifying which
is which as a risk-management skill in its own right, not a footnote to the
AI work.

A related point worth being explicit about: **every artifact in this repo —
AI-powered or not — was engineered using an LLM as the build tool.** That's
true of the agents (unsurprising) and just as true of the fully
deterministic rules engines under [`tools/`](tools) (less obvious, and the
more interesting claim). Using an AI coding assistant to produce working
software isn't itself the differentiator here — plenty of software gets
built that way now. What the deterministic tools demonstrate is that the
same engineering process, pointed at a problem that shouldn't use AI at
*runtime* at all, produces a system that doesn't. The skill on display is
knowing the difference and building accordingly, not defaulting to AI
because it's the tool in hand.

The domain is financial services compliance, but the four-layer methodology
— regulatory requirements → process map → control matrix → governance — and
the Track A/Track B judgment it enables are not. The same approach applies
anywhere regulatory or operational complexity creates risk: healthcare,
insurance, energy, legal, government contracting, or any industry with
compliance obligations that exceed what manual processes can reliably
handle.

This is not a demo that stops at the automation. Three questions are
treated as first-class parts of every build: **how do you know an agent is
still working correctly after the model changes? What is the business
continuity plan if the AI doesn't work? And — before either of those —
should this control have used AI at all?**

---

## The live agents

Five working AI-powered compliance agents, running in a browser with no installation required.

### Agent 1 — SCRA DMDC Integration (Type 1 + Type 4)

[**→ Open agent**](https://sadiqshifa.github.io/RMAS/agents/scra-dmdc-agent.html)

**DMDC Agent Run** — executes a military status verification workflow across four scenarios. When run inside Claude.ai, or with your own Anthropic API key entered in the agent, a live Claude model generates the compliance analysis, gate hold explanation, and required actions in real time. Without a key — the default for any visitor opening the page directly — the agent runs in fallback mode: the same deterministic routing, gates, and audit logging execute normally, with pre-written compliance guidance in place of live AI analysis, clearly labeled as such.

- **Active duty:** Gate holds, institution-wide account sweep across four accounts, AI generates required actions with statutory basis
- **Not active:** Gate cleared, AI generates safe harbor scope note with residual obligation language  
- **No record:** Escalated — not cleared — AI explains Reserve/Guard accuracy lag and required reviewer actions
- **API timeout:** Gate fails closed — AI explains why timeout ≠ clearance and what reviewer must do

**Notice Intake (AI-powered)** — paste any customer communication and the AI identifies SCRA triggers, including indirect language a rules engine would miss. Six pre-loaded scenarios:

- A customer mentioning deployment on a collections call
- A formal SCRA invocation letter  
- A spouse calling about a billing issue, mentioning "he's been stationed overseas"
- A post-service retroactive request within the 180-day window
- A power of attorney submission
- A non-SCRA communication (correctly identified as no trigger)

**Eval Suite** — six test cases with defined pass/fail criteria, runnable in one click. Includes zero-tolerance cases (API timeout must fail closed; no-record must escalate, never clear) reflecting the strict liability exposure in the underlying regulation.

**Fallback mode:** If no API key is provided (or the AI model is otherwise unavailable), all deterministic functions continue — routing decisions, gate holds, certificate generation, and audit logging. Pre-written compliance guidance substitutes for AI-generated analysis, clearly labeled as fallback. The agent does not silently fail. Enter your own Anthropic API key in the agent to see the live AI analysis this design is built to produce — the key is used only in your browser session and is never stored or logged.

---

### Agent 2 — SCRA Deterministic Calculations (Type 3)

[**→ Open agent**](https://sadiqshifa.github.io/RMAS/agents/scra-calculations-agent.html)

Four calculation tabs, each implementing controls identified in Layer 3 and derived from statutory requirements in Layer 1. Every calculation shows its methodology — inputs, formula, statutory basis, output — so it is fully auditable.

**Interest Rate Cap** — calculates excess interest per account, per period, across all eligible pre-service accounts. Implements controls P2-C2 and P3 from Layer 3. Derived from 50 U.S.C. §3937.

- Account-by-account excess interest calculation retroactive to active duty start date
- Forgiven vs. deferred treatment enforced in the output
- Payment reduction calculated and displayed
- AI edge case review at completion

**Tail Period** — calculates the one-year mortgage post-service tail period and flags whether rate restoration or foreclosure actions are blocked. Implements control P7-C2. Derived from 50 U.S.C. §3937(d)(2).

- Tail period expiry date and days remaining
- Rate restoration gate — blocked or cleared
- Foreclosure timing conflict detection with strict liability flag

**Tolling Calculator** — calculates adjusted statute of limitations expiry with military service periods excluded. Implements control P9-C2. Derived from 50 U.S.C. §3936.

- Ten states pre-loaded with correct limitations periods
- Standard expiry vs. adjusted expiry comparison
- Critical flag when tolling changes the outcome — action appears time-barred without tolling but is viable with it applied

**Full Account Summary** — runs all three calculations simultaneously and produces a complete servicemember remediation package with total amounts owed, tail period status, and required actions checklist.

**Fallback mode:** All calculations are deterministic JavaScript — they execute completely regardless of AI availability. Only the AI edge case review sections use the model; these display pre-written compliance guidance by default and require your own Anthropic API key (entered in the agent) to run live, same as Agent 1.

---

### Agent 3 — Regulatory Change Monitor (cross-domain, Layer 3/second-line)

[**→ Open agent**](https://sadiqshifa.github.io/RMAS/agents/reg-change-monitor.html)

Unlike Agents 1 and 2, this agent isn't domain-specific — it's a second-line-of-defense GRC function that watches for regulatory change across all three domains in this project: **AML/KYC/Sanctions**, **Fair Lending (Reg B/HMDA)**, and **SCRA**. Pick any combination of domains and run a live check; the agent searches the correct primary source per domain (FinCEN/OFAC for AML, CFPB for Fair Lending, DOJ/Federal Register/Congress.gov for SCRA — DMDC is deliberately excluded as a source here, since it's a data source, not a rule-change source), then classifies each item found: relevant / not relevant / ambiguous, plus materiality and primary-vs-secondary sourcing.

**Demo Mode vs. Production Architecture** — a toggle switches between the working live-search demo and a Production Architecture view showing real, verified integration code (a live-tested Federal Register API poller, an OFAC SDN list differ, a scheduler config, and a persistence schema) that a production deployment would run on a schedule. That code is present but intentionally inactive here, since static GitHub Pages hosting can't run scheduled server-side jobs or persist state between runs — the notice explains exactly why, rather than leaving "live" ambiguous.

**Eval suite — 18 pre-labeled cases** (14 real, dated regulatory items verified via search; 4 clearly-marked constructed edge cases), evenly split across the three domains, each with a human-set correct classification and materiality. This is the concrete Layer 4 regression gate: before adopting any model or prompt change, re-run the suite and compare against the last known pass rate.

**Fallback mode / BYOK:** By default — including for any visitor on this GitHub Pages site — the agent runs in fallback mode: no live API calls, no cost, nothing required, with direct links to primary sources if a check can't complete. Enter your own Anthropic API key in the agent to trigger genuine live search-and-classify runs and to actually score the eval suite instead of seeing "pending."

---

### Agent 4 — Fair Lending: HMDA Reportability Calculator (Type 3)

[**→ Open agent**](https://sadiqshifa.github.io/RMAS/agents/hmda-calculator.html)

Four calculation tabs implementing Regulation C (HMDA) reportability logic — same deterministic-calculation pattern as Agent 2, applied to a different domain. Determines whether a given loan transaction is HMDA-reportable, walks through the five coverage tests (asset-size, location, loan-activity, federally-related, loan-volume thresholds), and applies the current inflation-adjusted asset-size exemption threshold. Every calculation shows inputs, formula, and statutory basis, consistent with the audit-first design used throughout this project.

### Agent 5 — Fair Lending: Adverse Action Notice Validator (Type 1 + Type 4)

[**→ Open agent**](https://sadiqshifa.github.io/RMAS/agents/adverse-action-validator.html)

Validates a drafted adverse action notice against Regulation B's requirements — timing (30/90-day windows depending on application status), required content (action taken, creditor identity, ECOA notice provision, regulator identity), and, where AI is available, flags notices that read as boilerplate or omit a specific reason for denial. Deterministic fallback mode covers the structural/timing checks regardless of AI availability; the language-quality check is the part that genuinely needs a model, and is clearly labeled as such when running without an API key.

**Eval suites for both Fair Lending agents (MRM-004, MRM-005)** are specified — 14 and 16 cases respectively, split between deterministic checks and rubric-based AI-output review — but not yet executed. That status is stated as such rather than rounded up; see [Fair Lending eval suite spec](docs/eval-suites-fair-lending-agents.md).

---

## The workflow tools — engineered with AI, running without it

Not every control in this project is a good fit for an AI agent. Where a
control is genuinely a fixed threshold-and-routing problem, RMAS builds it
as ordinary deterministic software instead — using an AI coding assistant to
build it, but with no model anywhere in the tool's actual decision path.
Layer 2 (the control matrix) is where that call gets made per control; this
section documents what's been built as a result.

### Tool 1 — Pre-Clearance Determination System (Anti-Bribery/Corruption & Conflicts of Interest)

[**→ Open tool**](https://sadiqshifa.github.io/RMAS/tools/pre-clearance-tool.html)

A gifts, entertainment, and hospitality pre-clearance workflow covering the
Bank Bribery Act (18 U.S.C. § 215), the FCPA, FINRA Rule 3220 / MSRB Rule
G-20 gift limits, Regulation O insider rules, and federal-employee
gift-acceptance limits (5 C.F.R. § 2635.204). Every determination is
produced by fixed if/then logic — no model call, no inference, nothing
non-deterministic.

- **Two-line review.** A requestor's manager is a first-line approval gate;
  only approved requests reach an independent, deterministic second-line
  rules engine. A manager's rejection is terminal and never reaches
  Compliance/Legal.
- **Recipient-category-aware.** The form asks for different information
  depending on who the recipient is — country and agency for a foreign
  official, government level and branch for a U.S. official, employer and
  relationship type for a FINRA-scoped contact — because a single generic
  form can't actually support a defensible determination across all of
  these.
- **Knows what it doesn't know.** Where the deterministic rule set doesn't
  actually cover a case — e.g. a state or local government official, who
  isn't subject to the federal executive-branch gift rule this engine
  encodes — it escalates for manual review rather than silently applying
  the wrong threshold.
- **Version-pinned like an AI agent would be.** Every determination is
  tagged with a rules-engine version number and logged to an audit trail
  alongside the manager's and Compliance's decisions. A change to any
  threshold is a new version, re-validated before adoption — the same
  governance discipline Layer 4 requires of AI agents, applied to code that
  has none.

[→ Layer 1 (Anti-Bribery/COI)](docs/layer1-anti-bribery-coi.md) · [→ Layer 2 (Control Matrix)](docs/layer2-anti-bribery-coi.md)

---

## The methodology

Four layers, each a prerequisite for the next. The agents are only as good as the control identification they're built from, which is only as good as the process map, which is only as good as the regulatory requirements it's derived from.

### Layer 1 — Regulatory Requirements

Enumerates specific obligations from the source statute and exam guidance — not summaries, but testable requirements. For SCRA: twelve obligation clusters covering interest rate caps, foreclosure protections, repossession protections, default judgments, stay of proceedings, tolling, lease termination, and vendor responsibility — each with statutory citation, trigger conditions, timing rules, documentation requirements, enforcement authority, and penalties.

This layer is where most compliance technology projects start too late. Starting here means agent behavior is grounded in what the regulation actually requires, not what someone remembers it requiring.

[→ SCRA Layer 1](docs/layer1-scra.md)

### Layer 2 — Process Map

Maps each regulatory requirement to the compliance processes where it lives operationally. Nine processes for SCRA: loan origination, ongoing servicing, notice intake, collections, foreclosure, repossession, return from service, lease termination, and civil litigation. Each process has step-by-step workflows, data inputs, and a precise statement of what control is needed at each step.

This is the layer most often skipped. Skipping it means building controls that are disconnected from how the work actually happens.

[→ SCRA Layer 2](docs/layer2-scra-process-map.md)

### Layer 3 — Control Matrix

Maps each process step to a specific, testable control. For each control: what it does, how it's currently executed, what the failure mode looks like in practice, and where an agent can genuinely help.

Agent opportunity is rated on a four-tier scale — High, Medium, Low-Medium, and Low. The Low-Medium tier exists because some controls were initially rated Medium but are more honestly characterized as constrained by data availability or human accountability dependencies. Rounding up would have been misleading. The 22 High-rated controls are the agent build targets.

[→ SCRA Layer 3](docs/layer3-scra-control-matrix.md)

### Layer 4 — Agent Characterization and Governance

Organizes the 22 High-rated controls into four capability types (DMDC integration, mandatory gate enforcement, deterministic calculations, language recognition) and specifies the governance required for each — version pinning, eval suite design, human-in-the-loop boundaries, audit logging, drift monitoring, and incident response.

The human-in-the-loop map is precise: specific agent actions are classified as autonomous or human-confirmed, with the rationale for each. The distinction between "agent executes" and "human confirms" is enforced at the system level, not left to policy.

[→ SCRA Layer 4](docs/layer4-scra-governance.md)

---

## Governance and risk management

A dedicated governance framework covers eight operational domains:

1. **Model and prompt versioning** — version pinning, controlled upgrades, changelog
2. **Eval suite execution** — pass thresholds, zero-tolerance cases, regression gates
3. **Production drift monitoring** — specific signals, alert thresholds, cadence
4. **Human-in-the-loop execution** — what genuine review actually requires (not rubber-stamping)
5. **Incident response** — P1/P2/P3/P4 classification, gap period assessment, rollback
6. **Regulatory currency** — keeping Layer 1 current as SCRA evolves through the NDAA cycle
7. **DMDC data dependency** — classifying DMDC correctly as a government data source, not a vendor; four dependency risks with compensating controls
8. **AI system availability and business continuity** — what happens when the AI doesn't work; two-tier operating model; manual procedure requirements; RTO/RPO targets; BCP testing schedule

Domain 8 directly answers the question any serious reviewer will ask: *what is your business continuity plan if the AI systems don't work?* The answer: compliance-critical functions are deterministic and don't depend on the AI; AI-dependent functions have defined fallbacks clearly labeled as such; notice intake routes to manual human review; manual procedures exist and are tested; recovery objectives are formally adopted; the audit log records everything including fallback activation.

[→ Governance Framework](docs/scra-agent-governance-risk.md)

This framework was built SCRA-first, but its core disciplines — version
pinning, eval gates, audit logging — are domain-agnostic and already extend
beyond SCRA: the [Model Risk Register](governance/model-risk-register.html)
under [`governance/`](governance) inventories every AI component across all
domains as a model under an SR 11-7-inspired framework, and the rules-engine
versioning built into the Pre-Clearance Determination System (see above)
applies the same discipline to a Track B tool that has no model to version
at all.

---

## Honesty about what this is

Every document in this project carries a **Demonstration Scope Notice** specifying exactly what gaps exist between the showcase and a production deployment. A gap register consolidates all gaps across layers — 19 P1 blocking gaps, 15 P2 required gaps — categorized by type, priority, and sequenced into a phased production readiness roadmap.

This matters for two reasons. First, it's accurate — the agents use a mocked DMDC API, are stateless, and handle one trigger context at a time. Second, being specific about the gaps is itself a demonstration of judgment. It shows the difference between understanding a methodology and understanding what it would take to operationalize one.

[→ Gap Register](docs/scra-demo-to-production-gap-register.md)

---

## Project structure

```
RMAS/
├── agents/                              # Track A — AI agents
│   ├── scra-dmdc-agent.html             # DMDC + Notice Intake agent (Type 1 + 4)
│   ├── scra-calculations-agent.html     # SCRA deterministic calculations agent (Type 3)
│   ├── reg-change-monitor.html          # Cross-domain reg-change agent (AML/KYC, Fair Lending, SCRA)
│   ├── hmda-calculator.html             # Fair Lending — HMDA reportability agent (Type 3)
│   └── adverse-action-validator.html    # Fair Lending — adverse action notice validator (Type 1 + 4)
│
├── tools/                               # Track B — deterministic workflow tools, no AI at runtime
│   └── pre-clearance-tool.html          # Gifts/entertainment/anti-bribery pre-clearance rules engine
│
├── governance/                          # Layer 4 artifacts (cross-domain, not agent- or tool-specific)
│   └── model-risk-register.html         # SR 11-7-inspired inventory of every AI component as a model
│
├── docs/                                # Flat — every layer doc for every domain lives here directly
│   ├── layer1-scra.md                   # SCRA regulatory requirements (12 obligation clusters)
│   ├── layer2-scra-process-map.md       # SCRA — nine compliance processes, step-by-step
│   ├── layer3-scra-control-matrix.md    # SCRA — 47 controls, four-tier agent-opportunity ratings
│   ├── layer4-scra-governance.md        # SCRA — agent characterization + governance architecture
│   ├── scra-agent-governance-risk.md    # SCRA — operational governance framework (8 domains)
│   ├── scra-demo-to-production-gap-register.md  # SCRA — demo → production gap register
│   ├── layer1-aml-kyc.md                # AML/KYC/Sanctions — regulatory map
│   ├── layer2-aml-kyc.md                # AML/KYC/Sanctions — control matrix
│   ├── layer1-fair-lending.md           # Fair Lending (Reg B/HMDA) — regulatory map
│   ├── layer2-fair-lending.md           # Fair Lending (Reg B/HMDA) — control matrix
│   ├── eval-suites-fair-lending-agents.md  # Fair Lending — MRM-004/MRM-005 eval suite specs
│   ├── layer1-anti-bribery-coi.md       # Anti-Bribery/Corruption & COI — regulatory map
│   ├── layer2-anti-bribery-coi.md       # Anti-Bribery/Corruption & COI — control matrix
│   └── model-risk-management-framework.md  # Cross-domain model risk management framework
│
└── README.md
```

Note the layer-numbering convention differs slightly by domain: SCRA's docs
use a four-file Layer 1–4 split (requirements, process map, control matrix,
governance) because it was the template domain and got the deepest build.
AML/KYC, Fair Lending, and Anti-Bribery/COI currently use a two-file Layer
1–2 split (regulatory map, control matrix) — Layer 3 for those domains is
the actual agent/tool sitting in `agents/` or `tools/`, and Layer 4 governance
is currently covered by the cross-domain documents rather than a dedicated
per-domain file. Bringing all domains to the same documentation depth as
SCRA is an open item, not a design decision to leave as-is indefinitely.

---

## What this demonstrates

**Regulatory decomposition.** Taking a complex statute (SCRA: 50 U.S.C. §§ 3901–4043, verified against OCC Comptroller's Handbook v1.1) and producing enumerable, testable requirements — not summaries.

**Process mapping.** Connecting regulatory obligations to the operational processes where compliance actually happens, at the level of specificity required to design controls.

**Honest control assessment.** Identifying where automation genuinely helps vs. where data availability or human accountability dependencies constrain agent opportunity — and rating them differently rather than rounding up.

**Working agent execution.** Five live AI-powered agents across three domains: Type 1 (DMDC integration) and Type 4 (language recognition) in the SCRA DMDC agent; Type 3 (deterministic calculations) in the SCRA Calculations agent and the HMDA Reportability Calculator; Type 1 + 4 in the Adverse Action Notice Validator; and a cross-domain classification agent in the Regulatory Change Monitor — with real compliance logic, AI analysis available live via your own API key (fallback mode by default), and working or specified eval suites.

**Working non-AI execution.** One deterministic workflow tool — the Pre-Clearance Determination System — built the same way (AI-assisted engineering) but running with zero AI at runtime, demonstrating that the engineering process on display here isn't specific to building AI systems.

**Production governance thinking.** Eval suite design, version pinning, human-in-the-loop boundaries, drift monitoring, incident response, data dependency governance, and business continuity — specified at operational precision, not policy-document level.

**Business continuity design.** A two-tier operating model where compliance-critical functions run deterministically regardless of AI availability, with defined fallback behavior, manual procedure requirements, RTO/RPO targets, and a testing schedule.

**Intellectual honesty.** A gap register that says clearly what this is and what it isn't, and a phased roadmap for what production deployment would require.

---

## Transferability

SCRA was chosen as the template domain because its requirements are discrete and its process touchpoints are bounded — it's a good domain to build the methodology in. The same four-layer approach, and the same Track A/Track B judgment about which controls need AI, applies to:

- AML/KYC/Sanctions — Layer 1 and Layer 2 committed; covered by the cross-domain [Regulatory Change Monitor](https://sadiqshifa.github.io/RMAS/agents/reg-change-monitor.html) agent (Track A)
- Fair Lending / HMDA (Reg B / Reg C) — Layer 1 and Layer 2 committed; two dedicated Track A agents (HMDA Reportability Calculator, Adverse Action Notice Validator), eval suites specified but not yet executed
- Anti-Bribery/Corruption & Conflicts of Interest — Layer 1 and Layer 2 committed; first Track B artifact in the project (Pre-Clearance Determination System) — the domain where the "not everything should be an agent" argument is made concretely, since most of its controls are deterministic threshold checks rather than language tasks
- Healthcare privacy (HIPAA, 42 CFR Part 2)
- Insurance regulatory compliance
- Energy market compliance (FERC, NERC)
- Government contracting (FAR, DFARS)
- Any domain where regulatory complexity creates operational risk that exceeds what manual processes reliably handle

The methodology transfers, including the judgment about when *not* to reach for AI. The domain knowledge is specific to the domain.

---

## Status

| Component | Status |
|---|---|
| SCRA Layer 1 — Regulatory Requirements | ✅ v0.1 complete |
| SCRA Layer 2 — Process Map (9 processes) | ✅ v0.1 complete |
| SCRA Layer 3 — Control Matrix (47 controls, 4-tier ratings) | ✅ v0.2 complete |
| SCRA Layer 4 — Agent Characterization (4 capability types) | ✅ v0 complete |
| SCRA Governance Framework (8 domains incl. BCP) | ✅ v0.2 complete |
| SCRA Gap Register (19 P1 gaps, phased roadmap) | ✅ v0.1 complete |
| SCRA Agent — Type 1 (DMDC Integration) | ✅ Working demo · fallback mode |
| SCRA Agent — Type 4 (Notice Recognition) | ✅ Working demo · fallback mode |
| SCRA Agent — Type 3 (Deterministic Calculations) | ✅ Working demo · fallback mode |
| SCRA Agent — Type 2 (Gate Enforcement) | 🚧 Characterized, not yet built |
| Regulatory Change Monitor — cross-domain (AML/KYC + Fair Lending + SCRA) | ✅ Working demo · fallback mode |
| Regulatory Change Monitor — Production Architecture view (Fed Register API, OFAC SDN diff, scheduler, persistence) | ✅ Code present, intentionally inactive on static hosting |
| Regulatory Change Monitor — Eval suite (18 cases, 14 real / 4 constructed) | ✅ v0.1 complete |
| AML/KYC/Sanctions — Layer 1 & Layer 2 | ✅ Committed |
| Fair Lending / HMDA — Layer 1 & Layer 2 | ✅ Committed |
| Fair Lending Agent — HMDA Reportability Calculator (Type 3) | ✅ Working demo · fallback mode |
| Fair Lending Agent — Adverse Action Notice Validator (Type 1 + 4) | ✅ Working demo · fallback mode |
| Fair Lending Eval Suites (MRM-004: 14 cases, MRM-005: 16 cases) | 🚧 Designed — not yet executed |
| Anti-Bribery/Corruption & COI — Layer 1 & Layer 2 | ✅ Committed |
| Anti-Bribery/COI Tool — Pre-Clearance Determination System (Track B, no AI at runtime) | ✅ Working demo · rules-engine v1.1.0 |
| Model Risk Register (cross-domain, SR 11-7-inspired) | ✅ v0 complete |
| All AI agents — BYOK live AI (bring-your-own Anthropic API key) | ✅ Implemented; fallback-by-default outside Claude.ai's runtime |
| Vendor / Third-Party Risk Management | 🚧 Planned, not started |

---

## About

Built independently by Sadiq as a hands-on exploration of applied AI governance in regulated industries. Not affiliated with any employer or client.

The goal was to go deep enough on a real compliance domain to demonstrate working judgment — not to produce a polished demo that stops at the automation.

---

*Regulatory content verified against OCC Comptroller's Handbook v1.1 (November 2025) and 50 U.S.C. statutory text. DMDC API is mocked in the demonstration agents. See the gap register for full production readiness assessment.*
