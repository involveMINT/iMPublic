import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ImPopoverComponent, ImPopoverInput, ImPopoverOutput } from './im-popover.component';

@NgModule({
  declarations: [ImPopoverComponent],
  imports: [CommonModule, IonicModule],
  exports: [ImPopoverComponent],
})
export class ImPopoverModule {}
export { ImPopoverComponent, ImPopoverInput, ImPopoverOutput };
