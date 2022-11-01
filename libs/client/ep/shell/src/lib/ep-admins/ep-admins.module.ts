import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  ImBlockModule,
  ImHandleModule,
  ImStorageUrlPipeModule,
  ImUserSearchModalModule,
} from '@involvemint/client/shared/data-access';
import { IonicModule } from '@ionic/angular';
import { EpAdminsComponent } from './ep-admins.component';

@NgModule({
  declarations: [EpAdminsComponent],
  imports: [
    CommonModule,
    IonicModule,
    ImBlockModule,
    ImStorageUrlPipeModule,
    ImUserSearchModalModule,
    ImHandleModule,
    RouterModule.forChild([
      {
        path: '',
        component: EpAdminsComponent,
      },
    ]),
  ],
})
export class EpAdminsModule {}
