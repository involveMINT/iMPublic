import { Injectable } from "@angular/core";
import { StatusService } from "@involvemint/client/shared/util";
import { ActivityPostQuery } from "@involvemint/shared/domain";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as PostsActions from './activity-posts.actions';
import { map, delayWhen, tap } from 'rxjs/operators';
import { fetch, pessimisticUpdate } from "@nrwl/angular";
import { from } from 'rxjs';
import { ActivityPostOrchestration } from '../../orchestrations/activity-post.orchestration';

@Injectable()
export class PostEffects {

    /** Effect when loadDigest is dispatched */
    readonly loadDigest$ = createEffect(() => 
        this.actions$.pipe(
            ofType(PostsActions.loadDigest),
            fetch({
                run: ({ page }) =>
                    this.posts.list(
                        ActivityPostQuery,
                       {recent: true}).pipe(
                        map((posts) => PostsActions.loadDigestSuccess({ posts: posts, page: page}))
                        ),
                onError: (action, { error }) => {
                    this.status.presentNgRxActionAlert(action, error);
                    return PostsActions.loadDigestError({ error });
                }
            })
        )
    );


    /** Effect when loadPosts is dispatched */
    readonly loadPosts$ = createEffect(() => 
        this.actions$.pipe(
            ofType(PostsActions.loadPosts),
            fetch({
                run: ({ page }) =>
                    this.posts.list(
                        ActivityPostQuery,
                        {recent: false}).pipe(
                        map((posts) => PostsActions.loadPostsSuccess({ posts: posts, page: page}))
                        ),
                onError: (action, { error }) => {
                    this.status.presentNgRxActionAlert(action, error);
                    return PostsActions.loadPostsError({ error });
                }
            })
        )
    );

    /** Effects when createPost is dispatched */
    readonly createPost$ = createEffect(() => 
        this.actions$.pipe(
            ofType(PostsActions.createPost),
            delayWhen(() => from(this.status.showLoader('Creating...'))),
            pessimisticUpdate({
                run: ({ dto }) => 
                    this.posts.create(
                        ActivityPostQuery,
                        dto
                    ).pipe(
                        map((post) => PostsActions.createPostSuccess({ post }))
                    ),
                onError: (action, { error }) => {
                    this.status.presentNgRxActionAlert(action, error)
                    return PostsActions.createPostError({ error })
                }
            }),
            tap(() => this.status.dismissLoader())
        )
    );
    
    /** Effects when likePost is dispatched */
    readonly likePost$ = createEffect(() => 
        this.actions$.pipe(
            ofType(PostsActions.like),
            pessimisticUpdate({
                run: ({ dto }) => 
                    this.posts.like(
                        ActivityPostQuery,
                        dto
                    ).pipe(
                        map((post) => PostsActions.likeSuccess({ post }))
                    ),
                onError: (action, { error }) => {
                    this.status.presentNgRxActionAlert(action, error)
                    return PostsActions.likeError({ error })
                }
            })
        )
    );

    /** Effects when likePost is dispatched */
    readonly unlikePost$ = createEffect(() => 
    this.actions$.pipe(
        ofType(PostsActions.unlike),
        pessimisticUpdate({
            run: ({ dto }) => 
                this.posts.unlike(
                    ActivityPostQuery,
                    dto
                ).pipe(
                    map((post) => PostsActions.unlikeSuccess({ post }))
                ),
            onError: (action, { error }) => {
                this.status.presentNgRxActionAlert(action, error)
                return PostsActions.unlikeError({ error })
            }
        })
    )
);


    constructor(
        private readonly actions$: Actions,
        private readonly status: StatusService,
        private readonly posts: ActivityPostOrchestration,
    ) {}
}
