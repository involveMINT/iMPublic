import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UserFacade } from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { IM_ACTIVE_PROFILE_QUERY_PARAM } from '@involvemint/shared/domain';
import { getQueryStringValue } from '@involvemint/shared/util';
import { combineLatest, Observable } from 'rxjs';
import { delay, filter, mapTo, startWith, take, tap } from 'rxjs/operators';

/** Only load route params once in this guard.
 *  This is to prevent unwanted changing when calling this guard in other guards. */
let loaded = false;

@Injectable()
export class ImAppGuard implements CanActivate {
  constructor(
    private readonly user: UserFacade,
    private readonly location: Location,
    private readonly route: RouteService
  ) {}

  canActivate(): Observable<boolean> {
    return combineLatest([
      this.user.session.selectors.state$,
      this.user.session.actionListeners.getUserData.error.pipe(startWith(null)),
    ]).pipe(
      filter(([{ id }, error]) => {
        if (!id && !error) {
          this.user.session.dispatchers.getUserData();
          return false;
        }
        return true;
      }),
      take(1),
      tap(([{ changeMaker, exchangeAdmins, serveAdmins }]) => {
        if (!loaded) {
          loaded = true;
          const path = this.location.path();
          const pathNoQuery = path.split('?')[0];
          if (!pathNoQuery) {
            if (changeMaker) {
              this.route.to.cm.ROOT();
            } else if (exchangeAdmins.length > 0) {
              this.route.to.ep.ROOT();
            } else if (serveAdmins.length > 9) {
              this.route.to.sp.ROOT();
            }
          }
          const profileId = getQueryStringValue(IM_ACTIVE_PROFILE_QUERY_PARAM, window.location.search);
          if (profileId) {
            this.user.session.dispatchers.setActiveProfile(profileId);
          }
        }
      }),
      delay(0), // Allow store to update before emitting.
      mapTo(true)
    );
  }
}
