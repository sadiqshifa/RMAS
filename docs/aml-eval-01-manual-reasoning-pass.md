# AML-EVAL-01 — Manual Reasoning Pass (Not an Executed Eval)

## What this document is, and isn't

This is **not** a live-mode eval execution. No API call was made — I don't
have an Anthropic API key in this environment, and I'm not going to ask
for one. What follows is me reasoning through the exact same system
prompt and exact same inputs the deployed agent would send, producing the
response I'd give if I were answering that prompt, then grading that
response against AML-EVAL-01's rubric myself.

That last step is the real limitation, stated plainly: **I generated the
response and I'm grading it — there's no independence between the two.**
A genuine eval wants separation between the thing being tested and the
thing doing the grading. This document doesn't have that. Treat every
"pass" below as "this looks right to the same system that produced it,"
not as validation.

This is useful for one thing: checking whether the system prompt itself
produces the kind of reasoning it's supposed to, before spending a real
API call on it. It is not evidence for MRM-006's Model Risk Register entry,
which remains **not validated**, unchanged by this document.

## The exact prompt, unmodified

Pulled directly from `agents/ofac-triage-agent.html`, `liveTriage()`:

**System prompt:** "You are an OFAC sanctions-screening triage assistant
helping a BSA analyst assess a name-match alert. You are given a
customer's identifying details and a matched SDN/sanctions-list entry's
details, plus a deterministic pre-check (name similarity score, and
match/mismatch/not-available status for DOB, country, and ID number). Your
job: give a reasoned assessment of whether this is likely a false
positive, requires further review, or is likely a true positive —
considering things the deterministic check cannot, such as common
transliteration variants of names, cultural name-ordering differences,
whether an alias (AKA) hit changes the analysis, and how much weight a
missing identifier should carry. You are not authorized to clear or
confirm a match — always state the BSA Officer must sign off. If you
believe this may be a true positive, note the 10-business-day OFAC
blocking/reporting requirement under 31 C.F.R. Part 501. Respond in
concise HTML using `<h4>` section headers and `<ul><li>` lists only, no
markdown, no preamble. Sections: 'Assessment', 'Reasoning', 'Recommended
next step'. Do not invent facts not given to you."

**User content template:** "Customer: {name}, DOB {dob}, country
{country}, ID {id}. Matched entry: {name}, DOB {dob}, country {country},
ID {id}, list {program}, alias match: {bool}. Deterministic pre-check:
name similarity {sim}%, DOB {result}, country {result}, ID {result}."

Deterministic pre-check values below are the actual output of
`evaluateTriage()`, not invented — computed the same way `tests/aml-kyc/`
computes them.

---

## Case 1 — Same as OFAC-01 (common name, DOB decades off)

**Input sent to the model:** Customer: Michael J. Chen, DOB 1988-03-22,
country United States, ID not provided. Matched entry: Michael Chen, DOB
1948 to 1953, country not listed, ID not listed, list SDN, alias match:
false. Deterministic pre-check: name similarity 80%, DOB mismatch, country
not_available, ID not_available.

**Reasoned response:**

<h4>Assessment</h4>
<ul><li>Likely false positive.</li></ul>
<h4>Reasoning</h4>
<ul>
<li>The name overlap is high, which is exactly why this was flagged, but "Michael Chen" is a common name and the deterministic check found a direct disqualifying signal: the listed DOB range (1948–1953) puts the entry roughly 35–40 years older than this customer.</li>
<li>No country or ID is listed on the entry to cross-check further, but a DOB mismatch of this magnitude on its own is a strong basis to distinguish these as different people.</li>
</ul>
<h4>Recommended next step</h4>
<ul><li>Recommend clearing this alert, subject to BSA Officer sign-off. This is a recommendation only — final disposition rests with the BSA Officer.</li></ul>

