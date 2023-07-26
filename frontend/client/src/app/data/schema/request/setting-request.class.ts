export class SettingRequest {
  allowMultipleOptions: boolean;
  requireParticipantName: boolean;
  votingRestrictionValue: string;
  deadlineTime: string;
  allowComment: boolean;
  resultsVisibilityValue: string;
  // editVotePermissionValue: string;
  allowEditVote: boolean;

  constructor(
    allowMultipleOptions: boolean,
    isRequireParticipantName: boolean,
    votingRestrictionValue: string,
    deadlineTime: string,
    allowComment: boolean,
    resultsVisibilityValue: string,
    // editVotePermissionValue: string
    allowEditVote: boolean
  ) {
    this.allowMultipleOptions = allowMultipleOptions;
    this.requireParticipantName = isRequireParticipantName;
    this.votingRestrictionValue = votingRestrictionValue;
    this.deadlineTime = deadlineTime;
    this.allowComment = allowComment;
    this.resultsVisibilityValue = resultsVisibilityValue;
    // this.editVotePermissionValue = editVotePermissionValue;
    this.allowEditVote = allowEditVote;
  }
}
