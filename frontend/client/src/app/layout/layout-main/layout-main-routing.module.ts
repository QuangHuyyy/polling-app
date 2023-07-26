import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutMainComponent } from "@poll-base/layout/layout-main/layout-main.component";
import { AuthGuard } from "@poll-base/core/guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: LayoutMainComponent,
    children: [
      {
        path: "",
        loadChildren: () => import("@poll-base/pages/dashboard/dashboard.module").then((m) => m.DashboardModule),
        canLoad: [AuthGuard],
      },
      {
        path: "settings",
        loadChildren: () => import("@poll-base/pages/setting/setting.module").then((m) => m.SettingModule),
        canLoad: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutMainRoutingModule {}
