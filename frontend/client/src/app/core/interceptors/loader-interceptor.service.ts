import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpRequest, HttpResponse } from "@angular/common/http";
import { LoaderService } from "@poll-base/data/service/loader.service";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoaderInterceptorService {
  constructor(private loaderService: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.show();

    return next.handle(req).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this.loaderService.hide();
          }
        },
        (error) => {
          this.loaderService.hide();
        }
      )
    );
  }
}
