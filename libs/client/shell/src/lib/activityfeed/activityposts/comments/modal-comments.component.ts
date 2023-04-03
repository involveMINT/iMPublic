import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { postsAdapter, PostStoreModel, UserFacade } from '@involvemint/client/shared/data-access';
import { map, tap } from 'rxjs/operators';

import { IonButton, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CommentStoreModel } from 'libs/client/shared/data-access/src/lib/+state/comments/comments.reducer';
import { StatefulComponent } from '@involvemint/client/shared/util';

interface State {
  comments: Array<CommentStoreModel>;
  loaded: boolean;
}

@Component({
  selector: 'app-modal-comments',
  templateUrl: 'modal-comments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalCommentComponent extends StatefulComponent<State> implements OnInit {
  @Input() post!: PostStoreModel;
  msg!: string;
  profilePic$!: Observable<string | null>;
  name$!: Observable<string>;
constructor(
  private modalCtrl: ModalController,
  private user: UserFacade
) {
  super({ comments: [], loaded: true });
}

ngOnInit() {

  this.user.comments.dispatchers.initComments(this.post.comments);
  this.effect(() => 
    this.user.comments.selectors.comments$.pipe(
      tap(({ comments }) => 
        this.updateState({
          comments: comments
        }))
    )
  );

  this.profilePic$ = this.user.session.selectors.changeMaker$.pipe(
    map(changeMaker => changeMaker?.profilePicFilePath || null)
  );

  this.name$ = this.user.session.selectors.changeMaker$.pipe(
    map(changeMaker => `${changeMaker?.firstName || ''} ${changeMaker?.lastName || ''}` || '')
  );
}

  comment() {
    this.user.comments.dispatchers.createComment({
        postId: this.post.id,
        text: this.msg,
        commentsId: '',
    });
    this.msg = '';
  }

  getProfilePic(): Observable<string> {
    return this.user.session.selectors.changeMaker$.pipe(
      map(changeMaker => changeMaker?.profilePicFilePath || '')
    );
  }
  
  getName(): Observable<string> {
    return this.user.session.selectors.changeMaker$.pipe(
      map(changeMaker => `${changeMaker?.firstName || ''} ${changeMaker?.lastName || ''}` || '')
    );
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  flag(id: string, button: IonButton) {
    button.disabled = true;
    this.user.comments.dispatchers.flagComment({
      commentId: id,
    })
  }

  unflag(id: string, button: IonButton) {
    button.disabled = true;
    this.user.comments.dispatchers.unflagComment({
      commentId: id,
    })
  }

  checkUserFlagged(comment: CommentStoreModel) {
    let userId = "";
    this.user.session.selectors.email$.subscribe(s => userId = s);
    const filteredObj = comment.flags.filter(obj => obj.user.id === userId);
    return filteredObj.length != 0
  }

  trackComment(index: number, comment: CommentStoreModel) {
    return comment.id;
  }

}
