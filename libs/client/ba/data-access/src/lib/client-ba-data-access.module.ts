import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BusinessAdminFacade } from './business-admin.facade';

@NgModule({
  imports: [CommonModule],
  providers: [BusinessAdminFacade],
})
export class ClientBaDataAccessModule {}
