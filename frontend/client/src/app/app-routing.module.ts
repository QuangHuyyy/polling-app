import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "account",
    loadChildren: () => import("@poll-base/layout/layout-main/layout-main.module").then((m) => m.LayoutMainModule),
  },
  {
    path: "auth",
    loadChildren: () => import("@poll-base/authentication/authentication.module").then((m) => m.AuthenticationModule),
  },
  {
    path: "",
    loadChildren: () => import("@poll-base/layout/layout-no-nav/layout-no-nav.module").then((m) => m.LayoutNoNavModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: "enabled" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
