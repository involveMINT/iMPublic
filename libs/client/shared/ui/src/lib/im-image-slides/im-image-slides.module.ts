import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RemoveWrapperModule } from '../remove-wrapper/remove-wrapper.module';
import { ImImageSlidesComponent, ImImagesSlidesImageClicked } from './im-image-slides.component';

@NgModule({
  declarations: [ImImageSlidesComponent],
  imports: [CommonModule, IonicModule, RemoveWrapperModule],
  exports: [ImImageSlidesComponent],
})
export class ImImageSlidesModule {}
export { ImImagesSlidesImageClicked };
