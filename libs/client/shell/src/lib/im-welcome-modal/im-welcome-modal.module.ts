import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImBlockModule } from '@involvemint/client/shared/data-access';
import { IonicModule } from '@ionic/angular';
import { ImWelcomeModalComponent } from './im-welcome-modal.component';
import { ImWelcomeModalService } from './im-welcome-modal.service';

@NgModule({
  imports: [CommonModule, IonicModule, ImBlockModule, FormsModule, ReactiveFormsModule],
  declarations: [ImWelcomeModalComponent],
  providers: [ImWelcomeModalService],
})
export class ImWelcomeModalModule {}
