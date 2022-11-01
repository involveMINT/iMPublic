import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { UserFacade } from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { ImAppGuard } from './im-app.guard';

@Injectable()
export class SpGuard implements CanLoad {
  constructor(
    private readonly uf: UserFacade,
    private readonly imGuard: ImAppGuard,
    private readonly route: RouteService
  ) {}

  canLoad(): Observable<boolean> {
    return this.imGuard.canActivate().pipe(
      switchMap(() => this.uf.session.selectors.activeProfile$),
      take(1),
      map((activeProfile) => {
        if (activeProfile?.type === 'sp') {
          return true;
        }
        this.route.to.ROOT();
        return false;
      })
    );
  }
}
