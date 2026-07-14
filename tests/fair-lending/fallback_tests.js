const { fallbackReview, STALE_PHRASES, REQUIRED_MARKERS } = require('./fallback_engine.js');

let pass = 0, fail = 0;
const results = [];

function checkFlags(html, expectStaleFlag, expectMissingCount, note){
  const hasStaleFlag = html.includes('Found phrase');
  const missingCount = (html.match(/No match found for/g) || []).length;
  return { hasStaleFlag, missingCount };
}

function run(id, desc, text, expectStaleFlag, expectMissingCount){
  const html = fallbackReview(text);
  const { hasStaleFlag, missingCount } = checkFlags(html);
  const ok = (hasStaleFlag === expectStaleFlag) && (missingCount === expectMissingCount);
  if(ok) pass++; else fail++;
  results.push({id, desc, ok, expectStaleFlag, hasStaleFlag, expectMissingCount, missingCount});
}

// A-01: clean notice, all required language present, no stale phrases
run('A-01', 'Clean notice — modern language, no disparate-impact reference',
  'This notice informs you that your application was denied. This action was unlawful discrimination is prohibited by federal law under ECOA, and you have the right to a statement of reasons for this decision within 30 days.',
  false, 0);

// A-02: asserts the old standard as current practice — contains "effects test"
run('A-02', 'Asserts current use of the old effects-test standard',
  'This decision was made using an effects test analysis of applicant data. You have the right to a statement of reasons, and this notice states that discrimination is unlawful under ECOA.',
  true, 0);

// A-03: missing the ECOA notice provision (the "unlawful" marker), otherwise clean
run('A-03', 'Missing ECOA notice provision, otherwise clean',
  'This notice informs you that your application was denied. You have the right to a statement of reasons for this decision within 30 days.',
  false, 1);

// A-05: stale phrase present in a marketing-adjacent, arguably-unrelated sentence
run('A-05', 'Stale phrase in a marketing-adjacent sentence, unrelated to the credit decision',
  'This action was unlawful discrimination is prohibited, and you have the right to a statement of reasons. Our institution continually reviews its lending practices; a recent internal adverse impact analysis of our marketing materials found no issues.',
  true, 0);

// A-06: bare boilerplate, minimal content
run('A-06', 'Very short boilerplate notice — "application denied" and nothing else',
  'Application denied.',
  false, 2);

console.log('PASS:', pass, '/', pass+fail, '(A-04 excluded — requires live-mode judgment and a human-confirmed answer, per the spec)');
console.log('');
results.forEach(r => {
  console.log((r.ok ? '✅' : '❌'), r.id, '-', r.desc);
  if(!r.ok){
    console.log('    stale flag: expected', r.expectStaleFlag, 'got', r.hasStaleFlag, '| missing markers: expected', r.expectMissingCount, 'got', r.missingCount);
  }
});
