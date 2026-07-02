# Layer 2 — Process Map: Servicemembers Civil Relief Act (SCRA)

Maps each compliance process that exists to satisfy SCRA obligations from
Layer 1, identifies the specific SCRA requirements each process addresses,
and names the decision points and data inputs at each step where a control
must exist.

The right-most column in each process table — "Control needed" — is the
bridge to Layer 3. It is the precise answer to "what does a control actually
have to do here," stated before we decide whether that control is manual,
tool-assisted, or agent-executed.

> Status: v0.1, updated 2026-06-22. Added P9 (Civil Litigation / Debt Recovery Actions) covering stay of proceedings and tolling obligations. Added vendor responsibility note to process index. Updated cross-process summary to include new obligations and P9 column.

> **⚠ Demonstration Scope Notice**
>
> This document is part of the RMAS showcase methodology. The following gaps
> exist between this demonstration and production use:
>
> **1. Process flows are derived from regulatory guidance, not observed practice.**
> The nine process maps in this document are constructed from OCC examination
> guidance, DOJ/CFPB enforcement findings, and statutory requirements — not
> from reviewing actual bank SOPs or servicing platform workflows. A production
> deployment requires validation of each process map against the institution's
> actual procedures. Steps, decision points, and data inputs may differ
> materially by institution, platform, and bank tier.
>
> **2. System integration points are assumed, not specified.**
> Process steps that reference loan servicing systems, collections platforms,
> and foreclosure management systems assume those systems exist and can surface
> the required data fields. A production deployment requires a system inventory
> and integration assessment — confirming that each data input named in the
> process tables is actually available in the institution's environment.
>
> **3. State law overlay absent.**
> Process flows reflect federal SCRA requirements only. State-level
> servicemember protection laws may add steps, decision points, or data
> requirements to one or more of these processes. A production process map
> must incorporate the applicable state law overlay for the institution's
> operating geography.
>
> **4. P9 (Civil Litigation) assumes legal function integration.**
> The civil litigation process map assumes the bank's legal function has
> visibility into the SCRA compliance infrastructure — loan-level military
> status records, DMDC query history, active duty period dates. In many
> institutions, legal and servicing operate in separate systems without
> direct data sharing. A production deployment of P9 controls requires
> confirming that integration exists or building it.
>
> These gaps represent the delta between a methodology demonstration and
> a production SOP. The process structure and control identification are
> accurate; the implementation details require institution-specific validation.

---

## Process Index

| # | Process | Primary SCRA obligations addressed |
|---|---|---|
| P1 | Loan Origination | A.2 (pre/in-service determination), A.3 (SCRA/MLA routing) |
| P2 | Servicing — Ongoing Portfolio Monitoring | A.3/A.4 (DMDC batch screening), B.5 (proactive cap application) |
| P3 | Servicemember Notice Intake | B.3 (trigger and timing), B.4 (rate cap mechanics) |
| P4 | Collections / Default Management | C.4, D.4 (DMDC check before adverse action) |
| P5 | Foreclosure Initiation and Management | C.1–C.4 (foreclosure protections, strict liability) |
| P6 | Repossession Initiation | D.1–D.4 (repossession protections) |
| P7 | Return from Service | B.3 (duration/tail), B.4 (rate restoration), credit bureau |
| P8 | Lease Termination Processing | H.1–H.3 (early termination rights) |
| P9 | Civil Litigation / Debt Recovery Actions | F.1–F.4 (stay of proceedings), G.1–G.3 (tolling of statutes of limitation) |

> **Vendor responsibility (Layer 1, Section J):** The bank remains responsible
> for SCRA compliance when any of the above processes are performed by third
> parties (mortgage servicers, foreclosure counsel, collection agencies,
> repossession vendors). Process steps in P4, P5, P6, and P9 that involve
> third-party execution carry an additional vendor oversight control requirement.
> See Layer 3 for specific vendor controls.

