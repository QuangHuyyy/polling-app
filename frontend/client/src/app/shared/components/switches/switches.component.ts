import { Component, EventEmitter, forwardRef, Input, OnInit, Output, Provider } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

export const CHECK_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SwitchesComponent),
  multi: true,
};

@Component({
  selector: "app-switches",
  templateUrl: "./switches.component.html",
  styleUrls: ["./switches.component.scss"],
  providers: [CHECK_VALUE_ACCESSOR],
})
export class SwitchesComponent implements OnInit, ControlValueAccessor {
  @Input() checked: boolean = false;
  @Output() checkedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() label: string = "";

  constructor() {}

  toggle(): void {
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
    this.onChange(this.checked);
    this.onTouched();
  }

  ngOnInit(): void {}

  writeValue(obj: any): void {
    // ghi giá trị cho element
    this.checked = obj;
  }

  registerOnChange(fn: any): void {
    // đăng ký hàm callback được gọi để thông báo cho angular khi có sự thay đổi của giá trị
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    // đăng ký hàm callback được gọi để thông báo cho angular khi element có sự thao tác
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // để gán giá trị cho thuộc tính [disabled]
  }

  private onChange = (v: boolean): void => {};

  private onTouched = (): void => {};
}
