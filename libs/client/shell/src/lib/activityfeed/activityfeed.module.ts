import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  ImagesViewerModalModule,
  ImBlockModule,
  ImStorageUrlPipeModule,
} from '@involvemint/client/shared/data-access';
import { ImFormsModule, ImImageModule } from '@involvemint/client/shared/ui';
import { IonicModule } from '@ionic/angular';
import { ModalCommentComponent } from './activityposts/comments/modal-comments.component';
import { ActivityFeedComponent } from './activityposts/activityposts.component';

@NgModule({
  declarations: [ActivityFeedComponent, ModalCommentComponent],
  imports: [
    CommonModule,
    FormsModule,
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
        component: ActivityFeedComponent,
      }
    ]),
  ],
})
export class ActivityFeedModule {}
