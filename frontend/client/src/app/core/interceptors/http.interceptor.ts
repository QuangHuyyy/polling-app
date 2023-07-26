import { Injectable } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { StorageService } from "@poll-base/core/services/storage.service";
import { EventBusService } from "@poll-base/core/services/event-bus.service";
import { EventData } from "@poll-base/data/schema/event.class";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private isRefreshing: boolean = false;

  constructor(private storageService: StorageService, private eventBusService: EventBusService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      withCredentials: true,
    });

    if (req.url == "https://api.ipify.org/?format=json") {
      req = req.clone({
        withCredentials: false,
      });
      return next.handle(req);
    }

    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && !req.url.includes("/auth/register") && error.status === 401) {
          return this.handle401Error(req, next);
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      if (this.storageService.isLoggedIn()) {
        this.eventBusService.emit(new EventData("/logout", null));
      }
    }

    return next.handle(request);
  }
}

export const httpInterceptorProviders = [{ provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }];
