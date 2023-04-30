import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ImViewProfileModalService, PostStoreModel, UserFacade } from '@involvemint/client/shared/data-access';
import { map, tap } from 'rxjs/operators';

import { AlertController, IonContent, IonButton, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CommentStoreModel } from 'libs/client/shared/data-access/src/lib/+state/comments/comments.reducer';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { compareDesc } from 'date-fns';
import { parseDate } from '@involvemint/shared/util';
import BadWords from 'bad-words';

const isAgainstCommunityGuidelinesErrorMessage = 'This comment goes against our community guidelines.';

interface State {
  comments: Array<CommentStoreModel>;
  loaded: boolean;
}

@Component({
  selector: 'app-modal-comments',
  templateUrl: 'modal-comments.component.html',
  styleUrls: ['./modal-comments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalCommentComponent extends StatefulComponent<State> implements OnInit {
  @ViewChild(IonContent)
  content!: IonContent;
  @Input() post!: PostStoreModel;
  msg!: string;
  profilePicFilePath!: string;
  name!: string;
  handleID!: string;

  constructor(
    private alertController: AlertController,
    private modalCtrl: ModalController,
    private user: UserFacade,
    private readonly viewProfileModal: ImViewProfileModalService,
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
              .sort((a, b) => 
                compareDesc(parseDate(b.dateCreated ?? new Date()), parseDate(a.dateCreated ?? new Date()))
              )
          })
        )
      )
    );

    this.msg = '';
    this.handleID = this.getHandleID();
    this.name = this.getName();
    this.profilePicFilePath = this.getProfilePic();
  }

  comment() {
    const badWords = new BadWords();
    const containsBadWord = badWords.isProfane(this.msg);
    if (!(this.msg === '') && !containsBadWord) {
      this.user.comments.dispatchers.createComment({
        postId: this.post.id,
        text: this.msg,
        commentsId: '',
        handleId: this.handleID,
        name: this.name,
        profilePicFilePath: this.profilePicFilePath
      });
      // empty the "post comment" field
      this.msg = '';
    } else if (containsBadWord){
      this.presentErrorMessage(isAgainstCommunityGuidelinesErrorMessage);
    }
    
    // give time to render comment, then scroll to bottom
    setTimeout(() => {
      this.content.scrollToBottom(1000);
    }, 1000);
  }

  viewProfile(handle: string) {
    this.viewProfileModal.open({ handle });
  }

  getHandleID() {
    const handleIDObservable: Observable<string> = this.user.session.selectors.activeProfile$.pipe(
      map(activeProfile => activeProfile.handle.id)
    )
    let handleID: string = '';
    handleIDObservable.subscribe(
      (url: string) => {
        handleID = url;
      }
    );
    return handleID;
  }

  getProfilePic() {
    const profilePicObservable: Observable<string> = this.user.session.selectors.changeMaker$.pipe(
      map(changeMaker => changeMaker?.profilePicFilePath || '')
    );
    let profilePic: string = '';
    profilePicObservable.subscribe(
      (url: string) => {
        profilePic = url;
      }
    );
    return profilePic;
    }
    
  getName() {
    const nameObservable: Observable<string> = this.user.session.selectors.changeMaker$.pipe(
      map(changeMaker => `${changeMaker?.firstName || ''} ${changeMaker?.lastName || ''}` || '')
    );
    let name: string = '';
    nameObservable.subscribe(
      (url: string) => {
        name = url;
      }
    );
    return name;
  }

  cancel() {
    return this.modalCtrl.dismiss(this.state.comments, 'cancel');
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

  checkCommentHidden(comment: CommentStoreModel) {
    let userId = "";
    this.user.session.selectors.email$.subscribe(s => userId = s);
    return comment.hidden
  }

  trackComment(index: number, comment: CommentStoreModel) {
    return comment.id;

  }
  
  async presentErrorMessage(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

}
