export class LastVotedResponse {
  choiceIds: number[];
  voteId: number;
  participant: string;

  constructor(choiceIds: number[], voteId: number, participant: string) {
    this.choiceIds = choiceIds;
    this.voteId = voteId;
    this.participant = participant;
  }
}
