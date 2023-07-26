import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "@poll-base/core/services/auth.service";
import { RegisterData } from "@poll-base/data/schema/request/register.class";
import { ResponseMessage } from "@poll-base/data/schema/response/response-message.class";
import { HttpErrorResponse } from "@angular/common/http";
import { HotToastService } from "@ngneat/hot-toast";
import { Router } from "@angular/router";
import { StorageService } from "@poll-base/core/services/storage.service";

export function comparePassword(c: AbstractControl): null | { passwordnotmatch: boolean } {
  const v = c.value;
  return v.password === v.confirmPassword ? null : { passwordnotmatch: true };
}

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  fRegister!: FormGroup;
  isSuccessful: boolean = false;
  isRegisterFail: boolean = false;
  errorMessage: string = "";

  constructor(private fb: FormBuilder, private authService: AuthService, private toastService: HotToastService, private router: Router, private storageService: StorageService) {}

  get pwg(): FormGroup {
    return this.fRegister.get("pwg") as FormGroup;
  }

  ngOnInit(): void {
    this.storageService.clean();
    this.initForm();
  }

  onSubmitForm(): void {
    if (this.fRegister.valid) {
      let register: RegisterData = new RegisterData(this.fRegister.get("name")?.value, this.fRegister.get("email")?.value, this.pwg.get("password")?.value);

      this.authService.register(register.name, register.email, register.password).subscribe({
        next: (data: ResponseMessage): void => {
          this.isRegisterFail = false;
          this.isSuccessful = true;
          this.toastService.success(data.message);
          setTimeout(() => this.router.navigateByUrl("/auth/login"), 1500);
        },
        error: (err: HttpErrorResponse): void => {
          let messageResponse: ResponseMessage = err.error;
          this.isRegisterFail = true;
          this.errorMessage = messageResponse.message;
        },
      });
    }
  }

  private initForm(): void {
    this.fRegister = this.fb.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      pwg: this.fb.group(
        {
          password: ["", [Validators.required, Validators.minLength(8)]],
          confirmPassword: ["", [Validators.required]],
        },
        { validators: comparePassword }
      ),
    });
  }
}
