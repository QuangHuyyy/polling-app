import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-tab[title]",
  templateUrl: "./tab.component.html",
  styleUrls: ["./tab.component.scss"],
})
export class TabComponent implements OnInit {
  @Input() title: string = "";

  @Input() active: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
