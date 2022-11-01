import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { EpAdminsEffects } from './ep-admins/ep-admins.effects';
import { EpAdminsReducer, EP_ADMINS_KEY } from './ep-admins/ep-admins.reducer';
import { EpVouchersEffects } from './ep-vouchers/ep-vouchers.effects';
import { EpVouchersReducer, EP_VOUCHERS_KEY } from './ep-vouchers/ep-vouchers.reducer';
import { ExchangePartnerFacade } from './exchange-partner.facade';

@NgModule({
  providers: [ExchangePartnerFacade],
  imports: [
    StoreModule.forFeature(EP_ADMINS_KEY, EpAdminsReducer),
    StoreModule.forFeature(EP_VOUCHERS_KEY, EpVouchersReducer),
    EffectsModule.forFeature([EpAdminsEffects, EpVouchersEffects]),
  ],
})
export class ClientEpDataAccessModule {}
