# Fair Lending — Executed Eval Suites (FL-EVAL-01 and FL-EVAL-02's deterministic portions)

Real test code, not a spec. See `docs/eval-suites-fair-lending-agents.md`
for the full write-up.

## What's here

- `hmda_engine.js` / `hmda_tests.js` — **FL-EVAL-01**, all 14 cases. The
  HMDA Reportability Calculator has zero AI, so this is a complete,
  100%-executable regression suite. **14/14 passing.**
- `aav_engine.js` / `aav_tests.js` — **FL-EVAL-02 sub-suites 5a (timing)
  and 5b (SPCP screen)**, both fully deterministic. **11/11 passing**
  (5 timing + 5 SPCP + 1 additional check that all flagged characteristics
  are actually named in the output, not just counted).
- `fallback_engine.js` / `fallback_tests.js` — **FL-EVAL-02 sub-suite 5c**,
  the 5 of 6 cases gradable in fallback mode with no API key. **5/5
  passing.** The sixth case (A-04) specifically tests whether live AI mode
  adds value over fallback's conservative keyword match, and needs both a
  live API call and a human-confirmed answer before it can be graded —
  see the doc for why that's not a gap in this test run, it's the point
  of the case.

## What running this did and didn't validate

Running these suites moved FL-EVAL-01 and FL-EVAL-02's 5a/5b/5c(partial)
from "designed, not executed" to executed and passing. It did **not**
change any Model Risk Register entry's validation status — MRM-005 (the
Adverse Action Validator's live-mode model) stays "not validated," because
none of this exercised the actual AI model. Fallback mode is deterministic
by design; testing it thoroughly proves the deterministic floor is solid,
not that the model built on top of it is sound.

## A real discrepancy this run caught

The spec's case A-06 originally said fallback mode should "flag 3 of 4
missing elements." Running it found `fallbackReview()` only checks 2
heuristic markers (not the 4-item checklist that lives on a separate tab)
— so the correct expectation is 2 missing markers, not 3 of 4. The test
here is written against what the code actually does, with the discrepancy
documented rather than the test quietly rewritten to hide it.

## Run it yourself

No dependencies beyond Node.js.

```
node hmda_tests.js       # FL-EVAL-01 — 14 cases
node aav_tests.js        # FL-EVAL-02 5a + 5b — 11 checks
node fallback_tests.js   # FL-EVAL-02 5c (fallback-gradable) — 5 cases
```
