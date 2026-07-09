const { evaluate } = require('./pc_engine.js');

let pass = 0, fail = 0;
const results = [];

function run(id, desc, input, ledgerEntry, expectedDecision, expectedCitationSubstring, expectedRoutingWho){
  const r = evaluate(input, ledgerEntry);
  const decisionOk = r.decision === expectedDecision;
  const citationOk = !expectedCitationSubstring || r.citations.some(c => c.includes(expectedCitationSubstring));
  const routingOk = !expectedRoutingWho || r.routing.some(x => x.who === expectedRoutingWho);
  const ok = decisionOk && citationOk && routingOk;
  if(ok){ pass++; } else { fail++; }
  results.push({
    id, desc, ok,
    expectedDecision, actualDecision: r.decision,
    expectedCitation: expectedCitationSubstring, actualCitations: r.citations,
    expectedRoutingWho, decisionOk, citationOk, routingOk,
    routing: r.routing.map(x=>x.who+': '+x.action)
  });
}

// --- Red-flag override (2 cases) ---
run('RET-01-01', 'Red flag (pending matter) overrides everything, even a low-risk category',
  {recipCategory:'institutional', instEmployer:'Acme Corp', instRelationship:'institutional_customer', txnType:'gift', value:50, flagPending:true},
  {total:0, entertainmentCount:0},
  'escalate_legal', '18 U.S.C. § 215');

run('RET-01-02', 'Red flag (solicited) overrides a private/customer category',
  {recipCategory:'private', privRelationship:'customer', value:10, flagSolicited:true},
  {total:0, entertainmentCount:0},
  'escalate_legal', '18 U.S.C. § 215');

// --- Foreign official (3 cases) ---
run('RET-01-03', 'Foreign official, value exactly at $50 log threshold, no pending matter → approved (boundary: > not >=)',
  {recipCategory:'foreign_official', foCountry:'Testland', foAgency:'Ministry of Testing', foPendingMatter:false, value:50},
  {total:0, entertainmentCount:0},
  'approved', 'FCPA');

run('RET-01-04', 'Foreign official, value $51 (one over threshold), no pending matter → escalate_legal',
  {recipCategory:'foreign_official', foCountry:'Testland', foAgency:'Ministry of Testing', foPendingMatter:false, value:51},
  {total:0, entertainmentCount:0},
  'escalate_legal', 'FCPA');

run('RET-01-05', 'Foreign official, pending matter present, low value ($10) → escalate_legal (pending matter overrides value)',
  {recipCategory:'foreign_official', foCountry:'Testland', foAgency:'Ministry of Testing', foPendingMatter:true, value:10},
  {total:0, entertainmentCount:0},
  'escalate_legal', 'FCPA');

// --- Examiner (1 case) ---
run('RET-01-06', 'Active examiner, trivial value ($1) → escalate_legal regardless of amount',
  {recipCategory:'examiner', exAgency:'occ', value:1},
  {total:0, entertainmentCount:0},
  'escalate_legal', 'Bank Bribery Act guidelines');

// --- US official (5 cases) ---
run('RET-01-07', 'US official, state level → escalate_compliance (no deterministic rule outside federal executive branch)',
  {recipCategory:'us_official', usoLevel:'state', usoBranch:'executive', value:15},
  {total:0, entertainmentCount:0},
  'escalate_compliance', 'No deterministic rule');

run('RET-01-08', 'US official, federal legislative branch → escalate_compliance (5 C.F.R. 2635.204 covers executive branch only)',
  {recipCategory:'us_official', usoLevel:'federal', usoBranch:'legislative', value:15},
  {total:0, entertainmentCount:0},
  'escalate_compliance', 'No deterministic rule');

run('RET-01-09', 'Federal executive official, $20 (occasion boundary) + $0 prior YTD = $20 total → approved',
  {recipCategory:'us_official', usoLevel:'federal', usoBranch:'executive', value:20},
  {total:0, entertainmentCount:0},
  'approved', '5 C.F.R. § 2635.204');

run('RET-01-10', 'Federal executive official, $21 (one over occasion limit) → escalate_compliance even though annual total would be fine',
  {recipCategory:'us_official', usoLevel:'federal', usoBranch:'executive', value:21},
  {total:0, entertainmentCount:0},
  'escalate_compliance', '5 C.F.R. § 2635.204');

