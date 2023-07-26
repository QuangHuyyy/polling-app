export class VotingTokenResponse {
  id: number;
  email: string;
  token: string;
  used: boolean;

  constructor(id: number, email: string, token: string, used: boolean) {
    this.id = id;
    this.email = email;
    this.token = token;
    this.used = used;
  }
}
