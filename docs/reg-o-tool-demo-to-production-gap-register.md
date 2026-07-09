# Regulation O Insider Credit Threshold Tool — Demo-to-Production Gap Register

## Scope and purpose

This document exists because a working, well-designed demo is not a
production system, and pretending otherwise is exactly the kind of
overclaim this project has tried to avoid elsewhere. It inventories every
gap between what the current tool actually does and what an institution
would need before this touched a real insider's real credit file — and it
draws an explicit line around what an AI assistant can and cannot
responsibly do to close each gap.

**A note on authorship going forward:** everything in this register was
identified and drafted with AI assistance. Closing these gaps is a
different kind of task — most of it requires people, systems, and
authority an AI assistant does not have. Each item below states who
actually needs to own it.

---

## What an AI assistant can and cannot do here

**Can do:**
- Write real backend code — database schema, API layer, server-side
  enforcement of the rules engine logic
- Design an access-control and integration architecture as a specification
- Draft a security requirements spec and a threat model as a starting point
  for review
- Cite the actual regulatory text accurately, including where it is silent
  (see the retention section below)
- Document gaps honestly, the way this register does

**Cannot do:**
- Operate, host, or maintain any real infrastructure
- Perform or substitute for a security review or penetration test
- Make a binding record-retention determination — that is an institutional
  legal/compliance decision informed by more than one regulation
- Access or integrate with any institution's actual identity provider,
  core banking system, or org chart
- Substitute for the sign-off of a CISO, compliance officer, or legal
  counsel before this touches real data

---

## P1 — Blocking gaps (would disqualify this from any real use today)

| # | Gap | Current demo state | Production requirement | Owner |
|---|---|---|---|---|
| 1 | **Client-side data storage** | Ledger and audit log live in the browser's `localStorage`. Trivially readable, editable, or deletable via browser dev tools by anyone with access to the machine. | Server-side database with proper access controls; no compliance-relevant data should ever live only in the browser. | Engineering, in consultation with Compliance |
| 2 | **No authentication** | Anyone who opens the file can act as any insider, submit any request, and see the full ledger and audit history. There is no login. | Integration with the institution's SSO/identity provider; every action tied to an authenticated, provisioned user, not a name typed or selected in a form. | IT Security / Identity & Access Management |
| 3 | **No authorization / role separation** | The same unauthenticated user can enter data, view every insider's balance, and would — in the pre-clearance tool's pattern — also be able to click "approve." Nothing stops one person from performing every role. | Role-based access control: who can submit a request, who can view which insiders' data, who can record a board's approval. These should be different privileges held by different people. | IT Security, Compliance |
| 4 | **Client-side rules engine is not tamper-resistant** | All threshold logic runs in the browser. A technically capable user could alter the JavaScript before it evaluates their own request, or intercept the result. | Threshold calculations must run server-side, on data the client cannot alter, with the client treated as an untrusted display layer only. | Engineering |
| 5 | **Roster is hardcoded, not a real identity source** | The 12 people and their insider categorizations are literally written into the file's source code. | The insider roster — who is currently an executive officer, director, or principal shareholder — must come from the bank's actual, current annual insider survey (itself a Reg O requirement, § 215.8(b)(1)), not a static list a developer wrote once. | Compliance (owns the insider survey), Engineering (integration) |

---

## P2 — Necessary before production, not immediately disqualifying for a pilot

| # | Gap | Current demo state | Production requirement | Owner |
|---|---|---|---|---|
| 6 | **Record retention period is undefined** | The tool stores data indefinitely until manually reset; retention has not been decided. | **Reg O itself does not specify a retention period.** § 215.8 requires a bank to "maintain records necessary for compliance" but sets no duration. (The only explicit retention figure in Part 215 — two years — appears in § 215.9(c), and governs disposal of *public disclosure request* records specifically, not the underlying insider-credit records.) The actual retention period has to be set by the institution's records management program, informed by examination cycle length, applicable state statutes of limitations, and litigation-hold practice — not invented here. | Legal / Records Management, with Compliance |
| 7 | **No board-approval workflow state** | When the engine determines board approval is required, the tool logs that determination and stops. It does not track whether the board actually approved it, when, or by what vote. | A real pending-board-approval state, similar in spirit to the pre-clearance tool's manager-approval queue: the extension should not be treated as "outstanding" in the ledger until the board's approval is actually recorded, by an authorized party, with the insider's abstention documented. | Engineering, Corporate Secretary's office (owns board minute-taking) |
| 8 | **Annual insider survey is not modeled at all** | The tool assumes the roster is always current. | § 215.8(b)(1) requires an *annual survey* to identify all insiders — people move into and out of insider status (a new director joins, a principal shareholder's stake drops below 10%). The tool needs a process, not just a static list, to stay accurate over time. | Compliance |
| 9 | **No integration with actual loan origination systems** | Every figure — the bank's capital, an insider's existing balance, a new extension amount — is typed in manually. | In production, "existing aggregate exposure" should be pulled from the core banking/loan system, not re-entered by whoever is running the check, which is both an efficiency problem and a data-integrity risk (manual entry can drift from the system of record). | Engineering, Core Banking / IT |
| 10 | **Unimpaired capital and surplus is a manually entered, unvalidated number** | Anyone can type any figure into the bank-config field, and every threshold in the tool derives from it. | This figure should be pulled from the bank's actual regulatory capital reporting (Call Report data or equivalent), not hand-entered, since every downstream threshold is only as correct as this one number. | Finance / Regulatory Reporting |

---

## P3 — Hardening and defense-in-depth

| # | Gap | Current demo state | Production requirement | Owner |
|---|---|---|---|---|
| 11 | **No encryption at rest or in transit specified** | N/A — there is no real transit or persistent storage yet to encrypt. | Standard requirement once real infrastructure exists: encryption at rest for the database, TLS for any transit, consistent with the institution's existing data-classification standards. | IT Security |
| 12 | **Audit log is not immutable** | Even once moved server-side, nothing in this register yet specifies append-only, tamper-evident logging. | Audit entries should be write-once (e.g., append-only log or hash-chained records), since the whole point of an audit trail is that it can't be quietly edited after the fact — including by someone with legitimate database access. | Engineering, IT Security |
| 13 | **No incident response or rollback plan** | Not addressed. | Mirrors the Layer 4 governance pattern already used elsewhere in this project for AI agents: what happens if the rules engine is found to have miscalculated a threshold after deployment — who is notified, how far back do determinations get re-reviewed, what's the correction and disclosure process. | Compliance, Engineering |
| 14 | **No documented threat model** | Not addressed. | A real threat model — who might want to manipulate this system and how (an insider trying to hide their own over-threshold borrowing is a specific, non-hypothetical threat actor here) — should precede a security review, not substitute for one. | IT Security |

---

## What this register deliberately does not attempt

This document does not propose specific vendor products, a specific cloud
architecture, or a specific retention period, because those are
institution-specific decisions this project has no basis to make. Where a
number is missing above (retention period, specific RBAC roles, specific
encryption standards), that is a decision left to the institution, not an
oversight in this register.

---

## Status

🚧 This is a gap register, not a build plan. None of the P1 items are
closed. This tool remains a portfolio demonstration of regulatory
decomposition and deterministic rules-engine design — not a system ready
for a real insider's real credit file.
