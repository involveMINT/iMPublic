import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FileDropZoneDirective } from './file-drop-zone.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [FileDropZoneDirective],
  exports: [FileDropZoneDirective],
})
export class ImFileDropZoneModule {}
