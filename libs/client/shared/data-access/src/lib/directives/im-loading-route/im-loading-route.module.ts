import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ImLoadingRouteDirective, ImRouteLoaderComponent } from './im-loading-route.directive';

@NgModule({
  declarations: [ImLoadingRouteDirective, ImRouteLoaderComponent],
  imports: [CommonModule, IonicModule],
  exports: [ImLoadingRouteDirective],
})
export class ImLoadingRouteDirectiveModule {}
