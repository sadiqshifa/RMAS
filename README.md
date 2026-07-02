# RMAS — Risk Management Agent System

**A methodology for connecting regulatory requirements to AI-assisted compliance controls — with governance as a first-class concern.**

[**→ Try the live demo**](https://sadiqshifa.github.io/RMAS/scra-dmdc-agent.html)

---

## What this is

RMAS is an independent project demonstrating how to take a complex regulatory obligation, decompose it into specific compliance processes and controls, identify where AI agents can genuinely help (and where they can't), build a working agent that executes those controls, and govern that agent so it stays trustworthy as the model underneath it changes.

The domain is financial services compliance, but the methodology is not. The four-layer approach — requirements → processes → controls → governance — applies anywhere that regulatory or operational complexity creates risk: healthcare, insurance, energy, legal, government contracting, or any industry with compliance obligations that exceed what manual processes can reliably handle.

This is not a demo that stops at the automation. The harder question — **how do you know the agent is still working correctly after the model changes?** — is treated as a first-class part of the build.

---

## The live agent

The SCRA DMDC Integration Agent is a working AI-powered compliance tool, running in a browser with no installation required.

**What it demonstrates:**

**DMDC Agent Run** — the agent executes a military status verification workflow (mocked DMDC API) across four scenarios. For each scenario, a real Claude AI model generates the compliance analysis, gate hold explanation, and required actions in real time — not pre-scripted responses.

- **Active duty:** Gate holds, institution-wide account sweep executes across four accounts, AI generates required actions with statutory basis
- **Not active:** Gate cleared, AI generates safe harbor scope note with residual obligation language
- **No record:** Escalated — not cleared — AI explains Reserve/Guard accuracy lag and required reviewer actions
- **API timeout:** Gate fails closed — AI explains why timeout ≠ clearance and what reviewer must do

**Notice Intake (AI-powered)** — paste any customer communication and the AI identifies SCRA triggers, including indirect language a rules engine would miss. Six pre-loaded scenarios demonstrate the range:

- A customer mentioning deployment on a collections call
- A formal SCRA invocation letter
- A spouse calling about a billing issue, mentioning "he's been stationed overseas"
- A post-service retroactive request within the 180-day window
- A power of attorney submission
- A non-SCRA communication (correctly identified as no trigger)

**Eval Suite** — six test cases with defined pass/fail criteria, runnable in one click. Includes zero-tolerance cases (API timeout must fail closed; no-record must escalate, never clear) that reflect the strict liability exposure in the underlying regulation.

---

## The methodology

The project is organized in four layers. Each layer is a prerequisite for the next — the agent is only as good as the control identification it's built from, which is only as good as the process map, which is only as good as the regulatory requirements it's derived from.

### Layer 1 — Regulatory Requirements

Enumerates specific obligations from the source statute and exam guidance — not summaries, but testable requirements. For SCRA: nine obligation clusters, each with statutory citation, trigger conditions, timing rules, documentation requirements, enforcement authority, and penalties.

This layer is where most compliance technology projects start too late. Starting here means the agent's behavior is grounded in what the regulation actually requires, not what someone remembers it requiring.

[→ SCRA Layer 1](docs/layer1-scra.md)

### Layer 2 — Process Map

Maps each regulatory requirement to the compliance processes where it lives operationally — loan origination, ongoing servicing, notice intake, collections, foreclosure, repossession, return from service, lease termination, civil litigation. Nine processes in total for SCRA, each with step-by-step workflows, data inputs, and a precise statement of what control is needed at each step.

This is the layer most often skipped. Skipping it means building controls that are disconnected from how the work actually happens.

[→ SCRA Layer 2](docs/layer2-scra-process-map.md)

### Layer 3 — Control Matrix

Maps each process step to a specific, testable control. For each control: what it does, how it's currently executed (Manual / Tool-assisted / Automated / Absent), what the failure mode looks like in practice, and where an agent can genuinely help.

Agent opportunity is rated on a four-tier scale — High, Medium, Low-Medium, and Low. The Low-Medium tier exists because some controls were initially rated Medium but are more honestly characterized as constrained by data availability or human accountability dependencies. Rounding up would have been misleading. The 22 High-rated controls are the agent build targets; the others are documented with honest explanations of why agent opportunity is limited.

[→ SCRA Layer 3](docs/layer3-scra-control-matrix.md)

### Layer 4 — Agent Characterization and Governance

Organizes the 22 High-rated controls into four capability types (DMDC integration, mandatory gate enforcement, deterministic calculations, language recognition) and specifies the governance required for each — version pinning, eval suite design, human-in-the-loop boundaries, audit logging, drift monitoring, and incident response.

The human-in-the-loop map is precise: specific agent actions are classified as autonomous or human-confirmed, with the rationale for each. The distinction between "agent executes" and "human confirms" is enforced at the system level, not left to policy.

[→ SCRA Layer 4](docs/layer4-scra-governance.md)

---

## Governance and risk management

A dedicated governance framework document covers six operational domains: model and prompt versioning, eval suite execution with defined pass thresholds, production drift monitoring with specific signals and alert thresholds, human-in-the-loop execution standards (including what "genuine review" actually requires), incident response with P1/P2/P3/P4 classification, and regulatory currency.

A Domain 7 addendum addresses the DMDC data dependency specifically — classifying it correctly as a government data source rather than a vendor, documenting four distinct dependency risks, and specifying compensating controls for each.

[→ Governance Framework](docs/scra-agent-governance-risk.md)

---

## Honesty about what this is

Every document in this project carries a **Demonstration Scope Notice** that specifies exactly what gaps exist between the showcase and a production deployment. A separate gap register consolidates all gaps across layers, categorizes them by type and priority, and sequences them into a phased production readiness roadmap.

This matters for two reasons. First, it's accurate — the demonstration agent uses a mocked DMDC API, is stateless, and handles one trigger context at a time. A production deployment would need real API integration, state management, multi-context concurrent operation, and integration with loan servicing systems. Second, being specific about the gaps is itself a demonstration of judgment — it shows the difference between understanding a methodology and understanding what it would take to operationalize one.

[→ Gap Register](docs/scra-demo-to-production-gap-register.md)

---

## Project structure

```
rmas/
├── scra-dmdc-agent.html          # Live demo — open in any browser
│
├── docs/
│   ├── layer1-scra.md            # SCRA regulatory requirements
│   ├── layer2-scra-process-map.md # Nine compliance processes
│   ├── layer3-scra-control-matrix.md # 47 controls, four-tier ratings
│   ├── layer4-scra-governance.md  # Agent characterization + governance
│   ├── scra-agent-governance-risk.md # Operational governance framework
│   └── scra-demo-to-production-gap-register.md # Demo → production gaps
│
└── README.md
```

---

## What this demonstrates

**Regulatory decomposition.** Taking a complex statute (SCRA: 50 U.S.C. §§ 3901–4043, verified against OCC Comptroller's Handbook v1.1) and producing enumerable, testable requirements — not summaries.

**Process mapping.** Connecting regulatory obligations to the operational processes where compliance actually happens, at the level of specificity required to design controls.

**Honest control assessment.** Identifying where automation genuinely helps vs. where data availability or human accountability dependencies constrain agent opportunity — and rating them differently rather than rounding up.

**Working agent execution.** A live AI-powered agent demonstrating Type 1 (DMDC integration) and Type 4 (language recognition) capability types, with real compliance logic, real AI-generated analysis, and a working eval suite.

**Production governance thinking.** Eval suite design, version pinning, human-in-the-loop boundaries, drift monitoring, incident response, and data dependency governance — specified at operational precision, not policy-document level.

**Intellectual honesty.** A gap register that says clearly what this is and what it isn't, and a phased roadmap for what production deployment would require.

---

## Transferability

SCRA was chosen as the template domain because its requirements are discrete and its process touchpoints are bounded — it's a good domain to build the methodology in. The same four-layer approach applies to:

- AML/KYC/Sanctions (Layer 1 and Layer 2 partially built in this repository)
- Fair Lending / HMDA (Layer 1 drafted)
- Healthcare privacy (HIPAA, 42 CFR Part 2)
- Insurance regulatory compliance
- Energy market compliance (FERC, NERC)
- Government contracting (FAR, DFARS)
- Any domain where regulatory complexity creates operational risk that exceeds what manual processes reliably handle

The methodology transfers. The domain knowledge is specific to the domain.

---

## Status

| Component | Status |
|---|---|
| SCRA Layer 1 — Regulatory Requirements | ✅ v0.1 complete |
| SCRA Layer 2 — Process Map (9 processes) | ✅ v0.1 complete |
| SCRA Layer 3 — Control Matrix (47 controls) | ✅ v0.2 complete |
| SCRA Layer 4 — Agent Characterization | ✅ v0 complete |
| SCRA Governance Framework | ✅ v0.1 complete |
| SCRA Gap Register | ✅ v0 complete |
| SCRA Agent — Type 1 (DMDC Integration) | ✅ Working demo |
| SCRA Agent — Type 4 (Notice Recognition) | ✅ Working demo |
| SCRA Agent — Type 2 (Gate Enforcement) | 🚧 Characterized, not yet built |
| SCRA Agent — Type 3 (Calculations) | 🚧 Characterized, not yet built |
| AML/KYC/Sanctions — Layers 1 & 2 | 🚧 v0 drafted |
| Fair Lending / HMDA — Layer 1 | 🚧 v0 drafted |

---

## About

Built independently by Sadiq as a hands-on exploration of applied AI governance in regulated industries. Not affiliated with any employer or client.

The goal was to go deep enough on a real compliance domain to demonstrate working judgment — not to produce a polished demo that stops at the automation.

---

*Regulatory content verified against OCC Comptroller's Handbook v1.1 (November 2025) and 50 U.S.C. statutory text. DMDC API is mocked in the demonstration agent. See the gap register for full production readiness assessment.*
