import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "@poll-base/shared/components/header/header.component";
import { provideSvgIcons, SvgIconComponent } from "@ngneat/svg-icon";
import { logoIcon } from "@app/svg/logo";
import { searchIcon } from "@app/svg/search";
import { homeIcon } from "@app/svg/home";
import { settingIcon } from "@app/svg/setting";
import { signOutIcon } from "@app/svg/sign-out";
import { FooterComponent } from "./components/footer/footer.component";
import { facebookIcon } from "@app/svg/facebook";
import { twitterIcon } from "@app/svg/twitter";
import { githubIcon } from "@app/svg/github";
import { instagramIcon } from "@app/svg/instagram";
import { globeIcon } from "@app/svg/globe";
import { caretUpIcon } from "@app/svg/caret-up";
import { caretDownIcon } from "@app/svg/caret-down";
import { copyrightIcon } from "@app/svg/copyright";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { themeIcon } from "@app/svg/theme";
import { createIcon } from "@app/svg/create";
import { scheduleIcon } from "@app/svg/schedule";
import { RouterLinkActive, RouterLinkWithHref } from "@angular/router";
import { PollItemComponent } from "./components/poll-item/poll-item.component";
import { chartPieIcon } from "@app/svg/chart-pie";
import { imageFillIcon } from "@app/svg/image-fill";
import { dotIcon } from "@app/svg/dot";
import { menuIcon } from "@app/svg/menu";
import { pencilFillIcon } from "@app/svg/pencil-fill";
import { copyFillIcon } from "@app/svg/copy-fill";
import { settingFillIcon } from "@app/svg/setting-fill";
import { userAddIcon } from "@app/svg/user-add";
import { shareIcon } from "@app/svg/share";
import { analyticsIcon } from "@app/svg/analytics";
import { exportIcon } from "@app/svg/export";
import { resetIcon } from "@app/svg/reset";
import { deleteIcon } from "@app/svg/delete";
import { SwitchesComponent } from "./components/switches/switches.component";
import { CustomSelectComponent } from "./components/custom-select/custom-select.component";
import { MyCalendarComponent } from "./components/my-calendar/my-calendar.component";
import { MediaModalComponent } from "./components/media-modal/media-modal.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { CommentComponent } from "./components/comment/comment.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommentItemComponent } from "./components/comment-item/comment-item.component";
import { DataModule } from "@poll-base/data/data.module";
import { PaginationComponent } from "./components/pagination/pagination.component";
import { MenuActionComponent } from "./components/menu-action/menu-action.component";
import { ShareModalComponent } from "./components/share-modal/share-modal.component";
import { ModalBasicComponent } from "./components/modal-basic/modal-basic.component";
import { warningNoFillIcon } from "@app/svg/warning-no-fill";
import { xIcon } from "@app/svg/x";
import { TabComponent } from "./components/my-tab-view/tab/tab.component";
import { TabsComponent } from "./components/my-tab-view/tabs/tabs.component";
import { folderPlusIcon } from "@app/svg/folder-plus";
import { LoaderComponent } from "./components/loader/loader.component";

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    NavigationComponent,
    PollItemComponent,
    SwitchesComponent,
    CustomSelectComponent,
    MyCalendarComponent,
    MediaModalComponent,
    NotFoundComponent,
    CommentComponent,
    CommentItemComponent,
    PaginationComponent,
    MenuActionComponent,
    ShareModalComponent,
    ModalBasicComponent,
    TabComponent,
    TabsComponent,
    LoaderComponent,
  ],
  imports: [CommonModule, SvgIconComponent, RouterLinkWithHref, RouterLinkActive, ReactiveFormsModule, FormsModule, DataModule],
  exports: [
    HeaderComponent,
    FooterComponent,
    NavigationComponent,
    PollItemComponent,
    SwitchesComponent,
    CustomSelectComponent,
    MyCalendarComponent,
    MediaModalComponent,
    CommentComponent,
    PaginationComponent,
    MenuActionComponent,
    ShareModalComponent,
    TabsComponent,
    TabComponent,
    LoaderComponent,
  ],
  providers: [
    provideSvgIcons([
      logoIcon,
      searchIcon,
      homeIcon,
      settingIcon,
      signOutIcon,
      facebookIcon,
      twitterIcon,
      githubIcon,
      instagramIcon,
      globeIcon,
      caretUpIcon,
      caretDownIcon,
      copyrightIcon,
      themeIcon,
      createIcon,
      scheduleIcon,
      chartPieIcon,
      imageFillIcon,
      scheduleIcon,
      dotIcon,
      menuIcon,
      pencilFillIcon,
      copyFillIcon,
      settingFillIcon,
      userAddIcon,
      shareIcon,
      analyticsIcon,
      exportIcon,
      resetIcon,
      deleteIcon,
      warningNoFillIcon,
      xIcon,
      folderPlusIcon,
    ]),
  ],
})
export class SharedModule {}
