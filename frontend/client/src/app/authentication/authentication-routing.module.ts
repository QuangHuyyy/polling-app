import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "@poll-base/authentication/pages/login/login.component";
import { RegisterComponent } from "@poll-base/authentication/pages/register/register.component";
import { ForgotPasswordComponent } from "@poll-base/authentication/pages/forgot-password/forgot-password.component";
import { NewPasswordComponent } from "@poll-base/authentication/pages/new-password/new-password.component";
import { AuthenticationComponent } from "@poll-base/authentication/authentication.component";

const routes: Routes = [
  {
    path: "",
    component: AuthenticationComponent,
    children: [
      { path: "login", component: LoginComponent },
      { path: "register", component: RegisterComponent },
      { path: "forgot-password", component: ForgotPasswordComponent },
      { path: "new-password/:token", component: NewPasswordComponent },
      { path: "", redirectTo: "login", pathMatch: "full" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
