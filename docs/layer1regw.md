# Layer 1 — Regulatory Map: Transactions with Affiliates (Regulation W)

Scope: transactions between a bank and its affiliates — extensions of
credit, asset purchases, securities purchases, collateral acceptance, and
guarantees — governed by Sections 23A and 23B of the Federal Reserve Act as
implemented in Regulation W (12 CFR Part 223). This is the regulatory
foundation for the affiliate-transaction compliance tool, the domain's own
Layer 3 build. Like Anti-Bribery/COI, this domain is a strong Track B
candidate: most of its core controls — percentage-of-capital limits,
collateral haircuts — are threshold arithmetic, not language judgment. One
element (the market-terms comparison) is a genuine judgment call and is
treated as such in Layer 2.

> Status: v0, verified against eCFR primary text and Federal Reserve
> supervisory guidance on 2026-08-21. Primary-source links included where
> found.

---

## A. Core Framework

| Regulation / Authority | What it requires | Who enforces it |
|---|---|---|
| Section 23A, Federal Reserve Act (12 U.S.C. § 371c) | Quantitative limits, collateral requirements, and a low-quality-asset purchase prohibition on "covered transactions" between a member bank and its affiliates | Federal Reserve (member banks); applied to national banks and insured nonmember banks by the OCC and FDIC respectively, and to savings associations through 12 U.S.C. § 1468 |
| Section 23B, Federal Reserve Act (12 U.S.C. § 371c-1) | Market-terms requirement — affiliate transactions (a broader set than 23A's "covered transactions") must be on terms and circumstances at least as favorable to the bank as comparable transactions with nonaffiliates | Same enforcement structure as 23A |
| Regulation W (12 CFR Part 223) | The Federal Reserve's implementing regulation for both 23A and 23B — definitions, valuation/timing rules, exemptions, and application to foreign bank branches/agencies and savings associations | Federal Reserve, with the other federal banking agencies applying it to their respective institutions |
| 12 CFR § 223.2 | Defines "affiliate": a company that controls, is controlled by, or is under common control with the bank; a sponsored/advised investment fund; a financial subsidiary; and several other enumerated relationships | N/A (definitional) |
| Safety-and-soundness expectations (12 CFR § 223.13) | Even an exempt or otherwise-permitted affiliate transaction must be consistent with safe and sound banking practices | Primary federal regulator, examination-based |

### Section-by-section map (12 CFR Part 223)

| Section(s) | Topic |
|---|---|
| §§ 223.1–223.3 | Purpose, scope, and definitions (including "affiliate" and "covered transaction") |
| § 223.11 | Single-affiliate quantitative limit — 10% of capital stock and surplus |
| § 223.12 | Aggregate (all-affiliates) quantitative limit — 20% of capital stock and surplus |
| § 223.13 | Safety-and-soundness requirement, independent of the quantitative limits |
| § 223.14 | Collateral requirements for credit transactions with affiliates |
| § 223.15 | Prohibition on purchasing low-quality assets from an affiliate |
| § 223.16 | Attribution rule — a transaction with a nonaffiliate is treated as an affiliate transaction if the proceeds are used for the benefit of, or transferred to, an affiliate |
| §§ 223.21–223.24 | Valuation and timing principles for credit transactions, asset purchases, affiliate-securities purchases, and credit secured by affiliate securities |
| §§ 223.31–223.33 | Acquisitions of affiliates that become operating subsidiaries, financial-subsidiary rules, derivative-transaction rules |
| §§ 223.41–223.42 | Exemptions from the quantitative limits, collateral requirements, and/or low-quality-asset prohibition |
| §§ 223.51–223.52 | Section 23B market-terms requirement and the (broader) list of transactions it covers |
| § 223.53 | Prohibited asset purchases under 23B |
| § 223.54 | Prohibited advertisements/statements implying the government stands behind an affiliate |
| §§ 223.55–223.56 | Board exemption standards and transactions exempt from the market-terms requirement |
| § 223.61 | Application to U.S. branches and agencies of foreign banks |
| § 223.72 | Application to savings associations |

### Quantitative limits and collateral (the arithmetic core of the domain)

- **Single-affiliate limit (§ 223.11):** a bank's covered transactions with
  any one affiliate may not exceed **10% of the bank's capital stock and
  surplus**.
- **Aggregate limit (§ 223.12):** a bank's covered transactions with **all**
  affiliates combined may not exceed **20% of the bank's capital stock and
  surplus**.
- **Collateral requirements (§ 223.14):** every extension of credit to an
  affiliate must be secured at the time of the transaction, at these
  minimum ratios of collateral value to the amount of the extension:
  - 100% — obligations of the U.S. government or a U.S. government agency
  - 110% — obligations of a state or political subdivision
  - 120% — other debt instruments, including loans and other receivables
  - 130% — stock, leases, or other real or personal property
  - Low-quality assets and securities issued by any affiliate of the bank
    are **not eligible collateral** at all, regardless of ratio.
- **Attribution rule (§ 223.16):** a transaction with a nonaffiliate counts
  against the affiliate limits if the bank knows or has reason to know the
  proceeds will be used for the benefit of, or transferred to, an
  affiliate.

### Market-terms requirement (23B)

Section 23B (§§ 223.51–223.52) applies to a **broader** set of
transactions than the "covered transaction" list in 23A — including asset
purchases and sales, payments for services, and any transaction in which an
affiliate acts as agent or broker for the bank — and requires that the
bank's terms be substantially the same as, or at least as favorable to the
bank as, terms it would receive in a comparable transaction with an
unaffiliated party.

### Key exemptions (§§ 223.41–223.42, 223.56)

- Transactions between a bank and a sister bank/thrift under common
  80%-or-greater ownership (exempt from both the quantitative limits *and*
  collateral requirements, and, per § 223.56, from the market-terms
  requirement as well)
- Transactions fully secured by cash or U.S. government/agency obligations
- Correspondent banking deposits placed with an affiliate depository
  institution
- Certain intraday extensions of credit
- Internal corporate reorganizations meeting specific conditions
- An exemption remains subject to the § 223.13 safety-and-soundness
  standard even when it excuses the quantitative and collateral
  requirements — exemption from 23A does not, by itself, exempt a
  transaction from 23B's market-terms requirement unless the specific
  exemption also names 23B.

## B. Verified regulatory activity (examples of live drift in this space)

1. **OCC Interpretive Letter #1191 — individual exemption granted for an
   intra-group equity contribution that exceeded both 23A limits (June
   2026).** The OCC granted Morgan Stanley Bank, N.A. an exemption under
   12 U.S.C. § 371c(f)(2)(B)(i) and 12 CFR §§ 223.11–12, 223.31, and
   223.41(d) to allow the bank to acquire equity interests in two German
   bank subsidiaries from its parent, a transaction that would otherwise
   have exceeded the 10% single-affiliate and 20% aggregate limits. The
   OCC's reasoning tracked 23A's dual purpose — protecting the bank from
   loss and preventing improper subsidy transfers to affiliates — finding
   the reorganization improved organizational efficiency without
   introducing material financial risk to the bank, and noted the FDIC's
   parallel finding of no unacceptable risk to the Deposit Insurance Fund.
   This is a live, current example of the individual-exemption process
   named generically in § 223.42 actually being used, and a useful
   reminder that the quantitative limits are not truly absolute — an
   institution can seek supervisory relief for a specific, justified
   transaction. Source: [OCC Interpretive Letter #1191](https://www.occ.gov/topics/charters-and-licensing/interpretations-and-decisions/2026/int1191.pdf).
2. **Practitioner guidance on subscription credit facilities — a live
   application of the attribution rule and collateral haircuts to a
   product structure not explicitly named in the regulation (January
   2025).** Mayer Brown's analysis walks through how a bank lending
   against a fund's uncalled capital commitments (a subscription credit
   facility) has to apply the § 223.14 collateral haircuts (typically the
   120% "other debt instrument" tier) if the borrower is an affiliated
   fund, and flags that the Federal Reserve's December 2021 FAQ update
   clarified that where an initial draw under a facility qualifies for an
   exemption, subsequent draws under the same facility do not
   automatically re-trigger the attribution rule, provided the bank
   maintains documented compliance procedures. This is a good example of
   Reg W drift showing up not as a rule change but as accumulated FAQ and
   practitioner interpretation layered onto a static rule text — a
   different drift shape than a formal amendment. Source: [Mayer Brown, "How Regulation W Affects Subscription Credit Facilities"](https://www.mayerbrown.com/en/insights/publications/2025/01/how-regulation-w-affects-subscription-credit-facilities).
3. **The Federal Reserve's standing Reg W FAQ page remains the primary
   living-interpretation source.** It documents the Dodd-Frank Act
   amendments effective July 21, 2011 (which, among other things, expanded
   "covered transaction" to include derivative transactions and
   securities-borrowing/lending, and tightened the exemption-approval
   process) as the last statutory-level change, with everything since
   handled through FAQ updates and individual interpretive letters like
   #1191 above rather than a full regulatory rewrite. Source: [Federal Reserve — Regulation W FAQs](https://www.federalreserve.gov/supervisionreg/legalinterpretations/reg-w-frequently-asked-questions.htm).

## C. Why this domain has a distinctive drift profile

Unlike a domain with a single hard dollar threshold that moves on a
rulemaking cycle (HMDA's asset-size exemption, FINRA's gift limit), Reg W's
core numbers — 10%, 20%, the collateral haircuts — have been stable since
the 2002 rule. What actually moves is the edge: how the attribution rule
applies to a fund-finance structure, whether a specific intra-group
reorganization qualifies for an individual exemption, how the definition of
"affiliate" reaches a sponsored investment vehicle. That means the
practical compliance risk in this domain is less "did the threshold change"
and more "has an examiner, FAQ update, or interpretive letter narrowed or
widened how an edge case is read" — closer in shape to the Anti-Bribery/COI
domain's FCPA-enforcement-posture drift than to a clean numeric update.

## D. Primary sources to track (candidates for reg-change-monitor expansion)

- ecfr.gov — 12 CFR Part 223 current text
- federalreserve.gov/supervisionreg — Reg W FAQ page and supervisory
  guidance topics
- occ.gov — Interpretations and Decisions (individual exemption orders and
  interpretive letters)
- federalregister.gov — proposed and final rulemakings amending Part 223

---

## Next steps for this document

- [x] Verify core provisions (quantitative limits, collateral haircuts,
      attribution rule, market-terms requirement) against eCFR primary text
      — done 2026-08-21
- [x] Document a live individual-exemption example (OCC Int. Ltr. #1191)
      and a live practitioner-interpretation example (subscription credit
      facilities) as this domain's verified drift
- [ ] Pull the Federal Reserve's Dodd-Frank implementing rulemaking
      directly rather than via the FAQ page's summary of it
- [ ] Cross-reference each row to its corresponding control(s) in Layer 2
- [ ] Confirm whether the tool's scope should extend to derivative
      transactions (§ 223.33) — currently out of scope for the Layer 3
      build's first version
