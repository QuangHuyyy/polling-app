import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { PollService } from "@poll-base/core/services/poll.service";
import { PagedResponse } from "@poll-base/data/schema/response/paged-response.class";
import { StorageService } from "@poll-base/core/services/storage.service";
import { PollResponse } from "@poll-base/data/schema/response/poll-response.class";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  filterControl: FormControl = new FormControl("created");
  filterValue: string = "created";
  page: number = 0;
  size: number = 5;
  sort: string[] = ["created_at", "desc"];

  pagePolls!: PagedResponse<PollResponse>;
  polls: PollResponse[] = [];

  constructor(private pollService: PollService, private storageService: StorageService) {}

  ngOnInit(): void {
    this.filterControl.valueChanges.subscribe((value) => {
      this.filterValue = value;
      this.page = 0;
      this.size = 5;
      this.getAllPoll();
    });

    this.getAllPoll();
  }

  handlePageChange($event: number): void {
    this.page = $event;
    this.getAllPoll();
  }

  private getAllPoll(): void {
    let userUuid: string | undefined = this.storageService.getUser()?.uuid;

    if (userUuid) {
      this.pollService.getAllPoll(userUuid, this.filterValue, this.page, this.size, this.sort).subscribe({
        next: (page: PagedResponse<PollResponse>): void => {
          this.pagePolls = page;
          this.polls = page.content;
        },
      });
    }
  }
}
