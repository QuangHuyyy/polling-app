import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AuthenticationRoutingModule } from "./authentication-routing.module";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { provideSvgIcons, SvgIconComponent } from "@ngneat/svg-icon";
import { logoIcon } from "@app/svg/logo";
import { ReactiveFormsModule } from "@angular/forms";
import { ForgotPasswordComponent } from "./pages/forgot-password/forgot-password.component";
import { arrowRightIcon } from "@app/svg/arrow-right";
import { xCircleFillIcon } from "@app/svg/x-circle-fill";
import { checkIcon } from "@app/svg/check";
import { NewPasswordComponent } from "./pages/new-password/new-password.component";
import { AuthenticationComponent } from "@poll-base/authentication/authentication.component";
import { SharedModule } from "@poll-base/shared/shared.module";

@NgModule({
  declarations: [LoginComponent, RegisterComponent, ForgotPasswordComponent, NewPasswordComponent, AuthenticationComponent],
  imports: [CommonModule, AuthenticationRoutingModule, SvgIconComponent, ReactiveFormsModule, SharedModule],
  providers: [provideSvgIcons([logoIcon, arrowRightIcon, xCircleFillIcon, checkIcon])],
})
export class AuthenticationModule {}
