import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PollResponse } from "@poll-base/data/schema/response/poll-response.class";
import { ResponseMessage } from "@poll-base/data/schema/response/response-message.class";
import { HttpErrorResponse } from "@angular/common/http";
import { StorageService } from "@poll-base/core/services/storage.service";
import { HotToastService } from "@ngneat/hot-toast";
import { PollService } from "@poll-base/core/services/poll.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-menu-action[isOpenMenuAction][poll]",
  templateUrl: "./menu-action.component.html",
  styleUrls: ["./menu-action.component.scss"],
})
export class MenuActionComponent implements OnInit {
  @Input() isOpenMenuAction: boolean = false;

  @Input() poll!: PollResponse;

  @Output() toggleMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() resetPollChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  isOpenShareModel: boolean = false;
  isOpenModalAction: boolean = false;

  titleModal: string = "";
  messageModal: string = "";
  actionModal: string = "";

  isOwner: boolean = false;

  constructor(private storageService: StorageService, private toastService: HotToastService, private pollService: PollService, private router: Router) {}

  ngOnInit(): void {
    // this.isOwner = this.poll.createdBy == this.storageService.getUser()?.uuid;
  }

  toggleMenuAction(): void {
    this.isOpenMenuAction = !this.isOpenMenuAction;
    this.toggleMenu.emit(this.isOpenMenuAction);
  }

  onResetPoll(): void {
    this.isOpenModalAction = true;
    this.isOpenMenuAction = false;

    this.titleModal = "Reset poll";
    this.messageModal = "Are you sure you want to reset this poll? All votes will be removed. This action cannot be undone.";
    this.actionModal = "Reset";
  }

  onDeletePoll(): void {
    this.isOpenModalAction = true;
    this.isOpenMenuAction = false;

    this.titleModal = "Delete poll";
    this.messageModal = "Are you sure you want to delete this poll? All associated data, including votes, will be removed. This action cannot be undone.";
    this.actionModal = "Delete";
  }

  exportVotes() {
    if (this.storageService.getUser()) {
      this.toggleMenu.emit(false);

      // @ts-ignore
      let userUuid: string = this.storageService.getUser()?.uuid == undefined ? "-1" : this.storageService.getUser()?.uuid;

      this.pollService.exportResultVotePoll(this.poll.uuid, userUuid).subscribe({
        next: (data: Blob): void => {
          let a: HTMLAnchorElement = document.createElement("a");
          a.href = window.URL.createObjectURL(data);
          a.download = "straw_poll-" + this.poll.uuid + new Date().getTime() + ".xlsx";
          a.click();
          setTimeout((): void => {
            window.URL.revokeObjectURL(a.href);
            a.remove();
          }, 100);
        },
        error: (err: any) => {
          if (err.status == 400) {
            this.toastService.error("Request failed. It requires at least one participant to export a poll.");
          }

          if (err.status == 404) {
            this.toastService.error("Poll not found");
          }
          if (err.status == 403) {
            this.toastService.error("Sorry! You don't have permission to export result votes this poll!");
          }
        },
      });
    }
  }

  onHandelActionModal($event: boolean): void {
    if ($event) {
      if (this.actionModal.toLowerCase() == "reset") {
        let userUuid: string | undefined = this.storageService.getUser()?.uuid;
        this.pollService.resetPoll(this.poll.uuid, userUuid).subscribe({
          next: (message: ResponseMessage): void => {
            this.toastService.success(message.message);
            this.isOpenMenuAction = false;
            this.toggleMenu.emit(false);
            this.resetPollChange.emit(true);
            this.storageService.clearVotedAnonymous(this.poll.uuid);
          },
          error: (err: HttpErrorResponse): void => {
            this.toastService.error(err.error.detail);
            this.isOpenMenuAction = false;
            this.toggleMenu.emit(false);
            this.resetPollChange.emit(false);
          },
        });
      } else if (this.actionModal.toLowerCase() == "delete") {
        let userUuid: string | undefined = this.storageService.getUser()?.uuid;
        this.pollService.deletePoll(this.poll.uuid, userUuid).subscribe({
          next: (message: ResponseMessage): void => {
            this.toastService.success(message.message);
            this.isOpenMenuAction = false;
            this.toggleMenu.emit(false);
            this.router.navigateByUrl("/");
          },
          error: (err: HttpErrorResponse): void => {
            this.toastService.error(err.error.detail);
            this.isOpenMenuAction = false;
            this.toggleMenu.emit(false);
          },
        });
      }
    }
  }
}
