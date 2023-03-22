import { Injectable } from "@angular/core";
import { StatusService } from "@involvemint/client/shared/util";
import { ActivityPostQuery } from "@involvemint/shared/domain";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as CommentsActions from './comments.actions';
import { map, delayWhen, tap } from 'rxjs/operators';
import { fetch, pessimisticUpdate } from "@nrwl/angular";
import { from } from 'rxjs';
import { CommentOrchestration } from "../../orchestrations/comment.orchestration";
import { CommentQuery } from "libs/shared/domain/src/lib/domain/comment/comment.queries";

@Injectable()
export class CommentEffects {

    /** Effect when loadComments is dispatched */
    readonly loadComments$ = createEffect(() => 
        this.actions$.pipe(
            ofType(CommentsActions.loadComments),
            fetch({
                run: ({ page }) =>
                    this.comments.list({
                        ...CommentQuery
                    }).pipe(
                        map((comments) => CommentsActions.loadCommentsSuccess({ comments: comments, page: page}))
                        ),
                onError: (action, { error }) => {
                    this.status.presentNgRxActionAlert(action, error);
                    return CommentsActions.loadCommentsError({ error });
                }
            })
        )
    );

    /** Effects when createComment is dispatched */
    readonly createComment$ = createEffect(() => 
        this.actions$.pipe(
            ofType(CommentsActions.createComment),
            delayWhen(() => from(this.status.showLoader('Creating...'))),
            pessimisticUpdate({
                run: ({ dto }) => 
                    this.comments.create(
                        CommentQuery,
                        dto
                    ).pipe(
                        map((comment) => CommentsActions.createCommentSuccess({ comment }))
                    ),
                onError: (action, { error }) => {
                    this.status.presentNgRxActionAlert(action, error)
                    return CommentsActions.createCommentError({ error })
                }
            }),
            tap(() => this.status.dismissLoader())
        )
    );

    constructor(
        private readonly actions$: Actions,
        private readonly status: StatusService,
        private readonly comments: CommentOrchestration,
    ) {}
}
