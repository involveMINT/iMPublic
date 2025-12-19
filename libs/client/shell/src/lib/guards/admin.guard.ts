import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { ImAuthTokenStorage, UserRestClient } from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class AdminGuard implements CanLoad {
  constructor(private readonly user: UserRestClient, private readonly route: RouteService) {}

  canLoad(): Observable<boolean> {
    const auth = ImAuthTokenStorage.getValue();
    if (!auth?.token) {
      this.route.to.ROOT();
      return of(false);
    }

    return this.user.validateAdminToken({ token: true }, { token: auth?.token }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
