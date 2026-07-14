const STALE_PHRASES = [
  'effects test', 'disparate impact', 'adverse impact analysis',
  'facially neutral policy', 'statistically significant disparity',
  'creates a negative impression'
];
const REQUIRED_MARKERS = [
  {phrase:'unlawful', label:'ECOA notice language (discrimination is unlawful)'},
  {phrase:'right to a statement of reasons', label:'Statement-of-reasons right (or equivalent 60-day language)'},
];

function fallbackReview(text){
  const lower = text.toLowerCase();
  const staleHits = STALE_PHRASES.filter(p => lower.includes(p));
  const missingMarkers = REQUIRED_MARKERS.filter(m => !lower.includes(m.phrase));

  let html = '<span class="ai-tag">Fallback mode — deterministic keyword scan</span>';

  html += '<h4>Stale standard language</h4>';
  if(staleHits.length){
    html += '<ul>' + staleHits.map(h => `<li>Found phrase "<b>${h}</b>" — review against the post-April-2026 disparate-treatment-only standard; this term may no longer be accurate as written.</li>`).join('') + '</ul>';
  } else {
    html += '<p>No flagged phrases from the stale-language list found. This is a keyword match only — absence of these exact phrases does not confirm the notice is current.</p>';
  }

  html += '<h4>Required elements (heuristic)</h4>';
  if(missingMarkers.length){
    html += '<ul>' + missingMarkers.map(m => `<li>No match found for: <b>${m.label}</b>. Confirm manually against Tab 2\'s checklist — this scan is a lower-confidence heuristic, not a substitute for it.</li>`).join('') + '</ul>';
  } else {
    html += '<p>Basic markers for required language were found. Still confirm each element against Tab 2\'s checklist.</p>';
  }

  html += '<h4>Note</h4><p>Fallback mode cannot assess tone, context, or whether flagged phrases are used in a compliant way (e.g., quoting the old standard to explain a policy update is different from asserting it as current law). Treat all flags as prompts for human review, not conclusions.</p>';

  return html;
}

module.exports = { fallbackReview, STALE_PHRASES, REQUIRED_MARKERS };
