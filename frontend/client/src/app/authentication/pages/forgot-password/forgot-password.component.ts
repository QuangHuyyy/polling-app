import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "@poll-base/core/services/auth.service";
import { HotToastService } from "@ngneat/hot-toast";
import { ResponseMessage } from "@poll-base/data/schema/response/response-message.class";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {
  fForgotPassword!: FormGroup;
  isSendEmailSuccessfully: boolean = false;
  messageError: string = "";

  constructor(private fb: FormBuilder, private authService: AuthService, private toastService: HotToastService) {}

  ngOnInit(): void {
    this.fForgotPassword = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  onSubmitForm(): void {
    if (this.fForgotPassword.valid) {
      let email: string = this.fForgotPassword.get("email")?.value;
      this.authService.sendEmailResetPassword(email).subscribe({
        next: (message: ResponseMessage) => {
          this.isSendEmailSuccessfully = true;
          this.messageError = "";
          this.toastService.success(message.message);
        },
        error: (err: HttpErrorResponse) => {
          this.isSendEmailSuccessfully = false;
          if (err.status == 404) {
            this.messageError = "Invalid email address!";
          } else {
            this.messageError = err.error.detail;
          }
        },
      });
    }
  }
}
