import { Injectable } from "@angular/core";
import { StatusService } from "@involvemint/client/shared/util";
import { ActivityPostQuery } from "@involvemint/shared/domain";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as PostsActions from './moderation.actions';
import { map } from 'rxjs/operators';
import { fetch } from "@nrwl/angular";
import { ActivityPostOrchestration } from "@involvemint/client/shared/data-access";

@Injectable()
export class PostEffects {

    /** Effect when loadPosts is dispatched */
    readonly loadPosts$ = createEffect(() => 
        this.actions$.pipe(
            ofType(PostsActions.loadPosts),
            fetch({
                run: ({ page }) =>
                    this.posts.list({
                        ...ActivityPostQuery
                    }).pipe(
                        map((posts) => PostsActions.loadPostsSuccess({ posts: posts, page: page}))
                        ),
                onError: (action, { error }) => {
                    this.status.presentNgRxActionAlert(action, error);
                    return PostsActions.loadPostsError({ error });
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
