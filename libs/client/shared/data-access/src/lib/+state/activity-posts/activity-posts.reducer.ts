import { ActivityPost, ActivityPostQuery } from '@involvemint/shared/domain';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { IParser } from '@orcha/common';
import { createReducer, on } from '@ngrx/store';
import * as PostsActions from './activity-posts.actions';


export const POSTS_KEY = 'posts';

export type PostStoreModel = IParser<ActivityPost, typeof ActivityPostQuery>;

export interface PostsState {
    posts: EntityState<PostStoreModel>;
    pagesLoaded: number;
}

export const postsAdapter = createEntityAdapter<PostStoreModel>();

const initialState: PostsState = {
    posts: postsAdapter.getInitialState(),
    pagesLoaded: 0,
}

/** Defines the Activity Posts Reducer and how state changes based on actions */
export const PostsReducer = createReducer(
    initialState,
    on(
        PostsActions.loadPostsSuccess,
        (state, { posts, page }): PostsState => {
            return {
                posts: postsAdapter.upsertMany(posts, state.posts),
                pagesLoaded: page,
            }
        }
    ),
    on(
        PostsActions.createPostSuccess,
        (state, { post }): PostsState => {
            return {
                ...state,
                posts: postsAdapter.upsertOne(post, state.posts)
            }
        }
    ),
    on(
        PostsActions.likeSuccess,
        (state, { post }): PostsState => {
            return {
                ...state,
                posts: postsAdapter.upsertOne(post, state.posts)
            }
        }
    ),

)
