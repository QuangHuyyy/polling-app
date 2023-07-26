import { Component, EventEmitter, forwardRef, Input, OnInit, Output, Provider } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

export const OPEN_MODAL_MEDIA_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MediaModalComponent),
  multi: true,
};

@Component({
  selector: "app-media-modal",
  templateUrl: "./media-modal.component.html",
  styleUrls: ["./media-modal.component.scss"],
  providers: [OPEN_MODAL_MEDIA_ACCESSOR],
})
export class MediaModalComponent implements OnInit, ControlValueAccessor {
  @Input() fileSelected!: File;
  @Output() fileSelectedChange: EventEmitter<File> = new EventEmitter<File>();
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  isOpenModal: boolean = false;
  typeFileError: string = "";

  constructor() {}

  ngOnInit(): void {
    this.isOpenModal = true;
  }

  writeValue(value: any): void {
    this.fileSelected = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onFileSelected($event: Event): void {
    const element: HTMLInputElement = $event.currentTarget as HTMLInputElement;
    // @ts-ignore
    const file: File = element.files.item(0);

    if (file) {
      const mimeType: string = file.type;
      if (mimeType.match(/image\/(jpg|jpeg|png|JPG|JPEG|PNG)$/) == null) {
        element.value = "";
        this.typeFileError = "TypeError: Failed to fetch";
        return;
      }
      this.fileSelectedChange.emit(this.fileSelected);
      this.onChange(file);
      this.onTouched();
      this.closeModal.emit(true);
    }
  }

  private onChange = (v: File): void => {};
  private onTouched = (): void => {};
}
