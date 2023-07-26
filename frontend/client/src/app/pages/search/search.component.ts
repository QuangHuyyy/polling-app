import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { PollService } from "@poll-base/core/services/poll.service";
import { StorageService } from "@poll-base/core/services/storage.service";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit {
  query: string = "";
  pollsResultSearch: { uuid: string; title: string }[] = [];

  constructor(private route: ActivatedRoute, private pollService: PollService, private storageService: StorageService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params): void => {
      this.query = params["q"];
      if (this.query != "") {
        let userUuid: string | undefined = this.storageService.getUser()?.uuid;
        if (userUuid) {
          this.pollService.searchPoll(this.query, userUuid).subscribe({
            next: (data: any[]) => {
              data.forEach((result) => this.pollsResultSearch.push({ uuid: result[0], title: result[1] }));
            },
          });
        }
      }
    });
  }
}
