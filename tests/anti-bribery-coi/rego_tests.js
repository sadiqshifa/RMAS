const { evaluate } = require('./rego_engine.js');

let pass = 0, fail = 0;
const results = [];
const DEMO_CFG = { capital: 50000000, deposits: 600000000, smallBank: false };
const SMALLBANK_CFG = { capital: 50000000, deposits: 90000000, smallBank: true };

function run(id, desc, input, cfg, ledgerEntry, bankWideTotal, expectedDecision, expectedCitationSubstring){
  const r = evaluate(input, cfg, ledgerEntry, bankWideTotal);
  const decisionOk = r.decision === expectedDecision;
  const citationOk = !expectedCitationSubstring || r.citations.some(c => c.includes(expectedCitationSubstring));
  const ok = decisionOk && citationOk;
  if(ok){ pass++; } else { fail++; }
  results.push({ id, desc, ok, expectedDecision, actualDecision: r.decision, actualCitations: r.citations, trace: r.trace });
}

// --- Overdraft branch (5 cases) ---
run('RET-02-01', 'Overdraft, principal shareholder (not officer/director) → approved, prohibition does not apply',
  {txnType:'overdraft', insiderType:'principal_shareholder', odAmount:5000, odDays:10, odPlan:false, odSameFee:false},
  DEMO_CFG, {total:0, otherPurposeTotal:0}, 0,
  'approved', '215.4(e)');

run('RET-02-02', 'Overdraft, executive officer, covered by pre-authorized repayment plan → approved',
  {txnType:'overdraft', insiderType:'executive_officer', odAmount:5000, odDays:10, odPlan:true, odSameFee:false},
  DEMO_CFG, {total:0, otherPurposeTotal:0}, 0,
  'approved', '215.4(e)');

run('RET-02-03', 'Overdraft, executive officer, no plan, exactly at inadvertent-exception boundary ($1000/5 days/same fee) → approved',
  {txnType:'overdraft', insiderType:'executive_officer', odAmount:1000, odDays:5, odPlan:false, odSameFee:true},
  DEMO_CFG, {total:0, otherPurposeTotal:0}, 0,
  'approved', '215.4(e)');

run('RET-02-04', 'Overdraft, executive officer, no plan, $1001 (one over exception amount) → prohibited',
  {txnType:'overdraft', insiderType:'executive_officer', odAmount:1001, odDays:5, odPlan:false, odSameFee:true},
  DEMO_CFG, {total:0, otherPurposeTotal:0}, 0,
  'prohibited', '215.4(e)');

run('RET-02-05', 'Overdraft, executive officer, no plan, amount/days fine but NOT charged the standard fee → prohibited',
  {txnType:'overdraft', insiderType:'executive_officer', odAmount:500, odDays:3, odPlan:false, odSameFee:false},
  DEMO_CFG, {total:0, otherPurposeTotal:0}, 0,
  'prohibited', '215.4(e)');

// --- Terms-comparison gate (1 case) ---
run('RET-02-06', 'Credit, terms comparison not confirmed ("no") → escalate_terms regardless of amount',
  {txnType:'credit', insiderType:'director', creditPurpose:'business', creditAmount:10, termsComparison:'no'},
  DEMO_CFG, {total:0, otherPurposeTotal:0}, 0,
  'escalate_terms', '215.4(a)');

// --- Executive-officer "other purpose" sub-cap (3 cases) ---
run('RET-02-07', 'Exec officer, "other purpose", exactly at $100,000 sub-cap boundary (config: $50M capital) → approved (not > cap, and under board trigger too)',
  {txnType:'credit', insiderType:'executive_officer', creditPurpose:'other', creditAmount:100000, termsComparison:'yes'},
  DEMO_CFG, {total:0, otherPurposeTotal:0}, 0,
  'approved', '215.4(a)');