---

## P1 — Loan Origination

**What this process does:** Establishes the loan relationship and records the
data that determines SCRA eligibility for the life of the account. Every
downstream SCRA obligation depends on getting this right at origination.

**SCRA obligations addressed:**
- Pre-service vs. in-service determination (Layer 1, Section A.2)
- SCRA vs. MLA routing (Layer 1, Section A.2 note)
- Initial DMDC query (optional at origination but best practice)

### Process steps

| Step | What happens | Data inputs | Control needed |
|---|---|---|---|
| P1.1 | Application received | Applicant name, SSN, address, loan type | Capture military affiliation indicator — flag if applicant self-identifies as servicemember or dependent |
| P1.2 | Military status determination | SSN, name | DMDC query at origination — establish whether applicant is currently on active duty |
| P1.3 | SCRA / MLA routing decision | DMDC result, origination date | If active duty at origination → obligation is **in-service** → MLA applies, SCRA does **not** apply to this obligation. If not active duty → obligation is **pre-service** if servicemember later activates → SCRA will apply. Record and flag accordingly in loan system. |
| P1.4 | Loan record flagging | Origination date, DMDC result, military status | Record origination date, DMDC query result, and military status flag in loan system. These fields must be queryable later by servicing and collections systems. |
| P1.5 | Disclosure / notice | Loan type (mortgage) | For mortgage loans: SCRA rights notice required to be provided to borrower (HUD prescribed form for FHA loans; similar notice for conventional) |

### Key data that must survive origination into the servicing record
- Origination date (establishes pre/in-service boundary for any future activation)
- Military status at origination (DMDC result + date of query)
- Military affiliation flag (servicemember / dependent / none / unknown)
- Loan type (mortgage vs. non-mortgage — drives tail period rules)

### Tier notes
- **Community bank:** Military status often determined by borrower self-disclosure alone, without a DMDC query. This is the most common origination-stage gap.
- **Midsize/large bank:** Automated DMDC query at origination is feasible and increasingly expected. Output should write directly to the loan record, not sit in a separate file.

---

## P2 — Servicing: Ongoing Portfolio Monitoring

**What this process does:** Proactively identifies servicemembers in the
existing portfolio who have entered active duty, applies the interest rate
cap before they have to ask, and maintains a running audit trail of DMDC
query results. This is the process most directly called out in the DOJ/CFPB
December 2024 joint letter.

**SCRA obligations addressed:**
- Proactive DMDC screening (Layer 1, Section B.5)
- Interest rate cap — proactive application (Layer 1, Section B.4)
- Safe harbor maintenance for interest rate cap (Layer 1, Section A.4)

### Process steps

| Step | What happens | Data inputs | Control needed |
|---|---|---|---|
| P2.1 | Scheduled DMDC batch query | Loan portfolio (SSNs, names), query cadence | Run DMDC query against all open loan accounts (or subset with note rate > 6%) on defined schedule. Cadence: quarterly at minimum for mortgage portfolios per Freddie Mac guidance; more frequently for institutions with material military exposure. |
| P2.2 | Match identification | DMDC batch results | Identify accounts where DMDC returns active duty status not previously recorded. These are accounts requiring rate cap application. |
| P2.3 | Rate cap calculation | Account balance, current rate, fees/charges, active duty start date from DMDC | Calculate 6% cap retroactive to active duty start date. Quantify excess interest charged since that date. Determine payment reduction amount. |
| P2.4 | Rate cap application | Calculation output | Apply rate reduction to account. Forgive (not defer) excess interest. Reduce periodic payment. Do not accelerate principal. |
| P2.5 | Refund / credit of excess interest | Calculation output, payment history | Credit or refund any excess interest already collected since active duty start date. |
| P2.6 | Institution-wide account sweep | Servicemember's SSN | Upon identifying one SCRA-eligible account, query all other accounts held by that servicemember at the institution and apply cap to all eligible pre-service accounts. |
| P2.7 | Audit record creation | DMDC certificate, query date, account action taken | Retain DMDC query result in DMDC certificate format, with date, for each account reviewed. Record rate cap effective date, calculation, and any refund. |
| P2.8 | Customer notification | Account changes | Notify servicemember of rate cap application and payment change before next statement. First adjusted statement must reflect the new rate — a statement showing the old rate after cap application is applied is itself a compliance finding. |

