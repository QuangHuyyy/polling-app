import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { PollResponse } from "@poll-base/data/schema/response/poll-response.class";

@Component({
  selector: "app-poll-item[poll]",
  templateUrl: "./poll-item.component.html",
  styleUrls: ["./poll-item.component.scss"],
})
export class PollItemComponent implements OnInit {
  isOpenMenuAction: boolean = false;
  @ViewChild("btnAction") btnAction!: ElementRef;
  @ViewChild("menuAction") menuAction!: ElementRef;
  @Input() poll!: PollResponse;

  constructor() {}

  ngOnInit(): void {}

  handelResetPoll($event: boolean): void {
    if ($event) {
      this.poll.participants = 0;
    }
  }
}
