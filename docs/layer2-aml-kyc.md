# Layer 2 — Control Matrix

Maps each regulatory obligation from [Layer 1](layer1-aml-kyc.md) to the
control(s) firms actually use to satisfy it today, who/what executes the
control, and how it's currently done (manual, tool-assisted, or automatable).

The right-most column is the design target for Layer 3 — it's the honest
answer to "what would an agent actually replace or assist here, and what
shouldn't it touch."

---

## A. AML / KYC / Sanctions Controls

| Regulation | Control | Typical execution today | Automation potential |
|---|---|---|---|
| BSA | AML program with written policies, designated compliance officer, training, independent testing | Manual / governance — policy + audit, not a single tool | Low direct automation; agents can support evidence-gathering for independent testing |
| PATRIOT Act / CIP | Identity verification at account opening (name, DOB, address, ID number) | Tool-assisted — ID verification vendors, document scanning | High — already largely automated industry-wide; agent value is in exception handling |
| CDD Rule | Beneficial ownership identification & verification (25%+ owners), risk profiling, ongoing monitoring | Mixed — initial collection often manual/form-based, ongoing monitoring tool-assisted | Medium-high — agent can flag when re-verification is/isn't required post the Feb 2026 exceptive relief, reducing unnecessary friction |
| OFAC Sanctions | Screen customers/transactions against SDN List + Consolidated Sanctions List; block + report confirmed matches within 10 business days | Tool-assisted — most institutions use automated real-time screening APIs; **false-positive triage is still heavily manual** | **High — this is the clearest agent use case.** Name-matching/fuzzy-match triage, explaining *why* a match was flagged, is well-suited to an LLM-assisted review layer |
| SAR filing | Investigate suspicious activity, document rationale, file with FinCEN | Manual investigation + tool-assisted case management | Medium — agent can draft narrative summaries from case data for human review, not file independently |
| CTR filing | Report cash transactions >$10,000 | Largely automated (threshold-based trigger) | Already automated; low incremental value |
| Reg-change tracking | Monitor FinCEN/OFAC/Federal Register, assess relevance, update policy/procedures | **Almost entirely manual today** — compliance staff periodically check agency sites/newsletters | **High — this is the first agent we're building.** Clear gap between "should be continuous" and "is in practice periodic" |

---

## B. Why OFAC screening + reg-change monitoring are the right starting points

Looking at the "automation potential" column above, two things stand out:

1. **OFAC false-positive triage** — real-time screening already exists as a
   tool category, but a huge amount of analyst time goes to reviewing
   *fuzzy matches* (e.g., "John A. Smith" vs. an SDN entry for "Jon Smith")
   that are almost always false positives. This is a strong fit for an
   LLM-assisted reasoning layer — not because screening itself needs
   reinventing, but because *explaining and triaging matches* is a language
   and judgment task.

2. **Regulatory change monitoring** — this is currently the least automated
   control in the entire matrix despite being conceptually simple (watch
   sources, summarize, flag relevance). It's the one place where "nobody has
   really built this well yet" is plausible, which makes it a good
   differentiated demo.

This validates the build order already chosen: **reg-change-monitor agent
first**, OFAC-screening-triage agent as a strong second candidate.

> **Update:** the reg-change-monitor agent described above has since been
> built — see [`reg-change-monitor.html`](../reg-change-monitor.html) — and was
> extended beyond AML/KYC alone to cover Fair Lending and SCRA as well,
> since regulatory change monitoring is inherently a cross-domain,
> second-line function rather than an AML/KYC-specific one.

---

## Next steps for this document

- [ ] Validate the "typical execution today" column against real vendor/industry practice (not just inference) — consider searching for actual AML platform vendor docs (e.g., how Actimize, ComplyAdvantage, etc. describe their workflows) to ground this
- [ ] Add a row for KYC periodic refresh cadence (risk-based — high/medium/low risk customers)
- [ ] Cross-link each control row back to its Layer 1 regulation citation
- [x] As Layer 3 (reg-change-monitor) is built, add a column showing actual automation status — see update note above
