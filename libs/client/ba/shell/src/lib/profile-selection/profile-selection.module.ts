import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  ImBlockModule,
  ImHandleModule,
  ImHandleSearchModalModule,
} from '@involvemint/client/shared/data-access';
import { ImFormsModule, ImTabsModule } from '@involvemint/client/shared/ui';
import { IonicModule } from '@ionic/angular';
import { ProfileSelectionComponent } from './profile-selection.component';

@NgModule({
  declarations: [ProfileSelectionComponent],
  imports: [
    CommonModule,
    IonicModule,
    ImBlockModule,
    ImTabsModule,
    ImFormsModule,
    ImHandleModule,
    FormsModule,
    ReactiveFormsModule,
    ImHandleSearchModalModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProfileSelectionComponent,
      },
    ]),
  ],
})
export class ProfileSelectionModule {}
