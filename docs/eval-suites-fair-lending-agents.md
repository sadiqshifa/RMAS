# Eval Suites — HMDA Reportability Calculator & Adverse Action Notice Validator

Companion to `docs/layer2-fair-lending.md`. Two agents, two very different eval
problems — worth stating that difference up front rather than treating "eval
suite" as one uniform thing across both.

**Note on IDs:** these suites are labeled `FL-EVAL-01` / `FL-EVAL-02` — a
test-suite naming scheme, not the Model Risk Register's `MRM-NNN` model
IDs. The two are not interchangeable: `FL-EVAL-01` is a unit-test suite for
deterministic code (the HMDA Calculator has no AI component at all), and
`FL-EVAL-02` only partially maps to a model — its sub-suites 5a/5b are also
deterministic-logic tests, and only sub-suite 5c exercises an actual AI
model, tracked separately in the register as **MRM-005**. Earlier drafts of
this doc reused `MRM-004`/`MRM-005` for these suite names, which collided
with the register's own ID for an unrelated model (Regulatory Change
Monitor); renamed here to remove that collision.

---

## FL-EVAL-01: HMDA Reportability Calculator

**What this eval suite actually validates:** there is no AI in this agent —
every determination is deterministic JavaScript implementing 12 CFR
§1003.2(g). So this suite is a **unit-test suite for regulatory logic**, not
an AI-output validation suite. That distinction matters for the Model Risk
Register: a passing suite here means "the code correctly implements the
rule as written," not "the model produces sound judgment." Auto-gradable,
100% — every case has one objectively correct answer.

**Status: ✅ executed 2026-07-10 — 14/14 passing.** Extracted byte-identical
from `agents/hmda-calculator.html` and run for real; see
[`tests/fair-lending/`](../tests/fair-lending).

### Depository institution test cases

| ID | Assets | MSA office | Loan activity | Federally related | CE Y1/Y2 | OE Y1/Y2 | Expected | Why |
|---|---|---|---|---|---|---|---|---|
| D-01 | $75M | Yes | Yes | Yes | 30/30 | 0/0 | REPORTABLE | All five tests pass with margin |
| D-02 | $59,000,000 | Yes | Yes | Yes | 30/30 | 0/0 | EXEMPT | Threshold is "exceeded" — exactly at $59M does not exceed it |
| D-03 | $59,000,001 | Yes | Yes | Yes | 30/30 | 0/0 | REPORTABLE | One dollar over threshold — boundary check |
| D-04 | $75M | No | Yes | Yes | 30/30 | 0/0 | EXEMPT | Fails location test alone |
| D-05 | $75M | Yes | No | Yes | 30/30 | 0/0 | EXEMPT | Fails loan-activity test alone |
| D-06 | $75M | Yes | Yes | No | 30/30 | 0/0 | EXEMPT | Fails federally-related test alone |
| D-07 | $75M | Yes | Yes | Yes | 24/24 | 199/199 | EXEMPT | Fails volume test both ways — one short on each path |
| D-08 | $75M | Yes | Yes | Yes | 25/25 | 0/0 | REPORTABLE | Passes volume via closed-end path only, exactly at minimum |
| D-09 | $75M | Yes | Yes | Yes | 0/0 | 200/200 | REPORTABLE | Passes volume via open-end path only, exactly at minimum |
| D-10 | $75M | Yes | Yes | Yes | 30/20 | 0/0 | EXEMPT | Volume must hold in *both* preceding years — fails year 2 |

### Non-depository institution test cases

| ID | MSA office | ≥5 loans in MSA | CE Y1/Y2 | OE Y1/Y2 | Expected | Why |
|---|---|---|---|---|---|---|
| N-01 | Yes | — | 30/30 | 0/0 | REPORTABLE | Location via office, volume passes |
| N-02 | No | Yes | 30/30 | 0/0 | REPORTABLE | Location via the loan-count alternative — no physical office needed |
| N-03 | No | No | 30/30 | 0/0 | EXEMPT | Fails location test entirely — high volume doesn't matter |
| N-04 | Yes | — | 24/24 | 199/199 | EXEMPT | Location passes, volume fails |

