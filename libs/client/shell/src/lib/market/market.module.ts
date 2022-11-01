import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  ImBlockModule,
  ImCardModule,
  ImImageSlidesModule,
  ImStorageUrlPipeModule,
  ImViewProfileModalModule,
} from '@involvemint/client/shared/data-access';
import { ImTabsModule } from '@involvemint/client/shared/ui';
import { ImRoutes } from '@involvemint/shared/domain';
import { IonicModule } from '@ionic/angular';
import { EpCoverComponent } from './ep-cover/ep-cover.component';
import { MarketComponent } from './market.component';
import { OfferCoverComponent } from './offer-cover/offer-cover.component';
import { RequestCoverComponent } from './request-cover/request-cover.component';

@NgModule({
  declarations: [MarketComponent, EpCoverComponent, OfferCoverComponent, RequestCoverComponent],
  imports: [
    CommonModule,
    IonicModule,
    ImBlockModule,
    ImTabsModule,
    ImCardModule,
    ImImageSlidesModule,
    ImStorageUrlPipeModule,
    ImViewProfileModalModule,
    RouterModule.forChild([
      {
        path: '',
        component: MarketComponent,
      },
      {
        path: `${ImRoutes.market.ep.ROOT}/:id`,
        component: EpCoverComponent,
      },
      {
        path: `${ImRoutes.market.offer.ROOT}/:id`,
        component: OfferCoverComponent,
      },
      {
        path: `${ImRoutes.market.request.ROOT}/:id`,
        component: RequestCoverComponent,
      },
      {
        path: ImRoutes.market.myOffers.ROOT,
        loadChildren: () =>
          import('@involvemint/client/shared/data-access').then((m) => m.OffersCombinedModule),
      },
      {
        path: ImRoutes.market.myRequests.ROOT,
        loadChildren: () =>
          import('@involvemint/client/shared/data-access').then((m) => m.RequestsCombinedModule),
      },
    ]),
  ],
})
export class MarketModule {}
