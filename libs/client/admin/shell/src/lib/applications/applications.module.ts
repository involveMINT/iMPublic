import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImBlockModule } from '@involvemint/client/shared/data-access';
import { ImTabsModule } from '@involvemint/client/shared/ui';
import { IonicModule } from '@ionic/angular';
import { ApplicationsComponent } from './applications.component';

@NgModule({
  declarations: [ApplicationsComponent],
  imports: [
    CommonModule,
    IonicModule,
    ImBlockModule,
    ImTabsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ApplicationsComponent,
      },
    ]),
  ],
})
export class AdminApplicationsModule {}
