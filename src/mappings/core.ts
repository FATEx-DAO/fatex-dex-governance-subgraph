/* eslint-disable prefer-const */
import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import {
  ProposalCreated as ProposalCreatedEvent,
  VoteCast as VoteCastEvent
} from '../types/Governor/GovernorAlpha'
import {
  Proposal,
  VoteReceipt
} from '../types/schema'
import {
  convertFateToDecimal,
  ZERO_BI
} from './helpers'

export function handleProposalCreated(event: ProposalCreatedEvent): void {
  let proposal = new Proposal(event.params.id.toString())
  proposal.proposer = event.params.proposer
  proposal.targets = event.params.targets.map<string>((target: Address) => target.toHexString())
  proposal.values = event.params.values
  proposal.signatures = event.params.signatures
  proposal.calldatas = event.params.calldatas
  proposal.startBlock = event.params.startBlock
  proposal.endTimestamp = event.params.endTimestamp
  proposal.forVotes = ZERO_BI
  proposal.againstVotes = ZERO_BI
  proposal.description = event.params.description
  proposal.save()
}

function getVoteReceiptId(event: VoteCastEvent): string {
  return event.params.proposalId.toString().concat('-').concat(event.params.voter.toHexString())
}

export function handleVoteCast(event: VoteCastEvent): void {
  let vote = VoteReceipt.load(getVoteReceiptId(event))
  if (vote == null) {
    vote = new VoteReceipt(getVoteReceiptId(event))
  }

  vote.proposal = event.params.proposalId.toString()
  vote.voter = event.params.voter
  vote.isFor = event.params.support
  vote.votes = convertFateToDecimal(event.params.votes)
}
