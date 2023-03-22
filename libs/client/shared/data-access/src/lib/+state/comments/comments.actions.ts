import { CreateCommentDto } from "@involvemint/shared/domain";
import { createAction, props } from "@ngrx/store";
import { OrchaOperationError } from "@orcha/common";
import { CommentStoreModel } from "./comments.reducer";

/**
 * Actions for loading comments
 */
 export const loadComments = createAction(
    '[Comments] Comments Load', 
    props<{ page: number }>()
);

export const loadCommentsSuccess = createAction(
    '[Comments] Comments Load Success',
    props<{ comments: CommentStoreModel[]; page: number }>()
);

export const loadCommentsError = createAction(
    '[Comments] Comments Load Error',
    props<{ error: OrchaOperationError }>()
);


/**
 * Actions for creating comment
 */

export const createComment = createAction(
    '[Comments] Comments Create',
    props<{ dto: CreateCommentDto }>()
);

export const createCommentSuccess = createAction(
    '[Comments] Comments Create Success',
    props<{ comment: CommentStoreModel }>()
);

export const createCommentError = createAction(
    '[Comments] Comments Create Error',
    props<{ error: OrchaOperationError }>()
);