### Cadence design considerations
- Portfolio-wide DMDC query: minimum quarterly; monthly preferred for high-military-exposure institutions
- Triggered query: any time a servicemember provides notice on any account (sweep all accounts at that point)
- Mortgage-specific: query servicemembers already receiving SCRA rate cap on a quarterly basis to detect return from service

### Tier notes
- **Community bank:** Batch DMDC queries often manual or absent entirely. Highest gap risk here — relying on servicemember to self-identify.
- **Midsize bank:** May run batch queries through a loan servicing platform or compliance vendor; need to confirm the sweep applies across all loan types (mortgage and non-mortgage), not just one portfolio silo.
- **Large bank:** Automated batch query expected; the December 2024 DOJ/CFPB letter was effectively directed at ensuring this process is systematic and documented, not ad hoc.

---

## P3 — Servicemember Notice Intake

**What this process does:** Handles inbound notice from a servicemember (or
their representative) asserting SCRA rights. This is the reactive counterpart
to P2's proactive screening — it processes the servicemember-initiated trigger.
The process must be accessible, low-friction, and consistently executed across
all inbound channels (phone, mail, branch, digital).

**SCRA obligations addressed:**
- Written notice and documentation requirements (Layer 1, Section A.3, Pathway 1)
- Rate cap trigger and retroactive application (Layer 1, Section B.3)
- Rate cap implementation mechanics (Layer 1, Section B.4)
- 180-day post-service notice window (Layer 1, Section A.3)

### Process steps

| Step | What happens | Data inputs | Control needed |
|---|---|---|---|
| P3.1 | Notice received and logged | Written notice (any channel), military orders or commanding officer letter | Log receipt with date and channel. Any verbal mention of military service by a customer during a servicing interaction should be treated as a potential SCRA trigger and escalated — not dismissed because the customer didn't submit formal written notice. |
| P3.2 | Notice validity determination | Submitted documentation | Confirm: (a) written notice is present, (b) documentation establishes military status (orders, CO letter, or equivalent). If documentation is incomplete, request missing items — do not deny benefits without giving the servicemember an opportunity to supplement. |
| P3.3 | Active duty period determination | Military orders (start date), DMDC query | Establish the date active duty began. If DMDC confirms active duty, use DMDC data. If servicemember provides documentation of a period not reflected in DMDC (common for short-term or amended orders), the written notice controls. |
| P3.4 | Account identification and sweep | Servicemember SSN | Identify all accounts held at the institution by this servicemember. Apply rate cap determination to every eligible pre-service account — not just the account on which notice was provided. |
| P3.5 | Rate cap calculation and application | See P2.3–P2.5 | Same mechanics as P2 — retroactive to active duty start date, forgive excess interest, reduce payment, no principal acceleration. |
| P3.6 | Confirmation to servicemember | Account changes applied | Written confirmation to servicemember of benefits applied, accounts covered, effective date, and new payment amount. Must be delivered before next statement. |
| P3.7 | File documentation | Notice, orders, DMDC result, calculation, confirmation | Full intake file retained per record retention requirements. |

### Edge cases that must be handled

