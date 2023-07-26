import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {CommentResponse} from "@poll-base/data/schema/response/comment-response.class";
import {PagedResponse} from "@poll-base/data/schema/response/paged-response.class";
import {CommentRequest} from "@poll-base/data/schema/request/comment-request.class";
import {ResponseMessage} from "@poll-base/data/schema/response/response-message.class";

// const COMMENT_API: string = "http://localhost:8081/api/comments/";
const COMMENT_API: string = "https://quanghuy-api-poll-app.up.railway.app/api/comments/";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: "root",
})
export class CommentService {
  constructor(private http: HttpClient) {}

  public addCommentPoll(pollUuid: string, comment: CommentRequest): Observable<CommentResponse> {
    return this.http.post<CommentResponse>(COMMENT_API + pollUuid, comment, httpOptions);
  }

  public getAllCommentPoll(pollUuid: string, page: number | null, size: number | null, sorts: string[] | null): Observable<PagedResponse<CommentResponse>> {
    let params: HttpParams = new HttpParams();
    if (page) {
      params = params.set("page", page);
    }
    if (size) {
      params = params.set("size", size);
    }
    if (sorts) {
      sorts.forEach((sort) => (params = params.append("sort", sort)));
    }
    return this.http.get<PagedResponse<CommentResponse>>(COMMENT_API + pollUuid, { params: params });
  }

  public editCommentPoll(pollUuid: string, commentId: number, ownerUuid: string, message: string): Observable<ResponseMessage> {
    let params: HttpParams = new HttpParams().set("commentId", commentId.toString()).set("ownerUuid", ownerUuid).set("message", message);

    return this.http.put<ResponseMessage>(
      COMMENT_API + pollUuid,
      {},
      {
        params: params,
      }
    );
  }

  public deleteCommentPoll(pollUuid: string, commentId: number, ownerUuid: string): Observable<ResponseMessage> {
    let params: HttpParams = new HttpParams().set("commentId", commentId.toString()).set("ownerUuid", ownerUuid);
    return this.http.delete<ResponseMessage>(COMMENT_API + pollUuid, { params: params });
  }
}
