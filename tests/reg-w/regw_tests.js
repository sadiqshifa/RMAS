const { evaluate } = require('./regw_engine.js');

let pass = 0, fail = 0;
const results = [];
const DEMO_CFG = { capital: 50000000 }; // $50M capital stock and surplus — same demo bank scale as the sibling Reg O tool

const SISTER_BANK = { commonControl80: true, isDepositoryInstitution: true };
const FINANCE_CO = { commonControl80: true, isDepositoryInstitution: false };
const INSURANCE_CO = { commonControl80: false, isDepositoryInstitution: false };

function run(id, desc, input, cfg, affiliate, ledgerEntry, bankWideTotal, expectedDecision, expectedCitationSubstring) {
  const r = evaluate(input, cfg, affiliate, ledgerEntry, bankWideTotal);
  const decisionOk = r.decision === expectedDecision;
  const citationOk = !expectedCitationSubstring || r.citations.some(c => c.includes(expectedCitationSubstring));
  const ok = decisionOk && citationOk;
  if (ok) { pass++; } else { fail++; }
  results.push({ id, desc, ok, expectedDecision, actualDecision: r.decision, actualCitations: r.citations, trace: r.trace });
}

// --- Attribution-rule gate (3 cases) ---
run('REGW-01', 'Nonaffiliate transaction, attribution rule confirmed not to apply → not_covered',
  { txnType: 'other_attribution', attributionRuleApplies: 'no' },
  DEMO_CFG, INSURANCE_CO, { total: 0 }, 0,
  'not_covered', '223.16');

run('REGW-02', 'Nonaffiliate transaction, attribution rule ambiguous → escalate to Compliance/Legal, engine does not guess',
  { txnType: 'other_attribution', attributionRuleApplies: 'ambiguous' },
  DEMO_CFG, INSURANCE_CO, { total: 0 }, 0,
  'escalate_attribution', '223.16');

run('REGW-03', 'Nonaffiliate transaction, attribution rule confirmed to apply, falls through as a $1M credit → treated as covered, still needs market terms',
  { txnType: 'other_attribution', attributionRuleApplies: 'yes', attributedAs: 'credit', amount: 1000000, marketTermsConfirmed: 'no' },
  DEMO_CFG, FINANCE_CO, { total: 0 }, 0,
  'escalate_market_terms', '223.16');

// --- Sister-bank exemption (2 cases) ---
run('REGW-04', 'Sister-bank exemption claimed and qualified (≥80% common control, both depository institutions), amount would otherwise breach both limits → exempt',
  { txnType: 'credit', amount: 20000000, exemptionClaimed: 'sister_bank', marketTermsConfirmed: 'yes' },
  DEMO_CFG, SISTER_BANK, { total: 0 }, 0,
  'exempt', '223.56');

run('REGW-05', 'Sister-bank exemption claimed but affiliate is not a depository institution → exemption does not apply, falls through to standard review and is approved within limits',
  { txnType: 'credit', amount: 1000000, exemptionClaimed: 'sister_bank', marketTermsConfirmed: 'yes', collateralType: 'other_debt', collateralValue: 1200000 },
  DEMO_CFG, FINANCE_CO, { total: 0 }, 0,
  'approved', '223.51');

// --- Cash/Treasury-secured and intraday exemptions (3 cases) ---
run('REGW-06', 'Cash/Treasury-secured exemption, fully collateralized ($2M pledged ≥ $2M amount) → exempt from quantitative limits and collateral requirement',
  { txnType: 'credit', amount: 2000000, exemptionClaimed: 'cash_treasury_secured', collateralType: 'treasury', collateralValue: 2000000, marketTermsConfirmed: 'yes' },
  DEMO_CFG, FINANCE_CO, { total: 0 }, 0,
  'exempt', '223.41');

run('REGW-07', 'Cash/Treasury-secured exemption claimed but pledged value ($1.9M) is short of the amount ($2M) → exemption does not apply, falls through to standard collateral check and is caught as insufficient at the 100% Treasury ratio',
  { txnType: 'credit', amount: 2000000, exemptionClaimed: 'cash_treasury_secured', collateralType: 'treasury', collateralValue: 1900000, marketTermsConfirmed: 'yes' },
  DEMO_CFG, FINANCE_CO, { total: 0 }, 0,
  'insufficient_collateral', '223.14');

run('REGW-08', 'Intraday extension of credit, market terms confirmed → exempt from quantitative limits and collateral requirement',
  { txnType: 'credit', amount: 15000000, exemptionClaimed: 'intraday', marketTermsConfirmed: 'yes' },
  DEMO_CFG, FINANCE_CO, { total: 0 }, 0,
  'exempt', '223.41');

// --- Market-terms gate, amount-independent (1 case) ---
run('REGW-09', 'Credit extension, market terms not confirmed ("no") → escalate_market_terms regardless of how small the amount is',
  { txnType: 'credit', amount: 100, exemptionClaimed: 'none', marketTermsConfirmed: 'no' },
  DEMO_CFG, FINANCE_CO, { total: 0 }, 0,
  'escalate_market_terms', '223.51');

