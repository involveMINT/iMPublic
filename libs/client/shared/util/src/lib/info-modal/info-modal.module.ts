import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { InfoModalComponent } from './info-modal.component';
import { InfoModalService } from './info-modal.service';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [InfoModalComponent],
  exports: [InfoModalComponent],
  providers: [InfoModalService],
})
export class InfoModalModule {}
export { InfoModalService };
