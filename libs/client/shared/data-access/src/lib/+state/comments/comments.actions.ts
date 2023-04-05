import { CreateCommentDto, FlagCommentDto, HideCommentDto, UnflagCommentDto, UnhideCommentDto } from "@involvemint/shared/domain";
import { createAction, props } from "@ngrx/store";
import { OrchaOperationError } from "@orcha/common";
import { CommentStoreModel } from "./comments.reducer";

export const HIDE_COMMENT = '[Comment] Hide Comment';
export const HIDE_COMMENT_SUCCESS = '[Comment] Hide Comment Success';
export const HIDE_COMMENT_ERROR = '[Comment] Hide Comment Error';

export const UNHIDE_COMMENT = '[Comment] Unhide Comment';
export const UNHIDE_COMMENT_SUCCESS = '[Comment] Unhide Comment Success';
export const UNHIDE_COMMENT_ERROR = '[Comment] Unhide Comment Error';

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

/**
 * Action to load comment modal with comments from a post
 */
export const initComments = createAction(
    '[Comments] Comments Init',
    props<{ comments: CommentStoreModel[] }>()
);

/**
 * Actions for flagging a comment
 */

export const flagComment = createAction(
    '[Comments] Flag Comment',
    props<{ dto: FlagCommentDto }>()
);

export const flagCommentSuccess = createAction(
    '[Comments] Flag Comment Success',
    props<{ comment: CommentStoreModel }>()
);

export const flagCommentError = createAction(
    '[Comments] Flag Comment Error',
    props<{ error: OrchaOperationError }>()
);

export const unflagComment = createAction(
    '[Comments] Unflag Comment',
    props<{ dto: UnflagCommentDto }>()
);

export const unflagCommentSuccess = createAction(
    '[Comments] Unflag Comment Success',
    props<{ comment: CommentStoreModel }>()
);

export const unflagCommentError = createAction(
    '[Comments] Unflag Comment Error',
    props<{ error: OrchaOperationError }>()
);

/**
 * Actions for hiding a comment
 */

 export const hideComment = createAction(
    HIDE_COMMENT,
    props<{ dto: HideCommentDto }>()
);

export const hideCommentSuccess = createAction(
    HIDE_COMMENT_SUCCESS,
    props<{ comment: CommentStoreModel }>()
);

export const hideCommentError = createAction(
    HIDE_COMMENT_ERROR,
    props<{ error: OrchaOperationError }>()
);

/**
 * Actions for unhiding a comment
 */

 export const unhideComment = createAction(
    UNHIDE_COMMENT,
    props<{ dto: UnhideCommentDto }>()
);

export const unhideCommentSuccess = createAction(
    UNHIDE_COMMENT_SUCCESS,
    props<{ comment: CommentStoreModel }>()
);

export const unhideCommentError = createAction(
    UNHIDE_COMMENT_ERROR,
    props<{ error: OrchaOperationError }>()
);