# AML/KYC — OFAC Triage Agent Deterministic Pre-Check (executable)

Real test code, not a spec. See `docs/eval-ofac-triage-agent.md` for the
full write-up, including what this suite covers and what it deliberately
doesn't (the live-mode AI narrative, which needs a human rubric, not a
100%-pass regression test — that part remains designed, not executed,
consistent with this project's other AI evals).

`ofac_engine.js` is the deterministic pre-check logic (`normalizeName`,
`nameSimilarity`, `parseYear`, `compareDOB`, `compareText`, `evaluateTriage`)
extracted **byte-identical** from `agents/ofac-triage-agent.html` — confirmed
programmatically at extraction time, not just visually checked. This is the
part of the agent that runs the same way every time regardless of whether
an API key is present; it's what "fallback mode" actually is, and it's also
the pre-check the live-mode prompt is given as context.

## Run it yourself

No dependencies beyond Node.js.

```
node ofac_tests.js
```

Should print `PASS: 8 / 8` with every case ✅.

## A note on process

The first version of this decision logic had a real bug, caught by running
this exact test suite before shipping: it required *low* name similarity to
reach a false-positive determination, which is backwards. The classic OFAC
false-positive pattern is a *high*-similarity name (that's why it got
flagged in the first place) ruled out by a mismatching secondary identifier
— not a dissimilar name. The fix and the reasoning are in the agent's
source comments directly above `evaluateTriage()`.

## When to re-run

Any time `agents/ofac-triage-agent.html`'s deterministic pre-check logic
changes, re-extract the six functions into `ofac_engine.js` and re-run —
same change-management discipline used elsewhere in this project.
