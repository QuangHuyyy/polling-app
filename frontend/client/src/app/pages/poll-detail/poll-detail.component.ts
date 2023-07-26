import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { PollService } from "@poll-base/core/services/poll.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { PollResponse } from "@poll-base/data/schema/response/poll-response.class";
import { StorageService } from "@poll-base/core/services/storage.service";
import { UserResponse } from "@poll-base/data/schema/response/user_response.class";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, ValidationErrors, ValidatorFn } from "@angular/forms";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { VoteRequest } from "@poll-base/data/schema/request/vote-request.class";
import { ResponseMessage } from "@poll-base/data/schema/response/response-message.class";
import { HotToastService } from "@ngneat/hot-toast";
import { ClipboardService } from "ngx-clipboard";
import { LastVotedResponse } from "@poll-base/data/schema/response/last-voted-response.class";
import { VoteResultResponse } from "@poll-base/data/schema/response/vote-result-response.class";

export function requiredChoice(c: AbstractControl) {
  const choiceIds: string[] = c.value;
  let result: { requiredChoice: boolean } | null = { requiredChoice: true };
  for (let i: number = 0; i < choiceIds.length; i++) {
    if (choiceIds.at(i) != "") {
      result = null;
      break;
    }
  }
  return result;
}

export function customRequired(isRequired: boolean): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null => {
    const value = c.value;
    if (isRequired) {
      if (value == "") {
        return { customRequired: true };
      }
    }
    return null;
  };
}

@Component({
  selector: "app-poll-detail",
  templateUrl: "./poll-detail.component.html",
  styleUrls: ["./poll-detail.component.scss"],
})
export class PollDetailComponent implements OnInit {
  fVotePoll!: FormGroup;

  isOpenMenu: boolean = false;
  @ViewChild("btnAction") btnAction!: ElementRef;
  @ViewChild("menuAction") menuAction!: ElementRef;
  pollDetail!: PollResponse;
  currentUser!: UserResponse | null;
  isOwner: boolean = false;
  isFirstVote: boolean = true;
  isDisableMeetingChoiceRemaining: boolean = false;
  isDeadline: boolean = false;
  ipAddress!: string | null;

  isShowResult: boolean = false;
  messageError: string = "";
  linkPoll: string = "https://quanghuy-poll-app-client.firebaseapp.com" + "/polls";
  isOpenModalShare: boolean = false;
  isNewVote: boolean = true;
  choiceIdsVoted!: number[] | undefined;
  lastVotedId!: number | undefined;

  isScrollMeetingEnd: boolean = false;
  voteResult!: VoteResultResponse;
  editMeetingVote: boolean = false;