run('RET-02-08', 'Exec officer, "other purpose", $100,001 (one over sub-cap) → prohibited, absolute ceiling, no board override',
  {txnType:'credit', insiderType:'executive_officer', creditPurpose:'other', creditAmount:100001, termsComparison:'yes'},
  DEMO_CFG, {total:0, otherPurposeTotal:0}, 0,
  'prohibited', '215.5(c)(4)');

run('RET-02-09', 'Exec officer, "other purpose", $99,000 prior aggregate + $2,000 this request = $101,000 → prohibited (aggregation across sub-cap, not just single-transaction value)',
  {txnType:'credit', insiderType:'executive_officer', creditPurpose:'other', creditAmount:2000, termsComparison:'yes'},
  DEMO_CFG, {total:99000, otherPurposeTotal:99000}, 99000,
  'prohibited', '215.5(c)(4)');

// --- Board-approval trigger (3 cases) ---
run('RET-02-10', 'Director, exactly at $2,500,000 board-trigger boundary (5% of $50M capital) → approved (not > trigger)',
  {txnType:'credit', insiderType:'director', creditPurpose:'business', creditAmount:2500000, termsComparison:'yes'},
  DEMO_CFG, {total:0, otherPurposeTotal:0}, 0,
  'approved', '215.4(a)');

run('RET-02-11', 'Director, $2,500,001 (one over board trigger) → board_approval required',
  {txnType:'credit', insiderType:'director', creditPurpose:'business', creditAmount:2500001, termsComparison:'yes'},
  DEMO_CFG, {total:0, otherPurposeTotal:0}, 0,
  'board_approval', '215.4(b)');

run('RET-02-12', 'Principal shareholder, $2,000,000 prior aggregate + $600,000 this request = $2,600,000 → board_approval (aggregation triggers it, not the single transaction)',
  {txnType:'credit', insiderType:'principal_shareholder', creditPurpose:'business', creditAmount:600000, termsComparison:'yes'},
  DEMO_CFG, {total:2000000, otherPurposeTotal:0}, 2000000,
  'board_approval', '215.4(b)');

// --- Bank-wide aggregate ceiling — takes priority over the individual board trigger (2 cases) ---
run('RET-02-13', 'Director\'s own aggregate would be small ($600K, well under their $2.5M trigger), but bank-wide total across ALL insiders would hit $50.1M — over the $50M ceiling → blocked_aggregate takes priority over the individual-insider check',
  {txnType:'credit', insiderType:'director', creditPurpose:'business', creditAmount:600000, termsComparison:'yes'},
  DEMO_CFG, {total:0, otherPurposeTotal:0}, 49500000,
  'blocked_aggregate', '215.4(d)');

run('RET-02-14', 'Bank-wide total exactly at $50,000,000 ceiling boundary (config: $50M capital, not small-bank) → approved (not > ceiling)',
  {txnType:'credit', insiderType:'director', creditPurpose:'business', creditAmount:500000, termsComparison:'yes'},
  DEMO_CFG, {total:0, otherPurposeTotal:0}, 49500000,
  'approved', '215.4(a)');

// --- Small-bank 2x exception (1 case) ---
run('RET-02-15', 'Same transaction as RET-02-13 (would breach $50M ceiling), but bank qualifies for the small-bank exception (capital $50M, 2× multiplier = $100M ceiling) → approved, not blocked',
  {txnType:'credit', insiderType:'director', creditPurpose:'business', creditAmount:600000, termsComparison:'yes'},
  SMALLBANK_CFG, {total:0, otherPurposeTotal:0}, 49500000,
  'approved', '215.4(a)');

// --- Report ---
console.log('PASS:', pass, '/', pass+fail);
console.log('');
results.forEach(r => {
  console.log((r.ok ? '✅' : '❌'), r.id, '-', r.desc);
  if(!r.ok){
    console.log('    expected:', r.expectedDecision, ' actual:', r.actualDecision);
    console.log('    trace:', r.trace);
  }
});

require('fs').writeFileSync('rego_results.json', JSON.stringify(results, null, 2));
