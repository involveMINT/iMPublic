import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  ImagesViewerModalModule,
  ImBlockModule,
  ImStorageUrlPipeModule,
  OffersModule,
  RequestsModule,
} from '@involvemint/client/shared/data-access';
import { ImFormsModule, ImImageModule, ImTabsModule } from '@involvemint/client/shared/ui';
import { ImRoutes } from '@involvemint/shared/domain';
import { IonicModule } from '@ionic/angular';
import { AutosizeModule } from 'ngx-autosize';
import { StorefrontComponent } from './storefront.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ImBlockModule,
    ImFormsModule,
    ImImageModule,
    ImTabsModule,
    ImagesViewerModalModule,
    AutosizeModule,
    ReactiveFormsModule,
    ImStorageUrlPipeModule,
    OffersModule,
    RequestsModule,
    RouterModule.forChild([
      {
        path: '',
        component: StorefrontComponent,
      },
      {
        path: ImRoutes.ep.storefront.myOffers.ROOT,
        loadChildren: () => import('@involvemint/client/shared/data-access').then((m) => m.OfferModule),
      },
      {
        path: ImRoutes.ep.storefront.myRequests.ROOT,
        loadChildren: () => import('@involvemint/client/shared/data-access').then((m) => m.RequestModule),
      },
    ]),
  ],
  declarations: [StorefrontComponent],
})
export class StorefrontModule {}
