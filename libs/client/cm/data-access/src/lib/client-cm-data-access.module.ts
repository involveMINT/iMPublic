import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ChangeMakerFacade } from './change-maker.facade';
import { EnrollmentsModalModule } from './enrollments/enrollments-modal/enrollments-modal.module';
import { EnrollmentEffects } from './enrollments/enrollments.effects';
import { EnrollmentsReducer, ENROLLMENTS_KEY } from './enrollments/enrollments.reducer';
import { PassportModalModule } from './passport/passport-modal/passport-modal.module';
import { PassportEffects } from './passport/passport.effects';
import { PassportReducer, PASSPORT_KEY } from './passport/passport.reducer';
import { PoiEffects } from './pois/pois.effects';
import { PoiReducer, POIS_KEY } from './pois/pois.reducer';
import { PoiSubmissionModalService } from 'libs/client/cm/shell/src/lib/pois/poi-submission-modal/poi-submission-modal.service';

@NgModule({
  providers: [ChangeMakerFacade, PoiSubmissionModalService],
  imports: [
    CommonModule,
    PassportModalModule,
    EnrollmentsModalModule,
    StoreModule.forFeature(ENROLLMENTS_KEY, EnrollmentsReducer),
    StoreModule.forFeature(PASSPORT_KEY, PassportReducer),
    StoreModule.forFeature(POIS_KEY, PoiReducer),
    EffectsModule.forFeature([EnrollmentEffects, PassportEffects, PoiEffects]),
  ],
})
export class ClientCmDataAccessModule { }
