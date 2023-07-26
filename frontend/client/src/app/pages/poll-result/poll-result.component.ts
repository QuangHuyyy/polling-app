import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ApexChart, ApexDataLabels, ApexLegend, ApexNonAxisChartSeries, ApexTooltip } from "ng-apexcharts";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { PollService } from "@poll-base/core/services/poll.service";
import { VoteResultResponse } from "@poll-base/data/schema/response/vote-result-response.class";
import { HttpErrorResponse } from "@angular/common/http";
import { StorageService } from "@poll-base/core/services/storage.service";
import { UserResponse } from "@poll-base/data/schema/response/user_response.class";
import { PollResponse } from "@poll-base/data/schema/response/poll-response.class";
import { HotToastService } from "@ngneat/hot-toast";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: any;
  legend: ApexLegend;
  colors: any[];
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
};

@Component({
  selector: "app-poll-result",
  templateUrl: "./poll-result.component.html",
  styleUrls: ["./poll-result.component.scss"],
})
export class PollResultComponent implements OnInit {
  isOpenMenu: boolean = false;
  @ViewChild("btnAction") btnAction!: ElementRef;
  @ViewChild("menuAction") menuAction!: ElementRef;

  @ViewChild("tableHeader") tableHeader!: ElementRef;
  @ViewChild("tableContent") tableContent!: ElementRef;
  @ViewChild("widgetsContent") widgetsContent!: ElementRef;
  isScrollSmooth: boolean = true;

  currentUser!: UserResponse | null;
  isOwner: boolean = false;
  voteResult!: VoteResultResponse;
  isClosedVote: boolean = false;
  isRefreshResult: boolean = false;
  isShowResult: boolean = false;

  pollChartOptions!: ChartOptions;
  pollChartColors: string[] = ["#3EB991", "#FF7563", "#AA66CC", "#FFBB33", "#FF8800", "#33B5E5"];
  poll!: PollResponse;

  constructor(private pollService: PollService, private route: ActivatedRoute, private router: Router, private storageService: StorageService, private toastService: HotToastService) {}

  ngOnInit(): void {
    this.getPollResult();

    let uuid: string = this.route.snapshot.params["uuid"];
    this.pollService.getPollByUuid(uuid).subscribe({
      next: (poll: PollResponse): void => {
        this.poll = poll;
      },
    });
  }

  getColor(index: number): string {
    const lengthOfChartColors: number = this.pollChartColors.length;
    return this.pollChartColors[index % lengthOfChartColors];
  }

  scrollTable(isLeftBtn: boolean): void {
    this.isScrollSmooth = true;
    let valueScroll: number = isLeftBtn ? -50 : 50;
    this.tableHeader.nativeElement.scrollLeft += valueScroll;
    this.tableContent.nativeElement.scrollLeft += valueScroll;
  }

  onScrollTable($event: Event): void {
    this.isScrollSmooth = false;
    this.tableHeader.nativeElement.scrollLeft = ($event.target as HTMLElement).scrollLeft;
  }

  onRefreshResult(): void {
    this.isRefreshResult = true;
    this.getPollResult();
  }

  handelResetPoll($event: boolean): void {
    if ($event) {
      this.getPollResult();
    }
  }

  private showResult(resultsVisibility: string, deadline: string | null, pollUuid: string): void {
    if (this.isOwner) {
      this.isShowResult = true;
      return;
    }

    switch (resultsVisibility) {
      case "always":
        this.isShowResult = true;
        break;
      case "after_deadline":
        if (deadline == null) {
          this.isShowResult = false;
        } else {
          this.isShowResult = new Date().getTime() - new Date("2023-06-28T16:49:52").getTime() > 0;
        }
        break;
      case "after_vote":
        if (this.currentUser != null) {
          this.pollService.isAllowShowResult(pollUuid, this.currentUser.uuid).subscribe({
            next: (isShow: boolean) => (this.isShowResult = isShow),
            error: (err: HttpErrorResponse) => {
              this.isShowResult = false;
              this.toastService.error(err.error.detail);
            },
          });
        } else {
          // not login
          this.isShowResult = this.storageService.getSessionVotedPoll(pollUuid);
        }
        break;
      case "hidden":
        this.isShowResult = false;
        break;
    }
  }

