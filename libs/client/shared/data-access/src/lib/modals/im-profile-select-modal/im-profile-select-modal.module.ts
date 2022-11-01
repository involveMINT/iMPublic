import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ImHandleModule } from '../../smart-components';
import { ImBlockModule } from '../../smart-components/im-block/im-block.module';
import { ImProfileSelectModalComponent } from './im-profile-select-modal.component';
import { ImProfileSelectModalService } from './im-profile-select-modal.service';

@NgModule({
  imports: [CommonModule, IonicModule, ImBlockModule, ImHandleModule],
  exports: [],
  declarations: [ImProfileSelectModalComponent],
  providers: [ImProfileSelectModalService],
})
export class ImProfileSelectModalModule {}
