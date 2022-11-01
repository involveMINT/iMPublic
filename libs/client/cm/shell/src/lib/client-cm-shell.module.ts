import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClientCmDataAccessModule } from '@involvemint/client/cm/data-access';
import { ImRoutes } from '@involvemint/shared/domain';

@NgModule({
  imports: [
    ClientCmDataAccessModule,
    RouterModule.forChild([
      {
        path: ImRoutes.cm.profile.ROOT,
        loadChildren: () => import('./cm-profile/cm-profile.module').then((m) => m.CmProfileModule),
      },
      {
        path: ImRoutes.cm.enrollments.ROOT,
        loadChildren: () => import('./enrollments/enrollments.module').then((m) => m.EnrollmentsModule),
      },
      {
        path: ImRoutes.cm.passport.ROOT,
        loadChildren: () => import('./passport/passport.module').then((m) => m.PassportModule),
      },
      {
        path: ImRoutes.cm.pois.ROOT,
        loadChildren: () => import('./pois/pois.module').then((m) => m.PoisModule),
      },
      {
        path: ImRoutes.cm.settings.ROOT,
        loadChildren: () => import('./cm-settings/cm-settings.module').then((m) => m.CmSettingsModule),
      },
      { path: '**', redirectTo: ImRoutes.cm.profile.ROOT, pathMatch: 'full' },
    ]),
  ],
})
export class ClientCmShellModule {}
