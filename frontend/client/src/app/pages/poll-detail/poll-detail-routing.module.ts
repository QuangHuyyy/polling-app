import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PollDetailComponent} from "@poll-base/pages/poll-detail/poll-detail.component";

const routes: Routes = [
  {
    path: "",
    component: PollDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PollDetailRoutingModule {
}
