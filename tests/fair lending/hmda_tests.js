const { evaluateDepository, evaluateNonDepository } = require('./hmda_engine.js');

let pass = 0, fail = 0;
const results = [];

function runDep(id, desc, assets, location, activity, federal, ce1, ce2, oe1, oe2, expected){
  const r = evaluateDepository(assets, location, activity, federal, ce1, ce2, oe1, oe2);
  const ok = r.result === expected;
  if(ok) pass++; else fail++;
  results.push({id, desc, ok, expected, actual: r.result});
}

function runNdep(id, desc, office, fiveLoans, ce1, ce2, oe1, oe2, expected){
  const r = evaluateNonDepository(office, fiveLoans, ce1, ce2, oe1, oe2);
  const ok = r.result === expected;
  if(ok) pass++; else fail++;
  results.push({id, desc, ok, expected, actual: r.result});
}

// --- Depository institution cases (D-01 through D-10) ---
runDep('D-01', 'All five tests pass with margin', 75000000, true, true, true, 30, 30, 0, 0, 'REPORTABLE');
runDep('D-02', 'Exactly at $59M threshold — does not exceed it', 59000000, true, true, true, 30, 30, 0, 0, 'EXEMPT');
runDep('D-03', 'One dollar over threshold — boundary check', 59000001, true, true, true, 30, 30, 0, 0, 'REPORTABLE');
runDep('D-04', 'Fails location test alone', 75000000, false, true, true, 30, 30, 0, 0, 'EXEMPT');
runDep('D-05', 'Fails loan-activity test alone', 75000000, true, false, true, 30, 30, 0, 0, 'EXEMPT');
runDep('D-06', 'Fails federally-related test alone', 75000000, true, true, false, 30, 30, 0, 0, 'EXEMPT');
runDep('D-07', 'Fails volume test both ways', 75000000, true, true, true, 24, 24, 199, 199, 'EXEMPT');
runDep('D-08', 'Passes volume via closed-end path only, exactly at minimum', 75000000, true, true, true, 25, 25, 0, 0, 'REPORTABLE');
runDep('D-09', 'Passes volume via open-end path only, exactly at minimum', 75000000, true, true, true, 0, 0, 200, 200, 'REPORTABLE');
runDep('D-10', 'Volume must hold in both years — fails year 2', 75000000, true, true, true, 30, 20, 0, 0, 'EXEMPT');

// --- Non-depository institution cases (N-01 through N-04) ---
runNdep('N-01', 'Location via office, volume passes', true, null, 30, 30, 0, 0, 'REPORTABLE');
runNdep('N-02', 'Location via loan-count alternative — no office needed', false, true, 30, 30, 0, 0, 'REPORTABLE');
runNdep('N-03', 'Fails location entirely — high volume does not matter', false, false, 30, 30, 0, 0, 'EXEMPT');
runNdep('N-04', 'Location passes, volume fails', true, null, 24, 24, 199, 199, 'EXEMPT');

console.log('PASS:', pass, '/', pass+fail);
console.log('');
results.forEach(r => {
  console.log((r.ok ? '✅' : '❌'), r.id, '-', r.desc, r.ok ? '' : `(expected ${r.expected}, got ${r.actual})`);
});
