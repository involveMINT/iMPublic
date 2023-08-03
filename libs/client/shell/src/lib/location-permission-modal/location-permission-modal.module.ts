import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImBlockModule } from '@involvemint/client/shared/data-access';
import { IonicModule } from '@ionic/angular';
import { LocationPermissionModalComponent } from './location-permission-modal.component';
import { LocationPermissionModalService } from './location-permission-modal.service';

@NgModule({
  imports: [CommonModule, IonicModule, ImBlockModule, FormsModule, ReactiveFormsModule],
  declarations: [LocationPermissionModalComponent],
  providers: [LocationPermissionModalService],
})
export class LocationPermissionModalModule {}
