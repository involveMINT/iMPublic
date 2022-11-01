import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ImagesViewerModalModule } from '../../modals/im-images-viewer-modal/im-images-viewer-modal.module';
import { ImStorageUrlPipeModule } from '../../pipes';
import { ImBlockComponent } from './im-block.component';

@NgModule({
  imports: [CommonModule, IonicModule, ImagesViewerModalModule, ImStorageUrlPipeModule],
  exports: [ImBlockComponent],
  declarations: [ImBlockComponent],
})
export class ImBlockModule {}
