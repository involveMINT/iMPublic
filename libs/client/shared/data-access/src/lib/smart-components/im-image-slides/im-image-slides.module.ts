import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RemoveWrapperModule } from '@involvemint/client/shared/ui';
import { IonicModule } from '@ionic/angular';
import { ImStorageUrlPipeModule } from '../../pipes';
import { ImImageSlidesComponent, ImImagesSlidesImageClicked } from './im-image-slides.component';

@NgModule({
  declarations: [ImImageSlidesComponent],
  imports: [CommonModule, IonicModule, RemoveWrapperModule, ImStorageUrlPipeModule],
  exports: [ImImageSlidesComponent],
})
export class ImImageSlidesModule {}
export { ImImagesSlidesImageClicked };
