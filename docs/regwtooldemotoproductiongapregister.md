# Regulation W Affiliate Transaction Compliance Tool — Demo-to-Production Gap Register

## Scope and purpose

This document exists for the same reason its counterpart does for the Reg O
tool: a working, well-designed demo is not a production system, and
pretending otherwise would undercut the honesty this project is trying to
demonstrate. It inventories every gap between what the current tool
actually does and what an institution would need before this touched a
real affiliate transaction — and draws an explicit line around what an AI
assistant can and cannot responsibly do to close each gap.

**A note on authorship:** everything in this register was identified and
drafted with AI assistance. Closing these gaps is a different kind of
task — most of it requires people, systems, and authority an AI assistant
does not have. Each item below states who actually needs to own it.

---

## What an AI assistant can and cannot do here

**Can do:**
- Write real backend code — database schema, API layer, server-side
  enforcement of the rules-engine logic
- Design an access-control and integration architecture as a specification
- Draft a security requirements spec and a threat model as a starting point
  for review
- Cite the actual regulatory text accurately, including where a real
  production question (like the exact retention period) is left to the
  institution rather than fabricated here
- Document gaps honestly, the way this register does

**Cannot do:**
- Operate, host, or maintain any real infrastructure
- Perform or substitute for a security review or penetration test
- Make a binding record-retention or materiality-tiering determination —
  those are institutional legal/compliance decisions
- Access or integrate with any institution's actual capital reporting,
  affiliate ownership records, core banking system, or org chart
- Substitute for the sign-off of a CISO, compliance officer, or legal
  counsel before this touches a real affiliate's real transaction

---

## P1 — Blocking gaps (would disqualify this from any real use today)

| # | Gap | Current demo state | Production requirement | Owner |
|---|---|---|---|---|
| 1 | **Client-side data storage** | The affiliate registry, ledger, audit log, and (as of v1.1) any attached market-terms evidence file all live in the browser's `localStorage`. Trivially readable, editable, or deletable via browser dev tools by anyone with access to the machine — and now that includes whatever sensitive pricing/business detail is inside an attached evidence file, not just the transaction figures. | Server-side database with proper access controls; no compliance-relevant data, and especially no uploaded evidentiary document, should ever live only in the browser. | Engineering, in consultation with Compliance |
| 2 | **No authentication** | Anyone who opens the file can act as any LOB reviewer, add affiliates, and see the full ledger and audit history. There is no login. | Integration with the institution's SSO/identity provider; every determination tied to an authenticated, provisioned user. | IT Security / Identity & Access Management |
| 3 | **No authorization / role separation** | The same unauthenticated user runs the intake form, sees every affiliate's exposure, and would — in a real workflow — also need to record legal/compliance sign-off. Nothing separates these roles. | Role-based access control matching the actual process map: who can submit a determination, who can view top-of-house aggregate exposure, who can record legal sign-off or a regulator-granted exemption. | IT Security, Compliance |
| 4 | **Client-side rules engine is not tamper-resistant** | All threshold, collateral, and market-terms logic runs in the browser. A technically capable user could alter the JavaScript before it evaluates their own transaction. | Threshold and collateral calculations must run server-side, on data the client cannot alter, with the client treated as an untrusted display layer only. | Engineering |
| 5 | **Affiliate registry is user-editable demo data, not a real data source** | Affiliates, their ownership percentages, and their common-control/depository-institution flags are typed into a form by whoever is using the tool. | The affiliate registry — who is currently an affiliate, at what ownership level, and whether the sister-bank exemption's ≥80%-common-control-and-depository-institution test is actually met — must come from the institution's actual corporate structure records, not a form any user can fill in to make an exemption apply. | Legal (owns the corporate structure of record), Compliance, Engineering (integration) |
| 6 | **Capital stock and surplus is a manually entered, unvalidated number** | Anyone can type any figure into the bank-configuration field, and every threshold in the tool derives from it — identical in kind to gap #10 in the sibling Reg O register. | This figure should be pulled from the bank's actual regulatory capital reporting (Call Report data or equivalent), not hand-entered, since every downstream threshold is only as correct as this one number. | Finance / Regulatory Reporting |

---

## P2 — Necessary before production, not immediately disqualifying for a pilot

