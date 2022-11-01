import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ImFormsModule } from '@involvemint/client/shared/ui';
import { IonicModule } from '@ionic/angular';
import { ForgotPasswordChangeComponent } from './forgot-password-change.component';

@NgModule({
  declarations: [ForgotPasswordChangeComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    ImFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ForgotPasswordChangeComponent,
      },
    ]),
  ],
})
export class ForgotPasswordChangeModule {}
