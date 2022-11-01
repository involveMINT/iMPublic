import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RouteService } from '@involvemint/client/shared/routes';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { parseDate } from '@involvemint/shared/util';
import { formatDistanceToNow } from 'date-fns';
import { tap } from 'rxjs/operators';
import { OfferStoreModel } from '../../../+state/offers/offers.reducer';
import { ActiveProfile } from '../../../+state/session/user-session.reducer';
import { UserFacade } from '../../../+state/user.facade';

interface State {
  activeProfile: ActiveProfile | null;
  offers: OfferStoreModel[];
  loaded: boolean;
}

@Component({
  selector: 'im-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffersComponent extends StatefulComponent<State> implements OnInit {
  @Input() epStorefrontView = false;

  constructor(private readonly user: UserFacade, private readonly route: RouteService) {
    super({ activeProfile: null, offers: [], loaded: false });
  }

  ngOnInit(): void {
    this.effect(() =>
      this.user.session.selectors.activeProfile$.pipe(
        tap((activeProfile) => this.updateState({ activeProfile }))
      )
    );

    this.effect(() =>
      this.user.offers.selectors.offers$.pipe(
        tap(({ offers, loaded }) => {
          this.updateState({ offers, loaded });
        })
      )
    );
  }

  back() {
    if (this.state.activeProfile?.type === 'ep') {
      return this.route.to.ep.storefront.ROOT({ queryParams: { activeTab: 'offers' }, animation: 'back' });
    } else {
      return this.route.to.market.ROOT({ queryParams: { activeTab: 'offers' }, animation: 'back' });
    }
  }

  refresh() {
    this.user.offers.dispatchers.refresh();
  }

  createOffer() {
    if (this.state.activeProfile?.type === 'ep') {
      this.user.offers.dispatchers.create(true);
    } else {
      this.user.offers.dispatchers.create();
    }
  }

  formatDistanceToNow(date: Date | string) {
    return formatDistanceToNow(parseDate(date));
  }

  viewOffer(offer: OfferStoreModel) {
    if (this.state.activeProfile?.type === 'ep') {
      this.route.to.ep.storefront.myOffers.EDIT(offer.id, { animation: 'forward' });
    } else {
      this.route.to.market.myOffers.EDIT(offer.id, { animation: 'forward' });
    }
  }

  delete(offer: OfferStoreModel) {
    if (this.state.activeProfile?.type === 'ep') {
      this.user.offers.dispatchers.delete(offer, true);
    } else {
      this.user.offers.dispatchers.delete(offer);
    }
  }
}