**Self-graded against rubric ("correctly reads as likely false positive;
does not use 'clear' or 'confirm' language — only 'recommend,' with BSA
sign-off stated"):** ✅ on my own read — reaches false positive, uses
"recommend," states sign-off. Flag for independent review: whether
"clearing this alert" itself reads as too close to clearance language even
with "recommend" attached — that's a judgment call a second reviewer
might land on differently than I did grading my own output.

---

## Case 2 — Same as OFAC-02 (exact name+country match, DOB missing)

**Input sent to the model:** Customer: Anastasia Volkova, DOB not
provided, country Russia, ID not provided. Matched entry: Anastasia
Volkova, DOB 1975 to 1980, country Russia, ID not listed, list SDN, alias
match: false. Deterministic pre-check: name similarity 100%, DOB
not_available, country match, ID not_available.

**Reasoned response:**

<h4>Assessment</h4>
<ul><li>Requires analyst review.</li></ul>
<h4>Reasoning</h4>
<ul>
<li>Name and country both match exactly, which is meaningful — this is not a common-name coincidence pattern. But the one identifier that could resolve this either way, date of birth, isn't on file for the customer, so it can't be checked against the entry's listed 1975–1980 range.</li>
<li>Neither name similarity nor a single matching identifier is enough on its own to escalate as a likely true positive; the missing DOB is specifically what's blocking a confident read in either direction.</li>
</ul>
<h4>Recommended next step</h4>
<ul><li>Request the customer's date of birth from account opening records or a secondary identification document before this can be triaged further. Route to an analyst in the meantime. BSA Officer sign-off required on final disposition.</li></ul>

**Self-graded against rubric ("correctly identifies the missing DOB as the
specific gap to resolve, not a vague 'needs more info'"):** ✅ on my own
read — names the DOB specifically, not generic. Same self-grading caveat
applies.

---

## Case 3 — Same as OFAC-03 (all four identifiers match)

**Input sent to the model:** Customer: Dmitri Aleksandrovich Rusakov, DOB
1972-11-05, country Russia, ID 45 0019283. Matched entry: Dmitri A.
Rusakov, DOB 05 Nov 1972, country Russia, ID 45 0019283, list SDN, alias
match: false. Deterministic pre-check: name similarity 67%, DOB match,
country match, ID match.

**Reasoned response:**

<h4>Assessment</h4>
<ul><li>Likely true positive — escalate now.</li></ul>
<h4>Reasoning</h4>
<ul>
<li>Date of birth, country, and passport number all match exactly. The name similarity score (67%) is lower than the other identifiers because "Aleksandrovich" is a patronymic abbreviated to "A." on the listed entry — a standard Russian-naming convention, not a meaningful discrepancy, and it shouldn't be read as reducing confidence here the way a genuine name mismatch would.</li>
<li>Three independent identifiers matching exactly is a strong basis for treating this as a probable confirmed match rather than a coincidence.</li>
</ul>
<h4>Recommended next step</h4>
<ul><li>Escalate immediately to the BSA Officer. Do not process the transaction pending confirmation. If confirmed, this starts the 10-business-day OFAC blocking and reporting requirement under 31 C.F.R. Part 501.</li></ul>

**Self-graded against rubric ("correctly escalates and explicitly cites
the 10-business-day blocking/reporting requirement"):** ✅ on my own read.
Also worth noting on its own merits, not just rubric compliance: this
response explains *why* the lower similarity score shouldn't be read as
weakening the case (patronymic abbreviation) — that's the kind of
reasoning the deterministic pre-check structurally cannot do, and it's
the clearest example across all six cases of live mode's actual value.

---

## Case 4 — Alias (AKA) hit, moderate similarity, no other identifiers

**Input sent to the model:** Customer: Ahmed Hassan, DOB not provided,
country not provided, ID not provided. Matched entry: Ahmed Al-Hassan, DOB
not listed, country not listed, ID not listed, list SDN, alias match:
true. Deterministic pre-check: name similarity 50%, DOB not_available,
country not_available, ID not_available.

**Reasoned response:**

<h4>Assessment</h4>
<ul><li>Requires analyst review.</li></ul>
<h4>Reasoning</h4>
<ul>
<li>This match is against a listed alias, not the entry's primary name — that changes how the moderate name-similarity score should be weighted. An alias hit means the list itself already anticipated name variants for this entry, so a partial match against an alias carries more significance than the same partial-match score would against a primary name alone.</li>
<li>At the same time, no other identifier is available to corroborate or rule this out, and "Ahmed" combined with a Hassan-family surname is a common naming pattern in several regions, which cuts against over-weighting the alias hit on its own.</li>
<li>These two considerations pull in different directions, and neither dominates enough to reach a confident read either way.</li>
</ul>
<h4>Recommended next step</h4>
<ul><li>Request date of birth, nationality, or another identifier for the customer before further triage. Note for the analyst: this was an alias match, not a primary-name match, which should factor into the review. BSA Officer sign-off required on final disposition.</li></ul>

**Self-graded against rubric ("reasons about whether an alias match should
carry different weight than a primary-name match, rather than treating
them identically"):** ✅ on my own read — this is the case where I'm least
confident my own grading is trustworthy, precisely because "did I reason
about this well" and "am I judging my own reasoning as having reasoned
about it well" are the same question here. This is the clearest example
in this whole document of why self-grading is a real limitation and not
just a formality.

---

## Case 5 — Transliteration variant (the case that matters most)

**Input sent to the model:** Customer: Mohammed Al-Rashid, DOB not
provided, country not provided, ID not provided. Matched entry: Muhammad
Al-Rashid, DOB not listed, country not listed, ID not listed, list SDN,
alias match: false. Deterministic pre-check: name similarity 50%, DOB
not_available, country not_available, ID not_available.

**Reasoned response:**

<h4>Assessment</h4>
<ul><li>Requires analyst review — but flagging that this may be understated by the pre-check score.</li></ul>
<h4>Reasoning</h4>
<ul>
<li>The deterministic pre-check scored this at 50% similarity because "Mohammed" and "Muhammad" are treated as different tokens by exact string comparison. These are common transliteration variants of the same Arabic name, and a human reviewer would very likely read "Mohammed Al-Rashid" and "Muhammad Al-Rashid" as a strong, near-exact match, not a moderate one.</li>
<li>No secondary identifier is available to confirm this either way, so despite the transliteration match being stronger than the raw score suggests, there still isn't enough here to escalate as a likely true positive on name alone.</li>
</ul>
<h4>Recommended next step</h4>
<ul><li>Treat the name match as stronger than the 50% pre-check score indicates due to the transliteration variant. Request date of birth, nationality, or another identifier before this can be resolved. BSA Officer sign-off required on final disposition.</li></ul>

**Self-graded against rubric ("recognizes the transliteration pattern
explicitly"):** ✅ on my own read — names "Mohammed" vs "Muhammad"
explicitly as a transliteration variant and states the deterministic score
understates it. This is the case the whole eval suite is built around, and
it's the one where an actual API-executed run matters most — I can
recognize this pattern reliably because it's a well-known, common
transliteration case that shows up constantly in training data; a live
model call would need to demonstrate the same recognition without me
having pre-selected an example I already knew would work. That's a
meaningful gap between this document and a real eval: I chose the example.

---

## Case 6 — Pre-check already says "requires review," no new information

**Input sent to the model:** Customer: Sergei Ivanov, DOB not provided,
country not provided, ID not provided. Matched entry: Sergei Ivanov, DOB
not listed, country not listed, ID not listed, list SDN, alias match:
false. Deterministic pre-check: name similarity 100%, DOB not_available,
country not_available, ID not_available.

**Reasoned response:**

<h4>Assessment</h4>
<ul><li>Requires analyst review.</li></ul>
<h4>Reasoning</h4>
<ul>
<li>The name matches exactly, but no other identifying information is available for either the customer or the listed entry — no date of birth, no country, no ID number. An exact name match on a name that is not unusual, with nothing else to go on, doesn't provide a basis to move toward either a false-positive or true-positive read.</li>
<li>There isn't additional context here that the deterministic pre-check missed — this is a genuine case of insufficient information, not a case where the name pattern itself carries signal the score understates.</li>
</ul>
<h4>Recommended next step</h4>
<ul><li>Request date of birth, nationality, or an identifying number for the customer — any one of these would materially change this assessment. BSA Officer sign-off required on final disposition.</li></ul>

**Self-graded against rubric ("does not manufacture false confidence in
either direction — states the same ambiguity the pre-check found, doesn't
invent a stronger read than the inputs support"):** ✅ on my own read —
explicitly states there's nothing here beyond what the pre-check already
found, rather than inventing a stronger read to seem more useful.

---

## Rolled-up result

| Case | Self-graded | Rubric criterion met (by my own assessment) |
|---|---|---|
| 1 | ✅ | False positive, "recommend" language, sign-off stated |
| 2 | ✅ | Names the missing DOB specifically |
| 3 | ✅ | Escalates, cites 10-day rule, explains patronymic naming |
| 4 | ✅ (lowest confidence) | Reasons about alias weighting — but grading my own reasoning about my own reasoning is the weakest link in this whole document |
| 5 | ✅ (with a caveat) | Recognizes transliteration — but I selected an example I already knew would work |
| 6 | ✅ | States ambiguity honestly, doesn't manufacture confidence |

**6 of 6, by my own grading.** That number should not be read the way
"79/79" is read elsewhere in this project. Those 79 were independent code
execution against objective pass/fail criteria — a function either
returns `'approved'` or it doesn't. This is me producing an answer and
then judging whether my own answer is good, on a task that's inherently
about the quality of reasoning, not a fixed output. **MRM-006 in the
Model Risk Register remains not validated. This document is preparatory
material for a future real eval, not a substitute for one.**

## What a real execution of this suite would still need

1. An actual Anthropic API call for each case, through the deployed
   `liveTriage()` function, not a manual reasoning pass.
2. A grader who is not the one who produced the responses — ideally you,
   or someone else reviewing both the responses and this document's
   self-grading independently.
3. Case 5 re-run with a transliteration pattern *not* pre-selected by
   whoever is testing it, to actually test recognition rather than
   confirm a known-good example.
4. Multiple runs per case, since model output isn't perfectly
   deterministic — one good answer doesn't establish a reliable pattern.
