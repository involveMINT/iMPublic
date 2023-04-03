import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PostsState, postsAdapter, MODERATION_FEATURE_KEY } from './moderation.reducer';

const { selectAll, selectEntities } = postsAdapter.getSelectors();
const getPostsState = createFeatureSelector<PostsState>(MODERATION_FEATURE_KEY);

export const getPosts = createSelector(getPostsState, (state: PostsState) => ({
    posts: selectAll(state.posts),
    pagesLoaded: state.pagesLoaded,
    loaded: state.pagesLoaded > 0,
}));

export const getPost = (id: string) => 
    createSelector(getPostsState, (state: PostsState) => ({
        post: selectEntities(state.posts)[id],
        pagesLoaded: state.pagesLoaded,
        loaded: state.pagesLoaded > 0,
    }));
