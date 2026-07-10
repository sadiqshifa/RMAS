const { evaluateTriage } = require('./ofac_engine.js');

let pass = 0, fail = 0;
const results = [];

function run(id, desc, input, expectedDecision){
  const r = evaluateTriage(input);
  const ok = r.decision === expectedDecision;
  if(ok){ pass++; } else { fail++; }
  results.push({ id, desc, ok, expectedDecision, actualDecision: r.decision, sim: r.sim, dob: r.dobResult, country: r.countryResult, id_: r.idResult });
}

// --- The three demo scenarios exactly as shipped in the agent ---
run('OFAC-01', 'Scenario A: common name, mismatched DOB/country → likely false positive',
  { custName:'Michael J. Chen', custDOB:'1988-03-22', custCountry:'United States', custID:'',
    entName:'Michael Chen', entDOB:'1948 to 1953', entCountry:'', entID:'' },
  'likely_false_positive');

run('OFAC-02', 'Scenario B: exact name + country match, DOB not available → requires review',
  { custName:'Anastasia Volkova', custDOB:'', custCountry:'Russia', custID:'',
    entName:'Anastasia Volkova', entDOB:'1975 to 1980', entCountry:'Russia', entID:'' },
  'requires_review');

run('OFAC-03', 'Scenario C: name + DOB + country + ID all match → likely true positive',
  { custName:'Dmitri Aleksandrovich Rusakov', custDOB:'1972-11-05', custCountry:'Russia', custID:'45 0019283',
    entName:'Dmitri A. Rusakov', entDOB:'05 Nov 1972', entCountry:'Russia', entID:'45 0019283' },
  'likely_true_positive');

// --- Additional boundary/edge cases beyond the shipped demo scenarios ---
run('OFAC-04', 'Exact name match, zero secondary identifiers available at all → requires review, not auto-cleared or auto-escalated',
  { custName:'Sergei Ivanov', custDOB:'', custCountry:'', custID:'',
    entName:'Sergei Ivanov', entDOB:'', entCountry:'', entID:'' },
  'requires_review');

run('OFAC-05', 'Low name similarity AND no identifiers available at all → falls to requires_review, not false positive (mismatch requires an actual identifier comparison, not merely low similarity)',
  { custName:'Totally Different Person', custDOB:'', custCountry:'', custID:'',
    entName:'Xylo Q. Nonmatchington', entDOB:'', entCountry:'', entID:'' },
  'requires_review');

run('OFAC-06', 'High similarity name but only country matches (no DOB/ID available) → requires review, country alone is not a "strong" identifier for escalation',
  { custName:'Elena Petrova', custDOB:'', custCountry:'Russia', custID:'',
    entName:'Elena Petrova', entDOB:'', entCountry:'Russia', entID:'' },
  'requires_review');

run('OFAC-07', 'High similarity name, DOB year matches within a listed range → true positive via range match, not just exact-date match',
  { custName:'Boris Volkov', custDOB:'1980-06-15', custCountry:'', custID:'',
    entName:'Boris Volkov', entDOB:'1978 to 1982', entCountry:'', entID:'' },
  'likely_true_positive');

run('OFAC-08', 'High similarity name, DOB year outside listed range → false positive despite exact name match, since the DOB actively rules it out',
  { custName:'Boris Volkov', custDOB:'1995-06-15', custCountry:'', custID:'',
    entName:'Boris Volkov', entDOB:'1978 to 1982', entCountry:'', entID:'' },
  'likely_false_positive');

console.log('PASS:', pass, '/', pass+fail);
console.log('');
results.forEach(r => {
  console.log((r.ok ? '✅' : '❌'), r.id, '-', r.desc);
  if(!r.ok){
    console.log('    expected:', r.expectedDecision, ' actual:', r.actualDecision, ' sim:', r.sim, ' dob:', r.dob, ' country:', r.country, ' id:', r.id_);
  }
});