- **Verbal notice during a servicing call:** A customer saying "I just got deployed" on a collections call is a potential SCRA trigger. Staff must recognize this, escalate appropriately, and not continue collection activity while the SCRA determination is pending.
- **Notice submitted by a representative:** An attorney or power-of-attorney holder may submit notice on the servicemember's behalf. This is valid under 50 U.S.C. § 3920.
- **Notice submitted within 180 days post-service:** Even after active duty ends, the servicemember has 180 days to submit notice and receive retroactive benefits. The bank must apply the cap even if DMDC no longer shows active duty status.
- **Documentation gaps / amended orders:** Active duty periods may not appear in DMDC if orders are short-term, recently amended, or administratively delayed. Written notice from the servicemember controls over DMDC in these cases.

### Tier notes
- **Community bank:** Notice often handled by branch staff or loan officers who may not recognize the SCRA trigger, especially in verbal form. Training gap is common.
- **Midsize/large bank:** Dedicated SCRA intake unit is best practice. Inconsistent routing across channels (branch vs. call center vs. mail) is a documented finding.

---

## P4 — Collections / Default Management

**What this process does:** Applies SCRA checks at every stage of the default
and collections escalation process before any adverse action is taken against
a servicemember. This process is where banks most commonly accumulate
violations — because collections workflows are volume-driven and the SCRA
check can be bypassed if it is not a mandatory gate.

**SCRA obligations addressed:**
- DMDC check before adverse action (Layer 1, Sections C.4, D.4)
- Interest rate cap (must be applied before collection activity proceeds if servicemember is active duty)
- Default judgment affidavit requirement (Layer 1, Section E.1)

### Process steps

| Step | What happens | Data inputs | Control needed |
|---|---|---|---|
| P4.1 | Account enters delinquency queue | Loan account, payment status | At point of delinquency flag, check for existing SCRA status indicator in loan record. If flagged as active duty, pause standard collections escalation and route to SCRA-aware queue. |
| P4.2 | DMDC check before first contact | Borrower SSN, name | Run DMDC query before initiating any collections contact. Active duty result → apply rate cap if not already applied; limit collections activity per SCRA protections. |
| P4.3 | Collections activity under SCRA | DMDC result, account status | Banks may continue to contact servicemembers about delinquent accounts — SCRA does not prohibit all collections. However: interest must be capped, no adverse action (foreclosure, repossession) without court order, and collections staff must not use pressure tactics that ignore military status. |
| P4.4 | Escalation decision point | Account delinquency stage, DMDC result | Before escalating to any of the following, a fresh DMDC query is required: referral to outside collections, referral to foreclosure counsel, referral to repossession vendor, initiation of legal action. This is a mandatory gate — not discretionary. |
| P4.5 | Legal action — default judgment affidavit | Borrower SSN, DMDC result | Before any default judgment is sought, file an affidavit with the court stating whether the defendant is or is not in military service (50 U.S.C. § 3931). If unable to determine, state that in the affidavit. This is a court-filing requirement, not internal — noncompliance affects the validity of the judgment. |
| P4.6 | Late fees and adverse credit reporting | DMDC result, payment history | SCRA does not require waiving late fees or suppressing adverse credit reporting for non-payment during active duty — but excess interest forgiven under the cap must not be reported as a delinquency. If the delinquency was caused by excess interest that the SCRA requires to be forgiven, reporting that delinquency is a FCRA accuracy issue as well as an SCRA-related harm. |

### Tier notes
- **Community bank:** Collections often handled by loan officers rather than a dedicated team. SCRA status check may not be built into the collections workflow at all.
- **Midsize/large bank:** Automated collections platforms (e.g., Temenos, FICO TRIAD) can be configured to flag SCRA status, but the flag must be populated by the servicing process (P2) to be actionable.

---

## P5 — Foreclosure Initiation and Management

**What this process does:** Enforces the mandatory DMDC check and court
order requirement before any foreclosure action proceeds on a property held
by a servicemember. This is the highest-risk process in SCRA compliance —
strict liability, criminal penalties for knowing violations, and no DMDC
safe harbor.