**Pass threshold:** 14/14. Any failure means the JS logic doesn't match the
regulation text and blocks deployment — there's no "partial credit" concept
for a deterministic rule implementation.

---

## FL-EVAL-02: Adverse Action Notice Validator

Three sub-suites, increasing in difficulty and decreasing in how confidently
they can be graded.

### 5a. Timing calculator (auto-gradable, deterministic)

| ID | Scenario | Input date | Expected deadline |
|---|---|---|---|
| T-01 | Completed application | 2026-08-01 | 2026-08-31 |
| T-02 | Incomplete application | 2026-08-01 | 2026-08-31 |
| T-03 | Existing account | 2026-08-01 | 2026-08-31 |
| T-04 | Counteroffer, no response | 2026-08-01 | 2026-10-30 |
| T-05 | Completed application, leap-year Feb boundary | 2028-01-31 | 2028-03-01 |

**Pass threshold:** 5/5. ✅ **Executed 2026-07-10 — 5/5 passing.**

### 5b. SPCP screen (auto-gradable, deterministic)

| ID | Timing | For-profit | Characteristics flagged | Expected |
|---|---|---|---|---|
| S-01 | Before Jul 21 | Yes | Race | GRANDFATHERED |
| S-02 | After Jul 21 | No | Race | N/A |
| S-03 | After Jul 21 | Yes | (none) | CLEAR |
| S-04 | After Jul 21 | Yes | Race | FLAGGED |
| S-05 | After Jul 21 | Yes | Race, Sex, National origin | FLAGGED (all three named) |

**Pass threshold:** 5/5. ✅ **Executed 2026-07-10 — 5/5 passing**, plus one
additional check that all three characteristics in S-05 are actually named
in the output, not just counted. Both sub-suites extracted byte-identical
from `agents/adverse-action-validator.html` and run for real; see
[`tests/fair-lending/`](../tests/fair-lending).

### 5c. AI-assisted draft review (rubric-based — the hard case) — tracked as MRM-005

This is the only sub-suite of either Fair Lending agent's eval spec that
exercises an actual AI model rather than deterministic logic; it's tracked
as **MRM-005** in the Model Risk Register (`governance/model-risk-register.html`).
It tests the one part of either agent that involves real
judgment: distinguishing a notice that *asserts* the old disparate-impact
standard as current law from one that merely *references* it in a
compliant, historical, or explanatory way. Fallback mode (keyword
matching) cannot make this distinction — it flags the phrase regardless of
context, by design, conservatively. Live mode is supposed to be able to.
That gap is exactly what this suite needs to measure, and it hasn't been
run yet.

