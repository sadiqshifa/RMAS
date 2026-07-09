# Layer 1 — Regulatory Map: Anti-Bribery/Corruption & Conflicts of Interest

Scope: gifts, entertainment, and hospitality involving customers, vendors,
and government officials; anti-bribery/corruption obligations (domestic and
foreign); and conflicts-of-interest management. This is the regulatory
foundation for the pre-clearance workflow tool — the first Layer 3 artifact
in RMAS that is **not** an AI agent. That distinction matters enough to flag
here at Layer 1: this domain is a strong candidate precisely because most of
its controls are rule-based threshold checks, not judgment calls requiring
language understanding.

> Status: v0, verified via web search on 2026-07-08. Primary-source links
> included where found. This domain has an unusually sharp split in its
> drift profile — see Section B — which is itself a useful data point for
> RMAS's broader "different domains drift differently" thesis.

---

## A. Core Framework

| Regulation / Authority | What it requires | Who enforces it |
|---|---|---|
| Foreign Corrupt Practices Act (FCPA) — anti-bribery provisions (15 U.S.C. §§ 78dd-1 et seq.) | Prohibits corruptly offering, giving, or promising anything of value to a foreign official to obtain or retain business | DOJ (criminal) / SEC (civil, issuers) |
| FCPA — accounting provisions (books & records, internal controls) | Requires issuers to keep accurate books/records and maintain adequate internal accounting controls sufficient to prevent and detect bribery | SEC |
| Bank Bribery Act (18 U.S.C. § 215) | Prohibits corruptly giving/offering, or a bank official corruptly soliciting/receiving, anything of value in connection with the business of a federally regulated financial institution | DOJ, with federal banking agencies (Fed/OCC/FDIC/NCUA) issuing compliance guidelines |
| Bribery of Public Officials (18 U.S.C. § 201) | Prohibits corruptly giving, offering, or promising anything of value to a federal public official to influence an official act | DOJ |
| FINRA Rule 3220 (Gifts Rule) / MSRB Rule G-20 | Caps the value of gifts a broker-dealer or associated person may give to an employee of an institutional customer, vendor, or counterparty in relation to that employer's business | FINRA / MSRB |
| Federal employee gift rules (5 CFR § 2635, Subpart B) | Governs what a federal employee may accept from an outside source — relevant to a bank's own policy design when the *recipient* of a gift/entertainment offer is a government official | Office of Government Ethics (OGE); enforced at the agency level |
| Regulation O (12 CFR Part 215) | Governs extensions of credit and other benefits to a bank's own insiders (executive officers, directors, principal shareholders) — the conflicts-of-interest control most specific to banking | Federal Reserve / OCC / FDIC |
| General conflicts-of-interest expectations | No single statute — addressed through safety-and-soundness supervisory expectations that institutions maintain codes of conduct covering COI, self-dealing, and outside business activities | Federal banking agencies (examination-based, not a standalone rule) |

### Verified regulatory changes (examples of live drift in this space)

1. **FCPA enforcement — paused, then restarted under narrower priorities (Feb 2025 → June 2025, ongoing calibration into 2026).**
   <cite index="12-1">On February 10, 2025, an executive order paused FCPA enforcement for 180 days pending a review of enforcement policies and guidelines</cite>. <cite index="6-2">In June 2025, DOJ issued new FCPA enforcement guidelines directing prosecutors to focus on cases involving threats to U.S. national security or economic competitiveness, cartel/TCO-linked schemes, and substantial or well-concealed bribery, deprioritizing routine, lower-dollar conduct</cite>. <cite index="12-3">FCPA enforcement activity in 2025 was the lowest level of publicly announced activity since formal tracking began in 2010</cite>, though <cite index="11-2">DOJ officials have described the shift as a "pivot" rather than a "sea change," and enforcement continues on a narrower band</cite>. Source: DOJ FCPA Unit guidance; law-firm year-in-review summaries (Cleary Gottlieb, WilmerHale, DLA Piper, Foley Hoag) cross-checked against each other.
