import { createAction, props } from '@ngrx/store';
import { OrchaOperationError } from '@orcha/common';
import { PostStoreModel } from './moderation.reducer';

/**
 * Constant Type Values
 */
export const LOAD_POSTS_MODERATION =  '[Activity Posts] Activity Posts Load for Moderation';
export const LOAD_POSTS_MODERATION_SUCCESS = '[Activity Posts] Activity Posts Load for Moderation Success';
export const LOAD_POSTS_MODERATION_ERROR = '[Activity Posts] Activity Posts Load for Moderation Error';

/**
 * Actions for loading activity post
 */
export const loadPosts = createAction(
    LOAD_POSTS_MODERATION,
    props<{ page: number }>()
);

export const loadPostsSuccess = createAction(
    LOAD_POSTS_MODERATION_SUCCESS,
    props<{ posts: PostStoreModel[]; page: number }>()
);

export const loadPostsError = createAction(
    LOAD_POSTS_MODERATION_ERROR,
    props<{ error: OrchaOperationError }>()
);