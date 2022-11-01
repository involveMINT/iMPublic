import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClientEpDataAccessModule } from '@involvemint/client/ep/data-access';
import { ImRoutes } from '@involvemint/shared/domain';

@NgModule({
  imports: [
    ClientEpDataAccessModule,
    RouterModule.forChild([
      {
        path: ImRoutes.ep.onboarding.ROOT,
        loadChildren: () => import('./ep-onboarding/ep-onboarding.module').then((m) => m.EpOnboardingModule),
      },
      {
        path: ImRoutes.ep.dashboard.ROOT,
        loadChildren: () => import('./ep-dashboard/ep-dashboard.module').then((m) => m.EpDashboardModule),
      },
      {
        path: ImRoutes.ep.settings.ROOT,
        loadChildren: () => import('./ep-settings/ep-settings.module').then((m) => m.EpSettingsModule),
      },
      {
        path: ImRoutes.ep.storefront.ROOT,
        loadChildren: () => import('./storefront/storefront.module').then((m) => m.StorefrontModule),
      },
      {
        path: ImRoutes.ep.admins.ROOT,
        loadChildren: () => import('./ep-admins/ep-admins.module').then((m) => m.EpAdminsModule),
      },
      {
        path: ImRoutes.ep.budget.ROOT,
        loadChildren: () => import('./budget/budget.module').then((m) => m.BudgetModule),
      },
      {
        path: ImRoutes.ep.vouchers.ROOT,
        loadChildren: () => import('./vouchers/vouchers.module').then((m) => m.VoucherModule),
      },
      { path: '**', redirectTo: ImRoutes.ep.dashboard.ROOT, pathMatch: 'full' },
    ]),
  ],
})
export class ClientEpShellModule {}
