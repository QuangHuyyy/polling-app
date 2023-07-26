import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutNoNavComponent } from "@poll-base/layout/layout-no-nav/layout-no-nav.component";
import { PollResultComponent } from "@poll-base/pages/poll-result/poll-result.component";
import { HomeComponent } from "@poll-base/pages/home/home.component";
import { NotFoundComponent } from "@poll-base/shared/components/not-found/not-found.component";
import { AuthGuard } from "@poll-base/core/guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: LayoutNoNavComponent,
    children: [
      {
        path: "",
        component: HomeComponent,
      },
      {
        path: "create",
        loadChildren: () => import("@poll-base/pages/create-poll/create-poll.module").then((m) => m.CreatePollModule),
        canLoad: [AuthGuard],
      },
      {
        path: "duplicate/:uuid",
        loadChildren: () => import("@poll-base/pages/create-poll/create-poll.module").then((m) => m.CreatePollModule),
        canLoad: [AuthGuard],
      },
      {
        path: "polls/:uuid",
        loadChildren: () => import("@poll-base/pages/poll-detail/poll-detail.module").then((m) => m.PollDetailModule),
      },
      {
        path: "polls/:uuid/edit",
        loadChildren: () => import("@poll-base/pages/create-poll/create-poll.module").then((m) => m.CreatePollModule),
        canLoad: [AuthGuard],
      },
      {
        path: "polls/:uuid/result",
        component: PollResultComponent,
      },
      {
        path: "search",
        loadChildren: () => import("@poll-base/pages/search/search.module").then((m) => m.SearchModule),
      },
      {
        path: "not-found",
        component: NotFoundComponent,
      },
      {
        path: "**",
        redirectTo: "/not-found",
        pathMatch: "full",
      },
    ],
  },
  // {
  //   path: "**",
  //   redirectTo: "/not-found",
  //   pathMatch: "full",
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutNoNavRoutingModule {}
