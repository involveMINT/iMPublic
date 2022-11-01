import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ImInfoPopUpModule } from '../im-info-pop-up/im-info-pop-up.module';
import { ImCheckboxComponent } from './im-checkbox/im-checkbox.component';
import { ImErrorComponent } from './im-error/im-error.component';
import { ImItemComponent } from './im-item/im-item.component';
import { PhoneMaskDirective } from './phone-mask/phone-mask.directive';

const COMPONENTS = [ImItemComponent, ImErrorComponent, ImCheckboxComponent];

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule, ImInfoPopUpModule],
  declarations: [...COMPONENTS, PhoneMaskDirective],
  exports: [...COMPONENTS, PhoneMaskDirective],
})
export class ImFormsModule {}
export { ImCheckBoxCheckEvent } from './im-checkbox/im-checkbox.component';
