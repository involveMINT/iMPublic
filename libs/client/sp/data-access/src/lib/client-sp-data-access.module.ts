import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { EnrollmentsSpEffects } from './enrollments/enrollments.effects';
import { EnrollmentsSpReducer, ENROLLMENTS_SP_FEATURE_KEY } from './enrollments/enrollments.reducer';
import { PoiEffects } from './pois/pois.effects';
import { PoiReducer, SR_POIS_KEY } from './pois/pois.reducer';
import { ProjectsEffects } from './projects/projects.effects';
import { ProjectsReducer, PROJECTS_SP_FEATURE_KEY } from './projects/projects.reducer';
import { ServePartnerFacade } from './serve-partner.facade';
import { SpAdminsEffects } from './sp-admins/sp-admins.effects';
import { SpAdminsReducer, SP_ADMINS_KEY } from './sp-admins/sp-admins.reducer';

@NgModule({
  providers: [ServePartnerFacade],
  imports: [
    StoreModule.forFeature(PROJECTS_SP_FEATURE_KEY, ProjectsReducer),
    StoreModule.forFeature(ENROLLMENTS_SP_FEATURE_KEY, EnrollmentsSpReducer),
    StoreModule.forFeature(SR_POIS_KEY, PoiReducer),
    StoreModule.forFeature(SP_ADMINS_KEY, SpAdminsReducer),
    EffectsModule.forFeature([ProjectsEffects, PoiEffects, SpAdminsEffects, EnrollmentsSpEffects]),
  ],
})
export class ClientSpDataAccessModule {}
