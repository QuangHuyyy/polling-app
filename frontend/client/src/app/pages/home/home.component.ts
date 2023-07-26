import { Component, OnInit } from "@angular/core";
import { StorageService } from "@poll-base/core/services/storage.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  constructor(private storageService: StorageService, private router: Router) {}

  ngOnInit(): void {
    if (this.storageService.getUser()) {
      this.router.navigateByUrl("/account");
    }
  }
}
