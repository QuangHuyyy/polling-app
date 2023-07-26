import { Injectable } from "@angular/core";
import { CanLoad, Route, Router, UrlSegment, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { StorageService } from "@poll-base/core/services/storage.service";
import { HotToastService } from "@ngneat/hot-toast";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanLoad {
  constructor(private storageService: StorageService, private router: Router, private toastService: HotToastService) {}

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.storageService.isLoggedIn()) {
      return true;
    }
    this.toastService.warning("Please login before create new poll!");
    setTimeout(() => this.router.navigateByUrl("/auth/login"), 2000);
    return false;
  }
}
