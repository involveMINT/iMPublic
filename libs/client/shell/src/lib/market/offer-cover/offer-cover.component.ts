import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ChatService,
  ImProfileSelectModalService,
  ImViewProfileModalService,
  OfferMarketStoreModel,
  UserFacade,
} from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { tap } from 'rxjs/operators';

interface State {
  offer: OfferMarketStoreModel | null;
}

@Component({
  selector: 'involvemint-offer-cover',
  templateUrl: './offer-cover.component.html',
  styleUrls: ['./offer-cover.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferCoverComponent extends StatefulComponent<State> implements OnInit {
  constructor(
    private readonly user: UserFacade,
    private readonly activatedRoute: ActivatedRoute,
    private readonly route: RouteService,
    private readonly profileSelect: ImProfileSelectModalService,
    private readonly chat: ChatService,
    private readonly viewProfileModal: ImViewProfileModalService
  ) {
    super({ offer: null });
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) {
      this.back();
      return;
    }

    this.effect(() =>
      this.user.market.selectors.getOffer(id).pipe(
        tap(({ offer }) => {
          if (!offer) {
            this.route.to.market.ROOT();
          }
          this.updateState({ offer });
        })
      )
    );
  }

  back() {
    return this.route.to.market.ROOT({ animation: 'back' });
  }

  viewProfile(offer: OfferMarketStoreModel) {
    this.viewProfileModal.open({
      handle:
        offer.changeMaker?.handle.id ||
        offer.servePartner?.handle.id ||
        (offer.exchangePartner?.handle.id as string),
    });
  }

  async messageSeller(offer: OfferMarketStoreModel) {
    const handleId =
      offer.changeMaker?.handle.id || offer.exchangePartner?.handle.id || offer.servePartner?.handle.id;
    const profile = await this.profileSelect.open({
      title: 'Message Seller',
      header: `Which profile do you want to message @${handleId}?`,
    });
    if (profile && handleId) {
      this.user.session.dispatchers.setActiveProfile(profile.id);
      this.chat.upsert([{ handleId }]);
    }
  }
}
