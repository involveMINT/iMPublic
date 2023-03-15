import { createAction, props } from '@ngrx/store';
import { OrchaOperationError } from '@orcha/common';
import { CreateActivityPostDto, LikeActivityPostDto, UnlikeActivityPostDto } from '@involvemint/shared/domain';
import { PostStoreModel } from './activity-posts.reducer';

/**
 * Actions for loading activity post
 */
export const loadPosts = createAction(
    '[Activity Posts] Activity Posts Load', 
    props<{ page: number }>()
);

export const loadPostsSuccess = createAction(
    '[Activity Posts] Activity Posts Load Success',
    props<{ posts: PostStoreModel[]; page: number }>()
);

export const loadPostsError = createAction(
    '[Activity Posts] Activity Posts Load Error',
    props<{ error: OrchaOperationError }>()
);

/**
 * Actions for creating activity post
 */
export const createPost = createAction(
    '[Activity Posts] Activity Posts Create',
    props<{ dto: CreateActivityPostDto }>() // not entirely sure which should go here...
);

export const createPostSuccess = createAction(
    '[Activity Posts] Activity Posts Create Success',
    props<{ post: PostStoreModel }>()
);

export const createPostError = createAction(
    '[Activity Posts] Activity Posts Create Error',
    props<{ error: OrchaOperationError }>()
);

export const like = createAction(
    '[Activity Posts] Like Activity Post',
    props<{ dto: LikeActivityPostDto }>()
);

export const likeSuccess = createAction(
    '[Activity Posts] Like Activity Post Sucess',
    props<{ post: PostStoreModel }>()
);

export const likeError = createAction(
    '[Activity Posts] Like Activity Post Error',
    props<{ error: OrchaOperationError }>()
);

export const unlike = createAction(
    '[Activity Posts] unlike Activity Post',
    props<{ dto: UnlikeActivityPostDto }>()
);

export const unlikeSuccess = createAction(
    '[Activity Posts] unlike Activity Post Sucess',
    props<{ post: PostStoreModel }>()
);

export const unlikeError = createAction(
    '[Activity Posts] unlike Activity Post Error',
    props<{ error: OrchaOperationError }>()
);

/**
 * Other actions for activity post + Need separate comments NgRx
 */