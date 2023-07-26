import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LayoutNoNavRoutingModule } from "./layout-no-nav-routing.module";
import { LayoutNoNavComponent } from "./layout-no-nav.component";
import { SharedModule } from "@poll-base/shared/shared.module";
import { PagesModule } from "@poll-base/pages/pages.module";

@NgModule({
  declarations: [LayoutNoNavComponent],
  imports: [CommonModule, LayoutNoNavRoutingModule, SharedModule, PagesModule],
})
export class LayoutNoNavModule {}
