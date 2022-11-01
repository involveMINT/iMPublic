import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { ImProgressComponent } from './im-progress.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [ImProgressComponent],
  exports: [ImProgressComponent],
})
export class ImProgressModule {}
