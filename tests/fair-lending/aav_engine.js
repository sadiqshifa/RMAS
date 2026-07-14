// addDays() extracted byte-identical from agents/adverse-action-validator.html, line 301
function addDays(dateStr, days){
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// Pure wrapper of runTiming()'s decision logic (source lines 322-323),
// parameterized instead of reading from the DOM. Copied verbatim.
function evaluateTiming(scenario, dateVal){
  const days = scenario === '90-counteroffer' ? 90 : 30;
  const deadline = addDays(dateVal, days);
  return { days, deadline };
}

// Pure wrapper of runSPCP()'s decision logic (source lines 366-401), copied
// verbatim aside from reading flag selections as a parameter array instead
// of document.getElementById(...).checked.
function evaluateSPCP(timing, forProfit, flaggedCharacteristics){
  if(timing === 'before'){
    return { result: 'GRANDFATHERED' };
  }
  const flags = flaggedCharacteristics; // already-filtered array of {id,label}
  const isForProfit = forProfit === 'yes';
  const violates = isForProfit && flags.length > 0;

  if(!isForProfit){
    return { result: 'N/A' };
  } else if(violates){
    return { result: 'FLAGGED', flaggedLabels: flags.map(f=>f.label) };
  } else {
    return { result: 'CLEAR' };
  }
}

module.exports = { addDays, evaluateTiming, evaluateSPCP };
