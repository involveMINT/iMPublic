import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import {
  ChangeMakerFacade,
  EnrollmentsModalService,
} from '@involvemint/client/cm/data-access';
import { UserFacade, PostStoreModel, CommentService, ActivityPostOrchestration } from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { StatefulComponent, StatusService } from '@involvemint/client/shared/util';
import { ActivityPostQuery, PoiStatus } from '@involvemint/shared/domain';
import { parseDate } from '@involvemint/shared/util';
import { IonButton, IonInfiniteScroll } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ModalCommentComponent } from './comments/modal-comments.component';
import { compareDesc } from 'date-fns';
import { merge } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { ModalDigestComponent, CLOSED } from './modal-digest/modal-digest.component';


interface State {
  posts: Array<PostStoreModel>;
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
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;
  loading = false;
  event: any = null;
  allPagesLoaded = false;

  get PoiStatus() {
    return PoiStatus;
  }

  constructor(
    private readonly cf: ChangeMakerFacade,
    private readonly route: RouteService,
    private readonly enrollmentsModal: EnrollmentsModalService,
    private readonly user: UserFacade,
    private readonly commentService: CommentService,
    private modalCtrl: ModalController,
    private readonly post: ActivityPostOrchestration,
    private readonly status: StatusService,
  ) {
    super({ posts: [], digestPosts: [], loaded: false });
  }

  ngOnInit(): void {

    this.effect(() => 
      this.user.posts.selectors.posts$.pipe(
        tap(({ posts, loaded, allPagesLoaded }) => {
          this.completeLoad(allPagesLoaded);
          this.updateState({
            posts: posts
              .sort((a, b) => 
                compareDesc(parseDate(a.dateCreated ?? new Date()), parseDate(b.dateCreated ?? new Date()))
              )
              .map((post) => ({
                ...post
              })),
            loaded: loaded
          });
        })
      )
    );
    
    /**
     * Register a new effect which loads the notifications for a user in the background.
     * Add values to the state.
     */
    this.user.session.selectors.state$.subscribe(
      session => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const lastLoggedIn = session.dateLastLoggedIn ? new Date(session.dateLastLoggedIn) : weekAgo;
        const startDate = (lastLoggedIn > weekAgo ? lastLoggedIn : weekAgo).toISOString();
        this.post.digest(ActivityPostQuery, { startDate }).subscribe(
          posts => {
            this.updateState({
              digestPosts: posts
            })
          }
        )
      }
    )

  }

  async openDigestModal() {
    const modal = await this.modalCtrl.create({
      component: ModalDigestComponent,
      componentProps: {
        'digestPosts': this.state.digestPosts
      }
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (role === CLOSED) {
      this.updateState({
        digestPosts: data
      });
    }

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

  completeLoad(allPagesLoaded: boolean): void {
    this.allPagesLoaded = allPagesLoaded;
    if (this.loading && this.event) {
      this.event.target.complete();
      this.loading = false;
    }
    if (this.infiniteScroll) {
      this.infiniteScroll.disabled = allPagesLoaded;
    }
  }

  loadMore(event: Event) {
    if (!this.allPagesLoaded) {
      this.user.posts.dispatchers.loadPosts();
      this.loading = true;
      this.event = event;
    }
  }

  trackPost(_index: number, post: PostStoreModel) {
    return post.id;
  }
  
}
