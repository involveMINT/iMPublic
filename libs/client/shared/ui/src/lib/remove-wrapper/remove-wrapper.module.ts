import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RemoveWrapperDirective } from './remove-wrapper.directive';

@NgModule({
  declarations: [RemoveWrapperDirective],
  imports: [CommonModule],
  exports: [RemoveWrapperDirective],
})
export class RemoveWrapperModule {}
