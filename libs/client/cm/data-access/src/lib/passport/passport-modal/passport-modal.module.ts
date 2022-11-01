import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImBlockModule } from '@involvemint/client/shared/data-access';
import { IonicModule } from '@ionic/angular';
import { PassportModalComponent } from './passport-modal.component';
import { PassportModalService } from './passport-modal.service';

@NgModule({
  declarations: [PassportModalComponent],
  imports: [CommonModule, IonicModule, ImBlockModule],
  providers: [PassportModalService],
})
export class PassportModalModule {}