**SCRA obligations addressed:**
- Foreclosure prohibition during active duty + one-year tail (Layer 1, Section C.1)
- Independent bank obligation to check military status (Layer 1, Section C.4)
- Court order requirement (Layer 1, Section C.1)
- Affidavit of military status (Layer 1, Section E.1)

### Process steps

| Step | What happens | Data inputs | Control needed |
|---|---|---|---|
| P5.1 | Foreclosure referral decision | Account delinquency, loan type, borrower identity | **Mandatory gate:** DMDC query must be completed and result reviewed before referral to foreclosure counsel. This is not a discretionary step. |
| P5.2 | DMDC query and result review | Borrower SSN, name | Query DMDC. If result shows active duty: **stop** — foreclosure may not proceed without a court order. Retain DMDC certificate with date and response. |
| P5.3 | Active duty result — hold and review | DMDC result (active duty) | Place account in foreclosure hold. Notify servicing team. Assess whether the obligation was incurred pre-service (if so, full foreclosure protection applies). Document the hold basis and date. |
| P5.4 | Not active duty result — proceed with care | DMDC result (not active duty) | Even if DMDC shows not active duty: check loan file for any indicia of military service (returned mail to overseas address, servicemember flag from origination, prior SCRA rate cap). If any indicia present, investigate before proceeding. |
| P5.5 | Referral to foreclosure counsel | DMDC result, loan file | Include DMDC certificate in referral package. Counsel must file affidavit of military status with the court (50 U.S.C. § 3931). |
| P5.6 | Protracted proceedings — re-query | Elapsed time, DMDC result | For foreclosures that extend over time, re-query DMDC before finalizing the foreclosure action. A borrower who was not active duty at referral may have activated since. Re-query at each material step. |
| P5.7 | Post-service tail period check | End-of-service date, foreclosure timeline | If a servicemember recently left active duty, verify the foreclosure does not occur within the one-year tail period. The protection runs for one year after the end of military service — not one year after the bank learns of it. |
| P5.8 | Court order (if servicemember is protected) | Active duty status confirmed | If proceeding with foreclosure on an active duty servicemember, obtain a court order approving the foreclosure before the sale, foreclosure, or seizure. This is a prerequisite, not a formality. |
| P5.9 | Audit record | DMDC certificates, hold documentation, counsel referral, court filings | Retain complete file: every DMDC query and result (date + certificate), every hold/release decision with basis, court filings, and final disposition. |

### Why this process has zero tolerance for shortcuts
The foreclosure provision is strict liability. A bank that forecloses on an
active-duty servicemember — even without knowing the borrower was on active
duty — has committed a violation. The "knowing" qualifier in the criminal
penalty provision raises the stakes for willful process failures. A documented,
consistently-followed DMDC-check procedure is the primary defense against
both regulatory and litigation exposure.

### Tier notes
- **Community bank:** Foreclosures often handled by outside counsel with limited integration into the bank's SCRA tracking system. The DMDC check may fall to counsel rather than the bank — but the bank remains responsible.
- **Midsize/large bank:** Foreclosure workflow should have the DMDC check built in as a system gate, not a manual step. Any foreclosure management platform that does not require DMDC clearance before referral is a control gap.

---

## P6 — Repossession Initiation

**What this process does:** Enforces the court order requirement before any
repossession of personal property (primarily vehicles) securing a pre-service
installment contract. Structurally similar to P5 but with a shorter protection
window (no post-service tail).

**SCRA obligations addressed:**
- Repossession prohibition during active duty (Layer 1, Section D.1)
- Court order requirement (Layer 1, Section D.1)

### Process steps

