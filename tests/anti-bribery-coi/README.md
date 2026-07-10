# Anti-Bribery/COI — Rules-Engine Test Suite (executable)

Real test code, not a spec. See
`docs/rules-engine-test-suite-anti-bribery-coi.md` for the full write-up,
methodology, and results table.

`pc_engine.js` and `rego_engine.js` are the `evaluate()` functions and
threshold constants extracted **byte-identical** from
`tools/pre-clearance-tool.html` and `tools/reg-o-insider-credit-tool.html`
respectively — confirmed programmatically at extraction time, not just
visually checked.

## Run it yourself

No dependencies beyond Node.js.

```
node pc_tests.js     # Pre-Clearance Determination System — 20 cases
node rego_tests.js   # Regulation O Insider Credit Threshold Tool — 15 cases
```

Both should print `PASS: N / N` with every case ✅.

## When to re-run

Any time either tool's `RULES_ENGINE_VERSION` constant changes, re-extract
the `evaluate()` function and constants into the matching `*_engine.js`
file here and re-run — the same change-management trigger used for model
versioning elsewhere in this project, applied to deterministic code
instead of a model.
