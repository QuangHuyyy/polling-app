import { Component, OnInit } from "@angular/core";
import { AuthService } from "@poll-base/core/services/auth.service";
import { HotToastService } from "@ngneat/hot-toast";
import { StorageService } from "@poll-base/core/services/storage.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.scss"],
})
export class NavigationComponent implements OnInit {
  constructor(private authService: AuthService, private toastService: HotToastService, private storageService: StorageService, private router: Router) {}

  ngOnInit(): void {}

  logout(): void {
    this.toastService.success("You've been signed out!");
    this.storageService.clean();
    this.router.navigateByUrl("/");

    // this.authService.logout().subscribe({
    //   next: (res: ResponseMessage): void => {
    //     this.toastService.success(res.message);
    //     this.storageService.clean();
    //
    //     this.router.navigateByUrl("/");
    //   },
    //   error: (err) => {
    //     this.toastService.error(err.error.detail);
    //   },
    // });
  }
}
