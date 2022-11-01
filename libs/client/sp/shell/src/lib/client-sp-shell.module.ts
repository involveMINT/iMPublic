import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClientSpDataAccessModule } from '@involvemint/client/sp/data-access';
import { ImRoutes } from '@involvemint/shared/domain';

@NgModule({
  imports: [
    ClientSpDataAccessModule,
    RouterModule.forChild([
      {
        path: ImRoutes.sp.myProjects.ROOT,
        loadChildren: () => import('./projects/sp-projects.module').then((m) => m.SpProjectsModule),
      },
      {
        path: ImRoutes.sp.admins.ROOT,
        loadChildren: () => import('./sp-admins/sp-admins.module').then((m) => m.SpAdminsModule),
      },
      {
        path: ImRoutes.sp.settings.ROOT,
        loadChildren: () => import('./sp-settings/sp-settings.module').then((m) => m.SpSettingsModule),
      },
      { path: '**', redirectTo: ImRoutes.sp.myProjects.ROOT, pathMatch: 'full' },
    ]),
  ],
})
export class ClientSpShellModule {}
