import { ActivityPost, ActivityPostQuery } from "@involvemint/shared/domain";
import { EntityState, createEntityAdapter } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { IParser } from "@orcha/common";
import * as ModerationActions from './moderation.actions';

export const MODERATION_FEATURE_KEY = 'adminModeration';

export type PostStoreModel = IParser<ActivityPost, typeof ActivityPostQuery>;

export interface PostsState {
  posts: EntityState<PostStoreModel>;
  pagesLoaded: number;
}

export const postsAdapter = createEntityAdapter<PostStoreModel>();

export const initialState: PostsState = {
  posts: postsAdapter.getInitialState(),
  pagesLoaded: 0,
};

export const PostsReducer = createReducer(
  initialState,
  on(
    ModerationActions.loadPostsSuccess,
    (state, { posts, page }): PostsState => {
        return {
            posts: postsAdapter.upsertMany(posts, state.posts),
            pagesLoaded: page,
        }
    }
  ),
);
