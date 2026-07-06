# Layer 1 — Regulatory Map

Scope: AML / KYC / sanctions, and regulatory change management as a discipline
in its own right. This is the foundation everything else (control matrix,
agents, governance) is built on top of — it needs to stay accurate and current,
which is itself the use case for the reg-change-monitor agent.

> Status: v0, partially verified via web search on 2026-06-20. Primary-source
> links included where found. This document is itself a live example of why
> the reg-change-monitor agent matters — see the "Verified change" note
> on the CDD Rule entry below, which shifted materially as recently as
> February 2026.

---

## A. Core AML / KYC Framework (U.S.)

| Regulation / Authority | What it requires | Who enforces it |
|---|---|---|
| Bank Secrecy Act (BSA) | Foundational AML recordkeeping and reporting requirements for financial institutions | FinCEN / federal banking regulators |
| USA PATRIOT Act (Title III) | Expanded BSA; introduced CIP (Customer Identification Program) requirements | FinCEN |
| FinCEN CDD Rule | Customer Due Diligence — financial institutions must identify and verify beneficial owners (25%+ ownership or control) of legal entity customers, understand the nature/purpose of customer relationships, and conduct ongoing monitoring. **See verified change below — this requirement was narrowed in Feb 2026.** | FinCEN |
| OFAC Sanctions Programs | Prohibits transactions with sanctioned individuals/entities/countries. Screening is performed against the SDN List and the broader Consolidated Sanctions List (which also includes the Sectoral Sanctions Identifications List and Foreign Sanctions Evaders List). A confirmed SDN match must be blocked and reported to OFAC within 10 business days. | OFAC (Treasury) |
| Suspicious Activity Reports (SAR) | Mandatory reporting of suspicious transactions above defined thresholds/patterns | FinCEN |
| Currency Transaction Reports (CTR) | Mandatory reporting of cash transactions over $10,000 | FinCEN |
| Corporate Transparency Act (CTA) / Beneficial Ownership Information (BOI) Reporting | Originally required most U.S. legal entities to report beneficial ownership to FinCEN. **Largely repealed for domestic entities as of March 2025 — see verified change below.** | FinCEN |

### Verified regulatory changes (examples of live drift in this space)

These are real, dated changes confirmed via web search — included specifically
to demonstrate the kind of update a reg-change-monitor agent needs to catch:

1. **CDD Rule — beneficial ownership re-verification narrowed (Feb 13, 2026).**
   FinCEN issued Order FIN-2026-R001, granting financial institutions
   exceptive relief from re-identifying and re-verifying beneficial owners
   *at every new account opening* for existing relationships. FinCEN noted
   the CDD Rule FAQs were still being updated to reflect this at time of
   writing. Source: fincen.gov/resources/statutes-and-regulations/cdd-final-rule
2. **CTA/BOI reporting — repealed for domestic entities (March 21, 2025).**
   Treasury/FinCEN issued an interim final rule removing the BOI reporting
   requirement entirely for U.S.-created entities and their beneficial
   owners; only certain foreign-registered entities remain in scope.
   This reverses what was, as of 2023–2024, treated as a major new
   compliance obligation. Source: fincen.gov/boi
3. **OFAC SDN additions are ongoing and political-event-driven.** E.g., a
   sitting head of state was added to the SDN list in Oct 2025, illustrating
   that sanctions lists change in response to geopolitical events, not on a
   predictable schedule — reinforcing why this needs continuous monitoring
   rather than periodic manual checks. Source: Corporate Compliance Insights,
   "The State of OFAC Sanctions Enforcement in 2025-26"

**Note on sourcing quality:** several search results for OFAC requirements
were SEO/marketing content from sanctions-law-adjacent sites rather than
primary sources. Treasury/FinCEN/OFAC .gov pages were treated as authoritative;
others as directional only and flagged accordingly. This distinction —
primary regulatory source vs. secondary commentary — should be a built-in
filter in the agent itself (Layer 3/4 concern).

## B. Regulatory Change Management — as its own discipline

This isn't a single regulation — it's the operational practice of staying
current as the above (and related) rules evolve. This is also the direct
target of the first agent we're building.

**What "staying current" actually requires:**
- Monitoring primary sources (FinCEN advisories, OFAC updates/designations,
  Federal Register filings, agency guidance/FAQs)
- Triaging relevance (does this change apply to our business lines / customer
  types / geographies?)
- Translating regulatory language into control/process impact
- Tracking effective dates and implementation deadlines
- Maintaining an auditable record of what changed, when it was identified,
  and what action was taken

**Primary sources to track (candidates for the agent to monitor):**
- FinCEN.gov — News & Advisories
- OFAC Recent Actions (sanctions list updates)
- Federal Register (rule proposals/finalizations)
- Agency FAQs and guidance updates

---

## Next steps for this document

- [x] Verify core regulation entries against primary/authoritative sources (BSA, CDD Rule, OFAC, CTA/BOI) — done 2026-06-20
- [x] Document a concrete example of recent regulatory drift (CDD Rule narrowing, CTA repeal)
- [ ] Add full citation links for BSA and PATRIOT Act / CIP entries (not yet pulled)
- [ ] Expand beneficial ownership / CDD detail post-FAQ update from FinCEN
- [ ] Add international angle if relevant (e.g., FATF recommendations, OFSI/EU lists) — TBD scope decision
- [ ] Cross-reference each row to its corresponding control(s) in Layer 2
