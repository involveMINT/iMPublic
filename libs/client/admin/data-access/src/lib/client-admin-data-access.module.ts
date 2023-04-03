import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AdminFacade } from './admin.facade';
import { ApplicationsEffects } from './applications/applications.effects';
import { ApplicationsReducer, APPLICATIONS_FEATURE_KEY } from './applications/applications.reducer';
import { CreditsEffects } from './credits/credits.effects';
import { PrivilegesEffects } from './privileges/privileges.effects';
import { PrivilegesReducer, PRIVILEGES_FEATURE_KEY } from './privileges/privileges.reducer';
import { PostsReducer, MODERATION_FEATURE_KEY } from './moderation/moderation.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(APPLICATIONS_FEATURE_KEY, ApplicationsReducer),
    StoreModule.forFeature(PRIVILEGES_FEATURE_KEY, PrivilegesReducer),
    StoreModule.forFeature(MODERATION_FEATURE_KEY, PostsReducer),
    EffectsModule.forFeature([ApplicationsEffects, PrivilegesEffects, CreditsEffects]),
  ],
  providers: [AdminFacade],
})
export class ClientAdminDataAccessModule {}
