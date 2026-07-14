const ASSET_THRESHOLD = 59000000;
const CE_MIN = 25;
const OE_MIN = 200;

function volumeTest(ce1, ce2, oe1, oe2){
  const closedPass = (ce1 >= CE_MIN) && (ce2 >= CE_MIN);
  const openPass = (oe1 >= OE_MIN) && (oe2 >= OE_MIN);
  return closedPass || openPass;
}

// Pure wrapper of runDepository()'s decision logic (agents/hmda-calculator.html
// lines 510-515), parameterized instead of reading from the DOM. Every
// conditional line below is copied verbatim from the source.
function evaluateDepository(assets, location, activity, federal, ce1, ce2, oe1, oe2){
  const t1 = assets > ASSET_THRESHOLD;
  const t2 = location === true;
  const t3 = activity === true;
  const t4 = federal === true;
  const t5 = volumeTest(ce1, ce2, oe1, oe2);
  const allPass = t1 && t2 && t3 && t4 && t5;
  return { t1, t2, t3, t4, t5, allPass, result: allPass ? 'REPORTABLE' : 'EXEMPT' };
}

// Pure wrapper of runNonDepository()'s decision logic (lines 539-541).
function evaluateNonDepository(office, fiveLoans, ce1, ce2, oe1, oe2){
  const t1 = (office === true) || (fiveLoans === true);
  const t2 = volumeTest(ce1, ce2, oe1, oe2);
  const allPass = t1 && t2;
  return { t1, t2, allPass, result: allPass ? 'REPORTABLE' : 'EXEMPT' };
}

module.exports = { volumeTest, evaluateDepository, evaluateNonDepository, ASSET_THRESHOLD, CE_MIN, OE_MIN };
