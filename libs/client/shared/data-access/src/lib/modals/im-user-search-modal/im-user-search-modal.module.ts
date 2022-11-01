import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ImHandleModule } from '../../smart-components';
import { ImBlockModule } from '../../smart-components/im-block/im-block.module';
import { ImUserSearchModalComponent, UserSearchResult } from './im-user-search-modal.component';
import { ImUserSearchModalService } from './im-user-search-modal.service';

@NgModule({
  imports: [CommonModule, IonicModule, ImBlockModule, ImHandleModule, FormsModule, ReactiveFormsModule],
  exports: [],
  declarations: [ImUserSearchModalComponent],
  providers: [ImUserSearchModalService],
})
export class ImUserSearchModalModule {}
export { ImUserSearchModalService, UserSearchResult };