| # | Gap | Current demo state | Production requirement | Owner |
|---|---|---|---|---|
| 7 | **The attribution-rule judgment call is a manual radio button, not a reviewed determination** | A user self-selects "yes / no / ambiguous" for whether a nonaffiliate transaction's proceeds benefit an affiliate, with no evidence trail behind the answer. | Either a documented manual review process with supporting rationale attached to each determination, or — as scoped but explicitly deferred in docs/layer2-regw.md — a governed Track A agent that reads the transaction narrative and flags risk for human review, versioned and evaluated like this repo's other Track A agents. | Compliance, Engineering (if the Track A phase is built) |
| 8 | **Market-terms evidence capture is a client-side stand-in, not a real evidentiary record** | As of v1.1, the tool captures a reviewer name and lets the user attach one supporting file (capped at 1MB) alongside the "market terms confirmed" flag, and flags the determination when neither is provided. This closes the *shape* of the gap but not the substance: there's no verification the named reviewer is a real, authorized, independent person (gap #2/#3 — no auth means anyone can type any name); the file is stored as a base64 blob in `localStorage` with no encryption, access control, retention policy, or malware scanning; and nothing stops someone from attaching an unrelated or fabricated file. | Real identity-verified reviewer attribution (tied to SSO, not a free-text name), evidence stored in a proper document management or GRC system with access controls and retention rules, and ideally a link to the actual comparable-transaction data source rather than an opaque attached file. | Credit Risk / Independent Pricing function, Compliance, IT Security |
| 9 | **No individual-exemption workflow state** | When the engine determines a transaction would breach the aggregate or single-affiliate limit, it stops and routes to "Legal / Top-of-House." It does not track whether an exemption application was actually filed, or whether the primary regulator granted it (as OCC Int. Ltr. #1191 illustrates is a real, available path). | A real pending-exemption state: the transaction should not be treated as eligible to proceed until the regulator's grant is actually recorded, by an authorized party, with the grant's specific conditions documented. | Engineering, Legal |
| 10 | **Annual affiliate determination is not modeled at all** | The tool assumes the affiliate registry is always current. | Affiliate status can change — a fund is no longer advised by the bank, an ownership stake crosses or drops below a control threshold — and a real program needs a recurring process to keep the registry accurate, not a static list. | Compliance |
| 11 | **No integration with actual credit/core banking systems** | Every figure — capital, an affiliate's existing exposure, a new transaction's amount and collateral value — is typed in manually. | In production, "existing outstanding exposure" should be pulled from the core banking/loan system and collateral custody records, not re-entered by whoever is running the check. | Engineering, Core Banking / IT |
| 12 | **No board-approval-equivalent audit trail for exemption grants** | Nothing in the tool distinguishes a transaction that was simply within limits from one that only proceeded because of a regulator-granted exemption. | The exemption grant itself (the letter, its conditions, its date) should be an attached, retrievable record tied to every transaction booked under it — this is exactly the kind of documentation an examiner would ask to see first. | Legal, Compliance |

---

## P3 — Hardening and defense-in-depth

| # | Gap | Current demo state | Production requirement | Owner |
|---|---|---|---|---|
| 13 | **No encryption at rest or in transit specified** | N/A — there is no real transit or persistent storage yet to encrypt. | Standard requirement once real infrastructure exists: encryption at rest for the database, TLS for any transit, consistent with the institution's existing data-classification standards. | IT Security |
| 14 | **Audit log is not immutable** | Even once moved server-side, nothing in this register yet specifies append-only, tamper-evident logging. | Audit entries should be write-once (e.g., append-only log or hash-chained records) — the whole point of an audit trail is that it can't be quietly edited after the fact, including by someone with legitimate database access. | Engineering, IT Security |
| 15 | **No incident response or correction plan** | Not addressed. | Mirrors the Layer 4 governance pattern used elsewhere in this project: what happens if the rules engine is found to have miscalculated a limit or haircut after deployment — who is notified, how far back do determinations get re-reviewed, what's the correction and (if warranted) self-disclosure process to the primary regulator. | Compliance, Engineering |
| 16 | **No documented threat model** | Not addressed. | A real threat model — including the specific, non-hypothetical scenario of a business line trying to structure a transaction to appear exempt or under-threshold — should precede a security review, not substitute for one. | IT Security |

---

## Governance ownership and policy home — not asserted here

This register does not claim this tool would be governed under any
specific existing bank policy — End User Computing (EUC), IT-owned
application governance, or otherwise — for the same reasons the Reg O
register declines to. That determination depends on a materiality-based
tiering process specific to the institution.

What can be said: this tool produces binding determinations
(`blocked_aggregate`, `blocked_single_affiliate`, `ineligible_collateral`,
`insufficient_collateral`) that would route directly into a funding
decision, not a reference number a human independently re-derives before
acting — a real institution's EUC risk-tiering process would likely rate
that above the threshold where EUC governance is the steady-state answer,
pointing toward IT-owned SDLC governance as the more appropriate eventual
destination. Which function ultimately owns it in production — Operational
Risk, IT Application Risk Management, Compliance, or some combination — is
an institutional decision this register does not make.

---

## What this register deliberately does not attempt

This document does not propose specific vendor products, a specific cloud
architecture, or a specific retention period, because those are
institution-specific decisions this project has no basis to make.

---

## Status

🚧 This is a gap register, not a build plan. None of the P1 items are
closed. This tool remains a portfolio demonstration of regulatory
decomposition and deterministic rules-engine design — not a system ready
for a real affiliate's real transaction.
