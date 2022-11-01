import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ImFormsModule } from '@involvemint/client/shared/ui';
import { IonicModule } from '@ionic/angular';
import { ActivateUserAccountComponent } from './activate-user-account.component';

@NgModule({
  declarations: [ActivateUserAccountComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    ImFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ActivateUserAccountComponent,
      },
    ]),
  ],
})
export class ActivateUserAccountModule {}
