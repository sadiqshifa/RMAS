function evaluate(input, cfg, ledgerEntry, bankWideTotal){
  const citations = [];
  const routing = [];
  const trace = [];
  let decision = 'approved';
  let reasoning = '';

  if(input.txnType === 'overdraft'){
    citations.push('12 C.F.R. § 215.4(e) — overdraft prohibition for executive officers and directors');
    if(input.insiderType === 'principal_shareholder'){
      routing.push({who:'Compliance (register only)', action:'Logged — overdraft prohibition does not apply to a principal shareholder who is not also an officer or director'});
      decision = 'approved';
      reasoning = 'The § 215.4(e) overdraft prohibition applies to executive officers and directors, not to a principal shareholder unless they also hold one of those roles. Logged, no restriction applies at this determination.';
    } else if(input.odPlan){
      routing.push({who:'Compliance (register only)', action:'Logged — covered by a pre-authorized repayment plan'});
      decision = 'approved';
      reasoning = 'A pre-authorized, interest-bearing repayment plan (or pre-authorized transfer) is in place, satisfying § 215.4(e). Permitted.';
    } else if(input.odAmount <= 1000 && input.odDays <= 5 && input.odSameFee){
      routing.push({who:'Compliance (register only)', action:'Logged — qualifies for the inadvertent-overdraft exception'});
      decision = 'approved';
      reasoning = 'No pre-authorized plan is in place, but the overdraft is $1,000 or less, outstanding no more than 5 business days, and charged the same fee as any other customer — the narrow exception in § 215.4(e) applies.';
    } else {
      routing.push({who:'Compliance Officer', action:'Payment cannot proceed without a qualifying repayment plan or the inadvertent-overdraft exception'});
      decision = 'prohibited';
      reasoning = 'No pre-authorized repayment plan is in place, and this overdraft does not qualify for the narrow inadvertent-overdraft exception (must be $1,000 or less, outstanding no more than 5 business days, and charged the standard customer fee). § 215.4(e) does not permit the bank to pay it as structured.';
    }
    return { decision, citations, routing, reasoning, trace };
  }

  // Extension of credit path
  citations.push('12 C.F.R. § 215.4(a) — insider extensions must be on substantially the same terms as comparable non-insider transactions');
  if(input.termsComparison !== 'yes'){
    routing.push({who:'Compliance Officer / Legal', action:'Review required before this extension can proceed — terms comparison not confirmed'});
    decision = 'escalate_terms';
    reasoning = 'The terms-comparison requirement under § 215.4(a) was answered "' + input.termsComparison + '," not "yes." This is the one judgment call in Reg O rather than a threshold, and any answer short of confirmed comparability routes to Compliance/Legal regardless of dollar amount.';
    return { decision, citations, routing, reasoning, trace };
  }

  const newOtherTotal = ledgerEntry.otherPurposeTotal + (input.creditPurpose === 'other' ? input.creditAmount : 0);
  const execCap = Math.min(Math.max(25000, cfg.capital * 0.025), 100000);
  if(input.insiderType === 'executive_officer' && input.creditPurpose === 'other'){
    citations.push('12 C.F.R. § 215.5(c)(4) — executive-officer "other purpose" credit sub-cap (higher of 2.5% of capital or $25,000, never more than $100,000)');
    trace.push('Exec-officer "other purpose" cap = min(max(2.5% × $' + cfg.capital.toLocaleString() + ', $25,000), $100,000) = $' + execCap.toLocaleString());
    trace.push('Existing "other purpose" aggregate to this officer: $' + ledgerEntry.otherPurposeTotal.toLocaleString() + ' + this request $' + input.creditAmount.toLocaleString() + ' = $' + newOtherTotal.toLocaleString());
    if(newOtherTotal > execCap){
      routing.push({who:'Compliance Officer', action:'Cannot be extended for this purpose at this amount — no board override available under § 215.5(c)(4)'});
      decision = 'prohibited';
      reasoning = 'This is an executive officer borrowing for a purpose outside the specifically authorized categories (education, first-lien home loan, fully secured). § 215.5(c)(4) caps aggregate "other purpose" credit to an executive officer at $' + execCap.toLocaleString() + ' — unlike the general insider board-approval trigger, this is an absolute statutory ceiling the board cannot approve past. The new aggregate of $' + newOtherTotal.toLocaleString() + ' exceeds it.';
      return { decision, citations, routing, reasoning, trace };
    }
  }

  const boardTrigger = Math.max(25000, cfg.capital * 0.05);
  const newInsiderTotal = ledgerEntry.total + input.creditAmount;
  trace.push('Board-approval trigger = max($25,000, 5% × $' + cfg.capital.toLocaleString() + ') = $' + boardTrigger.toLocaleString());
  trace.push('Existing aggregate to this insider: $' + ledgerEntry.total.toLocaleString() + ' + this request $' + input.creditAmount.toLocaleString() + ' = $' + newInsiderTotal.toLocaleString());

  const ceiling = cfg.smallBank ? cfg.capital * 2 : cfg.capital;
  const newBankWideTotal = bankWideTotal + input.creditAmount;
  trace.push('Bank-wide aggregate ceiling = ' + (cfg.smallBank ? '2× ' : '') + 'unimpaired capital = $' + ceiling.toLocaleString());
  trace.push('Existing bank-wide insider total: $' + bankWideTotal.toLocaleString() + ' + this request $' + input.creditAmount.toLocaleString() + ' = $' + newBankWideTotal.toLocaleString());

  if(newBankWideTotal > ceiling){
    citations.push('12 C.F.R. § 215.4(d) — aggregate insider-lending ceiling (bank-wide)');
    routing.push({who:'Chief Credit Officer / Board', action:'Cannot proceed — bank-wide aggregate insider-lending ceiling would be exceeded'});
    decision = 'blocked_aggregate';
    reasoning = 'Bank-wide outstanding credit to all insiders combined, including this request, would reach $' + newBankWideTotal.toLocaleString() + ', exceeding the § 215.4(d) ceiling of $' + ceiling.toLocaleString() + '. This is a bank-wide safety-and-soundness limit — individual board approval of this specific extension cannot override it.';
    return { decision, citations, routing, reasoning, trace };
  }

  if(newInsiderTotal > boardTrigger){
    citations.push('12 C.F.R. § 215.4(b) — board pre-approval required above the higher of $25,000 or 5% of unimpaired capital and surplus');
    routing.push({who:'Board of Directors', action:'Prior approval required by majority of the entire board — insider must abstain from the vote'});
    routing.push({who:'Compliance (register only)', action:'Logged pending board action'});
    decision = 'board_approval';
    reasoning = 'This insider\'s aggregate outstanding credit, including this request, would reach $' + newInsiderTotal.toLocaleString() + ', exceeding the board-approval trigger of $' + boardTrigger.toLocaleString() + '. Per § 215.4(b), this requires advance approval by a majority of the entire board with the insider abstaining from the vote — this can proceed once that approval is obtained, unlike the absolute caps above.';
    return { decision, citations, routing, reasoning, trace };
  }

  routing.push({who:'Compliance (register only)', action:'Logged — within all applicable Reg O thresholds at the management level'});
  decision = 'approved';
  reasoning = 'This insider\'s aggregate outstanding credit, including this request, is $' + newInsiderTotal.toLocaleString() + ' — within the board-approval trigger of $' + boardTrigger.toLocaleString() + ' — and the bank-wide aggregate stays within its § 215.4(d) ceiling. No board action required at this level; still logged and counted toward future determinations.';
  return { decision, citations, routing, reasoning, trace };
}

module.exports = { evaluate };
