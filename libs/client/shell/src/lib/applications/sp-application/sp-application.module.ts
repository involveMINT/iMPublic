import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ImFormsModule } from '@involvemint/client/shared/ui';
import { ConfirmDeactivationGuard, InfoModalModule } from '@involvemint/client/shared/util';
import { IonicModule } from '@ionic/angular';
import { SpApplicationComponent } from './sp-application.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    InfoModalModule,
    ReactiveFormsModule,
    ImFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: SpApplicationComponent,
        canDeactivate: [ConfirmDeactivationGuard],
      },
    ]),
  ],
  declarations: [SpApplicationComponent],
})
export class SpApplicationModule {}
