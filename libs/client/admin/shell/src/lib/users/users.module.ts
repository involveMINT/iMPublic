import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ImBlockModule } from '@involvemint/client/shared/data-access';
import { ImFormsModule } from '@involvemint/client/shared/ui';
import { IonicModule } from '@ionic/angular';
import { UsersComponent } from './users.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ImFormsModule,
    ReactiveFormsModule,
    ImBlockModule,
    RouterModule.forChild([
      {
        path: '',
        component: UsersComponent,
      },
    ]),
  ],
  exports: [],
  declarations: [UsersComponent],
  providers: [],
})
export class UsersModule {}
