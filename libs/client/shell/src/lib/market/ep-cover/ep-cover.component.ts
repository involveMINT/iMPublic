import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ExchangePartnerMarketStoreModel,
  ImProfileSelectModalService,
  ImViewProfileModalService,
  UserFacade,
} from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { ImTabsComponent } from '@involvemint/client/shared/ui';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { formatImAddress } from '@involvemint/shared/domain';
import { UnArray } from '@involvemint/shared/util';
import { asyncScheduler } from 'rxjs';
import { take, tap } from 'rxjs/operators';

interface State {
  exchangePartner: ExchangePartnerMarketStoreModel | null;
  images: string[];
  fullAddress: string | null;
  tabIndex: number;
  total: number;
  authenticated: boolean;
}

@Component({
  selector: 'involvemint-ep-cover',
  templateUrl: './ep-cover.component.html',
  styleUrls: ['./ep-cover.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpCoverComponent extends StatefulComponent<State> implements OnInit {
  @ViewChild('tabs') tabs!: ImTabsComponent;
  

  readonly offersChecked = new Map<
    string,
    { quantity: number; offer: UnArray<ExchangePartnerMarketStoreModel['offers']> }
  >();

  constructor(
    private readonly user: UserFacade,
    private readonly activatedRoute: ActivatedRoute,
    private readonly route: RouteService,
    private readonly selectProfile: ImProfileSelectModalService,
    private readonly viewProfileModal: ImViewProfileModalService
  ) {
    super({
      exchangePartner: null,
      images: [],
      fullAddress: null,
      tabIndex: 0,
      total: 0,
      authenticated: false,
    });
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) {
      this.back();
      return;
    }

    this.effect(() =>
      this.user.session.selectors.authenticated$.pipe(
        tap((authenticated) => this.updateState({ authenticated }))
      )
    );

    this.effect(() =>
      this.user.market.selectors.getExchangePartner(id).pipe(
        tap(({ exchangePartner }) => {
          this.updateState({
            exchangePartner,
            images: exchangePartner
              ? [
                  ...(exchangePartner.logoFilePath ? [exchangePartner.logoFilePath] : []),
                  ...exchangePartner.imagesFilePaths,
                ]
              : [],
            fullAddress: exchangePartner ? formatImAddress(exchangePartner.address) : null,
          });
        })
      )
    );
  }

  back() {
    return this.route.to.market.ROOT({ animation: 'back' });
  }

  offersTab() {
    this.tabs.setIndex(2);
  }

  viewProfile(ep: ExchangePartnerMarketStoreModel) {
    this.viewProfileModal.open({ handle: ep.handle.id });
  }

  async pay(exchangePartner: ExchangePartnerMarketStoreModel) {
    const profile = await this.selectProfile.open({
      title: 'Select Profile',
      header: `Which profile do you want to pay @${exchangePartner.handle.id}?`,
    });
    if (profile) {
      this.user.session.selectors.state$.pipe(take(1)).subscribe(async (state) => {
        this.user.session.dispatchers.setActiveProfile(profile.id);
        if (!state.navTabs) {
          await this.route.to.wallet.ROOT({ queryParams: { profile: profile.id } });
        } else {
          this.user.session.dispatchers.toggleWallet(true);
        }
        asyncScheduler.schedule(() => this.user.session.dispatchers.payTo(exchangePartner.handle.id));
      });
    }
  }

  getOffer(offer: UnArray<ExchangePartnerMarketStoreModel['offers']>) {
    return this.offersChecked.get(offer.id);
  }

  offerCheck(evt: {
    checked: boolean;
    offer: UnArray<ExchangePartnerMarketStoreModel['offers']>;
    quantity: number;
  }) {
    if (evt.quantity === 0) evt.checked = false;

    if (evt.checked) {
      this.offersChecked.set(evt.offer.id, { quantity: evt.quantity, offer: evt.offer });
    } else {
      this.offersChecked.delete(evt.offer.id);
    }

    const checkedOffers = Array.from(this.offersChecked.values());

    let total = 0;
    checkedOffers.forEach((o) => (total += o.offer.price * o.quantity));

    this.updateState({ total });
  }

  buyVoucher(exchangePartner: ExchangePartnerMarketStoreModel) {
    this.user.vouchers.dispatchers.buy(exchangePartner, Array.from(this.offersChecked.values()));
  }

}
