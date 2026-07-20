# Sadiq Shifa | Building with LLMs

I use LLMs to build working tools, not just talk about what they could
theoretically do. This repo's featured project, the **Risk Management LLM
Toolkit**, takes real regulatory obligations and builds the right system
for each control — an AI agent where judgment is genuinely needed,
deterministic software where it isn't — governed either way.

[**→ Try the SCRA DMDC Agent**](https://sadiqshifa.github.io/RMAS/agents/scra-dmdc-agent.html) · [**→ SCRA Calculations**](https://sadiqshifa.github.io/RMAS/agents/scra-calculations-agent.html) · [**→ Regulatory Change Monitor**](https://sadiqshifa.github.io/RMAS/agents/reg-change-monitor.html) · [**→ HMDA Calculator**](https://sadiqshifa.github.io/RMAS/agents/hmda-calculator.html) · [**→ Adverse Action Validator**](https://sadiqshifa.github.io/RMAS/agents/adverse-action-validator.html) · [**→ OFAC Triage Agent**](https://sadiqshifa.github.io/RMAS/agents/ofac-triage-agent.html) · [**→ Pre-Clearance Tool**](https://sadiqshifa.github.io/RMAS/tools/pre-clearance-tool.html) · [**→ Reg O Tool**](https://sadiqshifa.github.io/RMAS/tools/reg-o-insider-credit-tool.html)

**Jump to:** [🤖 Agent Tools](#agent-tools) &nbsp;|&nbsp; [⚙️ Non-Agent Tools](#non-agent-tools) &nbsp;|&nbsp; [📋 Status](#status)

---

## What this is solving for

Any regulated, judgment-heavy domain hits the same three problems when
AI enters the picture. I built the proof of this in **financial services
risk management** — SCRA, AML/KYC, Fair Lending, Anti-Bribery/COI —
because that's where my own experience is deep. None of the three
problems below are specific to banking; see
[Transferability](#transferability) for where else this applies.

**Execution is manual where it doesn't need to be — but not everywhere.**
Reading a message for an indirect SCRA trigger, or triaging a sanctions
match, is a language problem. AI helps. A dollar limit or a
capital-based threshold is not a language problem — it's a routing
decision. Forcing AI onto that doesn't speed it up. It makes it less
auditable. Knowing the difference, control by control, is the first
skill this project proves.

**"Regulation to working system" isn't a prompting exercise.** It's
decomposition: obligation → process → testable control → the right
build for that control. [The methodology](#the-methodology) is that
decomposition, and it holds regardless of domain or whether AI ends up
in the final system.

**AI is already inside financial institutions, governed or not.** Vendors
embed it in SaaS platforms, staff use it informally, some teams build
with it deliberately — governance is catching up everywhere at once.
Models update. Prompts drift. An agent quietly gets worse at one edge
case. "Does this still work" isn't a question ordinary software
maintenance answers, because the thing that built it and the thing
running it can both shift under you. The governance in this project —
model risk registers, eval suites, honest validation status — is a
worked answer to that question, not an appendix to the interesting part.

Three questions get asked of every build in this repo: **should this
control have used AI at all? Does it still work after the model changes?
What's the fallback if AI is unavailable?** Everything below is the
answer to those three, in practice.

---

<a id="agent-tools"></a>
## The live agents

Six agents, running in your browser, no install. Five are genuinely
AI-powered — HMDA Calculator is deliberately not, same as the Track B
tools below. **Every AI agent runs the same way by default:** open it with
no API key and it runs in fallback mode — full deterministic logic (gates,
routing, audit trail), pre-written guidance standing in for live AI
analysis, clearly labeled as such. Add your own Anthropic API key in the
agent itself to see live model output. The key stays in your browser
session; nothing is stored or logged.

**Capability types, referenced below:** **Type 1** — API integration & scheduled execution &nbsp;·&nbsp; **Type 2** — mandatory gate enforcement &nbsp;·&nbsp; **Type 3** — deterministic calculations &nbsp;·&nbsp; **Type 4** — unstructured language recognition. [Full definitions](docs/layer4-scra-governance.md).

### 1 — SCRA DMDC Integration (Type 1 + 4)
[**Open**](https://sadiqshifa.github.io/RMAS/agents/scra-dmdc-agent.html) — Four-scenario military status verification workflow: active duty (gate holds, institution-wide sweep), not active (gate clears, safe-harbor note), no record (escalates, never clears), API timeout (fails closed). Also includes **Notice Intake**, which reads free-text customer communication for indirect SCRA triggers a rules engine would miss (six pre-loaded scenarios), and a **one-click 6-case eval suite** with zero-tolerance cases baked in (timeout must fail closed; no-record must escalate).

### 2 — SCRA Deterministic Calculations (Type 3)
[**Open**](https://sadiqshifa.github.io/RMAS/agents/scra-calculations-agent.html) — Four fully-auditable calculation tabs: **interest rate cap** (50 U.S.C. §3937, excess interest per account), **tail period** (§3937(d)(2), post-service foreclosure timing), **tolling** (§3936, statute-of-limitations adjustment across 10 pre-loaded states), and a **full account summary** combining all three. AI only touches an optional edge-case review layer on top — every calculation itself is plain deterministic JavaScript.

### 3 — Regulatory Change Monitor (cross-domain)
[**Open**](https://sadiqshifa.github.io/RMAS/agents/reg-change-monitor.html) — A second-line GRC function watching AML/KYC, Fair Lending, and SCRA for regulatory change, searching the correct primary source per domain and classifying each finding as relevant / not relevant / ambiguous. **18-case eval suite**, 14 real dated items + 4 constructed edge cases. A toggle also shows a Production Architecture view — real, tested integration code (Federal Register poller, OFAC SDN differ, scheduler, persistence schema) that's intentionally inactive here since static hosting can't run it, explained rather than left ambiguous.

### 4 — Fair Lending: HMDA Reportability Calculator (Type 3, no AI)
[**Open**](https://sadiqshifa.github.io/RMAS/agents/hmda-calculator.html) — Same deterministic-calculation pattern as Agent 2, no AI anywhere. Walks a loan through HMDA's five coverage tests and the current inflation-adjusted asset-size exemption to determine reportability.

### 5 — Fair Lending: Adverse Action Notice Validator (Type 1 + 4)
[**Open**](https://sadiqshifa.github.io/RMAS/agents/adverse-action-validator.html) — Checks a drafted notice against Reg B: timing windows, required content, and — where AI is available — whether the language reads as boilerplate or omits a specific denial reason. Structural/timing checks are deterministic regardless of AI availability.

### 6 — AML/KYC: OFAC Screening Triage Agent (Type 1 + 4)
[**Open**](https://sadiqshifa.github.io/RMAS/agents/ofac-triage-agent.html) — Takes a sanctions-list name match and triages it — likely false positive, needs review, or likely true positive — with reasoning, not just a score. Never clears a match itself; every result routes to a BSA Officer, and a true-positive read surfaces the 10-business-day OFAC reporting clock. This is AML/KYC's own [Layer 2 analysis](docs/layer2-aml-kyc.md) built out — that doc named this "the clearest agent use case" in the domain before any code existed.

**Fair Lending eval suites** ([FL-EVAL-01, FL-EVAL-02](docs/eval-suites-fair-lending-agents.md)): 14 + 16 cases, split
between deterministic checks and AI-output review. **FL-EVAL-02's live-mode
model is MRM-005** in the Model Risk Register. See
[status table](#status) for exact execution results — most of this is
genuinely run, not just specified.

**OFAC agent's deterministic pre-check (name similarity + DOB/country/ID
comparison) is executed — 8/8 passing**, [`tests/aml-kyc/`](tests/aml-kyc).
That test suite caught a real logic bug before shipping: the first version
required *low* name similarity for a false-positive read, which is
backwards — the classic false positive is a *high*-similarity name ruled
out by a mismatching identifier. Fixed, and documented in the source. Its
live-mode model is **MRM-006**, registered the day the agent was built —
not found missing afterward the way MRM-005 was. [Eval suite doc](docs/eval-ofac-triage-agent.md) covers AML-EVAL-01 (specified, not yet
run against a real API) and a [manual reasoning pass](docs/aml-eval-01-manual-reasoning-pass.md) — explicitly not an eval execution, since the same reasoning
that produced each response also graded it.

---

<a id="non-agent-tools"></a>
## The workflow tools — engineered with AI, running without it

Not every control fits an AI agent. Where a control is genuinely a fixed
threshold and routing decision, it's built as ordinary deterministic
software — using an AI coding assistant to build it, with zero AI in the
decision path. **This is the harder, more interesting claim**: the same
engineering process, pointed at a problem that shouldn't use AI at
runtime, produces a system that doesn't.

### Pre-Clearance Determination System (Anti-Bribery/COI)
**[Open Tool →](https://sadiqshifa.github.io/RMAS/tools/pre-clearance-tool.html)** &nbsp;|&nbsp; [Layer 1](docs/layer1-anti-bribery-coi.md) &nbsp;|&nbsp; [Layer 2](docs/layer2-anti-bribery-coi.md) &nbsp;|&nbsp; [Gap Register — 14 gaps, 5 blocking](docs/pre-clearance-tool-demo-to-production-gap-register.md)

Gifts, entertainment, and hospitality pre-clearance against the Bank Bribery Act, FCPA, FINRA/MSRB gift limits, Reg O, and federal gift-acceptance rules. Fixed if/then logic, no model call. Two-line review (manager gate, then an independent deterministic second-line engine), recipient-category-aware intake, and version-pinned like an AI agent would be — a threshold change is a new version, re-validated before adoption.

### Regulation O Insider Credit Threshold Tool
**[Open Tool →](https://sadiqshifa.github.io/RMAS/tools/reg-o-insider-credit-tool.html)** &nbsp;|&nbsp; [Gap Register — 14 gaps, 5 blocking](docs/reg-o-tool-demo-to-production-gap-register.md)

Same no-AI-at-runtime design, applied to 12 C.F.R. Part 215's percentage-of-capital math instead of fixed dollar limits. Every threshold derives from a bank's own configured capital. Correctly distinguishes an `ESCALATED` board-approvable trigger from an absolute statutory `PROHIBITED` ceiling — not every breach treated the same. Identity resolves against a 12-person roster, not free text — closing a real bug Tool 1's free-text version had, where two spellings of one name would track as two people. Gap register includes an honest finding that Reg O itself specifies no record-retention period at all.

> **Open item:** this tool's specific thresholds were verified against eCFR
> primary text, but that detail hasn't been written back into
> [Layer 1](docs/layer1-anti-bribery-coi.md) / [Layer 2](docs/layer2-anti-bribery-coi.md)
> yet — the tool is ahead of its own documentation, flagged here rather
> than left for someone else to notice.

---

## The methodology

Four layers, each a prerequisite for the next — an agent is only as good
as the control it's built from, which is only as good as the process map
and the regulatory requirements underneath it.

| Layer | What it does | SCRA example |
|---|---|---|
| **1 — Regulatory Requirements** | Enumerates testable obligations from source statute and exam guidance, not summaries | 12 obligation clusters, each with citation, triggers, timing, penalties — [doc](docs/layer1-scra.md) |
| **2 — Process Map** | Maps each requirement to where it lives operationally | 9 processes, step-by-step — [doc](docs/layer2-scra-process-map.md) |
| **3 — Control Matrix** | Maps each process step to a specific, testable control, rated for agent opportunity | 47 controls, 4-tier rating (High/Medium/Low-Medium/Low — no rounding up); 22 High-rated are the build targets — [doc](docs/layer3-scra-control-matrix.md) |
| **4 — Governance** | Specifies what each agent type needs: versioning, evals, human-in-the-loop boundaries, audit, drift, incident response | 4 capability types, enforced at the system level — [doc](docs/layer4-scra-governance.md) |

---

## Governance and risk management

A dedicated framework covers **8 operational domains**: model/prompt
versioning, eval suite execution, drift monitoring, human-in-the-loop
execution, incident response, regulatory currency, DMDC data-dependency
risk, and AI business continuity. Domain 8 directly answers the question
any serious reviewer asks first — *what's the plan if the AI doesn't
work* — with a two-tier operating model, defined fallbacks, tested manual
procedures, and RTO/RPO targets. [Full framework](docs/scra-agent-governance-risk.md).

Built SCRA-first, but the core disciplines are domain-agnostic: the
[Model Risk Register](https://sadiqshifa.github.io/RMAS/governance/model-risk-register.html) inventories
every AI component across all four domains under an SR 11-7-inspired
framework ([reasoning here](docs/model-risk-management-framework.md)), and
the same version-pinning discipline applies to the Track B tools that have
no model to version at all.

---

## Honesty about what this is

Every layer carries a Demonstration Scope Notice stating exactly what
separates it from a production deployment. A consolidated
[gap register](docs/scra-demo-to-production-gap-register.md) tracks
**19 P1 blocking gaps and 15 P2 required gaps**, sequenced into a phased
roadmap. Being specific about the gaps isn't a caveat bolted on at the
end — it's a demonstration of judgment in its own right: the difference
between understanding a methodology and understanding what it takes to
actually operationalize one.

---

## Transferability

SCRA was the template domain — discrete requirements, bounded process
touchpoints, a good place to build the methodology first. The same
four-layer approach and Track A/Track B judgment now covers four domains,
scope deliberately frozen there (Vendor/Third-Party Risk Management stays
named and deprioritized, not silently dropped):

- **AML/KYC/Sanctions** — [Layer 1](docs/layer1-aml-kyc.md)/[Layer 2](docs/layer2-aml-kyc.md) committed. Layer 3 is the [OFAC Triage Agent](https://sadiqshifa.github.io/RMAS/agents/ofac-triage-agent.html) — the domain's own analysis called this the clearest agent use case, and it's built.
- **Fair Lending (Reg B/HMDA)** — [Layer 1](docs/layer1-fair-lending.md)/[Layer 2](docs/layer2-fair-lending.md) committed. Two Track A agents are Layer 3; eval suites mostly executed (see [Status](#status)).
- **Anti-Bribery/COI** — Layer 1/2 committed. Two Track B tools are Layer 3 — the domain that makes the "not everything should be an agent" case concretely. Layer 4 here is EUCT-appropriate governance, not model governance, since there's no AI to govern: version pinning, ownership framing, and a [rules-engine test suite](docs/rules-engine-test-suite-anti-bribery-coi.md) at **35/35 passing**.

**Model validation is paused, on purpose:** 4 of 6 models remain
unvalidated (3 High-tier) — [reasoning here](docs/model-risk-management-framework.md),
section G. Everything deterministic or fallback-mode is executed:
**79 test cases**, real code, independently re-runnable. What's left needs
a live API key and independent grading, not more engineering.

The approach — not the domain knowledge — extends to insurance,
energy (FERC/NERC), government contracting (FAR/DFARS), or anywhere
regulatory complexity outpaces manual process. The judgment about when
*not* to use AI transfers with it.

---

## Project structure

```
RMAS/
├── agents/                              # Track A — AI agents
│   ├── scra-dmdc-agent.html             # DMDC + Notice Intake agent (Type 1 + 4)
│   ├── scra-calculations-agent.html     # SCRA deterministic calculations agent (Type 3)
│   ├── reg-change-monitor.html          # Cross-domain reg-change agent (AML/KYC, Fair Lending, SCRA)
│   ├── hmda-calculator.html             # Fair Lending — HMDA reportability agent (Type 3, no AI)
│   ├── adverse-action-validator.html    # Fair Lending — adverse action notice validator (Type 1 + 4)
│   └── ofac-triage-agent.html           # AML/KYC — OFAC screening triage agent (Type 1 + 4)
│
├── tools/                               # Track B — deterministic workflow tools, no AI at runtime
│   ├── pre-clearance-tool.html          # Gifts/entertainment/anti-bribery pre-clearance rules engine
│   └── reg-o-insider-credit-tool.html   # Regulation O insider credit threshold calculator
│
├── tests/                               # Executable test suites — real code, not specs
│   ├── anti-bribery-coi/                # Rules-engine tests for both Track B tools (35/35 passing)
│   │   ├── pc_engine.js · pc_tests.js       # Pre-Clearance — extracted engine + 20-case suite
│   │   └── rego_engine.js · rego_tests.js   # Reg O — extracted engine + 15-case suite
│   ├── aml-kyc/                         # OFAC agent's deterministic pre-check (8/8 passing)
│   │   └── ofac_engine.js · ofac_tests.js
│   ├── fair-lending/                    # FL-EVAL-01 (14/14) + FL-EVAL-02 5a/5b/5c-fallback (21/21)
│   │   ├── hmda_engine.js · hmda_tests.js       # HMDA Calculator — full logic, 14 cases
│   │   ├── aav_engine.js · aav_tests.js         # Adverse Action Validator — timing + SPCP, 11 checks
│   │   └── fallback_engine.js · fallback_tests.js  # Adverse Action Validator — 5c fallback cases
│   └── scra/                            # SCRA DMDC agent's existing eval suite, run externally (6/6)
│       └── dmdc_engine.js · dmdc_tests.js
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
│   ├── eval-ofac-triage-agent.md        # AML/KYC — OFAC agent eval: executed pre-check + AML-EVAL-01 spec
│   ├── aml-eval-01-manual-reasoning-pass.md  # AML-EVAL-01 manual pass — not an eval execution, self-graded
│   ├── layer1-fair-lending.md           # Fair Lending (Reg B/HMDA) — regulatory map
│   ├── layer2-fair-lending.md           # Fair Lending (Reg B/HMDA) — control matrix
│   ├── eval-suites-fair-lending-agents.md  # Fair Lending — FL-EVAL-01/FL-EVAL-02 eval suite specs
│   ├── layer1-anti-bribery-coi.md       # Anti-Bribery/Corruption & COI — regulatory map
│   ├── layer2-anti-bribery-coi.md       # Anti-Bribery/Corruption & COI — control matrix
│   ├── rules-engine-test-suite-anti-bribery-coi.md  # ABC/COI — executed Layer 4 test results (35/35)
│   ├── pre-clearance-tool-demo-to-production-gap-register.md  # Pre-Clearance — demo → production gap register
│   ├── reg-o-tool-demo-to-production-gap-register.md  # Reg O tool — demo → production gap register
│   └── model-risk-management-framework.md  # Cross-domain model risk management framework
│
└── README.md
```

SCRA's docs use a four-file Layer 1–4 split since it was the template
domain and got the deepest build; the other three domains use a two-file
Layer 1–2 split, with Layer 3 being the actual agent/tool and Layer 4
governance covered by the cross-domain documents. Bringing every domain to
SCRA's documentation depth is an open item, not a decision to leave as-is
indefinitely.

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
| AML/KYC — OFAC Screening Triage Agent (domain's Layer 3, per its own Layer 2 analysis) | ✅ Working demo · fallback + live mode · [deterministic pre-check 8/8 passed](tests/aml-kyc) |
| AML/KYC — OFAC agent live-mode eval (AML-EVAL-01, 6 cases, rubric-based) | 🚧 Designed — not yet executed |
| Fair Lending / HMDA — Layer 1 & Layer 2 | ✅ Committed |
| Fair Lending Agent — HMDA Reportability Calculator (Type 3) | ✅ Working demo · fallback mode |
| Fair Lending Agent — Adverse Action Notice Validator (Type 1 + 4) | ✅ Working demo · fallback mode |
| Fair Lending Eval Suites (FL-EVAL-01: 14 cases, FL-EVAL-02: 16 cases) | ✅ FL-EVAL-01 14/14, FL-EVAL-02 5a/5b/5c-fallback 21/21 — [`tests/fair-lending`](tests/fair-lending). 🚧 One case (A-04) blocked on an API key + human judgment call |
| Anti-Bribery/Corruption & COI — Layer 1 & Layer 2 | ✅ Committed |
| Anti-Bribery/COI Tool — Pre-Clearance Determination System (Track B, no AI at runtime) | ✅ Working demo · rules-engine v1.1.0 |
| Anti-Bribery/COI Tool — Regulation O Insider Credit Threshold Tool (Track B, no AI at runtime) | ✅ Working demo · rules-engine v1.0.0 |
| Anti-Bribery/COI — Rules-engine test suite (Layer 4, EUCT-appropriate — not model governance) | ✅ **35/35 passed**, executed against real tool code — [results](docs/rules-engine-test-suite-anti-bribery-coi.md) · [runnable tests](tests/anti-bribery-coi) |
| Reg O Tool — Demo-to-production gap register (14 gaps, 5 blocking) | ✅ Complete |
| Pre-Clearance Tool — Demo-to-production gap register (14 gaps, 5 blocking) | ✅ Complete |
| Layer 1/2 Anti-Bribery/COI docs — Reg O-specific threshold detail | ✅ Written back into the docs, verified against eCFR primary text (2026-07-09) |
| Model Risk Register (cross-domain, SR 11-7-inspired, 6 models / 5 agents) | ✅ v0.2 — added MRM-006 (OFAC Screening Triage Agent) at build time, not retroactively |
| All AI agents — BYOK live AI (bring-your-own Anthropic API key) | ✅ Implemented; fallback-by-default outside Claude.ai's runtime |
| Vendor / Third-Party Risk Management | 🚧 Explicitly deprioritized — scope frozen at four domains this phase, not a fifth (see Transferability) |

---

## About

Built independently by Sadiq Shifa as a hands-on exploration of applied AI
governance in regulated industries — not affiliated with any employer or
client. The goal was depth on a real compliance domain that demonstrates
working judgment, not a polished demo that stops at the automation.

---

*Regulatory content verified against OCC Comptroller's Handbook v1.1 (November 2025) and 50 U.S.C. statutory text. DMDC API is mocked in the demonstration agents. See the gap register for full production readiness assessment.*

