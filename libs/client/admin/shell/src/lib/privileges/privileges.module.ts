import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ImBlockModule, ImUserSearchModalModule } from '@involvemint/client/shared/data-access';
import { ImFormsModule, ImTabsModule } from '@involvemint/client/shared/ui';
import { IonicModule } from '@ionic/angular';
import { PrivilegesComponent } from './privileges.component';

@NgModule({
  declarations: [PrivilegesComponent],
  imports: [
    CommonModule,
    IonicModule,
    ImBlockModule,
    ImTabsModule,
    ImFormsModule,
    FormsModule,
    ReactiveFormsModule,
    ImUserSearchModalModule,
    RouterModule.forChild([
      {
        path: '',
        component: PrivilegesComponent,
      },
    ]),
  ],
})
export class AdminPrivilegesModule {}
