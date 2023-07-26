export class SettingResponse {
  allowMultipleOptions: boolean;
  requireParticipantName: boolean;
  votingRestrictionValue: string;
  hasIpAddressVote: boolean;
  deadlineTime: string;
  allowComment: boolean;
  resultsVisibilityValue: string;
  // editVotePermissionValue: string;
  allowEditVote: boolean;

  constructor(
    allowMultipleOptions: boolean,
    isRequireParticipantName: boolean,
    votingRestrictionValue: string,
    hasIpAddressVote: boolean,
    deadlineTime: string,
    allowComment: boolean,
    resultsVisibilityValue: string,
    // editVotePermissionValue: string
    allowEditVote: boolean
  ) {
    this.allowMultipleOptions = allowMultipleOptions;
    this.requireParticipantName = isRequireParticipantName;
    this.votingRestrictionValue = votingRestrictionValue;
    this.hasIpAddressVote = hasIpAddressVote;
    this.deadlineTime = deadlineTime;
    this.allowComment = allowComment;
    this.resultsVisibilityValue = resultsVisibilityValue;
    // this.editVotePermissionValue = editVotePermissionValue;
    this.allowEditVote = allowEditVote;
  }
}
