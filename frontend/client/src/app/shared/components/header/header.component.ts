import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from "@angular/core";
import { StorageService } from "@poll-base/core/services/storage.service";
import { UserResponse } from "@poll-base/data/schema/response/user_response.class";
import { AuthService } from "@poll-base/core/services/auth.service";
import { HotToastService } from "@ngneat/hot-toast";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  isLoggedIn: boolean = false;
  isMenuOpen: boolean = false;

  currentUser$: Observable<UserResponse | null> = this.storageService.user$;

  @ViewChild("toggleAccountBtn") toggleAccountBtn!: ElementRef;
  @ViewChild("menuAccount") menuAccount!: ElementRef;

  constructor(private renderer: Renderer2, private storageService: StorageService, private authService: AuthService, private toastService: HotToastService, private router: Router) {
    this.renderer.listen("window", "click", (e: Event) => {
      if (this.isLoggedIn && this.toggleAccountBtn && this.menuAccount) {
        if (e.target !== this.toggleAccountBtn.nativeElement && e.target !== this.menuAccount.nativeElement) {
          this.isMenuOpen = false;
        }
      }
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    this.getDataUser();
  }

  ngAfterViewInit(): void {
    this.getDataUser();
  }

  toggleMenuAccount() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.toastService.success("You've been signed out!");
    this.storageService.clean();
    this.isLoggedIn = false;
    this.router.navigateByUrl("/");

    // this.authService.logout().subscribe({
    //   next: (res: ResponseMessage): void => {
    //     this.toastService.success(res.message);
    //     this.storageService.clean();
    //
    //     this.isLoggedIn = false;
    //     this.router.navigateByUrl("/");
    //   },
    //   error: (err) => {
    //     this.toastService.error(err.error.detail);
    //   },
    // });
  }

  onSearch(value: string): void {
    this.router.navigate(["/search"], { queryParams: { q: value } });
  }

  private getDataUser(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
  }
}
