const { EVAL_CASES, simulateResult } = require('./dmdc_engine.js');

let pass = 0, fail = 0;
EVAL_CASES.forEach(c => {
  const result = simulateResult(c.scenario);
  const ok = c.test(result);
  if(ok) pass++; else fail++;
  console.log((ok ? '✅' : '❌'), c.id, '-', c.name);
  if(!ok){ console.log('    expected:', c.expected, '| got:', JSON.stringify(result)); }
});
console.log('');
console.log('PASS:', pass, '/', pass+fail);
