# Pre-Clearance Determination System — Demo-to-Production Gap Register

## Scope and purpose

This document exists for the same reason its counterpart does for the
Regulation O tool: a working, well-designed demo is not a production
system, and pretending otherwise is exactly the kind of overclaim this
project has tried to avoid elsewhere. It inventories every gap between
what the current tool actually does and what an institution would need
before this touched a real employee's real gift, entertainment, or
anti-bribery pre-clearance request — and it draws an explicit line around
what an AI assistant can and cannot responsibly do to close each gap.

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
  or where a threshold is a firm-policy overlay rather than a statutory
  bright line (see the methodology notes already in the tool itself)
- Document gaps honestly, the way this register does

**Cannot do:**
- Operate, host, or maintain any real infrastructure
- Perform or substitute for a security review or penetration test
- Make a binding record-retention determination — that is an institutional
  legal/compliance decision informed by more than one regulation
- Access or integrate with any institution's actual identity provider,
  vendor/counterparty master, expense system, or org chart
- Substitute for the sign-off of a CISO, compliance officer, or legal
  counsel before this touches real data

---

## P1 — Blocking gaps (would disqualify this from any real use today)

| # | Gap | Current demo state | Production requirement | Owner |
|---|---|---|---|---|
| 1 | **Client-side data storage** | Requests, the manager approval queue, the recipient ledger, and the audit log all live in the browser's `localStorage`. Trivially readable, editable, or deletable via browser dev tools by anyone with access to the machine. | Server-side database with proper access controls; no compliance-relevant data should ever live only in the browser. | Engineering, in consultation with Compliance |
| 2 | **No authentication** | The manager's name is free text typed into the request form. The Approve/Reject buttons on the manager queue simulate that action for anyone who opens the page — the tool's own hint text already flags this as a demo simplification. | Integration with the institution's SSO/identity provider; every action (submission, approval, rejection, second-line review) tied to an authenticated, provisioned user, not a name typed into a field. | IT Security / Identity & Access Management |
| 3 | **No authorization / role separation** | The same unauthenticated user can submit a request as any requestor, act as the approving manager, and view the full ledger, second-line determinations, and audit log. Nothing stops one person from performing every role in the workflow. | Role-based access control: who can submit a request, who can act on a specific manager's queue, who can view which requestors' or recipients' data, who can see Legal/Compliance escalations. These should be distinct, provisioned privileges. | IT Security, Compliance |
| 4 | **Client-side rules engine is not tamper-resistant** | All threshold logic — the FINRA/MSRB gift limit, the FCPA foreign-official routing, the federal employee de minimis check — runs in the browser. A technically capable user could alter the JavaScript before it evaluates their own request, or intercept the determination before it's logged. | Threshold calculations must run server-side, on data the client cannot alter, with the client treated as an untrusted display layer only — same requirement as the Reg O tool's equivalent gap. | Engineering |
| 5 | **Recipient identity is free text, not resolved against a real identity source** | The recipient name/identifier used to track annual gift/entertainment aggregation is typed in as free text on every request. This is the exact class of bug already found and fixed in the Reg O tool's insider roster — "Art Vandelay" and "art vandelay " (trailing space) would silently be tracked as two different recipients with two separate YTD totals, understating actual aggregate exposure to any one person. | Recipient identity should resolve against a real, stable identifier — a vendor/counterparty master for external recipients, an employee ID or HR record for internal ones — the same fix already applied to the Reg O tool's insider roster, not re-applied here yet. | Compliance (owns the recipient/vendor data), Engineering (integration) |

---

## P2 — Necessary before production, not immediately disqualifying for a pilot

