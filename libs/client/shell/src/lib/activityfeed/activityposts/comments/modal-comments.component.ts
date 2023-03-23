import { Component, Input, OnInit } from '@angular/core';
import { PostStoreModel, UserFacade } from '@involvemint/client/shared/data-access';
import { map } from 'rxjs/operators';

import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-modal-comments',
  templateUrl: 'modal-comments.component.html',
})
export class ModalCommentComponent implements OnInit {
  @Input() post!: PostStoreModel;
  msg!: string;
  user!: UserFacade;
  profilePic$!: Observable<string | null>;
  name$!: Observable<string>;
constructor(
  private modalCtrl: ModalController,
  private userFacade: UserFacade
) {
  this.user = userFacade;
}

ngOnInit() {
  this.profilePic$ = this.user.session.selectors.changeMaker$.pipe(
    map(changeMaker => changeMaker?.profilePicFilePath || null)
  );

  this.name$ = this.user.session.selectors.changeMaker$.pipe(
    map(changeMaker => `${changeMaker?.firstName || ''} ${changeMaker?.lastName || ''}` || '')
  );

  // In Progress - Need to figure out how to show new comments as they are created
  
  // // Subscribe to the comments$ observable to get the initial comments list
  // this.user.comments.selectors.comments$.subscribe(comments => {
  //   this.post.comments = comments;
  // });

  // // Subscribe to the comments$ observable to get new comments as they are created
  // this.user.comments.selectors.comments$.subscribe(newComment => {
  //   // Push the new comment to the comments list of the post
  //   this.post.comments.push(newComment);
  // });
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

}
