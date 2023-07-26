import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SettingRoutingModule } from "./setting-routing.module";
import { SettingComponent } from "@poll-base/pages/setting/setting.component";
import { SharedModule } from "@poll-base/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [SettingComponent],
  imports: [CommonModule, SettingRoutingModule, SharedModule, FormsModule, ReactiveFormsModule],
})
export class SettingModule {}
