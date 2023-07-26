import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-modal-basic[title][message][action]",
  templateUrl: "./modal-basic.component.html",
  styleUrls: ["./modal-basic.component.scss"],
})
export class ModalBasicComponent implements OnInit {
  @Input() isOpenModal: boolean = false;
  @Input() title: string = "";
  @Input() message: string = "";
  @Input() action: string = "";
  @Output() openModalChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() doAction: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  onClose(): void {
    this.isOpenModal = false;
    this.openModalChange.emit(false);
  }
}
