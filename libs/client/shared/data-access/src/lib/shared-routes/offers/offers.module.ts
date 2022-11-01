import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ImFormsModule, ImImageModule } from '@involvemint/client/shared/ui';
import { IonicModule } from '@ionic/angular';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ImagesViewerModalModule } from '../../modals';
import { ImStorageUrlPipeModule } from '../../pipes';
import { ImBlockModule } from '../../smart-components';
import { OfferComponent } from './offer/offer.component';
import { OffersComponent } from './offers/offers.component';

@NgModule({
  declarations: [OffersComponent],
  exports: [OffersComponent],
  imports: [
    CommonModule,
    IonicModule,
    ImBlockModule,
    ImFormsModule,
    ImImageModule,
    ImagesViewerModalModule,
    ImStorageUrlPipeModule,
    CurrencyMaskModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class OffersModule {}

@NgModule({
  declarations: [OfferComponent],
  exports: [OfferComponent],
  imports: [
    CommonModule,
    IonicModule,
    ImBlockModule,
    ImFormsModule,
    ImImageModule,
    ImagesViewerModalModule,
    ImStorageUrlPipeModule,
    CurrencyMaskModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: `:id`,
        component: OfferComponent,
      },
    ]),
  ],
})
export class OfferModule {}

@NgModule({
  imports: [
    OffersModule,
    OfferModule,
    RouterModule.forChild([
      {
        path: ``,
        component: OffersComponent,
      },
    ]),
  ],
})
export class OffersCombinedModule {}
