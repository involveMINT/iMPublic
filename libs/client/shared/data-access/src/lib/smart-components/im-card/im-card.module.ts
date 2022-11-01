import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImStorageUrlPipeModule } from '../../pipes';
import { ImCardComponent } from './im-card.component';

@NgModule({
  declarations: [ImCardComponent],
  imports: [CommonModule, ImStorageUrlPipeModule],
  exports: [ImCardComponent],
})
export class ImCardModule {}
