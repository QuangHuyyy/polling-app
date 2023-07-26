import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "@poll-base/core/services/auth.service";
import { HotToastService } from "@ngneat/hot-toast";
import { comparePassword } from "@poll-base/authentication/pages/register/register.component";
import { StorageService } from "@poll-base/core/services/storage.service";
import { UserResponse } from "@poll-base/data/schema/response/user_response.class";
import { HttpErrorResponse } from "@angular/common/http";
import { ResponseMessage } from "@poll-base/data/schema/response/response-message.class";

@Component({
  selector: "app-setting",
  templateUrl: "./setting.component.html",
  styleUrls: ["./setting.component.scss"],
})
export class SettingComponent implements OnInit {
  fUpdatePasswordUser!: FormGroup;
  avatarControl: FormControl = new FormControl("");

  currentUser!: UserResponse | null;
  userInfo!: UserResponse | null;

  isUpdateName: boolean = false;
  isUpdateEmail: boolean = false;
  isUpdateAvatar: boolean = false;
  // emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  isOpenModalAvatar: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private storageService: StorageService, private toastService: HotToastService) {}

  get pwg(): FormGroup {
    return this.fUpdatePasswordUser.get("pwg") as FormGroup;
  }

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();
    this.userInfo = this.storageService.getUser();
    this.initForm();

    this.avatarControl.valueChanges.subscribe((value) => {
      if (value) {
        const reader: FileReader = new FileReader();
        reader.onload = (_event) => {
          if (this.userInfo) {
            this.userInfo.avatar = _event.target?.result as string;
          }
        };
        reader.readAsDataURL(value);
      }
    });
  }

  onSubmitPasswordForm(): void {
    if (this.fUpdatePasswordUser.valid) {
      let currentPassword: string = this.fUpdatePasswordUser.get("currentPassword")?.value;
      let newPassword: string = this.pwg.get("password")?.value;

      this.authService.changePassword(currentPassword, newPassword).subscribe({
        next: (message: ResponseMessage) => {
          this.toastService.success(message.message);
        },
        error: (err: HttpErrorResponse) => {
          this.toastService.error(err.error.detail);
        },
      });
    }
  }

  onCancel(fieldName: string): void {
    if (this.currentUser && this.userInfo) {
      switch (fieldName) {
        case "name":
          this.isUpdateName = false;
          this.userInfo.name = this.currentUser.name;
          break;
        case "email":
          this.isUpdateEmail = false;
          this.userInfo.email = this.currentUser.email;
          break;
        case "avatar":
          this.isUpdateAvatar = false;
          this.userInfo.avatar = this.currentUser.avatar;
          break;
      }
    }
  }

  onSave(field: string): void {
    if (this.currentUser && this.userInfo) {
      let uuid: string = this.currentUser.uuid;
      let name: string = "";
      // let email: string = "";
      let avatarFile: File | null = null;
      switch (field) {
        case "name":
          this.isUpdateName = false;
          name = this.userInfo.name;
          break;
        // case "email":
        //   this.isUpdateEmail = false;
        //   email = this.userInfo.email;
        //   break;
        case "avatar":
          this.isUpdateAvatar = false;
          // @ts-ignore
          avatarFile = this.avatarControl.value as HTMLInputElement;
          break;
      }

      this.authService.update(uuid, name, /*email, */ avatarFile).subscribe({
        next: (user: UserResponse) => {
          this.toastService.success("Update user successfully.");
          if (this.currentUser) {
            switch (field) {
              case "name":
                this.currentUser.name = name;
                break;
              // case "email":
              //   this.currentUser.email = email;
              //   break;
              case "avatar":
                this.currentUser.avatar = "";
                break;
            }
            this.currentUser = user;
            this.storageService.saveUser(this.currentUser);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.toastService.error(err.error.detail);
        },
      });
    }
  }

  closeMediaModal($event: boolean): void {
    this.isOpenModalAvatar = !$event;
  }

  onRemoveAvatar(): void {
    if (this.currentUser && this.userInfo) {
      let uuid: string = this.currentUser.uuid;
      this.authService.removeAvatar(uuid).subscribe({
        next: (message: ResponseMessage) => {
          this.toastService.success(message.message);
          if (this.currentUser && this.userInfo) {
            this.currentUser.avatar = null;
            this.userInfo.avatar = null;
            this.storageService.saveUser(this.currentUser);
          }
        },
      });
    }
  }

  private initForm(): void {
    this.fUpdatePasswordUser = this.fb.group({
      currentPassword: ["", [Validators.required, Validators.minLength(8)]],
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
