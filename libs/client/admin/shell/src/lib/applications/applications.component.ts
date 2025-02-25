import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  AdminFacade,
  EpApplicationStoreModel,
  SpApplicationStoreModel,
} from '@involvemint/client/admin/data-access';
import { UserFacade } from '@involvemint/client/shared/data-access';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { tap } from 'rxjs/operators';

interface State {
  epApplications: EpApplicationStoreModel[];
  spApplications: SpApplicationStoreModel[];
  loaded: boolean;
  viewedAddNewAccount: boolean;
  authenticated: boolean;
}

@Component({
  selector: 'admin-feature-partners-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationsComponent extends StatefulComponent<State> implements OnInit {
  constructor(private readonly af: AdminFacade, private readonly uf: UserFacade) {
    super({ 
      epApplications: [], 
      spApplications: [], 
      loaded: false,
      viewedAddNewAccount: false, 
      authenticated: false 
    });
  }

  ngOnInit(): void {
    this.effect(() =>
      this.af.applications.selectors.state$.pipe(
        tap(({ epApplications, spApplications, loaded }) =>
          this.updateState({ epApplications, spApplications, loaded })
        )
      )
    );
    this.effect(() =>
      this.uf.session.selectors.state$.pipe(
        tap(({ viewedAddNewAccount, id}) =>
          this.updateState({
            viewedAddNewAccount : viewedAddNewAccount,
            authenticated: !!id
          })
        )
      )
    );
  }

  refresh() {
    this.af.applications.dispatchers.refresh();
  }

  processEp(ep: EpApplicationStoreModel, allow: boolean): void {
    this.af.applications.dispatchers.processEpApplication({ id: ep.id, allow });
  }

  processSp(sp: SpApplicationStoreModel, allow: boolean): void {
    this.af.applications.dispatchers.processSpApplication({ id: sp.id, allow });
  }

  logout(): void {
    this.uf.session.dispatchers.logout();
  }
}