  private getPollResult() {
    this.route.params.subscribe((data: Params): void => {
      let uuid: string = data["uuid"];
      this.pollService.getResultVote(uuid).subscribe({
        next: (voteResult: VoteResultResponse): void => {
          if (this.storageService.isLoggedIn()) {
            this.currentUser = this.storageService.getUser();

            if (this.currentUser?.uuid === voteResult.pollUserUuid) {
              this.isOwner = true;
            }
          }

          this.voteResult = voteResult;
          this.showResult(voteResult.resultsVisibility, voteResult.deadline, uuid);

          if (this.isShowResult) {
            let labels: string[] = [];
            let voteCounts: number[] = [];
            for (const choice of voteResult.choices) {
              if (choice.choice.value == null && choice.choice.other) {
                labels.push("Other");
              } else {
                labels.push(choice.choice.value);
              }
              voteCounts.push(choice.voteCount);
            }

            if (voteResult.votingType == "multiple_choice") {
              this.configChart();
              this.pollChartOptions.labels = labels;
              this.pollChartOptions.series = voteCounts;
            }
            this.isClosedVote = voteResult.deadline == null ? false : new Date(voteResult.deadline) < new Date();

            setTimeout(() => (this.isRefreshResult = false), 1000);
          }
        },
        error: (err: HttpErrorResponse) => {
          if (err.status == 404) {
            this.router.navigate(["/not-found"], { state: { message: err.error.detail } });
          }
          this.isRefreshResult = false;
        },
      });
    });
  }

  private configChart(): void {
    this.pollChartOptions = {
      series: [],
      chart: {
        width: "100%",
        height: "300px",
        type: "pie",
      },
      labels: [],
      legend: {
        show: false,
      },
      colors: this.pollChartColors,
      dataLabels: {
        enabled: true,
        textAnchor: "middle",
        formatter: function (value: string | number | number[], opts): string {
          const seriesIndex: number = opts.seriesIndex;
          return opts.w.config.labels[seriesIndex];
        },
        distributed: false,
        offsetX: 0,
        offsetY: 0,
        style: {
          fontSize: "12px",
          fontFamily: "Poppins, Arial, sans-serif",
          fontWeight: 500,
          colors: undefined,
        },
        background: {
          enabled: true,
          foreColor: "#fff",
          padding: 4,
          borderRadius: 2,
          borderWidth: 1,
          borderColor: "#fff",
          opacity: 0.9,
          dropShadow: {
            enabled: false,
          },
        },
        dropShadow: {
          enabled: false,
        },
      },
      tooltip: {
        enabled: true,
        shared: false,
        intersect: true,
        fillSeriesColor: false,
        custom: function (options): string {
          const seriesIndex: number = options.seriesIndex;
          const seriesLabel: string = options.w.config.labels[seriesIndex];
          const seriesColor: string = options.w.config.colors[seriesIndex];
          const seriesItem: number = options.series[seriesIndex];
          let total: number = 0;
          options.series.forEach((s: number) => (total += s));
          const percentPipe: string = ((seriesItem * 100) / total).toFixed(2);

          return `<div class="p-2 flex items-center gap-x-2">
                <span class="w-3 h-3 rounded-full text-xs" style="background-color: ${seriesColor}"></span>
                <p class="text-white text-xs">${seriesLabel}: <span class="font-semibold">${seriesItem}</span> (${percentPipe}%)</p>
            </div>`;
        },
        onDatasetHover: {
          highlightDataSeries: false,
        },
        marker: {
          show: true,
        },
      },
    };
  }
}
