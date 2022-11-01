import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  ImBlockModule,
  ImLoadingRouteDirectiveModule,
  ImStorageUrlPipeModule,
} from '@involvemint/client/shared/data-access';
import { ImProgressModule, ImTabsModule } from '@involvemint/client/shared/ui';
import { BrowseProjectsModule } from '@involvemint/client/shell';
import { IonicModule } from '@ionic/angular';
import { EnrollmentComponent } from './enrollment/enrollment.component';
import { EnrollmentsComponent } from './enrollments/enrollments.component';
import { SignWaiverModalComponent } from './sign-waiver-modal/sign-waiver-modal.component';
import { SignWaiverModalService } from './sign-waiver-modal/sign-waiver-modal.service';

@NgModule({
  declarations: [EnrollmentsComponent, EnrollmentComponent, SignWaiverModalComponent],
  providers: [SignWaiverModalService],
  imports: [
    CommonModule,
    IonicModule,
    ImTabsModule,
    ImBlockModule,
    ImStorageUrlPipeModule,
    ImLoadingRouteDirectiveModule,
    BrowseProjectsModule,
    ImProgressModule,
    RouterModule.forChild([
      {
        path: '',
        component: EnrollmentsComponent,
      },
      {
        path: `:id`,
        component: EnrollmentComponent,
      },
    ]),
  ],
})
export class EnrollmentsModule {}
