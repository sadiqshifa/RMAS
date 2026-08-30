---
layout: default
title: The Methodology — RMAS
og_title: The Methodology — RMAS
og_description: Four layers, one process, for turning a requirement into the right tool — whether that requirement comes from a statute or a company policy.
description: How RMAS goes from a requirement to a working system, and how the process holds whether the requirement is a federal statute or an internal policy someone set.
---

# The Methodology

[← Back to RMAS](https://sadiqshifa.github.io/RMAS/)

Every tool in this project starts the same way, before any code gets
written and before AI even enters the conversation.

**First: what's the actual problem, and who owns it.**
**Second: what environment does it live in** — a federal rule with a
specific, citable number attached, or an internal policy an institution
set on its own judgment.
**Only then:** decide how to build it. Thresholds and routing logic when
the answer is already spelled out. An AI agent only where the input is
language a machine can't otherwise make sense of — a notice, a call
transcript, a written explanation.

That sequence is the same regardless of domain. What differs is where the
number in step two actually comes from, and that difference matters more
than it looks like it should.

---

## The four layers

| Layer | What it does |
|---|---|
| **1 — Requirements** | Enumerate the actual obligations from source text — statute and exam guidance for a regulation, policy language and risk appetite for an internal standard — not a summary of either |
| **2 — Process Map** | Map each requirement to where it actually lives operationally: who touches it, in what system, at what point in the workflow |
| **3 — Control Matrix** | Map each process step to a specific, testable control, and rate it for whether it's a language-judgment problem or a threshold-and-routing problem |
| **4 — Governance** | Specify what the resulting build needs to stay trustworthy — versioning and evals for an AI agent, or version-pinning and a regression test suite for deterministic logic that has no model to drift |

Layer 3 is where the real decision gets made, and it's the same decision
regardless of what generated the requirement in Layer 1.

---

## Two examples, same process, different source

**Regulatory example — SCRA.** The Servicemembers Civil Relief Act sets
statutory interest rate caps, defined tail periods, and specific DMDC
verification steps. The numbers come from 50 U.S.C. directly. Most of
SCRA's controls are deterministic — rate cap math, tail period
calculations, DMDC status routing. One piece isn't: spotting an SCRA
trigger buried in a customer's own words on a collections call or in a
written notice is a judgment call no rules engine can make reliably. That
piece is built as a language-driven agent. Full build:
[SCRA Layer 1](https://sadiqshifa.github.io/RMAS/docs/layer1-scra.html) →
[Layer 4](https://sadiqshifa.github.io/RMAS/docs/layer4-scra-governance.html).

**Policy-driven example — gift and entertainment thresholds.** Some of
the dollar limits governing what a bank employee can accept from a vendor
come from FINRA/MSRB rulemaking. Others are limits the institution simply
chose, based on its own risk appetite, with no specific statute dictating
the number. Once that threshold exists, though, checking a request against
it is exactly the same shape of problem as SCRA's rate cap math: a fixed
number, a routing decision, no language judgment required. The
[Pre-Clearance Determination System](https://sadiqshifa.github.io/RMAS/tools/pre-clearance-tool.html)
is built the same way as SCRA's deterministic pieces — fixed if/then
logic, no model call — even though the number it's checking against
didn't come from a federal statute.

**The point:** Layer 3's question — is this judgment or is this routing —
doesn't care whether Layer 1's requirement came from a regulator or from a
policy committee. A threshold is a threshold. The build decision is the
same either way. What changes is who owns Layer 1 (legal/compliance for a
regulation, the business or risk function for a policy) and how often it
moves (a statute changes on a regulatory timeline; an internal limit can
change whenever the institution decides it should).

---

## Why this holds outside banking

None of the four layers assume banking, and neither does the Track A /
Track B judgment in Layer 3. A hospital's HIPAA obligations, an energy
utility's FERC/NERC reliability standards, a government contractor's
FAR/DFARS clauses — all generate the same shape of question at Layer 1:
here is a requirement, here is where it lives operationally, does meeting
it require language judgment or does it require accurate, consistent
routing against a fixed rule. The domain expertise doesn't transfer. The
process for turning expertise into a working, governed system does.

[← Back to RMAS](https://sadiqshifa.github.io/RMAS/)
