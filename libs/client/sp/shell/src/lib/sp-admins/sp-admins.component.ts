import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ImUserSearchModalService } from '@involvemint/client/shared/data-access';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { ServePartnerFacade, SpAdminStoreModel } from '@involvemint/client/sp/data-access';
import { tap } from 'rxjs/operators';

interface State {
  spAdmins: SpAdminStoreModel[];
  loaded: boolean;
}

@Component({
  selector: 'sp-admins',
  templateUrl: './sp-admins.component.html',
  styleUrls: ['./sp-admins.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpAdminsComponent extends StatefulComponent<State> implements OnInit {
  constructor(
    private readonly sp: ServePartnerFacade,
    private readonly usersSearch: ImUserSearchModalService
  ) {
    super({ spAdmins: [], loaded: false });
  }

  ngOnInit(): void {
    this.effect(() =>
      this.sp.spAdmins.selectors.spAdmins$.pipe(
        tap(({ spAdmins, loaded }) => this.updateState({ spAdmins, loaded }))
      )
    );
  }

  refresh() {
    this.sp.spAdmins.dispatchers.refresh();
  }

  async addAdmin() {
    const user = await this.usersSearch.open({
      title: 'Search users...',
    });
    if (user) {
      this.sp.spAdmins.dispatchers.addSpAdmin(user.id);
    }
  }

  removeAdmin(spAdmin: SpAdminStoreModel) {
    this.sp.spAdmins.dispatchers.removeSpAdmin(spAdmin);
  }
}
