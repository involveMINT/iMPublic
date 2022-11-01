import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImBlockModule, ImCardModule, ImStorageUrlPipeModule } from '@involvemint/client/shared/data-access';
import { ImTabsModule } from '@involvemint/client/shared/ui';
import { IonicModule } from '@ionic/angular';
import { CmProfileComponent } from './cm-profile.component';

@NgModule({
  declarations: [CmProfileComponent],
  imports: [
    CommonModule,
    IonicModule,
    ImBlockModule,
    ImTabsModule,
    ImCardModule,
    ImStorageUrlPipeModule,
    RouterModule.forChild([
      {
        path: '',
        component: CmProfileComponent,
      },
    ]),
  ],
})
export class CmProfileModule {}
