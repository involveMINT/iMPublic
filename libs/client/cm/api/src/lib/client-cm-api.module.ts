import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClientCmDataAccessModule, EnrollmentStoreModel } from '@involvemint/client/cm/data-access';
import { ClientCmApiService } from './client-cm-api.service';

@NgModule({
  imports: [CommonModule, ClientCmDataAccessModule],
  providers: [ClientCmApiService],
})
export class ClientCmApiModule {}
export { ClientCmApiService, EnrollmentStoreModel };
