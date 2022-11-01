import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ImLegalModalComponent, ImLegalModalInputs } from './im-legal-modal.component';
import { ImLegalModalService } from './im-legal-modal.service';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [ImLegalModalComponent],
  providers: [ImLegalModalService],
})
export class ImLegalModalModule {}
export { ImLegalModalService, ImLegalModalInputs };
