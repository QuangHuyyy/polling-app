import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { provideSvgIcons, SvgIconComponent } from "@ngneat/svg-icon";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { HotToastModule } from "@ngneat/hot-toast";
import { ClipboardModule } from "ngx-clipboard";
import { authInterceptorProviders } from "@poll-base/core/interceptors/auth.interceptor";
import { LoaderInterceptorService } from "@poll-base/core/interceptors/loader-interceptor.service";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SvgIconComponent,
    HttpClientModule,
    HotToastModule.forRoot({
      position: "top-right",
    }),
    ClipboardModule,
  ],
  providers: [
    provideSvgIcons([]),
    /*httpInterceptorProviders, */ authInterceptorProviders,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
