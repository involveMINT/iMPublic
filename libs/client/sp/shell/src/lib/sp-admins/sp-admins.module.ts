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
import { SpAdminsComponent } from './sp-admins.component';

@NgModule({
  declarations: [SpAdminsComponent],
  imports: [
    CommonModule,
    IonicModule,
    ImBlockModule,
    ImHandleModule,
    ImStorageUrlPipeModule,
    ImUserSearchModalModule,
    RouterModule.forChild([
      {
        path: '',
        component: SpAdminsComponent,
      },
    ]),
  ],
})
export class SpAdminsModule {}
