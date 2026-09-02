---
layout: default
title: Regulation O Insider Credit Threshold Tool — RMAS
og_title: Regulation O Insider Credit Threshold Tool — RMAS
og_description: A deterministic rules engine for insider-lending thresholds under 12 CFR Part 215 — built with AI, running with none of it in the decision path.
description: How a Regulation O insider-credit threshold check gets built as ordinary deterministic software instead of an AI agent, and what's actually missing before it could run in a real bank.
---

# Regulation O Insider Credit Threshold Tool

[← Back to RMAS](https://sadiqshifa.github.io/RMAS/) · [Try the tool](https://sadiqshifa.github.io/RMAS/tools/reg-o-insider-credit-tool.html) · [Full demo-to-production gap register](https://sadiqshifa.github.io/RMAS/docs/reg-o-tool-demo-to-production-gap-register.md)

Regulation O (12 CFR Part 215) governs what a bank can lend to its own
insiders — executive officers, directors, principal shareholders — without
it becoming a safety-and-soundness problem or a conflict of interest. Most
of the rule is not a judgment call. It's arithmetic: a percentage of the
bank's capital, a fixed dollar ceiling, an aggregate limit across every
insider combined. That makes it a strong case for the argument this whole
project is built around — that not every compliance control belongs behind
a model, and building it correctly requires knowing that in advance, not
defaulting to AI because that's the tool already in hand.

This tool is a deterministic rules engine. No AI runs at any point in a
determination. It was built with AI assistance, the same as everything
else in this project, but that's a build-time fact, not a runtime one.

---

## What it actually checks

Reg O isn't one rule. It's several, and they don't all behave the same way:

- **The board-approval trigger** (§ 215.4(b)) — an insider's aggregate
  outstanding credit above the higher of $25,000 or 5% of the bank's
  unimpaired capital and surplus needs prior approval by a majority of the
  full board, with the insider abstaining. This can be approved past. It's
  an escalation, not a wall.
- **The executive-officer "other purpose" sub-cap** (§ 215.5(c)(4)) — credit
  to an executive officer for anything outside education, a first-lien home
  loan, or fully secured credit is capped at the higher of 2.5% of capital
  or $25,000, never more than $100,000. Unlike the trigger above, this one
  the board cannot approve past. It's a wall, not an escalation, and the
  tool treats it as one — a different outcome (`PROHIBITED`, not
  `ESCALATED`) for a genuinely different kind of limit.
- **The bank-wide aggregate ceiling** (§ 215.4(d)) — total insider lending,
  everyone combined, capped at the bank's own unimpaired capital and
  surplus.
- **The preferential-terms requirement** (§ 215.4(a)) — every insider
  extension has to be on terms comparable to what a non-insider would get.
  This is the one part of Reg O that's a judgment call, not a number, and
  the tool treats it that way: any answer short of "yes, confirmed
  comparable" routes to Compliance and Legal, the same pattern the
  gifts-and-entertainment tool uses for a corrupt-intent red flag.

Every threshold above is computed from a single number you set once — the
bank's unimpaired capital and surplus — not hardcoded, because Reg O's
limits scale with the institution, not with a fixed dollar figure the way
FINRA's gift rule does.

---

## A concrete walkthrough

The tool ships with a seeded 12-person roster and sample history so the
interesting cases are visible immediately, not buried behind several
manual entries first. One example: an insider sitting at $1,800,000 in
existing credit, $95,000 of it already counted toward the $100,000
executive-officer sub-cap.

A new $6,000 extension for "other purpose" pushes that sub-total to
$101,000 — over the wall. The determination comes back `PROHIBITED`, with
the citation, the arithmetic trace, and the reason no board approval can
fix it.

The same insider, offered an $800,000 home-purchase extension instead,
comes back `ESCALATED — BOARD APPROVAL REQUIRED` — a different rule
entirely (the general trigger, not the sub-cap), and a different kind of
outcome: something the board can actually act on.

Same person, same starting balance, two different regulatory provisions,
two structurally different answers. That distinction — not just "did this
cross a number" but "which number, under which rule, with what consequence"
— is the actual engineering problem this tool solves.

---

## What it would take to run this in a real bank

- **Insider identity and current exposure pulled from real systems** — the
  loan platform for existing balances, the annual insider survey Reg O
  already requires for who currently qualifies — not typed into a form
  from a hardcoded list of twelve names.
- **The rules engine running server-side**, not in the browser, so the
  calculation can't be altered by the person it's evaluating.
- **Authentication and role separation** tied to the bank's actual identity
  provider — who can submit, who approves as a manager, who records a
  board's approval, as distinct privileges.
- **A real board-approval workflow state.** Credit shouldn't count as
  outstanding until the board's approval is actually recorded, not just
  logged as required.
- **A retention period set by Legal and Records Management.** Reg O itself
  doesn't specify one — the only explicit figure in Part 215, two years,
  governs a different, narrower requirement — so this has to be an
  institutional decision, not something inferred from the statute.
- **An actual security review** of running infrastructure, not a document
  describing what one should cover.

Full inventory — fourteen gaps, five blocking, each with an owner who isn't
an AI assistant — in the
[demo-to-production gap register](https://sadiqshifa.github.io/RMAS/docs/reg-o-tool-demo-to-production-gap-register.md).

---

[← Back to RMAS](https://sadiqshifa.github.io/RMAS/) · [The methodology](https://sadiqshifa.github.io/RMAS/docs/methodology.md) · [Try the tool](https://sadiqshifa.github.io/RMAS/tools/reg-o-insider-credit-tool.html)
