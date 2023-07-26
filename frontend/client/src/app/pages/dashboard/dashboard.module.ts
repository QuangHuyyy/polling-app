import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import { provideSvgIcons, SvgIconComponent } from "@ngneat/svg-icon";
import { caretUpIcon } from "@app/svg/caret-up";
import { caretDownIcon } from "@app/svg/caret-down";
import { imageFillIcon } from "@app/svg/image-fill";
import { scheduleFillIcon } from "@app/svg/schedule-fill";
import { chartPieIcon } from "@app/svg/chart-pie";
import { menuIcon } from "@app/svg/menu";
import { dotIcon } from "@app/svg/dot";
import { usersIcon } from "@app/svg/users";
import { commentsIcon } from "@app/svg/comments";
import { eyeIcon } from "@app/svg/eye";
import { pencilFillIcon } from "@app/svg/pencil-fill";
import { settingFillIcon } from "@app/svg/setting-fill";
import { userAddIcon } from "@app/svg/user-add";
import { shareIcon } from "@app/svg/share";
import { exportIcon } from "@app/svg/export";
import { resetIcon } from "@app/svg/reset";
import { deleteIcon } from "@app/svg/delete";
import { analyticsIcon } from "@app/svg/analytics";
import { copyFillIcon } from "@app/svg/copy-fill";
import { SharedModule } from "@poll-base/shared/shared.module";
import { plusIcon } from "@app/svg/plus";
import { fillterIcon } from "@app/svg/fillter";
import { ReactiveFormsModule } from "@angular/forms";
import { caretRightIcon } from "@app/svg/caret-right";
import { caretLeftIcon } from "@app/svg/caret-left";

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, DashboardRoutingModule, SvgIconComponent, SharedModule, ReactiveFormsModule],
  providers: [
    provideSvgIcons([
      caretUpIcon,
      caretDownIcon,
      imageFillIcon,
      scheduleFillIcon,
      chartPieIcon,
      menuIcon,
      dotIcon,
      usersIcon,
      commentsIcon,
      eyeIcon,
      pencilFillIcon,
      copyFillIcon,
      settingFillIcon,
      userAddIcon,
      shareIcon,
      exportIcon,
      resetIcon,
      deleteIcon,
      analyticsIcon,
      plusIcon,
      fillterIcon,
      caretLeftIcon,
      caretRightIcon,
    ]),
  ],
})
export class DashboardModule {}
