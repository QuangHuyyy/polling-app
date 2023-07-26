import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserResponse } from "@poll-base/data/schema/response/user_response.class";
import { ResponseMessage } from "@poll-base/data/schema/response/response-message.class";
import { HttpErrorResponse } from "@angular/common/http";
import { StorageService } from "@poll-base/core/services/storage.service";
import { PollService } from "@poll-base/core/services/poll.service";
import { HotToastService } from "@ngneat/hot-toast";
import { PollResponse } from "@poll-base/data/schema/response/poll-response.class";
import { VotingTokenResponse } from "@poll-base/data/schema/response/voting-token-response.class";

@Component({
  selector: "app-share-modal[pollDetail][isOpenModalShare]",
  templateUrl: "./share-modal.component.html",
  styleUrls: ["./share-modal.component.scss"],
})
export class ShareModalComponent implements OnInit {
  fSharePoll!: FormGroup;
  @Input() isOpenModalShare: boolean = false;
  @Input() pollDetail!: PollResponse;

  @Output() openModalShareChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  tokensSent: VotingTokenResponse[] = [];
  tokenValidQuantity: number = 0;

  constructor(private formBuilder: FormBuilder, private storageService: StorageService, private pollService: PollService, private toastService: HotToastService) {}

  ngOnInit(): void {
    this.fSharePoll = this.formBuilder.group({
      emailAddresses: ["", [Validators.required, Validators.pattern("^[\\W]*([\\w+\\-.%]+@[\\w\\-.]+\\.[A-Za-z]{2,4}[\\W]*;{1}[\\W]*)*([\\w+\\-.%]+@[\\w\\-.]+\\.[A-Za-z]{2,4})[\\W]*$")]],
    });

    if (this.pollDetail.setting.votingRestrictionValue == "token") {
      this.getAllTokenSentPoll(this.pollDetail.uuid);
    }
  }

  onSubmitShare(): void {
    if (this.fSharePoll.valid) {
      let user: UserResponse | null = this.storageService.getUser();
      if (user != null) {
        this.pollService.sendTokenToEmail(this.pollDetail.uuid, user.uuid, this.fSharePoll.get("emailAddresses")?.value, user.email, user.name).subscribe({
          next: (data: ResponseMessage) => {
            this.toastService.success(data.message);
            this.fSharePoll.get("emailAddresses")?.patchValue("");
            this.getAllTokenSentPoll(this.pollDetail.uuid);
          },
          error: (err: HttpErrorResponse) => {
            this.toastService.error(err.error.detail);
          },
        });
      }
    }
  }

  removeToken(id: number): void {
    this.pollService.deleteTokenSentPoll(id).subscribe({
      next: (message: ResponseMessage) => {
        this.getAllTokenSentPoll(this.pollDetail.uuid);
      },
      error: (err: HttpErrorResponse) => {
        this.toastService.error(err.error.detail);
      },
    });
  }

  getAllTokenSentPoll(pollUuid: string): void {
    this.pollService.getAllTokenSentPoll(pollUuid).subscribe({
      next: (data: VotingTokenResponse[]): void => {
        this.tokensSent = data;
        this.tokenValidQuantity = 0;
        data.forEach((token: VotingTokenResponse): void => {
          if (token.token != null) {
            this.tokenValidQuantity++;
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        this.toastService.error(err.error.detail);
      },
    });
  }
}
