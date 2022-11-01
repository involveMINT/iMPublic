import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClientBaDataAccessModule } from '@involvemint/client/ba/data-access';
import { ImRoutes } from '@involvemint/shared/domain';
import { ProfileSelectionModule } from './profile-selection/profile-selection.module';

@NgModule({
  imports: [
    ClientBaDataAccessModule,
    RouterModule.forChild([
      {
        path: ImRoutes.ba.download.ROOT,
        loadChildren: () =>
          import('./profile-selection/profile-selection.module').then((m) => m.ProfileSelectionModule),
      },
    ]),
    ProfileSelectionModule,
  ],
})
export class ClientBaShellModule {}
