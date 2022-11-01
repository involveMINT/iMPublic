import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { EpAdminStoreModel, ExchangePartnerFacade } from '@involvemint/client/ep/data-access';
import { ImUserSearchModalService } from '@involvemint/client/shared/data-access';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { tap } from 'rxjs/operators';

interface State {
  epAdmins: EpAdminStoreModel[];
  loaded: boolean;
}

@Component({
  selector: 'involvemint-ep-admins',
  templateUrl: './ep-admins.component.html',
  styleUrls: ['./ep-admins.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpAdminsComponent extends StatefulComponent<State> implements OnInit {
  constructor(
    private readonly ep: ExchangePartnerFacade,
    private readonly usersSearch: ImUserSearchModalService
  ) {
    super({ epAdmins: [], loaded: false });
  }

  ngOnInit(): void {
    this.effect(() =>
      this.ep.epAdmins.selectors.epAdmins$.pipe(
        tap(({ epAdmins, loaded }) => this.updateState({ epAdmins, loaded }))
      )
    );
  }

  refresh() {
    this.ep.epAdmins.dispatchers.refresh();
  }

  async addAdmin() {
    const user = await this.usersSearch.open({
      title: 'Search users...',
    });
    if (user) {
      this.ep.epAdmins.dispatchers.addEpAdmin(user.id);
    }
  }

  removeAdmin(epAdmin: EpAdminStoreModel) {
    this.ep.epAdmins.dispatchers.removeEpAdmin(epAdmin);
  }
}
