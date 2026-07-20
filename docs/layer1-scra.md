# Layer 1 — Regulatory Requirements: Servicemembers Civil Relief Act (SCRA)

**Statute:** 50 U.S.C. §§ 3901–4043  
**Primary exam reference:** OCC Comptroller's Handbook, "Servicemembers Civil Relief Act," Version 1.1, November 2025  
**Enforcement:** DOJ (primary), CFPB (for institutions >$10B assets), federal banking regulators (OCC, FDIC, Federal Reserve, NCUA for credit unions)  
**Status:** v0.1, updated 2026-06-22. Requirements verified against OCC Comptroller's Handbook v1.1 (Nov 2025) and 50 U.S.C. statutory text. Added §3932, §3936, §3937(c), and vendor responsibility section.

> **⚠ Demonstration Scope Notice**
>
> This document is part of the Risk Management LLM Toolkit showcase methodology. The following gaps
> exist between this demonstration and production use:
>
> **1. NDAA cycle not yet verified for 2025–2026.**
> SCRA is amended regularly through the annual National Defense Authorization
> Act. This document was verified against OCC Comptroller's Handbook v1.1
> (November 2025) and statutory text as of that date. A production deployment
> requires a targeted review of the 2025 and 2026 NDAA cycles to confirm no
> amendments have affected covered persons, protection scope, or compliance
> mechanics since that date.
>
> **2. International angle not scoped.**
> FATF recommendations and allied-nation equivalent protections (e.g., UK
> AFCS, Canadian analogues) are not addressed. Institutions with material
> cross-border operations would need to assess whether equivalent protections
> apply in relevant jurisdictions.
>
> **3. State law overlay absent.**
> Several states have SCRA-equivalent or enhanced protections that impose
> obligations beyond the federal floor documented here. California, New York,
> and others have state-level servicemember protections. A production compliance
> program must layer state requirements on top of this federal baseline.
>
> **4. MLA interaction noted but not fully developed.**
> The SCRA/MLA boundary is identified and the routing distinction is documented,
> but the MLA itself is not a separate Layer 1 document in this showcase.
> A production program treating these as one connected regime would need both
> documented at the same level of detail.
>
> The regulatory content in this document is accurate for the federal SCRA
> framework as of the verification date. These gaps represent scope decisions
> appropriate for a showcase, not errors in the documented content.

> **Why SCRA is in scope for this project:** SCRA compliance is operationally complex
> because it touches multiple bank processes (loan origination, servicing,
> collections, foreclosure, repossession) with different triggers, timing rules,
> and documentation requirements for each. It is also an active enforcement
> priority — the DOJ and CFPB issued a joint compliance reminder letter in
> December 2024, and the current administration has explicitly signaled
> servicemember protection as an enforcement focus. This makes it a strong
> candidate for agent-assisted compliance, particularly at the control points
> where human processes are most error-prone.

---

## A. Who is Protected (Coverage Determination)

Before any substantive obligation applies, a bank must determine whether a
person is a "servicemember" within the meaning of the statute. This
determination is a threshold requirement that gates every other obligation below.

### A.1 — Covered persons (50 U.S.C. § 3911)

**Servicemembers covered:**
- Active duty members of the U.S. Army, Navy, Air Force, Marine Corps, Space Force, and Coast Guard
- National Guard members serving under a Presidential or Secretary of Defense call to active service for more than 30 consecutive days under 32 U.S.C. § 502(f) in response to a national emergency declared by the President and supported by federal funds
- Commissioned officers of the U.S. Public Health Service and the National Oceanic and Atmospheric Administration engaged in active service
- U.S. citizens serving with allied forces in a war or military action (50 U.S.C. § 3914)
- Servicemembers absent from duty due to sickness, wounds, leave, or other lawful cause (50 U.S.C. § 3911(2)(C))
- **Reserve and National Guard members** — coverage begins upon receipt of qualifying orders, which may precede the actual start of active duty by weeks or months (DOJ/CFPB Joint Letter, December 5, 2024)

