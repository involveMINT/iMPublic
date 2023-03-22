import { Component, Input } from '@angular/core';
import { PostStoreModel, UserFacade } from '@involvemint/client/shared/data-access';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { Handle, ViewProfileInfoQuery } from '@involvemint/shared/domain';

import { ModalController } from '@ionic/angular';
import { IParser } from '@orcha/common';

type ParsedHandle = IParser<Handle, typeof ViewProfileInfoQuery>;

interface State {
  profiles: ParsedHandle[];
}

@Component({
  selector: 'app-modal-comments',
  templateUrl: 'modal-comments.component.html',
})
export class ModalCommentComponent extends StatefulComponent<State> {
  @Input() 
  post!: PostStoreModel;
  msg!: string;
  user!: UserFacade;
  constructor(
    private modalCtrl: ModalController,
  ) { super({ profiles: [] }); }

  comment() {
    console.log('creating comment');
    this.user.comments.dispatchers.createComment({
        postId: this.post.id,
        text: this.msg,
        commentsId: '',
    });
    console.log('comment created');
    this.msg = '';
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  // inspired by chat component
  getProfilePic(handleId: string) {
    const handle = this.state.profiles.find((p) => p.id === handleId);
    return (
      handle?.changeMaker?.profilePicFilePath ||
      handle?.servePartner?.logoFilePath ||
      handle?.exchangePartner?.logoFilePath ||
      ''
    );
  }

  // inspired by chat component
  getName(handleId: string) {
    const handle = this.state.profiles.find((p) => p.id === handleId);
    return (
      `${handle?.changeMaker?.firstName || ''} ${handle?.changeMaker?.lastName || ''}` ||
      handle?.servePartner?.name ||
      handle?.exchangePartner?.name ||
      ''
    );
  }

}