import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  ImagesViewerModalModule,
  ImBlockModule,
  ImStorageUrlPipeModule,
} from '@involvemint/client/shared/data-access';
import { ImFormsModule, ImImageModule } from '@involvemint/client/shared/ui';
import { ConfirmDeactivationGuard } from '@involvemint/client/shared/util';
import { IonicModule } from '@ionic/angular';
import { PoiComponent } from './poi/poi.component';
import { PoisComponent } from './pois/pois.component';

@NgModule({
  declarations: [PoisComponent, PoiComponent],
  imports: [
    CommonModule,
    IonicModule,
    ImBlockModule,
    ImFormsModule,
    ReactiveFormsModule,
    ImImageModule,
    ImStorageUrlPipeModule,
    ImagesViewerModalModule,
    RouterModule.forChild([
      {
        path: '',
        component: PoisComponent,
      },
      {
        path: `:id`,
        component: PoiComponent,
        canDeactivate: [ConfirmDeactivationGuard],
      },
    ]),
  ],
})
export class PoisModule {}
