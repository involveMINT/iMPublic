import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ImBlockModule } from '../../smart-components/im-block/im-block.module';
import { ImHandleModule } from '../../smart-components/im-handle/im-handle.module';
import {
  ImHandleSearchModalComponent,
  ImHandleSearchModalType,
  SearchResult,
} from './im-handle-search-modal.component';
import { ImHandleSearchModalService } from './im-handle-search-modal.service';

@NgModule({
  imports: [CommonModule, IonicModule, ImBlockModule, ImHandleModule, FormsModule, ReactiveFormsModule],
  exports: [],
  declarations: [ImHandleSearchModalComponent],
  providers: [ImHandleSearchModalService],
})
export class ImHandleSearchModalModule {}
export { ImHandleSearchModalService, ImHandleSearchModalType, SearchResult };
