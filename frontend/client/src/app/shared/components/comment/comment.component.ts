import { Component, Input, OnInit } from "@angular/core";
import { UserResponse } from "@poll-base/data/schema/response/user_response.class";
import { StorageService } from "@poll-base/core/services/storage.service";
import { PollResponse } from "@poll-base/data/schema/response/poll-response.class";
import { CommentService } from "@poll-base/core/services/comment.service";
import { PagedResponse } from "@poll-base/data/schema/response/paged-response.class";
import { CommentResponse } from "@poll-base/data/schema/response/comment-response.class";
import { HttpErrorResponse } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommentRequest } from "@poll-base/data/schema/request/comment-request.class";
import { HotToastService } from "@ngneat/hot-toast";
import { ResponseMessage } from "@poll-base/data/schema/response/response-message.class";

@Component({
  selector: "app-comment",
  templateUrl: "./comment.component.html",
  styleUrls: ["./comment.component.scss"],
})
export class CommentComponent implements OnInit {
  fComment!: FormGroup;

  currentUser!: UserResponse | null;

  @Input() pollDetail!: PollResponse;
  pollUuid!: string;
  pageComments!: PagedResponse<CommentResponse>;
  pageNumbers: number[] = [];
  comments: CommentResponse[] = [];

  page: number = 0;
  size: number = 10;
  sort: string[] = ["createdAt", "desc"];

  constructor(private storageService: StorageService, private commentService: CommentService, private formBuilder: FormBuilder, private toastService: HotToastService) {}

  ngOnInit(): void {
    this.pollUuid = this.pollDetail.uuid;
    this.currentUser = this.storageService.getUser();

    this.initForm();

    this.getAllCommentPoll();
  }

  onSubmitComment(): void {
    if (this.fComment.valid) {
      let message: string = this.fComment.get("message")?.value;
      message = message.trim();

      let commentRequest: CommentRequest = new CommentRequest(this.fComment.get("userUuid")?.value, this.fComment.get("name")?.value, message, this.fComment.get("parentId")?.value);
      this.commentService.addCommentPoll(this.pollUuid, commentRequest).subscribe({
        next: (message: ResponseMessage): void => {
          this.toastService.success(message.message);

          this.fComment.get("message")?.patchValue("");
          this.fComment.get("message")?.setErrors(null);
          this.getAllCommentPoll();
        },
      });
    }
  }

  onReloadComments($event: boolean) {
    if ($event) {
      this.getAllCommentPoll();
    }
  }

  handlePageChange(number: number): void {
    this.page = number;
    this.getAllCommentPoll();
  }

  private initForm(): void {
    if (this.storageService)
      this.fComment = this.formBuilder.group({
        userUuid: [this.currentUser == null ? null : this.currentUser.uuid],
        name: [this.currentUser == null ? null : this.currentUser.name, [Validators.required]],
        parentId: [0],
        message: ["", Validators.required],
      });
  }

  private getAllCommentPoll(): void {
    if (this.pollDetail.setting.allowComment) {
      this.commentService.getAllCommentPoll(this.pollUuid, this.page, this.size, this.sort).subscribe({
        next: (pageComments: PagedResponse<CommentResponse>) => {
          this.pageComments = pageComments;
          this.comments = pageComments.content;

          this.pageNumbers = [];
          for (let i: number = 1; i <= pageComments.totalPages; i++) {
            this.pageNumbers.push(i);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.toastService.error(err.error.detail);
        },
      });
    }
  }
}
