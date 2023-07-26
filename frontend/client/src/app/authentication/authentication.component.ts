import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-authentication",
  template: `
    <div class="">
      <div class="relative">
        <app-loader></app-loader>
      </div>

      <router-outlet></router-outlet>
    </div>
  `,
  styles: [],
})
export class AuthenticationComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
