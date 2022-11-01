import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImStorageUrlPipe } from './im-storage-url.pipe';

@NgModule({
  declarations: [ImStorageUrlPipe],
  imports: [CommonModule],
  exports: [ImStorageUrlPipe],
})
export class ImStorageUrlPipeModule {}