// --- Aggregate (20%) limit — checked before, and takes priority over, the single-affiliate limit (3 cases) ---
run('REGW-10', 'Bank-wide total exactly at the $10,000,000 aggregate boundary (20% of $50M capital) → approved (not >)',
  { txnType: 'asset_purchase', amount: 500000, exemptionClaimed: 'none', marketTermsConfirmed: 'yes' },
  DEMO_CFG, FINANCE_CO, { total: 0 }, 9500000,
  'approved', '223.51');

run('REGW-11', 'Bank-wide total at $10,000,001 (one over the aggregate boundary) → blocked_aggregate',
  { txnType: 'asset_purchase', amount: 500001, exemptionClaimed: 'none', marketTermsConfirmed: 'yes' },
  DEMO_CFG, FINANCE_CO, { total: 0 }, 9500000,
  'blocked_aggregate', '223.12');

run('REGW-12', 'This affiliate\'s own running total is small ($200K, nowhere near its own $5M single-affiliate limit), but bank-wide exposure across ALL affiliates would hit $10.1M → blocked_aggregate takes priority over the individual-affiliate check',
  { txnType: 'asset_purchase', amount: 100000, exemptionClaimed: 'none', marketTermsConfirmed: 'yes' },
  DEMO_CFG, FINANCE_CO, { total: 100000 }, 10000000,
  'blocked_aggregate', '223.12');

// --- Single-affiliate (10%) limit (3 cases) ---
run('REGW-13', 'Single-affiliate total exactly at the $5,000,000 boundary (10% of $50M capital) → approved (not >)',
  { txnType: 'asset_purchase', amount: 5000000, exemptionClaimed: 'none', marketTermsConfirmed: 'yes' },
  DEMO_CFG, FINANCE_CO, { total: 0 }, 0,
  'approved', '223.51');

run('REGW-14', 'Single-affiliate total at $5,000,001 (one over) → blocked_single_affiliate',
  { txnType: 'asset_purchase', amount: 5000001, exemptionClaimed: 'none', marketTermsConfirmed: 'yes' },
  DEMO_CFG, FINANCE_CO, { total: 0 }, 0,
  'blocked_single_affiliate', '223.11');

run('REGW-15', 'Prior aggregate to this affiliate $4.8M + this $300K request = $5.1M → blocked_single_affiliate (aggregation across prior transactions with the same affiliate, not just this single transaction\'s size)',
  { txnType: 'asset_purchase', amount: 300000, exemptionClaimed: 'none', marketTermsConfirmed: 'yes' },
  DEMO_CFG, FINANCE_CO, { total: 4800000 }, 4800000,
  'blocked_single_affiliate', '223.11');

// --- Collateral haircuts, credit extensions only (5 cases) ---
run('REGW-16', 'Credit extension secured by other debt instruments (120% ratio), pledged collateral exactly at the required $1,200,000 for a $1,000,000 extension → approved',
  { txnType: 'credit', amount: 1000000, exemptionClaimed: 'none', marketTermsConfirmed: 'yes', collateralType: 'other_debt', collateralValue: 1200000 },
  DEMO_CFG, FINANCE_CO, { total: 0 }, 0,
  'approved', '223.14');

run('REGW-17', 'Same $1,000,000 extension, other-debt collateral pledged at $1,199,999 (one dollar short of the 120% requirement) → insufficient_collateral',
  { txnType: 'credit', amount: 1000000, exemptionClaimed: 'none', marketTermsConfirmed: 'yes', collateralType: 'other_debt', collateralValue: 1199999 },
  DEMO_CFG, FINANCE_CO, { total: 0 }, 0,
  'insufficient_collateral', '223.14');

run('REGW-18', 'Credit extension where the affiliate proposes pledging securities issued by the bank\'s own affiliate → ineligible_collateral regardless of value pledged',
  { txnType: 'credit', amount: 500000, exemptionClaimed: 'none', marketTermsConfirmed: 'yes', collateralType: 'affiliate_securities', collateralValue: 10000000 },
  DEMO_CFG, FINANCE_CO, { total: 0 }, 0,
  'ineligible_collateral', '223.14');

run('REGW-19', 'Credit extension with no collateral pledged at all → ineligible_collateral (unsecured credit to an affiliate is not permitted)',
  { txnType: 'credit', amount: 500000, exemptionClaimed: 'none', marketTermsConfirmed: 'yes', collateralType: 'none', collateralValue: 0 },
  DEMO_CFG, FINANCE_CO, { total: 0 }, 0,
  'ineligible_collateral', '223.14');

run('REGW-20', 'Non-credit covered transaction (asset purchase) skips the § 223.14 collateral check entirely — approved on limits and market terms alone',
  { txnType: 'asset_purchase', amount: 1000000, exemptionClaimed: 'none', marketTermsConfirmed: 'yes' },
  DEMO_CFG, FINANCE_CO, { total: 0 }, 0,
  'approved', '223.51');

// --- Report ---
console.log('PASS:', pass, '/', pass + fail);
console.log('');
results.forEach(r => {
  console.log((r.ok ? '✅' : '❌'), r.id, '-', r.desc);
  if (!r.ok) {
    console.log('    expected:', r.expectedDecision, ' actual:', r.actualDecision);
    console.log('    trace:', r.trace);
  }
});

require('fs').writeFileSync('regw_results.json', JSON.stringify(results, null, 2));

if (fail > 0) {
  process.exitCode = 1;
}
