import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ImCodeItemComponent } from './im-code-item.component';

@NgModule({
  declarations: [ImCodeItemComponent],
  imports: [CommonModule, IonicModule],
  exports: [ImCodeItemComponent],
})
export class ImCodeItemModule {}
