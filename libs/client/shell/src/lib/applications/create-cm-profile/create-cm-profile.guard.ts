import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UserFacade } from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { ImAppGuard } from '../../guards/im-app.guard';

@Injectable()
export class CreateCmProfileGuard implements CanActivate {
  constructor(
    private readonly route: RouteService,
    private readonly uf: UserFacade,
    private readonly imGuard: ImAppGuard
  ) {}

  canActivate(): Observable<boolean> {
    return this.imGuard.canActivate().pipe(
      switchMap(() => this.uf.session.selectors.state$),
      take(1),
      map(({ changeMaker }) => {
        if (!changeMaker) {
          return true;
        }
        this.route.to.ROOT();
        return false;
      })
    );
  }
}
