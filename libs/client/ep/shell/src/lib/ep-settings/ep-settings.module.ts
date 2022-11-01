import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ImBlockModule, ImStorageUrlPipeModule } from '@involvemint/client/shared/data-access';
import { ImFormsModule } from '@involvemint/client/shared/ui';
import { IonicModule } from '@ionic/angular';
import { EpSettingsComponent } from './ep-settings.component';

@NgModule({
  declarations: [EpSettingsComponent],
  exports: [EpSettingsComponent],
  imports: [
    CommonModule,
    IonicModule,
    ImBlockModule,
    ImFormsModule,
    ReactiveFormsModule,
    ImStorageUrlPipeModule,
  ],
})
export class EpSettingsComponentModule {}

@NgModule({
  imports: [
    EpSettingsComponentModule,
    RouterModule.forChild([
      {
        path: '',
        component: EpSettingsComponent,
      },
    ]),
  ],
})
export class EpSettingsModule {}
