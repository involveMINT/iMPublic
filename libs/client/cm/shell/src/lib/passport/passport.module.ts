import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  ImBlockModule,
  ImLoadingRouteDirectiveModule,
  ImStorageUrlPipeModule,
} from '@involvemint/client/shared/data-access';
import { ImFormsModule } from '@involvemint/client/shared/ui';
import { IonicModule } from '@ionic/angular';
import { PassportDocumentComponent } from './passport-document/passport-document.component';
import { PassportComponent } from './passport/passport.component';

@NgModule({
  declarations: [PassportComponent, PassportDocumentComponent],
  imports: [
    CommonModule,
    IonicModule,
    ImBlockModule,
    ImFormsModule,
    ReactiveFormsModule,
    ImStorageUrlPipeModule,
    ImLoadingRouteDirectiveModule,
    RouterModule.forChild([
      {
        path: '',
        component: PassportComponent,
      },
      {
        path: ':id',
        component: PassportDocumentComponent,
      },
    ]),
  ],
})
export class PassportModule {}
