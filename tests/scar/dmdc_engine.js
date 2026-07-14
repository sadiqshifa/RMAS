const ACCOUNTS = [
  { id:'MTG-2019-00441',  type:'Mortgage',    rate:7.25,  preService:true  },
  { id:'AUTO-2021-08832', type:'Auto Loan',   rate:6.99,  preService:true  },
  { id:'CC-2020-15521',   type:'Credit Card', rate:19.99, preService:true  },
  { id:'AUTO-2023-44110', type:'Auto Loan',   rate:5.50,  preService:false }
];

const EVAL_CASES = [
  { id:'TC-01', name:'Active duty → rate cap routing',       desc:'DMDC returns active duty. Must route to rate cap workflow, hold gate, generate certificate.',   expected:'ROUTE: rate_cap_workflow | GATE: hold | CERT: generated',     scenario:'active',     test:r=>r.routing==='rate_cap_workflow'&&r.gate==='hold'&&r.cert===true },
  { id:'TC-02', name:'Not active → clear and log',           desc:'DMDC returns not active. Must log certificate and clear workflow.',                              expected:'ROUTE: clear | GATE: proceed | CERT: generated',              scenario:'not_active', test:r=>r.routing==='clear'&&r.gate==='proceed'&&r.cert===true },
  { id:'TC-03', name:'No record → escalate (not clear)',     desc:'DMDC no record must escalate to human — never treated as not-active.',                          expected:'ROUTE: escalate_human | GATE: hold',                          scenario:'no_record',  test:r=>r.routing==='escalate_human'&&r.gate==='hold' },
  { id:'TC-04', name:'API timeout → gate fails CLOSED',      desc:'Timeout must fail CLOSED — gate holds, workflow blocked, no clearance issued.',                 expected:'GATE: hold (fail-closed) | ROUTING: blocked',                 scenario:'timeout',    test:r=>r.gate==='hold'&&r.failClosed===true },
  { id:'TC-05', name:'Active duty → institution-wide sweep', desc:'Active duty match triggers sweep of ALL accounts. In-service account correctly excluded.',      expected:'SWEEP: executed | ELIGIBLE: 3 | INELIGIBLE: 1',              scenario:'active',     test:r=>r.sweepExecuted===true&&r.eligibleCount===3&&r.ineligibleCount===1 },
  { id:'TC-06', name:'Certificate fields complete',           desc:'Every DMDC query produces a certificate with all required fields.',                            expected:'CERT: query_date, result, ssn_last4, branch, component',      scenario:'active',     test:r=>r.cert===true&&r.certFields===true }
];

function simulateResult(scenario) {
  const eligible=ACCOUNTS.filter(a=>a.preService&&a.rate>6);
  const ineligible=ACCOUNTS.filter(a=>!a.preService||a.rate<=6);
  if (scenario==='timeout')    return {gate:'hold',failClosed:true,routing:'blocked',cert:false};
  if (scenario==='active')     return {routing:'rate_cap_workflow',gate:'hold',cert:true,certFields:true,sweepExecuted:true,eligibleCount:eligible.length,ineligibleCount:ineligible.length};
  if (scenario==='not_active') return {routing:'clear',gate:'proceed',cert:true,certFields:true};
  if (scenario==='no_record')  return {routing:'escalate_human',gate:'hold',cert:true};
}

module.exports = { ACCOUNTS, EVAL_CASES, simulateResult };