| ID | Draft excerpt (paraphrased) | Correct fallback behavior | Correct live-mode behavior |
|---|---|---|---|
| A-01 | Denial notice with all four required elements present in plain modern language, no reference to disparate impact anywhere | No stale-language flags; no missing-element flags | Same — clean pass |
| A-02 | "This decision was made using an effects test analysis of applicant data" | FLAG — contains "effects test" | FLAG — this asserts current use of a standard that no longer applies; correctly flagged |
| A-03 | Notice missing the ECOA notice provision entirely, otherwise clean | No stale-language flag; DOES flag missing required element | Same |
| A-04 | "Our prior underwriting policy relied on effects-test analysis, which was discontinued following the April 2026 rule change" | FLAG (keyword match can't tell this is historical/explanatory, not a live compliance problem) — **expected false positive, document as known limitation** | Should NOT flag, or should flag with a note that this is a compliant historical reference — this is the key differentiator between fallback and live value |
| A-05 | Notice using "adverse impact analysis" in a marketing-adjacent sentence unrelated to the credit decision itself | FLAG (keyword present) | Judgment call — worth seeing whether live mode over- or under-flags marketing-adjacent language |
| A-06 | Very short, boilerplate-thin notice with only "application denied" and nothing else | Flags 2 of 2 missing heuristic markers (corrected 2026-07-10 — see note below; original spec said "3 of 4," which referred to a different, 4-item checklist on a separate tab) | Same |

**Status:** ✅ **executed 2026-07-10 — 5 of 6 cases (A-01, A-02, A-03, A-05,
A-06) run against the real `fallbackReview()` function, byte-identical
extraction, all 5 passing.** See [`tests/fair-lending/`](../tests/fair-lending)
for the runnable suite. A-04 remains unrun — it needs (a) an actual
Anthropic API key for the live-mode column, and (b) a human — you — to
confirm the "correct" column reflects real judgment before treating live
output as graded against it. **This suite cannot be marked "validated" in
the Model Risk Register until both of those happen for A-04**, and running
the other 5 cases does not change MRM-005's status either — fallback mode
is deterministic by design, so passing it validates the keyword-match
floor, not the AI model MRM-005 actually tracks.

**One real discrepancy this run found:** A-06's original expected behavior
said fallback mode should "flag 3 of 4 missing elements." Running it
against the actual `fallbackReview()` code found it only checks 2
heuristic markers (`REQUIRED_MARKERS`), not the 4-item checklist that
lives on the separate Tab 2 content checker — so the correct fallback
behavior is 2 missing markers, not 3 of 4. Fixed above; the test in
`tests/fair-lending/fallback_tests.js` is written against what the code
actually does, with this noted rather than silently corrected.

---

## Rolled-up status for the Model Risk Register

| Agent | Sub-suite | Auto-gradable | Status |
|---|---|---|---|
| HMDA Calculator | Full logic (FL-EVAL-01) | Yes | ✅ Executed 2026-07-10 — 14/14 passing |
| Notice Validator | Timing (5a) | Yes | ✅ Executed 2026-07-10 — 5/5 passing |
| Notice Validator | SPCP screen (5b) | Yes | ✅ Executed 2026-07-10 — 5/5 passing |
| Notice Validator | AI draft review (5c → MRM-005 in the Model Risk Register) | Partial — 5 of 6 cases; A-04 requires human judgment call | ✅ 5/6 executed in fallback mode, passing. 🚧 A-04 blocked on API key + human-confirmed answer. MRM-005 remains **not validated** — none of this exercised the actual AI model |

Recommend the same three-state badge pattern used for the Calculations
agent: these land as **"Designed — not yet executed"** rather than
"Not validated," since a written, reviewable test spec is a meaningfully
different state than no spec existing at all — but neither should read as
"validated" until the cases actually run.

## Next steps

- [x] Manually execute FL-EVAL-01 against the built calculator (14 cases, no AI, fast) — done 2026-07-10, 14/14 passing, see tests/fair-lending/
- [x] Execute FL-EVAL-02 sub-suites 5a and 5b (deterministic) — done 2026-07-10, 10/10 passing
- [x] Execute FL-EVAL-02 sub-suite 5c's fallback-gradable cases (A-01, A-02, A-03, A-05, A-06) — done 2026-07-10, 5/5 passing
- [ ] Execute FL-EVAL-02 sub-suite 5c's case A-04 — blocked on an Anthropic API key for the live-mode call, and a human-confirmed answer for what "correct" means on this specific case, before it can be graded at all
- [ ] Manually execute 5a/5b against the built validator (10 cases, no AI, fast)
- [ ] Run 5c fallback-mode cases (5 of 6, no API key needed)
- [ ] Get a second opinion on the "correct" column for A-04 before running it live
- [ ] Run 5c live-mode cases once a key is available; compare against fallback
- [ ] Update Model Risk Register with actual pass/fail results, not just suite design
