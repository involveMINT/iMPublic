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
import { ActivityFeedComponent } from './activityposts/activityposts.component';
import { ModalDigestComponent } from './activityposts/modal-digest/modal-digest.component';
import { PostComponent } from './activityposts/post/post.component';
import { ModalPostComponent } from './activityposts/modal-post/modal-post.component';

@NgModule({
  declarations: [PostComponent, ActivityFeedComponent, ModalDigestComponent, ModalPostComponent],
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
        component: ActivityFeedComponent,
      }
    ]),
  ],
})
export class ActivityFeedModule {}
