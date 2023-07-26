export class VoteRequest {
  voteId: number | null;
  choiceIds: number[];
  participant: string;
  userUuid: string | null;
  ipAddress: string | null;
  token: string | null;

  constructor(voteId: number | null, choiceIds: number[], participant: string, userUuid: string | null, ipAddress: string | null, token: string | null) {
    this.voteId = voteId;
    this.choiceIds = choiceIds;
    this.participant = participant;
    this.userUuid = userUuid;
    this.ipAddress = ipAddress;
    this.token = token;
  }
}
