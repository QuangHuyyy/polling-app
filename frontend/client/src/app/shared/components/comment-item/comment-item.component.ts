import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommentResponse } from "@poll-base/data/schema/response/comment-response.class";
import { StorageService } from "@poll-base/core/services/storage.service";
import { HotToastService } from "@ngneat/hot-toast";
import { CommentService } from "@poll-base/core/services/comment.service";
import { UserResponse } from "@poll-base/data/schema/response/user_response.class";
import { ResponseMessage } from "@poll-base/data/schema/response/response-message.class";
import { HttpErrorResponse } from "@angular/common/http";
import { CommentRequest } from "@poll-base/data/schema/request/comment-request.class";

@Component({
  selector: "app-comment-item[comment][pollUuid][ownerUserUuid]",
  templateUrl: "./comment-item.component.html",
  styleUrls: ["./comment-item.component.scss"],
})
export class CommentItemComponent implements OnInit {
  // fCommentItem!: FormGroup;
  fEditCommentItem!: FormGroup;
  fReplyCommentItem!: FormGroup;
  isEditComment: boolean = false;
  isReplyComment: boolean = false;
  currentUser!: UserResponse | null;
  isSubmitReply: boolean = false;

  @Input() comment!: CommentResponse;
  @Input() pollUuid!: string;
  @Input() ownerUserUuid!: string;

  @Output() reloadComments: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private storageService: StorageService, private commentService: CommentService, private formBuilder: FormBuilder, private toastService: HotToastService) {}

  //
  // getEditCommentFG(): FormGroup {
  //   return this.fCommentItem.get("editCommentFG") as FormGroup;
  // }
  //
  // getReplyCommentFG(): FormGroup {
  //   return this.fCommentItem.get("replyCommentFG") as FormGroup;
  // }

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();

    this.initForm();
  }

  onCancelEdit() {
    this.isEditComment = false;
    this.fEditCommentItem.get("message")?.patchValue(this.comment.message);
  }

  onEditSubmit(): void {
    if (this.fEditCommentItem.valid) {
      this.commentService.editCommentPoll(this.pollUuid, this.comment.id, this.comment.userUuid, this.fEditCommentItem.get("message")?.value).subscribe({
        next: (message: ResponseMessage) => {
          this.toastService.success(message.message);
          this.isEditComment = false;
        },
        error: (err: HttpErrorResponse) => {
          this.toastService.error(err.error.detail);
        },
      });
    }
  }

  onDelete(): void {
    this.commentService.deleteCommentPoll(this.pollUuid, this.comment.id, this.comment.userUuid).subscribe({
      next: (message: ResponseMessage) => {
        this.toastService.success(message.message);
        this.reloadComments.emit(true);
      },
      error: (err: HttpErrorResponse) => {
        this.toastService.error(err.error.detail);
      },
    });
  }

  onCancelReply(): void {
    if (this.currentUser == null) {
      this.fReplyCommentItem.get("name")?.patchValue("");
      this.fReplyCommentItem.get("name")?.setErrors(null);
    }
    this.fReplyCommentItem.get("message")?.patchValue("");
    this.fReplyCommentItem.get("message")?.reset();
    this.isSubmitReply = false;
    this.isReplyComment = false;
  }

  onReplyCommentSubmit(): void {
    this.isSubmitReply = true;
    if (this.fReplyCommentItem.valid) {
      let message: string = this.fReplyCommentItem.get("message")?.value;
      message = message.trim();

      let commentRequest: CommentRequest = new CommentRequest(
        this.fReplyCommentItem.get("userUuid")?.value,
        this.fReplyCommentItem.get("name")?.value,
        message,
        this.fReplyCommentItem.get("parentId")?.value
      );
      this.commentService.addCommentPoll(this.pollUuid, commentRequest).subscribe({
        next: (message: ResponseMessage): void => {
          this.toastService.success(message.message);

          this.fReplyCommentItem.get("message")?.patchValue("");
          this.fReplyCommentItem.get("message")?.setErrors(null);

          this.isReplyComment = false;
          this.isSubmitReply = false;
          this.reloadComments.emit(true);
        },
        error: (err: HttpErrorResponse) => {
          this.toastService.error(err.error.detail);
        },
      });
    }
  }

  onReloadComments(value: boolean): void {
    this.reloadComments.emit(value);
  }

  private initForm(): void {
    this.fEditCommentItem = this.formBuilder.group({
      userUuid: [this.comment.userUuid],
      name: [this.comment.name, [Validators.required]],
      parentId: [this.comment.parentId],
      message: [this.comment.message, Validators.required],
    });

    this.fReplyCommentItem = this.formBuilder.group({
      userUuid: [this.currentUser == null ? null : this.currentUser.uuid],
      name: [this.currentUser == null ? null : this.currentUser.name, Validators.required],
      parentId: [this.comment.id],
      message: ["", Validators.required],
    });
  }
}