  isExpired: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private pollService: PollService,
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private http: HttpClient,
    private toastService: HotToastService,
    private clipboardService: ClipboardService
  ) {}

  get choiceIds(): FormArray {
    return this.fVotePoll.get("choiceIds") as FormArray;
  }

  choiceIsSelected(id: number): boolean {
    for (let choice of this.choiceIds.controls) {
      if ((choice as FormControl).value == id) {
        return true;
      }
    }
    return false;
  }

  ngOnInit(): void {
    this.http.get("https://api.ipify.org/?format=json").subscribe({
      next: (res: any) => {
        this.ipAddress = res.ip;
      },
      error: (err: HttpErrorResponse) => {
        this.ipAddress = null;
      },
    });

    this.currentUser = this.storageService.getUser();

    this.route.params.subscribe((data: Params): void => {
      let uuid: string = data["uuid"];
      this.linkPoll += "/" + uuid;

      this.pollService.getPollByUuid(uuid).subscribe({
        next: (poll: PollResponse): void => {
          this.pollDetail = poll;
          this.initForm();
          this.pollDetail.choices.forEach(() => this.choiceIds.push(new FormControl("")));
          if (poll.setting.deadlineTime != null) {
            this.isDeadline = new Date(poll.setting.deadlineTime.toString()).getTime() - new Date().getTime() < 0;
          }

          if (this.pollDetail.votingTypeValue == "multiple_choice") {
            this.pollDetail.choices.sort((a, b) => a.other - b.other);
          }

          this.checkUpdateVoteMode(poll);

          this.showResult();
          this.isOwner = poll.createdBy == this.currentUser?.uuid;
          if (poll.votingTypeValue == "meeting") {
            this.getPollResult();
          }

          this.isExpired = new Date(poll.setting.deadlineTime).getTime() - new Date().getTime() > 0;
        },
        error: (err) => {
          if (err.status == 404) {
            this.router.navigate(["/not-found"], { state: { message: err.error.detail } });
          }
        },
      });
    });
  }

  scrollMeeting(scrollOne: HTMLElement, scrollTwo: HTMLElement, isScrollToLeft: boolean): void {
    let valueScroll: number = 50;
    if (isScrollToLeft) {
      valueScroll = -50;
    }
    scrollOne.scrollTo({ left: scrollOne.scrollLeft + valueScroll, behavior: "smooth" });
    scrollTwo.scrollTo({ left: scrollTwo.scrollLeft + valueScroll, behavior: "smooth" });
  }

  onSubmitForm(form: FormGroupDirective) {
    if (this.fVotePoll.valid) {
      let choiceIdsRequest: any[] = this.choiceIds.value;
      choiceIdsRequest = choiceIdsRequest.filter((id): boolean => id != "");
      let name: string = this.fVotePoll.get("name")?.value;

      if (this.isNewVote) {
        let vote: VoteRequest = new VoteRequest(null, choiceIdsRequest, name, this.fVotePoll.get("userUuid")?.value, this.ipAddress, this.fVotePoll.get("token")?.value);

        if (this.pollDetail.setting.votingRestrictionValue == "session" && this.storageService.addSessionVotedPoll(this.pollDetail.uuid)) {
          this.messageError = "You already voted on this poll!";
        } else {
          this.pollService.votePoll(this.pollDetail.uuid, vote).subscribe({
            next: (message: ResponseMessage) => {
              this.storageService.addSessionVotedPoll(this.pollDetail.uuid);
              if (!this.storageService.isLoggedIn()) {
                // @ts-ignore
                let voteId: number = message.message.split(":").at(1);
                this.storageService.clearVotedAnonymous(this.pollDetail.uuid);
                this.storageService.addVotedAnonymous(this.pollDetail.uuid, voteId, choiceIdsRequest);
                this.choiceIdsVoted = choiceIdsRequest;
                this.setChoiceLastVoted();
                this.toastService.success("Vote successfully.");
              } else {
                this.toastService.success(message.message);
              }
              if (this.pollDetail.votingTypeValue == "meeting") {
                this.getPollResult();
              }
              this.messageError = "";
              form.resetForm();

              for (let i: number = 0; i <= this.pollDetail.choices.length - 1; i++) {
                this.addMeetingVoteId(this.pollDetail.choices.at(i)["id"], i);
                this.choiceIds.at(i).patchValue("");
              }
              this.fVotePoll.get("name")?.patchValue("");
              this.getPollResult();
              this.checkUpdateVoteMode(this.pollDetail);
            },
            error: (err: HttpErrorResponse) => {
              this.messageError = err.error.detail;
            },
          });
        }
      } else {
        // update vote
        if (this.storageService.isLoggedIn()) {
          let vote: VoteRequest = new VoteRequest(null, choiceIdsRequest, name, this.fVotePoll.get("userUuid")?.value, null, null);

          this.pollService.updateVotePoll(this.pollDetail.uuid, vote).subscribe({
            next: (message: ResponseMessage) => {
              this.toastService.success(message.message);
            },
            error: (err: HttpErrorResponse) => {
              this.toastService.error(err.error.detail);
            },
          });
        } else {
          let voteId: number | undefined = this.storageService.getVotedAnonymous(this.pollDetail.uuid)?.voteId;
          if (voteId) {
            let vote: VoteRequest = new VoteRequest(voteId, choiceIdsRequest, name, null, null, null);

            this.pollService.updateVotePoll(this.pollDetail.uuid, vote).subscribe({
              next: (message: ResponseMessage) => {
                if (voteId) {
                  this.storageService.addVotedAnonymous(this.pollDetail.uuid, voteId, choiceIdsRequest);
                }
                this.toastService.success(message.message);
              },
              error: (err: HttpErrorResponse) => {
                this.toastService.error(err.error.detail);
              },
            });
          }
        }
      }
    }
  }

  addVoteId(id: number, index: number): void {
    if (this.pollDetail.setting.allowMultipleOptions) {
      if (this.choiceIds.at(index).value == "") {
        this.choiceIds.at(index).patchValue(id);
        this.isFirstVote = false;
      } else {
        this.choiceIds.at(index).patchValue("");
        this.isFirstVote = true;
      }
    } else {
      for (let i = 0; i < this.choiceIds.length; i++) {
        if (i == index) {
          this.choiceIds.at(i).patchValue(id);
        } else {
          this.choiceIds.at(i).patchValue("");
        }
      }
    }
  }

  addMeetingVoteId(id: number, index: number): void {
    if (this.choiceIds.at(index).value == "") {
      this.choiceIds.at(index).patchValue(id);
      this.isFirstVote = false;
    } else {
      this.choiceIds.at(index).patchValue("");
      this.isFirstVote = true;
    }

    this.isDisableMeetingChoiceRemaining = !this.pollDetail.setting.allowMultipleOptions;
  }

  onClipboardCopy(value: string) {
    this.clipboardService.copyFromContent(value);
    this.toastService.success("Successful copied.");
  }

  onChangeNewVote() {
    this.isNewVote = true;
    this.fVotePoll.get("name")?.patchValue(this.storageService.getUser() == null ? "" : this.storageService.getUser()?.name);
    for (let i: number = 0; i < this.pollDetail.choices.length; i++) {
      this.choiceIds.at(i).patchValue("");
    }
  }

  handelResetPoll($event: boolean): void {
    if ($event) {
      for (let i: number = 0; i < this.pollDetail.choices.length; i++) {
        this.choiceIds.at(i).patchValue("");
      }
    }
  }

  onPublicPoll(): void {
    if (this.currentUser?.uuid) {
      this.pollService.publicPoll(this.pollDetail.uuid, this.currentUser?.uuid).subscribe({
        next: (poll: PollResponse) => {
          this.pollDetail = poll;
        },
        error: (err: HttpErrorResponse) => {
          this.router.navigate(["/not-found"], { state: { message: err.error.detail } });
        },
      });
    } else {
      this.router.navigate(["/not-found"], { state: { message: "Missing permissions!" } });
    }
  }

  onScrollMeeting(scrollOne: HTMLDivElement, scrollTwo: HTMLDivElement): void {
    scrollOne.scrollLeft = scrollTwo.scrollLeft;
    this.isScrollMeetingEnd = scrollOne.scrollLeft + scrollOne.offsetWidth - scrollOne.scrollWidth == 0;
  }

  onEditMeetingVote(choiceIds: number[], participant: string): void {
    this.fVotePoll.get("name")?.patchValue(participant);
    for (let i = 0; i < this.choiceIds.length; i++) {
      let id: number | string = this.choiceIds.at(i).value;
      if (typeof id === "number") {
        this.addMeetingVoteId(id, i);
      }
    }

    this.editMeetingVote = true;
    // let index: number = this.voteResult.choices.findIndex((item) => item.choice["id"] == choiceId);
    // this.addMeetingVoteId(choiceId, index);
    choiceIds.forEach((choiceId) => {
      let index: number = this.voteResult.choices.findIndex((item) => item.choice["id"] == choiceId);
      this.addMeetingVoteId(choiceId, index);
    });
  }

  onCancelEditMeeting() {
    for (let i = 0; i < this.choiceIds.length; i++) {
      let id: number | string = this.choiceIds.at(i).value;
      if (typeof id === "number") {
        this.addMeetingVoteId(id, i);
      }
    }
    this.fVotePoll.get("name")?.patchValue(this.storageService.getUser() == null ? "" : this.storageService.getUser()?.name);
    this.editMeetingVote = false;
  }

  updateVoteMeeting() {
    let choiceIdsRequest: any[] = this.choiceIds.value;
    choiceIdsRequest = choiceIdsRequest.filter((id): boolean => id != "");
    let name: string = this.fVotePoll.get("name")?.value;

    if (this.storageService.isLoggedIn()) {
      let vote: VoteRequest = new VoteRequest(this.lastVotedId ? this.lastVotedId : null, choiceIdsRequest, name, this.fVotePoll.get("userUuid")?.value, null, null);

      this.pollService.updateVotePoll(this.pollDetail.uuid, vote).subscribe({
        next: (message: ResponseMessage) => {
          this.toastService.success(message.message);
          this.getPollResult();
          this.onCancelEditMeeting();
        },
        error: (err: HttpErrorResponse) => {
          this.toastService.error(err.error.detail);
        },
      });
    } else {
      let voteId: number | undefined = this.storageService.getVotedAnonymous(this.pollDetail.uuid)?.voteId;
      if (voteId) {
        let vote: VoteRequest = new VoteRequest(voteId, choiceIdsRequest, name, null, null, null);

        this.pollService.updateVotePoll(this.pollDetail.uuid, vote).subscribe({
          next: (message: ResponseMessage) => {
            if (voteId) {
              this.storageService.addVotedAnonymous(this.pollDetail.uuid, voteId, choiceIdsRequest);
            }
            this.getPollResult();
            this.onCancelEditMeeting();
            this.toastService.success(message.message);
          },
          error: (err: HttpErrorResponse) => {
            this.toastService.error(err.error.detail);
          },
        });
      }
    }
  }

  private initForm(): void {
    let token: string = "";

    this.route.queryParams.subscribe((params: Params): void => {
      if (params["token"]) {
        token = params["token"];
      }
    });

    let requiredName: boolean = this.pollDetail.votingTypeValue == "meeting" ? true : this.pollDetail.setting.requireParticipantName;
    this.fVotePoll = this.formBuilder.group({
      choiceIds: this.formBuilder.array([], { validators: requiredChoice }),
      name: [this.storageService.getUser() == null ? "" : this.storageService.getUser()?.name, customRequired(requiredName)],
      userUuid: [this.storageService.getUser() == null ? "" : this.storageService.getUser()?.uuid],
      token: [token, customRequired(this.pollDetail == null ? false : this.pollDetail.setting.votingRestrictionValue == "token")],
    });
  }

  private showResult(): void {
    if (this.isOwner) {
      this.isShowResult = true;
      return;
    }

    let resultsVisibility: string = this.pollDetail.setting.resultsVisibilityValue;
    switch (resultsVisibility) {
      case "always":
        this.isShowResult = true;
        break;
      case "after_deadline":
        let deadline: string | null = this.pollDetail.setting.deadlineTime;
        if (deadline == null) {
          this.isShowResult = false;
        } else {
          this.isShowResult = new Date().getTime() - new Date(deadline).getTime() > 0;
        }
        break;
      case "after_vote":
        if (this.currentUser != null) {
          this.pollService.isAllowShowResult(this.pollDetail.uuid, this.currentUser.uuid).subscribe({
            next: (isShow: boolean) => (this.isShowResult = isShow),
            error: (err: HttpErrorResponse) => {
              this.toastService.error(err.error.detail);
              this.isShowResult = false;
            },
          });
        } else {
          // not login
          this.isShowResult = this.storageService.getSessionVotedPoll(this.pollDetail.uuid);
        }
        break;
      case "hidden":
        this.isShowResult = false;
        break;
    }
  }

  private checkUpdateVoteMode(poll: PollResponse) {
    if (!poll.setting.allowEditVote) {
      this.isNewVote = true;
      return;
    }

    this.isNewVote = false;

    if (this.storageService.isLoggedIn()) {
      this.currentUser = this.storageService.getUser();
      if (this.currentUser != null) {
        if (this.currentUser?.uuid === poll.createdBy) {
          this.isOwner = true;
          if (poll.setting.votingRestrictionValue == "token") {
            this.isNewVote = true;
          }
        }

        if (!this.isNewVote) {
          this.pollService.getLastVotedByUser(poll.uuid, this.currentUser.uuid).subscribe({
            next: (lastVoted: LastVotedResponse): void => {
              this.lastVotedId = lastVoted.voteId;

              if (poll.votingTypeValue == "meeting") {
                this.isNewVote = true;
              } else {
                this.choiceIdsVoted = lastVoted.choiceIds;
                this.setChoiceLastVoted();
                this.fVotePoll.get("name")?.patchValue(lastVoted.participant);
                this.isNewVote = this.choiceIdsVoted.length == 0;
              }
            },
            error: (err: HttpErrorResponse) => {
              this.toastService.error(err.error.detail);
            },
          });
        }
      }
    } else {
      if (this.storageService.getVotedAnonymous(poll.uuid) != null) {
        this.lastVotedId = this.storageService.getVotedAnonymous(poll.uuid)?.voteId;
        if (poll.votingTypeValue == "meeting") {
          this.isNewVote = true;
        } else {
          this.choiceIdsVoted = this.storageService.getVotedAnonymous(poll.uuid)?.choiceIds;
          this.setChoiceLastVoted();
          this.isNewVote = this.choiceIdsVoted == undefined || this.choiceIdsVoted.length == 0;
        }
      } else {
        this.isNewVote = true;
      }
    }
  }

  private setChoiceLastVoted(): void {
    if (this.choiceIdsVoted) {
      for (let i: number = 0; i <= this.pollDetail.choices.length - 1; i++) {
        let choice = this.pollDetail.choices.at(i);
        for (let j: number = 0; j <= this.choiceIdsVoted.length - 1; j++) {
          if (choice["id"] == this.choiceIdsVoted.at(j)) {
            this.choiceIds.at(i).patchValue(this.choiceIdsVoted.at(j));
            break;
          }
        }
      }
    }
  }

  private getPollResult() {
    this.route.params.subscribe((data: Params): void => {
      let uuid: string = data["uuid"];
      this.pollService.getResultVote(uuid).subscribe({
        next: (voteResult: VoteResultResponse): void => {
          this.voteResult = voteResult;
        },
        error: (err: HttpErrorResponse) => {
          if (err.status == 404) {
            this.router.navigate(["/not-found"], { state: { message: err.error.detail } });
          }
        },
      });
    });
  }
}
