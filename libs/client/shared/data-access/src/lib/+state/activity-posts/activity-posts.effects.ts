import { Injectable } from "@angular/core";
import { StatusService } from "@involvemint/client/shared/util";
import { ActivityFeedQuery, ActivityPostQuery } from "@involvemint/shared/domain";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as PostsActions from './activity-posts.actions';
import { map, delayWhen, tap } from 'rxjs/operators';
import { fetch, pessimisticUpdate } from "@nrwl/angular";
import { from } from 'rxjs';
import { ActivityPostOrchestration } from '../../orchestrations/activity-post.orchestration';

@Injectable()
export class PostEffects {

    /** Effect when loadPosts is dispatched */
    readonly loadPosts$ = createEffect(() => 
        this.actions$.pipe(
            ofType(PostsActions.loadPosts),
            fetch({
                run: ({ page, limit }) =>
                    this.posts.list(
                    {
                        ...ActivityFeedQuery,
                        __paginate: {
                            ...ActivityFeedQuery.__paginate,
                            page,
                            limit,
                        }
                    }
                    ).pipe(
                        map((posts) => PostsActions.loadPostsSuccess({ posts: posts.items, page, limit}))
                    ),
                onError: (action, { error }) => {
                    this.status.presentNgRxActionAlert(action, error);
                    return PostsActions.loadPostsError({ error });
                }
            })
        )
    );

    /** Effects when getPost is dispatched */
    readonly getPost$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PostsActions.getPost),
            fetch({
                run: ({ dto }) =>
                    this.posts.get(
                        ActivityPostQuery,
                        dto
                    ).pipe(
                        map((post) => PostsActions.getPostSuccess({ post }))
                    ),
                onError: (action, { error }) => {
                    this.status.presentNgRxActionAlert(action, error);
                    return PostsActions.getPostError({ error })
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

    /** Effects when unlikePost is dispatched */
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
