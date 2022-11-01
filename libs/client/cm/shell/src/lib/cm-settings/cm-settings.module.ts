import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ImBlockModule, ImStorageUrlPipeModule } from '@involvemint/client/shared/data-access';
import { ImFormsModule } from '@involvemint/client/shared/ui';
import { IonicModule } from '@ionic/angular';
import { CmSettingsComponent } from './cm-settings.component';

@NgModule({
  declarations: [CmSettingsComponent],
  imports: [
    CommonModule,
    IonicModule,
    ImBlockModule,
    ImFormsModule,
    ReactiveFormsModule,
    ImStorageUrlPipeModule,
    RouterModule.forChild([
      {
        path: '',
        component: CmSettingsComponent,
      },
    ]),
  ],
})
export class CmSettingsModule {}
