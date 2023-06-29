import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ImBlockModule } from '@involvemint/client/shared/data-access';
import { ImFormsModule } from '@involvemint/client/shared/ui';
import { IonicModule } from '@ionic/angular';
import { CreateCmProfileComponent } from './create-cm-profile.component';
import { CreateCmProfileGuard } from './create-cm-profile.guard';
import { EnrollmentsModule } from 'libs/client/cm/shell/src/lib/enrollments/enrollments.module';

@NgModule({
  imports: [
    CommonModule,
    EnrollmentsModule,
    IonicModule,
    RouterModule.forChild([
      { path: '', component: CreateCmProfileComponent, canActivate: [CreateCmProfileGuard] },
    ]),
    FormsModule,
    ReactiveFormsModule,
    ImFormsModule,
    ImBlockModule,
  ],
  providers: [CreateCmProfileGuard],
  declarations: [CreateCmProfileComponent],
})
export class CreateCmProfileModule {}
