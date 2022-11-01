import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ImLegalModalModule } from '@involvemint/client/shared/data-access';
import { ImFormsModule } from '@involvemint/client/shared/ui';
import { IonicModule } from '@ionic/angular';
import { SignUpComponent } from './sign-up.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    ImFormsModule,
    ImLegalModalModule,
    RouterModule.forChild([
      {
        path: '',
        component: SignUpComponent,
      },
    ]),
  ],
  declarations: [SignUpComponent],
})
export class SignUpModule {}
