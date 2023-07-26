import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PollDetailRoutingModule } from "./poll-detail-routing.module";
import { PollDetailComponent } from "./poll-detail.component";
import { provideSvgIcons, SvgIconComponent } from "@ngneat/svg-icon";
import { descIcon } from "@app/svg/desc";
import { arrowRightIcon } from "@app/svg/arrow-right";
import { resultIcon } from "@app/svg/result";
import { lockOpenIcon } from "@app/svg/lock-open";
import { lockIcon } from "@app/svg/lock";
import { chatsIcon } from "@app/svg/chats";
import { infoIcon } from "@app/svg/info";
import { avatarIcon } from "@app/svg/avatar";
import { DataModule } from "@poll-base/data/data.module";
import { ReactiveFormsModule } from "@angular/forms";
import { xCircleFillIcon } from "@app/svg/x-circle-fill";
import { copyIcon } from "@app/svg/copy";
import { ClipboardModule } from "ngx-clipboard";
import { emailIcon } from "@app/svg/email";
import { xIcon } from "@app/svg/x";
import { warningIcon } from "@app/svg/warning";
import { checkCircleIcon } from "@app/svg/check-circle";
import { SharedModule } from "@poll-base/shared/shared.module";
import { pencilFillIcon } from "@app/svg/pencil-fill";

@NgModule({
  declarations: [PollDetailComponent],
  imports: [CommonModule, PollDetailRoutingModule, SvgIconComponent, DataModule, ReactiveFormsModule, ClipboardModule, SharedModule],
  providers: [
    provideSvgIcons([
      descIcon,
      arrowRightIcon,
      resultIcon,
      lockIcon,
      lockOpenIcon,
      chatsIcon,
      infoIcon,
      avatarIcon,
      xCircleFillIcon,
      copyIcon,
      emailIcon,
      xIcon,
      warningIcon,
      checkCircleIcon,
      pencilFillIcon,
    ]),
  ],
})
export class PollDetailModule {}
