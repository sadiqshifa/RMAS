const FINRA_GIFT_LIMIT = 300;
const FED_OFFICIAL_OCCASION = 20;
const FED_OFFICIAL_ANNUAL = 50;
const FOREIGN_OFFICIAL_LOG_THRESHOLD = 50;
const GENERAL_CUSTOMER_CEILING = 250;
const ENTERTAINMENT_FREQUENCY_FLAG = 4;

function ordinal(n){
  const s = ["th","st","nd","rd"], v = n % 100;
  return s[(v-20)%10] || s[v] || s[0];
}

function evaluate(input, ledgerEntry){
  const citations = [];
  const routing = [];
  let decision = 'approved';
  let reasoning = '';

  routing.push({who: (input.managerName || 'Manager'), action: 'Approved as first-line — request cleared to independent second-line review'});

  if(input.flagPending || input.flagSolicited){
    citations.push('18 U.S.C. § 215 — Bank Bribery Act: prohibition turns on corrupt intent, not dollar value');
    routing.push({who:'Chief Compliance Officer', action:'Immediate review required before any action is taken'});
    routing.push({who:'General Counsel', action:'Notified — potential corrupt-intent indicator present'});
    routing.push({who:'Requestor', action:'Hold — do not proceed until cleared'});
    reasoning = 'A red flag was marked (connection to a pending matter, or solicitation by the recipient). Under the Bank Bribery Act, corrupt intent — not amount — is the operative test, so this overrides every threshold below and routes straight to Legal/Compliance regardless of value or manager approval.';
    return { decision:'escalate_legal', citations, routing, reasoning };
  }

  switch(input.recipCategory){

    case 'foreign_official': {
      const countryLabel = input.foCountry || 'an unspecified country';
      const agencyLabel = input.foAgency || 'an unspecified agency';
      citations.push('FCPA anti-bribery provisions, 15 U.S.C. § 78dd-1 et seq. — no statutory de minimis');
      if(input.foPendingMatter){
        routing.push({who:'General Counsel', action:'FCPA review required — tied to a specific pending business matter'});
        routing.push({who:'Chief Compliance Officer', action:'Notified'});
        decision = 'escalate_legal';
        reasoning = 'Recipient is a foreign official (' + agencyLabel + ', ' + countryLabel + ') and this request is tied to a specific pending business matter, license, contract, or approval in that country — the "obtain or retain business" element at the core of the FCPA. This routes to Legal regardless of value.';
      } else if(input.value > FOREIGN_OFFICIAL_LOG_THRESHOLD){
        routing.push({who:'General Counsel', action:'FCPA pre-clearance review required before offer is made'});
        routing.push({who:'Chief Compliance Officer', action:'Notified'});
        decision = 'escalate_legal';
        reasoning = 'Recipient is a foreign official (' + agencyLabel + ', ' + countryLabel + ') and the value exceeds the firm\'s internal logging threshold. The FCPA itself sets no bright-line dollar exemption, so any value above a nominal courtesy level routes to Legal for review before anything is offered.';
      } else {
        routing.push({who:'Compliance (register only)', action:'Logged — no escalation required at this value'});
        decision = 'approved';
        reasoning = 'Value is at or below the firm\'s internal logging threshold, and this is not tied to a specific pending business matter. Still logged in full — recipient is a foreign official (' + agencyLabel + ', ' + countryLabel + ') — but does not require Legal pre-clearance at this level.';
      }
      break;
    }

    case 'examiner': {
      const agencyMap = {occ:'OCC', frb:'Federal Reserve', fdic:'FDIC', ncua:'NCUA', state:'a state banking regulator'};
      const agencyLabel = agencyMap[input.exAgency] || 'the examining agency';
      citations.push('Interagency Bank Bribery Act guidelines — examiner independence is treated as a heightened category (' + agencyLabel + ')');
      routing.push({who:'Chief Compliance Officer', action:'Review required regardless of value — examiner independence policy'});
      routing.push({who:'General Counsel', action:'Notified'});
      decision = 'escalate_legal';
      reasoning = 'Recipient is an active examiner from ' + agencyLabel + ', currently examining this institution. Firm policy treats any gift, entertainment, or hospitality involving an active examiner as requiring review regardless of amount, to protect examiner independence.';
      break;
    }

    case 'us_official': {
      const level = input.usoLevel || 'federal';
      const branch = input.usoBranch || 'executive';
      if(level !== 'federal' || branch !== 'executive'){
        const levelLabel = level === 'federal' ? ('federal ' + branch + '-branch') : level;
        citations.push('No deterministic rule available for this government level/branch — 5 C.F.R. § 2635.204 applies only to federal executive-branch employees');
        routing.push({who:'Compliance Officer', action:'Manual review required — applicable ethics code not covered by this engine'});
        decision = 'escalate_compliance';
        reasoning = 'Recipient is a ' + levelLabel + ' official. This engine\'s deterministic threshold (5 C.F.R. § 2635.204, $20/$50) applies only to federal executive-branch employees — it does not extend to state, local, legislative-branch, or judicial-branch officials, each of which follows a different ethics code. Routed to Compliance for manual review under the correct rule set rather than applying the wrong threshold.';
      } else {
        citations.push('5 C.F.R. § 2635.204 — federal employee gift acceptance limits ($20/occasion, $50/year aggregate)');
        const newTotal = ledgerEntry.total + input.value;
        if(input.value <= FED_OFFICIAL_OCCASION && newTotal <= FED_OFFICIAL_ANNUAL){
          routing.push({who:'Compliance (register only)', action:'Logged — within recipient\'s own acceptance limits'});
          decision = 'approved';
          reasoning = 'Value ($' + input.value + ') is within the $20 per-occasion limit, and the recipient\'s year-to-date total ($' + newTotal + ') stays within the $50 annual aggregate a federal employee may accept from one source. Offering above this would risk putting the recipient in violation of their own ethics rules.';
        } else {
          routing.push({who:'Compliance Officer', action:'Review required — exceeds recipient\'s lawful acceptance limit'});
          routing.push({who:'Requestor', action:'Hold pending review'});
          decision = 'escalate_compliance';
          reasoning = 'Either the single-occasion value exceeds $20 or the recipient\'s running year-to-date total would exceed $50 (current: $' + ledgerEntry.total + ', this request: $' + input.value + ', new total: $' + newTotal + '). Offering this would risk causing the recipient to violate their own agency\'s gift rules, so it routes to Compliance rather than auto-approving.';
        }
      }
      break;
    }

    case 'institutional': {
      const employer = input.instEmployer || 'an unspecified employer';
      const relMap = {institutional_customer:'institutional customer', vendor:'vendor', counterparty:'counterparty'};
      const relLabel = relMap[input.instRelationship] || 'institutional customer';
      citations.push('FINRA Rule 3220 / MSRB Rule G-20 — $300 per-recipient annual gift limit (effective March 30, 2026)');
      if(input.txnType === 'entertainment' || input.txnType === 'travel'){
        const newCount = ledgerEntry.entertainmentCount + 1;
        if(newCount > ENTERTAINMENT_FREQUENCY_FLAG){
          routing.push({who:'Compliance Officer', action:'Propriety review — frequency threshold exceeded'});
          decision = 'escalate_compliance';
          reasoning = 'Recipient is employed by ' + employer + ' (' + relLabel + ' relationship, FINRA Rule 3220 scope). FINRA does not cap entertainment by dollar value, but requires it be neither "so frequent nor so extensive as to raise questions of propriety." This would be the ' + newCount + ordinal(newCount) + ' entertainment occasion with this recipient this year, above the firm\'s internal frequency flag of ' + ENTERTAINMENT_FREQUENCY_FLAG + ' — routed for a propriety review rather than auto-approved.';
        } else {
          routing.push({who:'Compliance (register only)', action:'Logged — within frequency norms'});
          decision = 'approved';
          reasoning = 'Recipient is employed by ' + employer + ' (' + relLabel + ' relationship, FINRA Rule 3220 scope). Entertainment is not subject to FINRA\'s dollar cap, and this is only the ' + newCount + ordinal(newCount) + ' occasion with this recipient this year — within the firm\'s internal frequency flag of ' + ENTERTAINMENT_FREQUENCY_FLAG + '.';
        }
      } else {
        const newTotal = ledgerEntry.total + input.value;
        if(newTotal <= FINRA_GIFT_LIMIT){
          routing.push({who:'Compliance (register only)', action:'Logged — within FINRA/MSRB annual limit'});
          decision = 'approved';
          reasoning = 'Recipient is employed by ' + employer + ' (' + relLabel + ' relationship, FINRA Rule 3220 scope). Year-to-date total to this recipient, including this gift, is $' + newTotal + ' — within the $' + FINRA_GIFT_LIMIT + ' annual limit under FINRA Rule 3220 / MSRB Rule G-20.';
        } else {
          routing.push({who:'Compliance Officer', action:'Review required — exceeds $300 annual gift limit'});
          decision = 'escalate_compliance';
          reasoning = 'Recipient is employed by ' + employer + ' (' + relLabel + ' relationship, FINRA Rule 3220 scope). Year-to-date total to this recipient, including this gift, would reach $' + newTotal + ' — over the $' + FINRA_GIFT_LIMIT + ' annual limit. Only FINRA\'s exemptive-relief process can authorize an exception.';
        }
      }
      break;
    }

    case 'insider': {
      const typeMap = {director:'director', executive_officer:'executive officer', principal_shareholder:'principal shareholder'};
      const typeLabel = typeMap[input.insType] || 'insider';
      if(input.insBenefit === 'noncredit'){
        citations.push('General conflicts-of-interest policy — Reg O\'s extension-of-credit rules do not apply to non-credit benefits');
        routing.push({who:'Compliance Officer / Legal', action:'Disclosure and review required — insider conflict-of-interest policy'});
        decision = 'escalate_compliance';
        reasoning = 'Recipient is a bank insider (' + typeLabel + ') and this is a non-credit benefit, so Regulation O\'s extension-of-credit rules do not directly apply. It still requires disclosure and review under the firm\'s general conflicts-of-interest policy, given the risk that even a modest gift could be perceived as currying favor with an insider.';
      } else {
        citations.push('Regulation O, 12 C.F.R. Part 215 — insider benefit and extension-of-credit rules');
        routing.push({who:'Insider Transaction Desk / Legal', action:'Review required regardless of value — Reg O scope'});
        decision = 'escalate_compliance';
        reasoning = 'Recipient is a bank insider (' + typeLabel + ') and this involves an extension of credit or credit-related benefit. Reg O requires a specific insider-transaction review, not a routine gifts-and-entertainment approval.';
      }
      break;
    }

    case 'private':
    default: {
      const rel = input.privRelationship || 'customer';
      citations.push('Bank Bribery Act, 18 U.S.C. § 215 — interagency guidance on "ordinary business courtesy" exceptions');
      const newTotal = ledgerEntry.total + input.value;
      if(newTotal <= GENERAL_CUSTOMER_CEILING){
        routing.push({who:'Compliance (register only)', action:'Logged — within firm\'s ordinary-courtesy ceiling'});
        if(rel === 'vendor'){ routing.push({who:'Vendor Management (FYI)', action:'Notified — vendor relationship, also subject to procurement fair-dealing policy'}); }
        decision = 'approved';
        reasoning = 'Recipient is a ' + rel + '. Year-to-date total, including this item, is $' + newTotal + ' — within the firm\'s internal $' + GENERAL_CUSTOMER_CEILING + ' ordinary-business-courtesy ceiling. Note: this ceiling is a firm-policy choice, not a number set by the statute itself.';
      } else {
        routing.push({who:'Compliance Officer', action:'Review required — exceeds firm\'s ordinary-courtesy ceiling'});
        decision = 'escalate_compliance';
        reasoning = 'Recipient is a ' + rel + '. Year-to-date total would reach $' + newTotal + ', above the firm\'s internal $' + GENERAL_CUSTOMER_CEILING + ' ceiling. Escalated for a reasonableness review under the Bank Bribery Act\'s "ordinary business courtesy" standard.';
      }
      break;
    }
  }

  return { decision, citations, routing, reasoning };
}

module.exports = { evaluate, FINRA_GIFT_LIMIT, FED_OFFICIAL_OCCASION, FED_OFFICIAL_ANNUAL, FOREIGN_OFFICIAL_LOG_THRESHOLD, GENERAL_CUSTOMER_CEILING, ENTERTAINMENT_FREQUENCY_FLAG };