run('RET-01-11', 'Federal executive official, $15 this occasion + $40 prior YTD = $55 → escalate_compliance (annual aggregate exceeded despite occasion being fine)',
  {recipCategory:'us_official', usoLevel:'federal', usoBranch:'executive', value:15},
  {total:40, entertainmentCount:0},
  'escalate_compliance', '5 C.F.R. § 2635.204');

// --- Institutional (5 cases) ---
run('RET-01-12', 'Institutional entertainment, this would be the 4th occasion this year (boundary) → approved',
  {recipCategory:'institutional', instEmployer:'Acme Corp', instRelationship:'institutional_customer', txnType:'entertainment', value:75},
  {total:0, entertainmentCount:3},
  'approved', 'FINRA Rule 3220');

run('RET-01-13', 'Institutional entertainment, this would be the 5th occasion this year → escalate_compliance (frequency flag exceeded)',
  {recipCategory:'institutional', instEmployer:'Acme Corp', instRelationship:'institutional_customer', txnType:'entertainment', value:75},
  {total:0, entertainmentCount:4},
  'escalate_compliance', 'FINRA Rule 3220');

run('RET-01-14', 'Institutional gift, $250 prior YTD + $50 this gift = $300 (FINRA boundary) → approved',
  {recipCategory:'institutional', instEmployer:'Acme Corp', instRelationship:'institutional_customer', txnType:'gift', value:50},
  {total:250, entertainmentCount:0},
  'approved', 'FINRA Rule 3220');

run('RET-01-15', 'Institutional gift, $250 prior YTD + $51 this gift = $301 (one over) → escalate_compliance',
  {recipCategory:'institutional', instEmployer:'Acme Corp', instRelationship:'institutional_customer', txnType:'gift', value:51},
  {total:250, entertainmentCount:0},
  'escalate_compliance', 'FINRA Rule 3220');

run('RET-01-16', 'Private/default category, vendor relationship, within general ceiling → approved AND Vendor Management gets an FYI routing entry',
  {recipCategory:'private', privRelationship:'vendor', value:50},
  {total:0, entertainmentCount:0},
  'approved', 'Bank Bribery Act', 'Vendor Management (FYI)');

// --- Insider (2 cases) ---
run('RET-01-17', 'Insider, non-credit benefit → escalate_compliance under general COI policy, not Reg O',
  {recipCategory:'insider', insType:'director', insBenefit:'noncredit', value:25},
  {total:0, entertainmentCount:0},
  'escalate_compliance', 'General conflicts-of-interest policy');

run('RET-01-18', 'Insider, credit-related benefit → escalate_compliance under Regulation O',
  {recipCategory:'insider', insType:'executive_officer', insBenefit:'credit', value:25},
  {total:0, entertainmentCount:0},
  'escalate_compliance', 'Regulation O, 12 C.F.R. Part 215');

// --- Private/default (2 cases) ---
run('RET-01-19', 'Private customer, $200 prior YTD + $50 = $250 (general ceiling boundary) → approved',
  {recipCategory:'private', privRelationship:'customer', value:50},
  {total:200, entertainmentCount:0},
  'approved', 'Bank Bribery Act');

run('RET-01-20', 'Private customer, $200 prior YTD + $51 = $251 (one over) → escalate_compliance',
  {recipCategory:'private', privRelationship:'customer', value:51},
  {total:200, entertainmentCount:0},
  'escalate_compliance', 'Bank Bribery Act');

// --- Report ---
console.log('PASS:', pass, '/', pass+fail);
console.log('');
results.forEach(r => {
  console.log((r.ok ? '✅' : '❌'), r.id, '-', r.desc);
  if(!r.ok){
    console.log('    expected:', r.expectedDecision, ' actual:', r.actualDecision);
  }
});

// Extra check for RET-01-16's routing entry specifically
const vendorCheck = results.find(r=>r.id==='RET-01-16');
console.log('');
console.log('RET-01-16 routing entries:', JSON.stringify(vendorCheck.routing));

require('fs').writeFileSync('pc_results.json', JSON.stringify(results, null, 2));
