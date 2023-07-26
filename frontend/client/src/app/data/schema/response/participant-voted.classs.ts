export class ParticipantVoted {
  voteId: number;
  participant: string;
  userUuid: string;
  choiceIds: number[];

  constructor(voteId: number, participant: string, userUuid: string, choiceIds: number[]) {
    this.voteId = voteId;
    this.participant = participant;
    this.userUuid = userUuid;
    this.choiceIds = choiceIds;
  }
}
