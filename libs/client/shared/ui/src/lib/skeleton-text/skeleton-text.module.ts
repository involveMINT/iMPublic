import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SkeletonTextComponent } from './skeleton-text.component';

@NgModule({
  declarations: [SkeletonTextComponent],
  imports: [CommonModule, IonicModule],
  exports: [SkeletonTextComponent],
})
export class SkeletonTextModule {}
