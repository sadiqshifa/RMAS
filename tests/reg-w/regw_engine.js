// Regulation W (12 CFR Part 223) affiliate-transaction rules engine.
// Deterministic, no AI at runtime — see docs/layer2-regw.md for why this
// domain is a Track B (rules-engine) build, and for the one item (the
// attribution-rule judgment call) explicitly deferred to a future Track A
// agent rather than resolved here.
//
// Priority order mirrors tests/anti-bribery-coi/rego_engine.js: an
// amount-independent judgment gate is checked first, then the hardest
// statutory stop (the bank-wide aggregate limit) is checked before the
// narrower single-affiliate limit, then collateral sufficiency, then the
// transaction is logged.
//
// IMPORTANT DISTINCTION FROM THE SIBLING REG O TOOL: Regulation O's
// board-approval trigger is a *process* — a board can approve past it.
// Regulation W's §223.11/§223.12 quantitative limits are not: there is no
// mechanism in the regulation itself for a board to approve a covered
// transaction past the 10%/20% caps. The only path past them is an
// individual exemption granted by the primary federal regulator (see
// docs/layer1-regw.md, Section B, item 1 — OCC Interpretive Letter #1191).
// This engine reflects that: a limit breach routes to Legal/Top-of-House
// for an individual-exemption request, not to a board vote.

const COLLATERAL_HAIRCUTS = {
  treasury: { ratio: 1.00, label: 'U.S. government/agency obligations (100%)' },
  state_local: { ratio: 1.10, label: 'state/local government obligations (110%)' },
  other_debt: { ratio: 1.20, label: 'other debt instruments, loans, receivables (120%)' },
  equity_property: { ratio: 1.30, label: 'stock, leases, or other real/personal property (130%)' }
};

