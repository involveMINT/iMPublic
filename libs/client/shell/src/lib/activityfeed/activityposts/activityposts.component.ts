import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import {
  ChangeMakerFacade,
  EnrollmentsModalService,
  PoiCmStoreModel,
} from '@involvemint/client/cm/data-access';
import { UserFacade, PostStoreModel, UserStoreModel, CommentService } from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { calculatePoiStatus, calculatePoiTimeWorked, PoiStatus } from '@involvemint/shared/domain';
import { parseDate } from '@involvemint/shared/util';
import { compareDesc } from 'date-fns';
import { merge } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { IonSlides } from '@ionic/angular';
import { Store } from '@ngrx/store';


interface State {
  posts: Array<PostStoreModel & { status: PoiStatus; timeWorked: string; }>;
  loaded: boolean;
}

@Component({
  selector: 'involvemint-activityposts',
  templateUrl: './activityposts.component.html',
  styleUrls: ['./activityposts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoisComponent extends StatefulComponent<State> implements OnInit {

  get PoiStatus() {
    return PoiStatus;
  }

  constructor(
    private readonly cf: ChangeMakerFacade,
    private readonly route: RouteService,
    private readonly enrollmentsModal: EnrollmentsModalService,
    private readonly user: UserFacade,
    private readonly commentService: CommentService
    
  ) {
    super({ posts: [], loaded: false });
  }

  ngOnInit(): void {
    this.user.posts.dispatchers.create({
      poiId: '7e7b3ee3-b9fe-4f76-aa67-06a62f03300b',
    })
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

  // viewEnrollment(enrollment: PoiCmStoreModel['enrollment']) {
  //   this.route.to.cf.enrollments.ENROLLMENT(enrollment.id);
  // }

  calculatePoiStatus(poi: PoiCmStoreModel) {
    return calculatePoiStatus(poi);
  }

  loadMore(event: Event) {
    this.cf.poi.dispatchers.loadMore();
    merge(this.cf.poi.actionListeners.loadPois.success, this.cf.poi.actionListeners.loadPois.error)
      .pipe(take(1))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .subscribe(() => (event.target as any).complete());
  }

  like(id: string) {
    console.log(id);
    this.user.posts.dispatchers.like({
      postId: id,
    })
  }

  unlike(id: string) {
    console.log(id);
    this.user.posts.dispatchers.unlike({
      postId: id,
    })
  }

  checkUserLiked(post: PostStoreModel) {
    // const currUser: UserStoreModel = 
    // this.user.session.dispatchers.getUserData();
    let userId = ""
    console.log(this.user.session.selectors.email$.subscribe(s => userId = s));
    console.log(userId);
    const filteredObj = post.likes.filter(obj => obj.user.id === userId);
    return filteredObj.length != 0
  }
  comments(id: string) {
    return this.commentService.goToComments(id);
  }

}
