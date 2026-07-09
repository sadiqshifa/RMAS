# Rules-Engine Test Suite — Anti-Bribery/COI

## Scope and purpose

This is the Layer 4 artifact for the Anti-Bribery/COI domain's two Track B
tools (Pre-Clearance Determination System, Regulation O Insider Credit
Threshold Tool) — but it is deliberately **not** modeled on the Model Risk
Register or the Fair Lending eval suites. Those exist to validate AI output
against a rubric, where "correct" can be a judgment call and 100% agreement
isn't the bar. Both tools here are 100% deterministic — there is no AI
component in either at runtime — so the right validation is a **regression
test suite with a 100%-pass bar**: does the code's decision match what the
regulation actually requires, yes or no, with no partial credit.

See `docs/reg-o-tool-demo-to-production-gap-register.md` and
`docs/pre-clearance-tool-demo-to-production-gap-register.md` for the
"governance ownership and policy home — not asserted here" discussion this
suite is the companion to: this document validates that the *logic* is
correct; it says nothing about production-readiness (auth, storage,
tamper-resistance), which the gap registers cover separately.

## Methodology — this suite was actually executed, not just specified

Unlike the Fair Lending eval suites (`docs/eval-suites-fair-lending-agents.md`),
which remain designed-but-not-executed specs, both sub-suites here were
**run against the real tool code**, not a re-implementation or a
description of expected behavior:

1. Each tool's `evaluate()` function and its threshold constants were
   extracted directly from the shipped HTML file by exact line range.
2. Extraction was verified **byte-identical** to the shipped source —
   confirmed programmatically (`src_evaluate in extracted_file`), not just
   visually checked — so these results describe the actual code running in
   `tools/pre-clearance-tool.html` and `tools/reg-o-insider-credit-tool.html`
   today, not a paraphrase of it.
3. Each test case is a real function call with real inputs, asserting on
   the actual `decision`, the presence of the expected statutory citation,
   and (where relevant) the actual routing array — not a manual read-through
   of the code predicting what it would do.
4. All 35 cases were run in Node.js, with no network calls, no AI, and no
   external dependencies — fully reproducible from the tool source alone.

**One honest note on process:** the first draft of RET-01-16 initially
targeted the wrong code path (assumed the vendor-relationship FYI routing
lived in the `institutional` category branch; it actually lives in the
`private` category branch). Running the test against the real engine
caught this immediately — the test failed because the routing array didn't
contain the expected entry. This was an error in the test's assumption,
not a bug in the tool; it's noted here because it's a small, concrete
demonstration of exactly why executing a test suite against real code
finds things that reading the code carefully can still miss.

---

## RET-01: Pre-Clearance Determination System

**Result: 20 / 20 passed.**

Covers all six recipient categories, the red-flag override that supersedes
category-based routing entirely, and every dollar/frequency threshold
boundary in the engine (`rules-engine v1.1.0`).

| ID | Case | Expected | Actual | Result |
|---|---|---|---|---|
| RET-01-01 | Red flag (pending matter) overrides a low-risk category | escalate_legal | escalate_legal | ✅ |
| RET-01-02 | Red flag (solicited) overrides private/customer category | escalate_legal | escalate_legal | ✅ |
| RET-01-03 | Foreign official, value exactly $50 (log threshold boundary) | approved | approved | ✅ |
| RET-01-04 | Foreign official, value $51 (one over threshold) | escalate_legal | escalate_legal | ✅ |
| RET-01-05 | Foreign official, pending matter present, low value ($10) | escalate_legal | escalate_legal | ✅ |
| RET-01-06 | Active examiner, trivial value ($1) | escalate_legal | escalate_legal | ✅ |
| RET-01-07 | US official, state level (outside deterministic scope) | escalate_compliance | escalate_compliance | ✅ |
| RET-01-08 | US official, federal legislative branch (outside deterministic scope) | escalate_compliance | escalate_compliance | ✅ |
| RET-01-09 | Federal executive official, $20 occasion + $0 prior = $20 (boundary) | approved | approved | ✅ |
| RET-01-10 | Federal executive official, $21 (one over occasion limit) | escalate_compliance | escalate_compliance | ✅ |
| RET-01-11 | Federal executive official, $15 + $40 prior = $55 (annual aggregate exceeded) | escalate_compliance | escalate_compliance | ✅ |
| RET-01-12 | Institutional entertainment, 4th occasion this year (boundary) | approved | approved | ✅ |
| RET-01-13 | Institutional entertainment, 5th occasion this year | escalate_compliance | escalate_compliance | ✅ |
| RET-01-14 | Institutional gift, $250 prior + $50 = $300 (FINRA boundary) | approved | approved | ✅ |
| RET-01-15 | Institutional gift, $250 prior + $51 = $301 (one over) | escalate_compliance | escalate_compliance | ✅ |
| RET-01-16 | Private category, vendor relationship — approved AND Vendor Management FYI routed | approved + routed | approved + routed | ✅ |
| RET-01-17 | Insider, non-credit benefit (general COI policy, not Reg O) | escalate_compliance | escalate_compliance | ✅ |
| RET-01-18 | Insider, credit-related benefit (Regulation O) | escalate_compliance | escalate_compliance | ✅ |
| RET-01-19 | Private customer, $200 prior + $50 = $250 (general ceiling boundary) | approved | approved | ✅ |
| RET-01-20 | Private customer, $200 prior + $51 = $251 (one over) | escalate_compliance | escalate_compliance | ✅ |

