import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "@poll-base/core/services/auth.service";
import { StorageService } from "@poll-base/core/services/storage.service";
import { LoginData } from "@poll-base/data/schema/request/login.class";
import { HttpErrorResponse } from "@angular/common/http";
import { HotToastService } from "@ngneat/hot-toast";
import { Router } from "@angular/router";
import { JwtResponse } from "@poll-base/data/schema/response/jwt-response.class";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  fLogin!: FormGroup;
  isLoggedIn: boolean = false;
  isLoginFail: boolean = false;
  errorMessage: string = "";

  constructor(private fb: FormBuilder, private authService: AuthService, private storageService: StorageService, private toastService: HotToastService, private router: Router) {}

  ngOnInit(): void {
    this.storageService.clean();
    this.initLoginForm();
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    }
  }

  onSubmitForm(): void {
    if (this.fLogin.valid) {
      this.isLoginFail = false;
      this.errorMessage = "";
      let loginRequest: LoginData = new LoginData(this.fLogin.get("email")?.value, this.fLogin.get("password")?.value, this.fLogin.get("rememberMe")?.value);

      this.authService.login(loginRequest).subscribe({
        next: (data: JwtResponse): void => {
          this.storageService.saveToken(data.token);
          this.storageService.saveUser(data.userInfoResponse);

          this.isLoginFail = false;
          this.isLoggedIn = true;
          this.toastService.success("Login user successfully.");
          setTimeout(() => this.router.navigateByUrl("/account"), 1500);
        },
        error: (err: HttpErrorResponse): void => {
          this.errorMessage = "Invalid email address/password.";
          this.isLoginFail = true;
        },
      });
    }
  }

  private initLoginForm(): void {
    this.fLogin = this.fb.group({
      email: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(8)]],
      rememberMe: [false],
    });
  }
}