| Step | What happens | Data inputs | Control needed |
|---|---|---|---|
| P6.1 | Repossession referral decision | Account delinquency, collateral type, borrower identity | **Mandatory gate:** DMDC query before any referral to repossession vendor or initiation of repossession action. |
| P6.2 | DMDC query and result | Borrower SSN, name | Query DMDC. Active duty result → repossession may not proceed without court order. Retain certificate. |
| P6.3 | Pre-service contract verification | Loan origination date, active duty start date | Confirm deposit or installment payment was made before servicemember entered military service. If obligation is in-service (MLA scope), SCRA repossession protection does not apply — but MLA protections may. |
| P6.4 | Active duty result — hold | DMDC result | Place account in repossession hold. Document basis and date. Court order required to proceed. |
| P6.5 | End of service — protection expiry | Return-from-service date | Unlike foreclosure, repossession protection ends when military service ends (no tail period). Monitor for return from service via P7. Once confirmed off active duty, repossession may proceed under standard process (subject to any applicable state law). |
| P6.6 | Audit record | DMDC certificates, hold documentation | Retain same file structure as P5. |

### Tier notes
- **Auto lenders / banks with vehicle portfolios:** Repossession vendors (third-party) are a high-risk dependency. The bank is responsible for SCRA compliance even when repossession is outsourced. Vendor contracts should include SCRA check requirements; bank should audit vendor compliance.

---

## P7 — Return from Service

**What this process does:** Detects when a servicemember's active duty period
ends and manages the transition back to pre-service loan terms. This process
is often under-engineered — banks focus on applying SCRA benefits when
servicemembers activate, but the return-from-service workflow has its own
compliance requirements and failure modes.

**SCRA obligations addressed:**
- Interest rate restoration timing (Layer 1, Section B.3)
- Mortgage tail period — rate cap continues one year post-service (Layer 1, Section B.3)
- Credit bureau furnishing accuracy (FCRA intersection)
- Repossession protection expiry (Layer 1, Section D.2)

### Process steps

| Step | What happens | Data inputs | Control needed |
|---|---|---|---|
| P7.1 | Return-from-service detection | Ongoing DMDC batch queries (P2), servicemember notification, military orders end date | Detect end of active duty via DMDC status change on regular batch query, or via direct notification from servicemember. Do not rely solely on servicemember notification — DMDC query is the proactive control. |
| P7.2 | Mortgage tail period determination | Loan type, end-of-service date | For mortgage accounts: rate cap continues for one year after end of active duty. Calculate the tail period end date and record it. Do not restore pre-service rate on mortgage until tail period expires. |
| P7.3 | Non-mortgage rate restoration | Loan type, end-of-service date | For all non-mortgage products: pre-service contractual rate may be restored upon end of active duty. Advance notice to borrower required under Regulation Z (12 C.F.R. § 1026.9(c)(2)(iv)(A)) before increasing rate. |
| P7.4 | Credit card — rate restoration mechanics | Account type, pre-service rate | On credit card accounts: may return to pre-service rate, but may not apply a rate higher than pre-service to any transaction that occurred before active duty. New transactions post-service may be charged at pre-service rate going forward. (12 C.F.R. § 1026.55(b)(6)) |
| P7.5 | Repossession hold release | End-of-service date, DMDC confirmation | For accounts in repossession hold (P6): protection ends at end of active duty (no tail). Release hold once end of service is confirmed. Standard repossession process may resume. |
| P7.6 | Credit bureau furnishing review | Payment history during SCRA period | Review any adverse credit reporting during the SCRA-protected period. Any delinquency that was caused by excess interest that the SCRA required to be forgiven must not be reported as a delinquency — this is a FCRA accuracy obligation, not just an SCRA concern. Suppress or correct as appropriate. |
| P7.7 | Statement accuracy check | First post-SCRA statement | Verify the first statement after rate restoration reflects the correct rate and payment amount. A statement showing the wrong rate post-restoration is a compliance finding. |
| P7.8 | File closure | Full SCRA record | Document end-of-service date, tail period (if applicable), rate restoration date, credit bureau actions taken, and final account status. |

