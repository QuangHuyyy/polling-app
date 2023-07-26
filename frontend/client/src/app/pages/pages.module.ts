import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { provideSvgIcons, SvgIconComponent } from "@ngneat/svg-icon";
import { PollResultComponent } from "@poll-base/pages/poll-result/poll-result.component";
import { RouterLinkWithHref } from "@angular/router";
import { NgApexchartsModule } from "ng-apexcharts";
import { toggleIcon } from "@app/svg/toggle";
import { eyeIcon } from "@app/svg/eye";
import { refreshIcon } from "@app/svg/refresh";
import { arrowLeftIcon } from "@app/svg/arrow-left";
import { usersListIcon } from "@app/svg/users-list";
import { caretLeftIcon } from "@app/svg/caret-left";
import { caretRightIcon } from "@app/svg/caret-right";
import { checkIcon } from "@app/svg/check";
import { avatarCircleIcon } from "@app/svg/avatar-circle";
import { HomeComponent } from "./home/home.component";
import { shieldIcon } from "@app/svg/shield";
import { prohibitIcon } from "@app/svg/prohibit";
import { DataModule } from "@poll-base/data/data.module";
import { SharedModule } from "@poll-base/shared/shared.module";

@NgModule({
  declarations: [PollResultComponent, HomeComponent],
  imports: [CommonModule, SvgIconComponent, RouterLinkWithHref, NgApexchartsModule, SvgIconComponent, DataModule, SharedModule],
  providers: [provideSvgIcons([toggleIcon, eyeIcon, refreshIcon, arrowLeftIcon, usersListIcon, caretLeftIcon, caretRightIcon, checkIcon, avatarCircleIcon, shieldIcon, prohibitIcon])],
})
export class PagesModule {}