function evaluate(input, cfg, affiliate, ledgerEntry, bankWideTotal) {
  const citations = [];
  const routing = [];
  const trace = [];
  let decision = 'approved';
  let reasoning = '';

  // --- Not obviously a covered transaction: attribution-rule gate ---
  if (input.txnType === 'other_attribution') {
    citations.push('12 C.F.R. § 223.16 — attribution rule');
    if (input.attributionRuleApplies === 'no') {
      decision = 'not_covered';
      reasoning = 'This transaction is with a nonaffiliate and the reviewer has confirmed the proceeds do not benefit, and are not transferred to, an affiliate. § 223.16 does not pull it into the covered-transaction limits.';
      routing.push({ who: 'LOB Compliance (register only)', action: 'Logged as not covered — no further Reg W action required' });
      return { decision, citations, routing, reasoning, trace };
    }
    if (input.attributionRuleApplies === 'ambiguous') {
      decision = 'escalate_attribution';
      reasoning = 'Whether the proceeds of this nonaffiliate transaction genuinely benefit an affiliate is a fact-pattern judgment, not a threshold check. This is the one Reg W determination this engine deliberately does not resolve — see docs/layer2-regw.md, Section C, for why this is named as a future Track A (AI-assisted) candidate rather than guessed at here.';
      routing.push({ who: 'Compliance Officer / Legal', action: 'Manual attribution-rule determination required before this transaction can be classified' });
      return { decision, citations, routing, reasoning, trace };
    }
    // attributionRuleApplies === 'yes' — fall through and treat as a covered transaction (credit-shaped, most common attribution fact pattern)
    trace.push('Attribution rule confirmed to apply — evaluating as a covered transaction attributed to the named affiliate.');
    input = Object.assign({}, input, { txnType: input.attributedAs || 'credit' });
  }

  // --- Exemption check ---
  if (input.exemptionClaimed === 'sister_bank') {
    citations.push('12 C.F.R. §§ 223.41, 223.56 — commonly controlled (≥80%) depository institution exemption');
    if (affiliate.commonControl80 && affiliate.isDepositoryInstitution) {
      decision = 'exempt';
      reasoning = 'Both institutions are depository institutions under ≥80% common ownership. This exemption reaches the quantitative limits, the collateral requirements, AND (per § 223.56) the § 23B market-terms requirement — the broadest exemption in the regulation. Still subject to § 223.13 safety-and-soundness.';
      routing.push({ who: 'LOB Compliance (register only)', action: 'Logged as exempt — sister-bank exemption confirmed' });
      return { decision, citations, routing, reasoning, trace };
    }
    trace.push('Sister-bank exemption claimed but not confirmed: commonControl80=' + affiliate.commonControl80 + ', isDepositoryInstitution=' + affiliate.isDepositoryInstitution + ' — exemption does not apply, continuing standard review.');
  }
  let exemptFromQuantitativeAndCollateral = false;
  if (input.exemptionClaimed === 'cash_treasury_secured' && input.collateralType === 'treasury' && input.collateralValue >= input.amount) {
    citations.push('12 C.F.R. § 223.41(a) — transactions fully secured by cash or U.S. government obligations');
    trace.push('Cash/Treasury-secured exemption confirmed: pledged collateral $' + input.collateralValue.toLocaleString() + ' ≥ transaction amount $' + input.amount.toLocaleString() + '.');
    exemptFromQuantitativeAndCollateral = true;
  }
  if (input.exemptionClaimed === 'intraday') {
    citations.push('12 C.F.R. § 223.41(a) — intraday extension of credit');
    trace.push('Intraday extension of credit — exempt from quantitative limits and collateral requirements, not from market terms.');
    exemptFromQuantitativeAndCollateral = true;
  }

  // --- Market-terms gate (23B) — amount-independent, checked before the dollar math ---
  citations.push('12 C.F.R. §§ 223.51–223.52 — Section 23B market-terms requirement');
  if (input.marketTermsConfirmed !== 'yes') {
    routing.push({ who: 'Independent Pricing/Credit Review, then Compliance', action: 'Market-terms comparability must be documented before this transaction can proceed, regardless of size' });
    decision = 'escalate_market_terms';
    reasoning = 'The § 23B market-terms requirement applies to this transaction and has not been confirmed ("' + input.marketTermsConfirmed + '", not "yes"). Like Reg O\'s terms-comparison gate, this is a judgment call the engine flags rather than resolves, and it applies independent of transaction size or the quantitative limits below.';
    return { decision, citations, routing, reasoning, trace };
  }

  if (exemptFromQuantitativeAndCollateral) {
    decision = 'exempt';
    reasoning = 'Quantitative limits and collateral requirements do not apply under the claimed exemption; market terms were confirmed. Logged, not counted toward the running affiliate-exposure ledger.';
    routing.push({ who: 'LOB Compliance (register only)', action: 'Logged as exempt from §§ 223.11/223.12/223.14' });
    return { decision, citations, routing, reasoning, trace };
  }

  // --- Aggregate (all-affiliate) limit — checked before the narrower single-affiliate limit ---
  const aggregateLimit = cfg.capital * 0.20;
  const newBankWideTotal = bankWideTotal + input.amount;
  trace.push('Aggregate limit = 20% × $' + cfg.capital.toLocaleString() + ' = $' + aggregateLimit.toLocaleString());
  trace.push('Existing bank-wide covered-transaction total: $' + bankWideTotal.toLocaleString() + ' + this request $' + input.amount.toLocaleString() + ' = $' + newBankWideTotal.toLocaleString());
  if (newBankWideTotal > aggregateLimit) {
    citations.push('12 C.F.R. § 223.12 — aggregate limit on covered transactions with all affiliates (20% of capital stock and surplus)');
    routing.push({ who: 'Legal / Top-of-House Reg W Program', action: 'Cannot proceed as structured — would require an individual exemption from the primary federal regulator (see OCC Int. Ltr. #1191 precedent), not a board vote' });
    decision = 'blocked_aggregate';
    reasoning = 'Bank-wide covered transactions with all affiliates combined, including this request, would reach $' + newBankWideTotal.toLocaleString() + ', exceeding the § 223.12 aggregate ceiling of $' + aggregateLimit.toLocaleString() + '. Unlike Reg O\'s board-approval trigger, there is no board-level override for a § 23A quantitative limit — the only path past it is a regulator-granted individual exemption.';
    return { decision, citations, routing, reasoning, trace };
  }

  // --- Single-affiliate limit ---
  const singleLimit = cfg.capital * 0.10;
  const newAffiliateTotal = ledgerEntry.total + input.amount;
  trace.push('Single-affiliate limit = 10% × $' + cfg.capital.toLocaleString() + ' = $' + singleLimit.toLocaleString());
  trace.push('Existing covered-transaction total with this affiliate: $' + ledgerEntry.total.toLocaleString() + ' + this request $' + input.amount.toLocaleString() + ' = $' + newAffiliateTotal.toLocaleString());
  if (newAffiliateTotal > singleLimit) {
    citations.push('12 C.F.R. § 223.11 — single-affiliate limit on covered transactions (10% of capital stock and surplus)');
    routing.push({ who: 'Legal / Top-of-House Reg W Program', action: 'Cannot proceed as structured — would require an individual exemption from the primary federal regulator' });
    decision = 'blocked_single_affiliate';
    reasoning = 'Covered transactions with this affiliate, including this request, would reach $' + newAffiliateTotal.toLocaleString() + ', exceeding the § 223.11 single-affiliate limit of $' + singleLimit.toLocaleString() + '. As with the aggregate limit, there is no board-level override — only a regulator-granted individual exemption.';
    return { decision, citations, routing, reasoning, trace };
  }

  // --- Collateral requirement (extensions of credit only) ---
  if (input.txnType === 'credit') {
    citations.push('12 C.F.R. § 223.14 — collateral requirements for credit transactions with affiliates');
    if (input.collateralType === 'affiliate_securities' || input.collateralType === 'none') {
      routing.push({ who: 'LOB Compliance / Legal', action: 'Cannot fund — no eligible collateral pledged' });
      decision = 'ineligible_collateral';
      reasoning = input.collateralType === 'affiliate_securities'
        ? 'Securities issued by any affiliate of the bank are not eligible collateral under § 223.14, regardless of value pledged — this prevents circular collateralization.'
        : 'An extension of credit to an affiliate must be secured at the time of the transaction under § 223.14. No eligible collateral type was pledged.';
      return { decision, citations, routing, reasoning, trace };
    }
    const haircut = COLLATERAL_HAIRCUTS[input.collateralType];
    const requiredValue = input.amount * haircut.ratio;
    trace.push('Required collateral value = $' + input.amount.toLocaleString() + ' × ' + haircut.ratio + ' (' + haircut.label + ') = $' + requiredValue.toLocaleString());
    trace.push('Pledged collateral value: $' + input.collateralValue.toLocaleString());
    if (input.collateralValue < requiredValue) {
      routing.push({ who: 'LOB Compliance', action: 'Cannot fund until additional collateral of at least $' + (requiredValue - input.collateralValue).toLocaleString() + ' is pledged' });
      decision = 'insufficient_collateral';
      reasoning = 'Pledged collateral of $' + input.collateralValue.toLocaleString() + ' is below the § 223.14 required value of $' + requiredValue.toLocaleString() + ' (' + haircut.label + ' applied to a $' + input.amount.toLocaleString() + ' extension).';
      return { decision, citations, routing, reasoning, trace };
    }
  }

  routing.push({ who: 'LOB Compliance (register only)', action: 'Logged — within all applicable Reg W thresholds; booked to the affiliate-exposure ledger for top-of-house aggregation' });
  decision = 'approved';
  reasoning = 'Within the § 223.11 single-affiliate limit ($' + newAffiliateTotal.toLocaleString() + ' of $' + singleLimit.toLocaleString() + ') and the § 223.12 aggregate limit ($' + newBankWideTotal.toLocaleString() + ' of $' + aggregateLimit.toLocaleString() + '), market terms confirmed' + (input.txnType === 'credit' ? ', and collateral requirement satisfied' : '') + '. Logged and booked to the ledger for ongoing monitoring.';
  return { decision, citations, routing, reasoning, trace };
}

module.exports = { evaluate, COLLATERAL_HAIRCUTS };
