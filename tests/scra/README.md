# SCRA — DMDC Agent's Existing Eval Suite, Executed Externally

Real test code, not a spec. The SCRA DMDC Agent (`agents/scra-dmdc-agent.html`)
already has a built-in "Eval Suite" tab with a "Run Full Eval Suite" button
— this isn't a new test suite, it's that same suite (`EVAL_CASES`,
`simulateResult()`), extracted byte-identical and run outside the browser
so the result is a permanent, reproducible record instead of something you
have to click a button in a live demo to see.

**Result: 6/6 passing** — TC-01 through TC-06, covering routing, gate
behavior (including fail-closed on a timeout), certificate generation, and
the institution-wide sweep logic.

## What this does and doesn't validate

This suite tests **deterministic routing, gate, and certificate logic only**
— it does not touch the AI-generated clearance narrative (MRM-001) or the
AI-based trigger recognition on the Notice Intake tab (MRM-002). Running
this suite, and running it clean, does not change either model's status in
the Model Risk Register — both remain **not validated**, exactly as before.
That's not a gap in this test run; it's the Model Risk Register correctly
scoping what this suite was ever designed to cover.

MRM-001 and MRM-002 remain blocked on building genuinely new eval cases
against the AI-generated narrative text and trigger-recognition behavior —
see the remediation roadmap in `docs/model-risk-management-framework.md`.

## Run it yourself

No dependencies beyond Node.js.

```
node dmdc_tests.js
```
