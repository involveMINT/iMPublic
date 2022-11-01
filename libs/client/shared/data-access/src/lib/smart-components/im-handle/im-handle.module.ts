import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ImViewProfileModalModule } from '../../modals/im-view-profile-modal/im-view-profile-modal.module';
import { ImHandleComponent } from './im-handle.component';

@NgModule({
  imports: [CommonModule, IonicModule, ImViewProfileModalModule],
  exports: [ImHandleComponent],
  declarations: [ImHandleComponent],
})
export class ImHandleModule {}