**Dependents (protections extend in specific circumstances):**
- Spouse, children (unmarried, under 18 or permanently incapable of self-support, or age 18–23 pursuing approved education), and any individual for whom the servicemember provided more than half of support for 180 days immediately preceding the SCRA application (50 U.S.C. § 3911(4))
- Joint obligations with a spouse are covered under the interest rate cap
- Dependent protections do not generally extend to individual (non-joint) obligations

**Legal representatives:**
- An attorney acting on behalf of a servicemember or an individual holding power of attorney is treated as the servicemember for SCRA purposes (50 U.S.C. § 3920)

### A.2 — Key definitional boundary: pre-service vs. in-service obligations

**Most SCRA protections apply only to obligations incurred *before* the
servicemember entered military service.** This is one of the most operationally
significant distinctions in the statute:

- Obligations incurred before entry into active duty → eligible for SCRA protections (interest rate cap, foreclosure/repossession protections)
- Obligations incurred after entry into active duty → **not** eligible for SCRA protections (but may be covered by the Military Lending Act — see note below)

> **SCRA vs. MLA distinction (operationally critical):**
> The SCRA protects pre-service obligations. The Military Lending Act (MLA,
> 10 U.S.C. § 987) protects obligations incurred *during* active duty for
> consumer credit products. These are two separate compliance regimes with
> different coverage, different rate caps (6% for SCRA; 36% MAPR for MLA),
> and different enforcement frameworks. A bank must determine which regime
> applies at origination — or whether both apply — and must maintain that
> determination in the loan record going forward. Confusing the two is a
> documented examination finding.

### A.3 — Methods of military status verification

The statute provides two pathways for a bank to establish a servicemember's
status. The method used has consequences for safe harbor availability.

**Pathway 1 — Servicemember-initiated notice (50 U.S.C. § 3937(b)(1)(A)):**
- Servicemember provides written notice to the bank
- Notice must include a copy of military orders or another appropriate indicator of military service (e.g., a certified letter from a commanding officer)
- Notice may be submitted at any time during military service or within 180 days after the end of military service
- If submitted within the 180-day window, the bank must apply SCRA protections retroactively even if the DMDC does not show active duty status for that period

**Pathway 2 — Bank-initiated DMDC verification (50 U.S.C. § 3937(b)(1)(B)):**
- Bank independently queries the Department of Defense's Defense Manpower Data Center (DMDC) database
- DMDC is the authoritative federal database for active-duty status verification
- May be used proactively (batch screening of portfolio) without waiting for servicemember to initiate
- Confers a statutory safe harbor (see A.4 below)

