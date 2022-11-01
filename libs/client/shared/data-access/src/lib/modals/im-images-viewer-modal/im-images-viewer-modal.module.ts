import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ImStorageUrlPipeModule } from '../../pipes';
import { ImImagesViewerModalComponent } from './im-images-viewer-modal.component';
import { ImImagesViewerModalService } from './im-images-viewer-modal.service';

@NgModule({
  imports: [CommonModule, IonicModule, ImStorageUrlPipeModule],
  declarations: [ImImagesViewerModalComponent],
  providers: [ImImagesViewerModalService],
})
export class ImagesViewerModalModule {}
export { ImImagesViewerModalService };
