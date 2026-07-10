# Eval Suite — OFAC Screening Triage Agent

Companion to `docs/layer2-aml-kyc.md`, whose own analysis named this agent
as AML/KYC's Layer 3. Like the Fair Lending agents and the Anti-Bribery/COI
tools, this agent has two genuinely different validation problems bundled
under one artifact, and they get different treatment rather than being
forced into one eval style.

## Part 1 — Deterministic pre-check (executed)

**Result: 8/8 passed.** The name-similarity scoring and secondary-identifier
comparison logic (`normalizeName`, `nameSimilarity`, `parseYear`,
`compareDOB`, `compareText`, `evaluateTriage`) was extracted **byte-identical**
from `agents/ofac-triage-agent.html` — confirmed programmatically, not just
read — and run as real function calls, not a description of expected
behavior. Full results, methodology, and the runnable test files are at
[`tests/aml-kyc/`](../tests/aml-kyc).

This is the part of the agent that runs identically whether or not an API
key is present — it's what "fallback mode" is, and it's also the structured
context the live-mode prompt is given. All three of the agent's own demo
scenarios are included as OFAC-01/02/03, plus five additional boundary
cases (OFAC-04 through 08) covering: zero identifiers available, low name
similarity with no identifiers, a country-only match, and DOB range
matching/mismatching at the year boundary.

**One thing worth stating plainly:** the first version of the decision
logic was wrong. It required *low* name similarity to reach a
false-positive determination — backwards, since the classic OFAC false
positive is a *high*-similarity name (that's why it was flagged) ruled out
by a mismatching identifier, not a dissimilar name that happened to trip
the screening system. Running OFAC-01 and OFAC-08 against the first draft
failed immediately and caught this before the agent shipped. The fix is in
the source, with the reasoning left in a comment directly above
`evaluateTriage()` rather than quietly corrected.

## Part 2 — Live-mode AI narrative (designed, not executed)

The live-mode call adds judgment the deterministic pre-check can't:
transliteration variants, cultural name-ordering differences, how much an
alias (AKA) hit should change the read, and how much weight a missing
identifier should carry. That's a rubric problem, not a 100%-pass
regression problem, the same category as MRM-002 and MRM-005 elsewhere in
this project. This agent's live-mode model is tracked as **MRM-006** in the
Model Risk Register.

**AML-EVAL-01 — proposed rubric (6 cases, not yet run):**

| Case | Setup | What the rubric checks |
|---|---|---|
| 1 | Same as OFAC-01 (common name, DOB decades off) | Correctly reads as likely false positive; does not use "clear" or "confirm" language — only "recommend," with BSA sign-off stated |
| 2 | Same as OFAC-02 (exact name+country match, DOB missing) | Correctly identifies the missing DOB as the specific gap to resolve, not a vague "needs more info" |
| 3 | Same as OFAC-03 (all four identifiers match) | Correctly escalates and explicitly cites the 10-business-day blocking/reporting requirement |
| 4 | Alias (AKA) hit, moderate name similarity, no other identifiers | Reasons about whether an alias match should carry different weight than a primary-name match, rather than treating them identically |
| 5 | Name with an obvious transliteration variant (e.g., "Mohammed" vs. "Muhammad") that the deterministic token-overlap score would under-score | Recognizes the transliteration pattern explicitly — this is the specific case the deterministic pre-check is weakest at, and the reason live mode should add value at all |
| 6 | A case where the deterministic pre-check says "requires review" and no new information is given | Does not manufacture false confidence in either direction — states the same ambiguity the pre-check found, doesn't invent a stronger read than the inputs support |

Case 5 is the one that matters most: it's a direct test of whether live
mode earns its keep over fallback, the same design principle used in
FL-EVAL-02's sub-suite 5c for the Adverse Action Validator.

## What this eval does not cover

Input validation, the UI's field-to-function wiring (the pre-check tests
call `evaluateTriage()` directly, bypassing the DOM), and anything about
production-readiness — this agent has no gap register yet, unlike the two
Anti-Bribery/COI tools, which is itself worth building before this agent
would be treated as more than a portfolio demonstration.

## Status

✅ Part 1 executed, 8/8 passing, 2026-07-09. 🚧 Part 2 (AML-EVAL-01)
specified above, zero cases run — same status as MRM-002 and MRM-005.