| # | Gap | Current demo state | Production requirement | Owner |
|---|---|---|---|---|
| 6 | **Record retention period is undefined** | The tool stores data until manually reset via "Reset all stored data"; retention has not been decided. | The Bank Bribery Act (18 U.S.C. § 215), FCPA, and FINRA/MSRB gift rules were not individually re-verified for this register against an explicit retention duration, and this project has not confirmed one exists in any of them as a clean bright line. The actual retention period has to be set by the institution's records management program, informed by examination cycle length, applicable state statutes of limitations, and litigation-hold practice — not invented here, and not assumed to be absent without that verification being done properly. | Legal / Records Management, with Compliance |
| 7 | **Manager identity is not resolved from a reporting-line hierarchy** | The tool's own hint text already states this: "In production, only the named manager — authenticated, resolved from the reporting-line hierarchy — could act on their own queue items." That resolution doesn't exist yet. | Integration with the institution's HR/org-chart system so a request routes to the requestor's actual manager, not whoever types a name into the field. | Engineering, HR Systems |
| 8 | **No verification that a "foreign official" recipient is actually who the form says** | Country and agency are selected from dropdowns; nothing confirms the named recipient actually holds that role at that agency. | In production, FCPA-relevant determinations this consequential would typically be cross-checked against a maintained foreign-official/PEP (politically exposed person) reference list, not taken solely on the requestor's self-reported category selection. | Compliance, Legal |
| 9 | **Firm-policy overlay thresholds are hardcoded, not sourced from a maintained policy document** | The tool's own methodology notes correctly disclose that several thresholds (the $250 general-customer ceiling, the $50 foreign-official logging threshold, the 4-events/year entertainment frequency flag) are firm-policy choices, not statutory bright lines — but they're still hardcoded into this file's source. | These figures should be pulled from the institution's actual, currently-in-force Gift & Entertainment policy, which a compliance team can update independent of any statutory change — and which this tool would otherwise silently drift out of sync with the moment that policy is revised. | Compliance (owns the policy), Engineering (integration) |
| 10 | **No integration with expense, procurement, or corporate card systems** | Year-to-date aggregation is entirely dependent on what gets typed into this tool. A gift or entertainment expense submitted through a corporate card or expense report with no corresponding pre-clearance entry would never be counted against the recipient's YTD total here. | In production, this tool's aggregation should reconcile against (or ideally pull directly from) actual expense/procurement data, not rely on requestors remembering to log every instance themselves. | Engineering, Finance / Expense Systems |

---

## P3 — Hardening and defense-in-depth

| # | Gap | Current demo state | Production requirement | Owner |
|---|---|---|---|---|
| 11 | **No encryption at rest or in transit specified** | N/A — there is no real transit or persistent storage yet to encrypt. | Standard requirement once real infrastructure exists: encryption at rest for the database, TLS for any transit, consistent with the institution's existing data-classification standards. | IT Security |
| 12 | **Audit log is not immutable** | Even once moved server-side, nothing in this register yet specifies append-only, tamper-evident logging. | Audit entries should be write-once (e.g., append-only log or hash-chained records), since the whole point of an audit trail is that it can't be quietly edited after the fact — including by someone with legitimate database access. | Engineering, IT Security |
| 13 | **No incident response or rollback plan** | Not addressed. | Mirrors the Layer 4 governance pattern already used elsewhere in this project for AI agents, and the equivalent gap already logged for the Reg O tool: what happens if the rules engine is found to have misapplied a threshold after deployment — who is notified, how far back do determinations get re-reviewed, what's the correction and disclosure process. | Compliance, Engineering |
| 14 | **No documented threat model** | Not addressed. | A real threat model should precede a security review, not substitute for one. A specific, non-hypothetical threat actor here: an employee structuring gifts to stay just under a per-occasion or annual threshold, or splitting one gift across multiple smaller entries to avoid the aggregation flag — a risk directly enabled by gap #5 (unresolved recipient identity) above until that's fixed. | IT Security, Compliance |

---

## Governance ownership and policy home — not asserted here

Same position as the Reg O tool's register, and for the same reason: this
document does not claim this tool would be governed under any specific
existing bank policy — End User Computing (EUC), IT-owned application
governance, or otherwise. That determination depends on a materiality-based
tiering process specific to the institution, informed by its existing EUC
population, SDLC capacity, and risk appetite, none of which this project
has visibility into.

What can be said: this tool produces binding determinations (`APPROVED`,
`ESCALATED`, `PROHIBITED`) that route directly into a two-line approval
workflow, not a reference number a human independently re-derives before
acting — the same reasoning that applies to the Reg O tool. A real
institution's EUC risk-tiering process would likely rate this above the
threshold where EUC governance is the steady-state answer, which would
trigger migration to IT-owned SDLC governance rather than leaving it
governed as an EUC indefinitely. Which policy actually applies, and which
function ultimately owns it, is an institutional decision made at
deployment time, not something this project can responsibly assert in
advance.

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
for a real employee's real pre-clearance request.
