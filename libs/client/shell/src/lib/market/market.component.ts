/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ActiveProfile,
  ExchangePartnerMarketStoreModel,
  OfferMarketStoreModel,
  RequestMarketStoreModel,
  UserFacade,
} from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { ImTabsComponent } from '@involvemint/client/shared/ui';
import { GeoLocator, StatefulComponent } from '@involvemint/client/shared/util';
import { parseDate } from '@involvemint/shared/util';
import { formatDistanceToNow } from 'date-fns';
import { merge } from 'rxjs';
import { take, tap } from 'rxjs/operators';

interface State {
  activeTabIndex: number;
  activeProfile: ActiveProfile | null;
  exchangePartners: Array<ExchangePartnerMarketStoreModel & { distance?: number }>;
  offers: OfferMarketStoreModel[];
  requests: RequestMarketStoreModel[];
  loaded: boolean;
}

@Component({
  selector: 'involvemint-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketComponent extends StatefulComponent<State> implements OnInit {
  @ViewChild('tabs') tabs!: ImTabsComponent;

  constructor(
    private readonly user: UserFacade,
    private readonly route: RouteService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly geolocation: GeoLocator
  ) {
    super({
      activeTabIndex: 0,
      activeProfile: null,
      exchangePartners: [],
      loaded: false,
      offers: [],
      requests: [],
    });
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(async ({ activeTab }) => {
      if (!activeTab) {
        return;
      }
      // re-route to same route to remove queryParams (activeTab)
      this.route.to.market.ROOT({
        queryParams: {
          activeTab: undefined,
        },
      });
      this.updateState({
        activeTabIndex:
          activeTab === 'businesses' ? 0 : activeTab === 'offers' ? 1 : activeTab === 'requests' ? 2 : 0,
      });
      activeTab === 'businesses'
        ? this.tabs.setIndex(0)
        : activeTab === 'offers'
        ? this.tabs.setIndex(1)
        : activeTab === 'requests'
        ? this.tabs.setIndex(2)
        : this.tabs.setIndex(0);
    });

    this.effect(() =>
      this.user.session.selectors.activeProfile$.pipe(
        tap((activeProfile) => this.updateState({ activeProfile }))
      )
    );

    this.effect(() =>
      this.user.market.selectors.exchangePartners$.pipe(
        tap(({ exchangePartners, loaded }) => {
          this.updateState({ exchangePartners, loaded });
          this.geolocation.getPosition().then(({ lat, lng }) => {
            this.updateState({
              exchangePartners: this.state.exchangePartners.map((ep) => ({
                ...ep,
                distance: this.distance(lat, lng, ep),
              })),
            });
          });
        })
      )
    );

    this.effect(() =>
      this.user.market.selectors.offers$.pipe(
        tap(({ offers, loaded }) => this.updateState({ offers, loaded }))
      )
    );

    this.effect(() =>
      this.user.market.selectors.requests$.pipe(
        tap(({ requests, loaded }) => this.updateState({ requests, loaded }))
      )
    );
  }

  tabChangeEvent(event: number) {
    if (typeof event !== 'number') {
      return;
    }
    this.updateState({
      activeTabIndex: event,
    });
  }

  private distance(lat: number, lng: number, ep: ExchangePartnerMarketStoreModel) {
    if (ep.latitude && ep.longitude) {
      return this.geolocation.coordinateDistance(ep.latitude, ep.longitude, lat, lng);
    }
    return undefined;
  }

  refresh() {
    this.user.market.dispatchers.refresh();
  }

  images<T extends { imagesFilePaths: string[]; logoFilePath?: string }>(t: T) {
    const images = [...t.imagesFilePaths];
    if (t.logoFilePath) {
      images.unshift(t.logoFilePath);
    }
    return images;
  }

  formatDistanceToNow(date: Date | string) {
    return formatDistanceToNow(parseDate(date));
  }

  storeFront(exchangePartner: ExchangePartnerMarketStoreModel) {
    return this.route.to.market.ep.COVER(exchangePartner.id);
  }

  createOffer() {
    if (this.state.activeProfile?.type === 'ep') {
      return this.user.offers.dispatchers.create(true);
    } else {
      return this.user.offers.dispatchers.create();
    }
  }

  viewMyOffers() {
    if (this.state.activeProfile?.type === 'ep') {
      return this.route.to.ep.storefront.ROOT({ queryParams: { activeTab: 'offers' } });
    } else {
      return this.route.to.market.myOffers.ROOT();
    }
  }

  viewMarketOffer(offer: OfferMarketStoreModel) {
    return this.route.to.market.offer.OFFER(offer.id);
  }

  createRequest() {
    if (this.state.activeProfile?.type === 'ep') {
      return this.user.requests.dispatchers.create(true);
    } else {
      return this.user.requests.dispatchers.create();
    }
  }

  viewMyRequests() {
    if (this.state.activeProfile?.type === 'ep') {
      return this.route.to.ep.storefront.ROOT({ queryParams: { activeTab: 'requests' } });
    } else {
      return this.route.to.market.myRequests.ROOT();
    }
  }

  viewMarketRequest(request: RequestMarketStoreModel) {
    return this.route.to.market.request.REQUEST(request.id);
  }

  loadMoreStorefronts(event: Event) {
    this.user.market.dispatchers.loadMoreExchangePartners();
    merge(
      this.user.market.actionListeners.exchangePartnersMarketLoad.success,
      this.user.market.actionListeners.exchangePartnersMarketLoad.error
    )
      .pipe(take(1))
      .subscribe(() => (event.target as any).complete());
  }

  loadMoreOffers(event: Event) {
    this.user.market.dispatchers.loadMoreOffers();
    merge(
      this.user.market.actionListeners.offersMarketLoad.success,
      this.user.market.actionListeners.offersMarketLoad.error
    )
      .pipe(take(1))
      .subscribe(() => (event.target as any).complete());
  }

  loadMoreRequests(event: Event) {
    this.user.market.dispatchers.loadMoreRequests();
    merge(
      this.user.market.actionListeners.requestsMarketLoad.success,
      this.user.market.actionListeners.requestsMarketLoad.error
    )
      .pipe(take(1))
      .subscribe(() => (event.target as any).complete());
  }
}
