import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { UserFacade } from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { ImAppGuard } from './im-app.guard';

@Injectable()
export class CmGuard implements CanLoad {
  constructor(
    private readonly user: UserFacade,
    private readonly imGuard: ImAppGuard,
    private readonly route: RouteService
  ) {}

  canLoad(): Observable<boolean> {
    return this.imGuard.canActivate().pipe(
      switchMap(() => this.user.session.selectors.state$),
      take(1),
      map(({ changeMaker }) => {
        if (changeMaker) {
          this.user.session.dispatchers.setActiveProfile(changeMaker.id);
          return true;
        }
        this.route.to.applications.cm.ROOT();
        return false;
      })
    );
  }
}
