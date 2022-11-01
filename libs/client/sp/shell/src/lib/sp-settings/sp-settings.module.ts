import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ImBlockModule, ImStorageUrlPipeModule } from '@involvemint/client/shared/data-access';
import { ImFormsModule } from '@involvemint/client/shared/ui';
import { IonicModule } from '@ionic/angular';
import { SpSettingsComponent } from './sp-settings.component';

@NgModule({
  declarations: [SpSettingsComponent],
  imports: [
    CommonModule,
    IonicModule,
    ImBlockModule,
    ImStorageUrlPipeModule,
    ImFormsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: SpSettingsComponent,
      },
    ]),
  ],
})
export class SpSettingsModule {}
