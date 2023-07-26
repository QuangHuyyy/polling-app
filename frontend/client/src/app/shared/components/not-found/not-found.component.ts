import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";

@Component({
  selector: "app-not-found",
  templateUrl: "./not-found.component.html",
  styleUrls: ["./not-found.component.scss"],
})
export class NotFoundComponent implements OnInit {
  messageError: string = "";

  constructor(private location: Location) {}

  ngOnInit(): void {
    // @ts-ignore
    this.messageError = this.location.getState().message;
  }
}
