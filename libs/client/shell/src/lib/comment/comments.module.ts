import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  ImBlockModule,
  ImHandleModule,
  ImStorageUrlPipeModule,
  ImViewProfileModalModule,
} from '@involvemint/client/shared/data-access';
import { IonicModule } from '@ionic/angular';
import { AutosizeModule } from 'ngx-autosize';
import { CommentsComponent } from './comments/comments.component';

@NgModule({
  declarations: [CommentsComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ImHandleModule,
    AutosizeModule,
    ReactiveFormsModule,
    ImBlockModule,
    ImViewProfileModalModule,
    ImStorageUrlPipeModule,
    RouterModule.forChild([
      {
        path: '',
        component: CommentsComponent,
      },
      {
        path: ':id',
        component: CommentsComponent,
      },
    ]),
  ],
})
export class CommentsModule {}
