import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  ImagesViewerModalModule,
  ImBlockModule,
  ImStorageUrlPipeModule,
} from '@involvemint/client/shared/data-access';
import { ImFormsModule, ImImageModule } from '@involvemint/client/shared/ui';
import { IonicModule } from '@ionic/angular';
import { PoiComponent } from './activitypost/activitypost.component';
import { PoisComponent } from './activityposts/activityposts.component';
import { ModalCommentComponent } from './activityposts/comments/modal-comments.component';

@NgModule({
  declarations: [PoisComponent, PoiComponent, ModalCommentComponent],
  imports: [
    CommonModule,
    IonicModule,
    ImBlockModule,
    ImFormsModule,
    ReactiveFormsModule,
    ImImageModule,
    ImStorageUrlPipeModule,
    ImagesViewerModalModule,
    RouterModule.forChild([
      {
        path: '',
        component: PoisComponent,
      }
    ]),
  ],
})
export class ActivityFeedModule {}
