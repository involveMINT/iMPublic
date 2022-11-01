import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ChatService,
  ImProfileSelectModalService,
  ImViewProfileModalService,
  RequestMarketStoreModel,
  UserFacade,
} from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { asyncScheduler } from 'rxjs';
import { take, tap } from 'rxjs/operators';

interface State {
  request: RequestMarketStoreModel | null;
  authenticated: boolean;
}

@Component({
  selector: 'involvemint-request-cover',
  templateUrl: './request-cover.component.html',
  styleUrls: ['./request-cover.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestCoverComponent extends StatefulComponent<State> implements OnInit {
  constructor(
    private readonly user: UserFacade,
    private readonly activatedRoute: ActivatedRoute,
    private readonly route: RouteService,
    private readonly profileSelect: ImProfileSelectModalService,
    private readonly chat: ChatService,
    private readonly viewProfileModal: ImViewProfileModalService
  ) {
    super({ request: null, authenticated: false });
  }

  ngOnInit(): void {
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
      this.user.market.selectors.getRequest(id).pipe(
        tap(({ request }) => {
          if (!request) {
            this.route.to.market.ROOT();
          }
          this.updateState({ request });
        })
      )
    );
  }

  back() {
    return this.route.to.market.ROOT({ animation: 'back' });
  }

  viewProfile(request: RequestMarketStoreModel) {
    this.viewProfileModal.open({
      handle:
        request.changeMaker?.handle.id ||
        request.servePartner?.handle.id ||
        (request.exchangePartner?.handle.id as string),
    });
  }

  async messageSeller(request: RequestMarketStoreModel) {
    const handleId =
      request.changeMaker?.handle.id || request.exchangePartner?.handle.id || request.servePartner?.handle.id;
    const profile = await this.profileSelect.open({
      title: 'Message Seller',
      header: `Which profile do you want to message @${handleId}?`,
    });
    if (profile && handleId) {
      this.user.session.dispatchers.setActiveProfile(profile.id);
      this.chat.upsert([{ handleId }]);
    }
  }

  async pay(request: RequestMarketStoreModel) {
    const handleId =
      request?.changeMaker?.handle?.id ||
      request?.exchangePartner?.handle?.id ||
      request?.servePartner?.handle?.id;
    const profile = await this.profileSelect.open({
      title: 'Select Profile',
      header: `Which profile do you want to pay @${handleId}?`,
    });
    if (profile) {
      this.user.session.selectors.state$.pipe(take(1)).subscribe(async (state) => {
        this.user.session.dispatchers.setActiveProfile(profile.id);
        if (!state.navTabs) {
          await this.route.to.wallet.ROOT({ queryParams: { profile: profile.id } });
        } else {
          this.user.session.dispatchers.toggleWallet(true);
        }
        if (handleId) {
          asyncScheduler.schedule(() => this.user.session.dispatchers.payTo(handleId, request.price));
        }
      });
    }
  }
}
