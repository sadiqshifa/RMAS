const { evaluateTiming, evaluateSPCP } = require('./aav_engine.js');

let pass = 0, fail = 0;
const results = [];

function runTiming(id, desc, scenario, dateVal, expectedDeadline){
  const r = evaluateTiming(scenario, dateVal);
  const ok = r.deadline === expectedDeadline;
  if(ok) pass++; else fail++;
  results.push({id, desc, ok, expected: expectedDeadline, actual: r.deadline});
}

function runSPCP(id, desc, timing, forProfit, flaggedChars, expected){
  const r = evaluateSPCP(timing, forProfit, flaggedChars);
  const ok = r.result === expected;
  if(ok) pass++; else fail++;
  results.push({id, desc, ok, expected, actual: r.result});
}

// --- 5a. Timing calculator (T-01 through T-05) ---
runTiming('T-01', 'Completed application — 30 days', '30-completed', '2026-08-01', '2026-08-31');
runTiming('T-02', 'Incomplete application — 30 days', '30-incomplete', '2026-08-01', '2026-08-31');
runTiming('T-03', 'Existing account — 30 days', '30-existing', '2026-08-01', '2026-08-31');
runTiming('T-04', 'Counteroffer, no response — 90 days', '90-counteroffer', '2026-08-01', '2026-10-30');
runTiming('T-05', 'Completed application, leap-year Feb boundary', '30-completed', '2028-01-31', '2028-03-01');

// --- 5b. SPCP screen (S-01 through S-05) ---
const RACE = [{id:'spcp-race', label:'Race'}];
const RACE_SEX_NATL = [{id:'spcp-race', label:'Race'}, {id:'spcp-sex', label:'Sex'}, {id:'spcp-national', label:'National origin'}];

runSPCP('S-01', 'Before Jul 21 — grandfathered regardless of characteristics', 'before', 'yes', RACE, 'GRANDFATHERED');
runSPCP('S-02', 'After Jul 21, not-for-profit — restriction does not apply', 'after', 'no', RACE, 'N/A');
runSPCP('S-03', 'After Jul 21, for-profit, no characteristics flagged', 'after', 'yes', [], 'CLEAR');
runSPCP('S-04', 'After Jul 21, for-profit, race flagged', 'after', 'yes', RACE, 'FLAGGED');
runSPCP('S-05', 'After Jul 21, for-profit, race+sex+national origin all flagged', 'after', 'yes', RACE_SEX_NATL, 'FLAGGED');

// S-05 also checks that all three flagged characteristics are actually named, not just decision
const s05 = require('./aav_engine.js').evaluateSPCP('after', 'yes', RACE_SEX_NATL);
const allThreeNamed = s05.flaggedLabels && s05.flaggedLabels.length === 3;
if(allThreeNamed) pass++; else fail++;
results.push({id:'S-05b', desc:'All three flagged characteristics actually named in output, not just count', ok: allThreeNamed, expected:'3 labels', actual: JSON.stringify(s05.flaggedLabels)});

console.log('PASS:', pass, '/', pass+fail);
console.log('');
results.forEach(r => {
  console.log((r.ok ? '✅' : '❌'), r.id, '-', r.desc, r.ok ? '' : `(expected ${r.expected}, got ${r.actual})`);
});
