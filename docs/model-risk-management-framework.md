# Model Risk Management Framework — RMAS Agent Portfolio

## Why this exists

Every agent built so far in RMAS (SCRA DMDC, SCRA Calculations, Regulatory
Change Monitor) contains one or more AI components making judgment calls —
generating compliance narratives, classifying regulatory updates, recognizing
SCRA triggers in customer language. Each of those agents was built and
governed individually. What's been missing is the step a real bank's
second-line function would take next: **treat the AI components themselves
as models under formal inventory and governance, not just features inside
an application.**

This is modeled on SR 11-7 (the Federal Reserve / OCC's joint guidance on
Model Risk Management), which defines a "model" broadly as any quantitative
method, system, or approach that processes input data to generate
quantitative or qualitative estimates — a definition broad enough to
squarely cover an LLM call generating a compliance narrative or a
classification. SR 11-7's core expectations — model inventory, tiered risk
rating, independent validation, ongoing monitoring, and documented
governance — map directly onto what an AI agent portfolio needs, arguably
more urgently, since LLM behavior can drift in ways traditional statistical
models don't.

This document, together with `model-risk-register.html`, is RMAS's answer
to the question a Model Risk Management function would ask on day one:
**"What models do you have, and how do you know each one still works?"**

---

## A. What counts as a "model" here

Not every line of code. A component is inventoried as a model if it:
- Takes input and produces an output estimate, classification, or generated
  text that a human or downstream process relies on, **and**
- Is powered by an LLM call (i.e., behavior is not fully specified by
  deterministic code and could change if the underlying model changes)

Deterministic calculations (interest rate cap math, tolling date arithmetic)
are explicitly **not** modeled here — they're software, not models, and
their correctness doesn't depend on what Claude does on any given day.
This distinction matters: it's the same line RMAS already draws in its
fallback-mode design (deterministic functions keep working regardless of
AI availability), just applied to governance instead of uptime.

---

## B. Risk tiering methodology

Each model is rated **High / Medium / Low** based on three factors:

1. **Autonomy** — does the model's output get acted on directly, or does a
   human review it first? (Per Layer 4's human-in-the-loop pillar — none of
   RMAS's agents currently act autonomously, which caps every model's tier
   below what it would be in a fully automated deployment.)
2. **Materiality** — could a wrong output cause a compliance failure,
   financial harm to a servicemember/consumer, or a missed regulatory
   change, versus being a convenience/drafting aid?
3. **Detectability** — if the model degrades, would anyone notice before it
   caused harm? A model with no eval coverage scores worse here by
   definition, regardless of how well it seems to perform anecdotally.

**Tier definitions:**
- **High** — materiality is significant even with human review; wrong output
  could plausibly reach a customer-facing decision or missed regulatory
  obligation before being caught.
- **Medium** — human review is a meaningful safety net, but the model's
  output meaningfully shapes what the reviewer sees or decides.
- **Low** — output is a drafting convenience with an independent
  determination made elsewhere regardless of what the model produces.

---

## C. Validation requirements by tier

| Tier | Required before adoption | Ongoing |
|---|---|---|
| High | Eval suite with known-correct labels covering the model's actual output (not just surrounding deterministic logic); documented pass threshold; named sign-off owner | Re-run eval suite before any model/prompt change; periodic re-validation even absent a known change |
| Medium | Eval suite covering the model's output strongly recommended before production use | Re-run eval suite before any model/prompt change |
| Low | Spot-check review recommended | Re-review if the model or prompt changes materially |

---

## D. Current model inventory and findings

> **Status as of this review: 4 models identified across 3 agents. 1 is
> fully validated, 1 is partially validated, and 2 remain unvalidated.**
> See `model-risk-register.html` for the live register; summary below.

