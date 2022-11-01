import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ImInfoPopUpDirective } from './im-info-pop-up.directive';

@NgModule({
  imports: [CommonModule, IonicModule, OverlayModule],
  declarations: [ImInfoPopUpDirective],
  exports: [ImInfoPopUpDirective],
})
export class ImInfoPopUpModule {}
