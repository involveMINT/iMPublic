import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { InfoModalModule } from '@involvemint/client/shared/util';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CreditsEffects } from './+state/credits/credits.effects';
import { CreditReducer, CREDITS_KEY } from './+state/credits/credits.reducer';
import { ProjectsEffects } from './+state/market/market.effects';
import { MarketReducer, MARKET_KEY } from './+state/market/market.reducer';
import { OffersEffects } from './+state/offers/offers.effects';
import { OfferReducer, OFFERS_KEY } from './+state/offers/offers.reducer';
import { MarketEffects } from './+state/projects/projects.effects';
import { ProjectsReducer, PROJECTS_KEY } from './+state/projects/projects.reducer';
import { RequestsEffects } from './+state/requests/requests.effects';
import { RequestReducer, REQUESTS_KEY } from './+state/requests/requests.reducer';
import { CmProfileEffects } from './+state/session/cm/cm-profile.effects';
import { EpProfileEffects } from './+state/session/ep/ep-profile.effects';
import { SpProfileEffects } from './+state/session/sp/sp-profile.effects';
import { UserSessionEffects } from './+state/session/user-session.effects';
import { UserSessionReducer, USER_SESSION_KEY } from './+state/session/user-session.reducer';
import { TransactionsEffects } from './+state/transactions/transactions.effects';
import { TransactionsReducer, TRANSACTIONS_KEY } from './+state/transactions/transactions.reducer';
import { UserFacade } from './+state/user.facade';
import { ConfirmVoucherPurchaseModalModule } from './+state/vouchers/confirm-voucher-purchase-modal/confirm-voucher-purchase-modal.module';
import { VouchersEffects } from './+state/vouchers/vouchers.effects';
import { VoucherReducer, VOUCHERS_KEY } from './+state/vouchers/vouchers.reducer';
import { AuthInterceptor } from './auth.interceptor';
import { ImProfileSelectModalModule } from './modals/im-profile-select-modal/im-profile-select-modal.module';
import { ChangeMakerRestClient, ChatRestClient, CreditRestClient, EnrollmentRestClient, EpApplicationRestClient, ExchangeAdminRestClient, ExchangePartnerRestClient, HandleRestClient, OfferRestClient, PassportDocumentRestClient, PoiRestClient, ProjectRestClient, RequestRestClient, ServeAdminRestClient, ServePartnerRestClient, SpApplicationRestClient, TransactionRestClient, UserRestClient, VoucherRestClient } from './rest-clients';
import { StorageRestClient } from './rest-clients/storage.rest-client';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    InfoModalModule,
    HttpClientModule,
    ImProfileSelectModalModule,
    ConfirmVoucherPurchaseModalModule,
    StoreModule.forFeature(CREDITS_KEY, CreditReducer),
    StoreModule.forFeature(MARKET_KEY, MarketReducer),
    StoreModule.forFeature(OFFERS_KEY, OfferReducer),
    StoreModule.forFeature(PROJECTS_KEY, ProjectsReducer),
    StoreModule.forFeature(REQUESTS_KEY, RequestReducer),
    StoreModule.forFeature(TRANSACTIONS_KEY, TransactionsReducer),
    StoreModule.forFeature(USER_SESSION_KEY, UserSessionReducer),
    StoreModule.forFeature(VOUCHERS_KEY, VoucherReducer),
    EffectsModule.forFeature([
      CmProfileEffects,
      CreditsEffects,
      EpProfileEffects,
      MarketEffects,
      OffersEffects,
      ProjectsEffects,
      RequestsEffects,
      SpProfileEffects,
      TransactionsEffects,
      UserSessionEffects,
      VouchersEffects,
    ]),
  ],
  providers: [
    UserFacade,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    ChangeMakerRestClient,
    ChatRestClient,
    CreditRestClient,
    EnrollmentRestClient,
    EpApplicationRestClient,
    ExchangeAdminRestClient,
    ExchangePartnerRestClient,
    HandleRestClient,
    OfferRestClient,
    PassportDocumentRestClient,
    PoiRestClient,
    ProjectRestClient,
    RequestRestClient,
    ServeAdminRestClient,
    ServePartnerRestClient,
    SpApplicationRestClient,
    StorageRestClient,
    TransactionRestClient,
    UserRestClient,
    VoucherRestClient
  ]
  
})
export class ClientSharedDataAccessModule {}
