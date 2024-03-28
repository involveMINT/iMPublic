import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment, TOKEN_KEY } from '@involvemint/shared/domain';
import { Observable } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { ImAuthTokenStorage } from './+state/session/user-session.storage';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const headers = req.headers;
    const body = req.body as FormData;

    const userToken = ImAuthTokenStorage.getValue();
    if (body) {
      body.set(TOKEN_KEY, userToken?.token ?? '');
    }

    const authReq = req.clone({ headers, body });
    return (
      next
        .handle(authReq)
        // Simulate HTTP delay for development.
        .pipe(environment.environment !== 'local' ? tap() : delay(Math.floor(Math.random() * (400 - 50 + 1) + 50)))
    );
  }
}
