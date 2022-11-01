import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ImFormsModule, ImImageModule } from '@involvemint/client/shared/ui';
import { IonicModule } from '@ionic/angular';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ImagesViewerModalModule } from '../../modals';
import { ImStorageUrlPipeModule } from '../../pipes';
import { ImBlockModule } from '../../smart-components';
import { RequestComponent } from './request/request.component';
import { RequestsComponent } from './requests/requests.component';

@NgModule({
  declarations: [RequestsComponent],
  exports: [RequestsComponent],
  imports: [
    CommonModule,
    IonicModule,
    ImBlockModule,
    ImFormsModule,
    ImImageModule,
    ImagesViewerModalModule,
    ImStorageUrlPipeModule,
    CurrencyMaskModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class RequestsModule {}

@NgModule({
  declarations: [RequestComponent],
  exports: [RequestComponent],
  imports: [
    CommonModule,
    IonicModule,
    ImBlockModule,
    ImFormsModule,
    ImImageModule,
    ImagesViewerModalModule,
    ImStorageUrlPipeModule,
    CurrencyMaskModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: `:id`,
        component: RequestComponent,
      },
    ]),
  ],
})
export class RequestModule {}

@NgModule({
  imports: [
    RequestModule,
    RequestsModule,
    RouterModule.forChild([
      {
        path: ``,
        component: RequestsComponent,
      },
    ]),
  ],
})
export class RequestsCombinedModule {}
