import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CreatePollRoutingModule } from "./create-poll-routing.module";
import { CreatePollComponent } from "@poll-base/pages/create-poll/create-poll.component";
import { provideSvgIcons, SvgIconComponent } from "@ngneat/svg-icon";
import { imageIcon } from "@app/svg/image";
import { plusIcon } from "@app/svg/plus";
import { caretUpIcon } from "@app/svg/caret-up";
import { caretDownIcon } from "@app/svg/caret-down";
import { checkCircleIcon } from "@app/svg/check-circle";
import { imageFillIcon } from "@app/svg/image-fill";
import { scheduleFillIcon } from "@app/svg/schedule-fill";
import { checkIcon } from "@app/svg/check";
import { folderPlusIcon } from "@app/svg/folder-plus";
import { xIcon } from "@app/svg/x";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { arrowBendDownRightIcon } from "@app/svg/arrow-bend-down-right";
import { SharedModule } from "@poll-base/shared/shared.module";
import { xCircleFillIcon } from "@app/svg/x-circle-fill";

@NgModule({
  declarations: [CreatePollComponent],
  imports: [CommonModule, CreatePollRoutingModule, SvgIconComponent, FormsModule, SharedModule, ReactiveFormsModule],
  providers: [
    provideSvgIcons([
      imageIcon,
      plusIcon,
      caretUpIcon,
      caretDownIcon,
      checkCircleIcon,
      imageFillIcon,
      scheduleFillIcon,
      checkIcon,
      folderPlusIcon,
      xIcon,
      plusIcon,
      arrowBendDownRightIcon,
      xCircleFillIcon,
    ]),
  ],
})
export class CreatePollModule {}
