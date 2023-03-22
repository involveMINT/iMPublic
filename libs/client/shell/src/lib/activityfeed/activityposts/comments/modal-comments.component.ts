import { Component, Input } from '@angular/core';
import { PostStoreModel, UserFacade } from '@involvemint/client/shared/data-access';

import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-comments',
  templateUrl: 'modal-comments.component.html',
})
export class ModalCommentComponent {
  @Input() post!: PostStoreModel;
  msg!: string;
  user!: UserFacade;
  constructor(
    private modalCtrl: ModalController,
  ) { }

  comment() {
    this.user.comments.dispatchers.createComment({
        postId: this.post.id,
        text: this.msg,
        commentsId: '',
    });
    this.msg = '';
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}