**What this suite does not cover:** input validation/sanitization (e.g.,
negative values, non-numeric input), and the free-text recipient-identity
aggregation risk already documented as P2 gap #6 in the Pre-Clearance gap
register — that's a data-integrity gap upstream of this engine, not
something a logic test against clean inputs would catch.

---

## RET-02: Regulation O Insider Credit Threshold Tool

**Result: 15 / 15 passed.**

Covers both branches of the engine (overdraft prohibition, extension-of-credit),
all three threshold layers in the credit branch (executive-officer sub-cap,
individual board-approval trigger, bank-wide aggregate ceiling), their
interaction order, and the small-bank 2× exception (`rules-engine v1.0.0`).
All dollar thresholds below are computed from the tool's demo bank
configuration (`$50,000,000` capital, not small-bank unless noted) —
the same defaults the tool ships with.

| ID | Case | Expected | Actual | Result |
|---|---|---|---|---|
| RET-02-01 | Overdraft, principal shareholder (prohibition doesn't apply) | approved | approved | ✅ |
| RET-02-02 | Overdraft, executive officer, pre-authorized plan in place | approved | approved | ✅ |
| RET-02-03 | Overdraft, no plan, exactly at exception boundary ($1,000/5 days/same fee) | approved | approved | ✅ |
| RET-02-04 | Overdraft, no plan, $1,001 (one over exception amount) | prohibited | prohibited | ✅ |
| RET-02-05 | Overdraft, no plan, amount/days fine but not the standard fee | prohibited | prohibited | ✅ |
| RET-02-06 | Credit, terms comparison not confirmed | escalate_terms | escalate_terms | ✅ |
| RET-02-07 | Exec officer "other purpose," exactly at $100,000 sub-cap boundary | approved | approved | ✅ |
| RET-02-08 | Exec officer "other purpose," $100,001 (one over sub-cap) | prohibited | prohibited | ✅ |
| RET-02-09 | Exec officer "other purpose," $99,000 prior + $2,000 = $101,000 (aggregation) | prohibited | prohibited | ✅ |
| RET-02-10 | Director, exactly at $2,500,000 board-trigger boundary | approved | approved | ✅ |
| RET-02-11 | Director, $2,500,001 (one over board trigger) | board_approval | board_approval | ✅ |
| RET-02-12 | Principal shareholder, $2M prior + $600K = $2.6M (aggregation triggers board review) | board_approval | board_approval | ✅ |
| RET-02-13 | Small individual exposure ($600K), but bank-wide total hits $50.1M — ceiling check takes priority over the individual trigger | blocked_aggregate | blocked_aggregate | ✅ |
| RET-02-14 | Bank-wide total exactly at $50,000,000 ceiling boundary | approved | approved | ✅ |
| RET-02-15 | Same transaction as RET-02-13, but small-bank 2× exception applies ($100M ceiling) | approved | approved | ✅ |

**What this suite does not cover:** the check-order interaction wasn't
just assumed — RET-02-13 specifically exists to prove the bank-wide
ceiling check fires *before* the individual board-approval trigger, using
a case where the individual insider's own exposure is small enough that it
would pass its own trigger on its own. That ordering is a real, easy place
for a re-implementation to get subtly wrong, and it's the single most
valuable case in this sub-suite for exactly that reason.

---

## Rolled-up status

| Tool | Cases | Result | Rules-engine version tested |
|---|---|---|---|
| Pre-Clearance Determination System | 20 | ✅ 20/20 passed | v1.1.0 |
| Reg O Insider Credit Threshold Tool | 15 | ✅ 15/15 passed | v1.0.0 |
| **Total** | **35** | **✅ 35/35 passed** | — |

## What this suite proves, and what it doesn't

**Proves:** for the 35 scenarios above — chosen to cover every branch and
every threshold boundary in both engines — the code's decision matches
what the cited regulation actually requires. Both engines correctly handle
boundary conditions (the difference between `>` and `>=` at every
threshold), correctly aggregate prior totals rather than evaluating each
transaction in isolation, and correctly order competing checks where more
than one applies (Reg O's bank-wide ceiling before the individual trigger;
the Pre-Clearance red-flag override before category routing).

**Doesn't prove:** that these are the *right* thresholds for a given
institution (both gap registers already flag firm-policy numbers like the
general-customer ceiling as institution-specific choices, not something
this project can assert), that the UI correctly captures and passes these
inputs to the engine (this suite calls `evaluate()` directly, bypassing
the DOM), or anything about the production gaps — auth, storage, tamper
resistance — documented separately in each tool's gap register.

## Re-running this suite

The test harnesses and byte-verified extracted engines are committed at
[`tests/anti-bribery-coi/`](../tests/anti-bribery-coi) — `pc_engine.js` /
`pc_tests.js` for the Pre-Clearance suite, `rego_engine.js` / `rego_tests.js`
for the Reg O suite. No dependencies beyond Node.js: `node pc_tests.js` and
`node rego_tests.js` reproduce the results above directly. Any future
`RULES_ENGINE_VERSION` bump in either tool is the trigger to re-extract and
re-run — the same change-management discipline used for model versioning
elsewhere in this project, applied to deterministic code instead of a model.

---

## Status

✅ Both sub-suites executed 2026-07-09. 35/35 passing. This is the one
Layer-4-equivalent artifact for Anti-Bribery/COI that is genuinely
*validated*, not just designed — unlike the Fair Lending eval suites,
which remain specified but unexecuted as of this review.
