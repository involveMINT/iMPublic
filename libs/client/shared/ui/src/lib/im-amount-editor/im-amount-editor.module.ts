import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {
  ImAmountEditorColor,
  ImAmountEditorComponent,
  ImAmountEditorModalInput,
} from './im-amount-editor.component';

@NgModule({
  declarations: [ImAmountEditorComponent],
  imports: [CommonModule, IonicModule],
  exports: [ImAmountEditorComponent],
})
export class ImAmountEditorModule {}
export { ImAmountEditorColor, ImAmountEditorModalInput };