| ID | Model | Agent | Tier | Validation status |
|---|---|---|---|---|
| MRM-001 | Gate clearance narrative generation | SCRA DMDC Agent | Medium | **Not validated** — the agent's 6-case eval suite tests only deterministic routing/gate/certificate fields; no test checks the AI-generated narrative text itself |
| MRM-002 | SCRA notice trigger recognition | SCRA DMDC Agent (Notice Intake tab) | High | **Not validated** — zero eval coverage; the six pre-loaded scenarios in the UI are demo content, not a labeled eval set |
| MRM-003 | AI edge case review | SCRA Calculations Agent (all 4 tabs) | Low | **Partially validated** — 8-case eval suite built: statutory citation accuracy (§3937, §3936, §3953 depending on tab) and rubric-based issue-spotting are auto-graded across 7 of 8 cases; one deliberate "clean" decoy case tests for fabricated risk but is flagged for manual review rather than auto-scored, since reliably detecting fabrication by keyword match isn't realistic |
| MRM-004 | Regulatory update classification | Regulatory Change Monitor | High | **Validated** — 18-case eval suite (14 real, dated items; 4 constructed edge cases), evenly split across domains, with human-set expected classification and materiality |

**Why MRM-002 is rated High despite human review existing:** notice/trigger
recognition is the entry point to the entire SCRA workflow — if the model
fails to recognize a valid trigger (e.g., indirect language like a spouse
mentioning deployment on a billing call), there's no downstream check that
catches the miss, since the workflow simply never starts. That's a
materiality and detectability problem independent of whether a human
reviews the cases that *do* get flagged.

**Why MRM-003 is rated Low despite having zero validation:** the calculation
outputs themselves (interest owed, tail period dates) are fully deterministic
and don't depend on the AI at all; the AI-generated edge-case narrative is
a drafting aid layered on top of a number that's already correct
independent of what the model says about it.

---

## E. Remediation roadmap (ordered by tier, then by ease of closing the gap)

1. **MRM-002 (High, unvalidated)** — build a labeled eval set from the six
   existing Notice Intake demo scenarios plus additional edge cases (e.g.,
   ambiguous language, non-English phrasing, a trigger embedded in an
   otherwise unrelated complaint). This is the highest remaining priority:
   highest tier, currently zero coverage, and the raw material for a
   first-pass eval set already exists in the agent's own demo content.
2. **MRM-001 (Medium, unvalidated)** — extend the existing 6-case eval suite
   (or add a parallel one) with assertions on the generated narrative text
   itself — e.g., does the active-duty clearance note actually state the
   safe-harbor scope and residual obligations, not just that the gate held.
3. ~~**MRM-003 (Low, unvalidated)**~~ — **done.** An 8-case eval suite now
   covers all 4 calculation tabs: a primary check on statutory citation
   accuracy (regex-matched against a pre-verified correct citation per
   case — §3937 for rate cap, §3936 for tolling, §3937/§3953 for tail
   period) and a secondary rubric of specific issues a competent reviewer
   must catch (joint-account nuance, foreclosure-date conflicts, multi-period
   tolling, anomalous account balances). One case is a deliberate "clean"
   decoy testing whether the model fabricates risks that aren't there —
   that specific check is flagged for manual review rather than auto-graded,
   since reliably detecting fabrication by keyword match isn't realistic.
   This is why the model is marked "partially validated" rather than fully
   validated: 7 of 8 cases are completely auto-gradeable, one has a
   manual-only dimension.

---

## F. Governance cadence

- **Model inventory review:** every time a new agent or AI-powered feature
  is added to RMAS, it gets an entry here before being marked "built" in
  the main README's status table — not after.
- **Re-validation trigger:** any model version pin change (e.g., moving off
  `claude-sonnet-4-6`) requires re-running every High and Medium tier
  model's eval suite before the change is treated as adopted.
- **Sign-off:** for this sandbox project, Sadiq is the sole Model Risk Owner
  for all entries. In a production deployment, High-tier models would
  require sign-off independent of the model's builder — a distinction worth
  naming even though it isn't operationally meaningful at single-owner scale.

---

## Next steps for this document

- [ ] Build the MRM-002 eval set (highest priority per remediation roadmap)
- [ ] Extend MRM-001's eval suite to cover generated-text assertions
- [ ] Add an MRM entry the moment any new agent (OFAC triage, Fair Lending
      agents, etc.) introduces a new AI-powered component
- [ ] Consider whether a lightweight drift-monitoring mechanism (Layer 4
      pillar 5) is feasible to simulate in a static-hosting demo, or whether
      this stays a documented-but-not-implemented capability like the
      Production Architecture view in the Regulatory Change Monitor