2. **FINRA Rule 3220 (Gifts Rule) — annual gift limit tripled from $100 to $300, effective March 30, 2026.** <cite index="18-1">FINRA adopted amendments to Rule 3220 to increase the gift limit, codify existing guidance and interpretations, update gift valuation methodology, and create a mechanism for exemptive relief</cite> — <cite index="23-2">the first change to the limit since the rule was adopted in 1992</cite>. Conforming increases apply to <cite index="18-1">Rules 2310, 2320, 2341, and 5110</cite>. Source: FINRA Regulatory Notice 26-05.
3. **MSRB Rule G-20 — conforming amendment following FINRA, staggered compliance dates.** <cite index="20-4">The compliance date is June 1, 2026 for FINRA-member dealers, but municipal advisors and bank dealers that are not FINRA members do not become subject to the amended rule until December 1, 2026</cite> — meaning bank-affiliated municipal dealers remain on the old $100 limit for several months after their broker-dealer peers move to $300. This staggered-effective-date pattern is itself worth flagging as a control-matrix gap risk for institutions with both dealer types.
4. **Federal employee gift de minimis rule (5 CFR § 2635.204) — stable, for contrast.** <cite index="36-1">Federal employees may accept unsolicited gifts of $20 or less per source per occasion, up to $50 aggregated from that source in a calendar year</cite>, a threshold that <cite index="43-1">OGE has considered and declined to raise even as commenters cited inflation</cite> as recently as its last substantive rulemaking. This is a useful counterpoint to items 1–3: the rule governing what a *government-official recipient* may accept has stayed essentially frozen even while the rules governing what a *bank or broker-dealer may offer* have moved twice in the past 18 months.
5. **Regulation O (12 CFR Part 215) — specific insider-lending thresholds, verified against eCFR primary text (2026-07-09).** Unlike the general Layer 1 entry above, these are precise, citable numbers rather than a principle:
   - **Board pre-approval trigger:** an extension of credit to an insider, aggregated with all other outstanding extensions to that person and their related interests, that exceeds the higher of $25,000 or 5% of the bank's unimpaired capital and unimpaired surplus requires prior approval by a majority of the entire board, with the insider abstaining from the vote (12 CFR § 215.4(b)(1)–(2)).
   - **Executive-officer "other purpose" sub-cap:** credit extended to an executive officer for any purpose other than children's education, a first-lien home loan, or credit fully secured by specified collateral types is capped in the aggregate at the higher of 2.5% of unimpaired capital and surplus or $25,000, but never more than $100,000 — an absolute ceiling, not something a board can approve past (12 CFR § 215.5(c)(4)).
   - **Bank-wide aggregate insider limit:** total outstanding extensions of credit to all insiders combined cannot exceed the bank's unimpaired capital and surplus, unless the bank has under $100 million in deposits and has adopted an annual board resolution raising the ceiling to up to 2x that amount, subject to conditions (12 CFR § 215.4(d)).
   - **Preferential-terms prohibition:** every insider extension must be on substantially the same terms and underwriting standards as a comparable transaction with a non-insider (12 CFR § 215.4(a)) — this is the one element of Reg O that is a judgment call, not a threshold, and is treated as such in Layer 2.
   - **Overdraft prohibition:** a bank may not pay an overdraft for an executive officer or director absent a pre-authorized, interest-bearing repayment plan, subject to a narrow exception for inadvertent overdrafts of $1,000 or less outstanding no more than 5 business days (12 CFR § 215.4(e)); this does not apply to principal shareholders unless they are also an officer or director.

**Note on sourcing quality:** several results for FCPA enforcement trends were year-in-review pieces from law firms (Cleary Gottlieb, DLA Piper, WilmerHale, Foley Hoag, Alston & Bird, Paul Weiss) — these are credible secondary commentary from firms that track enforcement closely, cross-checked against each other for consistency, but are not primary regulatory text. FINRA Regulatory Notice 26-05 and the eCFR text of 5 CFR 2635.204 are primary sources. DOJ's own enforcement guidance memos exist but were not directly pulled in this pass — flagged as a follow-up.

## B. Why this domain has a distinctive drift profile

This is the sharpest split of any domain mapped so far:

- **FCPA criminal enforcement stringency is administration-driven and can swing sharply** — a 180-day enforcement pause followed by a materially narrower enforcement doctrine is not the kind of change a periodic-review cadence would catch quickly. This is the domain most analogous to the AML/OFAC "continuous monitoring, not periodic" argument.
- **SRO gift-limit rules (FINRA/MSRB) move through standard notice-and-comment rulemaking on a decades-long cadence** — Rule 3220 hadn't moved since 1992. When it does move, it moves for every affected firm at once, on a known effective date — a predictable, calendar-driven change, closer to HMDA's annual threshold adjustment than to FCPA's enforcement-posture volatility.
- **Government-side gift rules (5 CFR 2635) are essentially static** — relevant to this project mainly as a fixed reference point the pre-clearance tool needs to know about, not something requiring ongoing monitoring.

Net effect: a single pre-clearance tool in this domain has to encode both a
*fast-moving political variable* (is a given FCPA-adjacent scenario even a
current enforcement priority) and a *slow-moving deterministic variable*
(current dollar thresholds). That's a genuinely different shape of
regulatory-change risk than AML/KYC or Fair Lending, and worth stating
explicitly rather than treating all "regulatory change" as one category.

## C. Primary sources to track (candidates for reg-change-monitor expansion)

- justice.gov — DOJ Criminal Division FCPA Unit press releases and resolutions
- SEC.gov — FCPA-related enforcement actions and litigation releases
- FINRA.org — Regulatory Notices (gift rule, non-cash compensation rules)
- MSRB.org — Rule G-20 filings and compliance-date guidance
- Federal Reserve / OCC / FDIC — interagency Bank Bribery Act compliance guidelines
- OGE.gov — 5 CFR 2635 amendments (relevant to the "recipient is a government official" branch of the tool)

---

## Next steps for this document

- [x] Verify core regulation entries against primary/authoritative sources (FINRA Rule 3220, 5 CFR 2635.204) — done 2026-07-08
- [x] Document the FCPA enforcement-pause/restart as the domain's live drift example
- [ ] Pull DOJ's own June 2025 FCPA Guidelines memo directly (currently sourced via law-firm summaries only)
- [ ] Add Reg O detail once the pre-clearance tool's conflicts-of-interest branch is scoped
- [ ] Cross-reference each row to its corresponding control(s) in Layer 2
- [ ] Decide whether UK Bribery Act / other non-U.S. anti-corruption regimes are in scope (parallel to the AML international-scope open question)
