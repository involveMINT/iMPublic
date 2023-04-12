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
    limit: number;
    allPagesLoaded: boolean;
}

export const postsAdapter = createEntityAdapter<PostStoreModel>();

export const initialState: PostsState = {
    posts: postsAdapter.getInitialState(),
    pagesLoaded: 0,
    limit: 10,
    allPagesLoaded: false,
}

/** Defines the Activity Posts Reducer and how state changes based on actions */
export const PostsReducer = createReducer(
    initialState,
    on(
        PostsActions.loadPostsSuccess,
        (state, { posts, page, limit }): PostsState => {
            return {
                ...state,
                posts: postsAdapter.upsertMany(posts, state.posts),
                pagesLoaded: page,
                allPagesLoaded: (posts.length % limit !== 0) || (posts.length === 0),
            }
        }
    ),
    on(
        PostsActions.getPostSuccess,
        (state, { post }): PostsState => {
            return {
                ...state,
                posts: postsAdapter.upsertOne(post, state.posts)
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
    on(
        PostsActions.unlikeSuccess,
        (state, { post }): PostsState => {
            return {
                ...state,
                posts: postsAdapter.upsertOne(post, state.posts)
            }
        }
    ),

)
