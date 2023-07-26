import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { comparePassword } from "@poll-base/authentication/pages/register/register.component";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@poll-base/core/services/auth.service";
import { HotToastService } from "@ngneat/hot-toast";
import { ResponseMessage } from "@poll-base/data/schema/response/response-message.class";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-new-password",
  templateUrl: "./new-password.component.html",
  styleUrls: ["./new-password.component.scss"],
})
export class NewPasswordComponent implements OnInit {
  fNewPassword!: FormGroup;
  messageError: string = "";
  private tokenReset: string = "";

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private authService: AuthService, private toastService: HotToastService) {}

  ngOnInit(): void {
    this.fNewPassword = this.fb.group(
      {
        password: ["", [Validators.required, Validators.minLength(8)]],
        confirmPassword: ["", [Validators.required]],
      },
      { validators: comparePassword }
    );
    this.tokenReset = this.route.snapshot.params["token"];
    if (this.tokenReset == "") {
      this.router.navigate(["/not-found"]);
    }
  }

  onSubmitForm(): void {
    if (this.fNewPassword.valid) {
      let password: string = this.fNewPassword.get("password")?.value;
      this.authService.savePasswordReset(password, this.tokenReset).subscribe({
        next: (message: ResponseMessage) => {
          this.toastService.success(message.message);
          this.router.navigate(["/auth/login"]);
          this.messageError = "";
        },
        error: (err: HttpErrorResponse) => {
          this.messageError = err.error.detail;
        },
      });
    }
  }
}
