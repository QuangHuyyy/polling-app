import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {PollResponse} from "@poll-base/data/schema/response/poll-response.class";
import {Observable} from "rxjs";
import {PollRequest} from "@poll-base/data/schema/request/poll-request.class";
import {ResponseMessage} from "@poll-base/data/schema/response/response-message.class";
import {VoteRequest} from "@poll-base/data/schema/request/vote-request.class";
import {VoteResultResponse} from "@poll-base/data/schema/response/vote-result-response.class";
import {VotingTokenResponse} from "@poll-base/data/schema/response/voting-token-response.class";
import {LastVotedResponse} from "@poll-base/data/schema/response/last-voted-response.class";
import {PagedResponse} from "@poll-base/data/schema/response/paged-response.class";

// const POLL_API: string = "http://localhost:8081/api/polls";
const POLL_API: string = "https://quanghuy-api-poll-app.up.railway.app/api/polls";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: "root",
})
export class PollService {
  constructor(private http: HttpClient) {}

  getAllPoll(userUuid: string, filter: string | null, page: number | null, size: number | null, sorts: string[] | null): Observable<PagedResponse<PollResponse>> {
    let params: HttpParams = new HttpParams();
    if (filter) {
      params = params.set("filter", filter);
    }
    if (size) {
      params = params.set("size", size);
    }
    if (page) {
      params = params.set("page", page);
    }
    if (sorts) {
      sorts.forEach((sort) => (params = params.append("sort", sort)));
    }

    return this.http.get<PagedResponse<PollResponse>>(POLL_API + "/user/" + userUuid, { params: params });
  }

  createPoll(pollRequest: PollRequest): Observable<ResponseMessage> {
    let formData: FormData = this.convertPollRequestToFormData(pollRequest);
    return this.http.post<ResponseMessage>(POLL_API, formData);
  }

  getPollByUuid(uuid: string): Observable<PollResponse> {
    return this.http.get<PollResponse>(`${POLL_API}/` + uuid, httpOptions);
  }

  updatePoll(uuid: string, pollRequest: PollRequest, thumbnailStatus: string, imageAnswerIdsNoChange: number[]): Observable<PollResponse> {
    let formData: FormData = this.convertPollRequestToFormData(pollRequest);
    formData.append("thumbnailStatus", thumbnailStatus);

    if (imageAnswerIdsNoChange.length > 0) {
      imageAnswerIdsNoChange.forEach((id) => {
        let idJson: string = JSON.stringify(id);
        formData.append("imageAnswerIdsNoChange", idJson);
      });
    }

    return this.http.put<PollResponse>(POLL_API + "/" + uuid, formData);
  }

  publicPoll(pollUuid: string, userUuid: string): Observable<PollResponse> {
    let params: HttpParams = new HttpParams().set("userUuid", userUuid);
    return this.http.put<PollResponse>(POLL_API + "/" + pollUuid + "/public", {}, { params: params });
  }

  duplicatePoll(pollRequest: PollRequest, thumbnailFilename: string | null, imageAnswersFilename: string[]): Observable<PollResponse> {
    let formData: FormData = this.convertPollRequestToFormData(pollRequest);
    if (thumbnailFilename) {
      formData.append("thumbnailFilename", thumbnailFilename);
    }

    if (imageAnswersFilename.length > 0) {
      imageAnswersFilename.forEach((filename: string): void => {
        let filenameJson: string = JSON.stringify(filename);
        formData.append("imageAnswersFilename", filenameJson);
      });
    }

    return this.http.post<PollResponse>(POLL_API + "/duplicate", formData);
  }

  resetPoll(pollUuid: string, userUuid: string | undefined): Observable<ResponseMessage> {
    let params: HttpParams = new HttpParams().set("userUuid", userUuid == undefined ? "" : userUuid);
    return this.http.delete<ResponseMessage>(POLL_API + "/reset/" + pollUuid, { params: params });
  }

  deletePoll(pollUuid: string, userUuid: string | undefined): Observable<ResponseMessage> {
    let params: HttpParams = new HttpParams().set("userUuid", userUuid == undefined ? "" : userUuid);
    return this.http.delete<ResponseMessage>(POLL_API + "/" + pollUuid, { params: params });
  }