> **DMDC safe harbor scope (critical limitation):** The safe harbor applies
> specifically and only to the interest rate cap provision (50 U.S.C. § 3937).
> It does not extend to foreclosure or repossession protections. For those
> protections, the bank has an independent obligation to verify military status
> before taking action regardless of whether the servicemember has provided
> notice. (OCC Comptroller's Handbook v1.1, p. 4, fn. 9)

### A.4 — DMDC safe harbor conditions (50 U.S.C. § 3937(b)(1)(B)(ii))

A bank that relies on DMDC verification for the interest rate cap is not in
violation if, at the time of the DMDC query:
1. The query result shows the servicemember is **not** in military service, **and**
2. The bank has not, by the end of the 180-day post-service period, received written notice and documentation from the servicemember

**Safe harbor is lost if:**
- The bank queries DMDC incorrectly (wrong SSN, stale data, incomplete query)
- The servicemember subsequently provides written notice and documentation within the 180-day window, even if DMDC did not reflect active duty at the time of the query

---

## B. Interest Rate Cap (50 U.S.C. § 3937)

### B.1 — The requirement

Pre-service obligations bearing interest above 6% per year must be reduced to
a maximum of 6% per year during the servicemember's period of military service.

**What "interest" means for this cap (50 U.S.C. § 3937(d)(1)):**
Interest is defined to include all service charges, renewal charges, fees, or any other charges with respect to the obligation — **except** bona fide insurance. This means:
- Annual fees on credit cards count toward the 6% cap
- Origination fees and similar charges may count depending on structure
- Insurance premiums that are genuinely optional and at market rate may be excluded

### B.2 — Product coverage

The statute does not enumerate specific product types as covered or excluded —
a case-by-case analysis is required for each product type. However:

- **Mortgage loans** are explicitly covered (50 U.S.C. § 3937(d)(2))
- **Credit card balances** outstanding before active duty are covered (balance, not new purchases)
- **Auto loans, personal loans, student loans** — covered if pre-service
- **Commercial loans** — coverage requires case-by-case analysis; the statute's general provisions apply where a servicemember is the obligor on a pre-service business obligation
- **Federally-guaranteed student loans** — covered from August 14, 2008 forward per 20 U.S.C. § 1078(d) as amended

### B.3 — Trigger and timing

**Trigger:** Written notice from servicemember (or proactive bank DMDC verification)

**Effective date:** Retroactive to the date the servicemember entered military service — not the date notice was received. This means the bank must calculate and credit excess interest charged between the start of active duty and the date the bank applied the cap.

**Duration:**
- All covered products: duration of active military service
- **Mortgage loans specifically:** rate cap continues for **one year after** the end of active military service (50 U.S.C. § 3937(d)(2)) — the "tail period"
- All other products: rate returns to pre-service contractual rate upon conclusion of military service

### B.4 — Implementation mechanics (bank obligations)

Upon receiving notice or making a DMDC determination, the bank must:

1. **Reduce the interest rate** to no more than 6% per year effective from the start of active duty
2. **Forgive — not defer** — the interest above 6% for the covered period. Excess interest is permanently dropped, not added to principal or deferred to a future period
3. **Reduce periodic payments** by the amount of interest forgiven (50 U.S.C. § 3937(a)(3)). The payment reduction is required — a bank cannot simply forgive interest while keeping the same payment amount
4. **Not accelerate principal** due to the rate reduction (50 U.S.C. § 3937(a)(3))
5. **Refund or credit** any excess interest already collected during the protected period
6. **Apply the cap to all fees and charges** (not just the stated interest rate) except bona fide insurance

**Credit card-specific mechanic:** When SCRA protection ends on a credit card, the bank may return to pre-service terms — but may not apply any rate higher than the pre-service contractual rate to transactions that occurred before the period of military service. Advance notice requirements under Regulation Z (12 C.F.R. § 1026.9(c)(2)(iv)(A)) apply when restoring the pre-service rate. (OCC Comptroller's Handbook v1.1, p. 6, fn. 11)

### B.5 — Proactive bank obligations (DOJ/CFPB joint guidance, December 2024)

While the statute places the initial burden on the servicemember to provide
notice, the DOJ and CFPB issued a December 2024 joint letter recommending
(and signaling examination scrutiny of):

- **Proactive DMDC screening** — banks should use DMDC to identify eligible accounts and apply the 6% cap automatically, rather than requiring the servicemember to initiate
- **Institution-wide application** — if a servicemember invokes SCRA benefits on one account, the bank should extend the cap to all eligible accounts held by that servicemember at the institution
- **Streamlined application processes** — cumbersome verification or intake processes that create barriers to receiving benefits are a documented compliance concern

> **Practical significance:** These are regulatory expectations, not just
> recommendations. Banks with material military customer exposure that rely
> solely on servicemember-initiated notice — without proactive DMDC screening —
> are taking examination risk. This is a directly agent-addressable workflow:
> systematic, periodic DMDC batch queries against the portfolio, applied at
> defined intervals, are exactly what an automated process handles better than
> manual review.

### B.6 — Court relief from the 6% cap (50 U.S.C. § 3937(c))

The statute permits a creditor to seek relief from the interest rate cap by
applying to a court. A court may grant relief if it determines that the
servicemember's ability to pay interest above 6% is **not** materially affected
by military service — in other words, if the servicemember has sufficient
income or assets to service the obligation at the contractual rate despite
being on active duty.

In practice, this provision is rarely used. The administrative burden and
litigation cost of seeking court relief typically outweigh any interest
recovered, particularly on consumer obligations. Most banks apply the cap
without seeking relief. However, the provision exists and is part of the
statutory framework — the cap is not unconditionally absolute in all
circumstances. Banks with large commercial obligations where a servicemember
obligor has material independent income may occasionally consider this pathway,
but should involve legal counsel before proceeding.

---

## C. Foreclosure Protections (50 U.S.C. § 3953)

### C.1 — The requirement

A bank **may not** foreclose on a mortgage, trust deed, or other security
interest in the nature of a mortgage during the servicemember's period of
active duty, or for **one year after** the end of military service, unless:

1. A court order approving the foreclosure is obtained **before** the sale, foreclosure, or seizure (50 U.S.C. § 3953(c)(2)), **or**
2. The servicemember has executed a written waiver of SCRA rights (50 U.S.C. § 3918) — which must be a separate instrument from the underlying loan document, executed during or after military service

### C.2 — Coverage conditions

Foreclosure protections apply when:
- The obligation was originated before the servicemember's military service, **and**
- The servicemember is still obligated on the debt, **and**
- The property is secured by a mortgage, trust deed, or similar security instrument

### C.3 — Strict liability and penalties

**This is a strict liability provision.** A person who **knowingly** violates the
foreclosure prohibition may be:
- Fined, **and**
- Imprisoned for up to one year (50 U.S.C. § 3953(d))

This is materially different from the interest rate cap — there is no safe
harbor for foreclosure based on DMDC verification. The bank has an independent
obligation to check military status before initiating foreclosure regardless of
whether the servicemember has provided notice.

### C.4 — Bank's independent obligation

Because there is no notification requirement on the servicemember's side for
foreclosure (unlike the interest rate cap, which is notice-triggered), and
because there is no DMDC safe harbor for this provision, the bank must:

1. Independently determine military status before initiating foreclosure proceedings
2. Check DMDC (or obtain documentation) at the time of referral to foreclosure counsel — and again before finalizing the foreclosure, particularly in protracted proceedings
3. Produce an affidavit of military status for the court proceeding (required under 50 U.S.C. § 3931 for default judgments in civil proceedings — courts require this documentation)
4. Retain the DMDC query result, response, date, and certificate in the loan file

### C.5 — Court remedies available

Where a servicemember's ability to comply with a mortgage obligation is
materially affected by military service, courts have two options
(50 U.S.C. § 3953(b)):
- Stay the proceedings for a period as justice and equity require
- Adjust the obligation to preserve the interests of all parties

---

## D. Repossession Protections (50 U.S.C. § 3952)

### D.1 — The requirement

A bank may not rescind or terminate a contract for the purchase or lease of
real or personal property (including motor vehicles) **without a court order**,
provided:
- A deposit or at least one installment payment was made under the contract **before** the servicemember entered military service

### D.2 — Duration

Unlike the foreclosure protection, repossession protection **does not extend
beyond the period of military service.** The protection ends when active duty
ends. (Some institutions voluntarily extend this protection — e.g., six months
post-service — but this is a policy choice, not a statutory requirement.)

### D.3 — Penalties

Knowingly violating the repossession prohibition exposes the bank to fines and
imprisonment, similar to the foreclosure provision.

### D.4 — Court remedies

When a bank seeks court approval for repossession, the court may
(50 U.S.C. § 3952(c)):
- Order repayment of prior installments or deposits to the borrower as a condition of terminating the contract
- Stay proceedings if the servicemember's ability to comply is materially affected by military service
- Make other equitable dispositions

---

## E. Default Judgment Protections (50 U.S.C. § 3931)

### E.1 — The requirement

In any civil action or proceeding where a default judgment is sought, the
plaintiff (including a bank pursuing debt enforcement) must file an affidavit:
- Stating whether the defendant is in military service, **or**
- Stating that the plaintiff is unable to determine whether the defendant is in military service

### E.2 — Court obligations triggered

If the court determines the defendant is in military service, the court:
- **Must** appoint an attorney to represent the servicemember
- **May** grant a stay of proceedings of not less than 90 days

### E.3 — Reopening default judgments

A servicemember may apply to reopen a default judgment entered against them
during military service or within 60 days of the end of service if the
servicemember can show that:
1. Military service materially affected their ability to appear
2. They have a meritorious or legal defense to the action

---

## F. Stay of Proceedings (50 U.S.C. § 3932)

### F.1 — The requirement

A court before which a civil action or proceeding is pending against a
servicemember may, at any stage, on its own motion or on application by
the servicemember or their attorney:

- **Grant a stay** of proceedings for a minimum of 90 days if the court
  determines that (a) the servicemember's ability to appear is materially
  affected by reason of military service, or (b) counsel for the servicemember
  is unable to appear due to military service

A stay may be renewed upon further application.

### F.2 — Who may apply

The servicemember, or an attorney acting on their behalf, may apply for a
stay. Importantly, the court may also grant a stay on its own initiative
(sua sponte) — the servicemember does not need to appear to request it.

### F.3 — Banking relevance

This provision is directly relevant to any bank that initiates civil
litigation against a servicemember borrower. Affected proceedings include:

- **Collection lawsuits** — actions to recover on a delinquent obligation
- **Deficiency judgment actions** — post-foreclosure or post-repossession recovery
- **Debt recovery on charged-off accounts** — civil suits initiated by the bank or a collection firm acting on its behalf
- **Any other civil proceeding** where the bank is the plaintiff and the defendant is a servicemember

**Operational implication:** A bank's legal or collections team must check
military status before initiating civil proceedings and must account for the
possibility of a mandatory stay when planning litigation timelines. A stay
does not extinguish the obligation — the proceeding resumes after service
ends — but it can materially affect recovery timelines and litigation strategy.

**DMDC check before filing:** The same DMDC verification requirement that
applies to foreclosure and repossession (independent obligation, no safe
harbor for the stay provision) applies here. A bank that files a civil action
without checking military status and is then hit with a stay request has
failed a control that should have been upstream.

### F.4 — Interaction with default judgment protections (§3931)

Sections 3931 and 3932 are complementary but distinct:

- **§3931** (default judgment) applies when the *defendant* does not appear
  and a default judgment is sought — the plaintiff must file an affidavit
  of military status, and the court must appoint counsel if active duty is
  confirmed
- **§3932** (stay of proceedings) applies when the *servicemember is aware
  of the proceeding* and seeks, or the court grants, a stay based on the
  material effect of military service on their ability to participate

Both provisions can apply in the same proceeding at different stages.

---

## G. Tolling of Statutes of Limitation (50 U.S.C. § 3936)

### G.1 — The requirement

The period of a servicemember's military service is **excluded from** (tolled
during) any statute of limitations applicable to the filing of a civil action
by or against the servicemember.

This tolling applies to:
- Actions brought **by** the servicemember (e.g., claims against the bank)
- Actions brought **against** the servicemember (e.g., collection lawsuits,
  deficiency judgment actions initiated by the bank)

### G.2 — Banking relevance

This provision has its most significant practical impact on the bank's legal,
collections, and recovery functions — specifically any situation where a
statute of limitations governs the bank's ability to sue:

- **Charged-off debt litigation:** A bank may believe the limitations period
  on a defaulted obligation is about to expire (or has expired) when, legally,
  the period has been tolled for the duration of the servicemember's active
  duty. Filing a time-barred claim — or, conversely, failing to file because
  the limitations period appears expired when it has actually been tolled —
  are both material errors.

- **Deficiency judgments:** After foreclosure or repossession, if the bank
  seeks a deficiency judgment, the limitations period for that action may
  be tolled during the servicemember's military service.

- **Counterclaims and servicemember-initiated actions:** The tolling also
  extends the window within which a servicemember may bring claims against
  the bank — relevant to litigation defense planning.

### G.3 — Practical control implication

Before any limitations-period analysis in a matter involving a servicemember
borrower, the bank's legal team must:

1. Determine whether the obligor was on active military service during any
   portion of the relevant period
2. Exclude any period of active duty from the limitations calculation
3. Document the basis for the limitations period determination in the file

This is a legal function, not a servicing function — but it requires the same
DMDC query infrastructure and loan-level military status records that servicing
produces. Without accurate records of when a servicemember was on active duty
(and for how long), the limitations calculation cannot be performed correctly.

---

## H. Lease Termination Rights (50 U.S.C. § 3955)

### H.1 — Scope

This provision gives servicemembers the right to terminate certain leases
early. For banks, the primary relevance is as lessors under motor vehicle
lease products, or as holders/servicers of consumer lease portfolios.
Premises lease termination is included for completeness but is generally
outside core banking operations.

### H.2 — Covered leases

**Premises leases** — a servicemember may terminate a premises lease if:
- The lease is for residential, professional, business, agricultural, or similar purposes, **and**
- The servicemember entered military service during the lease term, **or**
- The servicemember received orders for a permanent change of station (PCS) or deployment of 90+ days while already in service

**Motor vehicle leases** — a servicemember may terminate a motor vehicle lease if:
- Orders are for military service of 180+ days, **or**
- Orders are for PCS from inside the continental United States to outside, or equivalent

**Stop movement orders** are an additional qualifying trigger added by the NDAA 2020 for both premises and motor vehicle leases.

### H.3 — Termination mechanics

Servicemember must:
1. Deliver written notice of termination to the lessor
2. Include a copy of military orders or commanding officer certification
3. For motor vehicle leases: return the vehicle within 15 days of delivering notice

Delivery of notice may be by hand, private carrier, or certified U.S. mail with return receipt.

The spouse of a servicemember may terminate leases if the servicemember dies or suffers catastrophic illness or injury during service.

---

## I. Waiver of SCRA Rights (50 U.S.C. § 3918)

A servicemember may waive SCRA protections, but waivers for certain protections
must meet specific requirements:

- Must be **in writing**
- Must be a **separate instrument** from the underlying obligation or liability (not embedded in loan documents)
- Must be executed **during or after** military service (not before — a pre-service waiver embedded in loan documents is invalid)
- Applies specifically to: modification/termination/cancellation of contracts, repossession, retention, sale, or forfeiture of secured property

---

## J. Vendor and Third-Party Responsibility

### J.1 — The governing principle

A bank remains responsible for SCRA compliance when functions are performed
by third parties. Outsourcing a function does not transfer the compliance
obligation. This principle is explicit in OCC and CFPB supervisory guidance
on third-party risk management and is directly applicable to SCRA.

### J.2 — Third parties that carry SCRA compliance risk

| Third party | SCRA functions they perform | Bank's residual obligation |
|---|---|---|
| Mortgage servicers | Interest rate cap application, DMDC screening, foreclosure referral | Bank remains responsible for servicer's compliance; oversight required |
| Foreclosure counsel | DMDC check at referral, military status affidavit filing, court proceedings | Bank must confirm counsel maintains adequate SCRA procedures; referral package must include DMDC requirement |
| Collection agencies | DMDC check before contact and escalation, default judgment affidavit | Bank must contractually require SCRA checks; audit vendor compliance |
| Repossession vendors | DMDC check before repossession action | Bank must require DMDC documentation from vendor; retain in file |
| Debt buyers | If bank sells charged-off servicemember debt | Bank should disclose known military status to buyer; may retain liability for pre-sale violations |

### J.3 — Minimum vendor control expectations

Banks should, at minimum:
- Include SCRA compliance requirements in third-party contracts
- Require third parties to maintain DMDC query capability and document results
- Periodically audit or obtain representations regarding vendor SCRA compliance
- Retain SCRA-related documentation produced by vendors in the bank's own records

Failure to oversee third-party SCRA compliance is itself an examination finding — not just the underlying third-party violation.

---

## K. Record Retention

While the SCRA does not specify a minimum retention period, the OCC
Comptroller's Handbook states that banks should maintain records sufficient to:
- Demonstrate the basis of any determination of SCRA eligibility or ineligibility
- Support safe harbor eligibility for interest rate cap determinations
- Produce documentation for any examination finding or litigation defense

In practice, the record for any SCRA-eligible account should include:
- DMDC query results (date, response, certificate format)
- Written notice and military orders received from servicemember (if applicable)
- Rate cap calculation and effective date
- Documentation of any excess interest refunded or credited
- Foreclosure/repossession status holds and basis for each
- Return-from-service determination and date rate was restored

---

## L. Enforcement and Penalties

| Violation | Enforcement authority | Available remedies |
|---|---|---|
| Interest rate cap violations | DOJ, CFPB, federal banking regulators | Restitution, civil money penalties, injunctive relief |
| Foreclosure violations | DOJ, private right of action | Criminal fine + imprisonment up to 1 year (knowing violation); civil remedies |
| Repossession violations | DOJ, private right of action | Criminal fine + imprisonment (knowing violation); civil remedies |
| Default judgment violations | Court | Reopening of judgment; appointment of counsel |
| Stay of proceedings violations | Court, DOJ | Stay imposed; litigation costs; potential sanctions |
| Tolling violations (limitations period errors) | Court | Time-barred claims dismissed; litigation exposure on miscalculated periods |

**Private right of action:** The Veterans Disability Protection Act of 2010
established that individuals have a private right of action for SCRA violations.
This means servicemembers can sue banks directly in addition to regulatory
enforcement — a material litigation risk on top of examination risk.

---

## M. Tier Notes

- **Community bank:** Likely has lower absolute volume of servicemember customers but proportionally may be high-exposure in communities near military installations. Manual processes are common; DMDC-based proactive screening is often absent. Interest rate cap violations from servicemember-initiated notice not being processed correctly are the most common finding.
- **Midsize bank:** More likely to have a dedicated servicing platform but SCRA controls may be fragmented across loan types (mortgage handled differently from auto from credit card). Foreclosure pipeline is the highest-risk area — volume is sufficient to create systematic errors.
- **Large bank:** Dedicated SCRA compliance team; automated DMDC batch screening expected; highest examination scrutiny and DOJ/CFPB enforcement exposure. The December 2024 DOJ/CFPB letter was directed primarily at this tier.

---

**Status:** v0.1, updated 2026-06-22. Added §3932 stay of proceedings (Section F), §3936 tolling of statutes of limitation (Section G), §3937(c) court relief note (Section B.6), and vendor/third-party responsibility (Section J). Sections renumbered accordingly.

## Next steps for this document

- [ ] Add citation links for stay of proceedings and tolling sections (uscode.house.gov)
- [ ] Verify whether any amendments have been enacted in 2025–2026 (check NDAA cycle — annual NDAA bills frequently amend SCRA)
- [ ] Scope decision on lease termination (Section H): confirm whether premises lease termination warrants process map coverage given limited bank operational relevance, or narrow Section H to vehicle leases only
- [ ] Note interaction with MLA in greater detail once MLA is its own Layer 1 document
- [ ] Cross-reference each section to its corresponding Layer 2 process(es) — Sections F and G (stay/tolling) need process map coverage not yet included in Layer 2
- [ ] Draft worked examples for interest rate cap calculation (useful for agent eval suite)
- [ ] Add common examination findings callout — either as a standalone subsection in Layer 1 or as explicit citations in the Layer 3 control matrix failure mode column
