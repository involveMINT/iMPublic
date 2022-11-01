import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImBlockModule } from '@involvemint/client/shared/data-access';
import { IonicModule } from '@ionic/angular';
import { EnrollmentsModalComponent } from './enrollments-modal.component';
import { EnrollmentsModalService } from './enrollments-modal.service';

@NgModule({
  declarations: [EnrollmentsModalComponent],
  imports: [CommonModule, IonicModule, ImBlockModule],
  providers: [EnrollmentsModalService],
})
export class EnrollmentsModalModule {}