  searchPoll(query: string, userUuid: string): Observable<any[]> {
    let params: HttpParams = new HttpParams().set("userUuid", userUuid);
    return this.http.get<any[]>(POLL_API + "/search/" + query, { params: params });
  }

  votePoll(uuid: string, voteRequest: VoteRequest): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(POLL_API + "/" + uuid + "/vote", voteRequest, httpOptions);
  }

  updateVotePoll(uuid: string, voteRequest: VoteRequest): Observable<ResponseMessage> {
    return this.http.put<ResponseMessage>(POLL_API + "/" + uuid + "/vote", voteRequest, httpOptions);
  }

  getLastVotedByUser(uuid: string, userUuid: string): Observable<LastVotedResponse> {
    let queryParams: HttpParams = new HttpParams().set("userUuid", userUuid);
    return this.http.get<LastVotedResponse>(POLL_API + "/" + uuid + "/user-vote-last", { params: queryParams });
  }

  getResultVote(uuid: string): Observable<VoteResultResponse> {
    return this.http.get<VoteResultResponse>(POLL_API + "/" + uuid + "/result");
  }

  isAllowShowResult(pollUuid: string, userUuid: string | null): Observable<boolean> {
    let queryParams: HttpParams = new HttpParams();
    if (userUuid != null) {
      queryParams = queryParams.set("userUuid", userUuid);
    }
    return this.http.get<boolean>(POLL_API + "/" + pollUuid + "/allow-show-result", { params: queryParams });
  }

  sendTokenToEmail(pollUuid: string, userUuid: string, emailAddresses: string, ownerEmail: string, ownerName: string): Observable<ResponseMessage> {
    let formData: FormData = new FormData();

    formData.append("userUuid", userUuid);
    formData.append("emailAddresses", emailAddresses);
    formData.append("ownerEmail", ownerEmail);
    formData.append("ownerName", ownerName);

    return this.http.post<ResponseMessage>(POLL_API + "/" + pollUuid + "/send-token-to-email", formData);
  }

  getAllTokenSentPoll(pollUuid: string): Observable<VotingTokenResponse[]> {
    return this.http.get<VotingTokenResponse[]>(POLL_API + "/" + pollUuid + "/tokens-sent", httpOptions);
  }

  deleteTokenSentPoll(id: number): Observable<ResponseMessage> {
    return this.http.delete<ResponseMessage>(POLL_API + "/token-sent/" + id, httpOptions);
  }

  exportResultVotePoll(pollUuid: string, userUuid: string): Observable<any> {
    return this.http.get(POLL_API + "/" + pollUuid + "/export", {
      params: new HttpParams().set("userUuid", userUuid),
      responseType: "blob",
    });
  }

  private convertPollRequestToFormData(pollRequest: PollRequest): FormData {
    let formData: FormData = new FormData();
    formData.append("title", pollRequest.title);
    if (pollRequest.description != "") {
      formData.append("description", pollRequest.description);
    }

    formData.append("thumbnail", pollRequest.thumbnail);
    formData.append("votingTypeValue", pollRequest.votingTypeValue);

    switch (pollRequest.votingTypeValue) {
      case "multiple_choice":
        let multipleStr: string = JSON.stringify(pollRequest.multipleChoiceAnswers);
        const multipleBlob = new Blob([multipleStr], { type: "application/json" });
        formData.append("multipleChoiceAnswers", multipleBlob);
        break;
      case "image":
        for (let i = 0; i < pollRequest.imageAnswers.length; i++) {
          formData.append("imageAnswers", pollRequest.imageAnswers.at(i));
        }

        pollRequest.labels.forEach((label: string) => formData.append("labels", label));
        break;
      case "meeting":
        let meetingStr: string = JSON.stringify(pollRequest.meetingAnswers);
        const meetingBlob = new Blob([meetingStr], { type: "application/json" });
        formData.append("meetingAnswers", meetingBlob);
        break;
    }

    let setting: string = JSON.stringify(pollRequest.settings);

    const settingsBlob = new Blob([setting], {
      type: "application/json",
    });

    formData.append("settings", settingsBlob);
    formData.append("status", pollRequest.status);

    return formData;
  }
}