### Common failure modes in this process
- Restoring the mortgage rate before the one-year tail period expires
- Restoring the rate on a credit card to a rate higher than the pre-service contractual rate
- Failing to correct adverse credit reporting caused by SCRA-protected interest
- Not providing required Regulation Z advance notice before restoring a higher rate

---

## P8 — Lease Termination Processing

**What this process does:** Handles servicemember-initiated early termination
requests for premises or motor vehicle leases. For banks, this is most
relevant where the bank is a lessor under a vehicle lease product, or where
the bank holds or services lease portfolios. The bank's obligation here is
to accept and process valid terminations — not to verify that the servicemember
"really" needs to terminate.

**SCRA obligations addressed:**
- Early lease termination rights — premises and motor vehicle leases (Layer 1, Section H)

### Process steps

| Step | What happens | Data inputs | Control needed |
|---|---|---|---|
| P8.1 | Termination notice received | Written notice, military orders or CO certification | Log receipt with date and channel. Confirm written notice is present. Confirm documentation establishes qualifying military orders (type of orders, duration, PCS or deployment status). |
| P8.2 | Lease type determination | Lease agreement | Determine whether lease is for premises or motor vehicle — each has different qualifying criteria for what orders trigger the right. |
| P8.3 | Eligibility determination | Orders type, duration, lease execution date | Confirm qualifying conditions: for vehicle leases, orders must be for 180+ days or qualifying PCS; for premises, 90+ days or entry into service during lease term. Stop movement orders are also a qualifying trigger. |
| P8.4 | Vehicle return (motor vehicle leases) | Notice date | For motor vehicle leases: servicemember must return the vehicle within 15 days of delivering notice. Track this deadline; process termination upon return. |
| P8.5 | Lease termination processing | Eligibility confirmed | Process termination. No early termination penalty may be charged. Any pre-paid rent or lease payments beyond the termination date must be refunded. |
| P8.6 | Termination confirmation | Termination date, refund amount | Provide written confirmation of termination, effective date, and any refund owed to servicemember. |
| P8.7 | File documentation | Notice, orders, eligibility determination, termination confirmation, refund | Retain complete file for examination and litigation defense. |

### Edge cases
- **Spouse-initiated termination:** The spouse may terminate leases if the servicemember dies or suffers catastrophic illness or injury during service.
- **Joint leases:** Termination of a joint lease by one lessee under SCRA terminates the obligation of any dependents on the same lease.
- **Stop movement orders:** Added as a qualifying trigger by NDAA 2020 — may not be in older policy/procedure documents. Worth checking that intake staff know this is valid documentation.

---

## P9 — Civil Litigation / Debt Recovery Actions

**What this process does:** Manages SCRA compliance obligations when the
bank initiates civil proceedings against a servicemember borrower — collection
lawsuits, deficiency judgment actions, or any other civil debt recovery action.
This process is primarily a legal and collections function, but it depends on
the same DMDC query infrastructure and loan-level military status records
produced by servicing.

**SCRA obligations addressed:**
- Stay of proceedings (Layer 1, Section F.1–F.4)
- Tolling of statutes of limitation (Layer 1, Section G.1–G.3)
- Default judgment affidavit requirement (Layer 1, Section E.1–E.3, also
  covered in P4 for collections escalation — P9 covers standalone civil filings)

### Process steps

