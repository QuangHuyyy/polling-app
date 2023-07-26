import { Injectable } from "@angular/core";
import { UserResponse } from "@poll-base/data/schema/response/user_response.class";
import { BehaviorSubject, Observable } from "rxjs";

const TOKEN_KEY: string = "auth-token";
const USER_KEY: string = "auth-user";
const SESSION_VOTE_POLL_KEY: string = "session-vote-poll";
const ANONYMOUS_VOTE: string = "anonymous-vote";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  private _user$: BehaviorSubject<UserResponse | null> = new BehaviorSubject<UserResponse | null>(null);

  user$: Observable<UserResponse | null> = this._user$.asObservable();

  constructor() {}

  clean(): void {
    sessionStorage.clear();
    this._user$.next(null);
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    // @ts-ignore
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: UserResponse): void {
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));

    this._user$.next(user);
  }

  public getUser(): UserResponse | null {
    const user: string | null = sessionStorage.getItem(USER_KEY);
    if (user) {
      this._user$.next(JSON.parse(user));

      return JSON.parse(user);
    }

    this._user$.next(null);
    return null;
  }

  public isLoggedIn(): boolean {
    const user: string | null = sessionStorage.getItem(USER_KEY);
    return !!user;
  }

  public addSessionVotedPoll(pollUuid: string): boolean {
    let sessionVotes: string[] = JSON.parse(sessionStorage.getItem(SESSION_VOTE_POLL_KEY) || "[]");
    let checkPollUuidExits: boolean = false;

    sessionVotes.forEach((uuid: string) => {
      if (uuid == pollUuid) {
        checkPollUuidExits = true;
      }
    });

    if (!checkPollUuidExits) {
      sessionVotes.push(pollUuid);
      sessionStorage.setItem(SESSION_VOTE_POLL_KEY, JSON.stringify(sessionVotes));
    }
    return checkPollUuidExits;
  }

  public getSessionVotedPoll(pollUuid: string): boolean {
    let sessionVotes: string[] = JSON.parse(sessionStorage.getItem(SESSION_VOTE_POLL_KEY) || "[]");
    let checkPollUuidExits: boolean = false;

    sessionVotes.forEach((uuid: string) => {
      if (uuid == pollUuid) {
        checkPollUuidExits = true;
      }
    });
    if (sessionVotes.findIndex((uuid: string): boolean => uuid == pollUuid) != -1) {
      checkPollUuidExits = true;
    }
    return checkPollUuidExits;
  }

  public addVotedAnonymous(pollUuid: string, voteId: number, choiceIdsVoted: number[]): void {
    let anonymousVotes: {
      pollUuid: string;
      voteId: number;
      choiceIds: number[];
    }[] = JSON.parse(sessionStorage.getItem(ANONYMOUS_VOTE) || "[]");

    anonymousVotes.forEach((item) => {
      if (item.pollUuid == pollUuid) {
        item.choiceIds = choiceIdsVoted;
      }
    });

    anonymousVotes.push({ pollUuid: pollUuid, voteId, choiceIds: choiceIdsVoted });
    sessionStorage.setItem(ANONYMOUS_VOTE, JSON.stringify(anonymousVotes));
  }

  public getVotedAnonymous(pollUuid: string): { voteId: number; choiceIds: number[] } | null {
    let anonymousVotes: {
      pollUuid: string;
      voteId: number;
      choiceIds: number[];
    }[] = JSON.parse(sessionStorage.getItem(ANONYMOUS_VOTE) || "[]");

    let result = anonymousVotes.find((item) => item.pollUuid == pollUuid);
    if (result != undefined) {
      return { voteId: result.voteId, choiceIds: result.choiceIds };
    }

    return null;
  }

  public clearVotedAnonymous(pollUuid: string): void {
    let anonymousVotes: {
      pollUuid: string;
      voteId: number;
      choiceIds: number[];
    }[] = JSON.parse(sessionStorage.getItem(ANONYMOUS_VOTE) || "[]");
    let index: number = anonymousVotes.findIndex((item) => item.pollUuid == pollUuid);

    if (index > -1) {
      anonymousVotes.splice(index, 1);
      sessionStorage.setItem(ANONYMOUS_VOTE, JSON.stringify(anonymousVotes));
    }
  }
}
