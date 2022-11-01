import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RouteService } from '@involvemint/client/shared/routes';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { parseDate } from '@involvemint/shared/util';
import { formatDistanceToNow } from 'date-fns';
import { tap } from 'rxjs/operators';
import { RequestStoreModel } from '../../../+state/requests/requests.reducer';
import { ActiveProfile } from '../../../+state/session/user-session.reducer';
import { UserFacade } from '../../../+state/user.facade';

interface State {
  activeProfile: ActiveProfile | null;
  requests: RequestStoreModel[];
  loaded: boolean;
}

@Component({
  selector: 'im-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsComponent extends StatefulComponent<State> implements OnInit {
  @Input() epStorefrontView = false;

  constructor(private readonly user: UserFacade, private readonly route: RouteService) {
    super({ activeProfile: null, requests: [], loaded: false });
  }

  ngOnInit(): void {
    this.effect(() =>
      this.user.session.selectors.activeProfile$.pipe(
        tap((activeProfile) => this.updateState({ activeProfile }))
      )
    );

    this.effect(() =>
      this.user.requests.selectors.requests$.pipe(
        tap(({ requests, loaded }) => {
          this.updateState({ requests, loaded });
        })
      )
    );
  }

  back() {
    if (this.state.activeProfile?.type === 'ep') {
      return this.route.to.ep.storefront.ROOT({ queryParams: { activeTab: 'requests' }, animation: 'back' });
    } else {
      return this.route.to.market.ROOT({ queryParams: { activeTab: 'requests' }, animation: 'back' });
    }
  }

  refresh() {
    this.user.requests.dispatchers.refresh();
  }

  createRequest() {
    if (this.state.activeProfile?.type === 'ep') {
      this.user.requests.dispatchers.create(true);
    } else {
      this.user.requests.dispatchers.create();
    }
  }

  formatDistanceToNow(date: Date | string) {
    return formatDistanceToNow(parseDate(date));
  }

  viewRequest(request: RequestStoreModel) {
    if (this.state.activeProfile?.type === 'ep') {
      this.route.to.ep.storefront.myRequests.EDIT(request.id, { animation: 'forward' });
    } else {
      this.route.to.market.myRequests.EDIT(request.id, { animation: 'forward' });
    }
  }

  delete(request: RequestStoreModel) {
    if (this.state.activeProfile?.type === 'ep') {
      this.user.requests.dispatchers.delete(request, true);
    } else {
      this.user.requests.dispatchers.delete(request);
    }
  }
}
