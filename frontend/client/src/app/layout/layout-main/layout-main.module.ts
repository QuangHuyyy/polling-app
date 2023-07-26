import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutMainRoutingModule } from './layout-main-routing.module';
import { LayoutMainComponent } from './layout-main.component';
import { SharedModule } from '@poll-base/shared/shared.module';
import { SvgIconComponent } from '@ngneat/svg-icon';

@NgModule({
  declarations: [LayoutMainComponent],
  imports: [
    CommonModule,
    LayoutMainRoutingModule,
    SharedModule,
    SvgIconComponent,
  ],
})
export class LayoutMainModule {}
