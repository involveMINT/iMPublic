import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ImInitLoaderComponent } from './im-init-loader.component';
import { ImInitLoaderService } from './im-init-loader.service';

@NgModule({
  imports: [CommonModule, IonicModule, OverlayModule],
  declarations: [ImInitLoaderComponent],
  providers: [ImInitLoaderService],
})
export class ImInitLoaderModule {}
export { ImInitLoaderService };
