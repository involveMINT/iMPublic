import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ImImageComponent } from './im-image.component';

@NgModule({
  declarations: [ImImageComponent],
  imports: [CommonModule, IonicModule],
  exports: [ImImageComponent],
})
export class ImImageModule {}
