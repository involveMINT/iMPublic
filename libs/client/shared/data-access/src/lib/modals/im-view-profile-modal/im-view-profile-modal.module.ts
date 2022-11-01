import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImTabsModule } from '@involvemint/client/shared/ui';
import { IonicModule } from '@ionic/angular';
import { ImStorageUrlPipeModule } from '../../pipes';
import { ImCardModule } from '../../smart-components';
import { ImBlockModule } from '../../smart-components/im-block/im-block.module';
import { ImViewProfileModalComponent, viewProfileCache } from './im-view-profile-modal.component';
import { ImViewProfileModalService } from './im-view-profile-modal.service';

@NgModule({
  imports: [CommonModule, IonicModule, ImBlockModule, ImStorageUrlPipeModule, ImTabsModule, ImCardModule],
  declarations: [ImViewProfileModalComponent],
  providers: [ImViewProfileModalService],
})
export class ImViewProfileModalModule {}
export { ImViewProfileModalService, viewProfileCache };
