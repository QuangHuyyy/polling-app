import { UserResponse } from "@poll-base/data/schema/response/user_response.class";

export class JwtResponse {
  public token: string;
  public userInfoResponse: UserResponse;

  constructor(token: string, userInfoResponse: UserResponse) {
    this.token = token;
    this.userInfoResponse = userInfoResponse;
  }
}
