import { Injectable } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { StorageService } from "@poll-base/core/services/storage.service";
import { Observable } from "rxjs";

const TOKEN_HEADER_KEY = "Authorization";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private token: StorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url == "https://api.ipify.org/?format=json") {
      req = req.clone({
        withCredentials: false,
      });
      return next.handle(req);
    }

    const token: string = this.token.getToken();
    if (token != null) {
      req = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, "Bearer " + token) });
    }
    return next.handle(req);
  }
}

export const authInterceptorProviders = [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }];
