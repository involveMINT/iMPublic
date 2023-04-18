import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  ChangeMakerFacade,
  EnrollmentsModalService,
  PoiCmStoreModel,
} from '@involvemint/client/cm/data-access';
import { UserFacade, PostStoreModel, ImViewProfileModalService } from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { calculatePoiStatus, calculatePoiTimeWorked, PoiStatus } from '@involvemint/shared/domain';
import { parseDate } from '@involvemint/shared/util';
import { IonButton } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ModalCommentComponent } from './comments/modal-comments.component';
import { compareDesc } from 'date-fns';
import { merge } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { CommentStoreModel } from 'libs/client/shared/data-access/src/lib/+state/comments/comments.reducer';


interface State {
  posts: Array<PostStoreModel & { status: PoiStatus; timeWorked: string; }>;
  loaded: boolean;
}

@Component({
  selector: 'involvemint-moderation',
  templateUrl: './moderation.component.html',
  styleUrls: ['./moderation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModerationComponent extends StatefulComponent<State> implements OnInit {

  get PoiStatus() {
    return PoiStatus;
  }

  constructor(
    private readonly cf: ChangeMakerFacade,
    private readonly user: UserFacade,
    private modalCtrl: ModalController,
    private readonly viewProfileModal: ImViewProfileModalService,
    
  ) {
    super({ posts: [], loaded: false });
  }

  ngOnInit(): void {

    this.effect(() => 
      this.user.posts.selectors.posts$.pipe(
        tap(({ posts, loaded }) => 
          this.updateState({
            posts: posts
              .sort((a, b) => 
                compareDesc(parseDate(a.dateCreated ?? new Date()), parseDate(b.dateCreated ?? new Date()))
              )
              .map((post) => ({
                ...post,
                status: calculatePoiStatus(post.poi),
                timeWorked: calculatePoiTimeWorked(post.poi)
              })),
            loaded: loaded
          })
        )
      )
    );

  }

  refresh() {
    this.cf.poi.dispatchers.refresh();
  }

  calculatePoiStatus(poi: PoiCmStoreModel) {
    return calculatePoiStatus(poi);
  }

  loadMore(event: Event) {
    this.cf.poi.dispatchers.loadMore();
    merge(this.cf.poi.actionListeners.loadPois.success, this.cf.poi.actionListeners.loadPois.error)
      .pipe(take(1))
      .subscribe(() => (event.target as any).complete());
  }

  like(id: string, button: IonButton) {
    button.disabled = true; // prevent click spam
    this.user.posts.dispatchers.like({
      postId: id,
    })
  }

  unlike(id: string, button: IonButton) {
    button.disabled = true; // prevent click spam
    this.user.posts.dispatchers.unlike({
      postId: id,
    })
  }

  checkUserLiked(post: PostStoreModel) {
    let userId = "";
    this.user.session.selectors.email$.subscribe(s => userId = s);
    const filteredObj = post.likes.filter(obj => obj.user.id === userId);
    return filteredObj.length != 0
  }

  trackPost(index: number, post: PostStoreModel) {
    return post.id;
  }

  /**
     * Opens the comment modal (modal-comments.component.ts) and waits.
  */
  async viewComments(post: PostStoreModel) {
    const modal = await this.modalCtrl.create({
      component: ModalCommentComponent,
      componentProps: {
        'post': post,
        'user': this.user,
     }
    });
    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.updatePostComments(post.id, data);
    }

  }

  /**
     * Updates state of comments within post given by postId (necessary for changes
     * to be saved after modal is closed)
  */
  private updatePostComments(postId: string, updatedComments: Array<CommentStoreModel>) {
    this.updateState((state => {
      const updatedPosts = state.posts.map((post) => {
        if (post.id === postId) {
          return { ...post, comments: updatedComments };
        }
        return post;
      });
      return { ...state, posts: updatedPosts };
    })(this.state));
  }

  getUserAvatar(post: PostStoreModel) {
    return post.user.changeMaker?.profilePicFilePath
  }

  getUserFirstName(post: PostStoreModel) {
    return post.user.changeMaker?.firstName
  }

  getUserLastName(post: PostStoreModel) {
    return post.user.changeMaker?.lastName
}

  // Convert user handle to string in order to pass into profile viewer
  getUserHandle(post: PostStoreModel) {
    if (post.user.changeMaker?.handle.id != undefined) {
      return post.user.changeMaker?.handle.id
    } else {
      return ""
    }
  }

  viewProfile(handle: string) {
    this.viewProfileModal.open({ handle });
  }

}
