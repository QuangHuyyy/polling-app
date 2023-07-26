import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PagedResponse } from "@poll-base/data/schema/response/paged-response.class";

@Component({
  selector: "app-pagination[pageable]",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.scss"],
})
export class PaginationComponent implements OnInit {
  @Input() pageable!: PagedResponse<any>;
  @Input() page: number = 0;
  @Input() size: number = 10;
  @Input() sort: string[] = ["createdAt", "desc"];
  @Output() pageNumberChange: EventEmitter<number> = new EventEmitter<number>();

  pageNumbers: number[] = [];

  constructor() {}

  ngOnInit(): void {
    for (let i: number = 1; i <= this.pageable.totalPages; i++) {
      this.pageNumbers.push(i);
    }
  }
}
