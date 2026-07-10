function normalizeName(n){
  return (n||'').toLowerCase().replace(/[.,]/g,'').split(/\s+/).filter(Boolean);
}

function nameSimilarity(a, b){
  const ta = normalizeName(a), tb = normalizeName(b);
  if(ta.length===0 || tb.length===0) return 0;
  const setA = new Set(ta), setB = new Set(tb);
  let overlap = 0;
  setA.forEach(t => { if(setB.has(t)) overlap++; });
  return (2*overlap) / (ta.length + tb.length);
}

function parseYear(dateStr){
  if(!dateStr) return null;
  const isoMatch = dateStr.match(/^(\d{4})-\d{2}-\d{2}$/);
  if(isoMatch) return parseInt(isoMatch[1]);
  const yearMatch = dateStr.match(/\b(19|20)\d{2}\b/);
  return yearMatch ? parseInt(yearMatch[0]) : null;
}

function compareDOB(custDOB, entDOB){
  if(!custDOB || !entDOB) return 'not_available';
  const custYear = parseYear(custDOB);
  // entDOB may be a single date, a range "1965 to 1970", or a specific listed date like "05 Nov 1972"
  const rangeMatch = entDOB.match(/(\d{4}).*?(?:to|-|–).*?(\d{4})/);
  if(rangeMatch){
    const lo = parseInt(rangeMatch[1]), hi = parseInt(rangeMatch[2]);
    if(custYear===null) return 'not_available';
    return (custYear>=lo && custYear<=hi) ? 'match' : 'mismatch';
  }
  const entYear = parseYear(entDOB);
  if(custYear===null || entYear===null) return 'not_available';
  return custYear===entYear ? 'match' : 'mismatch';
}

function compareText(a, b){
  if(!a || !b) return 'not_available';
  return a.trim().toLowerCase()===b.trim().toLowerCase() ? 'match' : 'mismatch';
}

function evaluateTriage(input){
  const sim = nameSimilarity(input.custName, input.entName);
  const dobResult = compareDOB(input.custDOB, input.entDOB);
  const countryResult = compareText(input.custCountry, input.entCountry);
  const idResult = compareText(input.custID, input.entID);

  // A confirmed mismatch on a strong identifier (DOB or ID) is disqualifying
  // on its own, regardless of how similar the name looks — in fact the
  // classic false-positive pattern IS a high-similarity name (that's why it
  // was flagged) ruled out by a mismatching identifier. Name similarity
  // alone should never drive the false-positive call.
  const strongMismatch = (dobResult==='mismatch' || idResult==='mismatch');
  const strongMatch = (dobResult==='match' || idResult==='match');
  const anyAvailable = [dobResult, countryResult, idResult].some(r=>r!=='not_available');

  let decision, label;
  if(strongMismatch){
    decision = 'likely_false_positive';
    label = 'LIKELY FALSE POSITIVE';
  } else if(sim >= 0.6 && strongMatch){
    decision = 'likely_true_positive';
    label = 'LIKELY TRUE POSITIVE — ESCALATE';
  } else {
    decision = 'requires_review';
    label = 'REQUIRES ANALYST REVIEW';
  }

  return { sim, dobResult, countryResult, idResult, decision, label, anyAvailable };
}

module.exports = { normalizeName, nameSimilarity, parseYear, compareDOB, compareText, evaluateTriage };
