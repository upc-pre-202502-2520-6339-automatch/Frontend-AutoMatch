import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import {environment} from "../../../environments/environment";

@Injectable()
export class AuthenticationInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthenticationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    // Solo adjuntamos el token a requests contra nuestro backend (Gateway)
    const isBackendRequest =
      req.url.startsWith(environment.backendApiBaseUrl) ||
      req.url.startsWith(environment.apiUrl);

    if (token && isBackendRequest) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