| Step | What happens | Data inputs | Control needed |
|---|---|---|---|
| P9.1 | Pre-filing military status check | Borrower SSN, name, loan record | Before initiating any civil action against a borrower, run DMDC query to determine current military status. Check loan record for prior SCRA flags, prior rate cap applications, or military affiliation indicator from origination. This is a mandatory gate — not a discretionary pre-filing check. |
| P9.2 | Limitations period calculation | Charge-off date, default date, applicable state limitations period, active duty periods from DMDC/loan record | Before filing on any account where a limitations period is a factor, calculate whether any period of active military service must be excluded from the limitations period under 50 U.S.C. § 3936. Document the calculation and its inputs. |
| P9.3 | Filing decision and affidavit preparation | DMDC result, limitations calculation | If proceeding: prepare affidavit of military status per 50 U.S.C. § 3931 for filing with the court. Affidavit must state whether defendant is or is not in military service, or that plaintiff is unable to determine status. If active duty confirmed: assess whether to proceed (court order / appointed counsel required) or defer until service ends. |
| P9.4 | Stay recognition and management | Court order, active duty status | If a stay is granted under 50 U.S.C. § 3932 — whether on servicemember application or court's own motion — place the matter in a litigation hold. Calendar the stay period. Do not treat the stay as a limitations period expiry event (the limitations period is itself tolled during service). |
| P9.5 | Stay expiry and resumption | Stay end date, end-of-service date | Upon expiry of the stay or end of military service, assess whether to resume proceedings. Re-run DMDC query to confirm current status before resuming. Recalculate limitations period as of the date of resumption. |
| P9.6 | Post-judgment — deficiency actions | Judgment date, end-of-service date | For deficiency judgment actions following foreclosure or repossession: confirm the limitations period for the deficiency claim has been correctly calculated with any tolling period excluded. |
| P9.7 | Audit record | DMDC certificates, limitations calculation, affidavit, stay documentation, court filings | Retain complete file: DMDC query results, limitations period calculation with methodology, affidavit of military status, any stay orders received, and final disposition. |

### Key dependencies on upstream processes

This process depends critically on accurate military status records from P1
(origination) and P2 (ongoing monitoring). The tolling calculation at P9.2
requires knowing the exact dates of any active duty periods during the life
of the account. If those periods are not recorded in the loan file, the
legal team cannot perform the calculation correctly.

### Tier notes
- **Community bank:** Civil litigation often handled by outside counsel with no direct integration into the bank's SCRA tracking system. The DMDC check and limitations calculation may fall entirely to counsel — but the bank remains responsible. Counsel engagement letters should specify SCRA compliance requirements.
- **Midsize/large bank:** Legal and recovery teams should have direct access to the loan-level SCRA status fields produced by servicing. A litigation management platform that does not surface SCRA status before filing is a control gap.

---

## Cross-process summary: SCRA obligations by process

| SCRA obligation (Layer 1 ref) | P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 |
|---|---|---|---|---|---|---|---|---|---|
| Coverage determination / DMDC (A.1–A.4) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | | ✓ |
| Interest rate cap — application (B.1–B.4) | | ✓ | ✓ | ✓ | | | | | |
| Interest rate cap — proactive (B.5) | | ✓ | | | | | | | |
| Interest rate — restoration (B.3 tail) | | | | | | | ✓ | | |
| Foreclosure protection (C.1–C.4) | | | | ✓ | ✓ | | | | |
| Repossession protection (D.1–D.4) | | | | ✓ | | ✓ | ✓ | | |
| Default judgment affidavit (E.1–E.3) | | | | ✓ | ✓ | ✓ | | | ✓ |
| Stay of proceedings (F.1–F.4) | | | | | | | | | ✓ |
| Tolling of limitations (G.1–G.3) | | | | | | | | | ✓ |
| Lease termination (H.1–H.3) | | | | | | | | ✓ | |
| Vendor responsibility (J.1–J.3) | | | | ✓ | ✓ | ✓ | | | ✓ |
| Record retention (K) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

---

## Next steps for this document

- [ ] Validate process flows against actual bank procedure documentation (SOP review) — current flows are derived from regulatory guidance, not observed bank practice
- [ ] Add state law overlay note — several states have SCRA-equivalent or enhanced protections; the process map above covers federal floor only
- [ ] Cross-reference each process step to the control matrix (Layer 3) once P9 controls are added
- [ ] Consider whether P9 warrants splitting into (a) pre-filing / debt recovery and (b) active litigation management — depends on how banks organizationally separate legal from collections
