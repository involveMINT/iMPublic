import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  ExchangeAdminsWithBaDownloaded,
  ImHandleSearchModalService,
  ImHandleSearchModalType,
  UserFacade,
} from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { map } from 'rxjs/operators';

interface State {
  downloadedEpAdmins: ExchangeAdminsWithBaDownloaded[];
  loaded: boolean;
}

@Component({
  selector: 'involvemint-profile-selection',
  templateUrl: './profile-selection.component.html',
  styleUrls: ['./profile-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSelectionComponent extends StatefulComponent<State> implements OnInit {
  constructor(
    private readonly handleSearch: ImHandleSearchModalService,
    private readonly user: UserFacade,
    private readonly route: RouteService
  ) {
    super({ downloadedEpAdmins: [], loaded: false });
  }

  ngOnInit(): void {
    this.effect(() =>
      this.user.session.selectors.epAdminsWithBaDownloaded$.pipe(
        map((exchangeAdmins) => {
          this.updateState({
            downloadedEpAdmins: exchangeAdmins.filter((epAdmin) => epAdmin.baDownloaded),
            loaded: true,
          });
        })
      )
    );
  }

  async add() {
    const business = await this.handleSearch.open(ImHandleSearchModalType.business, {
      title: 'Add ExchangePartner Profiles',
    });
    if (business) {
      this.user.session.dispatchers.baDownloadEpAdmin({ epId: business.id, name: business.name });
    }
  }

  delete(downloadedEpAdmin: ExchangeAdminsWithBaDownloaded) {
    this.user.session.dispatchers.baRemoveDownloadedEpAdmin(downloadedEpAdmin);
  }

  create() {
    return this.route.to.applications.ep.ROOT();
  }
}
