# RMAS — Risk Management Agent System

**A methodology for connecting regulatory requirements to AI-assisted compliance controls — with governance as a first-class concern.**

[**→ Try the SCRA DMDC Agent (live)**](https://sadiqshifa.github.io/RMAS/scra-dmdc-agent.html) · [**→ Try the SCRA Calculations Agent (live)**](https://sadiqshifa.github.io/RMAS/scra-calculations-agent.html) · [**→ Try the Regulatory Change Monitor (live)**](https://sadiqshifa.github.io/RMAS/reg-change-monitor.html) · [**→ Try the Model Risk Register (live)**](https://sadiqshifa.github.io/RMAS/model-risk-register.html)

---

## What this is

RMAS is an independent project demonstrating how to take a complex regulatory obligation, decompose it into specific compliance processes and controls, identify where AI agents can genuinely help (and where they can't), build working agents that execute those controls, and govern those agents so they stay trustworthy as the models underneath them change.

The domain is financial services compliance, but the methodology is not. The four-layer approach — requirements → processes → controls → governance — applies anywhere that regulatory or operational complexity creates risk: healthcare, insurance, energy, legal, government contracting, or any industry with compliance obligations that exceed what manual processes can reliably handle.

This is not a demo that stops at the automation. Two harder questions are treated as first-class parts of the build: **how do you know the agent is still working correctly after the model changes?** And: **what is your business continuity plan if the AI systems don't work?**

---

## The live agents

Three working AI-powered compliance agents, running in a browser with no installation required.

### Agent 1 — SCRA DMDC Integration (Type 1 + Type 4)

[**→ Open agent**](https://sadiqshifa.github.io/RMAS/scra-dmdc-agent.html)

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

[**→ Open agent**](https://sadiqshifa.github.io/RMAS/scra-calculations-agent.html)

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

**Eval suite:** An 8-case eval suite (2 per tab) checks statutory citation accuracy and rubric-based issue-spotting for the AI edge case review — see the agent's "Eval Suite" tab. One case is a deliberate "clean" decoy testing whether the model invents risks that aren't there.

---

### Agent 3 — Regulatory Change Monitor (cross-domain, Layer 3/second-line)

[**→ Open agent**](https://sadiqshifa.github.io/RMAS/reg-change-monitor.html)

Unlike Agents 1 and 2, this agent isn't domain-specific — it's a second-line-of-defense GRC function that watches for regulatory change across all three domains in this project: **AML/KYC/Sanctions**, **Fair Lending (Reg B/HMDA)**, and **SCRA**. Pick any combination of domains and run a live check; the agent searches the correct primary source per domain (FinCEN/OFAC for AML, CFPB for Fair Lending, DOJ/Federal Register/Congress.gov for SCRA — DMDC is deliberately excluded as a source here, since it's a data source, not a rule-change source), then classifies each item found: relevant / not relevant / ambiguous, plus materiality and primary-vs-secondary sourcing.

**Demo Mode vs. Production Architecture** — a toggle switches between the working live-search demo and a Production Architecture view showing real, verified integration code (a live-tested Federal Register API poller, an OFAC SDN list differ, a scheduler config, and a persistence schema) that a production deployment would run on a schedule. That code is present but intentionally inactive here, since static GitHub Pages hosting can't run scheduled server-side jobs or persist state between runs — the notice explains exactly why, rather than leaving "live" ambiguous.

**Eval suite — 18 pre-labeled cases** (14 real, dated regulatory items verified via search; 4 clearly-marked constructed edge cases), evenly split across the three domains, each with a human-set correct classification and materiality. This is the concrete Layer 4 regression gate: before adopting any model or prompt change, re-run the suite and compare against the last known pass rate.

**Fallback mode / BYOK:** By default — including for any visitor on this GitHub Pages site — the agent runs in fallback mode: no live API calls, no cost, nothing required, with direct links to primary sources if a check can't complete. Enter your own Anthropic API key in the agent to trigger genuine live search-and-classify runs and to actually score the eval suite instead of seeing "pending."

---

## Model Risk Register — governance of the governance

[**→ Open the register**](https://sadiqshifa.github.io/RMAS/model-risk-register.html)

The three agents above each contain AI components making judgment calls. This register treats those components as models under formal inventory and governance, modeled on **SR 11-7** (the Fed/OCC's actual Model Risk Management guidance) — model inventory, risk tiering (High/Medium/Low based on autonomy, materiality, and detectability), validation status by tier, and a documented remediation path for gaps.

Unlike every other artifact in this project, the register makes **no API calls at all** — it's static governance content, deliberately, so it stays available regardless of AI status.

**An evolving, real finding, not a hypothetical:** auditing all 4 AI models across the fleet found that only 1 — the Regulatory Change Monitor's classification model — was originally validated. Since then, the Calculations agent's AI edge-case review gained its own 8-case eval suite (statutory citation accuracy plus rubric-based issue-spotting), making it partially validated. Two gaps remain: the DMDC agent's existing eval suite tests deterministic routing/gate/certificate logic only, not the AI-generated narrative text, and the Notice Intake trigger-recognition model still has zero eval coverage. The register documents all of this with a live, prioritized remediation roadmap rather than a static snapshot.

[→ Full framework doc](docs/model-risk-management-framework.md)

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

---

## Honesty about what this is

Every document in this project carries a **Demonstration Scope Notice** specifying exactly what gaps exist between the showcase and a production deployment. A gap register consolidates all gaps across layers — 19 P1 blocking gaps, 15 P2 required gaps — categorized by type, priority, and sequenced into a phased production readiness roadmap.

This matters for two reasons. First, it's accurate — the agents use a mocked DMDC API, are stateless, and handle one trigger context at a time. Second, being specific about the gaps is itself a demonstration of judgment. It shows the difference between understanding a methodology and understanding what it would take to operationalize one.

[→ Gap Register](docs/scra-demo-to-production-gap-register.md)

---

## Project structure

```
rmas/
├── scra-dmdc-agent.html              # DMDC + Notice Intake agent — open in any browser
├── scra-calculations-agent.html      # Calculations agent — open in any browser
├── reg-change-monitor.html           # Cross-domain (AML/KYC, Fair Lending, SCRA) reg-change agent — open in any browser
├── model-risk-register.html          # Model Risk Register — governance-of-governance, no API calls — open in any browser
│
├── docs/
│   ├── layer1-scra.md                # SCRA regulatory requirements (12 obligation clusters)
│   ├── layer2-scra-process-map.md    # Nine compliance processes with step-by-step workflows
│   ├── layer3-scra-control-matrix.md # 47 controls, four-tier agent opportunity ratings
│   ├── layer4-scra-governance.md     # SCRA agent characterization + governance architecture
│   ├── scra-agent-governance-risk.md # Operational governance framework (8 domains)
│   ├── scra-demo-to-production-gap-register.md # Demo → production gap register
│   ├── layer1-aml-kyc.md             # AML/KYC/Sanctions regulatory map
│   ├── layer2-aml-kyc.md             # AML/KYC/Sanctions control matrix
│   ├── layer1-fair-lending.md        # Fair Lending (Reg B/HMDA) regulatory map
│   └── model-risk-management-framework.md # SR 11-7-inspired model inventory & governance methodology
│
└── README.md
```

---

## What this demonstrates

**Regulatory decomposition.** Taking a complex statute (SCRA: 50 U.S.C. §§ 3901–4043, verified against OCC Comptroller's Handbook v1.1) and producing enumerable, testable requirements — not summaries.

**Process mapping.** Connecting regulatory obligations to the operational processes where compliance actually happens, at the level of specificity required to design controls.

**Honest control assessment.** Identifying where automation genuinely helps vs. where data availability or human accountability dependencies constrain agent opportunity — and rating them differently rather than rounding up.

**Working agent execution.** Three live AI-powered agents: Type 1 (DMDC integration) and Type 4 (language recognition) in the DMDC agent; Type 3 (deterministic calculations) in the calculations agent; and a cross-domain classification agent in the Regulatory Change Monitor — with real compliance logic, AI analysis available live via your own API key (fallback mode by default), and working eval suites.

**Production governance thinking.** Eval suite design, version pinning, human-in-the-loop boundaries, drift monitoring, incident response, data dependency governance, and business continuity — specified at operational precision, not policy-document level.

**Business continuity design.** A two-tier operating model where compliance-critical functions run deterministically regardless of AI availability, with defined fallback behavior, manual procedure requirements, RTO/RPO targets, and a testing schedule.

**Intellectual honesty.** A gap register that says clearly what this is and what it isn't, and a phased roadmap for what production deployment would require.

---

## Transferability

SCRA was chosen as the template domain because its requirements are discrete and its process touchpoints are bounded — it's a good domain to build the methodology in. The same four-layer approach applies to:

- [AML/KYC/Sanctions](docs/layer1-aml-kyc.md) — [Layer 1](docs/layer1-aml-kyc.md) and [Layer 2](docs/layer2-aml-kyc.md) built
- [Fair Lending / HMDA](docs/layer1-fair-lending.md) — Layer 1 built; Layer 2 control matrix still outstanding
- Healthcare privacy (HIPAA, 42 CFR Part 2)
- Insurance regulatory compliance
- Energy market compliance (FERC, NERC)
- Government contracting (FAR, DFARS)
- Any domain where regulatory complexity creates operational risk that exceeds what manual processes reliably handle

The methodology transfers. The domain knowledge is specific to the domain.

Both AML/KYC and Fair Lending are already covered by the cross-domain [Regulatory Change Monitor](https://sadiqshifa.github.io/RMAS/reg-change-monitor.html) agent above, ahead of either domain having its own dedicated Layer 3/4 agent build — a deliberate sequencing choice: build the cross-cutting second-line function once, then layer domain-specific agents on top as each domain's control matrix matures.

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
| All three agents — BYOK live AI (bring-your-own Anthropic API key) | ✅ Implemented; fallback-by-default outside Claude.ai's runtime |
| AML/KYC/Sanctions — Layer 1 (Regulatory Map) | ✅ v0 committed |
| AML/KYC/Sanctions — Layer 2 (Control Matrix) | ✅ v0 committed |
| Fair Lending / HMDA — Layer 1 (Regulatory Map) | ✅ v0 committed |
| Fair Lending / HMDA — Layer 2 (Control Matrix) | 🚧 Not yet built |
| Model Risk Register — 4-model inventory, SR 11-7-inspired tiering | ✅ v0.1 complete |
| Model Risk Register — validation coverage | ✅ 1 of 4 fully validated, 1 partially validated (Calculations agent's new 8-case suite), 2 remaining gaps documented with roadmap |

---

## About

Built independently by Sadiq as a hands-on exploration of applied AI governance in regulated industries. Not affiliated with any employer or client.

The goal was to go deep enough on a real compliance domain to demonstrate working judgment — not to produce a polished demo that stops at the automation.

---

*Regulatory content verified against OCC Comptroller's Handbook v1.1 (November 2025) and 50 U.S.C. statutory text. DMDC API is mocked in the demonstration agents. See the gap register for full production readiness assessment.*
