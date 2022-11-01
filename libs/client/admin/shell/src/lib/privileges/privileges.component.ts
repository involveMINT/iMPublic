import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AdminFacade, BaPrivilegeStoreModel } from '@involvemint/client/admin/data-access';
import { ImUserSearchModalService } from '@involvemint/client/shared/data-access';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { map } from 'rxjs/operators';

interface State {
  baPrivileges: BaPrivilegeStoreModel[];
  loaded: boolean;
}

@Component({
  selector: 'admin-feature-partners-privileges',
  templateUrl: './privileges.component.html',
  styleUrls: ['./privileges.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivilegesComponent extends StatefulComponent<State> implements OnInit {
  constructor(private readonly af: AdminFacade, private readonly usersSearch: ImUserSearchModalService) {
    super({ baPrivileges: [], loaded: false });
  }

  ngOnInit(): void {
    this.effect(() =>
      this.af.privileges.selectors.state$.pipe(
        map(({ baPrivileges, loaded }) => {
          baPrivileges.sort((a, b) => (a.id < b.id ? -1 : 1));
          this.updateState({ baPrivileges, loaded });
        })
      )
    );
  }

  refresh() {
    this.af.privileges.dispatchers.refresh();
  }

  async grant() {
    const user = await this.usersSearch.open({
      title: 'Grant User BA Privileges',
    });
    if (user) {
      this.af.privileges.dispatchers.grantBAPrivilege({ id: user.id });
    }
  }

  revoke(user: BaPrivilegeStoreModel) {
    this.af.privileges.dispatchers.revokeBAPrivilege({ id: user.id });
  }
}
