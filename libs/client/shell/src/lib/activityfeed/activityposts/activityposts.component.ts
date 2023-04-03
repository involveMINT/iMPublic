import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  ChangeMakerFacade,
  EnrollmentsModalService,
  PoiCmStoreModel,
} from '@involvemint/client/cm/data-access';
import { UserFacade, PostStoreModel, CommentService, ActivityPostOrchestration } from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { StatefulComponent, StatusService } from '@involvemint/client/shared/util';
import { ActivityPostQuery, calculatePoiStatus, calculatePoiTimeWorked, PoiStatus } from '@involvemint/shared/domain';
import { parseDate } from '@involvemint/shared/util';
import { IonButton, ModalController } from '@ionic/angular';
import { compareDesc } from 'date-fns';
import { merge } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { OPEN, ModalDigestComponent } from './digest/modal-digest.component';


interface State {
  posts: Array<PostStoreModel & { status: PoiStatus; timeWorked: string; }>;
  digestPosts: Array<PostStoreModel>;
  loaded: boolean;
}

@Component({
  selector: 'involvemint-activityposts',
  templateUrl: './activityposts.component.html',
  styleUrls: ['./activityposts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityFeedComponent extends StatefulComponent<State> implements OnInit {

  get PoiStatus() {
    return PoiStatus;
  }

  constructor(
    private readonly cf: ChangeMakerFacade,
    private readonly route: RouteService,
    private readonly enrollmentsModal: EnrollmentsModalService,
    private readonly user: UserFacade,
    private readonly commentService: CommentService,
    private modalDigestCtrl: ModalController,
    private readonly post: ActivityPostOrchestration,
    private readonly status: StatusService,
  ) {
    super({ posts: [], digestPosts: [], loaded: false });
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
    
    /**
     * Register a new effect which loads the notifications for a user in the background.
     * Add values to the state.
     * This tests if it will work at all.
     */
    this.user.session.selectors.state$.subscribe(
      session => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const lastLoggedIn = session.dateLastLoggedIn ? new Date(session.dateLastLoggedIn) : weekAgo;
        const startDate = (lastLoggedIn > weekAgo ? lastLoggedIn : weekAgo).toISOString();
        this.post.digest(ActivityPostQuery, { startDate }).subscribe(
          posts => {
            console.log(posts);
            this.updateState({
              digestPosts: posts
            })
          }
        )
      }
    )

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

  comments(id: string) {
    return this.commentService.goToComments(id);
  }

  trackPost(_index: number, post: PostStoreModel) {
    return post.id;
  }

  async openDigestModal() {
    const modal = await this.modalDigestCtrl.create({
      component: ModalDigestComponent,
      componentProps: {
        'digestPosts': this.state.digestPosts
      }
    });
    modal.present();
    
    const { data, role } = await modal.onWillDismiss();

    if (role === OPEN) {
      /**
       * Update the feed s.t. it contains the selected post information,
       * then scroll post into view.
       */
      const index = this.state.posts.findIndex(p => p.id === data);
      if (index < 0) {
        this.user.posts.dispatchers.get({ postId: data });
      }
      this.status.showLoader('Loading...');

      setTimeout(() => {
        this.status.dismissLoader();
        document.getElementById(data)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 600);

    }

  }

}
