
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PostsState, postsAdapter, POSTS_KEY } from './activity-posts.reducer';

const { selectAll, selectEntities } = postsAdapter.getSelectors();
const getPostsState = createFeatureSelector<PostsState>(POSTS_KEY);

export const getPosts = createSelector(getPostsState, (state: PostsState) => ({
    posts: selectAll(state.posts),
    pagesLoaded: state.pagesLoaded,
    loaded: state.pagesLoaded > 0,
    limit: state.limit,
    allPagesLoaded: state.allPagesLoaded,
}));

export const selectPost = (id: string) => 
    createSelector(getPostsState, (state: PostsState) => ({
        post: selectEntities(state.posts)[id],
        pagesLoaded: state.pagesLoaded,
        loaded: state.pagesLoaded > 0,
        limit: state.limit,
        allPagesLoaded: state.allPagesLoaded,
    }));
