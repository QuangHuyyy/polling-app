import { Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, Provider, Renderer2, ViewChild } from "@angular/core";
import { VotingType } from "@poll-base/pages/create-poll/create-poll.component";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { PollService } from "@poll-base/core/services/poll.service";
import { PollResponse } from "@poll-base/data/schema/response/poll-response.class";
import { HttpErrorResponse } from "@angular/common/http";

export const SELECT_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CustomSelectComponent),
  multi: true,
};

@Component({
  selector: "app-custom-select",
  templateUrl: "./custom-select.component.html",
  styleUrls: ["./custom-select.component.scss"],
  providers: [SELECT_VALUE_ACCESSOR],
})
export class CustomSelectComponent implements OnInit, ControlValueAccessor {
  @Input() options: VotingType[] = [];
  @Input() select!: VotingType;
  currentOption!: VotingType;
  currentValue: string = "";
  @Output() currentValueChange: EventEmitter<string> = new EventEmitter<string>();

  isOpenMenu: boolean = false;

  @ViewChild("btnToggle") btnToggle!: ElementRef;
  @ViewChild("menuToggle") menuToggle!: ElementRef;

  constructor(private renderer: Renderer2, private route: ActivatedRoute, private pollService: PollService, private router: Router) {
    this.renderer.listen("window", "click", (e: Event) => {
      if (e.target !== this.btnToggle.nativeElement && e.target !== this.menuToggle.nativeElement) {
        this.isOpenMenu = false;
      }
    });
  }

  writeValue(obj: any): void {
    this.select = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit(): void {
    let pollUuid: string = this.route.snapshot.params["uuid"];
    if (pollUuid != undefined) {
      this.pollService.getPollByUuid(pollUuid).subscribe({
        next: (poll: PollResponse): void => {
          let votingTypeValue: string = poll.votingTypeValue;

          this.select = this.options.find((v: VotingType): boolean => v.value === votingTypeValue) || this.options[0];
          this.currentValue = this.select.value;
          this.currentOption = this.select;
        },
        error: (err: HttpErrorResponse): void => {
          if (err.status == 404) {
            this.router.navigate(["/not-found"], { state: { message: err.error.detail } });
          }
        },
      });
    } else {
      this.select = this.options[0];
      this.currentValue = this.select.value;
      this.currentOption = this.select;
    }
  }

  setCurrent(value: string): void {
    this.currentValue = value;
    this.onChange(value);
    this.onTouched();
    this.currentValueChange.emit(value);
    // @ts-ignore
    this.currentOption = this.options.find((o) => o.value == value);
  }

  toggleMenu(): void {
    this.isOpenMenu = !this.isOpenMenu;
  }

  private onChange = (v: string): void => {};
  private onTouched = (): void => {};
}
