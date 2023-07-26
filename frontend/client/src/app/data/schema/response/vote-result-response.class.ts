import { ChoiceVoteCount } from "@poll-base/data/schema/response/choice-vote-count.class";
import { ParticipantVoted } from "@poll-base/data/schema/response/participant-voted.classs";

export class VoteResultResponse {
  pollUserUuid: string;
  pollTitle: string;
  votingType: string;
  createdBy: string;
  createdAt: string;
  resultsVisibility: string;
  deadline: string;
  requiredParticipant: boolean;
  choices: ChoiceVoteCount[];
  participantVotes: ParticipantVoted[];
  totalVotes: number;

  constructor(
    pollUserUuid: string,
    pollTitle: string,
    votingType: string,
    createdBy: string,
    createdAt: string,
    resultsVisibility: string,
    deadline: string,
    requiredParticipant: boolean,
    choices: ChoiceVoteCount[],
    participantVotes: ParticipantVoted[],
    totalVotes: number
  ) {
    this.pollUserUuid = pollUserUuid;
    this.pollTitle = pollTitle;
    this.votingType = votingType;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.resultsVisibility = resultsVisibility;
    this.deadline = deadline;
    this.requiredParticipant = requiredParticipant;
    this.choices = choices;
    this.participantVotes = participantVotes;
    this.totalVotes = totalVotes;
  }
}
